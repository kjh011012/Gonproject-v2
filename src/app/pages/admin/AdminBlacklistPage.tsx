import { useState } from "react";
import {
  Ban, UserX, Wallet, CheckCircle2, Clock, History,
  Plus, Download, Search, ChevronDown, AlertTriangle,
  Phone, MapPin, Shield, FileText, MessageSquare,
  X, Eye, Edit, MoreHorizontal, ChevronRight, Users
} from "lucide-react";
import { StatusBadge, Badge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField, DetailTabs } from "../../components/admin/AdminDetailPanel";
import { ConfirmModal } from "../../components/admin/AdminModal";
import { useLargeMode } from "../../components/layouts/AdminLayout";

/* ───── Tabs ───── */
const TABS = [
  { key: "blacklist", label: "블랙리스트", icon: Ban },
  { key: "withdraw", label: "탈퇴 요청", icon: UserX },
  { key: "refund-wait", label: "환급 대기", icon: Clock },
  { key: "refund-done", label: "환급 완료", icon: CheckCircle2 },
  { key: "history", label: "처리 이력", icon: History },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/* ───── Mock Data ───── */
const BLACKLIST_DATA = [
  { id: "BL-001", memberId: "M-0047", name: "김○○", phone: "010-****-3456", region: "횡성읍", scope: "서비스, 커뮤니티", reason: "반복 민원·폭언", registeredAt: "2025-11-12", expireAt: "2026-03-12", handler: "이운영", status: "활성" },
  { id: "BL-002", memberId: "M-0112", name: "박○○", phone: "010-****-7890", region: "안흥면", scope: "서비스", reason: "서비스 비용 미납(3개월)", registeredAt: "2025-10-05", expireAt: "-", handler: "김관리", status: "활성" },
  { id: "BL-003", memberId: "M-0088", name: "최○○", phone: "010-****-1234", region: "둔내면", scope: "문의", reason: "허위 신고 반복", registeredAt: "2025-08-20", expireAt: "2025-12-20", handler: "이운영", status: "해제" },
  { id: "BL-004", memberId: "M-0201", name: "정○○", phone: "010-****-5678", region: "공근면", scope: "서비스, 문의", reason: "타 조합원 위협 행위", registeredAt: "2025-12-01", expireAt: "-", handler: "박매니저", status: "활성" },
  { id: "BL-005", memberId: "M-0155", name: "한○○", phone: "010-****-9012", region: "횡성읍", scope: "커뮤니티", reason: "부적절 게시물 반복 등록", registeredAt: "2025-09-15", expireAt: "2026-01-15", handler: "김관리", status: "해제대기" },
];

const WITHDRAW_DATA = [
  { id: "WD-001", memberId: "M-0034", name: "이○○", phone: "010-****-2345", requestedAt: "2026-02-28", status: "접수", balance: "50,000원", pendingServices: 0, handler: "-" },
  { id: "WD-002", memberId: "M-0078", name: "송○○", phone: "010-****-6789", requestedAt: "2026-03-01", status: "확인중", balance: "100,000원", pendingServices: 1, handler: "이운영" },
  { id: "WD-003", memberId: "M-0145", name: "조○○", phone: "010-****-0123", requestedAt: "2026-03-03", status: "환급대기", balance: "30,000원", pendingServices: 0, handler: "김관리" },
  { id: "WD-004", memberId: "M-0092", name: "윤○○", phone: "010-****-4567", requestedAt: "2026-02-20", status: "보류", balance: "80,000원", pendingServices: 2, handler: "박매니저" },
];

const REFUND_WAIT_DATA = [
  { id: "RF-001", memberId: "M-0034", name: "이○○", amount: "50,000원", requestedAt: "2026-02-28", approvedAt: "2026-03-02", method: "계좌이체", handler: "이운영", status: "환급대기" },
  { id: "RF-002", memberId: "M-0145", name: "조○○", amount: "30,000원", requestedAt: "2026-03-03", approvedAt: "2026-03-05", method: "계좌이체", handler: "김관리", status: "환급대기" },
];

const REFUND_DONE_DATA = [
  { id: "RF-003", memberId: "M-0021", name: "강○○", amount: "70,000원", requestedAt: "2026-01-15", completedAt: "2026-01-22", method: "계좌이체", handler: "김관리", status: "환급완료" },
  { id: "RF-004", memberId: "M-0056", name: "오○○", amount: "50,000원", requestedAt: "2026-02-01", completedAt: "2026-02-10", method: "계좌이체", handler: "이운영", status: "환급완료" },
  { id: "RF-005", memberId: "M-0099", name: "서○○", amount: "100,000원", requestedAt: "2025-12-10", completedAt: "2025-12-20", method: "계좌이체", handler: "박매니저", status: "환급완료" },
];

const HISTORY_DATA = [
  { id: "H-001", time: "2026-03-06 09:30", actor: "이운영", target: "김○○ (M-0047)", action: "블랙리스트 등록", detail: "사유: 반복 민원·폭언, 범위: 서비스+커뮤니티" },
  { id: "H-002", time: "2026-03-05 14:15", actor: "김관리", target: "조○○ (M-0145)", action: "탈퇴 처리 시작", detail: "출자금 30,000원 환급 진행" },
  { id: "H-003", time: "2026-03-04 11:00", actor: "이운영", target: "최○○ (M-0088)", action: "블랙리스트 해제", detail: "기간 만료, 재발 없음 확인" },
  { id: "H-004", time: "2026-03-03 16:45", actor: "박매니저", target: "윤○○ (M-0092)", action: "탈퇴 보류", detail: "미완료 서비스 2건 존재" },
  { id: "H-005", time: "2026-03-02 10:20", actor: "김관리", target: "강○○ (M-0021)", action: "환급 완료", detail: "70,000원 계좌이체 완료" },
  { id: "H-006", time: "2026-03-01 09:00", actor: "이운영", target: "한○○ (M-0155)", action: "블랙리스트 등록", detail: "사유: 부적절 게시물, 범위: 커뮤니티" },
  { id: "H-007", time: "2026-02-28 15:30", actor: "이운영", target: "송○○ (M-0078)", action: "탈퇴 확인 시작", detail: "출자금 100,000원, 미완료 서비스 1건 확인 중" },
];

/* ───── Filters ───── */
const FILTER_STATUS = ["전체", "활성", "해제대기", "해제"];
const FILTER_SCOPE = ["전체", "서비스", "커뮤니티", "문의"];
const FILTER_REGION = ["전체", "횡성읍", "안흥면", "둔내면", "공근면", "갑천면", "청일면"];

/* ───── Component ───── */
export function AdminBlacklistPage() {
  const { isLarge } = useLargeMode();
  const [tab, setTab] = useState<TabKey>("blacklist");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [detailTab, setDetailTab] = useState("제한 설정");

  // Filters
  const [filterStatus, setFilterStatus] = useState("전체");
  const [filterScope, setFilterScope] = useState("전체");
  const [filterRegion, setFilterRegion] = useState("전체");

  // Modals
  const [confirmModal, setConfirmModal] = useState<{ type: string; target?: any } | null>(null);
  const [confirmReason, setConfirmReason] = useState("");
  const [confirmCheck, setConfirmCheck] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);

  // Withdraw checklist
  const [wdChecklist, setWdChecklist] = useState({ identity: false, services: false, payments: false, account: false });

  const txtBase = isLarge ? "text-[15px]" : "text-sm";
  const txtSm = isLarge ? "text-[13px]" : "text-xs";

  // Filter blacklist data
  const filteredBlacklist = BLACKLIST_DATA.filter((item) => {
    if (search && !Object.values(item).some((v) => String(v).toLowerCase().includes(search.toLowerCase()))) return false;
    if (filterStatus !== "전체" && item.status !== filterStatus) return false;
    if (filterScope !== "전체" && !item.scope.includes(filterScope)) return false;
    if (filterRegion !== "전체" && item.region !== filterRegion) return false;
    return true;
  });

  const filteredWithdraw = WITHDRAW_DATA.filter((item) => {
    if (search && !Object.values(item).some((v) => String(v).toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const selectedBlacklist = BLACKLIST_DATA.find((i) => i.id === selectedId);
  const selectedWithdraw = WITHDRAW_DATA.find((i) => i.id === selectedId);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedItems);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedItems(next);
  };

  const toggleSelectAll = (ids: string[]) => {
    if (ids.every((id) => selectedItems.has(id))) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(ids));
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, "secondary" | "accent" | "neutral"> = {
      "활성": "accent", "해제대기": "accent", "해제": "neutral",
      "접수": "accent", "확인중": "accent", "환급대기": "accent", "보류": "neutral", "완료": "secondary",
      "환급완료": "secondary",
    };
    return <Badge variant={map[status] || "neutral"}>{status}</Badge>;
  };

  /* ──── Render Tab Content ──── */
  const renderBlacklistTab = () => (
    <div className="flex gap-4 flex-1 min-h-0">
      {/* Main table area */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Toolbar */}
        <div className="bg-white rounded-xl p-3 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="relative flex-1 w-full md:max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="이름, 회원ID, 사유 검색..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2 rounded-lg border text-xs cursor-pointer flex items-center gap-1.5 ${showFilters ? "border-[#1F6B78] text-[#1F6B78] bg-[#1F6B78]/5" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
              style={{ fontWeight: 500 }}
            >
              <ChevronDown size={13} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
              필터
            </button>
            <span className={`${txtSm} text-gray-400`}>{filteredBlacklist.length}건</span>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white rounded-xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FilterSelect label="상태" value={filterStatus} options={FILTER_STATUS} onChange={setFilterStatus} />
            <FilterSelect label="제한 범위" value={filterScope} options={FILTER_SCOPE} onChange={setFilterScope} />
            <FilterSelect label="지역" value={filterRegion} options={FILTER_REGION} onChange={setFilterRegion} />
          </div>
        )}

        {/* Bulk action bar */}
        {selectedItems.size > 0 && (
          <div className="bg-[#1F6B78] rounded-xl px-4 py-2.5 flex items-center gap-4 text-white text-sm">
            <span style={{ fontWeight: 600 }}>{selectedItems.size}건 선택됨</span>
            <div className="flex gap-2 ml-auto flex-wrap">
              <BulkBtn label="해제" onClick={() => setConfirmModal({ type: "bulk-release" })} />
              <BulkBtn label="범위 변경" onClick={() => alert("제한 범위 변경 기능은 Supabase 연동 후 구현됩니다.")} />
              <BulkBtn label="메모 추가" onClick={() => alert("메모 추가 기능은 Supabase 연동 후 구현됩니다.")} />
              <BulkBtn label="내보내기" onClick={() => alert("내보내기 기능은 Supabase 연동 후 구현됩니다.")} />
              <button onClick={() => setSelectedItems(new Set())} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs cursor-pointer">
                선택 해제
              </button>
            </div>
          </div>
        )}

        {/* Desktop Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F9FC]">
                <tr>
                  <th className="w-10 p-3">
                    <input
                      type="checkbox"
                      checked={filteredBlacklist.length > 0 && filteredBlacklist.every((i) => selectedItems.has(i.id))}
                      onChange={() => toggleSelectAll(filteredBlacklist.map((i) => i.id))}
                      className="accent-[#1F6B78] cursor-pointer"
                    />
                  </th>
                  {["회원ID", "이름", "연락처", "지역", "제한 범위", "사유", "등록일", "해제 예정일", "처리자", "상태", ""].map((h) => (
                    <th key={h} className="text-left px-3 py-3 text-xs text-[#9CA3AF] whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBlacklist.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="text-center py-16 text-gray-400">
                      <Ban size={24} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">조건에 맞는 항목이 없습니다</p>
                    </td>
                  </tr>
                ) : (
                  filteredBlacklist.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`border-t border-gray-50 cursor-pointer transition-colors ${selectedId === item.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FC]/50"}`}
                    >
                      <td className="w-10 p-3" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={selectedItems.has(item.id)} onChange={() => toggleSelect(item.id)} className="accent-[#1F6B78] cursor-pointer" />
                      </td>
                      <td className="px-3 py-3 text-[#1F6B78] text-xs" style={{ fontWeight: 500 }}>{item.memberId}</td>
                      <td className="px-3 py-3 text-[#111827]" style={{ fontWeight: 600 }}>{item.name}</td>
                      <td className="px-3 py-3 text-gray-500 text-xs">{item.phone}</td>
                      <td className="px-3 py-3 text-gray-500 text-xs">{item.region}</td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {item.scope.split(", ").map((s) => (
                            <span key={s} className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px]" style={{ fontWeight: 500 }}>{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-600 text-xs max-w-[140px] truncate">{item.reason}</td>
                      <td className="px-3 py-3 text-gray-500 text-xs">{item.registeredAt}</td>
                      <td className="px-3 py-3 text-gray-500 text-xs">{item.expireAt}</td>
                      <td className="px-3 py-3 text-gray-500 text-xs">{item.handler}</td>
                      <td className="px-3 py-3">{getStatusBadge(item.status)}</td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1">
                          <button onClick={(e) => { e.stopPropagation(); setSelectedId(item.id); }} className="p-1.5 rounded hover:bg-gray-50 text-gray-400 cursor-pointer" title="상세 보기">
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-2">
          {filteredBlacklist.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer transition-colors ${selectedId === item.id ? "ring-2 ring-[#1F6B78]/30" : ""}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#111827]" style={{ fontWeight: 600 }}>{item.name}</span>
                  <span className="text-xs text-gray-400">{item.memberId}</span>
                </div>
                {getStatusBadge(item.status)}
              </div>
              <p className="text-xs text-gray-500 mb-2">{item.reason}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><MapPin size={11} />{item.region}</span>
                <span className="flex items-center gap-1"><Phone size={11} />{item.phone}</span>
                <span>{item.registeredAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedId && selectedBlacklist && (
        <AdminDetailPanel
          title={`${selectedBlacklist.name} (${selectedBlacklist.memberId})`}
          onClose={() => setSelectedId(null)}
          width="w-full xl:w-[440px]"
          actions={
            <button
              onClick={() => setConfirmModal({ type: "release", target: selectedBlacklist })}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-[#111827] hover:bg-gray-50 cursor-pointer flex items-center gap-1"
              style={{ fontWeight: 500 }}
            >
              <Shield size={12} />
              블랙리스트 해제
            </button>
          }
        >
          {/* Member card */}
          <div className="bg-[#F8F9FC] rounded-lg p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1F6B78]/10 flex items-center justify-center text-[#1F6B78] text-sm" style={{ fontWeight: 700 }}>
              {selectedBlacklist.name[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#111827]" style={{ fontWeight: 600 }}>{selectedBlacklist.name}</p>
              <p className="text-xs text-gray-400">{selectedBlacklist.phone} · {selectedBlacklist.region}</p>
            </div>
            {getStatusBadge(selectedBlacklist.status)}
          </div>

          {/* Detail tabs */}
          <DetailTabs
            tabs={["제한 설정", "사유/증빙", "내부 메모", "이력"]}
            active={detailTab}
            onChange={setDetailTab}
          />

          {detailTab === "제한 설정" && (
            <div className="space-y-4">
              <DetailField label="제한 범위">
                <div className="space-y-2">
                  {["서비스", "커뮤니티", "문의"].map((scope) => (
                    <label key={scope} className="flex items-center gap-2 text-sm text-[#374151]">
                      <input
                        type="checkbox"
                        checked={selectedBlacklist.scope.includes(scope)}
                        readOnly
                        className="accent-[#1F6B78]"
                      />
                      {scope} 이용 제한
                    </label>
                  ))}
                </div>
              </DetailField>
              <DetailField label="등록일">
                <p className="text-sm text-[#374151]">{selectedBlacklist.registeredAt}</p>
              </DetailField>
              <DetailField label="해제 예정일">
                <p className="text-sm text-[#374151]">{selectedBlacklist.expireAt === "-" ? "무기한" : selectedBlacklist.expireAt}</p>
              </DetailField>
              <DetailField label="처리자">
                <p className="text-sm text-[#374151]">{selectedBlacklist.handler}</p>
              </DetailField>
            </div>
          )}

          {detailTab === "사유/증빙" && (
            <div className="space-y-4">
              <DetailField label="사유">
                <div className="bg-[#F8F9FC] rounded-lg p-3 text-sm text-[#374151] leading-relaxed">
                  {selectedBlacklist.reason}
                </div>
              </DetailField>
              <DetailField label="증빙 자료">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-gray-400">
                  <FileText size={24} className="mx-auto mb-2 opacity-30" />
                  <p className="text-xs">증빙 파일 첨부 (Supabase 연동 후 활성화)</p>
                </div>
              </DetailField>
            </div>
          )}

          {detailTab === "내부 메모" && (
            <div className="space-y-4">
              <div className="bg-[#F2EBDD]/50 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle size={14} className="text-[#7A6C55] mt-0.5 shrink-0" />
                <p className="text-xs text-[#7A6C55]">내부 메모는 조합원에게 공개되지 않습니다</p>
              </div>
              <textarea
                placeholder="내부 메모를 입력하세요..."
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
              />
              <button className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65]" style={{ fontWeight: 600 }}>
                메모 저장
              </button>
              {/* Existing memos */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="bg-[#F8F9FC] rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">이운영 · 2025-11-12</p>
                  <p className="text-sm text-[#374151]">최초 등록. 전화 상담 시 폭언 3회 확인됨.</p>
                </div>
              </div>
            </div>
          )}

          {detailTab === "이력" && (
            <div className="space-y-0">
              {[
                { time: "2025-11-12 14:30", actor: "이운영", action: "블랙리스트 등록", detail: "범위: 서비스+커뮤니티" },
                { time: "2025-11-10 09:15", actor: "김관리", action: "경고 발송", detail: "3차 경고 문자 발송" },
                { time: "2025-11-05 16:00", actor: "이운영", action: "2차 경고", detail: "전화 상담 후 경고 전달" },
              ].map((h, i) => (
                <div key={i} className="flex gap-3 pb-4 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1F6B78] shrink-0 mt-1" />
                    {i < 2 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">{h.time} · {h.actor}</p>
                    <p className="text-sm text-[#111827] mt-0.5" style={{ fontWeight: 500 }}>{h.action}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{h.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminDetailPanel>
      )}
    </div>
  );

  const renderWithdrawTab = () => (
    <div className="flex gap-4 flex-1 min-h-0">
      <div className="flex-1 min-w-0 space-y-3">
        {/* Toolbar */}
        <div className="bg-white rounded-xl p-3 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="relative flex-1 w-full md:max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="이름, 요청번호 검색..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
            />
          </div>
          <span className={`${txtSm} text-gray-400 ml-auto`}>{filteredWithdraw.length}건</span>
        </div>

        {/* Desktop Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F9FC]">
                <tr>
                  {["요청번호", "회원", "연락처", "요청일", "진행 상태", "출자금 잔액", "미처리 서비스", "처리자", ""].map((h) => (
                    <th key={h} className="text-left px-3 py-3 text-xs text-[#9CA3AF] whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredWithdraw.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`border-t border-gray-50 cursor-pointer transition-colors ${selectedId === item.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FC]/50"}`}
                  >
                    <td className="px-3 py-3 text-[#1F6B78] text-xs" style={{ fontWeight: 500 }}>{item.id}</td>
                    <td className="px-3 py-3 text-[#111827]" style={{ fontWeight: 600 }}>{item.name}</td>
                    <td className="px-3 py-3 text-gray-500 text-xs">{item.phone}</td>
                    <td className="px-3 py-3 text-gray-500 text-xs">{item.requestedAt}</td>
                    <td className="px-3 py-3">{getStatusBadge(item.status)}</td>
                    <td className="px-3 py-3 text-[#111827]" style={{ fontWeight: 600 }}>{item.balance}</td>
                    <td className="px-3 py-3">
                      {item.pendingServices > 0 ? (
                        <Badge variant="accent">{item.pendingServices}건</Badge>
                      ) : (
                        <span className="text-xs text-gray-400">없음</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-gray-500 text-xs">{item.handler}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedId(item.id); }}
                          className="px-2 py-1 rounded text-xs text-[#1F6B78] hover:bg-[#1F6B78]/5 cursor-pointer"
                          style={{ fontWeight: 500 }}
                        >
                          처리
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-2">
          {filteredWithdraw.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer ${selectedId === item.id ? "ring-2 ring-[#1F6B78]/30" : ""}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#111827]" style={{ fontWeight: 600 }}>{item.name}</span>
                {getStatusBadge(item.status)}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{item.id}</span>
                <span>출자금 {item.balance}</span>
                <span>{item.requestedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Panel: Withdrawal Checklist */}
      {selectedId && selectedWithdraw && (
        <AdminDetailPanel
          title={`탈퇴 처리 — ${selectedWithdraw.name}`}
          onClose={() => { setSelectedId(null); setWdChecklist({ identity: false, services: false, payments: false, account: false }); }}
          width="w-full xl:w-[440px]"
        >
          <div className="bg-[#F2EBDD]/50 rounded-lg p-3 flex items-start gap-2 mb-1">
            <AlertTriangle size={14} className="text-[#7A6C55] mt-0.5 shrink-0" />
            <p className="text-xs text-[#7A6C55] leading-relaxed">탈퇴 처리는 되돌릴 수 없습니다. 아래 체크리스트를 모두 확인해 주세요.</p>
          </div>

          <DetailField label="요청 정보">
            <div className="bg-[#F8F9FC] rounded-lg p-3 space-y-1">
              <p className="text-sm text-[#374151]"><span className="text-gray-400">요청번호:</span> {selectedWithdraw.id}</p>
              <p className="text-sm text-[#374151]"><span className="text-gray-400">요청일:</span> {selectedWithdraw.requestedAt}</p>
              <p className="text-sm text-[#374151]"><span className="text-gray-400">출자금 잔액:</span> {selectedWithdraw.balance}</p>
            </div>
          </DetailField>

          <DetailField label="탈퇴 처리 체크리스트">
            <div className="space-y-3">
              <CheckItem
                checked={wdChecklist.identity}
                onChange={() => setWdChecklist({ ...wdChecklist, identity: !wdChecklist.identity })}
                label="본인 확인 완료"
                desc="신분증 또는 전화 본인 확인"
              />
              <CheckItem
                checked={wdChecklist.services}
                onChange={() => setWdChecklist({ ...wdChecklist, services: !wdChecklist.services })}
                label="미완료 서비스/예약 확인"
                desc={selectedWithdraw.pendingServices > 0 ? `미처리 서비스 ${selectedWithdraw.pendingServices}건 있음` : "미처리 서비스 없음"}
                warning={selectedWithdraw.pendingServices > 0}
              />
              <CheckItem
                checked={wdChecklist.payments}
                onChange={() => setWdChecklist({ ...wdChecklist, payments: !wdChecklist.payments })}
                label="미매칭 입금/환급 항목 확인"
                desc="출자금 원장 대조 완료"
              />
              <CheckItem
                checked={wdChecklist.account}
                onChange={() => setWdChecklist({ ...wdChecklist, account: !wdChecklist.account })}
                label="환급 계좌/방법 확인"
                desc="환급 계좌 정보 입력 (Supabase 연동 후)"
              />
            </div>
          </DetailField>

          <div className="pt-2">
            <button
              onClick={() => setConfirmModal({ type: "withdraw-final", target: selectedWithdraw })}
              disabled={!Object.values(wdChecklist).every(Boolean)}
              className="w-full py-2.5 rounded-lg bg-[#111827] text-white text-sm cursor-pointer hover:bg-[#1F2937] disabled:opacity-40 disabled:cursor-default flex items-center justify-center gap-2"
              style={{ fontWeight: 600 }}
            >
              <AlertTriangle size={14} />
              최종 탈퇴 처리
            </button>
          </div>
        </AdminDetailPanel>
      )}
    </div>
  );

  const renderRefundTab = (data: typeof REFUND_WAIT_DATA, isDone: boolean) => (
    <div className="space-y-3">
      <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름, 요청번호 검색..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
          />
        </div>
        <span className="text-xs text-gray-400 ml-auto">{data.length}건</span>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8F9FC]">
              <tr>
                {["요청번호", "회원", "환급 금액", "요청일", isDone ? "완료일" : "승인일", "방법", "처리자", "상태"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-[#9CA3AF] whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-400">
                    <Wallet size={24} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">환급 항목이 없습니다</p>
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="border-t border-gray-50 hover:bg-[#F8F9FC]/50">
                    <td className="px-4 py-3 text-[#1F6B78] text-xs" style={{ fontWeight: 500 }}>{item.id}</td>
                    <td className="px-4 py-3 text-[#111827]" style={{ fontWeight: 600 }}>{item.name}</td>
                    <td className="px-4 py-3 text-[#111827]" style={{ fontWeight: 600 }}>{item.amount}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{item.requestedAt}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{isDone ? (item as any).completedAt : item.approvedAt}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{item.method}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{item.handler}</td>
                    <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-3">
      <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="처리자, 대상, 액션 검색..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
          />
        </div>
        <button className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 cursor-pointer flex items-center gap-1.5" style={{ fontWeight: 500 }}>
          <Download size={13} />
          내보내기
        </button>
      </div>

      {/* Desktop table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8F9FC]">
              <tr>
                {["시간", "처리자", "대상", "액션", "상세"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-[#9CA3AF]" style={{ fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HISTORY_DATA.filter((h) => {
                if (!search) return true;
                const q = search.toLowerCase();
                return Object.values(h).some((v) => String(v).toLowerCase().includes(q));
              }).map((item) => (
                <tr key={item.id} className="border-t border-gray-50 hover:bg-[#F8F9FC]/50">
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{item.time}</td>
                  <td className="px-4 py-3 text-[#111827] text-xs" style={{ fontWeight: 500 }}>{item.actor}</td>
                  <td className="px-4 py-3 text-[#374151] text-xs">{item.target}</td>
                  <td className="px-4 py-3">
                    <Badge variant={item.action.includes("해제") || item.action.includes("완료") ? "secondary" : item.action.includes("등록") || item.action.includes("보류") ? "accent" : "neutral"}>
                      {item.action}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-[240px] truncate">{item.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {HISTORY_DATA.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">{item.time}</span>
              <Badge variant={item.action.includes("해제") || item.action.includes("완료") ? "secondary" : "accent"}>{item.action}</Badge>
            </div>
            <p className="text-sm text-[#111827] mb-1" style={{ fontWeight: 500 }}>{item.target}</p>
            <p className="text-xs text-gray-500">{item.detail}</p>
            <p className="text-xs text-gray-400 mt-1">처리: {item.actor}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className={`${isLarge ? "text-xl" : "text-lg"} text-[#111827]`} style={{ fontWeight: 700 }}>
            블랙리스트/탈퇴 관리
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">이용 제한 및 탈퇴·환급 처리를 관리합니다</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setRegisterModal(true)}
            className="px-3.5 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65] flex items-center gap-1.5"
            style={{ fontWeight: 600 }}
          >
            <Plus size={14} />
            블랙리스트 등록
          </button>
          <button
            onClick={() => alert("탈퇴 처리 기능은 '탈퇴 요청' 탭에서 시작합니다.")}
            className="px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-[#374151] cursor-pointer hover:bg-gray-50 flex items-center gap-1.5"
            style={{ fontWeight: 500 }}
          >
            <UserX size={14} />
            탈퇴 처리 시작
          </button>
          <button
            onClick={() => alert("내보내기 기능은 Supabase 연동 후 구현됩니다.")}
            className="px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-[#374151] cursor-pointer hover:bg-gray-50 flex items-center gap-1.5"
            style={{ fontWeight: 500 }}
          >
            <Download size={14} />
            내보내기
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <SummaryCard icon={Ban} label="블랙리스트 활성" value={BLACKLIST_DATA.filter((i) => i.status === "활성").length} color="#1F6B78" />
        <SummaryCard icon={UserX} label="탈퇴 요청" value={WITHDRAW_DATA.length} color="#1F6B78" />
        <SummaryCard icon={Clock} label="환급 대기" value={REFUND_WAIT_DATA.length} color="#7A6C55" />
        <SummaryCard icon={CheckCircle2} label="환급 완료 (전체)" value={REFUND_DONE_DATA.length} color="#67B89A" />
        <SummaryCard icon={History} label="이번달 처리" value={HISTORY_DATA.length} color="#374151" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-gray-200 -mx-1 px-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          const count = t.key === "blacklist" ? BLACKLIST_DATA.filter((i) => i.status === "활성").length
            : t.key === "withdraw" ? WITHDRAW_DATA.length
            : t.key === "refund-wait" ? REFUND_WAIT_DATA.length
            : t.key === "refund-done" ? REFUND_DONE_DATA.length
            : HISTORY_DATA.length;
          return (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSelectedId(null); setSearch(""); setSelectedItems(new Set()); }}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs whitespace-nowrap cursor-pointer border-b-2 transition-colors ${
                tab === t.key
                  ? "border-[#1F6B78] text-[#1F6B78]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
              style={{ fontWeight: tab === t.key ? 600 : 400 }}
            >
              <Icon size={14} />
              {t.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${tab === t.key ? "bg-[#1F6B78]/10 text-[#1F6B78]" : "bg-gray-100 text-gray-400"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {tab === "blacklist" && renderBlacklistTab()}
      {tab === "withdraw" && renderWithdrawTab()}
      {tab === "refund-wait" && renderRefundTab(REFUND_WAIT_DATA, false)}
      {tab === "refund-done" && renderRefundTab(REFUND_DONE_DATA, true)}
      {tab === "history" && renderHistoryTab()}

      {/* ── Modals ── */}

      {/* Release Confirm (2-step) */}
      <ConfirmModal
        open={confirmModal?.type === "release"}
        onClose={() => { setConfirmModal(null); setConfirmReason(""); setConfirmCheck(false); }}
        onConfirm={() => { alert("블랙리스트가 해제되었습니다. (Supabase 연동 후 실제 반영)"); setConfirmModal(null); setConfirmReason(""); setConfirmCheck(false); }}
        title="블랙리스트 해제"
        message={`${confirmModal?.target?.name}님의 블랙리스트를 해제하시겠습니까? 해제 후 해당 조합원은 제한된 기능을 다시 이용할 수 있습니다.`}
        confirmLabel="해제 확인"
        requireReason
        reason={confirmReason}
        onReasonChange={setConfirmReason}
      />

      {/* Bulk Release Confirm */}
      <ConfirmModal
        open={confirmModal?.type === "bulk-release"}
        onClose={() => { setConfirmModal(null); setConfirmReason(""); }}
        onConfirm={() => { alert(`${selectedItems.size}건 해제 처리되었습니다. (Supabase 연동 후 실제 반영)`); setConfirmModal(null); setConfirmReason(""); setSelectedItems(new Set()); }}
        title="블랙리스트 일괄 해제"
        message={`선택된 ${selectedItems.size}건의 블랙리스트를 일괄 해제하시겠습니까?`}
        confirmLabel="일괄 해제"
        requireReason
        reason={confirmReason}
        onReasonChange={setConfirmReason}
      />

      {/* Withdraw Final Confirm */}
      <ConfirmModal
        open={confirmModal?.type === "withdraw-final"}
        onClose={() => { setConfirmModal(null); setConfirmCheck(false); }}
        onConfirm={() => { alert("탈퇴 처리가 완료되었습니다. (Supabase 연동 후 실제 반영)"); setConfirmModal(null); setConfirmCheck(false); }}
        title="최종 탈퇴 처리 확인"
        message={`${confirmModal?.target?.name}님의 탈퇴를 최종 처리합니다. 이 작업은 되돌릴 수 없으며, 출자금 환급 절차가 시작됩니다.`}
        confirmLabel="최종 처리"
      />

      {/* Register Blacklist Modal */}
      {registerModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setRegisterModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base text-[#111827]" style={{ fontWeight: 700 }}>블랙리스트 등록</h3>
              <button onClick={() => setRegisterModal(false)} className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>회원 검색</label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    placeholder="이름 또는 회원ID로 검색..."
                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>제한 범위</label>
                <div className="space-y-2">
                  {["서비스 이용 제한", "커뮤니티 이용 제한", "문의 이용 제한"].map((s) => (
                    <label key={s} className="flex items-center gap-2 text-sm text-[#374151]">
                      <input type="checkbox" className="accent-[#1F6B78]" />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>해제 예정일 (선택)</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>사유 (필수)</label>
                <textarea
                  placeholder="블랙리스트 등록 사유를 상세히 입력해 주세요..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
                />
              </div>
              <div className="bg-[#F2EBDD]/50 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle size={14} className="text-[#7A6C55] mt-0.5 shrink-0" />
                <p className="text-xs text-[#7A6C55] leading-relaxed">블랙리스트 등록 시 해당 조합원은 선택된 범위의 서비스를 즉시 이용할 수 없게 됩니다. 이 변경은 감사 로그에 기록됩니다.</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setRegisterModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={() => { alert("블랙리스트 등록은 Supabase 연동 후 실제 반영됩니다."); setRegisterModal(false); }}
                className="px-4 py-2 rounded-lg bg-[#111827] text-white text-sm hover:bg-[#1F2937] cursor-pointer flex items-center gap-1.5"
                style={{ fontWeight: 600 }}
              >
                <AlertTriangle size={14} />
                등록
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function SummaryCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}10` }}>
          <Icon size={16} style={{ color }} />
        </div>
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <p className="text-xl text-[#111827]" style={{ fontWeight: 700 }}>{value}</p>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1" style={{ fontWeight: 600 }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function CheckItem({ checked, onChange, label, desc, warning }: { checked: boolean; onChange: () => void; label: string; desc: string; warning?: boolean }) {
  return (
    <label className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${checked ? "bg-[#67B89A]/5 border border-[#67B89A]/20" : "bg-[#F8F9FC] border border-gray-200"}`}>
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-[#67B89A] mt-0.5" />
      <div>
        <p className={`text-sm ${checked ? "text-[#2D7A5E]" : "text-[#374151]"}`} style={{ fontWeight: 500 }}>{label}</p>
        <p className={`text-xs mt-0.5 ${warning ? "text-[#7A6C55]" : "text-gray-400"}`}>
          {warning && <AlertTriangle size={11} className="inline mr-1" />}
          {desc}
        </p>
      </div>
    </label>
  );
}

function BulkBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs cursor-pointer"
      style={{ fontWeight: 500 }}
    >
      {label}
    </button>
  );
}
