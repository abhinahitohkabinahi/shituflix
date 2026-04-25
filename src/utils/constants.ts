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
  { id: 'netflix', name: 'Netflix', logo: '/ott/netflix.png', networkId: '213' },
  { id: 'prime-video', name: 'Prime Video', logo: '/ott/prime-video.png', networkId: '1024' },
  { id: 'disney-hotstar', name: 'Disney+ Hotstar', logo: '/ott/disney-hotstar.png', networkId: '2739' },
  { id: 'hulu', name: 'Hulu', logo: '/ott/hulu.png', networkId: '453' },
  { id: 'hbo', name: 'HBO', logo: '/ott/hbo.png', networkId: '49' },
  { id: 'apple-tv', name: 'Apple TV+', logo: '/ott/apple-tv.png', networkId: '2552' },
  { id: 'paramount', name: 'Paramount+', logo: '/ott/paramount.png', networkId: '4330' },
  { id: 'shemaroo', name: 'Shemaroo', logo: '/ott/shemaroo.png', networkId: '2476' },
];
