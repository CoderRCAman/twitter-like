import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react";
import Login from "./pages/Login";
import UserProvider from "./state/UserProvider";
import Home from "./pages/Home";

import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Post from "./pages/Post";


export default function App() {
  const isAuthenticated = () => {
    
    const isLogged = localStorage.getItem("firstLogin");
    return isLogged ? true : false;
  };
  return (
    <Router>
      <UserProvider>
        <Routes>
        <Route
            path="/"
            element={isAuthenticated() ? <Home /> : <Navigate to="/login" />}
          />

          <Route
            path="/login"
            element={isAuthenticated() ?<Navigate to='/'/>  : <Login />}
          />
            <Route
            path="/register"
            element={isAuthenticated() ? <Navigate to='/'/> : <Register />}
          />
          <Route
            path="/profile"
            element={isAuthenticated() ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/post/:postId"
            element={
              isAuthenticated() ? <Post /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </UserProvider>
    </Router>
  );
}
