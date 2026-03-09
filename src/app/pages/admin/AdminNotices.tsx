import { useMemo, useState } from "react";
import { Plus, Search, Edit2, Eye, Pin, ImageIcon, Monitor, Smartphone, Loader2 } from "lucide-react";
import { StatusBadge, Badge } from "../../components/admin/AdminBadge";
import { AdminModal } from "../../components/admin/AdminModal";
import { useNoticesQuery } from "../../hooks/admin/useAdminQueries";
import { adminApi } from "../../lib/api/admin";

type NoticeItem = {
  id: number;
  title: string;
  summaryNormal: string | null;
  summarySenior: string | null;
  contentNormal: string | null;
  contentSenior: string | null;
  status: string;
  isPinned: boolean;
  coverUrl: string | null;
  createdAt: string;
};

type NoticeForm = {
  title: string;
  status: string;
  summaryNormal: string;
  summarySenior: string;
  contentNormal: string;
  contentSenior: string;
  coverUrl: string;
  isPinned: boolean;
};

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: "전체" },
  { value: "published", label: "게시" },
  { value: "draft", label: "초안" },
  { value: "scheduled", label: "예약" },
  { value: "hidden", label: "숨김" },
  { value: "archived", label: "보관" },
];

const STATUS_LABELS: Record<string, string> = {
  draft: "초안",
  scheduled: "예약",
  published: "게시",
  hidden: "숨김",
  archived: "보관",
};

function statusLabel(status: string) {
  return STATUS_LABELS[status] ?? status;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("ko-KR");
}

function makeDefaultForm(): NoticeForm {
  return {
    title: "",
    status: "draft",
    summaryNormal: "",
    summarySenior: "",
    contentNormal: "",
    contentSenior: "",
    coverUrl: "",
    isPinned: false,
  };
}

export function AdminNotices() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<"normal" | "senior">("normal");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [editing, setEditing] = useState<NoticeItem | null>(null);
  const [form, setForm] = useState<NoticeForm>(makeDefaultForm());
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, loading, error, refetch } = useNoticesQuery({
    page: 1,
    pageSize: 100,
    status: statusFilter || undefined,
  });

  const notices = (data ?? []) as NoticeItem[];
  const filtered = useMemo(
    () => notices.filter((n) => !search || n.title.toLowerCase().includes(search.toLowerCase())),
    [notices, search],
  );

  function openCreate() {
    setEditing(null);
    setForm(makeDefaultForm());
    setActionError(null);
    setEditorOpen(true);
  }

  function openEdit(item: NoticeItem) {
    setEditing(item);
    setForm({
      title: item.title,
      status: item.status,
      summaryNormal: item.summaryNormal || "",
      summarySenior: item.summarySenior || "",
      contentNormal: item.contentNormal || "",
      contentSenior: item.contentSenior || "",
      coverUrl: item.coverUrl || "",
      isPinned: item.isPinned,
    });
    setActionError(null);
    setEditorOpen(true);
  }

  async function handleSave(nextStatusOverride?: string) {
    if (!form.title.trim()) {
      setActionError("제목은 필수입니다.");
      return;
    }

    setSaving(true);
    setActionError(null);
    try {
      const payload = {
        title: form.title.trim(),
        summary_normal: form.summaryNormal.trim() || null,
        summary_senior: form.summarySenior.trim() || null,
        content_normal: form.contentNormal.trim() || null,
        content_senior: form.contentSenior.trim() || null,
        status: nextStatusOverride ?? form.status,
        is_pinned: form.isPinned,
        cover_url: form.coverUrl.trim() || null,
      };

      if (editing) {
        await adminApi.updateNotice(editing.id, payload);
      } else {
        await adminApi.createNotice(payload);
      }

      await refetch();
      setEditorOpen(false);
      setEditing(null);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 max-w-[1200px]">
      <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="공지 검색..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s.value || "all"}
                onClick={() => setStatusFilter(s.value)}
                className={`px-2.5 py-1.5 rounded-lg text-xs cursor-pointer ${
                  statusFilter === s.value ? "bg-[#1F6B78] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
                style={{ fontWeight: statusFilter === s.value ? 600 : 400 }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-sm flex items-center gap-1.5 cursor-pointer"
          style={{ fontWeight: 600 }}
        >
          <Plus size={16} /> 공지 작성
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F8F9FA]">
            <tr>
              <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>유형</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>제목</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 hidden md:table-cell" style={{ fontWeight: 600 }}>상태</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 hidden md:table-cell" style={{ fontWeight: 600 }}>등록일</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 hidden lg:table-cell" style={{ fontWeight: 600 }}>조회</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">공지 목록을 불러오는 중...</td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">표시할 공지가 없습니다.</td>
              </tr>
            )}
            {!loading && filtered.map((n) => (
              <tr key={n.id} className="border-t border-gray-50 hover:bg-[#F8F9FA]/50">
                <td className="px-4 py-3">
                  <Badge variant="primaryLight">공지</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {n.isPinned && <Pin size={12} className="text-[#1F6B78] shrink-0" />}
                    <span className="text-[#111827] truncate max-w-[300px]" style={{ fontWeight: 500 }}>{n.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell"><StatusBadge status={statusLabel(n.status)} /></td>
                <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{formatDate(n.createdAt)}</td>
                <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">-</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(n)}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"
                      title="편집"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => {
                        openEdit(n);
                        setPreviewMode("normal");
                      }}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"
                      title="미리보기"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">{filtered.length}건</div>
      </div>

      <AdminModal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title={editing ? "공지 수정" : "공지 작성"}
        size="lg"
        footer={
          <>
            <button onClick={() => setEditorOpen(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 cursor-pointer">취소</button>
            <button
              onClick={() => void handleSave("draft")}
              disabled={saving}
              className="px-4 py-2 rounded-lg border border-[#1F6B78] text-[#1F6B78] text-sm cursor-pointer disabled:opacity-60"
              style={{ fontWeight: 500 }}
            >
              {saving ? "저장 중..." : "초안 저장"}
            </button>
            <button
              onClick={() => void handleSave("published")}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-sm cursor-pointer disabled:opacity-60"
              style={{ fontWeight: 600 }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : "게시"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>제목 *</label>
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="공지 제목을 입력하세요"
              className="w-full px-3 py-2.5 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>상태</label>
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
              >
                {STATUS_OPTIONS.filter((s) => s.value).map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>커버 이미지 URL</label>
              <input
                value={form.coverUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, coverUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>요약 (일반)</label>
            <input
              value={form.summaryNormal}
              onChange={(e) => setForm((prev) => ({ ...prev, summaryNormal: e.target.value }))}
              placeholder="일반 모드 요약"
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>요약 (어르신)</label>
            <input
              value={form.summarySenior}
              onChange={(e) => setForm((prev) => ({ ...prev, summarySenior: e.target.value }))}
              placeholder="어르신 모드 요약"
              className="w-full px-3 py-2 rounded-lg bg-[#F2EBDD]/30 border border-[#E5D9C3] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>본문 (일반)</label>
            <textarea
              value={form.contentNormal}
              onChange={(e) => setForm((prev) => ({ ...prev, contentNormal: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>본문 (어르신)</label>
            <textarea
              value={form.contentSenior}
              onChange={(e) => setForm((prev) => ({ ...prev, contentSenior: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm resize-none"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPinned}
              onChange={(e) => setForm((prev) => ({ ...prev, isPinned: e.target.checked }))}
              className="accent-[#1F6B78]"
            />
            <span className="text-sm text-[#374151]">상단 고정</span>
          </label>

          {actionError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{actionError}</div>
          )}

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#F8F9FA] border-b border-gray-200">
              <span className="text-xs text-gray-500" style={{ fontWeight: 600 }}>고객 화면 미리보기</span>
              <div className="flex gap-2">
                <div className="flex gap-1 border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setPreviewMode("normal")}
                    className={`px-2.5 py-1 text-[11px] cursor-pointer ${previewMode === "normal" ? "bg-[#1F6B78] text-white" : "text-gray-500"}`}
                  >
                    일반
                  </button>
                  <button
                    onClick={() => setPreviewMode("senior")}
                    className={`px-2.5 py-1 text-[11px] cursor-pointer ${previewMode === "senior" ? "bg-[#67B89A] text-white" : "text-gray-500"}`}
                  >
                    어르신
                  </button>
                </div>
                <div className="flex gap-1 border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setPreviewDevice("desktop")}
                    className={`p-1 cursor-pointer ${previewDevice === "desktop" ? "bg-gray-200" : ""}`}
                  >
                    <Monitor size={14} className="text-gray-500" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice("mobile")}
                    className={`p-1 cursor-pointer ${previewDevice === "mobile" ? "bg-gray-200" : ""}`}
                  >
                    <Smartphone size={14} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
            <div className={`p-4 bg-white ${previewDevice === "mobile" ? "max-w-[390px] mx-auto" : ""}`}>
              <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center text-gray-300 mb-3 overflow-hidden">
                {form.coverUrl ? (
                  <img src={form.coverUrl} alt="cover" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={32} />
                )}
              </div>
              <p className={`text-[#111827] mb-1 ${previewMode === "senior" ? "text-lg" : "text-base"}`} style={{ fontWeight: 700 }}>
                {form.title || "(제목 미리보기)"}
              </p>
              <p className={`text-gray-500 ${previewMode === "senior" ? "text-base" : "text-sm"}`}>
                {previewMode === "senior"
                  ? (form.summarySenior || "(어르신 요약 미리보기)")
                  : (form.summaryNormal || "(일반 요약 미리보기)")}
              </p>
            </div>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
