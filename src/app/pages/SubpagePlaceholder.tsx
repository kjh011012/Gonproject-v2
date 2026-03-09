import { Link, useLocation } from "react-router";
import { ChevronRight, ArrowLeft, Clock } from "lucide-react";

/* ─── Placeholder page for routes under construction ─── */
const PAGE_INFO: Record<string, { title: string; desc: string; parent: string; parentLabel: string }> = {
  "/about/history": { title: "연혁", desc: "조합의 발자취를 한눈에 살펴보세요.", parent: "/about", parentLabel: "조합소개" },
  "/about/organization": { title: "조직도", desc: "조합의 운영 구조를 안내합니다.", parent: "/about", parentLabel: "조합소개" },
  "/about/people": { title: "함께하는 사람들", desc: "조합을 이끌어가는 사람들을 소개합니다.", parent: "/about", parentLabel: "조합소개" },
  "/about/directions": { title: "찾아오시는 길", desc: "방문 방법과 위치를 안내합니다.", parent: "/about", parentLabel: "조합소개" },
  "/community/press": { title: "언론보도", desc: "조합 관련 언론 기사를 모았습니다.", parent: "/community", parentLabel: "커뮤니티" },
  "/community/resources": { title: "자료실", desc: "각종 문서와 자료를 내려받을 수 있습니다.", parent: "/community", parentLabel: "커뮤니티" },
  "/community/daily": { title: "조합, 오늘의 하루", desc: "우리 조합의 따뜻한 일상 기록.", parent: "/community", parentLabel: "커뮤니티" },
  "/services/rights": { title: "환자권리장전", desc: "환자의 권리를 존중합니다.", parent: "/services", parentLabel: "사업소 안내" },
  "/services/clinic": { title: "밝음의원", desc: "1차 의료 중심 건강관리.", parent: "/services", parentLabel: "사업소 안내" },
  "/services/homecare": { title: "밝음재택의료센터", desc: "찾아가는 방문진료 서비스.", parent: "/services", parentLabel: "사업소 안내" },
  "/services/nursing": { title: "밝음가정간호센터", desc: "가정에서의 전문 간호 지원.", parent: "/services", parentLabel: "사업소 안내" },
  "/volunteer": { title: "자원봉사 안내", desc: "이웃을 위한 따뜻한 참여.", parent: "/", parentLabel: "홈" },
  "/donate": { title: "후원 안내 및 신청", desc: "여러분의 후원이 지역 건강 공동체의 씨앗이 됩니다.", parent: "/", parentLabel: "홈" },
  "/search": { title: "검색 결과", desc: "원하시는 정보를 찾아보세요.", parent: "/", parentLabel: "홈" },
};

export function SubpagePlaceholder() {
  const location = useLocation();
  const info = PAGE_INFO[location.pathname] || { title: "페이지 준비 중", desc: "곧 만나보실 수 있습니다.", parent: "/", parentLabel: "홈" };

  return (
    <div className="contents">
      {/* Hero */}
      <section className="bg-[#1F4B43] py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-5">
            <Link to="/" className="hover:text-white/70">홈</Link>
            <ChevronRight size={14} />
            <Link to={info.parent} className="hover:text-white/70">{info.parentLabel}</Link>
            <ChevronRight size={14} />
            <span className="text-white/80">{info.title}</span>
          </div>
          <h1
            className="text-white text-[28px] md:text-[36px] mb-3"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            {info.title}
          </h1>
          <p className="text-white/60">{info.desc}</p>
        </div>
      </section>

      {/* Placeholder content */}
      <section className="py-20 md:py-28 bg-[#F9F8F5]">
        <div className="max-w-[600px] mx-auto px-5 sm:px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#1F4B43]/8 flex items-center justify-center mx-auto mb-6">
            <Clock size={28} className="text-[#1F4B43]" />
          </div>
          <h2 className="text-[#1F2623] text-xl mb-3" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}>
            페이지 준비 중입니다
          </h2>
          <p className="text-[#999] mb-8 leading-relaxed">
            이 페이지는 현재 콘텐츠를 준비하고 있습니다.<br />
            곧 더 나은 모습으로 찾아뵙겠습니다.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to={info.parent}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1F4B43] text-white text-sm hover:bg-[#2A6359] transition-colors"
              style={{ fontWeight: 600 }}
            >
              <ArrowLeft size={14} /> {info.parentLabel}으로 돌아가기
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-full border border-[#D6CCBC] text-[#4A5553] text-sm hover:bg-white transition-colors"
              style={{ fontWeight: 500 }}
            >
              홈으로
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}