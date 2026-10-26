import React from "react";
import { makeStyles } from "@material-ui/core";

import GenreSort from "../GenreSort";
import Carousel from "./Carousel1/Carousel";

const useStyles = makeStyles((theme) => ({
  bannerContent: {
    width: "100%",
    maxWidth: "none",
    boxSizing: "border-box",
    padding: "2rem 5% 1rem",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "1.5rem",
    backgroundColor: "#transparent",

    [theme.breakpoints.down("sm")]: {
      padding: "1.5rem 4% 1rem",
      gap: "1rem",
    },
  },

  carouselWrapper: {
    width: "100%",
    minWidth: 0,
  },

  genreWrapper: {
    width: "100%",
    minWidth: 0,
  },
}));

const Banner = () => {
  const classes = useStyles();

  return (
    <section className={classes.bannerContent}>
      <div className={classes.carouselWrapper}>
        <Carousel />
      </div>

      <div className={classes.genreWrapper}>
        <GenreSort />
      </div>
    </section>
  );
};

export default Banner;
