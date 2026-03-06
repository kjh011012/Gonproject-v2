import { useState } from "react";
import {
  FileText, Plus, Search, Edit, Copy, Eye, EyeOff, MessageSquare, Variable
} from "lucide-react";
import { Badge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField } from "../../components/admin/AdminDetailPanel";
import { useLargeMode } from "../../components/layouts/AdminLayout";

const CATEGORIES = ["전체", "가입/출자금", "서비스 신청/일정", "방문/재택 안내", "환급/탈퇴", "개인정보/약관", "기타"];
const VARIABLES = ["{이름}", "{대표전화}", "{운영시간}", "{주소}", "{서비스명}", "{일정}"];

interface Template {
  id: string; title: string; category: string; usageCount: number;
  active: boolean; lastModified: string; bodyNormal: string; bodySenior: string;
}

const MOCK: Template[] = [
  { id: "T-001", title: "가입 완료 안내", category: "가입/출자금", usageCount: 45, active: true, lastModified: "2026-03-01", bodyNormal: "{이름}님, 조합 가입이 완료되었습니다. 출자금 입금이 확인되면 정회원으로 전환됩니다. 문의: {대표전화}", bodySenior: "{이름}님, 가입됐어요! 궁금하면 {대표전화}로 전화하세요" },
  { id: "T-002", title: "서비스 일정 확정", category: "서비스 신청/일정", usageCount: 128, active: true, lastModified: "2026-03-03", bodyNormal: "{이름}님, {서비스명} 일정이 {일정}로 확정되었습니다. 준비 사항이 있으면 사전에 안내드리겠습니다.", bodySenior: "{이름}님, {서비스명} 날짜가 {일정}로 정해졌어요" },
  { id: "T-003", title: "방문 전 안내", category: "방문/재택 안내", usageCount: 89, active: true, lastModified: "2026-02-28", bodyNormal: "{이름}님, 내일 {서비스명} 방문 예정입니다. 시간: {일정}. 변경이 필요하시면 {대표전화}로 연락해 주세요.", bodySenior: "{이름}님, 내일 집에 가요. 시간: {일정}. 안되면 {대표전화}로 전화하세요" },
  { id: "T-004", title: "환급 처리 안내", category: "환급/탈퇴", usageCount: 12, active: true, lastModified: "2026-02-20", bodyNormal: "{이름}님, 출자금 환급 처리가 시작되었습니다. 약 7~14일 소요될 수 있습니다. 문의: {대표전화}", bodySenior: "{이름}님, 돈 돌려드리는 처리가 시작됐어요. 2주 정도 걸려요" },
  { id: "T-005", title: "문의 답변 안내", category: "기타", usageCount: 67, active: true, lastModified: "2026-02-15", bodyNormal: "{이름}님, 문의하신 내용에 대한 답변을 드립니다. 추가 궁금하신 점은 {대표전화}로 연락해 주세요.", bodySenior: "{이름}님, 물어보신 거 답변 드려요. 더 궁금하면 {대표전화}로 전화하세요" },
  { id: "T-006", title: "운영시간 안내", category: "기타", usageCount: 34, active: false, lastModified: "2026-01-10", bodyNormal: "G온돌봄 운영시간은 {운영시간}입니다. 주소: {주소}. 전화: {대표전화}", bodySenior: "운영시간: {운영시간}이에요. 전화: {대표전화}" },
];

export function AdminTemplatesPage() {
  const { isLarge } = useLargeMode();
  const [category, setCategory] = useState("전체");
  const [selected, setSelected] = useState<Template | null>(null);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = MOCK.filter((t) => {
    if (search && !t.title.includes(search) && !t.bodyNormal.includes(search)) return false;
    if (category !== "전체" && t.category !== category) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className={`${isLarge ? "text-xl" : "text-lg"} text-[#111827]`} style={{ fontWeight: 700 }}>답변 템플릿</h1>
          <p className="text-xs text-gray-400 mt-0.5">문의 응답 매크로·템플릿 관리 (일반 + 어르신)</p>
        </div>
        <button className="px-3.5 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65] flex items-center gap-1.5" style={{ fontWeight: 600 }}><Plus size={14} />템플릿 추가</button>
      </div>

      <div className="flex gap-4">
        {/* Left: Categories */}
        <div className="hidden lg:block w-48 shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-3 space-y-0.5">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider px-2 pb-2" style={{ fontWeight: 600 }}>카테고리</p>
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={`w-full text-left px-2.5 py-2 rounded-lg text-xs cursor-pointer ${category === c ? "bg-[#1F6B78]/10 text-[#1F6B78]" : "text-gray-600 hover:bg-[#F8F9FC]"}`} style={{ fontWeight: category === c ? 600 : 400 }}>{c}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="제목, 내용 검색..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
            </div>
            <span className="text-xs text-gray-400 ml-auto">{filtered.length}건</span>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F9FC]"><tr>{["제목", "카테고리", "사용 횟수", "활성", "수정일", ""].map((h) => <th key={h} className="text-left px-4 py-3 text-xs text-[#9CA3AF]" style={{ fontWeight: 600 }}>{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} onClick={() => { setSelected(t); setEditing(false); }} className={`border-t border-gray-50 cursor-pointer ${selected?.id === t.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FC]/50"}`}>
                    <td className="px-4 py-3 text-[#111827]" style={{ fontWeight: 600 }}>{t.title}</td>
                    <td className="px-4 py-3"><Badge variant="primaryLight">{t.category}</Badge></td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{t.usageCount}회</td>
                    <td className="px-4 py-3"><Badge variant={t.active ? "secondary" : "neutral"}>{t.active ? "활성" : "비활성"}</Badge></td>
                    <td className="px-4 py-3 text-xs text-gray-400">{t.lastModified}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => { setSelected(t); setEditing(true); }} className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"><Edit size={13} /></button>
                        <button className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"><Copy size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <AdminDetailPanel title={editing ? `${selected.title} 편집` : selected.title} onClose={() => { setSelected(null); setEditing(false); }} width="w-full xl:w-[420px]">
            {editing ? (
              <div className="space-y-4">
                <DetailField label="제목"><input defaultValue={selected.title} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" /></DetailField>
                <DetailField label="카테고리">
                  <select defaultValue={selected.category} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm cursor-pointer focus:outline-none">
                    {CATEGORIES.filter((c) => c !== "전체").map((c) => <option key={c}>{c}</option>)}
                  </select>
                </DetailField>
                <DetailField label="답변 (일반)"><textarea defaultValue={selected.bodyNormal} rows={4} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" /></DetailField>
                <DetailField label="답변 (어르신)"><textarea defaultValue={selected.bodySenior} rows={3} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" /></DetailField>
                <DetailField label="변수 삽입">
                  <div className="flex gap-1 flex-wrap">{VARIABLES.map((v) => <button key={v} className="px-2 py-1 rounded bg-[#1F6B78]/10 text-[#1F6B78] text-[10px] cursor-pointer hover:bg-[#1F6B78]/20" style={{ fontWeight: 500 }}>{v}</button>)}</div>
                </DetailField>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setEditing(false)} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 cursor-pointer hover:bg-gray-50">취소</button>
                  <button onClick={() => { alert("저장 (Supabase 연동 후)"); setEditing(false); }} className="flex-1 py-2 rounded-lg bg-[#1F6B78] text-white text-sm cursor-pointer hover:bg-[#185A65]" style={{ fontWeight: 600 }}>저장</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2"><Badge variant="primaryLight">{selected.category}</Badge><Badge variant={selected.active ? "secondary" : "neutral"}>{selected.active ? "활성" : "비활성"}</Badge></div>
                <DetailField label="답변 (일반)">
                  <div className="bg-[#F8F9FC] rounded-lg p-3 text-sm text-[#374151] leading-relaxed">{selected.bodyNormal}</div>
                </DetailField>
                <DetailField label="답변 (어르신)">
                  <div className="bg-[#F2EBDD]/30 rounded-lg p-3 text-sm text-[#374151] leading-relaxed">{selected.bodySenior}</div>
                </DetailField>
                <DetailField label="사용 횟수"><p className="text-sm text-[#374151]">{selected.usageCount}회</p></DetailField>
                <DetailField label="수정일"><p className="text-xs text-gray-400">{selected.lastModified}</p></DetailField>
                <p className="text-xs text-gray-400 bg-[#F8F9FC] rounded-lg p-2.5">💡 문의 답변 화면에서 이 템플릿을 선택할 수 있습니다</p>
                <button onClick={() => setEditing(true)} className="w-full py-2 rounded-lg border border-gray-200 text-xs text-[#374151] hover:bg-gray-50 cursor-pointer" style={{ fontWeight: 500 }}>편집</button>
              </div>
            )}
          </AdminDetailPanel>
        )}
      </div>
    </div>
  );
}
