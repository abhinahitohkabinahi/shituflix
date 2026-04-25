const TMDB_BASE_URL = typeof window !== 'undefined'
  ? '/tmdb-api/3'
  : 'https://api.themoviedb.org/3';

export async function tmdbFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(path.startsWith('http') ? path : `${TMDB_BASE_URL}${path}`, typeof window !== 'undefined' ? window.location.origin : undefined);
  
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const isBrowser = typeof window !== 'undefined';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Only add Auth header if we are on the server OR if the token is public and we are NOT using the proxy
  // But wait, if we use the proxy, the proxy adds the auth.
  // If we are on the server, we call TMDB directly and need the auth.
  
  if (!isBrowser) {
    // Server-side: use the private API Key if available, or the token
    const apiKey = process.env.MovieDB_API_Key;
    if (apiKey) {
      url.searchParams.set('api_key', apiKey);
    } else if (process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`;
    }
  } else {
    // Browser-side: We are using the proxy (/tmdb-api), so no need to add API Key/Token here.
    // The proxy will inject it from server-side environment variables.
  }

  const res = await fetch(url.toString(), { headers });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(`TMDB API error: ${res.status} ${JSON.stringify(errorData)}`);
  }
  
  return res.json();
}
