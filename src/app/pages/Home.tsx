import { useNavigate } from "react-router";
import { Hero } from "../components/Hero";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { IMG } from "../components/image-data";
import { useSeniorMode } from "../components/SeniorModeContext";
import {
  Heart,
  Car,
  Users,
  Shield,
  ArrowRight,
  CheckCircle2,
  Star,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  Activity,
  Leaf,
  PhoneCall,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";

/* ─── 치환 변수 ─── */
const V = {
  조합명: "강원농산어촌의료사회적협동조합",
  조합명_짧게: "G온돌봄",
  대표전화: "추후 개통예정",
  카카오채널: "추후개설예정",
  출자금_최저: "50,000원 이상(정관 기준)",
  출자금_예시선택: ["5만원", "10만원", "직접입력"],
  가입소요시간: "1분",
};

/* ─── Colors ─── */
const C = {
  primary: "#1F6B78",
  secondary: "#67B89A",
  accent: "#F2EBDD",
  text: "#111827",
  textSub: "#374151",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  white: "#FFFFFF",
  bg: "#FAFAFA",
};

/* ─── Section A: 문제 공감 3카드 ─── */
const PROBLEMS_NORMAL = [
  {
    icon: MapPin,
    title: "병원이 멀어서",
    desc: "이동·예약·대기가 부담이면 료 시기가 늦어지기 쉽습니다.",
    img: "https://images.unsplash.com/photo-1620790647593-b3a6916c7d60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGVsZGVybHklMjBwYXRpZW50JTIwd29ycmllZCUyMGhvc3BpdGFsJTIwZGlzdGFuY2V8ZW58MXx8fHwxNzcyNzEyMzg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    icon: Heart,
    title: "혼자 아프면 더 불안해서",
    desc: '독거·고령일수록 "누가 연결해주는가"가 건강의 차이를 만듭니다.',
    img: "https://images.unsplash.com/photo-1762126242240-cafa01fb1351?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwbG9uZWx5JTIwbGl2aW5nJTIwYWxvbmUlMjB3b3JyaWVkJTIwaGVhbHRofGVufDF8fHx8MTc3MjcxMjM4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    icon: Activity,
    title: "치료만으로는 부족해서",
    desc: "예방·재활·돌봄이 이어져야 다시 일상이 가능합니다.",
    img: "https://images.unsplash.com/photo-1588645849503-b33cc6a20317?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwdmlzaXQlMjBkb2N0b3IlMjBlbGRlcmx5JTIwY2FyZSUyMHdhcm18ZW58MXx8fHwxNzcyNzEyMzg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

const PROBLEMS_SENIOR = [
  {
    icon: MapPin,
    title: "멀어서 힘들요",
    desc: "왔다 갔다가 큰일이죠.",
  },
  {
    icon: Heart,
    title: "혼자면 더 걱정돼요",
    desc: "누가 옆에서 도와주면 마음이 놓입니다.",
  },
  {
    icon: Activity,
    title: "치료만 하면 끝이 아니에요",
    desc: "회복하고, 다시 일상으로 돌아가야 해요.",
  },
];

/* ─── Section B: 5가지 약속 ─── */
const PROMISE_IMAGES = [
  "https://images.unsplash.com/photo-1708758308011-ed8f5e3b4ca3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLb3JlYW4lMjBydXJhbCUyMGNsaW5pYyUyMGhlYWx0aGNhcmUlMjBhY2Nlc3N8ZW58MXx8fHwxNzcyNzY0MTI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1550058905-c91bce5e0bf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLb3JlYW4lMjBlbGRlcmx5JTIwY2FyZSUyMGNvbW11bml0eSUyMHN1cHBvcnR8ZW58MXx8fHwxNzcyNzY0MTI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1615462696310-09736533dbb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBc2lhbiUyMGRvY3RvciUyMHN0ZXRob3Njb3BlJTIwbWVkaWNhbCUyMGNoZWNrdXB8ZW58MXx8fHwxNzcyNzY0MTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1770236597507-cd06a6b64091?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLb3JlYW4lMjB2aWxsYWdlJTIwY29tbXVuaXR5JTIwZ2F0aGVyaW5nJTIwcGVvcGxlfGVufDF8fHx8MTc3Mjc2NDEzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1766025065806-0ed92891692d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLb3JlYW4lMjBmb3Jlc3QlMjB3ZWxsbmVzcyUyMG5hdHVyZSUyMGZhcm0lMjBmb29kfGVufDF8fHx8MTc3Mjc2NDEzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
];

const PROMISES_NORMAL = [
  { icon: Stethoscope, text: "건강권 보장과 의료 접근성 향상", img: PROMISE_IMAGES[0] },
  { icon: Heart, text: "노인·장애인·외국인 등 취약계층 통합 돌봄", img: PROMISE_IMAGES[1] },
  { icon: Activity, text: "1차 의료 중심 지속가능 건강관리", img: PROMISE_IMAGES[2] },
  { icon: Users, text: "조합원 참여와 민주적 운영", img: PROMISE_IMAGES[3] },
  { icon: Leaf, text: "지역 농임산물 영양관리 + 산림복지 연계 돌봄", img: PROMISE_IMAGES[4] },
];

const PROMISES_SENIOR = [
  { icon: Stethoscope, text: "병원 가기 어려운 분 돕기", img: PROMISE_IMAGES[0] },
  { icon: Heart, text: "어르신 돌봄 연결하기", img: PROMISE_IMAGES[1] },
  { icon: Activity, text: "꾸준히 건강 챙기기", img: PROMISE_IMAGES[2] },
  { icon: Users, text: "우리끼리 투명하게 운영하기", img: PROMISE_IMAGES[3] },
  { icon: Leaf, text: "밥(영양)과 숲(휴식)까지 건강으로", img: PROMISE_IMAGES[4] },
];

/* ─── Section C: 서비스 카드 4개 ─── */
const SERVICES = [
  {
    id: "medical",
    icon: Stethoscope,
    image: IMG.catMedical,
    imageLabel: "(이미지) 찾아가는 의료 서비스",
    title: "찾아가는 의료 서비스",
    desc: "병원이 멀어도 기본 진료와 상담을 받을 수 있어요.",
    points: ["방문 진료", "만성질환 관리"],
    status: "준비 중" as const,
    seniorTitle: "의사·간호사가 찾아가요",
    seniorDesc: "멀리 가지 않아도 진료를 받을 수 있어요.",
  },
  {
    id: "daily-care",
    icon: Heart,
    image: IMG.catDailyCare,
    imageLabel: "(이미지) 생활 돌봄 서비스",
    title: "생활 돌봄 서비스",
    desc: "식사·안전·정서 지원으로 일상을 함께 챙겨요.",
    points: ["생활 지원", "안전 확인"],
    status: "준비 중" as const,
    seniorTitle: "집에서 돌봄을 받아요",
    seniorDesc: "혼자 힘들지 않게 옆에서 도와드려요.",
  },
  {
    id: "hospital-support",
    icon: Car,
    image: IMG.catHospitalSupport,
    imageLabel: "(이미지) 병원 이용 지원 서비스",
    title: "병원 이용 지원 서비스",
    desc: "병원 예약부터 이동·동행까지 부담을 덜어드려요.",
    points: ["병원 동행", "이동·예약 지원"],
    status: "준비 중" as const,
    seniorTitle: "병원 갈 때 같이 가요",
    seniorDesc: "이동이 어려워도 이용할 수 있게 도와드려요.",
  },
  {
    id: "prevention",
    icon: Leaf,
    image: IMG.catPrevention,
    imageLabel: "(이미지) 건강 예방 관리 서비스",
    title: "건강 예방 관리",
    desc: "아프기 전에 건강을 점검하고 생활 습관을 관리해요.",
    points: ["건강 체크", "운동·식생활 안내"],
    status: "준비 중" as const,
    seniorTitle: "미리미리 건강을 챙겨요",
    seniorDesc: "건강할 때부터 미리 관리해요.",
  },
];

/* ─── Section D: 이용 3단계 ─── */
const STEPS_NORMAL = [
  {
    step: "01",
    title: "상담 요청(전화/온라인)",
    desc: "현재 상황을 듣고, 필요한 방향을 함께 정리합니다.",
  },
  {
    step: "02",
    title: "필요한 서비스 연결",
    desc: "진료·방문·교육·돌봄 등 가능한 선택지를 안내합니다.",
  },
  {
    step: "03",
    title: "꾸준한 건강관리",
    desc: "일회성이 아니라, 생활 속에서 이어지도록 돕습니다.",
  },
];

const STEPS_SENIOR = [
  { step: "01", title: "전화 주세요.", desc: "" },
  { step: "02", title: "필요한 도움을 같이 정해요.", desc: "" },
  { step: "03", title: "꾸준히 챙겨드려요.", desc: "" },
];

/* ─── Section E: 조합원 혜택 ─── */
const BENEFITS_NORMAL = [
  "내 생활에 맞춘 건강관리 안내를 더 쉽게 받습니다.",
  "건강교육/모임/예방 프로그램 소식을 우선적으로 받습니다.",
  "지역 돌봄 네트워크와의 연결 창구가 생깁니다.",
  "조합 운영(총회/의견/참여)에 함께할 수 있습니다.",
];

const BENEFITS_SENIOR = [
  "건강 소식을 먼저 받습니다.",
  "모임/강좌에 참여할 수 있어요.",
  "필요한 돌봄을 연결받기 쉬워요.",
  "내 의견이 운영에 반영돼요.",
  "동네가 함께 건강해져요.",
];

/* ─── Section H: FAQ 10개 (듀얼 모드 답변) ─── */
const FAQ_DATA = [
  {
    q: "강원 농산어촌 의료 사회적 협동조합이 뭐예요?",
    a_normal:
      "강원 농산어촌 의료 사회적 협동조합은 지역사회에 필요한 일을 하기 위해 주민이 함께 만들고 운영하는 비영리 조직입니다. 이익을 나누기보다(배당 목적이 아니라) 지역의 건강·돌봄 같은 공익 목적을 위해 운영됩니다.",
    a_senior:
      "우리 동네 사람들이 힘을 모아, 함께 운영하는 '비영리 조합'이에요.",
  },
  {
    q: `${V.조합명}은 어떤 일을 하려고 하나요?`,
    a_normal:
      "농산어촌의 의료 공백과 돌봄 불균형을 줄이기 위해, 건강권과 의료 접근성 향상, 취약계층 통합 돌봄, 1차 의료 중심 건강관리, 영양·산림복지 연계 등 '지역 맞춤형 통합 모델'을 지향합니다.",
    a_senior: "진료도 챙기고, 돌봄도 이어드리는 일을 해요.",
  },
  {
    q: "조합원 가입하면 뭐가 달라지나요?",
    a_normal:
      "조합원은 조합의 주인으로서 소식/프로그램 안내를 우선적으로 받고, 건강교육·모임 참여, 의견 제안·총회 참여 등 운영에 함께할 수 있습니다. (혜택 범위는 운영 정책에 따라 공지됩니다.)",
    a_senior:
      "소식을 먼저 받고, 필요한 도움을 더 쉽게 연결받을 수 있어요.",
  },
  {
    q: "출자금은 꼭 내야 하나요?",
    a_normal:
      "출자금은 조합의 운영 기반(공동 자본)입니다. 금액과 방식은 정관과 운영 정책에 따르며, 가입 화면에서 안내합니다.",
    a_senior:
      "네, 조합을 함께 운영하는 '씨앗돈'이라서 필요해요.",
  },
  {
    q: "출자금은 나중에 돌려받을 수 있나요?",
    a_normal:
      "탈퇴 시에는 정관과 법에서 정한 절차에 따라 출자금 환급이 진행됩니다. 환급 시점/방법은 조합 규정과 총회 승인 등 절차에 따라 달라질 수 있어 FAQ/정관 요약에서 확인하실 수 있습니다.",
    a_senior: "탈퇴하면, 절차에 따라 돌려받습니다.",
  },
  {
    q: "제가 거동이 불편한데, 이용할 수 있나요?",
    a_normal:
      "거동이 불편한 경우 방문 형태(재택/방문) 또는 돌봄 연계 등 가능한 옵션을 상담을 통해 안내합니다. 제공 범위는 운영 단계에 따라 달라질 수 있습니다.",
    a_senior: "네. 먼저 전화 주세요. 가능한 방법을 찾아드려요.",
  },
  {
    q: "병원비가 무조건 할인되나요?",
    a_normal:
      "조합원 혜택은 '정책과 운영 범위'에 따라 달라질 수 있습니다. 홈페이지 공지/가입 안내에서 현재 적용되는 범위를 투명하게 안내하는 방식이 신뢰에 가장 중요합니다.",
    a_senior:
      "무조건은 아니에요. 가능한 항목이 있으면 안내해 드려요.",
  },
  {
    q: "가족도 함께 도움을 받을 수 있나요?",
    a_normal:
      "가족 적용 범위는 조합 운영 정책(정관/내규)에 따라 달라질 수 있습니다. 가입 안내에서 기준을 명확히 안내하고, 문의 시 개별 안내합니다.",
    a_senior:
      "가능한 범위가 있어요. 상황을 보고 안내해 드려요.",
  },
  {
    q: "개인정보는 왜 필요해요?",
    a_normal:
      "가입 처리와 상담 연락을 위해 최소한의 정보만 받습니다. 수집 항목/보관 기간/이용 목적은 동의 화면에서 요약과 함께 제공하고, 자세한 내용은 개인정보처리방침에서 확인할 수 있습니다.",
    a_senior: "연락드리고, 가입 확인하려고 필요해요.",
  },
  {
    q: "공지나 모임 소식은 어디서 보나요?",
    a_normal:
      "홈의 '소식/커뮤니티'와 커뮤니티 페이지에서 공지/모임/자료를 확인할 수 있습니다. 어르신모드에서는 글자를 크게, 필독 공지를 맨 위에 고정해 제공합니다.",
    a_senior: "홈 화면에 '필독 공지'가 있어요.",
  },
];

/* ─── 공지 미리보기 ─── */
const NOTICES_PREVIEW = [
  {
    cat: "필독",
    title: "2026년 상반기 조합원 정기총회 안내",
    date: "2026.02.20",
  },
  {
    cat: "건강모임",
    title: "봄맞이 건강걷기 대회 참가자 모집",
    date: "2026.03.01",
  },
  {
    cat: "새 소식",
    title: "3월 서비스 준비 일정 안내",
    date: "2026.02.28",
  },
  {
    cat: "자료",
    title: "만성질환 자가관리 가이드북 배포",
    date: "2026.02.15",
  },
];

/* ─── 히어로 아래 신뢰 배지 ─── */
const TRUST_BADGES_NORMAL = [
  "주민이 주인(1인 1표)",
  "진료 + 돌봄 + 연결",
  "전화/온라인으로 쉽게 시작",
];
const TRUST_BADGES_SENIOR = [
  "우리 동네가 주인(한 사람 한 표)",
  "진료 + 돌봄을 같이 챙겨요",
  "전화 한 통이면 안내해요",
];

export function HomePage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { isSenior } = useSeniorMode();
  const [showAllFaq, setShowAllFaq] = useState(false);

  const problems = isSenior ? PROBLEMS_SENIOR : PROBLEMS_NORMAL;
  const benefits = isSenior ? BENEFITS_SENIOR : BENEFITS_NORMAL;
  const promises = isSenior ? PROMISES_SENIOR : PROMISES_NORMAL;
  const steps = isSenior ? STEPS_SENIOR : STEPS_NORMAL;
  const trustBadges = isSenior
    ? TRUST_BADGES_SENIOR
    : TRUST_BADGES_NORMAL;
  const visibleFaq = showAllFaq
    ? FAQ_DATA
    : FAQ_DATA.slice(0, 6);

  const sectionPy = isSenior
    ? "py-10 md:py-16 lg:py-20"
    : "py-10 md:py-20 lg:py-28";

  return (
    <div>
      <Hero />

      {/* ═══ Section A: 왜 필요한가 (문제 공감) ═══ */}
      <section className={`${sectionPy} bg-white`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-14">
            <span
              className="inline-block px-4 py-1.5 rounded-full bg-[#F2EBDD] text-[#1F6B78] text-sm mb-4"
              style={{ fontWeight: 600 }}
            >
              왜 필요한가요
            </span>
            <h2
              className={`${isSenior ? "text-[28px] md:text-[34px]" : "text-2xl md:text-3xl"} text-[#111827] mb-4`}
              style={{ fontWeight: 700, lineHeight: 1.3 }}
            >
              {isSenior
                ? "참지 마세요.\n의료진이 찾아갑니다."
                : "참지 마세요.\n찾아가는 진료, 이어지는 돌봄."}
            </h2>
            <p
              className={`text-[#374151] max-w-2xl mx-auto leading-relaxed ${isSenior ? "text-[18px]" : ""}`}
            >
              {isSenior
                ? "병원 가기 힘드시죠. 전문 의료진이 직접 집으로 찾아가고, 경험 많은 사회복지사가 필요한 돌봄까지 이어드립니다. 혼자 걱정하지 마세요."
                : `하루 몇 대 없는 버스로 몇 시간을 써야 겨우 진료 한 번. 퇴원 직후의 환자도, 걸음이 느린 어르신도 그 길을 똑같이 견뎌야 합니다. 혼자 사는 분은 돌봄 없이는 일상조차 버겁습니다. ${V.조합명}은 전문 의료진의 방문진료와 경험 많은 사회복지사의 돌봄 서비스로 이 문제를 해결합니다.`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {problems.map((p, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden bg-[#FAFAFA] border border-[#E5E7EB] hover:shadow-md transition-shadow group"
              >
                {!isSenior && "img" in p && (
                  <div className="h-36 md:h-48 overflow-hidden">
                    <ImageWithFallback
                      src={
                        (p as (typeof PROBLEMS_NORMAL)[0]).img
                      }
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale-[30%]"
                    />
                  </div>
                )}
                <div className={`p-4 md:p-6 ${isSenior ? "p-6 md:p-8" : ""}`}>
                  <div className="flex items-center gap-3 mb-2 md:mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1F6B78]/10 flex items-center justify-center">
                      <p.icon
                        size={20}
                        className="text-[#1F6B78]"
                      />
                    </div>
                    <h3
                      className={`text-[#111827] ${isSenior ? "text-[22px]" : "text-lg"}`}
                      style={{ fontWeight: 600 }}
                    >
                      {p.title}
                    </h3>
                  </div>
                  <p
                    className={`text-[#374151] leading-relaxed ${isSenior ? "text-[18px]" : "text-sm"}`}
                  >
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Section B: 조합은 무엇인가 (정의 + 5약속) ═══ */}
      <section
        className={`${sectionPy}`}
        style={{ backgroundColor: C.accent }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-14">
            <span
              className="inline-block px-4 py-1.5 rounded-full bg-white text-[#1F6B78] text-sm mb-4"
              style={{ fontWeight: 600 }}
            >
              {isSenior ? "우리 조합은요" : "조합 소개"}
            </span>
            <h2
              className={`${isSenior ? "text-[26px] md:text-[32px]" : "text-2xl md:text-3xl"} text-[#111827] max-w-3xl mx-auto mb-6 whitespace-pre-line`}
              style={{ fontWeight: 700, lineHeight: 1.3 }}
            >
              {isSenior
                ? "우리 동네 '건강 우체국'이에요."
                : "주민이 주체가 되어 의료와 돌봄을\n'지역 안에서' 만드는 비영리 사회적협동조합입니다."}
            </h2>
            {isSenior ? (
              <div
                className="max-w-xl mx-auto space-y-2 text-[#374151]"
                style={{ fontSize: 18 }}
              >
                <p>
                  아프면 어디로 가야 할지, 먼저 안내해 드려요.
                </p>
                <p>필요하면 진료도, 돌봄도 '이어' 드려요.</p>
                <p>
                  우리 동네 사람들이 힘을 모아 만든 곳입니다.
                </p>
              </div>
            ) : (
              <p className="text-[#374151] max-w-3xl mx-auto leading-relaxed">
                외부 자본이 아니라, 조합원의 참여와 출자로
                운영되는 지역 기반 조직으로서 건강권과 의료
                접근성을 높이고, 취약계층 통합 돌봄과 지속가능한
                1차 의료 중심 건강관리를 지향합니다.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            {promises.map((p, i) => (
              <div
                key={i}
                className={`group flex flex-col bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-md transition-shadow ${i === 4 ? "col-span-2 sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <div className="relative h-24 md:h-32 overflow-hidden">
                  <ImageWithFallback
                    src={p.img}
                    alt={p.text}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-2 left-2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                    <p.icon size={18} className="text-[#1F6B78]" />
                  </div>
                </div>
                <div className="p-3 md:p-4 text-center">
                  <p
                    className={`text-[#111827] leading-snug ${isSenior ? "text-[15px] md:text-[17px]" : "text-xs md:text-sm"}`}
                    style={{ fontWeight: 600 }}
                  >
                    {p.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 md:mt-12 flex flex-col items-center justify-center gap-3 md:flex-row md:gap-4">
            {isSenior ? (
              <>
                <button
                  onClick={() =>
                    alert(`대표전화: ${V.대표전화}`)
                  }
                  className="w-full md:w-auto px-8 py-4 min-h-[52px] rounded-full bg-[#1F6B78] text-white hover:bg-[#185A65] transition-colors cursor-pointer shadow-lg active:scale-[0.98]"
                  style={{ fontWeight: 700, fontSize: 18 }}
                >
                  <PhoneCall
                    size={20}
                    className="inline mr-2"
                  />
                  전화로 안내받기({V.대표전화})
                </button>
                <button
                  onClick={() => navigate("/join")}
                  className="w-full md:w-auto px-8 py-4 min-h-[52px] rounded-full border-2 border-[#1F6B78] text-[#1F6B78] hover:bg-[#1F6B78]/5 transition-colors cursor-pointer active:scale-[0.98]"
                  style={{ fontWeight: 600, fontSize: 18 }}
                >
                  조합원 가입하기
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/about")}
                  className="w-full md:w-auto px-6 py-3 min-h-[48px] rounded-full bg-[#1F6B78] text-white hover:bg-[#185A65] transition-colors cursor-pointer active:scale-[0.98]"
                  style={{ fontWeight: 600 }}
                >
                  {V.조합명_짧게} 소개 자세히 보기{" "}
                  <ArrowRight
                    size={16}
                    className="inline ml-1"
                  />
                </button>
                <button
                  onClick={() => {
                    const el =
                      document.getElementById("faq-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full md:w-auto px-6 py-3 min-h-[48px] rounded-full border border-[#1F6B78] text-[#1F6B78] hover:bg-[#1F6B78]/5 transition-colors cursor-pointer active:scale-[0.98]"
                  style={{ fontWeight: 600 }}
                >
                  왜 사회적협동조합인가요?
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ═══ Section C: 서비스 맵 ═══ */}
      <section className={`${sectionPy} bg-white`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <span
              className="inline-block px-4 py-1.5 rounded-full bg-[#F2EBDD] text-[#1F6B78] text-sm mb-4"
              style={{ fontWeight: 600 }}
            >
              서비스 안내
            </span>
            <h2
              className={`${isSenior ? "text-[28px] md:text-[34px]" : "text-2xl md:text-3xl"} text-[#111827] mb-4`}
              style={{ fontWeight: 700 }}
            >
              {isSenior
                ? "필요한 도움을 '딱 쉽게'."
                : "진료만 하는 곳이 아니라, '필요한 돌봄을 연결하는 곳'입니다."}
            </h2>
          </div>
          <p
            className={`text-center text-[#6B7280] mb-8 md:mb-14 ${isSenior ? "text-[17px]" : "text-sm"}`}
          >
            {isSenior
              ? "4가지 도움만 먼저 보여드릴게요. 필요한 항목을 눌러 자세히 보세요."
              : "핵심 서비스 4가지만 먼저 확인하고, 자세한 내용은 서비스 페이지에서 보세요."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="bg-[#FAFAFA] rounded-2xl border border-[#E5E7EB] p-5 md:p-6 hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="-mx-5 -mt-5 md:-mx-6 md:-mt-6 mb-4 relative">
                  <div className="h-44 md:h-48 overflow-hidden rounded-t-2xl">
                    <ImageWithFallback
                      src={s.image}
                      alt={s.imageLabel}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/55 via-[#111827]/10 to-transparent" />
                  </div>
                  <div className="absolute top-3 left-3 w-11 h-11 rounded-lg bg-white/85 backdrop-blur-sm flex items-center justify-center border border-white/70">
                    <s.icon size={22} className="text-[#1F6B78]" />
                  </div>
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs ${
                      s.status === "운영 중"
                        ? "bg-[#67B89A] text-white"
                        : "bg-white/90 text-[#6B7280]"
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {s.status}
                  </span>
                </div>
                <h3
                  className={`text-[#111827] mb-2 ${isSenior ? "text-[20px]" : "text-lg"}`}
                  style={{ fontWeight: 700 }}
                >
                  {isSenior ? s.seniorTitle : s.title}
                </h3>
                <p
                  className={`text-[#374151] leading-relaxed mb-4 ${isSenior ? "text-[17px]" : "text-sm"}`}
                >
                  {isSenior ? s.seniorDesc : s.desc}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {s.points.map((point) => (
                    <span
                      key={point}
                      className={`inline-flex items-center gap-1.5 rounded-full bg-[#1F6B78]/8 text-[#1F6B78] px-3 py-1 ${isSenior ? "text-[15px]" : "text-xs"}`}
                      style={{ fontWeight: 600 }}
                    >
                      <CheckCircle2 size={14} />
                      {point}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <button
                    onClick={() => navigate(`/services?cat=${s.id}`)}
                    className={`w-full py-2.5 min-h-[48px] rounded-lg bg-[#1F6B78] text-white text-sm hover:bg-[#185A65] transition-colors cursor-pointer active:scale-[0.98] ${isSenior ? "text-[16px]" : ""}`}
                    style={{ fontWeight: 600 }}
                  >
                    서비스 자세히 보기
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 md:mt-8 text-center">
            <button
              onClick={() =>
                alert(`대표전화: ${V.대표전화}`)
              }
              className={`px-6 py-3 min-h-[48px] rounded-full border border-[#E5E7EB] text-[#374151] hover:bg-gray-50 transition-colors cursor-pointer active:scale-[0.98] ${isSenior ? "text-[17px]" : "text-sm"}`}
              style={{ fontWeight: 600 }}
            >
              <Phone size={16} className="inline mr-1.5" />
              전화로 바로 문의하기
            </button>
          </div>
        </div>
      </section>

      {/* ═══ Section D: 이용 방법 3단계 ═══ */}
      <section
        className={`${sectionPy}`}
        style={{ backgroundColor: C.bg }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-14">
            <span
              className="inline-block px-4 py-1.5 rounded-full bg-[#67B89A]/15 text-[#1F6B78] text-sm mb-4"
              style={{ fontWeight: 600 }}
            >
              이용 방법
            </span>
            <h2
              className={`${isSenior ? "text-[28px] md:text-[34px]" : "text-2xl md:text-3xl"} text-[#111827] mb-4`}
              style={{ fontWeight: 700 }}
            >
              {isSenior
                ? "시작은 이렇게 해요."
                : "어떻게 시작하나요?"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <div
                key={s.step}
                className="relative flex flex-row md:flex-col items-center md:items-center text-left md:text-center gap-4 md:gap-0 p-3 md:p-4"
              >
                <div
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#1F6B78] text-white flex items-center justify-center shrink-0 md:mb-5 ${isSenior ? "text-[20px] md:text-[22px]" : "text-base md:text-lg"}`}
                  style={{ fontWeight: 700 }}
                >
                  {s.step}
                </div>
                <div className="flex-1 md:flex-none">
                  <h4
                    className={`text-[#111827] mb-1 md:mb-2 ${isSenior ? "text-[18px] md:text-[20px]" : ""}`}
                    style={{ fontWeight: 600 }}
                  >
                    {s.title}
                  </h4>
                  {s.desc && (
                    <p
                      className={`text-[#374151] leading-relaxed ${isSenior ? "text-[15px] md:text-[17px]" : "text-sm"}`}
                    >
                      {s.desc}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 md:flex-row md:gap-4">
            <button
              onClick={() => navigate("/inquiries")}
              className="w-full md:w-auto px-6 py-3 min-h-[48px] rounded-full bg-[#1F6B78] text-white hover:bg-[#185A65] transition-colors cursor-pointer active:scale-[0.98]"
              style={{
                fontWeight: 600,
                fontSize: isSenior ? 18 : 14,
              }}
            >
              지금 상담하기
            </button>
            <button
              onClick={() => {
                const el =
                  document.getElementById("faq-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full md:w-auto px-6 py-3 min-h-[48px] rounded-full border border-[#1F6B78] text-[#1F6B78] hover:bg-[#1F6B78]/5 transition-colors cursor-pointer active:scale-[0.98]"
              style={{
                fontWeight: 600,
                fontSize: isSenior ? 18 : 14,
              }}
            >
              자주 묻는 질문 보기
            </button>
          </div>
        </div>
      </section>

      {/* ═══ Section E: 조합원 혜택 + 출자금 안심 ═══ */}
      <section className={`${sectionPy} bg-white`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-14">
            <span
              className="inline-block px-4 py-1.5 rounded-full bg-[#F2EBDD] text-[#1F6B78] text-sm mb-4"
              style={{ fontWeight: 600 }}
            >
              조합원 혜택
            </span>
            <h2
              className={`${isSenior ? "text-[28px] md:text-[34px]" : "text-2xl md:text-3xl"} text-[#111827] mb-4`}
              style={{ fontWeight: 700 }}
            >
              {isSenior
                ? "조합원은 '손님'이 아니라 '주인'이에요."
                : "조합원은 '이용자'이자 '주인'입니다."}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
            {/* 혜택 리스트 */}
            <div>
              <h3
                className={`text-[#111827] mb-6 ${isSenior ? "text-[22px]" : "text-lg"}`}
                style={{ fontWeight: 600 }}
              >
                {isSenior
                  ? "조합원은 뭐가 좋아요?"
                  : "조합원 혜택"}
              </h3>
              <div className="space-y-4">
                {benefits.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 bg-[#FAFAFA] rounded-xl border border-[#E5E7EB]"
                  >
                    <CheckCircle2
                      size={20}
                      className="text-[#67B89A] shrink-0 mt-0.5"
                    />
                    <span
                      className={`text-[#111827] ${isSenior ? "text-[18px]" : "text-sm"}`}
                      style={{ fontWeight: 500 }}
                    >
                      {b}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 출자금 안심 박스 */}
            <div
              className="p-5 md:p-8 rounded-2xl"
              style={{ backgroundColor: C.accent }}
            >
              <div className="flex items-start gap-3 mb-4 md:mb-5">
                <Shield size={22} className="text-[#1F6B78] shrink-0 mt-0.5" />
                <h3
                  className={`text-[#111827] ${isSenior ? "text-[22px]" : "text-lg"}`}
                  style={{ fontWeight: 700 }}
                >
                  {isSenior
                    ? "출자금은 '씨앗돈'이에요."
                    : "출자금은 '가입비'가 아니라 '조합을 움직이는 씨앗돈(내 지분)'입니다."}
                </h3>
              </div>
              <div className="space-y-4 mb-6">
                {[
                  "조합 운영과 지역 건강 활동에 사용됩니다.",
                  "탈퇴 시에는 정관과 절차에 따라 환급이 진행됩니다.",
                  isSenior
                    ? "돈 벌려고 하는 곳이 아니라, 건강을 지키는 곳입니다."
                    : "배당이 목적이 아니라, 우리 지역의 건강을 지키는 것이 목적입니다.",
                ].map((t, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-[#1F6B78] shrink-0 mt-0.5"
                    />
                    <span
                      className={`text-[#111827] ${isSenior ? "text-[18px]" : "text-sm"}`}
                      style={{ fontWeight: 500 }}
                    >
                      {t}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#E5E7EB] mb-6">
                <p
                  className={`text-[#111827] text-center ${isSenior ? "text-[20px]" : ""}`}
                  style={{ fontWeight: 700 }}
                >
                  출자금 ={" "}
                  <span className="text-[#1F6B78]">
                    {V.출자금_최저}
                  </span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate("/join")}
                  className="flex-1 py-3 rounded-lg bg-[#1F6B78] text-white hover:bg-[#185A65] transition-colors cursor-pointer"
                  style={{
                    fontWeight: 600,
                    fontSize: isSenior ? 17 : 14,
                  }}
                >
                  조합원 가입하기({V.가입소요시간})
                </button>
                <button
                  onClick={() => {
                    const el =
                      document.getElementById("faq-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex-1 py-3 rounded-lg border border-[#1F6B78] text-[#1F6B78] hover:bg-[#1F6B78]/5 transition-colors cursor-pointer"
                  style={{
                    fontWeight: 600,
                    fontSize: isSenior ? 17 : 14,
                  }}
                >
                  출자금/탈퇴 절차 FAQ
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Section F: 가�� 원큐 ═══ */}
      <section
        className={`${sectionPy}`}
        style={{ backgroundColor: "#1F6B78" }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className={`text-white mb-4 whitespace-pre-line ${isSenior ? "text-[28px] md:text-[34px]" : "text-2xl md:text-3xl"}`}
                style={{ fontWeight: 700, lineHeight: 1.3 }}
              >
                {isSenior
                  ? "가입은 어렵지 않아요."
                  : `조합원 가입, ${V.가입소요시간}이면 시작됩니다.`}
              </h2>
              <p
                className={`text-white/70 mb-8 leading-relaxed ${isSenior ? "text-[18px]" : ""}`}
              >
                {isSenior
                  ? "아래 4가지만 적어주세요."
                  : "아래 정보는 가입 안내를 위해 필요한 최소 항목입니다."}
              </p>

              {/* 3단계 미리보기 */}
              <div className="space-y-4 mb-8">
                {(isSenior
                  ? [
                      { n: "1", t: "동의(큰 체크 2개)" },
                      {
                        n: "2",
                        t: "이름/생년월일/연락처/주소",
                      },
                      { n: "3", t: "출자금 선택 + 완료" },
                    ]
                  : [
                      { n: "1", t: "약관/동의(요약)" },
                      { n: "2", t: "기본 정보 입력" },
                      { n: "3", t: "출자금 선택 & 완료" },
                    ]
                ).map((s) => (
                  <div
                    key={s.n}
                    className="flex items-center gap-4"
                  >
                    <div
                      className="w-10 h-10 rounded-full bg-white/15 text-white flex items-center justify-center shrink-0"
                      style={{ fontWeight: 700 }}
                    >
                      {s.n}
                    </div>
                    <span
                      className={`text-white/90 ${isSenior ? "text-[18px]" : ""}`}
                      style={{ fontWeight: 500 }}
                    >
                      {s.t}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => navigate("/join")}
                className="w-full lg:max-w-sm py-4 min-h-[52px] rounded-full bg-white text-[#1F6B78] hover:bg-gray-50 transition-colors cursor-pointer shadow-lg active:scale-[0.98]"
                style={{
                  fontWeight: 700,
                  fontSize: isSenior ? 20 : 18,
                }}
              >
                {isSenior
                  ? "가입 신청하기"
                  : "가입 신청 완료하기 →"}
              </button>
              <button
                onClick={() => alert(`대표전화: ${V.대표전화}`)}
                className="w-full lg:max-w-sm py-4 min-h-[52px] rounded-full bg-[#67B89A] text-white text-center hover:bg-[#5AA889] transition-colors shadow-lg cursor-pointer active:scale-[0.98]"
                style={{
                  fontWeight: 700,
                  fontSize: isSenior ? 20 : 16,
                }}
              >
                <PhoneCall size={20} className="inline mr-2" />
                전화로 가입 도움받기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Section G: 공지/커뮤니티 미리보 ═══ */}
      <section className={`${sectionPy} bg-white`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 md:mb-10">
            <div>
              <span
                className="inline-block px-4 py-1.5 rounded-full bg-[#67B89A]/15 text-[#1F6B78] text-sm mb-3"
                style={{ fontWeight: 600 }}
              >
                소식/커뮤니티
              </span>
              <h2
                className={`${isSenior ? "text-[26px] md:text-[32px]" : "text-2xl md:text-3xl"} text-[#111827]`}
                style={{ fontWeight: 700 }}
              >
                {isSenior
                  ? "새 소식은 여기서 봐요."
                  : "공지와 모임 소식, 한눈에 확인하세요."}
              </h2>
            </div>
            <button
              onClick={() => navigate("/community")}
              className="hidden sm:flex items-center gap-1 text-[#1F6B78] hover:gap-2 transition-all cursor-pointer"
              style={{
                fontWeight: 600,
                fontSize: isSenior ? 17 : 14,
              }}
            >
              공지 전체 보기 <ArrowRight size={16} />
            </button>
          </div>

          {isSenior && (
            <button
              onClick={() => alert(`대표전화: ${V.대표전화}`)}
              className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl bg-[#F2EBDD] text-[#1F6B78] cursor-pointer"
              style={{ fontWeight: 600, fontSize: 17 }}
            >
              <Phone size={18} /> 전화로 안내받기 ({V.대표전화})
            </button>
          )}

          <div className="space-y-2 md:space-y-3">
            {NOTICES_PREVIEW.map((n, i) => (
              <div
                key={i}
                onClick={() => navigate("/community")}
                className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border border-[#E5E7EB] hover:bg-[#FAFAFA] transition-colors cursor-pointer ${isSenior ? "p-5" : ""}`}
              >
                <span
                  className={`px-2.5 py-1 rounded-full text-xs shrink-0 ${
                    n.cat === "필독"
                      ? "bg-[#1F6B78] text-white"
                      : n.cat === "건강모임"
                        ? "bg-[#67B89A]/15 text-[#1F6B78]"
                        : "bg-[#F2EBDD] text-[#374151]"
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {n.cat}
                </span>
                <span
                  className={`flex-1 text-[#111827] truncate ${isSenior ? "text-[18px]" : "text-sm"}`}
                  style={{ fontWeight: 500 }}
                >
                  {n.title}
                </span>
                <span
                  className={`text-[#6B7280] shrink-0 hidden sm:inline ${isSenior ? "text-[15px]" : "text-xs"}`}
                >
                  {n.date}
                </span>
                <ArrowRight
                  size={16}
                  className="text-[#6B7280] shrink-0 hidden sm:block"
                />
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <button
              onClick={() => navigate("/community")}
              className="w-full sm:w-auto px-6 py-3 min-h-[48px] rounded-full bg-[#1F6B78] text-white hover:bg-[#185A65] transition-colors cursor-pointer active:scale-[0.98]"
              style={{
                fontWeight: 600,
                fontSize: isSenior ? 17 : 14,
              }}
            >
              공지 전체 보기
            </button>
            <button
              onClick={() => navigate("/community")}
              className="w-full sm:w-auto px-6 py-3 min-h-[48px] rounded-full border border-[#1F6B78] text-[#1F6B78] hover:bg-[#1F6B78]/5 transition-colors cursor-pointer active:scale-[0.98]"
              style={{
                fontWeight: 600,
                fontSize: isSenior ? 17 : 14,
              }}
            >
              건강모임 일정 보기
            </button>
          </div>
        </div>
      </section>

      {/* ═══ Section H: 문의 + FAQ ═══ */}
      <section
        id="faq-section"
        className={`${sectionPy}`}
        style={{ backgroundColor: C.bg }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* 문의 3채널 */}
          <div className="text-center mb-8 md:mb-14">
            <span
              className="inline-block px-4 py-1.5 rounded-full bg-[#F2EBDD] text-[#1F6B78] text-sm mb-4"
              style={{ fontWeight: 600 }}
            >
              문의하기
            </span>
            <h2
              className={`${isSenior ? "text-[28px] md:text-[34px]" : "text-2xl md:text-3xl"} text-[#111827] mb-4`}
              style={{ fontWeight: 700 }}
            >
              {isSenior
                ? "가장 쉬운 방법으로 연락하세요."
                : "궁금하면, 가장 쉬운 방법으로 연락하세요."}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto mb-10 md:mb-16">
            <button
              onClick={() => alert(`대표전화: ${V.대표전화}`)}
              className={`flex items-center gap-3 sm:flex-col sm:gap-3 p-4 sm:p-6 bg-white rounded-2xl border border-[#E5E7EB] hover:shadow-md transition-shadow sm:text-center cursor-pointer active:scale-[0.98] ${isSenior ? "p-5 sm:p-8" : ""}`}
            >
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#1F6B78] text-white flex items-center justify-center shrink-0">
                <Phone size={20} />
              </div>
              <div className="flex flex-col sm:items-center gap-0.5">
                <span
                  className={`text-[#111827] ${isSenior ? "text-[18px] sm:text-[20px]" : "text-sm"}`}
                  style={{ fontWeight: 600 }}
                >
                  전화하기
                </span>
                <span
                  className={`text-[#9CA3AF] ${isSenior ? "text-[14px] sm:text-[16px]" : "text-xs"}`}
                >
                  {V.대표전화}
                </span>
              </div>
            </button>
            <button
              onClick={() =>
                alert(`카카오톡 채널: ${V.카카오채널}`)
              }
              className={`flex items-center gap-3 sm:flex-col sm:gap-3 p-4 sm:p-6 bg-white rounded-2xl border border-[#E5E7EB] hover:shadow-md transition-shadow sm:text-center cursor-pointer active:scale-[0.98] ${isSenior ? "p-5 sm:p-8" : ""}`}
            >
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#F2C94C] text-white flex items-center justify-center shrink-0">
                <MessageCircle size={20} />
              </div>
              <div className="flex flex-col sm:items-center gap-0.5">
                <span
                  className={`text-[#111827] ${isSenior ? "text-[18px] sm:text-[20px]" : "text-sm"}`}
                  style={{ fontWeight: 600 }}
                >
                  카카오톡 문의
                </span>
                <span
                  className={`text-[#9CA3AF] ${isSenior ? "text-[14px] sm:text-[16px]" : "text-xs"}`}
                >
                  {V.카카오채널}
                </span>
              </div>
            </button>
            <button
              onClick={() => navigate("/inquiries")}
              className={`flex items-center gap-3 sm:flex-col sm:gap-3 p-4 sm:p-6 bg-white rounded-2xl border border-[#E5E7EB] hover:shadow-md transition-shadow sm:text-center cursor-pointer active:scale-[0.98] ${isSenior ? "p-5 sm:p-8" : ""}`}
            >
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#67B89A] text-white flex items-center justify-center shrink-0">
                <Mail size={20} />
              </div>
              <div className="flex flex-col sm:items-center gap-0.5">
                <span
                  className={`text-[#111827] ${isSenior ? "text-[18px] sm:text-[20px]" : "text-sm"}`}
                  style={{ fontWeight: 600 }}
                >
                  문의 남기기
                </span>
                <span
                  className={`text-[#9CA3AF] ${isSenior ? "text-[14px] sm:text-[16px]" : "text-xs"}`}
                >
                  답변 받기
                </span>
              </div>
            </button>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h3
              className={`text-center text-[#111827] mb-8 ${isSenior ? "text-[24px]" : "text-xl"}`}
              style={{ fontWeight: 700 }}
            >
              자주 묻는 질문
            </h3>
            <div className="space-y-3">
              {visibleFaq.map((f, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setOpenFaq(openFaq === i ? null : i)
                    }
                    className={`w-full flex items-center justify-between p-5 text-left cursor-pointer ${isSenior ? "p-6" : ""}`}
                  >
                    <span
                      className={`text-[#111827] pr-4 ${isSenior ? "text-[18px]" : "text-sm md:text-base"}`}
                      style={{ fontWeight: 600 }}
                    >
                      {f.q}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-[#6B7280] shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  {(openFaq === i ||
                    (isSenior &&
                      openFaq === null &&
                      i < 3)) && (
                    <div
                      className={`px-5 pb-5 ${isSenior ? "px-6 pb-6" : ""}`}
                    >
                      <p
                        className={`text-[#374151] leading-relaxed ${isSenior ? "text-[17px]" : "text-sm"}`}
                      >
                        {isSenior ? f.a_senior : f.a_normal}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {!showAllFaq && FAQ_DATA.length > 6 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAllFaq(true)}
                  className="px-6 py-3 rounded-full border border-[#1F6B78] text-[#1F6B78] hover:bg-[#1F6B78]/5 transition-colors cursor-pointer"
                  style={{
                    fontWeight: 600,
                    fontSize: isSenior ? 17 : 14,
                  }}
                >
                  더보기
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ Bottom CTA (가입 재노출) ═══ */}
      <section className="py-10 md:py-20 bg-[#0B1E2D]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className={`text-white mb-4 ${isSenior ? "text-[28px] md:text-[34px]" : "text-2xl md:text-3xl"}`}
            style={{ fontWeight: 700 }}
          >
            {isSenior
              ? "함께하면 더 든든합니다."
              : "지역의 건강한 변화, 함께 시작하세요."}
          </h2>
          <p
            className={`text-white/60 mb-8 md:mb-10 leading-relaxed ${isSenior ? "text-[18px]" : ""}`}
          >
            {isSenior
              ? "조합원이 되어 우리 동네 건강을 같이 챙겨요."
              : "조합원 가입으로 더 가깝고, 더 따뜻한 의료·돌봄을 경험하세요."}
          </p>
          <div className="flex flex-col items-center justify-center gap-3 md:flex-row md:gap-4">
            <button
              onClick={() => navigate("/join")}
              className="w-full md:w-auto px-8 py-4 min-h-[52px] rounded-full bg-white text-[#1F6B78] hover:bg-gray-50 transition-colors cursor-pointer shadow-lg active:scale-[0.98]"
              style={{
                fontWeight: 700,
                fontSize: isSenior ? 20 : 18,
              }}
            >
              조합원 가입하기
            </button>
            <button
              onClick={() => alert(`대표전화: ${V.대표전화}`)}
              className="w-full md:w-auto px-8 py-4 min-h-[52px] rounded-full border border-white/20 text-white hover:bg-white/5 transition-colors cursor-pointer active:scale-[0.98]"
              style={{
                fontWeight: 600,
                fontSize: isSenior ? 20 : 18,
              }}
            >
              전화 문의 ({V.대표전화})
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
