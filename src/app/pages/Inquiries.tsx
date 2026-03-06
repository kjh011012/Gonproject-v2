import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, Send, Phone, MessageCircle, Mail, MapPin, Clock, PhoneCall } from "lucide-react";
import { useSeniorMode } from "../components/SeniorModeContext";

const V = {
  대표전화: "추후 개통예정",
  카카오채널: "추후개설예정",
  주소: "추후 게시예정",
  운영시간: "추후 게시예정",
};

export function InquiriesPage() {
  const { isSenior } = useSeniorMode();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", category: "서비스", content: "" });

  const sz = isSenior ? "text-[18px]" : "text-sm";
  const szH = isSenior ? "text-[28px] md:text-[34px]" : "text-3xl md:text-4xl";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(1);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#071A2B] to-[#0B2A3A] py-10 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={`text-white mb-4 ${szH}`} style={{ fontWeight: 800 }}>
            {isSenior ? "전화가 제일 쉬워요" : "문의는 가장 쉬운 방법으로"}
          </h1>
          <p className={`text-white/70 leading-relaxed ${isSenior ? "text-[18px]" : ""}`}>
            {isSenior ? "아래 큰 버튼을 눌러주세요." : "궁금한 점이 있으시면 편하게 연락해 주세요."}
          </p>
        </div>
      </section>

      {/* 3 Contact Buttons */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <button
              onClick={() => alert(`대표전화: ${V.대표전화}`)}
              className={`flex flex-col items-center gap-3 p-6 bg-[#FAFAFA] rounded-2xl border border-[#E5E7EB] hover:shadow-md transition-shadow text-center cursor-pointer ${isSenior ? "p-8" : ""}`}
            >
              <div className="w-14 h-14 rounded-full bg-[#1F6B78] text-white flex items-center justify-center">
                <Phone size={24} />
              </div>
              <span className={`text-[#111827] ${isSenior ? "text-[20px]" : ""}`} style={{ fontWeight: 600 }}>전화하기</span>
              <span className={`text-[#374151] ${isSenior ? "text-[16px]" : "text-sm"}`}>{V.대표전화}</span>
            </button>
            <button
              onClick={() => alert(`카카오톡 채널: ${V.카카오채널}`)}
              className={`flex flex-col items-center gap-3 p-6 bg-[#FAFAFA] rounded-2xl border border-[#E5E7EB] hover:shadow-md transition-shadow text-center cursor-pointer ${isSenior ? "p-8" : ""}`}
            >
              <div className="w-14 h-14 rounded-full bg-[#F2C94C] text-white flex items-center justify-center">
                <MessageCircle size={24} />
              </div>
              <span className={`text-[#111827] ${isSenior ? "text-[20px]" : ""}`} style={{ fontWeight: 600 }}>카카오톡 문의</span>
              <span className={`text-[#374151] ${isSenior ? "text-[16px]" : "text-sm"}`}>{V.카카오채널}</span>
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("inquiry-form");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`flex flex-col items-center gap-3 p-6 bg-[#FAFAFA] rounded-2xl border border-[#E5E7EB] hover:shadow-md transition-shadow text-center cursor-pointer ${isSenior ? "p-8" : ""}`}
            >
              <div className="w-14 h-14 rounded-full bg-[#67B89A] text-white flex items-center justify-center">
                <Mail size={24} />
              </div>
              <span className={`text-[#111827] ${isSenior ? "text-[20px]" : ""}`} style={{ fontWeight: 600 }}>문의 남기기</span>
              <span className={`text-[#374151] ${isSenior ? "text-[16px]" : "text-sm"}`}>연락드려요</span>
            </button>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry-form" className="py-8 md:py-12 bg-[#FAFAFA]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-[#111827] text-center mb-2 ${isSenior ? "text-[24px]" : "text-2xl"}`} style={{ fontWeight: 700 }}>
            문의 남기기
          </h2>
          <p className={`text-[#6B7280] text-center mb-8 ${sz}`}>
            남겨주시면 확인 후 연락드리겠습니다.
          </p>

          {step === 0 && (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={`block text-[#111827] mb-1.5 ${sz}`} style={{ fontWeight: 600 }}>이름</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="홍길동"
                    className={`w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/30 focus:border-[#1F6B78] ${sz}`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-[#111827] mb-1.5 ${sz}`} style={{ fontWeight: 600 }}>연락처</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="010-1234-5678"
                    className={`w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/30 focus:border-[#1F6B78] ${sz}`}
                    required
                  />
                </div>
              </div>
              <div>
                <label className={`block text-[#111827] mb-1.5 ${sz}`} style={{ fontWeight: 600 }}>문의 종류</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/30 focus:border-[#1F6B78] ${sz}`}
                >
                  <option>서비스</option>
                  <option>가입</option>
                  <option>기타</option>
                </select>
              </div>
              <div>
                <label className={`block text-[#111827] mb-1.5 ${sz}`} style={{ fontWeight: 600 }}>내용</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="예) 병원이 멀어서 가기 힘듭니다. 어떻게 하면 좋을까요?"
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/30 focus:border-[#1F6B78] resize-none ${sz}`}
                  required
                />
              </div>
              <button
                type="submit"
                className={`w-full px-6 py-3.5 min-h-[48px] rounded-xl bg-[#1F6B78] text-white hover:bg-[#185A65] transition-colors cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] ${isSenior ? "min-h-[56px] text-[17px]" : ""}`}
                style={{ fontWeight: 600 }}
              >
                <Send size={18} /> 문의 남기기
              </button>
            </form>
          )}

          {step === 1 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-[#67B89A]/15 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-[#1F6B78]" />
              </div>
              <h2 className={`text-[#111827] mb-4 ${isSenior ? "text-[22px]" : "text-xl"}`} style={{ fontWeight: 700 }}>
                문의가 접수되었습니다
              </h2>
              <p className={`text-[#6B7280] mb-8 leading-relaxed ${sz}`}>
                확인 후 연락드리겠습니다.
              </p>
              <button
                onClick={() => { setStep(0); setForm({ name: "", phone: "", category: "서비스", content: "" }); }}
                className="px-6 py-3 rounded-full bg-[#1F6B78] text-white hover:bg-[#185A65] cursor-pointer"
                style={{ fontWeight: 600 }}
              >
                확인
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 오시는 길 */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-[#111827] text-center mb-8 ${isSenior ? "text-[24px]" : "text-2xl"}`} style={{ fontWeight: 700 }}>
            오시는 길
          </h2>
          <div className="bg-[#FAFAFA] rounded-2xl p-6 md:p-8 border border-[#E5E7EB]">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-[#1F6B78] shrink-0 mt-0.5" />
                <div>
                  <span className={`text-[#111827] ${sz}`} style={{ fontWeight: 600 }}>주소</span>
                  <p className={`text-[#374151] mt-1 ${sz}`}>{V.주소}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-[#1F6B78] shrink-0 mt-0.5" />
                <div>
                  <span className={`text-[#111827] ${sz}`} style={{ fontWeight: 600 }}>운영시간</span>
                  <p className={`text-[#374151] mt-1 ${sz}`}>{V.운영시간}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-3">
              <button
                onClick={() => alert("지도 보기: 주소가 게시되면 지도 연동됩니다.")}
                className={`flex-1 sm:flex-none px-5 py-2.5 min-h-[48px] rounded-lg bg-[#1F6B78] text-white text-sm hover:bg-[#185A65] cursor-pointer active:scale-[0.98] ${isSenior ? "text-[16px]" : ""}`}
                style={{ fontWeight: 600 }}
              >
                <MapPin size={16} className="inline mr-1" /> 지도 보기
              </button>
              <button
                onClick={() => alert("길 안내: 주소가 게시되면 길 안내가 가능합니다.")}
                className={`flex-1 sm:flex-none px-5 py-2.5 min-h-[48px] rounded-lg border border-[#E5E7EB] text-[#374151] text-sm hover:bg-gray-50 cursor-pointer active:scale-[0.98] ${isSenior ? "text-[16px]" : ""}`}
                style={{ fontWeight: 500 }}
              >
                길 안내
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
