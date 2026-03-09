import { useState } from "react";
import { Link } from "react-router";
import { CheckCircle2, Send, Phone, Mail, MapPin, Clock, PhoneCall, ChevronRight, MessageCircle } from "lucide-react";
import { useSeniorMode } from "../components/SeniorModeContext";
import { V, C } from "../components/shared";

export function InquiriesPage() {
  const { isSenior } = useSeniorMode();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", category: "서비스", content: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(1);
  };

  return (
    <div className="contents">
      {/* Hero */}
      <section className="bg-[#1F4B43] py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-white/40 mb-5">
            <Link to="/" className="hover:text-white/70">홈</Link>
            <ChevronRight size={14} />
            <span className="text-white/70">문의하기</span>
          </div>
          <h1 className="text-white text-[28px] md:text-[36px] mb-3" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}>
            문의하기
          </h1>
          <p className="text-white/50">궁금한 점이 있으시면 편하게 문의해 주세요.</p>
        </div>
      </section>

      {/* Quick contact strip */}
      <section className="bg-white border-b border-[#E5E5E5]">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E5E5E5]">
            {[
              { icon: PhoneCall, label: "전화 문의", value: V.대표전화, color: "#1F4B43" },
              { icon: MessageCircle, label: "카카오 채널", value: V.카카오채널, color: "#C87C5A" },
              { icon: Clock, label: "운영 시간", value: V.운영시간, color: "#6E958B" },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-4 px-6 py-5">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${c.color}0D` }}>
                  <c.icon size={20} style={{ color: c.color }} />
                </div>
                <div>
                  <p className="text-xs text-[#999]" style={{ fontWeight: 500 }}>{c.label}</p>
                  <p className="text-sm text-[#333]" style={{ fontWeight: 600 }}>{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-[#F9F8F5]">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-[#1F2623] text-lg mb-4" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}>
                연락처 안내
              </h2>
              {[
                { icon: PhoneCall, label: "대표전화", value: V.대표전화, color: "#1F4B43" },
                { icon: MessageCircle, label: "카카오 채널", value: V.카카오채널, color: "#C87C5A" },
                { icon: Mail, label: "이메일", value: V.이메일, color: "#6E958B" },
                { icon: MapPin, label: "주소", value: V.주소, color: "#5B8F8B" },
                { icon: Clock, label: "운영시간", value: V.운영시간, color: "#7A8584" },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#E5E5E5]">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${c.color}0D` }}>
                    <c.icon size={18} style={{ color: c.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-[#999]" style={{ fontWeight: 500 }}>{c.label}</p>
                    <p className="text-sm text-[#333]" style={{ fontWeight: 500 }}>{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {step === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-8 shadow-sm">
                  <h2 className="text-[#1F2623] text-lg mb-6" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}>
                    온라인 문의
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-[#555] mb-1.5" style={{ fontWeight: 600 }}>이름</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-[#F9F8F5] border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#1F4B43] focus:ring-1 focus:ring-[#1F4B43]/20 transition-all"
                          placeholder="이름을 입력해주세요"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#555] mb-1.5" style={{ fontWeight: 600 }}>연락처</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-[#F9F8F5] border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#1F4B43] focus:ring-1 focus:ring-[#1F4B43]/20 transition-all"
                          placeholder="010-0000-0000"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-[#555] mb-1.5" style={{ fontWeight: 600 }}>문의 분류</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#F9F8F5] border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#1F4B43] focus:ring-1 focus:ring-[#1F4B43]/20 transition-all"
                      >
                        {["서비스", "조합원 가입", "자원봉사", "후원", "기타"].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-[#555] mb-1.5" style={{ fontWeight: 600 }}>문의 내용</label>
                      <textarea
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl bg-[#F9F8F5] border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#1F4B43] focus:ring-1 focus:ring-[#1F4B43]/20 transition-all resize-none"
                        placeholder="문의하실 내용을 자유롭게 적어주세요."
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-[#1F4B43] text-white hover:bg-[#2A6359] transition-colors text-sm cursor-pointer inline-flex items-center justify-center gap-2"
                      style={{ fontWeight: 600 }}
                    >
                      <Send size={14} />문의 보내기
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 md:p-12 text-center shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-[#1F4B43]/8 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} className="text-[#1F4B43]" />
                  </div>
                  <h2 className="text-[#1F2623] text-xl mb-3" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}>
                    문의가 접수되었습니다
                  </h2>
                  <p className="text-[#777] mb-6 leading-relaxed">
                    빠른 시일 내에 답변드리겠습니다.<br />
                    급한 문의는 전화를 이용해 주세요.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => { setStep(0); setForm({ name: "", phone: "", category: "서비스", content: "" }); }}
                      className="px-5 py-2.5 rounded-full bg-[#1F4B43] text-white text-sm hover:bg-[#2A6359] transition-colors cursor-pointer"
                      style={{ fontWeight: 600 }}
                    >
                      새 문의 작성
                    </button>
                    <Link to="/" className="px-5 py-2.5 rounded-full border border-[#E5E5E5] text-[#666] text-sm hover:bg-[#F9F8F5] transition-colors" style={{ fontWeight: 500 }}>
                      홈으로
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          <h2 className="text-[#1F2623] text-lg mb-6" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}>
            찾아오시는 길
          </h2>
          <div className="rounded-2xl overflow-hidden border border-[#E5E5E5] bg-[#F9F8F5] h-64 md:h-80 flex items-center justify-center">
            <div className="text-center">
              <MapPin size={32} className="text-[#BBB] mx-auto mb-3" />
              <p className="text-sm text-[#999]">지도 영역 (주소 확정 후 반영 예정)</p>
              <p className="text-sm text-[#555] mt-2" style={{ fontWeight: 500 }}>{V.주소}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
