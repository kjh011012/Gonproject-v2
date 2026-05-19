import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Building, CheckCircle2, Heart, Lightbulb, Shield, Stethoscope } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import introPoster2 from "../../assets/desktop_info.png";
import mobileInfo1 from "../../assets/mobile_info_1.png";
import mobileInfo2 from "../../assets/mobile_info_2.png";
import mobileInfo3 from "../../assets/mobile_infor_3.png";
import mobileInfo4 from "../../assets/mobile_info_4.png";

const HERO_TOP = "https://images.unsplash.com/photo-1765510103179-0c2f628d2ff2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920";
const INTRO_TITLE = "강원 농산어촌 의료 복지 사회적 협동조합을 소개 합니다";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function AboutIntroPage() {
  const [typedTitle, setTypedTitle] = useState("");

  useEffect(() => {
    let idx = 0;
    const timer = window.setInterval(() => {
      idx += 1;
      setTypedTitle(INTRO_TITLE.slice(0, idx));
      if (idx >= INTRO_TITLE.length) window.clearInterval(timer);
    }, 60);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="contents">
      <section className="bg-white pt-0 pb-16 md:pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-8"
        >
          <figure className="relative w-full overflow-hidden bg-[#10211D]">
            <ImageWithFallback src={HERO_TOP} alt="강원 농산어촌 의료 복지 사회적 협동조합 소개 배너" className="h-[220px] w-full object-cover md:h-[320px]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-transparent" />
          </figure>
        </motion.div>

        <div className="mx-auto max-w-[1380px] px-5 sm:px-6">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mb-8 text-[#1F2623] text-[22px] md:text-[30px] flex items-center gap-2.5"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700, lineHeight: 1.55 }}
          >
            <motion.span
              className="relative inline-flex items-center justify-center shrink-0"
              style={{ width: "1.15em", height: "1.15em" }}
              initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
            >
              <Lightbulb className="w-full h-full text-[#C87C5A]" strokeWidth={1.8} />
              <motion.span
                className="absolute text-[0.38em] text-[#C87C5A]"
                style={{ fontWeight: 900, marginTop: "-0.15em" }}
                animate={{ y: [0, -1.5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
              >
                ?
              </motion.span>
            </motion.span>
            <span>{typedTitle}</span>
            <motion.span
              aria-hidden="true"
              className="inline-block w-[1px] h-[1.05em] bg-[#1F2623] ml-1 align-middle"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            />
          </motion.h1>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="space-y-4 lg:hidden"
          >
            <figure className="overflow-hidden rounded-2xl border border-[#DDE7E4] bg-white shadow-[0_14px_40px_rgba(22,44,38,0.08)]">
              <ImageWithFallback src={mobileInfo1} alt="조합소개 모바일 이미지 1" className="h-full w-full object-cover" />
            </figure>
            <figure className="overflow-hidden rounded-2xl border border-[#DDE7E4] bg-white shadow-[0_14px_40px_rgba(22,44,38,0.08)]">
              <ImageWithFallback src={mobileInfo2} alt="조합소개 모바일 이미지 2" className="h-full w-full object-cover" />
            </figure>
            <figure className="overflow-hidden rounded-2xl border border-[#DDE7E4] bg-white shadow-[0_14px_40px_rgba(22,44,38,0.08)]">
              <ImageWithFallback src={mobileInfo3} alt="조합소개 모바일 이미지 3" className="h-full w-full object-cover" />
            </figure>
            <figure className="overflow-hidden rounded-2xl border border-[#DDE7E4] bg-white shadow-[0_14px_40px_rgba(22,44,38,0.08)]">
              <ImageWithFallback src={mobileInfo4} alt="조합소개 모바일 이미지 4" className="h-full w-full object-cover" />
            </figure>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="hidden lg:block"
          >
            <figure className="overflow-hidden rounded-2xl border border-[#DDE7E4] bg-white shadow-[0_14px_40px_rgba(22,44,38,0.08)]">
              <ImageWithFallback
                src={introPoster2}
                alt="조합소개 데스크탑 이미지"
                className="h-full w-full object-cover"
              />
            </figure>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-14 md:mt-20"
          >
            <h2 className="text-[#1F2623] text-[24px] md:text-[30px] flex items-center gap-2.5" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700, lineHeight: 1.4 }}>
              <Stethoscope className="text-[#C87C5A] shrink-0" style={{ width: "1em", height: "1em" }} />
              우리가 그리는 돌봄의 구조
            </h2>
            <p className="text-[#7A8584] mt-2 max-w-lg">
              의료협진 체계를 중심으로, <span className="text-[#1F4B43]" style={{ fontWeight: 700 }}>조합이 만들어갈 변화</span>를 소개합니다
            </p>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
              <div className="rounded-2xl border border-[#E5E5E5] bg-white overflow-hidden flex flex-col">
                <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-[#1F4B43]/8 text-[#1F4B43] mb-2 text-[14px]" style={{ fontWeight: 700 }}>의료협진 체계</span>
                  <p className="text-[#999] text-[13px] font-bold">5개 핵심 영역이 유기적으로 연결됩니다</p>
                </div>
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 pb-6 md:pb-8">
                  <div className="relative w-full max-w-[340px] aspect-square">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center">
                      <span className="text-[#1F4B43]" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 900, fontSize: "clamp(18px, 4.8vw, 22px)" }}>
                        의료협진
                      </span>
                    </div>
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 420 420" fill="none">
                      <polygon points="210,42 388,170 322,370 98,370 32,170" fill="none" stroke="#1F4B43" strokeWidth="1.5" strokeDasharray="6 4" strokeOpacity="0.25" />
                      {[[210, 42], [388, 170], [322, 370], [98, 370], [32, 170]].map(([x, y], i) => (
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
                      <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: node.x, top: node.y }}>
                        <div className="rounded-full bg-white flex items-center justify-center text-center shadow-md" style={{ width: "clamp(68px, 22vw, 95px)", height: "clamp(68px, 22vw, 95px)", border: `3px solid ${node.border}` }}>
                          <span className="leading-[1.12] whitespace-pre-line px-1" style={{ fontWeight: 700, color: node.color, fontSize: "clamp(11px, 3.4vw, 16px)" }}>
                            {node.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 px-6 md:px-8 py-4 bg-[#F9F8F5] border-t border-[#F0EEEA] mt-auto">
                  <Stethoscope size={16} className="text-[#1F4B43] shrink-0" />
                  <p className="text-[#666] leading-snug text-[16px]" style={{ fontWeight: 500 }}>
                    주치의 중심 통합 의료협진으로 빈틈 없는 케어를 실현합니다.
                  </p>
                </div>
              </div>

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
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "rgba(31,75,67,0.06)" }}>
                          <item.icon size={16} className="text-[#1F4B43]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="leading-relaxed mb-2 line-through decoration-[#ccc] text-[14px] text-[#c4c1c1]">{item.problem}</p>
                          <div className="flex items-start gap-2">
                            <ArrowRight size={14} className="text-[#1F4B43] shrink-0 mt-0.5" />
                            <p className="text-[#1F2623] text-[14px] leading-relaxed" style={{ fontWeight: 600 }}>{item.solution}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 px-6 md:px-8 py-4 bg-[#F9F8F5] border-t border-[#F0EEEA]">
                  <CheckCircle2 size={16} className="text-[#1F4B43] shrink-0" />
                  <p className="text-[#666] leading-snug text-[16px]" style={{ fontWeight: 500 }}>
                    조합원 가입 하나로, 의료·돌봄·복지가 하나로 연결됩니다.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
