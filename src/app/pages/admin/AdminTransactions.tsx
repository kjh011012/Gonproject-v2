import { useMemo, useState } from "react";
import { Link2, Search, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { StatusBadge, Badge } from "../../components/admin/AdminBadge";
import { AdminModal } from "../../components/admin/AdminModal";
import {
  useAdminMembersQuery,
  useMatchTransactionMutation,
  useTransactionsQuery,
} from "../../hooks/admin/useAdminQueries";
import { adminApi } from "../../lib/api/admin";

type TxItem = {
  id: number;
  transactionNo: string;
  depositorName: string;
  amount: number;
  matchStatus: string;
  matchedMemberId: number | null;
  occurredAt: string;
};

type MemberItem = {
  id: number;
  memberNo: string;
  name: string;
  phone: string;
  status: string;
};

const TX_STATUS_LABELS: Record<string, string> = {
  unmatched: "미매칭",
  suggested: "자동매칭",
  matched_pending: "수동매칭",
  confirmed: "확인완료",
  refund_pending: "환급대기",
  refunded: "환급완료",
};

const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: "", label: "전체" },
  { value: "unmatched", label: "미매칭" },
  { value: "suggested", label: "자동매칭" },
  { value: "matched_pending", label: "수동매칭" },
  { value: "confirmed", label: "확인완료" },
  { value: "refund_pending", label: "환급대기" },
  { value: "refunded", label: "환급완료" },
];

function statusLabel(status: string) {
  return TX_STATUS_LABELS[status] ?? status;
}

function formatDateTime(value: string | null | undefined) {
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

export function AdminTransactions() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [unmatchedOnly, setUnmatchedOnly] = useState(false);
  const [matchModal, setMatchModal] = useState(false);
  const [matchTarget, setMatchTarget] = useState<TxItem | null>(null);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const effectiveStatus = unmatchedOnly ? "unmatched" : statusFilter;

  const { data, loading, error, refetch } = useTransactionsQuery({
    page: 1,
    pageSize: 100,
    status: effectiveStatus || undefined,
    search: search || undefined,
  });
  const matchTransaction = useMatchTransactionMutation();

  const { data: memberData, loading: memberLoading } = useAdminMembersQuery({
    page: 1,
    pageSize: 10,
    search: memberSearch || undefined,
    status: "active",
  });

  const transactions = (data ?? []) as TxItem[];
  const members = (memberData ?? []) as MemberItem[];

  const summary = useMemo(() => {
    const counts = {
      unmatched: 0,
      matched_pending: 0,
      confirmed: 0,
      refund_pending: 0,
    };
    transactions.forEach((tx) => {
      if (tx.matchStatus === "unmatched") counts.unmatched += 1;
      if (tx.matchStatus === "matched_pending") counts.matched_pending += 1;
      if (tx.matchStatus === "confirmed") counts.confirmed += 1;
      if (tx.matchStatus === "refund_pending") counts.refund_pending += 1;
    });
    return counts;
  }, [transactions]);

  async function handleConfirm(txId: number) {
    setSubmitting(true);
    setActionError(null);
    try {
      await adminApi.confirmTransaction(txId);
      await refetch();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "확정 처리에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleManualMatch() {
    if (!matchTarget || !selectedMemberId) return;
    setSubmitting(true);
    setActionError(null);
    try {
      await matchTransaction(matchTarget.id, selectedMemberId);
      setMatchModal(false);
      setMatchTarget(null);
      setSelectedMemberId(null);
      await refetch();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "수동 매칭에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4 max-w-[1200px]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Badge variant="accent">미매칭</Badge>
            <span className="text-2xl text-[#111827]" style={{ fontWeight: 700 }}>{summary.unmatched}</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Badge variant="accent">확인필요</Badge>
            <span className="text-2xl text-[#111827]" style={{ fontWeight: 700 }}>{summary.matched_pending}</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">확인완료</Badge>
            <span className="text-2xl text-[#111827]" style={{ fontWeight: 700 }}>{summary.confirmed}</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Badge variant="neutral">환급대기</Badge>
            <span className="text-2xl text-[#111827]" style={{ fontWeight: 700 }}>{summary.refund_pending}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-3">
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="입금자명, 거래번호..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.value || "all"}
              onClick={() => {
                setStatusFilter(s.value);
                setUnmatchedOnly(false);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs cursor-pointer ${
                statusFilter === s.value && !unmatchedOnly ? "bg-[#1F6B78] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
              style={{ fontWeight: statusFilter === s.value && !unmatchedOnly ? 600 : 400 }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-500">
            <input
              type="checkbox"
              checked={unmatchedOnly}
              onChange={(e) => setUnmatchedOnly(e.target.checked)}
              className="accent-[#1F6B78]"
            />
            미매칭만
          </label>
        </div>
      </div>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{actionError}</div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8F9FA]">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>거래</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 hidden md:table-cell" style={{ fontWeight: 600 }}>일시</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>입금자</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>금액</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 hidden lg:table-cell" style={{ fontWeight: 600 }}>매칭 조합원</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>상태</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>액션</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">입금 내역을 불러오는 중...</td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-red-500 text-sm">{error}</td>
                </tr>
              )}
              {!loading && !error && transactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">조건에 맞는 내역이 없습니다.</td>
                </tr>
              )}
              {!loading && !error && transactions.map((tx) => (
                <tr key={tx.id} className="border-t border-gray-50 hover:bg-[#F8F9FA]/50">
                  <td className="px-4 py-3 text-xs text-gray-400">{tx.transactionNo}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{formatDateTime(tx.occurredAt)}</td>
                  <td className="px-4 py-3">
                    <span className="text-[#111827]" style={{ fontWeight: 500 }}>{tx.depositorName}</span>
                  </td>
                  <td className="px-4 py-3 text-[#111827]" style={{ fontWeight: 600 }}>{Number(tx.amount || 0).toLocaleString()}원</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {tx.matchedMemberId ? (
                      <span className="text-[#1F6B78]" style={{ fontWeight: 500 }}>회원 #{tx.matchedMemberId}</span>
                    ) : (
                      <span className="text-gray-300 italic">미매칭</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={statusLabel(tx.matchStatus)} /></td>
                  <td className="px-4 py-3">
                    {tx.matchStatus === "unmatched" && (
                      <button
                        onClick={() => {
                          setMatchTarget(tx);
                          setSelectedMemberId(null);
                          setMemberSearch(tx.depositorName);
                          setMatchModal(true);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#1F6B78]/10 text-[#1F6B78] text-xs cursor-pointer flex items-center gap-1 hover:bg-[#1F6B78]/20"
                        style={{ fontWeight: 600 }}
                      >
                        <Link2 size={12} /> 수동 매칭
                      </button>
                    )}
                    {["matched_pending", "suggested"].includes(tx.matchStatus) && (
                      <button
                        onClick={() => void handleConfirm(tx.id)}
                        disabled={submitting}
                        className="px-2.5 py-1.5 rounded-lg bg-[#67B89A]/10 text-[#2D7A5E] text-xs cursor-pointer flex items-center gap-1 disabled:opacity-60"
                        style={{ fontWeight: 600 }}
                      >
                        {submitting ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                        확인
                      </button>
                    )}
                    {tx.matchStatus === "refund_pending" && (
                      <span className="text-xs text-gray-400">환급 처리 예정</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">현재 페이지 {transactions.length}건</div>
      </div>

      <AdminModal
        open={matchModal}
        onClose={() => setMatchModal(false)}
        title="수동 매칭"
        size="sm"
        footer={
          <>
            <button onClick={() => setMatchModal(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 cursor-pointer">취소</button>
            <button
              onClick={() => void handleManualMatch()}
              disabled={!selectedMemberId || submitting}
              className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-sm cursor-pointer disabled:opacity-60"
              style={{ fontWeight: 600 }}
            >
              {submitting ? "매칭 중..." : "매칭 확정"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-[#374151]">
            거래 <strong>{matchTarget?.transactionNo}</strong>을 조합원과 연결합니다.
          </p>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>조합원 검색</label>
            <input
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="이름 또는 조합원번호..."
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-2" style={{ fontWeight: 600 }}>검색 결과</label>
            {memberLoading && (
              <p className="text-xs text-gray-400">조합원 검색 중...</p>
            )}
            {!memberLoading && members.length === 0 && (
              <p className="text-xs text-gray-400">검색된 조합원이 없습니다.</p>
            )}
            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {members.map((member) => (
                <label key={member.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#F8F9FA] hover:bg-[#1F6B78]/5 cursor-pointer">
                  <input
                    type="radio"
                    name="match-member"
                    checked={selectedMemberId === member.id}
                    onChange={() => setSelectedMemberId(member.id)}
                    className="accent-[#1F6B78]"
                  />
                  <div className="flex-1">
                    <span className="text-sm text-[#111827]" style={{ fontWeight: 500 }}>{member.name}</span>
                    <span className="text-xs text-gray-400 ml-2">{member.memberNo}</span>
                  </div>
                  <Badge variant="primaryLight">{member.phone}</Badge>
                </label>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#F2EBDD]/50 flex items-start gap-2 text-xs text-[#7A6C55]">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            오매칭 방지를 위해 입금자명, 금액, 날짜를 다시 확인하세요.
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
