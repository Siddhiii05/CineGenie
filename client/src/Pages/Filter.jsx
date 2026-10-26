import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Typography,
  makeStyles,
} from "@material-ui/core";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import { img_300 } from "../Config/Config";

const API_KEY = "b9e11d2c8939104a4a755544e4eb8847";

const useStyles = makeStyles(() => ({
  container: {
    marginTop: "90px",
    paddingBottom: "50px",
    minHeight: "100vh",
    color: "#f5f5f5",
  },

  heading: {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 700,
    color: "#f5f5f5",
    padding: "32px 0",
    borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
    marginBottom: "28px",
    overflowWrap: "anywhere",

    "& span": {
      color: "#d4af37",
    },
  },

  movieGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: "24px",
    alignItems: "stretch",

    "@media (max-width: 1100px)": {
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      gap: "20px",
    },

    "@media (max-width: 850px)": {
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "16px",
    },

    "@media (max-width: 550px)": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "12px",
    },
  },

  movieButton: {
    display: "block",
    width: "100%",
    minWidth: 0,
    padding: 0,
    borderRadius: "12px",
    overflow: "hidden",
    textAlign: "left",
    textTransform: "none",
    backgroundColor: "transparent",
    transition: "transform 0.3s ease",

    "&:hover": {
      backgroundColor: "transparent",
      transform: "translateY(-6px)",
    },

    "&:hover $movieCard": {
      borderColor: "#d4af37",
      boxShadow: "0 10px 28px rgba(212, 175, 55, 0.12)",
    },
  },

  movieCard: {
    height: "100%",
    padding: "10px",
    borderRadius: "12px",
    background: "linear-gradient(145deg, #191919, #0d0d0d)",
    border: "1px solid rgba(212, 175, 55, 0.15)",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    boxSizing: "border-box",
  },

  posterWrapper: {
    width: "100%",
    height: "300px",
    overflow: "hidden",
    borderRadius: "8px",
    backgroundColor: "#252525",

    "@media (max-width: 850px)": {
      height: "260px",
    },

    "@media (max-width: 550px)": {
      height: "220px",
    },
  },

  poster: {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease",

    "$movieButton:hover &": {
      transform: "scale(1.04)",
    },
  },

  movieTitle: {
    color: "#f5f5f5",
    fontSize: "0.95rem",
    fontWeight: 600,
    lineHeight: 1.5,
    marginTop: "12px",
    minHeight: "44px",
    overflowWrap: "anywhere",
  },

  releaseYear: {
    color: "#d4af37",
    fontSize: "0.8rem",
    marginTop: "5px",
  },

  status: {
    color: "#d4af37",
    textAlign: "center",
    padding: "50px 15px",
    fontSize: "1rem",
  },
}));

const Filter = () => {
  const classes = useStyles();
  const { id, title } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(false);

        const { data } = await Axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          {
            params: {
              with_genres: id,
              primary_release_year: 2015,
              api_key: API_KEY,
              language: "en-US",
            },
          }
        );

        setContent(data.results || []);
      } catch (err) {
        console.error("Failed to fetch filtered movies:", err);
        setError(true);
        setContent([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovies();
    } else {
      setContent([]);
      setLoading(false);
      setError(true);
    }
  }, [id]);

  const handleMovieClick = (movie) => {
    const movieTitle = encodeURIComponent(
      movie.title || movie.original_title || "movie"
    );

    navigate(`/detail/${movie.id}/${movieTitle}`);
  };

  return (
    <Container className={classes.container}>
      <Typography component="h1" variant="h5" className={classes.heading}>
        Filtered On <span>"{title || "Movies"}"</span>
      </Typography>

      {loading ? (
        <Typography className={classes.status} role="status">
          Loading movies...
        </Typography>
      ) : error ? (
        <Typography className={classes.status} role="alert">
          Unable to load movies. Please try again later.
        </Typography>
      ) : content.length === 0 ? (
        <Typography className={classes.status}>
          No movies found for this genre.
        </Typography>
      ) : (
        <div className={classes.movieGrid}>
          {content.map((movie) => (
            <Button
              key={movie.id}
              className={classes.movieButton}
              onClick={() => handleMovieClick(movie)}
              aria-label={`View ${movie.title || movie.original_title}`}
              disableRipple
            >
              <div className={classes.movieCard}>
                <div className={classes.posterWrapper}>
                  <img
                    className={classes.poster}
                    src={
                      movie.poster_path
                        ? `${img_300}${movie.poster_path}`
                        : "/placeholder.png"
                    }
                    alt={`${movie.title || movie.original_title} poster`}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />
                </div>

                <Typography className={classes.movieTitle}>
                  {(movie.title || movie.original_title || "Untitled Movie")
                    .length > 20
                    ? `${(
                        movie.title ||
                        movie.original_title ||
                        "Untitled Movie"
                      ).substring(0, 20)}...`
                    : movie.title || movie.original_title || "Untitled Movie"}
                </Typography>

                {movie.release_date && (
                  <Typography className={classes.releaseYear}>
                    {movie.release_date.slice(0, 4)}
                  </Typography>
                )}
              </div>
            </Button>
          ))}
        </div>
      )}
    </Container>
  );
};

export default Filter;
