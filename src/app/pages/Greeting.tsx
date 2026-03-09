import { Link } from "react-router";
import { motion } from "motion/react";
import { ChevronRight, Quote, Heart, Users, Leaf } from "lucide-react";
import { useSeniorMode } from "../components/SeniorModeContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { V, C } from "../components/shared";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

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

const IMG_HERO = "https://images.unsplash.com/photo-1771411068337-dce562770ca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBydXJhbCUyMHZpbGxhZ2UlMjBlbGRlcmx5JTIwY2FyZSUyMGNvbW11bml0eSUyMHdhcm18ZW58MXx8fHwxNzcyOTU5ODU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export function GreetingPage() {
  const { isSenior } = useSeniorMode();

  return (
    <div className="contents">
      {/* ── Hero ── */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback src={IMG_HERO} alt="인사말" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D1F1C]/90 via-[#1F4B43]/65 to-transparent" />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
            <Link to="/" className="hover:text-white/70 transition-colors">홈</Link>
            <ChevronRight size={14} />
            <Link to="/about" className="hover:text-white/70 transition-colors">조합소개</Link>
            <ChevronRight size={14} />
            <span className="text-white/70">인사말</span>
          </div>
          <h1
            className={`text-white mb-4 ${isSenior ? "text-[34px] md:text-[44px]" : "text-[30px] md:text-[40px]"}`}
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700, lineHeight: 1.3 }}
          >
            인사말
          </h1>
          <p className="text-white/60 max-w-lg text-lg">
            {isSenior
              ? "조합장이 드리는 따뜻한 인사입니다"
              : "지역 건강 공동체를 향한 첫 인사를 전합니다"}
          </p>
        </div>
      </section>

      {/* ── Main Greeting ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[900px] mx-auto px-5 sm:px-6">
          <Anim>
            <motion.div variants={fadeUp} className="text-center mb-12 md:mb-16">
              
              <h2
                className="text-[#1F2623] text-[24px] md:text-[32px] mb-3"
                style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700, lineHeight: 1.4 }}
              >
                {isSenior
                  ? "반갑습니다, 여러분"
                  : "건강한 지역사회를 함께 만들어 갑니다"}
              </h2>
              <div className="w-12 h-[2px] bg-[#1F4B43] mx-auto" />
            </motion.div>
          </Anim>

          <Anim className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-14 items-start">
            {/* Representative photo */}
            <motion.div variants={fadeUp} className="flex flex-col items-center lg:items-start">
              <div className="w-[220px] h-[280px] rounded-2xl overflow-hidden bg-[#F9F8F5] border border-[#E5E5E5] shadow-lg mb-5">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1F4B43]/5 to-[#6E958B]/10">
                  <Users size={48} className="text-[#1F4B43]/20" />
                </div>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-[#1F2623]" style={{ fontWeight: 700 }}>이사장</p>
                <p className="text-sm text-[#999] mt-0.5">{V.조합명_짧게}</p>
              </div>
            </motion.div>

            {/* Greeting text */}
            <motion.div variants={fadeUp}>
              {/* Pull quote */}
              <div className="relative mb-8 pl-5 border-l-4 border-[#1F4B43]">
                <Quote size={24} className="text-[#1F4B43]/10 absolute -top-1 -left-1" />
                <p
                  className="text-[#1F4B43] text-lg md:text-xl italic"
                  style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 500, lineHeight: 1.7 }}
                >
                  {isSenior
                    ? "아프면 어디로 가야 할지, 먼저 안내해 드리겠습니다.\n필요하면 진료도, 돌봄도 이어 드리겠습니다."
                    : "의료가 닿지 않는 곳에 다리를 놓고,\n돌봄이 필요한 곳에 온기를 전하겠습니다."}
                </p>
              </div>

              <div className="space-y-5 text-[#555] leading-[1.9]">
                {isSenior ? (
                  <>
                    <p>
                      안녕하세요. {V.조합명} 홈페이지를 찾아주셔서 감사합니다.
                    </p>
                    <p>
                      우리 조합은 병원에 가기 어려운 분들, 혼자서 아픈 것을 참고 계신 분들을 위해 만들어졌습니다.
                      동네에서 가까운 곳에 의원을 열고, 집으로 직접 찾아가는 진료와 돌봄 서비스를 준비하고 있습니다.
                    </p>
                    <p>
                      의사, 간호사, 사회복지사가 함께 일하면서 병원 진료뿐만 아니라
                      건강 상담, 운동 프로그램, 생활 도움까지 한꺼번에 받으실 수 있도록 하겠습니다.
                    </p>
                    <p>
                      무엇보다 조합원 여러분이 주인입니다.
                      여러분의 의견을 듣고, 여러분이 원하는 방향으로 함께 만들어 가겠습니다.
                    </p>
                    <p>
                      건강이 걱정되실 때, 언제든 연락 주십시오.
                      따뜻한 마음으로 함께하겠습니다. 감사합니다.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      안녕하세요. {V.조합명} 홈페이지를 방문해 주셔서 감사합니다.
                    </p>
                    <p>
                      강원도 농산어촌 지역은 고령화와 의료 접근성 부족이라는 이중 과제를 안고 있습니다.
                      가까운 병원까지 수십 킬로미터를 이동해야 하고, 만성질환 관리는커녕 기본적인 건강 상담조차
                      쉽지 않은 분들이 많습니다. 이러한 현실 속에서 우리 조합은
                      <strong style={{ color: "#1F4B43" }}> 주민 스스로가 건강을 지킬 수 있는 공동체</strong>를
                      만들기 위해 설립되었습니다.
                    </p>
                    <p>
                      {V.조합명}은 1차 의료기관인 밝음의원 개원을 시작으로, 재택의료센터와 가정간호센터를
                      함께 운영하여 <strong style={{ color: "#1F4B43" }}>예방 → 진료 → 돌봄 → 재활</strong>이
                      끊기지 않는 통합 건강관리 체계를 구축해 나가겠습니다.
                    </p>
                    <p>
                      외부 자본의 이익이 아닌 조합원의 참여와 출자를 바탕으로,
                      1인 1표의 민주적 의사결정을 통해 운영됩니다.
                      전문 의료진과 사회복지사, 지역 활동가가 한 팀이 되어
                      건강교실, 걷기 모임, 영양 상담 등 지역 맞춤형 프로그램도 함께 운영하며
                      주민의 일상 속 건강을 함께 가꾸겠습니다.
                    </p>
                    <p>
                      <strong style={{ color: "#1F4B43" }}>아프면 어디로 가야 할지, 먼저 안내해 드리겠습니다.</strong><br />
                      필요하면 진료도, 돌봄도 이어 드리겠습니다.
                      조합원 한 분 한 분의 목소리에 귀 기울이며, 지역 건강 공동체의 든든한 울타리가 되겠습니다.
                    </p>
                    <p>
                      여러분의 관심과 참여가 곧 우리 지역의 건강입니다. 감사합니다.
                    </p>
                  </>
                )}
              </div>

              {/* Signature */}
              <div className="mt-10 pt-8 border-t border-[#E5E5E5]">
                <p className="text-[#1F2623]" style={{ fontWeight: 700 }}>
                  {V.조합명}
                </p>
                <p className="text-[#999] text-sm mt-1">이사장 드림</p>
              </div>
            </motion.div>
          </Anim>
        </div>
      </section>

      {/* ── Values Strip ── */}
      

      {/* ── CTA ── */}
      <section className="py-12 bg-white border-t border-[#E5E5E5]">
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 text-center">
          <Anim>
            <motion.div variants={fadeUp}>
              <p className="text-[#666] mb-5">
                {isSenior
                  ? "조합에 대해 더 알고 싶으시면 아래 버튼을 눌러주세요"
                  : "조합의 비전과 활동을 더 자세히 알아보세요"}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1F4B43] text-white text-sm hover:bg-[#2A6359] transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  조합소개 보기
                </Link>
                <Link
                  to="/join"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#1F4B43] text-[#1F4B43] text-sm hover:bg-[#1F4B43]/5 transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  조합원 가입하기
                </Link>
              </div>
            </motion.div>
          </Anim>
        </div>
      </section>
    </div>
  );
}
