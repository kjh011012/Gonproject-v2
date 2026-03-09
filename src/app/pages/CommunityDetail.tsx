import { useParams, useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft, ChevronLeft, ChevronRight, Share2, Paperclip,
  Eye, Clock, MapPin, BookOpen,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  NOTICES, NOTICE_TYPE_COLORS,
  PRESS,
  HEALTH_POSTS,
  COOP_ARTICLES,
  DAILY_ENTRIES, MOOD_MAP,
} from "./Community";

/* ─── Types ─── */
type ContentType = "notices" | "press" | "health" | "coop" | "daily";

/* ─── Helpers ─── */
const serif = { fontFamily: "'Noto Serif KR', serif" };

function formatNoticeDate(d: string) {
  const [y, m, dd] = d.split("-");
  return `${y}년 ${parseInt(m)}월 ${parseInt(dd)}일`;
}

/* ═══════════════════════════════════════════════
   Shared Layout: 카테고리 → 제목 → 메타 → 이미지 → 본문
   참고 이미지 기반의 깔끔한 에디토리얼 레이아웃
   ═══════════════════════════════════════════════ */
function ArticleLayout({
  backTo,
  backLabel,
  badge,
  badgeClassName,
  title,
  metaItems,
  image,
  imageAlt,
  hasFile,
  children,
  footer,
}: {
  backTo: string;
  backLabel: string;
  badge: string;
  badgeClassName?: string;
  title: string;
  metaItems: { label: string }[];
  image: string;
  imageAlt: string;
  hasFile?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <div className="contents">
      {/* Minimal top bar */}
      <div className="bg-[#FAF9F6] border-b border-[#EAE1D3]">
        <div className="max-w-[820px] mx-auto px-5 sm:px-6 py-4">
          <button
            onClick={() => navigate(backTo)}
            className="flex items-center gap-1.5 text-[#7A8584] hover:text-[#1F4B43] transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span className="text-sm" style={{ fontWeight: 500 }}>{backLabel}</span>
          </button>
        </div>
      </div>

      {/* Article */}
      <article className="bg-[#FAF9F6] pb-16 md:pb-24">
        <div className="max-w-[820px] mx-auto px-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {/* ── Header ── */}
            <div className="pt-8 md:pt-12 pb-6">
              {/* Badge */}
              <span
                className={`inline-block px-3.5 py-1.5 rounded-full text-[13px] mb-5 ${
                  badgeClassName || "bg-[#F0EDEA] text-[#4A5553]"
                }`}
                style={{ fontWeight: 500 }}
              >
                {badge}
              </span>

              {/* Title */}
              <h1
                className="text-[#1F2623] text-[22px] md:text-[28px] leading-snug mb-5"
                style={{ ...serif, fontWeight: 800 }}
              >
                {title}
              </h1>

              {/* Meta line: date · author · share */}
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[13px] text-[#999]">
                {metaItems.map((m, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-[#D6CCBC] mx-0.5">·</span>}
                    {m.label}
                  </span>
                ))}
                <span className="text-[#D6CCBC] mx-0.5">·</span>
                <button
                  onClick={() => alert("공유 기능은 준비 중입니다.")}
                  className="flex items-center gap-1 text-[#999] hover:text-[#1F4B43] transition-colors cursor-pointer"
                >
                  <Share2 size={13} /> 공유
                </button>
                {hasFile && (
                  <>
                    <span className="text-[#D6CCBC] mx-0.5">·</span>
                    <button
                      onClick={() => alert("첨부파일 다운로드는 준비 중입니다.")}
                      className="flex items-center gap-1 text-[#999] hover:text-[#1F4B43] transition-colors cursor-pointer"
                    >
                      <Paperclip size={13} /> 첨부파일
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ── Image ── */}
            <div className="rounded-xl overflow-hidden mb-8 md:mb-10">
              <ImageWithFallback
                src={image}
                alt={imageAlt}
                className="w-full h-auto max-h-[480px] object-cover"
              />
            </div>

            {/* ── Body ── */}
            <div className="text-[#4A5553] leading-[1.95] space-y-6 text-[15px] md:text-base" style={serif}>
              {children}
            </div>

            {/* ── Footer (prev/next etc.) ── */}
            {footer}
          </motion.div>
        </div>
      </article>
    </div>
  );
}

/* ─── Navigation between articles ─── */
function PrevNextNav({
  prev,
  next,
  basePath,
}: {
  prev: { id: number; title: string } | null;
  next: { id: number; title: string } | null;
  basePath: string;
}) {
  return (
    <div className="border-t border-[#EAE1D3] mt-12 pt-6 grid grid-cols-2 gap-4">
      {prev ? (
        <Link
          to={`${basePath}/${prev.id}`}
          className="group flex items-start gap-2 text-left"
        >
          <ChevronLeft size={16} className="text-[#7A8584] mt-0.5 shrink-0 group-hover:text-[#1F4B43] transition-colors" />
          <div>
            <span className="text-[11px] text-[#ABABAB] block mb-1">이전 글</span>
            <span className="text-sm text-[#4A5553] group-hover:text-[#1F4B43] transition-colors line-clamp-1" style={{ ...serif, fontWeight: 500 }}>
              {prev.title}
            </span>
          </div>
        </Link>
      ) : <div />}
      {next ? (
        <Link
          to={`${basePath}/${next.id}`}
          className="group flex items-start gap-2 text-right justify-end"
        >
          <div>
            <span className="text-[11px] text-[#ABABAB] block mb-1">다음 글</span>
            <span className="text-sm text-[#4A5553] group-hover:text-[#1F4B43] transition-colors line-clamp-1" style={{ ...serif, fontWeight: 500 }}>
              {next.title}
            </span>
          </div>
          <ChevronRight size={16} className="text-[#7A8584] mt-0.5 shrink-0 group-hover:text-[#1F4B43] transition-colors" />
        </Link>
      ) : <div />}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DETAIL: 공지사항
   ═══════════════════════════════════════════════ */
function NoticeDetail({ id }: { id: number }) {
  const item = NOTICES.find((n) => n.id === id);
  if (!item) return <NotFoundMessage backTo="/notices" label="공지사항" />;

  const idx = NOTICES.findIndex((n) => n.id === id);
  const prev = idx > 0 ? NOTICES[idx - 1] : null;
  const next = idx < NOTICES.length - 1 ? NOTICES[idx + 1] : null;

  const typeBadgeClass =
    item.type === "긴급"
      ? "bg-[#C87C5A]/10 text-[#C87C5A]"
      : item.type === "조합원"
        ? "bg-[#1F4B43]/8 text-[#1F4B43]"
        : "bg-[#F0EDEA] text-[#7A8584]";

  return (
    <ArticleLayout
      backTo="/notices"
      backLabel="공지사항 목록"
      badge={item.type}
      badgeClassName={typeBadgeClass}
      title={item.title}
      metaItems={[
        { label: formatNoticeDate(item.date) },
        { label: `조회 ${item.views}` },
      ]}
      image={item.image}
      imageAlt={item.title}
      hasFile={item.hasFile}
      footer={<PrevNextNav prev={prev} next={next} basePath="/community/notices" />}
    >
      <p>{item.excerpt}</p>
      <p>해당 안내와 관련된 세부 사항은 조합 사무국으로 문의하시면 안내받으실 수 있습니다. 조합원 여러분의 양해와 협조를 부탁드립니다.</p>
      <p>변경 사항이 있을 경우, 추가 공지를 통해 안내드리겠습니다. 항상 조합원 여러분의 건강과 안전을 최우선으로 생각하겠습니다.</p>
      <p className="text-[#7A8584] text-sm">문의: 조합 사무국 (운영시간 내 전화 가능)</p>
    </ArticleLayout>
  );
}

/* ═══════════════════════════════════════════════
   DETAIL: 언론보도
   ═══════════════════════════════════════════════ */
function PressDetail({ id }: { id: number }) {
  const item = PRESS.find((p) => p.id === id);
  if (!item) return <NotFoundMessage backTo="/community/press" label="언론보도" />;

  const idx = PRESS.findIndex((p) => p.id === id);
  const prev = idx > 0 ? PRESS[idx - 1] : null;
  const next = idx < PRESS.length - 1 ? PRESS[idx + 1] : null;

  return (
    <ArticleLayout
      backTo="/community/press"
      backLabel="언론보도 목록"
      badge={item.source}
      badgeClassName="bg-[#1F4B43]/8 text-[#1F4B43]"
      title={item.title}
      metaItems={[
        { label: item.date },
        { label: item.category },
      ]}
      image={item.image}
      imageAlt={item.title}
      footer={<PrevNextNav prev={prev} next={next} basePath="/community/press" />}
    >
      <p>{item.excerpt}</p>
      <p>이 기사에 대한 자세한 내용은 해당 언론사 웹사이트에서 원문을 확인하실 수 있습니다. 강원농산어촌의료사회적협동조합은 지역 의료 사각지대 해소를 위해 꾸준히 노력하고 있습니다.</p>
      <p>조합 관계자는 "앞으로도 지역 주민과 함께 건강한 공동체를 만들어 나가겠다"며, "많은 분들의 관심과 응원이 큰 힘이 된다"고 전했다.</p>
      <p className="text-[#7A8584] text-sm mt-4">※ 본 기사는 {item.source}에 게재된 내용을 바탕으로 작성되었습니다.</p>
    </ArticleLayout>
  );
}

/* ═══════════════════════════════════════════════
   DETAIL: 건강활동 및 모임
   ═══════════════════════════════════════════════ */
function HealthDetail({ id }: { id: number }) {
  const item = HEALTH_POSTS.find((p) => p.id === id);
  if (!item) return <NotFoundMessage backTo="/community" label="건강활동" />;

  const idx = HEALTH_POSTS.findIndex((p) => p.id === id);
  const prev = idx > 0 ? HEALTH_POSTS[idx - 1] : null;
  const next = idx < HEALTH_POSTS.length - 1 ? HEALTH_POSTS[idx + 1] : null;

  return (
    <ArticleLayout
      backTo="/community"
      backLabel="건강활동 목록"
      badge={item.cat}
      badgeClassName="bg-[#1F4B43]/8 text-[#1F4B43]"
      title={item.title}
      metaItems={[
        { label: item.date },
        { label: `조회 ${item.views}` },
        ...(item.dday ? [{ label: item.dday }] : []),
      ]}
      image={item.image}
      imageAlt={item.title}
      footer={<PrevNextNav prev={prev} next={next} basePath="/community/health" />}
    >
      <p>{item.excerpt}</p>
      <p>참여를 희망하시는 조합원께서는 사무국으로 연락해 주시기 바랍니다. 선착순으로 접수되며, 정원 초과 시 대기 등록이 가능합니다.</p>
      <p>건강활동 프로그램은 조합원이라면 누구나 무료로 참여하실 수 있습니다. 비조합원의 경우 소정의 참가비가 발생할 수 있으며, 조합 가입 후 참여하시면 더욱 다양한 혜택을 누리실 수 있습니다.</p>
      <p>지난 프로그램 참가자들의 만족도는 평균 4.7/5.0으로 매우 높았으며, "이웃과 함께 건강을 챙길 수 있어 좋다", "전문가의 지도를 받을 수 있어 안심"이라는 후기가 많았습니다.</p>
    </ArticleLayout>
  );
}

/* ═══════════════════════════════════════════════
   DETAIL: 지금 우리조합은
   ═══════════════════════════════════════════════ */
function CoopDetail({ id }: { id: number }) {
  const item = COOP_ARTICLES.find((a) => a.id === id);
  if (!item) return <NotFoundMessage backTo="/community/resources" label="조합 소식" />;

  const idx = COOP_ARTICLES.findIndex((a) => a.id === id);
  const prev = idx > 0 ? COOP_ARTICLES[idx - 1] : null;
  const next = idx < COOP_ARTICLES.length - 1 ? COOP_ARTICLES[idx + 1] : null;

  const extraParagraphs =
    item.column === "이사장 칼럼"
      ? [
          "우리가 꿈꾸는 것은 거창한 것이 아닙니다. 아플 때 가까이에서 돌봐주는 의원, 평소에 건강을 함께 챙기는 이웃, 그리고 서로의 안부를 묻는 공동체. 그것이면 충분합니다.",
          "한 사람의 큰 기부보다 오백 명의 작은 출자가 더 큰 힘을 발휘합니다. 조합원 한 분 한 분이 곧 우리 마을 의료의 주인입니다.",
          "앞으로도 투명하게, 진심으로, 조합원 여러분과 함께 걸어가겠습니다. 감사합니다.",
        ]
      : item.column === "운영 보고"
        ? [
            "세부 운영 데이터와 재무 보고서는 사무국에서 열람하실 수 있으며, 조합원 총회에서 상세히 보고될 예정입니다.",
            "밝음의원 개원 준비는 시설 공사, 의료 인력 채용, 인허가 절차가 병행 진행 중이며, 상반기 개원이라는 목표에 차질 없이 추진되고 있습니다.",
            "조합원 여러분의 지속적인 관심과 참여가 우리 조합의 가장 큰 자산입니다. 궁금한 점은 언제든 사무국으로 연락 주시기 바랍니다.",
          ]
        : [
            "이러한 이야기들이 모여 우리 조합의 역사가 됩니다. 조합원 한 분 한 분의 경험과 목소리가 곧 강원농산어촌의료사회적협동조합의 존재 이유입니다.",
            "여러분의 이야기를 들려주세요. 사무국으로 연락 주시면 인터뷰를 진행해 드립니다.",
          ];

  return (
    <ArticleLayout
      backTo="/community/resources"
      backLabel="조합 소식 목록"
      badge={item.column}
      badgeClassName="bg-[#F0EDEA] text-[#4A5553]"
      title={item.title}
      metaItems={[
        { label: item.date },
        { label: item.author },
      ]}
      image={item.image}
      imageAlt={item.title}
      footer={<PrevNextNav prev={prev} next={next} basePath="/community/coop" />}
    >
      <p>{item.excerpt}</p>
      {extraParagraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </ArticleLayout>
  );
}

/* ═══════════════════════════════════════════════
   DETAIL: 조합원 이야기 (일기/에세이)
   ═══════════════════════════════════════════════ */
function DailyDetail({ id }: { id: number }) {
  const item = DAILY_ENTRIES.find((e) => e.id === id);
  if (!item) return <NotFoundMessage backTo="/community/daily" label="조합원 이야기" />;

  const idx = DAILY_ENTRIES.findIndex((e) => e.id === id);
  const prev = idx > 0 ? DAILY_ENTRIES[idx - 1] : null;
  const next = idx < DAILY_ENTRIES.length - 1 ? DAILY_ENTRIES[idx + 1] : null;
  const mood = MOOD_MAP[item.mood] || { emoji: "📝", color: "#999" };

  return (
    <ArticleLayout
      backTo="/community/daily"
      backLabel="조합원 이야기 목록"
      badge={`${mood.emoji} ${item.mood}`}
      badgeClassName="bg-[#F0EDEA] text-[#4A5553]"
      title={item.title}
      metaItems={[
        { label: item.date },
        { label: item.author },
        { label: item.location },
      ]}
      image={item.image}
      imageAlt={item.title}
      footer={
        <>
          {/* Mood signature */}
          <div className="mt-10 pt-6 border-t border-[#EAE1D3] text-center">
            <span className="text-3xl">{mood.emoji}</span>
            <p className="text-sm text-[#7A8584] mt-2" style={serif}>
              오늘의 기분: <span style={{ color: mood.color, fontWeight: 600 }}>{item.mood}</span>
            </p>
          </div>
          <PrevNextNav prev={prev} next={next} basePath="/community/daily" />
        </>
      }
    >
      <p>{item.content}</p>
      <p>하루가 이렇게 지나간다. 특별한 것 없는 하루지만, 이런 하루가 모여 한 해가 되고, 인생이 된다. 건강하게, 이웃과 함께, 이 산골에서 오래오래 살고 싶다.</p>
    </ArticleLayout>
  );
}

/* ─── 404 fallback ─── */
function NotFoundMessage({ backTo, label }: { backTo: string; label: string }) {
  const navigate = useNavigate();
  return (
    <div className="contents">
      <div className="bg-[#FAF9F6] min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-5">
          <p className="text-[#7A8584] text-lg mb-6" style={serif}>
            요청하신 게시글을 찾을 수 없습니다.
          </p>
          <button
            onClick={() => navigate(backTo)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1F4B43] text-white text-sm cursor-pointer hover:bg-[#2A6359] transition-colors"
            style={{ fontWeight: 600 }}
          >
            <ArrowLeft size={14} /> {label} 목록으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN EXPORT — Route component
   ═══════════════════════════════════════════════ */
export function CommunityDetailPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const numId = Number(id);

  if (!type || isNaN(numId)) {
    return <NotFoundMessage backTo="/community" label="커뮤니티" />;
  }

  switch (type as ContentType) {
    case "notices":
      return <NoticeDetail id={numId} />;
    case "press":
      return <PressDetail id={numId} />;
    case "health":
      return <HealthDetail id={numId} />;
    case "coop":
      return <CoopDetail id={numId} />;
    case "daily":
      return <DailyDetail id={numId} />;
    default:
      return <NotFoundMessage backTo="/community" label="커뮤니티" />;
  }
}
