import React from "react";
import { Button, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

const TopBanner = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate("/home");
  };

  return (
    <section className="landing-hero">
      <div className="landing-hero-content">
        <Typography component="p" className="landing-eyebrow">
          YOUR NEXT FAVORITE MOVIE AWAITS
        </Typography>

        <Typography component="h1" className="landing-title">
          Welcome to <span>CineGenie</span>
        </Typography>

        <Typography component="p" className="landing-description">
          Discover movies you'll love. Explore trending titles, find hidden
          gems, and get personalized recommendations powered by machine learning.
        </Typography>

        <Button
          variant="contained"
          disableElevation
          className="landing-cta"
          onClick={handleExplore}
        >
          Explore Movies
          <span aria-hidden="true"> →</span>
        </Button>

        <p className="landing-caption">
          Find your next obsession, one movie at a time.
        </p>
      </div>

      <div className="landing-hero-visual">
        <div className="landing-image-glow" aria-hidden="true" />

        <img
          className="landing-hero-image"
          src="https://raw.githubusercontent.com/AnuragRoshan/images/75dea825db1a34bc094d4abcd32f0640762eab89/undraw_before_dawn_re_hp4m.svg"
          alt="Illustration representing a cinematic discovery experience"
          loading="eager"
        />

        <div className="landing-floating-card">
          <span className="landing-card-icon" aria-hidden="true">
            ✦
          </span>

          <div>
            <p className="landing-card-title">Your next watch</p>
            <p className="landing-card-subtitle">
              Just waiting to be discovered
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopBanner;
