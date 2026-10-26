import React from "react";
import { Button, makeStyles, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

const genres = [
  { id: 35, name: "Comedy" },
  { id: 28, name: "Action" },
  { id: 878, name: "Sci-Fi" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 16, name: "Animation" },
  { id: 9648, name: "Mystery" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
];

const useStyles = makeStyles((theme) => ({
  section: {
    width: "100%",
    marginTop: "1.5rem",
    padding: "1.5rem 0 2rem",
    boxSizing: "border-box",
  },

  heading: {
    marginBottom: "1.25rem",
    color: "#f5f5f5",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "1.6rem",
    fontWeight: 600,
    letterSpacing: "0.2px",
  },

  genreList: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "0.75rem",
  },

  genreButton: {
    minWidth: "auto",
    padding: "0.55rem 1.15rem",
    border: "1px solid #3b3b3b",
    borderRadius: "24px",
    backgroundColor: "#1b1b1b",
    color: "#d6d6d6",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.85rem",
    fontWeight: 500,
    textTransform: "none",
    transition: "background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease",

    "&:hover": {
      borderColor: "#d4af37",
      backgroundColor: "rgba(212, 175, 55, 0.12)",
      color: "#d4af37",
    },

    "&:focus-visible": {
      outline: "2px solid #d4af37",
      outlineOffset: "3px",
    },
  },

  [theme.breakpoints.down("xs")]: {
    section: {
      paddingTop: "1rem",
    },

    heading: {
      fontSize: "1.35rem",
    },

    genreList: {
      gap: "0.5rem",
    },

    genreButton: {
      padding: "0.45rem 0.9rem",
      fontSize: "0.8rem",
    },
  },

  "@media (prefers-reduced-motion: reduce)": {
    genreButton: {
      transition: "none",
    },
  },
}));

const GenreSort = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleGenreClick = (genre) => {
    navigate(`/filter/${genre.id}/${encodeURIComponent(genre.name)}`);
  };

  return (
    <section className={classes.section} aria-labelledby="genre-heading">
      <Typography
        id="genre-heading"
        component="h2"
        className={classes.heading}
      >
        Explore by Genre
      </Typography>

      <div className={classes.genreList}>
        {genres.map((genre) => (
          <Button
            key={genre.id}
            className={classes.genreButton}
            onClick={() => handleGenreClick(genre)}
          >
            {genre.name}
          </Button>
        ))}
      </div>
    </section>
  );
};

export default GenreSort;
