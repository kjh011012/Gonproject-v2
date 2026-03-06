import { useState } from "react";
import { useNavigate } from "react-router";
import {
  MessageSquare, Eye, Heart, Clock, Search, ChevronLeft,
  ChevronRight, Phone, PhoneCall, ArrowRight, Calendar,
  Megaphone, BookOpen, Camera, Users, MapPin, X,
  Newspaper, Sparkles,
} from "lucide-react";
import { useSeniorMode } from "../components/SeniorModeContext";
import { IMG } from "../components/image-data";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { V, Section, SectionTitle, PhoneButton } from "../components/shared";

/* ════════════════════════════════════════
   Mock Data
   ════════════════════════════════════════ */

type Category = "필독" | "건강모임" | "행사" | "자료" | "새 소식" | "사진/후기";

interface Post {
  id: number;
  cat: Category;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  views: number;
  likes: number;
  comments: number;
  pinned: boolean;
  image: string;
}

const POSTS: Post[] = [
  { id: 1, cat: "필독", title: "2026년 상반기 조합원 정기총회 안내", excerpt: "3월 15일(토) 오전 10시, 원주 시민회관 3층에서 상반기 정기총회를 개최합니다. 안건으로 2025년 결산 보고, 2026년 사업계획 등이 포함됩니다.", author: "사무국", date: "2026-03-01", views: 234, likes: 15, comments: 8, pinned: true, image: IMG.communityMeeting },
  { id: 2, cat: "건강모임", title: "봄맞이 건강걷기 대회 참가자 모집", excerpt: "따뜻한 봄바람과 함께 걸어요! 강원도 치악산 자락에서 열리는 건강걷기 행사에 조합원과 주민 여러분을 초대합니다.", author: "건강위원회", date: "2026-02-28", views: 189, likes: 23, comments: 5, pinned: false, image: IMG.communityWalking },
  { id: 3, cat: "행사", title: "제4차 이사회 결과 보고", excerpt: "2월 25일 이사회에서 논의된 주요 안건과 결정 사항을 투명하게 공유합니다.", author: "사무국", date: "2026-02-25", views: 312, likes: 42, comments: 12, pinned: false, image: IMG.communityNotice },
  { id: 4, cat: "자료", title: "만성질환 자가관리 가이드북 배포", excerpt: "혈압·당뇨 등 만성질환을 스스로 관리할 수 있는 실용 가이드북을 무료로 배포합니다.", author: "사무국", date: "2026-02-22", views: 156, likes: 18, comments: 7, pinned: false, image: IMG.communityCheckup },
  { id: 5, cat: "필독", title: "3월 서비스 준비 일정 안내", excerpt: "G온돌봄이 제공할 서비스 준비 현황과 3월 중 주요 마일스톤을 안내합니다.", author: "사무국", date: "2026-02-20", views: 278, likes: 35, comments: 9, pinned: true, image: IMG.communityEducation },
  { id: 6, cat: "새 소식", title: "G온돌봄 홈페이지가 열렸습니다", excerpt: "강원농산어촌의료사회적협동조합 공식 홈페이지를 오픈합니다. 서비스 안내, 소식, 가입 안내를 한 곳에서 확인하세요.", author: "사무국", date: "2026-02-18", views: 198, likes: 10, comments: 3, pinned: false, image: IMG.communityHero },
  { id: 7, cat: "건강모임", title: "주 2회 아침 걷기 모임 참여자 모집", excerpt: "매주 화·목 아침 7시, 마을 어귀 공원에서 출발합니다. 누구나 환영합니다!", author: "건강위원회", date: "2026-02-15", views: 143, likes: 27, comments: 6, pinned: false, image: IMG.communityYoga },
  { id: 8, cat: "자료", title: "사회적협동조합 주민 안내 자료집", excerpt: "사회적협동조합이란 무엇인지, 조합원의 권리와 혜택을 쉽게 설명하는 자료입니다.", author: "사무국", date: "2026-02-12", views: 98, likes: 11, comments: 4, pinned: false, image: IMG.communityMedia },
];

const UPCOMING_EVENTS = [
  { id: "e1", title: "상반기 정기총회", date: "3월 15일(토)", time: "오전 10:00", location: "원주 시민회관 3층", image: IMG.communityMeeting, badge: "총회" },
  { id: "e2", title: "봄맞이 건강걷기 대회", date: "3월 22일(토)", time: "오전 9:00", location: "치악산 자락 공원", image: IMG.communityWalking, badge: "모임" },
  { id: "e3", title: "건강 교실: 만성질환 관리", date: "3월 29일(토)", time: "오후 2:00", location: "마을 복지관 2층", image: IMG.communityEducation, badge: "교육" },
];

const PHOTO_GALLERY = [
  { id: "p1", image: IMG.communityFestival, title: "마을 봄맞이 축제", date: "2026-02-22", likes: 34 },
  { id: "p2", image: IMG.communityCooking, title: "어르신 건강 밥상 나눔", date: "2026-02-18", likes: 28 },
  { id: "p3", image: IMG.communityGarden, title: "텃밭 가꾸기 봉사", date: "2026-02-10", likes: 45 },
  { id: "p4", image: IMG.communityYoga, title: "아침 스트레칭 교실", date: "2026-02-05", likes: 21 },
  { id: "p5", image: IMG.communityCheckup, title: "건강검진 봉사 현장", date: "2026-01-28", likes: 37 },
  { id: "p6", image: IMG.communityHero, title: "신년 인사 모임", date: "2026-01-15", likes: 52 },
];

/* ── Tabs ── */
const TABS = [
  { key: "all", label: "전체 소식", icon: Sparkles, cats: null },
  { key: "notice", label: "공지사항", icon: Megaphone, cats: ["필독"] as Category[] },
  { key: "gathering", label: "건강모임/행사", icon: Users, cats: ["건강모임", "행사"] as Category[] },
  { key: "media", label: "언론/자료", icon: Newspaper, cats: ["자료", "새 소식"] as Category[] },
  { key: "photos", label: "사진/후기", icon: Camera, cats: ["사진/후기"] as Category[] },
];
const TABS_SENIOR = [
  { key: "notice", label: "필독 공지", icon: Megaphone, cats: ["필독"] as Category[] },
  { key: "gathering", label: "모임/행사", icon: Users, cats: ["건강모임", "행사"] as Category[] },
];

/* ════════════════════════════════════════
   CommunityPage
   ════════════════════════════════════════ */
export function CommunityPage() {
  const { isSenior } = useSeniorMode();
  const navigate = useNavigate();
  const tabs = isSenior ? TABS_SENIOR : TABS;

  const [tab, setTab] = useState(tabs[0].key);
  const [search, setSearch] = useState("");
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  const activeTab = tabs.find((t) => t.key === tab) || tabs[0];

  /* ── filtered posts ── */
  const filtered = POSTS.filter((p) => {
    if (activeTab.cats && activeTab.cats.length > 0 && !activeTab.cats.includes(p.cat)) return false;
    if (search && !p.title.includes(search) && !p.excerpt.includes(search)) return false;
    return true;
  });

  const pinnedPosts = POSTS.filter((p) => p.pinned);
  const post = selectedPost !== null ? POSTS.find((p) => p.id === selectedPost) : null;

  /* ══════════════════════════════
     Post Detail View
     ══════════════════════════════ */
  if (post) {
    return (
      <div>
        {/* Image hero */}
        <section className="relative">
          <div className="h-48 md:h-80">
            <ImageWithFallback src={post.image} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-[#111827]/30 to-[#111827]/10" />
          </div>
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
              <button onClick={() => setSelectedPost(null)} className="flex items-center gap-1 text-sm text-white/70 hover:text-white mb-3 md:mb-4 cursor-pointer min-h-[44px]">
                <ChevronLeft size={16} /> 목록으로 돌아가기
              </button>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs bg-white/20 text-white backdrop-blur-sm" style={{ fontWeight: 600 }}>{post.cat}</span>
                {post.pinned && <span className="px-3 py-1 rounded-full text-xs bg-amber-400/20 text-amber-200 backdrop-blur-sm" style={{ fontWeight: 600 }}>필독</span>}
              </div>
              <h1 className={`text-white mb-2 ${isSenior ? "text-[24px] md:text-[32px]" : "text-2xl md:text-3xl"}`} style={{ fontWeight: 800 }}>{post.title}</h1>
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span>{post.author}</span>
                <span className="flex items-center gap-1"><Clock size={13} /> {post.date}</span>
                <span className="flex items-center gap-1"><Eye size={13} /> {post.views}</span>
                <span className="flex items-center gap-1"><Heart size={13} /> {post.likes}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
            <div className={`${isSenior ? "p-8" : "p-6 md:p-8"}`}>
              <p className={`text-[#374151] leading-relaxed mb-6 ${isSenior ? "text-[20px] leading-[1.8]" : ""}`}>
                {post.excerpt}
              </p>
              <div className={`text-[#374151] leading-relaxed space-y-4 ${isSenior ? "text-[18px] leading-[1.8]" : ""}`}>
                <p>이 게시글은 예시 콘텐츠입니다. 실제 운영 시 조합원들이 작성한 다양한 소식이 표시됩니다.</p>
                <p>강원농산어촌의료사회적협동조합(G온돌봄)은 조합원과 주민에게 투명하게 운영 내용을 공유합니다. 중요한 소식은 항상 이 곳에서 확인하실 수 있습니다.</p>
              </div>
            </div>

            {/* Article footer */}
            <div className="border-t border-[#E5E7EB] px-4 md:px-8 py-4 md:py-5 bg-[#F8F9FC]">
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                <button onClick={() => navigate("/inquiries")} className={`px-5 py-2.5 rounded-xl bg-[#1F6B78] text-white cursor-pointer hover:bg-[#185A65] transition-colors active:scale-[0.98] ${isSenior ? "min-h-[52px] text-[17px]" : "min-h-[48px] text-sm"}`} style={{ fontWeight: 600 }}>
                  문의하기
                </button>
                <PhoneButton isSenior={isSenior} />
                <button onClick={() => navigate("/join")} className={`px-5 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[#374151] hover:bg-gray-50 cursor-pointer transition-colors active:scale-[0.98] ${isSenior ? "min-h-[52px] text-[17px]" : "min-h-[48px] text-sm"}`} style={{ fontWeight: 500 }}>
                  조합원 가입하기
                </button>
              </div>
            </div>
          </div>

          {/* Related posts */}
          <div className="mt-10">
            <h3 className="text-[#111827] mb-5" style={{ fontWeight: 700 }}>관련 소식</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {POSTS.filter((p) => p.id !== post.id).slice(0, 3).map((p) => (
                <SmallPostCard key={p.id} post={p} onClick={() => { setSelectedPost(p.id); window.scrollTo(0, 0); }} isSenior={isSenior} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════
     Main Community Page
     ══════════════════════════════ */
  return (
    <div>
      {/* ── Image Hero ── */}
      <section className="relative">
        <div className="aspect-[16/9] md:aspect-[21/9] min-h-[240px] md:min-h-[400px]">
          <ImageWithFallback src={IMG.communityHero} alt="(이미지) 커뮤니티: 마을 사람들의 모임" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-[#111827]/30 to-[#111827]/10" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 w-full">
            {!isSenior && (
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-[#67B89A] text-sm mb-4 backdrop-blur-sm" style={{ fontWeight: 600 }}>
                소식/커뮤니티
              </span>
            )}
            <h1
              className={`text-white mb-3 ${isSenior ? "text-[30px] md:text-[40px]" : "text-3xl md:text-4xl lg:text-[42px]"} leading-tight`}
              style={{ fontWeight: 800 }}
            >
              {isSenior ? "새 소식 보기" : "소식과 활동을 투명하게 공유합니다."}
            </h1>
            <p className={`text-white/80 max-w-2xl ${isSenior ? "text-[20px]" : "text-base md:text-lg"} leading-relaxed`}>
              {isSenior ? "중요한 안내와 모임 소식을 확인하세요." : "공지, 건강 모임, 자료, 사진과 후기를 한 곳에서 확인하세요."}
            </p>
            {isSenior && (
              <div className="mt-5"><PhoneButton isSenior /></div>
            )}
            <span className="block mt-3 text-white/40 text-[10px]">(이미지) 커뮤니티: 마을 사람들의 모임</span>
          </div>
        </div>
      </section>

      {/* ── Featured / Pinned Strip (일반 모드) ── */}
      {!isSenior && pinnedPosts.length > 0 && (
        <section className="bg-gradient-to-r from-[#1F6B78] to-[#2A9D8F] py-5">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              <Megaphone size={18} className="text-white/80 shrink-0" />
              {pinnedPosts.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPost(p.id)}
                  className="flex items-center gap-2 shrink-0 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-sm transition-colors cursor-pointer backdrop-blur-sm"
                  style={{ fontWeight: 500 }}
                >
                  <span className="w-5 h-5 rounded-full bg-amber-400/30 text-amber-200 flex items-center justify-center text-[10px]" style={{ fontWeight: 700 }}>!</span>
                  <span className="whitespace-nowrap">{p.title}</span>
                  <ArrowRight size={13} className="opacity-60" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Tab Navigation ── */}
      <section className="sticky top-16 md:top-20 z-30 bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <nav className={`flex ${isSenior ? "gap-1" : "gap-0"} overflow-x-auto -mb-px`}>
              {tabs.map((t) => {
                const Icon = t.icon;
                const active = tab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors border-b-2 ${
                      active
                        ? "border-[#1F6B78] text-[#1F6B78]"
                        : "border-transparent text-[#9CA3AF] hover:text-[#374151]"
                    } ${isSenior ? "px-5 py-4 text-[17px]" : "px-4 py-3.5 text-sm"}`}
                    style={{ fontWeight: active ? 700 : 400 }}
                  >
                    <Icon size={isSenior ? 20 : 16} />
                    {t.label}
                  </button>
                );
              })}
            </nav>
            {/* Search */}
            {!isSenior && (
              <div className="relative hidden md:block">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB] text-sm w-56 focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20 focus:w-72 transition-all"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Search (일반) */}
      {!isSenior && (
        <div className="md:hidden bg-white px-4 pt-3 pb-1">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
            />
          </div>
        </div>
      )}

      {/* ══════════════════════════════
         TAB: 전체 소식 — Magazine layout
         ══════════════════════════════ */}
      {tab === "all" && !isSenior && (
        <>
          {/* Featured 2-column hero */}
          <Section>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Large featured */}
              <div className="lg:col-span-3">
                <FeaturedCard post={POSTS[0]} onClick={() => setSelectedPost(POSTS[0].id)} />
              </div>
              {/* Side stack */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {POSTS.slice(1, 3).map((p) => (
                  <HorizontalCard key={p.id} post={p} onClick={() => setSelectedPost(p.id)} />
                ))}
              </div>
            </div>
          </Section>

          {/* Upcoming events strip */}
          <section className="bg-[#F8F9FC] border-y border-[#E5E7EB]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[#111827]" style={{ fontWeight: 700 }}>
                  <Calendar size={18} className="inline mr-2 text-[#1F6B78]" />다가오는 일정
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {UPCOMING_EVENTS.map((ev) => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </div>
            </div>
          </section>

          {/* Remaining posts grid */}
          <Section>
            <SectionTitle title="최근 소식" sub="놓치지 마세요" center={false} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {POSTS.slice(3).map((p) => (
                <PostCard key={p.id} post={p} onClick={() => setSelectedPost(p.id)} />
              ))}
            </div>
          </Section>

          {/* Photo peek */}
          <section className="bg-[#071A2B] py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white" style={{ fontWeight: 700 }}>
                  <Camera size={18} className="inline mr-2 text-[#67B89A]" />오늘의 하루
                </h2>
                <button onClick={() => setTab("photos")} className="text-sm text-[#67B89A] hover:text-white cursor-pointer flex items-center gap-1" style={{ fontWeight: 500 }}>
                  더 보기 <ArrowRight size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PHOTO_GALLERY.slice(0, 3).map((p) => (
                  <button key={p.id} onClick={() => setLightboxPhoto(p.id)} className="relative rounded-xl overflow-hidden aspect-[4/3] cursor-pointer group">
                    <ImageWithFallback src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm" style={{ fontWeight: 600 }}>{p.title}</p>
                      <p className="text-white/60 text-xs flex items-center gap-2"><Heart size={11} /> {p.likes}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ══════════════════════════════
         TAB: 공지사항 / 건강모임 / 언론자료 — Card grid
         ══════════════════════════════ */}
      {(tab === "notice" || tab === "gathering" || tab === "media") && (
        <Section>
          {/* Tab description */}
          {!isSenior && (
            <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-[#F2EBDD]/40 border border-[#F2EBDD]">
              {tab === "notice" && <Megaphone size={18} className="text-[#7A6C55]" />}
              {tab === "gathering" && <Users size={18} className="text-[#7A6C55]" />}
              {tab === "media" && <Newspaper size={18} className="text-[#7A6C55]" />}
              <p className="text-sm text-[#7A6C55]">
                {tab === "notice" && "조합의 중요 공지사항과 필독 안내입니다."}
                {tab === "gathering" && "건강 모임, 걷기 대회, 이사회 등 조합 행사 소식입니다."}
                {tab === "media" && "언론 보도, 자료실, 새 소식을 모아둡니다."}
              </p>
            </div>
          )}

          {filtered.length > 0 ? (
            <div className={`grid gap-5 ${isSenior ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
              {filtered.map((p) =>
                isSenior ? (
                  <SeniorPostRow key={p.id} post={p} onClick={() => setSelectedPost(p.id)} />
                ) : (
                  <PostCard key={p.id} post={p} onClick={() => setSelectedPost(p.id)} />
                )
              )}
            </div>
          ) : (
            <EmptyState isSenior={isSenior} />
          )}
        </Section>
      )}

      {/* ══════════════════════════════
         TAB: 사진/후기 — Gallery
         ══════════════════════════════ */}
      {tab === "photos" && !isSenior && (
        <Section>
          <SectionTitle title="사진/후기 — 오늘의 하루" sub="조합원과 주민이 함께한 순간들을 기록합니다." center={false} />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PHOTO_GALLERY.map((p) => (
              <button
                key={p.id}
                onClick={() => setLightboxPhoto(p.id)}
                className="relative rounded-2xl overflow-hidden cursor-pointer group"
              >
                <div className="aspect-[4/3]">
                  <ImageWithFallback src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm" style={{ fontWeight: 700 }}>{p.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-white/60 text-xs">
                    <span>{p.date}</span>
                    <span className="flex items-center gap-1"><Heart size={11} /> {p.likes}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Upload CTA */}
          <div className="mt-8 text-center">
            <div className="inline-block p-8 rounded-2xl border-2 border-dashed border-[#E5E7EB] bg-[#FAFAFA]">
              <Camera size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-[#374151] mb-1" style={{ fontWeight: 600 }}>오늘의 하루를 공유해 주세요</p>
              <p className="text-sm text-[#9CA3AF] mb-4">조합원이라면 누구나 사진과 후기를 올릴 수 있어요.</p>
              <button className="px-5 py-2.5 rounded-xl bg-[#1F6B78] text-white text-sm cursor-pointer hover:bg-[#185A65] transition-colors" style={{ fontWeight: 600 }} onClick={() => alert("사진/후기 업로드 기능은 Supabase 연동 후 활성화됩니다.")}>
                사진/후기 올리기
              </button>
            </div>
          </div>
        </Section>
      )}

      {/* ── Senior: 즉시 행동 ── */}
      {isSenior && (
        <Section>
          <SectionTitle isSenior title="오늘 바로 할 수 있는 것" center />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "&#x1F4DE;", label: "전화 상담", action: () => alert(`대표전화: ${V.대표전화}`) },
              { icon: "&#x270D;&#xFE0F;", label: "가입 상담", action: () => navigate("/join") },
              { icon: "&#x1F4C5;", label: "서비스 보기", action: () => navigate("/services") },
            ].map((a, i) => (
              <button key={i} onClick={a.action} className="flex flex-col items-center gap-3 p-8 rounded-2xl border border-[#E5E7EB] bg-white hover:shadow-md transition-shadow cursor-pointer">
                <span className="text-4xl" dangerouslySetInnerHTML={{ __html: a.icon }} />
                <span className="text-[#111827] text-[20px]" style={{ fontWeight: 700 }}>{a.label}</span>
              </button>
            ))}
          </div>
        </Section>
      )}

      {/* ── Bottom CTA (일반) ── */}
      {!isSenior && tab !== "photos" && (
        <section className="bg-gradient-to-br from-[#1F6B78] to-[#2A9D8F] py-8 md:py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-white text-2xl mb-3" style={{ fontWeight: 800 }}>소식을 놓치지 마세요</h2>
            <p className="text-white/70 mb-6">조합의 활동과 서비스 소식을 가장 먼저 받아보세요.</p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button onClick={() => navigate("/join")} className="w-full sm:w-auto px-6 py-3 min-h-[48px] rounded-full bg-white text-[#1F6B78] hover:bg-gray-100 cursor-pointer transition-colors active:scale-[0.98]" style={{ fontWeight: 600 }}>
                조합원 가입하기
              </button>
              <PhoneButton variant="secondary" className="w-full sm:w-auto" />
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════
         Photo Lightbox
         ══════════════════════════════ */}
      {lightboxPhoto && (() => {
        const photo = PHOTO_GALLERY.find((p) => p.id === lightboxPhoto);
        if (!photo) return null;
        const idx = PHOTO_GALLERY.findIndex((p) => p.id === lightboxPhoto);
        return (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80" onClick={() => setLightboxPhoto(null)}>
            <div className="relative max-w-4xl max-h-[90vh] w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="rounded-2xl overflow-hidden">
                <ImageWithFallback src={photo.image} alt={photo.title} className="w-full max-h-[70vh] object-contain bg-black" />
              </div>
              <div className="mt-3 text-center">
                <p className="text-white" style={{ fontWeight: 700 }}>{photo.title}</p>
                <p className="text-white/50 text-sm">{photo.date} · <Heart size={12} className="inline" /> {photo.likes}</p>
              </div>
              {/* Nav */}
              {idx > 0 && (
                <button onClick={() => setLightboxPhoto(PHOTO_GALLERY[idx - 1].id)} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 cursor-pointer"><ChevronLeft size={24} /></button>
              )}
              {idx < PHOTO_GALLERY.length - 1 && (
                <button onClick={() => setLightboxPhoto(PHOTO_GALLERY[idx + 1].id)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 cursor-pointer"><ChevronRight size={24} /></button>
              )}
              <button onClick={() => setLightboxPhoto(null)} className="absolute -top-2 -right-2 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 cursor-pointer"><X size={20} /></button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ════════════════════════════════════════
   Sub-Components
   ════════════════════════════════════════ */

/** Large featured card — hero style */
function FeaturedCard({ post, onClick }: { post: Post; onClick: () => void }) {
  return (
    <button onClick={onClick} className="relative rounded-2xl overflow-hidden cursor-pointer group text-left w-full h-full min-h-[240px] md:min-h-[320px]">
      <ImageWithFallback src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-[#111827]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs bg-white/20 text-white backdrop-blur-sm" style={{ fontWeight: 600 }}>{post.cat}</span>
          {post.pinned && <span className="px-2.5 py-1 rounded-full text-xs bg-amber-400/30 text-amber-200" style={{ fontWeight: 600 }}>필독</span>}
        </div>
        <h2 className="text-white text-xl md:text-2xl mb-2 line-clamp-2" style={{ fontWeight: 800 }}>{post.title}</h2>
        <p className="text-white/70 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
        <div className="flex items-center gap-4 text-xs text-white/50">
          <span>{post.author}</span>
          <span className="flex items-center gap-1"><Clock size={11} /> {post.date}</span>
          <span className="flex items-center gap-1"><Eye size={11} /> {post.views}</span>
          <span className="flex items-center gap-1"><Heart size={11} /> {post.likes}</span>
        </div>
      </div>
    </button>
  );
}

/** Horizontal card — side column */
function HorizontalCard({ post, onClick }: { post: Post; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] hover:shadow-lg transition-shadow cursor-pointer text-left group flex-1">
      <div className="w-40 shrink-0 relative overflow-hidden">
        <ImageWithFallback src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#1F6B78]/10 text-[#1F6B78]" style={{ fontWeight: 600 }}>{post.cat}</span>
          {post.pinned && <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-600" style={{ fontWeight: 600 }}>필독</span>}
        </div>
        <h3 className="text-[#111827] line-clamp-2 mb-1 group-hover:text-[#1F6B78] transition-colors" style={{ fontWeight: 700 }}>{post.title}</h3>
        <p className="text-[#9CA3AF] text-xs line-clamp-1">{post.excerpt}</p>
        <div className="flex items-center gap-3 mt-2 text-[10px] text-[#9CA3AF]">
          <span>{post.date}</span>
          <span className="flex items-center gap-0.5"><Eye size={10} /> {post.views}</span>
        </div>
      </div>
    </button>
  );
}

/** Standard post card */
function PostCard({ post, onClick }: { post: Post; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] hover:shadow-lg transition-all cursor-pointer text-left group flex flex-col">
      <div className="relative h-44 overflow-hidden">
        <ImageWithFallback src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/40 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] bg-white/90 text-[#1F6B78] backdrop-blur-sm" style={{ fontWeight: 600 }}>{post.cat}</span>
          {post.pinned && <span className="px-2 py-1 rounded-full text-[11px] bg-amber-400/90 text-white" style={{ fontWeight: 600 }}>필독</span>}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-[#111827] mb-1.5 line-clamp-2 group-hover:text-[#1F6B78] transition-colors" style={{ fontWeight: 700 }}>{post.title}</h3>
        <p className="text-[#9CA3AF] text-sm line-clamp-2 mb-3 flex-1">{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
          <div className="flex items-center gap-3">
            <span>{post.author}</span>
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-0.5"><Eye size={12} /> {post.views}</span>
            <span className="flex items-center gap-0.5"><Heart size={12} /> {post.likes}</span>
            <span className="flex items-center gap-0.5"><MessageSquare size={12} /> {post.comments}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

/** Small post card (related) */
function SmallPostCard({ post, onClick, isSenior }: { post: Post; onClick: () => void; isSenior: boolean }) {
  return (
    <button onClick={onClick} className="rounded-xl overflow-hidden bg-white border border-[#E5E7EB] hover:shadow-md transition-shadow cursor-pointer text-left group">
      <div className="relative h-28 overflow-hidden">
        <ImageWithFallback src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/50 via-transparent to-transparent" />
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] bg-white/90 text-[#1F6B78]" style={{ fontWeight: 600 }}>{post.cat}</span>
      </div>
      <div className="p-3">
        <h4 className={`text-[#111827] line-clamp-2 group-hover:text-[#1F6B78] transition-colors ${isSenior ? "text-[16px]" : "text-sm"}`} style={{ fontWeight: 600 }}>{post.title}</h4>
        <p className="text-[10px] text-[#9CA3AF] mt-1">{post.date}</p>
      </div>
    </button>
  );
}

/** Event card */
function EventCard({ event }: { event: (typeof UPCOMING_EVENTS)[number] }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] hover:shadow-md transition-shadow group">
      <div className="relative h-36 overflow-hidden">
        <ImageWithFallback src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/50 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#67B89A] text-white text-[11px]" style={{ fontWeight: 600 }}>{event.badge}</span>
      </div>
      <div className="p-4">
        <h4 className="text-[#111827] mb-2" style={{ fontWeight: 700 }}>{event.title}</h4>
        <div className="space-y-1 text-xs text-[#6B7280]">
          <p className="flex items-center gap-1.5"><Calendar size={12} className="text-[#1F6B78]" />{event.date} · {event.time}</p>
          <p className="flex items-center gap-1.5"><MapPin size={12} className="text-[#1F6B78]" />{event.location}</p>
        </div>
      </div>
    </div>
  );
}

/** Senior post row — extra large, accessible */
function SeniorPostRow({ post, onClick }: { post: Post; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 md:gap-4 rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden hover:shadow-md transition-shadow cursor-pointer text-left group w-full">
      <div className="w-24 h-24 sm:w-40 sm:h-36 shrink-0 relative overflow-hidden">
        <ImageWithFallback src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="flex-1 py-3 pr-2 sm:py-4 sm:pr-4 min-w-0">
        <div className="flex items-center gap-2 mb-1 sm:mb-2 flex-wrap">
          <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm bg-[#1F6B78]/10 text-[#1F6B78]" style={{ fontWeight: 600 }}>{post.cat}</span>
          {post.pinned && <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm bg-amber-50 text-amber-600" style={{ fontWeight: 600 }}>필독</span>}
        </div>
        <h3 className="text-[#111827] text-[17px] sm:text-[20px] leading-snug mb-1 line-clamp-2 group-hover:text-[#1F6B78] transition-colors" style={{ fontWeight: 700 }}>{post.title}</h3>
        <p className="text-[#9CA3AF] text-[13px] sm:text-[15px] line-clamp-1 hidden sm:block">{post.excerpt}</p>
        <div className="flex items-center gap-3 mt-1 sm:mt-2 text-xs sm:text-sm text-[#9CA3AF]">
          <span>{post.date}</span>
          <span className="hidden sm:inline">{post.author}</span>
        </div>
      </div>
      <div className="shrink-0 pr-3 sm:pr-4">
        <span className="px-3 py-2 sm:px-5 sm:py-3 rounded-xl bg-[#1F6B78] text-white text-[15px] sm:text-[17px] whitespace-nowrap" style={{ fontWeight: 600 }}>읽기</span>
      </div>
    </button>
  );
}

/** Empty state */
function EmptyState({ isSenior }: { isSenior: boolean }) {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 rounded-full bg-[#F8F9FC] flex items-center justify-center mx-auto mb-4">
        <MessageSquare size={32} className="text-gray-300" />
      </div>
      <p className={`text-[#9CA3AF] ${isSenior ? "text-[18px]" : ""}`}>
        {isSenior ? "아직 소식이 없어요." : "아직 게시물이 없어요. 곧 소식을 올리겠습니다."}
      </p>
    </div>
  );
}