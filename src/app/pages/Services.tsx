import { useState } from "react";
import {
  CheckCircle2, Stethoscope, HeartHandshake, Car, Leaf,
  ChevronDown, ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useSeniorMode } from "../components/SeniorModeContext";
import { IMG } from "../components/image-data";
import {
  V, Section, SectionTitle, PhoneButton, FAQAccordion,
} from "../components/shared";
import { ImageHeroSection } from "../components/image-first";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

/* ─── 4대 서비스 카테고리 ─── */
const SERVICE_CATEGORIES = [
  {
    id: "medical",
    icon: "stethoscope" as const,
    image: IMG.catMedical,
    imageLabel: "(이미지) 찾아가는 의료: 방문진료 장면",
    title: "찾아가는 의료 서비스",
    seniorTitle: "의사·간호사가 직접 찾아가요",
    subtitle: "의료 접근성 해결",
    items: ["방문 진료", "방문 간호", "건강 상담", "만성질환 관리"],
    message: "병원이 멀어도 의료가 먼저 찾아갑니다",
    color: "#1F6B78",
    bgLight: "#1F6B78",
  },
  {
    id: "daily-care",
    icon: "handHeart" as const,
    image: IMG.catDailyCare,
    imageLabel: "(이미지) 생활 돌봄: 식사·생활 지원 장면",
    title: "생활 돌봄 서비스",
    seniorTitle: "집에서 돌봄을 받아요",
    subtitle: "일상 지원",
    items: ["전문 돌봄 인력 방문", "식사 및 생활 지원", "안전 확인", "정서 지원"],
    message: "혼자가 아닌 함께하는 돌봄",
    color: "#67B89A",
    bgLight: "#67B89A",
  },
  {
    id: "hospital-support",
    icon: "car" as const,
    image: IMG.catHospitalSupport,
    imageLabel: "(이미지) 병원 이용 지원: 동행·이동 장면",
    title: "병원 이용 지원 서비스",
    seniorTitle: "병원 갈 때 같이 가요",
    subtitle: "이동 문제 해결",
    items: ["병원 동행 서비스", "이동 지원", "예약 지원", "진료 안내"],
    message: "병원 이용의 어려움을 해결합니다",
    color: "#D97706",
    bgLight: "#D97706",
  },
  {
    id: "prevention",
    icon: "leaf" as const,
    image: IMG.catPrevention,
    imageLabel: "(이미지) 건강 예방: 운동·건강교실 장면",
    title: "건강 예방 관리",
    seniorTitle: "미리미리 건강을 챙겨요",
    subtitle: "예방과 건강 증진",
    items: ["건강 체크", "생활 건강 상담", "운동 지도", "식생활 관리"],
    message: "건강할 때부터 미리 챙깁니다",
    color: "#059669",
    bgLight: "#059669",
  },
];

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
  const { isSenior } = useSeniorMode();
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const scrollToCat = (catId: string) => {
    setActiveCat(catId);
    const el = document.getElementById(`cat-${catId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      {/* ── 히어로 ── */}
      <ImageHeroSection
        image={IMG.servicesHero}
        imageLabel="(이미지) 서비스 안내: 의료·돌봄 현장"
        title={isSenior ? "내 상황을 골라주세요" : "진료·돌봄·예방, 끊기지 않게"}
        subtitle={isSenior ? "어렵다면 전화 주세요. 대신 찾아드려요." : "상황에 맞는 서비스를 한눈에 확인하세요."}
        badge="서비스 안내"
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
          {SERVICE_CATEGORIES.map((cat, idx) => (
            <div
              key={cat.id}
              id={`cat-${cat.id}`}
              className="scroll-mt-24 rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white hover:shadow-lg transition-shadow flex flex-col"
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
                <div className="space-y-2.5 flex-1 mb-4">
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
                  className={`rounded-xl border px-4 ${isSenior ? "py-4" : "py-3"}`}
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
              </div>
            </div>
          ))}
        </div>

        {/* 안내 문구 */}
        <p className="text-center text-xs text-[#9CA3AF] mt-6">
          서비스 제공 범위는 운영 단계와 협력기관 연계에 따라 달라질 수 있습니다.
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
    </div>
  );
}