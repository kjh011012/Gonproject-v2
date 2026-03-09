import { useNavigate } from "react-router";
import { PhoneCall, MessageCircle, ClipboardCheck, ChevronRight, PenLine, CheckCircle2, Send } from "lucide-react";
import { useSeniorMode } from "../components/SeniorModeContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { IMG } from "../components/image-data";
import {
  V, Section, SectionTitle, SummaryBox, FAQAccordion,
} from "../components/shared";
import { MembershipForm } from "../components/MembershipForm";

const SENIOR_FAQ = [
  { q: "출자금은 꼭 내야 하나요?", a: `네, 조합원이 되려면 ${V.출자금_최저} 이상의 출자금이 필요합니다. 금액은 부담 없는 범위에서 정하시면 됩니다.` },
  { q: "탈퇴하면 돌려받나요?", a: "네, 정관과 절차에 따라 출자금을 환급받으실 수 있습니다." },
  { q: "병원비가 다 할인되나요?", a: "조합 자체 프로그램에 한하며, 일반 병원비 할인과는 다릅니다. 상담 시 안내드려요." },
  { q: "개인정보는 왜 받나요?", a: "가입 처리와 안내 연락을 위해 꼭 필요한 최소한의 정보만 수집합니다." },
  { q: "공지/모임 소식은 어디서 보나요?", a: "홈페이지 소식/커뮤니티 페이지와 문자/카카오 채널로 안내합니다." },
];

export function JoinPage() {
  const { isSenior } = useSeniorMode();
  const navigate = useNavigate();

  return (
    <div>
      {/* ── 이미지 히어로 (전화 도움 사진) ── */}
      <section className="relative">
        <div className="aspect-[16/9] md:aspect-[21/8] min-h-[380px] md:min-h-[360px]">
          <ImageWithFallback src={IMG.joinHero} alt="전화 상담 안내" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-[#111827]/30 to-[#111827]/10" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 pt-20 w-full">
            {!isSenior && (
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[#67B89A] text-xs mb-3" style={{ fontWeight: 600 }}>
                조합원 가입
              </span>
            )}
            <h1
              className={`text-white mb-2 ${isSenior ? "text-[24px] md:text-[32px]" : "text-2xl md:text-3xl"} leading-tight`}
              style={{ fontWeight: 800 }}
            >
              {isSenior ? "가입은 어렵지 않아요." : "단 1분이면 우리 조합원이 됩니다."}
            </h1>
            <p className={`text-white/80 mb-5 ${isSenior ? "text-[17px]" : "text-sm md:text-base"}`}>
              {isSenior ? "3번만 누르면 됩니다. 걱정되면 전화로 같이 해요." : "조합의 주인으로 참여하고, 지역 건강 돌봄의 연결을 함께 만듭니다."}
            </p>
            {/* 상단 큰 버튼들 */}
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
              <button
                onClick={() => alert(`대표전화: ${V.대표전화}`)}
                className={`flex items-center justify-center gap-2 rounded-full bg-[#67B89A] text-white hover:bg-[#5AA889] transition-colors cursor-pointer active:scale-[0.98] ${isSenior ? "px-5 py-3 min-h-[48px] text-[16px]" : "px-4 py-2.5 min-h-[40px] text-sm"}`}
                style={{ fontWeight: 700 }}
              >
                <PhoneCall size={isSenior ? 20 : 16} />
                {isSenior ? `전화로 가입 도와주세요(${V.대표전화})` : "전화로 가입 도움"}
              </button>
              <button
                onClick={() => alert(`카카오 채널: ${V.카카오채널}`)}
                className={`flex items-center justify-center gap-2 rounded-full border border-white/30 text-white/90 hover:bg-white/10 transition-colors cursor-pointer active:scale-[0.98] ${isSenior ? "px-5 py-3 min-h-[48px] text-[16px]" : "px-4 py-2.5 min-h-[40px] text-sm"}`}
                style={{ fontWeight: 500 }}
              >
                <MessageCircle size={isSenior ? 18 : 14} /> 카카오톡 문의
              </button>
              <button
                onClick={() => navigate("/inquiries")}
                className={`flex items-center justify-center gap-2 rounded-full border border-white/30 text-white/90 hover:bg-white/10 transition-colors cursor-pointer active:scale-[0.98] ${isSenior ? "px-5 py-3 min-h-[48px] text-[16px]" : "px-4 py-2.5 min-h-[40px] text-sm"}`}
                style={{ fontWeight: 500 }}
              >
                문의 남기기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10초 요약 (어르신) ── */}
      {isSenior && (
        <Section bg="bg-[#FAFAFA]">
          <SummaryBox
            isSenior
            items={[
              "조합원은 '손님'이 아니라 '주인'입니다.",
              "출자금은 씨앗돈(내 지분)이고, 규정에 따라 돌려받습니다.",
              "가입하면 소식/모임/상담 연결이 쉬워집니다.",
            ]}
          />
        </Section>
      )}

      {/* ── 가입 방법 3가지 (어르신) ── */}
      {isSenior && (
        <Section>
          <SectionTitle isSenior title="가입 방법 3가지" sub="원하는 방법을 골라주세요." />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: "&#x1F4F1;", title: "온라인으로 3분 가입", desc: "이름/연락처/주소만 적으면 됩니다.", btn: "가입 시작", action: () => { const el = document.getElementById("membership-form"); el?.scrollIntoView({ behavior: "smooth" }); } },
              { icon: "&#x1F4DE;", title: "전화로 같이 가입", desc: "상담원이 옆에서 천천히 도와드립니다.", btn: "전화하기", action: () => alert(`대표전화: ${V.대표전화}`) },
              { icon: "&#x1F4DD;", title: "문의 남기기", desc: "바쁘시면 남겨주세요. 먼저 연락드립니다.", btn: "문의 남기기", action: () => navigate("/inquiries") },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 text-center">
                <div className="text-3xl mb-3" dangerouslySetInnerHTML={{ __html: c.icon }} />
                <h4 className="text-[#111827] text-[20px] mb-2" style={{ fontWeight: 700 }}>{c.title}</h4>
                <p className="text-[#6B7280] text-[16px] mb-4">{c.desc}</p>
                <button onClick={c.action} className="w-full py-3 min-h-[56px] rounded-xl bg-[#1F6B78] text-white text-[17px] hover:bg-[#185A65] transition-colors cursor-pointer" style={{ fontWeight: 600 }}>{c.btn}</button>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── 가입 신청서 (React 폼 + 안내 이미지) ── */}
      <Section id="membership-form" className="!px-0 sm:!px-4">
        <div className="max-w-6xl mx-auto px-2 sm:px-0">
          {/* ── Form Section Header ── */}
          <div className="relative mb-10 md:mb-14 rounded-2xl overflow-hidden bg-[#1F2623]" style={{ padding: 0 }}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }} />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#1F4B43]/40 to-transparent" />

            
          </div>
        </div>
        <div className="max-w-6xl mx-auto">
          <MembershipForm />
        </div>
      </Section>

      {/* ── FAQ ── */}
      <Section bg="bg-[#FAFAFA]" id="join-faq">
        <SectionTitle isSenior={isSenior} title="자주 묻는 질문" />
        <FAQAccordion items={SENIOR_FAQ} isSenior={isSenior} defaultOpen={isSenior ? 3 : 0} />
      </Section>

      {/* ── 마지막 CTA ── */}
      <Section bg="bg-[#071A2B]">
        <div className="text-center">
          <h2 className={`text-white mb-6 ${isSenior ? "text-[26px] md:text-[30px]" : "text-2xl md:text-3xl"}`} style={{ fontWeight: 700 }}>
            {isSenior ? "지금 시작해 보세요" : "함께 시작해 보세요"}
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <button
              onClick={() => { const el = document.getElementById("membership-form"); el?.scrollIntoView({ behavior: "smooth" }); }}
              className={`w-full sm:w-auto px-8 rounded-full bg-[#1F6B78] text-white hover:bg-[#185A65] transition-colors cursor-pointer active:scale-[0.98] ${isSenior ? "py-4 min-h-[56px] text-[18px]" : "py-3 min-h-[48px]"}`}
              style={{ fontWeight: 700 }}
            >
              지금 가입하기
            </button>
            <button
              onClick={() => alert(`대표전화: ${V.대표전화}`)}
              className={`w-full sm:w-auto px-8 rounded-full border border-white/20 text-white hover:bg-white/5 transition-colors cursor-pointer active:scale-[0.98] ${isSenior ? "py-4 min-h-[56px] text-[18px]" : "py-3 min-h-[48px]"}`}
              style={{ fontWeight: 600 }}
            >
              <PhoneCall size={isSenior ? 20 : 16} className="inline mr-2" />
              {isSenior ? "전화로 가입 도와주세요" : "전화 문의"}
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}