import React, { useCallback, useEffect, useState } from "react";
import { Button, makeStyles, Typography } from "@material-ui/core";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { img_300 } from "../../Config/Config";

const API_KEY = "b9e11d2c8939104a4a755544e4eb8847";

const handleDragStart = (event) => event.preventDefault();

const useStyles = makeStyles(() => ({
  carousel: {
    position: "relative",
    marginTop: "24px",
    width: "100%",
    minHeight: "280px",
    padding: "10px 0 24px",
    boxSizing: "border-box",

    "& .alice-carousel__stage-item": {
      padding: "0 8px",
      verticalAlign: "top",
    },
  },

  movieCard: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    padding: "9px",
    borderRadius: "12px",
    background: "linear-gradient(145deg, #1b1b1b, #101010)",
    border: "1px solid rgba(212, 175, 55, 0.15)",
    transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
    boxSizing: "border-box",

    "&:hover": {
      transform: "translateY(-6px)",
      borderColor: "#d4af37",
      boxShadow: "0 10px 24px rgba(212, 175, 55, 0.12)",
    },
  },

  posterWrapper: {
    width: "100%",
    height: "250px",
    overflow: "hidden",
    borderRadius: "8px",
    backgroundColor: "#222",

    "@media (max-width: 600px)": {
      height: "210px",
    },
  },

  poster: {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease",

    "$movieCard:hover &": {
      transform: "scale(1.05)",
    },
  },

  movieTitle: {
    color: "#f5f5f5",
    fontSize: "0.9rem",
    fontWeight: 600,
    textAlign: "left",
    marginTop: "12px",
    lineHeight: 1.5,
    minHeight: "42px",
    overflowWrap: "anywhere",
  },

  releaseDate: {
    color: "#d4af37",
    fontSize: "0.75rem",
    textAlign: "left",
    marginTop: "5px",
  },

  status: {
    color: "#c7c7c7",
    textAlign: "center",
    padding: "35px 12px",
    fontSize: "0.95rem",
  },

  arrowButton: {
    position: "absolute",
    top: "40%",
    zIndex: 2,
    color: "#d4af37",
    backgroundColor: "rgba(10, 10, 10, 0.9)",
    border: "1px solid rgba(212, 175, 55, 0.5)",
    minWidth: "42px",
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    padding: 0,
    transition: "all 0.25s ease",

    "&:hover": {
      backgroundColor: "#d4af37",
      color: "#111",
    },

    "@media (max-width: 480px)": {
      minWidth: "34px",
      width: "34px",
      height: "34px",
    },
  },

  prevButton: {
    left: "4px",
  },

  nextButton: {
    right: "4px",
  },
}));

const Carousel2 = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();

  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPersonMovies = useCallback(async () => {
    if (!id) {
      setContent([]);
      setLoading(false);
      setError("Cast member ID is missing.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await Axios.get(
        `https://api.themoviedb.org/3/person/${id}/movie_credits`,
        {
          params: {
            api_key: API_KEY,
            language: "en-US",
          },
        }
      );

      const movies = (data.cast || [])
        .filter((movie) => movie.poster_path)
        .sort((a, b) => {
          const dateA = a.release_date || "";
          const dateB = b.release_date || "";
          return dateB.localeCompare(dateA);
        });

      setContent(movies);
    } catch (err) {
      console.error("Failed to fetch cast member's movies:", err);
      setError("Unable to load this person's movies right now.");
      setContent([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPersonMovies();
  }, [fetchPersonMovies]);

  const handleMovieClick = (movie) => {
    const title = encodeURIComponent(
      movie.title || movie.original_title || "movie"
    );

    navigate(`/detail/${movie.id}/${title}`);
  };

  const items = content.map((movie) => (
    <div key={movie.id} style={{ padding: "4px" }}>
      <Button
        onClick={() => handleMovieClick(movie)}
        aria-label={`View ${movie.title || movie.original_title}`}
        style={{
          display: "block",
          width: "100%",
          minWidth: 0,
          padding: "4px",
          textAlign: "left",
          textTransform: "none",
          borderRadius: "12px",
        }}
      >
        <div className={classes.movieCard}>
          <div className={classes.posterWrapper}>
            <img
              className={classes.poster}
              src={`${img_300}${movie.poster_path}`}
              onDragStart={handleDragStart}
              alt={`${movie.title || movie.original_title} poster`}
              loading="lazy"
            />
          </div>

          <Typography className={classes.movieTitle}>
            {movie.title || movie.original_title || "Untitled Movie"}
          </Typography>

          <Typography className={classes.releaseDate}>
            {movie.release_date
              ? movie.release_date.slice(0, 4)
              : "Release date unavailable"}
          </Typography>
        </div>
      </Button>
    </div>
  ));

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 3,
    },
    768: {
      items: 4,
    },
    1024: {
      items: 5,
    },
    1280: {
      items: 6,
    },
  };

  if (loading) {
    return (
      <Typography className={classes.status} role="status">
        Loading movies...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography className={classes.status} role="alert">
        {error}
      </Typography>
    );
  }

  if (content.length === 0) {
    return (
      <Typography className={classes.status}>
        No movies found for this cast member.
      </Typography>
    );
  }

  return (
    <div className={classes.carousel}>
      <AliceCarousel
        key={id}
        mouseTracking
        disableDotsControls
        items={items}
        responsive={responsive}
        controlsStrategy="responsive"
        autoPlay={content.length > 2}
        autoPlayInterval={5000}
        infinite={content.length > 2}
        renderPrevButton={() => (
          <Button
            className={`${classes.arrowButton} ${classes.prevButton}`}
            aria-label="Previous movies"
          >
            <KeyboardDoubleArrowLeftIcon fontSize="large" />
          </Button>
        )}
        renderNextButton={() => (
          <Button
            className={`${classes.arrowButton} ${classes.nextButton}`}
            aria-label="Next movies"
          >
            <KeyboardDoubleArrowRightIcon fontSize="large" />
          </Button>
        )}
      />
    </div>
  );
};

export default Carousel2;
