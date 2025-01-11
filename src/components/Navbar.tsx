import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Menu,
  Button,
  AppBar,
  Toolbar,
  MenuItem,
  useTheme,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchBar from "./SearchBar";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const auth = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem("sessionId");
    localStorage.removeItem("username");
    auth?.setIsAuthenticated(false);
    navigate("/signin");
    handleMenuClose();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            cursor: "pointer",
            flexGrow: 0,
            mr: 4,
          }}
          onClick={() => navigate("/")}
        >
          R-flix
        </Typography>
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <SearchBar />
        </Box>

        {isMobile ? (
          <>
            <IconButton color="inherit" edge="end" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleNavigate("/ratings")}>
                My Ratings
              </MenuItem>
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button
              color="inherit"
              onClick={() => navigate("/ratings")}
              sx={{ mr: 2 }}
            >
              My Ratings
            </Button>
            <Button color="inherit" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
