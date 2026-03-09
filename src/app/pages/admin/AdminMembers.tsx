import { useEffect, useMemo, useState } from "react";
import { Phone, ChevronRight, Loader2 } from "lucide-react";
import { StatusBadge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField, DetailTabs } from "../../components/admin/AdminDetailPanel";
import {
  useAdminMembersQuery,
  useUpdateMemberStatusMutation,
} from "../../hooks/admin/useAdminQueries";
import { adminApi } from "../../lib/api/admin";

type MemberItem = {
  id: number;
  memberNo: string;
  name: string;
  phone: string;
  region: string | null;
  status: string;
  shareBalance: number;
  joinedAt: string | null;
  createdAt: string;
};

type MemberDetail = {
  id: number;
  memberNo: string;
  name: string;
  phone: string;
  region: string | null;
  status: string;
  shareBalance: number;
  memoSummary?: string | null;
  statusHistory: Array<{
    id: number;
    fromStatus: string | null;
    toStatus: string;
    reason?: string | null;
    createdAt: string;
  }>;
  notes: Array<{
    id: number;
    body: string;
    isPrivate: boolean;
    createdAt: string;
  }>;
};

const STATUS_LABELS: Record<string, string> = {
  active: "가입완료",
  dormant: "휴면",
  withdrawal_pending: "탈퇴대기",
  withdrawn: "탈퇴",
  blacklisted: "블랙리스트",
};

const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: "", label: "전체" },
  { value: "active", label: "가입완료" },
  { value: "dormant", label: "휴면" },
  { value: "withdrawal_pending", label: "탈퇴대기" },
  { value: "withdrawn", label: "탈퇴" },
  { value: "blacklisted", label: "블랙리스트" },
];

function statusLabel(status: string) {
  return STATUS_LABELS[status] ?? status;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("ko-KR");
}

export function AdminMembers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailTab, setDetailTab] = useState("개요");
  const [detail, setDetail] = useState<MemberDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [nextStatus, setNextStatus] = useState("");
  const [statusReason, setStatusReason] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const {
    data,
    loading,
    error,
    refetch,
  } = useAdminMembersQuery({
    page: 1,
    pageSize: 100,
    search: search || undefined,
    status: statusFilter || undefined,
    region: areaFilter || undefined,
  });

  const updateMemberStatus = useUpdateMemberStatusMutation();
  const members = (data ?? []) as MemberItem[];

  const areas = useMemo(() => {
    const uniq = Array.from(new Set(members.map((m) => m.region).filter(Boolean))) as string[];
    return ["", ...uniq];
  }, [members]);

  async function loadDetail(memberId: number) {
    setDetailLoading(true);
    setDetailError(null);
    try {
      const res = await adminApi.memberDetail(memberId);
      const payload = res.data as MemberDetail;
      setDetail(payload);
      setNextStatus(payload.status);
    } catch (e) {
      setDetail(null);
      setDetailError(e instanceof Error ? e.message : "상세 정보를 불러오지 못했습니다.");
    } finally {
      setDetailLoading(false);
    }
  }

  useEffect(() => {
    if (selectedId == null) {
      setDetail(null);
      setDetailError(null);
      setActionMessage(null);
      return;
    }
    void loadDetail(selectedId);
  }, [selectedId]);

  const selectedRow = selectedId == null ? null : members.find((m) => m.id === selectedId) ?? null;
  const panelMember = detail ?? selectedRow;

  async function handleSaveStatus() {
    if (!selectedId || !nextStatus) return;
    setSavingStatus(true);
    setActionMessage(null);
    try {
      await updateMemberStatus(selectedId, nextStatus, statusReason || undefined);
      await Promise.all([loadDetail(selectedId), refetch()]);
      setStatusReason("");
      setActionMessage("상태가 변경되었습니다.");
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : "상태 변경에 실패했습니다.");
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleAddNote() {
    if (!selectedId || !noteBody.trim()) return;
    setSavingNote(true);
    setActionMessage(null);
    try {
      await adminApi.addMemberNote(selectedId, noteBody.trim(), true);
      setNoteBody("");
      await loadDetail(selectedId);
      setActionMessage("내부 메모를 저장했습니다.");
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : "메모 저장에 실패했습니다.");
    } finally {
      setSavingNote(false);
    }
  }

  return (
    <div className="flex gap-6 h-full">
      <div className={`flex-1 min-w-0 ${panelMember ? "hidden xl:block" : ""}`}>
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
            <div className="relative flex-1 lg:w-64">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="이름, 조합원번호, 연락처..."
                className="w-full pl-4 pr-4 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s.value || "all"}
                  onClick={() => setStatusFilter(s.value)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                    statusFilter === s.value ? "bg-[#1F6B78] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                  style={{ fontWeight: statusFilter === s.value ? 600 : 400 }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 ml-auto">
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-600"
              >
                <option value="">지역 전체</option>
                {areas.filter(Boolean).map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F9FA]">
                <tr>
                  <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>조합원</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 hidden md:table-cell" style={{ fontWeight: 600 }}>연락처</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 hidden lg:table-cell" style={{ fontWeight: 600 }}>지역</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>상태</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 hidden lg:table-cell" style={{ fontWeight: 600 }}>가입일</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 hidden xl:table-cell" style={{ fontWeight: 600 }}>출자금</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">조합원 목록을 불러오는 중...</td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-red-500 text-sm">{error}</td>
                  </tr>
                )}
                {!loading && !error && members.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">조건에 맞는 조합원이 없습니다.</td>
                  </tr>
                )}
                {!loading && !error && members.map((m) => (
                  <tr
                    key={m.id}
                    onClick={() => {
                      setSelectedId(m.id);
                      setDetailTab("개요");
                    }}
                    className={`border-t border-gray-50 cursor-pointer transition-colors ${
                      selectedId === m.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FA]/50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1F6B78]/10 flex items-center justify-center text-xs text-[#1F6B78] shrink-0" style={{ fontWeight: 600 }}>
                          {m.name[0]}
                        </div>
                        <div>
                          <p className="text-[#111827]" style={{ fontWeight: 500 }}>{m.name}</p>
                          <p className="text-xs text-gray-400">{m.memberNo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{m.phone}</td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{m.region || "-"}</td>
                    <td className="px-4 py-3"><StatusBadge status={statusLabel(m.status)} /></td>
                    <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{formatDate(m.joinedAt)}</td>
                    <td className="px-4 py-3 text-gray-500 hidden xl:table-cell">{Number(m.shareBalance || 0).toLocaleString()}원</td>
                    <td className="px-4 py-3">
                      <ChevronRight size={14} className="text-gray-300" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            현재 페이지 {members.length}명
          </div>
        </div>
      </div>

      {panelMember && (
        <AdminDetailPanel title="조합원 상세" onClose={() => setSelectedId(null)}>
          {detailLoading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 size={14} className="animate-spin" /> 상세 정보를 불러오는 중...
            </div>
          )}

          {!detailLoading && detailError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {detailError}
            </div>
          )}

          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-[#1F6B78]/10 flex items-center justify-center text-lg text-[#1F6B78]" style={{ fontWeight: 700 }}>
              {panelMember.name[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base text-[#111827]" style={{ fontWeight: 700 }}>{panelMember.name}</span>
                <StatusBadge status={statusLabel(panelMember.status)} />
              </div>
              <p className="text-xs text-gray-400">{panelMember.memberNo}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href={`tel:${panelMember.phone.replace(/[^0-9+]/g, "")}`}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer"
              style={{ fontWeight: 600 }}
            >
              <Phone size={13} /> 전화 걸기
            </a>
          </div>

          <DetailTabs tabs={["개요", "히스토리", "내부 메모"]} active={detailTab} onChange={setDetailTab} />

          {detailTab === "개요" && (
            <div className="space-y-4">
              <DetailField label="연락처">
                <p className="text-sm text-[#374151]">{panelMember.phone}</p>
              </DetailField>
              <DetailField label="지역">
                <p className="text-sm text-[#374151]">{panelMember.region || "-"}</p>
              </DetailField>
              <DetailField label="출자금 잔액">
                <p className="text-sm text-[#374151]">{Number(panelMember.shareBalance || 0).toLocaleString()}원</p>
              </DetailField>
              <DetailField label="상태 변경">
                <select
                  value={nextStatus}
                  onChange={(e) => setNextStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
                >
                  {STATUS_FILTERS.filter((s) => s.value !== "").map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </DetailField>
              <DetailField label="변경 사유 (선택)">
                <input
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="예: 장기 미이용으로 휴면 전환"
                  className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
                />
              </DetailField>
              <button
                onClick={() => void handleSaveStatus()}
                disabled={savingStatus || !nextStatus}
                className="w-full px-4 py-2.5 rounded-lg bg-[#1F6B78] text-white text-sm cursor-pointer disabled:opacity-60"
                style={{ fontWeight: 600 }}
              >
                {savingStatus ? "저장 중..." : "상태 저장"}
              </button>
            </div>
          )}

          {detailTab === "히스토리" && (
            <div className="space-y-3">
              {detail?.statusHistory && detail.statusHistory.length > 0 ? detail.statusHistory.map((h) => (
                <div key={h.id} className="rounded-lg border border-gray-100 bg-[#F8F9FA] px-3 py-2">
                  <p className="text-sm text-[#374151]" style={{ fontWeight: 500 }}>
                    {h.fromStatus ? `${statusLabel(h.fromStatus)} → ` : ""}
                    {statusLabel(h.toStatus)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(h.createdAt)} {h.reason ? `· ${h.reason}` : ""}</p>
                </div>
              )) : (
                <p className="text-sm text-gray-400">변경 이력이 없습니다.</p>
              )}
            </div>
          )}

          {detailTab === "내부 메모" && (
            <div className="space-y-3">
              {detail?.notes && detail.notes.length > 0 ? detail.notes.map((note) => (
                <div key={note.id} className="rounded-lg border border-gray-100 bg-[#F8F9FA] px-3 py-2">
                  <p className="text-sm text-[#374151] whitespace-pre-wrap">{note.body}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(note.createdAt)}</p>
                </div>
              )) : (
                <p className="text-sm text-gray-400">등록된 메모가 없습니다.</p>
              )}

              <textarea
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
                rows={4}
                placeholder="내부 메모를 입력하세요 (고객에게 노출되지 않음)"
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm resize-none"
              />
              <button
                onClick={() => void handleAddNote()}
                disabled={savingNote || !noteBody.trim()}
                className="w-full px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-sm cursor-pointer disabled:opacity-60"
                style={{ fontWeight: 600 }}
              >
                {savingNote ? "저장 중..." : "메모 저장"}
              </button>
            </div>
          )}

          {actionMessage && (
            <div className="rounded-lg bg-[#F8F9FA] px-3 py-2 text-sm text-[#374151]">
              {actionMessage}
            </div>
          )}
        </AdminDetailPanel>
      )}
    </div>
  );
}
