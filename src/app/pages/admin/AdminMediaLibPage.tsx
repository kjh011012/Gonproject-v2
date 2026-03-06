import { useState } from "react";
import {
  Images, Upload, Search, Grid3X3, List, FolderOpen, Tag,
  ImageIcon, FileText, File, Trash2, RefreshCw, Scissors, Eye, AlertTriangle
} from "lucide-react";
import { Badge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField } from "../../components/admin/AdminDetailPanel";
import { useLargeMode } from "../../components/layouts/AdminLayout";

interface MediaAsset {
  id: string; filename: string; type: "이미지" | "PDF" | "문서"; size: string;
  uploadDate: string; usedIn: string[]; altText: string; color: string;
}

const MOCK: MediaAsset[] = [
  { id: "ML-001", filename: "hero-banner.jpg", type: "이미지", size: "1.2 MB", uploadDate: "2026-03-01", usedIn: ["홈 히어로", "서비스 페이지"], altText: "강원 산골 마을 풍경", color: "from-emerald-200 to-teal-100" },
  { id: "ML-002", filename: "service-nursing.jpg", type: "이미지", size: "850 KB", uploadDate: "2026-02-28", usedIn: ["서비스 카탈로그"], altText: "방문간호 서비스 이미지", color: "from-blue-100 to-cyan-100" },
  { id: "ML-003", filename: "event-walking.jpg", type: "이미지", size: "1.5 MB", uploadDate: "2026-02-20", usedIn: ["건강걷기 행사"], altText: "걷기 대회 사진", color: "from-amber-100 to-orange-100" },
  { id: "ML-004", filename: "annual-report-2025.pdf", type: "PDF", size: "3.2 MB", uploadDate: "2026-01-05", usedIn: ["자료실"], altText: "", color: "from-red-100 to-rose-100" },
  { id: "ML-005", filename: "join-form.docx", type: "문서", size: "45 KB", uploadDate: "2025-12-01", usedIn: ["가입 안내"], altText: "", color: "from-indigo-100 to-blue-100" },
  { id: "ML-006", filename: "yoga-class.jpg", type: "이미지", size: "920 KB", uploadDate: "2025-11-15", usedIn: [], altText: "요가 수업 사진", color: "from-violet-100 to-purple-100" },
];

const FOLDERS = ["전체", "서비스", "행사", "자료", "기타"];
const TYPES = ["전체", "이미지", "PDF", "문서"];

export function AdminMediaLibPage() {
  const { isLarge } = useLargeMode();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<MediaAsset | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("전체");
  const [showLeft, setShowLeft] = useState(true);

  const filtered = MOCK.filter((a) => {
    if (search && !a.filename.includes(search)) return false;
    if (filterType !== "전체" && a.type !== filterType) return false;
    return true;
  });

  const typeIcon = (t: string) => t === "이미지" ? <ImageIcon size={16} /> : t === "PDF" ? <FileText size={16} /> : <File size={16} />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className={`${isLarge ? "text-xl" : "text-lg"} text-[#111827]`} style={{ fontWeight: 700 }}>미디어 라이브러리</h1>
          <p className="text-xs text-gray-400 mt-0.5">이미지·파일 자산 중앙 관리 · 사용처 추적</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65] flex items-center gap-1.5" style={{ fontWeight: 600 }}><Upload size={14} />업로드</button>
          <button className="px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-[#374151] cursor-pointer hover:bg-gray-50 flex items-center gap-1.5" style={{ fontWeight: 500 }}><FolderOpen size={14} />폴더/태그</button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Left filter panel */}
        {showLeft && (
          <div className="hidden lg:block w-48 shrink-0 space-y-3">
            <div className="bg-white rounded-xl shadow-sm p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2" style={{ fontWeight: 600 }}>폴더</p>
              {FOLDERS.map((f) => <button key={f} className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-[#F8F9FC] cursor-pointer">{f}</button>)}
            </div>
            <div className="bg-white rounded-xl shadow-sm p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2" style={{ fontWeight: 600 }}>파일 유형</p>
              {TYPES.map((t) => (
                <button key={t} onClick={() => setFilterType(t)} className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs cursor-pointer ${filterType === t ? "bg-[#1F6B78]/10 text-[#1F6B78]" : "text-gray-600 hover:bg-[#F8F9FC]"}`} style={{ fontWeight: filterType === t ? 600 : 400 }}>{t}</button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0 space-y-3">
          <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="파일명 검색..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 ml-auto">
              <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded cursor-pointer ${viewMode === "grid" ? "bg-white shadow-sm text-[#1F6B78]" : "text-gray-400"}`}><Grid3X3 size={14} /></button>
              <button onClick={() => setViewMode("list")} className={`p-1.5 rounded cursor-pointer ${viewMode === "list" ? "bg-white shadow-sm text-[#1F6B78]" : "text-gray-400"}`}><List size={14} /></button>
            </div>
            <span className="text-xs text-gray-400">{filtered.length}건</span>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((a) => (
                <div key={a.id} onClick={() => setSelected(a)} className={`bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md ${selected?.id === a.id ? "ring-2 ring-[#1F6B78]/30" : ""}`}>
                  <div className={`h-28 bg-gradient-to-br ${a.color} flex items-center justify-center`}>
                    {typeIcon(a.type)}
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs text-[#111827] truncate" style={{ fontWeight: 500 }}>{a.filename}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-gray-400">{a.size}</span>
                      {a.usedIn.length > 0 && <span className="text-[10px] text-[#1F6B78] bg-[#1F6B78]/10 px-1.5 py-0.5 rounded-full" style={{ fontWeight: 500 }}>{a.usedIn.length}곳 사용</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#F8F9FC]"><tr>{["파일명", "유형", "크기", "업로드일", "사용처", ""].map((h) => <th key={h} className="text-left px-4 py-3 text-xs text-[#9CA3AF]" style={{ fontWeight: 600 }}>{h}</th>)}</tr></thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.id} onClick={() => setSelected(a)} className={`border-t border-gray-50 cursor-pointer ${selected?.id === a.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FC]/50"}`}>
                      <td className="px-4 py-3 text-[#111827]" style={{ fontWeight: 500 }}>{a.filename}</td>
                      <td className="px-4 py-3"><Badge variant={a.type === "이미지" ? "primary" : "neutral"}>{a.type}</Badge></td>
                      <td className="px-4 py-3 text-xs text-gray-500">{a.size}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{a.uploadDate}</td>
                      <td className="px-4 py-3">{a.usedIn.length > 0 ? <span className="text-xs text-[#1F6B78]">{a.usedIn.length}곳</span> : <span className="text-xs text-gray-400">미사용</span>}</td>
                      <td className="px-4 py-3"><button className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"><Eye size={13} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selected && (
          <AdminDetailPanel title={selected.filename} onClose={() => setSelected(null)} width="w-full xl:w-[380px]">
            <div className={`h-40 bg-gradient-to-br ${selected.color} rounded-lg flex items-center justify-center`}>
              {typeIcon(selected.type)}
            </div>
            <DetailField label="alt 텍스트">
              {selected.altText ? <p className="text-sm text-[#374151]">{selected.altText}</p> : <input placeholder="alt 텍스트 입력..." className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />}
            </DetailField>
            <DetailField label="메타 정보">
              <div className="bg-[#F8F9FC] rounded-lg p-3 space-y-1 text-xs text-gray-500">
                <p>크기: {selected.size}</p><p>형식: {selected.type}</p><p>업로드: {selected.uploadDate}</p>
              </div>
            </DetailField>
            <DetailField label="사용처">
              {selected.usedIn.length > 0 ? (
                <div className="space-y-1">{selected.usedIn.map((u) => <p key={u} className="text-sm text-[#1F6B78] cursor-pointer hover:underline">{u}</p>)}</div>
              ) : <p className="text-xs text-gray-400">현재 사용되지 않는 자산입니다</p>}
            </DetailField>
            <DetailField label="크롭 버전">
              <div className="flex gap-2">
                {["포스터", "타일", "커버"].map((p) => (
                  <button key={p} className="flex-1 py-2 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-1"><Scissors size={11} />{p}</button>
                ))}
              </div>
            </DetailField>
            <div className="flex gap-2 pt-2">
              <button className="flex-1 py-2 rounded-lg border border-gray-200 text-xs text-[#374151] hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-1"><RefreshCw size={12} />교체</button>
              <button disabled={selected.usedIn.length > 0} className="flex-1 py-2 rounded-lg border border-gray-200 text-xs hover:bg-gray-50 cursor-pointer disabled:opacity-40 disabled:cursor-default flex items-center justify-center gap-1 text-gray-500"><Trash2 size={12} />삭제</button>
            </div>
            {selected.usedIn.length > 0 && (
              <div className="bg-[#F2EBDD]/50 rounded-lg p-2.5 flex items-start gap-2">
                <AlertTriangle size={12} className="text-[#7A6C55] mt-0.5 shrink-0" />
                <p className="text-[11px] text-[#7A6C55]">{selected.usedIn.length}곳에서 사용 중이므로 삭제할 수 없습니다</p>
              </div>
            )}
          </AdminDetailPanel>
        )}
      </div>
    </div>
  );
}
