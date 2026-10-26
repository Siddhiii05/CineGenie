import React, { useEffect, useState } from "react";
import { AppBar, Button, TextField, Toolbar } from "@material-ui/core";

import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";

import "./style.css";

export default function Header({ user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  // Change the header appearance when scrolling.
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Search for movies.
  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchText.trim();

    if (!query) {
      return;
    }

    navigate(`/search/${encodeURIComponent(query)}`);
    setSearchText("");
  };

  // Log out the current user.
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/logout", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      const data = await response.json();

      if (data.success) {
        onLogout(); // Clear the user from React state
        navigate("/", { replace: true }); // Redirect to landing page
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Get the user's display name safely.
  const getDisplayName = () => {
    if (typeof user?.displayName === "string" && user.displayName.trim()) {
      return user.displayName;
    }

    if (typeof user?.name === "string" && user.name.trim()) {
      return user.name;
    }

    if (user?.name?.givenName) {
      return user.name.givenName;
    }

    return "Account";
  };

  const displayName = getDisplayName();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      className={`cine-header ${scrolled ? "cine-header-scrolled" : ""}`}
    >
      <Toolbar className="cine-toolbar">
        {/* Brand */}
        <button
          type="button"
          className="cine-brand"
          onClick={() => navigate("/home")}
          aria-label="CineGenie home"
        >
          <span className="cine-brand-icon">C</span>

          <span className="cine-brand-text">
            Cine<span>Genie</span>
          </span>
        </button>

        {/* Navigation links */}
        <nav className="cine-navigation" aria-label="Main navigation">
          <Button
            className="cine-nav-link"
            onClick={() => navigate("/trending")}
          >
            Trending
          </Button>

          <Button
            className="cine-nav-link"
            onClick={() => navigate("/upcoming")}
          >
            Upcoming
          </Button>
        </nav>

        {/* Movie search */}
        <form className="cine-search" onSubmit={handleSearch}>
          <SearchIcon className="cine-search-icon" />

          <TextField
            className="cine-search-input"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search movies..."
            variant="standard"
            fullWidth
            InputProps={{
              disableUnderline: true,
              inputProps: {
                "aria-label": "Search movies",
              },
            }}
          />

          <button
            type="submit"
            className="cine-search-submit"
            aria-label="Submit movie search"
            disabled={!searchText.trim()}
          >
            <SearchIcon />
          </button>
        </form>

        {/* Account controls */}
        {/* Account controls */}
        <div className="cine-account">
          {user ? (
            <>
              <Tooltip title={displayName} arrow>
                <button
                  type="button"
                  className="cine-account-button"
                  aria-label={`Signed in as ${displayName}`}
                >
                  <AccountCircleIcon />
                  <span className="cine-account-name">{displayName}</span>
                </button>
              </Tooltip>

              <Button
                className="cine-login-button cine-logout-button"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              className="cine-login-button"
              onClick={() => navigate("/login")}
              startIcon={<AccountCircleIcon />}
            >
              Login
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
