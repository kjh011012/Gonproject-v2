import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, ArrowRight, ArrowLeft, PhoneCall, ChevronDown, MessageCircle, Handshake, Stethoscope, House, Bell, Vote } from "lucide-react";
import { useSeniorMode } from "../components/SeniorModeContext";
import { IMG } from "../components/image-data";
import { useAuth } from "../components/AuthContext";
import {
  V, Section, SectionTitle, SummaryBox, PhoneButton, FAQAccordion,
  StepperVisual,
} from "../components/shared";
import { SeedMoneyCard, ImageHeroSection } from "../components/image-first";

const SENIOR_FAQ = [
  { q: "출자금은 꼭 내야 하나요?", a: `네, 조합원이 되려면 ${V.출자금_최저} 이상의 출자금이 필요합니다. 금액은 부담 없는 범위에서 정하시면 됩니다.` },
  { q: "탈퇴하면 돌려받나요?", a: "네, 정관과 절차에 따라 출자금을 환급받으실 수 있습니다." },
  { q: "병원비가 다 할인되나요?", a: "조합 자체 프로그램에 한하며, 일 병원비 할인과는 다릅니다. 상담 시 안내드려요." },
  { q: "개인정보는 왜 받나요?", a: "가입 처리와 안내 연락을 위해 꼭 필요한 소한의 정보만 수집합니다." },
  { q: "공지/모임 소식은 어디서 보나요?", a: "홈페이지 소식/커뮤니티 페이지와 문자/카카오 채널로 안내합니다." },
];

export function JoinPage() {
  const { isSenior } = useSeniorMode();
  const { isLoggedIn, isRegistered, completeMembership } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [form, setForm] = useState({ name: "", birth: "", phone: "", address: "", addressDetail: "", memo: "" });
  const [isProxy, setIsProxy] = useState(false);
  const [shareAmount, setShareAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sz = isSenior ? "text-[18px]" : "text-sm";
  const btnH = isSenior ? "min-h-[56px] text-[17px]" : "";

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "이름을 입력해 주세요.";
    if (!form.birth.trim()) e.birth = "생년월일을 적어주세요. 예) 1962-03-01";
    if (!form.phone.trim()) e.phone = "휴대폰 번호를 확인해 주세요.";
    if (!form.address.trim()) e.address = "주소를 입력해 주세요.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const validateStep3 = () => {
    if (!shareAmount) { setErrors({ share: "출자금을 선택해 주세요." }); return false; }
    setErrors({}); return true;
  };
  const handleNext = () => {
    if (step === 1) { if (!agree1 || !agree2) { setErrors({ agree: "필수 동의 2개를 체크해 주세요." }); return; } setErrors({}); setStep(2); }
    else if (step === 2) { if (validateStep2()) setStep(3); }
    else if (step === 3) {
      if (!validateStep3()) return;
      if (!isLoggedIn || !isRegistered) {
        alert("조합원 가입 신청을 완료하려면 먼저 로그인/회원가입이 필요합니다.");
        navigate("/login?redirect=%2Fjoin");
        return;
      }
      completeMembership();
      setStep(4);
    }
  };

  return (
    <div>
      {/* ── 이미지 히어로 (전화 도움 사진) ── */}
      <ImageHeroSection
        image={IMG.joinHero}
        imageLabel="(이미지) 조합원 가입: 전화 상담 안내"
        title={isSenior ? "가입은 어렵지 않아요." : "단 1분이면 우리 조합원이 됩니다."}
        subtitle={isSenior ? "3번만 누르면 됩니다. 걱정되면 전화로 같이 해요." : "조합의 주인으로 참여하고, 지역 건강 돌봄의 연결을 함께 만듭니다."}
        badge="조합원 가입"
        isSenior={isSenior}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
          <button
            onClick={() => alert(`대표전화: ${V.대표전화}`)}
            className={`flex items-center justify-center gap-2 rounded-full bg-[#67B89A] text-white hover:bg-[#5AA889] transition-colors cursor-pointer active:scale-[0.98] ${isSenior ? "px-5 py-3 min-h-[48px] text-[16px]" : "px-4 py-2.5 min-h-[40px] text-sm"}`}
            style={{ fontWeight: 700 }}
          >
            <PhoneCall size={isSenior ? 20 : 16} />
            {isSenior ? `전화로 가입 도와주세요(${V.대표전화})` : "전화로 가입 도움"}
          </button>
          <button
            onClick={() => alert(`카카오 채널: ${V.카카오채널}`)}
            className={`flex items-center justify-center gap-2 rounded-full border border-white/30 text-white/90 hover:bg-white/10 transition-colors cursor-pointer active:scale-[0.98] ${isSenior ? "px-5 py-3 min-h-[48px] text-[16px]" : "px-4 py-2.5 min-h-[40px] text-sm"}`}
            style={{ fontWeight: 500 }}
          >
            <MessageCircle size={isSenior ? 18 : 14} /> 카카오톡 문의
          </button>
          <button
            onClick={() => navigate("/inquiries")}
            className={`flex items-center justify-center gap-2 rounded-full border border-white/30 text-white/90 hover:bg-white/10 transition-colors cursor-pointer active:scale-[0.98] ${isSenior ? "px-5 py-3 min-h-[48px] text-[16px]" : "px-4 py-2.5 min-h-[40px] text-sm"}`}
            style={{ fontWeight: 500 }}
          >
            문의 남기기
          </button>
        </div>
      </ImageHeroSection>

      {/* ── 10초 요약 (어르신) ── */}
      {isSenior && (
        <Section bg="bg-[#FAFAFA]">
          <SummaryBox
            isSenior
            items={[
              "조합원은 '손님'이 아니라 '주인'입니다.",
              "출자금은 씨앗돈(내 지분)이고, 규정에 따라 돌려받습니다.",
              "가입하면 소식/모임/상담 연결이 쉬워집니다.",
            ]}
          />
        </Section>
      )}

      {/* ── 가입 혜택 ── */}
      <Section>
        <SectionTitle
          isSenior={isSenior}
          title={isSenior ? "가입하면 좋은 점" : "가입 혜택"}
          center
        />
        {isSenior ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {[
              "필요한 도움을 어디서 받을지 안내받기 쉬워요.",
              "건강 모임/교육 소식을 먼저 받아요.",
              "혼자 아플 때 연결 창구가 생겨요.",
              "내 의견이 운영에 반영될 수 있어요.",
              "동네가 함께 건강해져요.",
              "가족이 대신 신청도 가능해요(선택).",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2">
                <CheckCircle2 size={22} className="text-[#67B89A] shrink-0 mt-0.5" />
                <p className="text-[#111827] text-[18px] leading-[1.6]">{item}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0 rounded-2xl border border-[#E5E7EB] overflow-hidden bg-white">
            {([
              { icon: <Handshake size={22} />, t: "돌봄 연결 창구", d: "필요한 돌봄·복지를 안내받는 연결점이 생깁니다." },
              { icon: <Stethoscope size={22} />, t: "방문 진료", d: "거동이 어려울 때, 의료진이 찾아갑니다." },
              { icon: <House size={22} />, t: "재택 치료", d: "집에서도 안전하게 건강을 관리하도록 돕습니다." },
              { icon: <Bell size={22} />, t: "정보/공지 우선 안내", d: "새 소식과 프로그램을 가장 먼저 받아보세요." },
              { icon: <Vote size={22} />, t: "의견 제안/총회", d: "운영에 목소리를 내고 총회에 참여합니다." },
            ] as const).map((item, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center text-center px-5 py-7 sm:border-r sm:last:border-r-0 border-b lg:border-b-0 last:border-b-0 border-[#E5E7EB]"
              >
                {/* 순번 */}
                <span className="absolute top-3 right-3 text-[10px] text-[#C4C9D2]" style={{ fontWeight: 600 }}>
                  0{i + 1}
                </span>
                {/* 아이콘 원 */}
                <div className="w-11 h-11 rounded-full bg-[#1F6B78]/8 flex items-center justify-center text-[#1F6B78] mb-3">
                  {item.icon}
                </div>
                <h4 className="text-[#111827] text-sm mb-1.5" style={{ fontWeight: 700 }}>{item.t}</h4>
                <p className="text-xs text-[#6B7280] leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── 출자금(씨앗돈) 시각화 카드 ── */}
      <Section bg="bg-[#FAFAFA]">
        <SeedMoneyCard
          image={IMG.seedMoney}
          isSenior={isSenior}
          lines={
            isSenior
              ? [
                  "조합을 운영하는 데 씁니다.",
                  `금액은 ${V.출자금_최저}부터 시작할 수 있어요.`,
                  "탈퇴하면 규정에 따라 돌려받습니다.",
                  "어려우면 전화로 먼저 상담하세요.",
                ]
              : [
                  "출자금은 조합의 공동 자본으로 운영 기반입니다.",
                  `최소 ${V.출자금_최저}부터 참여 가능합니다.`,
                  "환급은 정관/절차에 따라 진행됩니다.",
                ]
          }
          ctaLabel={isSenior ? "출자금이 걱정돼요(FAQ)" : undefined}
          onCta={isSenior ? () => {
            const el = document.getElementById("join-faq");
            el?.scrollIntoView({ behavior: "smooth" });
          } : undefined}
        />
      </Section>

      {/* ── 가입 방법 3가지 (어르신) ── */}
      {isSenior && (
        <Section>
          <SectionTitle isSenior title="가입 방법 3가지" sub="원하는 방법을 골라주세요." />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: "&#x1F4F1;", title: "온라인으로 3분 가입", desc: "이름/연락처/주소만 적으면 됩니다.", btn: "가입 시작", action: () => { const el = document.getElementById("join-form"); el?.scrollIntoView({ behavior: "smooth" }); } },
              { icon: "&#x1F4DE;", title: "전화로 같이 가입", desc: "상담원이 옆에서 천천히 도와드립니다.", btn: "전화하기", action: () => alert(`대표전화: ${V.대표전화}`) },
              { icon: "&#x1F4DD;", title: "문의 남기기", desc: "바쁘시면 남겨주세요. 먼저 연락드립니다.", btn: "문의 남기기", action: () => navigate("/inquiries") },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 text-center">
                <div className="text-3xl mb-3" dangerouslySetInnerHTML={{ __html: c.icon }} />
                <h4 className="text-[#111827] text-[20px] mb-2" style={{ fontWeight: 700 }}>{c.title}</h4>
                <p className="text-[#6B7280] text-[16px] mb-4">{c.desc}</p>
                <button onClick={c.action} className="w-full py-3 min-h-[56px] rounded-xl bg-[#1F6B78] text-white text-[17px] hover:bg-[#185A65] transition-colors cursor-pointer" style={{ fontWeight: 600 }}>{c.btn}</button>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── 가입 폼 (3-Step) ── */}
      <Section bg={isSenior ? "bg-[#FAFAFA]" : "bg-white"} id="join-form">
        <SectionTitle
          isSenior={isSenior}
          title={isSenior ? "온라인 가입(3단계)" : "가입 3단계"}
          sub={isSenior ? undefined : "간단한 3단계로 조합원이 됩니다."}
          center
        />

        {/* Step indicator */}
        {step < 4 && (
          <div className="max-w-lg mx-auto mb-10">
            {/* 전화 도움 고정 (어르신) */}
            {isSenior && (
              <button
                onClick={() => alert(`대표전화: ${V.대표전화}`)}
                className="w-full mb-6 px-6 py-3 rounded-xl bg-[#67B89A]/10 border border-[#67B89A]/30 text-[#1F6B78] flex items-center justify-center gap-2 cursor-pointer text-[17px]"
                style={{ fontWeight: 600 }}
              >
                <PhoneCall size={20} /> 전화로 도움받기({V.대표전화})
              </button>
            )}
            <div className="flex items-center justify-center">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`rounded-full flex items-center justify-center shrink-0 ${
                      step >= s ? "bg-[#1F6B78] text-white" : "bg-[#E5E7EB] text-[#6B7280]"
                    } ${isSenior ? "w-12 h-12 text-[20px]" : "w-8 h-8 text-sm"}`}
                    style={{ fontWeight: 700 }}
                  >
                    {step > s ? <CheckCircle2 size={isSenior ? 22 : 18} /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`${isSenior ? "w-16 sm:w-24" : "w-12 sm:w-20"} h-[2px] mx-2 ${step > s ? "bg-[#1F6B78]" : "bg-[#E5E7EB]"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-lg mx-auto">
          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h2 className={`text-[#111827] mb-2 ${isSenior ? "text-[24px]" : "text-xl"}`} style={{ fontWeight: 700 }}>
                STEP 1 — {isSenior ? "동의해 주세요" : "약관/동의(요약)"}
              </h2>
              <p className={`text-[#6B7280] mb-8 ${sz}`}>
                {isSenior ? "큰 체크 2개만 눌러주세요." : "가입 진행을 위해 꼭 필요한 내용만 먼저 보여드려요."}
              </p>
              <div className="space-y-4">
                <label className={`flex items-start gap-3 rounded-xl border cursor-pointer transition-colors ${agree1 ? "border-[#1F6B78] bg-[#1F6B78]/5" : "border-[#E5E7EB] bg-white"} ${isSenior ? "p-6" : "p-5"}`}>
                  <input type="checkbox" checked={agree1} onChange={(e) => setAgree1(e.target.checked)} className={`mt-1 accent-[#1F6B78] ${isSenior ? "w-6 h-6" : "w-5 h-5"}`} />
                  <div>
                    <span className={`text-[#111827] ${sz}`} style={{ fontWeight: 600 }}>(필수) 개인정보 수집·이용 동의</span>
                    <p className={`text-[#6B7280] mt-1 ${isSenior ? "text-[15px]" : "text-xs"}`}>연락 가능한 번호를 적어주세요. 안내 전화를 드립니다.</p>
                  </div>
                </label>
                <label className={`flex items-start gap-3 rounded-xl border cursor-pointer transition-colors ${agree2 ? "border-[#1F6B78] bg-[#1F6B78]/5" : "border-[#E5E7EB] bg-white"} ${isSenior ? "p-6" : "p-5"}`}>
                  <input type="checkbox" checked={agree2} onChange={(e) => setAgree2(e.target.checked)} className={`mt-1 accent-[#1F6B78] ${isSenior ? "w-6 h-6" : "w-5 h-5"}`} />
                  <div>
                    <span className={`text-[#111827] ${sz}`} style={{ fontWeight: 600 }}>(필수) {isSenior ? "가입 안내 확인" : "가입 안내/정관 요약 확인"}</span>
                  </div>
                </label>
              </div>
              {!isSenior && (
                <>
                  <button onClick={() => setShowDetail(!showDetail)} className="flex items-center gap-1 mt-4 text-sm text-[#1F6B78] cursor-pointer" style={{ fontWeight: 500 }}>
                    자세히 보기 <ChevronDown size={16} className={`transition-transform ${showDetail ? "rotate-180" : ""}`} />
                  </button>
                  {showDetail && (
                    <div className="mt-3 p-4 bg-[#FAFAFA] rounded-lg border border-[#E5E7EB] text-xs text-[#6B7280] max-h-40 overflow-y-auto leading-relaxed">
                      <p>수집 항목: 이름, 생년월일, 휴대폰, 주소</p>
                      <p className="mt-1">목적: 가입 처리 및 상담 연락</p>
                      <p className="mt-1">보관: 자격 유지 기간 + 탈퇴 후 1년</p>
                      <p className="mt-2">정관 요약: {V.조합명}은 사회적협동조합 기본법에 따라 운영되며, 1인 1표 의결권. 출자금은 탈퇴 시 정관에 따라 환급.</p>
                    </div>
                  )}
                </>
              )}
              {errors.agree && <p className="mt-4 text-red-500 text-sm" style={{ fontWeight: 500 }}>{errors.agree}</p>}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h2 className={`text-[#111827] mb-2 ${isSenior ? "text-[24px]" : "text-xl"}`} style={{ fontWeight: 700 }}>
                STEP 2 — {isSenior ? "4가지만 적어주세요" : "기본 정보 입력"}
              </h2>
              <p className={`text-[#6B7280] mb-8 ${sz}`}>
                {isSenior ? "이름, 생년월일, 휴대폰, 주소만 적으면 돼요." : "필수 정보 4가지를 입력합니다."}
              </p>
              <div className="space-y-5">
                {[
                  { label: "이름", key: "name", type: "text", placeholder: "예) 홍길동", error: errors.name },
                  { label: "생년월일", key: "birth", type: "text", placeholder: "예) 1962-03-01", error: errors.birth },
                  { label: "휴대폰", key: "phone", type: "tel", placeholder: "예) 010-1234-5678", error: errors.phone },
                ].map((f) => (
                  <div key={f.key}>
                    <label className={`block text-[#111827] mb-1.5 ${sz}`} style={{ fontWeight: 600 }}>{f.label}</label>
                    <input
                      type={f.type} placeholder={f.placeholder}
                      value={(form as any)[f.key]}
                      onChange={(e) => { setForm({ ...form, [f.key]: e.target.value }); setErrors({ ...errors, [f.key]: "" }); }}
                      className={`w-full px-4 rounded-xl bg-white border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/30 focus:border-[#1F6B78] ${isSenior ? "py-4 text-[18px]" : "py-3 text-sm"}`}
                    />
                    {f.error && <p className="mt-1 text-red-500 text-xs">{f.error}</p>}
                  </div>
                ))}
                <div>
                  <label className={`block text-[#111827] mb-1.5 ${sz}`} style={{ fontWeight: 600 }}>주소</label>
                  <input
                    type="text"
                    placeholder={isSenior ? "예) 강원도 횡성군 횡성읍 중앙로 12" : "예) 강원특별자치도 횡성군 횡성읍 중앙로 12"}
                    value={form.address}
                    onChange={(e) => { setForm({ ...form, address: e.target.value }); setErrors({ ...errors, address: "" }); }}
                    className={`w-full px-4 rounded-xl bg-white border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/30 focus:border-[#1F6B78] ${isSenior ? "py-4 text-[18px]" : "py-3 text-sm"}`}
                  />
                  {errors.address && <p className="mt-1 text-red-500 text-xs">{errors.address}</p>}
                </div>
                <div>
                  <label className={`block text-[#111827] mb-1.5 ${sz}`} style={{ fontWeight: 600 }}>상세주소 <span className="text-[#6B7280]" style={{ fontWeight: 400 }}>(선택)</span></label>
                  <input
                    type="text"
                    placeholder="예) ○○아파트 101동 202호"
                    value={form.addressDetail}
                    onChange={(e) => setForm({ ...form, addressDetail: e.target.value })}
                    className={`w-full px-4 rounded-xl bg-white border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/30 focus:border-[#1F6B78] ${isSenior ? "py-4 text-[18px]" : "py-3 text-sm"}`}
                  />
                </div>
                <label className="flex items-center gap-3 p-4 rounded-xl border border-[#E5E7EB] bg-white cursor-pointer">
                  <input type="checkbox" checked={isProxy} onChange={(e) => setIsProxy(e.target.checked)} className="w-5 h-5 accent-[#1F6B78]" />
                  <span className={`text-[#374151] ${isSenior ? "text-[17px]" : "text-sm"}`} style={{ fontWeight: 500 }}>(선택) 보호자가 대신 신청해요</span>
                </label>
                {!isSenior && (
                  <div>
                    <label className="block text-sm text-[#111827] mb-1" style={{ fontWeight: 500 }}>추가 메모(선택)</label>
                    <textarea placeholder="예) 무릎이 아파서 멀리 이동이 어려워요." value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/30 resize-none" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h2 className={`text-[#111827] mb-2 ${isSenior ? "text-[24px]" : "text-xl"}`} style={{ fontWeight: 700 }}>
                STEP 3 — {isSenior ? "씨앗돈(출자금)을 고르세요" : "출자금/납부 방법 선택"}
              </h2>
              <p className={`text-[#6B7280] mb-8 ${sz}`}>조합 운영과 지역 건강 활동에 사용됩니다.</p>
              <div className="grid grid-cols-1 gap-3 mb-6">
                {V.출자금_예시선택.map((opt) => (
                  <label key={opt} className={`flex items-center gap-3 rounded-xl border cursor-pointer transition-colors ${shareAmount === opt ? "border-[#1F6B78] bg-[#1F6B78]/5" : "border-[#E5E7EB] bg-white"} ${isSenior ? "p-6" : "p-5"}`}>
                    <input type="radio" name="share" checked={shareAmount === opt} onChange={() => setShareAmount(opt)} className={`accent-[#1F6B78] ${isSenior ? "w-6 h-6" : "w-5 h-5"}`} />
                    <span className={`text-[#111827] ${isSenior ? "text-[20px]" : ""}`} style={{ fontWeight: 600 }}>{opt === "직접입력" ? "직접 입력" : opt}</span>
                  </label>
                ))}
              </div>
              {shareAmount === "직접입력" && (
                <div className="mb-6">
                  <input type="text" placeholder="금액을 입력하세요" value={customAmount} onChange={(e) => setCustomAmount(e.target.value)}
                    className={`w-full px-4 rounded-xl bg-white border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/30 ${isSenior ? "py-4 text-[18px]" : "py-3 text-sm"}`} />
                </div>
              )}
              {errors.share && <p className="text-red-500 text-sm" style={{ fontWeight: 500 }}>{errors.share}</p>}
            </div>
          )}

          {/* STEP 4: 완료 */}
          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-[#67B89A]/15 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-[#1F6B78]" />
              </div>
              <h2 className={`text-[#111827] mb-4 ${isSenior ? "text-[26px]" : "text-2xl"}`} style={{ fontWeight: 700 }}>
                {isSenior ? "신청이 들어갔어요. 곧 연락드릴게요." : "가입 신청이 완료되었습니다."}
              </h2>
              <p className={`text-[#6B7280] mb-8 leading-relaxed ${isSenior ? "text-[18px]" : ""}`}>
                {isSenior ? `문자/전화로 안내드립니다. 급하면 바로 전화 주세요: ${V.대표전화}` : `접수 확인 후 안내드리겠습니다. 급하시면 ${V.대표전화}로 연락 주세요.`}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button onClick={() => alert(`대표전화: ${V.대표전화}`)} className={`py-3 rounded-xl bg-[#67B89A] text-white hover:bg-[#5AA889] transition-colors cursor-pointer ${btnH}`} style={{ fontWeight: 600 }}>
                  &#x1F4DE; 전화로 확인
                </button>
                <button onClick={() => navigate("/services")} className={`py-3 rounded-xl bg-[#1F6B78] text-white hover:bg-[#185A65] transition-colors cursor-pointer ${btnH}`} style={{ fontWeight: 600 }}>
                  서비스 상담
                </button>
                <button onClick={() => navigate("/community")} className={`py-3 rounded-xl border border-[#E5E7EB] text-[#374151] hover:bg-gray-50 transition-colors cursor-pointer ${btnH}`} style={{ fontWeight: 600 }}>
                  공지/모임 보기
                </button>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          {step < 4 && (
            <div className="flex gap-3 mt-10">
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} className={`flex-1 flex items-center justify-center gap-1 px-4 py-3 rounded-xl border border-[#E5E7EB] text-[#374151] hover:bg-gray-50 cursor-pointer ${btnH}`} style={{ fontWeight: 500 }}>
                  <ArrowLeft size={isSenior ? 18 : 16} /> 이전
                </button>
              )}
              <button onClick={handleNext} className={`flex-1 flex items-center justify-center gap-1 px-4 py-3 rounded-xl bg-[#1F6B78] text-white hover:bg-[#185A65] cursor-pointer ${btnH}`} style={{ fontWeight: 600 }}>
                {step === 3 ? (isSenior ? "가입 신청하기" : "가입 신청 완료") : "다음"} <ArrowRight size={isSenior ? 18 : 16} />
              </button>
            </div>
          )}
          {step < 4 && (
            <button onClick={() => alert(`대표전화: ${V.대표전화}`)} className={`w-full mt-4 py-3 text-center text-[#6B7280] hover:text-[#1F6B78] transition-colors cursor-pointer ${isSenior ? "text-[17px]" : "text-sm"}`} style={{ fontWeight: 500 }}>
              <PhoneCall size={16} className="inline mr-1" /> {isSenior ? "전화로 대신 신청하기" : `전화로 확인하기(${V.대표전화})`}
            </button>
          )}
        </div>
      </Section>

      {/* ── 가입 후 안내 ── */}
      <Section>
        <SectionTitle isSenior={isSenior} title="가입 후 이렇게 됩니다" center />
        <StepperVisual
          isSenior={isSenior}
          steps={[
            { title: "신청 접수", desc: "온라인/전화로 신청하면 바로 접수돼요." },
            { title: "확인 연락", desc: "가능하면 문자/전화로 확인 연락드립니다." },
            { title: "가입 안내", desc: "가입 완료 안내와 함께 조합원 생활이 시작됩니다." },
          ]}
        />
        <div className="mt-6 p-5 rounded-xl bg-[#F2EBDD]/60 border border-[#F2EBDD] text-center">
          <p className={`text-[#111827] ${isSenior ? "text-[18px]" : ""}`} style={{ fontWeight: 600 }}>
            급하면 바로 전화 주세요: <span className="text-[#1F6B78]">{V.대표전화}</span>
          </p>
        </div>
      </Section>

      {/* ── FAQ ── */}
      <Section bg="bg-[#FAFAFA]" id="join-faq">
        <SectionTitle isSenior={isSenior} title="자주 묻는 질문" />
        <FAQAccordion items={SENIOR_FAQ} isSenior={isSenior} defaultOpen={isSenior ? 3 : 0} />
      </Section>

      {/* ── 마지막 CTA ── */}
      <Section bg="bg-[#071A2B]">
        <div className="text-center">
          <h2 className={`text-white mb-6 ${isSenior ? "text-[26px] md:text-[30px]" : "text-2xl md:text-3xl"}`} style={{ fontWeight: 700 }}>
            {isSenior ? "지금 시작해 보세요" : "함께 시작해 보세요"}
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <button
              onClick={() => { setStep(1); const el = document.getElementById("join-form"); el?.scrollIntoView({ behavior: "smooth" }); }}
              className={`w-full sm:w-auto px-8 rounded-full bg-[#1F6B78] text-white hover:bg-[#185A65] transition-colors cursor-pointer active:scale-[0.98] ${isSenior ? "py-4 min-h-[56px] text-[18px]" : "py-3 min-h-[48px]"}`}
              style={{ fontWeight: 700 }}
            >
              지금 가입하기
            </button>
            <button
              onClick={() => alert(`대표전화: ${V.대표전화}`)}
              className={`w-full sm:w-auto px-8 rounded-full border border-white/20 text-white hover:bg-white/5 transition-colors cursor-pointer active:scale-[0.98] ${isSenior ? "py-4 min-h-[56px] text-[18px]" : "py-3 min-h-[48px]"}`}
              style={{ fontWeight: 600 }}
            >
              <PhoneCall size={isSenior ? 20 : 16} className="inline mr-2" />
              {isSenior ? "전화로 가입 도와주세요" : "전화 문의"}
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}
