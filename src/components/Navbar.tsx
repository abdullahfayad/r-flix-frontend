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
  Container,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchBar from "./SearchBar";
import { useAuth } from "../context/AuthContext";
import StarIcon from "@mui/icons-material/Star";
import LogoutIcon from "@mui/icons-material/Logout";

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
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
          <Typography
            variant="h6"
            sx={{
              cursor: "pointer",
              fontWeight: 700,
              color: "primary.main",
              fontSize: "1.5rem",
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
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  color: "text.primary",
                  ml: 2,
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{
                  "& .MuiPaper-root": {
                    borderRadius: 2,
                    minWidth: 180,
                    boxShadow:
                      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/ratings");
                    handleMenuClose();
                  }}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon>
                    <StarIcon sx={{ color: "primary.main" }} />
                  </ListItemIcon>
                  <ListItemText primary="My Ratings" />
                </MenuItem>
                <MenuItem onClick={handleSignOut} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <LogoutIcon sx={{ color: "primary.main" }} />
                  </ListItemIcon>
                  <ListItemText primary="Sign Out" />
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => navigate("/ratings")}
                sx={{
                  mr: 2,
                  color: "text.primary",
                  fontWeight: 600,
                }}
              >
                My Ratings
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={handleSignOut}
                sx={{
                  fontWeight: 600,
                }}
              >
                Sign Out
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
