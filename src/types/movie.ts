export interface Movie {
  id: number;
  title: string;
  overview: string;
  runtime?: number;
  imdb_id?: string;
  genres?: Genre[];
  homepage?: string;
  genre_ids: number[];
  release_date: string;
  vote_average: number;
  poster_path: string | null;
  production_companies?: ProductionCompany[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Crew {
  id: number;
  job: string;
  name: string;
}

export interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
}

export interface MovieDetails extends Movie {
  credits: {
    cast: Cast[];
    crew: Crew[];
  };
  reviews: {
    results: Review[];
  };
  recommendations: {
    results: Movie[];
  };
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export type MovieListType = "popular" | "top_rated" | "recommendations";
