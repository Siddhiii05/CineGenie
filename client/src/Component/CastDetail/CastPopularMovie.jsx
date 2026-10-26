import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  makeStyles,
} from "@material-ui/core";
import AliceCarousel from "react-alice-carousel";
import Axios from "axios";
import {
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

import "react-alice-carousel/lib/alice-carousel.css";
import { img_300 } from "../../Config/Config";

const handleDragStart = (e) => e.preventDefault();

const useStyles = makeStyles(() => ({
  carousel: {
    marginTop: "42px",
    width: "100%",
    position: "relative",
    padding: "10px 0 25px",
    "& .alice-carousel__stage-item": {
      padding: "0 10px",
      verticalAlign: "top",
    },
  },

  castCard: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(145deg, #191919, #0c0c0c)",
    border: "1px solid rgba(212, 175, 55, 0.15)",
    borderRadius: "14px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    transition: "all 0.3s ease",
    minWidth: 0,

    "&:hover": {
      transform: "translateY(-6px)",
      border: "1px solid #d4af37",
      boxShadow: "0 8px 25px rgba(212, 175, 55, 0.15)",
      background: "linear-gradient(145deg, #222, #111)",
    },
  },

  imageWrapper: {
    width: "100%",
    height: "220px",
    overflow: "hidden",
    borderRadius: "10px",
    backgroundColor: "#252525",
  },

  castImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "top center",
    transition: "transform 0.4s ease",

    "$castCard:hover &": {
      transform: "scale(1.05)",
    },
  },

  castName: {
    color: "#f5f5f5",
    fontSize: "17px",
    fontWeight: 600,
    marginTop: "14px",
    textAlign: "left",
    overflowWrap: "anywhere",
  },

  characterName: {
    color: "#d4af37",
    fontSize: "12px",
    marginTop: "6px",
    textAlign: "left",
    lineHeight: 1.5,
    overflowWrap: "anywhere",
  },

  characterLabel: {
    color: "#999",
    fontSize: "11px",
    marginRight: "4px",
  },

  arrowButton: {
    position: "absolute",
    top: "40%",
    zIndex: 2,
    color: "#d4af37",
    backgroundColor: "rgba(15, 15, 15, 0.9)",
    border: "1px solid rgba(212, 175, 55, 0.5)",
    borderRadius: "50%",
    minWidth: "44px",
    width: "44px",
    height: "44px",
    padding: 0,
    transition: "all 0.3s ease",

    "&:hover": {
      backgroundColor: "#d4af37",
      color: "#111",
    },
  },

  prevButton: {
    left: "5px",
  },

  nextButton: {
    right: "5px",
  },

  message: {
    color: "#aaa",
    textAlign: "center",
    padding: "25px 10px",
    fontSize: "14px",
  },
}));

const RecomCarousel = () => {
  const classes = useStyles();
  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCast = async () => {
      if (!id) {
        setContent([]);
        setLoading(false);
        setError(true);
        return;
      }

      try {
        setLoading(true);
        setError(false);

        const { data } = await Axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits`,
          {
            params: {
              api_key: "b9e11d2c8939104a4a755544e4eb8847",
              language: "en-US",
            },
          }
        );

        setContent(data.cast || []);
      } catch (err) {
        console.error("Error fetching movie cast:", err);
        setContent([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCast();
  }, [id]);


  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 3,
    },
    900: {
      items: 5,
    },
  };

  const items = content.map((c) => (
    <div key={c.id} style={{ padding: "5px" }}>
      <Button
        className={classes.castCard}
        onClick={() => navigate(`/casts/${c.id}`)}
        disableRipple
        aria-label={`View details for ${c.name}`}
      >
        <div className={classes.imageWrapper}>
          <img
            src={
              c.profile_path
                ? `${img_300}/${c.profile_path}`
                : "/placeholder.png"
            }
            alt={c.name}
            className={classes.castImage}
            onDragStart={handleDragStart}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder.png";
            }}
          />
        </div>

        <Typography className={classes.castName}>
          {c.name?.length > 13
            ? `${c.name.substring(0, 13)}...`
            : c.name}
        </Typography>

        <Typography className={classes.characterName}>
          <span className={classes.characterLabel}>As </span>
          {c.character
            ? c.character.length > 25
              ? `${c.character.substring(0, 25)}...`
              : c.character
            : "Unknown character"}
        </Typography>
      </Button>
    </div>
  ));

  if (loading) {
    return (
      <Typography className={classes.message}>
        Loading cast members...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography className={classes.message}>
        Unable to load cast members. Please try again later.
      </Typography>
    );
  }

  if (content.length === 0) {
    return (
      <Typography className={classes.message}>
        No cast members found.
      </Typography>
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
        infinite={content.length > 5}
        renderPrevButton={() => (
          <Button
            className={`${classes.arrowButton} ${classes.prevButton}`}
            aria-label="Previous cast members"
          >
            <KeyboardDoubleArrowLeft fontSize="large" />
          </Button>
        )}
        renderNextButton={() => (
          <Button
            className={`${classes.arrowButton} ${classes.nextButton}`}
            aria-label="Next cast members"
          >
            <KeyboardDoubleArrowRight fontSize="large" />
          </Button>
        )}
      />
    </div>
  );
};

export default RecomCarousel;