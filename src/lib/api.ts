export const API_URL = "http://localhost:3000"; 

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

export async function apiGet(endpoint: string) {
  const token = getToken();

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/";
    return null;
  }

  return res.json();
}

export async function apiPost(endpoint: string, body: any, withAuth = true) {
  const token = withAuth ? getToken() : null;

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/";
    return null;
  }

  return res.json();
}
