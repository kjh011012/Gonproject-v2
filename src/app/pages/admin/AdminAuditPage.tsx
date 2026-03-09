import { useMemo, useState } from "react";
import { Search, Download, Eye, Filter } from "lucide-react";
import { Badge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField } from "../../components/admin/AdminDetailPanel";
import { useLargeMode } from "../../components/layouts/AdminLayout";
import { useAuditLogsQuery } from "../../hooks/admin/useAdminQueries";

type AuditEntry = {
  id: number;
  actorAdminId: number | null;
  action: string;
  entityType: string;
  entityId: string | null;
  route: string;
  method: string;
  beforeJson?: Record<string, unknown> | null;
  afterJson?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
};

const actionBadge = (a: string) => {
  if (["notice_created", "faq_created", "catalog_created", "application_approved"].includes(a)) return "secondary" as const;
  if (["application_rejected", "member_status_changed", "setting_updated"].includes(a)) return "accent" as const;
  return "neutral" as const;
};

function formatDateTime(value: string | null | undefined) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function toJsonBlock(value: unknown) {
  if (!value) return "-";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function AdminAuditPage() {
  const { isLarge } = useLargeMode();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("전체");
  const [filterAction, setFilterAction] = useState("전체");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  const { data, loading, error } = useAuditLogsQuery({
    page: 1,
    pageSize: 200,
    entityType: filterType === "전체" ? undefined : filterType,
    action: filterAction === "전체" ? undefined : filterAction,
  });

  const entries = (data ?? []) as AuditEntry[];

  const objectTypes = useMemo(
    () => ["전체", ...Array.from(new Set(entries.map((e) => e.entityType).filter(Boolean)))],
    [entries],
  );
  const actions = useMemo(
    () => ["전체", ...Array.from(new Set(entries.map((e) => e.action).filter(Boolean)))],
    [entries],
  );

  const filtered = useMemo(
    () => entries.filter((e) => {
      if (!search) return true;
      const haystack = [
        e.action,
        e.entityType,
        e.entityId || "",
        e.route,
        e.method,
        String(e.actorAdminId ?? ""),
      ].join(" ").toLowerCase();
      return haystack.includes(search.toLowerCase());
    }),
    [entries, search],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className={`${isLarge ? "text-xl" : "text-lg"} text-[#111827]`} style={{ fontWeight: 700 }}>감사 로그</h1>
          <p className="text-xs text-gray-400 mt-0.5">누가·언제·무엇을 변경했는지 추적합니다</p>
        </div>
        <button className="px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-[#374151] cursor-pointer hover:bg-gray-50 flex items-center gap-1.5" style={{ fontWeight: 500 }}>
          <Download size={14} /> 내보내기
        </button>
      </div>

      <div className="bg-white rounded-xl p-3 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-3">
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="사용자, 대상, 액션 검색..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-lg border text-xs cursor-pointer flex items-center gap-1.5 ${showFilters ? "border-[#1F6B78] text-[#1F6B78] bg-[#1F6B78]/5" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
            style={{ fontWeight: 500 }}
          >
            <Filter size={13} /> 필터
          </button>
          <span className="text-xs text-gray-400">{filtered.length}건</span>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1" style={{ fontWeight: 600 }}>객체 유형</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm cursor-pointer focus:outline-none">
              {objectTypes.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1" style={{ fontWeight: 600 }}>액션</label>
            <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm cursor-pointer focus:outline-none">
              {actions.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
      )}

      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden hidden md:block">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F9FC]">
                <tr>
                  {["시간", "사용자", "객체", "액션", "요약", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-[#9CA3AF]" style={{ fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-sm text-gray-400">감사 로그를 불러오는 중...</td>
                  </tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-sm text-gray-400">표시할 로그가 없습니다.</td>
                  </tr>
                )}
                {!loading && filtered.map((e) => (
                  <tr key={e.id} onClick={() => setSelectedEntry(e)} className={`border-t border-gray-50 cursor-pointer ${selectedEntry?.id === e.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FC]/50"}`}>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDateTime(e.createdAt)}</td>
                    <td className="px-4 py-3 text-[#111827]" style={{ fontWeight: 500 }}>관리자#{e.actorAdminId ?? "-"}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="text-gray-400">{e.entityType}</span>
                      <span className="text-[#374151] ml-1">{e.entityId || "-"}</span>
                    </td>
                    <td className="px-4 py-3"><Badge variant={actionBadge(e.action)}>{e.action}</Badge></td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-[280px] truncate">{`${e.method} ${e.route}`}</td>
                    <td className="px-4 py-3"><button className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer"><Eye size={13} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-2">
            {filtered.map((e) => (
              <div key={e.id} onClick={() => setSelectedEntry(e)} className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer ${selectedEntry?.id === e.id ? "ring-2 ring-[#1F6B78]/30" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">{formatDateTime(e.createdAt)}</span>
                  <Badge variant={actionBadge(e.action)}>{e.action}</Badge>
                </div>
                <p className="text-sm text-[#111827]" style={{ fontWeight: 500 }}>{e.entityType} · {e.entityId || "-"}</p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{e.method} {e.route}</p>
                <p className="text-xs text-gray-400 mt-1">처리: 관리자#{e.actorAdminId ?? "-"}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedEntry && (
          <AdminDetailPanel title="변경 상세" onClose={() => setSelectedEntry(null)} width="w-full xl:w-[460px]">
            <DetailField label="시간"><p className="text-sm text-[#374151]">{formatDateTime(selectedEntry.createdAt)}</p></DetailField>
            <DetailField label="사용자"><p className="text-sm text-[#111827]" style={{ fontWeight: 500 }}>관리자#{selectedEntry.actorAdminId ?? "-"}</p></DetailField>
            <DetailField label="대상"><p className="text-sm text-[#374151]">[{selectedEntry.entityType}] {selectedEntry.entityId || "-"}</p></DetailField>
            <DetailField label="액션"><Badge variant={actionBadge(selectedEntry.action)}>{selectedEntry.action}</Badge></DetailField>
            <DetailField label="요청 정보">
              <div className="bg-[#F8F9FC] rounded-lg p-3 text-xs text-gray-600 space-y-1">
                <p>{selectedEntry.method} {selectedEntry.route}</p>
                <p>IP: {selectedEntry.ipAddress || "-"}</p>
                <p className="truncate">UA: {selectedEntry.userAgent || "-"}</p>
              </div>
            </DetailField>
            <DetailField label="변경 전(before)">
              <pre className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-xs text-gray-600 overflow-auto max-h-40">{toJsonBlock(selectedEntry.beforeJson)}</pre>
            </DetailField>
            <DetailField label="변경 후(after)">
              <pre className="bg-[#67B89A]/5 rounded-lg p-3 border border-[#67B89A]/20 text-xs text-[#2D7A5E] overflow-auto max-h-40">{toJsonBlock(selectedEntry.afterJson)}</pre>
            </DetailField>
          </AdminDetailPanel>
        )}
      </div>
    </div>
  );
}
