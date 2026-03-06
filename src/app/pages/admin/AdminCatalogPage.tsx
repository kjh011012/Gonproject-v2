import { useState } from "react";
import {
  BookOpen, Plus, Eye, Copy, EyeOff, Grid3X3, List, Search,
  Edit, Smartphone, Monitor, X, ImageIcon, Trash2,
  GripVertical, ChevronDown, ChevronRight, CheckCircle2, AlertTriangle,
  Users, ArrowRight, Save, RotateCcw
} from "lucide-react";
import { Badge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField, DetailTabs } from "../../components/admin/AdminDetailPanel";
import { AdminModal, ConfirmModal } from "../../components/admin/AdminModal";
import { useLargeMode } from "../../components/layouts/AdminLayout";
import { IMG } from "../../components/image-data";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

/* ────────────────────────────────────────
   고객 페이지(Services.tsx)와 동일한 데이터 구조
   → 나중에 Supabase 테이블로 대체
   ──────────────────────────────────────── */

export interface ServiceItem {
  id: string;
  image: string;
  imageLabel: string;
  title: string;
  seniorTitle: string;
  desc: string;
  seniorExample: string;
  status: "운영 중" | "준비 중";
  badge: string[];
  target: string;
  checks: string[];
  process: string[];
  preps: string[];
  costNote: string;
  // 관리자 전용 메타
  order: number;
  visible: boolean;        // 고객 화면 노출 여부
  lastModified: string;
  modifier: string;
}

export interface SituationItem {
  id: string;
  image: string;
  imageLabel: string;
  label: string;
  linkedServiceId: string; // 연결 서비스 ID
  order: number;
  visible: boolean;
}

/* ── 고객 페이지 SERVICES 배열 → 관리용 초기 데이터 ── */
const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: "primary-care", image: IMG.serviceClinic,
    imageLabel: "(이미지) 동네진료: 설명하는 의료진과 어르신",
    title: "동네 진료(주치의처럼)", seniorTitle: "동네 진료(주치의처럼)",
    desc: "내 몸 이야기, 꾸준히 듣고 챙겨요.",
    seniorExample: "혈압약을 자주 놓치는 경우",
    status: "준비 중", badge: ["어르신", "만성질환"],
    target: "만성질환자, 정기 검진이 필요한 분, 상담 중심 진료를 원하는 분",
    checks: ["만성질환(혈압·당뇨 등) 관리", "상담 중심 진료", "건강 상태 기록 관리", "투약 조정 및 처방 안내"],
    process: ["상담 요청(전화/온라인)", "현재 상황 파악", "진료/상담 진행"],
    preps: ["건강보험증(또는 신분증)", "현재 복용 약 목록"],
    costNote: "상담 후 안내드립니다(운영 범위에 따라 다를 수 있어요).",
    order: 1, visible: true, lastModified: "2026-03-05", modifier: "콘텐츠담당",
  },
  {
    id: "home-visit", image: IMG.serviceHomeVisit,
    imageLabel: "(이미지) 방문진료: 가정 방문 상담 장면",
    title: "방문진료(집으로 오는 진료)", seniorTitle: "집으로 오는 진료(가능하면)",
    desc: "걷기 어렵다면 집에서 방법을 찾습니다.",
    seniorExample: "무릎 통증으로 외출이 힘든 경우",
    status: "준비 중", badge: ["거동 불편", "보호자 돌봄"],
    target: "거동 불편 어르신, 장기 요양 대상자, 보호자 돌봄이 필요한 분",
    checks: ["방문진료(의사)", "방문간호(간호사)", "투약 관리 및 건강 체크", "보호자 상담"],
    process: ["서비스 신청(전화/온라인)", "전화 상담 및 배정", "방문 일정 확정 및 진행"],
    preps: ["건강보험증", "복용 약 목록", "최근 진료 기록(있으면)"],
    costNote: "상담 후 안내드립니다(운영 범위에 따라 다를 수 있어요).",
    order: 2, visible: true, lastModified: "2026-03-04", modifier: "콘텐츠담당",
  },
  {
    id: "nursing", image: IMG.serviceNursing,
    imageLabel: "(이미지) 간호도움: 혈압 체크/기초 측정",
    title: "간호 도움(가능 시)", seniorTitle: "간호 도움(가능하면)",
    desc: "집에서도 안전하게 관리하도록 도와요.",
    seniorExample: "상처/투약/교육이 필요한 경우",
    status: "준비 중", badge: ["거동 불편", "돌봄 필요"],
    target: "가정에서 간호가 필요한 분, 상처/투약 관리가 필요한 분",
    checks: ["가정간호 서비스 연계", "상처 관리", "투약 교육", "건강 모니터링"],
    process: ["상담 요청", "필요 파악", "간호 서비스 연결"],
    preps: ["건강보험증", "현재 복용 약"],
    costNote: "상담 후 안내드립니다(운영 범위에 따라 다를 수 있어요).",
    order: 3, visible: true, lastModified: "2026-03-03", modifier: "이운영",
  },
  {
    id: "rehab", image: IMG.serviceRehab,
    imageLabel: "(이미지) 재활: 가벼운 스트레칭 지도",
    title: "회복/재활 안내", seniorTitle: "회복(재활) 안내",
    desc: "아픈 뒤 다시 일상으로 가게 도와요.",
    seniorExample: "퇴원 후 운동/주의가 필요한 경우",
    status: "준비 중", badge: ["회복기", "재활"],
    target: "수술·입원 후 회복기 환자, 시니어 근력 운동이 필요한 분",
    checks: ["재활 운동 프로그램", "기능 회복 훈련", "통증 관리 상담", "일상 복귀 지원"],
    process: ["상담 요청", "현재 상태 평가", "프로그램 배정"],
    preps: ["최근 수술/퇴원 기록(있으면)"],
    costNote: "상담 후 안내드립니다(운영 범위에 따라 다를 수 있어요).",
    order: 4, visible: true, lastModified: "2026-03-01", modifier: "콘텐츠담당",
  },
  {
    id: "welfare-link", image: IMG.serviceCareLink,
    imageLabel: "(이미지) 돌봄연결: 보호자와 상담하는 장면",
    title: "돌봄 연결(복지/요양)", seniorTitle: "돌봄 연결",
    desc: "요양/복지/돌봄을 같이 찾아요.",
    seniorExample: "어디에 신청해야 할지 모를 때",
    status: "준비 중", badge: ["돌봄 필요", "돌봄 연결"],
    target: "돌봄 서비스가 필요한 분, 독거 어르신, 요양 연계가 필요한 분",
    checks: ["복지 기관 연결", "요양 서비스 안내", "돌봄 공백 해소", "가족 돌봄자 상담"],
    process: ["상담 요청", "필요 파악", "기관/서비스 연결"],
    preps: [],
    costNote: "연결·상담 자체는 무료입니다.",
    order: 5, visible: true, lastModified: "2026-02-28", modifier: "이운영",
  },
  {
    id: "prevention", image: IMG.serviceWalking,
    imageLabel: "(이미지) 건강모임: 숲길/마을길 걷기",
    title: "건강 모임/교육", seniorTitle: "건강 모임",
    desc: "같이 걷고, 같이 배우면 오래 갑니다.",
    seniorExample: "혼자 운동이 어려운 경우",
    status: "준비 중", badge: ["누구나", "예방/교육"],
    target: "모든 주민, 가족 단위 참여 가능",
    checks: ["건강 교육(혈압·당뇨 관리)", "운동 프로그램", "건강한 식생활 교육", "소모임 활동"],
    process: ["프로그램 확인", "참가 신청", "일정 안내"],
    preps: ["편한 복장(운동 시)"],
    costNote: "조합원은 대부분 무료이며, 비조합원도 소정의 참가비로 참여 가능합니다.",
    order: 6, visible: true, lastModified: "2026-02-25", modifier: "콘텐츠담당",
  },
];

const INITIAL_SITUATIONS: SituationItem[] = [
  { id: "sit-1", image: IMG.situationKnee, imageLabel: "(이미지) 걷기 힘듦: 무릎/지팡이", label: "걷기 힘들어요(무릎/허리)", linkedServiceId: "home-visit", order: 1, visible: true },
  { id: "sit-2", image: IMG.situationMedicine, imageLabel: "(이미지) 약관리: 약통/복약", label: "약/혈압/당뇨 관리가 어려워요", linkedServiceId: "primary-care", order: 2, visible: true },
  { id: "sit-3", image: IMG.situationLonely, imageLabel: "(이미지) 혼자불안: 따뜻한 조명", label: "혼자 사는데 불안해요", linkedServiceId: "welfare-link", order: 3, visible: true },
  { id: "sit-4", image: IMG.situationRehab, imageLabel: "(이미지) 퇴원후회복: 재활 도움", label: "퇴원했는데 회복이 걱정돼요", linkedServiceId: "rehab", order: 4, visible: true },
  { id: "sit-5", image: IMG.situationCareLink, imageLabel: "(이미지) 돌봄연결: 상담/안내", label: "돌봄/요양을 어디에 물어봐야 할지 모르겠어요", linkedServiceId: "welfare-link", order: 5, visible: true },
  { id: "sit-6", image: IMG.situationPrevention, imageLabel: "(이미지) 예방: 걷기 모임", label: "미리 건강을 챙기고 싶어요", linkedServiceId: "prevention", order: 6, visible: true },
];

/* ── 탭 ── */
const MAIN_TABS = ["서비스 카드", "상황 타일", "숨김 항목"] as const;
type MainTab = (typeof MAIN_TABS)[number];

/* ════════════════════════════════════════
   컴포넌트
   ════════════════════════════════════════ */
export function AdminCatalogPage() {
  const { isLarge } = useLargeMode();

  /* ── state (나중에 Supabase useSWR/useQuery로 교체) ── */
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [situations, setSituations] = useState<SituationItem[]>(INITIAL_SITUATIONS);

  const [tab, setTab] = useState<MainTab>("서비스 카드");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState("고객 노출");

  // Preview
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<"normal" | "senior">("normal");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [previewExpanded, setPreviewExpanded] = useState<string | null>(null);

  // Modals
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [addModal, setAddModal] = useState(false);

  // Edit form (draft)
  const [draft, setDraft] = useState<Partial<ServiceItem>>({});

  /* ── derived ── */
  const visibleServices = services.filter((s) => tab === "숨김 항목" ? !s.visible : s.visible);
  const filtered = visibleServices.filter((s) => !search || s.title.includes(search) || s.id.includes(search) || s.desc.includes(search));
  const selected = services.find((s) => s.id === selectedId) || null;
  const editing = services.find((s) => s.id === editingId) || null;

  /* ── CRUD helpers (local state → Supabase later) ── */
  const updateService = (id: string, patch: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, ...patch, lastModified: new Date().toISOString().slice(0, 10), modifier: "관리자" } : s));
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    if (selectedId === id) setSelectedId(null);
    if (editingId === id) setEditingId(null);
    setDeleteModal(null);
  };

  const duplicateService = (svc: ServiceItem) => {
    const newId = `${svc.id}-copy-${Date.now()}`;
    const newSvc: ServiceItem = { ...svc, id: newId, title: `${svc.title} (복사)`, seniorTitle: `${svc.seniorTitle} (복사)`, order: services.length + 1, visible: false, lastModified: new Date().toISOString().slice(0, 10), modifier: "관리자" };
    setServices((prev) => [...prev, newSvc]);
  };

  const startEdit = (svc: ServiceItem) => {
    setEditingId(svc.id);
    setDraft({ ...svc });
    setDetailTab("고객 노출");
  };

  const saveDraft = () => {
    if (editingId && draft) {
      updateService(editingId, draft);
      setEditingId(null);
      setDraft({});
    }
  };

  const addNewService = () => {
    const newId = `service-${Date.now()}`;
    const newSvc: ServiceItem = {
      id: newId, image: "", imageLabel: "(이미지) 새 서비스",
      title: "새 서비스", seniorTitle: "새 서비스",
      desc: "서비스 설명을 입력하세요", seniorExample: "예시를 입력하세요",
      status: "준비 중", badge: [], target: "", checks: [], process: [],
      preps: [], costNote: "", order: services.length + 1, visible: false,
      lastModified: new Date().toISOString().slice(0, 10), modifier: "관리자",
    };
    setServices((prev) => [...prev, newSvc]);
    setAddModal(false);
    startEdit(newSvc);
  };

  return (
    <div className="space-y-4">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className={`${isLarge ? "text-xl" : "text-lg"} text-[#111827]`} style={{ fontWeight: 700 }}>서비스 카탈로그</h1>
          <p className="text-xs text-gray-400 mt-0.5">고객 서비스 페이지와 1:1 연동 · 등록/수정/삭제 시 고객 화면에 반영됩니다</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setAddModal(true)} className="px-3.5 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65] flex items-center gap-1.5" style={{ fontWeight: 600 }}>
            <Plus size={14} />서비스 추가
          </button>
          <button onClick={() => setPreviewOpen(true)} className="px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-[#374151] cursor-pointer hover:bg-gray-50 flex items-center gap-1.5" style={{ fontWeight: 500 }}>
            <Eye size={14} />고객 화면 미리보기
          </button>
        </div>
      </div>

      {/* ── Info banner ── */}
      <div className="bg-[#F2EBDD]/40 rounded-xl p-3 flex items-start gap-2.5">
        <AlertTriangle size={14} className="text-[#7A6C55] mt-0.5 shrink-0" />
        <p className="text-xs text-[#7A6C55] leading-relaxed">
          이 페이지의 데이터는 고객 페이지(<span style={{ fontWeight: 600 }}>/services</span>)의 서비스 카드·상황 타일과 동일합니다. 수정 사항은 DB 연동 후 고객 화면에 즉시 반영됩니다. 현재는 로컬 상태로 동작합니다.
        </p>
      </div>

      {/* ── Tabs + View toggle ── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1">
          {MAIN_TABS.map((t) => {
            const count = t === "서비스 카드" ? services.filter((s) => s.visible).length : t === "상황 타일" ? situations.length : services.filter((s) => !s.visible).length;
            return (
              <button key={t} onClick={() => { setTab(t); setSelectedId(null); setEditingId(null); }} className={`px-3 py-1.5 text-xs rounded-lg cursor-pointer flex items-center gap-1.5 ${tab === t ? "bg-[#1F6B78] text-white" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"}`} style={{ fontWeight: tab === t ? 600 : 400 }}>
                {t}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${tab === t ? "bg-white/20" : "bg-gray-100 text-gray-400"}`}>{count}</span>
              </button>
            );
          })}
        </div>
        {tab === "서비스 카드" && (
          <div className="flex items-center gap-2">
            <div className="relative max-w-xs">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="서비스 검색..." className="pl-8 pr-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs w-48 focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
            </div>
            <div className="flex items-center gap-0.5 bg-white rounded-lg border border-gray-200 p-0.5">
              <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded cursor-pointer ${viewMode === "grid" ? "bg-[#1F6B78]/10 text-[#1F6B78]" : "text-gray-400"}`}><Grid3X3 size={14} /></button>
              <button onClick={() => setViewMode("list")} className={`p-1.5 rounded cursor-pointer ${viewMode === "list" ? "bg-[#1F6B78]/10 text-[#1F6B78]" : "text-gray-400"}`}><List size={14} /></button>
            </div>
          </div>
        )}
      </div>

      {/* ════════════════════════════════
         TAB: 서비스 카드 / 숨김 항목
         ════════════════════════════════ */}
      {(tab === "서비스 카드" || tab === "숨김 항목") && (
        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((svc) => (
                  <div key={svc.id} onClick={() => { setSelectedId(svc.id); setEditingId(null); }} className={`bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md ${selectedId === svc.id ? "ring-2 ring-[#1F6B78]/30" : ""}`}>
                    {/* 이미지 — 고객 카드와 동일 레이아웃 */}
                    <div className="relative h-44 overflow-hidden">
                      {svc.image ? (
                        <ImageWithFallback src={svc.image} alt={svc.imageLabel} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1F6B78]/10 to-[#67B89A]/10 flex items-center justify-center"><ImageIcon size={28} className="text-gray-300" /></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/60 via-transparent to-transparent" />
                      <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs ${svc.status === "운영 중" ? "bg-[#67B89A] text-white" : "bg-white/90 text-[#6B7280]"}`} style={{ fontWeight: 600 }}>{svc.status}</span>
                      {!svc.visible && <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-gray-800/70 text-white text-[10px]" style={{ fontWeight: 600 }}>숨김</span>}
                      <span className="absolute bottom-2 left-2 text-white/50 text-[9px]">{svc.imageLabel}</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-gray-400">#{svc.order}</span>
                        <div className="flex gap-1">{svc.badge.slice(0, 2).map((b) => <span key={b} className="px-1.5 py-0.5 rounded bg-[#1F6B78]/10 text-[#1F6B78] text-[9px]" style={{ fontWeight: 500 }}>{b}</span>)}</div>
                      </div>
                      <h3 className="text-[#111827] mb-0.5 line-clamp-1" style={{ fontWeight: 700 }}>{svc.title}</h3>
                      <p className="text-gray-500 text-xs line-clamp-1 mb-2">{svc.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">{svc.lastModified} · {svc.modifier}</span>
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => startEdit(svc)} className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer" title="편집"><Edit size={13} /></button>
                          <button onClick={() => duplicateService(svc)} className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer" title="복제"><Copy size={13} /></button>
                          <button onClick={() => setDeleteModal(svc.id)} className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer" title="삭제"><Trash2 size={13} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List view */
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F8F9FC]">
                      <tr>
                        {["순서", "서비스명", "어르신 표시명", "상태", "배지", "노출", "설명", "수정일", ""].map((h) => (
                          <th key={h} className="text-left px-3 py-3 text-xs text-[#9CA3AF] whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((svc) => (
                        <tr key={svc.id} onClick={() => { setSelectedId(svc.id); setEditingId(null); }} className={`border-t border-gray-50 cursor-pointer ${selectedId === svc.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FC]/50"}`}>
                          <td className="px-3 py-3 text-gray-400 text-xs w-12"><div className="flex items-center gap-1"><GripVertical size={12} className="text-gray-300" />{svc.order}</div></td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                                {svc.image ? <ImageWithFallback src={svc.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center"><ImageIcon size={12} className="text-gray-300" /></div>}
                              </div>
                              <span className="text-[#111827]" style={{ fontWeight: 600 }}>{svc.title}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-gray-500 text-xs">{svc.seniorTitle}</td>
                          <td className="px-3 py-3"><Badge variant={svc.status === "운영 중" ? "secondary" : "accent"}>{svc.status}</Badge></td>
                          <td className="px-3 py-3"><div className="flex gap-1 flex-wrap">{svc.badge.map((b) => <span key={b} className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[9px]">{b}</span>)}</div></td>
                          <td className="px-3 py-3">
                            <div onClick={(e) => e.stopPropagation()} className={`w-8 h-4 rounded-full cursor-pointer relative ${svc.visible ? "bg-[#67B89A]" : "bg-gray-300"}`} onClickCapture={() => updateService(svc.id, { visible: !svc.visible })}>
                              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${svc.visible ? "right-0.5" : "left-0.5"}`} />
                            </div>
                          </td>
                          <td className="px-3 py-3 text-gray-500 text-xs max-w-[160px] truncate">{svc.desc}</td>
                          <td className="px-3 py-3 text-xs text-gray-400 whitespace-nowrap">{svc.lastModified}</td>
                          <td className="px-3 py-3">
                            <div className="flex gap-0.5" onClick={(e) => e.stopPropagation()}>
                              <button onClick={() => startEdit(svc)} className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"><Edit size={13} /></button>
                              <button onClick={() => duplicateService(svc)} className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"><Copy size={13} /></button>
                              <button onClick={() => setDeleteModal(svc.id)} className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"><Trash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ── Detail / Edit Panel ── */}
          {(selected || editing) && (
            <AdminDetailPanel
              title={editing ? `편집: ${editing.title}` : selected!.title}
              onClose={() => { setSelectedId(null); setEditingId(null); setDraft({}); }}
              width="w-full xl:w-[460px]"
              actions={
                !editing && selected ? (
                  <button onClick={() => startEdit(selected)} className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 cursor-pointer flex items-center gap-1"><Edit size={12} />편집</button>
                ) : editing ? (
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingId(null); setDraft({}); }} className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 cursor-pointer"><RotateCcw size={12} /></button>
                    <button onClick={saveDraft} className="px-2.5 py-1 rounded-lg bg-[#1F6B78] text-white text-xs hover:bg-[#185A65] cursor-pointer flex items-center gap-1"><Save size={12} />저장</button>
                  </div>
                ) : undefined
              }
            >
              {editing ? (
                /* ── EDIT MODE ── */
                <div className="space-y-1">
                  <DetailTabs tabs={["고객 노출", "운영 메타", "이미지", "미리보기"]} active={detailTab} onChange={setDetailTab} />

                  {detailTab === "고객 노출" && (
                    <div className="space-y-4 pt-2">
                      <EditField label="고객 표시명 (일반)" value={draft.title || ""} onChange={(v) => setDraft({ ...draft, title: v })} />
                      <EditField label="고객 표시명 (어르신)" value={draft.seniorTitle || ""} onChange={(v) => setDraft({ ...draft, seniorTitle: v })} />
                      <EditField label="설명 (일반)" value={draft.desc || ""} onChange={(v) => setDraft({ ...draft, desc: v })} multiline />
                      <EditField label="예시 (어르신)" value={draft.seniorExample || ""} onChange={(v) => setDraft({ ...draft, seniorExample: v })} />
                      <EditField label="이런 분께 필요해요" value={draft.target || ""} onChange={(v) => setDraft({ ...draft, target: v })} multiline />
                      <div>
                        <label className="block text-xs text-[#9CA3AF] mb-1.5" style={{ fontWeight: 600 }}>무엇을 도와드리나요 (체크리스트)</label>
                        <EditableList items={draft.checks || []} onChange={(items) => setDraft({ ...draft, checks: items })} />
                      </div>
                      <div>
                        <label className="block text-xs text-[#9CA3AF] mb-1.5" style={{ fontWeight: 600 }}>이용 방법 (단계)</label>
                        <EditableList items={draft.process || []} onChange={(items) => setDraft({ ...draft, process: items })} />
                      </div>
                      <div>
                        <label className="block text-xs text-[#9CA3AF] mb-1.5" style={{ fontWeight: 600 }}>준비물</label>
                        <EditableList items={draft.preps || []} onChange={(items) => setDraft({ ...draft, preps: items })} />
                      </div>
                      <EditField label="비용 안내" value={draft.costNote || ""} onChange={(v) => setDraft({ ...draft, costNote: v })} multiline />
                      <div>
                        <label className="block text-xs text-[#9CA3AF] mb-1.5" style={{ fontWeight: 600 }}>배지 태그</label>
                        <input value={draft.badge?.join(", ") || ""} onChange={(e) => setDraft({ ...draft, badge: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} placeholder="쉼표로 구분 (예: 어르신, 만성질환)" className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
                      </div>
                    </div>
                  )}

                  {detailTab === "운영 메타" && (
                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="block text-xs text-[#9CA3AF] mb-1.5" style={{ fontWeight: 600 }}>운영 상태</label>
                        <select value={draft.status || "준비 중"} onChange={(e) => setDraft({ ...draft, status: e.target.value as any })} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20">
                          <option>준비 중</option><option>운영 중</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-[#9CA3AF] mb-1.5" style={{ fontWeight: 600 }}>고객 화면 노출</label>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-5 rounded-full cursor-pointer relative ${draft.visible ? "bg-[#67B89A]" : "bg-gray-300"}`} onClick={() => setDraft({ ...draft, visible: !draft.visible })}>
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${draft.visible ? "right-0.5" : "left-0.5"}`} />
                          </div>
                          <span className="text-sm text-[#374151]">{draft.visible ? "게시 중" : "숨김"}</span>
                        </div>
                      </div>
                      <EditField label="정렬 순서" value={String(draft.order || 1)} onChange={(v) => setDraft({ ...draft, order: parseInt(v) || 1 })} type="number" />
                      <div className="bg-[#F8F9FC] rounded-lg p-3 text-xs text-gray-400 space-y-1">
                        <p>서비스 ID: <span className="text-[#374151]" style={{ fontWeight: 500 }}>{editing.id}</span></p>
                        <p>최종 수정: {editing.lastModified} · {editing.modifier}</p>
                      </div>
                    </div>
                  )}

                  {detailTab === "이미지" && (
                    <div className="space-y-4 pt-2">
                      <DetailField label="현재 대표 이미지">
                        {editing.image ? (
                          <div className="relative rounded-xl overflow-hidden h-40">
                            <ImageWithFallback src={editing.image} alt={editing.imageLabel} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center text-gray-400">
                            <ImageIcon size={24} className="mx-auto mb-2 opacity-30" /><p className="text-xs">이미지 없음</p>
                          </div>
                        )}
                      </DetailField>
                      <EditField label="이미지 URL" value={draft.image || ""} onChange={(v) => setDraft({ ...draft, image: v })} placeholder="Unsplash 이미지 URL 또는 업로드 (Supabase 연동 후)" />
                      <EditField label="이미지 alt 텍스트" value={draft.imageLabel || ""} onChange={(v) => setDraft({ ...draft, imageLabel: v })} />
                      <div className="bg-[#F2EBDD]/50 rounded-lg p-3">
                        <p className="text-xs text-[#7A6C55]"><AlertTriangle size={11} className="inline mr-1" />이미지 업로드는 Supabase Storage 연동 후 활성화됩니다. 현재는 URL을 직접 입력하세요.</p>
                      </div>
                    </div>
                  )}

                  {detailTab === "미리보기" && (
                    <div className="space-y-3 pt-2">
                      <div className="flex gap-2">
                        <button onClick={() => setPreviewMode("normal")} className={`px-3 py-1 rounded-lg text-xs cursor-pointer ${previewMode === "normal" ? "bg-[#1F6B78] text-white" : "border border-gray-200 text-gray-500"}`}>일반</button>
                        <button onClick={() => setPreviewMode("senior")} className={`px-3 py-1 rounded-lg text-xs cursor-pointer ${previewMode === "senior" ? "bg-[#1F6B78] text-white" : "border border-gray-200 text-gray-500"}`}>어르신</button>
                      </div>
                      <div className="border border-gray-200 rounded-xl p-3 bg-[#FAFAFA]">
                        <MiniServiceCard svc={{ ...editing, ...draft } as ServiceItem} mode={previewMode} />
                      </div>
                    </div>
                  )}
                </div>
              ) : selected ? (
                /* ── VIEW MODE ── */
                <div className="space-y-4">
                  {/* Poster preview */}
                  <div className="relative rounded-xl overflow-hidden h-40">
                    {selected.image ? (
                      <ImageWithFallback src={selected.image} alt={selected.imageLabel} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1F6B78]/10 to-[#67B89A]/10 flex items-center justify-center"><ImageIcon size={28} className="text-gray-300" /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/60 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-3 text-white text-sm" style={{ fontWeight: 700 }}>{selected.title}</span>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={selected.status === "운영 중" ? "secondary" : "accent"}>{selected.status}</Badge>
                    <Badge variant={selected.visible ? "secondary" : "neutral"}>{selected.visible ? "게시 중" : "숨김"}</Badge>
                    {selected.badge.map((b) => <span key={b} className="px-2 py-0.5 rounded bg-[#1F6B78]/10 text-[#1F6B78] text-[10px]" style={{ fontWeight: 500 }}>{b}</span>)}
                  </div>

                  <DetailField label="어르신 표시명"><p className="text-sm text-[#374151]">{selected.seniorTitle}</p></DetailField>
                  <DetailField label="설명"><p className="text-sm text-[#374151]">{selected.desc}</p></DetailField>
                  <DetailField label="어르신 예시"><p className="text-sm text-[#374151]">{selected.seniorExample}</p></DetailField>
                  <DetailField label="대상자"><p className="text-sm text-[#374151]">{selected.target}</p></DetailField>
                  <DetailField label="제공 서비스">
                    <div className="space-y-1">{selected.checks.map((c) => <div key={c} className="flex items-start gap-1.5"><CheckCircle2 size={13} className="text-[#67B89A] mt-0.5 shrink-0" /><span className="text-sm text-[#374151]">{c}</span></div>)}</div>
                  </DetailField>
                  <DetailField label="이용 절차">
                    <div className="flex gap-2">{selected.process.map((p, i) => <span key={i} className="px-2.5 py-1.5 rounded-lg bg-[#F8F9FC] text-xs text-[#374151]" style={{ fontWeight: 500 }}>{i + 1}. {p}</span>)}</div>
                  </DetailField>
                  {selected.preps.length > 0 && (
                    <DetailField label="준비물">
                      <ul className="space-y-0.5">{selected.preps.map((p) => <li key={p} className="text-sm text-[#374151]">• {p}</li>)}</ul>
                    </DetailField>
                  )}
                  <DetailField label="비용 안내">
                    <div className="bg-[#F2EBDD]/30 rounded-lg p-2.5 text-sm text-[#374151]">{selected.costNote}</div>
                  </DetailField>
                  <DetailField label="수정 정보"><p className="text-xs text-gray-400">#{selected.order} · {selected.lastModified} · {selected.modifier}</p></DetailField>
                </div>
              ) : null}
            </AdminDetailPanel>
          )}
        </div>
      )}

      {/* ════════════════════════════════
         TAB: 상황 타일
         ════════════════════════════════ */}
      {tab === "상황 타일" && (
        <div className="space-y-3">
          <div className="bg-[#F8F9FC] rounded-xl p-3 text-xs text-gray-500">
            고객 서비스 페이지 상단의 "상황별 추천" 타일 6개를 관리합니다. 각 타일은 서비스 카드에 연결됩니다.
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {situations.map((sit) => (
              <div key={sit.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ImageWithFallback src={sit.image} alt={sit.imageLabel} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/70 via-[#111827]/20 to-transparent" />
                  <p className="absolute bottom-3 left-3 text-white text-sm" style={{ fontWeight: 700 }}>{sit.label}</p>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400">#{sit.order} · 연결: {services.find((s) => s.id === sit.linkedServiceId)?.title || sit.linkedServiceId}</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"><Edit size={13} /></button>
                    <div className={`w-8 h-4 rounded-full cursor-pointer relative ${sit.visible ? "bg-[#67B89A]" : "bg-gray-300"}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${sit.visible ? "right-0.5" : "left-0.5"}`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      <ConfirmModal
        open={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={() => deleteModal && deleteService(deleteModal)}
        title="서비스 삭제"
        message={`"${services.find((s) => s.id === deleteModal)?.title}"을(를) 삭제하시겠습니까? 삭제된 서비스는 고객 화면에서 즉시 사라집니다.`}
        confirmLabel="삭제"
        requireReason
        reason=""
        onReasonChange={() => {}}
      />

      {/* ── Add New Service Confirm ── */}
      <AdminModal open={addModal} onClose={() => setAddModal(false)} title="새 서비스 추가" size="sm" footer={
        <div className="flex gap-2">
          <button onClick={() => setAddModal(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">취소</button>
          <button onClick={addNewService} className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-sm hover:bg-[#185A65] cursor-pointer" style={{ fontWeight: 600 }}>추가</button>
        </div>
      }>
        <p className="text-sm text-[#374151] leading-relaxed">새 서비스를 추가하면 기본 정보가 생성되고, 편집 패널이 열립니다. 숨김 상태로 추가되므로 고객에게 바로 보이지 않습니다.</p>
        <div className="mt-3 bg-[#67B89A]/10 rounded-lg p-3 text-xs text-[#2D7A5E]"><CheckCircle2 size={12} className="inline mr-1" />편집 완료 후 노출 토글을 켜면 고객 화면에 반영됩니다.</div>
      </AdminModal>

      {/* ══════════════════════════════
         고객 화면 전체 미리보기 모달
         ══════════════════════════════ */}
      <AdminModal open={previewOpen} onClose={() => setPreviewOpen(false)} title="고객 서비스 페이지 미리보기" size="lg" footer={<button onClick={() => setPreviewOpen(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">닫기</button>}>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setPreviewMode("normal")} className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer ${previewMode === "normal" ? "bg-[#1F6B78] text-white" : "border border-gray-200 text-gray-500"}`}>일반</button>
          <button onClick={() => setPreviewMode("senior")} className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer ${previewMode === "senior" ? "bg-[#1F6B78] text-white" : "border border-gray-200 text-gray-500"}`}>어르신</button>
          <div className="ml-auto flex gap-1">
            <button onClick={() => setPreviewDevice("desktop")} className={`p-1.5 rounded cursor-pointer ${previewDevice === "desktop" ? "text-[#1F6B78] bg-[#1F6B78]/10" : "text-gray-400"}`}><Monitor size={14} /></button>
            <button onClick={() => setPreviewDevice("mobile")} className={`p-1.5 rounded cursor-pointer ${previewDevice === "mobile" ? "text-[#1F6B78] bg-[#1F6B78]/10" : "text-gray-400"}`}><Smartphone size={14} /></button>
          </div>
        </div>
        <div className={`border border-gray-200 rounded-xl bg-[#FAFAFA] overflow-hidden ${previewDevice === "mobile" ? "max-w-sm mx-auto" : ""}`}>
          {/* 상황 타일 */}
          <div className="p-4">
            <p className={`text-center text-[#111827] mb-3 ${previewMode === "senior" ? "text-xl" : "text-base"}`} style={{ fontWeight: 700 }}>{previewMode === "senior" ? "내 상황 고르기" : "상황별 추천"}</p>
            <div className={`grid ${previewDevice === "mobile" ? "grid-cols-2" : "grid-cols-3"} gap-2`}>
              {situations.filter((s) => s.visible).map((sit) => (
                <div key={sit.id} className="relative rounded-lg overflow-hidden aspect-[4/3]">
                  <ImageWithFallback src={sit.image} alt={sit.imageLabel} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/70 via-[#111827]/20 to-transparent" />
                  <p className={`absolute bottom-2 left-2 text-white ${previewMode === "senior" ? "text-sm" : "text-xs"}`} style={{ fontWeight: 700 }}>{sit.label}</p>
                </div>
              ))}
            </div>
          </div>
          {/* 서비스 카드 */}
          <div className="p-4 bg-white">
            <p className={`text-center text-[#111827] mb-3 ${previewMode === "senior" ? "text-xl" : "text-base"}`} style={{ fontWeight: 700 }}>{previewMode === "senior" ? "서비스 한눈에 보기" : "전체 서비스"}</p>
            <div className={`grid ${previewDevice === "mobile" ? "grid-cols-1" : "grid-cols-3"} gap-3`}>
              {services.filter((s) => s.visible).sort((a, b) => a.order - b.order).map((svc) => (
                <div key={svc.id}>
                  <MiniServiceCard svc={svc} mode={previewMode} onClick={() => setPreviewExpanded(previewExpanded === svc.id ? null : svc.id)} />
                  {previewExpanded === svc.id && (
                    <div className="mt-1 p-3 rounded-lg bg-white border border-gray-200 text-xs space-y-2">
                      <p className="text-[#374151]"><span className="text-[#1F6B78]" style={{ fontWeight: 600 }}><Users size={11} className="inline mr-0.5" />이런 분께:</span> {svc.target}</p>
                      {svc.checks.map((c) => <p key={c} className="flex items-start gap-1 text-[#374151]"><CheckCircle2 size={11} className="text-[#67B89A] mt-0.5 shrink-0" />{c}</p>)}
                      <p className="text-gray-400 bg-[#F2EBDD]/30 rounded p-2">비용: {svc.costNote}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}

/* ════════════════════════════════════════
   Sub-components
   ════════════════════════════════════════ */

/** 미니 서비스 포스터 카드 (미리보기용, 고객 카드와 동일 레이아웃) */
function MiniServiceCard({ svc, mode, onClick }: { svc: ServiceItem; mode: "normal" | "senior"; onClick?: () => void }) {
  const isSenior = mode === "senior";
  return (
    <div onClick={onClick} className="rounded-xl overflow-hidden border border-gray-200 bg-white cursor-pointer hover:shadow-md transition-shadow">
      <div className={`relative overflow-hidden ${isSenior ? "h-32" : "h-28"}`}>
        {svc.image ? <ImageWithFallback src={svc.image} alt={svc.imageLabel} className="absolute inset-0 w-full h-full object-cover" /> : <div className="absolute inset-0 bg-gradient-to-br from-[#1F6B78]/10 to-[#67B89A]/10 flex items-center justify-center"><ImageIcon size={20} className="text-gray-300" /></div>}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/60 via-transparent to-transparent" />
        <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] ${svc.status === "운영 중" ? "bg-[#67B89A] text-white" : "bg-white/90 text-gray-500"}`} style={{ fontWeight: 600 }}>{svc.status}</span>
      </div>
      <div className="p-2.5">
        <h3 className={`text-[#111827] line-clamp-1 ${isSenior ? "text-base" : "text-sm"}`} style={{ fontWeight: 700 }}>{isSenior ? svc.seniorTitle : svc.title}</h3>
        <p className={`text-gray-500 line-clamp-1 mt-0.5 ${isSenior ? "text-sm" : "text-xs"}`}>{isSenior ? `예: ${svc.seniorExample}` : svc.desc}</p>
        <button className={`w-full flex items-center justify-center gap-1 rounded-lg bg-[#1F6B78] text-white mt-2 cursor-pointer ${isSenior ? "py-2 text-sm" : "py-1.5 text-xs"}`} style={{ fontWeight: 600 }}>
          {isSenior ? "자세히 보기" : "상세 보기"} <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

/** 편집 필드 */
function EditField({ label, value, onChange, multiline, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs text-[#9CA3AF] mb-1.5" style={{ fontWeight: 600 }}>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
      )}
    </div>
  );
}

/** 편집 가능한 리스트 (체크리스트, 절차, 준비물) */
function EditableList({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400 w-5 text-center">{i + 1}</span>
          <input value={item} onChange={(e) => { const next = [...items]; next[i] = e.target.value; onChange(next); }} className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#F8F9FC] border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"><X size={12} /></button>
        </div>
      ))}
      <button onClick={() => onChange([...items, ""])} className="w-full py-1.5 rounded-lg border border-dashed border-gray-300 text-xs text-gray-400 hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-1">
        <Plus size={12} /> 항목 추가
      </button>
    </div>
  );
}
