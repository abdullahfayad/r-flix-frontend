import { useEffect, useState, useCallback } from "react";
import { Alert, Container, Typography } from "@mui/material";

import {
  getGenres,
  rateMovie,
  deleteRating,
  getRatedMovies,
} from "../services/tmdbApi";
import { Genre, Movie } from "../types/movie";
import MovieList from "../components/MovieList";

const Ratings = () => {
  const [page, setPage] = useState<number>(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userRatings, setUserRatings] = useState<{ [key: number]: number }>({});

  const handleScroll = useCallback(() => {
    if (!hasMore || loading) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 800;

    if (scrollPosition > threshold) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ratedResponse, genresResponse] = await Promise.all([
          getRatedMovies(page),
          page === 1 ? getGenres() : Promise.resolve({ data: { genres: [] } }),
        ]);

        if (page === 1) {
          setGenres(genresResponse.data.genres);
          setMovies(ratedResponse.data.results);
        } else {
          setMovies((prev) => [...prev, ...ratedResponse.data.results]);
        }

        setHasMore(ratedResponse.data.page < ratedResponse.data.total_pages);

        const newRatings = ratedResponse.data.results.reduce(
          (
            acc: { [key: number]: number },
            movie: { id: number; rating: number }
          ) => ({
            ...acc,
            [movie.id]: movie.rating,
          }),
          {}
        );
        setUserRatings((prev) => ({ ...prev, ...newRatings }));
      } catch (error) {
        setError("Failed to load rated movies");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handleRatingChange = async (movieId: number, rating: number | null) => {
    try {
      if (rating === null) {
        await deleteRating(movieId);
        setMovies((prev) => prev.filter((movie) => movie.id !== movieId));
      } else {
        await rateMovie(movieId, rating);
        setUserRatings((prev) => ({
          ...prev,
          [movieId]: rating,
        }));
      }
    } catch (error) {
      setError("Failed to update rating");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        My Ratings
      </Typography>
      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <MovieList
          movies={movies}
          genres={genres}
          loading={loading}
          userRatings={userRatings}
          onRatingChange={handleRatingChange}
        />
      )}
    </Container>
  );
};

export default Ratings;
