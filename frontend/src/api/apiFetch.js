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
  let res = await apiFetch(url, options);

  // token expired (401 lub 403)
  if (res.status === 401 || res.status === 403) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const refreshRes = await fetch(`${backendUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",  //send cookies
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      localStorage.setItem("token", data.token);

      res = await apiFetch(url, options); // try fetching again
    } else {
      if(onTokenExpired) onTokenExpired();
      throw new Error("Sesja wygasła definitywnie");
    }
  }

  return res;
}

export async function verifyToken() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  try {
    const res = await apiFetchWithAuth(`${backendUrl}/auth/verify`);
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