import { useState } from "react";
import { Search, Phone, Clock, User, Send, ChevronRight, FileText, AlertTriangle } from "lucide-react";
import { StatusBadge, Badge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField, DetailTabs } from "../../components/admin/AdminDetailPanel";

const INQUIRIES = [
  { id: "INQ-001", name: "홍길동", phone: "010-****-5678", email: "hong@email.com", category: "서비스 이용", channel: "웹", title: "돌봄 서비스 이용 시간 문의", date: "2026-03-06", status: "새 문의", staff: null, priority: "보통", content: "돌봄 서비스를 이용하고 싶은데, 주말에도 가능한가요? 평일 오후 시간대가 가장 좋은데 시간 조절이 되는지 알고 싶습니다." },
  { id: "INQ-002", name: "김수진", phone: "010-****-2222", email: "kim@email.com", category: "조합원 가입", channel: "전화", title: "출자금 납입 방법이 궁금합니다", date: "2026-03-05", status: "처리중", staff: "상담사 박OO", priority: "보통", content: "조합원 가입을 하려고 하는데 출자금을 어떻게 납입하면 되나요? 계좌이체 외에 다른 방법도 있나요?" },
  { id: "INQ-003", name: "이영호", phone: "010-****-6666", email: "lee@email.com", category: "서비스 이용", channel: "웹", title: "방문진료 가능 지역 문의", date: "2026-03-04", status: "새 문의", staff: null, priority: "긴급", content: "갑천면에 거주하는데 방문진료가 가능한 지역인가요? 어머니가 혼자 계셔서 빨리 알고 싶습니다." },
  { id: "INQ-004", name: "박지연", phone: "010-****-8888", email: "park@email.com", category: "일반 문의", channel: "카카오톡", title: "예약 시간 변경 요청", date: "2026-02-28", status: "답변완료", staff: "상담사 최OO", priority: "보통", content: "3/5 예약된 건강교실 시간을 오후 3시에서 2시로 변경할 수 있을까요?" },
  { id: "INQ-005", name: "최동현", phone: "010-****-0000", email: "choi@email.com", category: "서비스 이용", channel: "웹", title: "건강교실 참가 신청 문의", date: "2026-02-27", status: "답변완료", staff: "상담사 박OO", priority: "보통", content: "건강교실에 참가하고 싶습니다. 조합원이 아니어도 참가할 수 있나요?" },
  { id: "INQ-006", name: "한미경", phone: "010-****-3333", email: "han@email.com", category: "불편 사항", channel: "전화", title: "방문 시간 미준수 관련 문의", date: "2026-03-03", status: "처리중", staff: "운영팀장 김OO", priority: "긴급", content: "지난번 방문진료 시 약속 시간보다 1시간 늦게 오셨습니다. 사전 연락도 없어서 많이 기다렸습니다." },
];

const STATUSES = ["전체", "새 문의", "처리중", "답변완료", "종료"];
const TEMPLATES = [
  { id: "T-01", name: "가입 안내", content: "안녕하세요, {이름}님. G온돌봄에 관심 가져주셔서 감사합니다. 조합원 가입은 웹사이트 또는 전화({대표전화})로 가능합니다..." },
  { id: "T-02", name: "출자금 안내", content: "안녕하세요, {이름}님. 출자금은 1좌 5만원 기준이며, 계좌이체로 납입 가능합니다. 계좌: 추후 안내..." },
  { id: "T-03", name: "서비스 안내", content: "안녕하세요, {이름}님. 문의하신 서비스에 대해 안내드립니다. 운영시간: {운영시간}, 문의: {대표전화}..." },
  { id: "T-04", name: "불편 사항 사과", content: "안녕하세요, {이름}님. 불편을 드려 정말 죄송합니다. 해당 건은 내부 검토 후 개선하겠습니다..." },
];

export function AdminInquiries() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState("문의 내용");
  const [reply, setReply] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const filtered = INQUIRIES.filter(
    (i) =>
      (statusFilter === "전체" || i.status === statusFilter) &&
      (search === "" || i.name.includes(search) || i.title.includes(search) || i.id.includes(search))
  );

  const inquiry = selectedId ? INQUIRIES.find((i) => i.id === selectedId) : null;

  const applyTemplate = (templateId: string) => {
    const t = TEMPLATES.find((t) => t.id === templateId);
    if (t && inquiry) {
      setReply(t.content.replace("{이름}", inquiry.name.replace("○○", "OO")));
      setSelectedTemplate(templateId);
    }
  };

  return (
    <div className="flex gap-6 h-full">
      {/* List */}
      <div className={`flex-1 min-w-0 ${inquiry ? "hidden xl:block" : ""}`}>
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
            <div className="flex gap-1.5">
              {STATUSES.map((s) => {
                const count = s === "전체" ? INQUIRIES.length : INQUIRIES.filter((i) => i.status === s).length;
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs cursor-pointer flex items-center gap-1 ${
                      statusFilter === s ? "bg-[#1F6B78] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                    style={{ fontWeight: statusFilter === s ? 600 : 400 }}
                  >
                    {s}
                    <span className={`text-[10px] ${statusFilter === s ? "opacity-70" : "text-gray-400"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map((i) => (
            <div
              key={i.id}
              onClick={() => { setSelectedId(i.id); setDetailTab("문의 내용"); setReply(""); setSelectedTemplate(""); }}
              className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${
                selectedId === i.id ? "border-l-[#1F6B78]" : i.priority === "긴급" ? "border-l-[#E5D9C3]" : "border-l-transparent"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <StatusBadge status={i.status} />
                    <Badge variant="neutral">{i.category}</Badge>
                    <Badge variant="neutral">{i.channel}</Badge>
                    {i.priority === "긴급" && <Badge variant="accent"><AlertTriangle size={10} /> 긴급</Badge>}
                  </div>
                  <p className="text-sm text-[#111827] truncate" style={{ fontWeight: 600 }}>{i.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>{i.name}</span>
                    <span>{i.id}</span>
                    <span>{i.date}</span>
                    {i.staff && <span className="text-[#1F6B78]">{i.staff}</span>}
                  </div>
                  {i.status === "새 문의" && (
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock size={11} /> 24시간 내 답변 권장
                    </p>
                  )}
                </div>
                <ChevronRight size={16} className="text-gray-300 shrink-0 mt-2" />
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm">조건에 맞는 항목이 없습니다</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {inquiry && (
        <AdminDetailPanel
          title="문의 상세"
          onClose={() => setSelectedId(null)}
          width="w-full xl:w-[480px]"
        >
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={inquiry.status} size="md" />
            <Badge variant="neutral">{inquiry.category}</Badge>
            <Badge variant="neutral">{inquiry.channel}</Badge>
            {inquiry.priority === "긴급" && <Badge variant="accent">긴급</Badge>}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User size={14} className="text-gray-400" />
              <span className="text-[#111827]" style={{ fontWeight: 500 }}>{inquiry.name}</span>
              <span className="text-gray-400">({inquiry.email})</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-gray-400" />
              <span className="text-gray-500">{inquiry.phone}</span>
              <button className="px-2 py-0.5 rounded bg-[#1F6B78]/10 text-[#1F6B78] text-xs cursor-pointer">전화</button>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gray-400" />
              <span className="text-gray-500">{inquiry.date}</span>
            </div>
          </div>

          <DetailTabs
            tabs={["문의 내용", "답변", "내부 메모", "히스토리"]}
            active={detailTab}
            onChange={setDetailTab}
          />

          {detailTab === "문의 내용" && (
            <div>
              <p className="text-base text-[#111827] mb-3" style={{ fontWeight: 700 }}>{inquiry.title}</p>
              <p className="text-sm text-[#374151] leading-relaxed">{inquiry.content}</p>
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
                  {TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
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

              <label className="flex items-center gap-2 p-3 rounded-lg bg-[#F8F9FA] cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-[#1F6B78]" />
                <span className="text-sm text-[#374151]">전송 후 상태를 '답변완료'로 변경</span>
              </label>

              <button className="w-full px-4 py-2.5 rounded-lg bg-[#1F6B78] text-white text-sm flex items-center justify-center gap-1.5 cursor-pointer" style={{ fontWeight: 600 }}>
                <Send size={14} /> 답변 전송
              </button>
            </div>
          )}

          {detailTab === "내부 메모" && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#F2EBDD]/50 text-sm text-[#7A6C55]">
                전화 상담 시 어르신이 많이 불편해하셨음. 신속 대응 필요 — 운영팀장 김OO (3/3)
              </div>
              <textarea
                placeholder="내부 메모... (고객에게 보이지 않음)"
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
              />
              <button className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer" style={{ fontWeight: 600 }}>메모 저장</button>
            </div>
          )}

          {detailTab === "히스토리" && (
            <div className="space-y-3">
              {[
                { date: "2026-03-06 09:00", action: "문의 접수 (웹)" },
                ...(inquiry.staff ? [{ date: "2026-03-06 09:30", action: `${inquiry.staff}에게 배정` }] : []),
                ...(inquiry.status === "답변완료" ? [{ date: "2026-03-06 14:00", action: "답변 전송 완료" }] : []),
              ].map((h, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-[#1F6B78] mt-1.5" />
                    <div className="w-px flex-1 bg-gray-200 mt-1" />
                  </div>
                  <div className="pb-3">
                    <p className="text-sm text-[#374151]">{h.action}</p>
                    <p className="text-xs text-gray-400">{h.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Status change */}
          <div className="pt-2 border-t border-gray-100">
            <DetailField label="상태 변경">
              <select className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm">
                {["새 문의", "처리중", "답변완료", "종료"].map((s) => (
                  <option key={s} selected={s === inquiry.status}>{s}</option>
                ))}
              </select>
            </DetailField>
            <DetailField label="담당자 배정">
              <select className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm">
                <option>{inquiry.staff || "미배정"}</option>
                <option>상담사 박OO</option>
                <option>상담사 최OO</option>
                <option>운영팀장 김OO</option>
              </select>
            </DetailField>
          </div>
        </AdminDetailPanel>
      )}
    </div>
  );
}
