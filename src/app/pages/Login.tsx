import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/mypage");
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-16 bg-[#F7F2E8]">
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#1F4B43]/10 flex items-center justify-center mx-auto mb-4 text-2xl">
            <span>&#x1F33F;</span>
          </div>
          <h1 className="text-2xl text-[#1F2623] mb-2" style={{ fontWeight: 700 }}>
            {isLogin ? "로그인" : "회원가입"}
          </h1>
          <p className="text-sm text-[#7A8584]">
            {isLogin ? "조합원 계정으로 로그인하세요" : "새 계정을 만들어 조합원이 되세요"}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#D6CCBC]/30">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm text-[#1F2623] mb-1.5" style={{ fontWeight: 600 }}>이름</label>
                <input
                  type="text"
                  placeholder="홍길동"
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F2E8] border border-[#D6CCBC]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4B43]/30 focus:border-[#1F4B43]"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm text-[#1F2623] mb-1.5" style={{ fontWeight: 600 }}>이메일</label>
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full px-4 py-3 rounded-xl bg-[#F7F2E8] border border-[#D6CCBC]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4B43]/30 focus:border-[#1F4B43]"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-[#1F2623] mb-1.5" style={{ fontWeight: 600 }}>비밀번호</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F2E8] border border-[#D6CCBC]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4B43]/30 focus:border-[#1F4B43]"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8584] cursor-pointer">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-[#7A8584] cursor-pointer">
                  <input type="checkbox" className="accent-[#1F4B43]" />
                  로그인 유지
                </label>
                <button type="button" className="text-[#1F4B43] hover:underline cursor-pointer" style={{ fontWeight: 500 }}>
                  비밀번호 찾기
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3.5 rounded-xl bg-[#1F4B43] text-white hover:bg-[#2A6359] transition-colors cursor-pointer"
              style={{ fontWeight: 600 }}
            >
              {isLogin ? "로그인" : "가입하기"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#7A8584]">
            {isLogin ? "아직 계정이 없으신가요?" : "이미 계정이 있으신가요?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-[#1F4B43] cursor-pointer hover:underline"
              style={{ fontWeight: 600 }}
            >
              {isLogin ? "회원가입" : "로그인"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}