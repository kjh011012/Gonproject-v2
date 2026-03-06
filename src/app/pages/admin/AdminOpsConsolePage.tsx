import { useState } from "react";
import {
  Layers, Search, Phone, MessageSquare, Eye, Clock, User,
  ChevronDown, Download, MapPin, AlertTriangle, CheckCircle2, Keyboard
} from "lucide-react";
import { Badge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField, DetailTabs } from "../../components/admin/AdminDetailPanel";
import { AdminModal } from "../../components/admin/AdminModal";
import { useLargeMode } from "../../components/layouts/AdminLayout";

const QUEUES = [
  { key: "new", label: "신규(오늘)", count: 12 },
  { key: "unassigned", label: "미배정", count: 8 },
  { key: "schedule", label: "일정대기", count: 15 },
  { key: "info", label: "추가정보 필요", count: 3 },
  { key: "today", label: "오늘 진행", count: 24 },
  { key: "delayed", label: "지연", count: 5 },
  { key: "queue", label: "대기열", count: 7 },
  { key: "hold", label: "취소/보류", count: 2 },
];

const STAFF_OPTIONS = ["-", "김간호", "이상담", "박의료", "최행정"];
const STATUS_OPTIONS = ["접수됨", "확인중", "일정대기", "일정확정", "진행중", "완료", "보류"];

interface OpsRow {
  id: string;
  time: string;
  name: string;
  phone: string;
  service: string;
  preferredDate: string;
  region: string;
  status: string;
  staff: string;
  sla: string;
}

const MOCK_DATA: OpsRow[] = [
  { id: "SVC-001", time: "09:12", name: "김○○", phone: "010-****-3456", service: "방문간호", preferredDate: "3/7", region: "횡성읍", status: "접수됨", staff: "-", sla: "오늘 확인" },
  { id: "SVC-002", time: "09:25", name: "이○○", phone: "010-****-7890", service: "건강상담", preferredDate: "ASAP", region: "안흥면", status: "접수됨", staff: "-", sla: "긴급" },
  { id: "SVC-003", time: "09:31", name: "박○○", phone: "010-****-1234", service: "재활운동", preferredDate: "3/8", region: "둔내면", status: "확인중", staff: "이상담", sla: "오늘 확인" },
  { id: "SVC-004", time: "08:45", name: "최○○", phone: "010-****-5678", service: "방문건강관리", preferredDate: "3/7", region: "공근면", status: "일정확정", staff: "김간호", sla: "완료" },
  { id: "SVC-005", time: "08:50", name: "정○○", phone: "010-****-9012", service: "만성질환관리", preferredDate: "3/9", region: "횡성읍", status: "일정대기", staff: "박의료", sla: "내일까지" },
  { id: "SVC-006", time: "10:02", name: "한○○", phone: "010-****-3456", service: "건강상담", preferredDate: "ASAP", region: "갑천면", status: "접수됨", staff: "-", sla: "긴급" },
  { id: "SVC-007", time: "10:15", name: "오○○", phone: "010-****-6789", service: "방문간호", preferredDate: "3/10", region: "청일면", status: "확인중", staff: "이상담", sla: "오늘 확인" },
  { id: "SVC-008", time: "07:30", name: "서○○", phone: "010-****-0123", service: "재활운동", preferredDate: "3/7", region: "횡성읍", status: "진행중", staff: "박의료", sla: "진행중" },
  { id: "SVC-009", time: "10:30", name: "윤○○", phone: "010-****-4567", service: "방문건강관리", preferredDate: "3/11", region: "안흥면", status: "접수됨", staff: "-", sla: "오늘 확인" },
  { id: "SVC-010", time: "10:45", name: "장○○", phone: "010-****-8901", service: "만성질환관리", preferredDate: "3/8", region: "둔내면", status: "보류", staff: "최행정", sla: "보류" },
];

export function AdminOpsConsolePage() {
  const { isLarge } = useLargeMode();
  const [activeQueue, setActiveQueue] = useState("new");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectedRow, setSelectedRow] = useState<OpsRow | null>(null);
  const [detailTab, setDetailTab] = useState("요청 정보");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  const filtered = MOCK_DATA.filter((r) => {
    if (search && !Object.values(r).some((v) => String(v).toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((r) => r.id)));
  };

  const slaStyle = (sla: string) => {
    if (sla === "긴급") return "text-[#7A6C55] bg-[#F2EBDD]";
    if (sla === "오늘 확인") return "text-[#1F6B78] bg-[#1F6B78]/10";
    return "text-gray-500 bg-gray-100";
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className={`${isLarge ? "text-xl" : "text-lg"} text-[#111827]`} style={{ fontWeight: 700 }}>운영 콘솔</h1>
          <p className="text-xs text-gray-400 mt-0.5">500건/일 규모 초고밀도 운영 화면 · 큐 → 배정 → 처리</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Keyboard size={13} />
          <span>A:배정 S:상태 N:메모 Enter:상세</span>
        </div>
      </div>

      <div className="flex gap-3">
        {/* Left: Queue panel */}
        <div className="hidden lg:block w-48 shrink-0 space-y-1 bg-white rounded-xl shadow-sm p-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider px-2 pt-1 pb-2" style={{ fontWeight: 600 }}>작업 큐</p>
          {QUEUES.map((q) => (
            <button
              key={q.key}
              onClick={() => setActiveQueue(q.key)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${activeQueue === q.key ? "bg-[#1F6B78]/10 text-[#1F6B78]" : "text-gray-600 hover:bg-[#F8F9FC]"}`}
              style={{ fontWeight: activeQueue === q.key ? 600 : 400 }}
            >
              {q.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeQueue === q.key ? "bg-[#1F6B78] text-white" : "bg-gray-100 text-gray-400"}`} style={{ fontWeight: 600 }}>
                {q.count}
              </span>
            </button>
          ))}
          <div className="border-t border-gray-100 mt-2 pt-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider px-2 pb-1" style={{ fontWeight: 600 }}>저장뷰</p>
            <button className="w-full text-left px-3 py-1.5 text-xs text-[#1F6B78] cursor-pointer hover:bg-[#F8F9FC] rounded-lg">+ 저장뷰 추가</button>
          </div>
        </div>

        {/* Center: High-density table */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Toolbar */}
          <div className="bg-white rounded-xl p-2.5 shadow-sm flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="요청번호, 이름, 지역 검색..." className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#F8F9FC] border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
            </div>
            <span className="text-xs text-gray-400">{filtered.length}건</span>
          </div>

          {/* Bulk bar */}
          {selected.size > 0 && (
            <div className="bg-[#1F6B78] rounded-xl px-4 py-2 flex items-center gap-3 text-white text-xs">
              <span style={{ fontWeight: 600 }}>{selected.size}건 선택</span>
              <div className="flex gap-1.5 ml-auto">
                <button onClick={() => alert("일괄 배정 (Supabase 연동 후)")} className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 cursor-pointer text-[11px]">담당자 배정</button>
                <button onClick={() => alert("일괄 상태 변경 (Supabase 연동 후)")} className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 cursor-pointer text-[11px]">상태 변경</button>
                <button onClick={() => { setWizardOpen(true); setWizardStep(1); }} className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 cursor-pointer text-[11px]">일정 확정</button>
                <button onClick={() => setSelected(new Set())} className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer text-[11px]">해제</button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-[#F8F9FC]">
                  <tr>
                    <th className="w-8 p-2"><input type="checkbox" checked={filtered.length > 0 && selected.size === filtered.length} onChange={toggleAll} className="accent-[#1F6B78] cursor-pointer" /></th>
                    {["번호", "접수", "회원", "서비스", "희망일", "지역", "상태", "담당자", "SLA", ""].map((h) => (
                      <th key={h} className="text-left px-2 py-2.5 text-[10px] text-[#9CA3AF] whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} onClick={() => setSelectedRow(r)} className={`border-t border-gray-50 cursor-pointer h-10 transition-colors ${selectedRow?.id === r.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FC]/50"}`}>
                      <td className="w-8 p-2" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleSelect(r.id)} className="accent-[#1F6B78] cursor-pointer" /></td>
                      <td className="px-2 py-2 text-[#1F6B78]" style={{ fontWeight: 500 }}>{r.id}</td>
                      <td className="px-2 py-2 text-gray-400">{r.time}</td>
                      <td className="px-2 py-2">
                        <span className="text-[#111827]" style={{ fontWeight: 500 }}>{r.name}</span>
                        <span className="text-gray-400 ml-1">{r.phone}</span>
                      </td>
                      <td className="px-2 py-2 text-gray-600">{r.service}</td>
                      <td className="px-2 py-2 text-gray-600">{r.preferredDate}</td>
                      <td className="px-2 py-2 text-gray-500">{r.region}</td>
                      <td className="px-2 py-2">
                        <select defaultValue={r.status} onClick={(e) => e.stopPropagation()} className="px-1.5 py-0.5 rounded bg-[#F8F9FC] border border-gray-200 text-[11px] cursor-pointer focus:outline-none">
                          {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <select defaultValue={r.staff} onClick={(e) => e.stopPropagation()} className={`px-1.5 py-0.5 rounded border text-[11px] cursor-pointer focus:outline-none ${r.staff === "-" ? "bg-[#F2EBDD] border-[#E5D9C3] text-[#7A6C55]" : "bg-[#F8F9FC] border-gray-200 text-gray-600"}`}>
                          {STAFF_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${slaStyle(r.sla)}`} style={{ fontWeight: 600 }}>{r.sla}</span>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex gap-0.5" onClick={(e) => e.stopPropagation()}>
                          <button className="p-1 rounded hover:bg-gray-100 cursor-pointer text-gray-400" title="메모"><MessageSquare size={12} /></button>
                          <button className="p-1 rounded hover:bg-gray-100 cursor-pointer text-gray-400" title="전화"><Phone size={12} /></button>
                          <button onClick={() => setSelectedRow(r)} className="p-1 rounded hover:bg-gray-100 cursor-pointer text-gray-400" title="상세"><Eye size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile: cards */}
          <div className="md:hidden space-y-2">
            {/* Mobile queue selector */}
            <div className="flex gap-1.5 overflow-x-auto pb-2">
              {QUEUES.slice(0, 4).map((q) => (
                <button key={q.key} onClick={() => setActiveQueue(q.key)} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap cursor-pointer ${activeQueue === q.key ? "bg-[#1F6B78] text-white" : "bg-white text-gray-500 border border-gray-200"}`} style={{ fontWeight: activeQueue === q.key ? 600 : 400 }}>
                  {q.label} ({q.count})
                </button>
              ))}
            </div>
            {filtered.slice(0, 6).map((r) => (
              <div key={r.id} onClick={() => setSelectedRow(r)} className={`bg-white rounded-xl p-3 shadow-sm cursor-pointer ${selectedRow?.id === r.id ? "ring-2 ring-[#1F6B78]/30" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#111827]" style={{ fontWeight: 600 }}>{r.name} · {r.service}</span>
                  <Badge variant={r.status === "접수됨" ? "accent" : r.status === "진행중" ? "primary" : "neutral"}>{r.status}</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{r.id}</span><span>{r.staff === "-" ? "미배정" : r.staff}</span><span>{r.region}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detail panel */}
        {selectedRow && (
          <AdminDetailPanel title={`${selectedRow.id} 상세`} onClose={() => setSelectedRow(null)} width="w-full xl:w-[380px]">
            <div className="bg-[#F8F9FC] rounded-lg p-3 space-y-1 text-sm">
              <p className="text-[#111827]" style={{ fontWeight: 600 }}>{selectedRow.name} <span className="text-gray-400 text-xs">{selectedRow.phone}</span></p>
              <p className="text-gray-500 text-xs">{selectedRow.service} · {selectedRow.region} · 희망일 {selectedRow.preferredDate}</p>
            </div>
            <DetailTabs tabs={["요청 정보", "처리", "메모"]} active={detailTab} onChange={setDetailTab} />
            {detailTab === "요청 정보" && (
              <div className="space-y-3">
                <DetailField label="접수 시간"><p className="text-sm text-[#374151]">{selectedRow.time}</p></DetailField>
                <DetailField label="상태"><Badge variant={selectedRow.status === "접수됨" ? "accent" : "secondary"}>{selectedRow.status}</Badge></DetailField>
                <DetailField label="담당자"><p className="text-sm text-[#374151]">{selectedRow.staff === "-" ? "미배정" : selectedRow.staff}</p></DetailField>
                <DetailField label="SLA"><span className={`px-2 py-0.5 rounded text-xs ${slaStyle(selectedRow.sla)}`} style={{ fontWeight: 600 }}>{selectedRow.sla}</span></DetailField>
              </div>
            )}
            {detailTab === "처리" && (
              <div className="space-y-3">
                <DetailField label="담당자 배정">
                  <select className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" defaultValue={selectedRow.staff}>
                    {STAFF_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </DetailField>
                <DetailField label="상태 변경">
                  <select className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" defaultValue={selectedRow.status}>
                    {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </DetailField>
                <button className="w-full py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65]" style={{ fontWeight: 600 }}>적용</button>
              </div>
            )}
            {detailTab === "메모" && (
              <div className="space-y-3">
                <textarea placeholder="빠른 메모..." rows={3} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
                <button className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65]" style={{ fontWeight: 600 }}>저장</button>
              </div>
            )}
          </AdminDetailPanel>
        )}
      </div>

      {/* Bulk Schedule Wizard */}
      <AdminModal open={wizardOpen} onClose={() => setWizardOpen(false)} title={`일정 일괄 확정 (${wizardStep}/3단계)`} size="md" footer={
        <div className="flex gap-2">
          {wizardStep > 1 && <button onClick={() => setWizardStep(wizardStep - 1)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">이전</button>}
          {wizardStep < 3 ? (
            <button onClick={() => setWizardStep(wizardStep + 1)} className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-sm hover:bg-[#185A65] cursor-pointer" style={{ fontWeight: 600 }}>다음</button>
          ) : (
            <button onClick={() => { alert("일정이 확정되었습니다. (Supabase 연동 후 실제 반영)"); setWizardOpen(false); }} className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-sm hover:bg-[#185A65] cursor-pointer" style={{ fontWeight: 600 }}>확정</button>
          )}
        </div>
      }>
        {wizardStep === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-[#374151]">선택된 <span style={{ fontWeight: 600 }}>{selected.size}건</span>의 요청을 일괄 확정합니다.</p>
            <div className="bg-[#F8F9FC] rounded-lg p-3 max-h-40 overflow-y-auto space-y-1">
              {[...selected].map((id) => { const r = MOCK_DATA.find((d) => d.id === id); return r ? <p key={id} className="text-xs text-gray-600">{r.id} — {r.name} ({r.service})</p> : null; })}
            </div>
          </div>
        )}
        {wizardStep === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-[#374151]" style={{ fontWeight: 600 }}>담당자 및 슬롯 확인</p>
            <div className="space-y-2">
              <label className="block text-xs text-gray-500" style={{ fontWeight: 600 }}>기본 담당자</label>
              <select className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm cursor-pointer focus:outline-none">
                {STAFF_OPTIONS.filter((s) => s !== "-").map((s) => <option key={s}>{s}</option>)}
              </select>
              <label className="block text-xs text-gray-500 mt-2" style={{ fontWeight: 600 }}>용량 확인</label>
              <div className="bg-[#67B89A]/10 rounded-lg p-3 text-xs text-[#2D7A5E]"><CheckCircle2 size={12} className="inline mr-1" />현재 슬롯 여유: 충분</div>
            </div>
          </div>
        )}
        {wizardStep === 3 && (
          <div className="space-y-3">
            <p className="text-sm text-[#374151]" style={{ fontWeight: 600 }}>최종 확인</p>
            <label className="flex items-center gap-2 text-sm text-[#374151]"><input type="checkbox" className="accent-[#1F6B78]" />고객 안내 발송 (placeholder)</label>
            <div className="bg-[#F2EBDD]/50 rounded-lg p-3"><p className="text-xs text-[#7A6C55]"><AlertTriangle size={11} className="inline mr-1" />확정 후 고객에게 안내가 발송됩니다.</p></div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
