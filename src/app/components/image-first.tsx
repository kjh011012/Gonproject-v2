import type { ReactNode } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronRight } from "lucide-react";

/* ─── ServicePosterCard (이미지 60~70% + 하단 텍스트 + CTA) ─── */
interface ServicePosterProps {
  image: string;
  imageLabel: string;
  title: string;
  desc: string;
  status?: "운영 중" | "준비 중";
  ctaLabel?: string;
  onClick?: () => void;
  isSenior?: boolean;
}
export function ServicePosterCard({
  image, imageLabel, title, desc, status = "준비 중", ctaLabel = "자세히 보기", onClick, isSenior,
}: ServicePosterProps) {
  return (
    <div
      onClick={onClick}
      className="rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full"
    >
      {/* 이미지 영역 (60~70%) */}
      <div className={`relative overflow-hidden ${isSenior ? "h-52" : "h-48"}`}>
        <ImageWithFallback
          src={image}
          alt={imageLabel}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/60 via-transparent to-transparent" />
        {/* 배지 */}
        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs ${
          status === "운영 중" ? "bg-[#67B89A] text-white" : "bg-white/90 text-[#6B7280]"
        }`} style={{ fontWeight: 600 }}>
          {status}
        </span>
        {/* 이미지 라벨 */}
      </div>
      {/* 텍스트 영역 */}
      <div className={`flex flex-col flex-1 ${isSenior ? "p-5" : "p-4"}`}>
        <h3
          className={`text-[#111827] mb-1 line-clamp-1 ${isSenior ? "text-[22px]" : "text-lg"}`}
          style={{ fontWeight: 700 }}
        >
          {title}
        </h3>
        <p className={`text-[#6B7280] mb-4 flex-1 line-clamp-2 ${isSenior ? "text-[17px] leading-[1.6]" : "text-sm leading-relaxed"}`}>
          {desc}
        </p>
        <button
          className={`w-full flex items-center justify-center gap-1 rounded-xl bg-[#1F6B78] text-white hover:bg-[#185A65] transition-colors cursor-pointer active:scale-[0.98] ${isSenior ? "py-3.5 min-h-[56px] text-[17px]" : "py-2.5 min-h-[48px] text-sm"}`}
          style={{ fontWeight: 600 }}
        >
          {ctaLabel} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─── ScenarioImageTile (이미지 타일, 상황별 버튼) ─── */
interface ScenarioTileProps {
  image: string;
  imageLabel: string;
  label: string;
  onClick?: () => void;
  isSenior?: boolean;
}
export function ScenarioImageTile({ image, imageLabel, label, onClick, isSenior }: ScenarioTileProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl overflow-hidden cursor-pointer group text-left h-full bg-white border border-gray-100 shadow-sm md:relative"
    >
      <div className="aspect-[3/2]">
        <ImageWithFallback
          src={image}
          alt={imageLabel}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/70 via-[#111827]/20 to-transparent hidden md:block" />
      </div>
      <div className="p-4 md:hidden">
        <p
          className={`text-[#111827] text-center ${isSenior ? "text-[18px]" : "text-base"}`}
          style={{ fontWeight: 700 }}
        >
          {label}
        </p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 hidden md:block">
        <p
          className={`text-white ${isSenior ? "text-[20px]" : "text-base"}`}
          style={{ fontWeight: 700 }}
        >
          {label}
        </p>
      </div>
    </button>
  );
}

/* ─── SolutionCard (문제→해결 카드, About 소개 페이지용) ─── */
interface SolutionCardProps {
  image: string;
  imageLabel: string;
  num: number;
  problem: string;
  solution: string;
  details: string[];
  onClick?: () => void;
  isSenior?: boolean;
}
export function SolutionCard({ image, imageLabel, num, problem, solution, details, onClick, isSenior }: SolutionCardProps) {
  const circleNums = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨"];
  return (
    <div
      onClick={onClick}
      className="rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full group"
    >
      {/* 이미지 */}
      <div className="relative h-40 md:h-44 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={imageLabel}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/70 via-transparent to-transparent" />
        {/* 넘버 배지 */}
        <span
          className="absolute top-3 left-3 w-9 h-9 flex items-center justify-center rounded-full bg-[#1F6B78] text-white text-lg"
          style={{ fontWeight: 800 }}
        >
          {circleNums[num - 1] ?? num}
        </span>
        {/* 문제 제목 (이미지 위) */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
          <p
            className={`text-white leading-snug ${isSenior ? "text-[18px]" : "text-[15px]"}`}
            style={{ fontWeight: 700 }}
          >
            {problem}
          </p>
        </div>
      </div>
      {/* 텍스트 영역 */}
      <div className={`flex flex-col flex-1 ${isSenior ? "p-5" : "p-4"}`}>
        {/* 해결 문구 */}
        <p
          className={`text-[#1F6B78] mb-3 ${isSenior ? "text-[17px]" : "text-sm"}`}
          style={{ fontWeight: 700 }}
        >
          {solution}
        </p>
        {/* 세부 사항 */}
        <div className="space-y-1.5 flex-1">
          {details.map((d) => (
            <div key={d} className="flex items-start gap-2">
              <CheckCircle2 size={isSenior ? 18 : 15} className="text-[#67B89A] shrink-0 mt-0.5" />
              <span className={`text-[#374151] ${isSenior ? "text-[16px]" : "text-[13px]"} leading-relaxed`}>
                {d}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Storyboard3Cut (전화→상담→연결) ─── */
interface StoryboardItem {
  image: string;
  imageLabel: string;
  step: string;
  title: string;
  desc: string;
}
interface Storyboard3CutProps {
  items: StoryboardItem[];
  isSenior?: boolean;
}
export function Storyboard3Cut({ items, isSenior }: Storyboard3CutProps) {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-0">
      {items.map((item, i) => (
        <div key={i} className="contents">
          {/* 카드 */}
          <div className="text-center flex-1 min-w-0">
            <div className="relative rounded-2xl overflow-hidden mb-3 md:mb-4 aspect-[4/3]">
              <ImageWithFallback
                src={item.image}
                alt={item.imageLabel}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/40 to-transparent" />
              {/* 번호 배지 */}
              <div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-[#1F6B78] text-white flex items-center justify-center text-base" style={{ fontWeight: 800 }}>
                {i + 1}
              </div>
            </div>
            <p className="text-[#1F6B78] text-xs mb-0.5 md:mb-1" style={{ fontWeight: 600 }}>{item.step}</p>
            <h4
              className={`text-[#111827] mb-1 ${isSenior ? "text-[18px] md:text-[20px]" : "text-base md:text-lg"}`}
              style={{ fontWeight: 700 }}
            >
              {item.title}
            </h4>
            <p className={`text-[#6B7280] ${isSenior ? "text-[15px] md:text-[17px]" : "text-sm"} leading-relaxed`}>
              {item.desc}
            </p>
          </div>
          {/* 화살표 (마지막 제외) */}
          {i < items.length - 1 && (
            <div className="flex items-center justify-center shrink-0">
              {/* 모바일: 아래 화살표 */}
              <div className="flex md:hidden items-center justify-center text-[#67B89A] py-1">
                <ChevronDown size={24} strokeWidth={2.5} />
              </div>
              {/* 데스크톱: 오른쪽 화살표 */}
              <div className="hidden md:flex items-center justify-center px-3 pt-16 text-[#67B89A]">
                <ChevronRight size={28} strokeWidth={2.5} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── TrustPhotoCard (사람 사진 + 배지 3개) ─── */
interface TrustPhotoCardProps {
  image: string;
  imageLabel: string;
  badges: string[];
  isSenior?: boolean;
}
export function TrustPhotoCard({ image, imageLabel, badges, isSenior }: TrustPhotoCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden border border-[#E5E7EB]">
      <div className="relative aspect-[16/9] md:aspect-[21/9]">
        <ImageWithFallback src={image} alt={imageLabel} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/60 to-transparent" />
        <span className="absolute bottom-2 right-3 text-white/50 text-[10px]">{imageLabel}</span>
      </div>
      <div className={`flex flex-wrap gap-2 md:gap-3 justify-center ${isSenior ? "p-5 md:p-6" : "p-4 md:p-5"}`}>
        {badges.map((b) => (
          <span
            key={b}
            className={`px-4 py-2 rounded-full bg-[#1F6B78]/10 text-[#1F6B78] ${isSenior ? "text-[16px]" : "text-sm"}`}
            style={{ fontWeight: 600 }}
          >
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── SeedMoneyCard (씨앗돈 비유 일러스트 카드) ─── */
interface SeedMoneyCardProps {
  image: string;
  lines: string[];
  isSenior?: boolean;
  ctaLabel?: string;
  onCta?: () => void;
}
export function SeedMoneyCard({ image, lines, isSenior, ctaLabel, onCta }: SeedMoneyCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden border-2 border-[#67B89A]/30 bg-[#67B89A]/5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="aspect-[16/9] md:aspect-auto">
          <ImageWithFallback src={image} alt="(일러스트) 출자금(씨앗돈): 씨앗/화분/나무 비유" className="w-full h-full object-cover" />
        </div>
        <div className={`flex flex-col justify-center ${isSenior ? "p-6 md:p-8" : "p-5 md:p-6"}`}>
          <h3
            className={`text-[#1F6B78] mb-4 ${isSenior ? "text-[24px]" : "text-xl"}`}
            style={{ fontWeight: 700 }}
          >
            {isSenior ? "출자금은 '씨앗돈'이에요" : "출자금은 조합의 공동 자본입니다"}
          </h3>
          <ul className="space-y-3">
            {lines.map((l, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#67B89A] shrink-0 mt-0.5">&#x1F331;</span>
                <span className={`text-[#374151] ${isSenior ? "text-[18px] leading-[1.7]" : "text-sm leading-relaxed"}`}>{l}</span>
              </li>
            ))}
          </ul>
          {ctaLabel && onCta && (
            <button
              onClick={onCta}
              className={`mt-6 px-5 py-3 rounded-full border border-[#1F6B78] text-[#1F6B78] hover:bg-[#1F6B78]/5 transition-colors cursor-pointer ${isSenior ? "min-h-[56px] text-[17px]" : "text-sm"}`}
              style={{ fontWeight: 600 }}
            >
              {ctaLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── ImageHeroSection (이미지 우선 히어로, About/Join용) ─── */
interface ImageHeroProps {
  image: string;
  imageLabel: string;
  title: string;
  subtitle?: string;
  badge?: string;
  children?: ReactNode;
  isSenior?: boolean;
}
export function ImageHeroSection({ image, imageLabel, title, subtitle, badge, children, isSenior }: ImageHeroProps) {
  return (
    <section className="relative">
      <div className="aspect-[16/9] md:aspect-[21/9] min-h-[420px] md:min-h-[400px]">
        <ImageWithFallback src={image} alt={imageLabel} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-[#111827]/30 to-[#111827]/10" />
      </div>
      <div className="absolute inset-0 flex items-end">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 pt-20 md:pt-0 w-full">
          {badge && !isSenior && (
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[#67B89A] text-xs mb-3" style={{ fontWeight: 600 }}>
              {badge}
            </span>
          )}
          <h1
            className={`text-white mb-3 ${isSenior ? "text-[30px] md:text-[40px]" : "text-2xl md:text-3xl lg:text-4xl"} leading-tight`}
            style={{ fontWeight: 800 }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className={`text-white/80 max-w-2xl mb-6 ${isSenior ? "text-[20px]" : "text-base md:text-lg"} leading-relaxed`}>
              {subtitle}
            </p>
          )}
          {children}
          <span className="block mt-3 text-white/40 text-[10px]">{imageLabel}</span>
        </div>
      </div>
    </section>
  );
}