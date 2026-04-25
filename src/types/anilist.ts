export interface AniListMedia {
  id: number;
  idMal: number | null;
  title: { romaji: string; english: string | null; native: string };
  description: string | null;
  coverImage: { large: string; extraLarge: string };
  bannerImage: string | null;
  averageScore: number | null;
  episodes: number | null;
  genres: string[];
  status: string;
  season: string | null;
  seasonYear: number | null;
  studios: { nodes: { name: string }[] };
}
