import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Chip,
  Rating,
  Skeleton,
  CardMedia,
  Typography,
  CardContent,
} from "@mui/material";

import RatingDialog from "./RatingDialog";
import { Movie, Genre } from "../types/movie";
import { IMAGE_BASE_URL } from "../utils/constants";
import { rateMovie, deleteRating } from "../services/tmdbApi";

interface MovieCardProps {
  movie: Movie;
  genres: Genre[];
}

const MovieCard = ({ movie, genres }: MovieCardProps) => {
  const navigate = useNavigate();

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [ratingDialogOpen, setRatingDialogOpen] = useState<boolean>(false);

  const releaseYear = new Date(movie?.release_date).getFullYear() || "";

  const movieGenres = movie.genre_ids
    .map((id) => genres.find((g) => g.id === id))
    .filter((genre: Genre | undefined) => genre !== undefined)
    .slice(0, 3);

  const handleRating = async (rating: number | null) => {
    try {
      if (rating === null) {
        await deleteRating(movie.id);
      } else {
        await rateMovie(movie.id, rating);
      }
      setUserRating(rating);
    } catch (error) {
      console.error("Error updating rating:", error);
    }
    setRatingDialogOpen(false);
  };

  const handleRatingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRatingDialogOpen(true);
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          cursor: "pointer",
          flexDirection: "column",
          backgroundColor: "background.paper",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={() => navigate(`/movie/${movie.id}`)}
      >
        {!imageLoaded && (
          <Skeleton variant="rectangular" height={400} animation="wave" />
        )}
        <CardMedia
          height={400}
          component="img"
          alt={movie.title}
          onLoad={() => setImageLoaded(true)}
          image={`${IMAGE_BASE_URL}${movie.poster_path}`}
          sx={{
            display: imageLoaded ? "block" : "none",
          }}
        />
        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
            noWrap
            sx={{ 
              fontWeight: 600,
              fontSize: "1.1rem",
              mb: 1.5 
            }}
          >
            {movie.title} {releaseYear && `(${releaseYear})`}
          </Typography>
          <Box sx={{ mb: 2 }}>
            {movieGenres.map((genre) => (
              <Chip
                size="small"
                key={genre.id}
                label={genre.name}
                sx={{
                  mr: 0.5,
                  mb: 0.5,
                  backgroundColor: "primary.light",
                  color: "white",
                  fontSize: "0.75rem",
                }}
              />
            ))}
          </Box>
          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 1,
              mt: "auto" 
            }}
          >
            <Box 
              onClick={handleRatingClick} 
              sx={{ 
                p: 1,
                borderRadius: 1,
                transition: "background-color 0.2s",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                }
              }}
            >
              <Rating
                value={movie.vote_average / 2}
                precision={0.5}
                size="small"
                readOnly
              />
            </Box>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: "0.875rem" }}
            >
              {userRating ? "Your rating" : "Global rating"}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <RatingDialog
        onRate={handleRating}
        open={ratingDialogOpen}
        movieTitle={movie.title}
        currentRating={userRating}
        onClose={() => setRatingDialogOpen(false)}
      />
    </>
  );
};

export default MovieCard;
