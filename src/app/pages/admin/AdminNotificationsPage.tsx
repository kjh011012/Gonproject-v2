import { useState } from "react";
import {
  Bell, Plus, Search, Edit, MessageSquare, Mail, Phone, Clock, CheckCircle2
} from "lucide-react";
import { Badge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField } from "../../components/admin/AdminDetailPanel";
import { useLargeMode } from "../../components/layouts/AdminLayout";

const TABS = ["트리거별", "템플릿", "발송 정책"] as const;
const VARIABLES = ["{이름}", "{대표전화}", "{운영시간}", "{서비스명}", "{일정}"];

interface Trigger {
  id: string; event: string; description: string;
  sms: boolean; kakao: boolean; email: boolean; template: string; active: boolean;
}

const TRIGGERS: Trigger[] = [
  { id: "N-001", event: "가입 승인", description: "가입 신청이 승인되었을 때", sms: true, kakao: true, email: false, template: "가입 완료 안내", active: true },
  { id: "N-002", event: "입금 확인", description: "출자금 입금이 확인되었을 때", sms: true, kakao: false, email: false, template: "입금 확인 안내", active: true },
  { id: "N-003", event: "일정 확정", description: "서비스 일정이 확정되었을 때", sms: true, kakao: true, email: false, template: "일정 확정 안내", active: true },
  { id: "N-004", event: "일정 변경", description: "서비스 일정이 변경되었을 때", sms: true, kakao: true, email: false, template: "일정 변경 안내", active: true },
  { id: "N-005", event: "문의 답변 완료", description: "문의에 대한 답변이 작성되었을 때", sms: false, kakao: true, email: true, template: "문의 답변 안내", active: true },
  { id: "N-006", event: "대기열 안내", description: "대기열에 등록되었을 때", sms: true, kakao: false, email: false, template: "대기열 등록 안내", active: false },
];

interface NotiTemplate {
  id: string; title: string; channel: string; body: string; lastModified: string;
}

const TEMPLATES: NotiTemplate[] = [
  { id: "NT-001", title: "가입 완료 안내", channel: "문자", body: "{이름}님, 조합 가입이 완료되었습니다. 문의: {대표전화}", lastModified: "2026-03-01" },
  { id: "NT-002", title: "입금 확인 안내", channel: "문자", body: "{이름}님, 출자금 입금이 확인되었습니다. 감사합니다.", lastModified: "2026-02-28" },
  { id: "NT-003", title: "일정 확정 안내", channel: "카카오톡", body: "{이름}님, {서비스명} 일정이 {일정}로 확정되었습니다.", lastModified: "2026-03-03" },
  { id: "NT-004", title: "일정 변경 안내", channel: "카카오톡", body: "{이름}님, {서비스명} 일정이 변경되었습니다. 새 일정: {일정}", lastModified: "2026-03-02" },
  { id: "NT-005", title: "문의 답변 안내", channel: "이메일", body: "{이름}님, 문의하신 내용에 답변 드렸습니다. 확인해 주세요.", lastModified: "2026-02-25" },
];

export function AdminNotificationsPage() {
  const { isLarge } = useLargeMode();
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0]);
  const [selected, setSelected] = useState<Trigger | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<NotiTemplate | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className={`${isLarge ? "text-xl" : "text-lg"} text-[#111827]`} style={{ fontWeight: 700 }}>알림 설정</h1>
          <p className="text-xs text-gray-400 mt-0.5">트리거별 알림 템플릿과 발송 채널을 관리합니다</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65] flex items-center gap-1.5" style={{ fontWeight: 600 }}><Plus size={14} />템플릿 추가</button>
          <button className="px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-[#374151] cursor-pointer hover:bg-gray-50 flex items-center gap-1.5" style={{ fontWeight: 500 }}>테스트 발송</button>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-gray-200">
        {TABS.map((t) => <button key={t} onClick={() => setTab(t)} className={`px-3 py-2.5 text-xs whitespace-nowrap cursor-pointer border-b-2 ${tab === t ? "border-[#1F6B78] text-[#1F6B78]" : "border-transparent text-gray-400 hover:text-gray-600"}`} style={{ fontWeight: tab === t ? 600 : 400 }}>{t}</button>)}
      </div>

      {tab === "트리거별" && (
        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#F8F9FC]"><tr>{["이벤트", "설명", "문자", "카톡", "이메일", "템플릿", "활성", ""].map((h) => <th key={h} className="text-left px-4 py-3 text-xs text-[#9CA3AF]" style={{ fontWeight: 600 }}>{h}</th>)}</tr></thead>
                <tbody>
                  {TRIGGERS.map((t) => (
                    <tr key={t.id} onClick={() => setSelected(t)} className={`border-t border-gray-50 cursor-pointer ${selected?.id === t.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FC]/50"}`}>
                      <td className="px-4 py-3 text-[#111827]" style={{ fontWeight: 600 }}>{t.event}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{t.description}</td>
                      <td className="px-4 py-3 text-center">{t.sms ? <CheckCircle2 size={14} className="text-[#67B89A]" /> : <span className="text-gray-300">-</span>}</td>
                      <td className="px-4 py-3 text-center">{t.kakao ? <CheckCircle2 size={14} className="text-[#67B89A]" /> : <span className="text-gray-300">-</span>}</td>
                      <td className="px-4 py-3 text-center">{t.email ? <CheckCircle2 size={14} className="text-[#67B89A]" /> : <span className="text-gray-300">-</span>}</td>
                      <td className="px-4 py-3 text-xs text-[#1F6B78]">{t.template}</td>
                      <td className="px-4 py-3">
                        <div className={`w-8 h-4 rounded-full cursor-pointer relative ${t.active ? "bg-[#67B89A]" : "bg-gray-300"}`}>
                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow ${t.active ? "right-0.5" : "left-0.5"}`} />
                        </div>
                      </td>
                      <td className="px-4 py-3"><button className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"><Edit size={13} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {selected && (
            <AdminDetailPanel title={selected.event} onClose={() => setSelected(null)} width="w-full xl:w-[380px]">
              <DetailField label="설명"><p className="text-sm text-[#374151]">{selected.description}</p></DetailField>
              <DetailField label="발송 채널">
                <div className="space-y-2">
                  {[{ label: "문자(SMS)", icon: Phone, on: selected.sms }, { label: "카카오톡", icon: MessageSquare, on: selected.kakao }, { label: "이메일", icon: Mail, on: selected.email }].map((ch) => (
                    <div key={ch.label} className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8F9FC]">
                      <span className="flex items-center gap-2 text-sm text-[#374151]"><ch.icon size={14} />{ch.label}</span>
                      <div className={`w-8 h-4 rounded-full cursor-pointer relative ${ch.on ? "bg-[#67B89A]" : "bg-gray-300"}`}><div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow ${ch.on ? "right-0.5" : "left-0.5"}`} /></div>
                    </div>
                  ))}
                </div>
              </DetailField>
              <DetailField label="연결 템플릿"><p className="text-sm text-[#1F6B78] cursor-pointer hover:underline">{selected.template}</p></DetailField>
              <DetailField label="발송 조건"><p className="text-xs text-gray-400">상태 변경 시 자동 발송 (placeholder)</p></DetailField>
            </AdminDetailPanel>
          )}
        </div>
      )}

      {tab === "템플릿" && (
        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#F8F9FC]"><tr>{["제목", "채널", "본문 (미리보기)", "수정일", ""].map((h) => <th key={h} className="text-left px-4 py-3 text-xs text-[#9CA3AF]" style={{ fontWeight: 600 }}>{h}</th>)}</tr></thead>
                <tbody>
                  {TEMPLATES.map((t) => (
                    <tr key={t.id} onClick={() => setSelectedTemplate(t)} className={`border-t border-gray-50 cursor-pointer ${selectedTemplate?.id === t.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FC]/50"}`}>
                      <td className="px-4 py-3 text-[#111827]" style={{ fontWeight: 600 }}>{t.title}</td>
                      <td className="px-4 py-3"><Badge variant={t.channel === "문자" ? "primary" : t.channel === "카카오톡" ? "secondary" : "accent"}>{t.channel}</Badge></td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-[280px] truncate">{t.body}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{t.lastModified}</td>
                      <td className="px-4 py-3"><button className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"><Edit size={13} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {selectedTemplate && (
            <AdminDetailPanel title={`${selectedTemplate.title} 편집`} onClose={() => setSelectedTemplate(null)} width="w-full xl:w-[400px]">
              <DetailField label="제목"><input defaultValue={selectedTemplate.title} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" /></DetailField>
              <DetailField label="본문"><textarea defaultValue={selectedTemplate.body} rows={4} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" /></DetailField>
              <DetailField label="변수 삽입"><div className="flex gap-1 flex-wrap">{VARIABLES.map((v) => <button key={v} className="px-2 py-1 rounded bg-[#1F6B78]/10 text-[#1F6B78] text-[10px] cursor-pointer hover:bg-[#1F6B78]/20" style={{ fontWeight: 500 }}>{v}</button>)}</div></DetailField>
              <DetailField label="미리보기">
                <div className="bg-[#F8F9FC] rounded-lg p-3 text-sm text-[#374151]">{selectedTemplate.body.replace("{이름}", "김○○").replace("{대표전화}", "추후 개통예정").replace("{서비스명}", "방문간호").replace("{일정}", "3월 10일 14:00")}</div>
              </DetailField>
              <button onClick={() => { alert("저장 (Supabase 연동 후)"); setSelectedTemplate(null); }} className="w-full py-2 rounded-lg bg-[#1F6B78] text-white text-sm cursor-pointer hover:bg-[#185A65]" style={{ fontWeight: 600 }}>저장</button>
            </AdminDetailPanel>
          )}
        </div>
      )}

      {tab === "발송 정책" && (
        <div className="max-w-xl space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-sm text-[#111827] mb-3" style={{ fontWeight: 600 }}>조용한 시간 (Quiet Hours)</p>
            <div className="flex items-center gap-3 mb-3">
              <input type="time" defaultValue="21:00" className="px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none" />
              <span className="text-sm text-gray-400">~</span>
              <input type="time" defaultValue="08:00" className="px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none" />
            </div>
            <label className="flex items-center gap-2 text-sm text-[#374151]"><input type="checkbox" defaultChecked className="accent-[#1F6B78]" />조용한 시간에 발생한 알림은 다음날 08:00에 발송</label>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-sm text-[#111827] mb-3" style={{ fontWeight: 600 }}>재발송 정책</p>
            <label className="flex items-center gap-2 text-sm text-[#374151]"><input type="checkbox" className="accent-[#1F6B78]" />발송 실패 시 1회 자동 재시도</label>
          </div>
        </div>
      )}
    </div>
  );
}
