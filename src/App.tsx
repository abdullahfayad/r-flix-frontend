import { ReactNode, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import { theme } from "./theme";
import Ratings from "./pages/Ratings";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import MovieDetail from "./pages/MovieDetail";
import SearchResults from "./pages/SearchResults";
import { AuthProvider, useAuth } from "./context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Wait for auth to be initialized
      if (auth?.isAuthenticated !== undefined) {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [auth?.isAuthenticated]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return auth?.isAuthenticated ? children : <Navigate to="/signin" />;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

const AppContent = () => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (auth?.isAuthenticated !== undefined) {
      setIsLoading(false);
    }
  }, [auth?.isAuthenticated]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <HashRouter>
      <Box sx={{ minHeight: "100vh" }}>
        {auth?.isAuthenticated && <Navbar />}
        <Routes>
          <Route
            path="/signin"
            element={
              auth?.isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <SignIn />
              )
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <ProtectedRoute>
                <MovieDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ratings"
            element={
              <ProtectedRoute>
                <Ratings />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
    </HashRouter>
  );
};

export default App;
