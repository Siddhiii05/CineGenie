import React, { createContext, useCallback, useEffect, useState } from "react";
import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import CastDetail from "./Pages/CastDetail";
import Detailview from "./Pages/Detailview";
import TrendingToday from "./Pages/TrendingToday";
import Upcoming from "./Pages/Upcoming";
import NotFound from "./Pages/NotFound";
import SearchPages from "./Pages/SearchPages";
import RecomDetailView from "./Pages/RecomDetailView";
import Filter from "./Pages/Filter";
import Landing from "./Pages/Landing";
import Header from "./Component/Header";
import Footer from "./Component/Footer";

export const userContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [showNav, setShowNav] = useState(true);

  const getUser = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/auth/login/success",
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();

      setUser(data.success ? data.user : null);
    } catch (error) {
      console.error("Authentication check failed:", error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <BrowserRouter>
      <div className="app">
        {showNav && <Header user={user} onLogout={() => setUser(null)} />}

        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={<Landing funcNav={setShowNav} />}
            />

            <Route path="/home" element={<Home />} />

            <Route
              path="/detail/:id/:title"
              element={<Detailview />}
            />

            <Route path="/trending" element={<TrendingToday />} />

            <Route
              path="/login"
              element={user ? <Navigate to="/" replace /> : <Login />}
            />

            <Route path="/casts/:id" element={<CastDetail />} />

            <Route path="/upcoming" element={<Upcoming />} />

            <Route path="/search/:id" element={<SearchPages />} />

            <Route
              path="/recomm/detail/:id/:title"
              element={<RecomDetailView />}
            />

            <Route
              path="/filter/:id/:title"
              element={<Filter />}
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer user={user} />
      </div>
    </BrowserRouter>
  );
}

export default App;