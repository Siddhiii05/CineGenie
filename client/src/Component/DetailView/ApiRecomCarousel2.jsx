import React, { useCallback, useEffect, useState } from "react";
import { Button, makeStyles } from "@material-ui/core";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import Axios from "axios";
import { img_300 } from "../../Config/Config";
import { useNavigate, useParams } from "react-router-dom";

const API_KEY = "b9e11d2c8939104a4a755544e4eb8847";

const handleDragStart = (event) => event.preventDefault();

const useStyles = makeStyles(() => ({
  carousel: {
    position: "relative",
    marginTop: "32px",
    width: "100%",
    minHeight: "280px",
    padding: "10px 0 24px",
    boxSizing: "border-box",
  },

  movieCard: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: "8px",
    borderRadius: "12px",
    background: "linear-gradient(145deg, #191919, #101010)",
    border: "1px solid rgba(212, 175, 55, 0.15)",
    transition: "transform 0.25s ease, border-color 0.25s ease",
    boxSizing: "border-box",

    "&:hover": {
      transform: "translateY(-5px)",
      borderColor: "#d4af37",
    },
  },

  poster: {
    display: "block",
    width: "100%",
    height: "250px",
    objectFit: "cover",
    borderRadius: "8px",
    backgroundColor: "#222",

    "@media (max-width: 600px)": {
      height: "210px",
    },
  },

  movieTitle: {
    color: "#f5f5f5",
    fontSize: "0.9rem",
    fontWeight: 600,
    textAlign: "left",
    marginTop: "10px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  releaseDate: {
    color: "#b5a16a",
    fontSize: "0.75rem",
    textAlign: "left",
    marginTop: "4px",
  },

  status: {
    color: "#d4af37",
    textAlign: "center",
    padding: "35px 12px",
    fontSize: "0.95rem",
  },

  arrowButton: {
    position: "absolute",
    top: "40%",
    zIndex: 2,
    color: "#d4af37",
    backgroundColor: "rgba(10, 10, 10, 0.85)",
    border: "1px solid rgba(212, 175, 55, 0.5)",
    minWidth: "42px",
    height: "42px",
    borderRadius: "50%",
    padding: 0,

    "&:hover": {
      backgroundColor: "#d4af37",
      color: "#111",
    },
  },

  prevButton: {
    left: "4px",
  },

  nextButton: {
    right: "4px",
  },
}));

const ApiRecomCarousel = () => {
  const classes = useStyles();
  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecommendations = useCallback(async () => {
    if (!id) {
      setContent([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await Axios.get(
        `https://api.themoviedb.org/3/movie/${id}/recommendations`,
        {
          params: {
            api_key: API_KEY,
            language: "en-US",
            page: 1,
          },
        }
      );

      setContent((data.results || []).filter((movie) => movie.poster_path));
    } catch (err) {
      console.error("Failed to fetch movie recommendations:", err);
      setError("Unable to load recommendations right now.");
      setContent([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const handleMovieClick = (movie) => {
    const movieTitle = encodeURIComponent(movie.title || "movie");
    navigate(`/detail/${movie.id}/${movieTitle}`);
  };

  const items = content.slice(0, 10).map((movie) => (
    <Button
      key={movie.id}
      onClick={() => handleMovieClick(movie)}
      aria-label={`View ${movie.title}`}
      style={{
        display: "block",
        width: "100%",
        minWidth: 0,
        padding: 0,
        textAlign: "left",
        textTransform: "none",
      }}
    >
      <div className={classes.movieCard}>
        <img
          className={classes.poster}
          src={`${img_300}${movie.poster_path}`}
          onDragStart={handleDragStart}
          role="presentation"
          alt={movie.title || "Movie poster"}
          loading="lazy"
        />

        <div className={classes.movieTitle} title={movie.title}>
          {movie.title || "Untitled Movie"}
        </div>

        {movie.release_date && (
          <div className={classes.releaseDate}>
            {movie.release_date.slice(0, 4)}
          </div>
        )}
      </div>
    </Button>
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
      <div className={classes.status} role="status">
        Loading recommendations...
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.status} role="alert">
        {error}
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className={classes.status}>
        No recommendations available for this movie.
      </div>
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
            aria-label="Previous recommendations"
          >
            <KeyboardDoubleArrowLeftIcon fontSize="large" />
          </Button>
        )}
        renderNextButton={() => (
          <Button
            className={`${classes.arrowButton} ${classes.nextButton}`}
            aria-label="Next recommendations"
          >
            <KeyboardDoubleArrowRightIcon fontSize="large" />
          </Button>
        )}
      />
    </div>
  );
};

export default ApiRecomCarousel;