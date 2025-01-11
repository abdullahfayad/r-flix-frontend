import { Grid, Box, CircularProgress } from "@mui/material";
import { Movie, Genre } from "../types/movie";
import MovieCard from "./MovieCard";

interface MovieListProps {
  movies: Movie[];
  genres?: Genre[];
  loading?: boolean;
  userRatings?: { [key: number]: number | null };
  onRatingChange?: (movieId: number, rating: number | null) => void;
}

const MovieList = ({ movies, genres, loading = false }: MovieListProps) => {
  return (
    <>
      <Grid container spacing={2}>
        {movies.map((movie) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
            <MovieCard movie={movie} genres={genres || []} />
          </Grid>
        ))}
      </Grid>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default MovieList;
