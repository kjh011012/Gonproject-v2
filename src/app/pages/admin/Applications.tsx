import { useState } from "react";
import { CheckCircle2, Clock, XCircle, Phone, Send, ChevronRight, User, Wallet } from "lucide-react";
import { StatusBadge, Badge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField } from "../../components/admin/AdminDetailPanel";
import { AdminModal } from "../../components/admin/AdminModal";

const APPLICATIONS = [
  { id: "APP-2026-006", name: "정태호", age: "1950년생", phone: "010-9999-0000", address: "안흥면", date: "2026-03-01", shareType: "5만원(1좌)", depositStatus: "입금 확인 필요", channel: "웹" },
  { id: "APP-2026-005", name: "이철수", age: "1955년생", phone: "010-5555-6666", address: "갑천면", date: "2026-02-28", shareType: "5만원(1좌)", depositStatus: "입금 확인됨", channel: "방문" },
  { id: "APP-2026-004", name: "송미경", age: "1963년생", phone: "010-4444-3333", address: "횡성읍", date: "2026-02-25", shareType: "10만원(2좌)", depositStatus: "입금 확인 필요", channel: "전화" },
  { id: "APP-2026-003", name: "임도현", age: "1971년생", phone: "010-2222-1111", address: "우천면", date: "2026-02-22", shareType: "5만원(1좌)", depositStatus: "입금 확인됨", channel: "웹" },
];

export function AdminApplications() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);

  const app = selectedId ? APPLICATIONS.find((a) => a.id === selectedId) : null;

  return (
    <div className="flex gap-6 h-full">
      {/* List */}
      <div className={`flex-1 min-w-0 ${app ? "hidden xl:block" : ""}`}>
        <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base text-[#111827]" style={{ fontWeight: 700 }}>가입 승인 대기</h3>
              <p className="text-xs text-gray-400 mt-1">{APPLICATIONS.length}건의 신청이 대기 중입니다</p>
            </div>
            <Badge variant="accent">{APPLICATIONS.length}건 대기</Badge>
          </div>
        </div>

        <div className="space-y-3">
          {APPLICATIONS.map((a) => (
            <div
              key={a.id}
              onClick={() => setSelectedId(a.id)}
              className={`bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${
                selectedId === a.id ? "border-l-[#1F6B78]" : a.depositStatus === "입금 확인 필요" ? "border-l-[#E5D9C3]" : "border-l-[#67B89A]"
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
                      <span className="text-xs text-gray-400">{a.age}</span>
                    </div>
                    <p className="text-xs text-gray-400">{a.id} · {a.address} · {a.date}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={a.depositStatus === "입금 확인됨" ? "secondary" : "accent"}>
                        {a.depositStatus === "입금 확인됨" ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                        {a.depositStatus}
                      </Badge>
                      <span className="text-xs text-gray-400">{a.shareType}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 hidden md:block">{a.channel}</span>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      {app && (
        <AdminDetailPanel title="신청 상세" onClose={() => setSelectedId(null)}>
          {/* Applicant info */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-[#1F6B78]/10 flex items-center justify-center text-lg text-[#1F6B78]" style={{ fontWeight: 700 }}>
              {app.name[0]}
            </div>
            <div>
              <p className="text-base text-[#111827]" style={{ fontWeight: 700 }}>{app.name}</p>
              <p className="text-xs text-gray-400">{app.id} · {app.age}</p>
            </div>
          </div>

          {/* Info fields */}
          <div className="space-y-3">
            <DetailField label="연락처">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#374151]">{app.phone}</span>
                <button className="px-2 py-1 rounded bg-[#1F6B78]/10 text-[#1F6B78] text-xs cursor-pointer flex items-center gap-1">
                  <Phone size={11} /> 전화
                </button>
              </div>
            </DetailField>
            <DetailField label="주소">
              <p className="text-sm text-[#374151]">강원특별자치도 횡성군 {app.address}</p>
            </DetailField>
            <DetailField label="신청일">
              <p className="text-sm text-[#374151]">{app.date}</p>
            </DetailField>
            <DetailField label="신청 채널">
              <p className="text-sm text-[#374151]">{app.channel}</p>
            </DetailField>
            <DetailField label="출자금 선택">
              <p className="text-sm text-[#374151]">{app.shareType}</p>
            </DetailField>
          </div>

          {/* Deposit matching */}
          <div className="p-3 rounded-lg border border-gray-200 bg-[#F8F9FA]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500" style={{ fontWeight: 600 }}>입금 매칭 상태</span>
              <Badge variant={app.depositStatus === "입금 확인됨" ? "secondary" : "accent"}>
                {app.depositStatus}
              </Badge>
            </div>
            {app.depositStatus === "입금 확인 필요" && (
              <button className="w-full px-3 py-2 rounded-lg border border-[#1F6B78]/20 text-[#1F6B78] text-xs cursor-pointer hover:bg-[#1F6B78]/5 flex items-center justify-center gap-1.5" style={{ fontWeight: 600 }}>
                <Wallet size={13} /> 입금 원장에서 매칭 확인
              </button>
            )}
          </div>

          {/* Approval process steps */}
          <div>
            <label className="block text-xs text-gray-400 mb-2" style={{ fontWeight: 600 }}>승인 프로세스</label>
            <div className="space-y-2">
              {[
                { step: "1. 신청 정보 확인", done: true },
                { step: "2. 입금 매칭 확인", done: app.depositStatus === "입금 확인됨" },
                { step: "3. 승인 처리", done: false },
                { step: "4. 안내 발송", done: false },
              ].map((s, i) => (
                <div key={i} className={`flex items-center gap-2 p-2 rounded-lg text-sm ${s.done ? "bg-[#67B89A]/5 text-[#2D7A5E]" : "bg-[#F8F9FA] text-gray-400"}`}>
                  {s.done ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                  <span className={s.done ? "line-through" : ""} style={{ fontWeight: s.done ? 400 : 500 }}>{s.step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => setApproveModal(true)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#1F6B78] text-white text-sm cursor-pointer"
              style={{ fontWeight: 600 }}
            >
              승인
            </button>
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2.5 rounded-lg border border-[#1F6B78] text-[#1F6B78] text-sm cursor-pointer hover:bg-[#1F6B78]/5" style={{ fontWeight: 500 }}>
                보류(추가정보)
              </button>
              <button
                onClick={() => setRejectModal(true)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-500 text-sm cursor-pointer hover:bg-gray-50"
              >
                반려
              </button>
            </div>
          </div>
        </AdminDetailPanel>
      )}

      {/* Approve Modal */}
      <AdminModal
        open={approveModal}
        onClose={() => setApproveModal(false)}
        title="가입 승인"
        size="sm"
        footer={
          <>
            <button onClick={() => setApproveModal(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 cursor-pointer">취소</button>
            <button onClick={() => setApproveModal(false)} className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-sm cursor-pointer" style={{ fontWeight: 600 }}>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> 승인 확정</span>
            </button>
          </>
        }
      >
        <p className="text-sm text-[#374151] mb-4">
          <strong>{app?.name}</strong>님의 가입을 승인하시겠습니까?
        </p>
        <div className="space-y-3">
          <label className="flex items-center gap-2 p-3 rounded-lg bg-[#F8F9FA] cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-[#1F6B78]" />
            <span className="text-sm text-[#374151]">가입 환영 문자 발송</span>
          </label>
          <label className="flex items-center gap-2 p-3 rounded-lg bg-[#F8F9FA] cursor-pointer">
            <input type="checkbox" className="accent-[#1F6B78]" />
            <span className="text-sm text-[#374151]">카카오톡 안내 발송</span>
          </label>
        </div>
      </AdminModal>

      {/* Reject Modal */}
      <AdminModal
        open={rejectModal}
        onClose={() => setRejectModal(false)}
        title="가입 반려"
        size="sm"
        footer={
          <>
            <button onClick={() => setRejectModal(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 cursor-pointer">취소</button>
            <button onClick={() => setRejectModal(false)} className="px-4 py-2 rounded-lg bg-[#111827] text-white text-sm cursor-pointer" style={{ fontWeight: 600 }}>반려 처리</button>
          </>
        }
      >
        <p className="text-sm text-[#374151] mb-3">반려 사유를 입력해 주세요.</p>
        <textarea
          placeholder="반려 사유..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
        />
      </AdminModal>
    </div>
  );
}
