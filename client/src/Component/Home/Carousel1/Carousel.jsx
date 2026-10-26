import React, { useEffect, useState } from "react";
import { Button, CircularProgress, makeStyles, Typography } from "@material-ui/core";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

import { img_300 } from "../../../Config/Config";


const useStyles = makeStyles(() => ({
  carousel: {
    width: "100%",
    minWidth: 0,
    padding: "0.75rem 0",
    boxSizing: "border-box",
  },

 movieCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "230px",
    minWidth: 0,
    margin: "0 auto",
    padding: "0.5rem",
    borderRadius: "12px",
    color: "#f5f5f5",
    textTransform: "none",
    transition: "transform 0.25s ease, background-color 0.25s ease",

    "&:hover": {
      backgroundColor: "rgba(117, 68, 125, 0.14)",
      transform: "translateY(-6px)",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
    },

    "&:focus-visible": {
      outline: "2px solid #d4af37",
      outlineOffset: "3px",
    },
  },

  poster: {
    display: "block",
    width: "100%",
    aspectRatio: "2 / 3",
    objectFit: "cover",
    borderRadius: "10px",
    backgroundColor: "#222936",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.3)",
  },
  message: {
    padding: "2rem 1rem",
    color: "#c5bdcf",
    textAlign: "center",
  },

  "@media (prefers-reduced-motion: reduce)": {
    movieButton: {
      transition: "none",
      "&:hover": {
        transform: "none",
      },
    },

    poster: {
      transition: "none",
    },
  },
}));


const responsive = {
  0: {
    items: 2,
  },
  512: {
    items: 3,
  },
  900: {
    items: 4,
  },
};

const Carousel = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchTrending = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await Axios.get(
          "https://api.themoviedb.org/3/movie/top_rated",
          {
            params: {
              api_key: "b9e11d2c8939104a4a755544e4eb8847",
              language: "en-US",
              page: 1,
            },
          }
        );

        if (isMounted) {
          setContent(response.data.results || []);
        }
      } catch (err) {
        console.error("Failed to fetch top-rated movies:", err);

        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTrending();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDragStart = (event) => {
    event.preventDefault();
  };

  const handleMovieClick = (movie) => {
    navigate(
      `/detail/${movie.id}/${encodeURIComponent(movie.title || "movie")}`
    );
  };

  const items = content
    .filter((movie) => movie.poster_path)
    .slice(0, 10)
    .map((movie) => (
      <Button
        key={movie.id}
        className={classes.movieCard}
        onClick={() => handleMovieClick(movie)}
        aria-label={`View details for ${movie.title}`}
      >
        <img
          className={classes.poster}
          src={`${img_300}${movie.poster_path}`}
          alt={`${movie.title} movie poster`}
          onDragStart={handleDragStart}
          loading="lazy"
        />
      </Button>
    ));

  if (loading) {
    return (
      <div className={classes.message}>
        <CircularProgress style={{ color: "#d4af37" }} size={32} />
        <Typography style={{ marginTop: "1rem" }}>
          Loading movies...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <Typography className={classes.message}>
        Unable to load movies right now. Please try again later.
      </Typography>
    );
  }

  if (items.length === 0) {
    return (
      <Typography className={classes.message}>
        No movie posters are available right now.
      </Typography>
    );
  }

  return (
    <div className={classes.carousel}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlay
        autoPlayInterval={3000}
        animationDuration={700}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        items={items}
        keyboardNavigation
      />
    </div>
  );
};

export default Carousel;
