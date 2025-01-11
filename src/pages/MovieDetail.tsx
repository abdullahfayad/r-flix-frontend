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

const getRatingLabel = (rating: number | null): string => {
  if (!rating) return "Rate this movie";
  const value = rating / 2;
  if (value <= 1) return "Awful";
  if (value <= 2) return "Poor";
  if (value <= 3) return "Good";
  if (value <= 4) return "Great";
  return "Excellent";
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
    <>
      <Box
        sx={{
          position: "relative",
          height: { xs: "90vh", md: "70vh" },
          width: "100%",
          overflow: "hidden",
          mb: { xs: 3, md: 6 },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${IMAGE_BASE_URL}${movie.backdrop_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(2px)",
            transform: "scale(1.1)",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.9) 100%)",
            },
          }}
        />

        <Container
          maxWidth="xl"
          sx={{
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: { xs: "flex-end", md: "center" },
            pt: { xs: 2, md: 8 },
            pb: { xs: 4, md: 0 },
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: { xs: "none", md: "block" },
              }}
            >
              <Card
                elevation={8}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  transform: "translateY(20px)",
                }}
              >
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  style={{ width: "100%", display: "block" }}
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography
                variant="h3"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: "2rem", md: "3rem" },
                }}
              >
                {movie.title} ({new Date(movie.release_date).getFullYear()})
              </Typography>

              <Box sx={{ mb: 3 }}>
                {movie.genres?.map((genre) => (
                  <Chip
                    key={genre.id}
                    label={genre.name}
                    sx={{
                      mr: 1,
                      mb: 1,
                      backgroundColor: "primary.main",
                      color: "white",
                      fontSize: { xs: "0.75rem", md: "0.875rem" },
                    }}
                  />
                ))}
              </Box>

              <Typography
                sx={{
                  color: "white",
                  mb: 4,
                  fontSize: { xs: "0.9rem", md: "1.1rem" },
                  lineHeight: 1.6,
                  opacity: 0.9,
                  display: { xs: "none", md: "block" },
                }}
              >
                {movie.overview}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 2, md: 4 },
                  mb: 3,
                  flexWrap: "wrap",
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Rating
                      readOnly
                      max={5}
                      precision={0.5}
                      value={movie.vote_average / 2}
                      sx={{
                        color: "primary.light",
                        "& .MuiRating-icon": {
                          fontSize: { xs: "1.2rem", md: "1.5rem" },
                        },
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      color: "white",
                      mt: 0.5,
                      fontSize: { xs: "0.8rem", md: "0.9rem" },
                      opacity: 0.8,
                    }}
                  >
                    Global Rating
                  </Typography>
                </Box>

                <Box
                  onClick={() => setRatingDialogOpen(true)}
                  sx={{
                    cursor: "pointer",
                    position: "relative",
                    "&:hover": {
                      transform: "scale(1.05)",
                      "& .rating-label": {
                        opacity: 1,
                      },
                    },
                    transition: "transform 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <Box
                      sx={{
                        width: { xs: 56, md: 64 },
                        height: { xs: 56, md: 64 },
                      }}
                    >
                      <CircularProgress
                        size="100%"
                        thickness={4}
                        variant="determinate"
                        value={userRating ? (userRating / 2) * 20 : 0}
                        sx={{
                          color: userRating
                            ? "primary.light"
                            : "rgba(255,255,255,0.3)",
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        position: "absolute",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: { xs: "1.1rem", md: "1.3rem" },
                        }}
                      >
                        {userRating ? (userRating / 2).toFixed(1) : "0"}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    className="rating-label"
                    sx={{
                      color: "white",
                      mt: 1,
                      fontSize: { xs: "0.8rem", md: "0.9rem" },
                      opacity: 0.8,
                      transition: "opacity 0.2s",
                      textAlign: "center",
                      "&:hover": {
                        opacity: 1,
                      },
                    }}
                  >
                    {userRating ? (
                      <>
                        Your Rating
                        <br />
                        <span style={{ fontSize: "0.9em", opacity: 0.9 }}>
                          {getRatingLabel(userRating)}
                        </span>
                      </>
                    ) : (
                      <>
                        Click to Rate
                        <br />
                        <span style={{ fontSize: "0.9em", opacity: 0.9 }}>
                          Add your rating
                        </span>
                      </>
                    )}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl">
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            mb: 4,
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={5}>
              <Card
                elevation={8}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  style={{ width: "100%", display: "block" }}
                />
              </Card>
            </Grid>
            <Grid item xs={7}>
              <Typography
                sx={{
                  mb: 2,
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                }}
              >
                {movie.overview}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Grid
          container
          spacing={4}
          sx={{
            flexDirection: { xs: "column-reverse", md: "row" },
          }}
        >
          <Grid item xs={12} md={8}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Cast & Crew
            </Typography>
            <Grid container spacing={2} sx={{ mb: 6 }}>
              {movie.credits.cast.slice(0, 6).map((actor) => (
                <Grid item xs={6} sm={4} md={4} key={actor.id}>
                  <Card
                    sx={{
                      height: "100%",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: "0.875rem", md: "1rem" },
                        }}
                      >
                        {actor.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: "0.75rem", md: "0.875rem" },
                        }}
                      >
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

          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Movie Details
            </Typography>
            <Card
              sx={{
                borderRadius: 2,
                mb: 4,
                p: { xs: 1, md: 2 },
              }}
            >
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
            </Card>
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
      </Container>

      <RatingDialog
        open={ratingDialogOpen}
        movieTitle={movie.title}
        onRate={handleRating}
        onClose={() => setRatingDialogOpen(false)}
        currentRating={userRating ? userRating / 2 : null}
      />
    </>
  );
};

export default MovieDetail;
