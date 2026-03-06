import { useMemo, useState, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  UserRound,
  CalendarDays,
  Mail,
  Phone,
  LockKeyhole,
  MapPinned,
} from "lucide-react";
import { useAuth } from "../components/AuthContext";
import { IMG } from "../components/image-data";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [signupForm, setSignupForm] = useState({
    name: "",
    birth: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    address: "",
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, signup } = useAuth();
  const redirectTo = searchParams.get("redirect") || "/mypage";

  const leftPanelImage = isLogin ? IMG.communityHero : IMG.catPrevention;
  const leftPanelImageLabel = isLogin
    ? "건강하고 행복한 공동체 활동 이미지"
    : "건강한 예방 활동 이미지";

  const passwordStrength = useMemo(() => {
    const pw = signupForm.password;
    if (!pw) return { label: "미입력", color: "bg-gray-200", score: 0 };
    if (pw.length < 8) return { label: "약함", color: "bg-rose-400", score: 1 };
    if (pw.length < 12) return { label: "보통", color: "bg-amber-400", score: 2 };
    return { label: "강함", color: "bg-emerald-500", score: 3 };
  }, [signupForm.password]);

  const resetErrors = () => setErrors({});

  const validateLogin = () => {
    const nextErrors: Record<string, string> = {};
    if (!loginEmail.trim()) nextErrors.loginEmail = "이메일을 입력해 주세요.";
    if (!loginPassword.trim()) nextErrors.loginPassword = "비밀번호를 입력해 주세요.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateSignup = () => {
    const nextErrors: Record<string, string> = {};
    if (!signupForm.name.trim()) nextErrors.name = "이름을 입력해 주세요.";
    if (!signupForm.birth.trim()) nextErrors.birth = "생년월일을 입력해 주세요.";
    if (!signupForm.email.trim()) nextErrors.email = "이메일을 입력해 주세요.";
    if (!signupForm.phone.trim()) nextErrors.phone = "연락처를 입력해 주세요.";
    if (!signupForm.password.trim()) nextErrors.password = "비밀번호를 입력해 주세요.";
    if (!signupForm.passwordConfirm.trim()) nextErrors.passwordConfirm = "비밀번호 확인을 입력해 주세요.";
    if (!signupForm.address.trim()) nextErrors.address = "주소를 입력해 주세요.";

    if (signupForm.email && !signupForm.email.includes("@")) {
      nextErrors.email = "올바른 이메일 형식을 입력해 주세요.";
    }
    if (signupForm.birth && !/^\d{4}-\d{2}-\d{2}$/.test(signupForm.birth)) {
      nextErrors.birth = "예) 1962-03-01 형식으로 입력해 주세요.";
    }
    if (signupForm.password && signupForm.password.length < 8) {
      nextErrors.password = "비밀번호는 8자 이상 입력해 주세요.";
    }
    if (
      signupForm.password &&
      signupForm.passwordConfirm &&
      signupForm.password !== signupForm.passwordConfirm
    ) {
      nextErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    if (isLogin) {
      if (!validateLogin()) return;
      const ok = login();
      if (!ok) {
        setErrors({ auth: "회원가입 이력이 없습니다. 먼저 회원가입을 진행해 주세요." });
        setIsLogin(false);
        return;
      }
      navigate(redirectTo);
      return;
    }

    if (!validateSignup()) return;

    signup(signupForm.name.trim());
    alert("회원가입이 완료되었습니다. 로그인 상태로 이동합니다.");
    navigate(redirectTo);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#EAF3F1] via-[#F8F9FC] to-[#EEF6FF]">
      <div className="pointer-events-none absolute -top-28 -left-20 h-72 w-72 rounded-full bg-[#67B89A]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-10 h-80 w-80 rounded-full bg-[#1F6B78]/15 blur-3xl" />

      <div className="relative grid min-h-screen w-full lg:grid-cols-2">
        <aside className="relative hidden overflow-hidden lg:block">
          <ImageWithFallback
            src={leftPanelImage}
            alt={leftPanelImageLabel}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F3E47]/88 via-[#0F3E47]/74 to-[#0F3E47]/92" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_45%)]" />

          <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs backdrop-blur-sm">
                <Sparkles size={14} />
                G온돌봄 멤버 포털
              </div>
              <h2 className="text-3xl leading-tight" style={{ fontWeight: 800 }}>
                지역 건강 돌봄을
                <br />
                더 쉽게 연결합니다
              </h2>
              <p className="mt-4 text-sm text-white/90 leading-relaxed">
                로그인 후 서비스 신청 현황 확인, 조합원 전용 안내, 맞춤 상담 연결을 한 곳에서 이용하세요.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-3">
                {[
                  "서비스 신청 진행 상태 실시간 확인",
                  "조합원 전용 소식과 안내 우선 제공",
                  "개인정보 보호 기준 적용",
                ].map((line) => (
                  <div key={line} className="flex items-center gap-2.5 text-sm text-white/95">
                    <ShieldCheck size={16} className="text-[#B9F1DF]" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="flex min-h-screen items-center justify-center p-6 sm:p-8 md:p-10">
          <div className="w-full max-w-xl rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-8">
            <div className="mb-4 lg:hidden">
              <div className="relative overflow-hidden rounded-2xl border border-[#D5E3E0]">
                <ImageWithFallback src={leftPanelImage} alt={leftPanelImageLabel} className="h-36 w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F3E47]/70 to-[#0F3E47]/30" />
                <p className="absolute left-4 top-4 text-sm text-white" style={{ fontWeight: 700 }}>
                  건강한 일상을 위한<br />조합원 전용 공간
                </p>
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <div className="inline-flex rounded-xl bg-[#F1F5F9] p-1">
                <button
                  onClick={() => {
                    setIsLogin(true);
                    resetErrors();
                  }}
                  className={`rounded-lg px-4 py-2 text-sm transition-colors cursor-pointer ${
                    isLogin ? "bg-white text-[#0F3E47] shadow-sm" : "text-[#64748B]"
                  }`}
                  style={{ fontWeight: 700 }}
                >
                  로그인
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    resetErrors();
                  }}
                  className={`rounded-lg px-4 py-2 text-sm transition-colors cursor-pointer ${
                    !isLogin ? "bg-white text-[#0F3E47] shadow-sm" : "text-[#64748B]"
                  }`}
                  style={{ fontWeight: 700 }}
                  >
                    회원가입
                  </button>
                </div>
                <h1 className="mt-4 text-2xl text-[#0F172A]" style={{ fontWeight: 800 }}>
                {isLogin ? "조합원 계정 로그인" : "회원가입"}
              </h1>
              <p className="mt-1 text-sm text-[#64748B]">
                {isLogin
                  ? "등록된 계정으로 로그인해 서비스를 신청하세요."
                  : "필수 정보 입력 후 계정을 만들고 서비스를 이용하세요."}
              </p>
                {searchParams.get("redirect") && (
                  <p
                    className="mt-3 inline-flex items-center rounded-full bg-[#EFF6F4] px-3 py-1 text-xs text-[#1F6B78]"
                    style={{ fontWeight: 600 }}
                  >
                    로그인 후 요청하신 페이지로 자동 이동합니다.
                  </p>
                )}

                {!isLogin && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#475569]">
                    <span className="rounded bg-white px-2 py-0.5" style={{ fontWeight: 700 }}>1</span>
                    정보 입력
                    <ChevronRight size={14} />
                    <span className="rounded bg-white px-2 py-0.5" style={{ fontWeight: 700 }}>2</span>
                    계정 생성
                    <ChevronRight size={14} />
                    <span className="rounded bg-white px-2 py-0.5" style={{ fontWeight: 700 }}>3</span>
                    서비스 이용 시작
                  </div>
                )}
              </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isLogin ? (
                <>
                  <Field label="이메일" icon={<Mail size={16} />} error={errors.loginEmail}>
                    <input
                      type="email"
                      placeholder="example@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className={`w-full rounded-xl border bg-[#FAFCFF] px-11 py-3 text-sm outline-none transition-colors ${
                        errors.loginEmail
                          ? "border-rose-300 focus:ring-2 focus:ring-rose-200"
                          : "border-[#D7E1E8] focus:border-[#1F6B78] focus:ring-2 focus:ring-[#1F6B78]/20"
                      }`}
                    />
                  </Field>

                  <Field label="비밀번호" icon={<LockKeyhole size={16} />} error={errors.loginPassword}>
                    <input
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className={`w-full rounded-xl border bg-[#FAFCFF] px-11 py-3 pr-11 text-sm outline-none transition-colors ${
                        errors.loginPassword
                          ? "border-rose-300 focus:ring-2 focus:ring-rose-200"
                          : "border-[#D7E1E8] focus:border-[#1F6B78] focus:ring-2 focus:ring-[#1F6B78]/20"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#334155] cursor-pointer"
                    >
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </Field>

                  {errors.auth && (
                    <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                      {errors.auth}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <label className="inline-flex items-center gap-2 text-[#64748B] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="accent-[#1F6B78]"
                      />
                      로그인 유지
                    </label>
                    <button type="button" className="text-[#1F6B78] hover:underline cursor-pointer" style={{ fontWeight: 600 }}>
                      비밀번호 찾기
                    </button>
                  </div>
                </>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="이름" icon={<UserRound size={16} />} error={errors.name}>
                    <input
                      type="text"
                      placeholder="홍길동"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm((prev) => ({ ...prev, name: e.target.value }))}
                      className={`w-full rounded-xl border bg-[#FAFCFF] px-11 py-3 text-sm outline-none transition-colors ${
                        errors.name
                          ? "border-rose-300 focus:ring-2 focus:ring-rose-200"
                          : "border-[#D7E1E8] focus:border-[#1F6B78] focus:ring-2 focus:ring-[#1F6B78]/20"
                      }`}
                    />
                  </Field>

                  <Field label="생년월일" icon={<CalendarDays size={16} />} error={errors.birth}>
                    <input
                      type="text"
                      placeholder="예) 1962-03-01"
                      value={signupForm.birth}
                      onChange={(e) => setSignupForm((prev) => ({ ...prev, birth: e.target.value }))}
                      className={`w-full rounded-xl border bg-[#FAFCFF] px-11 py-3 text-sm outline-none transition-colors ${
                        errors.birth
                          ? "border-rose-300 focus:ring-2 focus:ring-rose-200"
                          : "border-[#D7E1E8] focus:border-[#1F6B78] focus:ring-2 focus:ring-[#1F6B78]/20"
                      }`}
                    />
                  </Field>

                  <Field label="이메일" icon={<Mail size={16} />} error={errors.email}>
                    <input
                      type="email"
                      placeholder="example@email.com"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm((prev) => ({ ...prev, email: e.target.value }))}
                      className={`w-full rounded-xl border bg-[#FAFCFF] px-11 py-3 text-sm outline-none transition-colors ${
                        errors.email
                          ? "border-rose-300 focus:ring-2 focus:ring-rose-200"
                          : "border-[#D7E1E8] focus:border-[#1F6B78] focus:ring-2 focus:ring-[#1F6B78]/20"
                      }`}
                    />
                  </Field>

                  <Field label="연락처" icon={<Phone size={16} />} error={errors.phone}>
                    <input
                      type="tel"
                      placeholder="예) 010-1234-5678"
                      value={signupForm.phone}
                      onChange={(e) => setSignupForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className={`w-full rounded-xl border bg-[#FAFCFF] px-11 py-3 text-sm outline-none transition-colors ${
                        errors.phone
                          ? "border-rose-300 focus:ring-2 focus:ring-rose-200"
                          : "border-[#D7E1E8] focus:border-[#1F6B78] focus:ring-2 focus:ring-[#1F6B78]/20"
                      }`}
                    />
                  </Field>

                  <div className="md:col-span-2">
                    <Field label="주소" icon={<MapPinned size={16} />} error={errors.address}>
                      <input
                        type="text"
                        placeholder="예) 강원특별자치도 횡성군 ..."
                        value={signupForm.address}
                        onChange={(e) => setSignupForm((prev) => ({ ...prev, address: e.target.value }))}
                        className={`w-full rounded-xl border bg-[#FAFCFF] px-11 py-3 text-sm outline-none transition-colors ${
                          errors.address
                            ? "border-rose-300 focus:ring-2 focus:ring-rose-200"
                            : "border-[#D7E1E8] focus:border-[#1F6B78] focus:ring-2 focus:ring-[#1F6B78]/20"
                        }`}
                      />
                    </Field>
                  </div>

                  <Field label="비밀번호" icon={<LockKeyhole size={16} />} error={errors.password}>
                    <input
                      type={showPw ? "text" : "password"}
                      placeholder="8자 이상 입력"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm((prev) => ({ ...prev, password: e.target.value }))}
                      className={`w-full rounded-xl border bg-[#FAFCFF] px-11 py-3 pr-11 text-sm outline-none transition-colors ${
                        errors.password
                          ? "border-rose-300 focus:ring-2 focus:ring-rose-200"
                          : "border-[#D7E1E8] focus:border-[#1F6B78] focus:ring-2 focus:ring-[#1F6B78]/20"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#334155] cursor-pointer"
                    >
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </Field>

                  <Field label="비밀번호 확인" icon={<LockKeyhole size={16} />} error={errors.passwordConfirm}>
                    <input
                      type={showPwConfirm ? "text" : "password"}
                      placeholder="비밀번호를 다시 입력"
                      value={signupForm.passwordConfirm}
                      onChange={(e) => setSignupForm((prev) => ({ ...prev, passwordConfirm: e.target.value }))}
                      className={`w-full rounded-xl border bg-[#FAFCFF] px-11 py-3 pr-11 text-sm outline-none transition-colors ${
                        errors.passwordConfirm
                          ? "border-rose-300 focus:ring-2 focus:ring-rose-200"
                          : "border-[#D7E1E8] focus:border-[#1F6B78] focus:ring-2 focus:ring-[#1F6B78]/20"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwConfirm(!showPwConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#334155] cursor-pointer"
                    >
                      {showPwConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </Field>

                  <div className="md:col-span-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-xs text-[#475569]" style={{ fontWeight: 600 }}>비밀번호 강도</p>
                      <p className="text-xs text-[#0F172A]" style={{ fontWeight: 700 }}>{passwordStrength.label}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[1, 2, 3].map((idx) => (
                        <div
                          key={idx}
                          className={`h-1.5 rounded-full ${idx <= passwordStrength.score ? passwordStrength.color : "bg-gray-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-[#1F6B78] px-6 py-3.5 text-white transition-colors hover:bg-[#185A65] cursor-pointer"
                style={{ fontWeight: 700 }}
              >
                {isLogin ? "로그인" : "회원가입 완료"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-[#64748B]">
              {isLogin ? "아직 계정이 없으신가요?" : "이미 계정이 있으신가요?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  resetErrors();
                }}
                className="ml-1 text-[#1F6B78] hover:underline cursor-pointer"
                style={{ fontWeight: 700 }}
              >
                {isLogin ? "회원가입" : "로그인"}
              </button>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon: ReactNode;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-[#0F172A]" style={{ fontWeight: 700 }}>
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
          {icon}
        </span>
        {children}
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
