import { useMemo, useState } from "react";
import {
  Plus, Search, Edit, GripVertical, Eye,
  Pin, ChevronDown, ChevronRight, Loader2,
} from "lucide-react";
import { Badge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField } from "../../components/admin/AdminDetailPanel";
import { AdminModal } from "../../components/admin/AdminModal";
import { useLargeMode } from "../../components/layouts/AdminLayout";
import { useFaqItemsQuery, useSaveFaqMutation } from "../../hooks/admin/useAdminQueries";

type FaqItem = {
  id: number;
  category: string;
  question: string;
  answerNormal: string;
  answerSenior: string;
  isVisible: boolean;
  isPinned: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

type FaqForm = {
  category: string;
  question: string;
  answerNormal: string;
  answerSenior: string;
  sortOrder: number;
  isVisible: boolean;
  isPinned: boolean;
};

const BASE_CATEGORIES = ["가입/출자금", "서비스 이용", "일정/예약", "개인정보", "기타"];

function makeDefaultForm(): FaqForm {
  return {
    category: "서비스 이용",
    question: "",
    answerNormal: "",
    answerSenior: "",
    sortOrder: 0,
    isVisible: true,
    isPinned: false,
  };
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("ko-KR");
}

export function AdminFAQPage() {
  const { isLarge } = useLargeMode();
  const [tab, setTab] = useState<"all" | "category" | "hidden">("all");
  const [category, setCategory] = useState("전체");
  const [selected, setSelected] = useState<FaqItem | null>(null);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<"normal" | "senior">("normal");
  const [expandedPreview, setExpandedPreview] = useState<Set<number>>(new Set());
  const [form, setForm] = useState<FaqForm>(makeDefaultForm());
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, loading, error, refetch } = useFaqItemsQuery({ page: 1, pageSize: 200, visibleOnly: false });
  const saveFaq = useSaveFaqMutation();

  const items = ((data ?? []) as FaqItem[]).sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return b.id - a.id;
  });

  const categories = useMemo(() => {
    const dynamic = Array.from(new Set(items.map((f) => f.category).filter(Boolean)));
    return ["전체", ...Array.from(new Set([...BASE_CATEGORIES, ...dynamic]))];
  }, [items]);

  const filtered = useMemo(
    () => items
      .filter((f) => {
        if (tab === "hidden") return !f.isVisible;
        if (tab === "category" && category !== "전체") return f.category === category && f.isVisible;
        if (tab === "all") return true;
        return f.isVisible;
      })
      .filter((f) => !search || f.question.toLowerCase().includes(search.toLowerCase())),
    [items, tab, category, search],
  );

  const visibleForPreview = useMemo(() => items.filter((f) => f.isVisible), [items]);

  const togglePreviewExpand = (id: number) => {
    const next = new Set(expandedPreview);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedPreview(next);
  };

  function startCreate() {
    setSelected(null);
    setEditing(true);
    setForm(makeDefaultForm());
    setActionError(null);
  }

  function startEdit(item: FaqItem) {
    setSelected(item);
    setEditing(true);
    setForm({
      category: item.category,
      question: item.question,
      answerNormal: item.answerNormal,
      answerSenior: item.answerSenior,
      sortOrder: item.sortOrder,
      isVisible: item.isVisible,
      isPinned: item.isPinned,
    });
    setActionError(null);
  }

  async function handleSave() {
    if (!form.question.trim() || !form.answerNormal.trim() || !form.answerSenior.trim()) {
      setActionError("질문과 답변(일반/어르신)은 필수입니다.");
      return;
    }

    setSaving(true);
    setActionError(null);
    try {
      await saveFaq(selected?.id ?? null, {
        category: form.category,
        question: form.question.trim(),
        answer_normal: form.answerNormal.trim(),
        answer_senior: form.answerSenior.trim(),
        sort_order: Number(form.sortOrder || 0),
        is_visible: form.isVisible,
        is_pinned: form.isPinned,
      });
      await refetch();
      setEditing(false);
      setSelected(null);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "FAQ 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className={`${isLarge ? "text-xl" : "text-lg"} text-[#111827]`} style={{ fontWeight: 700 }}>FAQ 관리</h1>
          <p className="text-xs text-gray-400 mt-0.5">고객용 FAQ 관리 (일반 + 어르신 답변)</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={startCreate}
            className="px-3.5 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65] flex items-center gap-1.5"
            style={{ fontWeight: 600 }}
          >
            <Plus size={14} /> FAQ 추가
          </button>
          <button
            onClick={() => setPreviewOpen(true)}
            className="px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-[#374151] cursor-pointer hover:bg-gray-50 flex items-center gap-1.5"
            style={{ fontWeight: 500 }}
          >
            <Eye size={14} /> 미리보기
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1">
          {[{ k: "all" as const, l: "전체" }, { k: "category" as const, l: "카테고리별" }, { k: "hidden" as const, l: "숨김" }].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`px-3 py-1.5 text-xs rounded-lg cursor-pointer ${tab === t.k ? "bg-[#1F6B78] text-white" : "bg-white text-gray-500 border border-gray-200"}`}
              style={{ fontWeight: tab === t.k ? 600 : 400 }}
            >
              {t.l}
            </button>
          ))}
          {tab === "category" && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-gray-200 text-xs cursor-pointer focus:outline-none ml-2"
            >
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          )}
        </div>
        <div className="relative max-w-xs w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="질문 검색..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-gray-200 text-sm"
          />
        </div>
      </div>

      {(error || actionError) && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error || actionError}
        </div>
      )}

      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F9FC]">
                <tr>
                  {[
                    "순서",
                    "질문",
                    "카테고리",
                    "노출",
                    "고정",
                    "수정일",
                    "",
                  ].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-[#9CA3AF]" style={{ fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-sm text-gray-400">FAQ 목록을 불러오는 중...</td>
                  </tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-sm text-gray-400">표시할 FAQ가 없습니다.</td>
                  </tr>
                )}
                {!loading && filtered.map((f) => (
                  <tr
                    key={f.id}
                    onClick={() => { setSelected(f); setEditing(false); }}
                    className={`border-t border-gray-50 cursor-pointer ${selected?.id === f.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FC]/50"}`}
                  >
                    <td className="px-4 py-3 text-gray-400 text-xs w-16">
                      <div className="flex items-center gap-1"><GripVertical size={12} className="text-gray-300" />{f.sortOrder}</div>
                    </td>
                    <td className="px-4 py-3 text-[#111827]" style={{ fontWeight: 500 }}>{f.question}</td>
                    <td className="px-4 py-3"><Badge variant="primaryLight">{f.category}</Badge></td>
                    <td className="px-4 py-3">
                      <div className={`w-8 h-4 rounded-full relative ${f.isVisible ? "bg-[#67B89A]" : "bg-gray-300"}`}>
                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow ${f.isVisible ? "right-0.5" : "left-0.5"}`} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">{f.isPinned ? <Pin size={13} className="text-[#1F6B78]" /> : <span className="text-gray-300">-</span>}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{formatDate(f.updatedAt || f.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); startEdit(f); }}
                        className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"
                      >
                        <Edit size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {editing ? (
          <AdminDetailPanel title={selected ? "FAQ 편집" : "FAQ 추가"} onClose={() => { setSelected(null); setEditing(false); }} width="w-full xl:w-[420px]">
            <div className="space-y-4">
              <DetailField label="질문">
                <input
                  value={form.question}
                  onChange={(e) => setForm((prev) => ({ ...prev, question: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm"
                />
              </DetailField>
              <DetailField label="답변 (일반)">
                <textarea
                  value={form.answerNormal}
                  onChange={(e) => setForm((prev) => ({ ...prev, answerNormal: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm resize-none"
                />
              </DetailField>
              <DetailField label="답변 (어르신)">
                <textarea
                  value={form.answerSenior}
                  onChange={(e) => setForm((prev) => ({ ...prev, answerSenior: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm resize-none"
                />
              </DetailField>
              <DetailField label="카테고리">
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm"
                >
                  {categories.filter((c) => c !== "전체").map((c) => <option key={c}>{c}</option>)}
                </select>
              </DetailField>
              <DetailField label="정렬 순서">
                <input
                  type="number"
                  value={String(form.sortOrder)}
                  onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: Number(e.target.value || 0) }))}
                  className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm"
                />
              </DetailField>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-[#374151]">
                  <input
                    type="checkbox"
                    checked={form.isVisible}
                    onChange={(e) => setForm((prev) => ({ ...prev, isVisible: e.target.checked }))}
                    className="accent-[#1F6B78]"
                  />
                  노출
                </label>
                <label className="flex items-center gap-2 text-sm text-[#374151]">
                  <input
                    type="checkbox"
                    checked={form.isPinned}
                    onChange={(e) => setForm((prev) => ({ ...prev, isPinned: e.target.checked }))}
                    className="accent-[#1F6B78]"
                  />
                  상단 고정
                </label>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => { setEditing(false); if (!selected) setForm(makeDefaultForm()); }}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 cursor-pointer hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={() => void handleSave()}
                  disabled={saving}
                  className="flex-1 py-2 rounded-lg bg-[#1F6B78] text-white text-sm cursor-pointer hover:bg-[#185A65] disabled:opacity-60 flex items-center justify-center gap-1.5"
                  style={{ fontWeight: 600 }}
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : "저장"}
                </button>
              </div>
            </div>
          </AdminDetailPanel>
        ) : selected ? (
          <AdminDetailPanel title={selected.question} onClose={() => { setSelected(null); setEditing(false); }} width="w-full xl:w-[420px]">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge variant="primaryLight">{selected.category}</Badge>
                {selected.isPinned && <Badge variant="accent">고정</Badge>}
              </div>
              <DetailField label="답변 (일반)">
                <div className="bg-[#F8F9FC] rounded-lg p-3 text-sm text-[#374151] leading-relaxed">{selected.answerNormal}</div>
              </DetailField>
              <DetailField label="답변 (어르신)">
                <div className="bg-[#F2EBDD]/30 rounded-lg p-3 text-sm text-[#374151] leading-relaxed">{selected.answerSenior}</div>
              </DetailField>
              <button
                onClick={() => startEdit(selected)}
                className="w-full py-2 rounded-lg border border-gray-200 text-xs text-[#374151] hover:bg-gray-50 cursor-pointer"
                style={{ fontWeight: 500 }}
              >
                편집
              </button>
            </div>
          </AdminDetailPanel>
        ) : null}
      </div>

      <AdminModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="고객 화면 미리보기"
        size="lg"
        footer={<button onClick={() => setPreviewOpen(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">닫기</button>}
      >
        <div className="flex gap-2 mb-4">
          <button onClick={() => setPreviewMode("normal")} className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer ${previewMode === "normal" ? "bg-[#1F6B78] text-white" : "border border-gray-200 text-gray-500"}`}>일반</button>
          <button onClick={() => setPreviewMode("senior")} className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer ${previewMode === "senior" ? "bg-[#1F6B78] text-white" : "border border-gray-200 text-gray-500"}`}>어르신</button>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 bg-[#FAFAFA] space-y-2 max-w-lg mx-auto">
          {visibleForPreview.map((f) => (
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
