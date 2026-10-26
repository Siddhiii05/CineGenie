import React, { useCallback, useEffect, useState } from "react";
import { makeStyles, Tooltip, Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";
import Axios from "axios";

import CastCarousel from "./CastCarousel";
import { img_300 } from "../../Config/Config";
import RecomCarousel from "./RecomCarousel";
import ApiRecomCarousel from "./ApiRecomCarousel";
import { recommendationMovieIds } from "./recommendationMovieIds";

export function numberWithCommas(value) {
  if (value === null || value === undefined || value === "") {
    return "0";
  }

  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const useStyles = makeStyles(() => ({
  page: {
    width: "100%",
    padding: "30px 0 60px",
    boxSizing: "border-box",
    color: "#f5f2fa",
    overflow: "hidden",
  },

  movieSection: {
    display: "flex",
    alignItems: "flex-start",
    gap: "42px",
    margin: "20px 5% 60px",

    "@media (max-width: 780px)": {
      flexDirection: "column",
      alignItems: "center",
      gap: "28px",
      margin: "20px 5% 45px",
    },
  },

  posterContainer: {
    flex: "0 0 300px",
    width: "300px",
    maxWidth: "100%",

    "@media (max-width: 780px)": {
      flex: "none",
      width: "min(300px, 100%)",
    },
  },

  poster: {
    display: "block",
    width: "100%",
    aspectRatio: "2 / 3",
    objectFit: "cover",
    borderRadius: "14px",
    backgroundColor: "#24212d",
    boxShadow: "0 12px 35px rgba(0, 0, 0, 0.35)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",

    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 18px 45px rgba(0, 0, 0, 0.45)",
    },
  },

  posterFallback: {
    width: "100%",
    aspectRatio: "2 / 3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "20px",
    boxSizing: "border-box",
    borderRadius: "14px",
    backgroundColor: "#24212d",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    color: "#a9a3b3",
  },

  movieInfo: {
    flex: 1,
    minWidth: 0,
    fontFamily: "Montserrat, sans-serif",
    lineHeight: 1.8,

    "@media (max-width: 780px)": {
      width: "100%",
    },
  },

  movieTitle: {
    fontSize: "clamp(28px, 4vw, 42px)",
    fontWeight: 800,
    lineHeight: 1.3,
    overflowWrap: "anywhere",
    marginBottom: "18px",
    color: "#ffffff",
  },

  releaseYear: {
    color: "#a9a3b3",
    fontWeight: 400,
    whiteSpace: "nowrap",
  },

  metaList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "22px",
  },

  metaItem: {
    display: "inline-flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "8px",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    color: "#e8e3ed",
    fontSize: "13px",
    lineHeight: 1.5,
    overflowWrap: "anywhere",
  },

  label: {
    color: "#d4af37",
    fontWeight: 700,
  },

  rating: {
    color: "#d4af37",
    fontWeight: 700,
  },

  overviewTitle: {
    color: "#d4af37",
    fontWeight: 700,
    fontSize: "18px",
    marginBottom: "8px",
  },

  overview: {
    color: "#c9c4d1",
    fontSize: "15px",
    lineHeight: 1.9,
    overflowWrap: "anywhere",
  },

  section: {
    marginTop: "45px",
    width: "100%",
  },

  sectionTitle: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "clamp(22px, 3vw, 28px)",
    fontWeight: 800,
    color: "#ffffff",
    padding: "0 5%",
    marginBottom: "18px",

    "& span": {
      color: "#d4af37",
    },
  },

  message: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#d4af37",
    fontSize: "16px",
  },

  retryButton: {
    marginTop: "14px",
    padding: "9px 18px",
    borderRadius: "7px",
    border: "1px solid #d4af37",
    background: "transparent",
    color: "#d4af37",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background 0.2s ease",

    "&:hover": {
      background: "rgba(212, 175, 55, 0.1)",
    },

    "&:focus-visible": {
      outline: "2px solid #d4af37",
      outlineOffset: "3px",
    },
  },
}));

const DetailBanner = () => {
  const classes = useStyles();
  const { id } = useParams();

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMovie = useCallback(async () => {
    if (!id) {
      setContent(null);
      setError("A movie ID was not provided.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setContent(null);

      const { data } = await Axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=b9e11d2c8939104a4a755544e4eb8847&language=en-US`
      );

      setContent(data);
    } catch (err) {
      console.error("Error fetching movie details:", err);

      setError(
        "Unable to load movie details. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMovie();
  }, [fetchMovie]);

  if (loading) {
    return (
      <main className={classes.page}>
        <div className={classes.message} role="status">
          Loading movie details...
        </div>
      </main>
    );
  }

  if (error || !content) {
    return (
      <main className={classes.page}>
        <div className={classes.message} role="alert">
          <div>{error || "Movie details are unavailable."}</div>

          <button
            type="button"
            className={classes.retryButton}
            onClick={fetchMovie}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  const formattedRuntime =
    content.runtime > 0
      ? `${Math.floor(content.runtime / 60)}h ${content.runtime % 60}m`
      : "Not available";

  const formattedBudget =
    content.budget > 0
      ? `$${numberWithCommas(content.budget)}`
      : "Not available";

  const formattedRevenue =
    content.revenue > 0
      ? `$${numberWithCommas(content.revenue)}`
      : "Not available";

  const formattedRating =
    typeof content.vote_average === "number"
      ? content.vote_average.toFixed(1)
      : "N/A";

  const movieTitle = content.title || content.original_title || "Untitled Movie";

  const releaseYear = content.release_date
    ? content.release_date.slice(0, 4)
    : "";

  const posterUrl = content.poster_path
    ? `${img_300}${content.poster_path}`
    : null;

  return (
    <main className={classes.page}>
      {/* Movie poster and information */}
      <section className={classes.movieSection}>
        <div className={classes.posterContainer}>
          {posterUrl ? (
            <img
              className={classes.poster}
              alt={`${movieTitle} movie poster`}
              src={posterUrl}
              onError={(event) => {
                event.currentTarget.style.display = "none";
                event.currentTarget.nextSibling.style.display = "flex";
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

        <div className={classes.movieInfo}>
          <Typography
            component="h1"
            className={classes.movieTitle}
          >
            {movieTitle}

            {releaseYear && (
              <span className={classes.releaseYear}>
                {" "}({releaseYear})
              </span>
            )}
          </Typography>

          {/* Release date, runtime, rating, and genres */}
          <div className={classes.metaList}>
            <div className={classes.metaItem}>
              <span className={classes.label}>Release:</span>
              {content.release_date || "Not available"}
            </div>

            <div className={classes.metaItem}>
              <span className={classes.label}>Runtime:</span>
              {formattedRuntime}
            </div>

            <Tooltip title="Average user rating out of 10" arrow>
              <div className={classes.metaItem}>
                <span className={classes.label}>★ Rating:</span>

                <span className={classes.rating}>
                  {formattedRating}/10
                </span>
              </div>
            </Tooltip>

            {content.genres && content.genres.length > 0 && (
              <div className={classes.metaItem}>
                <span className={classes.label}>Genres:</span>

                {content.genres
                  .map((genre) => genre.name)
                  .join(", ")}
              </div>
            )}
          </div>

          {/* Budget and box office */}
          <div className={classes.metaList}>
            <div className={classes.metaItem}>
              <span className={classes.label}>Budget:</span>
              {formattedBudget}
            </div>

            <div className={classes.metaItem}>
              <span className={classes.label}>Box Office:</span>
              {formattedRevenue}
            </div>
          </div>

          {/* Movie overview */}
          <div>
            <Typography
              component="h2"
              className={classes.overviewTitle}
            >
              Overview
            </Typography>

            <Typography
              component="p"
              className={classes.overview}
            >
              {content.overview ||
                "No overview is available for this movie."}
            </Typography>
          </div>
        </div>
      </section>

      {/* Cast section */}
      <section className={classes.section}>
        <Typography
          component="h2"
          className={classes.sectionTitle}
        >
          <span>Cast</span>
        </Typography>

        <CastCarousel />
      </section>

      {/* Recommendations section */}
      <section className={classes.section}>
        <Typography
          component="h2"
          className={classes.sectionTitle}
        >
          More <span>Like This</span>
        </Typography>

        {recommendationMovieIds.includes(String(id)) ? (
          <RecomCarousel />
        ) : (
          <ApiRecomCarousel />
        )}
      </section>
    </main>
  );
};

export default DetailBanner;
