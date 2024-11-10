import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import Success from "./Success"; // Import the Success component

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null); // Track token if needed

  useEffect(() => {
    // Check localStorage for an existing authToken on component mount
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setAuthToken(storedToken); // If a token is found, set it in state
      setIsAuthenticated(true); // Mark user as authenticated
    }
  }, []); // Run only once on component mount

  const handleLogin = (token) => {
    setAuthToken(token); // Store token in state
    setIsAuthenticated(true); // Mark user as authenticated
    localStorage.setItem("authToken", token); // Store token in localStorage for persistence
  };

  const handleLogout = () => {
    setAuthToken(null); // Clear the token from state
    setIsAuthenticated(false); // Mark user as logged out
    localStorage.removeItem("authToken"); // Remove token from localStorage
  };

  return (
    <Router>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">PsiFlow</h1>
        <Routes>
          <Route
            path="/register"
            element={
              !isAuthenticated ? <Register /> : <Navigate to="/home" replace />
            }
          />
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/home" replace />
              )
            }
          />
          <Route
            path="/home"
            element={
              isAuthenticated ? (
                <Home onLogout={handleLogout} authToken={authToken} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/success"
            element={<Success />} // Add this route for the success page
          />
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/home" : "/login"} replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
