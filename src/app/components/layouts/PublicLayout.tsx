import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { Menu, X, Phone, Mail, MapPin, Eye, PhoneCall, MessageCircle, PenLine, Shield, LogIn, LogOut as LogOutIcon, User, Info, Headphones } from "lucide-react";
import { useSeniorMode } from "../SeniorModeContext";
import { useAuth } from "../AuthContext";
import { ScrollToTop } from "../ScrollToTop";
import logoImg from "figma:asset/f4694bdbad3c9ccbf0dc80f21c4e4f77783ad26f.png";

const GOnDolBomLogo = ({ className = "w-9 h-9", light = false }: { className?: string; light?: boolean }) => (
  <svg viewBox="0 0 124 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M73.1501 0.0523872C85.324 -0.62355 107.618 5.17981 106.225 21.058C105.898 24.8277 104.072 28.3089 101.156 30.7199C93.7144 36.9018 78.2328 36.3929 76.5912 24.3822C75.8844 19.2107 80.4155 16.6696 83.1558 13.5571C86.7943 9.42434 77.1305 7.90442 74.6274 8.35348C49.6993 9.82817 27.5919 33.5659 28.3906 58.6567C28.8579 73.3354 39.1573 83.4226 53.9326 82.5878C63.6936 82.0436 70.7105 78.1975 77.3056 71.0626C80.0173 67.4532 80.4844 66.0278 82.6023 62.1908C82.2643 64.91 82.355 67.7858 81.934 70.4425C77.7819 96.6383 47.2641 116.178 22.0245 106.384C8.25029 101.039 0.834201 87.7103 0.0769349 73.4804C-0.847206 56.1137 6.63733 39.565 18.0497 26.7918C32.1092 10.8786 51.9497 1.25051 73.1501 0.0523872Z" fill={light ? "#8B9FD4" : "#1D2A6A"}/>
    <path d="M86.6869 42.2305C104.543 48.189 108.469 66.7712 103.066 83.2157C98.6394 96.6894 88.0578 107.699 75.4198 113.913C61.6151 120.658 45.7149 121.716 31.1377 116.861C23.2168 114.145 16.7588 109.883 11.2222 103.664C9.91741 102.199 8.46053 100.718 7.44077 99.0435C10.0496 101.059 12.0643 103.597 14.7816 105.552C18.7775 108.426 23.3227 110.457 28.1473 111.473C52.6252 116.631 78.0265 101.891 90.9938 81.5401C97.7138 70.9939 101.882 54.5919 90.4622 45.5964C89.1411 44.5574 87.2834 43.5925 85.6524 43.1713L86.6869 42.2305Z" fill={light ? "#5EC4B0" : "#219779"}/>
    <path d="M103.279 41.2888C106.865 40.7584 112.552 41.9277 115.413 44.0814C129.884 54.973 122.99 78.7576 114.684 90.827C104.052 106.275 88.8797 115.56 71.0211 119.085C68.1919 119.738 65.6136 120.037 62.7324 119.752C76.734 116.466 88.2347 110.777 97.3308 99.0768C107.58 85.8941 112 66.0582 102.778 51.1689C100.636 47.7104 98.2407 45.74 95.0288 43.2728C97.3423 42.4656 100.882 41.5783 103.279 41.2888Z" fill={light ? "#FCDB6A" : "#F8C21A"}/>
    <path d="M76.054 51.9667C78.6251 51.9111 78.8836 52.0738 80.9004 53.5293C82.5223 57.0807 81.9387 58.5592 78.5295 60.4236C76.6215 60.659 74.5208 60.0575 73.4637 58.345C72.9132 57.4616 72.748 56.3915 73.0065 55.3832C73.4431 53.6333 74.6192 52.8362 76.054 51.9667Z" fill={light ? "#FCDB6A" : "#F9BD17"}/>
    <path d="M71.194 43.4399C66.7557 44.4939 61.1569 48.9386 58.9018 52.8789C56.5166 57.0461 56.1746 62.4721 60.983 65.0256C65.694 67.5273 70.3135 66.291 74.9049 64.2967C75.9725 63.8268 76.6847 63.0184 77.7851 62.6952L77.8979 62.9402C74.6799 66.4305 66.399 68.5614 61.9079 66.7059C56.3865 64.4249 54.852 59.1939 57.121 53.9476C59.6975 47.9905 64.7548 45.0161 70.4771 42.6695L71.194 43.4399Z" fill={light ? "#B0BDE0" : "#1D2A6A"}/>
    <path d="M70.4771 42.6695C76.0463 40.7434 81.0851 40.806 86.6869 42.2305L85.6524 43.1713C81.248 41.541 75.6214 42.4131 71.194 43.4399L70.4771 42.6695Z" fill={light ? "#6AB8D4" : "#046B96"}/>
  </svg>
);

/* ─── 치환 변수 ─── */
const V = {
  조합명: "횡성의료사회적협동조합",
  조합명_짧게: "G온돌봄",
  대표전화: "추후 개통예정",
  카카오채널: "추후개설예정",
  주소: "추후 게시예정",
  운영시간: "추후 게시예정",
  이메일: "추후 게시정",
};

const NAV = [
  { label: "조합 소개", path: "/about" },
  { label: "서비스", path: "/services" },
  { label: "조합원 가입", path: "/join" },
  { label: "소식/커뮤니티", path: "/community" },
  { label: "문의/오시는 길", path: "/inquiries" },
];

export function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const hasFullHero = ["/", "/about", "/join", "/services", "/community", "/notices", "/inquiries"].includes(location.pathname);
  const { isSenior, toggleSenior } = useSeniorMode();
  const [open, setOpen] = useState(false);
  const { isLoggedIn, userName, login, logout } = useAuth();

  const txtBase = isSenior ? "text-[18px]" : "text-sm";
  const btnH = isSenior ? "min-h-[56px]" : "";

  return (
    <div className={`min-h-screen flex flex-col ${isSenior ? "text-[20px] leading-[1.7]" : "text-base leading-[1.6]"}`}>
      <ScrollToTop />
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isHome ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-white shadow-sm"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center gap-2 mr-auto">
              <img src={logoImg} alt="G온돌봄" className="w-8 h-8 object-contain" />
              <span className="text-xl md:text-2xl tracking-tight" style={{ letterSpacing: "-0.01em" }}><span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1D2A6A] via-[#219779] to-[#F8C21A]" style={{ fontFamily: "'Jua', sans-serif", fontWeight: 400 }}>온돌봄</span></span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {NAV.map((n) => (
                <Link
                  key={n.path}
                  to={n.path}
                  className={`px-4 py-2 rounded-lg ${txtBase} transition-colors ${
                    location.pathname === n.path
                      ? "bg-[#1F6B78]/10 text-[#1F6B78]"
                      : "text-[#374151] hover:text-[#111827] hover:bg-gray-50"
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              {/* Senior mode toggle */}
              <button
                onClick={toggleSenior}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                  isSenior
                    ? "bg-[#67B89A] text-white"
                    : "bg-gray-100 text-[#374151] hover:bg-gray-200"
                }`}
                style={{ fontWeight: 500 }}
              >
                <Eye size={14} />
                {isSenior ? "어르신 모드 켜짐(쉬운 설명)" : "어르신 모드(글자 크게)"}
              </button>

              {/* Primary CTA: Admin + Auth */}
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full ${txtBase} transition-colors bg-gray-100 text-[#374151] hover:bg-gray-200`}
                style={{ fontWeight: 500 }}
              >
                <Shield size={14} />
                관리자
              </Link>

              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <span className={`${txtBase} text-[#374151]`} style={{ fontWeight: 500 }}>
                    <User size={14} className="inline mr-1" />
                    {userName}님 환영합니다
                  </span>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs cursor-pointer transition-colors bg-gray-100 text-[#374151] hover:bg-gray-200"
                    style={{ fontWeight: 500 }}
                  >
                    <LogOutIcon size={12} />
                    로그아웃
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => login("관리자")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full ${txtBase} bg-[#1F6B78] text-white hover:bg-[#185A65] transition-colors cursor-pointer ${btnH}`}
                  style={{ fontWeight: 600 }}
                >
                  <LogIn size={14} />
                  로그인
                </button>
              )}
            </div>

            {/* Mobile: senior toggle + menu */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={toggleSenior}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs cursor-pointer ${
                  isSenior
                    ? "bg-[#67B89A] text-white"
                    : "bg-gray-100 text-[#374151]"
                }`}
              >
                <Eye size={12} />
                {isSenior ? "쉬운 설명" : "글자 크게"}
              </button>
              <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-lg cursor-pointer text-[#111827]"
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {open && (
          <div className="lg:hidden border-t bg-white border-gray-100">
            <div className="px-4 py-4 space-y-1">
              {NAV.map((n) => (
                <Link
                  key={n.path}
                  to={n.path}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-lg ${txtBase} ${
                    location.pathname === n.path
                      ? "bg-[#1F6B78]/10 text-[#1F6B78]"
                      : "text-[#374151]"
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  {n.label}
                </Link>
              ))}
              <div className="pt-3 space-y-2">
                {/* Auth row */}
                {isLoggedIn ? (
                  <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50">
                    <span className={`${txtBase} text-[#374151]`} style={{ fontWeight: 500 }}>
                      {userName}님 환영합니다
                    </span>
                    <button
                      onClick={() => { logout(); setOpen(false); }}
                      className="text-xs cursor-pointer text-gray-400"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { login("관리자"); setOpen(false); }}
                    className={`w-full text-center px-4 py-3 rounded-lg ${txtBase} bg-[#1F6B78] text-white cursor-pointer`}
                    style={{ fontWeight: 600 }}
                  >
                    로그인
                  </button>
                )}
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg ${txtBase} border border-gray-200 text-[#374151]`}
                  style={{ fontWeight: 500 }}
                >
                  <Shield size={14} />
                  관리자 페이지
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main className={`${isHome ? "" : "pt-16 md:pt-20"} pb-16 md:pb-0`}>
        <Outlet />
      </main>

      {/* ── Mobile Bottom Navigation Bar ── */}
      <MobileBottomNav />

      {/* Footer (desktop only) */}
      <footer className="hidden md:block bg-[#0B1E2D] text-white/80 mt-auto">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img src={logoImg} alt="G온돌봄" className="w-8 h-8 object-contain" />
                <span className="text-white text-lg" style={{ fontWeight: 700 }}>
                  {V.조합명}
                </span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                주민이 주인이 되어 만드는
                <br />
                비영리 의료·돌봄 공동체
              </p>
            </div>
            <div>
              <h4 className="text-white mb-4" style={{ fontWeight: 600 }}>연락처</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[#67B89A]" />
                  <span>{V.대표전화}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-[#67B89A]" />
                  <span>{V.이메일}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-[#67B89A] mt-0.5" />
                  <span>{V.주소}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white mb-4" style={{ fontWeight: 600 }}>바로가기</h4>
              <div className="space-y-2 text-sm">
                {NAV.map((n) => (
                  <Link key={n.path} to={n.path} className="block hover:text-[#67B89A] transition-colors">
                    {n.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white mb-4" style={{ fontWeight: 600 }}>운영시간</h4>
              <div className="space-y-2 text-sm">
                <p>{V.운영시간}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <span>&copy; 2026 {V.조합명}. All rights reserved.</span>
            <div className="flex gap-4">
              <span className="hover:text-white/60 cursor-pointer">개인정보처리방침</span>
              <span className="hover:text-white/60 cursor-pointer">이용약관</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Mobile Bottom Nav Component ─── */
function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSenior } = useSeniorMode();

  const V_대표전화 = "추후 개통예정";

  const items = [
    { icon: Info, label: "소개", path: "/about" },
    { icon: PenLine, label: "가입", path: "/join" },
    { icon: PhoneCall, label: "전화", path: null, action: () => alert(`대표전화: ${V_대표전화}`) },
    { icon: MessageCircle, label: "문의", path: "/inquiries" },
    { icon: Headphones, label: "서비스", path: "/services" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E7EB] shadow-[0_-2px_10px_rgba(0,0,0,0.06)] md:hidden">
      <div className="grid grid-cols-5 h-14">
        {items.map((item) => {
          const isActive = item.path ? location.pathname === item.path : false;
          const isPhone = !item.path;
          const Icon = item.icon;

          if (isPhone) {
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="flex flex-col items-center justify-center gap-0.5 cursor-pointer relative"
              >
                <div className="w-10 h-10 rounded-full bg-[#1F6B78] flex items-center justify-center -mt-4 shadow-md border-2 border-white">
                  <Icon size={20} className="text-white" />
                </div>
                <span
                  className={`text-[#1F6B78] ${isSenior ? "text-[11px]" : "text-[10px]"}`}
                  style={{ fontWeight: 600 }}
                >
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
                isActive ? "text-[#1F6B78]" : "text-[#9CA3AF]"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span
                className={`${isSenior ? "text-[11px]" : "text-[10px]"}`}
                style={{ fontWeight: isActive ? 700 : 500 }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for iPhone notch */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}