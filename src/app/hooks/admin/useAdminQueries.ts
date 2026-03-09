import { useEffect, useState } from "react";
import { adminApi } from "../../lib/api/admin";

function useSimpleQuery<T>(loader: () => Promise<{ data: T }>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await loader();
      setData(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch };
}

export function useDashboardSummaryQuery() {
  return useSimpleQuery(() => adminApi.dashboardSummary());
}

export function useAdminMembersQuery(params?: { page?: number; pageSize?: number; search?: string; status?: string; region?: string }) {
  return useSimpleQuery(() => adminApi.members(params), [params?.page, params?.pageSize, params?.search, params?.status, params?.region]);
}

export function useApplicationsQuery(params?: { page?: number; pageSize?: number; status?: string; search?: string }) {
  return useSimpleQuery(() => adminApi.applications(params), [params?.page, params?.pageSize, params?.status, params?.search]);
}

export function useTransactionsQuery(params?: { page?: number; pageSize?: number; status?: string; search?: string }) {
  return useSimpleQuery(() => adminApi.transactions(params), [params?.page, params?.pageSize, params?.status, params?.search]);
}

export function useServiceRequestsQuery(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
  priority?: string;
  staffId?: number;
  fromDate?: string;
  toDate?: string;
  unassignedOnly?: boolean;
}) {
  return useSimpleQuery(
    () => adminApi.serviceRequests(params),
    [params?.page, params?.pageSize, params?.status, params?.search, params?.priority, params?.staffId, params?.fromDate, params?.toDate, params?.unassignedOnly],
  );
}

export function useCalendarEventsQuery(params?: { view?: "day" | "week" | "month" | "staff"; targetDate?: string; staffId?: number }) {
  return useSimpleQuery(
    () => adminApi.calendarEvents(params),
    [params?.view, params?.targetDate, params?.staffId],
  );
}

export function useOpsQueuesQuery() {
  return useSimpleQuery(() => adminApi.opsQueues());
}

export function useOpsRowsQuery(params?: { page?: number; pageSize?: number; search?: string; status?: string }) {
  return useSimpleQuery(
    () => adminApi.opsRows(params),
    [params?.page, params?.pageSize, params?.search, params?.status],
  );
}

export function useStaffQuery(params?: { page?: number; pageSize?: number; search?: string; activeOnly?: boolean }) {
  return useSimpleQuery(
    () => adminApi.staff(params),
    [params?.page, params?.pageSize, params?.search, params?.activeOnly],
  );
}

export function useStaffCapacitySummaryQuery(targetDate?: string) {
  return useSimpleQuery(
    () => adminApi.staffCapacitySummary(targetDate),
    [targetDate],
  );
}

export function useInquiriesQuery(params?: { page?: number; pageSize?: number; status?: string; search?: string }) {
  return useSimpleQuery(() => adminApi.inquiries(params), [params?.page, params?.pageSize, params?.status, params?.search]);
}

export function useCatalogItemsQuery(params?: { page?: number; pageSize?: number; status?: string }) {
  return useSimpleQuery(
    () => adminApi.catalogItems(params),
    [params?.page, params?.pageSize, params?.status],
  );
}

export function useCatalogSettingsQuery() {
  return useSimpleQuery(() => adminApi.catalogSettings());
}

export function useFaqItemsQuery(params?: { page?: number; pageSize?: number; visibleOnly?: boolean }) {
  return useSimpleQuery(
    () => adminApi.faqs(params),
    [params?.page, params?.pageSize, params?.visibleOnly],
  );
}

export function useAuditLogsQuery(params?: { page?: number; pageSize?: number; entityType?: string; action?: string }) {
  return useSimpleQuery(
    () => adminApi.auditLogs(params),
    [params?.page, params?.pageSize, params?.entityType, params?.action],
  );
}

export function useNoticesQuery(params?: { page?: number; pageSize?: number; status?: string }) {
  return useSimpleQuery(
    () => adminApi.notices(params),
    [params?.page, params?.pageSize, params?.status],
  );
}

export function useUpdateMemberStatusMutation() {
  return (memberId: number, status: string, reason?: string) => adminApi.updateMemberStatus(memberId, status, reason);
}

export function useApproveApplicationMutation() {
  return (applicationId: number) => adminApi.approveApplication(applicationId);
}

export function useMatchTransactionMutation() {
  return (transactionId: number, memberId: number) => adminApi.matchTransaction(transactionId, memberId);
}

export function useAssignServiceRequestMutation() {
  return (requestId: number, staffId: number) => adminApi.assignServiceRequest(requestId, staffId);
}

export function useUpdateServiceRequestStatusMutation() {
  return (requestId: number, status: string, reason?: string) => adminApi.updateServiceRequestStatus(requestId, status, reason);
}

export function useScheduleServiceRequestMutation() {
  return (requestId: number, payload: { startAt: string; endAt: string; staffId?: number; locationSummary?: string }) =>
    adminApi.scheduleServiceRequest(requestId, payload);
}

export function useBulkAssignServiceRequestsMutation() {
  return (requestIds: number[], staffId: number) => adminApi.bulkAssignServiceRequests(requestIds, staffId);
}

export function useBulkStatusServiceRequestsMutation() {
  return (requestIds: number[], status: string, reason?: string) => adminApi.bulkStatusServiceRequests(requestIds, status, reason);
}

export function useBulkScheduleServiceRequestsMutation() {
  return (requestIds: number[], payload: { startAt: string; endAt: string; staffId?: number }) =>
    adminApi.bulkScheduleServiceRequests(requestIds, payload);
}

export function useOpsBulkAssignServiceRequestsMutation() {
  return (requestIds: number[], staffId: number) => adminApi.opsBulkAssign(requestIds, staffId);
}

export function useOpsBulkStatusServiceRequestsMutation() {
  return (requestIds: number[], status: string, reason?: string) => adminApi.opsBulkStatus(requestIds, status, reason);
}

export function useOpsBulkScheduleServiceRequestsMutation() {
  return (requestIds: number[], payload: { startAt: string; endAt: string; staffId?: number }) =>
    adminApi.opsBulkSchedule(requestIds, payload);
}

export function useCreateServiceRequestMutation() {
  return (payload: Record<string, unknown>) => adminApi.createServiceRequest(payload);
}

export function useUpsertCalendarEventMutation() {
  return (requestId: number, payload: { startAt: string; endAt: string; staffId?: number; locationSummary?: string }) =>
    adminApi.upsertCalendarEvent(requestId, payload);
}

export function useCreateStaffMutation() {
  return (payload: Record<string, unknown>) => adminApi.createStaff(payload);
}

export function useUpdateStaffMutation() {
  return (staffId: number, payload: Record<string, unknown>) => adminApi.updateStaff(staffId, payload);
}

export function useReplaceStaffAvailabilityMutation() {
  return (staffId: number, slots: Array<Record<string, unknown>>) => adminApi.replaceStaffAvailability(staffId, slots);
}

export function useAddStaffExceptionMutation() {
  return (staffId: number, payload: Record<string, unknown>) => adminApi.addStaffException(staffId, payload);
}

export function useReplyInquiryMutation() {
  return (inquiryId: number, body: string) => adminApi.replyInquiry(inquiryId, body);
}

export function useSaveCatalogItemMutation() {
  return (itemId: number | null, payload: Record<string, unknown>) => adminApi.saveCatalogItem(itemId, payload);
}

export function useUpdateCatalogSettingsMutation() {
  return (payload: Record<string, unknown>) => adminApi.updateCatalogSettings(payload);
}

export function useDeleteCatalogItemMutation() {
  return (itemId: number) => adminApi.deleteCatalogItem(itemId);
}

export function useSaveFaqMutation() {
  return (faqId: number | null, payload: Record<string, unknown>) => adminApi.saveFaq(faqId, payload);
}
