import axios, { AxiosResponse } from "axios";

import { Genre, MovieListType, MovieResponse } from "@/types/movie";

interface MovieRatingResponse {
  rated: {
    value: number;
  } | null;
}

interface MovieParams {
  page: number;
  sort_by: string;
  with_genres: string;
  "vote_count.gte"?: number;
}

const tmdbApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export const getMovies = (
  type: MovieListType = "popular",
  genreId: string = "",
  page: number = 1
): Promise<AxiosResponse<MovieResponse>> => {
  let params: MovieParams = {
    page,
    with_genres: genreId,
    sort_by: type === "popular" ? "popularity.desc" : "vote_average.desc",
  };

  if (type === "top_rated") {
    params["vote_count.gte"] = 100;
  }

  return tmdbApi.get("/discover/movie", {
    params,
  });
};

export const getGenres = (): Promise<AxiosResponse<{ genres: Genre[] }>> => {
  return tmdbApi.get("/genre/movie/list");
};

export const getMovieRating = (
  movieId: number
): Promise<AxiosResponse<MovieRatingResponse>> => {
  return tmdbApi.get(`/movie/${movieId}/account_states`, {
    params: {
      session_id: localStorage.getItem("sessionId"),
    },
  });
};

export const getMovieDetails = (movieId: string) => {
  return tmdbApi.get(`/movie/${movieId}`, {
    params: {
      append_to_response: "credits,reviews,recommendations",
    },
  });
};

export const searchMovies = (query: string) => {
  return tmdbApi.get("/search/movie", {
    params: { query },
  });
};

export const createRequestToken = () => {
  return tmdbApi.get("/authentication/token/new");
};

export const validateWithLogin = (
  username: string,
  password: string,
  requestToken: string
) => {
  return tmdbApi.post("/authentication/token/validate_with_login", {
    username,
    password,
    request_token: requestToken,
  });
};

export const createSession = (requestToken: string) => {
  return tmdbApi.post("/authentication/session/new", {
    request_token: requestToken,
  });
};

export const getMovieSuggestions = (query: string) => {
  return tmdbApi.get("/search/movie", {
    params: {
      query,
      page: 1,
      include_adult: false,
    },
  });
};

export const rateMovie = (movieId: number, rating: number) => {
  return tmdbApi.post(
    `/movie/${movieId}/rating`,
    {
      value: rating * 2,
    },
    {
      params: {
        session_id: localStorage.getItem("sessionId"),
      },
    }
  );
};

export const deleteRating = (movieId: number) => {
  return tmdbApi.delete(`/movie/${movieId}/rating`, {
    params: {
      session_id: localStorage.getItem("sessionId"),
    },
  });
};

export const getRatedMovies = (page: number = 1) => {
  return tmdbApi.get("/account/{account_id}/rated/movies", {
    params: {
      session_id: localStorage.getItem("sessionId"),
      page,
    },
  });
};
