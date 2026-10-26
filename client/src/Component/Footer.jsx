import React, { useState } from "react";
import { Button, TextField, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

import InstagramIcon from "@mui/icons-material/Instagram";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import SearchIcon from "@mui/icons-material/Search";

import "./style.css";

const Footer = ({ user }) => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchText.trim();
    if (!query) {
      return;
    }
    navigate(`/search/${encodeURIComponent(query)}`);
  };

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

    return "Movie lover";
  };

  return (
    <footer className="cine-footer">
      <div className="cine-footer-content">
        {/* Quick links and search */}
        <section className="cine-footer-navigation">
          <Typography className="cine-footer-heading">
            Explore
          </Typography>

          {user ? (
            <p className="cine-footer-welcome">
              Welcome back, {getDisplayName()}!
            </p>
          ) : (
            <Button
              className="cine-footer-link"
              onClick={() => navigate("/login")}
            >
              Sign in to CineGenie
            </Button>
          )}

          <Button
            className="cine-footer-link"
            onClick={() => navigate("/home")}
          >
            Home
          </Button>

          <Button
            className="cine-footer-link"
            onClick={() => navigate("/trending")}
          >
            Trending Movies
          </Button>

          <Button
            className="cine-footer-link"
            onClick={() => navigate("/upcoming")}
          >
            Upcoming Movies
          </Button>

          <form className="cine-footer-search" onSubmit={handleSearch}>
            <TextField
              className="cine-footer-search-input"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Find a movie..."
              variant="standard"
              fullWidth
              InputProps={{
                disableUnderline: true,
                inputProps: {
                  "aria-label": "Search for a movie",
                },
              }}
            />

            <button
              type="submit"
              className="cine-footer-search-button"
              aria-label="Search movies"
              disabled={!searchText.trim()}
            >
              <SearchIcon />
            </button>
          </form>
        </section>

        {/* Branding and social links */}
        <section className="cine-footer-brand-section">
          <button
            type="button"
            className="cine-footer-brand"
            onClick={() => navigate("/")}
            aria-label="Go to CineGenie landing page"
          >
            Cine<span>Genie</span>
          </button>

          <p className="cine-footer-description">
            Discover your next favorite movie.
          </p>

          <div className="cine-footer-socials" aria-label="Social links">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>

            <a
              href="mailto:siddhi.bobade05@gmail.com"
              aria-label="Email"
            >
              <MailOutlineIcon />
            </a>

            <a
              href="https://www.linkedin.com/in/siddhi-bobade/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>

            <a
              href="https://github.com/Siddhiii05"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <GitHubIcon />
            </a>
          </div>

          <Typography className="cine-footer-copyright">
            © {new Date().getFullYear()} CineGenie. All rights reserved.
          </Typography>
        </section>
      </div>
    </footer>
  );
};

export default Footer;