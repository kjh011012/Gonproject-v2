import { useState } from "react";
import {
  Trash2, RotateCcw, Search, AlertTriangle, FileText, Image, MessageSquare, HelpCircle
} from "lucide-react";
import { Badge } from "../../components/admin/AdminBadge";
import { ConfirmModal } from "../../components/admin/AdminModal";
import { useLargeMode } from "../../components/layouts/AdminLayout";

const TABS = ["전체", "콘텐츠", "미디어", "템플릿/FAQ", "기타"] as const;

interface TrashItem {
  id: string; type: string; title: string; deletedAt: string; deletedBy: string;
  originalLocation: string; dependencies: string;
}

const MOCK: TrashItem[] = [
  { id: "TR-001", type: "공지", title: "임시 테스트 공지", deletedAt: "2026-03-04", deletedBy: "최콘텐츠", originalLocation: "콘텐츠 > 공지사항", dependencies: "" },
  { id: "TR-002", type: "행사", title: "테스트 행사 (삭제됨)", deletedAt: "2026-03-03", deletedBy: "최콘텐츠", originalLocation: "콘텐츠 > 건강모임/행사", dependencies: "" },
  { id: "TR-003", type: "이미지", title: "test-image.jpg", deletedAt: "2026-03-02", deletedBy: "이운영", originalLocation: "미디어 라이브러리", dependencies: "" },
  { id: "TR-004", type: "FAQ", title: "테스트 FAQ 항목", deletedAt: "2026-03-01", deletedBy: "정CS", originalLocation: "문의/CS > FAQ 관리", dependencies: "" },
  { id: "TR-005", type: "자료", title: "구버전 보고서.pdf", deletedAt: "2026-02-28", deletedBy: "이운영", originalLocation: "콘텐츠 > 언론/자료", dependencies: "2개의 페이지에서 참조됨" },
  { id: "TR-006", type: "템플릿", title: "폐기된 안내 템플릿", deletedAt: "2026-02-25", deletedBy: "정CS", originalLocation: "문의/CS > 답변 템플릿", dependencies: "" },
];

const typeIcon = (t: string) => {
  if (["공지", "행사", "자료"].includes(t)) return FileText;
  if (t === "이미지") return Image;
  if (t === "FAQ") return HelpCircle;
  return MessageSquare;
};

const typeBadge = (t: string) => {
  if (["공지", "행사"].includes(t)) return "primary" as const;
  if (t === "이미지") return "secondary" as const;
  return "neutral" as const;
};

export function AdminTrashPage() {
  const { isLarge } = useLargeMode();
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [restoreModal, setRestoreModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const filtered = MOCK.filter((item) => {
    if (search && !item.title.includes(search) && !item.type.includes(search)) return false;
    if (tab === "콘텐츠" && !["공지", "행사", "자료"].includes(item.type)) return false;
    if (tab === "미디어" && item.type !== "이미지") return false;
    if (tab === "템플릿/FAQ" && !["템플릿", "FAQ"].includes(item.type)) return false;
    if (tab === "기타" && ["공지", "행사", "자료", "이미지", "템플릿", "FAQ"].includes(item.type)) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((i) => i.id)));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className={`${isLarge ? "text-xl" : "text-lg"} text-[#111827]`} style={{ fontWeight: 700 }}>휴지통 및 복구</h1>
          <p className="text-xs text-gray-400 mt-0.5">삭제된 항목을 복구하거나 영구 삭제합니다</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { if (selected.size > 0) setRestoreModal(true); else alert("복구할 항목을 선택해 주세요"); }} className="px-3.5 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65] flex items-center gap-1.5 disabled:opacity-40" style={{ fontWeight: 600 }}><RotateCcw size={14} />선택 항목 복구</button>
          <button onClick={() => { if (selected.size > 0) setDeleteModal(true); else alert("삭제할 항목을 선택해 주세요"); }} className="px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-gray-600 cursor-pointer hover:bg-gray-50 flex items-center gap-1.5" style={{ fontWeight: 500 }}><Trash2 size={14} />영구 삭제</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-gray-200">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-2.5 text-xs whitespace-nowrap cursor-pointer border-b-2 ${tab === t ? "border-[#1F6B78] text-[#1F6B78]" : "border-transparent text-gray-400 hover:text-gray-600"}`} style={{ fontWeight: tab === t ? 600 : 400 }}>{t}</button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="제목, 유형 검색..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
        </div>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length}건</span>
      </div>

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="bg-[#1F6B78] rounded-xl px-4 py-2.5 flex items-center gap-4 text-white text-sm">
          <span style={{ fontWeight: 600 }}>{selected.size}건 선택</span>
          <div className="flex gap-2 ml-auto">
            <button onClick={() => setRestoreModal(true)} className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs cursor-pointer flex items-center gap-1"><RotateCcw size={11} />일괄 복구</button>
            <button onClick={() => setDeleteModal(true)} className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs cursor-pointer flex items-center gap-1"><Trash2 size={11} />영구 삭제</button>
            <button onClick={() => setSelected(new Set())} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs cursor-pointer">해제</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F8F9FC]">
            <tr>
              <th className="w-10 p-3"><input type="checkbox" checked={filtered.length > 0 && selected.size === filtered.length} onChange={toggleAll} className="accent-[#1F6B78] cursor-pointer" /></th>
              {["유형", "제목/파일명", "삭제일", "삭제자", "원래 위치", ""].map((h) => <th key={h} className="text-left px-4 py-3 text-xs text-[#9CA3AF]" style={{ fontWeight: 600 }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-16 text-gray-400">
                <Trash2 size={24} className="mx-auto mb-2 opacity-30" /><p className="text-sm">휴지통이 비어 있습니다</p>
              </td></tr>
            ) : (
              filtered.map((item) => {
                const Icon = typeIcon(item.type);
                return (
                  <tr key={item.id} className="border-t border-gray-50 hover:bg-[#F8F9FC]/50">
                    <td className="w-10 p-3"><input type="checkbox" checked={selected.has(item.id)} onChange={() => toggleSelect(item.id)} className="accent-[#1F6B78] cursor-pointer" /></td>
                    <td className="px-4 py-3"><Badge variant={typeBadge(item.type)}>{item.type}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Icon size={14} className="text-gray-400 shrink-0" />
                        <span className="text-[#111827]" style={{ fontWeight: 500 }}>{item.title}</span>
                      </div>
                      {item.dependencies && (
                        <p className="text-[10px] text-[#7A6C55] mt-0.5 flex items-center gap-1"><AlertTriangle size={10} />{item.dependencies}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{item.deletedAt}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{item.deletedBy}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{item.originalLocation}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => { setSelected(new Set([item.id])); setRestoreModal(true); }} className="p-1.5 rounded hover:bg-gray-100 text-[#1F6B78] cursor-pointer" title="복구">
                        <RotateCcw size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Restore Confirm */}
      <ConfirmModal
        open={restoreModal}
        onClose={() => setRestoreModal(false)}
        onConfirm={() => { alert(`${selected.size}건 복구 완료 (Supabase 연동 후 실제 반영)`); setRestoreModal(false); setSelected(new Set()); }}
        title="항목 복구"
        message={`선택된 ${selected.size}건의 항목을 원래 위치로 복구하시겠습니까?`}
        confirmLabel="복구"
      />

      {/* Permanent Delete Confirm (2-step) */}
      {deleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setDeleteModal(false); setDeleteConfirmText(""); }} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-base text-[#111827]" style={{ fontWeight: 700 }}>영구 삭제 확인</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} className="text-[#111827]" />
                </div>
                <div>
                  <p className="text-sm text-[#374151]">선택된 <span style={{ fontWeight: 600 }}>{selected.size}건</span>의 항목을 영구 삭제합니다.</p>
                  <p className="text-xs text-gray-400 mt-1">이 작업은 되돌릴 수 없습니다.</p>
                </div>
              </div>
              <div className="bg-[#F2EBDD]/50 rounded-lg p-3">
                <p className="text-xs text-[#7A6C55]"><AlertTriangle size={11} className="inline mr-1" />영구 삭제된 데이터는 복구할 수 없습니다. 신중히 진행해 주세요.</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>"영구삭제"를 입력해 주세요</label>
                <input value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder="영구삭제" className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => { setDeleteModal(false); setDeleteConfirmText(""); }} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">취소</button>
              <button onClick={() => { alert(`${selected.size}건 영구 삭제 (Supabase 연동 후 실제 반영)`); setDeleteModal(false); setDeleteConfirmText(""); setSelected(new Set()); }} disabled={deleteConfirmText !== "영구삭제"} className="px-4 py-2 rounded-lg bg-[#111827] text-white text-sm hover:bg-[#1F2937] cursor-pointer disabled:opacity-40 disabled:cursor-default flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                <AlertTriangle size={14} /> 영구 삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
