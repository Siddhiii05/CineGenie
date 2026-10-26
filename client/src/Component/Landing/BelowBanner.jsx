import React from "react";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  section: {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    gap: "2rem",
    padding: "5rem 8%",
    backgroundColor: "#111111",
    color: "#f5f5f5",
    boxSizing: "border-box",

    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      padding: "3rem 6%",
      gap: "1.5rem",
    },
  },

  card: {
    flex: 1,
    minWidth: 0,
    padding: "2.5rem 2rem",
    textAlign: "center",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "14px",
    backgroundColor: "#181818",
    boxSizing: "border-box",
    transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",

    "&:hover": {
      transform: "translateY(-6px)",
      borderColor: "rgba(212, 175, 55, 0.55)",
      boxShadow: "0 16px 40px rgba(0, 0, 0, 0.25)",
    },

    [theme.breakpoints.down("sm")]: {
      padding: "2rem 1.5rem",
    },

    "@media (prefers-reduced-motion: reduce)": {
      transition: "none",

      "&:hover": {
        transform: "none",
      },
    },
  },

  imageWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "190px",
    marginBottom: "1.5rem",
  },

  image: {
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
    width: "auto",
    height: "auto",
    objectFit: "contain",
  },

  title: {
    marginBottom: "1rem",
    color: "#d4af37",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 600,
    fontSize: "clamp(1.7rem, 3vw, 2.25rem)",
    lineHeight: 1.3,
  },

  description: {
    maxWidth: "420px",
    margin: "0 auto",
    color: "#b5b5b5",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.98rem",
    fontWeight: 400,
    lineHeight: 1.9,
  },

  eyebrow: {
    marginBottom: "0.75rem",
    color: "#888888",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
}));

const BelowBanner = () => {
  const classes = useStyles();

  return (
    <section className={classes.section}>
      {/* Machine Learning Card */}
      <article className={classes.card}>
        <div className={classes.imageWrapper}>
          <img
            className={classes.image}
            src="https://acehacker.com/microsoft/engage2022/img/algorithms.png"
            alt="Illustration representing machine learning algorithms"
            loading="lazy"
          />
        </div>

        <Typography component="p" className={classes.eyebrow}>
          Discover smarter
        </Typography>

        <Typography component="h2" className={classes.title}>
          Machine Learning
        </Typography>

        <Typography component="p" className={classes.description}>
          Find movies tailored to your interests with recommendations powered
          by machine learning and your movie searches.
        </Typography>
      </article>

      {/* Features Card */}
      <article className={classes.card}>
        <div className={classes.imageWrapper}>
          <img
            className={classes.image}
            src="https://blush.design/api/download?shareUri=us0Zf7tSpE3wmqIf&c=Hair_0%7Ec38741-0.2%7E711515-0.3%7Ec38741_Skin_0%7Ec26e5e-0.2%7Ef6cbc3-0.3%7Eecafa3&w=800&h=800&fm=png"
            alt="Illustration representing the movie discovery experience"
            loading="lazy"
          />
        </div>

        <Typography component="p" className={classes.eyebrow}>
          Everything in one place
        </Typography>

        <Typography component="h2" className={classes.title}>
          Features
        </Typography>

        <Typography component="p" className={classes.description}>
          Explore trending and upcoming movies, discover new favorites, and
          browse movie details and reviews in one place.
        </Typography>
      </article>
    </section>
  );
};

export default BelowBanner;
