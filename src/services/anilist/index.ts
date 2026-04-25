export * from './anilistTrending';
export * from './anilistSearch';
export * from './anilistDetails';

export const AniListService = {
  fetchTrendingAnime: () => import('./anilistTrending').then(m => m.fetchTrendingAnime()),
  fetchMostPopularAnime: () => import('./anilistTrending').then(m => m.fetchMostPopularAnime()),
  fetchRecentlyUpdatedAnime: () => import('./anilistTrending').then(m => m.fetchRecentlyUpdatedAnime()),
  searchAnime: (query: string) => import('./anilistSearch').then(m => m.searchAnime(query)),
  fetchAnimeById: (id: number) => import('./anilistDetails').then(m => m.fetchAnimeById(id)),
};
