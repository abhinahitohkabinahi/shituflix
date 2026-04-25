const MEDIA_FIELDS = `
  id idMal
  title { romaji english native }
  description
  coverImage { large extraLarge }
  bannerImage
  averageScore
  episodes
  genres
  status
  season
  seasonYear
  studios { nodes { name } }
`;

export const TRENDING_ANIME = `
  query TrendingAnime($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: TRENDING_DESC, type: ANIME) { ${MEDIA_FIELDS} }
    }
  }
`;

export const TOP_RATED_ANIME = `
  query TopRatedAnime($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: SCORE_DESC, type: ANIME) { ${MEDIA_FIELDS} }
    }
  }
`;

export const MOST_POPULAR_ANIME = `
  query MostPopularAnime($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: POPULARITY_DESC, type: ANIME) { ${MEDIA_FIELDS} }
    }
  }
`;

export const RECENTLY_UPDATED_ANIME = `
  query RecentlyUpdatedAnime($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: UPDATED_AT_DESC, type: ANIME, status: RELEASING) { ${MEDIA_FIELDS} }
    }
  }
`;

export const SEARCH_ANIME = `
  query SearchAnime($search: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(search: $search, type: ANIME) { ${MEDIA_FIELDS} }
    }
  }
`;

export const ANIME_DETAILS = `
  query AnimeDetails($id: Int) {
    Media(id: $id, type: ANIME) { ${MEDIA_FIELDS} }
  }
`;
