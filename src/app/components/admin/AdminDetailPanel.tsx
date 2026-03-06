import { useEffect } from "react";
import { X } from "lucide-react";

interface DetailPanelProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
  actions?: React.ReactNode;
}

/**
 * 고정 오버레이 디테일 패널 — 메인 영역 위에 오른쪽에서 슬라이드 인
 * 메인 콘텐츠 레이아웃을 전혀 건드리지 않음
 */
export function AdminDetailPanel({ title, onClose, children, width, actions }: DetailPanelProps) {
  /* Escape 키로 닫기 */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    /* 전체 화면 레이어 */
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      {/* 반투명 배경 (클릭 시 닫기) */}
      <div
        className="absolute inset-0 bg-black/20 pointer-events-auto"
        onClick={onClose}
      />

      {/* 패널 본체 */}
      <div
        className="relative w-full sm:w-[420px] md:w-[460px] max-w-full bg-white shadow-2xl pointer-events-auto flex flex-col
                   animate-in slide-in-from-right duration-200"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-sm text-[#111827] truncate pr-3" style={{ fontWeight: 700 }}>{title}</h3>
          <div className="flex items-center gap-2 shrink-0">
            {actions}
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {children}
        </div>
      </div>
    </div>
  );
}

// Reusable field display row
export function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-[#9CA3AF] mb-1.5" style={{ fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  );
}

// Tabs for detail panel
export function DetailTabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex gap-1 border-b border-gray-100 -mx-5 px-5">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-3 py-2.5 text-xs cursor-pointer border-b-2 transition-colors ${
            active === t
              ? "border-[#1F6B78] text-[#1F6B78]"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
          style={{ fontWeight: active === t ? 600 : 400 }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
