async function apiFetch(url, options = {}) {
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

export async function apiRequest(url, options = {}, onTokenExpired) {
  let res = await apiFetch(url, options);

  if (res.status === 401 || res.status === 403) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const refreshRes = await fetch(`${backendUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!refreshRes.ok) {
      onTokenExpired?.(); 
      throw new Error("Session expired");
    }

    const { token } = await refreshRes.json();
    localStorage.setItem("token", token);
    res = await apiFetch(url, options);
  }

  let json;
  try {
    json = await res.json();
  } catch {
    json = {};
  }

  // if (!res.ok) {
  //   throw new Error(`HTTP_${res.status}`);
  // }


  if (!res.ok || json.success === false) {
    const error = new Error(json.message || `HTTP_${res.status}`)
    error.response = { data: json };
    throw error;
  }

  // if (json.success === false) {
  //   throw new Error(json.message || "API_ERROR");
  // }

  return json.data ?? json;
}
