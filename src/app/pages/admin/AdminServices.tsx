import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Download,
  Loader2,
  Search,
  User,
} from "lucide-react";
import { Badge, StatusBadge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField, DetailTabs } from "../../components/admin/AdminDetailPanel";
import {
  useAssignServiceRequestMutation,
  useBulkAssignServiceRequestsMutation,
  useBulkScheduleServiceRequestsMutation,
  useBulkStatusServiceRequestsMutation,
  useScheduleServiceRequestMutation,
  useServiceRequestsQuery,
  useStaffQuery,
  useUpdateServiceRequestStatusMutation,
} from "../../hooks/admin/useAdminQueries";

const VIEW_OPTIONS = ["list", "board", "calendar"] as const;
type ViewOption = (typeof VIEW_OPTIONS)[number];

type ServiceRequestItem = {
  id: number;
  requestNo: string;
  applicantName: string;
  applicantPhone: string;
  serviceTitle: string;
  requestedDate: string | null;
  requestedTimeSlot: string | null;
  region: string | null;
  priority: string;
  status: string;
  assignedStaffId: number | null;
  scheduledStart: string | null;
  scheduledEnd: string | null;
  customerNote: string | null;
  internalNote: string | null;
  createdAt: string;
};

type StaffItem = {
  id: number;
  name: string;
  roleType: string;
};

const STATUS_OPTIONS = [
  { value: "", label: "전체" },
  { value: "received", label: "접수" },
  { value: "needs_info", label: "추가정보" },
  { value: "waiting_schedule", label: "일정대기" },
  { value: "scheduled", label: "일정확정" },
  { value: "in_progress", label: "진행중" },
  { value: "completed", label: "완료" },
  { value: "cancelled_admin", label: "취소(관리)" },
  { value: "cancelled_user", label: "취소(고객)" },
] as const;

const PRIORITY_OPTIONS = [
  { value: "", label: "우선순위 전체" },
  { value: "normal", label: "보통" },
  { value: "high", label: "높음" },
  { value: "urgent", label: "긴급" },
];

const BOARD_STATUSES = ["received", "waiting_schedule", "scheduled", "in_progress", "completed"];

function statusLabel(value: string) {
  const found = STATUS_OPTIONS.find((opt) => opt.value === value);
  return found?.label ?? value;
}

function priorityLabel(value: string) {
  if (value === "urgent") return "긴급";
  if (value === "high") return "높음";
  return "보통";
}

function toDateText(value: string | null | undefined) {
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

function toInputDateTime(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function AdminServices() {
  const [view, setView] = useState<ViewOption>("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [unassignedOnly, setUnassignedOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [detailTab, setDetailTab] = useState("요청 내용");

  const [editStatus, setEditStatus] = useState("received");
  const [editStaffId, setEditStaffId] = useState<number | "">("");
  const [editReason, setEditReason] = useState("");
  const [scheduleStart, setScheduleStart] = useState("");
  const [scheduleEnd, setScheduleEnd] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const requestQuery = useServiceRequestsQuery({
    page: 1,
    pageSize: 300,
    status: statusFilter || undefined,
    search: search || undefined,
    priority: priorityFilter || undefined,
    unassignedOnly,
  });
  const staffQuery = useStaffQuery({ page: 1, pageSize: 200, activeOnly: true });

  const assignMutation = useAssignServiceRequestMutation();
  const statusMutation = useUpdateServiceRequestStatusMutation();
  const scheduleMutation = useScheduleServiceRequestMutation();
  const bulkAssignMutation = useBulkAssignServiceRequestsMutation();
  const bulkStatusMutation = useBulkStatusServiceRequestsMutation();
  const bulkScheduleMutation = useBulkScheduleServiceRequestsMutation();

  const rows = (requestQuery.data ?? []) as ServiceRequestItem[];
  const staff = (staffQuery.data ?? []) as StaffItem[];

  const staffNameById = useMemo(() => {
    const map = new Map<number, string>();
    staff.forEach((item) => map.set(item.id, `${item.name} (${item.roleType})`));
    return map;
  }, [staff]);

  const selectedRow = selectedId == null ? null : rows.find((row) => row.id === selectedId) ?? null;

  const groupedRows = useMemo(() => {
    const map = new Map<string, ServiceRequestItem[]>();
    BOARD_STATUSES.forEach((status) => map.set(status, []));
    rows.forEach((row) => {
      if (!map.has(row.status)) map.set(row.status, []);
      map.get(row.status)?.push(row);
    });
    return map;
  }, [rows]);

  const calendarGroups = useMemo(() => {
    const map = new Map<string, ServiceRequestItem[]>();
    rows.forEach((row) => {
      const key = row.requestedDate || row.scheduledStart || "일정 미지정";
      if (!map.has(key)) map.set(key, []);
      map.get(key)?.push(row);
    });
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [rows]);

  const selectedCount = selectedIds.size;

  const refreshAll = async () => {
    await Promise.all([requestQuery.refetch(), staffQuery.refetch()]);
  };

  const selectAll = (checked: boolean) => {
    if (!checked) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(rows.map((row) => row.id)));
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onPickDetail = (row: ServiceRequestItem) => {
    setSelectedId(row.id);
    setDetailTab("요청 내용");
    setEditStatus(row.status);
    setEditStaffId(row.assignedStaffId ?? "");
    setEditReason("");
    setScheduleStart(toInputDateTime(row.scheduledStart));
    setScheduleEnd(toInputDateTime(row.scheduledEnd));
    setActionMessage(null);
  };

  const handleAssign = async (requestId: number, staffId: number) => {
    setSaving(true);
    setActionMessage(null);
    try {
      await assignMutation(requestId, staffId);
      await refreshAll();
      setActionMessage("담당자 배정을 완료했습니다.");
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : "담당자 배정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (requestId: number, status: string, reason?: string) => {
    setSaving(true);
    setActionMessage(null);
    try {
      await statusMutation(requestId, status, reason);
      await refreshAll();
      setActionMessage("상태를 변경했습니다.");
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : "상태 변경에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleSchedule = async (requestId: number) => {
    if (!scheduleStart || !scheduleEnd) {
      setActionMessage("시작/종료 시간을 입력해 주세요.");
      return;
    }
    setSaving(true);
    setActionMessage(null);
    try {
      await scheduleMutation(requestId, {
        startAt: new Date(scheduleStart).toISOString(),
        endAt: new Date(scheduleEnd).toISOString(),
        staffId: editStaffId === "" ? undefined : editStaffId,
        locationSummary: selectedRow?.region || undefined,
      });
      await refreshAll();
      setActionMessage("일정을 확정했습니다.");
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : "일정 확정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleBulkAssign = async () => {
    if (editStaffId === "" || selectedCount === 0) return;
    setSaving(true);
    setActionMessage(null);
    try {
      await bulkAssignMutation([...selectedIds], editStaffId);
      await refreshAll();
      setActionMessage(`${selectedCount}건 담당자 배정 완료`);
      setSelectedIds(new Set());
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : "일괄 배정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleBulkStatus = async (status: string) => {
    if (selectedCount === 0) return;
    setSaving(true);
    setActionMessage(null);
    try {
      await bulkStatusMutation([...selectedIds], status, editReason || undefined);
      await refreshAll();
      setActionMessage(`${selectedCount}건 상태 변경 완료`);
      setSelectedIds(new Set());
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : "일괄 상태 변경에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleBulkSchedule = async () => {
    if (!scheduleStart || !scheduleEnd || selectedCount === 0) {
      setActionMessage("일괄 일정 확정에 필요한 값이 부족합니다.");
      return;
    }
    setSaving(true);
    setActionMessage(null);
    try {
      await bulkScheduleMutation([...selectedIds], {
        startAt: new Date(scheduleStart).toISOString(),
        endAt: new Date(scheduleEnd).toISOString(),
        staffId: editStaffId === "" ? undefined : editStaffId,
      });
      await refreshAll();
      setActionMessage(`${selectedCount}건 일정 확정 완료`);
      setSelectedIds(new Set());
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : "일괄 일정 확정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = () => {
    const base = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";
    const q = new URLSearchParams();
    if (statusFilter) q.set("status", statusFilter);
    if (search) q.set("search", search);
    if (priorityFilter) q.set("priority", priorityFilter);
    if (unassignedOnly) q.set("unassigned_only", "true");
    const url = `${base}/admin/services/export${q.toString() ? `?${q.toString()}` : ""}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex gap-6 h-full">
      <div className={`flex-1 min-w-0 ${selectedRow ? "hidden xl:block" : ""}`}>
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {VIEW_OPTIONS.map((item) => (
              <button
                key={item}
                onClick={() => setView(item)}
                className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer ${
                  view === item ? "bg-[#1F6B78] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
                style={{ fontWeight: view === item ? 600 : 400 }}
              >
                {item === "list" ? "리스트" : item === "board" ? "보드" : "캘린더"}
              </button>
            ))}

            <label className="ml-auto flex items-center gap-1.5 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={unassignedOnly}
                onChange={(e) => setUnassignedOnly(e.target.checked)}
                className="accent-[#1F6B78]"
              />
              미배정만
            </label>

            <button
              onClick={exportCsv}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 cursor-pointer flex items-center gap-1"
            >
              <Download size={13} /> 엑셀(CSV)
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-2 lg:items-center">
            <div className="relative flex-1 lg:max-w-md">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="요청번호, 이름, 연락처, 지역, 서비스 검색..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedCount > 0 && (
          <div className="bg-[#1F6B78] rounded-xl px-4 py-2.5 mb-4 text-white text-xs flex items-center gap-2 flex-wrap">
            <span style={{ fontWeight: 700 }}>{selectedCount}건 선택됨</span>
            <select
              value={editStaffId}
              onChange={(e) => setEditStaffId(e.target.value ? Number(e.target.value) : "")}
              className="px-2 py-1 rounded bg-white text-[#111827]"
            >
              <option value="">담당자 선택</option>
              {staff.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <button onClick={() => void handleBulkAssign()} className="px-2 py-1 rounded bg-white/20 hover:bg-white/30">일괄 배정</button>
            <button onClick={() => void handleBulkStatus("scheduled")} className="px-2 py-1 rounded bg-white/20 hover:bg-white/30">일괄 상태(일정확정)</button>
            <button onClick={() => void handleBulkSchedule()} className="px-2 py-1 rounded bg-white/20 hover:bg-white/30">일괄 일정 확정</button>
            <button onClick={() => setSelectedIds(new Set())} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20">선택 해제</button>
          </div>
        )}

        {actionMessage && (
          <div className="mb-4 rounded-lg border border-[#1F6B78]/20 bg-[#1F6B78]/5 px-3 py-2 text-sm text-[#1F6B78]">
            {actionMessage}
          </div>
        )}

        {requestQuery.loading && (
          <div className="bg-white rounded-xl shadow-sm p-10 text-sm text-gray-500">서비스 요청 목록을 불러오는 중...</div>
        )}
        {!requestQuery.loading && requestQuery.error && (
          <div className="bg-white rounded-xl shadow-sm p-10 text-sm text-red-500">{requestQuery.error}</div>
        )}
        {!requestQuery.loading && !requestQuery.error && rows.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-10 text-sm text-gray-400">조회된 요청이 없습니다.</div>
        )}

        {!requestQuery.loading && !requestQuery.error && rows.length > 0 && view === "list" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F8F9FA]">
                  <tr>
                    <th className="w-10 p-3">
                      <input
                        type="checkbox"
                        checked={rows.length > 0 && selectedCount === rows.length}
                        onChange={(e) => selectAll(e.target.checked)}
                        className="accent-[#1F6B78]"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-gray-400">요청</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-400 hidden md:table-cell">서비스</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-400 hidden lg:table-cell">지역</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-400">상태</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-400 hidden xl:table-cell">담당자</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-400 hidden xl:table-cell">일정</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => onPickDetail(row)}
                      className={`border-t border-gray-50 cursor-pointer ${selectedId === row.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FA]/50"}`}
                    >
                      <td className="w-10 p-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(row.id)}
                          onChange={() => toggleSelect(row.id)}
                          className="accent-[#1F6B78]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {row.priority === "urgent" && <Badge variant="accent">긴급</Badge>}
                          <div>
                            <p className="text-[#111827]" style={{ fontWeight: 600 }}>{row.applicantName}</p>
                            <p className="text-xs text-gray-400">{row.requestNo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-[#374151]">{row.serviceTitle}</p>
                        <p className="text-xs text-gray-400">희망: {row.requestedTimeSlot || "-"}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{row.region || "-"}</td>
                      <td className="px-4 py-3"><StatusBadge status={statusLabel(row.status)} /></td>
                      <td className="px-4 py-3 hidden xl:table-cell text-gray-500">
                        {row.assignedStaffId ? staffNameById.get(row.assignedStaffId) || `#${row.assignedStaffId}` : "미배정"}
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell text-gray-500">{toDateText(row.scheduledStart)}</td>
                      <td className="px-4 py-3"><ChevronRight size={14} className="text-gray-300" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">총 {rows.length}건</div>
          </div>
        )}

        {!requestQuery.loading && !requestQuery.error && rows.length > 0 && view === "board" && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {BOARD_STATUSES.map((status) => {
              const colRows = groupedRows.get(status) ?? [];
              return (
                <div key={status} className="min-w-[250px] w-[250px] shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge status={statusLabel(status)} />
                    <span className="text-xs text-gray-400">{colRows.length}</span>
                  </div>
                  <div className="space-y-2">
                    {colRows.map((row) => (
                      <div
                        key={row.id}
                        onClick={() => onPickDetail(row)}
                        className="rounded-xl bg-white p-3 shadow-sm cursor-pointer hover:shadow-md"
                      >
                        <p className="text-xs text-gray-400">{row.requestNo}</p>
                        <p className="text-sm text-[#111827] mt-1" style={{ fontWeight: 700 }}>{row.applicantName}</p>
                        <p className="text-xs text-gray-500 mt-1">{row.serviceTitle}</p>
                        <p className="text-xs text-gray-400 mt-1">{row.region || "지역 미지정"}</p>
                      </div>
                    ))}
                    {colRows.length === 0 && (
                      <div className="text-xs text-gray-300 py-6 text-center">비어 있음</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!requestQuery.loading && !requestQuery.error && rows.length > 0 && view === "calendar" && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="space-y-4">
              {calendarGroups.map(([dateKey, dateRows]) => (
                <div key={dateKey} className="rounded-lg border border-gray-100">
                  <div className="px-3 py-2 border-b border-gray-100 bg-[#F8F9FA] text-sm text-[#111827]" style={{ fontWeight: 700 }}>
                    {dateKey === "일정 미지정" ? "일정 미지정" : toDateText(dateKey)}
                  </div>
                  <div className="divide-y divide-gray-50">
                    {dateRows.map((row) => (
                      <button
                        key={row.id}
                        onClick={() => onPickDetail(row)}
                        className="w-full text-left px-3 py-2 hover:bg-[#F8F9FA]"
                      >
                        <p className="text-sm text-[#111827]" style={{ fontWeight: 600 }}>{row.applicantName} · {row.serviceTitle}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {row.requestNo} · {statusLabel(row.status)} · {row.region || "지역 미지정"}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedRow && (
        <AdminDetailPanel title="서비스 요청 상세" onClose={() => setSelectedId(null)}>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={statusLabel(selectedRow.status)} size="md" />
            <Badge variant={selectedRow.priority === "urgent" ? "accent" : "neutral"}>{priorityLabel(selectedRow.priority)}</Badge>
            {!selectedRow.assignedStaffId && (
              <Badge variant="accent"><AlertTriangle size={11} /> 미배정</Badge>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><User size={14} className="text-gray-400" /><span className="text-[#111827]" style={{ fontWeight: 600 }}>{selectedRow.applicantName}</span></div>
            <div className="text-gray-500">{selectedRow.requestNo} · {selectedRow.applicantPhone}</div>
            <div className="text-gray-500">{selectedRow.serviceTitle} · {selectedRow.region || "지역 미지정"}</div>
          </div>

          <DetailTabs
            tabs={["요청 내용", "상태/배정", "일정 확정"]}
            active={detailTab}
            onChange={setDetailTab}
          />

          {detailTab === "요청 내용" && (
            <div className="space-y-3">
              <DetailField label="고객 메모">
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedRow.customerNote || "-"}</p>
              </DetailField>
              <DetailField label="내부 메모">
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedRow.internalNote || "-"}</p>
              </DetailField>
              <DetailField label="요청 접수일">
                <p className="text-sm text-gray-600">{toDateText(selectedRow.createdAt)}</p>
              </DetailField>
            </div>
          )}

          {detailTab === "상태/배정" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">상태 변경</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
                >
                  {STATUS_OPTIONS.filter((opt) => opt.value).map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">담당자 배정</label>
                <select
                  value={editStaffId}
                  onChange={(e) => setEditStaffId(e.target.value ? Number(e.target.value) : "")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
                >
                  <option value="">미배정</option>
                  {staff.map((item) => (
                    <option key={item.id} value={item.id}>{item.name} ({item.roleType})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">사유(선택)</label>
                <input
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
                  placeholder="상태 변경 사유"
                />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => void handleStatus(selectedRow.id, editStatus, editReason || undefined)}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-lg bg-[#1F6B78] text-white text-sm disabled:opacity-60"
                  style={{ fontWeight: 600 }}
                >
                  {saving ? "처리 중..." : "상태 저장"}
                </button>
                {editStaffId !== "" && (
                  <button
                    onClick={() => void handleAssign(selectedRow.id, editStaffId)}
                    disabled={saving}
                    className="px-4 py-2.5 rounded-lg border border-[#1F6B78] text-[#1F6B78] text-sm disabled:opacity-60"
                    style={{ fontWeight: 600 }}
                  >
                    담당자 배정 저장
                  </button>
                )}
              </div>
            </div>
          )}

          {detailTab === "일정 확정" && (
            <div className="space-y-3">
              <DetailField label="현재 일정">
                <p className="text-sm text-gray-600">{toDateText(selectedRow.scheduledStart)} ~ {toDateText(selectedRow.scheduledEnd)}</p>
              </DetailField>
              <div>
                <label className="block text-xs text-gray-500 mb-1">시작</label>
                <input
                  type="datetime-local"
                  value={scheduleStart}
                  onChange={(e) => setScheduleStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">종료</label>
                <input
                  type="datetime-local"
                  value={scheduleEnd}
                  onChange={(e) => setScheduleEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
                />
              </div>
              <button
                onClick={() => void handleSchedule(selectedRow.id)}
                disabled={saving}
                className="w-full px-4 py-2.5 rounded-lg bg-[#1F6B78] text-white text-sm disabled:opacity-60"
                style={{ fontWeight: 600 }}
              >
                {saving ? <span className="inline-flex items-center gap-1.5"><Loader2 size={14} className="animate-spin" /> 저장 중...</span> : <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} /> 일정 확정</span>}
              </button>
            </div>
          )}

          <div className="pt-2 border-t border-gray-100 text-xs text-gray-500">
            서비스 캘린더 및 운영 콘솔과 동일 데이터로 동기화됩니다.
          </div>
        </AdminDetailPanel>
      )}
    </div>
  );
}
