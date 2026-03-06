import { useState } from "react";
import { Plus, Search, Edit2, Eye, Pin, ImageIcon, Monitor, Smartphone } from "lucide-react";
import { StatusBadge, Badge } from "../../components/admin/AdminBadge";
import { AdminModal } from "../../components/admin/AdminModal";

const NOTICES = [
  { id: 1, title: "3월 폭설 대비 방문진료 일정 변경 안내", category: "긴급", date: "2026-03-03", status: "게시", views: 542, pinned: true, image: true, seniorSummary: "날씨 때문에 방문 일정이 바뀝니다" },
  { id: 2, title: "2026년 상반기 건강교실 수강생 모집", category: "전체", date: "2026-03-01", status: "게시", views: 389, pinned: true, image: true, seniorSummary: "건강 교실 참가자 모집합니다" },
  { id: 3, title: "제4차 정기총회 개최 안내 (3/15)", category: "조합원", date: "2026-02-27", status: "게시", views: 213, pinned: false, image: false, seniorSummary: "총회를 합니다. 꼭 와 주세요" },
  { id: 4, title: "사무실 이전 안내", category: "전체", date: "2026-02-24", status: "게시", views: 178, pinned: false, image: true, seniorSummary: "사무실이 옮겼습니다" },
  { id: 5, title: "2025년 결산 보고서 공개", category: "조합원", date: "2026-02-20", status: "게시", views: 156, pinned: false, image: false, seniorSummary: "작년 돈 사용 내역입니다" },
  { id: 6, title: "봄맞이 걷기대회 안내 (초안)", category: "전체", date: "2026-03-05", status: "초안", views: 0, pinned: false, image: false, seniorSummary: "" },
  { id: 7, title: "4월 서비스 일정 사전 안내", category: "전체", date: "2026-03-10", status: "예약", views: 0, pinned: false, image: true, seniorSummary: "4월 서비스 날짜 안내입니다" },
];

const CATEGORY_STYLE: Record<string, string> = {
  전체: "primary",
  조합원: "secondary",
  긴급: "accent",
};

export function AdminNotices() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [editorOpen, setEditorOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<"normal" | "senior">("normal");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  const filtered = NOTICES.filter(
    (n) =>
      (statusFilter === "전체" || n.status === statusFilter) &&
      (search === "" || n.title.includes(search))
  );

  return (
    <div className="space-y-4 max-w-[1200px]">
      {/* Toolbar */}
      <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="공지 검색..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
            />
          </div>
          <div className="flex gap-1.5">
            {["전체", "게시", "초안", "예약", "숨김"].map((s) => (
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
        </div>
        <button
          onClick={() => setEditorOpen(true)}
          className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-sm flex items-center gap-1.5 cursor-pointer"
          style={{ fontWeight: 600 }}
        >
          <Plus size={16} /> 공지 작성
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F8F9FA]">
            <tr>
              <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>카테고리</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>제목</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 hidden md:table-cell" style={{ fontWeight: 600 }}>상태</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 hidden md:table-cell" style={{ fontWeight: 600 }}>등록일</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 hidden lg:table-cell" style={{ fontWeight: 600 }}>조회</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((n) => (
              <tr key={n.id} className="border-t border-gray-50 hover:bg-[#F8F9FA]/50">
                <td className="px-4 py-3">
                  <Badge variant={(CATEGORY_STYLE[n.category] || "neutral") as any}>{n.category}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {n.pinned && <Pin size={12} className="text-[#1F6B78] shrink-0" />}
                    {n.image && <ImageIcon size={12} className="text-[#67B89A] shrink-0" />}
                    <span className="text-[#111827] truncate max-w-[300px]" style={{ fontWeight: 500 }}>{n.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell"><StatusBadge status={n.status} /></td>
                <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{n.date}</td>
                <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{n.views}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditorOpen(true)}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"
                      title="편집"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 cursor-pointer" title="미리보기">
                      <Eye size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">{filtered.length}건</div>
      </div>

      {/* Editor Modal */}
      <AdminModal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title="공지 작성"
        size="lg"
        footer={
          <>
            <button onClick={() => setEditorOpen(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 cursor-pointer">취소</button>
            <button className="px-4 py-2 rounded-lg border border-[#1F6B78] text-[#1F6B78] text-sm cursor-pointer" style={{ fontWeight: 500 }}>초안 저장</button>
            <button className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-sm cursor-pointer" style={{ fontWeight: 600 }}>게시</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>제목 *</label>
            <input
              placeholder="공지 제목을 입력하세요"
              className="w-full px-3 py-2.5 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>카테고리</label>
              <select className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm">
                <option>전체</option>
                <option>조합원</option>
                <option>긴급</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>상태</label>
              <select className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm">
                <option>초안</option>
                <option>게시</option>
                <option>예약</option>
                <option>숨김</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>커버 이미지 * (이미지 우선 디자인)</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-[#1F6B78]/30 cursor-pointer transition-colors">
              <ImageIcon size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">이미지를 드래그하거나 클릭하여 업로드</p>
              <p className="text-xs text-gray-300 mt-1">권장: 1200x630px / JPG, PNG</p>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>요약 (일반)</label>
            <input
              placeholder="일반 모드에 표시될 요약..."
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>요약 (어르신 — 더 짧고 쉬운 말)</label>
            <input
              placeholder="어르신 모드에 표시될 쉬운 요약..."
              className="w-full px-3 py-2 rounded-lg bg-[#F2EBDD]/30 border border-[#E5D9C3] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>본문</label>
            <textarea
              placeholder="공지 본문을 작성하세요..."
              rows={6}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-[#1F6B78]" />
              <span className="text-sm text-[#374151]">필독 / 상단 고정</span>
            </label>
          </div>

          {/* Preview */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#F8F9FA] border-b border-gray-200">
              <span className="text-xs text-gray-500" style={{ fontWeight: 600 }}>고객 화면 미리보기</span>
              <div className="flex gap-2">
                <div className="flex gap-1 border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setPreviewMode("normal")}
                    className={`px-2.5 py-1 text-[11px] cursor-pointer ${previewMode === "normal" ? "bg-[#1F6B78] text-white" : "text-gray-500"}`}
                  >
                    일반
                  </button>
                  <button
                    onClick={() => setPreviewMode("senior")}
                    className={`px-2.5 py-1 text-[11px] cursor-pointer ${previewMode === "senior" ? "bg-[#67B89A] text-white" : "text-gray-500"}`}
                  >
                    어르신
                  </button>
                </div>
                <div className="flex gap-1 border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setPreviewDevice("desktop")}
                    className={`p-1 cursor-pointer ${previewDevice === "desktop" ? "bg-gray-200" : ""}`}
                  >
                    <Monitor size={14} className="text-gray-500" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice("mobile")}
                    className={`p-1 cursor-pointer ${previewDevice === "mobile" ? "bg-gray-200" : ""}`}
                  >
                    <Smartphone size={14} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
            <div className={`p-4 bg-white ${previewDevice === "mobile" ? "max-w-[390px] mx-auto" : ""}`}>
              <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center text-gray-300 mb-3">
                <ImageIcon size={32} />
              </div>
              <p className={`text-[#111827] mb-1 ${previewMode === "senior" ? "text-lg" : "text-base"}`} style={{ fontWeight: 700 }}>
                (제목 미리보기)
              </p>
              <p className={`text-gray-500 ${previewMode === "senior" ? "text-base" : "text-sm"}`}>
                {previewMode === "senior" ? "(어르신 요약 미리보기)" : "(일반 요약 미리보기)"}
              </p>
            </div>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
