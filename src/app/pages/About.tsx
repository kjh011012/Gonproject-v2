import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight, Heart, Users, Stethoscope, Leaf, Shield, MapPin,
  ChevronRight, Star, Clock, CheckCircle2, Building, BookOpen,
  Quote, Phone, Play, Film, AlertTriangle, Hospital, Unplug, UserMinus,
  Lightbulb,
} from "lucide-react";
import { useSeniorMode } from "../components/SeniorModeContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { V, C } from "../components/shared";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

function Anim({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const IMG_HERO = "https://images.unsplash.com/photo-1765510103179-0c2f628d2ff2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBydXJhbCUyMHZpbGxYWdlJTIwbW91bnRhY24lMjBjb21tdW5pdHklMjBnYXRoZXJpbmclMjB3YXJtfGVufDF8fHx8MTc3Mjk0Mzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_MISSION = "https://images.unsplash.com/photo-1555069855-e580a9adbf43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBoZWFsdGglMjBjb29wZXJhdGl2ZSUyMG1lZXRpbmclMjBkaXZlcnNlJTIwcGVvcGxlfGVufDF8fHx8MTc3Mjk0Mzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_TEAM = "https://images.unsplash.com/photo-1653508311277-1ecf6ee52c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdGVhbSUyMHByb2Zlc3Npb25hbCUyMGhvc3BpdGFsJTIwZ3JvdXB8ZW58MXx8fHwxNzcyOTQ3MjA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_WHY_1 = "https://images.unsplash.com/photo-1770569631785-37c871ab3667?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwa29yZWFuJTIwcnVyYWwlMjB2aWxsYWdlJTIwbG9uZWx5JTIwcm9hZHxlbnwxfHx8fDE3NzI5NjcwMjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_WHY_2 = "https://images.unsplash.com/photo-1631727078699-2917f97a2b77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBydXJhbCUyMGFiYW5kb25lZCUyMHZpbGxYWdlJTIwZGVwb3VsdGF0aW9u8ZW58MXx8fHwxNzcyOTY3MDI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_WHY_3 = "https://images.unsplash.com/photo-1639229969089-92a9255062c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwcGVyc29uJTIwd2Fsa2luZyUyMHJ1cmFsJTIwY291bnRyeXNpZGUlMjBwYXRofGVufDF8fHx8MTc3Mjk2NzAyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_WHY_4 = "https://images.unsplash.com/photo-1642413140777-0a3bf5ff39e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBlbGRlcmx5JTIwY29tbXVuaXR5JTIwZ2F0aGVyaW5nJTIwd2FybSUyMGNhcmV8ZW58MXx8fHwxNzcyOTY3MDI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_INTRO_BG = "https://images.unsplash.com/photo-1682305263849-aafc52950d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBydXJhbCUyMG1vdW50YWluJTIwdmlsbGFnZSUyMGdyZWVuJTIwbGFuZHNjYXBlJTIwYWVyaWFsfGVufDF8fHx8MTc3Mjk2NzM2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const PHILOSOPHY = [
  { icon: Heart, title: "건강권 보장", desc: "의료 접근이 어려운 곳에서도 누구나 필요한 의료를 받을 수 있어야 합니다.", color: "#C87C5A" },
  { icon: Stethoscope, title: "1차 의료 중심", desc: "예방·상담·만성질환 관리까지, 지속가능한 건강관리의 첫 걸음.", color: "#1F4B43" },
  { icon: Users, title: "주민 참여 운영", desc: "1인 1의 민주적 의사결정으로 주민이 직접 운영에 참여합니다.", color: "#6E958B" },
  { icon: Shield, title: "통합 돌봄 지향", desc: "의료·복지·요양·돌봄이 분절되지 않고 하나로 이어집니다.", color: "#1F4B43" },
  { icon: Leaf, title: "지역자원 연계", desc: "농임산물 영양관리, 산림치유 등 강원 지역의 자원을 건강과 연결합니다.", color: "#6E958B" },
  { icon: Building, title: "비영리 공익 운영", desc: "이익 배당이 아닌 지역사회 공익을 위해 운영되는 사회적협동조합.", color: "#C87C5A" },
];

const TIMELINE = [
  { year: "2024", events: ["설립 추진위원회 발족", "창립총회 개최 및 정관 제정"] },
  { year: "2025", events: ["사회적협동조합 인가 완료", "밝음의원 개원 준비", "조합원 모집 시작"] },
  { year: "2026", events: ["밝음의원 개원 (준비 중)", "밝음재택의료센터 운영 개시 (준비 중)", "건강교실·걷기모임 프로그램 시작"] },
];

/* ─── Video data ─── */
const VIDEOS = [
  {
    id: 1,
    title: "강원농산어촌의료사회적협동조합 소개 영상",
    desc: "우리 조합이 왜, 어떻게 만들어졌는지를 담은 소개 영상입니다.",
    type: "youtube" as const,
    youtubeId: "dQw4w9WgXcQ", // 실제 YouTube 영상 ID로 교체
    duration: "3:24",
    featured: true,
  },
  {
    id: 2,
    title: "밝음의원 개원 준비 현황",
    desc: "시설 공사부터 의료진 구성까지, 밝음의원 개원 준비 과정을 영상으로 담았습니다.",
    type: "youtube" as const,
    youtubeId: "dQw4w9WgXcQ", // 실제 YouTube 영상 ID로 교체
    duration: "5:12",
    featured: false,
  },
  {
    id: 3,
    title: "2025 창립총회 하이라이트",
    desc: "조합원들이 함께 모여 첫 총회를 진행한 소중한 순간을 돌아봅니다.",
    type: "youtube" as const,
    youtubeId: "dQw4w9WgXcQ", // 실제 YouTube 영상 ID로 교체
    duration: "7:48",
    featured: false,
  },
  {
    id: 4,
    title: "건강교실 프로그램 현장",
    desc: "조합원들이 함께 참여하는 건강교실 스트레칭·걷기 프로그램 현장 스케치.",
    type: "youtube" as const,
    youtubeId: "dQw4w9WgXcQ", // 실제 YouTube 영상 ID로 교체
    duration: "4:35",
    featured: false,
  },
];

/* ─── Video Gallery Section Component ─── */
function VideoGallerySection() {
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const active = VIDEOS[activeVideoIdx];

  return (
    <section className="py-16 md:py-24 bg-[#f9f8f5]">
      <div className="w-[90%] mx-auto">
        <Anim>
          <motion.div variants={fadeUp} className="mb-8 md:mb-10">
            <span
              className="inline-block px-3 py-1 rounded-md text-[#1F4B43] text-xs mb-3"
              style={{ fontWeight: 700, letterSpacing: "0.05em", backgroundColor: "rgba(31,75,67,0.08)" }}
            >
              OUR STORY
            </span>
            <h2 className="text-[#1F2623] text-xl md:text-2xl" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}>
              영상으로 만나는 우리의 이야기
            </h2>
            <p className="text-[#999] mt-2 max-w-md">조합의 활동과 가치를 영상으로 확인하세요</p>
          </motion.div>
        </Anim>

        <Anim>
          {/* Main player */}
          <motion.div variants={fadeUp}>
            <div className="relative w-full rounded-2xl overflow-hidden bg-[#1F2623] shadow-xl" style={{ aspectRatio: "16/9" }}>
              {active.type === "youtube" ? (
                <iframe
                  key={active.youtubeId + active.id}
                  src={`https://www.youtube.com/embed/${active.youtubeId}?rel=0&modestbranding=1`}
                  title={active.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  style={{ border: "none" }}
                />
              ) : (
                <video
                  controls
                  className="absolute inset-0 w-full h-full object-contain"
                  poster=""
                >
                  <source src="" type="video/mp4" />
                </video>
              )}
            </div>
            {/* Active video info */}
            <div className="mt-4 md:mt-5">
              <h3 className="text-[#1F2623]" style={{ fontWeight: 700 }}>{active.title}</h3>
              <p className="text-sm text-[#999] mt-1">{active.desc}</p>
            </div>
          </motion.div>
        </Anim>

        {/* Playlist thumbnails */}
        {VIDEOS.length > 1 && (
          <Anim>
            <motion.div variants={fadeUp} className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {VIDEOS.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setActiveVideoIdx(i)}
                  className={`text-left rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    i === activeVideoIdx
                      ? "border-[#1F4B43] shadow-md"
                      : "border-transparent hover:border-[#E5E5E5]"
                  }`}
                >
                  <div className="relative bg-[#1F2623]" style={{ aspectRatio: "16/9" }}>
                    <ImageWithFallback
                      src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`}
                      alt={v.title}
                      className="w-full h-full object-cover"
                    />
                    {i === activeVideoIdx && (
                      <div className="absolute inset-0 bg-[#1F4B43]/30 flex items-center justify-center">
                        <Play size={20} className="text-white" fill="white" />
                      </div>
                    )}
                    <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px]">{v.duration}</span>
                  </div>
                  <div className="p-2.5">
                    <p className={`text-xs leading-snug line-clamp-2 ${i === activeVideoIdx ? "text-[#1F4B43]" : "text-[#666]"}`} style={{ fontWeight: i === activeVideoIdx ? 700 : 500 }}>
                      {v.title}
                    </p>
                  </div>
                </button>
              ))}
            </motion.div>
          </Anim>
        )}
      </div>
    </section>
  );
}

export function AboutPage() {
  const { isSenior } = useSeniorMode();
  const navigate = useNavigate();

  return (
    <div className="contents">
      {/* ── Hero ── */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback src={IMG_HERO} alt="조합 소개" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D1F1C]/90 via-[#1F4B43]/65 to-transparent" />
        </div>
        
      </section>

      {/* ── Stats bar ── */}
      

      {/* ── Mission Section ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">

          {/* ── 조합 소개 — 배경이미지 + 역할 카드 ── */}
          <Anim className="mb-20 md:mb-28">
            <motion.div variants={fadeUp}>
              {/* 제목 — 카드 외부 좌측 상단 */}
              <div className="mb-5">
                
                <h2
                  className="text-[#1F2623] text-[22px] md:text-[30px] max-w-2xl flex items-center gap-2.5"
                  style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700, lineHeight: 1.55 }}
                >
                  <span className="relative inline-flex items-center justify-center shrink-0" style={{ width: "1.15em", height: "1.15em" }}>
                    <Lightbulb className="w-full h-full text-[#C87C5A]" strokeWidth={1.8} />
                    <span className="absolute text-[0.38em] text-[#C87C5A]" style={{ fontWeight: 900, marginTop: "-0.15em" }}>?</span>
                  </span>
                  강원 농산어촌 의료 사회적 협동조합이란?
                </h2>
              </div>

              {/* 통합 카드 — 소개 + 체크리스트 + CTA */}
              <div className="rounded-2xl border border-[#E5E5E5] bg-white overflow-hidden">
                {/* 소개 텍스트 블록 */}
                <div className="px-6 md:px-10 pt-7 md:pt-8 pb-8">
                  {/* 핵심 메시지 */}
                  <p
                    className="text-[#1F2623] text-[17px] md:text-[19px] mb-6 max-w-2xl"
                    style={{ fontWeight: 600, lineHeight: 1.7 }}
                  >
                    의료와 돌봄을 위해 도시로 떠나지 않아도,{" "}
                    <span className="text-[#1F4B43] underline decoration-[#1F4B43]/20 underline-offset-4">내가 사는 곳에서 건강하게 나이 들 권리</span>를
                    지킬 수 있어야 합니다.
                  </p>

                  {/* 3-column 핵심 정체성 카드 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {[
                      {
                        icon: Users,
                        accent: "#1F4B43",
                        title: "주민이 만든 조합",
                        desc: "외부 자본이 아닌, 조합원 스스로의 참여와 출자로 운영되는 비영리 사회적협동조합입니다.",
                      },
                      {
                        icon: Heart,
                        accent: "#C87C5A",
                        title: "돌봄은 함께의 일",
                        desc: "의료·돌봄을 개인의 책임으로 두지 않고, 이웃과 지역이 함께 책임지는 구조를 만듭니다.",
                      },
                      {
                        icon: Shield,
                        accent: "#6E958B",
                        title: "건강권을 지키는 곳",
                        desc: "찾아가는 진료, 통합 돌봄, 건강교육까지 — 지역 맞춤형 서비로 의료 공백을 메웁니다.",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="relative p-5 rounded-xl bg-[#F9F8F5] border border-[#F0EEEA] hover:border-[#D6CCBC] transition-colors group"
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                          style={{ backgroundColor: `${item.accent}0F` }}
                        >
                          <item.icon size={18} style={{ color: item.accent }} />
                        </div>
                        <p className="text-[#1F2623] text-[14px] md:text-[15px] mb-1.5" style={{ fontWeight: 700 }}>
                          {item.title}
                        </p>
                        <p className="text-[#888] leading-relaxed text-[15px]">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* 보충 설명 */}
                  <p className="text-[#999] leading-relaxed max-w-2xl text-[16px] font-bold">
                    강원 농산어촌의 의료 공백과 돌봄 불균형 — {V.조합명_짧게}은 이 문제를 주민 주도로 풀어가기 위해 만들어졌습니다.
                    1인 1표 민주적 운영, 비영리 공익 구조를 원칙으로 합니다.
                  </p>
                </div>

                {/* 구분선 */}
                <div className="mx-6 md:mx-10 border-t border-[#F0EEEA]" />

                {/* 농산어촌 현실 — 체크리스트 */}
                

                {/* CTA 배너 — 카드 하단 */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 md:px-10 py-5 bg-[#1F4B43] text-white rounded-b-2xl">
                  <div className="flex items-center gap-3">
                    <Heart size={18} className="text-[#C87C5A] shrink-0" />
                    <p className="text-sm md:text-[15px] leading-snug" style={{ fontWeight: 600 }}>
                      농산어촌, 돌봄이 사라지는 곳이 아닌 함께 살아갈 수 있는 곳이어야 합니다.
                    </p>
                  </div>
                  
                </div>
              </div>
            </motion.div>
          </Anim>

          {/* ─ 왜 필요한가요? ─ */}
          <Anim className="mb-24 md:mb-32">
            <motion.div variants={fadeUp} className="mb-3">
              <h2
                className="text-[#1F2623] text-[24px] md:text-[32px] flex items-start gap-3"
                style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700, lineHeight: 1.35 }}
              >
                <AlertTriangle className="text-[#C87C5A] shrink-0 translate-y-[0.15em]" style={{ width: "1em", height: "1em" }} />
                <span>
                  횡성에 의료복지사회적협동조합이 <span className="text-[#C87C5A]">왜 필요한가요?</span>
                </span>
              </h2>
            </motion.div>
            <motion.div variants={fadeUp} className="mb-10 md:mb-14">
              <p className="text-[#7A8584] max-w-lg leading-relaxed">
                농산어촌은 돌봄이 사라지는 곳이 아닌,{" "}
                <span style={{ fontWeight: 600 }} className="text-[#1F2623]">함께 살아갈 수 있는 곳</span>이어야 합니다.
              </p>
            </motion.div>

            {/* 사진 기반 문제 카드 — 비대칭 매거진 레이아웃 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 mb-10 md:mb-14">
              {/* 카드 1 — 큰 세로 카드 (좌측) */}
              <Anim className="md:col-span-5 md:row-span-2">
                <motion.div variants={fadeUp} className="relative h-full min-h-[320px] md:min-h-full rounded-2xl overflow-hidden group">
                  <ImageWithFallback src={IMG_WHY_1} alt="먼 병원까지의 길" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-[#C87C5A] text-white text-[10px] mb-3" style={{ fontWeight: 700 }}>의료 접근성</span>
                    <h3 className="text-white text-[18px] md:text-[20px] mb-2" style={{ fontWeight: 700, lineHeight: 1.35 }}>
                      병원까지 너무 먼 고령자들
                    </h3>
                    <p className="text-white/65 text-sm leading-relaxed">
                      가장 가까운 종합병원까지 수십 km.
                      대중교통은 하루 몇 편뿐인 현실입니다.
                    </p>
                  </div>
                </motion.div>
              </Anim>

              {/* 카드 2 — 가로 카드 (우상단) */}
              <Anim className="md:col-span-7">
                <motion.div variants={fadeUp} className="relative h-[220px] md:h-[200px] rounded-2xl overflow-hidden group">
                  <ImageWithFallback src={IMG_WHY_2} alt="사라지는 마을" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex items-end md:items-center p-6 md:p-7">
                    <div className="max-w-sm">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-[#1F4B43] text-white text-[10px] mb-3" style={{ fontWeight: 700 }}>공공서비스</span>
                      <h3 className="text-white text-[17px] md:text-[18px] mb-1.5" style={{ fontWeight: 700, lineHeight: 1.35 }}>
                        사라지는 공공서비스
                      </h3>
                      <p className="text-white/60 text-[13px] leading-relaxed">
                        인구가 줄고 예산이 줄면서, 마을의 공공 의료·복지 서비스는 점점 축소됩니다.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Anim>

              {/* 카드 3 — 가로 카드 (우하단, 2분할) */}
              <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                <Anim>
                  <motion.div variants={fadeUp} className="relative h-[220px] md:h-[200px] rounded-2xl overflow-hidden group">
                    <ImageWithFallback src={IMG_WHY_3} alt="홀로 남은 어르신" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] mb-2.5" style={{ fontWeight: 700 }}>고령화</span>
                      <h3 className="text-white text-[16px] mb-1" style={{ fontWeight: 700, lineHeight: 1.35 }}>
                        남은 주민은 고령자뿐
                      </h3>
                      <p className="text-white/55 text-[12px] leading-relaxed">
                        아플 때 옆에 아무도 없습니다.
                      </p>
                    </div>
                  </motion.div>
                </Anim>
                <Anim>
                  <motion.div variants={fadeUp} className="relative h-[220px] md:h-[200px] rounded-2xl overflow-hidden group">
                    <ImageWithFallback src={IMG_WHY_4} alt="연결이 필요한 사람들" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] mb-2.5" style={{ fontWeight: 700 }}>기관 연계</span>
                      <h3 className="text-white text-[16px] mb-1" style={{ fontWeight: 700, lineHeight: 1.35 }}>
                        기관 간 연결 부족
                      </h3>
                      <p className="text-white/55 text-[12px] leading-relaxed">
                        복지기관·병원·보건소가 따로 움직여,
                        주민은 어디로 가야 할지 모릅니다.
                      </p>
                    </div>
                  </motion.div>
                </Anim>
              </div>
            </div>

            {/* 결론 배너 */}
            <Anim>
              <motion.div variants={fadeUp}>
                <div className="rounded-2xl bg-[#1F2623] p-8 md:p-10 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1F4B43]/30 via-transparent to-[#C87C5A]/10" />
                  <div className="relative z-10 md:flex md:items-center md:justify-between md:gap-8">
                    <div className="mb-4 md:mb-0">
                      <p
                        className="text-white/90 text-[17px] md:text-[20px] mb-2 leading-relaxed"
                        style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
                      >
                        우리는 지방소멸의 최전선에 있습니다.
                      </p>
                      <p className="text-white/50 text-sm md:text-[15px] leading-relaxed">
                        공모사업이나 외부기관이 해줄 수 없는 일,{" "}
                        이제는 <span className="text-[#C87C5A]" style={{ fontWeight: 600 }}>지역 안에서 해답을 만들어야 합니다.</span>
                      </p>
                    </div>
                    
                  </div>
                </div>
              </motion.div>
            </Anim>
          </Anim>

          {/* 의료협진 다이어그램 */}
          <Anim className="mb-20 md:mb-28">
            <motion.div variants={fadeUp} className="mb-10 md:mb-14">
              
              <h2 className="text-[#1F2623] text-[24px] md:text-[30px] flex items-center gap-2.5" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700, lineHeight: 1.4 }}>
                <Stethoscope className="text-[#C87C5A] shrink-0" style={{ width: "1em", height: "1em" }} />
                우리가 그리는 돌봄의 구조
              </h2>
              <p className="text-[#7A8584] mt-2 max-w-lg">
                의료협진 체계를 중심으로, <span className="text-[#1F4B43]" style={{ fontWeight: 700 }}>조합이 만들어갈 변화</span>를 소개합니다
              </p>
            </motion.div>

            {/* 좌우 패널 레이아웃 */}
            <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">

              {/* ── 좌측: 의료협진 체계 다이어그램 ── */}
              <div className="rounded-2xl border border-[#E5E5E5] bg-white overflow-hidden flex flex-col">
                <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-[#1F4B43]/8 text-[#1F4B43] mb-2 text-[14px]" style={{ fontWeight: 700 }}>의료협진 체계</span>
                  <p className="text-[#999] text-[13px] font-bold">5개 핵심 영역이 유기적으로 연결됩니다</p>
                </div>
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 pb-6 md:pb-8">
                  <div className="relative w-full max-w-[340px] aspect-square">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center">
                      <span
                        className="text-[#1F4B43]"
                        style={{
                          fontFamily: "'Noto Serif KR', serif",
                          fontWeight: 900,
                          fontSize: "clamp(18px, 4.8vw, 22px)",
                        }}
                      >
                        의료협진
                      </span>
                    </div>
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 420 420" fill="none">
                      <polygon
                        points="210,42 388,170 322,370 98,370 32,170"
                        fill="none"
                        stroke="#1F4B43"
                        strokeWidth="1.5"
                        strokeDasharray="6 4"
                        strokeOpacity="0.25"
                      />
                      {[
                        [210, 42],
                        [388, 170],
                        [322, 370],
                        [98, 370],
                        [32, 170],
                      ].map(([x, y], i) => (
                        <line key={i} x1="210" y1="210" x2={x} y2={y} stroke="#1F4B43" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="4 3" />
                      ))}
                    </svg>
                    {[
                      { label: "건강 관리\n주치의", x: "50%", y: "8%", color: "#5A8A3C", border: "#5A8A3C" },
                      { label: "치유 예방\n서비스", x: "86%", y: "35%", color: "#2978B5", border: "#2978B5" },
                      { label: "가정 간호", x: "74%", y: "82%", color: "#2978B5", border: "#2978B5" },
                      { label: "방문진료", x: "26%", y: "82%", color: "#555", border: "#888" },
                      { label: "지역기반\n의료인 육성", x: "14%", y: "35%", color: "#555", border: "#888" },
                    ].map((node, i) => (
                      <div
                        key={i}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group"
                        style={{ left: node.x, top: node.y }}
                      >
                        <div
                          className="rounded-full bg-white flex items-center justify-center text-center shadow-md hover:shadow-xl transition-shadow cursor-default"
                          style={{
                            width: "clamp(68px, 22vw, 95px)",
                            height: "clamp(68px, 22vw, 95px)",
                            border: `3px solid ${node.border}`,
                          }}
                        >
                          <span
                            className="leading-[1.12] whitespace-pre-line px-1"
                            style={{
                              fontWeight: 700,
                              color: node.color,
                              fontSize: "clamp(11px, 3.4vw, 16px)",
                            }}
                          >
                            {node.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* 하단 — 우측 패널과 동일한 푸터 구조 */}
                <div className="flex items-center gap-3 px-6 md:px-8 py-4 bg-[#F9F8F5] border-t border-[#F0EEEA] mt-auto">
                  <Stethoscope size={16} className="text-[#1F4B43] shrink-0" />
                  <p className="text-[#666] leading-snug text-[16px]" style={{ fontWeight: 500 }}>
                    주치의 중심 통합 의료협진으로 빈틈 없는 케어를 실현합니다.
                  </p>
                </div>
              </div>

              {/* ── 우측: 우리가 만들어갈 변화 ── */}
              <div className="rounded-2xl border border-[#E5E5E5] bg-white overflow-hidden flex flex-col">
                <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-[#C87C5A]/10 text-[#C87C5A] mb-2 text-[14px]" style={{ fontWeight: 700 }}>우리가 만들어갈 변화</span>
                  <p className="text-[#999] text-[13px] font-bold">조합원이 되면 이런 것들이 달라집니다</p>
                </div>

                <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-0">
                  {[
                    {
                      icon: Stethoscope,
                      problem: "건강관리는 개인의 영역, 내가 찾아가는 의료서비스",
                      solution: "조합원이 주인인 의료기관으로 나를 찾아오는 의료서비스, 조합원 밀착 건강관리",
                    },
                    {
                      icon: Heart,
                      problem: "내 건강돌봄은 개인의 몫",
                      solution: "조합원 활동으로 예방, 치유, 식생활 관리를 함께하며 나와 가족, 이웃의 건강을 같이 돌보고 챙김",
                    },
                    {
                      icon: Building,
                      problem: "이익은 병원의 몫",
                      solution: "이익을 지역사회와 더 나은 조합원 활동 제공으로 환원",
                    },
                    {
                      icon: Shield,
                      problem: "부처별로 흩어진 복지서비스를 찾아 이용하기 어려움",
                      solution: "복지서비스를 통합 안내·연계받아 필요한 혜택을 누림",
                    },
                  ].map((item, i) => (
                    <div key={i} className={`py-5 ${i > 0 ? "border-t border-[#F0EEEA]" : ""}`}>
                      <div className="flex gap-3.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: "rgba(31,75,67,0.06)" }}
                        >
                          <item.icon size={16} className="text-[#1F4B43]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {/* 현재 문제 */}
                          <p className="text-[#999] leading-relaxed mb-2 line-through decoration-[#ccc] text-[14px] text-[#c4c1c1]">
                            {item.problem}
                          </p>
                          {/* 우리의 방향 */}
                          <div className="flex items-start gap-2">
                            <ArrowRight size={14} className="text-[#1F4B43] shrink-0 mt-0.5" />
                            <p className="text-[#1F2623] text-[14px] leading-relaxed" style={{ fontWeight: 600 }}>
                              {item.solution}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 하단 CTA */}
                <div className="flex items-center gap-3 px-6 md:px-8 py-4 bg-[#F9F8F5] border-t border-[#F0EEEA]">
                  <CheckCircle2 size={16} className="text-[#1F4B43] shrink-0" />
                  <p className="text-[#666] leading-snug text-[16px]" style={{ fontWeight: 500 }}>
                    조합원 가입 하나로, 의료·돌봄·복지가 하나로 연결됩니다.
                  </p>
                </div>
              </div>
            </motion.div>
          </Anim>

          {/* 기존 Mission 그리드 */}
          <Anim className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeUp}>
              <span className="inline-block px-3 py-1 rounded-md bg-[#C87C5A]/10 text-[#C87C5A] text-xs mb-5" style={{ fontWeight: 700, letterSpacing: "0.05em" }}>
                OUR MISSION
              </span>
              <h2
                className="text-[#1F2623] text-[24px] md:text-[30px] mb-6"
                style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700, lineHeight: 1.4 }}
              >
                누구나 건강한 지역사회를<br />함께 만들어 갑니다
              </h2>
              <div className="space-y-4 text-[#666] leading-relaxed">
                <p>
                  {V.조합명}은 강원 지역의 의료 공백과 돌봄 불균형을 해결하기 위해
                  주민 스스로가 만든 비영리 사회적협동조합입니다.
                </p>
                <p>
                  외부 자본이 아닌 조합원의 참여와 출자로 운영되며, 건강권 보장과
                  의료 접근성 향상을 위해 찾아가는 진료, 통합 돌봄, 건강교육 등
                  지역 맞춤형 서비스를 제공합니다.
                </p>
              </div>
              {/* Pull quote */}
              <div className="mt-8 p-5 rounded-xl bg-[#F9F8F5] border-l-4 border-[#1F4B43] relative">
                <Quote size={20} className="text-[#D6CCBC] absolute top-4 right-4" />
                <p className="text-[#1F2623] italic leading-relaxed" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 500 }}>
                  "아프면 어디로 가야 할지, 먼저 안내해 드려요.<br />
                  필요하면 진료도, 돌봄도 이어 드려요."
                </p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <ImageWithFallback src={IMG_MISSION} alt="조합 활동" className="w-full aspect-[4/3] object-cover" />
              </div>
            </motion.div>
          </Anim>
        </div>
      </section>

      {/* ── Philosophy Grid ── */}
      <section className="py-16 md:py-24 bg-[#F9F8F5]">
        <div className="w-[90%] max-w-none mx-auto px-5 sm:px-6">
          <Anim>
            <motion.div variants={fadeUp} className="text-center mb-10 md:mb-14">
              <span className="inline-block px-3 py-1 rounded-md bg-[#1F4B43]/8 text-[#1F4B43] text-xs mb-4" style={{ fontWeight: 700, letterSpacing: "0.05em" }}>
                CORE VALUES
              </span>
              <h2 className="text-[#1F2623] text-xl md:text-2xl" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}>
                조합의 핵심 가치
              </h2>
              <p className="text-[#999] mt-2">우리가 지향하는 6가지 방향</p>
            </motion.div>
          </Anim>
          <Anim className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PHILOSOPHY.map((p) => (
              <motion.div
                key={p.title}
                variants={fadeUp}
                className="bg-white rounded-xl p-6 border border-[#E5E5E5] hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors" style={{ backgroundColor: `${p.color}0D` }}>
                  <p.icon size={24} style={{ color: p.color }} />
                </div>
                <h3 className="text-[#1F2623] mb-2" style={{ fontWeight: 700 }}>{p.title}</h3>
                <p className="text-sm text-[#777] leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </Anim>
        </div>
      </section>

      {/* ── Video Gallery ── */}
      <VideoGallerySection />

      {/* ── Navigation cards ── */}
      
    </div>
  );
}
