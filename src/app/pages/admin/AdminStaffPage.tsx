import { useState } from "react";
import {
  UserCog, Plus, Edit, Search, Clock, Calendar, Settings, ChevronDown
} from "lucide-react";
import { Badge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField, DetailTabs } from "../../components/admin/AdminDetailPanel";
import { useLargeMode } from "../../components/layouts/AdminLayout";

const TABS = ["담당자 목록", "근무/가용 시간", "용량 설정", "예외/휴무", "배정 규칙"] as const;

interface Staff {
  id: string; name: string; role: string; services: string[]; schedule: string;
  maxPerDay: number; active: boolean; todayAssigned: number;
}

const MOCK: Staff[] = [
  { id: "S-001", name: "김간호", role: "간호", services: ["방문간호", "방문건강관리"], schedule: "월~금 09:00-18:00", maxPerDay: 6, active: true, todayAssigned: 4 },
  { id: "S-002", name: "이상담", role: "상담", services: ["건강상담", "만성질환관리"], schedule: "월~금 09:00-18:00", maxPerDay: 8, active: true, todayAssigned: 5 },
  { id: "S-003", name: "박의료", role: "의료", services: ["재활운동", "방문건강관리", "만성질환관리"], schedule: "월~목 09:00-17:00", maxPerDay: 5, active: true, todayAssigned: 3 },
  { id: "S-004", name: "최행정", role: "행정", services: ["건강상담"], schedule: "월~금 09:00-18:00", maxPerDay: 10, active: true, todayAssigned: 2 },
  { id: "S-005", name: "정보조", role: "간호", services: ["방문간호"], schedule: "화~토 10:00-19:00", maxPerDay: 5, active: false, todayAssigned: 0 },
];

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];
const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const EXCEPTIONS = [
  { id: 1, staff: "박의료", type: "휴무", date: "2026-03-10", reason: "개인 휴가" },
  { id: 2, staff: "김간호", type: "반차", date: "2026-03-12", reason: "오전 병원 방문" },
  { id: 3, staff: "이상담", type: "휴무", date: "2026-03-14", reason: "연차" },
];

export function AdminStaffPage() {
  const { isLarge } = useLargeMode();
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Staff | null>(null);
  const [detailTab, setDetailTab] = useState("정보");

  const filtered = MOCK.filter((s) => !search || s.name.includes(search) || s.role.includes(search));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className={`${isLarge ? "text-xl" : "text-lg"} text-[#111827]`} style={{ fontWeight: 700 }}>담당자/용량</h1>
          <p className="text-xs text-gray-400 mt-0.5">담당자 관리, 근무 시간, 하루 처리량, 예외 일정</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65] flex items-center gap-1.5" style={{ fontWeight: 600 }}><Plus size={14} />담당자 추가</button>
          <button className="px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-[#374151] cursor-pointer hover:bg-gray-50 flex items-center gap-1.5" style={{ fontWeight: 500 }}><Clock size={14} />슬롯 템플릿</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-gray-200">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-2.5 text-xs whitespace-nowrap cursor-pointer border-b-2 ${tab === t ? "border-[#1F6B78] text-[#1F6B78]" : "border-transparent text-gray-400 hover:text-gray-600"}`} style={{ fontWeight: tab === t ? 600 : 400 }}>{t}</button>
        ))}
      </div>

      {tab === "담당자 목록" && (
        <div className="flex gap-4">
          <div className="flex-1 min-w-0 space-y-3">
            <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="이름, 역할 검색..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
              </div>
              <span className="text-xs text-gray-400 ml-auto">{filtered.length}명</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#F8F9FC]">
                  <tr>
                    {["이름", "역할", "담당 서비스", "근무 요일/시간", "하루 최대", "오늘 배정", "상태", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-[#9CA3AF]" style={{ fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} onClick={() => setSelected(s)} className={`border-t border-gray-50 cursor-pointer ${selected?.id === s.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FC]/50"}`}>
                      <td className="px-4 py-3 text-[#111827]" style={{ fontWeight: 600 }}>{s.name}</td>
                      <td className="px-4 py-3"><Badge variant="primary">{s.role}</Badge></td>
                      <td className="px-4 py-3"><div className="flex gap-1 flex-wrap">{s.services.map((sv) => <span key={sv} className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px]">{sv}</span>)}</div></td>
                      <td className="px-4 py-3 text-xs text-gray-500">{s.schedule}</td>
                      <td className="px-4 py-3 text-[#111827] text-center" style={{ fontWeight: 600 }}>{s.maxPerDay}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${s.todayAssigned >= s.maxPerDay ? "bg-[#F2EBDD] text-[#7A6C55]" : "bg-[#67B89A]/10 text-[#2D7A5E]"}`} style={{ fontWeight: 600 }}>{s.todayAssigned}/{s.maxPerDay}</span>
                      </td>
                      <td className="px-4 py-3"><Badge variant={s.active ? "secondary" : "neutral"}>{s.active ? "활성" : "비활성"}</Badge></td>
                      <td className="px-4 py-3"><button className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"><Edit size={13} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {selected && (
            <AdminDetailPanel title={selected.name} onClose={() => setSelected(null)} width="w-full xl:w-[380px]">
              <div className="bg-[#F8F9FC] rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1F6B78]/10 flex items-center justify-center text-[#1F6B78]" style={{ fontWeight: 700 }}>{selected.name[0]}</div>
                <div>
                  <p className="text-sm text-[#111827]" style={{ fontWeight: 600 }}>{selected.name}</p>
                  <p className="text-xs text-gray-400">{selected.role} · {selected.schedule}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#67B89A]/10 rounded-lg p-3 text-center">
                  <p className="text-lg text-[#2D7A5E]" style={{ fontWeight: 700 }}>{selected.todayAssigned}</p>
                  <p className="text-[10px] text-[#2D7A5E]">오늘 배정</p>
                </div>
                <div className="bg-[#1F6B78]/10 rounded-lg p-3 text-center">
                  <p className="text-lg text-[#1F6B78]" style={{ fontWeight: 700 }}>{selected.maxPerDay - selected.todayAssigned}</p>
                  <p className="text-[10px] text-[#1F6B78]">남은 용량</p>
                </div>
              </div>
              <DetailField label="담당 서비스">
                <div className="flex gap-1 flex-wrap">{selected.services.map((sv) => <Badge key={sv} variant="primaryLight">{sv}</Badge>)}</div>
              </DetailField>
              <button className="w-full py-2 rounded-lg border border-gray-200 text-xs text-[#374151] hover:bg-gray-50 cursor-pointer" style={{ fontWeight: 500 }}>예외 일정 추가</button>
            </AdminDetailPanel>
          )}
        </div>
      )}

      {tab === "근무/가용 시간" && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left px-3 py-2 text-gray-400" style={{ fontWeight: 600 }}>시간</th>
                  {WEEKDAYS.map((d) => <th key={d} className="px-3 py-2 text-gray-600" style={{ fontWeight: 600 }}>{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((t) => (
                  <tr key={t} className="border-t border-gray-50">
                    <td className="px-3 py-2 text-gray-400">{t}</td>
                    {WEEKDAYS.map((d, i) => (
                      <td key={d} className="px-1 py-1 text-center">
                        <div className={`rounded py-1.5 ${i < 5 && t >= "09:00" && t <= "17:00" ? "bg-[#67B89A]/15 text-[#2D7A5E]" : "bg-gray-50 text-gray-300"}`}>
                          {i < 5 && t >= "09:00" && t <= "17:00" ? "✓" : "-"}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <select className="px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-xs cursor-pointer focus:outline-none"><option>슬롯 템플릿: 1시간</option><option>슬롯 템플릿: 30분</option></select>
            <button className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65]" style={{ fontWeight: 600 }}>저장</button>
          </div>
        </div>
      )}

      {tab === "용량 설정" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-[#111827] mb-3" style={{ fontWeight: 600 }}>서비스 종류별 기본 처리량</p>
            <div className="space-y-2">
              {["방문간호", "건강상담", "방문건강관리", "재활운동", "만성질환관리"].map((s, i) => (
                <div key={s} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-[#374151] flex-1">{s}</span>
                  <input type="number" defaultValue={[6, 8, 5, 4, 6][i]} className="w-20 px-3 py-1.5 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
                  <span className="text-xs text-gray-400">건/일</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-[#111827] mb-3" style={{ fontWeight: 600 }}>용량 초과 시 정책</p>
            <div className="space-y-3">
              {[{ label: "대기열로 자동 이동", desc: "용량 초과 시 대기열에 추가", on: true }, { label: "관리자 승인 필요", desc: "초과 건은 관리자 확인 후 배정", on: false }, { label: "다른 담당자 추천", desc: "여유 있는 담당자를 자동 추천", on: true }].map((p) => (
                <div key={p.label} className="flex items-center justify-between p-3 rounded-lg bg-[#F8F9FC]">
                  <div><p className="text-sm text-[#374151]" style={{ fontWeight: 500 }}>{p.label}</p><p className="text-xs text-gray-400">{p.desc}</p></div>
                  <div className={`w-10 h-5 rounded-full cursor-pointer relative ${p.on ? "bg-[#1F6B78]" : "bg-gray-300"}`}><div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${p.on ? "right-0.5" : "left-0.5"}`} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "예외/휴무" && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-3 shadow-sm flex items-center justify-between">
            <span className="text-xs text-gray-400">{EXCEPTIONS.length}건의 예외 일정</span>
            <button className="px-3 py-1.5 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65] flex items-center gap-1.5" style={{ fontWeight: 600 }}><Plus size={12} />예외 추가</button>
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F9FC]"><tr>{["담당자", "유형", "날짜", "사유"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs text-[#9CA3AF]" style={{ fontWeight: 600 }}>{h}</th>)}</tr></thead>
              <tbody>
                {EXCEPTIONS.map((e) => (
                  <tr key={e.id} className="border-t border-gray-50 hover:bg-[#F8F9FC]/50">
                    <td className="px-4 py-3 text-[#111827]" style={{ fontWeight: 500 }}>{e.staff}</td>
                    <td className="px-4 py-3"><Badge variant={e.type === "휴무" ? "neutral" : "accent"}>{e.type}</Badge></td>
                    <td className="px-4 py-3 text-gray-500">{e.date}</td>
                    <td className="px-4 py-3 text-gray-500">{e.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "배정 규칙" && (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-400">
          <Settings size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">배정 규칙 설정은 Supabase 연동 후 구현됩니다</p>
          <p className="text-xs mt-1">자동 배정 기준, 우선순위 로직 등을 설정할 수 있습니다</p>
        </div>
      )}
    </div>
  );
}
