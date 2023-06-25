import React, { useContext } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, RouterProvider } from "react-router-dom";

import Root from "./routes/root";
import About from "./routes/about";
import Search from "./routes/search";
import Detail from "./routes/detail";
import Register from "./routes/register";
import Login from "./routes/login";
import Profile from "./routes/profile";
import SelfProfile from "./routes/self-profile";
import Nav from "./nav";

import { AuthProvider, AuthContext } from "./auth";

const App = () => {
  return (
    <AuthProvider>
      <Nav />
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/details/:pid" element={<Detail />} />
        <Route path="/profile" element={<SelfProfile />} />
        <Route path="/profile/:uid" element={<Profile />} />
      </Routes>
    </AuthProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
