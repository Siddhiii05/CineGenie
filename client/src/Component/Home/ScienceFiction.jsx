import React from "react";
import { Container, Typography, makeStyles } from "@material-ui/core";
import Carousel5 from "./Carousel5/Carousel5";

const useStyles = makeStyles((theme) => ({
  section: {
    width: "100%",
    marginTop: "3rem",
    padding: "0 5% 2rem",
    boxSizing: "border-box",
    backgroundColor: "#transparent",

    [theme.breakpoints.down("sm")]: {
      marginTop: "2rem",
      padding: "0 4% 1.5rem",
    },
  },

  heading: {
    position: "relative",
    marginBottom: "1.5rem",
    paddingLeft: "1rem",
    color: "#f5f5f5",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "1.6rem",
    fontWeight: 700,
    letterSpacing: "0.2px",

    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: "10%",
      width: "4px",
      height: "80%",
      borderRadius: "4px",
      backgroundColor: "#d4af37",
    },

    [theme.breakpoints.down("xs")]: {
      fontSize: "1.3rem",
      marginBottom: "1rem",
    },
  },

  carouselWrapper: {
    width: "100%",
    minWidth: 0,
  },
}));

const ScienceFiction = () => {
  const classes = useStyles();

  return (
    <Container maxWidth={false} disableGutters className={classes.section}>
      <Typography component="h2" variant="h5" className={classes.heading}>
        Science Fiction
      </Typography>

      <div className={classes.carouselWrapper}>
        <Carousel5 />
      </div>
    </Container>
  );
};

export default ScienceFiction;
