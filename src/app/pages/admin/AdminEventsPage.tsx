import { useState } from "react";
import {
  PartyPopper, Plus, Eye, Edit, Copy, EyeOff, Search, Calendar,
  List, MapPin, Users, Clock, Monitor, Smartphone, ImageIcon, X
} from "lucide-react";
import { Badge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField } from "../../components/admin/AdminDetailPanel";
import { AdminModal } from "../../components/admin/AdminModal";
import { useLargeMode } from "../../components/layouts/AdminLayout";

interface EventItem {
  id: string; title: string; date: string; time: string; location: string;
  recruitStatus: "모집중" | "마감" | "안내만"; publishStatus: "초안" | "예약" | "게시" | "숨김";
  pinned: boolean; lastModified: string; descNormal: string; descSenior: string;
}

const MOCK: EventItem[] = [
  { id: "EV-001", title: "봄맞이 건강걷기 대회", date: "2026-03-20", time: "10:00-14:00", location: "횡성군 섬강변 산책로", recruitStatus: "모집중", publishStatus: "게시", pinned: true, lastModified: "2026-03-04", descNormal: "봄을 맞아 함께 걸으며 건강을 챙기는 행사입니다", descSenior: "봄에 같이 걸어요. 누구나 참여할 수 있어요" },
  { id: "EV-002", title: "고혈압·당뇨 자가관리 교실", date: "2026-03-15", time: "14:00-16:00", location: "횡성읍 복지관 2층", recruitStatus: "모집중", publishStatus: "게시", pinned: false, lastModified: "2026-03-03", descNormal: "만성질환 관리를 위한 전문 교육 프로그램", descSenior: "혈압·당뇨 관리법을 알려드려요" },
  { id: "EV-003", title: "4월 건강 요가 모임", date: "2026-04-05", time: "09:00-10:30", location: "둔내면 주민센터", recruitStatus: "안내만", publishStatus: "예약", pinned: false, lastModified: "2026-03-02", descNormal: "어르신 맞춤 요가 프로그램", descSenior: "쉬운 요가를 함께 해요" },
  { id: "EV-004", title: "설 맞이 떡 나눔 행사", date: "2026-01-28", time: "11:00-13:00", location: "안흥면 마을회관", recruitStatus: "마감", publishStatus: "게시", pinned: false, lastModified: "2026-01-20", descNormal: "설을 맞아 이웃과 함께하는 나눔 행사", descSenior: "설에 떡을 나눠 드려요" },
  { id: "EV-005", title: "겨울철 낙상 예방 교실", date: "2026-02-10", time: "14:00-15:30", location: "횡성읍 보건소", recruitStatus: "마감", publishStatus: "숨김", pinned: false, lastModified: "2026-02-05", descNormal: "겨울철 낙상 사고 예방을 위한 교육", descSenior: "겨울에 넘어지지 않는 법을 알려드려요" },
];

const recruitBadge = (s: string) => s === "모집중" ? "primary" as const : s === "마감" ? "neutral" as const : "accent" as const;
const publishBadge = (s: string) => s === "게시" ? "secondary" as const : s === "예약" ? "accent" as const : "neutral" as const;

export function AdminEventsPage() {
  const { isLarge } = useLargeMode();
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [search, setSearch] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<"normal" | "senior">("normal");

  const filtered = MOCK.filter((e) => !search || e.title.includes(search) || e.location.includes(search));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className={`${isLarge ? "text-xl" : "text-lg"} text-[#111827]`} style={{ fontWeight: 700 }}>건강모임/행사 관리</h1>
          <p className="text-xs text-gray-400 mt-0.5">건강모임·행사 등록·수정·모집 상태를 관리합니다</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65] flex items-center gap-1.5" style={{ fontWeight: 600 }}><Plus size={14} />행사 등록</button>
          <button onClick={() => setPreviewOpen(true)} className="px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-[#374151] cursor-pointer hover:bg-gray-50 flex items-center gap-1.5" style={{ fontWeight: 500 }}><Eye size={14} />미리보기</button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <button onClick={() => setViewMode("list")} className={`px-3 py-1.5 text-xs rounded-lg cursor-pointer flex items-center gap-1 ${viewMode === "list" ? "bg-[#1F6B78] text-white" : "bg-white text-gray-500 border border-gray-200"}`} style={{ fontWeight: viewMode === "list" ? 600 : 400 }}><List size={13} />리스트</button>
          <button onClick={() => setViewMode("calendar")} className={`px-3 py-1.5 text-xs rounded-lg cursor-pointer flex items-center gap-1 ${viewMode === "calendar" ? "bg-[#1F6B78] text-white" : "bg-white text-gray-500 border border-gray-200"}`} style={{ fontWeight: viewMode === "calendar" ? 600 : 400 }}><Calendar size={13} />캘린더</button>
        </div>
        <div className="relative max-w-xs w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="행사명, 장소 검색..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          {viewMode === "list" ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#F8F9FC]">
                  <tr>{["제목", "일정", "장소", "모집 상태", "게시 상태", "고정", "수정일", ""].map((h) => <th key={h} className="text-left px-4 py-3 text-xs text-[#9CA3AF]" style={{ fontWeight: 600 }}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filtered.map((e) => (
                    <tr key={e.id} onClick={() => setSelected(e)} className={`border-t border-gray-50 cursor-pointer ${selected?.id === e.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FC]/50"}`}>
                      <td className="px-4 py-3">
                        <p className="text-[#111827]" style={{ fontWeight: 600 }}>{e.title}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{e.date}<br />{e.time}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{e.location}</td>
                      <td className="px-4 py-3"><Badge variant={recruitBadge(e.recruitStatus)}>{e.recruitStatus}</Badge></td>
                      <td className="px-4 py-3"><Badge variant={publishBadge(e.publishStatus)}>{e.publishStatus}</Badge></td>
                      <td className="px-4 py-3 text-center">{e.pinned ? <span className="text-[#1F6B78]">📌</span> : <span className="text-gray-300">-</span>}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{e.lastModified}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1" onClick={(ev) => ev.stopPropagation()}>
                          <button onClick={() => setEditing(e)} className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"><Edit size={13} /></button>
                          <button className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"><Copy size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-400">
              <Calendar size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">캘린더 뷰는 행사 일정을 시각적으로 표시합니다</p>
              <div className="mt-4 grid grid-cols-7 gap-1 text-xs max-w-lg mx-auto">
                {["일","월","화","수","목","금","토"].map((d) => <div key={d} className="py-1 text-gray-400" style={{ fontWeight: 600 }}>{d}</div>)}
                {Array.from({ length: 31 }, (_, i) => (
                  <div key={i} className={`py-2 rounded ${[20,15].includes(i+1) ? "bg-[#1F6B78]/10 text-[#1F6B78]" : i+1 === 5 ? "bg-[#F2EBDD] text-[#7A6C55]" : "text-gray-600 hover:bg-gray-50"}`} style={{ fontWeight: [20,15,5].includes(i+1) ? 600 : 400 }}>
                    {i+1}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {(selected || editing) && (
          <AdminDetailPanel title={editing ? `${editing.title} 편집` : selected!.title} onClose={() => { setSelected(null); setEditing(null); }} width="w-full xl:w-[420px]">
            {editing ? (
              <div className="space-y-4">
                <DetailField label="제목"><input defaultValue={editing.title} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" /></DetailField>
                <DetailField label="커버 이미지">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-gray-400"><ImageIcon size={24} className="mx-auto mb-2 opacity-30" /><p className="text-xs">이미지 업로드 (Supabase 연동 후)</p></div>
                </DetailField>
                <DetailField label="요약 (일반)"><textarea defaultValue={editing.descNormal} rows={2} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" /></DetailField>
                <DetailField label="요약 (어르신)"><textarea defaultValue={editing.descSenior} rows={2} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" /></DetailField>
                <div className="grid grid-cols-2 gap-3">
                  <DetailField label="날짜"><input type="date" defaultValue={editing.date} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none" /></DetailField>
                  <DetailField label="시간"><input defaultValue={editing.time} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none" /></DetailField>
                </div>
                <DetailField label="장소"><input defaultValue={editing.location} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" /></DetailField>
                <DetailField label="게시 상태">
                  <select defaultValue={editing.publishStatus} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm cursor-pointer focus:outline-none"><option>초안</option><option>예약</option><option>게시</option><option>숨김</option></select>
                </DetailField>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setEditing(null)} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 cursor-pointer hover:bg-gray-50">취소</button>
                  <button onClick={() => { alert("저장 (Supabase 연동 후)"); setEditing(null); }} className="flex-1 py-2 rounded-lg bg-[#1F6B78] text-white text-sm cursor-pointer hover:bg-[#185A65]" style={{ fontWeight: 600 }}>저장</button>
                </div>
              </div>
            ) : selected && (
              <div className="space-y-4">
                <div className="flex gap-2"><Badge variant={recruitBadge(selected.recruitStatus)}>{selected.recruitStatus}</Badge><Badge variant={publishBadge(selected.publishStatus)}>{selected.publishStatus}</Badge></div>
                <DetailField label="일정"><p className="text-sm text-[#374151] flex items-center gap-1"><Clock size={13} />{selected.date} {selected.time}</p></DetailField>
                <DetailField label="장소"><p className="text-sm text-[#374151] flex items-center gap-1"><MapPin size={13} />{selected.location}</p></DetailField>
                <DetailField label="요약 (일반)"><p className="text-sm text-[#374151]">{selected.descNormal}</p></DetailField>
                <DetailField label="요약 (어르신)"><p className="text-sm text-[#374151]">{selected.descSenior}</p></DetailField>
                <DetailField label="수정일"><p className="text-xs text-gray-400">{selected.lastModified}</p></DetailField>
                <button onClick={() => setEditing(selected)} className="w-full py-2 rounded-lg border border-gray-200 text-xs text-[#374151] hover:bg-gray-50 cursor-pointer" style={{ fontWeight: 500 }}>편집</button>
              </div>
            )}
          </AdminDetailPanel>
        )}
      </div>

      <AdminModal open={previewOpen} onClose={() => setPreviewOpen(false)} title="고객 화면 미리보기" size="lg" footer={<button onClick={() => setPreviewOpen(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">닫기</button>}>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setPreviewMode("normal")} className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer ${previewMode === "normal" ? "bg-[#1F6B78] text-white" : "border border-gray-200 text-gray-500"}`}>{previewMode === "normal" ? "✓ " : ""}일반</button>
          <button onClick={() => setPreviewMode("senior")} className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer ${previewMode === "senior" ? "bg-[#1F6B78] text-white" : "border border-gray-200 text-gray-500"}`}>{previewMode === "senior" ? "✓ " : ""}어르신</button>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 bg-[#FAFAFA] space-y-3">
          {MOCK.filter((e) => e.publishStatus === "게시").map((e) => (
            <div key={e.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-[#111827] ${previewMode === "senior" ? "text-lg" : ""}`} style={{ fontWeight: 700 }}>{e.title}</p>
                  <p className={`text-gray-500 mt-1 ${previewMode === "senior" ? "text-base" : "text-sm"}`}>{previewMode === "senior" ? e.descSenior : e.descNormal}</p>
                </div>
                <Badge variant={recruitBadge(e.recruitStatus)}>{e.recruitStatus}</Badge>
              </div>
              <div className={`flex items-center gap-4 mt-2 text-gray-400 ${previewMode === "senior" ? "text-sm" : "text-xs"}`}>
                <span><Calendar size={12} className="inline mr-1" />{e.date}</span>
                <span><MapPin size={12} className="inline mr-1" />{e.location}</span>
              </div>
            </div>
          ))}
        </div>
      </AdminModal>
    </div>
  );
}
