const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://middlemanbackend-b0mm.onrender.com";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = localStorage.getItem("middleman_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    // no body
  }

  // Backend wraps responses as { status: 1|0, message, data }
  if (payload && typeof payload.status !== "undefined") {
    if (payload.status === 1) {
      return payload.data;
    }
    throw new ApiError(payload.message || "Something went wrong", res.status);
  }

  if (!res.ok) {
    throw new ApiError(
      (payload && payload.message) || `Request failed (${res.status})`,
      res.status
    );
  }

  return payload;
}

export const api = {
  register: (email, password) =>
    request("/auth/register", { method: "POST", auth: false, body: { email, password } }),

  login: (email, password) =>
    request("/auth/login", { method: "POST", auth: false, body: { email, password } }),

  listApps: () => request("/apps"),

  createApp: (data) => request("/apps", { method: "POST", body: data }),

  updateApp: (id, data) => request(`/apps/${id}`, { method: "PUT", body: data }),

  deleteApp: (id) => request(`/apps/${id}`, { method: "DELETE" }),
};
