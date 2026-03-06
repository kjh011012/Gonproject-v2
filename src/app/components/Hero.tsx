import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Globe, Phone, MapPin, PhoneCall, ArrowRight } from "lucide-react";
import logoImg from "figma:asset/f4694bdbad3c9ccbf0dc80f21c4e4f77783ad26f.png";
import { useSeniorMode } from "./SeniorModeContext";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1648325066203-2e12cdd96185?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWdub2xpYSUyMHRyZWUlMjBmdWxsJTIwYmxvb20lMjBzcGVjdGFjdWxhciUyMHNwcmluZ3xlbnwxfHx8fDE3NzI2Mzg5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

/* ═══════════════════════════════════════════════════
 *  Hero — Desktop: 좌우 분할 / Mobile: 이미지 배경 + 오버레이
 * ═══════════════════════════════════════════════════ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function Hero() {
  const navigate = useNavigate();
  const { isSenior } = useSeniorMode();

  return (
    <>
      {/* ╔══════════════════════════════════════════╗
          ║  MOBILE HERO (md 미만에서만 표시)         ║
          ╚══════════════════════════════════════════╝ */}
      <motion.section
        className="relative md:hidden overflow-hidden"
        style={{ minHeight: "100dvh" }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* 배경 이미지 */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#071A2B]/95 via-[#071A2B]/60 to-[#071A2B]/30" />

        {/* 콘텐츠 */}
        <div className="relative z-10 flex flex-col h-full px-5 pb-8 pt-24" style={{ minHeight: "100dvh" }}>
          {/* 로고 + 조합명 */}
          <motion.div className="flex items-center gap-2.5 mb-6" variants={itemVariants}>
            <img src={logoImg} alt="G온돌봄" className="w-9 h-9 object-contain" />
            <div>
              <p
                className={`text-white/90 ${isSenior ? "text-[15px]" : "text-[13px]"}`}
                style={{ fontWeight: 600 }}
              >
                강원 농산어촌 의료사회적 협동조합
              </p>
            </div>
          </motion.div>

          {/* 메인 타이틀 */}
          <motion.h1
            className={`text-white mb-4 ${isSenior ? "text-[32px]" : "text-[28px]"} tracking-tight`}
            style={{ fontWeight: 800, lineHeight: 1.2 }}
            variants={itemVariants}
          >
            당신의 일상에
            <br />
            <span style={{ color: "#5EC4B0" }}>따뜻한 돌봄을</span>
          </motion.h1>

          {/* 서브 텍스트 */}
          <motion.p
            className={`text-white/60 mb-8 leading-relaxed ${isSenior ? "text-[17px]" : "text-[15px]"}`}
            variants={itemVariants}
          >
            {isSenior
              ? "전문 의료진이 집으로 찾아가고, 필요한 돌봄까지 이어드립니다."
              : "방문진료·재택의료·마을 돌봄으로 지역의 건강한 삶을 함께 만들어갑니다."}
          </motion.p>

          {/* 핵심 가치 태그 */}
          <motion.div
            className={`flex flex-wrap gap-2 mb-8 ${isSenior ? "gap-2.5" : ""}`}
            variants={itemVariants}
          >
            {[
              "조합원이 주인 (1인 1표)",
              "방문진료·재택의료",
              "마을 돌봄 연결",
              "비영리 사회적협동조합",
            ].map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center rounded-full border border-white/15 bg-white/10 backdrop-blur-sm text-white/80 ${
                  isSenior ? "px-4 py-1.5 text-[14px]" : "px-3 py-1 text-[12px]"
                }`}
                style={{ fontWeight: 500 }}
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* 스페이서: CTA를 하단으로 밀어냄 */}
          <div className="flex-1" />

          {/* CTA 버튼 — 모바일 최적화 (full-width, 큰 터치 타겟) */}
          <motion.div className="flex flex-col gap-3" variants={itemVariants}>
            <button
              onClick={() => navigate("/services")}
              className="w-full flex items-center justify-center gap-2 rounded-2xl transition-all active:scale-[0.98] cursor-pointer"
              style={{
                fontWeight: 700,
                backgroundColor: "#2A7C6F",
                color: "#fff",
                minHeight: isSenior ? "60px" : "52px",
                fontSize: isSenior ? "18px" : "16px",
              }}
            >
              서비스 신청하기 <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate("/join")}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-white/20 text-white active:scale-[0.98] transition-all cursor-pointer"
              style={{
                fontWeight: 600,
                minHeight: isSenior ? "60px" : "52px",
                fontSize: isSenior ? "18px" : "16px",
              }}
            >
              조합원 가입하기
            </button>
            {isSenior && (
              <button
                onClick={() => alert("대표전화: 추후 개통예정")}
                className="w-full flex items-center justify-center gap-2 rounded-2xl transition-all active:scale-[0.98] cursor-pointer"
                style={{
                  fontWeight: 700,
                  backgroundColor: "#67B89A",
                  color: "#fff",
                  minHeight: "60px",
                  fontSize: "18px",
                }}
              >
                <PhoneCall size={20} />
                전화로 도움받기
              </button>
            )}
          </motion.div>

          {/* 연락처 (컴팩트 1줄) */}
          <motion.div
            className="mt-6 flex items-center justify-center gap-4 text-white/35"
            style={{ fontSize: "11px" }}
            variants={itemVariants}
          >
            <span className="flex items-center gap-1">
              <Phone size={10} /> 033-342-0505
            </span>
            <span className="w-px h-3 bg-white/20" />
            <span className="flex items-center gap-1">
              <MapPin size={10} /> 강원도 횡성군
            </span>
          </motion.div>
        </div>
      </motion.section>

      {/* ╔══════════════════════════════════════════╗
          ║  DESKTOP HERO (md 이상에서만 표시)        ║
          ╚══════════════════════════════════════════╝ */}
      <motion.section
        className="relative hidden md:flex w-full flex-row overflow-hidden"
        style={{ backgroundColor: "#ffffff", minHeight: "90vh" }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* ── Left: Content ── */}
        <div className="flex w-1/2 flex-col justify-between p-12 lg:w-3/5 lg:p-16">
          {/* Top: Logo + Main */}
          <div className="mt-auto">
            {/* Logo / Slogan */}
            <motion.header className="mb-14" variants={itemVariants}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10">
                  <img src={logoImg} alt="G온돌봄" className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <p className="text-[#1A2332]" style={{ fontWeight: 700 }}>강원 농산어촌 의료사회적 협동조합</p>
                  <p className="text-xs tracking-wider text-[#1A2332]/40">Gangwon Rural Community Healthcare Social Cooperative</p>
                </div>
              </div>
            </motion.header>

            {/* Main content */}
            <motion.div variants={containerVariants}>
              <motion.h1
                className="text-5xl lg:text-6xl tracking-tight text-[#1A2332]"
                style={{
                  fontWeight: 800,
                  lineHeight: 1.15,
                }}
                variants={itemVariants}
              >
                당신의 일상에
                <br />
                <span style={{ color: "#2A7C6F" }}>따뜻한 돌봄을</span>
              </motion.h1>

              {/* Accent bar */}
              <motion.div
                className="my-8 h-1 w-20 rounded-full"
                style={{ backgroundColor: "#2A7C6F" }}
                variants={itemVariants}
              />

              <motion.p
                className="mb-10 max-w-lg text-[#1A2332]/55"
                variants={itemVariants}
              >
                횡성의료사회적협동조합은 방문진료·재택의료·마을 돌봄으로
                <br />
                지역의 건강한 삶을 함께 만들어갑니다.
              </motion.p>

              {/* CTA */}
              <motion.div
                className="flex flex-wrap gap-4"
                variants={itemVariants}
              >
                <button
                  onClick={() => navigate("/services")}
                  className="px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{
                    fontWeight: 600,
                    backgroundColor: "#2A7C6F",
                    color: "#fff",
                  }}
                >
                  서비스 신청하기 →
                </button>
                <button
                  onClick={() => navigate("/join")}
                  className="px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-105 border border-[#1A2332]/12 text-[#1A2332]/70 hover:bg-[#1A2332]/5 cursor-pointer"
                  style={{ fontWeight: 600 }}
                >
                  조합원 가입하기
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom: Contact info */}
          <motion.footer className="mt-16 w-full" variants={itemVariants}>
            <div className="grid grid-cols-3 gap-5 text-xs text-[#1A2332]/40">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 shrink-0" style={{ color: "#2A7C6F" }} />
                <span>www.hsmedcoop.or.kr</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" style={{ color: "#2A7C6F" }} />
                <span>033-342-0505</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: "#2A7C6F" }} />
                <span>강원도 횡성군 횡성읍</span>
              </div>
            </div>
          </motion.footer>
        </div>

        {/* ── Right: Image with clip-path ── */}
        <motion.div
          className="w-1/2 min-h-full mt-40 bg-cover bg-center lg:w-2/5"
          style={{
            backgroundImage: `url(${HERO_IMAGE})`,
          }}
          initial={{ clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }}
          animate={{ clipPath: "polygon(25% 0, 100% 0, 100% 100%, 0% 100%)" }}
          transition={{ duration: 1.2, ease: "circOut" }}
        />
      </motion.section>
    </>
  );
}