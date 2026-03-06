import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Search, SlidersHorizontal, Download, MoreHorizontal } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  hiddenOnMobile?: boolean;
  width?: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: string;
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
  selectedKey?: string | null;
  bulkActions?: { label: string; icon?: React.ReactNode; onClick: (selected: T[]) => void }[];
  emptyMessage?: string;
  pageSize?: number;
  rowHeight?: "compact" | "normal";
}

export function AdminDataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  searchPlaceholder = "검색...",
  onRowClick,
  selectedKey,
  bulkActions,
  emptyMessage = "조건에 맞는 항목이 없습니다",
  pageSize = 15,
  rowHeight = "normal",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Search filter
  const searched = data.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return Object.values(item).some((v) => String(v).toLowerCase().includes(q));
  });

  // Sort
  const sorted = sortKey
    ? [...searched].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        const cmp = String(av).localeCompare(String(bv), "ko");
        return sortDir === "asc" ? cmp : -cmp;
      })
    : searched;

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleSelectAll = () => {
    if (selected.size === paged.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paged.map((r) => r[keyField])));
    }
  };

  const toggleSelect = (key: string) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelected(next);
  };

  const rh = rowHeight === "compact" ? "h-10" : "h-12";

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="bg-white rounded-xl p-3 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-3">
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B78]/20"
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-gray-400">{sorted.length}건</span>
        </div>
      </div>

      {/* Bulk action bar */}
      {bulkActions && selected.size > 0 && (
        <div className="bg-[#1F6B78] rounded-xl px-4 py-2.5 flex items-center gap-4 text-white text-sm">
          <span style={{ fontWeight: 600 }}>{selected.size}건 선택됨</span>
          <div className="flex gap-2 ml-auto">
            {bulkActions.map((a, i) => (
              <button
                key={i}
                onClick={() => a.onClick(data.filter((d) => selected.has(d[keyField])))}
                className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs cursor-pointer flex items-center gap-1"
                style={{ fontWeight: 500 }}
              >
                {a.icon}
                {a.label}
              </button>
            ))}
            <button
              onClick={() => setSelected(new Set())}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs cursor-pointer"
            >
              선택 해제
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8F9FC]">
              <tr>
                {bulkActions && (
                  <th className="w-10 p-3">
                    <input
                      type="checkbox"
                      checked={paged.length > 0 && selected.size === paged.length}
                      onChange={toggleSelectAll}
                      className="accent-[#1F6B78] cursor-pointer"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`text-left px-4 py-3 text-xs text-[#9CA3AF] select-none ${
                      col.hiddenOnMobile ? "hidden md:table-cell" : ""
                    } ${col.sortable ? "cursor-pointer hover:text-gray-600" : ""}`}
                    style={{ fontWeight: 600, width: col.width }}
                    onClick={() => col.sortable && toggleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && (
                        sortKey === col.key ? (
                          sortDir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />
                        ) : (
                          <ChevronsUpDown size={13} className="opacity-30" />
                        )
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (bulkActions ? 1 : 0)} className="text-center py-16 text-gray-400">
                    <p className="text-sm">{emptyMessage}</p>
                    <p className="text-xs mt-1">필터를 해제하거나 검색어를 바꿔보세요</p>
                  </td>
                </tr>
              ) : (
                paged.map((item) => {
                  const key = item[keyField];
                  const isSelected = selectedKey === key;
                  return (
                    <tr
                      key={key}
                      onClick={() => onRowClick?.(item)}
                      className={`border-t border-gray-50 ${rh} transition-colors ${
                        onRowClick ? "cursor-pointer" : ""
                      } ${isSelected ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FC]/50"}`}
                    >
                      {bulkActions && (
                        <td className="w-10 p-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selected.has(key)}
                            onChange={() => toggleSelect(key)}
                            className="accent-[#1F6B78] cursor-pointer"
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={`px-4 py-3 ${col.hiddenOnMobile ? "hidden md:table-cell" : ""}`}
                        >
                          {col.render ? col.render(item) : <span className="text-[#374151]">{item[col.key]}</span>}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
            <span>{page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} / {sorted.length}건</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 cursor-pointer disabled:cursor-default"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(0, Math.min(page - 2, totalPages - 5));
                const p = start + i;
                if (p >= totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded text-xs cursor-pointer ${
                      p === page ? "bg-[#1F6B78] text-white" : "hover:bg-gray-100"
                    }`}
                    style={{ fontWeight: p === page ? 600 : 400 }}
                  >
                    {p + 1}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 cursor-pointer disabled:cursor-default"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
