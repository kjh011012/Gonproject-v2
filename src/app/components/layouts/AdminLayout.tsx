import { useEffect, useRef, useState, createContext, useContext } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  LayoutDashboard, Users, UserPlus, Ban, Wallet,
  ClipboardList, CalendarDays, Layers, BookOpen, UserCog,
  Megaphone, PartyPopper, Newspaper, ImageIcon, Images,
  MessageSquare, FileText, HelpCircle,
  BarChart3, Download,
  Settings, Shield, Bell, ScrollText, Trash2,
  ChevronLeft, ChevronDown, ChevronRight, LogOut, Menu, Search, Plus, X, Eye
} from "lucide-react";
import logoImg from "../../../assets/f4694bdbad3c9ccbf0dc80f21c4e4f77783ad26f.png";

const AdminLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 124 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M73.1501 0.0523872C85.324 -0.62355 107.618 5.17981 106.225 21.058C105.898 24.8277 104.072 28.3089 101.156 30.7199C93.7144 36.9018 78.2328 36.3929 76.5912 24.3822C75.8844 19.2107 80.4155 16.6696 83.1558 13.5571C86.7943 9.42434 77.1305 7.90442 74.6274 8.35348C49.6993 9.82817 27.5919 33.5659 28.3906 58.6567C28.8579 73.3354 39.1573 83.4226 53.9326 82.5878C63.6936 82.0436 70.7105 78.1975 77.3056 71.0626C80.0173 67.4532 80.4844 66.0278 82.6023 62.1908C82.2643 64.91 82.355 67.7858 81.934 70.4425C77.7819 96.6383 47.2641 116.178 22.0245 106.384C8.25029 101.039 0.834201 87.7103 0.0769349 73.4804C-0.847206 56.1137 6.63733 39.565 18.0497 26.7918C32.1092 10.8786 51.9497 1.25051 73.1501 0.0523872Z" fill="#1D2A6A"/>
    <path d="M86.6869 42.2305C104.543 48.189 108.469 66.7712 103.066 83.2157C98.6394 96.6894 88.0578 107.699 75.4198 113.913C61.6151 120.658 45.7149 121.716 31.1377 116.861C23.2168 114.145 16.7588 109.883 11.2222 103.664C9.91741 102.199 8.46053 100.718 7.44077 99.0435C10.0496 101.059 12.0643 103.597 14.7816 105.552C18.7775 108.426 23.3227 110.457 28.1473 111.473C52.6252 116.631 78.0265 101.891 90.9938 81.5401C97.7138 70.9939 101.882 54.5919 90.4622 45.5964C89.1411 44.5574 87.2834 43.5925 85.6524 43.1713L86.6869 42.2305Z" fill="#219779"/>
    <path d="M103.279 41.2888C106.865 40.7584 112.552 41.9277 115.413 44.0814C129.884 54.973 122.99 78.7576 114.684 90.827C104.052 106.275 88.8797 115.56 71.0211 119.085C68.1919 119.738 65.6136 120.037 62.7324 119.752C76.734 116.466 88.2347 110.777 97.3308 99.0768C107.58 85.8941 112 66.0582 102.778 51.1689C100.636 47.7104 98.2407 45.74 95.0288 43.2728C97.3423 42.4656 100.882 41.5783 103.279 41.2888Z" fill="#F8C21A"/>
    <path d="M76.054 51.9667C78.6251 51.9111 78.8836 52.0738 80.9004 53.5293C82.5223 57.0807 81.9387 58.5592 78.5295 60.4236C76.6215 60.659 74.5208 60.0575 73.4637 58.345C72.9132 57.4616 72.748 56.3915 73.0065 55.3832C73.4431 53.6333 74.6192 52.8362 76.054 51.9667Z" fill="#F9BD17"/>
    <path d="M71.194 43.4399C66.7557 44.4939 61.1569 48.9386 58.9018 52.8789C56.5166 57.0461 56.1746 62.4721 60.983 65.0256C65.694 67.5273 70.3135 66.291 74.9049 64.2967C75.9725 63.8268 76.6847 63.0184 77.7851 62.6952L77.8979 62.9402C74.6799 66.4305 66.399 68.5614 61.9079 66.7059C56.3865 64.4249 54.852 59.1939 57.121 53.9476C59.6975 47.9905 64.7548 45.0161 70.4771 42.6695L71.194 43.4399Z" fill="#1D2A6A"/>
    <path d="M70.4771 42.6695C76.0463 40.7434 81.0851 40.806 86.6869 42.2305L85.6524 43.1713C81.248 41.541 75.6214 42.4131 71.194 43.4399L70.4771 42.6695Z" fill="#046B96"/>
  </svg>
);

// Operator Large Mode context
const LargeModeContext = createContext({ isLarge: false, toggleLarge: () => {} });
export const useLargeMode = () => useContext(LargeModeContext);

interface NavGroup {
  label: string;
  items: { label: string; path: string; icon: any; badge?: number }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "메인",
    items: [
      { label: "대시보드", path: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "조합원",
    items: [
      { label: "조합원 리스트", path: "/admin/members", icon: Users },
      { label: "가입 승인 대기", path: "/admin/applications", icon: UserPlus, badge: 3 },
      { label: "블랙리스트/탈퇴", path: "/admin/blacklist", icon: Ban },
      { label: "출자금/입금 원장", path: "/admin/transactions", icon: Wallet },
    ],
  },
  {
    label: "서비스",
    items: [
      { label: "서비스 인박스", path: "/admin/services", icon: ClipboardList, badge: 8 },
      { label: "서비스 캘린더", path: "/admin/calendar", icon: CalendarDays },
      { label: "운영 콘솔(500+)", path: "/admin/ops-console", icon: Layers },
      { label: "서비스 카탈로그", path: "/admin/catalog", icon: BookOpen },
      { label: "담당자/용량", path: "/admin/staff", icon: UserCog },
    ],
  },
  {
    label: "콘텐츠",
    items: [
      { label: "공지사항", path: "/admin/notices", icon: Megaphone },
      { label: "건강모임/행사", path: "/admin/events", icon: PartyPopper },
      { label: "언론/자료", path: "/admin/media-docs", icon: Newspaper },
      { label: "사진/후기", path: "/admin/photos", icon: ImageIcon },
      { label: "미디어 라이브러리", path: "/admin/media-lib", icon: Images },
    ],
  },
  {
    label: "문의/CS",
    items: [
      { label: "문의 인박스", path: "/admin/inquiries", icon: MessageSquare, badge: 5 },
      { label: "답변 템플릿", path: "/admin/templates", icon: FileText },
      { label: "FAQ 관리", path: "/admin/faq", icon: HelpCircle },
    ],
  },
  {
    label: "리포트",
    items: [
      { label: "운영 리포트", path: "/admin/reports", icon: BarChart3 },
      { label: "데이터 내보내기", path: "/admin/export", icon: Download },
    ],
  },
  {
    label: "설정",
    items: [
      { label: "운영 설정", path: "/admin/settings", icon: Settings },
      { label: "계정/권한", path: "/admin/roles", icon: Shield },
      { label: "알림 설정", path: "/admin/notifications", icon: Bell },
      { label: "감사 로그", path: "/admin/audit", icon: ScrollText },
      { label: "휴지통/복구", path: "/admin/trash", icon: Trash2 },
    ],
  },
];

const QUICK_ACTIONS = [
  { label: "조합원 등록", icon: UserPlus, path: "/admin/members" },
  { label: "공지 작성", icon: Megaphone, path: "/admin/notices" },
  { label: "문의 답변", icon: MessageSquare, path: "/admin/inquiries" },
];

export function AdminLayout() {
  const SIDEBAR_SCROLL_KEY = "gondolbom-admin-sidebar-scroll";
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [isLarge, setIsLarge] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(NAV_GROUPS.map((g) => g.label))
  );
  const location = useLocation();
  const desktopNavRef = useRef<HTMLElement | null>(null);
  const mobileNavRef = useRef<HTMLElement | null>(null);
  const sidebarScrollTopRef = useRef(0);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SIDEBAR_SCROLL_KEY);
      if (!saved) return;
      const parsed = Number(saved);
      if (!Number.isNaN(parsed) && parsed >= 0) {
        sidebarScrollTopRef.current = parsed;
      }
    } catch {
      // ignore sessionStorage access issues
    }
  }, []);

  const persistSidebarScroll = (nextTop: number) => {
    sidebarScrollTopRef.current = nextTop;
    try {
      sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(nextTop));
    } catch {
      // ignore sessionStorage access issues
    }
  };

  const restoreSidebarScroll = () => {
    const top = sidebarScrollTopRef.current;
    if (desktopNavRef.current) desktopNavRef.current.scrollTop = top;
    if (mobileNavRef.current) mobileNavRef.current.scrollTop = top;
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(restoreSidebarScroll);
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, mobileOpen]);

  const toggleLarge = () => setIsLarge(!isLarge);
  const toggleGroup = (label: string) => {
    const next = new Set(expandedGroups);
    if (next.has(label)) next.delete(label);
    else next.add(label);
    setExpandedGroups(next);
  };

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const currentTitle = () => {
    for (const g of NAV_GROUPS) {
      for (const item of g.items) {
        if (isActive(item.path)) return item.label;
      }
    }
    return "관리자";
  };

  const txtSize = isLarge ? "text-[15px]" : "text-sm";
  const btnSize = isLarge ? "min-h-[48px]" : "";

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={`flex flex-col bg-white border-r border-gray-100 h-full transition-all duration-300 ${
        mobile ? "w-72" : collapsed ? "w-[68px]" : "w-64"
      }`}
    >
      {/* Logo area */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 shrink-0">
        {(!collapsed || mobile) && (
          <Link to="/admin" className="flex items-center gap-2">
            <img src={logoImg} alt="G온돌봄" className="w-7 h-7 object-contain" />
            <div>
              <span className="text-sm text-[#1F6B78]" style={{ fontWeight: 700 }}>G온돌봄</span>
              <span className="text-[11px] text-gray-400 ml-1">Admin</span>
            </div>
          </Link>
        )}
        {collapsed && !mobile && (
          <img src={logoImg} alt="G온돌봄" className="w-7 h-7 object-contain mx-auto" />
        )}
        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 cursor-pointer"
          >
            <ChevronLeft size={16} className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav
        ref={(el) => {
          if (mobile) {
            mobileNavRef.current = el;
          } else {
            desktopNavRef.current = el;
          }
        }}
        onScroll={(e) => persistSidebarScroll(e.currentTarget.scrollTop)}
        className="flex-1 py-2 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#CBD5E1_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"
      >
        {NAV_GROUPS.map((group) => {
          const expanded = expandedGroups.has(group.label);
          return (
            <div key={group.label} className="mb-1">
              {(!collapsed || mobile) && (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-4 py-2 text-[10px] text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-600"
                  style={{ fontWeight: 600 }}
                >
                  {group.label}
                  <ChevronDown size={12} className={`transition-transform ${expanded ? "" : "-rotate-90"}`} />
                </button>
              )}
              {(collapsed && !mobile) || expanded ? (
                <div className={`${collapsed && !mobile ? "px-1.5" : "px-2"} space-y-0.5`}>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => mobile && setMobileOpen(false)}
                        className={`flex items-center gap-2.5 rounded-lg transition-colors ${
                          collapsed && !mobile ? "p-2 justify-center" : "px-3 py-2"
                        } ${
                          active
                            ? "bg-[#1F6B78]/10 text-[#1F6B78]"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        }`}
                        style={{ fontWeight: active ? 600 : 400 }}
                        title={collapsed && !mobile ? item.label : undefined}
                      >
                        <Icon size={18} className="shrink-0" />
                        {(!collapsed || mobile) && (
                          <>
                            <span className={`text-[13px] flex-1 ${isLarge ? "text-[15px]" : ""}`}>{item.label}</span>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 rounded-full bg-[#1F6B78] text-white text-[10px]" style={{ fontWeight: 700 }}>
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                        {collapsed && !mobile && item.badge && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#1F6B78]" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="h-2 border-t border-gray-100 shrink-0" />
    </aside>
  );

  return (
    <LargeModeContext.Provider value={{ isLarge, toggleLarge }}>
      <div className={`h-screen flex bg-[#F8F9FA] ${isLarge ? "text-[16px]" : "text-sm"}`}>
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
            <div className="relative z-10">
              <Sidebar mobile />
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-50 text-gray-500 cursor-pointer"
              >
                <Menu size={20} />
              </button>
              <h2 className="text-sm md:text-base text-[#111827] hidden sm:block" style={{ fontWeight: 600 }}>
                {currentTitle()}
              </h2>
            </div>

            {/* Center: Global Search */}
            <div className="hidden md:block flex-1 max-w-md mx-auto px-8">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="조합원, 서비스, 문의 검색..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleLarge}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isLarge
                    ? "border-[#1F6B78]/30 bg-[#1F6B78]/10 text-[#1F6B78]"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
                style={{ fontWeight: 500 }}
                title={isLarge ? "큰 글자 모드 켜짐" : "큰 글자 모드"}
              >
                <Eye size={16} />
                <span className="hidden lg:inline text-xs">{isLarge ? "큰 글자 켜짐" : "큰 글자"}</span>
              </button>

              <Link
                to="/"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                style={{ fontWeight: 500 }}
                title="홈으로 돌아가기"
              >
                <LogOut size={16} />
                <span className="hidden lg:inline text-xs">홈</span>
              </Link>

              {/* Quick actions */}
              <div className="relative">
                <button
                  onClick={() => { setQuickOpen(!quickOpen); setNotiOpen(false); }}
                  className="p-2 rounded-lg hover:bg-gray-50 text-gray-500 cursor-pointer"
                  title="빠른 작업"
                >
                  <Plus size={20} />
                </button>
                {quickOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setQuickOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2">
                      {QUICK_ACTIONS.map((a) => (
                        <Link
                          key={a.label}
                          to={a.path}
                          onClick={() => setQuickOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
                        >
                          <a.icon size={16} className="text-[#1F6B78]" />
                          {a.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => { setNotiOpen(!notiOpen); setQuickOpen(false); }}
                  className="relative p-2 rounded-lg hover:bg-gray-50 text-gray-500 cursor-pointer"
                >
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1F6B78] rounded-full" />
                </button>
                {notiOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotiOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <span className="text-sm text-[#111827]" style={{ fontWeight: 700 }}>알림</span>
                      </div>
                      <div className="py-2 max-h-64 overflow-y-auto">
                        {[
                          { text: "가입 승인 대기 3건", time: "방금", type: "가입" },
                          { text: "입금 미매칭 2건 발견", time: "10분 전", type: "입금" },
                          { text: "새 문의 5건 접수", time: "30분 전", type: "문의" },
                          { text: "오늘 서비스 일정 4건", time: "1시간 전", type: "서비스" },
                        ].map((n, i) => (
                          <div key={i} className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#1F6B78] mt-1.5 shrink-0" />
                            <div>
                              <p className="text-sm text-[#374151]">{n.text}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Profile */}
              <div className="w-8 h-8 rounded-full bg-[#1F6B78] flex items-center justify-center text-white text-xs cursor-pointer" style={{ fontWeight: 600 }}>
                관
              </div>
            </div>
          </header>

          {/* Content */}
          <main className={`flex-1 overflow-y-auto p-4 lg:p-6 ${isLarge ? "text-[16px]" : ""}`}>
            <Outlet />
          </main>
        </div>
      </div>
    </LargeModeContext.Provider>
  );
}
