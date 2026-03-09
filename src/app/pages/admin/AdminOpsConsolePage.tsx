import { useMemo, useState } from "react";
import { AlertTriangle, Loader2, Search } from "lucide-react";
import { Badge, StatusBadge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField, DetailTabs } from "../../components/admin/AdminDetailPanel";
import {
  useOpsQueuesQuery,
  useOpsRowsQuery,
  useOpsBulkAssignServiceRequestsMutation,
  useOpsBulkScheduleServiceRequestsMutation,
  useOpsBulkStatusServiceRequestsMutation,
  useStaffQuery,
} from "../../hooks/admin/useAdminQueries";
import { adminApi } from "../../lib/api/admin";

type OpsRow = {
  id: number;
  requestNo: string;
  name: string;
  phone: string;
  serviceTitle: string;
  preferredDate: string | null;
  region: string | null;
  status: string;
  staffId: number | null;
  priority: string;
  scheduledStart: string | null;
};

type StaffItem = {
  id: number;
  name: string;
  roleType: string;
};

function statusLabel(value: string) {
  if (value === "received") return "접수";
  if (value === "needs_info") return "추가정보";
  if (value === "waiting_schedule") return "일정대기";
  if (value === "scheduled") return "일정확정";
  if (value === "in_progress") return "진행중";
  if (value === "completed") return "완료";
  if (value === "cancelled_admin" || value === "cancelled_user") return "취소";
  return value;
}

function toDateText(value: string | null | undefined) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toDateTimeInput(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function AdminOpsConsolePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [detailTab, setDetailTab] = useState("요청 정보");

  const [targetStaffId, setTargetStaffId] = useState<number | "">("");
  const [targetStatus, setTargetStatus] = useState("scheduled");
  const [reason, setReason] = useState("");
  const [scheduleStart, setScheduleStart] = useState("");
  const [scheduleEnd, setScheduleEnd] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const queuesQuery = useOpsQueuesQuery();
  const rowsQuery = useOpsRowsQuery({
    page: 1,
    pageSize: 500,
    search: search || undefined,
    status: statusFilter || undefined,
  });
  const staffQuery = useStaffQuery({ page: 1, pageSize: 200, activeOnly: true });

  const bulkAssign = useOpsBulkAssignServiceRequestsMutation();
  const bulkStatus = useOpsBulkStatusServiceRequestsMutation();
  const bulkSchedule = useOpsBulkScheduleServiceRequestsMutation();

  const rows = (rowsQuery.data ?? []) as OpsRow[];
  const staffRows = (staffQuery.data ?? []) as StaffItem[];

  const selectedRow = selectedRowId == null ? null : rows.find((row) => row.id === selectedRowId) ?? null;

  const staffNameById = useMemo(() => {
    const map = new Map<number, string>();
    staffRows.forEach((row) => map.set(row.id, `${row.name} (${row.roleType})`));
    return map;
  }, [staffRows]);

  const queueCards = useMemo(() => {
    const q = queuesQuery.data || {};
    return [
      { key: "new", label: "신규/추가정보", count: Number((q as any).new || 0) },
      { key: "unassigned", label: "미배정", count: Number((q as any).unassigned || 0) },
      { key: "schedule", label: "일정 관련", count: Number((q as any).schedule || 0) },
      { key: "today", label: "오늘 일정", count: Number((q as any).today || 0) },
      { key: "delayed", label: "지연", count: Number((q as any).delayed || 0) },
    ];
  }, [queuesQuery.data]);

  const selectedCount = selectedIds.size;

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

  const doBulkAssign = async () => {
    if (selectedCount === 0 || targetStaffId === "") return;
    setSaving(true);
    setActionMessage(null);
    try {
      await bulkAssign([...selectedIds], targetStaffId);
      await Promise.all([rowsQuery.refetch(), queuesQuery.refetch()]);
      setActionMessage(`${selectedCount}건 담당자 배정 완료`);
      setSelectedIds(new Set());
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : "일괄 배정 실패");
    } finally {
      setSaving(false);
    }
  };

  const doBulkStatus = async () => {
    if (selectedCount === 0) return;
    setSaving(true);
    setActionMessage(null);
    try {
      await bulkStatus([...selectedIds], targetStatus, reason || undefined);
      await Promise.all([rowsQuery.refetch(), queuesQuery.refetch()]);
      setActionMessage(`${selectedCount}건 상태 변경 완료`);
      setSelectedIds(new Set());
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : "일괄 상태 변경 실패");
    } finally {
      setSaving(false);
    }
  };

  const doBulkSchedule = async () => {
    if (selectedCount === 0 || !scheduleStart || !scheduleEnd) {
      setActionMessage("일괄 일정 확정에 필요한 값이 부족합니다.");
      return;
    }
    setSaving(true);
    setActionMessage(null);
    try {
      await bulkSchedule([...selectedIds], {
        startAt: new Date(scheduleStart).toISOString(),
        endAt: new Date(scheduleEnd).toISOString(),
        staffId: targetStaffId === "" ? undefined : targetStaffId,
      });
      await Promise.all([rowsQuery.refetch(), queuesQuery.refetch()]);
      setActionMessage(`${selectedCount}건 일정 확정 완료`);
      setSelectedIds(new Set());
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : "일괄 일정 확정 실패");
    } finally {
      setSaving(false);
    }
  };

  const saveSingle = async () => {
    if (!selectedRow) return;
    setSaving(true);
    setActionMessage(null);
    try {
      if (targetStaffId !== "") {
        await adminApi.assignServiceRequest(selectedRow.id, targetStaffId);
      }
      await adminApi.updateServiceRequestStatus(selectedRow.id, targetStatus, reason || undefined);
      if (scheduleStart && scheduleEnd) {
        await adminApi.scheduleServiceRequest(selectedRow.id, {
          startAt: new Date(scheduleStart).toISOString(),
          endAt: new Date(scheduleEnd).toISOString(),
          staffId: targetStaffId === "" ? undefined : targetStaffId,
          locationSummary: selectedRow.region || undefined,
        });
      }
      await Promise.all([rowsQuery.refetch(), queuesQuery.refetch()]);
      setActionMessage("요청 처리 내용을 저장했습니다.");
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : "요청 저장 실패");
    } finally {
      setSaving(false);
    }
  };

  const onOpenDetail = (row: OpsRow) => {
    setSelectedRowId(row.id);
    setDetailTab("요청 정보");
    setTargetStaffId(row.staffId ?? "");
    setTargetStatus(row.status);
    setReason("");
    setScheduleStart(toDateTimeInput(row.scheduledStart));
    setScheduleEnd("");
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg text-[#111827]" style={{ fontWeight: 700 }}>운영 콘솔</h1>
        <p className="text-xs text-gray-400 mt-0.5">고밀도 큐 처리: 조회 → 배정 → 상태/일정 처리</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {queueCards.map((card) => (
          <div key={card.key} className="bg-white rounded-xl px-3 py-3 border border-gray-100">
            <p className="text-xs text-gray-500">{card.label}</p>
            <p className="text-xl text-[#111827] mt-1" style={{ fontWeight: 700 }}>{card.count}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-3 shadow-sm flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="요청번호, 이름, 지역, 서비스 검색..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
        >
          <option value="">상태 전체</option>
          <option value="received">접수</option>
          <option value="needs_info">추가정보</option>
          <option value="waiting_schedule">일정대기</option>
          <option value="scheduled">일정확정</option>
          <option value="in_progress">진행중</option>
          <option value="completed">완료</option>
        </select>

        <span className="text-xs text-gray-500">{rows.length}건</span>
      </div>

      {selectedCount > 0 && (
        <div className="bg-[#1F6B78] rounded-xl px-4 py-2 text-white text-xs flex flex-wrap items-center gap-2">
          <span style={{ fontWeight: 700 }}>{selectedCount}건 선택</span>
          <select
            value={targetStaffId}
            onChange={(e) => setTargetStaffId(e.target.value ? Number(e.target.value) : "")}
            className="px-2 py-1 rounded bg-white text-[#111827]"
          >
            <option value="">담당자 선택</option>
            {staffRows.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}
          </select>
          <button onClick={() => void doBulkAssign()} className="px-2 py-1 rounded bg-white/20 hover:bg-white/30">일괄 배정</button>
          <button onClick={() => void doBulkStatus()} className="px-2 py-1 rounded bg-white/20 hover:bg-white/30">일괄 상태</button>
          <button onClick={() => void doBulkSchedule()} className="px-2 py-1 rounded bg-white/20 hover:bg-white/30">일괄 일정</button>
          <button onClick={() => setSelectedIds(new Set())} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20">해제</button>
        </div>
      )}

      {actionMessage && (
        <div className="rounded-lg border border-[#1F6B78]/20 bg-[#1F6B78]/5 px-3 py-2 text-sm text-[#1F6B78]">
          {actionMessage}
        </div>
      )}

      {rowsQuery.loading && <div className="bg-white rounded-xl p-8 text-sm text-gray-500">운영 큐를 불러오는 중...</div>}
      {!rowsQuery.loading && rowsQuery.error && <div className="bg-white rounded-xl p-8 text-sm text-red-500">{rowsQuery.error}</div>}

      {!rowsQuery.loading && !rowsQuery.error && (
        <div className="flex gap-4">
          <div className={`flex-1 min-w-0 ${selectedRow ? "hidden xl:block" : ""}`}>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F8F9FA]">
                    <tr>
                      <th className="w-10 p-3">
                        <input
                          type="checkbox"
                          checked={rows.length > 0 && selectedCount === rows.length}
                          onChange={(e) => {
                            if (!e.target.checked) setSelectedIds(new Set());
                            else setSelectedIds(new Set(rows.map((row) => row.id)));
                          }}
                          className="accent-[#1F6B78]"
                        />
                      </th>
                      <th className="px-3 py-3 text-left text-xs text-gray-400">요청</th>
                      <th className="px-3 py-3 text-left text-xs text-gray-400">서비스</th>
                      <th className="px-3 py-3 text-left text-xs text-gray-400 hidden lg:table-cell">희망일</th>
                      <th className="px-3 py-3 text-left text-xs text-gray-400 hidden lg:table-cell">지역</th>
                      <th className="px-3 py-3 text-left text-xs text-gray-400">상태</th>
                      <th className="px-3 py-3 text-left text-xs text-gray-400 hidden xl:table-cell">담당자</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => onOpenDetail(row)}
                        className={`border-t border-gray-50 cursor-pointer ${selectedRowId === row.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FA]/50"}`}
                      >
                        <td className="w-10 p-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(row.id)}
                            onChange={() => toggleSelect(row.id)}
                            className="accent-[#1F6B78]"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <p className="text-[#111827]" style={{ fontWeight: 600 }}>{row.name}</p>
                          <p className="text-xs text-gray-400">{row.requestNo} · {row.phone}</p>
                        </td>
                        <td className="px-3 py-3 text-gray-600">{row.serviceTitle}</td>
                        <td className="px-3 py-3 text-gray-500 hidden lg:table-cell">{toDateText(row.preferredDate)}</td>
                        <td className="px-3 py-3 text-gray-500 hidden lg:table-cell">{row.region || "-"}</td>
                        <td className="px-3 py-3">
                          <StatusBadge status={statusLabel(row.status)} />
                          {row.priority === "urgent" && (
                            <Badge variant="accent" className="ml-1"><AlertTriangle size={11} /> 긴급</Badge>
                          )}
                        </td>
                        <td className="px-3 py-3 text-gray-500 hidden xl:table-cell">{row.staffId ? staffNameById.get(row.staffId) || `#${row.staffId}` : "미배정"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {selectedRow && (
            <AdminDetailPanel title="운영 처리" onClose={() => setSelectedRowId(null)}>
              <div className="space-y-2">
                <p className="text-[#111827]" style={{ fontWeight: 700 }}>{selectedRow.name}</p>
                <p className="text-xs text-gray-400">{selectedRow.requestNo} · {selectedRow.serviceTitle}</p>
              </div>

              <DetailTabs
                tabs={["요청 정보", "처리"]}
                active={detailTab}
                onChange={setDetailTab}
              />

              {detailTab === "요청 정보" && (
                <div className="space-y-3">
                  <DetailField label="연락처">
                    <p className="text-sm text-gray-600">{selectedRow.phone}</p>
                  </DetailField>
                  <DetailField label="지역">
                    <p className="text-sm text-gray-600">{selectedRow.region || "-"}</p>
                  </DetailField>
                  <DetailField label="현재 일정">
                    <p className="text-sm text-gray-600">{toDateText(selectedRow.scheduledStart)}</p>
                  </DetailField>
                </div>
              )}

              {detailTab === "처리" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">담당자</label>
                    <select
                      value={targetStaffId}
                      onChange={(e) => setTargetStaffId(e.target.value ? Number(e.target.value) : "")}
                      className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
                    >
                      <option value="">미배정</option>
                      {staffRows.map((row) => <option key={row.id} value={row.id}>{row.name} ({row.roleType})</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">상태</label>
                    <select
                      value={targetStatus}
                      onChange={(e) => setTargetStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
                    >
                      <option value="received">접수</option>
                      <option value="needs_info">추가정보</option>
                      <option value="waiting_schedule">일정대기</option>
                      <option value="scheduled">일정확정</option>
                      <option value="in_progress">진행중</option>
                      <option value="completed">완료</option>
                      <option value="cancelled_admin">취소(관리)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">사유</label>
                    <input
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
                      placeholder="필요 시 입력"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">일정 시작</label>
                      <input
                        type="datetime-local"
                        value={scheduleStart}
                        onChange={(e) => setScheduleStart(e.target.value)}
                        className="w-full px-2 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">일정 종료</label>
                      <input
                        type="datetime-local"
                        value={scheduleEnd}
                        onChange={(e) => setScheduleEnd(e.target.value)}
                        className="w-full px-2 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-xs"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => void saveSingle()}
                    disabled={saving}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#1F6B78] text-white text-sm disabled:opacity-60"
                    style={{ fontWeight: 600 }}
                  >
                    {saving ? <span className="inline-flex items-center gap-1.5"><Loader2 size={14} className="animate-spin" /> 저장 중...</span> : "처리 저장"}
                  </button>
                </div>
              )}
            </AdminDetailPanel>
          )}
        </div>
      )}
    </div>
  );
}
