import { useNavigate } from "react-router";
import { useSeniorMode } from "../components/SeniorModeContext";
import { IMG } from "../components/image-data";
import {
  V,
  Section,
  SectionTitle,
  SummaryBox,
  PhoneButton,
} from "../components/shared";
import {
  ImageHeroSection,
  ServicePosterCard,
  Storyboard3Cut,
  TrustPhotoCard,
  SeedMoneyCard,
  SolutionCard,
} from "../components/image-first";

/* ─── 문제→해결 카드 데이터 ─── */
const SOLUTIONS = [
  {
    image: IMG.solHomeVisit,
    imageLabel: "(이미지) 방문진료: 의료진이 집에 방문하는 장면",
    num: 1,
    problem: "병원이 멀어 치료를 미루는 문제",
    solution: "찾아가는 방문진료로 해결합니다",
    details: ["의료진이 직접 방문하여 진료 제공", "이동이 어려운 어르신 진료 접근성 개선"],
  },
  {
    image: IMG.solRecovery,
    imageLabel: "(이미지) 퇴원 후 건강관리: 모니터링 장면",
    num: 2,
    problem: "퇴원 후 관리가 어려운 문제",
    solution: "재가 건강관리와 돌봄으로 해결합니다",
    details: ["퇴원 후 건강 모니터링", "일상생활 돌봄 지원"],
  },
  {
    image: IMG.solEscort,
    imageLabel: "(이미지) 병원 동행: 이동 지원 장면",
    num: 3,
    problem: "병원 동행이 어려운 문제",
    solution: "이동 지원과 동행 서비스로 해결합니다",
    details: ["병원 방문 동행", "교통 취약 지역 이동 지원"],
  },
  {
    image: IMG.solLonelyCare,
    imageLabel: "(이미지) 독거 어르신 돌봄: 방문 돌봄 장면",
    num: 4,
    problem: "혼자 사는 어르신 돌봄 공백",
    solution: "전문 돌봄 인력 방문으로 해결합니다",
    details: ["정기 방문 돌봄", "생활 지원 및 안전 확인"],
  },
  {
    image: IMG.solHealthCheck,
    imageLabel: "(이미지) 건강 체크: 혈압·혈당 측정 장면",
    num: 5,
    problem: "건강 악화를 늦게 발견하는 문제",
    solution: "정기 건강 체크로 해결합니다",
    details: ["혈압·혈당 등 기본 건강 관리", "건강 상태 지속 모니터링"],
  },
  {
    image: IMG.solIntegrated,
    imageLabel: "(이미지) 통합 서비스: 의료·복지 연계 장면",
    num: 6,
    problem: "의료와 돌봄이 따로 움직이는 문제",
    solution: "지역 의료·돌봄 통합 서비스로 해결합니다",
    details: ["의료·복지 연계", "지역 자원 통합 조정"],
  },
];

/* ─── 서비스 포스터 데이터 ─── */
const POSTERS = [
  {
    image: IMG.serviceClinic,
    imageLabel: "(이미지) 동네 진료: 설명하는 의료진과 어르신",
    title: "찾아가는 주치의",
    desc: "전문의가 우리 조합원의 집을 찾아가 집에서도 안전하게 진료와 치료를 할 수 있어요.",
  },
  {
    image: IMG.serviceHomeVisit,
    imageLabel: "(이미지) 방문진료: 가정 방문 상담 장면",
    title: "찾아가는 도움의 손길",
    desc: "거동이 불편하시거나, 이동이 어려우시다면 전문 돌봄사가 집으로 방문을 해요.",
  },
  {
    image: IMG.serviceNursing,
    imageLabel: "(이미지) 간호도움: 혈압 체크/기초 측정",
    title: "집에서도 간호사의 도움을",
    desc: "전문 간호사가 집에서도 안전하게 관리하도록 도와요.",
  },
  {
    image: IMG.serviceRehab,
    imageLabel: "(이미지) 재활: 가벼운 스트레칭 지도",
    title: "회복(재활)",
    desc: "퇴원 후에도 다시 건강한 일상 생활을 하도록 도와드려요.",
  },
  {
    image: IMG.serviceCareLink,
    imageLabel: "(이미지) 돌봄연결: 보호자와 상담하는 장면",
    title: "돌봄 연결",
    desc: "요양보호사,생활지원사,간병인등 전문 돌봄사가 요양, 복지, 필요한 곳을 함께 찾습니다.",
  },
  {
    image: IMG.serviceWalking,
    imageLabel: "(이미지) 건강모임: 숲길/마을길 걷기",
    title: "건강 모임",
    desc: "우리 같이 모여 배우고 함께 활동하면서 건강한 생활을 즐겨요.",
  },
];

/* ─── 3컷 스토리보드 데이터 ── */
const STORYBOARD = [
  {
    image: IMG.storyPhone,
    imageLabel: "(이미지) 전화: 상담 연결 장면",
    step: "STEP 1",
    title: "언제든 전화주세요",
    desc: "지금 어떤 상황인지만 말씀해 주세요,우리 조합의 친절한 상담사가 상세히 안내해줘요",
  },
  {
    image: IMG.storyConsult,
    imageLabel: "(이미지) 상담: 상황 파악 장면",
    step: "STEP 2",
    title: "상담사와 함께 방법을 찾아요",
    desc: "우리 조합원의 상황에 맞게 우리 조합에서 제공하는 서비스에서 빠르게 방법을 찾아내요.",
  },
  {
    image: IMG.storyConnect,
    imageLabel: "(이미지) 연결: 방문/돌봄 연결 장면",
    step: "STEP 3",
    title: "꾸준히 챙겨요",
    desc: "우리 조합원이 필요한 서비스를 한 번으로 끝나지 않게 항상 관심을 가지고 지속적으로 꾸준히 챙겨드립니다.",
  },
];

export function AboutPage() {
  const navigate = useNavigate();
  const { isSenior } = useSeniorMode();

  return (
    <div>
      {/* ── A1) 대표 이미지 히어로 ── */}
      <ImageHeroSection
        image={IMG.aboutHero}
        imageLabel="(이미지) 조합 소개: 따뜻한 현장/상담/진료 분위기"
        title={
          isSenior
            ? "우리 동네 건강, 같이 챙겨요"
            : "한마음 한뜻으로 지키는 건강"
        }
        subtitle={
          isSenior
            ? "어려우면 전화 주세요. 천천히 안내해 드려요."
            : "방문 진료부터 돌봄까지,우리 조합원의 어려움을 끝까지 책임집니다."
        }
        badge="조합 소개"
        isSenior={isSenior}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {isSenior ? (
            <>
              <PhoneButton
                isSenior
                className="w-full sm:w-auto"
              />
              <button
                onClick={() => navigate("/join")}
                className="w-full sm:w-auto px-6 py-4 min-h-[56px] rounded-full bg-[#1F6B78] text-white text-[18px] hover:bg-[#185A65] transition-colors cursor-pointer active:scale-[0.98]"
                style={{ fontWeight: 700 }}
              >
                조합원 가입하기
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/join")}
                className="w-full sm:w-auto px-6 py-3 min-h-[48px] rounded-full bg-[#1F6B78] text-white hover:bg-[#185A65] transition-colors cursor-pointer active:scale-[0.98]"
                style={{ fontWeight: 600 }}
              >
                조합원 가입하기
              </button>
              <a
                href="#principles"
                className="w-full sm:w-auto px-6 py-3 min-h-[48px] rounded-full border border-white/30 text-white/90 hover:bg-white/10 transition-colors cursor-pointer active:scale-[0.98] text-center"
                style={{ fontWeight: 500 }}
              >
                운영 원칙 보기
              </a>
            </>
          )}
        </div>
      </ImageHeroSection>

      {/* ── A2) 10초 요약 ── */}
      <Section bg="bg-[#FAFAFA]">
        <SummaryBox
          isSenior={isSenior}
          title={isSenior ? "한 줄로 말하면" : "10초 요약"}
          items={
            isSenior
              ? [
                  "전화 한 통으로 시작해요",
                  "진료 + 돌봄을 끊기지 않게 연결해요",
                  "조합원(주민)이 주인입니다",
                ]
              : [
                  "아프거나 걱정될 때, 혼자 고민하지 않아도 됩니다.",
                  "동네에서 진료·돌봄·생활지원까지 끊기지 않게 이어드려요.",
                  "조합원(주민)이 주인이 되어, 서로 돌보는 마을을 만듭니다.",
                ]
          }
          badges={
            isSenior
              ? [
                  "주민이 주인(한 사람 한 표)",
                  "진료 + 돌봄 연결",
                  "전화 한 통으로 시작",
                ]
              : undefined
          }
        />
      </Section>

      {/* ── A3) 문제→해결 카드 6개 ── */}
      <Section>
        <SectionTitle
          isSenior={isSenior}
          title={
            isSenior
              ? "이런 분께 특히 필요해요"
              : "이런 상황이라면, 함께 해결할 수 있습니다"
          }
          center
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {SOLUTIONS.map((s) => (
            <SolutionCard
              key={s.num}
              image={s.image}
              imageLabel={s.imageLabel}
              num={s.num}
              problem={s.problem}
              solution={s.solution}
              details={s.details}
              isSenior={isSenior}
              onClick={() => navigate("/services")}
            />
          ))}
        </div>
      </Section>

      {/* ── A4) 서비스 포스터 6개 (이미지 60~70%) ── */}
      <Section bg="bg-[#FAFAFA]">
        <SectionTitle
          isSenior={isSenior}
          title={isSenior ? "우리가 하는 일" : "서비스 안내"}
          sub={
            isSenior
              ? undefined
              : "방문진료–예방–회복–돌봄 연결까지, 끊기지 않게 우리 조합원과 함께 합니다."
          }
          center
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTERS.map((p) => (
            <ServicePosterCard
              key={p.title}
              image={p.image}
              imageLabel={p.imageLabel}
              title={p.title}
              desc={p.desc}
              isSenior={isSenior}
              onClick={() => navigate("/services")}
            />
          ))}
        </div>
      </Section>

      {/* ── A5) 3컷 스토리보드 ── */}
      <Section>
        <SectionTitle
          isSenior={isSenior}
          title={
            isSenior
              ? "이용은 이렇게 시작해요"
              : "이용 과정(3단계)"
          }
          center
        />
        <Storyboard3Cut
          items={STORYBOARD}
          isSenior={isSenior}
        />
        {isSenior && (
          <div className="mt-8 p-5 rounded-xl bg-[#F2EBDD]/60 border border-[#F2EBDD] text-center">
            <p
              className="text-[#111827] text-[18px]"
              style={{ fontWeight: 600 }}
            >
              급하면 오늘 바로 전화 주세요:{" "}
              <span className="text-[#1F6B78]">
                {V.대표전화}
              </span>
            </p>
          </div>
        )}
      </Section>

      {/* ── A6) 신뢰 섹션 (사진 + 배지) ── */}
      <Section bg="bg-[#FAFAFA]" id="principles">
        <SectionTitle
          isSenior={isSenior}
          title={isSenior ? "안심 약속" : "운영 원칙(신뢰)"}
          center
        />
        <TrustPhotoCard
          image={IMG.trustCommunity}
          imageLabel="(이미지) 신뢰 섹션: 조합원 모임/상담 장면"
          badges={[
            "비영리 운영(수익 배분 없음)",
            "주민이 주인(1인 1표)",
            "운영 내용 공개(공지/총회)",
          ]}
          isSenior={isSenior}
        />
        {/* 추가 원칙 (일반모드) */}
        {!isSenior && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
            {[
              "1인 1표",
              "비영리",
              "정보 공개",
              "조합원 참여",
              "지역상생",
            ].map((p) => (
              <div
                key={p}
                className="text-center py-3 rounded-xl bg-white border border-[#E5E7EB]"
              >
                <span
                  className="text-sm text-[#1F6B78]"
                  style={{ fontWeight: 600 }}
                >
                  {p}
                </span>
              </div>
            ))}
          </div>
        )}
        {/* 안심 약속 (어르신모드) */}
        {isSenior && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
            {[
              "돈 벌려고 하는 곳이 아니라, 동네 건강을 위해 움직입니다.",
              "어르신이 이해할 때까지 쉽게 설명합니다.",
              "필요한 서비스는 '연결'까지 도와드립니다.",
              "개인정보는 꼭 필요한 만큼만 받습니다.",
            ].map((t) => (
              <div
                key={t}
                className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#E5E7EB]"
              >
                <span className="text-[#67B89A] shrink-0">
                  &#x2714;
                </span>
                <p className="text-[#374151] text-[18px] leading-[1.6]">
                  {t}
                </p>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── A7) 출자금(씨앗돈) 카드 ── */}
      <Section>
        <SeedMoneyCard
          image={IMG.seedMoney}
          isSenior={isSenior}
          lines={
            isSenior
              ? [
                  "조합을 운영하고,우리 조합원의 건강과 생활을 지키는데 쓰여요.",
                  `씨앗돈은 ${V.출자금_최저}부터 시작할 수 있어요.`,
                  "탈퇴하면 절차에 따라 전액 돌려받으실수 있어요.",
                  "이익을 나누는 게 목적이 아니라, 우리 모두의 건강한 생활을 지키는 게 목적입니다.",
                ]
              : [
                  "출자금은 조합의 공동 자본으로 운영 기반입니다.",
                  `최소 ${V.출자금_최저}부터 참여 가능합니다.`,
                  "환급은 정관/절차에 따라 진행됩니다.",
                ]
          }
          ctaLabel="가입하기 →"
          onCta={() => navigate("/join")}
        />
      </Section>

      {/* ── A8) 큰 CTA ── */}
      <Section bg="bg-[#071A2B]">
        <div className="text-center">
          <h2
            className={`text-white mb-4 ${isSenior ? "text-[28px] md:text-[34px]" : "text-2xl md:text-3xl"}`}
            style={{ fontWeight: 700 }}
          >
            {isSenior
              ? "지금 할 수 있는 것"
              : "함께 시작해 보세요"}
          </h2>
          <p
            className={`text-white/60 mb-8 max-w-2xl mx-auto ${isSenior ? "text-[18px]" : ""}`}
          >
            {isSenior
              ? "전화 한 통이면 시작됩니다."
              : "조합원 가입, 서비스 상담, 자주 묻는 질문 — 무엇이든 편하게 시작하세요."}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <button
              onClick={() => alert(`대표전화: ${V.대표전화}`)}
              className={`w-full sm:w-auto px-8 rounded-full bg-[#67B89A] text-white hover:bg-[#5AA889] transition-colors cursor-pointer active:scale-[0.98] ${isSenior ? "py-4 min-h-[56px] text-[18px]" : "py-3 min-h-[48px]"}`}
              style={{ fontWeight: 700 }}
            >
              &#x1F4DE; 전화로 상담받기
            </button>
            <button
              onClick={() => navigate("/join")}
              className={`w-full sm:w-auto px-8 rounded-full bg-[#1F6B78] text-white hover:bg-[#185A65] transition-colors cursor-pointer active:scale-[0.98] ${isSenior ? "py-4 min-h-[56px] text-[18px]" : "py-3 min-h-[48px]"}`}
              style={{ fontWeight: 700 }}
            >
              조합원 가입하기
            </button>
            {!isSenior && (
              <button
                onClick={() => navigate("/community")}
                className="w-full sm:w-auto px-8 py-3 min-h-[48px] rounded-full border border-white/20 text-white/80 hover:bg-white/5 transition-colors cursor-pointer active:scale-[0.98]"
                style={{ fontWeight: 500 }}
              >
                소식 보기
              </button>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}