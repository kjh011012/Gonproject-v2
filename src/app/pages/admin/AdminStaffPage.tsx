import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Badge } from "../../components/admin/AdminBadge";
import { AdminDetailPanel, DetailField } from "../../components/admin/AdminDetailPanel";
import { AdminModal } from "../../components/admin/AdminModal";
import {
  useAddStaffExceptionMutation,
  useCreateStaffMutation,
  useReplaceStaffAvailabilityMutation,
  useStaffCapacitySummaryQuery,
  useStaffQuery,
  useUpdateStaffMutation,
} from "../../hooks/admin/useAdminQueries";
import { adminApi } from "../../lib/api/admin";

type StaffItem = {
  id: number;
  name: string;
  roleType: string;
  phone: string | null;
  email: string | null;
  dailyCapacity: number;
  isActive: boolean;
};

type AvailabilityItem = {
  id: number;
  weekday: number;
  startTime: string;
  endTime: string;
  slotMinutes: number;
};

type ExceptionItem = {
  id: number;
  staffId: number;
  exceptionDate: string;
  startTime: string | null;
  endTime: string | null;
  type: string;
  reason: string | null;
};

const TABS = ["담당자 목록", "근무/가용 시간", "용량 설정", "예외/휴무"] as const;
type Tab = (typeof TABS)[number];

const ROLE_OPTIONS = ["medical", "nursing", "counsel", "admin", "other"];

function weekdayLabel(value: number) {
  return ["월", "화", "수", "목", "금", "토", "일"][value] ?? String(value);
}

export function AdminStaffPage() {
  const [tab, setTab] = useState<Tab>("담당자 목록");
  const [search, setSearch] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffItem | null>(null);
  const [name, setName] = useState("");
  const [roleType, setRoleType] = useState("nursing");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dailyCapacity, setDailyCapacity] = useState(6);
  const [isActive, setIsActive] = useState(true);

  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [exceptions, setExceptions] = useState<ExceptionItem[]>([]);
  const [capacityDate, setCapacityDate] = useState(new Date().toISOString().slice(0, 10));

  const [newExceptionDate, setNewExceptionDate] = useState(new Date().toISOString().slice(0, 10));
  const [newExceptionType, setNewExceptionType] = useState("day_off");
  const [newExceptionReason, setNewExceptionReason] = useState("");

  const [saving, setSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const staffQuery = useStaffQuery({ page: 1, pageSize: 300, search: search || undefined });
  const capacityQuery = useStaffCapacitySummaryQuery(capacityDate);

  const createStaff = useCreateStaffMutation();
  const updateStaff = useUpdateStaffMutation();
  const replaceAvailability = useReplaceStaffAvailabilityMutation();
  const addException = useAddStaffExceptionMutation();

  const staffRows = (staffQuery.data ?? []) as StaffItem[];
  const selectedStaff = selectedStaffId == null ? null : staffRows.find((row) => row.id === selectedStaffId) ?? null;

  const handleSelectStaff = (staffId: number | null) => {
    setSelectedStaffId(staffId);
  };

  const handleCloseDetail = () => {
    setSelectedStaffId(null);
  };

  useEffect(() => {
    if (!selectedStaffId) {
      setAvailability([]);
      setExceptions([]);
      return;
    }
    let cancelled = false;
    const load = async () => {
      try {
        const [aRes, eRes] = await Promise.all([
          adminApi.staffAvailability(selectedStaffId),
          adminApi.staffExceptions(selectedStaffId),
        ]);
        if (cancelled) return;
        setAvailability((aRes.data ?? []) as AvailabilityItem[]);
        setExceptions((eRes.data ?? []) as ExceptionItem[]);
      } catch {
        if (cancelled) return;
        setAvailability([]);
        setExceptions([]);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [selectedStaffId]);

  useEffect(() => {
    if (staffRows.length === 0) {
      setSelectedStaffId(null);
      return;
    }
    if (selectedStaffId != null && !staffRows.some((row) => row.id === selectedStaffId)) {
      setSelectedStaffId(null);
    }
  }, [selectedStaffId, staffRows]);

  const openCreate = () => {
    setEditingStaff(null);
    setName("");
    setRoleType("nursing");
    setPhone("");
    setEmail("");
    setDailyCapacity(6);
    setIsActive(true);
    setActionMessage(null);
    setEditorOpen(true);
  };

  const openEdit = (row: StaffItem) => {
    setEditingStaff(row);
    setName(row.name);
    setRoleType(row.roleType);
    setPhone(row.phone || "");
    setEmail(row.email || "");
    setDailyCapacity(row.dailyCapacity);
    setIsActive(row.isActive);
    setActionMessage(null);
    setEditorOpen(true);
  };

  const saveStaff = async () => {
    if (!name.trim()) {
      setActionMessage("이름은 필수입니다.");
      return;
    }
    setSaving(true);
    setActionMessage(null);
    try {
      const payload = {
        name: name.trim(),
        role_type: roleType,
        phone: phone.trim() || null,
        email: email.trim() || null,
        daily_capacity: Number(dailyCapacity || 0),
        is_active: isActive,
      };
      if (editingStaff) await updateStaff(editingStaff.id, payload);
      else await createStaff(payload);
      await staffQuery.refetch();
      await capacityQuery.refetch();
      setEditorOpen(false);
      setActionMessage("담당자 정보를 저장했습니다.");
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : "담당자 저장 실패");
    } finally {
      setSaving(false);
    }
  };

  const saveAvailability = async () => {
    if (!selectedStaffId) return;
    setSaving(true);
    setActionMessage(null);
    try {
      await replaceAvailability(
        selectedStaffId,
        availability.map((item) => ({
          weekday: item.weekday,
          start_time: item.startTime,
          end_time: item.endTime,
          slot_minutes: item.slotMinutes,
        })),
      );
      const aRes = await adminApi.staffAvailability(selectedStaffId);
      setAvailability((aRes.data ?? []) as AvailabilityItem[]);
      setActionMessage("근무 가용시간을 저장했습니다.");
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : "가용시간 저장 실패");
    } finally {
      setSaving(false);
    }
  };

  const createException = async () => {
    if (!selectedStaffId) return;
    setSaving(true);
    setActionMessage(null);
    try {
      await addException(selectedStaffId, {
        exception_date: newExceptionDate,
        type: newExceptionType,
        reason: newExceptionReason || null,
      });
      const eRes = await adminApi.staffExceptions(selectedStaffId);
      setExceptions((eRes.data ?? []) as ExceptionItem[]);
      setActionMessage("예외 일정을 등록했습니다.");
      setNewExceptionReason("");
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : "예외 일정 저장 실패");
    } finally {
      setSaving(false);
    }
  };

  const capacityRows = useMemo(() => (capacityQuery.data ?? []) as Array<{ staffId: number; name: string; dailyCapacity: number; assigned: number; remaining: number }>, [capacityQuery.data]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg text-[#111827]" style={{ fontWeight: 700 }}>담당자/용량</h1>
          <p className="text-xs text-gray-400 mt-0.5">담당자 관리, 근무시간, 용량, 예외일정 관리</p>
        </div>
        <button
          onClick={openCreate}
          className="px-3.5 py-2 rounded-lg bg-[#1F6B78] text-white text-xs cursor-pointer hover:bg-[#185A65] flex items-center gap-1.5"
          style={{ fontWeight: 600 }}
        >
          <Plus size={14} /> 담당자 추가
        </button>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-gray-200">
        {TABS.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`px-3 py-2.5 text-xs whitespace-nowrap border-b-2 cursor-pointer ${tab === item ? "border-[#1F6B78] text-[#1F6B78]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
            style={{ fontWeight: tab === item ? 600 : 400 }}
          >
            {item}
          </button>
        ))}
      </div>

      {actionMessage && (
        <div className="rounded-lg border border-[#1F6B78]/20 bg-[#1F6B78]/5 px-3 py-2 text-sm text-[#1F6B78]">
          {actionMessage}
        </div>
      )}

      {tab === "담당자 목록" && (
        <div className="flex gap-4">
          <div className={`flex-1 min-w-0 ${selectedStaff ? "hidden xl:block" : ""}`}>
            <div className="bg-white rounded-xl p-3 shadow-sm mb-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="이름, 역할, 연락처 검색..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F8F9FA]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-gray-400">이름</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-400">역할</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-400">연락처</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-400">하루 용량</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-400">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffQuery.loading && (
                      <tr><td colSpan={5} className="px-4 py-8 text-sm text-gray-500 text-center">담당자 목록 로딩 중...</td></tr>
                    )}
                    {!staffQuery.loading && staffRows.length === 0 && (
                      <tr><td colSpan={5} className="px-4 py-8 text-sm text-gray-400 text-center">담당자가 없습니다.</td></tr>
                    )}
                    {!staffQuery.loading && staffRows.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => handleSelectStaff(row.id)}
                        className={`border-t border-gray-50 cursor-pointer ${selectedStaffId === row.id ? "bg-[#1F6B78]/5" : "hover:bg-[#F8F9FA]/50"}`}
                      >
                        <td className="px-4 py-3 text-[#111827]" style={{ fontWeight: 600 }}>{row.name}</td>
                        <td className="px-4 py-3"><Badge variant="primary">{row.roleType}</Badge></td>
                        <td className="px-4 py-3 text-gray-600">{row.phone || "-"}</td>
                        <td className="px-4 py-3 text-gray-700">{row.dailyCapacity}</td>
                        <td className="px-4 py-3"><Badge variant={row.isActive ? "secondary" : "neutral"}>{row.isActive ? "활성" : "비활성"}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {selectedStaff && (
            <AdminDetailPanel title="담당자 상세" onClose={handleCloseDetail}>
              <DetailField label="이름"><p className="text-sm text-gray-700">{selectedStaff.name}</p></DetailField>
              <DetailField label="역할"><p className="text-sm text-gray-700">{selectedStaff.roleType}</p></DetailField>
              <DetailField label="연락처"><p className="text-sm text-gray-700">{selectedStaff.phone || "-"}</p></DetailField>
              <DetailField label="이메일"><p className="text-sm text-gray-700">{selectedStaff.email || "-"}</p></DetailField>
              <DetailField label="하루 용량"><p className="text-sm text-gray-700">{selectedStaff.dailyCapacity}</p></DetailField>
              <button
                onClick={() => openEdit(selectedStaff)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#1F6B78] text-[#1F6B78] text-sm"
                style={{ fontWeight: 600 }}
              >
                정보 수정
              </button>
            </AdminDetailPanel>
          )}
        </div>
      )}

      {tab === "근무/가용 시간" && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-2">
            <span className="text-xs text-gray-500">담당자</span>
            <select
              value={selectedStaffId ?? ""}
              onChange={(e) => handleSelectStaff(e.target.value ? Number(e.target.value) : null)}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
            >
              <option value="">담당자 선택</option>
              {staffRows.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}
            </select>
            <button
              onClick={() => {
                setAvailability((prev) => [
                  ...prev,
                  { id: Date.now(), weekday: 0, startTime: "09:00:00", endTime: "18:00:00", slotMinutes: 60 },
                ]);
              }}
              className="ml-auto px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-600"
            >
              슬롯 추가
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F8F9FA]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-gray-400">요일</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-400">시작</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-400">종료</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-400">슬롯(분)</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-400">삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {availability.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-8 text-sm text-gray-400">가용시간이 없습니다.</td></tr>
                  )}
                  {availability.map((slot, idx) => (
                    <tr key={slot.id} className="border-t border-gray-50">
                      <td className="px-4 py-3">
                        <select
                          value={slot.weekday}
                          onChange={(e) => {
                            const weekday = Number(e.target.value);
                            setAvailability((prev) => prev.map((item, itemIdx) => itemIdx === idx ? { ...item, weekday } : item));
                          }}
                          className="px-2 py-1.5 rounded border border-gray-200 bg-[#F8F9FA]"
                        >
                          {[0, 1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{weekdayLabel(n)}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="time"
                          value={slot.startTime.slice(0, 5)}
                          onChange={(e) => {
                            const startTime = `${e.target.value}:00`;
                            setAvailability((prev) => prev.map((item, itemIdx) => itemIdx === idx ? { ...item, startTime } : item));
                          }}
                          className="px-2 py-1.5 rounded border border-gray-200 bg-[#F8F9FA]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="time"
                          value={slot.endTime.slice(0, 5)}
                          onChange={(e) => {
                            const endTime = `${e.target.value}:00`;
                            setAvailability((prev) => prev.map((item, itemIdx) => itemIdx === idx ? { ...item, endTime } : item));
                          }}
                          className="px-2 py-1.5 rounded border border-gray-200 bg-[#F8F9FA]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={slot.slotMinutes}
                          onChange={(e) => {
                            const slotMinutes = Number(e.target.value || 60);
                            setAvailability((prev) => prev.map((item, itemIdx) => itemIdx === idx ? { ...item, slotMinutes } : item));
                          }}
                          className="w-20 px-2 py-1.5 rounded border border-gray-200 bg-[#F8F9FA]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setAvailability((prev) => prev.filter((_, itemIdx) => itemIdx !== idx))}
                          className="px-2 py-1 rounded border border-gray-200 text-xs text-gray-500"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={() => void saveAvailability()}
            disabled={saving || !selectedStaffId}
            className="px-4 py-2.5 rounded-lg bg-[#1F6B78] text-white text-sm disabled:opacity-60"
            style={{ fontWeight: 600 }}
          >
            {saving ? <span className="inline-flex items-center gap-1.5"><Loader2 size={14} className="animate-spin" /> 저장 중...</span> : "가용시간 저장"}
          </button>
        </div>
      )}

      {tab === "용량 설정" && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-2">
            <span className="text-xs text-gray-500">기준일</span>
            <input
              type="date"
              value={capacityDate}
              onChange={(e) => setCapacityDate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F9FA]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">담당자</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">일일 용량</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">배정</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">남은 용량</th>
                </tr>
              </thead>
              <tbody>
                {capacityQuery.loading && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">용량 요약 로딩 중...</td></tr>
                )}
                {!capacityQuery.loading && capacityRows.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">데이터가 없습니다.</td></tr>
                )}
                {!capacityQuery.loading && capacityRows.map((row) => (
                  <tr key={row.staffId} className="border-t border-gray-50">
                    <td className="px-4 py-3 text-[#111827]" style={{ fontWeight: 600 }}>{row.name}</td>
                    <td className="px-4 py-3 text-gray-600">{row.dailyCapacity}</td>
                    <td className="px-4 py-3 text-gray-600">{row.assigned}</td>
                    <td className="px-4 py-3"><Badge variant={row.remaining <= 0 ? "accent" : "secondary"}>{row.remaining}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "예외/휴무" && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-3 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
            <div>
              <label className="block text-xs text-gray-500 mb-1">담당자</label>
              <select
                value={selectedStaffId ?? ""}
                onChange={(e) => handleSelectStaff(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
              >
                <option value="">담당자 선택</option>
                {staffRows.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">날짜</label>
              <input
                type="date"
                value={newExceptionDate}
                onChange={(e) => setNewExceptionDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">유형</label>
              <select
                value={newExceptionType}
                onChange={(e) => setNewExceptionType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
              >
                <option value="day_off">휴무</option>
                <option value="unavailable">근무불가</option>
                <option value="limited">제한근무</option>
              </select>
            </div>
            <button
              onClick={() => void createException()}
              disabled={saving || !selectedStaffId}
              className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-sm disabled:opacity-60"
              style={{ fontWeight: 600 }}
            >
              예외 등록
            </button>
          </div>

          <div className="bg-white rounded-xl p-3 shadow-sm">
            <label className="block text-xs text-gray-500 mb-1">사유</label>
            <input
              value={newExceptionReason}
              onChange={(e) => setNewExceptionReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm"
              placeholder="예: 외부 교육 참석"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F9FA]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">날짜</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">유형</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">사유</th>
                </tr>
              </thead>
              <tbody>
                {exceptions.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-400">등록된 예외 일정이 없습니다.</td></tr>
                )}
                {exceptions.map((row) => (
                  <tr key={row.id} className="border-t border-gray-50">
                    <td className="px-4 py-3 text-gray-600">{row.exceptionDate}</td>
                    <td className="px-4 py-3"><Badge variant="accent">{row.type}</Badge></td>
                    <td className="px-4 py-3 text-gray-600">{row.reason || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AdminModal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title={editingStaff ? "담당자 수정" : "담당자 추가"}
        size="md"
        footer={
          <>
            <button onClick={() => setEditorOpen(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600">취소</button>
            <button
              onClick={() => void saveStaff()}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[#1F6B78] text-white text-sm disabled:opacity-60"
              style={{ fontWeight: 600 }}
            >
              {saving ? <span className="inline-flex items-center gap-1.5"><Loader2 size={14} className="animate-spin" /> 저장 중...</span> : "저장"}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">이름 *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">역할</label>
            <select value={roleType} onChange={(e) => setRoleType(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm">
              {ROLE_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">연락처</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">이메일</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">하루 처리량</label>
            <input type="number" value={dailyCapacity} onChange={(e) => setDailyCapacity(Number(e.target.value || 0))} className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F8F9FA] text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="accent-[#1F6B78]" />
            활성 상태
          </label>
        </div>
      </AdminModal>
    </div>
  );
}
