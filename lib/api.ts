import { cookies } from "next/headers";

const API_BASE_URL = "https://backend-albarqy.onrender.com/api";

export async function fetchApi(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const tokenType = cookieStore.get("auth_token_type")?.value || "Bearer";

  const headers = new Headers(options.headers || {});
  
  if (token) {
    // Some APIs prefer "Bearer" with capital B, but "bearer" works mostly. Let's use Capitalized just in case, 
    // unless the backend specifically needs it lowercased.
    const capitalizedTokenType = tokenType.charAt(0).toUpperCase() + tokenType.slice(1);
    headers.set("Authorization", `${capitalizedTokenType} ${token}`);
  }

  // Ensure JSON headers if not explicitly disabled
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  
  headers.set("Accept", "application/json");

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle global 401 Unauthorized here if needed
  if (response.status === 401) {
    console.error("Unauthorized access to", url);
    // You could potentially trigger a redirect or throw an error here,
    // but typically you let the caller handle it or redirect via middleware
  }

  return response;
}
