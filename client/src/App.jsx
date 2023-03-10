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

export default function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}
