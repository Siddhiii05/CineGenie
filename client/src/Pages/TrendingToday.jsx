import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Container,
  Typography,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import { Rating } from "@mui/material";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { img_300 } from "../Config/Config";

const useStyles = makeStyles((theme) => ({
  page: {
    width: "100%",
    boxSizing: "border-box",
    paddingTop: "2.5rem",
    paddingBottom: "3rem",

    [theme.breakpoints.down("xs")]: {
      paddingTop: "1.5rem",
    },
  },

  heading: {
    position: "relative",
    marginBottom: "2rem",
    paddingLeft: "1rem",
    color: "#f5f2fa",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "1.8rem",
    fontWeight: 700,

    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: "10%",
      height: "80%",
      width: "4px",
      borderRadius: "4px",
      backgroundColor: "#d4af37",
    },

    [theme.breakpoints.down("xs")]: {
      fontSize: "1.4rem",
      marginBottom: "1.25rem",
    },
  },

  movieGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "2rem 1.5rem",
    alignItems: "start",

    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "1.5rem 1rem",
    },

    [theme.breakpoints.down("xs")]: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "1.25rem 0.75rem",
    },
  },

 
movieButton: {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-start",
  width: "100%",
  minWidth: 0,
  height: "100%",
  padding: "0.5rem !important",
  borderRadius: "12px !important",
  color: "#f5f2fa",
  textAlign: "left",
  textTransform: "none",
  whiteSpace: "normal",

  "&:hover": {
    backgroundColor: "rgba(135, 78, 145, 0.12)",
    transform: "translateY(-4px)",
  },

  "& .MuiButton-label": {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    width: "100%",
  },
},


  poster: {
    display: "block",
    width: "100%",
    aspectRatio: "2 / 3",
    objectFit: "cover",
    borderRadius: "10px",
    backgroundColor: "#211b2b",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.25)",
  },

  movieTitle: {
    display: "block",
    width: "100%",
    marginTop: "0.8rem",
    overflow: "hidden",
    color: "#f5f2fa",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.95rem",
    fontWeight: 600,
    lineHeight: 1.5,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },


rating: {
  display: "flex",
  alignSelf: "flex-start",
  marginTop: "0.4rem",
  maxWidth: "100%",
  overflow: "hidden",

  "& .MuiRating-iconFilled": {
    color: "#d4af37",
  },

  "& .MuiRating-iconEmpty": {
    color: "#61596a",
  },

  "& .MuiRating-icon": {
    fontSize: "1.15rem",
  },
},


  status: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    minHeight: "250px",
    color: "#c5bdcf",
    textAlign: "center",
  },

  spinner: {
    color: "#d4af37",
  },

  retryButton: {
    color: "#d4af37",
    borderColor: "#d4af37",
    textTransform: "none",
  },
}));

const TrendingToday = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTrending = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const { data } = await Axios.get(
        "https://api.themoviedb.org/3/trending/movie/day",
        {
          params: {
            api_key: "b9e11d2c8939104a4a755544e4eb8847",
          },
        }
      );

      setContent(data.results || []);
    } catch (err) {
      console.error("Failed to fetch trending movies:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  const openMovie = (movie) => {
    navigate(
      `/detail/${movie.id}/${encodeURIComponent(
        movie.title || movie.name || "movie"
      )}`
    );
  };

  const movies = content.filter((movie) => movie.poster_path);

  return (
    <Container maxWidth="lg" className={classes.page}>
      <Typography component="h1" variant="h5" className={classes.heading}>
        Today's Hot Chart
      </Typography>

      {loading ? (
        <div className={classes.status}>
          <CircularProgress className={classes.spinner} />
          <Typography>Loading trending movies...</Typography>
        </div>
      ) : error ? (
        <div className={classes.status}>
          <Typography>
            Couldn't load trending movies. Please try again.
          </Typography>
          <Button
            variant="outlined"
            className={classes.retryButton}
            onClick={fetchTrending}
          >
            Try Again
          </Button>
        </div>
      ) : movies.length === 0 ? (
        <div className={classes.status}>
          <Typography>No trending movies are available right now.</Typography>
        </div>
      ) : (
        <div className={classes.movieGrid}>
          {movies.map((movie) => (
            <Button
              key={movie.id}
              className={classes.movieButton}
              onClick={() => openMovie(movie)}
              aria-label={`View details for ${
                movie.title || movie.name
              }`}
            >
              <img
                className={classes.poster}
                src={`${img_300}/${movie.poster_path}`}
                alt={`${movie.title || movie.name} poster`}
                loading="lazy"
              />

              <Typography component="span" className={classes.movieTitle}>
                {movie.title || movie.name}
              </Typography>

              <Rating
                className={classes.rating}
                name={`rating-${movie.id}`}
                value={
                  Number.isFinite(movie.vote_average)
                    ? Math.min(5, Math.max(0, movie.vote_average / 2))
                    : 0
                }
                precision={0.5}
                size="small"
                readOnly
                aria-label={`Rating: ${(
                  (movie.vote_average || 0) / 2
                ).toFixed(1)} out of 5`}
              />
            </Button>
          ))}
        </div>
      )}
    </Container>
  );
};

export default TrendingToday;
