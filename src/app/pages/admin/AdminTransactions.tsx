import { useState } from "react";
import { Download, Link2, Search, AlertTriangle, CheckCircle2 } from "lucide-react";
import { StatusBadge, Badge } from "../../components/admin/AdminBadge";
import { AdminModal } from "../../components/admin/AdminModal";

const SUMMARY = [
  { label: "미매칭", count: 2, variant: "accent" as const },
  { label: "확인필요", count: 3, variant: "accent" as const },
  { label: "확인완료", count: 28, variant: "secondary" as const },
  { label: "환급대기", count: 1, variant: "neutral" as const },
];

const TRANSACTIONS = [
  { id: "TXN-2026-034", date: "2026-03-06 09:15", depositor: "정태호", amount: 50000, member: null, matchType: "-", status: "미매칭", processor: null, memo: "" },
  { id: "TXN-2026-033", date: "2026-03-05 14:22", depositor: "이철", amount: 50000, member: null, matchType: "-", status: "미매칭", processor: null, memo: "이름 불일치" },
  { id: "TXN-2026-032", date: "2026-03-04 10:00", depositor: "송미경", amount: 100000, member: "송미경(APP-004)", matchType: "자동매칭", status: "자동매칭", processor: null, memo: "" },
  { id: "TXN-2026-031", date: "2026-03-03 11:30", depositor: "임도현", amount: 50000, member: "임도현(APP-003)", matchType: "자동매칭", status: "확인완료", processor: "회계담당 김OO", memo: "" },
  { id: "TXN-2026-030", date: "2026-03-02 09:45", depositor: "최미영", amount: 100000, member: "최미영(M-0046)", matchType: "수동매칭", status: "확인완료", processor: "회계담당 김OO", memo: "추가 출자" },
  { id: "TXN-2026-029", date: "2026-03-01 16:00", depositor: "한지은", amount: 50000, member: "한지은(M-0050)", matchType: "-", status: "환급대기", processor: null, memo: "탈퇴 환급" },
  { id: "TXN-2026-028", date: "2026-02-28 10:20", depositor: "박수진", amount: 50000, member: "박수진(M-0001)", matchType: "자동매칭", status: "확인완료", processor: "회계담당 김OO", memo: "" },
];

export function AdminTransactions() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [unmatchedOnly, setUnmatchedOnly] = useState(false);
  const [matchModal, setMatchModal] = useState(false);
  const [matchTarget, setMatchTarget] = useState<string | null>(null);

  const filtered = TRANSACTIONS.filter(
    (t) =>
      (statusFilter === "전체" || t.status === statusFilter) &&
      (!unmatchedOnly || t.status === "미매칭") &&
      (search === "" || t.depositor.includes(search) || t.id.includes(search))
  );

  return (
    <div className="space-y-4 max-w-[1200px]">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SUMMARY.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <Badge variant={s.variant}>{s.label}</Badge>
              <span className="text-2xl text-[#111827]" style={{ fontWeight: 700 }}>{s.count}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-3">
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="입금자명, 거래번호..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
          />
        </div>
        <div className="flex gap-1.5">
          {["전체", "미매칭", "자동매칭", "확인완료", "환급대기", "환급완료"].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setUnmatchedOnly(false); }}
              className={`px-2.5 py-1.5 rounded-lg text-xs cursor-pointer ${
                statusFilter === s ? "bg-[#1F6B78] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
              style={{ fontWeight: statusFilter === s ? 600 : 400 }}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-500">
            <input
              type="checkbox"
              checked={unmatchedOnly}
              onChange={(e) => { setUnmatchedOnly(e.target.checked); if (e.target.checked) setStatusFilter("전체"); }}
              className="accent-[#1F6B78]"
            />
            미매칭만
          </label>
          <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 flex items-center gap-1 cursor-pointer">
            <Download size={13} /> 내보내기(월별)
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8F9FA]">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>거래</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 hidden md:table-cell" style={{ fontWeight: 600 }}>일시</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>입금자</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>금액</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 hidden lg:table-cell" style={{ fontWeight: 600 }}>매칭 조합원</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>상태</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 hidden lg:table-cell" style={{ fontWeight: 600 }}>처리자</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400" style={{ fontWeight: 600 }}>액션</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-t border-gray-50 hover:bg-[#F8F9FA]/50">
                  <td className="px-4 py-3 text-xs text-gray-400">{t.id}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{t.date}</td>
                  <td className="px-4 py-3">
                    <span className="text-[#111827]" style={{ fontWeight: 500 }}>{t.depositor}</span>
                    {t.memo && <p className="text-xs text-gray-400">{t.memo}</p>}
                  </td>
                  <td className="px-4 py-3 text-[#111827]" style={{ fontWeight: 600 }}>{t.amount.toLocaleString()}원</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {t.member ? (
                      <span className="text-[#1F6B78]" style={{ fontWeight: 500 }}>{t.member}</span>
                    ) : (
                      <span className="text-gray-300 italic">미매칭</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{t.processor || "-"}</td>
                  <td className="px-4 py-3">
                    {t.status === "미매칭" && (
                      <button
                        onClick={() => { setMatchTarget(t.id); setMatchModal(true); }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#1F6B78]/10 text-[#1F6B78] text-xs cursor-pointer flex items-center gap-1 hover:bg-[#1F6B78]/20"
                        style={{ fontWeight: 600 }}
                      >
                        <Link2 size={12} /> 수동 매칭
                      </button>
                    )}
                    {(t.status === "자동매칭" || t.status === "수동매칭") && (
                      <button className="px-2.5 py-1.5 rounded-lg bg-[#67B89A]/10 text-[#2D7A5E] text-xs cursor-pointer flex items-center gap-1" style={{ fontWeight: 600 }}>
                        <CheckCircle2 size={12} /> 확인
                      </button>
                    )}
                    {t.status === "환급대기" && (
                      <button className="px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs cursor-pointer" style={{ fontWeight: 600 }}>
                        환급 완료 처리
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">{filtered.length}건</div>
      </div>

      {/* Manual Match Modal */}
      <AdminModal
        open={matchModal}
        onClose={() => setMatchModal(false)}
        title="수동 매칭"
        size="sm"
        footer={
          <>
            <button onClick={() => setMatchModal(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 cursor-pointer">취소</button>
            <button onClick={() => setMatchModal(false)} className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-sm cursor-pointer" style={{ fontWeight: 600 }}>매칭 확정</button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-[#374151]">입금 건을 조합원과 연결합니다.</p>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>조합원 검색</label>
            <input
              placeholder="이름 또는 조합원번호..."
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-2" style={{ fontWeight: 600 }}>유사 후보 (이름/금액/날짜 기준)</label>
            <div className="space-y-1.5">
              {[
                { name: "정태호", id: "M-2026-0001", amount: "5만원", match: "이름 유사" },
                { name: "이철수", id: "M-2025-0045", amount: "5만원", match: "금액 일치" },
              ].map((c) => (
                <label key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#F8F9FA] hover:bg-[#1F6B78]/5 cursor-pointer">
                  <input type="radio" name="match" className="accent-[#1F6B78]" />
                  <div className="flex-1">
                    <span className="text-sm text-[#111827]" style={{ fontWeight: 500 }}>{c.name}</span>
                    <span className="text-xs text-gray-400 ml-2">{c.id}</span>
                  </div>
                  <Badge variant="primaryLight">{c.match}</Badge>
                </label>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#F2EBDD]/50 flex items-start gap-2 text-xs text-[#7A6C55]">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            중복/오매칭 방지를 위해 이름, 금액, 날짜를 다시 한번 확인해 주세요.
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
