export * from './tmdbTrending';
export * from './tmdbTopRated';
export * from './tmdbDetails';
export * from './tmdbSearch';
export * from './tmdbGenres';
export * from './tmdbHindi';
export * from './tmdbOtt';

export const TmdbApiService = {
  fetchTrendingMovies: () => import('./tmdbTrending').then(m => m.fetchTrendingMovies()),
  fetchTrendingTVShows: () => import('./tmdbTrending').then(m => m.fetchTrendingTVShows()),
  fetchTopRatedMovies: () => import('./tmdbTopRated').then(m => m.fetchTopRatedMovies()),
  fetchTopRatedTVShows: () => import('./tmdbTopRated').then(m => m.fetchTopRatedTVShows()),
  fetchMovieById: (id: string) => import('./tmdbDetails').then(m => m.fetchMovieById(id)),
  fetchTVShowById: (id: string) => import('./tmdbDetails').then(m => m.fetchTVShowById(id)),
  fetchSeasonDetails: (showId: string, season: number) => import('./tmdbDetails').then(m => m.fetchSeasonDetails(showId, season)),
  searchMedia: (query: string) => import('./tmdbSearch').then(m => m.searchMedia(query)),
  fetchMoviesByGenre: (genreId: string, page?: number) => import('./tmdbGenres').then(m => m.fetchMoviesByGenre(genreId, page)),
  fetchTVShowsByGenre: (genreId: string, page?: number) => import('./tmdbGenres').then(m => m.fetchTVShowsByGenre(genreId, page)),
  fetchTopHindiMovies: () => import('./tmdbHindi').then(m => m.fetchTopHindiMovies()),
  fetchTopHindiTVShows: () => import('./tmdbHindi').then(m => m.fetchTopHindiTVShows()),
  fetchTopOTTContent: () => import('./tmdbOtt').then(m => m.fetchTopOTTContent()),
  fetchTVShowsByNetwork: (networkId: string, page?: number) => import('./tmdbOtt').then(m => m.fetchTVShowsByNetwork(networkId, page)),
  fetchMoviesByCompany: (companyId: string, page?: number) => import('./tmdbOtt').then(m => m.fetchMoviesByCompany(companyId, page)),
};
