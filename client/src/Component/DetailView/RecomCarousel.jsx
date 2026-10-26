import React, { useCallback, useEffect, useState } from "react";
import { Button, makeStyles, Typography } from "@material-ui/core";
import "react-alice-carousel/lib/alice-carousel.css";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import AliceCarousel from "react-alice-carousel";
import Axios from "axios";
import { img_300 } from "../../Config/Config";
import { useNavigate, useParams } from "react-router-dom";

const handleDragStart = (event) => event.preventDefault();

const TMDB_API_KEY = "b9e11d2c8939104a4a755544e4eb8847";

const useStyles = makeStyles(() => ({
  carouselContainer: {
    position: "relative",
    width: "100%",
    marginTop: "24px",
    padding: "0 4%",
    boxSizing: "border-box",
  },

  movieCard: {
    display: "block",
    width: "100%",
    padding: "9px",
    boxSizing: "border-box",
    borderRadius: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    color: "#ffffff",
    textTransform: "none",
    textAlign: "left",
    transition: "transform 0.25s ease, border-color 0.25s ease",
    overflow: "hidden",

    "&:hover": {
      transform: "translateY(-4px)",
      borderColor: "rgba(212, 175, 55, 0.65)",
      backgroundColor: "rgba(255, 255, 255, 0.06)",
    },
  },

  posterContainer: {
    width: "100%",
    aspectRatio: "2 / 3",
    overflow: "hidden",
    borderRadius: "8px",
    backgroundColor: "#24212d",
  },

  poster: {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",

    "$movieCard:hover &": {
      transform: "scale(1.04)",
    },
  },

  posterFallback: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    boxSizing: "border-box",
    color: "#a9a3b3",
    fontSize: "12px",
    textAlign: "center",
  },

  movieTitle: {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 700,
    lineHeight: 1.5,
    marginTop: "11px",
    overflowWrap: "anywhere",
  },

  releaseYear: {
    color: "#d4af37",
    fontSize: "12px",
    marginTop: "4px",
  },

  message: {
    padding: "35px 20px",
    textAlign: "center",
    color: "#c9c4d1",
    fontSize: "14px",
  },

  retryButton: {
    marginTop: "12px",
    padding: "8px 16px",
    border: "1px solid #d4af37",
    borderRadius: "7px",
    color: "#d4af37",
    backgroundColor: "transparent",
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
    borderRadius: "50%",
    color: "#d4af37",
    backgroundColor: "rgba(20, 18, 27, 0.9)",
    border: "1px solid rgba(212, 175, 55, 0.45)",

    "&:hover": {
      backgroundColor: "rgba(212, 175, 55, 0.16)",
    },

    "@media (max-width: 600px)": {
      minWidth: "34px",
      width: "34px",
      height: "34px",
    },
  },

  prevButton: {
    left: "5px",
  },

  nextButton: {
    right: "5px",
  },
}));

const RecomCarousel = () => {
  const classes = useStyles();
  const { title } = useParams();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecommendations = useCallback(async () => {
    if (!title) {
      setMovies([]);
      setError("Movie title is missing from the route.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Get recommended movie IDs from your backend.
      const { data } = await Axios.get(
        `http://localhost:5000/recomm/${encodeURIComponent(title)}`
      );

      // Support the existing backend response format:
      // movie_name1, movie_name2, ..., movie_name5.
      const movieIds = [
        data.movie_name1,
        data.movie_name2,
        data.movie_name3,
        data.movie_name4,
        data.movie_name5,
      ].filter(Boolean);

      if (movieIds.length === 0) {
        setMovies([]);
        return;
      }

      // Fetch all recommended movie details concurrently.
      const movieResponses = await Promise.allSettled(
        movieIds.map((movieId) =>
          Axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
          )
        )
      );

      const fetchedMovies = movieResponses
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value.data)
        .filter((movie) => movie && movie.id);

      setMovies(fetchedMovies);

      if (fetchedMovies.length === 0) {
        setError("Unable to retrieve the recommended movie details.");
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Unable to load recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [title]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

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

  const items = movies.map((movie) => {
    const posterUrl = movie.poster_path
      ? `${img_300}${movie.poster_path}`
      : null;

    const movieTitle =
      movie.title || movie.original_title || "Untitled Movie";

    return (
      <div key={movie.id} style={{ padding: "8px" }}>
        <Button
          className={classes.movieCard}
          onClick={() =>
            navigate(
              `/recomm/detail/${movie.id}/${encodeURIComponent(movieTitle)}`
            )
          }
          aria-label={`View details for ${movieTitle}`}
          disableRipple
        >
          <div className={classes.posterContainer}>
            {posterUrl ? (
              <img
                className={classes.poster}
                src={posterUrl}
                alt={`${movieTitle} poster`}
                onDragStart={handleDragStart}
                onError={(event) => {
                  event.currentTarget.style.display = "none";

                  const fallback = event.currentTarget.nextSibling;

                  if (fallback) {
                    fallback.style.display = "flex";
                  }
                }}
              />
            ) : null}

            <div
              className={classes.posterFallback}
              style={{ display: posterUrl ? "none" : "flex" }}
            >
              Poster unavailable
            </div>
          </div>

          <Typography component="div" className={classes.movieTitle}>
            {movieTitle}
          </Typography>

          <Typography component="div" className={classes.releaseYear}>
            {movie.release_date
              ? movie.release_date.slice(0, 4)
              : "Release date unavailable"}
          </Typography>
        </Button>
      </div>
    );
  });

  if (loading) {
    return (
      <div className={classes.message} role="status">
        Loading personalized recommendations...
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.message} role="alert">
        <div>{error}</div>

        <Button
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
      <div className={classes.message}>
        No personalized recommendations are available.
      </div>
    );
  }

  return (
    <div className={classes.carouselContainer}>
      <AliceCarousel
        key={title}
        mouseTracking
        items={items}
        responsive={responsive}
        disableDotsControls
        controlsStrategy="responsive"
        autoPlay={items.length > 2}
        autoPlayInterval={5000}
        infinite={items.length > 2}
        animationDuration={600}
        renderPrevButton={() => (
          <Button
            className={`${classes.arrowButton} ${classes.prevButton}`}
            aria-label="Previous recommendations"
          >
            <KeyboardDoubleArrowLeftIcon />
          </Button>
        )}
        renderNextButton={() => (
          <Button
            className={`${classes.arrowButton} ${classes.nextButton}`}
            aria-label="Next recommendations"
          >
            <KeyboardDoubleArrowRightIcon />
          </Button>
        )}
      />
    </div>
  );
};

export default RecomCarousel;
