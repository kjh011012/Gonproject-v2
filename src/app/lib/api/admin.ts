import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "./client";

type TokenResponse = {
  accessToken?: string;
  refreshToken?: string;
  access_token?: string;
  refresh_token?: string;
};

function toQuery(params: Record<string, string | number | boolean | undefined | null>) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    q.set(key, String(value));
  });
  const query = q.toString();
  return query ? `?${query}` : "";
}

export const adminApi = {
  login: (email: string, password: string) => apiPost<TokenResponse>("/admin/auth/login", { email, password }),
  me: () => apiGet<{ id: number; email: string; name: string; permissions: string[]; roles: string[] }>("/admin/auth/me"),

  dashboardSummary: () => apiGet<{ applicationsPending: number; unmatchedTransactions: number; inquiriesPending: number; activeMembers: number }>("/admin/dashboard/summary"),

  members: (params?: { page?: number; pageSize?: number; search?: string; status?: string; region?: string }) =>
    apiGet<any[]>(`/admin/members${toQuery({
      page: params?.page,
      page_size: params?.pageSize,
      search: params?.search,
      status: params?.status,
      region: params?.region,
    })}`),
  memberDetail: (memberId: number) => apiGet<any>(`/admin/members/${memberId}`),
  updateMemberStatus: (memberId: number, status: string, reason?: string) =>
    apiPatch(`/admin/members/${memberId}/status`, { status, reason }),
  addMemberNote: (memberId: number, body: string, isPrivate = true) =>
    apiPost(`/admin/members/${memberId}/notes`, { body, is_private: isPrivate }),

  applications: (params?: { page?: number; pageSize?: number; status?: string; search?: string }) =>
    apiGet<any[]>(`/admin/applications${toQuery({
      page: params?.page,
      page_size: params?.pageSize,
      status: params?.status,
      search: params?.search,
    })}`),
  markApplicationPaymentMatched: (applicationId: number) => apiPost(`/admin/applications/${applicationId}/mark-payment-matched`),
  approveApplication: (applicationId: number) => apiPost(`/admin/applications/${applicationId}/approve`),
  rejectApplication: (applicationId: number, reason?: string) => apiPost(`/admin/applications/${applicationId}/reject`, { reason }),

  transactions: (params?: { page?: number; pageSize?: number; status?: string; search?: string }) =>
    apiGet<any[]>(`/admin/transactions${toQuery({
      page: params?.page,
      page_size: params?.pageSize,
      status: params?.status,
      search: params?.search,
    })}`),
  matchTransaction: (txId: number, memberId: number) => apiPost(`/admin/transactions/${txId}/match`, { member_id: memberId }),
  confirmTransaction: (txId: number) => apiPost(`/admin/transactions/${txId}/confirm`, { confirmed: true }),

  serviceRequests: (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    search?: string;
    priority?: string;
    staffId?: number;
    fromDate?: string;
    toDate?: string;
    unassignedOnly?: boolean;
  }) =>
    apiGet<any[]>(`/admin/services${toQuery({
      page: params?.page,
      page_size: params?.pageSize,
      status: params?.status,
      search: params?.search,
      priority: params?.priority,
      staff_id: params?.staffId,
      from_date: params?.fromDate,
      to_date: params?.toDate,
      unassigned_only: params?.unassignedOnly,
    })}`),
  serviceRequestDetail: (requestId: number) => apiGet<any>(`/admin/services/${requestId}`),
  createServiceRequest: (payload: Record<string, unknown>) => apiPost("/admin/services", payload),
  assignServiceRequest: (requestId: number, staffId: number) =>
    apiPost(`/admin/services/${requestId}/assign`, { staff_id: staffId }),
  updateServiceRequestStatus: (requestId: number, status: string, reason?: string) =>
    apiPost(`/admin/services/${requestId}/status`, { status, reason }),
  scheduleServiceRequest: (
    requestId: number,
    payload: { startAt: string; endAt: string; staffId?: number; locationSummary?: string },
  ) =>
    apiPost(`/admin/services/${requestId}/schedule`, {
      start_at: payload.startAt,
      end_at: payload.endAt,
      staff_id: payload.staffId,
      location_summary: payload.locationSummary,
    }),
  bulkAssignServiceRequests: (requestIds: number[], staffId: number) =>
    apiPost("/admin/services/bulk/assign", { request_ids: requestIds, staff_id: staffId }),
  bulkStatusServiceRequests: (requestIds: number[], status: string, reason?: string) =>
    apiPost("/admin/services/bulk/status", { request_ids: requestIds, status, reason }),
  bulkScheduleServiceRequests: (
    requestIds: number[],
    payload: { startAt: string; endAt: string; staffId?: number },
  ) =>
    apiPost("/admin/services/bulk/schedule", {
      request_ids: requestIds,
      start_at: payload.startAt,
      end_at: payload.endAt,
      staff_id: payload.staffId,
    }),

  calendarEvents: (params?: { view?: "day" | "week" | "month" | "staff"; targetDate?: string; staffId?: number }) =>
    apiGet<any[]>(`/admin/calendar/events${toQuery({
      view: params?.view,
      target_date: params?.targetDate,
      staff_id: params?.staffId,
    })}`),
  upsertCalendarEvent: (
    requestId: number,
    payload: { startAt: string; endAt: string; staffId?: number; locationSummary?: string },
  ) =>
    apiPost(`/admin/calendar/events/${requestId}`, {
      start_at: payload.startAt,
      end_at: payload.endAt,
      staff_id: payload.staffId,
      location_summary: payload.locationSummary,
    }),

  opsQueues: () => apiGet<Record<string, number>>("/admin/ops/queues"),
  opsRows: (params?: { page?: number; pageSize?: number; search?: string; status?: string }) =>
    apiGet<any[]>(`/admin/ops/rows${toQuery({
      page: params?.page,
      page_size: params?.pageSize,
      search: params?.search,
      status: params?.status,
    })}`),
  opsBulkAssign: (requestIds: number[], staffId: number) =>
    apiPost("/admin/ops/bulk-assign", { request_ids: requestIds, staff_id: staffId }),
  opsBulkStatus: (requestIds: number[], status: string, reason?: string) =>
    apiPost("/admin/ops/bulk-status", { request_ids: requestIds, status, reason }),
  opsBulkSchedule: (requestIds: number[], payload: { startAt: string; endAt: string; staffId?: number }) =>
    apiPost("/admin/ops/bulk-schedule", {
      request_ids: requestIds,
      start_at: payload.startAt,
      end_at: payload.endAt,
      staff_id: payload.staffId,
    }),

  staff: (params?: { page?: number; pageSize?: number; search?: string; activeOnly?: boolean }) =>
    apiGet<any[]>(`/admin/staff${toQuery({
      page: params?.page,
      page_size: params?.pageSize,
      search: params?.search,
      active_only: params?.activeOnly,
    })}`),
  createStaff: (payload: Record<string, unknown>) => apiPost("/admin/staff", payload),
  updateStaff: (staffId: number, payload: Record<string, unknown>) => apiPatch(`/admin/staff/${staffId}`, payload),
  staffAvailability: (staffId: number) => apiGet<any[]>(`/admin/staff/${staffId}/availability`),
  replaceStaffAvailability: (staffId: number, slots: Array<Record<string, unknown>>) =>
    apiPut(`/admin/staff/${staffId}/availability`, { slots }),
  staffExceptions: (staffId: number) => apiGet<any[]>(`/admin/staff/${staffId}/exceptions`),
  addStaffException: (staffId: number, payload: Record<string, unknown>) => apiPost(`/admin/staff/${staffId}/exceptions`, payload),
  staffCapacitySummary: (targetDate?: string) =>
    apiGet<any[]>(`/admin/staff/capacity-summary${toQuery({ target_date: targetDate })}`),

  inquiries: (params?: { page?: number; pageSize?: number; status?: string; search?: string }) =>
    apiGet<any[]>(`/admin/inquiries${toQuery({
      page: params?.page,
      page_size: params?.pageSize,
      status: params?.status,
      search: params?.search,
    })}`),
  inquiryDetail: (inquiryId: number) => apiGet<any>(`/admin/inquiries/${inquiryId}`),
  replyInquiry: (inquiryId: number, body: string) => apiPost(`/admin/inquiries/${inquiryId}/reply`, { body }),

  notices: (params?: { page?: number; pageSize?: number; status?: string }) =>
    apiGet<any[]>(`/admin/notices${toQuery({
      page: params?.page,
      page_size: params?.pageSize,
      status: params?.status,
    })}`),
  createNotice: (payload: Record<string, unknown>) => apiPost("/admin/notices", payload),
  updateNotice: (noticeId: number, payload: Record<string, unknown>) => apiPatch(`/admin/notices/${noticeId}`, payload),

  catalogItems: (params?: { page?: number; pageSize?: number; status?: string }) =>
    apiGet<any[]>(`/admin/service-catalog${toQuery({
      page: params?.page,
      page_size: params?.pageSize,
      status: params?.status,
    })}`),
  catalogSettings: () => apiGet<Record<string, string>>("/admin/service-catalog/settings"),
  updateCatalogSettings: (payload: Record<string, unknown>) => apiPatch("/admin/service-catalog/settings", payload),
  saveCatalogItem: (itemId: number | null, payload: Record<string, unknown>) =>
    itemId == null ? apiPost("/admin/service-catalog", payload) : apiPatch(`/admin/service-catalog/${itemId}`, payload),
  deleteCatalogItem: (itemId: number) => apiDelete(`/admin/service-catalog/${itemId}`),

  faqs: (params?: { page?: number; pageSize?: number; visibleOnly?: boolean }) =>
    apiGet<any[]>(`/admin/faqs${toQuery({
      page: params?.page,
      page_size: params?.pageSize,
      visible_only: params?.visibleOnly,
    })}`),
  saveFaq: (faqId: number | null, payload: Record<string, unknown>) =>
    faqId == null ? apiPost("/admin/faqs", payload) : apiPatch(`/admin/faqs/${faqId}`, payload),

  settings: () => apiGet<any[]>("/admin/settings"),
  updateSetting: (key: string, valueJson: Record<string, unknown>, description?: string) =>
    apiPatch(`/admin/settings/${key}`, { valueJson, description }),

  auditLogs: (params?: { page?: number; pageSize?: number; entityType?: string; action?: string }) =>
    apiGet<any[]>(`/admin/audit-logs${toQuery({
      page: params?.page,
      page_size: params?.pageSize,
      entity_type: params?.entityType,
      action: params?.action,
    })}`),
};
