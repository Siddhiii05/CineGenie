import React, { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import "react-alice-carousel/lib/alice-carousel.css";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import AliceCarousel from "react-alice-carousel";
import Axios from "axios";
import { img_300 } from "../../../Config/Config";
import { useNavigate } from "react-router-dom";

const handleDragStart = (event) => event.preventDefault();

const useStyles = makeStyles((theme) => ({
  carousel: {
    width: "100%",
    minWidth: 0,
    position: "relative",
    padding: "0.5rem 0 1rem",
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

  movieTitle: {
    width: "100%",
    marginTop: "0.8rem",
    overflow: "hidden",
    color: "#eeeeee",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.85rem",
    fontWeight: 600,
    lineHeight: 1.5,
    textAlign: "left",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  status: {
    width: "100%",
    minHeight: "180px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.8rem",
    color: "#bdbdbd",
    textAlign: "center",
  },

  spinner: {
    color: "#d4af37",
  },

  error: {
    color: "#e0a0a0",
    fontSize: "0.9rem",
  },

  retryButton: {
    color: "#d4af37",
    borderColor: "#d4af37",
    textTransform: "none",

    "&:hover": {
      backgroundColor: "rgba(212, 175, 55, 0.1)",
    },
  },

  arrowButton: {
    position: "absolute",
    top: "40%",
    zIndex: 2,
    minWidth: "42px",
    width: "42px",
    height: "42px",
    padding: 0,
    border: "1px solid #424242",
    borderRadius: "50%",
    backgroundColor: "rgba(17, 17, 17, 0.9)",
    color: "#d4af37",
    transform: "translateY(-50%)",
    transition: "background-color 0.2s ease, border-color 0.2s ease",

    "&:hover": {
      borderColor: "#d4af37",
      backgroundColor: "#252525",
    },

    "&:focus-visible": {
      outline: "2px solid #d4af37",
      outlineOffset: "3px",
    },

    [theme.breakpoints.down("xs")]: {
      minWidth: "34px",
      width: "34px",
      height: "34px",
    },
  },

  previousArrow: {
    left: 0,
  },

  nextArrow: {
    right: 0,
  },

  "@media (prefers-reduced-motion: reduce)": {
    movieCard: {
      transition: "none",
      "&:hover": {
        transform: "none",
      },
    },
    arrowButton: {
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

const Carousel5 = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(false);

    try {
      const { data } = await Axios.get(
        "https://api.themoviedb.org/3/movie/76338/recommendations",
        {
          params: {
            api_key: "b9e11d2c8939104a4a755544e4eb8847",
            language: "en-US",
            page: 1,
          },
        }
      );

      setContent(Array.isArray(data.results) ? data.results : []);
    } catch (err) {
      console.error("Failed to fetch Science Fiction recommendations:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleMovieClick = (movie) => {
    navigate(
      `/detail/${movie.id}/${encodeURIComponent(movie.title || "movie")}`
    );
  };

  const items = content
    .filter((movie) => movie.poster_path)
    .map((movie) => (
      <Button
        key={movie.id}
        type="button"
        className={classes.movieCard}
        onClick={() => handleMovieClick(movie)}
        aria-label={`View details for ${movie.title || "movie"}`}
      >
        <img
          className={classes.poster}
          src={`${img_300}${movie.poster_path}`}
          onDragStart={handleDragStart}
          alt={`${movie.title || "Movie"} poster`}
          loading="lazy"
        />

        <Typography component="p" className={classes.movieTitle}>
          {movie.title || "Untitled movie"}
        </Typography>
      </Button>
    ));

  if (loading) {
    return (
      <div className={classes.status} role="status">
        <CircularProgress className={classes.spinner} />
        <Typography>Loading recommendations...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.status} role="alert">
        <Typography className={classes.error}>
          Couldn't load movie recommendations.
        </Typography>
        <Button
          variant="outlined"
          className={classes.retryButton}
          onClick={fetchRecommendations}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={classes.status}>
        <Typography>
          No movie recommendations are available right now.
        </Typography>
      </div>
    );
  }

  return (
    <div className={classes.carousel}>
      <AliceCarousel
        mouseTracking
        disableDotsControls
        items={items}
        responsive={responsive}
        controlsStrategy="responsive"
        autoPlay
        autoPlayInterval={5000}
        animationDuration={650}
        infinite={items.length > 1}
        keyboardNavigation
        renderPrevButton={() => (
          <Button
            type="button"
            className={`${classes.arrowButton} ${classes.previousArrow}`}
            aria-label="Previous movies"
          >
            <KeyboardDoubleArrowLeftIcon />
          </Button>
        )}
        renderNextButton={() => (
          <Button
            type="button"
            className={`${classes.arrowButton} ${classes.nextArrow}`}
            aria-label="Next movies"
          >
            <KeyboardDoubleArrowRightIcon />
          </Button>
        )}
      />
    </div>
  );
};

export default Carousel5;
