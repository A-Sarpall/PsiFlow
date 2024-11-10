// App.js
import React, { useState } from "react";
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
  const [authToken, setAuthToken] = useState(null);

  const handleLogin = (token) => {
    setAuthToken(token);
    setIsAuthenticated(true);
    // Optional: Store token in localStorage if you want it to persist
    localStorage.setItem("authToken", token);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setIsAuthenticated(false);
    // Clean up localStorage
    localStorage.removeItem("authToken");
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
                <Home onLogout={handleLogout} />
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
