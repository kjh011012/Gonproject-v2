import { useState } from "react";
import { Search, Phone, MapPin, CalendarDays, User, Clock, FileText, X, ChevronRight, Download, AlertTriangle, CheckCircle2 } from "lucide-react";
import { StatusBadge, Badge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField, DetailTabs } from "../../components/admin/AdminDetailPanel";

const SERVICES = [
  { id: "SVC-2026-089", name: "김영희", phone: "010-1111-2222", service: "재택의료", type: "방문진료", status: "접수됨", date: "2026-03-06", hope: "ASAP", area: "횡성읍", staff: null, priority: "긴급", sla: "24시간 내 확인" },
  { id: "SVC-2026-088", name: "박수진", phone: "010-3333-4444", service: "마을돌봄", type: "정기돌봄", status: "확인중", date: "2026-03-05", hope: "3/10 오전", area: "우천면", staff: "상담사 최OO", priority: "보통", sla: "" },
  { id: "SVC-2026-087", name: "이철수", phone: "010-5555-6666", service: "건강공동체", type: "건강교실", status: "일정확정", date: "2026-03-04", hope: "3/15 14:00", area: "횡성읍", staff: "강사 박OO", priority: "보통", sla: "" },
  { id: "SVC-2026-086", name: "최미영", phone: "010-7777-8888", service: "재택의료", type: "재활치료", status: "진행중", date: "2026-03-04", hope: "3/6 10:00", area: "갑천면", staff: "치료사 김OO", priority: "보통", sla: "" },
  { id: "SVC-2026-085", name: "정태호", phone: "010-9999-0000", service: "마을돌봄", type: "생활지원", status: "일정대기", date: "2026-03-03", hope: "3/8 오후", area: "공근면", staff: null, priority: "보통", sla: "담당자 미배정" },
  { id: "SVC-2026-084", name: "한지은", phone: "010-2345-6789", service: "재택의료", type: "방문간호", status: "완료", date: "2026-03-02", hope: "3/4 09:00", area: "횡성읍", staff: "간호사 정OO", priority: "보통", sla: "" },
  { id: "SVC-2026-083", name: "오상호", phone: "010-3456-7890", service: "건강공동체", type: "운동프로그램", status: "완료", date: "2026-03-01", hope: "3/3 15:00", area: "청일면", staff: "강사 송OO", priority: "보통", sla: "" },
  { id: "SVC-2026-082", name: "윤미래", phone: "010-4567-1234", service: "마을돌봄", type: "정서지원", status: "보류", date: "2026-02-28", hope: "미정", area: "안흥면", staff: null, priority: "보통", sla: "" },
];

const STATUSES = ["전체", "접수됨", "확인중", "일정대기", "일정확정", "진행중", "완료", "보류", "취소"];
const STAFF = ["미배정", "의사 정OO", "간호사 정OO", "치료사 김OO", "돌봄사 이OO", "상담사 최OO", "강사 박OO", "강사 송OO"];
const CHECKLIST = [
  { label: "연락 완료", done: true },
  { label: "준비물 안내", done: true },
  { label: "주소 확인", done: false },
  { label: "방문 완료", done: false },
  { label: "결과 기록", done: false },
];

export function AdminServices() {
  const [view, setView] = useState<"list" | "board" | "calendar">("list");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState("요청 내용");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = SERVICES.filter(
    (s) =>
      (statusFilter === "전체" || s.status === statusFilter) &&
      (search === "" || s.name.includes(search) || s.id.includes(search) || s.area.includes(search) || s.service.includes(search))
  );

  const svc = selectedId ? SERVICES.find((s) => s.id === selectedId) : null;

  // Board view grouping
  const boardGroups = ["접수됨", "확인중", "일정대기", "일정확정", "진행중", "완료"];

  return (
    <div className="flex gap-6 h-full">
      {/* Main */}
      <div className={`flex-1 min-w-0 ${svc ? "hidden xl:block" : ""}`}>
        {/* Toolbar */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
            <div className="flex gap-1.5">
              {(["list", "board", "calendar"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer ${
                    view === v ? "bg-[#1F6B78] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {v === "list" ? "리스트" : v === "board" ? "보드" : "캘린더"}
                </button>
              ))}
            </div>
            <div className="relative flex-1 w-full lg:max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="이름, 접수번호, 지역, 서비스..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.slice(0, 7).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs cursor-pointer ${
                    statusFilter === s ? "bg-[#1F6B78] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                  style={{ fontWeight: statusFilter === s ? 600 : 400 }}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2 ml-auto">
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 cursor-pointer flex items-center gap-1">
                <Download size={13} /> 내보내기
              </button>
            </div>
          </div>
        </div>

        {/* Bulk */}
        {selected.size > 0 && (
          <div className="bg-[#1F6B78] rounded-xl px-4 py-2.5 mb-4 flex items-center gap-3 text-white text-sm">
            <span style={{ fontWeight: 600 }}>{selected.size}건 선택</span>
            <div className="flex gap-2 ml-auto">
              <button className="px-3 py-1.5 rounded-lg bg-white/20 text-xs cursor-pointer">담당자 배정</button>
              <button className="px-3 py-1.5 rounded-lg bg-white/20 text-xs cursor-pointer">상태 변경</button>
              <button className="px-3 py-1.5 rounded-lg bg-white/20 text-xs cursor-pointer">일정 확정</button>
              <button onClick={() => setSelected(new Set())} className="px-3 py-1.5 rounded-lg bg-white/10 text-xs cursor-pointer">해제</button>
            </div>
          </div>
        )}

        {/* List View */}
        {view === "list" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F8F9FA]">
                  <tr>
                    <th className="w-10 p-3">
                      <input
                        type="checkbox"
                        onChange={() => {
                          if (selected.size === filtered.length) setSelected(new Set());
                          else setSelected(new Set(filtered.map((s) => s.id)));
                        }}
                        checked={filtered.length > 0 && selected.size === filtered.length}
                        className="accent-[#1F6B78] cursor-pointer"
                      />
                    </th>
                    <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>요청</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-400 hidden md:table-cell" style={{ fontWeight: 600 }}>서비스</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-400 hidden lg:table-cell" style={{ fontWeight: 600 }}>지역</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>상태</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-400 hidden lg:table-cell" style={{ fontWeight: 600 }}>담당자</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-400 hidden xl:table-cell" style={{ fontWeight: 600 }}>희망일시</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => { setSelectedId(s.id); setDetailTab("요청 내용"); }}
                      className={`border-t border-gray-50 cursor-pointer transition-colors ${
                        selectedId === s.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FA]/50"
                      }`}
                    >
                      <td className="w-10 p-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.has(s.id)}
                          onChange={() => {
                            const n = new Set(selected);
                            if (n.has(s.id)) n.delete(s.id); else n.add(s.id);
                            setSelected(n);
                          }}
                          className="accent-[#1F6B78] cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {s.priority === "긴급" && <Badge variant="accent">긴급</Badge>}
                          <div>
                            <p className="text-[#111827]" style={{ fontWeight: 500 }}>{s.name}</p>
                            <p className="text-xs text-gray-400">{s.id} · {s.date}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-[#374151]">{s.service}</p>
                        <p className="text-xs text-gray-400">{s.type}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{s.area}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <StatusBadge status={s.status} />
                          {s.sla && <span className="text-[10px] text-gray-400">{s.sla}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className={`text-sm ${s.staff ? "text-[#374151]" : "text-gray-400 italic"}`}>
                          {s.staff || "미배정"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 hidden xl:table-cell">{s.hope}</td>
                      <td className="px-4 py-3"><ChevronRight size={14} className="text-gray-300" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">{filtered.length}건</div>
          </div>
        )}

        {/* Board View */}
        {view === "board" && (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {boardGroups.map((status) => {
              const items = SERVICES.filter((s) => s.status === status);
              return (
                <div key={status} className="min-w-[260px] w-[260px] shrink-0">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <StatusBadge status={status} />
                    <span className="text-xs text-gray-400">{items.length}</span>
                  </div>
                  <div className="space-y-2">
                    {items.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => { setSelectedId(s.id); setDetailTab("요청 내용"); }}
                        className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md cursor-pointer transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400">{s.id}</span>
                          {s.priority === "긴급" && <Badge variant="accent">긴급</Badge>}
                        </div>
                        <p className="text-sm text-[#111827] mb-1" style={{ fontWeight: 600 }}>{s.name}</p>
                        <p className="text-xs text-gray-500">{s.service} · {s.type}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-400">{s.area}</span>
                          <span className={`text-xs ${s.staff ? "text-[#1F6B78]" : "text-gray-300 italic"}`}>
                            {s.staff || "미배정"}
                          </span>
                        </div>
                      </div>
                    ))}
                    {items.length === 0 && (
                      <div className="text-center py-8 text-xs text-gray-300">없음</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Calendar View */}
        {view === "calendar" && (
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="text-center mb-4">
              <h3 className="text-sm text-[#111827]" style={{ fontWeight: 700 }}>2026년 3월</h3>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
              {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                <div key={d} className="py-2" style={{ fontWeight: 600 }}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 31 + 6 }, (_, i) => {
                const day = i - 5;
                if (day < 1 || day > 31) return <div key={i} />;
                const apps = SERVICES.filter((s) => s.date === `2026-03-${String(day).padStart(2, "0")}`);
                const isToday = day === 6;
                return (
                  <div
                    key={i}
                    className={`min-h-[70px] p-1 rounded-lg border text-xs ${
                      isToday ? "border-[#1F6B78] bg-[#1F6B78]/5" : "border-gray-100"
                    }`}
                  >
                    <div className={`mb-1 ${isToday ? "text-[#1F6B78]" : "text-gray-400"}`} style={{ fontWeight: isToday ? 700 : 400 }}>
                      {day}
                    </div>
                    {apps.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => { setSelectedId(a.id); setDetailTab("요청 내용"); }}
                        className="px-1 py-0.5 mb-0.5 rounded text-[10px] bg-[#1F6B78]/10 text-[#1F6B78] truncate cursor-pointer hover:bg-[#1F6B78]/20"
                      >
                        {a.name} · {a.type}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {svc && (
        <AdminDetailPanel title="서비스 요청 상세" onClose={() => setSelectedId(null)}>
          {/* Summary */}
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={svc.status} size="md" />
            {svc.priority === "긴급" && <Badge variant="accent">긴급</Badge>}
            {!svc.staff && <Badge variant="accent"><AlertTriangle size={11} /> 미배정</Badge>}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><User size={14} className="text-gray-400" /><span className="text-[#111827]" style={{ fontWeight: 500 }}>{svc.name}</span></div>
            <div className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /><span className="text-gray-500">{svc.phone}</span></div>
            <div className="flex items-center gap-2"><MapPin size={14} className="text-gray-400" /><span className="text-gray-500">{svc.area}</span></div>
            <div className="flex items-center gap-2"><CalendarDays size={14} className="text-gray-400" /><span className="text-gray-500">희망: {svc.hope}</span></div>
          </div>

          <DetailTabs
            tabs={["요청 내용", "운영 처리", "내부 메모", "연락 로그"]}
            active={detailTab}
            onChange={setDetailTab}
          />

          {detailTab === "요청 내용" && (
            <div className="space-y-4">
              <DetailField label="서비스 종류">
                <p className="text-sm text-[#374151]">{svc.service} — {svc.type}</p>
              </DetailField>
              <DetailField label="신청일">
                <p className="text-sm text-[#374151]">{svc.date}</p>
              </DetailField>
              <DetailField label="상세 요청">
                <p className="text-sm text-gray-500 leading-relaxed">
                  예시: 주 2회 방문 희망, 거동이 불편하여 자택 방문 필요. 가족 연락처: 010-0000-0000
                </p>
              </DetailField>
            </div>
          )}

          {detailTab === "운영 처리" && (
            <div className="space-y-4">
              <DetailField label="상태 변경">
                <select className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm">
                  {STATUSES.filter((s) => s !== "전체").map((s) => (
                    <option key={s} selected={s === svc.status}>{s}</option>
                  ))}
                </select>
              </DetailField>
              <DetailField label="담당자 배정">
                <select className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm">
                  {STAFF.map((s) => (
                    <option key={s} selected={s === (svc.staff || "미배정")}>{s}</option>
                  ))}
                </select>
              </DetailField>
              <DetailField label="방문 전 체크리스트">
                <div className="space-y-1.5">
                  {CHECKLIST.map((c, i) => (
                    <label key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#F8F9FA] cursor-pointer hover:bg-[#1F6B78]/5">
                      <input type="checkbox" defaultChecked={c.done} className="accent-[#1F6B78]" />
                      <span className={`text-sm ${c.done ? "text-[#1F6B78] line-through" : "text-[#374151]"}`}>{c.label}</span>
                    </label>
                  ))}
                </div>
              </DetailField>
              <button className="w-full px-4 py-2.5 rounded-lg bg-[#1F6B78] text-white text-sm cursor-pointer" style={{ fontWeight: 600 }}>
                저장
              </button>
            </div>
          )}

          {detailTab === "내부 메모" && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#F2EBDD]/50 text-sm text-[#7A6C55]">
                3/5 연락 시 부재 — 내일 오전 재연락 예정 (상담사 최OO)
              </div>
              <textarea
                placeholder="내부 메모... (고객에게 보이지 않음)"
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
              />
              <button className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer" style={{ fontWeight: 600 }}>
                메모 저장
              </button>
            </div>
          )}

          {detailTab === "연락 로그" && (
            <div className="space-y-3">
              {[
                { date: "2026-03-05 14:30", type: "전화", note: "부재중 — 문자 발송" },
                { date: "2026-03-04 10:00", type: "문자", note: "접수 확인 안내 발송" },
              ].map((log, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#F8F9FA]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#1F6B78]" style={{ fontWeight: 600 }}>{log.type}</span>
                    <span className="text-xs text-gray-400">{log.date}</span>
                  </div>
                  <p className="text-sm text-[#374151]">{log.note}</p>
                </div>
              ))}
            </div>
          )}

          {/* CTAs */}
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer" style={{ fontWeight: 600 }}>
              <Phone size={13} /> 전화
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-[#1F6B78] text-[#1F6B78] text-xs cursor-pointer">
              일정 확정
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-500 text-xs cursor-pointer">
              조합원 열기
            </button>
          </div>
        </AdminDetailPanel>
      )}
    </div>
  );
}
