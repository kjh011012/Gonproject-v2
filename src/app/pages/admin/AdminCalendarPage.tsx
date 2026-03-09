import { Fragment, useMemo, useState } from "react";
import { CalendarDays, Download, Loader2, Plus } from "lucide-react";
import { Badge, StatusBadge } from "../../components/admin/AdminBadge";
import { AdminModal } from "../../components/admin/AdminModal";
import { useCalendarEventsQuery, useServiceRequestsQuery, useStaffQuery, useUpsertCalendarEventMutation } from "../../hooks/admin/useAdminQueries";

type CalendarView = "day" | "week" | "month" | "staff";

type CalendarEvent = {
  id: number;
  requestId: number;
  requestNo: string;
  applicantName: string;
  serviceTitle: string;
  status: string;
  staffId: number | null;
  staffName: string | null;
  region: string | null;
  startAt: string;
  endAt: string;
  locationSummary: string | null;
};

type StaffItem = {
  id: number;
  name: string;
  roleType: string;
};

type ServiceRequestItem = {
  id: number;
  requestNo: string;
  applicantName: string;
  serviceTitle: string;
  status: string;
};

function toDateTimeText(value: string | null | undefined) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toDateInput(value: Date) {
  return value.toISOString().slice(0, 10);
}

function toDateTimeInput(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function statusLabel(value: string) {
  if (value === "scheduled") return "일정확정";
  if (value === "in_progress") return "진행중";
  if (value === "completed") return "완료";
  if (value === "cancelled_admin" || value === "cancelled_user") return "취소";
  return value;
}

export function AdminCalendarPage() {
  const [view, setView] = useState<CalendarView>("week");
  const [targetDate, setTargetDate] = useState(toDateInput(new Date()));
  const [staffFilter, setStaffFilter] = useState<number | "">("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const [requestId, setRequestId] = useState<number | "">("");
  const [staffId, setStaffId] = useState<number | "">("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [locationSummary, setLocationSummary] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const eventQuery = useCalendarEventsQuery({
    view,
    targetDate,
    staffId: staffFilter === "" ? undefined : staffFilter,
  });
  const staffQuery = useStaffQuery({ page: 1, pageSize: 300, activeOnly: true });
  const requestQuery = useServiceRequestsQuery({ page: 1, pageSize: 300 });

  const upsertEvent = useUpsertCalendarEventMutation();

  const events = (eventQuery.data ?? []) as CalendarEvent[];
  const staffRows = (staffQuery.data ?? []) as StaffItem[];
  const requestRows = (requestQuery.data ?? []) as ServiceRequestItem[];

  const requestsForEditor = useMemo(
    () => requestRows.filter((row) => ["waiting_schedule", "scheduled", "in_progress"].includes(row.status)),
    [requestRows],
  );

  const groupedByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((event) => {
      const key = event.startAt?.slice(0, 10) || "미지정";
      if (!map.has(key)) map.set(key, []);
      map.get(key)?.push(event);
    });
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [events]);

  const openCreate = () => {
    setEditingEvent(null);
    setRequestId("");
    setStaffId(staffFilter);
    setStartAt("");
    setEndAt("");
    setLocationSummary("");
    setActionError(null);
    setEditorOpen(true);
  };

  const openEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    setRequestId(event.requestId);
    setStaffId(event.staffId || "");
    setStartAt(toDateTimeInput(event.startAt));
    setEndAt(toDateTimeInput(event.endAt));
    setLocationSummary(event.locationSummary || "");
    setActionError(null);
    setEditorOpen(true);
  };

  const saveEvent = async () => {
    if (requestId === "" || !startAt || !endAt) {
      setActionError("요청/시작/종료는 필수입니다.");
      return;
    }
    setSaving(true);
    setActionError(null);
    try {
      await upsertEvent(requestId, {
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
        staffId: staffId === "" ? undefined : staffId,
        locationSummary: locationSummary || undefined,
      });
      await eventQuery.refetch();
      setEditorOpen(false);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "일정 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = () => {
    const base = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";
    const q = new URLSearchParams();
    q.set("view", view);
    q.set("target_date", targetDate);
    if (staffFilter !== "") q.set("staff_id", String(staffFilter));
    window.open(`${base}/admin/calendar/export?${q.toString()}`, "_blank");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg text-[#111827]" style={{ fontWeight: 700 }}>서비스 캘린더</h1>
          <p className="text-xs text-gray-400 mt-0.5">인박스 일정 확정 데이터가 그대로 반영됩니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openCreate}
            className="px-3.5 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65] flex items-center gap-1.5"
            style={{ fontWeight: 600 }}
          >
            <Plus size={14} /> 일정 추가
          </button>
          <button
            onClick={exportCsv}
            className="px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-[#374151] cursor-pointer hover:bg-gray-50 flex items-center gap-1.5"
            style={{ fontWeight: 500 }}
          >
            <Download size={14} /> 엑셀(CSV)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-2">
        {(["day", "week", "month", "staff"] as CalendarView[]).map((item) => (
          <button
            key={item}
            onClick={() => setView(item)}
            className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer ${
              view === item ? "bg-[#1F6B78] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
            style={{ fontWeight: view === item ? 600 : 400 }}
          >
            {item === "day" ? "일" : item === "week" ? "주" : item === "month" ? "월" : "담당자별"}
          </button>
        ))}

        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
        />

        <select
          value={staffFilter}
          onChange={(e) => setStaffFilter(e.target.value ? Number(e.target.value) : "")}
          className="px-3 py-1.5 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
        >
          <option value="">담당자 전체</option>
          {staffRows.map((staff) => <option key={staff.id} value={staff.id}>{staff.name} ({staff.roleType})</option>)}
        </select>

        <div className="ml-auto text-xs text-gray-500">조회 {events.length}건</div>
      </div>

      {eventQuery.loading && <div className="bg-white rounded-xl p-8 text-sm text-gray-500">일정을 불러오는 중...</div>}
      {!eventQuery.loading && eventQuery.error && <div className="bg-white rounded-xl p-8 text-sm text-red-500">{eventQuery.error}</div>}
      {!eventQuery.loading && !eventQuery.error && events.length === 0 && (
        <div className="bg-white rounded-xl p-8 text-sm text-gray-400">조회된 일정이 없습니다.</div>
      )}

      {!eventQuery.loading && !eventQuery.error && events.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F9FA]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">일정</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">요청</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400 hidden lg:table-cell">서비스</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">담당자</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">상태</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">관리</th>
                </tr>
              </thead>
              <tbody>
                {groupedByDate.map(([dateKey, dayEvents]) => (
                  <Fragment key={dateKey}>
                    <tr key={`${dateKey}-header`} className="border-t border-gray-100 bg-[#FAFAFA]">
                      <td colSpan={6} className="px-4 py-2 text-xs text-gray-500" style={{ fontWeight: 700 }}>
                        {dateKey}
                      </td>
                    </tr>
                    {dayEvents.map((event) => (
                      <tr key={event.id} className="border-t border-gray-50 hover:bg-[#F8F9FA]/50">
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {toDateTimeText(event.startAt)} ~ {toDateTimeText(event.endAt)}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-[#111827]" style={{ fontWeight: 600 }}>{event.applicantName}</p>
                          <p className="text-xs text-gray-400">{event.requestNo}</p>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-gray-600">{event.serviceTitle}</td>
                        <td className="px-4 py-3 text-gray-600">{event.staffName || "미배정"}</td>
                        <td className="px-4 py-3"><StatusBadge status={statusLabel(event.status)} /></td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => openEdit(event)}
                            className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50"
                          >
                            수정
                          </button>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AdminModal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title={editingEvent ? "일정 수정" : "일정 추가"}
        size="md"
        footer={
          <>
            <button onClick={() => setEditorOpen(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600">취소</button>
            <button
              onClick={() => void saveEvent()}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-sm disabled:opacity-60"
              style={{ fontWeight: 600 }}
            >
              {saving ? <span className="inline-flex items-center gap-1.5"><Loader2 size={14} className="animate-spin" /> 저장 중...</span> : "저장"}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">서비스 요청 *</label>
            <select
              value={requestId}
              onChange={(e) => setRequestId(e.target.value ? Number(e.target.value) : "")}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
            >
              <option value="">선택</option>
              {requestsForEditor.map((row) => (
                <option key={row.id} value={row.id}>{row.requestNo} · {row.applicantName} · {row.serviceTitle}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">담당자</label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value ? Number(e.target.value) : "")}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
            >
              <option value="">미배정</option>
              {staffRows.map((row) => <option key={row.id} value={row.id}>{row.name} ({row.roleType})</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">시작 *</label>
            <input
              type="datetime-local"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">종료 *</label>
            <input
              type="datetime-local"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">위치 요약</label>
            <input
              value={locationSummary}
              onChange={(e) => setLocationSummary(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
              placeholder="예: 횡성읍 OO로 12"
            />
          </div>

          {actionError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{actionError}</div>
          )}

          <div className="rounded-lg bg-[#F8F9FA] px-3 py-2 text-xs text-gray-500 flex items-center gap-1.5">
            <CalendarDays size={13} /> 서비스 인박스/운영콘솔과 동일 일정 데이터로 저장됩니다.
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
