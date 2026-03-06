import { useEffect, useState } from "react";
import {
  CheckCircle2, Stethoscope, HeartHandshake, Car, Leaf,
  ChevronDown, ChevronRight, X,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { useSeniorMode } from "../components/SeniorModeContext";
import { useAuth } from "../components/AuthContext";
import { useServicesCatalog } from "../data/servicesCatalog";
import {
  V, Section, SectionTitle, PhoneButton, FAQAccordion,
} from "../components/shared";
import { ImageHeroSection } from "../components/image-first";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const SENIOR_FAQ = [
  { q: "거동이 불편해도 괜찮나요?", a: "네, 방문 진료·간호 연계를 통해 가능한 방법을 찾아드립니다." },
  { q: "어떤 도움을 받을 수 있나요?", a: "진료, 건강 교육, 재활, 돌봄 연결 등 상황에 맞는 서비스를 안내합니다." },
  { q: "비용은 얼마나 드나요?", a: "상담 후 운영 범위에 따라 안내합니다. 과도한 비용은 발생하지 않습니다." },
  { q: "가족이 대신 신청해도 되나요?", a: "네, 가족 분이 대신 전화하시거나 온라인으로 신청하셔도 됩니다." },
  { q: "출자금이 걱정돼요", a: `${V.출자금_최저}부터 시작할 수 있고, 탈퇴 시 규정에 따라 돌려받습니다.` },
  { q: "어디서 소식을 보나요?", a: "홈페이지 소식/커뮤니티 페이지 또는 문자/카카오 채널로 안내합니다." },
];

/* ─── 아이콘 매핑 ─── */
function CategoryIcon({ icon, size, className }: { icon: string; size: number; className?: string }) {
  switch (icon) {
    case "stethoscope": return <Stethoscope size={size} className={className} />;
    case "handHeart": return <HeartHandshake size={size} className={className} />;
    case "car": return <Car size={size} className={className} />;
    case "leaf": return <Leaf size={size} className={className} />;
    default: return null;
  }
}

export function ServicesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isSenior } = useSeniorMode();
  const { isLoggedIn, isRegistered, isMember } = useAuth();
  const { catalog } = useServicesCatalog();
  const serviceCategories = catalog.categories;
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [flowStep, setFlowStep] = useState<1 | 2>(1);
  const [selectedReasonByCat, setSelectedReasonByCat] = useState<Record<string, string>>({});
  const [appliedReasonByCat, setAppliedReasonByCat] = useState<Record<string, string>>({});

  const openServiceFlow = (catId: string) => {
    setActiveCat(catId);
    setFlowStep(1);
  };
  const closeServiceFlow = () => setActiveCat(null);

  useEffect(() => {
    const catId = searchParams.get("cat");
    if (!catId) return;
    if (!serviceCategories.some((cat) => cat.id === catId)) return;
    window.setTimeout(() => openServiceFlow(catId), 120);
  }, [searchParams, serviceCategories]);

  useEffect(() => {
    if (!activeCat) return;
    if (serviceCategories.some((cat) => cat.id === activeCat)) return;
    setActiveCat(null);
  }, [activeCat, serviceCategories]);

  useEffect(() => {
    if (!activeCat) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeServiceFlow();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeCat]);

  useEffect(() => {
    if (!activeCat) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeCat]);

  const handleApply = (catId: string, catTitle: string) => {
    const redirectPath = `/services?cat=${catId}`;

    if (!isLoggedIn) {
      alert("서비스 신청은 로그인 후 이용할 수 있습니다.");
      navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }

    if (!isRegistered) {
      alert("회원가입이 필요합니다. 회원가입 후 다시 신청해 주세요.");
      navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }

    if (!isMember) {
      const goJoin = window.confirm(
        "조합원 가입이 되어 있어야만 이용이 가능합니다.\n확인을 누르면 조합원 가입 페이지로 이동합니다.",
      );
      if (goJoin) navigate("/join");
      return;
    }

    const selectedReason = selectedReasonByCat[catId];
    if (!selectedReason) {
      alert("신청 사유 버튼을 선택해 주세요.");
      return;
    }

    setAppliedReasonByCat((prev) => ({ ...prev, [catId]: selectedReason }));
    alert(`[${catTitle}] 신청이 접수되었습니다.\n선택한 사유: ${selectedReason}`);
  };

  const activeCategory = activeCat
    ? serviceCategories.find((cat) => cat.id === activeCat) ?? null
    : null;

  return (
    <div>
      {/* ── 히어로 ── */}
      <ImageHeroSection
        image={catalog.heroImage}
        imageLabel={catalog.heroImageLabel}
        title={isSenior ? catalog.heroTitleSenior : catalog.heroTitle}
        subtitle={isSenior ? catalog.heroSubtitleSenior : catalog.heroSubtitle}
        badge={catalog.heroBadge}
        isSenior={isSenior}
      >
        {isSenior && (
          <div className="mt-2">
            <PhoneButton isSenior />
          </div>
        )}
      </ImageHeroSection>

      {/* ── 전체 서비스 (4개 카테고리 카드) ── */}
      <Section bg="bg-[#FAFAFA]">
        {/* 어르신 모드 타이틀만 표시 */}
        {isSenior && (
          <SectionTitle isSenior title="이런 서비스를 해드려요" center />
        )}

        {/* 4개 카테고리 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceCategories.map((cat, idx) => (
            <div
              key={cat.id}
              id={`cat-${cat.id}`}
              onClick={() => openServiceFlow(cat.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openServiceFlow(cat.id);
                }
              }}
              role="button"
              tabIndex={0}
              className={`scroll-mt-24 rounded-2xl overflow-hidden border bg-white hover:shadow-lg transition-shadow flex flex-col ${
                activeCat === cat.id ? "border-[#1F6B78] ring-2 ring-[#1F6B78]/20" : "border-[#E5E7EB]"
              } cursor-pointer`}
            >
              {/* 이미지 영역 */}
              <div className="relative h-44 md:h-52 overflow-hidden">
                <ImageWithFallback
                  src={cat.image}
                  alt={cat.imageLabel}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/70 via-[#111827]/20 to-transparent" />
                {/* 번호 뱃지 */}
                <span
                  className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full text-white text-lg"
                  style={{ backgroundColor: cat.color, fontWeight: 800 }}
                >
                  {idx + 1}
                </span>
                {/* 카테고리 아이콘 + 부제 */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                  <CategoryIcon icon={cat.icon} size={14} className="text-white" />
                  <span className="text-white text-xs" style={{ fontWeight: 600 }}>{cat.subtitle}</span>
                </div>
                {/* 타이틀 오버레이 */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
                  <h3
                    className={`text-white leading-snug ${isSenior ? "text-[22px]" : "text-xl"}`}
                    style={{ fontWeight: 800 }}
                  >
                    {isSenior ? cat.seniorTitle : cat.title}
                  </h3>
                </div>
              </div>

              {/* 텍스트 영역 */}
              <div className={`flex flex-col flex-1 ${isSenior ? "p-5 md:p-6" : "p-4 md:p-5"}`}>
                {/* 서비스 항목 리스트 */}
                <div className="space-y-2.5 mb-4 flex-1">
                  {cat.items.map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <CheckCircle2
                        size={isSenior ? 20 : 18}
                        className="shrink-0"
                        style={{ color: cat.color }}
                      />
                      <span
                        className={`text-[#374151] ${isSenior ? "text-[17px]" : "text-[15px]"}`}
                        style={{ fontWeight: 500 }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 핵심 메시지 */}
                <div
                  className={`rounded-xl border px-4 mb-4 ${isSenior ? "py-4" : "py-3"}`}
                  style={{
                    backgroundColor: `${cat.color}08`,
                    borderColor: `${cat.color}25`,
                  }}
                >
                  <p
                    className={`text-center ${isSenior ? "text-[16px]" : "text-sm"}`}
                    style={{ color: cat.color, fontWeight: 700 }}
                  >
                    {cat.message}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openServiceFlow(cat.id);
                  }}
                  className={`w-full mt-auto py-2.5 min-h-[48px] rounded-lg bg-[#1F6B78] text-white hover:bg-[#185A65] transition-colors cursor-pointer ${isSenior ? "text-[16px]" : "text-sm"}`}
                  style={{ fontWeight: 700 }}
                >
                  단계별로 보기
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 안내 문구 */}
        <p className="text-center text-xs text-[#9CA3AF] mt-6">
          {catalog.disclaimer}
        </p>

      </Section>

      {/* ── 이용 방법 (3단계) ── */}
      <Section>
        <SectionTitle
          isSenior={isSenior}
          title={isSenior ? "이용은 이렇게 해요" : "이용 방법"}
          center
        />
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-0 max-w-3xl mx-auto">
          {[
            { step: "1", title: "전화 한 통", desc: "상황만 말씀해 주세요", icon: "📞" },
            { step: "2", title: "상담 · 안내", desc: "맞춤 서비스를 찾아드려요", icon: "💬" },
            { step: "3", title: "서비스 연결", desc: "필요한 도움을 연결합니다", icon: "🤝" },
          ].map((s, i) => (
            <div key={i} className="contents">
              {/* 카드 */}
              <div className="text-center flex-1 min-w-0">
                <div
                  className={`mx-auto w-16 h-16 rounded-full bg-[#1F6B78]/10 flex items-center justify-center mb-3 ${isSenior ? "w-20 h-20" : ""}`}
                >
                  <span className={`${isSenior ? "text-3xl" : "text-2xl"}`}>{s.icon}</span>
                </div>
                <span className="text-[#1F6B78] text-xs mb-1 block" style={{ fontWeight: 600 }}>
                  STEP {s.step}
                </span>
                <h4
                  className={`text-[#111827] mb-1 ${isSenior ? "text-[20px]" : "text-base"}`}
                  style={{ fontWeight: 700 }}
                >
                  {s.title}
                </h4>
                <p className={`text-[#6B7280] ${isSenior ? "text-[16px]" : "text-sm"}`}>
                  {s.desc}
                </p>
              </div>
              {/* 화살표 (마지막 제외) */}
              {i < 2 && (
                <div className="flex items-center justify-center shrink-0">
                  <div className="flex md:hidden items-center justify-center text-[#67B89A] py-1">
                    <ChevronDown size={24} strokeWidth={2.5} />
                  </div>
                  <div className="hidden md:flex items-center justify-center px-3 pt-8 text-[#67B89A]">
                    <ChevronRight size={28} strokeWidth={2.5} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 전화 CTA */}
        {isSenior && (
          <div className="mt-8 p-5 rounded-xl bg-[#F2EBDD]/60 border border-[#F2EBDD] text-center">
            <p className="text-[#111827] text-[18px]" style={{ fontWeight: 600 }}>
              급하면 오늘 바로 전화 주세요:{" "}
              <span className="text-[#1F6B78]">{V.대표전화}</span>
            </p>
          </div>
        )}
      </Section>

      {/* ── 즉시 행동 (어르신) ── */}
      {isSenior && (
        <Section bg="bg-[#FAFAFA]">
          <SectionTitle isSenior title="오늘 바로 할 수 있는 것" center />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "📞", label: "전화 상담", action: () => alert(`대표전화: ${V.대표전화}`) },
              { icon: "✍️", label: "가입 상담", action: () => navigate("/join") },
              { icon: "📅", label: "모임 일정 확인", action: () => navigate("/community") },
            ].map((a, i) => (
              <button
                key={i}
                onClick={a.action}
                className="flex flex-col items-center gap-3 p-8 rounded-2xl border border-[#E5E7EB] bg-white hover:shadow-md transition-shadow cursor-pointer"
              >
                <span className="text-4xl">{a.icon}</span>
                <span className="text-[#111827] text-[20px]" style={{ fontWeight: 700 }}>{a.label}</span>
              </button>
            ))}
          </div>
        </Section>
      )}

      {/* ── FAQ (어르신) ── */}
      {isSenior && (
        <Section>
          <SectionTitle isSenior title="자주 묻는 질문" />
          <FAQAccordion items={SENIOR_FAQ} isSenior defaultOpen={3} />
        </Section>
      )}

      {/* ── 하단 CTA ── */}
      <Section bg="bg-[#071A2B]">
        <div className="text-center">
          <h2
            className={`text-white mb-4 ${isSenior ? "text-[28px] md:text-[34px]" : "text-2xl md:text-3xl"}`}
            style={{ fontWeight: 700 }}
          >
            {isSenior ? "도움이 필요하면 전화 주세요" : "서비스 상담, 편하게 시작하세요"}
          </h2>
          <p className={`text-white/60 mb-8 max-w-2xl mx-auto ${isSenior ? "text-[18px]" : ""}`}>
            {isSenior
              ? "전화 한 통이면 됩니다. 천천히 안내해 드려요."
              : "조합원 가입 전이라도 상담은 언제든 가능합니다."}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <button
              onClick={() => alert(`대표전화: ${V.대표전화}`)}
              className={`w-full sm:w-auto px-8 rounded-full bg-[#67B89A] text-white hover:bg-[#5AA889] transition-colors cursor-pointer active:scale-[0.98] ${isSenior ? "py-4 min-h-[56px] text-[18px]" : "py-3 min-h-[48px]"}`}
              style={{ fontWeight: 700 }}
            >
              📞 전화로 상담받기
            </button>
            <button
              onClick={() => navigate("/inquiries")}
              className={`w-full sm:w-auto px-8 rounded-full bg-[#1F6B78] text-white hover:bg-[#185A65] transition-colors cursor-pointer active:scale-[0.98] ${isSenior ? "py-4 min-h-[56px] text-[18px]" : "py-3 min-h-[48px]"}`}
              style={{ fontWeight: 700 }}
            >
              상담 요청하기
            </button>
            {!isSenior && (
              <button
                onClick={() => navigate("/join")}
                className="w-full sm:w-auto px-8 py-3 min-h-[48px] rounded-full border border-white/20 text-white/80 hover:bg-white/5 transition-colors cursor-pointer active:scale-[0.98]"
                style={{ fontWeight: 500 }}
              >
                조합원 가입하기
              </button>
            )}
          </div>
        </div>
      </Section>

      {activeCategory && (
        <div
          className="fixed inset-0 z-[120] bg-[#0F172A]/60 p-2.5 sm:p-6 overflow-y-auto"
          onClick={closeServiceFlow}
          role="presentation"
        >
          <div className="flex min-h-full items-start justify-center sm:items-center py-2 sm:py-6">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="service-modal-title"
              className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-[#E5E7EB] h-[calc(100dvh-1.25rem)] sm:h-auto sm:max-h-[92vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] p-5 sm:p-6">
                <div>
                  <p className="text-xs text-[#6B7280]" style={{ fontWeight: 600 }}>서비스 단계 안내</p>
                  <h3 id="service-modal-title" className="mt-1 text-xl text-[#111827]" style={{ fontWeight: 800 }}>
                    {activeCategory.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#4B5563]">{activeCategory.message}</p>
                </div>
                <button
                  onClick={closeServiceFlow}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#475569] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  aria-label="모달 닫기"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="border-b border-[#E5E7EB] px-4 py-3 sm:px-6">
                <div className="grid grid-cols-2 rounded-xl bg-[#F1F5F9] p-1 w-full gap-1">
                  <button
                    onClick={() => setFlowStep(1)}
                    className={`rounded-lg px-3 py-2 text-xs sm:text-sm transition-colors cursor-pointer ${
                      flowStep === 1 ? "bg-white text-[#0F3E47] shadow-sm" : "text-[#64748B]"
                    }`}
                    style={{ fontWeight: 700 }}
                  >
                    1단계 설명 보기
                  </button>
                  <button
                    onClick={() => setFlowStep(2)}
                    className={`rounded-lg px-3 py-2 text-xs sm:text-sm transition-colors cursor-pointer ${
                      flowStep === 2 ? "bg-white text-[#0F3E47] shadow-sm" : "text-[#64748B]"
                    }`}
                    style={{ fontWeight: 700 }}
                  >
                    2단계 신청하기
                  </button>
                </div>
              </div>

              <div className="max-h-[calc(100dvh-214px)] sm:max-h-[calc(92vh-190px)] overflow-y-auto p-4 sm:p-6">
                {flowStep === 1 && (
                  <div className="space-y-5">
                    <div
                      className="rounded-xl border p-4 sm:p-5"
                      style={{
                        borderColor: `${activeCategory.color}2A`,
                        backgroundColor: `${activeCategory.color}0D`,
                      }}
                    >
                      <p className="text-xs text-[#4B5563]" style={{ fontWeight: 700 }}>
                        한눈에 이해하기
                      </p>
                      <h4 className="mt-1 text-[#111827] text-lg" style={{ fontWeight: 800 }}>
                        이 서비스는 무엇을 도와주나요?
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-[#374151]">
                        {activeCategory.easyIntro}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-sm text-[#111827]" style={{ fontWeight: 800 }}>
                        이런 분께 추천해요
                      </h5>
                      <div className="mt-3 space-y-2">
                        {activeCategory.easyForWho.map((target) => (
                          <div
                            key={target}
                            className="rounded-lg border px-3 py-2 text-sm break-keep"
                            style={{
                              borderColor: `${activeCategory.color}3D`,
                              backgroundColor: `${activeCategory.color}10`,
                              color: "#1F2937",
                              fontWeight: 600,
                            }}
                          >
                            {target}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm text-[#111827]" style={{ fontWeight: 800 }}>
                        진행 순서
                      </h5>
                      <div className="mt-3 space-y-2.5">
                        {activeCategory.easySteps.map((step, idx) => (
                          <div key={step.title} className="rounded-xl border border-[#E5E7EB] bg-white p-3.5">
                            <div className="flex items-start gap-2.5">
                              <span
                                className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white text-xs"
                                style={{ backgroundColor: activeCategory.color, fontWeight: 700 }}
                              >
                                {idx + 1}
                              </span>
                              <div>
                                <p className="text-sm text-[#111827]" style={{ fontWeight: 700 }}>
                                  {step.title}
                                </p>
                                <p className="mt-1 text-sm text-[#4B5563] leading-6">
                                  {step.desc}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#D1FAE5] bg-[#ECFDF5] p-4">
                      <p className="text-sm text-emerald-800 leading-6">
                        <span style={{ fontWeight: 700 }}>기대 효과: </span>
                        {activeCategory.easyBenefit}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-sm text-[#111827]" style={{ fontWeight: 800 }}>
                        주요 지원 항목
                      </h5>
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeCategory.items.map((item) => (
                          <div key={item} className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#374151]">
                            <CheckCircle2 size={16} style={{ color: activeCategory.color }} />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setFlowStep(2)}
                      className="w-full rounded-xl bg-[#1F6B78] px-4 py-3 text-white hover:bg-[#185A65] transition-colors cursor-pointer"
                      style={{ fontWeight: 700 }}
                    >
                      다음 단계: 신청하기
                    </button>
                  </div>
                )}

                {flowStep === 2 && (
                  <div className="space-y-5">
                    <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                      <p className="text-sm text-[#475569]">
                        신청은 로그인 상태와 조합원 여부를 확인한 뒤 진행됩니다.
                      </p>
                    </div>

                    {isLoggedIn && isRegistered && isMember && (
                      <div>
                        <h4 className="text-[#111827] text-base" style={{ fontWeight: 700 }}>
                          신청 사유를 선택해 주세요
                        </h4>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {activeCategory.applyReasons.map((reason) => {
                            const selected = selectedReasonByCat[activeCategory.id] === reason;
                            return (
                              <button
                                key={reason}
                                onClick={() => setSelectedReasonByCat((prev) => ({ ...prev, [activeCategory.id]: reason }))}
                                className={`rounded-lg border px-3 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                                  selected
                                    ? "border-[#1F6B78] bg-[#1F6B78]/10 text-[#0F3E47]"
                                    : "border-[#D1D5DB] bg-white text-[#374151] hover:border-[#94A3B8]"
                                }`}
                                style={{ fontWeight: selected ? 700 : 500 }}
                              >
                                {reason}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {appliedReasonByCat[activeCategory.id] && (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                        신청 완료 사유: {appliedReasonByCat[activeCategory.id]}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <button
                        onClick={() => handleApply(activeCategory.id, activeCategory.title)}
                        className="flex-1 rounded-xl bg-[#1F6B78] px-4 py-3 text-white hover:bg-[#185A65] transition-colors cursor-pointer"
                        style={{ fontWeight: 700 }}
                      >
                        {isLoggedIn && isRegistered && isMember ? "서비스 신청 접수" : "상태 확인 후 진행"}
                      </button>
                      <button
                        onClick={() => setFlowStep(1)}
                        className="rounded-xl border border-[#D1D5DB] px-4 py-3 text-[#475569] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                        style={{ fontWeight: 600 }}
                      >
                        1단계 다시 보기
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
