import { useState, type ReactNode } from "react";
import {
  ChevronDown,
  CheckCircle2,
  PhoneCall,
  Zap,
} from "lucide-react";

/* ─── 공통 치환 변수 (확정 시 여기만 수정) ─── */
export const V = {
  조합명: "강원농산어촌의료복지사회적협동조합",
  조합명_짧게: "강원농산어촌의료사협",
  조합명_영문: "Gangwon Rural Community Healthcare Social Cooperative",
  대표전화: "추후 개통예정",
  카카오채널: "추후 개설예정",
  주소: "추후 게시예정",
  운영시간: "추후 게시예정",
  이메일: "추후 게시예정",
  출자금_최저: "5만 원",
  출자금_예시선택: ["5만원", "10만원", "직접입력"],
  가입소요시간: "3분",
};

/* ─── 어르신 모드 텍스트 헬퍼 ─── */
/** 어르신 모드일 때 쉬운 설명으로 치환 */
export function st(normal: string, senior: string, isSenior?: boolean): string {
  return isSenior ? senior : normal;
}

/* ─── 컬러 시스템 ─── */
export const C = {
  primary: "#1F4B43",
  primaryLight: "#2A6359",
  secondary: "#6E958B",
  cream: "#F7F2E8",
  sand: "#EAE1D3",
  terracotta: "#C87C5A",
  charcoal: "#1F2623",
  teal: "#5B8F8B",
  text: "#1F2623",
  textSub: "#4A5553",
  textMuted: "#7A8584",
  border: "#D6CCBC",
  white: "#FFFFFF",
};

/* ─── SummaryBox (10초 요약) ─── */
interface SummaryBoxProps {
  title?: string;
  items: string[];
  badges?: string[];
  isSenior?: boolean;
}
export function SummaryBox({
  title = "한 줄로 말한다면",
  items,
  badges,
  isSenior,
}: SummaryBoxProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] shadow-sm">
      {/* 상단 컬러 바 */}
      <div className="h-1 w-full bg-gradient-to-r from-[#1F4B43] via-[#6E958B] to-[#F7F2E8]" />

      <div className={isSenior ? "p-6 md:p-8" : "p-5 md:p-7"}>
        {/* 헤더 */}
        <div className="flex items-center gap-2.5 mb-5 md:mb-6">
          <div className="w-9 h-9 rounded-lg bg-[#1F4B43]/8 flex items-center justify-center">
            <Zap size={18} className="text-[#1F4B43]" />
          </div>
          <h3
            className={`text-[#1F4B43] ${isSenior ? "text-[20px] md:text-[22px]" : "text-base md:text-lg"}`}
            style={{ fontWeight: 700 }}
          >
            {title}
          </h3>
        </div>

        {/* 아이템 리스트 */}
        <div className="space-y-0">
          {items.map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-3.5 ${i < items.length - 1 ? "border-b border-[#F3F4F6]" : ""} ${isSenior ? "py-4" : "py-3"}`}
            >
              {/* 넘버링 */}
              <span
                className={`shrink-0 w-6 h-6 rounded-full bg-[#1F4B43] text-white flex items-center justify-center text-[11px] mt-0.5`}
                style={{ fontWeight: 700 }}
              >
                {i + 1}
              </span>
              <span
                className={`text-[#111827] ${isSenior ? "text-[20px] leading-[1.7]" : "leading-relaxed"}`}
              >
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* 배지 */}
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-[#F3F4F6]">
            {badges.map((b) => (
              <span
                key={b}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7F2E8]/60 text-[#1F4B43] border border-[#EAE1D3] ${isSenior ? "text-[15px]" : "text-xs"}`}
                style={{ fontWeight: 600 }}
              >
                <CheckCircle2 size={12} className="text-[#6E958B]" />
                {b}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── TrustCards (안심 약속) ─── */
interface TrustCardsProps {
  items: string[];
  isSenior?: boolean;
}
export function TrustCards({
  items,
  isSenior,
}: TrustCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, i) => (
        <div
          key={i}
          className={`rounded-2xl border border-[#D6CCBC]/30 bg-white ${isSenior ? "p-6" : "p-5"} flex items-start gap-3`}
        >
          <div className="w-8 h-8 rounded-full bg-[#6E958B]/15 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[#6E958B] text-sm">
              &#x2714;
            </span>
          </div>
          <p
            className={`text-[#4A5553] ${isSenior ? "text-[18px] leading-[1.7]" : "text-sm leading-relaxed"}`}
          >
            {item}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ─── ScenarioCards (상황별 카드) ─── */
interface ScenarioCardItem {
  text: string;
  icon?: string;
  onClick?: () => void;
}
interface ScenarioCardsProps {
  items: ScenarioCardItem[];
  isSenior?: boolean;
}
export function ScenarioCards({
  items,
  isSenior,
}: ScenarioCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, i) => (
        <button
          key={i}
          onClick={item.onClick}
          className={`text-left rounded-2xl border border-[#D6CCBC]/30 bg-white hover:shadow-md hover:border-[#6E958B]/40 transition-all cursor-pointer ${isSenior ? "p-6" : "p-5"}`}
        >
          <div
            className="text-2xl mb-3"
            dangerouslySetInnerHTML={{
              __html: item.icon || "&#x1F64B;",
            }}
          />
          <p
            className={`text-[#1F2623] ${isSenior ? "text-[18px] leading-[1.6]" : "text-sm leading-relaxed"}`}
            style={{ fontWeight: 500 }}
          >
            {item.text}
          </p>
          <div className="flex gap-2 mt-3">
            <span
              className={`text-[#1F4B43] ${isSenior ? "text-[14px]" : "text-xs"}`}
              style={{ fontWeight: 600 }}
            >
              상담받기 &rarr;
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

/* ─── FAQAccordion ─── */
interface FAQItem {
  q: string;
  a: string;
}
interface FAQAccordionProps {
  items: FAQItem[];
  isSenior?: boolean;
  defaultOpen?: number; // 기본 펼침 개수
}
export function FAQAccordion({
  items,
  isSenior,
  defaultOpen = 0,
}: FAQAccordionProps) {
  const [openSet, setOpenSet] = useState<Set<number>>(() => {
    const s = new Set<number>();
    for (let i = 0; i < defaultOpen && i < items.length; i++)
      s.add(i);
    return s;
  });

  const toggle = (idx: number) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-[#FAFAFA] rounded-xl overflow-hidden border border-[#E5E7EB]"
        >
          <button
            onClick={() => toggle(i)}
            className={`w-full flex items-center justify-between gap-3 text-left cursor-pointer min-h-[48px] ${isSenior ? "p-5 md:p-6" : "p-4"}`}
          >
            <span
              className={`text-[#111827] ${isSenior ? "text-[18px]" : "text-sm"}`}
              style={{ fontWeight: 600 }}
            >
              {item.q}
            </span>
            <ChevronDown
              size={18}
              className={`text-gray-400 shrink-0 transition-transform ${openSet.has(i) ? "rotate-180" : ""}`}
            />
          </button>
          {openSet.has(i) && (
            <div className={`px-4 pb-4 ${isSenior ? "px-5 pb-5 md:px-6 md:pb-6" : ""}`}>
              <p
                className={`text-[#6B7280] leading-relaxed ${isSenior ? "text-[17px]" : "text-sm"}`}
              >
                {item.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Stepper (큰 숫자 1-2-3) ─── */
interface StepItem {
  title: string;
  desc: string;
}
interface StepperProps {
  steps: StepItem[];
  isSenior?: boolean;
}
export function StepperVisual({
  steps,
  isSenior,
}: StepperProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {steps.map((s, i) => (
        <div key={i} className="flex-1 flex items-start gap-4">
          <div className="relative flex flex-col items-center">
            <div
              className={`rounded-full bg-[#1F4B43] text-white flex items-center justify-center shrink-0 ${isSenior ? "w-14 h-14 text-[22px]" : "w-10 h-10 text-base"}`}
              style={{ fontWeight: 800 }}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className="w-[2px] h-8 bg-[#1F4B43]/20 md:hidden" />
            )}
          </div>
          <div className="flex-1 pb-6 md:pb-0">
            <h4
              className={`text-[#111827] mb-1 ${isSenior ? "text-[20px]" : ""}`}
              style={{ fontWeight: 700 }}
            >
              {s.title}
            </h4>
            <p
              className={`text-[#6B7280] ${isSenior ? "text-[17px] leading-[1.6]" : "text-sm leading-relaxed"}`}
            >
              {s.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── CTASection (가입/상담 강조) ─── */
interface CTASectionProps {
  cards: {
    icon: string;
    title: string;
    desc?: string;
    buttonLabel: string;
    onClick: () => void;
  }[];
  isSenior?: boolean;
}
export function CTASection({
  cards,
  isSenior,
}: CTASectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`rounded-2xl border border-[#D6CCBC]/30 bg-white text-center ${isSenior ? "p-8" : "p-6"}`}
        >
          <div
            className="text-3xl mb-3"
            dangerouslySetInnerHTML={{ __html: c.icon }}
          />
          <h4
            className={`text-[#111827] mb-2 ${isSenior ? "text-[20px]" : ""}`}
            style={{ fontWeight: 700 }}
          >
            {c.title}
          </h4>
          {c.desc && (
            <p
              className={`text-[#6B7280] mb-4 ${isSenior ? "text-[16px]" : "text-sm"}`}
            >
              {c.desc}
            </p>
          )}
          <button
            onClick={c.onClick}
            className={`w-full py-3 rounded-xl bg-[#1F4B43] text-white hover:bg-[#2A6359] transition-colors cursor-pointer ${isSenior ? "min-h-[56px] text-[17px]" : "text-sm"}`}
            style={{ fontWeight: 600 }}
          >
            {c.buttonLabel}
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── SectionWrapper (재사용 섹션 래퍼) ─── */
interface SectionProps {
  bg?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}
export function Section({
  bg = "bg-white",
  children,
  className = "",
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`py-10 md:py-16 lg:py-20 ${bg} ${className}`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

/* ─── SectionTitle ─── */
interface SectionTitleProps {
  title: string;
  sub?: string;
  isSenior?: boolean;
  center?: boolean;
}
export function SectionTitle({
  title,
  sub,
  isSenior,
  center,
}: SectionTitleProps) {
  return (
    <div className={`mb-6 md:mb-10 ${center ? "text-center" : ""}`}>
      <h2
        className={`text-[#111827] ${isSenior ? "text-[26px] md:text-[30px]" : "text-2xl md:text-3xl"}`}
        style={{ fontWeight: 700 }}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={`mt-3 text-[#7A8584] ${isSenior ? "text-[18px]" : ""} leading-relaxed`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/* ─── PhoneButton (전화하기 공통) ─── */
interface PhoneButtonProps {
  isSenior?: boolean;
  variant?: "primary" | "secondary";
  className?: string;
}
export function PhoneButton({
  isSenior,
  variant = "primary",
  className = "",
}: PhoneButtonProps) {
  const base =
    variant === "primary"
      ? "bg-[#6E958B] text-white hover:bg-[#5B8F8B]"
      : "border border-[#D6CCBC]/40 text-[#4A5553] hover:bg-[#F7F2E8]";
  return (
    <button
      onClick={() => alert(`대표전화: ${V.대표전화}`)}
      className={`flex items-center justify-center gap-2 rounded-full transition-colors cursor-pointer active:scale-[0.98] ${base} ${isSenior ? "px-6 py-4 min-h-[56px] text-[18px]" : "px-5 py-3 min-h-[48px] text-sm"} ${className}`}
      style={{ fontWeight: 600 }}
    >
      <PhoneCall size={isSenior ? 22 : 18} />
      {isSenior
        ? `전화하기(${V.대표전화})`
        : `전화 문의(${V.대표전화})`}
    </button>
  );
}

/* ─── ServiceDetailBlock (공통 상세 구성) ─── */
interface ServiceDetailBlockProps {
  title: string;
  checks: string[];
  steps: string[];
  preparations?: string[];
  costNote: string;
  isSenior?: boolean;
  onBack: () => void;
}
export function ServiceDetailBlock({
  title,
  checks,
  steps,
  preparations,
  costNote,
  isSenior,
  onBack,
}: ServiceDetailBlockProps) {
  return (
    <div className="space-y-8">
      <button
        onClick={onBack}
        className="text-[#1F4B43] text-sm cursor-pointer hover:underline"
        style={{ fontWeight: 500 }}
      >
        &larr; 돌아가기
      </button>
      <h3
        className={`text-[#111827] ${isSenior ? "text-[24px]" : "text-xl"}`}
        style={{ fontWeight: 700 }}
      >
        {title}
      </h3>

      {/* 체크리스트 */}
      <div>
        <h4
          className={`text-[#1F4B43] mb-3 ${isSenior ? "text-[18px]" : "text-sm"}`}
          style={{ fontWeight: 700 }}
        >
          &#x2705; 우리가 해드리는 것
        </h4>
        <div className="space-y-2">
          {checks.map((c, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2
                size={isSenior ? 20 : 16}
                className="text-[#6E958B] shrink-0 mt-0.5"
              />
              <span
                className={`text-[#374151] ${isSenior ? "text-[18px]" : "text-sm"}`}
              >
                {c}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 단계 */}
      <div>
        <h4
          className={`text-[#1F4B43] mb-3 ${isSenior ? "text-[18px]" : "text-sm"}`}
          style={{ fontWeight: 700 }}
        >
          &#x1F3AF; 이렇게 시작해요
        </h4>
        <StepperVisual
          steps={steps.map((s, i) => ({
            title: `${i + 1}단계`,
            desc: s,
          }))}
          isSenior={isSenior}
        />
      </div>

      {/* 준비물 */}
      {preparations && preparations.length > 0 && (
        <div>
          <h4
            className={`text-[#1F4B43] mb-3 ${isSenior ? "text-[18px]" : "text-sm"}`}
            style={{ fontWeight: 700 }}
          >
            &#x1F4CB; 준비할 것
          </h4>
          <ul className="space-y-1">
            {preparations.map((p, i) => (
              <li
                key={i}
                className={`text-[#374151] ${isSenior ? "text-[18px]" : "text-sm"}`}
              >
                • {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 비용 */}
      <div
        className={`rounded-xl bg-[#F7F2E8]/50 border border-[#EAE1D3] ${isSenior ? "p-5" : "p-4"}`}
      >
        <p
          className={`text-[#4A5553] ${isSenior ? "text-[17px]" : "text-sm"}`}
        >
          <span style={{ fontWeight: 600 }}>
            &#x1F4B0; 비용 안내:
          </span>{" "}
          {costNote}
        </p>
      </div>

      {/* 버튼 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <PhoneButton isSenior={isSenior} className="w-full sm:w-auto" />
        <button
          onClick={() =>
            alert(
              "상담 남기기 기능은 추후 Supabase 연동 시 활성화됩니다.",
            )
          }
          className={`w-full sm:w-auto px-5 py-3 rounded-full bg-[#1F4B43] text-white hover:bg-[#2A6359] transition-colors cursor-pointer active:scale-[0.98] ${isSenior ? "min-h-[56px] text-[18px]" : "min-h-[48px] text-sm"}`}
          style={{ fontWeight: 600 }}
        >
          상담 남기기
        </button>
      </div>
    </div>
  );
}
