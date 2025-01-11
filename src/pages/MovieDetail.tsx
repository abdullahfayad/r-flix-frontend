import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  Box,
  Chip,
  Link,
  List,
  Card,
  Alert,
  Rating,
  ListItem,
  Container,
  Typography,
  CardContent,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { Language, Movie } from "@mui/icons-material";

import {
  rateMovie,
  deleteRating,
  getMovieRating,
  getMovieDetails,
} from "../services/tmdbApi";
import { MovieDetails } from "../types/movie";
import MovieList from "../components/MovieList";
import { IMAGE_BASE_URL } from "../utils/constants";
import RatingDialog from "../components/RatingDialog";

const ratingLabels: { [key: number]: string } = {
  1: "Awful!",
  2: "Meh",
  3: "Nice",
  4: "Great",
  5: "Epic!",
};

const MovieDetail = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [ratingDialogOpen, setRatingDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const [detailsResponse, ratingResponse] = await Promise.all([
          getMovieDetails(id!),
          getMovieRating(Number(id)),
        ]);
        setMovie(detailsResponse.data);
        setUserRating(ratingResponse.data.rated?.value ?? null);
      } catch (error) {
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const handleRating = async (rating: number | null) => {
    try {
      if (rating === null) {
        await deleteRating(Number(id));
      } else {
        await rateMovie(Number(id), rating);
      }
      setUserRating(rating && rating * 2);
    } catch (error) {
      setError("Failed to update rating");
    }
    setRatingDialogOpen(false);
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (loading || !movie) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const director = movie.credits.crew.find(
    (person) => person.job === "Director"
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            style={{ width: "100%", borderRadius: 8 }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {movie.title} ({new Date(movie.release_date).getFullYear()})
          </Typography>
          <Box sx={{ mb: 2 }}>
            {movie?.genres?.map((genre) => (
              <Chip key={genre.id} label={genre.name} sx={{ mr: 1, mb: 1 }} />
            ))}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 2 }}>
            <Box>
              <Rating
                readOnly
                max={5}
                precision={0.5}
                value={movie.vote_average / 2}
              />
            </Box>
            <Box
              sx={{
                cursor: "pointer",
                position: "relative",
                display: "inline-flex",
              }}
              onClick={() => setRatingDialogOpen(true)}
            >
              <CircularProgress
                size={60}
                color="primary"
                variant="determinate"
                value={userRating ? (userRating / 2) * 20 : 0}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  position: "absolute",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="caption" fontWeight="bold">
                  {userRating ? userRating / 2 : "0"}
                </Typography>
              </Box>
            </Box>
            <Typography
              onClick={() => !userRating && setRatingDialogOpen(true)}
              sx={{ cursor: !userRating ? "pointer" : "default" }}
            >
              {userRating ? ratingLabels[userRating / 2] : "Rate this movie"}
            </Typography>
          </Box>
          <Typography variant="h6" gutterBottom>
            Overview
          </Typography>
          <Typography paragraph>{movie.overview}</Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              Runtime: {movie.runtime} minutes
            </Typography>
            <Typography variant="body1" gutterBottom>
              Director: {director?.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Production:{" "}
              {movie.production_companies?.map((c) => c.name).join(", ")}
            </Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            {movie.homepage && (
              <Link
                href={movie.homepage}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mr: 2 }}
              >
                <Chip icon={<Language />} label="Website" clickable />
              </Link>
            )}
            {movie.imdb_id && (
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.imdb.com/title/${movie.imdb_id}`}
              >
                <Chip icon={<Movie />} label="IMDb" clickable />
              </Link>
            )}
          </Box>
          <Typography variant="h6" gutterBottom>
            Top Cast
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {movie.credits.cast.slice(0, 6).map((actor) => (
              <Grid item xs={6} sm={4} md={2} key={actor.id}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" noWrap>
                      {actor.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {actor.character}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {movie.reviews.results.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Reviews
              </Typography>
              <List>
                {movie.reviews.results.slice(0, 5).map((review) => (
                  <ListItem key={review.id}>
                    <ListItemText
                      primary={review.author}
                      secondary={review.content}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Grid>
      </Grid>
      {movie.recommendations.results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Recommended Movies
          </Typography>
          <MovieList
            loading={loading}
            movies={movie.recommendations.results.slice(0, 20)}
          />
        </Box>
      )}
      <RatingDialog
        open={ratingDialogOpen}
        movieTitle={movie.title}
        onRate={handleRating}
        onClose={() => setRatingDialogOpen(false)}
        currentRating={userRating ? userRating / 2 : null}
      />
    </Container>
  );
};

export default MovieDetail;
