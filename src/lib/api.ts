export const API_URL = "http://localhost:3000";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

export async function apiGet(endpoint: string) {
  const token = getToken();
  const url = `${API_URL}${endpoint}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (res.status === 401) {
    console.warn("⚠️ Token inválido ou expirado. Redirecionando...");
    localStorage.removeItem("token");
    window.location.href = "/";
    return null;
  }

  return res.json();
}

export async function apiPost<T>(endpoint: string, body: T, withAuth = true) {
  const token = withAuth ? getToken() : null;
  const url = `${API_URL}${endpoint}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (res.status === 401) {
    console.warn("Token inválido ou expirado. Redirecionando...");
    localStorage.removeItem("token");
    window.location.href = "/";
    return null;
  }

  if (res.status === 404) {
    console.error("Erro 404 — rota não encontrada:", url);
  }

  return res.json();
}
