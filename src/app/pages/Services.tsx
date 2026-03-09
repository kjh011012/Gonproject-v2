import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Stethoscope, HeartHandshake, Home as HomeIcon, Leaf,
  ChevronRight, ArrowRight, Phone, Shield, Clock, CheckCircle2,
  PhoneCall, Activity, MapPin,
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

const IMG_HERO = "https://images.unsplash.com/photo-1758691463333-c79215e8bc3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGV0aG9zY29wZSUyMGRvY3RvciUyMHBhdGllbnQlMjB0cnVzdCUyMGNvbnN1bHRhdGlvbnxlbnwxfHx8fDE3NzI4OTQ0MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const SERVICES = [
  {
    icon: Stethoscope,
    title: "OO의원",
    subtitle: "1차 의료 중심 건강관리",
    desc: "만성질환 관리, 건강검진, 상담까지. 지역밀착 1차 의료기관으로서 주민의 건강을 첫 번째에서 지킵니다.",
    items: ["일반 진료", "건강검진", "만성질환 관리", "비급여 상담"],
    image: "https://images.unsplash.com/photo-1764727291644-5dcb0b1a0375?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY2xpbmljJTIwcmVjZXB0aW9uJTIwZGVzayUyMGJyaWdodCUyMG1vZGVybnxlbnwxfHx8fDE3NzI4OTQ0MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    link: "/services/clinic",
    color: "#1F4B43",
  },
  {
    icon: HomeIcon,
    title: "OO재택의료센터",
    subtitle: "찾아가는 방문진료",
    desc: "거동이 어려우신 분, 퇴원 후 관리가 필요한 분에게 의료진이 직접 찾아갑니다.",
    items: ["방문 진료", "재택 건강관리", "퇴원 후 모니터링", "돌봄 연계"],
    image: "https://images.unsplash.com/photo-1770822788455-f14be32b0d00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwY2FyZSUyMGhvbWUlMjB2aXNpdCUyMGRvY3RvciUyMGNvbnN1bHRhdGlvbiUyMHdhcm18ZW58MXx8fHwxNzcyODk0Mzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    link: "/services/homecare",
    color: "#6E958B",
  },
  {
    icon: HeartHandshake,
    title: "OO가정간호센터",
    subtitle: "가정에서의 전문 간호",
    desc: "전문 간호사가 가정을 방문하여 건강관리, 간호상담, 투약 관리 등을 지원합니다.",
    items: ["가정간호", "간호상담", "투약 관리", "건강교육"],
    image: "https://images.unsplash.com/photo-1765896387387-0538bc9f997e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzZSUyMGNhcmVnaXZlciUyMGVsZGVybHklMjBob21lJTIwY2FyZSUyMGdlbnRsZXxlbnwxfHx8fDE3NzI4OTQzOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    link: "/services/nursing",
    color: "#C87C5A",
  },
];

export function ServicesPage() {
  const { isSenior } = useSeniorMode();
  const navigate = useNavigate();

  return (
    <div className="contents">
      {/* Hero */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback src={IMG_HERO} alt="사업소 안내" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D1F1C]/90 via-[#1F4B43]/60 to-transparent" />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
            <Link to="/" className="hover:text-white/70">홈</Link>
            <ChevronRight size={14} />
            <span className="text-white/70">사업소 안내</span>
          </div>
          <h1
            className="text-white text-[30px] md:text-[40px] mb-4"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700, lineHeight: 1.3 }}
          >
            의료와 돌봄이 만나는 곳
          </h1>
          <p className="text-white/60 max-w-lg text-lg mb-8">
            OO의원을 중심으로 재택의료, 가정간호가 이어지는 통합 케어 시스템입니다.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/services/rights" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/15 hover:bg-white/20 transition-colors text-sm" style={{ fontWeight: 500 }}>
              <Shield size={14} />환자권리장전
            </Link>
            <button
              onClick={() => alert(`대표전화: ${V.대표전화}`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C87C5A] text-white hover:bg-[#B56E4E] transition-colors text-sm cursor-pointer"
              style={{ fontWeight: 600 }}
            >
              <PhoneCall size={14} />전화 문의
            </button>
          </div>
        </div>
      </section>

      {/* Quick overview strip */}
      <section className="bg-[#1F4B43]">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 py-0">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {SERVICES.map((s) => (
              <Link
                key={s.title}
                to={s.link}
                className="flex items-center gap-4 px-6 py-5 hover:bg-white/5 transition-colors group"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}30` }}>
                  <s.icon size={22} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm" style={{ fontWeight: 700 }}>{s.title}</p>
                  <p className="text-white/50 text-xs">{s.subtitle}</p>
                </div>
                <ArrowRight size={16} className="text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Service units */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <Anim className="space-y-16 md:space-y-24">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center"
              >
                <div className={`${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="rounded-2xl overflow-hidden shadow-xl group">
                    <ImageWithFallback src={s.image} alt={s.title} className="w-full aspect-[16/10] object-cover group-hover:scale-[1.02] transition-transform duration-700" />
                  </div>
                </div>
                <div className={`${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}0D` }}>
                      <s.icon size={24} style={{ color: s.color }} />
                    </div>
                    <div>
                      <h2 className="text-[#1F2623] text-xl md:text-2xl" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}>
                        {s.title}
                      </h2>
                      <p className="text-sm text-[#999]">{s.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-[#666] leading-relaxed mb-6 text-lg">{s.desc}</p>
                  <div className="grid grid-cols-2 gap-2.5 mb-8">
                    {s.items.map((item) => (
                      <div key={item} className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#F9F8F5] border border-[#E5E5E5]">
                        <CheckCircle2 size={16} className="text-[#6E958B] shrink-0" />
                        <span className="text-sm text-[#333]" style={{ fontWeight: 500 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={s.link}
                      className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm text-white transition-colors"
                      style={{ backgroundColor: s.color, fontWeight: 600 }}
                    >
                      자세히 보기 <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <button
                      onClick={() => alert(`대표전화: ${V.대표전화}`)}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#E5E5E5] text-[#666] text-sm hover:bg-[#F9F8F5] transition-colors cursor-pointer"
                      style={{ fontWeight: 500 }}
                    >
                      <Phone size={14} /> 전화 문의
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </Anim>
        </div>
      </section>

      {/* Care pathway */}
      <section className="py-16 md:py-24 bg-[#F9F8F5]">
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 text-center">
          <Anim>
            <motion.div variants={fadeUp}>
              <span className="inline-block px-3 py-1 rounded-md bg-[#1F4B43]/8 text-[#1F4B43] text-xs mb-4" style={{ fontWeight: 700, letterSpacing: "0.05em" }}>
                HOW TO USE
              </span>
              <h2 className="text-[#1F2623] text-xl md:text-2xl mb-2" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}>
                이용 방법
              </h2>
              <p className="text-[#999] mb-10">어렵지 않습니다. 전화 한 통이면 시작됩니다.</p>
            </motion.div>
          </Anim>
          <Anim className="flex flex-col md:flex-row gap-4 md:gap-6">
            {[
              { step: "01", title: "상담 요청", desc: "전화 또는 온라인으로 현재 상황을 알려주세요.", color: "#1F4B43" },
              { step: "02", title: "서비스 연결", desc: "필요한 진료·방문·돌봄 등 선택지를 안내합니다.", color: "#6E958B" },
              { step: "03", title: "꾸준한 관리", desc: "일회성이 아닌, 생활 속 건강관리를 이어갑니다.", color: "#C87C5A" },
            ].map((s) => (
              <motion.div key={s.step} variants={fadeUp} className="flex-1 bg-white rounded-xl p-6 border border-[#E5E5E5] shadow-sm">
                <div className="w-12 h-12 rounded-full text-white flex items-center justify-center mx-auto mb-4 text-lg shadow-lg" style={{ fontWeight: 700, background: s.color }}>
                  {s.step}
                </div>
                <h3 className="text-[#1F2623] mb-2" style={{ fontWeight: 700 }}>{s.title}</h3>
                <p className="text-sm text-[#777] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </Anim>
          <div className="mt-10">
            <button
              onClick={() => alert(`대표전화: ${V.대표전화}`)}
              className="px-8 py-3.5 rounded-full bg-[#1F4B43] text-white hover:bg-[#2A6359] transition-colors text-sm cursor-pointer inline-flex items-center gap-2"
              style={{ fontWeight: 600 }}
            >
              <Phone size={14} />지금 상담하기
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
