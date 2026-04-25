export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

export const PROTECTED_ROUTES = [
  '/',
  '/search',
  '/anime',
  '/my-list',
  '/profile',
  '/movie',
  '/tv',
  '/watch',
  '/genre',
];

export const OTT_PROVIDERS = [
  { id: 'netflix', name: 'Netflix', logo: '/ott/netflix.png' },
  { id: 'prime-video', name: 'Prime Video', logo: '/ott/prime-video.png' },
  { id: 'disney-hotstar', name: 'Disney+ Hotstar', logo: '/ott/disney-hotstar.png' },
  { id: 'hulu', name: 'Hulu', logo: '/ott/hulu.png' },
  { id: 'hbo', name: 'HBO', logo: '/ott/hbo.png' },
  { id: 'apple-tv', name: 'Apple TV+', logo: '/ott/apple-tv.png' },
  { id: 'paramount', name: 'Paramount+', logo: '/ott/paramount.png' },
  { id: 'shemaroo', name: 'Shemaroo', logo: '/ott/shemaroo.png' },
];
