import { useEffect, useState } from "react";
import { IMG } from "../components/image-data";

export type ServiceIcon = "stethoscope" | "handHeart" | "car" | "leaf";

export interface ServiceStep {
  title: string;
  desc: string;
}

export interface ServiceCategory {
  id: string;
  icon: ServiceIcon;
  image: string;
  imageLabel: string;
  title: string;
  seniorTitle: string;
  subtitle: string;
  items: string[];
  message: string;
  easyIntro: string;
  easyForWho: string[];
  easySteps: ServiceStep[];
  easyBenefit: string;
  applyReasons: string[];
  color: string;
  bgLight: string;
}

export interface ServicesCatalog {
  heroImage: string;
  heroImageLabel: string;
  heroBadge: string;
  heroTitle: string;
  heroTitleSenior: string;
  heroSubtitle: string;
  heroSubtitleSenior: string;
  disclaimer: string;
  categories: ServiceCategory[];
}

const STORAGE_KEY = "gondolbom-services-catalog-v1";

const DEFAULT_CATALOG: ServicesCatalog = {
  heroImage: IMG.servicesHero,
  heroImageLabel: "(이미지) 서비스 안내: 의료·돌봄 현장",
  heroBadge: "서비스 안내",
  heroTitle: "진료·돌봄·예방, 끊기지 않게",
  heroTitleSenior: "내 상황을 골라주세요",
  heroSubtitle: "상황에 맞는 서비스를 한눈에 확인하세요.",
  heroSubtitleSenior: "어렵다면 전화 주세요. 대신 찾아드려요.",
  disclaimer: "서비스 제공 범위는 운영 단계와 협력기관 연계에 따라 달라질 수 있습니다.",
  categories: [
    {
      id: "medical",
      icon: "stethoscope",
      image: IMG.catMedical,
      imageLabel: "(이미지) 찾아가는 의료: 방문진료 장면",
      title: "찾아가는 의료 서비스",
      seniorTitle: "의사·간호사가 직접 찾아가요",
      subtitle: "의료 접근성 해결",
      items: ["방문 진료", "방문 간호", "건강 상담", "만성질환 관리"],
      message: "병원이 멀어도 의료가 먼저 찾아갑니다",
      easyIntro: "병원 방문이 어려운 분을 위해 의료진이 집으로 찾아가 진료부터 관리 계획까지 연결해 드립니다.",
      easyForWho: ["거동이 불편해 병원 이동이 어려운 분", "퇴원 후 집에서 회복 관리가 필요한 분", "만성질환을 꾸준히 관리해야 하는 분"],
      easySteps: [
        { title: "현재 상태 확인", desc: "전화로 증상과 복용 약을 간단히 확인합니다." },
        { title: "방문 진료·간호", desc: "의료진이 방문해 진료와 생활 관리 방법을 쉽게 안내합니다." },
        { title: "지속 관리 연결", desc: "다음 상담·방문 일정을 잡아 변화 상태를 계속 살핍니다." },
      ],
      easyBenefit: "집에서도 필요한 의료를 제때 받고, 상태 악화를 미리 예방할 수 있습니다.",
      applyReasons: ["병원이 멀어서 이동이 힘들어요", "퇴원 후 집에서 관리가 필요해요", "만성질환 상담이 필요해요"],
      color: "#1F6B78",
      bgLight: "#1F6B78",
    },
    {
      id: "daily-care",
      icon: "handHeart",
      image: IMG.catDailyCare,
      imageLabel: "(이미지) 생활 돌봄: 식사·생활 지원 장면",
      title: "생활 돌봄 서비스",
      seniorTitle: "집에서 돌봄을 받아요",
      subtitle: "일상 지원",
      items: ["전문 돌봄 인력 방문", "식사 및 생활 지원", "안전 확인", "정서 지원"],
      message: "혼자가 아닌 함께하는 돌봄",
      easyIntro: "집에서 생활할 때 불편한 부분을 줄이고, 식사·안전·정서까지 일상 전반을 함께 돌봐드립니다.",
      easyForWho: ["혼자 생활이 버겁고 도움이 필요한 분", "식사·청결·안전 관리가 필요한 분", "정기적인 안부 확인이 필요한 분"],
      easySteps: [
        { title: "생활 어려움 파악", desc: "어떤 부분이 가장 힘든지 우선순위를 함께 정합니다." },
        { title: "맞춤 돌봄 시작", desc: "상황에 맞는 식사·생활·안전 지원을 연결합니다." },
        { title: "정기 점검", desc: "돌봄이 끊기지 않도록 주기적으로 상태를 확인합니다." },
      ],
      easyBenefit: "일상 부담이 줄고, 안전하게 생활할 수 있는 환경을 만들어 드립니다.",
      applyReasons: ["혼자 생활하기가 버거워요", "식사·안전 관리가 필요해요", "정기적인 돌봄이 필요해요"],
      color: "#67B89A",
      bgLight: "#67B89A",
    },
    {
      id: "hospital-support",
      icon: "car",
      image: IMG.catHospitalSupport,
      imageLabel: "(이미지) 병원 이용 지원: 동행·이동 장면",
      title: "병원 이용 지원 서비스",
      seniorTitle: "병원 갈 때 같이 가요",
      subtitle: "이동 문제 해결",
      items: ["병원 동행 서비스", "이동 지원", "예약 지원", "진료 안내"],
      message: "병원 이용의 어려움을 해결합니다",
      easyIntro: "예약부터 이동, 진료 동행까지 병원 이용 전 과정을 쉽게 도와드리는 서비스입니다.",
      easyForWho: ["병원 예약 방법이 익숙하지 않은 분", "혼자 병원 방문이 어려운 분", "진료 일정 관리가 필요한 분"],
      easySteps: [
        { title: "예약·일정 정리", desc: "방문할 병원과 날짜를 먼저 정확히 맞춰드립니다." },
        { title: "이동·동행 지원", desc: "필요 시 이동과 동행을 통해 진료 과정에 함께합니다." },
        { title: "진료 후 안내", desc: "다음 방문 일정과 주의사항을 이해하기 쉽게 정리해드립니다." },
      ],
      easyBenefit: "병원 이용의 불안과 이동 부담을 줄여 필요한 진료를 놓치지 않게 됩니다.",
      applyReasons: ["병원 예약이 어려워요", "혼자 병원 가기 힘들어요", "이동 지원이 필요해요"],
      color: "#D97706",
      bgLight: "#D97706",
    },
    {
      id: "prevention",
      icon: "leaf",
      image: IMG.catPrevention,
      imageLabel: "(이미지) 건강 예방: 운동·건강교실 장면",
      title: "건강 예방 관리",
      seniorTitle: "미리미리 건강을 챙겨요",
      subtitle: "예방과 건강 증진",
      items: ["건강 체크", "생활 건강 상담", "운동 지도", "식생활 관리"],
      message: "건강할 때부터 미리 챙깁니다",
      easyIntro: "아프기 전에 건강을 점검하고, 운동·식생활 습관을 쉽게 바꿀 수 있도록 도와드립니다.",
      easyForWho: ["건강 상태를 정기적으로 확인하고 싶은 분", "운동·식습관 개선이 필요한 분", "질환 예방 상담이 필요한 분"],
      easySteps: [
        { title: "기초 건강 점검", desc: "현재 건강 상태를 쉽고 빠르게 확인합니다." },
        { title: "생활습관 상담", desc: "운동·식사·수면 습관을 현실적으로 조정합니다." },
        { title: "예방 관리 유지", desc: "실천 가능한 계획으로 꾸준히 관리할 수 있게 돕습니다." },
      ],
      easyBenefit: "질병 위험을 낮추고, 스스로 건강을 관리하는 힘을 키울 수 있습니다.",
      applyReasons: ["건강 체크를 받아보고 싶어요", "운동·식습관 관리가 필요해요", "예방 상담을 받고 싶어요"],
      color: "#059669",
      bgLight: "#059669",
    },
  ],
};

function cloneDefaultCatalog(): ServicesCatalog {
  return JSON.parse(JSON.stringify(DEFAULT_CATALOG)) as ServicesCatalog;
}

function sanitizeArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item ?? "").trim())
    .filter(Boolean);
}

function sanitizeSteps(value: unknown): ServiceStep[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const step = item as Partial<ServiceStep>;
      const title = String(step.title ?? "").trim();
      const desc = String(step.desc ?? "").trim();
      if (!title && !desc) return null;
      return {
        title: title || "단계",
        desc: desc || "상세 설명을 입력해 주세요.",
      };
    })
    .filter((step): step is ServiceStep => Boolean(step));
}

function normalizeCategory(input: Partial<ServiceCategory>, index: number): ServiceCategory {
  const fallback = DEFAULT_CATALOG.categories[index % DEFAULT_CATALOG.categories.length];
  return {
    id: String(input.id ?? `service-${index + 1}`).trim() || `service-${index + 1}`,
    icon: (["stethoscope", "handHeart", "car", "leaf"].includes(String(input.icon))
      ? input.icon
      : fallback.icon) as ServiceIcon,
    image: String(input.image ?? fallback.image),
    imageLabel: String(input.imageLabel ?? fallback.imageLabel),
    title: String(input.title ?? "새 서비스"),
    seniorTitle: String(input.seniorTitle ?? String(input.title ?? "새 서비스")),
    subtitle: String(input.subtitle ?? "서비스"),
    items: sanitizeArray(input.items).slice(0, 8),
    message: String(input.message ?? ""),
    easyIntro: String(input.easyIntro ?? ""),
    easyForWho: sanitizeArray(input.easyForWho),
    easySteps: sanitizeSteps(input.easySteps),
    easyBenefit: String(input.easyBenefit ?? ""),
    applyReasons: sanitizeArray(input.applyReasons),
    color: String(input.color ?? fallback.color),
    bgLight: String(input.bgLight ?? String(input.color ?? fallback.bgLight)),
  };
}

function normalizeCatalog(input: unknown): ServicesCatalog {
  const base = cloneDefaultCatalog();
  if (!input || typeof input !== "object") return base;
  const raw = input as Partial<ServicesCatalog>;
  const categories = Array.isArray(raw.categories) && raw.categories.length > 0
    ? raw.categories.map((category, index) => normalizeCategory(category, index))
    : base.categories;

  return {
    heroImage: String(raw.heroImage ?? base.heroImage),
    heroImageLabel: String(raw.heroImageLabel ?? base.heroImageLabel),
    heroBadge: String(raw.heroBadge ?? base.heroBadge),
    heroTitle: String(raw.heroTitle ?? base.heroTitle),
    heroTitleSenior: String(raw.heroTitleSenior ?? base.heroTitleSenior),
    heroSubtitle: String(raw.heroSubtitle ?? base.heroSubtitle),
    heroSubtitleSenior: String(raw.heroSubtitleSenior ?? base.heroSubtitleSenior),
    disclaimer: String(raw.disclaimer ?? base.disclaimer),
    categories,
  };
}

export function loadServicesCatalog(): ServicesCatalog {
  if (typeof window === "undefined") return cloneDefaultCatalog();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneDefaultCatalog();
    return normalizeCatalog(JSON.parse(raw));
  } catch {
    return cloneDefaultCatalog();
  }
}

export function saveServicesCatalog(catalog: ServicesCatalog) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeCatalog(catalog)));
}

export function resetServicesCatalog() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function useServicesCatalog() {
  const [catalog, setCatalog] = useState<ServicesCatalog>(() => loadServicesCatalog());

  useEffect(() => {
    saveServicesCatalog(catalog);
  }, [catalog]);

  const restoreDefaults = () => {
    resetServicesCatalog();
    setCatalog(cloneDefaultCatalog());
  };

  return {
    catalog,
    setCatalog,
    restoreDefaults,
  };
}

