import { useState } from "react";
import {
  CalendarDays, ChevronLeft, ChevronRight, Plus, Download, Search,
  Clock, User, MapPin, AlertTriangle, Phone, CheckCircle2, X, Filter
} from "lucide-react";
import { Badge, StatusBadge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField, DetailTabs } from "../../components/admin/AdminDetailPanel";
import { ConfirmModal } from "../../components/admin/AdminModal";
import { useLargeMode } from "../../components/layouts/AdminLayout";

const VIEWS = ["일", "주", "월", "담당자별"] as const;
type ViewType = (typeof VIEWS)[number];

const STAFF = ["전체", "김간호", "이상담", "박의료", "최행정"];
const SERVICES = ["전체", "방문간호", "방문건강관리", "만성질환관리", "재활운동", "건강상담"];
const STATUSES_FILTER = ["전체", "확정", "대기", "미배정", "취소"];

const HOURS = Array.from({ length: 10 }, (_, i) => `${i + 8}:00`);
const WEEKDAYS = ["월", "화", "수", "목", "금"];

interface CalEvent {
  id: string;
  name: string;
  service: string;
  region: string;
  staff: string;
  status: string;
  time: string;
  day: number; // 0=Mon
  hour: number; // 8-17
  duration: number;
  conflict?: boolean;
}

const MOCK_EVENTS: CalEvent[] = [
  { id: "E-001", name: "김○○", service: "방문간호", region: "횡성읍", staff: "김간호", status: "확정", time: "09:00-10:00", day: 0, hour: 9, duration: 1 },
  { id: "E-002", name: "이○○", service: "건강상담", region: "안흥면", staff: "이상담", status: "확정", time: "10:00-11:00", day: 0, hour: 10, duration: 1 },
  { id: "E-003", name: "박○○", service: "재활운동", region: "둔내면", staff: "박의료", status: "대기", time: "09:30-10:30", day: 1, hour: 9, duration: 1 },
  { id: "E-004", name: "최○○", service: "방문건강관리", region: "공근면", staff: "김간호", status: "확정", time: "14:00-15:30", day: 1, hour: 14, duration: 2 },
  { id: "E-005", name: "정○○", service: "만성질환관리", region: "횡성읍", staff: "이상담", status: "미배정", time: "11:00-12:00", day: 2, hour: 11, duration: 1, conflict: true },
  { id: "E-006", name: "한○○", service: "건강상담", region: "갑천면", staff: "이상담", status: "확정", time: "11:00-12:00", day: 2, hour: 11, duration: 1 },
  { id: "E-007", name: "오○○", service: "방문간호", region: "청일면", staff: "박의료", status: "대기", time: "15:00-16:00", day: 3, hour: 15, duration: 1 },
  { id: "E-008", name: "서○○", service: "재활운동", region: "횡성읍", staff: "최행정", status: "확정", time: "10:00-11:00", day: 4, hour: 10, duration: 1 },
  { id: "E-009", name: "윤○○", service: "방문건강관리", region: "안흥면", staff: "김간호", status: "취소", time: "16:00-17:00", day: 3, hour: 16, duration: 1 },
  { id: "E-010", name: "장○○", service: "만성질환관리", region: "둔내면", staff: "박의료", status: "확정", time: "13:00-14:00", day: 4, hour: 13, duration: 1 },
];

const SAVED_VIEWS = ["오늘 일정", "이번주", "미배정", "대기열", "지연", "지역별"];

const statusColor: Record<string, string> = {
  "확정": "bg-[#67B89A]/20 border-[#67B89A]/30 text-[#2D7A5E]",
  "대기": "bg-[#F2EBDD] border-[#E5D9C3] text-[#7A6C55]",
  "미배정": "bg-[#1F6B78]/10 border-[#1F6B78]/20 text-[#1F6B78]",
  "취소": "bg-gray-100 border-gray-200 text-gray-500",
};

export function AdminCalendarPage() {
  const { isLarge } = useLargeMode();
  const [view, setView] = useState<ViewType>("주");
  const [selectedEvent, setSelectedEvent] = useState<CalEvent | null>(null);
  const [filterStaff, setFilterStaff] = useState("전체");
  const [filterService, setFilterService] = useState("전체");
  const [filterStatus, setFilterStatus] = useState("전체");
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [detailTab, setDetailTab] = useState("일정 정보");
  const [moveModal, setMoveModal] = useState(false);

  const filtered = MOCK_EVENTS.filter((e) => {
    if (filterStaff !== "전체" && e.staff !== filterStaff) return false;
    if (filterService !== "전체" && e.service !== filterService) return false;
    if (filterStatus !== "전체" && e.status !== filterStatus) return false;
    return true;
  });

  const todaySummary = MOCK_EVENTS.filter((e) => e.day === 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className={`${isLarge ? "text-xl" : "text-lg"} text-[#111827]`} style={{ fontWeight: 700 }}>서비스 캘린더</h1>
          <p className="text-xs text-gray-400 mt-0.5">서비스 일정 확정·변경·담당자 배정을 관리합니다</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65] flex items-center gap-1.5" style={{ fontWeight: 600 }}>
            <Plus size={14} /> 일정 추가
          </button>
          <button className="px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-[#374151] cursor-pointer hover:bg-gray-50 flex items-center gap-1.5" style={{ fontWeight: 500 }}>
            <Download size={14} /> 내보내기
          </button>
        </div>
      </div>

      {/* View tabs + Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {VIEWS.map((v) => (
            <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer ${view === v ? "bg-[#1F6B78] text-white" : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"}`} style={{ fontWeight: view === v ? 600 : 400 }}>
              {v}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded hover:bg-gray-100 cursor-pointer"><ChevronLeft size={16} className="text-gray-500" /></button>
          <span className="text-sm text-[#111827]" style={{ fontWeight: 600 }}>2026년 3월 2일 ~ 6일</span>
          <button className="p-1.5 rounded hover:bg-gray-100 cursor-pointer"><ChevronRight size={16} className="text-gray-500" /></button>
          <button className="px-2.5 py-1 rounded-lg bg-[#1F6B78]/10 text-[#1F6B78] text-xs cursor-pointer" style={{ fontWeight: 600 }}>오늘</button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Left Panel */}
        {showLeftPanel && (
          <div className="hidden lg:block w-56 shrink-0 space-y-3">
            {/* Saved views */}
            <div className="bg-white rounded-xl shadow-sm p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2" style={{ fontWeight: 600 }}>저장뷰</p>
              <div className="space-y-0.5">
                {SAVED_VIEWS.map((sv) => (
                  <button key={sv} className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-gray-600 hover:bg-[#F8F9FC] cursor-pointer" style={{ fontWeight: 400 }}>
                    {sv}
                  </button>
                ))}
              </div>
            </div>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-3 space-y-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider" style={{ fontWeight: 600 }}>필터</p>
              <MiniSelect label="담당자" value={filterStaff} options={STAFF} onChange={setFilterStaff} />
              <MiniSelect label="서비스" value={filterService} options={SERVICES} onChange={setFilterService} />
              <MiniSelect label="상태" value={filterStatus} options={STATUSES_FILTER} onChange={setFilterStatus} />
            </div>
            {/* Today summary */}
            <div className="bg-white rounded-xl shadow-sm p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2" style={{ fontWeight: 600 }}>오늘 요약 ({todaySummary.length}건)</p>
              <div className="space-y-1.5">
                {todaySummary.map((e) => (
                  <button key={e.id} onClick={() => setSelectedEvent(e)} className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#F8F9FC] cursor-pointer">
                    <p className="text-xs text-[#111827]" style={{ fontWeight: 500 }}>{e.time} {e.name}</p>
                    <p className="text-[10px] text-gray-400">{e.service} · {e.staff}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Calendar Grid (Week view) */}
        <div className="flex-1 min-w-0">
          {/* Desktop Week Grid */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#F8F9FC]">
                    <th className="w-16 py-2 text-gray-400 border-r border-gray-100" style={{ fontWeight: 600 }}>시간</th>
                    {WEEKDAYS.map((d, i) => (
                      <th key={d} className="py-2 text-gray-600 border-r border-gray-100 last:border-r-0" style={{ fontWeight: 600 }}>
                        {d} <span className="text-gray-400">{i + 2}일</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HOURS.map((hour, hi) => (
                    <tr key={hour} className="border-t border-gray-50">
                      <td className="py-3 px-2 text-gray-400 text-center border-r border-gray-100 align-top">{hour}</td>
                      {WEEKDAYS.map((_, di) => {
                        const events = filtered.filter((e) => e.day === di && e.hour === hi + 8);
                        return (
                          <td key={di} className="py-1 px-1 border-r border-gray-100 last:border-r-0 align-top h-14 relative">
                            {events.map((ev) => (
                              <button
                                key={ev.id}
                                onClick={() => setSelectedEvent(ev)}
                                className={`w-full text-left px-2 py-1 rounded border text-[11px] mb-0.5 cursor-pointer ${statusColor[ev.status] || "bg-gray-50 border-gray-200 text-gray-600"} ${selectedEvent?.id === ev.id ? "ring-2 ring-[#1F6B78]/40" : ""}`}
                              >
                                <span style={{ fontWeight: 500 }}>{ev.name}</span>
                                <span className="text-[10px] opacity-70 ml-1">{ev.service}</span>
                                {ev.conflict && <AlertTriangle size={10} className="inline ml-1 text-[#7A6C55]" />}
                              </button>
                            ))}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile: Today list */}
          <div className="md:hidden space-y-2">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {WEEKDAYS.map((d, i) => (
                <button key={d} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap cursor-pointer ${i === 0 ? "bg-[#1F6B78] text-white" : "bg-white text-gray-500 border border-gray-200"}`} style={{ fontWeight: i === 0 ? 600 : 400 }}>
                  {d} {i + 2}일
                </button>
              ))}
            </div>
            {filtered.filter((e) => e.day === 0).map((ev) => (
              <div key={ev.id} onClick={() => setSelectedEvent(ev)} className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer ${selectedEvent?.id === ev.id ? "ring-2 ring-[#1F6B78]/30" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#111827]" style={{ fontWeight: 600 }}>{ev.time}</span>
                  <Badge variant={ev.status === "확정" ? "secondary" : ev.status === "대기" ? "accent" : "neutral"}>{ev.status}</Badge>
                </div>
                <p className="text-sm text-[#374151]">{ev.name} — {ev.service}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span><User size={11} className="inline mr-0.5" />{ev.staff}</span>
                  <span><MapPin size={11} className="inline mr-0.5" />{ev.region}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedEvent && (
          <AdminDetailPanel title={`${selectedEvent.name} — ${selectedEvent.service}`} onClose={() => setSelectedEvent(null)} width="w-full xl:w-[400px]">
            <DetailTabs tabs={["일정 정보", "체크리스트", "메모"]} active={detailTab} onChange={setDetailTab} />

            {detailTab === "일정 정보" && (
              <div className="space-y-4">
                <DetailField label="일정">
                  <p className="text-sm text-[#374151]">2026년 3월 {selectedEvent.day + 2}일 ({WEEKDAYS[selectedEvent.day]}) {selectedEvent.time}</p>
                </DetailField>
                <DetailField label="담당자">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#374151]">{selectedEvent.staff}</span>
                    <button className="text-xs text-[#1F6B78] cursor-pointer hover:underline">변경</button>
                  </div>
                </DetailField>
                <DetailField label="지역">
                  <p className="text-sm text-[#374151]">{selectedEvent.region}</p>
                </DetailField>
                <DetailField label="상태">
                  <select className="px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20 cursor-pointer" defaultValue={selectedEvent.status}>
                    <option>확정</option><option>대기</option><option>미배정</option><option>취소</option>
                  </select>
                </DetailField>
                {selectedEvent.conflict && (
                  <div className="bg-[#F2EBDD]/50 rounded-lg p-3 flex items-start gap-2">
                    <AlertTriangle size={14} className="text-[#7A6C55] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#7A6C55]" style={{ fontWeight: 600 }}>일정 충돌 감지</p>
                      <p className="text-xs text-[#7A6C55] mt-0.5">같은 시간에 다른 일정이 있습니다.</p>
                      <button className="text-xs text-[#1F6B78] mt-1 cursor-pointer hover:underline">대안 슬롯 보기</button>
                    </div>
                  </div>
                )}
                <button onClick={() => setMoveModal(true)} className="w-full py-2 rounded-lg border border-gray-200 text-xs text-[#374151] hover:bg-gray-50 cursor-pointer" style={{ fontWeight: 500 }}>
                  일정 변경
                </button>
              </div>
            )}
            {detailTab === "체크리스트" && (
              <div className="space-y-2">
                {["연락 완료", "준비물 안내", "주소 확인", "특이사항 전달"].map((c) => (
                  <label key={c} className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#F8F9FC] cursor-pointer">
                    <input type="checkbox" className="accent-[#67B89A]" /><span className="text-sm text-[#374151]">{c}</span>
                  </label>
                ))}
              </div>
            )}
            {detailTab === "메모" && (
              <div className="space-y-3">
                <textarea placeholder="내부 메모..." rows={3} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
                <button className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65]" style={{ fontWeight: 600 }}>저장</button>
              </div>
            )}
          </AdminDetailPanel>
        )}
      </div>

      <ConfirmModal open={moveModal} onClose={() => setMoveModal(false)} onConfirm={() => { alert("일정이 변경되었습니다. (Supabase 연동 후 실제 반영)"); setMoveModal(false); }} title="일정 변경 확인" message="일정 변경을 적용하시겠습니까?" confirmLabel="변경 적용" />
    </div>
  );
}

function MiniSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] text-gray-400 mb-1" style={{ fontWeight: 600 }}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-[#F8F9FC] border border-gray-200 text-xs focus:outline-none cursor-pointer">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
