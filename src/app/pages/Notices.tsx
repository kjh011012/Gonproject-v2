import { useState, useRef } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ChevronRight, Search, Eye, Paperclip, Clock, Bell } from "lucide-react";
import { useSeniorMode } from "../components/SeniorModeContext";
import { V, C } from "../components/shared";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
function Anim({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const NOTICES = [
  { id: 1, type: "긴급" as const, title: "3월 폭설 대비 방문진료 일정 변경 안내", date: "2026-03-03", views: 542, hasFile: true, pinned: true },
  { id: 2, type: "전체" as const, title: "2026년 상반기 건강교실 수강생 모집", date: "2026-03-01", views: 389, hasFile: true, pinned: true },
  { id: 3, type: "조합원" as const, title: "제4차 정기총회 개최 안내 (3/15)", date: "2026-02-27", views: 213, hasFile: true, pinned: false },
  { id: 4, type: "전체" as const, title: "사무실 이전 안내 — 3월 10일부터 새 주소", date: "2026-02-24", views: 178, hasFile: false, pinned: false },
  { id: 5, type: "조합원" as const, title: "2025년 결산 보고서 공개", date: "2026-02-20", views: 156, hasFile: true, pinned: false },
  { id: 6, type: "전체" as const, title: "밝음의원 개원 준비 현황 보고", date: "2026-02-15", views: 201, hasFile: false, pinned: false },
  { id: 7, type: "전체" as const, title: "조합원 혜택 안내 업데이트", date: "2026-02-10", views: 134, hasFile: false, pinned: false },
  { id: 8, type: "전체" as const, title: "개인정보처리방침 개정 안내", date: "2026-02-05", views: 89, hasFile: true, pinned: false },
];

const TYPE_COLORS = {
  "긴급": "bg-[#C87C5A]/10 text-[#C87C5A]",
  "조합원": "bg-[#1F4B43]/10 text-[#1F4B43]",
  "전체": "bg-[#F0F0F0] text-[#999]",
};

export function NoticesPage() {
  const { isSenior } = useSeniorMode();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"전체" | "긴급" | "조합원">("전체");

  const filtered = NOTICES.filter((n) => {
    if (filter !== "전체" && n.type !== filter) return false;
    if (search && !n.title.includes(search)) return false;
    return true;
  });

  const pinned = filtered.filter((n) => n.pinned);
  const normal = filtered.filter((n) => !n.pinned);

  return (
    <div className="contents">
      {/* Hero */}
      <section className="bg-[#1F4B43] py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-5">
            <Link to="/" className="hover:text-white/70">홈</Link>
            <ChevronRight size={14} />
            <Link to="/community" className="hover:text-white/70">커뮤니티</Link>
            <ChevronRight size={14} />
            <span className="text-white/80">공지사항</span>
          </div>
          <h1 className="text-white text-[28px] md:text-[36px] mb-3" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}>
            공지사항
          </h1>
          <p className="text-white/60">조합의 주요 안내와 소식을 전합니다.</p>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-[#F9F8F5]">
        <div className="max-w-[1000px] mx-auto px-5 sm:px-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex gap-2">
              {(["전체", "긴급", "조합원"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-all ${
                    filter === f ? "bg-[#1F4B43] text-white shadow-md" : "bg-white text-[#666] border border-[#E5E5E5] hover:border-[#1F4B43]/30"
                  }`}
                  style={{ fontWeight: filter === f ? 600 : 400 }}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BBB]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="공지 검색..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#1F4B43] focus:ring-1 focus:ring-[#1F4B43]/20 transition-all"
              />
            </div>
          </div>

          {/* Pinned */}
          {pinned.length > 0 && (
            <Anim className="mb-6 space-y-2">
              {pinned.map((n) => (
                <motion.div
                  key={n.id}
                  variants={fadeUp}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white border-l-4 border-[#C87C5A] shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <Bell size={16} className="text-[#C87C5A] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`px-2 py-0.5 rounded text-xs ${TYPE_COLORS[n.type]}`} style={{ fontWeight: 600 }}>{n.type}</span>
                      <span className="text-xs text-[#C87C5A]" style={{ fontWeight: 600 }}>고정</span>
                    </div>
                    <p className="text-sm text-[#1F2623] truncate" style={{ fontWeight: 600 }}>{n.title}</p>
                  </div>
                  <span className="text-xs text-[#7A8584] shrink-0">{n.date}</span>
                </motion.div>
              ))}
            </Anim>
          )}

          {/* Normal list */}
          <Anim className="bg-white rounded-xl border border-[#E5E5E5] divide-y divide-[#F0F0F0] overflow-hidden">
            {normal.map((n) => (
              <motion.div
                key={n.id}
                variants={fadeUp}
                className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-[#FAFAFA] transition-colors"
              >
                <span className={`px-2 py-0.5 rounded text-xs shrink-0 ${TYPE_COLORS[n.type]}`} style={{ fontWeight: 600 }}>
                  {n.type}
                </span>
                <p className="flex-1 text-sm text-[#333] truncate" style={{ fontWeight: 500 }}>{n.title}</p>
                <div className="flex items-center gap-3 shrink-0 text-xs text-[#BBB]">
                  {n.hasFile && <Paperclip size={12} />}
                  <span className="flex items-center gap-1"><Eye size={12} />{n.views}</span>
                  <span>{n.date}</span>
                </div>
              </motion.div>
            ))}
          </Anim>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#7A8584]">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}