export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  runtime: number;
  genres: TmdbGenre[];
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  cast?: TmdbCastMember[];
  release_dates?: {
    results: Array<{
      iso_3166_1: string;
      release_dates: Array<{
        certification: string;
      }>;
    }>;
  };
}

export interface TmdbTVShow {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  number_of_seasons: number;
  genres: TmdbGenre[];
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  seasons: TmdbSeason[];
  cast?: TmdbCastMember[];
  content_ratings?: {
    results: Array<{
      iso_3166_1: string;
      rating: string;
    }>;
  };
}

export interface TmdbSeason {
  season_number: number;
  name: string;
  episode_count: number;
  episodes?: TmdbEpisode[];
}

export interface TmdbEpisode {
  episode_number: number;
  name: string;
  air_date: string;
  overview: string;
  still_path: string | null;
}

export interface TmdbGenre { id: number; name: string; }
export interface TmdbCastMember { id: number; name: string; character: string; profile_path: string | null; }
