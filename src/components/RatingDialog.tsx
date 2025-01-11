import {
  Box,
  Rating,
  Dialog,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useState } from "react";

interface RatingDialogProps {
  open: boolean;
  movieTitle: string;
  onClose: () => void;
  currentRating: number | null;
  onRate: (rating: number | null) => void;
}

const ratingLabels: { [key: number]: string } = {
  1: "Awful!",
  2: "Meh",
  3: "Nice",
  4: "Great",
  5: "Epic!",
};

const RatingDialog = ({
  open,
  movieTitle,
  currentRating,
  onClose,
  onRate,
}: RatingDialogProps) => {
  const [tempRating, setTempRating] = useState<number | null>(currentRating);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Rate "{movieTitle}"</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            py: 2,
            gap: 2,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Rating
            max={5}
            size="large"
            value={tempRating}
            onChange={(_, value) => setTempRating(value)}
          />
          <Typography variant="body1">
            {tempRating ? ratingLabels[tempRating] : "Select a rating"}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            {currentRating && (
              <Button
                color="error"
                variant="outlined"
                onClick={() => onRate(null)}
              >
                Remove Rating
              </Button>
            )}
            <Button
              variant="contained"
              onClick={() => onRate(tempRating)}
              disabled={tempRating === currentRating}
            >
              Save Rating
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;
