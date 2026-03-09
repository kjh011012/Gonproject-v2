import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function AboutIntroPage() {
  return (
    <div className="contents">
      <section className="bg-[#F7F8F7] pt-28 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-[980px] px-5 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h1
              className="text-[#1F2623] text-[28px] md:text-[36px]"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700, lineHeight: 1.35 }}
            >
              조합소개
            </h1>
            <p className="mt-4 text-[#5E6B68] leading-relaxed">
              이 페이지는 새 조합소개 콘텐츠를 작성할 공간입니다.
            </p>
            <p className="mt-1 text-sm text-[#7B8785]">
              기존 작성 내용은 조합원 메뉴의 <strong>우리는</strong>으로 이동되었습니다.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-8 rounded-2xl border border-[#DDE7E4] bg-white p-6 md:p-8"
          >
            <p className="text-[#1F2623]" style={{ fontWeight: 700 }}>
              새 소개 작성 준비
            </p>
            <p className="mt-2 text-sm text-[#6E7A78] leading-relaxed">
              강원 농산어촌의료사회적협동조합의 새로운 소개 문구, 비전, 핵심 사업 내용을 이 페이지에 직접 구성하면 됩니다.
            </p>
            <div className="mt-5">
              <Link
                to="/join/we-are"
                className="inline-flex items-center gap-2 rounded-full border border-[#C8D8D3] px-5 py-2.5 text-sm text-[#1F4B43] transition-colors hover:bg-[#F4FAF8]"
                style={{ fontWeight: 600 }}
              >
                우리는(기존 내용) 보기 <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

