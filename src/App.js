import React, { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Home from "./Home"; // Home is where your payment form exists
import Success from "./Success";
import Input from "./Input";
import Dashboard from "./Dashboard";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setAuthToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    setAuthToken(token);
    setIsAuthenticated(true);
    localStorage.setItem("authToken", token);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
  };

  return (
    <Router>
      <div className="App">
        <img
          src="/psi.png"
          alt="PsiFlow Logo"
          style={{ width: "200px", height: "200px" }}
          className="mx-auto mb-6"
        />

        {/* Navigation bar with buttons */}
        <div className="flex justify-center space-x-4">
          <Link to="/input">
            <button className="btn">Input</button>
          </Link>
          <Link to="/dashboard">
            <button className="btn">Dashboard</button>
          </Link>
          <Link to="/home">
            <button className="btn">Payment</button>
          </Link>
        </div>

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
          <Route path="/success" element={<Success />} />
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/home" : "/login"} replace />
            }
          />
          <Route
            path="/input"
            element={
              isAuthenticated ? <Input /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
