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

const handleDragStart = (event) => {
  event.preventDefault();
};

const useStyles = makeStyles(() => ({
  // Main carousel container
  carouselContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    marginTop: "24px",
    padding: "0 35px",
    boxSizing: "border-box",

    "@media (max-width: 600px)": {
      padding: "0 25px",
    },
  },

  // Carousel layout
  carousel: {
    width: "100%",
    minWidth: 0,

    "& .alice-carousel__wrapper": {
      width: "100%",
      overflow: "hidden",
    },

    "& .alice-carousel__stage": {
      display: "flex",
      alignItems: "stretch",
    },

    "& .alice-carousel__stage-item": {
      display: "flex",
      alignItems: "stretch",
      height: "auto",
      boxSizing: "border-box",
      padding: "0 8px",
    },
  },

  // Individual cast card
  castCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    width: "100%",
    minWidth: 0,
    height: "100%",
    padding: "10px",
    boxSizing: "border-box",
    borderRadius: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    color: "#ffffff",
    textTransform: "none",
    textAlign: "left",
    whiteSpace: "normal",
    overflow: "hidden",
    transition:
      "transform 0.25s ease, border-color 0.25s ease, background-color 0.25s ease",

    "&:hover": {
      transform: "translateY(-4px)",
      borderColor: "rgba(212, 175, 55, 0.65)",
      backgroundColor: "rgba(255, 255, 255, 0.06)",
    },

    "& .MuiButton-label": {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      width: "100%",
      minWidth: 0,
      whiteSpace: "normal",
    },
  },

  // Fixed-height portrait area

  imageContainer: {
    width: "100%",
    height: "220px",
    overflow: "hidden",
    borderRadius: "8px",
    backgroundColor: "#24212d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    "@media (max-width: 768px)": {
      height: "200px",
    },

    "@media (max-width: 480px)": {
      height: "180px",
    },
  },

  castImage: {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "center center",
    transition: "transform 0.3s ease",

    "$castCard:hover &": {
      transform: "scale(1.03)",
    },
  },

  // Fallback when an image is unavailable
  imageFallback: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    padding: "8px",
    boxSizing: "border-box",
    color: "#a9a3b3",
    fontSize: "12px",
    textAlign: "center",
  },

  // Actor name
  castName: {
    display: "block",
    width: "100%",
    minWidth: 0,
    marginTop: "12px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 700,
    lineHeight: 1.5,
    overflowWrap: "break-word",
    wordBreak: "normal",
    whiteSpace: "normal",
  },

  // Character name
  characterName: {
    display: "block",
    width: "100%",
    minWidth: 0,
    marginTop: "5px",
    color: "#c9c4d1",
    fontSize: "12px",
    lineHeight: 1.5,
    overflowWrap: "break-word",
    wordBreak: "normal",
    whiteSpace: "normal",
  },

  characterLabel: {
    color: "#d4af37",
    fontWeight: 600,
  },

  // Loading, error, and empty states
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

  // Carousel navigation arrows
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
    backgroundColor: "rgba(20, 18, 27, 0.95)",
    border: "1px solid rgba(212, 175, 55, 0.5)",

    "&:hover": {
      backgroundColor: "#d4af37",
      color: "#111111",
    },

    "@media (max-width: 600px)": {
      minWidth: "32px",
      width: "32px",
      height: "32px",
    },
  },

  prevButton: {
    left: "0",
  },

  nextButton: {
    right: "0",
  },
}));

const CastCarousel = () => {
  const classes = useStyles();
  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the cast of the current movie
  const fetchCast = useCallback(async () => {
    if (!id) {
      setContent([]);
      setError("Movie ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await Axios.get(
        `https://api.themoviedb.org/3/movie/${id}/credits`,
        {
          params: {
            api_key: API_KEY,
            language: "en-US",
          },
        },
      );

      setContent(Array.isArray(data.cast) ? data.cast : []);
    } catch (err) {
      console.error("Error fetching movie cast:", err);
      setError("Unable to load the cast. Please try again.");
      setContent([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCast();
  }, [fetchCast]);

  // Number of cards visible at different viewport widths
  const responsive = {
    0: {
      items: 2,
    },
    480: {
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

  // Build the cast cards
  const items = content
    .filter((person) => person && person.id)
    .map((person) => {
      const profileUrl = person.profile_path
        ? `${img_300}${person.profile_path}`
        : null;

      return (
        <div
          key={person.credit_id || person.id}
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            minWidth: 0,
            boxSizing: "border-box",
          }}
        >
          <Button
            className={classes.castCard}
            onClick={() => navigate(`/casts/${person.id}`)}
            aria-label={`View details for ${person.name || "cast member"}`}
            disableRipple
            fullWidth
          >
            <div className={classes.imageContainer}>
              {profileUrl && (
                <img
                  className={classes.castImage}
                  src={profileUrl}
                  alt={person.name || "Cast member"}
                  onDragStart={handleDragStart}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";

                    const fallback =
                      event.currentTarget.parentElement?.querySelector(
                        ".cast-image-fallback",
                      );

                    if (fallback) {
                      fallback.style.display = "flex";
                    }
                  }}
                />
              )}

              <div
                className={`${classes.imageFallback} cast-image-fallback`}
                style={{
                  display: profileUrl ? "none" : "flex",
                }}
              >
                Image unavailable
              </div>
            </div>

            <Typography component="div" className={classes.castName}>
              {person.name || "Unknown cast member"}
            </Typography>

            <Typography component="div" className={classes.characterName}>
              <span className={classes.characterLabel}>As </span>
              {person.character || "Unknown character"}
            </Typography>
          </Button>
        </div>
      );
    });

  if (loading) {
    return (
      <div className={classes.message} role="status">
        Loading cast...
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.message} role="alert">
        <div>{error}</div>

        <Button className={classes.retryButton} onClick={fetchCast}>
          Try Again
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={classes.message}>
        No cast information is available for this movie.
      </div>
    );
  }

  return (
    <div className={classes.carouselContainer}>
      <AliceCarousel
        key={id}
        className={classes.carousel}
        mouseTracking
        items={items}
        responsive={responsive}
        disableDotsControls
        controlsStrategy="responsive"
        infinite={items.length > 2}
        autoPlay={items.length > 2}
        autoPlayInterval={5000}
        animationDuration={600}
        renderPrevButton={() => (
          <Button
            className={`${classes.arrowButton} ${classes.prevButton}`}
            aria-label="Previous cast members"
          >
            <KeyboardDoubleArrowLeftIcon />
          </Button>
        )}
        renderNextButton={() => (
          <Button
            className={`${classes.arrowButton} ${classes.nextButton}`}
            aria-label="Next cast members"
          >
            <KeyboardDoubleArrowRightIcon />
          </Button>
        )}
      />
    </div>
  );
};

export default CastCarousel;
