import { V } from "../components/shared";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Heart,
  Users,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  Shield,
  Phone,
  Clock,
  PhoneCall,
  Activity,
} from "lucide-react";
import { useSeniorMode } from "../components/SeniorModeContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { QuickMenuSection } from "../components/QuickMenuSection";
import { HOME_QUICK_MENU_ITEMS } from "../data/homeQuickMenu";
import { NOTICES, PRESS } from "./Community";

/* ─── Images ─── */
const IMG = {
  hero1:
    "https://images.unsplash.com/photo-1754810940745-25668d27581e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBtb3VudGFpbiUyMHZhbGxleSUyMHN1bnJpc2UlMjBwZWFjZWZ1bHxlbnwxfHx8fDE3NzI5NDcyMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  hero2:
    "https://images.unsplash.com/photo-1758691461990-03b49d969495?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBwYXRpZW50JTIwY29uc3VsdGF0aW9uJTIwdHJ1c3QlMjBjYXJpbmd8ZW58MXx8fHwxNzcyOTQ3MjA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  hero3:
    "https://images.unsplash.com/photo-1770822788455-f14be32b0d00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwbnVyc2UlMjB2aXNpdCUyMGVsZGVybHklMjBjYXJlJTIwZ2VudGxlfGVufDF8fHx8MTc3Mjk0NzIwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  village:
    "https://images.unsplash.com/photo-1765510103179-0c2f628d2ff2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBydXJhbCUyMHZpbGxhZ2UlMjBtb3VudGFpbiUyMGNvbW11bml0eSUyMGdhdGhlcmluZyUyMHdhcm18ZW58MXx8fHwxNzcyODk0Mzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  homeVisit:
    "https://images.unsplash.com/photo-1770822788455-f14be32b0d00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwY2FyZSUyMGhvbWUlMjB2aXNpdCUyMGRvY3RvciUyMGNvbnN1bHRhdGlvbiUyMHdhcm18ZW58MXx8fHwxNzcyODk0Mzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  forest:
    "https://images.unsplash.com/photo-1712718503955-87933d7a330c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmb3Jlc3QlMjBoZWFsaW5nJTIwbmF0dXJlJTIwd2VsbG5lc3MlMjB0cmFpbCUyMGdyZWVufGVufDF8fHx8MTc3Mjg5NDM5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  community:
    "https://images.unsplash.com/photo-1758798471100-a98fc12bc76c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBoZWFsdGglMjB3ZWxsbmVzcyUyMGdhdGhlcmluZyUyMG91dGRvb3J8ZW58MXx8fHwxNzcyOTQ3MjA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  elderly:
    "https://images.unsplash.com/photo-1552666146-a8b42692780a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBlbGRlcmx5JTIwd2Fsa2luZyUyMHBhcmslMjBzdW5yaXNlJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzcyODk0Mzk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  caregiver:
    "https://images.unsplash.com/photo-1765896387387-0538bc9f997e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzZSUyMGNhcmVnaXZlciUyMGVsZGVybHklMjBob21lJTIwY2FyZSUyMGdlbnRsZXxlbnwxfHx8fDE3NzI4OTQzOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  volunteer:
    "https://images.unsplash.com/photo-1733388972592-ec1da2ddc432?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXIlMjBjb21tdW5pdHklMjBnYXJkZW4lMjB0ZWFtd29yayUyMG5hdHVyZXxlbnwxfHx8fDE3NzI4OTQzOTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  donate:
    "https://images.unsplash.com/photo-1697665387559-253e7a645e96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb25hdGlvbiUyMGNoYXJpdHklMjBoYW5kcyUyMGhlYXJ0JTIwd2FybSUyMGxpZ2h0fGVufDF8fHx8MTc3Mjg5NDQwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  clinic:
    "https://images.unsplash.com/photo-1758691463333-c79215e8bc3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGV0aG9zY29wZSUyMGRvY3RvciUyMHBhdGllbnQlMjB0cnVzdCUyMGNvbnN1bHRhdGlvbnxlbnwxfHx8fDE3NzI4OTQ0MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  team: "https://images.unsplash.com/photo-1653508311277-1ecf6ee52c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdGVhbSUyMHByb2Zlc3Npb25hbCUyMGhvc3BpdGFsJTIwZ3JvdXB8ZW58MXx8fHwxNzcyOTQ3MjA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
};

/* ─── Helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const QUICK_MENU_REVEAL_START = 88;
const QUICK_MENU_REVEAL_DISTANCE = 140;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function useCustomInView(margin = "-80px") {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: margin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [margin]);
  return { ref, inView };
}

function AnimSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, inView } = useCustomInView("-80px");
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CountUp({
  end,
  suffix = "",
  duration = 2000,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useCustomInView("-40px");

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return (
    <span ref={ref as any}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Hero slides ─── */
const HERO_SLIDES = [
  {
    image: IMG.hero1,
    badge: "",
    title: "함께 돌보고\n함께 건강해지는\n농산어촌 건강 공동체",
    sub: "의료, 돌봄, 건강활동이 이어지는 지역 기반 협동조합. 주민이 주인이 되어 만드는 비영리 건강 공동체입니다.",
    seniorTitle: "우리 동네에서\n건강하게\n살 수 있어요",
    seniorSub:
      "아프면 의사 선생님이 찾아오고, 간호사 선생님이 집에서 돌봐드려요. 동네 주민들이 함께 만든 건강 모임이에요.",
  },
  {
    image: IMG.hero2,
    badge: "찾아가는 의료 서비스",
    title: "어디서든\n건강할 권리를\n지켜드립니다",
    sub: "거동이 어려워도, 병원이 멀어도 의료진이 직접 찾아갑니다. 밝음의원과 재택의료센터가 함께합니다.",
    seniorTitle: "병원에 못 가셔도\n의사 선생님이\n집으로 와요",
    seniorSub:
      "걸어서 병원에 가기 힘드셔도 걱정 마세요. 의사 선생님과 간호사 선생님이 직접 댁으로 찾아갑니다.",
  },
  {
    image: IMG.hero3,
    badge: "통합돌봄 시스템",
    title: "의료와 돌봄이\n끊기지 않는\n케어 네트워크",
    sub: "진료부터 간호, 재활, 돌봄까지 한 곳에서 연결됩니다. 퇴원 후에도 안심할 수 있는 시스템입니다.",
    seniorTitle: "진료도, 간호도\n한 곳에서\n다 해드려요",
    seniorSub:
      "병원 진료, 가정 간호, 건강 관리를 한 번에 받으실 수 있어요. 퇴원 후에도 계속 돌봐드립니다.",
  },
];

/* ─── Daily stories ─── */
const DAILY_STORIES = [
  {
    title: "봄나들이 산책 모임 첫 날",
    excerpt:
      "오늘 처음 산책 모임에 참여하신 김 어르신의 환한 미소.",
    image: IMG.elderly,
    date: "2026.03.05",
  },
  {
    title: "밝음의원 건강교실 현장",
    excerpt:
      "혈압 관리 강좌에 30여 명의 조합원이 참여했습니다.",
    image: IMG.community,
    date: "2026.03.02",
  },
  {
    title: "겨울철 방문진료 이야기",
    excerpt:
      "눈 덮인 마을, 의료진이 직접 찾아간 따뜻한 이야기.",
    image: IMG.village,
    date: "2026.02.25",
  },
];

/* ─── FAQ ─── */
const FAQ_DATA = [
  {
    q: "조합에 가입하면 뭐가 달라지나요?",
    a: "조합원은 건강 프로그램 안내를 우선 받고, 총회 참여 등 운영에 함께할 수 있습니다.",
  },
  {
    q: "출자금은 꼭 내야 하나요?",
    a: "출자금은 조합의 공동 운영 기반입니다. 최소 5만 원부터 가능합니다.",
  },
  {
    q: "거동이 불편해도 이용할 수 있나요?",
    a: "방문진료와 재택의료 서비스로 집에서도 의료를 받으실 수 있습니다.",
  },
  {
    q: "가족도 함께 혜택을 받나요?",
    a: "가족 적용 범위는 조합 운영 정책에 따릅니다. 상담 시 안내드립니다.",
  },
];

const HOME_VIDEO_SHOWCASE = {
  // Vite base 경로를 따라가도록 구성 (서브경로 배포/빌드 산출물 직접 확인 시에도 동작)
  src: `${import.meta.env.BASE_URL}videos/home-news.mp4`,
};

const HOME_VIDEO_PLAYLIST = [
  {
    id: "mp4-home-news",
    title: "조합 소식 영상 (MP4)",
    type: "mp4" as const,
    src: HOME_VIDEO_SHOWCASE.src,
    thumbnail: IMG.homeVisit,
    source: "로컬 업로드 영상",
  },
  {
    id: "yt-c_lq6X_AT8w",
    title: "",
    type: "youtube" as const,
    youtubeId: "c_lq6X_AT8w",
    thumbnail: "https://i.ytimg.com/vi/c_lq6X_AT8w/mqdefault.jpg",
    source: "YouTube",
  },
  {
    id: "yt-pHq3vEC1KMM",
    title: "",
    type: "youtube" as const,
    youtubeId: "pHq3vEC1KMM",
    thumbnail: "https://i.ytimg.com/vi/pHq3vEC1KMM/mqdefault.jpg",
    source: "YouTube",
  },
  {
    id: "yt-q8eo16u92Go",
    title: "",
    type: "youtube" as const,
    youtubeId: "q8eo16u92Go",
    thumbnail: "https://i.ytimg.com/vi/q8eo16u92Go/mqdefault.jpg",
    source: "YouTube",
  },
  {
    id: "yt-Vwuv_uzY6wk",
    title: "",
    type: "youtube" as const,
    youtubeId: "Vwuv_uzY6wk",
    thumbnail: "https://i.ytimg.com/vi/Vwuv_uzY6wk/mqdefault.jpg",
    source: "YouTube",
  },
];

export function HomePage() {
  const { isSenior } = useSeniorMode();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroIdx, setHeroIdx] = useState(0);
  const [heroScrollY, setHeroScrollY] = useState(0);
  const [homeNoticeTab, setHomeNoticeTab] = useState<"일반" | "영상">("일반");
  const [homeNoticeVideoMeta, setHomeNoticeVideoMeta] = useState<
    Record<number, { title: string; source: string }>
  >({});
  const [homePressTab, setHomePressTab] = useState<"일반" | "영상">("일반");
  const [homePressVideoMeta, setHomePressVideoMeta] = useState<
    Record<number, { title: string; source: string }>
  >({});
  const [selectedVideoId, setSelectedVideoId] = useState(
    HOME_VIDEO_PLAYLIST[0].id,
  );
  const [videoTab, setVideoTab] = useState<"mp4" | "youtube">("mp4");
  const [youtubeTitles, setYoutubeTitles] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    let frameId = 0;

    const syncScrollPosition = () => {
      frameId = 0;
      setHeroScrollY(window.scrollY);
    };

    const onScroll = () => {
      if (frameId !== 0) return;
      frameId = window.requestAnimationFrame(syncScrollPosition);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameId !== 0) cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    let active = true;
    const videoItems = NOTICES.filter(
      (item) => item.videoType === "youtube" && item.youtubeId,
    );

    const loadVideoMeta = async () => {
      const entries = await Promise.all(
        videoItems.map(async (item) => {
          const watchUrl = `https://www.youtube.com/watch?v=${item.youtubeId}`;
          try {
            const res = await fetch(
              `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`,
            );
            if (!res.ok) {
              return [item.id, { title: item.title, source: item.source || "YouTube" }] as const;
            }
            const data = (await res.json()) as {
              title?: string;
              author_name?: string;
            };
            return [
              item.id,
              {
                title: data.title?.trim() || item.title,
                source: data.author_name?.trim() || item.source || "YouTube",
              },
            ] as const;
          } catch {
            return [item.id, { title: item.title, source: item.source || "YouTube" }] as const;
          }
        }),
      );

      if (!active) return;
      setHomeNoticeVideoMeta(Object.fromEntries(entries));
    };

    loadVideoMeta();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const videoItems = PRESS.filter(
      (item) => item.videoType === "youtube" && item.youtubeId,
    );

    const loadVideoMeta = async () => {
      const entries = await Promise.all(
        videoItems.map(async (item) => {
          const watchUrl = `https://www.youtube.com/watch?v=${item.youtubeId}`;
          try {
            const res = await fetch(
              `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`,
            );
            if (!res.ok) {
              return [item.id, { title: item.title, source: item.source }] as const;
            }
            const data = (await res.json()) as {
              title?: string;
              author_name?: string;
            };
            return [
              item.id,
              {
                title: data.title?.trim() || item.title,
                source: data.author_name?.trim() || item.source,
              },
            ] as const;
          } catch {
            return [item.id, { title: item.title, source: item.source }] as const;
          }
        }),
      );

      if (!active) return;
      setHomePressVideoMeta(Object.fromEntries(entries));
    };

    loadVideoMeta();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const youtubeItems = HOME_VIDEO_PLAYLIST.filter(
      (item) => item.type === "youtube",
    );

    const loadTitles = async () => {
      const entries = await Promise.all(
        youtubeItems.map(async (item) => {
          const url = `https://www.youtube.com/watch?v=${item.youtubeId}`;
          try {
            const res = await fetch(
              `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
            );
            if (!res.ok) return [item.id, item.title || "YouTube 영상"] as const;
            const data = (await res.json()) as { title?: string };
            return [
              item.id,
              data.title?.trim() || item.title || "YouTube 영상",
            ] as const;
          } catch {
            return [item.id, item.title || "YouTube 영상"] as const;
          }
        }),
      );

      if (!active) return;
      setYoutubeTitles(Object.fromEntries(entries));
    };

    loadTitles();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const filtered = HOME_VIDEO_PLAYLIST.filter(
      (item) => item.type === videoTab,
    );
    if (!filtered.some((item) => item.id === selectedVideoId)) {
      setSelectedVideoId(filtered[0]?.id ?? HOME_VIDEO_PLAYLIST[0].id);
    }
  }, [videoTab, selectedVideoId]);

  const heroSlide = HERO_SLIDES[heroIdx];
  const heroSubtitle =
    isSenior ? heroSlide.seniorSub : heroSlide.sub;
  const selectedVideo =
    HOME_VIDEO_PLAYLIST.find((item) => item.id === selectedVideoId) ??
    HOME_VIDEO_PLAYLIST[0];
  const homeNoticeItems = NOTICES.filter((item) => {
    if (homeNoticeTab === "영상") return item.type === "영상";
    return item.type !== "영상";
  }).slice(0, 2);
  const homePressItems = PRESS.filter((item) => {
    if (homePressTab === "영상") return item.category === "영상";
    return (
      item.category === "사회" ||
      item.category === "건강" ||
      item.category === "지역" ||
      item.category === "의료"
    );
  }).slice(0, 2);
  const filteredVideoList = HOME_VIDEO_PLAYLIST.filter(
    (item) => item.type === videoTab,
  );
  const quickMenuRevealProgress = clamp(
    (heroScrollY - QUICK_MENU_REVEAL_START) /
      QUICK_MENU_REVEAL_DISTANCE,
    0,
    1,
  );
  const heroBottomInfoOpacity = clamp(
    1 - quickMenuRevealProgress * 1.2,
    0,
    1,
  );

  return (
    <div className="bg-[#F5F2EA]">
      {/* ═══ HERO — quick menu sits at the bottom edge above the next section ═══ */}
      <section className="relative min-h-[100dvh]">
        <div className="absolute inset-0 overflow-hidden">
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-700"
              style={{
                opacity: heroIdx === i ? 1 : 0,
              }}
            >
              <ImageWithFallback
                src={slide.image}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D1F1C]/88 via-[#1F4B43]/62 to-[#1F4B43]/22" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F1C]/74 via-[#0D1F1C]/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0F1E1B]/78 to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[100dvh] max-w-[1360px] flex-col px-5 pt-28 sm:px-6">
          <div className="grid flex-1 grid-cols-1 items-center gap-10 pb-28 md:pb-32 lg:grid-cols-[minmax(0,760px)_1fr]">
            <div className="max-w-3xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroIdx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.45 }}
                >
                  {heroSlide.badge ? (
                    <span
                      className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm"
                      style={{ fontWeight: 500 }}
                    >
                      <span className="h-2 w-2 rounded-full bg-[#6E958B] animate-pulse" />
                      {heroSlide.badge}
                    </span>
                  ) : null}

                  <h1
                    className={`mb-5 whitespace-pre-line text-white ${isSenior ? "text-[32px] md:text-[40px] lg:text-[46px]" : "text-[28px] md:text-[38px] lg:text-[48px]"}`}
                    style={{
                      fontFamily: "'Noto Serif KR', serif",
                      fontWeight: 700,
                      lineHeight: 1.24,
                      letterSpacing: "-0.02em",
                      maxWidth: "48rem",
                    }}
                  >
                    {isSenior
                      ? heroSlide.seniorTitle
                      : heroSlide.title}
                  </h1>

                  <p
                    className={`max-w-2xl text-white/76 transition-opacity duration-300 ${isSenior ? "text-[18px] md:text-[20px]" : "text-base md:text-lg"}`}
                  >
                    {heroSubtitle}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 overflow-hidden">
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/about"
                    className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm text-[#1F4B43] transition-all hover:bg-[#F7F2E8]"
                    style={{ fontWeight: 600 }}
                  >
                    조합 소개
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                  <Link
                    to="/join"
                    className="rounded-full bg-[#C87C5A] px-6 py-3.5 text-sm text-white transition-colors hover:bg-[#B56E4E]"
                    style={{ fontWeight: 600 }}
                  >
                    조합원 가입
                  </Link>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  {HERO_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setHeroIdx(i)}
                      className="relative cursor-pointer"
                      aria-label={`${i + 1}번 히어로 보기`}
                    >
                      <div
                        className={`h-1 rounded-full transition-all duration-300 ${heroIdx === i ? "w-8 bg-white" : "w-4 bg-white/30"}`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs text-white/45">
                    {String(heroIdx + 1).padStart(2, "0")} /{" "}
                    {String(HERO_SLIDES.length).padStart(
                      2,
                      "0",
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="absolute inset-x-5 bottom-5 transition-all duration-300 sm:inset-x-6 md:bottom-6"
            style={{
              opacity: heroBottomInfoOpacity,
              visibility:
                heroBottomInfoOpacity > 0.02
                  ? "visible"
                  : "hidden",
              transform: `translateY(${quickMenuRevealProgress * 16}px)`,
            }}
          >
            <div className="hidden md:block">
              <div className="grid grid-cols-4 divide-x divide-white/15">
                {[
                  {
                    value: 2025,
                    suffix: "년",
                    label: "설립연도",
                  },
                  {
                    value: 3,
                    suffix: "개소",
                    label: "사업소 운영",
                  },
                  {
                    value: 365,
                    suffix: "일",
                    label: "연중 케어 시스템",
                  },
                  {
                    value: 100,
                    suffix: "%",
                    label: "비영리 운영",
                  },
                ].map((s) => (
                  <div key={s.label} className="px-4 text-center">
                    <p
                      className="mb-0.5 text-white text-xl md:text-2xl"
                      style={{
                        fontFamily: "'Noto Serif KR', serif",
                        fontWeight: 900,
                      }}
                    >
                      <CountUp end={s.value} suffix={s.suffix} />
                    </p>
                    <p className="text-xs text-white/40">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 flex items-center justify-center gap-1 text-white/55">
              <span
                className="text-[11px]"
                style={{ letterSpacing: "0.16em", fontWeight: 600 }}
              >
                하단으로 스크롤
              </span>
              <ChevronDown size={16} className="animate-bounce" />
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 hidden translate-y-1/2 md:block">
          <div className="mx-auto max-w-[1180px] px-5 sm:px-6">
            <div
              className="transition-all duration-300"
              style={{
                opacity: quickMenuRevealProgress,
                transform: `translateY(${(1 - quickMenuRevealProgress) * 16}px)`,
                visibility:
                  quickMenuRevealProgress > 0.01
                    ? "visible"
                    : "hidden",
                pointerEvents:
                  quickMenuRevealProgress > 0.15
                    ? "auto"
                    : "none",
              }}
            >
              <QuickMenuSection
                items={HOME_QUICK_MENU_ITEMS}
                isSenior={isSenior}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MEMBERSHIP HUB ═══ */}
      <section className="relative hidden overflow-hidden bg-[#ECECEC] pb-14 pt-12 md:block md:pb-16 md:pt-20">
        <div className="pointer-events-none absolute -left-12 bottom-0 h-44 w-44 rounded-full bg-[#A8D7A0]/35 blur-2xl" />
        <div className="pointer-events-none absolute -right-10 top-8 h-36 w-36 rounded-full bg-[#B4E1C8]/40 blur-2xl" />
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <AnimSection>
            <motion.div variants={fadeUp} className="text-center">
              <h2
                className="text-[24px] md:text-[32px] tracking-[-0.015em]"
                style={{
                  fontFamily: "'Noto Serif KR', serif",
                  fontWeight: 700,
                }}
              >
                <span className="text-[#2F3735]">찾아가는</span>{" "}
                <span className="text-[#2A6A5F]">의료</span>,{" "}
                <span className="text-[#2F3735]">함께하는</span>{" "}
                <span className="text-[#D47A46]">건강</span>
                <br />
                <span className="text-[#1F4B43]">
                  강원 농산어촌 의사협
                </span>
              </h2>
            </motion.div>
          </AnimSection>

          <AnimSection>
            <motion.div variants={fadeUp} className="mx-auto mt-7 grid max-w-[640px] grid-cols-1 gap-3 sm:grid-cols-3">
              <Link
                to="/about"
                className="group flex h-[152px] flex-col items-center justify-center rounded-[14px] bg-[#6F89AF] text-white shadow-[0_16px_28px_-24px_rgba(22,39,54,0.8)] transition-transform hover:-translate-y-0.5"
              >
                <Users size={44} strokeWidth={1.9} />
                <p
                  className="mt-3 text-[22px] leading-none"
                  style={{ fontWeight: 700 }}
                >
                  조합 소개
                </p>
                <p className="mt-1 text-[13px] text-white/88">
                  강원농산어촌의사협이란?
                </p>
              </Link>

              <Link
                to="/join"
                className="group flex h-[152px] flex-col items-center justify-center rounded-[14px] bg-[#E67A3A] text-white shadow-[0_16px_28px_-24px_rgba(58,31,20,0.72)] transition-transform hover:-translate-y-0.5"
              >
                <Heart size={44} strokeWidth={1.9} />
                <p className="mt-3 text-[22px] leading-none" style={{ fontWeight: 700 }}>조합원 가입</p>
                <p className="mt-1 text-[13px] text-white/88">건강공동체 참여</p>
              </Link>

              <Link
                to="/inquiries"
                className="group flex h-[152px] flex-col items-center justify-center rounded-[14px] bg-[#9A6A50] text-white shadow-[0_16px_28px_-24px_rgba(35,25,21,0.65)] transition-transform hover:-translate-y-0.5"
              >
                <PhoneCall size={44} strokeWidth={1.9} />
                <p className="mt-3 text-[22px] leading-none" style={{ fontWeight: 700 }}>상담 문의</p>
                <p className="mt-1 text-[13px] text-white/88">이용 안내</p>
              </Link>
            </motion.div>
          </AnimSection>

        </div>
      </section>

      {/* ═══ NOTICES & PRESS — 좌우 2열 ═══ */}
      <section className="bg-white py-14 md:py-18">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <AnimSection className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {/* ── 좌측: 공지사항 ── */}
            <motion.div variants={fadeUp}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#1F2623] text-xl md:text-2xl" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}>공지사항</h2>
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-3">
                    {(["일반", "영상"] as const).map((tab, idx) => {
                      const active = homeNoticeTab === tab;
                      return (
                        <div key={tab} className="flex items-center gap-3">
                          {idx > 0 ? (
                            <span className="text-[#CEC6BB] text-[13px]">|</span>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => setHomeNoticeTab(tab)}
                            className="group relative inline-flex h-9 items-center cursor-pointer px-1 text-[13px] leading-none tracking-[0.02em]"
                            style={{
                              fontWeight: active ? 700 : 500,
                              fontFamily: "'Noto Serif KR', serif",
                            }}
                          >
                            <span
                              className={
                                active
                                  ? "text-[#1A2623]"
                                  : "text-[#9A9E9D] group-hover:text-[#1F4B43]"
                              }
                            >
                              {tab}
                            </span>
                            {active ? (
                              <span className="absolute inset-x-0 bottom-[2px] h-[2px] rounded-full bg-gradient-to-r from-[#1F4B43] via-[#6E958B] to-[#1F4B43]" />
                            ) : (
                              <span className="absolute left-1/2 right-1/2 bottom-[2px] h-[1.5px] rounded-full bg-[#1F4B43]/40 transition-all duration-300 group-hover:left-1 group-hover:right-1" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-[#CEC6BB] text-[13px]">|</span>
                  <Link to="/notices" className="group inline-flex items-center gap-1 text-sm text-[#1F4B43] hover:underline" style={{ fontWeight: 600 }}>
                    전체보기 <ChevronRightIcon size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={homeNoticeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="space-y-6"
                >
                  {homeNoticeItems.map((n) => {
                    const isVideo = n.type === "영상" && n.videoType === "youtube" && !!n.youtubeId;
                    const href = isVideo
                      ? `https://youtu.be/${n.youtubeId}`
                      : `/community/notices/${n.id}`;
                    const title = isVideo
                      ? (homeNoticeVideoMeta[n.id]?.title || n.title)
                      : n.title;
                    const source = isVideo
                      ? (homeNoticeVideoMeta[n.id]?.source || n.source || "YouTube")
                      : n.type;
                    return isVideo ? (
                    <a
                      key={n.id}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex gap-4"
                    >
                      <div className="w-[38%] shrink-0 rounded-lg overflow-hidden aspect-[4/3]">
                        <iframe
                          src={`https://www.youtube.com/embed/${n.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${n.youtubeId}&controls=0&modestbranding=1&rel=0&playsinline=1`}
                          title={title}
                          allow="autoplay; encrypted-media; picture-in-picture"
                          className="h-full w-full"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                        <div>
                          <span className="text-[12px] text-[#7A8584] mb-1.5 block" style={{ fontWeight: 500 }}>{source}</span>
                          <h4 className="text-[#1F2623] text-[14px] leading-snug mb-1.5 group-hover:text-[#1F4B43] transition-colors line-clamp-2" style={{ fontWeight: 700 }}>{title}</h4>
                          <p className="text-[#8C8C8C] text-[12px] leading-relaxed line-clamp-2 hidden sm:block">{n.excerpt}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-[#ABABAB]">
                          <span>{n.date}</span>
                          <span className="flex items-center gap-1 text-[#7A8584] group-hover:text-[#1F4B43] transition-colors" style={{ fontWeight: 500 }}>영상 보기 <ArrowRight size={10} /></span>
                        </div>
                      </div>
                    </a>
                    ) : (
                    <Link key={n.id} to={href} className="group flex gap-4">
                      <div className="w-[38%] shrink-0 rounded-lg overflow-hidden aspect-[4/3]">
                        <ImageWithFallback src={n.image} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                        <div>
                          <span className="text-[12px] text-[#7A8584] mb-1.5 block" style={{ fontWeight: 500 }}>{n.type}</span>
                          <h4 className="text-[#1F2623] text-[14px] leading-snug mb-1.5 group-hover:text-[#1F4B43] transition-colors line-clamp-2" style={{ fontWeight: 700 }}>{n.title}</h4>
                          <p className="text-[#8C8C8C] text-[12px] leading-relaxed line-clamp-2 hidden sm:block">{n.excerpt}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-[#ABABAB]">
                          <span>{n.date}</span>
                          <span className="flex items-center gap-1 text-[#7A8584] group-hover:text-[#1F4B43] transition-colors" style={{ fontWeight: 500 }}>보기 <ArrowRight size={10} /></span>
                        </div>
                      </div>
                    </Link>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* ── 우측: 언론보도 ── */}
            <motion.div variants={fadeUp}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#1F2623] text-xl md:text-2xl" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}>언론보도</h2>
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-3">
                    {(["일반", "영상"] as const).map((tab, idx) => {
                      const active = homePressTab === tab;
                      return (
                        <div key={tab} className="flex items-center gap-3">
                          {idx > 0 ? (
                            <span className="text-[#CEC6BB] text-[13px]">|</span>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => setHomePressTab(tab)}
                            className="group relative inline-flex h-9 items-center cursor-pointer px-1 text-[13px] leading-none tracking-[0.02em]"
                            style={{
                              fontWeight: active ? 700 : 500,
                              fontFamily: "'Noto Serif KR', serif",
                            }}
                          >
                            <span
                              className={
                                active
                                  ? "text-[#1A2623]"
                                  : "text-[#9A9E9D] group-hover:text-[#1F4B43]"
                              }
                            >
                              {tab}
                            </span>
                            {active ? (
                              <span className="absolute inset-x-0 bottom-[2px] h-[2px] rounded-full bg-gradient-to-r from-[#1F4B43] via-[#6E958B] to-[#1F4B43]" />
                            ) : null}
                            {!active ? (
                              <span className="absolute left-1/2 right-1/2 bottom-[2px] h-[1.5px] rounded-full bg-[#1F4B43]/40 transition-all duration-300 group-hover:left-1 group-hover:right-1" />
                            ) : null}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-[#CEC6BB] text-[13px]">|</span>
                  <Link to="/community/press" className="group inline-flex items-center gap-1 text-sm text-[#1F4B43] hover:underline" style={{ fontWeight: 600 }}>
                    전체보기 <ChevronRightIcon size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={homePressTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="space-y-6"
                >
                  {homePressItems.map((a) => {
                    const isVideo = a.category === "영상" && a.videoType === "youtube" && !!a.youtubeId;
                    const href = isVideo
                      ? `https://youtu.be/${a.youtubeId}`
                      : `/community/press/${a.id}`;
                  const title = isVideo
                    ? (homePressVideoMeta[a.id]?.title || a.title)
                    : a.title;
                  const source = isVideo
                    ? (homePressVideoMeta[a.id]?.source || a.source)
                    : a.source;
                    return isVideo ? (
                    <a
                      key={a.id}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex gap-4"
                    >
                      <div className="w-[38%] shrink-0 rounded-lg overflow-hidden aspect-[4/3]">
                        <iframe
                          src={`https://www.youtube.com/embed/${a.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${a.youtubeId}&controls=0&modestbranding=1&rel=0&playsinline=1`}
                          title={title}
                          allow="autoplay; encrypted-media; picture-in-picture"
                          className="h-full w-full"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                        <div>
                          <span className="text-[12px] text-[#7A8584] mb-1.5 block" style={{ fontWeight: 500 }}>{source}</span>
                          <h4 className="text-[#1F2623] text-[14px] leading-snug mb-1.5 group-hover:text-[#1F4B43] transition-colors line-clamp-2" style={{ fontWeight: 700 }}>{title}</h4>
                          <p className="text-[#8C8C8C] text-[12px] leading-relaxed line-clamp-2 hidden sm:block">{a.excerpt}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-[#ABABAB]">
                          <span>{a.date}</span>
                          <span className="flex items-center gap-1 text-[#7A8584] group-hover:text-[#1F4B43] transition-colors" style={{ fontWeight: 500 }}>영상 보기 <ArrowRight size={10} /></span>
                        </div>
                      </div>
                    </a>
                    ) : (
                    <Link key={a.id} to={href} className="group flex gap-4">
                      <div className="w-[38%] shrink-0 rounded-lg overflow-hidden aspect-[4/3]">
                        <ImageWithFallback src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                        <div>
                          <span className="text-[12px] text-[#7A8584] mb-1.5 block" style={{ fontWeight: 500 }}>{a.source}</span>
                          <h4 className="text-[#1F2623] text-[14px] leading-snug mb-1.5 group-hover:text-[#1F4B43] transition-colors line-clamp-2" style={{ fontWeight: 700 }}>{a.title}</h4>
                          <p className="text-[#8C8C8C] text-[12px] leading-relaxed line-clamp-2 hidden sm:block">{a.excerpt}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-[#ABABAB]">
                          <span>{a.date}</span>
                          <span className="flex items-center gap-1 text-[#7A8584] group-hover:text-[#1F4B43] transition-colors" style={{ fontWeight: 500 }}>보기 <ArrowRight size={10} /></span>
                        </div>
                      </div>
                    </Link>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </AnimSection>

          <AnimSection>
            <motion.div
              variants={fadeUp}
              className="mt-14 md:mt-16"
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2
                    className="text-[#1F2623] text-xl md:text-2xl"
                    style={{
                      fontFamily: "'Noto Serif KR', serif",
                      fontWeight: 700,
                    }}
                  >
                    조합, 오늘의 하루
                  </h2>
                  <p className="text-sm text-[#7A8584] mt-1">
                    우리 조합의 따뜻한 일상을 기록합니다
                  </p>
                </div>
                <Link
                  to="/community/daily"
                  className="group inline-flex items-center gap-1 text-sm text-[#1F4B43] hover:underline"
                  style={{ fontWeight: 600 }}
                >
                  전체보기{" "}
                  <ChevronRightIcon
                    size={14}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {DAILY_STORIES.map((story) => (
                  <motion.div
                    key={story.title}
                    variants={fadeUp}
                    className="group cursor-pointer overflow-hidden rounded-xl border border-[#E5ECEA] bg-[#FCFDFC] p-3 transition-all hover:border-[#D4E1DC] hover:bg-white"
                  >
                    <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                      <ImageWithFallback
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="px-1 pb-1 pt-3">
                      <p className="mb-1 text-[11px] text-[#95A1A0]">
                        {story.date}
                      </p>
                      <h3
                        className="mb-1.5 text-[15px] leading-snug text-[#1F2623] transition-colors group-hover:text-[#1F4B43]"
                        style={{ fontWeight: 700 }}
                      >
                        {story.title}
                      </h3>
                      <p className="line-clamp-2 text-[13px] leading-relaxed text-[#7F8B89]">
                        {story.excerpt}
                      </p>
                      <div className="mt-2.5 flex items-center gap-1 text-[11px] text-[#7A8584]">
                        <span style={{ fontWeight: 500 }}>보기</span>
                        <ArrowRight
                          size={11}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimSection>
        </div>
      </section>

      {/* ═══ VIDEO SHOWCASE ═══ */}
      <section className="bg-[#F9F8F5] py-14 md:py-18">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <AnimSection>
            <motion.div variants={fadeUp} className="mb-8 md:mb-10">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-[#F1D9C7] bg-[#FFF7F0] px-4 py-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8E0CE] text-[#C8764A]">
                  <Heart size={18} strokeWidth={2.2} />
                </span>
                <h2
                  className="text-xl md:text-2xl text-[#B26642]"
                  style={{
                    fontFamily: "'Noto Serif KR', serif",
                    fontWeight: 700,
                  }}
                >
                  의료복지사회적협동조합이란?
                </h2>
              </div>
            </motion.div>
          </AnimSection>

          <AnimSection>
            <motion.article
              variants={fadeUp}
              className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]"
            >
              <div className="overflow-hidden rounded-2xl border border-[#E7E1D6] bg-white shadow-[0_16px_34px_-28px_rgba(20,34,38,0.35)]">
                <div className="aspect-video bg-black">
                  {selectedVideo.type === "mp4" ? (
                    <video
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="h-full w-full"
                      onLoadedData={(e) => {
                        e.currentTarget.play().catch(() => {});
                      }}
                    >
                      <source
                        src={selectedVideo.src}
                        type="video/mp4"
                      />
                    </video>
                  ) : (
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?rel=0&modestbranding=1`}
                      title={selectedVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  )}
                </div>
              </div>

              <aside className="overflow-hidden rounded-2xl border border-[#E7E1D6] bg-white shadow-[0_16px_34px_-28px_rgba(20,34,38,0.2)]">
                <div className="border-b border-[#EFE8DD] bg-[#FFFAF5] p-2">
                  <div className="grid grid-cols-2 gap-1 rounded-lg bg-[#F6ECE2] p-1">
                    <button
                      type="button"
                      onClick={() => setVideoTab("mp4")}
                      className={`cursor-pointer rounded-md px-3 py-2 text-sm transition-colors ${
                        videoTab === "mp4"
                          ? "bg-white text-[#A45E3E] shadow-sm"
                          : "text-[#977A65] hover:text-[#835E49]"
                      }`}
                      style={{ fontWeight: 700 }}
                    >
                      MP4
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoTab("youtube")}
                      className={`cursor-pointer rounded-md px-3 py-2 text-sm transition-colors ${
                        videoTab === "youtube"
                          ? "bg-white text-[#A45E3E] shadow-sm"
                          : "text-[#977A65] hover:text-[#835E49]"
                      }`}
                      style={{ fontWeight: 700 }}
                    >
                      YouTube
                    </button>
                  </div>
                </div>
                <div className="max-h-[760px] overflow-y-auto p-2">
                  {filteredVideoList.map((item) => {
                    const isActive = item.id === selectedVideo.id;
                    const displayTitle =
                      item.type === "youtube"
                        ? youtubeTitles[item.id] || "YouTube 제목 불러오는 중..."
                        : item.title;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedVideoId(item.id)}
                        className={`mb-2 w-full cursor-pointer rounded-xl border p-2 text-left transition-colors last:mb-0 ${
                          isActive
                            ? "border-[#E5C3AB] bg-[#FFF4EB]"
                            : "border-transparent hover:border-[#F0E0D1] hover:bg-[#FFFAF5]"
                        }`}
                      >
                        <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-3">
                          <div className="overflow-hidden rounded-lg bg-[#EFE9E0]">
                            <div className="aspect-video">
                              <ImageWithFallback
                                src={item.thumbnail}
                                alt={item.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <p
                              className={`text-[11px] ${
                                isActive
                                  ? "text-[#B56E4E]"
                                  : "text-[#A39486]"
                              }`}
                              style={{ fontWeight: 700 }}
                            >
                              {item.type === "youtube"
                                ? "YOUTUBE"
                                : "MP4"}
                            </p>
                            <p
                              className={`mt-1 line-clamp-2 text-sm ${
                                isActive
                                  ? "text-[#7C4A31]"
                                  : "text-[#5A5A5A]"
                              }`}
                              style={{ fontWeight: 700 }}
                            >
                              {displayTitle}
                            </p>
                            <p className="mt-1 text-xs text-[#9B8F84]">
                              {item.source}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                </aside>
              </motion.article>
          </AnimSection>
        </div>
      </section>

      {/* ═══ CARE PROCESS ═══ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1000px] mx-auto px-5 sm:px-6">
          <AnimSection>
            <motion.div
              variants={fadeUp}
              className="text-center mb-12"
            >
              <span
                className="inline-block px-3 py-1 rounded-md bg-[#6E958B]/10 text-[#6E958B] text-xs mb-4"
                style={{
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}
              >
                HOW IT WORKS
              </span>
              <h2
                className={`text-[#1F2623] ${isSenior ? "text-[28px] md:text-[34px]" : "text-[24px] md:text-[32px]"}`}
                style={{
                  fontFamily: "'Noto Serif KR', serif",
                  fontWeight: 700,
                }}
              >
                이용 방법
              </h2>
              <p className="text-[#7A8584] mt-2">
                어렵지 않습니다. 전화 한 통이면 시작됩니다.
              </p>
            </motion.div>
          </AnimSection>
          <AnimSection className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-[52px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-[#1F4B43] via-[#6E958B] to-[#C87C5A]" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "상담 요청",
                  desc: "전화 또는 온라인으로 현재 상황을 알려주세요.",
                  color: "#1F4B43",
                  icon: PhoneCall,
                },
                {
                  step: "02",
                  title: "서비스 연결",
                  desc: "필요한 진료·방문·돌봄 등 맞춤 안내를 합니다.",
                  color: "#6E958B",
                  icon: Activity,
                },
                {
                  step: "03",
                  title: "꾸준한 관리",
                  desc: "일회성이 아닌 생활 속 건강관리를 이어갑니다.",
                  color: "#C87C5A",
                  icon: Shield,
                },
              ].map((s) => (
                <motion.div
                  key={s.step}
                  variants={fadeUp}
                  className="text-center"
                >
                  <div className="relative mx-auto mb-6">
                    <div
                      className="w-[104px] h-[104px] rounded-full mx-auto flex flex-col items-center justify-center relative z-10"
                      style={{ background: `${s.color}0D` }}
                    >
                      <span
                        className="w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center text-xs shadow absolute -top-4 left-1/2 -translate-x-1/2 z-20"
                        style={{
                          borderColor: s.color,
                          color: s.color,
                          fontWeight: 800,
                        }}
                      >
                        {s.step}
                      </span>
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                        style={{ background: s.color }}
                      >
                        <s.icon
                          size={28}
                          className="text-white"
                        />
                      </div>
                    </div>
                  </div>
                  <h3
                    className="text-[#1F2623] mb-2 text-[20px]"
                    style={{ fontWeight: 700 }}
                  >
                    {s.title}
                  </h3>
                  <p className="leading-relaxed max-w-[240px] mx-auto mx-[30px] my-[0px] text-[13px] text-[#516c6c] font-bold">
                    {s.desc}
                  </p>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-10">
              <button
                onClick={() => alert(`대표전화: ${V.대표전화}`)}
                className="px-8 py-3.5 rounded-full bg-[#1F4B43] text-white hover:bg-[#2A6359] transition-colors text-sm cursor-pointer inline-flex items-center gap-2"
                style={{ fontWeight: 600 }}
              >
                <Phone size={16} /> 지금 상담하기
              </button>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* ═══ CTA BAND ═══ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={IMG.forest}
            alt="강원 숲"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1F4B43]/85" />
        </div>
        <div className="relative max-w-[900px] mx-auto px-5 sm:px-6 text-center">
          <AnimSection>
            <motion.div variants={fadeUp}>
              <h2
                className="text-white text-[24px] md:text-[34px] mb-4"
                style={{
                  fontFamily: "'Noto Serif KR', serif",
                  fontWeight: 700,
                  lineHeight: 1.35,
                }}
              >
                함께 만드는 건강한 마을,
                <br />
                지금 참여해 주세요
              </h2>
              <p className="text-white/60 mb-8 max-w-lg mx-auto">
                자원봉사, 후원, 조합원 가입으로 이웃의 건강을
                함께 돌볼 수 있습니다.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/join"
                  className="px-7 py-3.5 rounded-full bg-white text-[#1F4B43] hover:bg-[#F7F2E8] transition-colors text-sm"
                  style={{ fontWeight: 700 }}
                >
                  조합원 가입
                </Link>
                <Link
                  to="/volunteer"
                  className="px-7 py-3.5 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors text-sm"
                  style={{ fontWeight: 500 }}
                >
                  자원봉사 안내
                </Link>
                <Link
                  to="/donate"
                  className="px-7 py-3.5 rounded-full bg-[#C87C5A] text-white hover:bg-[#B56E4E] transition-colors text-sm"
                  style={{ fontWeight: 600 }}
                >
                  후원하기
                </Link>
              </div>
            </motion.div>
          </AnimSection>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-5 sm:px-6">
          <AnimSection>
            <motion.div
              variants={fadeUp}
              className="text-center mb-10"
            >
              <span
                className="inline-block px-3 py-1 rounded-md bg-[#1F4B43]/8 text-[#1F4B43] text-xs mb-4"
                style={{
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}
              >
                FAQ
              </span>
              <h2
                className="text-[#1F2623] text-xl md:text-2xl"
                style={{
                  fontFamily: "'Noto Serif KR', serif",
                  fontWeight: 700,
                }}
              >
                자주 묻는 질문
              </h2>
            </motion.div>
          </AnimSection>
          <AnimSection className="space-y-3">
            {FAQ_DATA.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`rounded-xl border overflow-hidden transition-colors ${openFaq === i ? "border-[#1F4B43]/30 bg-[#F9FBF9]" : "border-[#E5E5E5]"}`}
              >
                <button
                  onClick={() =>
                    setOpenFaq(openFaq === i ? null : i)
                  }
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left cursor-pointer"
                >
                  <span
                    className="text-sm text-[#1F2623]"
                    style={{ fontWeight: 600 }}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-[#999] shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-4">
                        <p className="text-sm text-[#666] leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimSection>
        </div>
      </section>

      {/* ═══ PARTNER LOGOS ═══ */}
      <section className="py-10 md:py-14 bg-[#F9F8F5] border-t border-[#E5E5E5]">
        <div className="max-w-[1000px] mx-auto px-5 sm:px-6 text-center">
          <p
            className="text-xs text-[#999] mb-6 tracking-wide"
            style={{ fontWeight: 500 }}
          >
            함께하는 기관
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {[
              "보건복지부",
              "강원특별자치도",
              "원주시",
              "국민건강보험공단",
              "한국사회적기업진흥원",
            ].map((name) => (
              <span
                key={name}
                className="text-sm text-[#BBB]"
                style={{ fontWeight: 600 }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
