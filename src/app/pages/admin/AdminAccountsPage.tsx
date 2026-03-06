import { useState } from "react";
import {
  Shield, Plus, Search, Edit, UserPlus, CheckCircle2, Clock, X
} from "lucide-react";
import { Badge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField } from "../../components/admin/AdminDetailPanel";
import { ConfirmModal } from "../../components/admin/AdminModal";
import { useLargeMode } from "../../components/layouts/AdminLayout";

const TABS = ["계정 목록", "역할/권한", "접근 기록"] as const;

interface Account {
  id: string; name: string; email: string; role: string; active: boolean;
  lastLogin: string;
}

const MOCK_ACCOUNTS: Account[] = [
  { id: "A-001", name: "김관리", email: "admin@gondolbom.kr", role: "슈퍼관리자", active: true, lastLogin: "2026-03-06 09:15" },
  { id: "A-002", name: "이운영", email: "ops@gondolbom.kr", role: "운영관리자", active: true, lastLogin: "2026-03-06 08:30" },
  { id: "A-003", name: "박서비스", email: "service@gondolbom.kr", role: "서비스담당", active: true, lastLogin: "2026-03-05 17:00" },
  { id: "A-004", name: "최콘텐츠", email: "content@gondolbom.kr", role: "콘텐츠담당", active: true, lastLogin: "2026-03-05 14:30" },
  { id: "A-005", name: "정CS", email: "cs@gondolbom.kr", role: "CS담당", active: true, lastLogin: "2026-03-04 16:00" },
  { id: "A-006", name: "한회계", email: "acc@gondolbom.kr", role: "회계담당", active: true, lastLogin: "2026-03-04 10:00" },
  { id: "A-007", name: "오감사", email: "audit@gondolbom.kr", role: "읽기전용", active: false, lastLogin: "2026-02-20 09:00" },
];

const ROLES = ["슈퍼관리자", "운영관리자", "서비스담당", "콘텐츠담당", "CS담당", "회계담당", "읽기전용"];
const PERMISSIONS = ["조합원 관리", "입금/환급", "서비스 관리", "콘텐츠 관리", "문의 관리", "데이터 내보내기", "민감정보 열람", "환급 처리", "블랙리스트"];
const PERM_MATRIX: Record<string, boolean[]> = {
  "슈퍼관리자": [true, true, true, true, true, true, true, true, true],
  "운영관리자": [true, true, true, true, true, true, false, true, true],
  "서비스담당": [false, false, true, false, false, false, false, false, false],
  "콘텐츠담당": [false, false, false, true, false, false, false, false, false],
  "CS담당": [false, false, false, false, true, false, false, false, false],
  "회계담당": [false, true, false, false, false, true, false, true, false],
  "읽기전용": [false, false, false, false, false, false, false, false, false],
};

const ACCESS_LOG = [
  { time: "2026-03-06 09:15", user: "김관리", action: "로그인", detail: "IP: 192.168.1.***" },
  { time: "2026-03-06 08:30", user: "이운영", action: "로그인", detail: "IP: 192.168.1.***" },
  { time: "2026-03-05 17:00", user: "박서비스", action: "로그아웃", detail: "" },
  { time: "2026-03-05 14:30", user: "최콘텐츠", action: "로그인", detail: "IP: 10.0.0.***" },
  { time: "2026-03-05 10:00", user: "김관리", action: "권한 변경", detail: "오감사: 읽기전용 → 비활성" },
];

const roleBadge = (r: string) => {
  if (r.includes("슈퍼") || r.includes("운영")) return "primary" as const;
  if (r.includes("읽기")) return "neutral" as const;
  return "secondary" as const;
};

export function AdminAccountsPage() {
  const { isLarge } = useLargeMode();
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0]);
  const [selected, setSelected] = useState<Account | null>(null);
  const [search, setSearch] = useState("");

  const filtered = MOCK_ACCOUNTS.filter((a) => !search || a.name.includes(search) || a.email.includes(search));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className={`${isLarge ? "text-xl" : "text-lg"} text-[#111827]`} style={{ fontWeight: 700 }}>계정 및 권한</h1>
          <p className="text-xs text-gray-400 mt-0.5">운영자 계정과 역할/권한을 관리합니다</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65] flex items-center gap-1.5" style={{ fontWeight: 600 }}><UserPlus size={14} />계정 초대</button>
          <button className="px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-[#374151] cursor-pointer hover:bg-gray-50 flex items-center gap-1.5" style={{ fontWeight: 500 }}><Plus size={14} />역할 추가</button>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-gray-200">
        {TABS.map((t) => <button key={t} onClick={() => setTab(t)} className={`px-3 py-2.5 text-xs whitespace-nowrap cursor-pointer border-b-2 ${tab === t ? "border-[#1F6B78] text-[#1F6B78]" : "border-transparent text-gray-400 hover:text-gray-600"}`} style={{ fontWeight: tab === t ? 600 : 400 }}>{t}</button>)}
      </div>

      {tab === "계정 목록" && (
        <div className="flex gap-4">
          <div className="flex-1 min-w-0 space-y-3">
            <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="이름, 이메일 검색..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#F8F9FC]"><tr>{["이름", "이메일", "역할", "상태", "마지막 로그인", ""].map((h) => <th key={h} className="text-left px-4 py-3 text-xs text-[#9CA3AF]" style={{ fontWeight: 600 }}>{h}</th>)}</tr></thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.id} onClick={() => setSelected(a)} className={`border-t border-gray-50 cursor-pointer ${selected?.id === a.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FC]/50"}`}>
                      <td className="px-4 py-3 text-[#111827]" style={{ fontWeight: 600 }}>{a.name}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{a.email}</td>
                      <td className="px-4 py-3"><Badge variant={roleBadge(a.role)}>{a.role}</Badge></td>
                      <td className="px-4 py-3"><Badge variant={a.active ? "secondary" : "neutral"}>{a.active ? "활성" : "비활성"}</Badge></td>
                      <td className="px-4 py-3 text-xs text-gray-400">{a.lastLogin}</td>
                      <td className="px-4 py-3"><button className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"><Edit size={13} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {selected && (
            <AdminDetailPanel title={selected.name} onClose={() => setSelected(null)} width="w-full xl:w-[380px]">
              <div className="bg-[#F8F9FC] rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1F6B78]/10 flex items-center justify-center text-[#1F6B78]" style={{ fontWeight: 700 }}>{selected.name[0]}</div>
                <div><p className="text-sm text-[#111827]" style={{ fontWeight: 600 }}>{selected.name}</p><p className="text-xs text-gray-400">{selected.email}</p></div>
              </div>
              <DetailField label="역할"><select defaultValue={selected.role} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm cursor-pointer focus:outline-none">{ROLES.map((r) => <option key={r}>{r}</option>)}</select></DetailField>
              <DetailField label="권한 요약">
                <div className="bg-[#F8F9FC] rounded-lg p-3 space-y-1">
                  {PERMISSIONS.map((p, i) => (
                    <div key={p} className="flex items-center gap-2 text-xs">
                      {PERM_MATRIX[selected.role]?.[i] ? <CheckCircle2 size={12} className="text-[#67B89A]" /> : <X size={12} className="text-gray-300" />}
                      <span className={PERM_MATRIX[selected.role]?.[i] ? "text-[#374151]" : "text-gray-400"}>{p}</span>
                    </div>
                  ))}
                </div>
              </DetailField>
              <DetailField label="마지막 로그인"><p className="text-xs text-gray-400">{selected.lastLogin}</p></DetailField>
              <button className="w-full py-2 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 cursor-pointer mt-2" style={{ fontWeight: 500 }}>{selected.active ? "비활성 처리" : "활성 처리"}</button>
            </AdminDetailPanel>
          )}
        </div>
      )}

      {tab === "역할/권한" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[#F8F9FC]">
                <tr>
                  <th className="text-left px-4 py-3 text-[#9CA3AF] sticky left-0 bg-[#F8F9FC] z-10" style={{ fontWeight: 600 }}>권한 항목</th>
                  {ROLES.map((r) => <th key={r} className="px-3 py-3 text-center text-[#9CA3AF]" style={{ fontWeight: 600 }}>{r}</th>)}
                </tr>
              </thead>
              <tbody>
                {PERMISSIONS.map((p, pi) => (
                  <tr key={p} className="border-t border-gray-50">
                    <td className="px-4 py-3 text-[#374151] sticky left-0 bg-white z-10" style={{ fontWeight: 500 }}>{p}</td>
                    {ROLES.map((r) => (
                      <td key={r} className="px-3 py-3 text-center">
                        <input type="checkbox" checked={PERM_MATRIX[r]?.[pi] || false} readOnly className="accent-[#1F6B78] cursor-pointer" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 bg-[#F2EBDD]/30">
            <p className="text-xs text-[#7A6C55]">⚠️ 권한 변경은 감사 로그에 기록됩니다</p>
          </div>
        </div>
      )}

      {tab === "접근 기록" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F8F9FC]"><tr>{["시간", "사용자", "액션", "상세"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs text-[#9CA3AF]" style={{ fontWeight: 600 }}>{h}</th>)}</tr></thead>
            <tbody>
              {ACCESS_LOG.map((l, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-[#F8F9FC]/50">
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{l.time}</td>
                  <td className="px-4 py-3 text-[#111827]" style={{ fontWeight: 500 }}>{l.user}</td>
                  <td className="px-4 py-3"><Badge variant={l.action === "권한 변경" ? "accent" : "neutral"}>{l.action}</Badge></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{l.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
