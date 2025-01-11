import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Alert,
  Paper,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import {
  createSession,
  validateWithLogin,
  createRequestToken,
} from "../services/tmdbApi";
import { useAuth } from "../context/AuthContext";

const SignIn = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (auth?.isAuthenticated) {
      navigate("/");
    }
  }, [auth?.isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Get request token
      const tokenResponse = await createRequestToken();
      const requestToken = tokenResponse.data.request_token;

      // Validate with login
      await validateWithLogin(
        credentials.username,
        credentials.password,
        requestToken
      );

      // Create session
      const sessionResponse = await createSession(requestToken);
      const sessionId = sessionResponse.data.session_id;

      // Store session ID
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("username", credentials.username);

      auth?.setIsAuthenticated(true);
      navigate("/");
    } catch {
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        top: "50%",
        left: "50%",
        width: "100%",
        position: "absolute",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "90%",
          maxWidth: 500,
          borderRadius: 2,
          margin: "0 auto",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 4,
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
          Welcome to R-flix
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            required
            fullWidth
            autoFocus
            margin="normal"
            name="username"
            label="Username"
            autoComplete="username"
            value={credentials.username}
            placeholder="Enter your username"
            onChange={(e) =>
              setCredentials((prev) => ({
                ...prev,
                username: e.target.value,
              }))
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            name="password"
            label="Password"
            value={credentials.password}
            placeholder="Enter your password"
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            onChange={(e) =>
              setCredentials((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    disableRipple
                    sx={{
                      "&:focus": { outline: "none" },
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
          {error && (
            <Alert
              severity="error"
              sx={{
                mt: 2,
                mb: 2,
                width: "100%",
                borderRadius: 1,
              }}
            >
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
            variant="contained"
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1.1rem",
              fontWeight: "bold",
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignIn;
