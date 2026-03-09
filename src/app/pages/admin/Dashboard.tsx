import { Link } from "react-router";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import {
  UserPlus, Wallet, CalendarDays, ClipboardList, MessageSquare, PartyPopper,
  ArrowRight, CheckCircle2, AlertTriangle, Clock, ChevronRight, TrendingUp
} from "lucide-react";
import { StatusBadge } from "../../components/admin/AdminBadge";
import { useDashboardSummaryQuery } from "../../hooks/admin/useAdminQueries";

/* ─── Mock Data ─── */
const KPI_CARDS = [
  { label: "가입 승인 대기", value: 3, icon: UserPlus, link: "/admin/applications", accent: "#1F6B78", bg: "#E4F0F2" },
  { label: "입금 미매칭", value: 2, icon: Wallet, link: "/admin/transactions", accent: "#7A6C55", bg: "#F2EBDD" },
  { label: "오늘 서비스 일정", value: 7, icon: CalendarDays, link: "/admin/calendar", accent: "#1F6B78", bg: "#E4F0F2" },
  { label: "미배정 서비스", value: 4, icon: ClipboardList, link: "/admin/services", accent: "#7A6C55", bg: "#F2EBDD" },
  { label: "답변대기 문의", value: 5, icon: MessageSquare, link: "/admin/inquiries", accent: "#2D7A5E", bg: "#E8F5EE" },
  { label: "이번주 행사", value: 2, icon: PartyPopper, link: "/admin/events", accent: "#2D7A5E", bg: "#E8F5EE" },
];

const QUEUE_URGENT = [
  { id: "SVC-089", text: "김○○ 방문진료 - 미배정 (접수  23시간)", link: "/admin/services" },
  { id: "INQ-003", text: "이○○ 방문진료 가능 지역 문의 - 24시간 내 답변 권장", link: "/admin/inquiries" },
];
const QUEUE_TODAY = [
  { id: "APP-006", text: "정태호 가입신청 - 입금 확인 필요", link: "/admin/applications" },
  { id: "APP-005", text: "이철수 가입신청 - 서류 검토 대기", link: "/admin/applications" },
  { id: "TXN-012", text: "미매칭 입금 2건 - 수동 매칭 필요", link: "/admin/transactions" },
];
const QUEUE_LATER = [
  { id: "SET-001", text: "서비스 카탈로그 이미지 업데이트", link: "/admin/catalog" },
  { id: "SET-002", text: "3월 운영 리포트 생성", link: "/admin/reports" },
];

const WEEKLY_DATA = [
  { day: "월", 재택의료: 3, 돌봄: 5, 건강공동체: 2 },
  { day: "화", 재택의료: 4, 돌봄: 3, 건강공동체: 4 },
  { day: "수", 재택의료: 2, 돌봄: 6, 건강공동체: 3 },
  { day: "목", 재택의료: 5, 돌봄: 4, 건강공동체: 5 },
  { day: "금", 재택의료: 3, 돌봄: 5, 건강공동체: 2 },
];

const MONTHLY_TREND = [
  { month: "10월", 신청: 42, 완료: 38 },
  { month: "11월", 신청: 48, 완료: 44 },
  { month: "12월", 신청: 35, 완료: 33 },
  { month: "1월", 신청: 52, 완료: 47 },
  { month: "2월", 신청: 58, 완료: 51 },
  { month: "3월", 신청: 15, 완료: 8 },
];

const RECENT_ACTIVITY = [
  { id: "SVC-089", name: "김○○", service: "재택의료", status: "접수됨", time: "30분 전" },
  { id: "SVC-088", name: "박○○", service: "돌봄", status: "확인중", time: "1시간 전" },
  { id: "SVC-087", name: "이○○", service: "건강공동체", status: "일정확정", time: "2시간 전" },
  { id: "SVC-086", name: "최○○", service: "재택의료", status: "진행중", time: "3시간 전" },
  { id: "SVC-085", name: "정○○", service: "돌봄", status: "완료", time: "4시간 전" },
];

const TODAY_SCHEDULE = [
  { time: "09:00", name: "김○○", service: "방문진료", area: "횡성읍", staff: "의사 정OO" },
  { time: "10:30", name: "박○○", service: "돌봄 방문", area: "우천면", staff: "돌봄사 최OO" },
  { time: "14:00", name: "이○○", service: "재활치료", area: "횡성읍", staff: "치료사 김OO" },
  { time: "15:30", name: "최○○", service: "건강교실", area: "마을회관", staff: "강사 박OO" },
  { time: "16:00", name: "한○○", service: "방문간호", area: "갑천면", staff: "간호사 이OO" },
  { time: "17:00", name: "윤○○", service: "정서지원", area: "공근면", staff: "돌봄사 송OO" },
  { time: "17:30", name: "오○○", service: "운동프로그램", area: "횡성읍", staff: "강사 박OO" },
];

const SHORTCUTS = [
  { label: "가입 승인 대기", icon: UserPlus, link: "/admin/applications", count: 3 },
  { label: "미매칭 입금", icon: Wallet, link: "/admin/transactions", count: 2 },
  { label: "서비스 미배정", icon: ClipboardList, link: "/admin/services", count: 4 },
  { label: "문의 인박스", icon: MessageSquare, link: "/admin/inquiries", count: 5 },
];

export function AdminDashboard() {
  const { data: summary } = useDashboardSummaryQuery();
  const kpiCards = KPI_CARDS.map((kpi) => {
    if (!summary) return kpi;
    if (kpi.label === "가입 승인 대기") return { ...kpi, value: summary.applicationsPending };
    if (kpi.label === "입금 미매칭") return { ...kpi, value: summary.unmatchedTransactions };
    if (kpi.label === "답변대기 문의") return { ...kpi, value: summary.inquiriesPending };
    return kpi;
  });

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={kpi.label}
              to={kpi.link}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
                  <Icon size={18} style={{ color: kpi.accent }} />
                </div>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <p className="text-2xl text-[#111827]" style={{ fontWeight: 700 }}>{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Task Queue + Quick Shortcuts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Task Queue */}
        <div className="xl:col-span-2 bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm text-[#111827] mb-4" style={{ fontWeight: 700 }}>오늘의 작업 큐</h3>
          <div className="space-y-4">
            {/* Urgent */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-[#111827]" />
                <span className="text-xs text-[#111827]" style={{ fontWeight: 700 }}>지금 처리하면 좋은 것</span>
                <span className="text-[10px] bg-[#111827] text-white px-1.5 py-0.5 rounded-full" style={{ fontWeight: 600 }}>{QUEUE_URGENT.length}</span>
              </div>
              <div className="space-y-1.5">
                {QUEUE_URGENT.map((q) => (
                  <Link key={q.id} to={q.link} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group">
                    <span className="text-xs text-gray-400 shrink-0 w-16">{q.id}</span>
                    <span className="text-sm text-[#374151] flex-1">{q.text}</span>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-[#1F6B78] shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Today */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-[#1F6B78]" />
                <span className="text-xs text-[#1F6B78]" style={{ fontWeight: 700 }}>오늘 중 처리</span>
                <span className="text-[10px] bg-[#1F6B78] text-white px-1.5 py-0.5 rounded-full" style={{ fontWeight: 600 }}>{QUEUE_TODAY.length}</span>
              </div>
              <div className="space-y-1.5">
                {QUEUE_TODAY.map((q) => (
                  <Link key={q.id} to={q.link} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#F8F9FA] hover:bg-[#1F6B78]/5 transition-colors group">
                    <span className="text-xs text-gray-400 shrink-0 w-16">{q.id}</span>
                    <span className="text-sm text-[#374151] flex-1">{q.text}</span>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-[#1F6B78] shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Later */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={14} className="text-[#67B89A]" />
                <span className="text-xs text-[#67B89A]" style={{ fontWeight: 700 }}>여유 있을 때</span>
              </div>
              <div className="space-y-1.5">
                {QUEUE_LATER.map((q) => (
                  <Link key={q.id} to={q.link} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#F8F9FA] hover:bg-[#67B89A]/5 transition-colors group">
                    <span className="text-xs text-gray-400 shrink-0 w-16">{q.id}</span>
                    <span className="text-sm text-[#374151] flex-1">{q.text}</span>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-[#67B89A] shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="text-sm text-[#111827] mb-4" style={{ fontWeight: 700 }}>빠른 바로가기</h3>
            <div className="grid grid-cols-2 gap-2">
              {SHORTCUTS.map((s) => {
                const Icon = s.icon;
                return (
                  <Link
                    key={s.label}
                    to={s.link}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-[#F8F9FA] hover:bg-[#1F6B78]/5 transition-colors group"
                  >
                    <div className="relative">
                      <Icon size={20} className="text-[#1F6B78]" />
                      {s.count > 0 && (
                        <span className="absolute -top-1.5 -right-2.5 text-[10px] bg-[#1F6B78] text-white w-4 h-4 rounded-full flex items-center justify-center" style={{ fontWeight: 700 }}>
                          {s.count}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-600 text-center" style={{ fontWeight: 500 }}>{s.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mini Calendar */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-[#111827]" style={{ fontWeight: 700 }}>오늘 일정</h3>
              <Link to="/admin/calendar" className="text-xs text-[#1F6B78] hover:underline" style={{ fontWeight: 600 }}>
                캘린더 열기 →
              </Link>
            </div>
            <div className="space-y-2">
              {TODAY_SCHEDULE.slice(0, 4).map((s, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-[#F8F9FA]">
                  <span className="text-xs text-[#1F6B78] shrink-0 w-10 mt-0.5" style={{ fontWeight: 700 }}>{s.time}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#111827] truncate" style={{ fontWeight: 600 }}>{s.name} — {s.service}</p>
                    <p className="text-[11px] text-gray-400 truncate">{s.area} · {s.staff}</p>
                  </div>
                </div>
              ))}
              {TODAY_SCHEDULE.length > 4 && (
                <p className="text-xs text-gray-400 text-center pt-1">+{TODAY_SCHEDULE.length - 4}건 더</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm text-[#111827] mb-4" style={{ fontWeight: 700 }}>이번 주 서비스별 신청</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={WEEKLY_DATA} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar name="bar-재택의료" dataKey="재택의료" fill="#1F6B78" radius={[4, 4, 0, 0]} />
              <Bar name="bar-돌봄" dataKey="돌봄" fill="#67B89A" radius={[4, 4, 0, 0]} />
              <Bar name="bar-건강공동체" dataKey="건강공동체" fill="#C9B99A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm text-[#111827] mb-4" style={{ fontWeight: 700 }}>월별 신청/완료 추이</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line name="line-신청" type="monotone" dataKey="신청" stroke="#1F6B78" strokeWidth={2} dot={{ r: 3 }} />
              <Line name="line-완료" type="monotone" dataKey="완료" stroke="#67B89A" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-[#111827]" style={{ fontWeight: 700 }}>최근 활동</h3>
          <Link to="/admin/services" className="text-xs text-[#1F6B78]" style={{ fontWeight: 600 }}>전체 보기 →</Link>
        </div>
        <div className="space-y-2">
          {RECENT_ACTIVITY.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-[#F8F9FA] hover:bg-[#1F6B78]/5 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1F6B78]/10 flex items-center justify-center text-xs text-[#1F6B78]" style={{ fontWeight: 600 }}>
                  {r.name[0]}
                </div>
                <div>
                  <p className="text-sm text-[#111827]" style={{ fontWeight: 500 }}>{r.name} · {r.service}</p>
                  <p className="text-xs text-gray-400">{r.id} · {r.time}</p>
                </div>
              </div>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
