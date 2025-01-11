import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import debounce from "lodash/debounce";
import { Movie } from "../types/movie";
import { getMovieSuggestions } from "../services/tmdbApi";

const SearchBar = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Movie[]>([]);

  const fetchSuggestions = debounce(async (input) => {
    if (!input) return;
    setLoading(true);
    try {
      const response = await getMovieSuggestions(input);
      setSuggestions(response.data.results);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    if (query) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  return (
    <Autocomplete
      freeSolo
      options={suggestions}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.title
      }
      loading={loading}
      onInputChange={(_, newValue) => setQuery(newValue)}
      onChange={(_, newValue) => {
        if (newValue && typeof newValue !== "string") {
          navigate(`/movie/${newValue.id}`);
        }
      }}
      sx={{
        width: "100%",
        maxWidth: 600,
        "& .MuiInputBase-root": {
          height: "45px",
          borderRadius: "25px",
          backdropFilter: "blur(8px)",
          transition: "all 0.3s ease",
          backgroundColor: theme.palette.searchBar.background,
          "&:hover, &.Mui-focused": {
            backgroundColor: theme.palette.searchBar.hoverBackground,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search movies..."
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start" sx={{ ml: 1 }}>
                <SearchIcon
                  sx={{
                    color: theme.palette.searchBar.placeholder,
                    fontSize: "1.3rem",
                  }}
                />
              </InputAdornment>
            ),
            sx: {
              color: theme.palette.searchBar.text,
              fontSize: "0.95rem",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& ::placeholder": {
                opacity: 1,
                fontSize: "0.95rem",
                color: theme.palette.searchBar.placeholder,
              },
              "& .MuiAutocomplete-endAdornment": {
                mr: 1,
              },
            },
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          sx={{
            gap: 2,
            display: "flex",
            fontSize: "0.95rem",
            padding: "12px 16px",
            alignItems: "center",
            transition: "all 0.2s ease",
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
            "&:last-child": {
              borderBottom: "none",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            <Typography sx={{ fontWeight: 500 }}>{option.title}</Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.8rem",
              }}
            >
              {new Date(option.release_date).getFullYear()}
            </Typography>
          </Box>
        </Box>
      )}
      PaperComponent={({ children, ...props }) => (
        <Paper
          {...props}
          elevation={6}
          sx={{
            mt: 1,
            borderRadius: "12px",
            backgroundColor: theme.palette.searchBar.dropdownBackground,
            backdropFilter: "blur(8px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          }}
        >
          {children}
        </Paper>
      )}
    />
  );
};

export default SearchBar;
