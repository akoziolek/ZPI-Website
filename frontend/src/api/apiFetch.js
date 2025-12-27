export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  return res;
}

export async function apiFetchWithAuth(url, options = {}, onTokenExpired = null) {
  const res = await apiFetch(url, options);

  if (res.status === 401 || res.status === 403) {
    if (onTokenExpired) {
      onTokenExpired();
    }
    throw new Error("Sesja wygasła");
  }

  return res;
}

export async function verifyToken() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  try {
    const res = await apiFetch(`${backendUrl}/auth/verify`);
    if (res.ok) {
      const json = await res.json();
      return json.success ? json.user : null;
    }
    return null;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}