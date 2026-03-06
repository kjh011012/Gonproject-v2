import { useState } from "react";
import { UserPlus, Download, Phone, Mail, MapPin, Clock, FileText, MessageSquare, ChevronRight, Bookmark } from "lucide-react";
import { StatusBadge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField, DetailTabs } from "../../components/admin/AdminDetailPanel";
import { ConfirmModal } from "../../components/admin/AdminModal";

const MEMBERS = [
  { id: "M-2024-0123", name: "홍길동", age: "1958년생", phone: "010-****-5678", phoneFull: "010-1234-5678", address: "횡성읍", status: "가입완료", joinDate: "2024-06-15", shares: 50000, lastService: "2026-02-28", memo: "정기 방문진료 대상" },
  { id: "M-2024-0124", name: "김영희", age: "1962년생", phone: "010-****-2222", phoneFull: "010-1111-2222", address: "우천면", status: "가입완료", joinDate: "2024-07-20", shares: 100000, lastService: "2026-03-01", memo: "" },
  { id: "M-2025-0001", name: "박수진", age: "1970년생", phone: "010-****-4444", phoneFull: "010-3333-4444", address: "횡성읍", status: "가입완료", joinDate: "2025-01-05", shares: 50000, lastService: "2026-02-15", memo: "건강교실 참여" },
  { id: "M-2025-0045", name: "이철수", age: "1955년생", phone: "010-****-6666", phoneFull: "010-5555-6666", address: "갑천면", status: "가입신청", joinDate: "2025-06-10", shares: 0, lastService: "-", memo: "입금 확인 필요" },
  { id: "M-2025-0046", name: "최미영", age: "1968년생", phone: "010-****-8888", phoneFull: "010-7777-8888", address: "공근면", status: "가입완료", joinDate: "2025-08-22", shares: 150000, lastService: "2026-03-04", memo: "" },
  { id: "M-2026-0001", name: "정태호", age: "1950년생", phone: "010-****-0000", phoneFull: "010-9999-0000", address: "안흥면", status: "입금확인중", joinDate: "2026-01-03", shares: 0, lastService: "-", memo: "전화 상담 완료" },
  { id: "M-2024-0050", name: "한지은", age: "1975년생", phone: "010-****-6789", phoneFull: "010-2345-6789", address: "횡성읍", status: "탈퇴", joinDate: "2024-09-15", shares: 0, lastService: "2025-12-20", memo: "환급 완료" },
  { id: "M-2024-0088", name: "오상호", age: "1948년생", phone: "010-****-7890", phoneFull: "010-3456-7890", address: "청일면", status: "휴면", joinDate: "2024-03-10", shares: 50000, lastService: "2025-06-10", memo: "6개월 이상 미이용" },
  { id: "M-2025-0099", name: "윤미래", age: "1965년생", phone: "010-****-1234", phoneFull: "010-4567-1234", address: "횡성읍", status: "가입완료", joinDate: "2025-11-20", shares: 50000, lastService: "2026-02-20", memo: "" },
  { id: "M-2024-0033", name: "강민수", age: "1952년생", phone: "010-****-5555", phoneFull: "010-8888-5555", address: "우천면", status: "블랙리스트", joinDate: "2024-05-01", shares: 50000, lastService: "2025-08-15", memo: "반복 노쇼 3회" },
];

const STATUSES = ["전체", "가입완료", "가입신청", "입금확인중", "휴면", "탈퇴", "블랙리스트"];
const AREAS = ["전체", "횡성읍", "우천면", "갑천면", "공근면", "안흥면", "청일면"];

const HISTORY = [
  { date: "2026-01-03", action: "가입신청 접수", by: "시스템" },
  { date: "2026-01-04", action: "전화 상담 완료", by: "상담사 박OO" },
  { date: "2026-01-05", action: "입금 확인 요청", by: "운영팀" },
  { date: "2026-01-07", action: "입금 확인 완료 → 가입완료", by: "회계담당 김OO" },
];

export function AdminMembers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [areaFilter, setAreaFilter] = useState("전체");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState("개요");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmReason, setConfirmReason] = useState("");

  const filtered = MEMBERS.filter(
    (m) =>
      (statusFilter === "전체" || m.status === statusFilter) &&
      (areaFilter === "전체" || m.address === areaFilter) &&
      (search === "" || m.name.includes(search) || m.id.includes(search) || m.phone.includes(search))
  );

  const member = selectedId ? MEMBERS.find((m) => m.id === selectedId) : null;

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Main */}
      <div className={`flex-1 min-w-0 ${member ? "hidden xl:block" : ""}`}>
        {/* Toolbar */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="이름, 조합원번호, 연락처..."
                  className="w-full pl-4 pr-4 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                    statusFilter === s ? "bg-[#1F6B78] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                  style={{ fontWeight: statusFilter === s ? 600 : 400 }}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex gap-2 ml-auto">
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-600"
              >
                {AREAS.map((a) => <option key={a} value={a}>{a === "전체" ? "지역 전체" : a}</option>)}
              </select>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 flex items-center gap-1 cursor-pointer">
                <Download size={13} /> 내보내기
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-[#1F6B78] text-white text-xs flex items-center gap-1 cursor-pointer" style={{ fontWeight: 600 }}>
                <UserPlus size={13} /> 조합원 등록
              </button>
            </div>
          </div>
        </div>

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div className="bg-[#1F6B78] rounded-xl px-4 py-2.5 mb-4 flex items-center gap-3 text-white text-sm">
            <span style={{ fontWeight: 600 }}>{selected.size}건 선택</span>
            <div className="flex gap-2 ml-auto">
              <button className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs cursor-pointer">상태 변경</button>
              <button className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs cursor-pointer">메모 추가</button>
              <button className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs cursor-pointer">내보내기</button>
              <button onClick={() => setSelected(new Set())} className="px-3 py-1.5 rounded-lg bg-white/10 text-xs cursor-pointer">해제</button>
            </div>
          </div>
        )}

        {/* Table */}
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
                        else setSelected(new Set(filtered.map((m) => m.id)));
                      }}
                      checked={filtered.length > 0 && selected.size === filtered.length}
                      className="accent-[#1F6B78] cursor-pointer"
                    />
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>조합원</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 hidden md:table-cell" style={{ fontWeight: 600 }}>연락처</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 hidden lg:table-cell" style={{ fontWeight: 600 }}>지역</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>상태</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 hidden lg:table-cell" style={{ fontWeight: 600 }}>가입일</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 hidden xl:table-cell" style={{ fontWeight: 600 }}>출자금</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 hidden xl:table-cell" style={{ fontWeight: 600 }}>최근 서비스</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-16 text-gray-400">
                      <p className="text-sm">조건에 맞는 항목이 없습니다</p>
                      <p className="text-xs mt-1">필터를 해제하거나 검색어를 바꿔보세요</p>
                    </td>
                  </tr>
                ) : filtered.map((m) => (
                  <tr
                    key={m.id}
                    onClick={() => { setSelectedId(m.id); setDetailTab("개요"); }}
                    className={`border-t border-gray-50 cursor-pointer transition-colors ${
                      selectedId === m.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FA]/50"
                    }`}
                  >
                    <td className="w-10 p-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.has(m.id)}
                        onChange={() => toggleSelect(m.id)}
                        className="accent-[#1F6B78] cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1F6B78]/10 flex items-center justify-center text-xs text-[#1F6B78] shrink-0" style={{ fontWeight: 600 }}>
                          {m.name[0]}
                        </div>
                        <div>
                          <p className="text-[#111827]" style={{ fontWeight: 500 }}>{m.name}</p>
                          <p className="text-xs text-gray-400">{m.id} · {m.age}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{m.phone}</td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{m.address}</td>
                    <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                    <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{m.joinDate}</td>
                    <td className="px-4 py-3 text-gray-500 hidden xl:table-cell">{m.shares > 0 ? `${m.shares.toLocaleString()}원` : "-"}</td>
                    <td className="px-4 py-3 text-gray-400 hidden xl:table-cell">{m.lastService}</td>
                    <td className="px-4 py-3">
                      <ChevronRight size={14} className="text-gray-300" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            전체 {filtered.length}명
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {member && (
        <AdminDetailPanel
          title="조합원 상세"
          onClose={() => setSelectedId(null)}
        >
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-[#1F6B78]/10 flex items-center justify-center text-lg text-[#1F6B78]" style={{ fontWeight: 700 }}>
              {member.name[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base text-[#111827]" style={{ fontWeight: 700 }}>{member.name}</span>
                <StatusBadge status={member.status} />
              </div>
              <p className="text-xs text-gray-400">{member.id} · {member.age}</p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer" style={{ fontWeight: 600 }}>
              <Phone size={13} /> 전화
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-600 cursor-pointer hover:bg-gray-50">
              <MessageSquare size={13} /> 문의 생성
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-600 cursor-pointer hover:bg-gray-50">
              <FileText size={13} /> 대리 신청
            </button>
          </div>

          {/* Tabs */}
          <DetailTabs
            tabs={["개요", "히스토리", "출자금", "서비스 이력", "내부 메모"]}
            active={detailTab}
            onChange={setDetailTab}
          />

          {detailTab === "개요" && (
            <div className="space-y-4">
              <DetailField label="연락처">
                <p className="text-sm text-[#374151]">{member.phoneFull}</p>
                <p className="text-[10px] text-gray-400">권한이 있어야 전체 정보가 표시됩니다</p>
              </DetailField>
              <DetailField label="주소">
                <p className="text-sm text-[#374151]">강원특별자치도 횡성군 {member.address}</p>
              </DetailField>
              <DetailField label="출자금">
                <p className="text-sm text-[#374151]">{member.shares > 0 ? `${member.shares.toLocaleString()}원` : "미납"}</p>
              </DetailField>
              <DetailField label="상태 변경">
                <select className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm">
                  {STATUSES.filter((s) => s !== "전체").map((s) => (
                    <option key={s} selected={s === member.status}>{s}</option>
                  ))}
                </select>
              </DetailField>
              <div className="pt-2 space-y-2">
                <button className="w-full px-4 py-2.5 rounded-lg bg-[#1F6B78] text-white text-sm cursor-pointer" style={{ fontWeight: 600 }}>
                  저장
                </button>
                <button
                  onClick={() => setConfirmModal(true)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-500 cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-1.5"
                >
                  블랙리스트 처리
                </button>
              </div>
            </div>
          )}

          {detailTab === "히스토리" && (
            <div className="space-y-3">
              {HISTORY.map((h, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-[#1F6B78] mt-1.5" />
                    {i < HISTORY.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                  </div>
                  <div className="pb-3">
                    <p className="text-sm text-[#374151]" style={{ fontWeight: 500 }}>{h.action}</p>
                    <p className="text-xs text-gray-400">{h.date} · {h.by}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {detailTab === "출자금" && (
            <div className="space-y-3">
              {member.shares > 0 ? (
                <div className="p-3 rounded-lg bg-[#F8F9FA]">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">출자금 총액</span>
                    <span className="text-[#111827]" style={{ fontWeight: 600 }}>{member.shares.toLocaleString()}원</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">출자금 내역이 없습니다</p>
              )}
            </div>
          )}

          {detailTab === "서비스 이력" && (
            <div className="text-sm text-gray-400 text-center py-8">
              {member.lastService !== "-" ? (
                <p>최근 서비스: {member.lastService}</p>
              ) : (
                <p>서비스 이용 내역이 없습니다</p>
              )}
            </div>
          )}

          {detailTab === "내부 메모" && (
            <div className="space-y-3">
              {member.memo && (
                <div className="p-3 rounded-lg bg-[#F2EBDD]/50 text-sm text-[#7A6C55]">
                  {member.memo}
                </div>
              )}
              <textarea
                placeholder="내부 메모를 입력하세요... (고객에게 보이지 않음)"
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
              />
              <button className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer" style={{ fontWeight: 600 }}>
                메모 저장
              </button>
            </div>
          )}
        </AdminDetailPanel>
      )}

      {/* Blacklist Confirm Modal */}
      <ConfirmModal
        open={confirmModal}
        onClose={() => { setConfirmModal(false); setConfirmReason(""); }}
        onConfirm={() => { setConfirmModal(false); setConfirmReason(""); }}
        title="블랙리스트 처리"
        message="블랙리스트 처리 사유를 입력해 주세요. 처리 시 서비스 신청 제한, 커뮤니티 참여 제한이 적용됩니다."
        confirmLabel="블랙리스트 처리"
        requireReason
        reason={confirmReason}
        onReasonChange={setConfirmReason}
      />
    </div>
  );
}
