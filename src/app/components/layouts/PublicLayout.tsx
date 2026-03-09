import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu, X, Phone, Mail, MapPin, Eye, PhoneCall,
  ChevronDown, ChevronRight, Heart, Shield, LogIn,
  LogOut as LogOutIcon, User, ArrowRight,
  Building2, Clock, Network, Users, Map,
  Megaphone, Newspaper, Activity, BookOpen,
  Stethoscope, Home as HomeIcon, BriefcaseMedical, FileHeart,
  HandHeart, Gift, UserPlus, MessageCircle,
} from "lucide-react";
import { useSeniorMode } from "../SeniorModeContext";
import { useAuth } from "../AuthContext";
import { ScrollToTop } from "../ScrollToTop";
import { V, C } from "../shared";
import logoImg from "../../../assets/f4694bdbad3c9ccbf0dc80f21c4e4f77783ad26f.png";

/* ─── Navigation Structure ─── */
const NAV_ITEMS = [
  {
    label: "조합소개",
    path: "/about",
    desc: "지역에 뿌리내린 의료·돌봄 공동체를 소개합니다.",
    accent: "#1F4B43",
    children: [
      { label: "인사말", path: "/about/greeting", icon: MessageCircle, desc: "조합장 인사" },
      { label: "연혁", path: "/about/history", icon: Clock, desc: "발자취" },
      { label: "조직도", path: "/about/organization", icon: Network, desc: "운영 구조" },
      { label: "함께하는 사람들", path: "/about/people", icon: Users, desc: "우리 팀" },
      { label: "찾아오시는 길", path: "/about/directions", icon: Map, desc: "위치 안내" },
    ],
  },
  {
    label: "커뮤니티",
    path: "/community",
    desc: "조합의 소식과 건강한 일상을 함께 나눕니다.",
    accent: "#C87C5A",
    children: [
      { label: "공지사항", path: "/notices", icon: Megaphone, desc: "주요 안내" },
      { label: "언론보도", path: "/community/press", icon: Newspaper, desc: "보도자료" },
      { label: "건강활동 및 모임", path: "/community", icon: Activity, desc: "건강 프로그램" },
      { label: "조합원 이야기", path: "/community/daily", icon: BookOpen, desc: "일상 기록" },
    ],
  },
  {
    label: "사업소 안내",
    path: "/services",
    desc: "OO의원과 재택의료, 가정간호 서비스를 안내합니다.",
    accent: "#6E958B",
    children: [
      { label: "환자권리장전", path: "/services/rights", icon: FileHeart, desc: "환자 권리" },
      { label: "OO의원", path: "/services/clinic", icon: Stethoscope, desc: "1차 의료" },
      { label: "OO재택의료센터", path: "/services/homecare", icon: HomeIcon, desc: "방문진료" },
      { label: "OO가정간호센터", path: "/services/nursing", icon: BriefcaseMedical, desc: "가정간호" },
    ],
  },
  {
    label: "참여",
    path: "/volunteer",
    desc: "자원봉사와 후원으로 함께해 주세요.",
    accent: "#C87C5A",
    children: [
      { label: "자원봉사 안내", path: "/volunteer", icon: HandHeart, desc: "봉사 참여" },
      { label: "후원 안내 및 신청", path: "/donate", icon: Gift, desc: "후원하기" },
    ],
  },
  {
    label: "조합원",
    path: "/join/we-are",
    desc: "조합원이 되어 건강한 마을을 함께 만들어요.",
    accent: "#1F4B43",
    children: [
      { label: "우리는", path: "/join/we-are", icon: Building2, desc: "기존 소개 내용" },
      { label: "조합원 가입", path: "/join", icon: UserPlus, desc: "가입 신청" },
    ],
  },
];

const UTILITY_ITEMS = [
  { label: "오시는 길", path: "/about/directions" },
  { label: "문의", path: "/inquiries" },
];

export function PublicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const { isSenior, toggleSenior } = useSeniorMode();
  const { isLoggedIn, userName, login, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const megaMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setHoveredNav(null); }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  const handleNavEnter = (label: string) => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setHoveredNav(label);
  };
  const handleNavLeave = () => {
    megaMenuTimeout.current = setTimeout(() => setHoveredNav(null), 120);
  };
  const handleMegaEnter = () => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
  };

  const transparent = isHome && !scrolled;

  return (
    <div className={`min-h-screen flex flex-col ${isSenior ? "text-[20px] leading-[1.7]" : "text-base leading-[1.6]"}`}>
      <ScrollToTop />

      {/* ═══ HEADER ═══ */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        onMouseLeave={handleNavLeave}
      >
        {/* Glass background layer */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            transparent
              ? "bg-gradient-to-b from-black/20 to-transparent"
              : "bg-white/80 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.04)]"
          }`}
        />

        {/* Accent line at top */}
        <div className={`relative h-[2px] transition-opacity duration-500 ${scrolled ? "opacity-100" : "opacity-0"}`}>
          <div className="h-full bg-gradient-to-r from-[#1F4B43] via-[#6E958B] to-[#C87C5A]" />
        </div>

        {/* Main navigation bar */}
        <div className="relative w-full px-4 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-[68px]">
            {/* Logo */}
            <Link to="/" className="hidden lg:flex items-center gap-2.5 shrink-0 group">
              <div className="relative">
                <img src={logoImg} alt={V.조합명_짧게} className="w-9 h-9 object-contain relative z-10" />
                <div className={`absolute inset-0 rounded-full transition-all duration-300 ${transparent ? "bg-white/10 scale-110" : "bg-[#1F4B43]/5 scale-100"} group-hover:scale-125 group-hover:bg-[#1F4B43]/8`} />
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-sm tracking-tight transition-colors duration-300 ${transparent ? "text-white" : "text-[#1F4B43]"}`}
                  style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700, lineHeight: 1.2 }}
                >
                  {V.조합명}
                </span>
                <span
                  className={`text-[10px] tracking-wider transition-all duration-500 ${
                    scrolled ? "opacity-0 max-h-0" : "opacity-100 max-h-4"
                  } ${transparent ? "text-white/40" : "text-[#999]"}`}
                  style={{ fontWeight: 400 }}
                >
                  Rural Healthcare Cooperative
                </span>
              </div>
            </Link>

            <Link
              to="/"
              className="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-1.5 w-[190px] max-w-[calc(100%-112px)]"
            >
              <img src={logoImg} alt={V.조합명_짧게} className="w-5 h-5 object-contain shrink-0" />
              <span
                className={`min-w-0 whitespace-nowrap text-[10px] leading-none text-center tracking-[-0.045em] ${
                  transparent ? "text-white" : "text-[#1F4B43]"
                }`}
                style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
              >
                강원농산어촌의료사회적협동조합
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.path);
                const hovered = hoveredNav === item.label;
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => handleNavEnter(item.label)}
                    onMouseLeave={handleNavLeave}
                  >
                    <Link
                      to={item.path}
                      className={`relative flex items-center gap-1 px-4 py-2 text-sm transition-all duration-300 ${
                        active
                          ? transparent ? "text-white" : "text-[#1F4B43]"
                          : transparent ? "text-white/80 hover:text-white" : "text-[#555] hover:text-[#1F4B43]"
                      }`}
                      style={{ fontWeight: active ? 600 : 500 }}
                    >
                      {item.label}
                      {item.children && (
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-300 ${hovered ? "rotate-180" : ""}`}
                          style={{ opacity: 0.6 }}
                        />
                      )}
                      {/* Active underline */}
                      <span
                        className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full transition-all duration-300 ${
                          active
                            ? transparent ? "bg-white opacity-100" : "bg-[#1F4B43] opacity-100"
                            : hovered
                              ? transparent ? "bg-white/50 opacity-100" : "bg-[#1F4B43]/30 opacity-100"
                              : "opacity-0"
                        }`}
                      />
                    </Link>

                    {/* ── Individual Dropdown ── */}
                    <AnimatePresence>
                      {hovered && item.children && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.98 }}
                          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
                          onMouseEnter={handleMegaEnter}
                          onMouseLeave={handleNavLeave}
                        >
                          <div
                            className="bg-white rounded-xl overflow-hidden min-w-[200px]"
                            style={{ boxShadow: "0 8px 32px -4px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.04)" }}
                          >
                            {/* Top accent bar */}
                            <div className="h-[2px]" style={{ background: item.accent }} />

                            <div className="py-2 px-1">
                              {item.children.map((child, ci) => {
                                const childActive = isActive(child.path);
                                return (
                                  <Link
                                    key={child.path}
                                    to={child.path}
                                    className={`group/item flex items-center gap-2.5 px-4 py-2.5 mx-1 rounded-lg text-[13.5px] transition-all duration-200 ${
                                      childActive
                                        ? "text-[#1F4B43] bg-[#1F4B43]/5"
                                        : "text-[#444] hover:text-[#1F4B43] hover:bg-[#F8F8F6]"
                                    }`}
                                    style={{ fontWeight: childActive ? 600 : 450 }}
                                  >
                                    <span className="flex-1">{child.label}</span>
                                    {/* Hover arrow */}
                                    <ChevronRight
                                      size={13}
                                      className={`shrink-0 transition-all duration-200 ${
                                        childActive
                                          ? "opacity-60 text-[#1F4B43]"
                                          : "opacity-0 -translate-x-1 group-hover/item:opacity-40 group-hover/item:translate-x-0"
                                      }`}
                                    />
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={toggleSenior}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm cursor-pointer transition-all ${
                  isSenior
                    ? "bg-[#C87C5A] text-white"
                    : transparent
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-[#666] hover:text-[#1F4B43] hover:bg-[#F5F5F5]"
                }`}
                style={{ fontWeight: 500 }}
              >
                <Eye size={14} />
                {isSenior ? "어르신 모드 ON" : "어르신 모드"}
              </button>
              <Link
                to="/join"
                className="group flex items-center gap-1.5 px-5 py-2 rounded-full text-sm bg-[#1F4B43] text-white hover:bg-[#163832] transition-all duration-300 shadow-sm hover:shadow-md"
                style={{ fontWeight: 600 }}
              >
                조합원 가입
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              {isLoggedIn ? (
                <div className="flex items-center gap-1.5 ml-1">
                  <Link to="/admin" className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-colors ${transparent ? "text-white/70 hover:text-white" : "text-[#777] hover:text-[#1F4B43] hover:bg-[#F5F5F5]"}`} style={{ fontWeight: 500 }}>
                    <Shield size={12} />관리자
                  </Link>
                  <button onClick={logout} className={`flex items-center gap-1 px-2 py-1.5 rounded-full text-xs cursor-pointer transition-colors ${transparent ? "text-white/50 hover:text-white" : "text-[#AAA] hover:text-[#666]"}`} style={{ fontWeight: 500 }}>
                    <LogOutIcon size={11} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => login("관리자")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs cursor-pointer transition-colors ${
                    transparent ? "text-white/50 hover:text-white" : "text-[#AAA] hover:text-[#666]"
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  <LogIn size={12} />
                </button>
              )}
            </div>

            {/* Mobile actions */}
            <div className="flex lg:hidden items-center justify-between w-full relative z-10">
              <button
                onClick={toggleSenior}
                aria-label={isSenior ? "어르신 모드 끄기" : "어르신 모드 켜기"}
                className={`flex items-center justify-center p-2 rounded-full text-xs cursor-pointer transition-all ${
                  isSenior
                    ? "bg-[#C87C5A] text-white"
                    : transparent
                      ? "bg-white/12 text-white"
                      : "bg-[#F0F0F0] text-[#555]"
                }`}
              >
                <Eye size={14} />
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`p-2 rounded-xl cursor-pointer transition-all ${
                  transparent
                    ? "text-white hover:bg-white/10"
                    : "text-[#333] hover:bg-[#F5F5F5]"
                }`}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Full-Screen Drawer ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden fixed inset-0 top-16 bg-white/98 backdrop-blur-xl z-40 overflow-y-auto"
            >
              <div className="px-5 py-6 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <MobileNavGroup key={item.label} item={item} isActive={isActive} onNavigate={() => setMobileOpen(false)} />
                ))}
                <div className="pt-4 mt-4 border-t border-[#F0F0F0] space-y-2">
                  <Link
                    to="/join"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl bg-[#1F4B43] text-white"
                    style={{ fontWeight: 600 }}
                  >
                    조합원 가입 <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/donate"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#E5E5E5] text-[#1F4B43]"
                    style={{ fontWeight: 500 }}
                  >
                    <Heart size={16} />후원하기
                  </Link>
                  {isLoggedIn ? (
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#F9F8F5]">
                      <span className="text-sm text-[#555]" style={{ fontWeight: 500 }}>{userName}님</span>
                      <div className="flex gap-2">
                        <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-xs text-[#1F4B43]" style={{ fontWeight: 500 }}>관리자</Link>
                        <button onClick={() => { logout(); setMobileOpen(false); }} className="text-xs text-[#999] cursor-pointer">로그아웃</button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { login("관리자"); setMobileOpen(false); }}
                      className="block w-full text-center px-4 py-3 rounded-xl bg-[#F9F8F5] text-[#555] cursor-pointer"
                      style={{ fontWeight: 500 }}
                    >
                      로그인
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══ MAIN ═══ */}
      <main className={`flex-1 ${isHome ? "" : "pt-16 lg:pt-[72px]"} pb-16 md:pb-0`}>
        <Outlet />
      </main>

      {/* ═══ MOBILE BOTTOM NAV ═══ */}
      <MobileBottomNav />

      {/* ═══ FOOTER ═══ */}
      <footer className="hidden md:block bg-[#0F1A17] text-white/80 mt-auto">
        {/* CTA strip */}
        <div className="bg-[#1F4B43]">
          <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-white text-lg" style={{ fontWeight: 600 }}>함께 만드는 건강한 마을</p>
              <p className="text-white/50 text-sm">조합원 가입, 자원봉사, 후원으로 함께해 주세요.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/join" className="group px-5 py-2.5 rounded-full bg-white text-[#1F4B43] text-sm hover:bg-[#F7F2E8] transition-colors inline-flex items-center gap-2" style={{ fontWeight: 600 }}>
                조합원 가입 <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link to="/donate" className="px-5 py-2.5 rounded-full border border-white/20 text-white text-sm hover:bg-white/10 transition-colors" style={{ fontWeight: 500 }}>
                후원하기
              </Link>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img src={logoImg} alt={V.조합명_짧게} className="w-8 h-8 object-contain" />
                <span className="text-white text-lg" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}>
                  {V.조합명_짧게}
                </span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed mb-4">
                주민이 주인이 되어 만드는<br />
                비영리 의료·돌봄 공동체
              </p>
              <p className="text-xs text-white/20">
                {V.조합명}
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white mb-4 text-sm" style={{ fontWeight: 600 }}>연락처</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2.5">
                  <Phone size={14} className="text-[#6E958B]" />
                  <span>{V.대표전화}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail size={14} className="text-[#6E958B]" />
                  <span>{V.이메일}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin size={14} className="text-[#6E958B] mt-0.5" />
                  <span>{V.주소}</span>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-white mb-4 text-sm" style={{ fontWeight: 600 }}>바로가기</h4>
              <div className="space-y-2 text-sm">
                {[
                  { label: "조합소개", path: "/about" },
                  { label: "사업소 안내", path: "/services" },
                  { label: "공지사항", path: "/notices" },
                  { label: "커뮤니티", path: "/community" },
                  { label: "자원봉사", path: "/volunteer" },
                  { label: "문의하기", path: "/inquiries" },
                ].map((l) => (
                  <Link key={l.path} to={l.path} className="block text-white/50 hover:text-[#6E958B] transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Service units */}
            <div>
              <h4 className="text-white mb-4 text-sm" style={{ fontWeight: 600 }}>사업소</h4>
              <div className="space-y-3 text-sm">
                {[
                  { name: "밝음의원", sub: "1차 의료" },
                  { name: "밝음재택의료센터", sub: "방문진료" },
                  { name: "밝음가정간호센터", sub: "가정간호" },
                ].map((s) => (
                  <div key={s.name}>
                    <p className="text-white/60" style={{ fontWeight: 500 }}>{s.name}</p>
                    <p className="text-white/30 text-xs">{s.sub} · {V.대표전화}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/8 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/25">
            <span>&copy; 2026 {V.조합명}. All rights reserved.</span>
            <div className="flex gap-4">
              <span className="hover:text-white/50 cursor-pointer transition-colors">개인정보처리방침</span>
              <span className="hover:text-white/50 cursor-pointer transition-colors">이용약관</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Mobile Nav Group (accordion) ── */
function MobileNavGroup({ item, isActive, onNavigate }: {
  item: typeof NAV_ITEMS[0];
  isActive: (p: string) => boolean;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all ${
          isActive(item.path)
            ? "bg-[#1F4B43]/6 text-[#1F4B43]"
            : open
              ? "bg-[#F9F8F5] text-[#1F2623]"
              : "text-[#333] hover:bg-[#FAFAFA]"
        }`}
        style={{ fontWeight: 600 }}
      >
        <span className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: `${item.accent}0D` }}
          >
            {item.children?.[0]?.icon && (() => {
              const FirstIcon = item.children[0].icon;
              return <FirstIcon size={14} style={{ color: item.accent }} />;
            })()}
          </div>
          {item.label}
        </span>
        <ChevronDown size={18} className={`text-[#BBB] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && item.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-4 pb-2 pt-1 space-y-0.5">
              {item.children.map((child) => {
                const Icon = child.icon;
                return (
                  <Link
                    key={child.path}
                    to={child.path}
                    onClick={onNavigate}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive(child.path) ? "text-[#1F4B43] bg-[#1F4B43]/5" : "text-[#666]"
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    <Icon size={15} className={isActive(child.path) ? "text-[#1F4B43]" : "text-[#BBB]"} />
                    {child.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Mobile Bottom Nav ── */
function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSenior } = useSeniorMode();

  const items = [
    { icon: "home", label: "홈", path: "/" },
    { icon: "info", label: "소개", path: "/about" },
    { icon: "phone", label: "전화", path: null, action: () => alert(`대표전화: ${V.대표전화}`) },
    { icon: "community", label: "소식", path: "/community" },
    { icon: "services", label: "서비스", path: "/services" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-[#E5E5E5] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] md:hidden">
      <div className="grid grid-cols-5 h-14">
        {items.map((item) => {
          const isActiveItem = item.path !== null && (item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path));
          const isPhone = item.path === null;

          if (isPhone) {
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="flex flex-col items-center justify-center gap-0.5 cursor-pointer relative"
              >
                <div className="w-11 h-11 rounded-full bg-[#1F4B43] flex items-center justify-center -mt-4 shadow-lg border-2 border-white">
                  <PhoneCall size={20} className="text-white" />
                </div>
                <span className={`text-[#1F4B43] ${isSenior ? "text-[11px]" : "text-[10px]"}`} style={{ fontWeight: 600 }}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.path!}
              className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActiveItem ? "text-[#1F4B43]" : "text-[#BDBDBD]"
              }`}
            >
              <BottomNavIcon name={item.icon} active={!!isActiveItem} />
              <span className={`${isSenior ? "text-[11px]" : "text-[10px]"}`} style={{ fontWeight: isActiveItem ? 700 : 500 }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}

function BottomNavIcon({ name, active }: { name: string; active: boolean }) {
  const sw = active ? 2.5 : 1.8;
  const sz = 20;
  const icons: Record<string, React.ReactNode> = {
    home: (
      <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    info: (
      <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    phone: (
      <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    community: (
      <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    services: (
      <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  };
  return <>{icons[name] || null}</>;
}
