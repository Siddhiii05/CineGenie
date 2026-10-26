import React, { useCallback, useEffect, useState } from "react";
import { makeStyles, Tooltip, Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";
import Axios from "axios";

import Carousel from "./CastDetailCarousel";
import { img_300 } from "../../Config/Config";

const API_KEY = "b9e11d2c8939104a4a755544e4eb8847";

const useStyles = makeStyles(() => ({
  page: {
    width: "100%",
    minHeight: "100vh",
    color: "#f5f5f5",
    background: "linear-gradient(180deg, #0b0b0b 0%, #111 100%)",
    overflow: "hidden",
    paddingBottom: "50px",
  },

  profileContainer: {
    display: "flex",
    alignItems: "flex-start",
    gap: "45px",
    margin: "40px",
    padding: "30px",
    background: "linear-gradient(145deg, #171717, #0d0d0d)",
    border: "1px solid rgba(212, 175, 55, 0.2)",
    borderRadius: "18px",
    boxShadow: "0 12px 35px rgba(0, 0, 0, 0.3)",

    "@media (max-width: 780px)": {
      flexDirection: "column",
      alignItems: "center",
      margin: "24px",
      padding: "24px",
      gap: "28px",
    },

    "@media (max-width: 480px)": {
      margin: "14px",
      padding: "16px",
    },
  },

  imageContainer: {
    width: "36%",
    flexShrink: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    overflow: "hidden",

    "@media (max-width: 780px)": {
      width: "100%",
      maxWidth: "380px",
    },
  },

  profileImage: {
    display: "block",
    width: "100%",
    height: "auto",
    maxHeight: "560px",
    objectFit: "contain",
    objectPosition: "center top",
    borderRadius: "14px",
    backgroundColor: "#191919",
    border: "1px solid rgba(212, 175, 55, 0.35)",
    boxShadow: "0 12px 35px rgba(0, 0, 0, 0.45)",
    transition: "box-shadow 0.35s ease",

    "&:hover": {
      boxShadow: "0 16px 40px rgba(212, 175, 55, 0.14)",
    },

    "@media (max-width: 480px)": {
      maxHeight: "440px",
    },
  },

  details: {
    flex: 1,
    minWidth: 0,
    fontFamily: "Montserrat, sans-serif",
    lineHeight: 1.8,
    paddingTop: "5px",

    "@media (max-width: 780px)": {
      width: "100%",
    },
  },

  name: {
    fontSize: "2.7rem",
    fontWeight: 800,
    lineHeight: 1.2,
    color: "#f5f5f5",
    marginBottom: "24px",
    overflowWrap: "anywhere",

    "&::after": {
      content: '""',
      display: "block",
      width: "70px",
      height: "4px",
      background: "linear-gradient(90deg, #d4af37, transparent)",
      marginTop: "14px",
      borderRadius: "4px",
    },

    "@media (max-width: 600px)": {
      fontSize: "2rem",
    },
  },

  detailRow: {
    color: "#c7c7c7",
    fontSize: "0.98rem",
    marginBottom: "12px",
    overflowWrap: "anywhere",

    "& b": {
      color: "#d4af37",
      fontWeight: 600,
      marginRight: "4px",
    },
  },

  biographyTitle: {
    display: "block",
    color: "#d4af37",
    fontSize: "1.25rem",
    fontWeight: 700,
    marginTop: "25px",
    marginBottom: "10px",
  },

  biography: {
    color: "#bdbdbd",
    fontSize: "0.96rem",
    lineHeight: 1.9,
    whiteSpace: "pre-line",
    overflowWrap: "anywhere",
  },

  section: {
    marginTop: "50px",
    padding: "0 40px",

    "@media (max-width: 600px)": {
      padding: "0 16px",
      marginTop: "35px",
    },
  },

  sectionTitle: {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 700,
    color: "#f5f5f5",
    borderLeft: "4px solid #d4af37",
    paddingLeft: "15px",
    marginBottom: "24px",
    lineHeight: 1.4,
    overflowWrap: "anywhere",

    "& span": {
      color: "#d4af37",
    },
  },

  status: {
    minHeight: "60vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "16px",
    padding: "24px",
    color: "#d4af37",
    textAlign: "center",
  },

  retryButton: {
    padding: "10px 22px",
    border: "1px solid #d4af37",
    borderRadius: "8px",
    backgroundColor: "#d4af37",
    color: "#111",
    cursor: "pointer",
    fontWeight: 700,
    transition: "all 0.25s ease",

    "&:hover": {
      backgroundColor: "#f0ce58",
      transform: "translateY(-2px)",
    },
  },
}));

const DetailBanner = () => {
  const classes = useStyles();
  const { id } = useParams();

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPersonDetails = useCallback(async () => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const { data } = await Axios.get(
        `https://api.themoviedb.org/3/person/${id}`,
        {
          params: {
            api_key: API_KEY,
            language: "en-US",
          },
        },
      );

      setContent(data);
    } catch (err) {
      console.error("Failed to fetch person details:", err);
      setError(true);
      setContent(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPersonDetails();
  }, [fetchPersonDetails]);

  if (loading) {
    return (
      <div className={classes.status} role="status">
        <Typography variant="h6">Loading cast details...</Typography>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className={classes.status} role="alert">
        <Typography variant="h6">Unable to load cast details.</Typography>

        <button
          type="button"
          className={classes.retryButton}
          onClick={fetchPersonDetails}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={classes.page}>
      <div className={classes.profileContainer}>
        <div className={classes.imageContainer}>
          <img
            className={classes.profileImage}
            src={
              content.profile_path
                ? `${img_300}${content.profile_path}`
                : "/placeholder-person.png"
            }
            alt={`${content.name || "Cast member"} portrait`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder-person.png";
            }}
          />
        </div>

        <div className={classes.details}>
          <Typography component="h1" className={classes.name}>
            {content.name || "Unknown Cast Member"}
          </Typography>

          <div className={classes.detailRow}>
            <b>Birthday:</b>
            {content.birthday || "Not available"}
          </div>

          {content.deathday && (
            <div className={classes.detailRow}>
              <b>Deathday:</b>
              {content.deathday}
            </div>
          )}

          <div className={classes.detailRow}>
            <b>Place of Birth:</b>
            {content.place_of_birth || "Not available"}
          </div>

          <div className={classes.detailRow}>
            <Tooltip title="Popularity according to TMDB">
              <span>
                <b>Popularity:</b>
                {typeof content.popularity === "number"
                  ? content.popularity.toFixed(1)
                  : "Not available"}
              </span>
            </Tooltip>
          </div>

          {content.known_for_department && (
            <div className={classes.detailRow}>
              <b>Known For:</b>
              {content.known_for_department}
            </div>
          )}

          <Typography component="h2" className={classes.biographyTitle}>
            Biography
          </Typography>

          <Typography component="p" className={classes.biography}>
            {content.biography || "No biography available."}
          </Typography>
        </div>
      </div>

      <section className={classes.section}>
        <Typography
          component="h2"
          variant="h5"
          className={classes.sectionTitle}
        >
          Popular Movies of <span>{content.name || "This Cast Member"}</span>
        </Typography>

        <Carousel />
      </section>
    </div>
  );
};

export default DetailBanner;
