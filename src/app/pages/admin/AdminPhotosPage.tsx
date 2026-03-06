import { useState } from "react";
import {
  ImageIcon, Plus, Search, Eye, EyeOff, FolderOpen, Tag, Star,
  Grid3X3, Trash2, Upload
} from "lucide-react";
import { Badge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField } from "../../components/admin/AdminDetailPanel";
import { useLargeMode } from "../../components/layouts/AdminLayout";

interface Photo {
  id: string; title: string; caption: string; captionSenior: string;
  album: string; tags: string[]; status: "게시" | "숨김"; featured: boolean;
  uploadDate: string; color: string;
}

const MOCK: Photo[] = [
  { id: "P-001", title: "봄맞이 건강걷기 1", caption: "함께 걸으며 건강을 챙기는 모습", captionSenior: "다 같이 걸었어요", album: "건강걷기 대회", tags: ["행사", "걷기"], status: "게시", featured: true, uploadDate: "2026-03-01", color: "from-emerald-200 to-teal-100" },
  { id: "P-002", title: "건강교실 수업 장면", caption: "고혈압 자가관리 교육 진행 중", captionSenior: "건강 공부하는 모습", album: "건강교실", tags: ["교육"], status: "게시", featured: false, uploadDate: "2026-02-20", color: "from-blue-100 to-cyan-100" },
  { id: "P-003", title: "방문간호 서비스", caption: "가정에서 건강관리를 받는 장면", captionSenior: "집에서 건강을 봐요", album: "서비스", tags: ["서비스", "간호"], status: "게시", featured: true, uploadDate: "2026-02-15", color: "from-amber-100 to-orange-100" },
  { id: "P-004", title: "설 나눔 행사", caption: "설을 맞아 떡을 나누는 모습", captionSenior: "떡을 나눴어요", album: "행사", tags: ["행사", "명절"], status: "게시", featured: false, uploadDate: "2026-01-28", color: "from-rose-100 to-pink-100" },
  { id: "P-005", title: "요가 모임", caption: "어르신 맞춤 요가 프로그램", captionSenior: "요가를 했어요", album: "건강모임", tags: ["모임", "운동"], status: "숨김", featured: false, uploadDate: "2026-01-15", color: "from-violet-100 to-purple-100" },
  { id: "P-006", title: "단체 사진", caption: "조합 창립 기념 단체 사진", captionSenior: "다 같이 찍었어요", album: "행사", tags: ["행사", "기념"], status: "게시", featured: false, uploadDate: "2025-12-20", color: "from-lime-100 to-green-100" },
];

const ALBUMS = ["전체", "건강걷기 대회", "건강교실", "서비스", "행사", "건강모임"];

export function AdminPhotosPage() {
  const { isLarge } = useLargeMode();
  const [tab, setTab] = useState<"all" | "album" | "hidden">("all");
  const [selectedAlbum, setSelectedAlbum] = useState("전체");
  const [selected, setSelected] = useState<Photo | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const displayed = MOCK.filter((p) => {
    if (tab === "hidden") return p.status === "숨김";
    if (tab === "album" && selectedAlbum !== "전체") return p.album === selectedAlbum && p.status !== "숨김";
    return p.status !== "숨김";
  }).filter((p) => !search || p.title.includes(search) || p.caption.includes(search));

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className={`${isLarge ? "text-xl" : "text-lg"} text-[#111827]`} style={{ fontWeight: 700 }}>사진/후기 관리</h1>
          <p className="text-xs text-gray-400 mt-0.5">갤러리 사진·앨범·후기를 관리합니다</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65] flex items-center gap-1.5" style={{ fontWeight: 600 }}><Upload size={14} />사진 업로드</button>
          <button className="px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-[#374151] cursor-pointer hover:bg-gray-50 flex items-center gap-1.5" style={{ fontWeight: 500 }}><FolderOpen size={14} />앨범 생성</button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1">
          {[{ k: "all" as const, l: "전체" }, { k: "album" as const, l: "앨범별" }, { k: "hidden" as const, l: "숨김" }].map((t) => (
            <button key={t.k} onClick={() => setTab(t.k)} className={`px-3 py-1.5 text-xs rounded-lg cursor-pointer ${tab === t.k ? "bg-[#1F6B78] text-white" : "bg-white text-gray-500 border border-gray-200"}`} style={{ fontWeight: tab === t.k ? 600 : 400 }}>{t.l}</button>
          ))}
          {tab === "album" && (
            <select value={selectedAlbum} onChange={(e) => setSelectedAlbum(e.target.value)} className="px-2 py-1.5 rounded-lg border border-gray-200 text-xs cursor-pointer focus:outline-none ml-2">
              {ALBUMS.map((a) => <option key={a}>{a}</option>)}
            </select>
          )}
        </div>
        <div className="relative max-w-xs w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="제목, 태그 검색..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="bg-[#1F6B78] rounded-xl px-4 py-2.5 flex items-center gap-4 text-white text-sm">
          <span style={{ fontWeight: 600 }}>{selectedIds.size}장 선택</span>
          <div className="flex gap-2 ml-auto">
            <button className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs cursor-pointer">게시/숨김</button>
            <button className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs cursor-pointer">앨범 이동</button>
            <button className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs cursor-pointer">태그 추가</button>
            <button onClick={() => setSelectedIds(new Set())} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs cursor-pointer">해제</button>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {displayed.map((p) => (
              <div key={p.id} onClick={() => setSelected(p)} className={`bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md ${selected?.id === p.id ? "ring-2 ring-[#1F6B78]/30" : ""}`}>
                <div className={`h-32 bg-gradient-to-br ${p.color} relative flex items-center justify-center`}>
                  <ImageIcon size={24} className="text-white/60" />
                  {p.featured && <div className="absolute top-2 left-2"><Star size={14} className="text-[#1F6B78] fill-[#1F6B78]" /></div>}
                  <div className="absolute top-2 right-2" onClick={(e) => { e.stopPropagation(); toggleSelect(p.id); }}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer ${selectedIds.has(p.id) ? "bg-[#1F6B78] border-[#1F6B78] text-white" : "border-white/70 bg-white/30"}`}>
                      {selectedIds.has(p.id) && <span className="text-[10px]">✓</span>}
                    </div>
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="text-xs text-[#111827] truncate" style={{ fontWeight: 500 }}>{p.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {p.tags.slice(0, 2).map((t) => <span key={t} className="px-1 py-0.5 rounded bg-gray-100 text-gray-500 text-[9px]">{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selected && (
          <AdminDetailPanel title={selected.title} onClose={() => setSelected(null)} width="w-full xl:w-[380px]">
            <div className={`h-48 bg-gradient-to-br ${selected.color} rounded-lg flex items-center justify-center`}>
              <ImageIcon size={40} className="text-white/40" />
            </div>
            <DetailField label="캡션 (일반)"><p className="text-sm text-[#374151]">{selected.caption}</p></DetailField>
            <DetailField label="캡션 (어르신)"><p className="text-sm text-[#374151]">{selected.captionSenior}</p></DetailField>
            <DetailField label="앨범"><Badge variant="primaryLight">{selected.album}</Badge></DetailField>
            <DetailField label="태그"><div className="flex gap-1">{selected.tags.map((t) => <span key={t} className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs">{t}</span>)}</div></DetailField>
            <DetailField label="상태"><Badge variant={selected.status === "게시" ? "secondary" : "neutral"}>{selected.status}</Badge></DetailField>
            <DetailField label="업로드일"><p className="text-xs text-gray-400">{selected.uploadDate}</p></DetailField>
            <div className="flex gap-2 pt-2">
              <button className="flex-1 py-2 rounded-lg border border-gray-200 text-xs text-[#374151] hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-1"><Star size={12} />대표 설정</button>
              <button className="flex-1 py-2 rounded-lg border border-gray-200 text-xs text-[#374151] hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-1"><EyeOff size={12} />{selected.status === "게시" ? "숨김" : "게시"}</button>
            </div>
          </AdminDetailPanel>
        )}
      </div>
    </div>
  );
}
