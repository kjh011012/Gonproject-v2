import { useMemo, useState } from "react";
import { CheckCircle2, Clock, Phone, ChevronRight, Wallet, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { StatusBadge, Badge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField } from "../../components/admin/AdminDetailPanel";
import { AdminModal } from "../../components/admin/AdminModal";
import {
  useApplicationsQuery,
  useApproveApplicationMutation,
} from "../../hooks/admin/useAdminQueries";
import { adminApi } from "../../lib/api/admin";

type ApplicationItem = {
  id: number;
  applicationNo: string;
  name: string;
  phone: string;
  region: string | null;
  desiredShareAmount: number;
  status: string;
  createdAt: string;
};

const STATUS_LABELS: Record<string, string> = {
  submitted: "가입신청",
  under_review: "승인대기",
  payment_pending: "입금확인중",
  payment_matched: "입금확인됨",
  approved: "가입완료",
  rejected: "반려",
  on_hold: "보류",
};

const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: "", label: "전체" },
  { value: "submitted", label: "가입신청" },
  { value: "under_review", label: "승인대기" },
  { value: "payment_pending", label: "입금확인중" },
  { value: "payment_matched", label: "입금확인됨" },
  { value: "approved", label: "가입완료" },
  { value: "rejected", label: "반려" },
  { value: "on_hold", label: "보류" },
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

export function AdminApplications() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data, loading, error, refetch } = useApplicationsQuery({
    page: 1,
    pageSize: 100,
    status: statusFilter || undefined,
    search: search || undefined,
  });
  const approveApplication = useApproveApplicationMutation();

  const applications = (data ?? []) as ApplicationItem[];
  const selectedApp = selectedId == null ? null : applications.find((a) => a.id === selectedId) ?? null;

  const pendingCount = useMemo(
    () => applications.filter((a) => ["submitted", "under_review", "payment_pending", "payment_matched"].includes(a.status)).length,
    [applications],
  );

  async function handleApprove() {
    if (!selectedApp) return;
    setSubmitting(true);
    setActionError(null);
    try {
      await approveApplication(selectedApp.id);
      setApproveModal(false);
      await refetch();
      setSelectedId(null);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "승인 처리에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReject() {
    if (!selectedApp) return;
    setSubmitting(true);
    setActionError(null);
    try {
      await adminApi.rejectApplication(selectedApp.id, rejectReason || undefined);
      setRejectModal(false);
      setRejectReason("");
      await refetch();
      setSelectedId(null);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "반려 처리에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMarkPaymentMatched() {
    if (!selectedApp) return;
    setSubmitting(true);
    setActionError(null);
    try {
      await adminApi.markApplicationPaymentMatched(selectedApp.id);
      await refetch();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "입금 확인 처리에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  const canReview = selectedApp ? ["submitted", "under_review", "payment_pending", "payment_matched", "on_hold"].includes(selectedApp.status) : false;
  const canApprove = selectedApp?.status === "payment_matched";

  return (
    <div className="flex gap-6 h-full">
      <div className={`flex-1 min-w-0 ${selectedApp ? "hidden xl:block" : ""}`}>
        <div className="bg-white rounded-xl p-5 shadow-sm mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base text-[#111827]" style={{ fontWeight: 700 }}>가입 신청 목록</h3>
              <p className="text-xs text-gray-400 mt-1">전체 {applications.length}건 / 검토 필요 {pendingCount}건</p>
            </div>
            <Badge variant="accent">{pendingCount}건 대기</Badge>
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="이름, 전화번호, 신청번호..."
              className="flex-1 rounded-lg border border-gray-200 bg-[#F8F9FA] px-3 py-2 text-sm"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-[#F8F9FA] px-3 py-2 text-sm"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s.value || "all"} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {loading && (
            <div className="bg-white rounded-xl p-5 shadow-sm text-sm text-gray-500">가입 신청 목록을 불러오는 중...</div>
          )}
          {!loading && error && (
            <div className="bg-white rounded-xl p-5 shadow-sm text-sm text-red-500">{error}</div>
          )}
          {!loading && !error && applications.length === 0 && (
            <div className="bg-white rounded-xl p-5 shadow-sm text-sm text-gray-400">조건에 맞는 신청이 없습니다.</div>
          )}
          {!loading && !error && applications.map((a) => (
            <div
              key={a.id}
              onClick={() => setSelectedId(a.id)}
              className={`bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${
                selectedId === a.id
                  ? "border-l-[#1F6B78]"
                  : a.status === "payment_pending"
                    ? "border-l-[#E5D9C3]"
                    : "border-l-[#67B89A]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1F6B78]/10 flex items-center justify-center text-sm text-[#1F6B78]" style={{ fontWeight: 600 }}>
                    {a.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-[#111827]" style={{ fontWeight: 600 }}>{a.name}</span>
                    </div>
                    <p className="text-xs text-gray-400">{a.applicationNo} · {a.region || "지역 미입력"} · {formatDate(a.createdAt)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={statusLabel(a.status)} />
                      <span className="text-xs text-gray-400">출자금 {Number(a.desiredShareAmount || 0).toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedApp && (
        <AdminDetailPanel title="신청 상세" onClose={() => setSelectedId(null)}>
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-[#1F6B78]/10 flex items-center justify-center text-lg text-[#1F6B78]" style={{ fontWeight: 700 }}>
              {selectedApp.name[0]}
            </div>
            <div>
              <p className="text-base text-[#111827]" style={{ fontWeight: 700 }}>{selectedApp.name}</p>
              <p className="text-xs text-gray-400">{selectedApp.applicationNo}</p>
            </div>
          </div>

          <div className="space-y-3">
            <DetailField label="연락처">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#374151]">{selectedApp.phone}</span>
                <a
                  href={`tel:${selectedApp.phone.replace(/[^0-9+]/g, "")}`}
                  className="px-2 py-1 rounded bg-[#1F6B78]/10 text-[#1F6B78] text-xs cursor-pointer flex items-center gap-1"
                >
                  <Phone size={11} /> 전화
                </a>
              </div>
            </DetailField>
            <DetailField label="지역">
              <p className="text-sm text-[#374151]">{selectedApp.region || "-"}</p>
            </DetailField>
            <DetailField label="신청일">
              <p className="text-sm text-[#374151]">{formatDate(selectedApp.createdAt)}</p>
            </DetailField>
            <DetailField label="신청 상태">
              <StatusBadge status={statusLabel(selectedApp.status)} size="md" />
            </DetailField>
            <DetailField label="출자금 선택">
              <p className="text-sm text-[#374151]">{Number(selectedApp.desiredShareAmount || 0).toLocaleString()}원</p>
            </DetailField>
          </div>

          <div className="p-3 rounded-lg border border-gray-200 bg-[#F8F9FA]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500" style={{ fontWeight: 600 }}>입금 매칭 상태</span>
              <Badge variant={selectedApp.status === "payment_matched" ? "secondary" : "accent"}>
                {selectedApp.status === "payment_matched" ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                {selectedApp.status === "payment_matched" ? "입금 확인됨" : "입금 확인 필요"}
              </Badge>
            </div>
            {selectedApp.status !== "payment_matched" && (
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => navigate("/admin/transactions")}
                  className="w-full px-3 py-2 rounded-lg border border-[#1F6B78]/20 text-[#1F6B78] text-xs cursor-pointer hover:bg-[#1F6B78]/5 flex items-center justify-center gap-1.5"
                  style={{ fontWeight: 600 }}
                >
                  <Wallet size={13} /> 입금 원장에서 확인
                </button>
                <button
                  onClick={() => void handleMarkPaymentMatched()}
                  disabled={submitting}
                  className="w-full px-3 py-2 rounded-lg bg-[#67B89A]/10 text-[#2D7A5E] text-xs cursor-pointer hover:bg-[#67B89A]/20 disabled:opacity-60"
                  style={{ fontWeight: 600 }}
                >
                  입금 확인 완료 처리
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-2" style={{ fontWeight: 600 }}>승인 프로세스</label>
            <div className="space-y-2">
              {[
                { step: "1. 신청 정보 확인", done: true },
                { step: "2. 입금 매칭 확인", done: ["payment_matched", "approved"].includes(selectedApp.status) },
                { step: "3. 승인 처리", done: selectedApp.status === "approved" },
                { step: "4. 안내 발송", done: selectedApp.status === "approved" },
              ].map((s, i) => (
                <div key={i} className={`flex items-center gap-2 p-2 rounded-lg text-sm ${s.done ? "bg-[#67B89A]/5 text-[#2D7A5E]" : "bg-[#F8F9FA] text-gray-400"}`}>
                  {s.done ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                  <span className={s.done ? "line-through" : ""} style={{ fontWeight: s.done ? 400 : 500 }}>{s.step}</span>
                </div>
              ))}
            </div>
          </div>

          {actionError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{actionError}</div>
          )}

          <div className="space-y-2 pt-2">
            <button
              onClick={() => setApproveModal(true)}
              disabled={!canApprove}
              className="w-full px-4 py-2.5 rounded-lg bg-[#1F6B78] text-white text-sm cursor-pointer disabled:opacity-50"
              style={{ fontWeight: 600 }}
            >
              승인
            </button>
            {!canApprove && canReview && (
              <p className="text-xs text-gray-500">
                입금 확인 완료 처리 후 승인할 수 있습니다.
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setRejectModal(true)}
                disabled={!canReview}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-500 text-sm cursor-pointer hover:bg-gray-50 disabled:opacity-50"
              >
                반려
              </button>
            </div>
          </div>
        </AdminDetailPanel>
      )}

      <AdminModal
        open={approveModal}
        onClose={() => setApproveModal(false)}
        title="가입 승인"
        size="sm"
        footer={
          <>
            <button onClick={() => setApproveModal(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 cursor-pointer">취소</button>
            <button
              onClick={() => void handleApprove()}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-sm cursor-pointer disabled:opacity-60"
              style={{ fontWeight: 600 }}
            >
              <span className="flex items-center gap-1.5">
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                승인 확정
              </span>
            </button>
          </>
        }
      >
        <p className="text-sm text-[#374151] mb-4">
          <strong>{selectedApp?.name}</strong>님의 가입을 승인하시겠습니까?
        </p>
        <p className="text-xs text-gray-500">
          승인 후 조합원 목록에 등록됩니다.
        </p>
      </AdminModal>

      <AdminModal
        open={rejectModal}
        onClose={() => setRejectModal(false)}
        title="가입 반려"
        size="sm"
        footer={
          <>
            <button onClick={() => setRejectModal(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 cursor-pointer">취소</button>
            <button
              onClick={() => void handleReject()}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-[#111827] text-white text-sm cursor-pointer disabled:opacity-60"
              style={{ fontWeight: 600 }}
            >
              {submitting ? "처리 중..." : "반려 처리"}
            </button>
          </>
        }
      >
        <p className="text-sm text-[#374151] mb-3">반려 사유를 입력해 주세요.</p>
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="반려 사유..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
        />
      </AdminModal>
    </div>
  );
}
