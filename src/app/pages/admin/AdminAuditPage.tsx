import { useState } from "react";
import {
  ScrollText, Search, Download, Eye, Filter, ChevronDown, Calendar
} from "lucide-react";
import { Badge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField } from "../../components/admin/AdminDetailPanel";
import { AdminModal } from "../../components/admin/AdminModal";
import { useLargeMode } from "../../components/layouts/AdminLayout";

interface AuditEntry {
  id: string; time: string; user: string; object: string; objectType: string;
  action: string; summary: string; before?: string; after?: string;
}

const MOCK: AuditEntry[] = [
  { id: "AL-001", time: "2026-03-06 09:30", user: "김관리", objectType: "조합원", object: "정태호(M-2026-0001)", action: "상태 변경", summary: "입금확인중 → 가입완료", before: "상태: 입금확인중", after: "상태: 가입완료" },
  { id: "AL-002", time: "2026-03-06 09:15", user: "김관리", objectType: "설정", object: "운영 설정", action: "수정", summary: "운영시간 변경", before: "운영시간: 미정", after: "운영시간: 09:00-18:00" },
  { id: "AL-003", time: "2026-03-06 08:30", user: "한회계", objectType: "입금", object: "TXN-2026-031", action: "확인 처리", summary: "자동매칭 → 확인완료", before: "상태: 자동매칭", after: "상태: 확인완료" },
  { id: "AL-004", time: "2026-03-05 17:00", user: "최콘텐츠", objectType: "게시물", object: "3월 폭설 대비 안내", action: "게시", summary: "초안 → 게시", before: "게시 상태: 초안", after: "게시 상태: 게시" },
  { id: "AL-005", time: "2026-03-05 14:30", user: "정CS", objectType: "문의", object: "INQ-004", action: "답변 전송", summary: "예약 시간 변경 답변", before: "상태: 대기", after: "상태: 답변완료" },
  { id: "AL-006", time: "2026-03-05 10:00", user: "이운영", objectType: "서비스", object: "SVC-2026-088", action: "배정", summary: "미배정 → 상담사 최OO", before: "담당자: 미배정", after: "담당자: 최OO" },
  { id: "AL-007", time: "2026-03-04 16:45", user: "김관리", objectType: "권한", object: "오감사", action: "권한 변경", summary: "읽기전용 → 비활성", before: "상태: 활성, 역할: 읽기전용", after: "상태: 비활성" },
  { id: "AL-008", time: "2026-03-04 11:00", user: "이운영", objectType: "조합원", object: "김○○(M-0047)", action: "블랙리스트 등록", summary: "서비스+커뮤니티 이용 제한", before: "상태: 정회원", after: "상태: 블랙리스트" },
  { id: "AL-009", time: "2026-03-03 15:20", user: "최콘텐츠", objectType: "게시물", object: "건강걷기 대회 안내", action: "생성", summary: "새 행사 등록", before: "-", after: "제목: 건강걷기 대회, 상태: 초안" },
  { id: "AL-010", time: "2026-03-03 09:00", user: "김관리", objectType: "조합원", object: "테스트 계정", action: "삭제", summary: "테스트 계정 휴지통 이동", before: "상태: 활성", after: "상태: 삭제됨" },
];

const OBJECT_TYPES = ["전체", "조합원", "입금", "서비스", "게시물", "문의", "설정", "권한"];
const ACTIONS = ["전체", "생성", "수정", "삭제", "상태 변경", "배정", "게시", "권한 변경"];

const actionBadge = (a: string) => {
  if (["생성", "게시"].includes(a)) return "secondary" as const;
  if (["삭제", "블랙리스트 등록", "권한 변경"].includes(a)) return "accent" as const;
  return "neutral" as const;
};

export function AdminAuditPage() {
  const { isLarge } = useLargeMode();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("전체");
  const [filterAction, setFilterAction] = useState("전체");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  const filtered = MOCK.filter((e) => {
    if (search && !Object.values(e).some((v) => String(v).toLowerCase().includes(search.toLowerCase()))) return false;
    if (filterType !== "전체" && e.objectType !== filterType) return false;
    if (filterAction !== "전체" && e.action !== filterAction) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className={`${isLarge ? "text-xl" : "text-lg"} text-[#111827]`} style={{ fontWeight: 700 }}>감사 로그</h1>
          <p className="text-xs text-gray-400 mt-0.5">누가·언제·무엇을 변경했는지 추적합니다</p>
        </div>
        <button onClick={() => alert("내보내기 (Supabase 연동 후)")} className="px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-[#374151] cursor-pointer hover:bg-gray-50 flex items-center gap-1.5" style={{ fontWeight: 500 }}><Download size={14} />내보내기</button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl p-3 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-3">
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="사용자, 대상, 액션 검색..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className={`px-3 py-2 rounded-lg border text-xs cursor-pointer flex items-center gap-1.5 ${showFilters ? "border-[#1F6B78] text-[#1F6B78] bg-[#1F6B78]/5" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`} style={{ fontWeight: 500 }}>
            <Filter size={13} /> 필터
          </button>
          <span className="text-xs text-gray-400">{filtered.length}건</span>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1" style={{ fontWeight: 600 }}>객체 유형</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm cursor-pointer focus:outline-none">{OBJECT_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1" style={{ fontWeight: 600 }}>액션</label>
            <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm cursor-pointer focus:outline-none">{ACTIONS.map((a) => <option key={a}>{a}</option>)}</select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1" style={{ fontWeight: 600 }}>기간</label>
            <div className="flex gap-1"><input type="date" className="flex-1 px-2 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-xs focus:outline-none" /><input type="date" className="flex-1 px-2 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-xs focus:outline-none" /></div>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          {/* Desktop Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden hidden md:block">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F9FC]"><tr>{["시간", "사용자", "객체", "액션", "요약", ""].map((h) => <th key={h} className="text-left px-4 py-3 text-xs text-[#9CA3AF]" style={{ fontWeight: 600 }}>{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id} onClick={() => setSelectedEntry(e)} className={`border-t border-gray-50 cursor-pointer ${selectedEntry?.id === e.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FC]/50"}`}>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{e.time}</td>
                    <td className="px-4 py-3 text-[#111827]" style={{ fontWeight: 500 }}>{e.user}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="text-gray-400">{e.objectType}</span>
                      <span className="text-[#374151] ml-1">{e.object}</span>
                    </td>
                    <td className="px-4 py-3"><Badge variant={actionBadge(e.action)}>{e.action}</Badge></td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-[200px] truncate">{e.summary}</td>
                    <td className="px-4 py-3"><button className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"><Eye size={13} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-2">
            {filtered.map((e) => (
              <div key={e.id} onClick={() => setSelectedEntry(e)} className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer ${selectedEntry?.id === e.id ? "ring-2 ring-[#1F6B78]/30" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">{e.time}</span>
                  <Badge variant={actionBadge(e.action)}>{e.action}</Badge>
                </div>
                <p className="text-sm text-[#111827]" style={{ fontWeight: 500 }}>{e.object}</p>
                <p className="text-xs text-gray-500 mt-0.5">{e.summary}</p>
                <p className="text-xs text-gray-400 mt-1">처리: {e.user}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedEntry && (
          <AdminDetailPanel title="변경 상세" onClose={() => setSelectedEntry(null)} width="w-full xl:w-[400px]">
            <DetailField label="시간"><p className="text-sm text-[#374151]">{selectedEntry.time}</p></DetailField>
            <DetailField label="사용자"><p className="text-sm text-[#111827]" style={{ fontWeight: 500 }}>{selectedEntry.user}</p></DetailField>
            <DetailField label="대상"><p className="text-sm text-[#374151]"><span className="text-gray-400">[{selectedEntry.objectType}]</span> {selectedEntry.object}</p></DetailField>
            <DetailField label="액션"><Badge variant={actionBadge(selectedEntry.action)}>{selectedEntry.action}</Badge></DetailField>
            <DetailField label="요약"><p className="text-sm text-[#374151]">{selectedEntry.summary}</p></DetailField>
            {selectedEntry.before && selectedEntry.after && (
              <DetailField label="변경 전/후">
                <div className="space-y-2">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-[10px] text-gray-400 mb-1" style={{ fontWeight: 600 }}>변경 전</p>
                    <p className="text-sm text-gray-500">{selectedEntry.before}</p>
                  </div>
                  <div className="bg-[#67B89A]/5 rounded-lg p-3 border border-[#67B89A]/20">
                    <p className="text-[10px] text-[#2D7A5E] mb-1" style={{ fontWeight: 600 }}>변경 후</p>
                    <p className="text-sm text-[#2D7A5E]">{selectedEntry.after}</p>
                  </div>
                </div>
              </DetailField>
            )}
            <button className="w-full py-2 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 cursor-pointer mt-2" style={{ fontWeight: 500 }}>관련 객체 바로가기 (placeholder)</button>
          </AdminDetailPanel>
        )}
      </div>
    </div>
  );
}
