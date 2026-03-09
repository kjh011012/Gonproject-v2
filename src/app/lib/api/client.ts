export interface ApiErrorBody {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  } | null;
  error: ApiErrorBody | null;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";
const ACCESS_TOKEN_KEY = "gonproject_admin_access_token";
const REFRESH_TOKEN_KEY = "gonproject_admin_refresh_token";
const AUTO_LOGIN = import.meta.env.VITE_ADMIN_DEV_AUTO_LOGIN === "true";
const DEV_EMAIL = import.meta.env.VITE_ADMIN_DEV_EMAIL ?? "admin@example.com";
const DEV_PASSWORD = import.meta.env.VITE_ADMIN_DEV_PASSWORD ?? "ChangeMe123!";

let accessToken: string | null = localStorage.getItem(ACCESS_TOKEN_KEY);
let refreshToken: string | null = localStorage.getItem(REFRESH_TOKEN_KEY);
let isEnsuringSession = false;

export function setTokens(nextAccess: string | null, nextRefresh: string | null) {
  accessToken = nextAccess;
  refreshToken = nextRefresh;
  if (nextAccess) localStorage.setItem(ACCESS_TOKEN_KEY, nextAccess);
  else localStorage.removeItem(ACCESS_TOKEN_KEY);
  if (nextRefresh) localStorage.setItem(REFRESH_TOKEN_KEY, nextRefresh);
  else localStorage.removeItem(REFRESH_TOKEN_KEY);
}

type TokenLike = {
  accessToken?: string;
  refreshToken?: string;
  access_token?: string;
  refresh_token?: string;
};

function readTokenPair(data: unknown): { accessToken: string; refreshToken: string } {
  const tokenLike = (data ?? {}) as TokenLike;
  const access = tokenLike.accessToken ?? tokenLike.access_token;
  const refresh = tokenLike.refreshToken ?? tokenLike.refresh_token;
  if (!access || !refresh) {
    throw new Error("Invalid token response");
  }
  return { accessToken: access, refreshToken: refresh };
}

async function postJson<T>(path: string, payload?: unknown): Promise<ApiResponse<T>> {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: payload === undefined ? undefined : JSON.stringify(payload),
  });
  const body = (await res.json()) as ApiResponse<T>;
  if (!res.ok || body.error) {
    throw new Error(body.error?.message || `Request failed: ${res.status}`);
  }
  return body;
}

async function ensureSession(): Promise<void> {
  if (accessToken || !AUTO_LOGIN || isEnsuringSession) return;
  isEnsuringSession = true;
  try {
    const login = await postJson<TokenLike>(
      "/admin/auth/login",
      {
        email: DEV_EMAIL,
        password: DEV_PASSWORD,
      },
    );
    const pair = readTokenPair(login.data);
    setTokens(pair.accessToken, pair.refreshToken);
  } finally {
    isEnsuringSession = false;
  }
}

async function doFetch<T>(path: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
  await ensureSession();

  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  let res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (res.status === 401 && refreshToken) {
    const refreshed = await tryRefreshTokens();
    if (refreshed && accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
      res = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers,
      });
    }
  }

  const body = (await res.json()) as ApiResponse<T>;
  if (!res.ok || body.error) {
    throw new Error(body.error?.message || `Request failed: ${res.status}`);
  }
  return body;
}

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  return doFetch<T>(path, { method: "GET" });
}

export async function apiPost<T>(path: string, payload?: unknown): Promise<ApiResponse<T>> {
  return doFetch<T>(path, {
    method: "POST",
    body: payload === undefined ? undefined : JSON.stringify(payload),
  });
}

export async function apiPatch<T>(path: string, payload?: unknown): Promise<ApiResponse<T>> {
  return doFetch<T>(path, {
    method: "PATCH",
    body: payload === undefined ? undefined : JSON.stringify(payload),
  });
}

export async function apiPut<T>(path: string, payload?: unknown): Promise<ApiResponse<T>> {
  return doFetch<T>(path, {
    method: "PUT",
    body: payload === undefined ? undefined : JSON.stringify(payload),
  });
}

export async function apiDelete<T>(path: string): Promise<ApiResponse<T>> {
  return doFetch<T>(path, { method: "DELETE" });
}

export async function tryRefreshTokens(): Promise<boolean> {
  if (!refreshToken) return false;
  try {
    const res = await postJson<TokenLike>(
      "/admin/auth/refresh",
      { refresh_token: refreshToken },
    );
    const pair = readTokenPair(res.data);
    setTokens(pair.accessToken, pair.refreshToken);
    return true;
  } catch {
    setTokens(null, null);
    return false;
  }
}
