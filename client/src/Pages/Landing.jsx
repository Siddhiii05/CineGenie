import React, { useEffect } from "react";
import BelowBanner from "../Component/Landing/BelowBanner";
import TopBanner from "../Component/Landing/TopBanner";

const Landing = ({ funcNav }) => {
  useEffect(() => {
    if (funcNav) {
      funcNav(true);
    }
  }, [funcNav]);

  return (
    <main className="landing-page">
      <TopBanner />
      <BelowBanner />
    </main>
  );
};

export default Landing;