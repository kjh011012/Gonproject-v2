import { useEffect, useMemo, useState } from "react";
import { Edit2, Eye, Loader2, Plus, Save, Search, Trash2 } from "lucide-react";
import { Badge, StatusBadge } from "../../components/admin/AdminBadge";
import { AdminModal } from "../../components/admin/AdminModal";
import { ServicesPage } from "../Services";
import {
  useCatalogItemsQuery,
  useCatalogSettingsQuery,
  useDeleteCatalogItemMutation,
  useSaveCatalogItemMutation,
  useUpdateCatalogSettingsMutation,
} from "../../hooks/admin/useAdminQueries";

type CatalogItem = {
  id: number;
  code: string;
  publicName: string;
  seniorName: string | null;
  summaryNormal: string;
  summarySenior: string;
  descriptionNormal: string | null;
  descriptionSenior: string | null;
  icon: string | null;
  subtitle: string | null;
  items: string[];
  easyForWho: string[];
  easySteps: Array<{ title: string; desc: string }>;
  applyReasons: string[];
  color: string | null;
  status: string;
  sortOrder: number;
  coverUrl: string | null;
};

type CatalogSettings = {
  hero_image: string;
  hero_image_label: string;
  hero_title: string;
  hero_title_senior: string;
  hero_subtitle: string;
  hero_subtitle_senior: string;
  hero_badge: string;
};

type CatalogForm = {
  code: string;
  publicName: string;
  seniorName: string;
  summaryNormal: string;
  summarySenior: string;
  descriptionNormal: string;
  descriptionSenior: string;
  icon: string;
  subtitle: string;
  color: string;
  itemsText: string;
  easyForWhoText: string;
  easyStepsText: string;
  applyReasonsText: string;
  status: string;
  sortOrder: number;
  coverUrl: string;
};

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: "전체" },
  { value: "published", label: "게시" },
  { value: "draft", label: "초안" },
  { value: "hidden", label: "숨김" },
  { value: "archived", label: "보관" },
];

const ICON_OPTIONS = [
  { value: "stethoscope", label: "의료(stethoscope)" },
  { value: "handHeart", label: "돌봄(handHeart)" },
  { value: "car", label: "이동(car)" },
  { value: "leaf", label: "예방(leaf)" },
];

const STATUS_LABELS: Record<string, string> = {
  draft: "초안",
  published: "게시",
  hidden: "숨김",
  archived: "보관",
};

function statusLabel(status: string) {
  return STATUS_LABELS[status] ?? status;
}

function arrayToText(rows: string[] | null | undefined) {
  return (rows ?? []).map((item) => String(item).trim()).filter(Boolean).join("\n");
}

function textToArray(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function stepsToText(steps: Array<{ title: string; desc: string }> | null | undefined) {
  return (steps ?? [])
    .map((step) => `${step.title ?? ""}|${step.desc ?? ""}`.trim())
    .filter(Boolean)
    .join("\n");
}

function textToSteps(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [titleRaw, ...descParts] = line.split("|");
      const title = titleRaw?.trim() || "단계";
      const desc = descParts.join("|").trim() || "상세 설명";
      return { title, desc };
    });
}

function makeDefaultForm(): CatalogForm {
  return {
    code: "",
    publicName: "",
    seniorName: "",
    summaryNormal: "",
    summarySenior: "",
    descriptionNormal: "",
    descriptionSenior: "",
    icon: "stethoscope",
    subtitle: "",
    color: "#1F6B78",
    itemsText: "",
    easyForWhoText: "",
    easyStepsText: "",
    applyReasonsText: "",
    status: "draft",
    sortOrder: 0,
    coverUrl: "",
  };
}

export function AdminCatalogPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<CatalogItem | null>(null);
  const [form, setForm] = useState<CatalogForm>(makeDefaultForm());

  const [heroImage, setHeroImage] = useState("");
  const [heroImageLabel, setHeroImageLabel] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroTitleSenior, setHeroTitleSenior] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroSubtitleSenior, setHeroSubtitleSenior] = useState("");
  const [heroBadge, setHeroBadge] = useState("");

  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const { data, loading, error, refetch } = useCatalogItemsQuery({
    page: 1,
    pageSize: 200,
    status: statusFilter || undefined,
  });
  const settingsQuery = useCatalogSettingsQuery();

  const saveCatalogItem = useSaveCatalogItemMutation();
  const deleteCatalogItem = useDeleteCatalogItemMutation();
  const updateCatalogSettings = useUpdateCatalogSettingsMutation();

  const items = (data ?? []) as CatalogItem[];

  useEffect(() => {
    const s = settingsQuery.data as CatalogSettings | null;
    if (!s) return;
    setHeroImage(s.hero_image || "");
    setHeroImageLabel(s.hero_image_label || "");
    setHeroTitle(s.hero_title || "");
    setHeroTitleSenior(s.hero_title_senior || "");
    setHeroSubtitle(s.hero_subtitle || "");
    setHeroSubtitleSenior(s.hero_subtitle_senior || "");
    setHeroBadge(s.hero_badge || "");
  }, [settingsQuery.data]);

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          item.publicName.toLowerCase().includes(q)
          || item.code.toLowerCase().includes(q)
          || (item.subtitle || "").toLowerCase().includes(q)
        );
      }),
    [items, search],
  );

  function openCreate() {
    setEditing(null);
    setForm(makeDefaultForm());
    setActionError(null);
    setEditorOpen(true);
  }

  function openEdit(item: CatalogItem) {
    setEditing(item);
    setForm({
      code: item.code,
      publicName: item.publicName,
      seniorName: item.seniorName || "",
      summaryNormal: item.summaryNormal || "",
      summarySenior: item.summarySenior || "",
      descriptionNormal: item.descriptionNormal || "",
      descriptionSenior: item.descriptionSenior || "",
      icon: item.icon || "stethoscope",
      subtitle: item.subtitle || "",
      color: item.color || "#1F6B78",
      itemsText: arrayToText(item.items),
      easyForWhoText: arrayToText(item.easyForWho),
      easyStepsText: stepsToText(item.easySteps),
      applyReasonsText: arrayToText(item.applyReasons),
      status: item.status,
      sortOrder: item.sortOrder,
      coverUrl: item.coverUrl || "",
    });
    setActionError(null);
    setEditorOpen(true);
  }

  async function handleSaveHero() {
    if (!heroImage.trim() || !heroTitle.trim() || !heroSubtitle.trim()) {
      setActionError("히어로 이미지/제목/부제는 필수입니다.");
      return;
    }

    setSaving(true);
    setActionError(null);
    setActionMessage(null);
    try {
      await updateCatalogSettings({
        hero_image: heroImage.trim(),
        hero_image_label: heroImageLabel.trim() || "서비스 메인 이미지",
        hero_title: heroTitle.trim(),
        hero_title_senior: heroTitleSenior.trim() || heroTitle.trim(),
        hero_subtitle: heroSubtitle.trim(),
        hero_subtitle_senior: heroSubtitleSenior.trim() || heroSubtitle.trim(),
        hero_badge: heroBadge.trim() || "서비스 안내",
      });
      await settingsQuery.refetch();
      setActionMessage("메인 히어로 설정을 저장했습니다.");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "히어로 설정 저장 실패");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveItem() {
    if (!form.code.trim() || !form.publicName.trim() || !form.summaryNormal.trim() || !form.summarySenior.trim()) {
      setActionError("코드, 서비스명, 요약(일반/어르신)은 필수입니다.");
      return;
    }

    setSaving(true);
    setActionError(null);
    setActionMessage(null);
    try {
      await saveCatalogItem(editing?.id ?? null, {
        code: form.code.trim(),
        public_name: form.publicName.trim(),
        senior_name: form.seniorName.trim() || null,
        summary_normal: form.summaryNormal.trim(),
        summary_senior: form.summarySenior.trim(),
        description_normal: form.descriptionNormal.trim() || null,
        description_senior: form.descriptionSenior.trim() || null,
        icon: form.icon,
        subtitle: form.subtitle.trim() || null,
        color: form.color.trim() || null,
        items_json: textToArray(form.itemsText),
        easy_for_who_json: textToArray(form.easyForWhoText),
        easy_steps_json: textToSteps(form.easyStepsText),
        apply_reasons_json: textToArray(form.applyReasonsText),
        status: form.status,
        sort_order: Number(form.sortOrder || 0),
        cover_url: form.coverUrl.trim() || null,
      });
      await refetch();
      setEditorOpen(false);
      setEditing(null);
      setActionMessage("카탈로그 항목을 저장했습니다.");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "카탈로그 저장 실패");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteItem(item: CatalogItem) {
    const ok = window.confirm(`[${item.publicName}] 항목을 삭제(숨김)하시겠습니까?`);
    if (!ok) return;
    setSaving(true);
    setActionError(null);
    setActionMessage(null);
    try {
      await deleteCatalogItem(item.id);
      await refetch();
      setActionMessage("카탈로그 항목을 삭제했습니다.");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "카탈로그 삭제 실패");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-[#111827]">
              <Eye size={16} className="text-[#1F6B78]" />
              <h1 className="text-base" style={{ fontWeight: 700 }}>서비스 카탈로그 미러링 관리</h1>
            </div>
            <p className="mt-1 text-xs text-[#6B7280]">
              고객 서비스 페이지와 동일한 소스로 메인 히어로/카드 4개/디테일 텍스트를 관리합니다.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="px-3.5 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65] flex items-center gap-1.5"
            style={{ fontWeight: 600 }}
          >
            <Plus size={14} /> 서비스 항목 추가
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-sm text-[#111827]" style={{ fontWeight: 700 }}>메인 히어로</h2>
          <button
            onClick={() => void handleSaveHero()}
            disabled={saving}
            className="px-3 py-2 rounded-lg bg-[#1F6B78] text-white text-xs disabled:opacity-60 flex items-center gap-1.5"
            style={{ fontWeight: 600 }}
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            히어로 저장
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">히어로 이미지 URL *</label>
            <input
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">이미지 설명</label>
            <input
              value={heroImageLabel}
              onChange={(e) => setHeroImageLabel(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">제목(일반) *</label>
            <input
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">제목(어르신)</label>
            <input
              value={heroTitleSenior}
              onChange={(e) => setHeroTitleSenior(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">부제(일반) *</label>
            <input
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">부제(어르신)</label>
            <input
              value={heroSubtitleSenior}
              onChange={(e) => setHeroSubtitleSenior(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">배지 텍스트</label>
            <input
              value={heroBadge}
              onChange={(e) => setHeroBadge(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="서비스명/코드/소제목 검색..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
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

        {(error || settingsQuery.error || actionError) && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error || settingsQuery.error || actionError}
          </div>
        )}
        {actionMessage && (
          <div className="mt-3 rounded-lg border border-[#1F6B78]/20 bg-[#1F6B78]/5 px-3 py-2 text-sm text-[#1F6B78]">
            {actionMessage}
          </div>
        )}

        <div className="mt-3 overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-[#F8F9FA]">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-gray-400" style={{ fontWeight: 600 }}>코드</th>
                <th className="px-4 py-3 text-left text-xs text-gray-400" style={{ fontWeight: 600 }}>서비스 카드</th>
                <th className="px-4 py-3 text-left text-xs text-gray-400" style={{ fontWeight: 600 }}>디테일</th>
                <th className="px-4 py-3 text-left text-xs text-gray-400" style={{ fontWeight: 600 }}>상태</th>
                <th className="px-4 py-3 text-left text-xs text-gray-400" style={{ fontWeight: 600 }}>순서</th>
                <th className="px-4 py-3 text-left text-xs text-gray-400" style={{ fontWeight: 600 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {(loading || settingsQuery.loading) && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-sm text-gray-400">카탈로그를 불러오는 중...</td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-sm text-gray-400">표시할 카탈로그 항목이 없습니다.</td>
                </tr>
              )}
              {!loading && filtered.map((item) => (
                <tr key={item.id} className="border-t border-gray-50 hover:bg-[#F8F9FA]/50">
                  <td className="px-4 py-3 text-xs text-gray-500">{item.code}</td>
                  <td className="px-4 py-3">
                    <p className="text-[#111827]" style={{ fontWeight: 600 }}>{item.publicName}</p>
                    <p className="text-xs text-gray-400">{item.subtitle || "-"}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate max-w-[260px]">{item.summaryNormal}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    <p>항목 {item.items?.length ?? 0}개 / 대상 {item.easyForWho?.length ?? 0}개</p>
                    <p>단계 {item.easySteps?.length ?? 0}개 / 사유 {item.applyReasons?.length ?? 0}개</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={statusLabel(item.status)} /></td>
                  <td className="px-4 py-3"><Badge variant="neutral">{item.sortOrder}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 cursor-pointer"
                        title="수정"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => void handleDeleteItem(item)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-500 cursor-pointer"
                        title="삭제"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title={editing ? "서비스 항목 수정" : "서비스 항목 추가"}
        size="xl"
        footer={(
          <>
            <button onClick={() => setEditorOpen(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 cursor-pointer">취소</button>
            <button
              onClick={() => void handleSaveItem()}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-sm cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
              style={{ fontWeight: 600 }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : "저장"}
            </button>
          </>
        )}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">코드 *</label>
              <input
                value={form.code}
                onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
                placeholder="medical"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">상태</label>
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
              >
                {STATUS_OPTIONS.filter((s) => s.value).map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">서비스명(일반) *</label>
              <input
                value={form.publicName}
                onChange={(e) => setForm((prev) => ({ ...prev, publicName: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">서비스명(어르신)</label>
              <input
                value={form.seniorName}
                onChange={(e) => setForm((prev) => ({ ...prev, seniorName: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">카드 아이콘</label>
              <select
                value={form.icon}
                onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
              >
                {ICON_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">카드 소제목</label>
              <input
                value={form.subtitle}
                onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
                placeholder="예: 의료 접근성 해결"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">대표 색상</label>
              <input
                value={form.color}
                onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
                placeholder="#1F6B78"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">요약(일반) *</label>
            <input
              value={form.summaryNormal}
              onChange={(e) => setForm((prev) => ({ ...prev, summaryNormal: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">요약(어르신) *</label>
            <input
              value={form.summarySenior}
              onChange={(e) => setForm((prev) => ({ ...prev, summarySenior: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">디테일 소개(1단계 상단)</label>
            <textarea
              rows={2}
              value={form.descriptionNormal}
              onChange={(e) => setForm((prev) => ({ ...prev, descriptionNormal: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm resize-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">디테일 기대효과</label>
            <textarea
              rows={2}
              value={form.descriptionSenior}
              onChange={(e) => setForm((prev) => ({ ...prev, descriptionSenior: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">카드 지원 항목 (줄바꿈 구분)</label>
              <textarea
                rows={4}
                value={form.itemsText}
                onChange={(e) => setForm((prev) => ({ ...prev, itemsText: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">추천 대상 (줄바꿈 구분)</label>
              <textarea
                rows={4}
                value={form.easyForWhoText}
                onChange={(e) => setForm((prev) => ({ ...prev, easyForWhoText: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm resize-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">진행 순서 (한 줄당 `제목|설명`)</label>
            <textarea
              rows={4}
              value={form.easyStepsText}
              onChange={(e) => setForm((prev) => ({ ...prev, easyStepsText: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm resize-none"
              placeholder={"상황 확인|전화로 증상과 필요 도움을 확인합니다.\n방문 진료|의료진이 방문해 진료합니다."}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">신청 사유 버튼 (줄바꿈 구분)</label>
            <textarea
              rows={3}
              value={form.applyReasonsText}
              onChange={(e) => setForm((prev) => ({ ...prev, applyReasonsText: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">정렬 순서</label>
              <input
                type="number"
                value={String(form.sortOrder)}
                onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: Number(e.target.value || 0) }))}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">카드 이미지 URL</label>
              <input
                value={form.coverUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, coverUrl: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm"
              />
            </div>
          </div>

          {actionError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{actionError}</div>
          )}
        </div>
      </AdminModal>

      <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
        <ServicesPage />
      </div>
    </div>
  );
}
