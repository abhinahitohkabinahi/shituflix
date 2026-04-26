import { NextRequest } from 'next/server';

export const runtime = 'nodejs'; // Explicitly use Node.js runtime

const TMDB_BASE = 'https://api.themoviedb.org';

async function handler(request: NextRequest) {
  try {
    const url = new URL(request.url);

    // Strip the /tmdb-api prefix
    const tmdbPath = url.pathname.replace(/^\/tmdb-api/, '');

    // Clean search params
    url.searchParams.delete('path');

    // Get API Key
    const apiKey = process.env.MovieDB_API_Key;
    if (!apiKey) {
      console.error('[TMDB Proxy] ERROR: MovieDB_API_Key is missing from .env.local');
    }

    // Construct target URL
    const targetUrl = new URL(`${TMDB_BASE}${tmdbPath}`);
    url.searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });

    // Always ensure api_key is present for v3 calls
    if (apiKey && tmdbPath.startsWith('/3')) {
      targetUrl.searchParams.set('api_key', apiKey);
    }

    console.log(`[TMDB Proxy] Proxying request to: ${targetUrl.pathname}`);

    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('user-agent') || 'shituFlix-App/1.0',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[TMDB Proxy] TMDB responded with ${response.status}: ${errorText}`);
      return new Response(errorText, {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Instead of streaming, let's get the JSON to ensure it's valid and decompress correctly
    const data = await response.json();
    console.log(`[TMDB Proxy] SUCCESS: Fetched data from ${targetUrl.pathname}`);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('[TMDB Proxy] Fatal Error:', error);
    return new Response(JSON.stringify({
      error: 'Proxy failure',
      message: error instanceof Error ? error.message : String(error)
    }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const GET = handler;
export const POST = handler;
export const OPTIONS = handler;
