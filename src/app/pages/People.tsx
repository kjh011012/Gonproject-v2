import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight, ArrowRight,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

/* ─── animation helpers ─── */
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

/* ─── data ─── */
interface Member {
  name: string;
  role: string;
  desc: string;
  img: string;
}

interface TeamSection {
  id: string;
  label: string;
  tagline: string;
  accent: string;
  description: string;
  members: Member[];
}

const SECTIONS: TeamSection[] = [
  {
    id: "medical",
    label: "의료팀",
    tagline: "MEDICAL TEAM",
    accent: "#1F4B43",
    description:
      "지역 주민의 건강을 최전선에서 책임지는 치료 전문가들입니다. 주치의 제도를 통해 만성질환 관리부터 급성기 진료까지, 주민 한 분 한 분의 건강 이력을 함께 기억하며 돌봅니다.",
    members: [
      {
        name: "김정호",
        role: "밝음의원 원장 · 가정의학과 전문의",
        desc: "20년간 농촌 1차 의료에 헌신. 주민 주치의로서 만성질환 관리와 예방 건강 교육을 이끌고 있습니다.",
        img: "https://images.unsplash.com/photo-1741675121661-3ace9d68caba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBtYWxlJTIwZG9jdG9yJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcyOTcyMjI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      },
      {
        name: "이수진",
        role: "진료의 · 내과 전문의",
        desc: "재택의료센터와 협진하며, 거동이 불편한 어르신 댁을 직접 방문하여 진료합니다.",
        img: "https://images.unsplash.com/photo-1659353887019-b142198f2668?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmZW1hbGUlMjBkb2N0b3IlMjBzdGV0aG9zY29wZSUyMHBvcnRyYWl0fGVufDF8fHx8MTc3Mjk3MjIzMHww&ixlib=rb-4.1.0&q=80&w=1080",
      },
      {
        name: "박미영",
        role: "밝음가정간호센터장 · 간호사",
        desc: "가정간호 전문 간호사로, 퇴원  가정에서의 치료 연속성을 책임집니다. 상처 관리부터 건강 상담까지.",
        img: "https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZlbWFsZSUyMG51cnNlJTIwcG9ydHJhaXQlMjBob3NwaXRhbHxlbnwxfHx8fDE3NzI5NzIyMjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      },
      {
        name: "최원석",
        role: "밝음재택의료센터 · 간호사",
        desc: "재택의료 현장에서 의사와 함께 방문 진료를 지원하고, 환자 모니터링과 투약 관리를 수행합니다.",
        img: "https://images.unsplash.com/photo-1660551551614-8659347ed283?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBtYWxlJTIwcGhhcm1hY2lzdCUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzcyOTcyMjM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      },
    ],
  },
  {
    id: "care",
    label: "돌봄·복지팀",
    tagline: "CARE & WELFARE",
    accent: "#6E958B",
    description:
      "의료만으로 해결할 수 없는 삶의 빈틈을 메우는 사람들입니다. 사회복지사와 돌봄 활동가가 어르신의 일상을 함께하며 복지 제도 연계, 정서 지원, 생활 돌봄을 제공합니다.",
    members: [
      {
        name: "한지원",
        role: "사회복지팀장 · 사회복지사",
        desc: "지역 어르신의 복지 수요를 파악하고, 행정·의료·돌봄 서비스를 유기적으로 연결하는 허브 역할을 합니다.",
        img: "https://images.unsplash.com/photo-1761933803826-7782e8bfe7fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZlbWFsZSUyMHNvY2lhbCUyMHdvcmtlciUyMGNvbW11bml0eXxlbnwxfHx8fDE3NzI5NzIyMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      },
      {
        name: "정태민",
        role: "돌봄 코디네이터 · 사회복지사",
        desc: "방문 돌봄 서비스를 기획·조율하며, 돌봄이 필요한 가정에 맞춤형 지원을 설계합니다.",
        img: "https://images.unsplash.com/photo-1644379911960-2d66cb3e4396?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbGUlMjBzb2NpYWwlMjB3b3JrZXIlMjBlbGRlcmx5JTIwY2FyZXxlbnwxfHx8fDE3NzI5NzIyMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      },
      {
        name: "윤서연",
        role: "가정돌봄 활동가",
        desc: "어르신 댁을 직접 방문하여 식사 보조, 외출 동행, 말벗 등 생활 밀착형 돌봄을 제공합니다.",
        img: "https://images.unsplash.com/photo-1761921234774-703e776dd1ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwY2FyZWdpdmVyJTIwZWxkZXJseSUyMGhvbWUlMjB2aXNpdHxlbnwxfHx8fDE3NzI5NzIyNDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      },
    ],
  },
  {
    id: "operations",
    label: "운영·행정팀",
    tagline: "OPERATIONS",
    accent: "#8B7355",
    description:
      "조합이 안정적으로 운영될 수 있도록 행정, 재무, 기획 업무를 총괄합니다. 조합원 소통 창구이자, 모든 사업의 뒤를 든든히 받치는 사람들입니다.",
    members: [
      {
        name: "송민아",
        role: "사무국장",
        desc: "조합 전체 운영을 총괄하며, 이사회와 조합원 간 소통을 조율합니다. 지역 기관과의 협력 네트워크를 확장하고 있습니다.",
        img: "https://images.unsplash.com/photo-1736939678218-bd648b5ef3bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsJTIwYWRtaW5pc3RyYXRvciUyMG9mZmljZXxlbnwxfHx8fDE3NzI5NzIyMzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      },
    ],
  },
  {
    id: "community",
    label: "조합원·지역 활동가",
    tagline: "COMMUNITY",
    accent: "#4A6E64",
    description:
      "G온돌봄의 진짜 주인은 조합원입니다. 출자금을 내고, 총회에 참여하고, 이웃의 건강을 함께 걱정하는 주민 한 분 한 분이 이 공동체를 만들어갑니다.",
    members: [
      {
        name: "김순자",
        role: "조합원 대표 · 마을건강위원",
        desc: "마을에서 건강 나눔 모임을 이끌며, 어르신들의 목소리를 조합에 전달하는 다리 역할을 하고 있습니다.",
        img: "https://images.unsplash.com/photo-1612691997195-c11c53dc6aa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGVsZGVybHklMjB3b21hbiUyMGNvbW11bml0eSUyMHZvbHVudGVlcnxlbnwxfHx8fDE3NzI5NzIyMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      },
      {
        name: "이병철",
        role: "자원봉사단장",
        desc: "은퇴 후 지역에 정착하여 자원봉사단을 조직. 독거 어르신 안부 확인, 마을 환경 정비 등 주민 주도 활동을 펼치고 있습니다.",
        img: "https://images.unsplash.com/photo-1763664719670-2dc36fb9569b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwa29yZWFuJTIwbWFuJTIwZmFybWVyJTIwY291bnRyeXNpZGV8ZW58MXx8fHwxNzcyOTcyMjM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      },
      {
        name: "박준혁",
        role: "청년 조합원 · 지역활동가",
        desc: "청년의 시각으로 조합 홍보와 디지털 소통을 담당하며, 세대 간 다리를 놓는 활동을 합니다.",
        img: "https://images.unsplash.com/photo-1733647781019-3a4d28ff86db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBtYW4lMjBjb21tdW5pdHklMjBsZWFkZXIlMjB2aWxsYWdlfGVufDF8fHx8MTc3Mjk3MjIzMnww&ixlib=rb-4.1.0&q=80&w=1080",
      },
    ],
  },
];

/* ─── Interactive team section (reference-image inspired) ─── */
function TeamBlock({ section, isReversed }: { section: TeamSection; isReversed: boolean }) {
  const [active, setActive] = useState(0);
  const cur = section.members[active];

  return (
    <section className={`py-16 md:py-24 ${isReversed ? "bg-[#F9F8F5]" : "bg-white"}`}>
      <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
        {/* section header */}
        <Anim className="mb-12 md:mb-16">
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
            <span
              className="text-xs tracking-[0.12em] uppercase"
              style={{ color: section.accent, fontWeight: 700 }}
            >
              {section.tagline}
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-[#1F2623] text-[24px] md:text-[32px] mb-4"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700, lineHeight: 1.35 }}
          >
            {section.label}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#666] max-w-[640px] leading-relaxed">
            {section.description}
          </motion.p>
        </Anim>

        {/* interactive grid – photos left / info right (or reversed) */}
        <Anim
          className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start ${
            isReversed ? "lg:direction-rtl" : ""
          }`}
        >
          {/* ── Photo grid (mosaic) ── */}
          <motion.div
            variants={fadeUp}
            className={`order-1 ${isReversed ? "lg:order-2" : "lg:order-1"}`}
          >
            <div
              className={`grid gap-3 ${
                section.members.length === 1
                  ? "grid-cols-1"
                  : section.members.length === 2
                  ? "grid-cols-2"
                  : section.members.length === 3
                  ? "grid-cols-2"
                  : "grid-cols-2"
              }`}
            >
              {section.members.map((m, i) => {
                const isActive = i === active;
                const isFirst = i === 0;
                return (
                  <motion.button
                    key={m.name}
                    onClick={() => setActive(i)}
                    className={`relative overflow-hidden rounded-2xl focus:outline-none ${
                      isFirst && section.members.length === 3
                        ? "col-span-2"
                        : isFirst && section.members.length >= 4
                        ? "row-span-2"
                        : ""
                    }`}
                    style={{
                      aspectRatio:
                        isFirst && section.members.length >= 3
                          ? section.members.length === 3
                            ? "2/1"
                            : "1/1.15"
                          : "1/1",
                      border: isActive
                        ? `3px solid ${section.accent}`
                        : "3px solid transparent",
                      transition: "border-color 0.4s",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ImageWithFallback
                      src={m.img}
                      alt={m.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* overlay */}
                    <div
                      className="absolute inset-0 transition-opacity duration-300"
                      style={{
                        background: isActive
                          ? "linear-gradient(to top, rgba(31,75,67,0.65) 0%, transparent 60%)"
                          : "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)",
                        opacity: 1,
                      }}
                    />
                    {/* name tag */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-left">
                      <p
                        className="text-white text-sm sm:text-base"
                        style={{ fontWeight: 700, textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
                      >
                        {m.name}
                      </p>
                      <p
                        className="text-white/70 text-xs mt-0.5"
                        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
                      >
                        {m.role.split("·")[0].trim()}
                      </p>
                    </div>
                    {/* active indicator dot */}
                    {isActive && (
                      <motion.div
                        layoutId={`dot-${section.id}`}
                        className="absolute top-3 right-3 w-3 h-3 rounded-full"
                        style={{ backgroundColor: section.accent, boxShadow: "0 0 0 3px rgba(255,255,255,0.6)" }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* ── Detail card ── */}
          <motion.div
            variants={fadeUp}
            className={`order-2 ${isReversed ? "lg:order-1" : "lg:order-2"} flex flex-col`}
          >
            {/* member list */}
            <div className="space-y-2 mb-8">
              {section.members.map((m, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={m.name}
                    onClick={() => setActive(i)}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.4)"; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
                    className="w-full text-left px-4 py-3 rounded-lg"
                    style={{
                      backgroundColor: isActive ? "#fff" : "transparent",
                      boxShadow: isActive ? "0 1px 8px rgba(0,0,0,0.04)" : "none",
                      transition: "background-color 0.3s, box-shadow 0.3s",
                    }}
                  >
                    <p
                      className="text-sm"
                      style={{
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? "#1F2623" : "#999",
                        transition: "color 0.3s",
                      }}
                    >
                      {m.name}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{
                        color: isActive ? section.accent : "#BBB",
                        fontWeight: 500,
                        transition: "color 0.3s",
                      }}
                    >
                      {m.role}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* active member detail */}
            <AnimatePresence mode="wait">
              <motion.div
                key={cur.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl p-6 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.05)] border border-[#F0EDE8]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-full overflow-hidden shrink-0"
                    style={{ boxShadow: `0 0 0 2px ${section.accent}, 0 0 0 4px #fff` }}
                  >
                    <ImageWithFallback src={cur.img} alt={cur.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3
                      className="text-[#1F2623] text-lg"
                      style={{ fontWeight: 700 }}
                    >
                      {cur.name}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: section.accent, fontWeight: 600 }}>
                      {cur.role}
                    </p>
                  </div>
                </div>
                <p className="text-[#666] text-sm leading-relaxed">
                  {cur.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </Anim>
      </div>
    </section>
  );
}

/* ─── Page ─── */
export function PeoplePage() {
  return (
    <div className="contents">
      {/* Hero */}
      <section className="bg-[#1F4B43] pt-16 md:pt-24 pb-36 md:pb-40 relative overflow-visible">
        {/* decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-[0.04] bg-white" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-[0.04] bg-white" />
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative z-10">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-5">
            <Link to="/" className="hover:text-white/70 transition-colors">홈</Link>
            <ChevronRight size={14} />
            <Link to="/about" className="hover:text-white/70 transition-colors">조합소개</Link>
            <ChevronRight size={14} />
            <span className="text-white/80">함께하는 사람들</span>
          </div>
          <h1
            className="text-white text-[28px] md:text-[40px] mb-4"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            함께하는 사람들
          </h1>
          
        </div>

        {/* summary stats – floating card (direct child of section) */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-11 md:-bottom-12 w-[calc(100%-2.5rem)] sm:w-[calc(100%-3rem)] max-w-[900px] z-20">
          <div
            className="bg-white rounded-2xl px-6 py-6 md:px-10 md:py-7 grid grid-cols-4 items-center"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.04)" }}
          >
            {[
              { n: "4+", l: "진료 의료진" },
              { n: "3+", l: "돌봄·복지 활동가" },
              { n: "10+", l: "자원봉사자" },
              { n: "200+", l: "조합원" },
            ].map((s, idx) => (
              <div
                key={s.l}
                className="flex items-center justify-center py-1"
                style={idx > 0 ? { borderLeft: "1px solid #E8E5E0" } : undefined}
              >
                <div className="text-center">
                  <p className="text-[#1F4B43] text-[24px] md:text-[30px]" style={{ fontWeight: 800 }}>{s.n}</p>
                  <p className="text-[#7A8584] text-xs mt-1" style={{ fontWeight: 500 }}>{s.l}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team sections */}
      <div className="pt-14 md:pt-16 bg-white">
        {SECTIONS.map((sec, i) => (
          <TeamBlock key={sec.id} section={sec} isReversed={i % 2 === 1} />
        ))}
      </div>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-[#1F4B43]">
        <div className="max-w-[700px] mx-auto px-5 sm:px-6 text-center">
          <Anim>
            <motion.h2
              variants={fadeUp}
              className="text-white text-[22px] md:text-[28px] mb-4"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
            >
              당신도 함께할 수 있습니다
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/55 mb-8 leading-relaxed">
              조합원으로 참여하시면 의료·돌봄 혜택은 물론, 지역 건강 공동체의 의사결정에도 함께하실 수 있습니다.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/join"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm transition-colors"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 600 }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.25)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)")}
              >
                조합원 가입하기 <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm text-white/60 hover:text-white/80 transition-colors"
                style={{ fontWeight: 500 }}
              >
                조합소개로 돌아가기
              </Link>
            </motion.div>
          </Anim>
        </div>
      </section>
    </div>
  );
}