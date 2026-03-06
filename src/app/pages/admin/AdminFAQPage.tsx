import { useState } from "react";
import {
  HelpCircle, Plus, Search, Edit, GripVertical, Eye, EyeOff,
  Pin, Monitor, Smartphone, ChevronDown, ChevronRight
} from "lucide-react";
import { Badge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField } from "../../components/admin/AdminDetailPanel";
import { AdminModal } from "../../components/admin/AdminModal";
import { useLargeMode } from "../../components/layouts/AdminLayout";

const FAQ_CATEGORIES = ["전체", "가입/출자금", "서비스 이용", "일정/예약", "개인정보", "기타"];

interface FAQ {
  id: string; question: string; category: string; visible: boolean;
  pinned: boolean; order: number; lastModified: string;
  answerNormal: string; answerSenior: string;
}

const MOCK: FAQ[] = [
  { id: "F-001", question: "조합에 가입하려면 어떻게 하나요?", category: "가입/출자금", visible: true, pinned: true, order: 1, lastModified: "2026-03-01", answerNormal: "홈페이지의 '조합원 가입' 페이지에서 신청서를 작성하고 출자금을 납입하시면 됩니다. 출자금은 최소 1만원부터 가능합니다.", answerSenior: "전화로 가입할 수 있어요. 전화번호로 연락하시면 도와드려요. 돈은 1만원부터 넣으시면 돼요." },
  { id: "F-002", question: "출자금은 얼마인가요?", category: "가입/출자금", visible: true, pinned: false, order: 2, lastModified: "2026-02-28", answerNormal: "출자금은 최소 1만원이며, 5만원, 10만원 등 자유롭게 선택하실 수 있습니다. 탈퇴 시 환급받으실 수 있습니다.", answerSenior: "1만원부터 넣으시면 돼요. 나중에 그만두면 돌려드려요." },
  { id: "F-003", question: "어떤 서비스를 이용할 수 있나요?", category: "서비스 이용", visible: true, pinned: false, order: 3, lastModified: "2026-02-25", answerNormal: "방문간호, 건강상담, 방문건강관리, 재활운동, 만성질환관리 등 다양한 서비스를 이용하실 수 있습니다.", answerSenior: "간호사가 집에 오거나, 전화로 상담하거나, 운동 도와드려요." },
  { id: "F-004", question: "서비스 예약은 어떻게 변경하나요?", category: "일정/예약", visible: true, pinned: false, order: 4, lastModified: "2026-02-20", answerNormal: "서비스 예약 변경은 대표전화로 연락하시거나, 홈페이지 문의를 이용해 주세요. 방문 24시간 전까지 변경 가능합니다.", answerSenior: "전화로 말씀하시면 바꿔드려요. 하루 전까지 연락해 주세요." },
  { id: "F-005", question: "개인정보는 어떻게 보호되나요?", category: "개인정보", visible: true, pinned: false, order: 5, lastModified: "2026-02-15", answerNormal: "개인정보처리방침에 따라 엄격하게 관리됩니다. 서비스 제공 목적 외 사용하지 않으며 동의 없이 제3자에 제공하지 않습니다.", answerSenior: "개인정보를 잘 지켜드려요. 다른 곳에 알려주지 않아요." },
  { id: "F-006", question: "탈퇴하고 싶으면 어떻게 하나요?", category: "가입/출자금", visible: false, order: 6, pinned: false, lastModified: "2026-02-10", answerNormal: "대표전화로 탈퇴 의사를 알려주시면 안내해 드립니다. 출자금은 약 2주 내 환급됩니다.", answerSenior: "전화로 말씀하시면 돼요. 넣으신 돈은 2주 안에 돌려드려요." },
];

export function AdminFAQPage() {
  const { isLarge } = useLargeMode();
  const [tab, setTab] = useState<"all" | "category" | "hidden">("all");
  const [category, setCategory] = useState("전체");
  const [selected, setSelected] = useState<FAQ | null>(null);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<"normal" | "senior">("normal");
  const [expandedPreview, setExpandedPreview] = useState<Set<string>>(new Set());

  const filtered = MOCK.filter((f) => {
    if (tab === "hidden") return !f.visible;
    if (tab === "category" && category !== "전체") return f.category === category && f.visible;
    return f.visible;
  }).filter((f) => !search || f.question.includes(search));

  const togglePreviewExpand = (id: string) => {
    const next = new Set(expandedPreview);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedPreview(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className={`${isLarge ? "text-xl" : "text-lg"} text-[#111827]`} style={{ fontWeight: 700 }}>FAQ 관리</h1>
          <p className="text-xs text-gray-400 mt-0.5">고객용 FAQ 관리 (일반 + 어르신 답변)</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65] flex items-center gap-1.5" style={{ fontWeight: 600 }}><Plus size={14} />FAQ 추가</button>
          <button onClick={() => setPreviewOpen(true)} className="px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-[#374151] cursor-pointer hover:bg-gray-50 flex items-center gap-1.5" style={{ fontWeight: 500 }}><Eye size={14} />미리보기</button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1">
          {[{ k: "all" as const, l: "전체" }, { k: "category" as const, l: "카테고리별" }, { k: "hidden" as const, l: "숨김" }].map((t) => (
            <button key={t.k} onClick={() => setTab(t.k)} className={`px-3 py-1.5 text-xs rounded-lg cursor-pointer ${tab === t.k ? "bg-[#1F6B78] text-white" : "bg-white text-gray-500 border border-gray-200"}`} style={{ fontWeight: tab === t.k ? 600 : 400 }}>{t.l}</button>
          ))}
          {tab === "category" && (
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-2 py-1.5 rounded-lg border border-gray-200 text-xs cursor-pointer focus:outline-none ml-2">
              {FAQ_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          )}
        </div>
        <div className="relative max-w-xs w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="질문 검색..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F9FC]"><tr>{["순서", "질문", "카테고리", "노출", "고정", "수정일", ""].map((h) => <th key={h} className="text-left px-4 py-3 text-xs text-[#9CA3AF]" style={{ fontWeight: 600 }}>{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={f.id} onClick={() => { setSelected(f); setEditing(false); }} className={`border-t border-gray-50 cursor-pointer ${selected?.id === f.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FC]/50"}`}>
                    <td className="px-4 py-3 text-gray-400 text-xs w-16">
                      <div className="flex items-center gap-1"><GripVertical size={12} className="text-gray-300" />{f.order}</div>
                    </td>
                    <td className="px-4 py-3 text-[#111827]" style={{ fontWeight: 500 }}>{f.question}</td>
                    <td className="px-4 py-3"><Badge variant="primaryLight">{f.category}</Badge></td>
                    <td className="px-4 py-3">
                      <div className={`w-8 h-4 rounded-full cursor-pointer relative ${f.visible ? "bg-[#67B89A]" : "bg-gray-300"}`}>
                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${f.visible ? "right-0.5" : "left-0.5"}`} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">{f.pinned ? <Pin size={13} className="text-[#1F6B78]" /> : <span className="text-gray-300">-</span>}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{f.lastModified}</td>
                    <td className="px-4 py-3"><button onClick={(e) => { e.stopPropagation(); setSelected(f); setEditing(true); }} className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"><Edit size={13} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <AdminDetailPanel title={editing ? "FAQ 편집" : selected.question} onClose={() => { setSelected(null); setEditing(false); }} width="w-full xl:w-[420px]">
            {editing ? (
              <div className="space-y-4">
                <DetailField label="질문"><input defaultValue={selected.question} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" /></DetailField>
                <DetailField label="답변 (일반)"><textarea defaultValue={selected.answerNormal} rows={4} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" /></DetailField>
                <DetailField label="답변 (어르신, 쉬운 말 3~5줄)"><textarea defaultValue={selected.answerSenior} rows={3} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" /></DetailField>
                <DetailField label="카테고리"><select defaultValue={selected.category} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm cursor-pointer focus:outline-none">{FAQ_CATEGORIES.filter((c) => c !== "전체").map((c) => <option key={c}>{c}</option>)}</select></DetailField>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-[#374151]"><input type="checkbox" defaultChecked={selected.visible} className="accent-[#1F6B78]" />노출</label>
                  <label className="flex items-center gap-2 text-sm text-[#374151]"><input type="checkbox" defaultChecked={selected.pinned} className="accent-[#1F6B78]" />상단 고정</label>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setEditing(false)} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 cursor-pointer hover:bg-gray-50">취소</button>
                  <button onClick={() => { alert("저장 (Supabase 연동 후)"); setEditing(false); }} className="flex-1 py-2 rounded-lg bg-[#1F6B78] text-white text-sm cursor-pointer hover:bg-[#185A65]" style={{ fontWeight: 600 }}>저장</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2"><Badge variant="primaryLight">{selected.category}</Badge>{selected.pinned && <Badge variant="accent">고정</Badge>}</div>
                <DetailField label="답변 (일반)"><div className="bg-[#F8F9FC] rounded-lg p-3 text-sm text-[#374151] leading-relaxed">{selected.answerNormal}</div></DetailField>
                <DetailField label="답변 (어르신)"><div className="bg-[#F2EBDD]/30 rounded-lg p-3 text-sm text-[#374151] leading-relaxed">{selected.answerSenior}</div></DetailField>
                <button onClick={() => setEditing(true)} className="w-full py-2 rounded-lg border border-gray-200 text-xs text-[#374151] hover:bg-gray-50 cursor-pointer" style={{ fontWeight: 500 }}>편집</button>
              </div>
            )}
          </AdminDetailPanel>
        )}
      </div>

      {/* Preview */}
      <AdminModal open={previewOpen} onClose={() => setPreviewOpen(false)} title="고객 화면 미리보기" size="lg" footer={<button onClick={() => setPreviewOpen(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">닫기</button>}>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setPreviewMode("normal")} className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer ${previewMode === "normal" ? "bg-[#1F6B78] text-white" : "border border-gray-200 text-gray-500"}`}>일반</button>
          <button onClick={() => setPreviewMode("senior")} className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer ${previewMode === "senior" ? "bg-[#1F6B78] text-white" : "border border-gray-200 text-gray-500"}`}>어르신</button>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 bg-[#FAFAFA] space-y-2 max-w-lg mx-auto">
          {MOCK.filter((f) => f.visible).map((f) => (
            <div key={f.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button onClick={() => togglePreviewExpand(f.id)} className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer">
                <span className={`${previewMode === "senior" ? "text-base" : "text-sm"} text-[#111827]`} style={{ fontWeight: 600 }}>{f.question}</span>
                {expandedPreview.has(f.id) ? <ChevronDown size={16} className="text-gray-400 shrink-0" /> : <ChevronRight size={16} className="text-gray-400 shrink-0" />}
              </button>
              {expandedPreview.has(f.id) && (
                <div className={`px-4 pb-3 ${previewMode === "senior" ? "text-base" : "text-sm"} text-[#374151] leading-relaxed`}>
                  {previewMode === "senior" ? f.answerSenior : f.answerNormal}
                </div>
              )}
            </div>
          ))}
        </div>
      </AdminModal>
    </div>
  );
}
