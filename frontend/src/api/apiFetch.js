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
/*
export async function apiRequest(url, options = {}, onTokenExpired = null) {
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
      if(onTokenExpired) onTokenExpired(); // CZY TU TEZ IMPORTOWAC ONTOKEN EXPIRED Z KONEKSTU?
      throw new Error("Session expired");
    }
  }

  return res;
}
*/

// to nie dziala useapi dziala 
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

  if (!res.ok) {
    throw new Error(`HTTP_${res.status}`);
  }

  const json = await res.json();
  if (json.success === false) {
    throw new Error(json.message || "API_ERROR");
  }

  return json.data ?? json;
}
// czy zwracac jsona??