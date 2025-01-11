import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Genre } from "../types/movie";

interface GenreFilterProps {
  genres: Genre[];
  selectedGenre: string;
  onGenreChange: (genreId: string) => void;
}

const GenreFilter = ({
  genres,
  selectedGenre,
  onGenreChange,
}: GenreFilterProps) => {
  return (
    <FormControl sx={{ minWidth: 200, mb: 3, height: 60 }}>
      <InputLabel>Filter by Genre</InputLabel>
      <Select
        value={selectedGenre}
        label="Filter by Genre"
        onChange={(e) => onGenreChange(e.target.value)}
      >
        <MenuItem value="">All Genres</MenuItem>
        {genres.map((genre) => (
          <MenuItem key={genre.id} value={genre.id}>
            {genre.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GenreFilter;
