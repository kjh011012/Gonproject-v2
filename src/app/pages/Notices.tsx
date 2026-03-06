import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Megaphone, ChevronLeft, Search, Clock, Eye, Paperclip,
  AlertTriangle, Users, Globe, ArrowRight, Bell,
} from "lucide-react";
import { useSeniorMode } from "../components/SeniorModeContext";
import { IMG } from "../components/image-data";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { V, PhoneButton } from "../components/shared";

/* ── Data ── */
interface Notice {
  id: number;
  type: "전체" | "조합원" | "긴급";
  title: string;
  excerpt: string;
  date: string;
  views: number;
  hasFile: boolean;
  pinned: boolean;
  image: string;
}

const NOTICES: Notice[] = [
  { id: 1, type: "긴급", title: "3월 폭설 대비 방문진료 일정 변경 안내", excerpt: "3월 6일~8일 폭설 예보에 따라 방문진료 일정을 일부 조정합니다. 해당 일정의 대상자 분들께 개별 안내드리겠습니다.", date: "2026-03-03", views: 542, hasFile: true, pinned: true, image: IMG.communityNotice },
  { id: 2, type: "전체", title: "2026년 상반기 건강교실 수강생 모집", excerpt: "혈압·당뇨 관리, 스트레칭 교실, 마음건강 프로그램 등 상반기 건강교실 수강생을 모집합니다.", date: "2026-03-01", views: 389, hasFile: true, pinned: true, image: IMG.communityEducation },
  { id: 3, type: "조합원", title: "제4차 정기총회 개최 안내 (3/15)", excerpt: "2026년 상반기 정기총회를 3월 15일(토) 오전 10시, 원주 시민회관에서 개최합니다.", date: "2026-02-27", views: 213, hasFile: true, pinned: false, image: IMG.communityMeeting },
  { id: 4, type: "전체", title: "사무실 이전 안내 — 3월 10일부터 새 주소", excerpt: "보다 나은 환경에서 서비스를 제공하기 위해 사무실을 이전합니다. 새 주소는 아래를 참조해 주세요.", date: "2026-02-24", views: 178, hasFile: false, pinned: false, image: IMG.communityHero },
  { id: 5, type: "조합원", title: "2025년 결산 보고서 공개", excerpt: "지난 한 해 조합의 운영 현황과 재무 상태를 투명하게 공개합니다.", date: "2026-02-20", views: 156, hasFile: true, pinned: false, image: IMG.communityMedia },
  { id: 6, type: "전체", title: "설 연휴 진료·돌봄 서비스 운영 안내", excerpt: "설 연휴 기간 중 진료 및 돌봄 서비스 운영 시간을 안내드립니다.", date: "2026-02-15", views: 234, hasFile: false, pinned: false, image: IMG.communityCheckup },
  { id: 7, type: "전체", title: "신규 돌봄사 채용 공고", excerpt: "함께할 돌봄사를 모십니다. 지역 주민 우대, 경력·신규 모두 환영합니다.", date: "2026-02-10", views: 321, hasFile: true, pinned: false, image: IMG.communityFestival },
  { id: 8, type: "조합원", title: "조합원 대상 독감 예방접종 할인 안내", excerpt: "올해 독감 예방접종을 조합원 할인가로 받으실 수 있습니다.", date: "2026-02-05", views: 198, hasFile: false, pinned: false, image: IMG.communityYoga },
];

const TYPE_CONFIG: Record<string, { bg: string; text: string; icon: typeof AlertTriangle }> = {
  전체: { bg: "bg-blue-50", text: "text-blue-600", icon: Globe },
  조합원: { bg: "bg-[#1F6B78]/10", text: "text-[#1F6B78]", icon: Users },
  긴급: { bg: "bg-red-50", text: "text-red-600", icon: AlertTriangle },
};

const FILTERS = ["전체 보기", "전체", "조합원", "긴급"] as const;

export function NoticesPage() {
  const { isSenior } = useSeniorMode();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("전체 보기");

  const filtered = NOTICES.filter(
    (n) =>
      (typeFilter === "전체 보기" || n.type === typeFilter) &&
      (search === "" || n.title.includes(search) || n.excerpt.includes(search))
  );

  const pinnedNotices = NOTICES.filter((n) => n.pinned);
  const notice = selected !== null ? NOTICES.find((n) => n.id === selected) : null;

  /* ── Detail View ── */
  if (notice) {
    return (
      <div>
        <section className="relative">
          <div className="h-56 md:h-72">
            <ImageWithFallback src={notice.image} alt={notice.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-[#111827]/30 to-[#111827]/10" />
          </div>
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
              <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm text-white/70 hover:text-white mb-4 cursor-pointer">
                <ChevronLeft size={16} /> 목록으로
              </button>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs backdrop-blur-sm ${TYPE_CONFIG[notice.type].bg} ${TYPE_CONFIG[notice.type].text}`} style={{ fontWeight: 600 }}>{notice.type}</span>
                {notice.pinned && <span className="px-3 py-1 rounded-full text-xs bg-amber-400/20 text-amber-200 backdrop-blur-sm" style={{ fontWeight: 600 }}>상단고정</span>}
              </div>
              <h1 className={`text-white mb-2 ${isSenior ? "text-[24px] md:text-[30px]" : "text-xl md:text-2xl"}`} style={{ fontWeight: 800 }}>{notice.title}</h1>
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1"><Clock size={13} /> {notice.date}</span>
                <span className="flex items-center gap-1"><Eye size={13} /> {notice.views}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
            <div className={`${isSenior ? "p-8" : "p-6 md:p-8"}`}>
              <p className={`text-[#374151] leading-relaxed mb-6 ${isSenior ? "text-[20px] leading-[1.8]" : ""}`}>{notice.excerpt}</p>
              <div className={`text-[#374151] leading-relaxed space-y-4 ${isSenior ? "text-[18px] leading-[1.8]" : ""}`}>
                <p>이 공지사항은 예시 콘텐츠입니다. 실제 운영 시 관리자가 작성한 공지 내용이 표시됩니다.</p>
                <p>강원농산어촌의료사회적협동조합(G온돌봄)은 조합원과 주민에게 중요한 안내사항을 투명하게 전달합니다.</p>
              </div>
              {notice.hasFile && (
                <div className="mt-8 p-4 bg-[#F8F9FC] rounded-xl border border-[#E5E7EB]">
                  <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <Paperclip size={14} className="text-[#1F6B78]" />
                    <span>첨부파일: <span className="text-[#1F6B78] underline cursor-pointer">안내문.pdf</span> (123KB)</span>
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-[#E5E7EB] px-6 md:px-8 py-5 bg-[#F8F9FC] flex flex-wrap gap-3">
              <button onClick={() => navigate("/inquiries")} className={`px-5 py-2.5 rounded-xl bg-[#1F6B78] text-white cursor-pointer hover:bg-[#185A65] active:scale-[0.98] ${isSenior ? "min-h-[52px] text-[17px]" : "min-h-[48px] text-sm"}`} style={{ fontWeight: 600 }}>문의하기</button>
              <PhoneButton isSenior={isSenior} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── List View ── */
  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <div className="aspect-[16/9] md:aspect-[21/7] min-h-[220px] md:min-h-[340px]">
          <ImageWithFallback src={IMG.communityNotice} alt="(이미지) 공지사항" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-[#111827]/30 to-[#111827]/10" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 w-full">
            {!isSenior && (
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-[#67B89A] text-sm mb-4 backdrop-blur-sm" style={{ fontWeight: 600 }}>공지사항</span>
            )}
            <h1 className={`text-white mb-3 ${isSenior ? "text-[30px] md:text-[36px]" : "text-3xl md:text-4xl"}`} style={{ fontWeight: 800 }}>
              {isSenior ? "중요 공지 보기" : "조합의 소식을 전해드립니다"}
            </h1>
            {!isSenior && <p className="text-white/70 text-base md:text-lg">중요 안내사항, 행사 공지, 채용 정보를 확인하세요.</p>}
            {isSenior && <div className="mt-4"><PhoneButton isSenior /></div>}
          </div>
        </div>
      </section>

      {/* Pinned urgent banner */}
      {pinnedNotices.some((n) => n.type === "긴급") && (
        <section className="bg-red-50 border-b border-red-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <AlertTriangle size={16} className="text-red-500 shrink-0" />
              {pinnedNotices.filter((n) => n.type === "긴급").map((n) => (
                <button key={n.id} onClick={() => setSelected(n.id)} className="text-sm text-red-700 hover:underline cursor-pointer" style={{ fontWeight: 600 }}>
                  {n.title} <ArrowRight size={13} className="inline ml-1" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filter bar */}
      <section className="sticky top-16 md:top-20 z-30 bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className={`flex ${isSenior ? "gap-2" : "gap-1.5"} flex-wrap`}>
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setTypeFilter(f)}
                  className={`px-4 py-2 rounded-full cursor-pointer transition-colors min-h-[40px] ${
                    typeFilter === f ? "bg-[#1F6B78] text-white" : "bg-[#F8F9FC] text-[#6B7280] hover:bg-gray-100 border border-[#E5E7EB]"
                  } ${isSenior ? "px-5 py-2.5 min-h-[48px] text-[16px]" : "text-sm"}`}
                  style={{ fontWeight: typeFilter === f ? 600 : 400 }}
                >
                  {f}
                  {f !== "전체 보기" && (
                    <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${typeFilter === f ? "bg-white/20" : "bg-gray-200/60 text-gray-500"}`}>
                      {NOTICES.filter((n) => n.type === f).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            {!isSenior && (
              <div className="relative hidden md:block">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="공지 검색..."
                  className="pl-9 pr-4 py-2 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB] text-sm w-52 focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Notices */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length > 0 ? (
            <div className="space-y-4">
              {filtered.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelected(n.id)}
                  className={`w-full text-left flex items-center gap-4 rounded-2xl bg-white border hover:shadow-md transition-all cursor-pointer group overflow-hidden ${
                    n.type === "긴급" ? "border-red-200 bg-red-50/30" : "border-[#E5E7EB]"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className={`shrink-0 relative overflow-hidden ${isSenior ? "w-36 h-32" : "w-28 h-24 sm:w-36 sm:h-28"} hidden sm:block`}>
                    <ImageWithFallback src={n.image} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  {/* Content */}
                  <div className={`flex-1 min-w-0 ${isSenior ? "py-5 px-4 sm:px-0 sm:pr-4" : "py-4 px-4 sm:px-0 sm:pr-4"}`}>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs ${TYPE_CONFIG[n.type].bg} ${TYPE_CONFIG[n.type].text}`} style={{ fontWeight: 600 }}>{n.type}</span>
                      {n.pinned && <span className="px-2.5 py-0.5 rounded-full text-xs bg-amber-50 text-amber-600" style={{ fontWeight: 600 }}>고정</span>}
                      {n.hasFile && <Paperclip size={12} className="text-gray-400" />}
                    </div>
                    <h3 className={`text-[#111827] group-hover:text-[#1F6B78] transition-colors line-clamp-1 ${isSenior ? "text-[20px]" : ""}`} style={{ fontWeight: 700 }}>{n.title}</h3>
                    <p className={`text-[#9CA3AF] line-clamp-1 mt-0.5 ${isSenior ? "text-[15px]" : "text-sm"}`}>{n.excerpt}</p>
                    <div className={`flex items-center gap-3 mt-2 text-[#9CA3AF] ${isSenior ? "text-sm" : "text-xs"}`}>
                      <span className="flex items-center gap-1"><Clock size={12} /> {n.date}</span>
                      <span className="flex items-center gap-1"><Eye size={12} /> {n.views}</span>
                    </div>
                  </div>
                  {isSenior && (
                    <div className="shrink-0 pr-5">
                      <span className="px-5 py-3 rounded-xl bg-[#1F6B78] text-white text-[17px]" style={{ fontWeight: 600 }}>읽기</span>
                    </div>
                  )}
                  {!isSenior && (
                    <ArrowRight size={18} className="text-gray-300 shrink-0 mr-4 group-hover:text-[#1F6B78] transition-colors" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-[#F8F9FC] flex items-center justify-center mx-auto mb-4">
                <Megaphone size={32} className="text-gray-300" />
              </div>
              <p className="text-[#9CA3AF]">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* Subscribe CTA */}
      {!isSenior && (
        <section className="bg-[#F8F9FC] border-t border-[#E5E7EB] py-8 md:py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#1F6B78]/10 mb-4">
              <Bell size={24} className="text-[#1F6B78]" />
            </div>
            <h3 className="text-[#111827] text-lg mb-2" style={{ fontWeight: 700 }}>공지사항 알림 받기</h3>
            <p className="text-sm text-[#6B7280] mb-5 max-w-md mx-auto">조합원 가입 시 중요 공지사항을 SMS, 카카오톡으로 알려드립니다.</p>
            <button onClick={() => navigate("/join")} className="w-full sm:w-auto px-6 py-3 min-h-[48px] rounded-full bg-[#1F6B78] text-white cursor-pointer hover:bg-[#185A65] transition-colors active:scale-[0.98]" style={{ fontWeight: 600 }}>
              조합원 가입하기 <ArrowRight size={15} className="inline ml-1" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}