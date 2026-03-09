import { useMemo, useState } from "react";
import { Ban, Loader2, Search, UserMinus, UserX } from "lucide-react";
import { Badge, StatusBadge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField } from "../../components/admin/AdminDetailPanel";
import { AdminModal } from "../../components/admin/AdminModal";
import {
  useAdminMembersQuery,
  useUpdateMemberStatusMutation,
} from "../../hooks/admin/useAdminQueries";

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

type TabKey = "blacklist" | "withdrawal";
type TargetStatus = "blacklisted" | "withdrawal_pending" | "withdrawn";

const STATUS_LABELS: Record<string, string> = {
  active: "가입완료",
  dormant: "휴면",
  withdrawal_pending: "탈퇴대기",
  withdrawn: "탈퇴",
  blacklisted: "블랙리스트",
};

function statusLabel(status: string) {
  return STATUS_LABELS[status] ?? status;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("ko-KR");
}

const TARGET_OPTIONS: Array<{ value: TargetStatus; label: string }> = [
  { value: "blacklisted", label: "블랙리스트 지정" },
  { value: "withdrawal_pending", label: "탈퇴대기 지정" },
  { value: "withdrawn", label: "탈퇴 완료 처리" },
];

export function AdminBlacklistPage() {
  const [tab, setTab] = useState<TabKey>("blacklist");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [registerOpen, setRegisterOpen] = useState(false);
  const [candidateSearch, setCandidateSearch] = useState("");
  const [candidateId, setCandidateId] = useState<number | null>(null);
  const [targetStatus, setTargetStatus] = useState<TargetStatus>("blacklisted");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const blacklistQuery = useAdminMembersQuery({
    page: 1,
    pageSize: 200,
    search: search || undefined,
    status: "blacklisted",
  });

  const withdrawnQuery = useAdminMembersQuery({
    page: 1,
    pageSize: 200,
    search: search || undefined,
    status: "withdrawn",
  });

  const withdrawalPendingQuery = useAdminMembersQuery({
    page: 1,
    pageSize: 200,
    search: search || undefined,
    status: "withdrawal_pending",
  });

  const candidateQuery = useAdminMembersQuery({
    page: 1,
    pageSize: 100,
    search: candidateSearch || undefined,
  });

  const updateMemberStatus = useUpdateMemberStatusMutation();

  const blacklistMembers = (blacklistQuery.data ?? []) as MemberItem[];
  const withdrawnMembers = useMemo(() => {
    const done = (withdrawnQuery.data ?? []) as MemberItem[];
    const pending = (withdrawalPendingQuery.data ?? []) as MemberItem[];
    const byId = new Map<number, MemberItem>();
    [...pending, ...done].forEach((m) => byId.set(m.id, m));
    return [...byId.values()];
  }, [withdrawnQuery.data, withdrawalPendingQuery.data]);

  const list = tab === "blacklist" ? blacklistMembers : withdrawnMembers;

  const selectedMember = selectedId == null ? null : list.find((m) => m.id === selectedId) ?? null;

  const candidates = useMemo(() => {
    const rows = (candidateQuery.data ?? []) as MemberItem[];
    return rows.filter((m) => !["blacklisted", "withdrawn"].includes(m.status));
  }, [candidateQuery.data]);

  const selectedCandidate = useMemo(
    () => candidates.find((m) => m.id === candidateId) ?? null,
    [candidates, candidateId],
  );

  const loadingList =
    tab === "blacklist"
      ? blacklistQuery.loading
      : withdrawnQuery.loading || withdrawalPendingQuery.loading;

  const listError =
    tab === "blacklist"
      ? blacklistQuery.error
      : withdrawnQuery.error || withdrawalPendingQuery.error;

  async function refetchAll() {
    await Promise.all([
      blacklistQuery.refetch(),
      withdrawnQuery.refetch(),
      withdrawalPendingQuery.refetch(),
    ]);
  }

  async function submitStatusChange(memberId: number, status: TargetStatus, reasonText?: string) {
    setSubmitting(true);
    setActionMessage(null);
    try {
      await updateMemberStatus(memberId, status, reasonText || undefined);
      await refetchAll();
      setActionMessage("상태가 업데이트되었습니다.");
      if (selectedId === memberId) {
        const stillVisible =
          status === "blacklisted" ? tab === "blacklist" : tab === "withdrawal";
        if (!stillVisible) setSelectedId(null);
      }
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : "상태 변경에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRegister() {
    if (!candidateId) return;
    await submitStatusChange(candidateId, targetStatus, reason);
    setRegisterOpen(false);
    setCandidateId(null);
    setReason("");
    setCandidateSearch("");
  }

  async function handleRelease(memberId: number) {
    setSubmitting(true);
    setActionMessage(null);
    try {
      await updateMemberStatus(memberId, "active", "블랙리스트 해제");
      await refetchAll();
      setSelectedId(null);
      setActionMessage("블랙리스트 해제가 완료되었습니다.");
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : "해제 처리에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex gap-6 h-full">
      <div className={`flex-1 min-w-0 ${selectedMember ? "hidden xl:block" : ""}`}>
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-1.5">
              <button
                onClick={() => {
                  setTab("blacklist");
                  setSelectedId(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer ${
                  tab === "blacklist"
                    ? "bg-[#1F6B78] text-white"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
                style={{ fontWeight: tab === "blacklist" ? 600 : 400 }}
              >
                블랙리스트
              </button>
              <button
                onClick={() => {
                  setTab("withdrawal");
                  setSelectedId(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer ${
                  tab === "withdrawal"
                    ? "bg-[#1F6B78] text-white"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
                style={{ fontWeight: tab === "withdrawal" ? 600 : 400 }}
              >
                탈퇴/탈퇴대기
              </button>
            </div>

            <button
              onClick={() => {
                setTargetStatus(tab === "blacklist" ? "blacklisted" : "withdrawn");
                setRegisterOpen(true);
                setActionMessage(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer flex items-center gap-1.5"
              style={{ fontWeight: 600 }}
            >
              <Ban size={13} /> 상태 지정
            </button>
          </div>

          <div className="relative max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="이름, 조합원번호, 연락처 검색..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Badge variant="accent">{tab === "blacklist" ? "블랙리스트" : "탈퇴"}</Badge>
            <span>총 {list.length}명</span>
          </div>
        </div>

        {actionMessage && (
          <div className="mb-4 rounded-lg border border-[#1F6B78]/20 bg-[#1F6B78]/5 px-3 py-2 text-sm text-[#1F6B78]">
            {actionMessage}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F9FA]">
                <tr>
                  <th className="text-left px-4 py-3 text-xs text-gray-400">조합원</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 hidden md:table-cell">연락처</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 hidden lg:table-cell">지역</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400">상태</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 hidden lg:table-cell">출자금</th>
                </tr>
              </thead>
              <tbody>
                {loadingList && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">
                      불러오는 중...
                    </td>
                  </tr>
                )}
                {!loadingList && listError && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-red-500 text-sm">
                      {listError}
                    </td>
                  </tr>
                )}
                {!loadingList && !listError && list.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">
                      표시할 데이터가 없습니다.
                    </td>
                  </tr>
                )}
                {!loadingList && !listError && list.map((m) => (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedId(m.id)}
                    className={`border-t border-gray-50 cursor-pointer ${
                      selectedId === m.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FA]/50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-[#111827]" style={{ fontWeight: 600 }}>{m.name}</p>
                        <p className="text-xs text-gray-400">{m.memberNo}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{m.phone}</td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{m.region || "-"}</td>
                    <td className="px-4 py-3"><StatusBadge status={statusLabel(m.status)} /></td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                      {Number(m.shareBalance || 0).toLocaleString()}원
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedMember && (
        <AdminDetailPanel title="상세 정보" onClose={() => setSelectedId(null)}>
          <div className="space-y-3">
            <DetailField label="이름">
              <p className="text-sm text-[#374151]">{selectedMember.name}</p>
            </DetailField>
            <DetailField label="조합원번호">
              <p className="text-sm text-[#374151]">{selectedMember.memberNo}</p>
            </DetailField>
            <DetailField label="연락처">
              <p className="text-sm text-[#374151]">{selectedMember.phone}</p>
            </DetailField>
            <DetailField label="지역">
              <p className="text-sm text-[#374151]">{selectedMember.region || "-"}</p>
            </DetailField>
            <DetailField label="가입일">
              <p className="text-sm text-[#374151]">{formatDate(selectedMember.joinedAt || selectedMember.createdAt)}</p>
            </DetailField>
            <DetailField label="현재 상태">
              <StatusBadge status={statusLabel(selectedMember.status)} size="md" />
            </DetailField>
          </div>

          <div className="space-y-2 pt-2">
            {selectedMember.status === "blacklisted" && (
              <button
                onClick={() => void handleRelease(selectedMember.id)}
                disabled={submitting}
                className="w-full px-4 py-2.5 rounded-lg border border-[#1F6B78] text-[#1F6B78] text-sm cursor-pointer hover:bg-[#1F6B78]/5 disabled:opacity-60"
                style={{ fontWeight: 600 }}
              >
                {submitting ? "처리 중..." : "블랙리스트 해제"}
              </button>
            )}

            {selectedMember.status === "withdrawal_pending" && (
              <button
                onClick={() => void submitStatusChange(selectedMember.id, "withdrawn", "탈퇴 처리 완료")}
                disabled={submitting}
                className="w-full px-4 py-2.5 rounded-lg bg-[#111827] text-white text-sm cursor-pointer disabled:opacity-60"
                style={{ fontWeight: 600 }}
              >
                {submitting ? "처리 중..." : "탈퇴 완료 처리"}
              </button>
            )}

            {selectedMember.status === "withdrawn" && (
              <div className="rounded-lg bg-[#F8F9FA] px-3 py-2 text-xs text-gray-500 flex items-center gap-1.5">
                <UserX size={13} /> 탈퇴 완료된 조합원입니다.
              </div>
            )}
          </div>
        </AdminDetailPanel>
      )}

      <AdminModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        title="상태 지정"
        size="md"
        footer={
          <>
            <button
              onClick={() => setRegisterOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 cursor-pointer"
            >
              취소
            </button>
            <button
              onClick={() => void handleRegister()}
              disabled={!candidateId || submitting}
              className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-sm cursor-pointer disabled:opacity-60"
              style={{ fontWeight: 600 }}
            >
              {submitting ? (
                <span className="flex items-center gap-1.5"><Loader2 size={14} className="animate-spin" /> 적용 중...</span>
              ) : (
                "적용"
              )}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>변경 상태</label>
            <select
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value as TargetStatus)}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
            >
              {TARGET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>대상 조합원 검색</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={candidateSearch}
                onChange={(e) => setCandidateSearch(e.target.value)}
                placeholder="이름, 조합원번호 검색..."
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
              />
            </div>
          </div>

          <div className="max-h-52 overflow-y-auto space-y-1.5">
            {candidateQuery.loading && (
              <p className="text-xs text-gray-400">검색 중...</p>
            )}
            {!candidateQuery.loading && candidates.length === 0 && (
              <p className="text-xs text-gray-400">선택 가능한 조합원이 없습니다.</p>
            )}
            {!candidateQuery.loading && candidates.map((m) => (
              <label
                key={m.id}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F8F9FA] hover:bg-[#1F6B78]/5 cursor-pointer"
              >
                <input
                  type="radio"
                  name="candidate"
                  checked={candidateId === m.id}
                  onChange={() => setCandidateId(m.id)}
                  className="accent-[#1F6B78]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#111827] truncate" style={{ fontWeight: 500 }}>
                    {m.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{m.memberNo} · {m.phone}</p>
                </div>
                <Badge variant="primaryLight">{statusLabel(m.status)}</Badge>
              </label>
            ))}
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>사유 (선택)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="예: 민원 반복으로 블랙리스트 지정"
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm resize-none"
            />
          </div>

          {selectedCandidate && (
            <div className="rounded-lg bg-[#F8F9FA] px-3 py-2 text-xs text-gray-500 flex items-center gap-1.5">
              <UserMinus size={13} />
              선택됨: {selectedCandidate.name} ({selectedCandidate.memberNo})
            </div>
          )}
        </div>
      </AdminModal>
    </div>
  );
}
