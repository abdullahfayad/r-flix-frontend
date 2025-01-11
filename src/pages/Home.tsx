import { useEffect, useState, useCallback } from "react";
import { Container, Tabs, Tab, useTheme, Alert, Paper } from "@mui/material";

import MovieList from "../components/MovieList";
import GenreFilter from "../components/GenreFilter";
import { getGenres, getMovies } from "../services/tmdbApi";
import { Genre, Movie, MovieListType } from "../types/movie";

const Home = () => {
  const theme = useTheme();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<MovieListType>("popular");

  const handleScroll = useCallback(() => {
    if (!hasMore || page >= 2) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 800;

    if (scrollPosition > threshold) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setPage(1);
    setMovies([]);
    setHasMore(true);
  }, [currentTab, selectedGenre]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await getMovies(currentTab, selectedGenre, page);
        setMovies((prev) =>
          page === 1
            ? response.data.results
            : [...prev, ...response.data.results]
        );

        setHasMore(response.data.page < response.data.total_pages);
      } catch (err) {
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentTab, selectedGenre, page]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await getGenres();
        setGenres(response.data.genres);
      } catch (err) {
        setError("Failed to load genres");
      }
    };

    fetchGenres();
  }, []);

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 4,
          mt: 2,
          gap: 2,
          display: "flex",
          backgroundColor: "transparent",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Tabs
          sx={{ mb: 4 }}
          value={currentTab}
          onChange={(_, newValue: MovieListType) => setCurrentTab(newValue)}
          TabIndicatorProps={{
            style: { backgroundColor: theme.palette.primary.main },
          }}
        >
          <Tab
            value="popular"
            label="Popular Movies"
            sx={{
              fontWeight: currentTab === "popular" ? "bold" : "normal",
            }}
          />
          <Tab
            value="top_rated"
            label="Top Rated Movies"
            sx={{
              fontWeight: currentTab === "top_rated" ? "bold" : "normal",
            }}
          />
        </Tabs>
        <GenreFilter
          genres={genres}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
        />
      </Paper>
      <MovieList
        genres={genres}
        loading={loading}
        movies={movies.slice(0, 40)}
      />
    </Container>
  );
};

export default Home;
