import { useEffect, useMemo, useState } from "react";
import { Search, Phone, Clock, User, Send, ChevronRight, AlertTriangle, Loader2 } from "lucide-react";
import { StatusBadge, Badge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField, DetailTabs } from "../../components/admin/AdminDetailPanel";
import {
  useInquiriesQuery,
  useReplyInquiryMutation,
} from "../../hooks/admin/useAdminQueries";
import { adminApi } from "../../lib/api/admin";

type InquiryItem = {
  id: number;
  inquiryNo: string;
  name: string;
  channel: string;
  inquiryType: string;
  subject: string | null;
  status: string;
  createdAt: string;
};

type InquiryDetail = {
  id: number;
  inquiryNo: string;
  name: string;
  phone: string | null;
  email: string | null;
  channel: string;
  inquiryType: string;
  subject: string | null;
  body: string;
  status: string;
  createdAt: string;
  replies: Array<{
    id: number;
    body: string;
    channel: string | null;
    sentAt: string | null;
    createdAt: string;
  }>;
};

const STATUS_LABELS: Record<string, string> = {
  new: "새 문의",
  in_progress: "처리중",
  replied: "답변완료",
  closed: "종료",
};

const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: "", label: "전체" },
  { value: "new", label: "새 문의" },
  { value: "in_progress", label: "처리중" },
  { value: "replied", label: "답변완료" },
  { value: "closed", label: "종료" },
];

const CHANNEL_LABELS: Record<string, string> = {
  web: "웹",
  phone: "전화",
  kakao: "카카오톡",
  email: "이메일",
  other: "기타",
};

const TYPE_LABELS: Record<string, string> = {
  join: "조합원 가입",
  service: "서비스 이용",
  finance: "재무/입금",
  other: "일반 문의",
};

const REPLY_TEMPLATES: Record<string, string[]> = {
  join: [
    "안녕하세요. 조합원 가입은 신청서 접수 후 검토와 입금 확인을 거쳐 완료됩니다.",
    "필요 서류 확인 후 순차적으로 승인 안내를 드리겠습니다.",
  ],
  service: [
    "문의 주신 서비스는 지역과 일정 확인 후 배정됩니다.",
    "가능 일정 확인 뒤 담당자가 다시 연락드리겠습니다.",
  ],
  finance: [
    "입금 내역 확인 후 처리 결과를 안내드리겠습니다.",
    "거래번호 또는 입금일시를 알려주시면 더 빠르게 확인됩니다.",
  ],
  other: [
    "문의 주셔서 감사합니다. 확인 후 빠르게 답변드리겠습니다.",
    "추가 확인이 필요한 내용은 담당자가 별도로 연락드립니다.",
  ],
};

function statusLabel(status: string) {
  return STATUS_LABELS[status] ?? status;
}

function channelLabel(channel: string | null | undefined) {
  if (!channel) return "-";
  return CHANNEL_LABELS[channel] ?? channel;
}

function typeLabel(type: string | null | undefined) {
  if (!type) return "-";
  return TYPE_LABELS[type] ?? type;
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

export function AdminInquiries() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailTab, setDetailTab] = useState("문의 내용");
  const [detail, setDetail] = useState<InquiryDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [sending, setSending] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, loading, error, refetch } = useInquiriesQuery({
    page: 1,
    pageSize: 100,
    status: statusFilter || undefined,
    search: search || undefined,
  });
  const replyInquiry = useReplyInquiryMutation();

  const inquiries = (data ?? []) as InquiryItem[];
  const selectedItem = selectedId == null ? null : inquiries.find((i) => i.id === selectedId) ?? null;

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = { "": inquiries.length };
    STATUS_FILTERS.forEach((s) => {
      if (!s.value) return;
      map[s.value] = inquiries.filter((i) => i.status === s.value).length;
    });
    return map;
  }, [inquiries]);

  async function loadDetail(inquiryId: number) {
    setDetailLoading(true);
    setDetailError(null);
    try {
      const res = await adminApi.inquiryDetail(inquiryId);
      setDetail(res.data as InquiryDetail);
    } catch (e) {
      setDetail(null);
      setDetailError(e instanceof Error ? e.message : "문의 상세를 불러오지 못했습니다.");
    } finally {
      setDetailLoading(false);
    }
  }

  useEffect(() => {
    if (selectedId == null) {
      setDetail(null);
      setDetailError(null);
      setReply("");
      setSelectedTemplate("");
      setActionError(null);
      return;
    }
    void loadDetail(selectedId);
  }, [selectedId]);

  function applyTemplate(indexText: string) {
    if (!detail) return;
    const idx = Number(indexText);
    if (Number.isNaN(idx)) {
      setSelectedTemplate("");
      return;
    }
    const candidates = REPLY_TEMPLATES[detail.inquiryType] ?? REPLY_TEMPLATES.other;
    const template = candidates[idx] ?? "";
    const merged = template.replace("문의", `${detail.name}님 문의`);
    setReply(merged);
    setSelectedTemplate(indexText);
  }

  async function handleSendReply() {
    if (!selectedId || !reply.trim()) return;
    setSending(true);
    setActionError(null);
    try {
      await replyInquiry(selectedId, reply.trim());
      setReply("");
      setSelectedTemplate("");
      await Promise.all([loadDetail(selectedId), refetch()]);
      setDetailTab("문의 내용");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "답변 전송에 실패했습니다.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex gap-6 h-full">
      <div className={`flex-1 min-w-0 ${selectedItem ? "hidden xl:block" : ""}`}>
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="relative flex-1 w-full md:max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="이름, 제목, 문의번호..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s.value || "all"}
                  onClick={() => setStatusFilter(s.value)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs cursor-pointer flex items-center gap-1 ${
                    statusFilter === s.value ? "bg-[#1F6B78] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                  style={{ fontWeight: statusFilter === s.value ? 600 : 400 }}
                >
                  {s.label}
                  <span className={`text-[10px] ${statusFilter === s.value ? "opacity-70" : "text-gray-400"}`}>
                    {statusCounts[s.value] ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {loading && (
            <div className="bg-white rounded-xl p-4 shadow-sm text-sm text-gray-500">문의 목록을 불러오는 중...</div>
          )}
          {!loading && error && (
            <div className="bg-white rounded-xl p-4 shadow-sm text-sm text-red-500">{error}</div>
          )}
          {!loading && !error && inquiries.length === 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm text-sm text-gray-400">조건에 맞는 문의가 없습니다.</div>
          )}
          {!loading && !error && inquiries.map((i) => (
            <div
              key={i.id}
              onClick={() => {
                setSelectedId(i.id);
                setDetailTab("문의 내용");
              }}
              className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${
                selectedId === i.id ? "border-l-[#1F6B78]" : i.status === "new" ? "border-l-[#E5D9C3]" : "border-l-transparent"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <StatusBadge status={statusLabel(i.status)} />
                    <Badge variant="neutral">{typeLabel(i.inquiryType)}</Badge>
                    <Badge variant="neutral">{channelLabel(i.channel)}</Badge>
                    {i.status === "new" && (
                      <Badge variant="accent"><AlertTriangle size={10} /> 우선확인</Badge>
                    )}
                  </div>
                  <p className="text-sm text-[#111827] truncate" style={{ fontWeight: 600 }}>{i.subject || "제목 없음"}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>{i.name}</span>
                    <span>{i.inquiryNo}</span>
                    <span>{formatDateTime(i.createdAt)}</span>
                  </div>
                  {i.status === "new" && (
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock size={11} /> 빠른 답변 권장
                    </p>
                  )}
                </div>
                <ChevronRight size={16} className="text-gray-300 shrink-0 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedItem && (
        <AdminDetailPanel title="문의 상세" onClose={() => setSelectedId(null)} width="w-full xl:w-[480px]">
          {detailLoading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 size={14} className="animate-spin" /> 상세 정보를 불러오는 중...
            </div>
          )}

          {!detailLoading && detailError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{detailError}</div>
          )}

          {(detail ?? selectedItem) && (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={statusLabel((detail ?? selectedItem).status)} size="md" />
                <Badge variant="neutral">{typeLabel((detail ?? selectedItem).inquiryType)}</Badge>
                <Badge variant="neutral">{channelLabel((detail ?? selectedItem).channel)}</Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-gray-400" />
                  <span className="text-[#111827]" style={{ fontWeight: 500 }}>{(detail ?? selectedItem).name}</span>
                  {detail?.email && <span className="text-gray-400">({detail.email})</span>}
                </div>
                {detail?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    <span className="text-gray-500">{detail.phone}</span>
                    <button className="px-2 py-0.5 rounded bg-[#1F6B78]/10 text-[#1F6B78] text-xs cursor-pointer">전화</button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-gray-500">{formatDateTime((detail ?? selectedItem).createdAt)}</span>
                </div>
              </div>

              <DetailTabs tabs={["문의 내용", "답변"]} active={detailTab} onChange={setDetailTab} />

              {detailTab === "문의 내용" && (
                <div className="space-y-3">
                  <p className="text-base text-[#111827]" style={{ fontWeight: 700 }}>{(detail ?? selectedItem).subject || "제목 없음"}</p>
                  <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-wrap">{detail?.body || "상세 내용을 불러오는 중입니다."}</p>

                  {detail?.replies && detail.replies.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500" style={{ fontWeight: 600 }}>기존 답변</p>
                      {detail.replies.map((r) => (
                        <div key={r.id} className="rounded-lg bg-[#F8F9FA] px-3 py-2">
                          <p className="text-sm text-[#374151] whitespace-pre-wrap">{r.body}</p>
                          <p className="text-xs text-gray-400 mt-1">{channelLabel(r.channel)} · {formatDateTime(r.sentAt || r.createdAt)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {detailTab === "답변" && (
                <div className="space-y-4">
                  <DetailField label="템플릿 선택">
                    <select
                      value={selectedTemplate}
                      onChange={(e) => applyTemplate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
                    >
                      <option value="">템플릿 선택...</option>
                      {(REPLY_TEMPLATES[(detail ?? selectedItem).inquiryType] ?? REPLY_TEMPLATES.other).map((template, idx) => (
                        <option key={idx} value={String(idx)}>{template.slice(0, 24)}...</option>
                      ))}
                    </select>
                  </DetailField>

                  <DetailField label="고객에게 보낼 답변">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="답변을 입력하세요..."
                      rows={6}
                      className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
                    />
                  </DetailField>

                  <DetailField label="전송 채널">
                    <div className="flex gap-2">
                      {["문자", "카카오톡", "이메일"].map((ch) => (
                        <label key={ch} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F8F9FA] cursor-pointer text-sm text-[#374151]">
                          <input type="checkbox" defaultChecked={ch === "문자"} className="accent-[#1F6B78]" />
                          {ch}
                        </label>
                      ))}
                    </div>
                  </DetailField>

                  {actionError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{actionError}</div>
                  )}

                  <button
                    onClick={() => void handleSendReply()}
                    disabled={sending || !reply.trim()}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#1F6B78] text-white text-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                    style={{ fontWeight: 600 }}
                  >
                    {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    답변 전송
                  </button>
                </div>
              )}
            </>
          )}
        </AdminDetailPanel>
      )}
    </div>
  );
}
