import { useEffect, useMemo, useState } from "react";
import { Save, RotateCcw, ChevronDown, Loader2 } from "lucide-react";
import { ConfirmModal } from "../../components/admin/AdminModal";
import { useLargeMode } from "../../components/layouts/AdminLayout";
import { adminApi } from "../../lib/api/admin";

type SettingItem = {
  id: number;
  settingGroup: string;
  settingKey: string;
  valueJson: Record<string, unknown>;
  description: string | null;
};

function toPrettyJson(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "{}";
  }
}

export function AdminOpsSettingsPage() {
  const { isLarge } = useLargeMode();

  const [items, setItems] = useState<SettingItem[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [draftValueMap, setDraftValueMap] = useState<Record<string, string>>({});
  const [draftDescMap, setDraftDescMap] = useState<Record<string, string>>({});
  const [errorsByKey, setErrorsByKey] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savingAll, setSavingAll] = useState(false);
  const [saveModal, setSaveModal] = useState(false);

  async function loadSettings() {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.settings();
      const rows = (res.data ?? []) as SettingItem[];
      setItems(rows);
      const nextValueMap: Record<string, string> = {};
      const nextDescMap: Record<string, string> = {};
      const groups = new Set<string>();

      rows.forEach((row) => {
        nextValueMap[row.settingKey] = toPrettyJson(row.valueJson ?? {});
        nextDescMap[row.settingKey] = row.description ?? "";
        groups.add(row.settingGroup || "general");
      });

      setDraftValueMap(nextValueMap);
      setDraftDescMap(nextDescMap);
      setErrorsByKey({});
      setExpanded(new Set(groups));
    } catch (e) {
      setError(e instanceof Error ? e.message : "설정 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSettings();
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, SettingItem[]>();
    items.forEach((item) => {
      const key = item.settingGroup || "general";
      const list = map.get(key) ?? [];
      list.push(item);
      map.set(key, list);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [items]);

  const changedKeys = useMemo(() => {
    return items
      .filter((item) => {
        const key = item.settingKey;
        const originalValue = toPrettyJson(item.valueJson ?? {});
        const currentValue = draftValueMap[key] ?? "";
        const originalDesc = item.description ?? "";
        const currentDesc = draftDescMap[key] ?? "";
        return originalValue !== currentValue || originalDesc !== currentDesc;
      })
      .map((item) => item.settingKey);
  }, [items, draftValueMap, draftDescMap]);

  const changed = changedKeys.length > 0;

  const toggle = (group: string) => {
    const next = new Set(expanded);
    if (next.has(group)) next.delete(group); else next.add(group);
    setExpanded(next);
  };

  async function saveOne(settingKey: string, silent = false) {
    const raw = draftValueMap[settingKey] ?? "{}";
    const desc = (draftDescMap[settingKey] ?? "").trim();

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>;
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("JSON object만 허용됩니다.");
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "JSON 형식이 올바르지 않습니다.";
      setErrorsByKey((prev) => ({ ...prev, [settingKey]: message }));
      if (!silent) setError(`${settingKey}: ${message}`);
      return false;
    }

    setErrorsByKey((prev) => {
      const next = { ...prev };
      delete next[settingKey];
      return next;
    });

    setSavingKey(settingKey);
    try {
      await adminApi.updateSetting(settingKey, parsed, desc || undefined);
      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : "저장 실패";
      if (!silent) setError(`${settingKey}: ${message}`);
      return false;
    } finally {
      setSavingKey(null);
    }
  }

  async function saveAllChanged() {
    setSavingAll(true);
    setError(null);
    try {
      for (const key of changedKeys) {
        const ok = await saveOne(key, true);
        if (!ok) {
          setError(`${key}: JSON 오류 또는 저장 실패`);
          setSavingAll(false);
          return;
        }
      }
      await loadSettings();
      setSaveModal(false);
    } finally {
      setSavingAll(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className={`${isLarge ? "text-xl" : "text-lg"} text-[#111827]`} style={{ fontWeight: 700 }}>운영 설정</h1>
          <p className="text-xs text-gray-400 mt-0.5">DB 기반 운영 설정값을 직접 관리합니다</p>
        </div>
        <div className="flex items-center gap-2">
          {changed && (
            <button
              onClick={() => {
                const resetValues: Record<string, string> = {};
                const resetDescs: Record<string, string> = {};
                items.forEach((item) => {
                  resetValues[item.settingKey] = toPrettyJson(item.valueJson ?? {});
                  resetDescs[item.settingKey] = item.description ?? "";
                });
                setDraftValueMap(resetValues);
                setDraftDescMap(resetDescs);
                setErrorsByKey({});
              }}
              className="px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-gray-500 cursor-pointer hover:bg-gray-50 flex items-center gap-1.5"
              style={{ fontWeight: 500 }}
            >
              <RotateCcw size={14} /> 변경 취소
            </button>
          )}
          <button
            onClick={() => setSaveModal(true)}
            disabled={!changed || savingAll}
            className="px-3.5 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65] disabled:opacity-40 disabled:cursor-default flex items-center gap-1.5"
            style={{ fontWeight: 600 }}
          >
            {savingAll ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 전체 저장
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
      )}

      {loading && (
        <div className="bg-white rounded-xl p-5 shadow-sm text-sm text-gray-500">설정 목록을 불러오는 중...</div>
      )}

      {!loading && grouped.length === 0 && (
        <div className="bg-white rounded-xl p-5 shadow-sm text-sm text-gray-400">등록된 설정이 없습니다.</div>
      )}

      <div className="space-y-3 max-w-4xl">
        {grouped.map(([group, rows]) => {
          const isOpen = expanded.has(group);
          return (
            <div key={group} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => toggle(group)}
                className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer hover:bg-[#F8F9FC]/50"
              >
                <span className="text-sm text-[#111827]" style={{ fontWeight: 600 }}>{group}</span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
                  {rows.map((row) => {
                    const isSaving = savingKey === row.settingKey;
                    const fieldError = errorsByKey[row.settingKey];
                    return (
                      <div key={row.settingKey} className="rounded-lg border border-gray-200 p-4 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-sm text-[#111827]" style={{ fontWeight: 600 }}>{row.settingKey}</p>
                            <p className="text-xs text-gray-400">{row.description || "설명 없음"}</p>
                          </div>
                          <button
                            onClick={() => void saveOne(row.settingKey)}
                            disabled={isSaving}
                            className="px-3 py-1.5 rounded-lg border border-[#1F6B78] text-[#1F6B78] text-xs cursor-pointer disabled:opacity-50 flex items-center gap-1"
                            style={{ fontWeight: 600 }}
                          >
                            {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} 저장
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs text-gray-500 mb-1">설명</label>
                          <input
                            value={draftDescMap[row.settingKey] ?? ""}
                            onChange={(e) => setDraftDescMap((prev) => ({ ...prev, [row.settingKey]: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-500 mb-1">JSON 값</label>
                          <textarea
                            value={draftValueMap[row.settingKey] ?? "{}"}
                            onChange={(e) => setDraftValueMap((prev) => ({ ...prev, [row.settingKey]: e.target.value }))}
                            rows={6}
                            className="w-full px-3 py-2 rounded-lg bg-[#F8F9FC] border border-gray-200 text-sm font-mono resize-none"
                          />
                          {fieldError && <p className="text-xs text-red-500 mt-1">{fieldError}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmModal
        open={saveModal}
        onClose={() => setSaveModal(false)}
        onConfirm={() => void saveAllChanged()}
        title="설정 저장 확인"
        message={`변경된 설정 ${changedKeys.length}건을 저장하시겠습니까? 고객 화면에 즉시 반영될 수 있습니다.`}
        confirmLabel={savingAll ? "저장 중..." : "저장"}
      />
    </div>
  );
}
