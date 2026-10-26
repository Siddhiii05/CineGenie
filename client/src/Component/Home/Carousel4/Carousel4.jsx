import React, { useCallback, useEffect, useState } from "react";
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
    position: "relative",
    width: "100%",
    minWidth: 0,
    padding: "0 0 1rem",
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
    marginTop: "0.75rem",
    color: "#f5f5f5",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.85rem",
    fontWeight: 600,
    lineHeight: 1.5,
    textAlign: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  status: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "220px",
    gap: "1rem",
    color: "#bdbdbd",
    textAlign: "center",
  },

  spinner: {
    color: "#d4af37",
  },

  errorText: {
    color: "#f5b7b1",
  },

  retryButton: {
    color: "#d4af37",
    borderColor: "#d4af37",
    textTransform: "none",

    "&:hover": {
      borderColor: "#f0d778",
      backgroundColor: "rgba(212, 175, 55, 0.08)",
    },
  },

  arrow: {
    position: "absolute",
    top: "40%",
    zIndex: 2,
    width: "42px",
    height: "42px",
    minWidth: "42px",
    padding: 0,
    borderRadius: "50%",
    color: "#d4af37",
    backgroundColor: "rgba(17, 17, 17, 0.9)",
    border: "1px solid rgba(212, 175, 55, 0.6)",
    transform: "translateY(-50%)",

    "&:hover": {
      backgroundColor: "#d4af37",
      color: "#111",
    },

    [theme.breakpoints.down("xs")]: {
      width: "34px",
      height: "34px",
      minWidth: "34px",
    },
  },

  prevArrow: {
    left: 0,
  },

  nextArrow: {
    right: 0,
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

const Carousel4 = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const { data } = await Axios.get(
        "https://api.themoviedb.org/3/movie/954/recommendations",
        {
          params: {
            api_key: "b9e11d2c8939104a4a755544e4eb8847",
            language: "en-US",
            page: 1,
          },
        }
      );

      setContent(data.results || []);
    } catch (err) {
      console.error("Failed to fetch action movie recommendations:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const movies = content.filter((movie) => movie.poster_path);

  const items = movies.map((movie) => (
    <Button
      key={movie.id}
      className={classes.movieCard}
      onClick={() =>
        navigate(
          `/detail/${movie.id}/${encodeURIComponent(movie.title || "movie")}`
        )
      }
      aria-label={`View details for ${movie.title}`}
    >
      <img
        className={classes.poster}
        src={`${img_300}/${movie.poster_path}`}
        onDragStart={handleDragStart}
        draggable={false}
        alt={`${movie.title} poster`}
        loading="lazy"
      />

      <Typography component="div" className={classes.movieTitle}>
        {movie.title}
      </Typography>
    </Button>
  ));

  if (loading) {
    return (
      <div className={classes.status}>
        <CircularProgress className={classes.spinner} />
        <Typography>Loading action movies...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.status}>
        <Typography className={classes.errorText}>
          Couldn't load action movie recommendations.
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

  if (movies.length === 0) {
    return (
      <div className={classes.status}>
        <Typography>No action movie recommendations found.</Typography>
      </div>
    );
  }

  return (
    <div className={classes.carousel}>
      <AliceCarousel
        key={movies.length}
        mouseTracking
        keyboardNavigation
        disableDotsControls
        items={items}
        responsive={responsive}
        controlsStrategy="responsive"
        autoPlay={movies.length > 2}
        autoPlayInterval={5000}
        animationDuration={650}
        infinite={movies.length > 2}
        renderPrevButton={({ onClick }) => (
          <Button
            className={`${classes.arrow} ${classes.prevArrow}`}
            onClick={onClick}
            aria-label="Previous movies"
          >
            <KeyboardDoubleArrowLeftIcon />
          </Button>
        )}
        renderNextButton={({ onClick }) => (
          <Button
            className={`${classes.arrow} ${classes.nextArrow}`}
            onClick={onClick}
            aria-label="Next movies"
          >
            <KeyboardDoubleArrowRightIcon />
          </Button>
        )}
      />
    </div>
  );
};

export default Carousel4;
