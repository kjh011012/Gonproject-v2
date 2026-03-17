import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight, Search, Eye, Clock, Bell, Paperclip,
  ArrowRight, Users, Heart, Newspaper,
  BookOpen, Camera, MapPin,
} from "lucide-react";
import { useSeniorMode } from "../components/SeniorModeContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { V, C } from "../components/shared";

/* ─── Animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
function Anim({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={stagger} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── Tab definitions ─── */
const TABS = [
  { key: "notices", label: "공지", icon: Bell },
  { key: "press", label: "언론보도", icon: Newspaper },
  { key: "health", label: "건강활동 및 모임", icon: Heart },
  { key: "coop", label: "지금 우리 조합은", icon: Users },
  { key: "daily", label: "조합원 이야기", icon: Camera },
] as const;
type TabKey = (typeof TABS)[number]["key"];

/* ─── Mock data: 공지 ─── */
export const NOTICES = [
  { id: 1, type: "긴급" as const, title: "3월 폭설 대비 방문진료 일정 변경 안내", date: "2026-03-03", views: 542, hasFile: true, pinned: true, excerpt: "강원 지역 폭설 예보에 따라 3월 4일~6일 방문진료 일정이 조정됩니다. 해당 일정의 조합원분들께 개별 연락드리겠습니다.", image: "https://images.unsplash.com/photo-1771411068495-814e1b8a8eef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBydXJhbCUyMHZpbGxhZ2UlMjB3aW50ZXIlMjBzbm93fGVufDF8fHx8MTc3Mjk1NzQxMnww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 2, type: "전체" as const, title: "2026년 상반기 건강교실 수강생 모집", date: "2026-03-01", views: 389, hasFile: true, pinned: true, excerpt: "혈압·당뇨 자가관리, 스트레칭, 산림치유 등 다양한 건강교실 프로그램에 참여하세요. 조합원 무료.", image: "https://images.unsplash.com/photo-1758599879065-46fd59235166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBoZWFsdGglMjBlZHVjYXRpb24lMjBjbGFzc3Jvb218ZW58MXx8fHwxNzcyOTU3NDEyfDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 3, type: "조합원" as const, title: "제4차 정기총회 개최 안내 (3/15)", date: "2026-02-27", views: 213, hasFile: true, pinned: false, excerpt: "2026년 제4차 정기총회를 3월 15일(일) 오전 10시에 개최합니다. 많은 참석 부탁드립니다.", image: "https://images.unsplash.com/photo-1590649681928-4b179f773bd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBtZWV0aW5nJTIwY29vcGVyYXRpdmUlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzcyOTU3NDEzfDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 4, type: "전체" as const, title: "사무실 이전 안내 — 3월 10일부터 새 주소", date: "2026-02-24", views: 178, hasFile: false, pinned: false, excerpt: "더 넓고 접근이 편리한 공간으로 사무실을 이전합니다. 새 주소와 오시는 길을 안내드립니다.", image: "https://images.unsplash.com/photo-1696041757950-62e2c030283b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBidWxsZXRpbiUyMGJvYXJkJTIwbm90aWNlJTIwYW5ub3VuY2VtZW50fGVufDF8fHx8MTc3Mjk1NzQxMXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 5, type: "조합원" as const, title: "2025년 결산 보고서 공개", date: "2026-02-20", views: 156, hasFile: true, pinned: false, excerpt: "2025년 운영 실적과 재무 상태를 투명하게 공개합니다. 조합원 누구나 열람 가능합니다.", image: "https://images.unsplash.com/photo-1604218118561-4bc4427d1e7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMHBvbGljeSUyMHBhcGVyd29yayUyMG9mZmljaWFsfGVufDF8fHx8MTc3Mjk1NzQxNHww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 6, type: "전체" as const, title: "밝음의원 개원 준비 현황 보고", date: "2026-02-15", views: 201, hasFile: false, pinned: false, excerpt: "밝음의원 시설 공사와 인허가 절차가 순조롭게 진행 중입니다. 상반기 개원을 목표로 합니다.", image: "https://images.unsplash.com/photo-1742106850780-fbcc50b1ef5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGhlYWx0aGNhcmUlMjBtZWRpY2FsJTIwY2xpbmljJTIwdmlzaXR8ZW58MXx8fHwxNzcyOTU3NDE4fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 7, type: "전체" as const, title: "조합원 혜택 안내 업데이트", date: "2026-02-10", views: 134, hasFile: false, pinned: false, excerpt: "건강교실 무료 수강, 방문진료 우선 예약 등 조합원 혜택이 새롭게 업데이트되었습니다.", image: "https://images.unsplash.com/photo-1765671778226-b2f158b07d08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBlbGRlcmx5JTIwY29tbXVuaXR5JTIwZ2F0aGVyaW5nJTIwd2FybXxlbnwxfHx8fDE3NzI5NTc0MTR8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 8, type: "전체" as const, title: "개인정보처리방침 개정 안내", date: "2026-02-05", views: 89, hasFile: true, pinned: false, excerpt: "개인정보보호법 개정에 따라 개인정보처리방침이 일부 변경되었습니다.", image: "https://images.unsplash.com/photo-1604218118561-4bc4427d1e7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMHBvbGljeSUyMHBhcGVyd29yayUyMG9mZmljaWFsfGVufDF8fHx8MTc3Mjk1NzQxNHww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 9, type: "영상" as const, title: "영상 제목 불러오는 중...", date: "2026-03-12", views: 318, hasFile: false, pinned: false, excerpt: "공지 영상으로 조합의 최근 안내와 주요 소식을 확인하세요.", image: "https://i.ytimg.com/vi/LIuJvfrinAk/mqdefault.jpg", videoType: "youtube" as const, youtubeId: "LIuJvfrinAk", source: "YouTube" },
  { id: 10, type: "영상" as const, title: "영상 제목 불러오는 중...", date: "2026-03-09", views: 276, hasFile: false, pinned: false, excerpt: "현장 소식과 함께 공지사항을 영상으로 전달드립니다.", image: "https://i.ytimg.com/vi/39xaoB5Uai4/mqdefault.jpg", videoType: "youtube" as const, youtubeId: "39xaoB5Uai4", source: "YouTube" },
];
export const NOTICE_TYPE_COLORS: Record<string, string> = {
  "긴급": "bg-[#C87C5A]/12 text-[#C87C5A]",
  "조합원": "bg-[#1F4B43]/10 text-[#1F4B43]",
  "전체": "bg-[#F0F0F0] text-[#999]",
  "영상": "bg-[#2F6C64]/12 text-[#2F6C64]",
};

/* ─── Mock data: 언론보도 ─── */
export const PRESS = [
  { id: 1, source: "강원일보", title: "강원 산간 오지 의료 사각지대, 사회적 협동조합이 해법 될까", date: "2026.03.06", excerpt: "강원농산어촌의료사회적협동조합이 올해 상반기 밝음의원 개원을 앞두고 조합원 모집에 나섰다. 의료 접근이 어려운 농산어촌 주민들에게 1차 의료를 제공하겠다는 목표로, 지역 주민들의 큰 관심을 받고 있다.", category: "사회", image: "https://images.unsplash.com/photo-1771411068495-814e1b8a8eef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBydXJhbCUyMHZpbGxhZ2UlMjB3aW50ZXIlMjBzbm93fGVufDF8fHx8MTc3Mjk1NzQxMnww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 2, source: "한겨레", title: "농촌 고령화 시대, 커뮤니티케어의 새 모델 — 강원 사례", date: "2026.02.28", excerpt: "고령 인구 비율이 40%를 넘는 강원 산간 지역에서 주민 주도형 의료 협동조합이 출범했다. 방문진료, 건강교실, 돌봄 서비스를 하나로 묶어 '마을이 돌보는 의료'를 실현하겠다는 포부다.", category: "건강", image: "https://images.unsplash.com/photo-1765671778226-b2f158b07d08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBlbGRlcmx5JTIwY29tbXVuaXR5JTIwZ2F0aGVyaW5nJTIwd2FybXxlbnwxfHx8fDE3NzI5NTc0MTR8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 3, source: "KBS 강원", title: "[영상] \"병원 가려면 버스 두 번 타야 해요\" — 오지 마을 의료 현실", date: "2026.02.20", excerpt: "강원도 산간 마을 주민 김모 씨(78)는 가장 가까운 병원까지 왕복 3시간이 걸린다. 의료 협동조합의 방문진료 서비스가 시작되면 이런 불편이 크게 줄어들 전망이다.", category: "지역", image: "https://images.unsplash.com/photo-1742106850780-fbcc50b1ef5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGhlYWx0aGNhcmUlMjBtZWRpY2FsJTIwY2xpbmljJTIwdmlzaXR8ZW58MXx8fHwxNzcyOTU3NDE4fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 4, source: "메디게이트", title: "의료 사각지대 해소 위한 사회적 협동조합, 강원에서 첫 삽", date: "2026.02.15", excerpt: "의료 전문 매체가 강원농산어촌의료사협의 설립 배경과 운영 계획을 심층 분석했다. 1차 의료기관 부족, 고령화, 교통 불편 등 복합 문제를 주민 참여형 모델로 풀어가는 시도로 주목받고 있다.", category: "의료", image: "https://images.unsplash.com/photo-1582510246824-e89d845cd3f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzcGFwZXIlMjBwcmVzcyUyMG1lZGlhJTIwam91cm5hbGlzdHxlbnwxfHx8fDE3NzI5NTc0MTR8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 5, source: "연합뉴스", title: "강원 농촌 의료협동조합, 조합원 500명 돌파… \"기대 이상 호응\"", date: "2026.02.08", excerpt: "설립 초기 목표였던 조합원 300명을 넘어 500명을 돌파했다는 소식이 전해졌다. 지역 주민뿐 아니라 타 지역 출향민들의 응원 가입도 이어지고 있다.", category: "사회", image: "https://images.unsplash.com/photo-1590649681928-4b179f773bd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBtZWV0aW5nJTIwY29vcGVyYXRpdmUlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzcyOTU3NDEzfDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 10, source: "국민일보", title: "의료복지사회적협동조합 관련 보도", date: "2026.03.17", excerpt: "강원 농산어촌 지역의 의료 접근성 문제와 주민 참여형 의료복지 모델을 조명한 기사입니다. 조합의 활동 배경과 지역사회 반응을 함께 다룹니다.", category: "사회", image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", externalUrl: "https://n.news.naver.com/article/005/0001833447?lfrom=kakao" },
  { id: 6, source: "YouTube", title: "영상 제목 불러오는 중...", date: "2026.03.10", excerpt: "의료복지사회적협동조합의 활동과 지역 의료 현장을 영상으로 담았습니다.", category: "영상", image: "https://i.ytimg.com/vi/nm_xdY6_0cY/mqdefault.jpg", videoType: "youtube" as const, youtubeId: "nm_xdY6_0cY" },
  { id: 7, source: "YouTube", title: "영상 제목 불러오는 중...", date: "2026.03.08", excerpt: "조합의 비전과 주민 참여형 의료복지 모델을 소개하는 영상입니다.", category: "영상", image: "https://i.ytimg.com/vi/HUBfBPQ3f8M/mqdefault.jpg", videoType: "youtube" as const, youtubeId: "HUBfBPQ3f8M" },
  { id: 8, source: "YouTube", title: "영상 제목 불러오는 중...", date: "2026.03.05", excerpt: "현장 사례 중심으로 의료사협의 역할과 변화를 설명합니다.", category: "영상", image: "https://i.ytimg.com/vi/gIpZzzZpRx8/mqdefault.jpg", videoType: "youtube" as const, youtubeId: "gIpZzzZpRx8" },
  { id: 9, source: "YouTube", title: "영상 제목 불러오는 중...", date: "2026.03.02", excerpt: "지역 돌봄과 방문의료가 어떻게 연결되는지 실제 사례를 통해 보여줍니다.", category: "영상", image: "https://i.ytimg.com/vi/I3ZePgcHWiE/mqdefault.jpg", videoType: "youtube" as const, youtubeId: "I3ZePgcHWiE" },
];

/* ─── Mock data: 건강활동 및 모임 ─── */
export const HEALTH_POSTS = [
  { id: 1, cat: "건강모임", title: "봄맞이 건강걷기 대회 참가자 모집", excerpt: "강원의 아름다운 산길을 함께 걸으며 건강을 챙기세요. 초보자도 참여 가능하며, 완주 시 건강 수첩과 기념품을 드립니다.", date: "2026.03.05", views: 234, dday: "D-12", image: "https://images.unsplash.com/photo-1552666146-a8b42692780a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBlbGRlcmx5JTIwd2Fsa2luZyUyMHBhcmslMjBzdW5yaXNlJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzcyODk0Mzk1fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 2, cat: "건강활동", title: "혈압·당뇨 자가관리 교실 개강", excerpt: "전문 의료진과 함께 만성질환 관리법을 배워보세요. 매주 화요일, 총 8회 과정으로 운영됩니다.", date: "2026.03.01", views: 189, dday: "D-5", image: "https://images.unsplash.com/photo-1758599879065-46fd59235166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBoZWFsdGglMjB3b3Jrc2hvcCUyMGNsYXNzcm9vbXxlbnwxfHx8fDE3NzI5NTEzNjd8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 3, cat: "사진/후기", title: "겨울 방문진료 후기 — 따뜻한 손길", excerpt: "눈 내리는 산골 마을에서 의료진의 방문이 큰 위안이 되었습니다.", date: "2026.02.20", views: 312, image: "https://images.unsplash.com/photo-1771411068337-dce562770ca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGtvcmVhbiUyMHZpbGxhZ2UlMjBtb3VudGFpbiUyMG1vcm5pbmd8ZW58MXx8fHwxNzcyOTUxMzY1fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 4, cat: "건강모임", title: "산림치유 프로그램 — 숲에서 쉬는 하루", excerpt: "강원의 깊은 숲속에서 마음과 몸의 회복을 경험하세요.", date: "2026.02.15", views: 178, image: "https://images.unsplash.com/photo-1664071186356-4276ad9a022a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBzZW5pb3IlMjBzdHJldGNoaW5nJTIweYogYSUyMG91dGRvb3J8ZW58MXx8fHwxNzcyOTUxMzY4fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 5, cat: "행사", title: "2026 정기총회 참여 안내", excerpt: "조합원이라면 누구나 참석하실 수 있습니다.", date: "2026.02.10", views: 267, image: "https://images.unsplash.com/photo-1630251800800-cfc688e27a3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBlbGRlcmx5JTIwY29tbXVuaXR5JTIwaGVhbHRoJTIwZXhlcmNpc2V8ZW58MXx8fHwxNzcyOTUxMzY1fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 6, cat: "건강활동", title: "스트레칭 교실 — 매주 수요일", excerpt: "관절 건강과 유연성을 위한 쉬운 스트레칭 프로그램.", date: "2026.02.05", views: 145, image: "https://images.unsplash.com/photo-1555069855-e580a9adbf43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBoZWFsdGglMjBjb29wZXJhdGl2ZSUyMG1lZXRpbmclMjBkaXZlcnNlJTIwcGVvcGxlfGVufDF8fHx8MTc3Mjg5NDM5NHww&ixlib=rb-4.1.0&q=80&w=1080" },
];

/* ─── Mock data: 조합 ─── */
export const COOP_ARTICLES = [
  { id: 1, column: "이사장 칼럼", title: "의료는 상품이 아니라 권리입니다", author: "김동현 이사장", date: "2026.03.01", excerpt: "우리 조합이 첫발을 내딛은 지 어느덧 6개월이 지났습니다. 처음 마을회관에 모여 '우리 마을에도 병원이 있으면 좋겠다'고 이야기를 나누던 그 날이 엊그제 같습니다. 의료는 사고파는 상품이 아니라, 누구에게나 보장되어야 할 기본 권리입니다. 멀리 있는 큰 병원이 아니라, 가까이서 믿을 수 있는 우리 동네 의원을 만들겠습니다.", featured: true, image: "https://images.unsplash.com/photo-1771411068337-dce562770ca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLb3JlYW4lMjBydXJhbCUyMHZpbGxhZ2UlMjBjb21tdW5pdHklMjBtZWV0aW5nfGVufDF8fHx8MTc3Mjk1MjU0M3ww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 2, column: "조합원 이야기", title: "\"출자금 5만 원으로 마을이 바뀌었어요\"", author: "이춘자 조합원 (78세)", date: "2026.02.25", excerpt: "버스를 두 번 갈아타야 병원에 갈 수 있었던 산골마을. 이춘자 할머니는 '5만 원 출자금이 아까울 리가 있겠냐'며 웃었다. 방문진료를 받고 나서 혈압약도 제때 받게 되었고, 건강교실에서 이웃들과 함께 스트레칭도 한다.", featured: false, image: "https://images.unsplash.com/photo-1730471263121-a14c0b6d515e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLb3JlYW4lMjBncmFuZG1vdGhlciUyMHRyYWRpdGlvbmFsJTIwaG9tZXxlbnwxfHx8fDE3NzI5NTI1NDd8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 3, column: "운영 보고", title: "2025년 4분기 운영 실적 보고", author: "사무국", date: "2026.02.18", excerpt: "조합원 수 512명, 출자금 총액 8,640만 원, 건강교실 수료 인원 87명, 방문진료 상담 건수 234건. 밝음의원 개원 준비 진척률 78%. 상반기 개원 목표 달성을 위해 의료 인력 충원과 시설 인허가 절차를 진행 중입니다.", featured: false, image: "https://images.unsplash.com/photo-1751977979590-3554dd691c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwY29vcGVyYXRpdmUlMjBoZWFsdGhjYXJlJTIwZGlzY3Vzc2lvbnxlbnwxfHx8fDE3NzI5NTI1NDR8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 4, column: "조합원 이야기", title: "귀촌 후 찾은 우리 동네 건강 공동체", author: "박성호 조합원 (52세)", date: "2026.02.10", excerpt: "서울에서 30년 직장생활을 마치고 고향으로 돌아왔다. 동네에 의원 하나 없는 게 가장 불안했는데, 의료협동조합이 생기면서 마음이 놓였다. 조합 활동을 하며 마을 어르신들과도 가까워졌다.", featured: false, image: "https://images.unsplash.com/photo-1765671778226-b2f158b07d08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBjb21tdW5pdHklMjBnYXRoZXJpbmclMjB3YXJtfGVufDF8fHx8MTc3Mjk1MjU0NXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 5, column: "이사장 칼럼", title: "함께 걸어온 1년, 함께 만들 내일", author: "김동현 이사장", date: "2026.01.28", excerpt: "한 사람의 큰 기부보다 오백 명의 작은 출자가 더 큰 힘을 발휘합니다. 우리의 1년은 그것을 증명했습니다.", featured: false, image: "https://images.unsplash.com/photo-1707525662674-22952124ada8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMEtvcmVhJTIwZmFybWluZyUyMHZpbGxhZ2UlMjBtb3JuaW5nfGVufDF8fHx8MTc3Mjk1MjU0NXww&ixlib=rb-4.1.0&q=80&w=1080" },
];

/* ─── Mock data: 오늘의 하루 ─── */
export const DAILY_ENTRIES = [
  { id: 1, title: "눈 오는 날, 진료소 가는 길", author: "이춘자 (78세)", location: "홍천군 내면", date: "2026.03.07", content: "오늘은 눈이 많이 왔다. 옛날 같으면 병원 갈 엄두도 못 냈을 텐데, 선생님이 집까지 와주셔서 고마웠다. 혈압은 130이라 괜찮다고 하셨다. 따뜻한 차 한 잔 대접하고 이야기도 나눴다. 눈 쌓인 마당을 함께 보며 '이 동네 참 좋다'고 하셨다. 나도 그렇게 생각한다.", mood: "감사", image: "https://images.unsplash.com/photo-1707525662674-22952124ada8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMEtvcmVhJTIwZmFybWluZyUyMHZpbGxhZ2UlMjBtb3JuaW5nfGVufDF8fHx8MTc3Mjk1MjU0NXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 2, title: "건강교실 첫 날", author: "박순영 (72세)", location: "인제군 기린면", date: "2026.03.05", content: "오늘 처음으로 건강교실에 갔다. 스트레칭을 배웠는데 생각보다 어렵지 않았다. 옆에 앉은 김 할머니와 웃으면서 따라 했다. 선생님이 '매일 10분만 하면 무릎이 한결 나아질 거'라고 하셨다. 집에 와서 저녁에 한 번 더 해봤다.", mood: "즐거움", image: "https://images.unsplash.com/photo-1692372372810-c848c9cca1c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwaGVhbHRoJTIwY2xhc3MlMjBzdHJldGNoaW5nJTIwZXhlcmNpc2V8ZW58MXx8fHwxNzcyOTUyNTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 3, title: "마을회관에서 만난 사람들", author: "최동수 (81세)", location: "양구군 해안면", date: "2026.03.03", content: "조합 모임이 있어서 마을회관에 갔다. 오랜만에 이웃들을 만나니 반가웠다. 밝음의원이 곧 문을 연다는 소식에 다들 기뻐했다. 나처럼 허리가 안 좋은 사람이 많은데, 가까운 곳에 의원이 있으면 참 좋겠다. 돌아오는 길에 하늘이 맑아서 기분이 좋았다.", mood: "기대", image: "https://images.unsplash.com/photo-1765671778226-b2f158b07d08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBjb21tdW5pdHklMjBnYXRoZXJpbmclMjB3YXJtfGVufDF8fHx8MTc3Mjk1MjU0NXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 4, title: "텃밭 정리하며 생각한 것들", author: "김영순 (75세)", location: "평창군 봉평면", date: "2026.02.28", content: "봄이 오려는지 땅이 조금씩 녹고 있다. 텃밭을 정리하다가 허리가 아파서 쉬었다. 예전에는 참고 일했는데, 요즘은 건강교실에서 배운 대로 쉬었다가 다시 한다. 몸이 보내는 신호에 귀 기울이라고 선생님이 말씀하셨다. 그 말이 맞는 것 같다.", mood: "평온", image: "https://images.unsplash.com/photo-1761453353783-ca638737cf99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLb3JlYW4lMjBjb3VudHJ5c2lkZSUyMGdhcmRlbiUyMHNwcmluZ3xlbnwxfHx8fDE3NzI5NTI1NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
];
export const MOOD_MAP: Record<string, { emoji: string; color: string }> = {
  "감사": { emoji: "🙏", color: "#C87C5A" },
  "즐거움": { emoji: "😊", color: "#6E958B" },
  "기대": { emoji: "✨", color: "#1F4B43" },
  "평온": { emoji: "🍃", color: "#5B8F8B" },
};

/* ═══════════════════════════════════════════════
   TAB CONTENT COMPONENTS
   ═══════════════════════════════════════════════ */

/* ─── 공지 탭 (수평 카드 아카이브 스타일) ─── */
function NoticesTab({ isSenior }: { isSenior: boolean }) {
  const [noticeCat, setNoticeCat] = useState("전체");
  const [search, setSearch] = useState("");
  const [noticeMobileCatOpen, setNoticeMobileCatOpen] = useState(false);
  const noticeMobileCatRef = useRef<HTMLDivElement>(null);
  const [videoMeta, setVideoMeta] = useState<
    Record<number, { title: string; source: string }>
  >({});
  const NOTICE_CATS = ["전체", "긴급", "조합원", "영상"];

  const filtered = NOTICES.filter((n) => {
    if (noticeCat !== "전체" && n.type !== noticeCat) return false;
    const q = search.trim();
    if (!q) return true;
    return [n.title, n.excerpt, n.type, n.source || ""].some((field) =>
      field.includes(q),
    );
  });

  useEffect(() => {
    let active = true;
    const videoItems = NOTICES.filter(
      (item) => item.videoType === "youtube" && item.youtubeId,
    );

    const loadVideoMeta = async () => {
      const entries = await Promise.all(
        videoItems.map(async (item) => {
          const watchUrl = `https://www.youtube.com/watch?v=${item.youtubeId}`;
          try {
            const res = await fetch(
              `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`,
            );
            if (!res.ok) {
              return [item.id, { title: item.title, source: item.source || "YouTube" }] as const;
            }
            const data = (await res.json()) as {
              title?: string;
              author_name?: string;
            };
            return [
              item.id,
              {
                title: data.title?.trim() || item.title,
                source: data.author_name?.trim() || item.source || "YouTube",
              },
            ] as const;
          } catch {
            return [item.id, { title: item.title, source: item.source || "YouTube" }] as const;
          }
        }),
      );

      if (!active) return;
      setVideoMeta(Object.fromEntries(entries));
    };

    loadVideoMeta();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!noticeMobileCatOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!noticeMobileCatRef.current) return;
      if (!noticeMobileCatRef.current.contains(event.target as Node)) {
        setNoticeMobileCatOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [noticeMobileCatOpen]);

  const formatDate = (d: string) => {
    if (d.includes(".")) return d;
    const [y, m, dd] = d.split("-");
    return `${y}년 ${parseInt(m)}월 ${parseInt(dd)}일`;
  };

  return (
    <div>
      {/* Filter row */}
      <div className="mb-10 pb-6 border-b border-[#E5E0D8]">
        <div className="hidden md:flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            {NOTICE_CATS.map((cat, idx) => (
              <div key={cat} className="flex items-center">
                {idx > 0 ? (
                  <div className="w-px h-4 bg-[#D6CCBC]/60 mx-1" />
                ) : null}
                <button
                  onClick={() => setNoticeCat(cat)}
                  className="relative px-4 py-2 cursor-pointer group"
                >
                  <span
                    className={`text-sm tracking-wide transition-colors duration-300 ${
                      noticeCat === cat
                        ? "text-[#1F2623]"
                        : "text-[#9A9E9D] hover:text-[#1F4B43]"
                    }`}
                    style={{
                      fontFamily: "'Noto Serif KR', serif",
                      fontWeight: noticeCat === cat ? 700 : 400,
                    }}
                  >
                    {cat}
                  </span>
                  {noticeCat === cat ? (
                    <motion.div
                      layoutId="noticeFilter"
                      className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#1F4B43]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : null}
                </button>
              </div>
            ))}
          </div>

          <div className="relative w-full max-w-[240px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C0B8A8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="검색..."
              className="w-full pl-9 pr-4 py-2.5 bg-transparent border-b border-[#D6CCBC] text-sm focus:outline-none focus:border-[#1F4B43] transition-colors placeholder:text-[#C0B8A8]"
            />
          </div>
        </div>

        <div className="md:hidden flex items-end gap-3">
          <div className="relative w-[42%] shrink-0" ref={noticeMobileCatRef}>
            <label className="block text-[11px] text-[#999] mb-1" style={{ fontWeight: 600 }}>
              카테고리
            </label>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={noticeMobileCatOpen}
              onClick={() => setNoticeMobileCatOpen((open) => !open)}
              className="flex w-full items-center justify-between px-3 py-2.5 bg-transparent border-b border-[#D6CCBC] text-sm text-[#1F2623] focus:outline-none"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 500 }}
            >
              <span>{noticeCat}</span>
              <ChevronRight
                size={16}
                className={`text-[#555] transition-transform ${noticeMobileCatOpen ? "rotate-[270deg]" : "rotate-90"}`}
              />
            </button>
            <AnimatePresence>
              {noticeMobileCatOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 right-0 top-full mt-2 z-20 overflow-hidden rounded-xl border border-[#D6CCBC] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                >
                  <div role="listbox" className="py-1">
                    {NOTICE_CATS.map((cat) => {
                      const isActive = noticeCat === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setNoticeCat(cat);
                            setNoticeMobileCatOpen(false);
                          }}
                          className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors ${
                            isActive
                              ? "bg-[#1F4B43] text-white"
                              : "text-[#1F2623] hover:bg-[#F7F2E8]"
                          }`}
                          style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: isActive ? 600 : 500 }}
                        >
                          <span>{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C0B8A8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="검색..."
              className="w-full pl-9 pr-4 py-2.5 bg-transparent border-b border-[#D6CCBC] text-sm focus:outline-none focus:border-[#1F4B43] transition-colors placeholder:text-[#C0B8A8]"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#7A8584]" style={{ fontFamily: "'Noto Serif KR', serif" }}>
            검색 결과가 없습니다.
          </p>
        </div>
      ) : null}

      {/* 2-column horizontal card grid */}
      <Anim key={`${noticeCat}-${search}`} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
        {filtered.map((n) => {
          const isVideo = n.type === "영상" && n.videoType === "youtube" && !!n.youtubeId;
          const href = isVideo ? `https://youtu.be/${n.youtubeId}` : `/community/notices/${n.id}`;
          const title = isVideo ? (videoMeta[n.id]?.title || n.title) : n.title;
          const source = isVideo ? (videoMeta[n.id]?.source || n.source || "YouTube") : n.type;
          const CardTag = isVideo ? "a" : Link;
          const cardProps = isVideo
            ? { href, target: "_blank", rel: "noreferrer" as const }
            : { to: href };

          return (
            <motion.div key={n.id} variants={fadeUp}>
              <CardTag {...cardProps} className="group flex gap-5">
                {/* Image / Video */}
                <div className="w-[42%] shrink-0 rounded-lg overflow-hidden aspect-[4/3]">
                  {isVideo ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${n.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${n.youtubeId}&controls=0&modestbranding=1&rel=0&playsinline=1`}
                      title={title}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      className="h-full w-full"
                    />
                  ) : (
                    <ImageWithFallback src={n.image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  )}
                </div>
                {/* Text content */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <span className="text-[12px] text-[#7A8584] mb-2 block" style={{ fontWeight: 500 }}>
                      {source}
                    </span>
                    <h4 className="text-[#1F2623] text-[15px] leading-snug mb-2 group-hover:text-[#1F4B43] transition-colors line-clamp-2" style={{ fontWeight: 700 }}>
                      {title}
                    </h4>
                    <p className="text-[#8C8C8C] text-[13px] leading-relaxed line-clamp-2">
                      {n.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-[12px] text-[#ABABAB]">
                    <span>{formatDate(n.date)}</span>
                    <span className="flex items-center gap-1 text-[#7A8584] group-hover:text-[#1F4B43] transition-colors" style={{ fontWeight: 500 }}>
                      {isVideo ? "영상 보기" : "이야기 보기"} <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </CardTag>
            </motion.div>
          );
        })}
      </Anim>
    </div>
  );
}

/* ─── 언론보도 탭 (수평 카드 아카이브 스타일) ─── */
function PressTab({ isSenior }: { isSenior: boolean }) {
  const [pressCat, setPressCat] = useState("전체");
  const [pressSearch, setPressSearch] = useState("");
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const mobileCatRef = useRef<HTMLDivElement>(null);
  const [videoMeta, setVideoMeta] = useState<Record<number, { title: string; source: string }>>({});
  const PRESS_CATS = ["전체", ...Array.from(new Set(PRESS.map((p) => p.category)))];
  const filtered = PRESS.filter((p) => {
    if (pressCat !== "전체" && p.category !== pressCat) return false;
    const q = pressSearch.trim();
    if (!q) return true;
    return [p.title, p.excerpt, p.source].some((field) => field.includes(q));
  });

  useEffect(() => {
    let active = true;
    const videoItems = PRESS.filter((item) => item.videoType === "youtube" && item.youtubeId);
    const loadVideoMeta = async () => {
      const metaEntries = await Promise.all(
        videoItems.map(async (item) => {
          const watchUrl = `https://www.youtube.com/watch?v=${item.youtubeId}`;
          try {
            const res = await fetch(
              `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`,
            );
            if (!res.ok) {
              return [item.id, { title: item.title, source: item.source }] as const;
            }
            const data = (await res.json()) as { title?: string; author_name?: string };
            return [
              item.id,
              {
                title: data.title?.trim() || item.title,
                source: data.author_name?.trim() || item.source,
              },
            ] as const;
          } catch {
            return [item.id, { title: item.title, source: item.source }] as const;
          }
        }),
      );
      if (!active) return;
      setVideoMeta(Object.fromEntries(metaEntries));
    };
    loadVideoMeta();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!mobileCatOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!mobileCatRef.current) return;
      if (!mobileCatRef.current.contains(event.target as Node)) {
        setMobileCatOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [mobileCatOpen]);

  return (
    <div>
      {/* Category filter row */}
      <div className="mb-10 pb-6 border-b border-[#E5E0D8]">
        <div className="hidden md:flex items-center gap-1">
          {PRESS_CATS.map((cat, idx) => (
            <div key={cat} className="flex items-center">
              {idx > 0 && <div className="w-px h-4 bg-[#D6CCBC]/60 mx-1" />}
              <button
                onClick={() => setPressCat(cat)}
                className="relative px-4 py-2 cursor-pointer group"
              >
                <span
                  className={`text-sm tracking-wide transition-colors duration-300 ${
                    pressCat === cat ? "text-[#1F2623]" : "text-[#9A9E9D] hover:text-[#1F4B43]"
                  }`}
                  style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: pressCat === cat ? 700 : 400 }}
                >
                  {cat}
                </span>
                {pressCat === cat && (
                  <motion.div
                    layoutId="pressFilter"
                    className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#1F4B43]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="md:hidden flex items-end gap-3">
          <div className="relative w-[42%] shrink-0" ref={mobileCatRef}>
            <label className="block text-[11px] text-[#999] mb-1" style={{ fontWeight: 600 }}>
              카테고리
            </label>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={mobileCatOpen}
              onClick={() => setMobileCatOpen((open) => !open)}
              className="flex w-full items-center justify-between px-3 py-2.5 bg-transparent border-b border-[#D6CCBC] text-sm text-[#1F2623] focus:outline-none"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 500 }}
            >
              <span>{pressCat}</span>
              <ChevronRight
                size={16}
                className={`text-[#555] transition-transform ${mobileCatOpen ? "rotate-[270deg]" : "rotate-90"}`}
              />
            </button>
            <AnimatePresence>
              {mobileCatOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 right-0 top-full mt-2 z-20 overflow-hidden rounded-xl border border-[#D6CCBC] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                >
                  <div role="listbox" className="py-1">
                    {PRESS_CATS.map((cat) => {
                      const isActive = pressCat === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setPressCat(cat);
                            setMobileCatOpen(false);
                          }}
                          className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors ${
                            isActive
                              ? "bg-[#1F4B43] text-white"
                              : "text-[#1F2623] hover:bg-[#F7F2E8]"
                          }`}
                          style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: isActive ? 600 : 500 }}
                        >
                          <span>{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C0B8A8]" />
            <input
              type="text"
              value={pressSearch}
              onChange={(e) => setPressSearch(e.target.value)}
              placeholder="검색..."
              className="w-full pl-9 pr-4 py-2.5 bg-transparent border-b border-[#D6CCBC] text-sm focus:outline-none focus:border-[#1F4B43] transition-colors placeholder:text-[#C0B8A8]"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[#7A8584]" style={{ fontFamily: "'Noto Serif KR', serif" }}>조건에 맞는 보도가 없습니다.</p>
        </div>
      )}

      {/* 2-column horizontal card grid */}
      <Anim key={`${pressCat}-${pressSearch}`} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
        {filtered.map((a) => (
          <motion.div key={a.id} variants={fadeUp}>
            {(() => {
              const isVideo = a.category === "영상" && (!!a.videoType);
              const isExternal = !!a.externalUrl;
              const youtubeId = a.videoType === "youtube" ? a.youtubeId : undefined;
              const cardTitle = isVideo ? (videoMeta[a.id]?.title || a.title) : a.title;
              const cardSource = isVideo ? (videoMeta[a.id]?.source || a.source) : a.source;
              const cardHref = isVideo
                ? (youtubeId ? `https://youtu.be/${youtubeId}` : "#")
                : (isExternal ? a.externalUrl! : `/community/press/${a.id}`);
              const CardTag = isVideo || isExternal ? "a" : Link;
              const cardProps = isVideo || isExternal
                ? { href: cardHref, target: "_blank", rel: "noreferrer" }
                : { to: cardHref };

              return (
                <CardTag {...cardProps} className="group flex gap-5">
              {/* Image */}
              <div className="w-[42%] shrink-0 rounded-lg overflow-hidden aspect-[4/3]">
                {a.videoType === "youtube" && a.youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${a.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${a.youtubeId}&controls=0&modestbranding=1&rel=0&playsinline=1`}
                    title={cardTitle}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    className="h-full w-full"
                  />
                ) : a.videoType === "mp4" && a.videoSrc ? (
                  <video
                    src={a.videoSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageWithFallback src={a.image} alt={cardTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                )}
              </div>
              {/* Text content */}
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div>
                  <span className="text-[12px] text-[#7A8584] mb-2 block" style={{ fontWeight: 500 }}>
                    {cardSource}
                  </span>
                  <h4 className="text-[#1F2623] text-[15px] leading-snug mb-2 group-hover:text-[#1F4B43] transition-colors line-clamp-2" style={{ fontWeight: 700 }}>
                    {cardTitle}
                  </h4>
                  <p className="text-[#8C8C8C] text-[13px] leading-relaxed line-clamp-2">
                    {a.excerpt}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-3 text-[12px] text-[#ABABAB]">
                  <span>{a.date}</span>
                  <span className="flex items-center gap-1 text-[#7A8584] group-hover:text-[#1F4B43] transition-colors" style={{ fontWeight: 500 }}>
                    {isVideo ? "영상 보기" : "이야기 보기"} <ArrowRight size={12} />
                  </span>
                </div>
              </div>
                </CardTag>
              );
            })()}
          </motion.div>
        ))}
      </Anim>
    </div>
  );
}

/* ─── 건강활동 및 모임 탭 (현대적·인터랙티브) ─── */
function HealthTab({ isSenior }: { isSenior: boolean }) {
  const [activeCat, setActiveCat] = useState("건강모임");
  const CATS = ["건강모임", "건강활동", "행사", "사진/후기"];
  const filtered = HEALTH_POSTS.filter((p) => p.cat === activeCat);
  const featured = HEALTH_POSTS[0];

  return (
    <div>
      {/* Featured card */}
      <Link to={`/community/health/${featured.id}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden mb-10 cursor-pointer group"
        >
          <div className="relative h-64 md:h-80 overflow-hidden">
            <ImageWithFallback src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            {featured.dday && (
              <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[#C87C5A] text-white text-xs" style={{ fontWeight: 700 }}>
                {featured.dday}
              </span>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <span className="inline-block px-3 py-1 rounded-md bg-white/20 backdrop-blur-sm text-white text-xs mb-3" style={{ fontWeight: 600 }}>
                {featured.cat}
              </span>
              <h3 className="text-white text-xl md:text-2xl mb-2" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}>
                {featured.title}
              </h3>
              <p className="text-white/70 text-sm line-clamp-2 max-w-lg">{featured.excerpt}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-white/50">
                <span className="flex items-center gap-1"><Clock size={12} />{featured.date}</span>
                <span className="flex items-center gap-1"><Eye size={12} />{featured.views}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Category filter */}
      <div className="mb-8">
        <div className="hidden md:flex flex-wrap items-center gap-2">
          {CATS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-all ${
                activeCat === cat
                  ? "bg-[#1F4B43] text-white shadow-md"
                  : "bg-white text-[#666] border border-[#E5E5E5] hover:border-[#1F4B43]/30"
              }`}
              style={{ fontWeight: activeCat === cat ? 600 : 400 }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="md:hidden flex items-center pb-4 border-b border-[#E5E0D8]">
          <div className="flex items-center flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide">
            {CATS.map((cat, idx) => (
              <div key={cat} className="flex items-center shrink-0">
                {idx > 0 && (
                  <div className="w-px h-3.5 bg-[#D6CCBC]/50 mx-0.5 shrink-0" />
                )}
                <button
                  onClick={() => setActiveCat(cat)}
                  className="relative px-3 py-2 cursor-pointer shrink-0"
                >
                  <span
                    className={`whitespace-nowrap text-xs tracking-wide transition-colors duration-300 ${
                      activeCat === cat ? "text-[#1F2623]" : "text-[#9A9E9D]"
                    }`}
                    style={{
                      fontFamily: "'Noto Serif KR', serif",
                      fontWeight: activeCat === cat ? 700 : 400,
                    }}
                  >
                    {cat}
                  </span>
                  {activeCat === cat && (
                    <motion.div
                      layoutId="healthCategoryUnderlineMobile"
                      className="absolute bottom-0.5 left-3 right-3 h-[1.5px] bg-[#1F4B43]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <Anim key={activeCat} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post) => (
          <motion.div key={post.id} variants={fadeUp}>
            <Link to={`/community/health/${post.id}`} className="group block rounded-2xl overflow-hidden bg-white border border-[#E5E5E5] hover:shadow-lg hover:border-[#1F4B43]/20 transition-all">
              <div className="relative h-44 overflow-hidden">
                <ImageWithFallback src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/90 text-xs text-[#1F4B43]" style={{ fontWeight: 600 }}>
                  {post.cat}
                </span>
                {post.dday && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#C87C5A] text-white text-xs" style={{ fontWeight: 700 }}>
                    {post.dday}
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-[#1F2623] mb-2 group-hover:text-[#1F4B43] transition-colors" style={{ fontWeight: 700 }}>
                  {post.title}
                </h3>
                <p className="text-sm text-[#777] leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-[#BBB]">
                  <span className="flex items-center gap-1"><Clock size={12} />{post.date}</span>
                  <span className="flex items-center gap-1"><Eye size={12} />{post.views}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </Anim>
    </div>
  );
}

/* ─── 조합 탭 (신문 스타일) ─── */
function CoopTab({ isSenior }: { isSenior: boolean }) {
  const featured = COOP_ARTICLES.find((a) => a.featured)!;
  const rest = COOP_ARTICLES.filter((a) => !a.featured);

  return (
    <div>
      {/* Masthead */}
      <div className="text-center border-b-[3px] border-[#1F2623] pb-4 mb-0">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="flex-1 h-px bg-[#1F2623]" />
          <p className="text-xs text-[#7A8584] tracking-widest" style={{ fontFamily: "'Noto Serif KR', serif" }}>
            조합 소식지
          </p>
          <div className="flex-1 h-px bg-[#1F2623]" />
        </div>
        <h2 className="text-[#1F2623] text-2xl md:text-3xl tracking-tight" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 900 }}>
          우리 조합 이야기
        </h2>
        <p className="text-xs text-[#999] mt-1" style={{ fontFamily: "'Noto Serif KR', serif" }}>
          조합원과 함께 만들어가는 소식
        </p>
      </div>
      <div className="h-px bg-[#1F2623]/20" />

      {/* Featured column article with image */}
      <Link to={`/community/coop/${featured.id}`} className="block py-8 border-b border-[#D6CCBC] group cursor-pointer">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={14} className="text-[#1F4B43]" />
          <span className="text-xs text-[#1F4B43] tracking-wider uppercase" style={{ fontWeight: 700 }}>{featured.column}</span>
        </div>
        {/* Featured image */}
        <div className="relative rounded-xl overflow-hidden mb-5 h-56 md:h-72">
          <ImageWithFallback src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
        <h3 className="text-[#1F2623] text-xl md:text-2xl mb-4 leading-snug group-hover:text-[#1F4B43] transition-colors" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 800 }}>
          {featured.title}
        </h3>
        {/* Drop cap style */}
        <div className="text-[#4A5553] leading-[1.9] text-sm md:text-base" style={{ fontFamily: "'Noto Serif KR', serif" }}>
          <span className="float-left text-5xl text-[#1F4B43] mr-3 mt-1 leading-none" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 900 }}>
            {featured.excerpt.charAt(0)}
          </span>
          {featured.excerpt.slice(1)}
        </div>
        <div className="flex items-center gap-3 mt-5 text-xs text-[#999]">
          <span style={{ fontWeight: 600 }}>{featured.author}</span>
          <span className="w-px h-3 bg-[#DDD]" />
          <span>{featured.date}</span>
        </div>
      </Link>

      {/* Other articles with images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {rest.map((a, i) => (
          <Link
            key={a.id}
            to={`/community/coop/${a.id}`}
            className={`block py-6 cursor-pointer group ${
              i % 2 === 0 ? "md:border-r md:border-[#D6CCBC] md:pr-6" : "md:pl-6"
            } ${i < rest.length - 2 ? "border-b border-[#EAE1D3]" : ""} ${i === rest.length - 2 ? "border-b border-[#EAE1D3] md:border-b-0" : ""}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] text-[#7A8584] tracking-wider uppercase" style={{ fontWeight: 600 }}>{a.column}</span>
            </div>
            {/* Thumbnail image */}
            <div className="relative rounded-lg overflow-hidden mb-3 h-36">
              <ImageWithFallback src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h4 className="text-[#1F2623] mb-2 leading-snug group-hover:text-[#1F4B43] transition-colors" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}>
              {a.title}
            </h4>
            <p className="text-[#666] text-xs leading-relaxed line-clamp-3 mb-3" style={{ fontFamily: "'Noto Serif KR', serif" }}>
              {a.excerpt}
            </p>
            <div className="flex items-center gap-2 text-[10px] text-[#999]">
              <span style={{ fontWeight: 600 }}>{a.author}</span>
              <span className="w-px h-2.5 bg-[#DDD]" />
              <span>{a.date}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── 오늘의 하루 탭 (신문 스타일, 일기/에세이) ─── */
function DailyTab({ isSenior }: { isSenior: boolean }) {
  return (
    <div>
      {/* Masthead */}
      <div className="text-center border-b-[3px] border-[#1F2623] pb-4 mb-0">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="flex-1 h-px bg-[#1F2623]" />
          <p className="text-xs text-[#7A8584] tracking-widest" style={{ fontFamily: "'Noto Serif KR', serif" }}>
            조합원이 전하는 일상
          </p>
          <div className="flex-1 h-px bg-[#1F2623]" />
        </div>
        <h2 className="text-[#1F2623] text-2xl md:text-3xl tracking-tight" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 900 }}>
          조합원 이야기
        </h2>
        <p className="text-xs text-[#999] mt-1" style={{ fontFamily: "'Noto Serif KR', serif" }}>
          강원 산골마을에서 보내온 소소한 이야기
        </p>
      </div>
      <div className="h-px bg-[#1F2623]/20 mb-8" />

      {/* Diary entries */}
      <div className="space-y-0">
        {DAILY_ENTRIES.map((entry, i) => {
          const mood = MOOD_MAP[entry.mood] || { emoji: "📝", color: "#999" };
          const isEven = i % 2 === 0;
          return (
            <Link key={entry.id} to={`/community/daily/${entry.id}`} className={`block py-8 ${i < DAILY_ENTRIES.length - 1 ? "border-b border-[#EAE1D3]" : ""} cursor-pointer group`}>
              {/* Date & location header — newspaper dateline style */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs tracking-wider text-[#7A8584] uppercase" style={{ fontWeight: 600 }}>
                  {entry.date}
                </span>
                <span className="w-px h-3 bg-[#D6CCBC]" />
                <span className="flex items-center gap-1 text-xs text-[#7A8584]">
                  <MapPin size={10} />
                  {entry.location}
                </span>
                <span className="w-px h-3 bg-[#D6CCBC]" />
                <span className="text-xs" style={{ color: mood.color, fontWeight: 600 }}>
                  {mood.emoji} {entry.mood}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-[#1F2623] text-lg md:text-xl mb-4 leading-snug group-hover:text-[#1F4B43] transition-colors" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}>
                {entry.title}
              </h3>

              {/* Image + Content layout — alternating sides */}
              <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-5`}>
                {/* Image */}
                <div className="w-full md:w-2/5 shrink-0">
                  <div className="relative rounded-lg overflow-hidden h-48 md:h-52">
                    <ImageWithFallback src={entry.image} alt={entry.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
                {/* Content with drop cap */}
                <div className="flex-1">
                  <div className="text-[#4A5553] text-sm leading-[1.95]" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                    <span className="float-left text-4xl text-[#1F4B43] mr-2.5 mt-0.5 leading-none" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 800 }}>
                      {entry.content.charAt(0)}
                    </span>
                    {entry.content.slice(1)}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-2 mt-4 text-xs text-[#999]">
                    <span className="w-5 h-px bg-[#D6CCBC]" />
                    <span style={{ fontWeight: 600, fontFamily: "'Noto Serif KR', serif" }}>{entry.author}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */
export function CommunityPage() {
  const { isSenior } = useSeniorMode();
  const location = useLocation();
  const tabRef = useRef<HTMLDivElement>(null);

  // Derive initial tab from URL path
  const getTabFromPath = (pathname: string): TabKey => {
    if (pathname.includes("/notices")) return "notices";
    if (pathname.includes("/community/press")) return "press";
    if (pathname.includes("/community/daily")) return "daily";
    if (pathname.includes("/community/resources")) return "coop";
    // default /community -> health
    if (pathname === "/community" || pathname.endsWith("/community")) return "health";
    return "notices";
  };

  const [activeTab, setActiveTab] = useState<TabKey>(() => getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const activeTabData = TABS.find((t) => t.key === activeTab)!;

  const TAB_TITLES: Record<TabKey, { title: string; subtitle: string }> = {
    notices: { title: "공지사항", subtitle: "조합의 주요 안내와 소식을 전합니다" },
    press: { title: "언론보도", subtitle: "외부 언론에 소개된 우리 조합 이야기" },
    health: { title: "건강활동 및 모임", subtitle: "함께 걷고, 배우고, 건강을 나누는 조합 커뮤니티" },
    coop: { title: "지금 우리조합은", subtitle: "조합의 운영 현황과 조합원 이야기" },
    daily: { title: "조합원 이야기", subtitle: "강원 산골마을 조합원들의 일상 이야기" },
  };

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
  };

  return (
    <div className="contents">
      {/* Hero */}
      <section className="bg-[#1F4B43] py-16 md:py-24 pb-28 md:pb-32" style={{ padding: undefined }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          
          <h1 className="text-white text-[28px] md:text-[36px] mb-3 text-center" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}>
            {TAB_TITLES[activeTab].title}
          </h1>
          <p className="text-white/50 text-center">{TAB_TITLES[activeTab].subtitle}</p>
        </div>
      </section>

      {/* Floating Tab Navigation — overlapping both sections */}
      <div
        className="relative z-10 -mt-12 mb-0"
        style={{
          background: "linear-gradient(to bottom, transparent 3rem, #FAF9F6 3rem)",
        }}
      >
        <div className="max-w-[900px] mx-auto px-5 sm:px-6">
          {/* Editorial newspaper-style navigation */}
          <nav className="rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] px-3 sm:px-6 py-3 sm:py-4 bg-[#f9f8f5]">
            {/* Desktop: horizontal editorial layout */}
            <div className="hidden md:flex items-center justify-center">
              {TABS.map((t, idx) => {
                const isActive = activeTab === t.key;
                return (
                  <div key={t.key} className="flex items-center">
                    {idx > 0 && (
                      <div className="w-px h-5 bg-[#D6CCBC]/60 mx-1" />
                    )}
                    <button
                      onClick={() => handleTabChange(t.key)}
                      className="relative px-5 py-2.5 cursor-pointer group"
                    >
                      <span
                        className={`relative z-10 text-sm tracking-wide transition-colors duration-300 ${ isActive ? "text-[#1F2623]" : "text-[#9A9E9D] hover:text-[#1F4B43]" } text-[#57736c]`}
                        style={{
                          fontFamily: "'Noto Serif KR', serif",
                          fontWeight: isActive ? 700 : 400,
                        }}
                      >
                        {t.label}
                      </span>
                      {/* Animated underline */}
                      {isActive && (
                        <motion.div
                          layoutId="editorialUnderline"
                          className="absolute bottom-0.5 left-5 right-5 h-[2px] bg-[#1F4B43]"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      {/* Hover underline (non-active) */}
                      {!isActive && (
                        <span className="absolute bottom-0.5 left-1/2 right-1/2 h-[1px] bg-[#1F4B43]/30 group-hover:left-5 group-hover:right-5 transition-all duration-300" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Mobile: single-line scroll layout */}
            <div
              className="flex md:hidden items-center flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide"
              ref={tabRef}
            >
              {TABS.map((t, idx) => {
                const isActive = activeTab === t.key;
                return (
                  <div key={t.key} className="flex items-center shrink-0">
                    {idx > 0 && (
                      <div className="w-px h-3.5 bg-[#D6CCBC]/50 mx-0.5 shrink-0" />
                    )}
                    <button
                      onClick={() => handleTabChange(t.key)}
                      className="relative px-3 py-2 cursor-pointer shrink-0"
                    >
                      <span
                        className={`whitespace-nowrap text-xs tracking-wide transition-colors duration-300 ${
                          isActive
                            ? "text-[#1F2623]"
                            : "text-[#9A9E9D]"
                        }`}
                        style={{
                          fontFamily: "'Noto Serif KR', serif",
                          fontWeight: isActive ? 700 : 400,
                        }}
                      >
                        {t.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="editorialUnderlineMobile"
                          className="absolute bottom-0.5 left-3 right-3 h-[1.5px] bg-[#1F4B43]"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Content area */}
      <section
        className="pt-6 md:pt-10 pb-10 md:pb-16 bg-[#FAF9F6]"
      >
        <div className={`mx-auto px-5 sm:px-6 ${
          activeTab === "coop" || activeTab === "daily"
            ? "max-w-[900px]"
            : "max-w-[1100px]"
        }`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {activeTab === "notices" && <NoticesTab isSenior={isSenior} />}
              {activeTab === "press" && <PressTab isSenior={isSenior} />}
              {activeTab === "health" && <HealthTab isSenior={isSenior} />}
              {activeTab === "coop" && <CoopTab isSenior={isSenior} />}
              {activeTab === "daily" && <DailyTab isSenior={isSenior} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
