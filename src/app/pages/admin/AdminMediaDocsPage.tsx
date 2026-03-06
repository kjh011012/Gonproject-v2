import { useState } from "react";
import {
  Newspaper, Plus, Search, Edit, Eye, ExternalLink, FileText, Download, Monitor, Smartphone
} from "lucide-react";
import { Badge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField } from "../../components/admin/AdminDetailPanel";
import { AdminModal } from "../../components/admin/AdminModal";
import { useLargeMode } from "../../components/layouts/AdminLayout";

interface MediaDoc {
  id: string; type: "언론" | "자료" | "서식"; title: string; source: string;
  publishDate: string; hasLink: boolean; hasFile: boolean;
  publishStatus: "게시" | "숨김" | "초안"; descNormal: string; descSenior: string;
}

const MOCK: MediaDoc[] = [
  { id: "MD-001", type: "언론", title: "강원 농촌 의료 협동조합, 지역 돌봄 새 모델 제시", source: "강원일보", publishDate: "2026-02-15", hasLink: true, hasFile: false, publishStatus: "게시", descNormal: "강원 농촌 지역의 의료 사각지대를 해소하기 위한 새로운 모델", descSenior: "우리 조합이 신문에 났어요" },
  { id: "MD-002", type: "언론", title: "횡성군 의료사협, 어르신 건강관리 서비스 확대", source: "횡성신문", publishDate: "2026-01-20", hasLink: true, hasFile: false, publishStatus: "게시", descNormal: "횡성군 내 어르신 건강관리 서비스 범위 확대 보도", descSenior: "건강관리가 더 넓어졌어요" },
  { id: "MD-003", type: "자료", title: "2025년 사업보고서", source: "G온돌봄", publishDate: "2026-01-05", hasLink: false, hasFile: true, publishStatus: "게시", descNormal: "2025년 사업 실적 및 주요 성과 보고서", descSenior: "작년에 이런 일들을 했어요" },
  { id: "MD-004", type: "서식", title: "조합원 가입 신청서", source: "G온돌봄", publishDate: "2025-12-01", hasLink: false, hasFile: true, publishStatus: "게시", descNormal: "조합원 가입을 위한 신청 서식", descSenior: "가입하려면 이 서류를 쓰세요" },
  { id: "MD-005", type: "자료", title: "건강관리 가이드북", source: "G온돌봄", publishDate: "2025-11-15", hasLink: false, hasFile: true, publishStatus: "숨김", descNormal: "어르신을 위한 건강관리 가이드북 PDF", descSenior: "건강 지키는 방법 책자예요" },
];

const typeBadge = (t: string) => t === "언론" ? "primary" as const : t === "자료" ? "secondary" as const : "accent" as const;

export function AdminMediaDocsPage() {
  const { isLarge } = useLargeMode();
  const [selected, setSelected] = useState<MediaDoc | null>(null);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = MOCK.filter((d) => !search || d.title.includes(search) || d.source.includes(search));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className={`${isLarge ? "text-xl" : "text-lg"} text-[#111827]`} style={{ fontWeight: 700 }}>언론/자료 관리</h1>
          <p className="text-xs text-gray-400 mt-0.5">언론 기사·보도자료·서식을 관리합니다</p>
        </div>
        <button className="px-3.5 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65] flex items-center gap-1.5" style={{ fontWeight: 600 }}><Plus size={14} />자료 등록</button>
      </div>

      <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="제목, 출처 검색..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
        </div>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length}건</span>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F9FC]"><tr>{["유형", "제목", "출처", "발행일", "링크/파일", "게시 상태", ""].map((h) => <th key={h} className="text-left px-4 py-3 text-xs text-[#9CA3AF]" style={{ fontWeight: 600 }}>{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} onClick={() => { setSelected(d); setEditing(false); }} className={`border-t border-gray-50 cursor-pointer ${selected?.id === d.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FC]/50"}`}>
                    <td className="px-4 py-3"><Badge variant={typeBadge(d.type)}>{d.type}</Badge></td>
                    <td className="px-4 py-3 text-[#111827]" style={{ fontWeight: 600 }}>{d.title}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{d.source}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{d.publishDate}</td>
                    <td className="px-4 py-3 flex gap-1">
                      {d.hasLink && <span className="text-[#1F6B78]"><ExternalLink size={13} /></span>}
                      {d.hasFile && <span className="text-gray-500"><FileText size={13} /></span>}
                    </td>
                    <td className="px-4 py-3"><Badge variant={d.publishStatus === "게시" ? "secondary" : "neutral"}>{d.publishStatus}</Badge></td>
                    <td className="px-4 py-3"><button onClick={(e) => { e.stopPropagation(); setSelected(d); setEditing(true); }} className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"><Edit size={13} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <AdminDetailPanel title={editing ? `${selected.title} 편집` : selected.title} onClose={() => setSelected(null)} width="w-full xl:w-[400px]">
            {editing ? (
              <div className="space-y-4">
                <DetailField label="유형"><select defaultValue={selected.type} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm cursor-pointer focus:outline-none"><option>언론</option><option>자료</option><option>서식</option></select></DetailField>
                <DetailField label="제목"><input defaultValue={selected.title} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" /></DetailField>
                <DetailField label="요약 (일반)"><textarea defaultValue={selected.descNormal} rows={2} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm resize-none focus:outline-none" /></DetailField>
                <DetailField label="요약 (어르신)"><textarea defaultValue={selected.descSenior} rows={2} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm resize-none focus:outline-none" /></DetailField>
                <DetailField label="게시 상태"><select defaultValue={selected.publishStatus} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm cursor-pointer focus:outline-none"><option>초안</option><option>게시</option><option>숨김</option></select></DetailField>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setEditing(false)} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 cursor-pointer hover:bg-gray-50">취소</button>
                  <button onClick={() => { alert("저장 (Supabase 연동 후)"); setEditing(false); }} className="flex-1 py-2 rounded-lg bg-[#1F6B78] text-white text-sm cursor-pointer hover:bg-[#185A65]" style={{ fontWeight: 600 }}>저장</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2"><Badge variant={typeBadge(selected.type)}>{selected.type}</Badge><Badge variant={selected.publishStatus === "게시" ? "secondary" : "neutral"}>{selected.publishStatus}</Badge></div>
                <DetailField label="출처"><p className="text-sm text-[#374151]">{selected.source}</p></DetailField>
                <DetailField label="발행일"><p className="text-sm text-[#374151]">{selected.publishDate}</p></DetailField>
                <DetailField label="요약 (일반)"><p className="text-sm text-[#374151]">{selected.descNormal}</p></DetailField>
                <DetailField label="요약 (어르신)"><p className="text-sm text-[#374151]">{selected.descSenior}</p></DetailField>
                <button onClick={() => setEditing(true)} className="w-full py-2 rounded-lg border border-gray-200 text-xs text-[#374151] hover:bg-gray-50 cursor-pointer" style={{ fontWeight: 500 }}>편집</button>
              </div>
            )}
          </AdminDetailPanel>
        )}
      </div>
    </div>
  );
}
