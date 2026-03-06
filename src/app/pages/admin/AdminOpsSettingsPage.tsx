import { useState } from "react";
import {
  Settings, Save, RotateCcw, ChevronDown, AlertTriangle, CheckCircle2
} from "lucide-react";
import { ConfirmModal } from "../../components/admin/AdminModal";
import { useLargeMode } from "../../components/layouts/AdminLayout";

interface Section { key: string; label: string; }
const SECTIONS: Section[] = [
  { key: "basic", label: "조합 기본정보 (고객 노출)" },
  { key: "join", label: "가입/출자금 설정" },
  { key: "service", label: "서비스 운영 설정" },
  { key: "community", label: "커뮤니티 설정" },
  { key: "policy", label: "약관/정책" },
  { key: "banner", label: "고객용 배너/공지" },
];

export function AdminOpsSettingsPage() {
  const { isLarge } = useLargeMode();
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["basic"]));
  const [saveModal, setSaveModal] = useState(false);
  const [changed, setChanged] = useState(false);

  const toggle = (key: string) => {
    const next = new Set(expanded);
    if (next.has(key)) next.delete(key); else next.add(key);
    setExpanded(next);
  };

  const markChanged = () => { if (!changed) setChanged(true); };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className={`${isLarge ? "text-xl" : "text-lg"} text-[#111827]`} style={{ fontWeight: 700 }}>운영 설정</h1>
          <p className="text-xs text-gray-400 mt-0.5">고객 사이트와 연동되는 핵심 운영 값을 관리합니다</p>
        </div>
        <div className="flex items-center gap-2">
          {changed && <button onClick={() => setChanged(false)} className="px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-gray-500 cursor-pointer hover:bg-gray-50 flex items-center gap-1.5" style={{ fontWeight: 500 }}><RotateCcw size={14} />변경 취소</button>}
          <button onClick={() => setSaveModal(true)} disabled={!changed} className="px-3.5 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65] disabled:opacity-40 disabled:cursor-default flex items-center gap-1.5" style={{ fontWeight: 600 }}><Save size={14} />저장</button>
        </div>
      </div>

      <div className="space-y-3 max-w-3xl">
        {/* Basic Info */}
        <AccordionCard label="조합 기본정보 (고객 노출)" sectionKey="basic" expanded={expanded} toggle={toggle}>
          <div className="space-y-3">
            <SettingField label="조합명" defaultValue="강원농산어촌의료사회적협동조합" onChange={markChanged} />
            <SettingField label="대표전화" defaultValue="추후 개통예정" onChange={markChanged} />
            <SettingField label="주소" defaultValue="추후 게시예정" onChange={markChanged} />
            <SettingField label="운영시간" defaultValue="추후 게시예정" onChange={markChanged} />
            <SettingField label="카카오채널" defaultValue="추후 개설예정" onChange={markChanged} />
            <SettingField label="이메일" defaultValue="추후 게시예정" onChange={markChanged} />
          </div>
        </AccordionCard>

        <AccordionCard label="가입/출자금 설정" sectionKey="join" expanded={expanded} toggle={toggle}>
          <div className="space-y-3">
            <SettingField label="출자금 최소값" defaultValue="10000" type="number" suffix="원" onChange={markChanged} />
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>추천 선택지</label>
              <div className="flex gap-2">
                {["5만원", "10만원", "직접입력"].map((c) => <span key={c} className="px-3 py-1.5 rounded-lg bg-[#1F6B78]/10 text-[#1F6B78] text-xs" style={{ fontWeight: 500 }}>{c}</span>)}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>가입 안내 문구 (일반)</label>
              <textarea defaultValue="조합원 가입 후 출자금을 납입해 주세요" rows={2} onChange={markChanged} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>가입 안내 문구 (어르신)</label>
              <textarea defaultValue="가입하시면 좋은 서비스를 받으실 수 있어요" rows={2} onChange={markChanged} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
            </div>
          </div>
        </AccordionCard>

        <AccordionCard label="서비스 운영 설정" sectionKey="service" expanded={expanded} toggle={toggle}>
          <div className="space-y-3">
            <SettingField label="기본 SLA (확인 기한)" defaultValue="24시간 내 확인" onChange={markChanged} />
            <SettingField label="서비스 시간대" defaultValue="09:00 ~ 18:00" onChange={markChanged} />
            <SettingField label="슬롯 길이" defaultValue="1시간" onChange={markChanged} />
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F8F9FC]">
              <div><p className="text-sm text-[#374151]" style={{ fontWeight: 500 }}>대기열 정책</p><p className="text-xs text-gray-400">용량 초과 시 자동 대기열 이동</p></div>
              <div className="w-10 h-5 rounded-full bg-[#1F6B78] cursor-pointer relative"><div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white shadow" /></div>
            </div>
          </div>
        </AccordionCard>

        <AccordionCard label="커뮤니티 설정" sectionKey="community" expanded={expanded} toggle={toggle}>
          <div className="text-center py-6 text-gray-400">
            <p className="text-sm">댓글/문의 노출 규칙 (추후 구현)</p>
          </div>
        </AccordionCard>

        <AccordionCard label="약관/정책" sectionKey="policy" expanded={expanded} toggle={toggle}>
          <div className="space-y-2">
            {["개인정보 처리방침", "이용약관"].map((p) => (
              <div key={p} className="flex items-center justify-between p-3 rounded-lg bg-[#F8F9FC]">
                <span className="text-sm text-[#374151]">{p}</span>
                <button className="text-xs text-[#1F6B78] cursor-pointer hover:underline">편집 (placeholder)</button>
              </div>
            ))}
          </div>
        </AccordionCard>

        <AccordionCard label="고객용 배너/공지" sectionKey="banner" expanded={expanded} toggle={toggle}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>배너 문구 (일반)</label>
              <input defaultValue="" placeholder="홈 상단 알림 문구 입력..." onChange={markChanged} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>배너 문구 (어르신)</label>
              <input defaultValue="" placeholder="어르신용 쉬운 문구 입력..." onChange={markChanged} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
            </div>
          </div>
        </AccordionCard>

        <p className="text-xs text-gray-400 pt-2">최근 변경: 2026-03-06 09:15 · 관리자 김OO</p>
      </div>

      <ConfirmModal open={saveModal} onClose={() => setSaveModal(false)} onConfirm={() => { alert("설정이 저장되었습니다. (Supabase 연동 후 실제 반영)"); setSaveModal(false); setChanged(false); }} title="설정 저장 확인" message="변경된 설정을 저장하시겠습니까? 고객 화면에 즉시 반영됩니다." confirmLabel="저장" />
    </div>
  );
}

function AccordionCard({ label, sectionKey, expanded, toggle, children }: { label: string; sectionKey: string; expanded: Set<string>; toggle: (k: string) => void; children: React.ReactNode }) {
  const isOpen = expanded.has(sectionKey);
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <button onClick={() => toggle(sectionKey)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer hover:bg-[#F8F9FC]/50">
        <span className="text-sm text-[#111827]" style={{ fontWeight: 600 }}>{label}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <div className="px-5 pb-5 border-t border-gray-100 pt-4">{children}</div>}
    </div>
  );
}

function SettingField({ label, defaultValue, type = "text", suffix, onChange }: { label: string; defaultValue: string; type?: string; suffix?: string; onChange?: () => void }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>{label}</label>
      <div className="flex items-center gap-2">
        <input type={type} defaultValue={defaultValue} onChange={onChange} className="flex-1 px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
        {suffix && <span className="text-xs text-gray-400">{suffix}</span>}
      </div>
    </div>
  );
}
