import React from "react";
import Banner from "../Component/Home/Banner";
import { Horror } from "../Component/Home/Horror";
import Romance from "../Component/Home/Romance";
import Action from "../Component/Home/Action";
import ScienceFiction from "../Component/Home/ScienceFiction";

const Home = () => {
  return (
    <>
      <style>{`
        .cinegenie-home {
          min-height: 100vh;
          background: #0b0b0b;
          color: #ffffff;
          font-family: "Montserrat", sans-serif;
          overflow-x: hidden;
        }

        .cinegenie-home section {
          padding-top: 15px;
          padding-bottom: 15px;
        }

        .cinegenie-home h1,
        .cinegenie-home h2,
        .cinegenie-home h3 {
          color: #ffffff;
        }

        .cinegenie-home a {
          transition: color 0.3s ease;
        }

        .cinegenie-home a:hover {
          color: #d4af37;
        }

        @media (max-width: 768px) {
          .cinegenie-home section {
            padding-top: 10px;
            padding-bottom: 10px;
          }
        }
      `}</style>

      <div className="cinegenie-home">
        <Banner />
        <Horror />
        <Romance />
        <ScienceFiction />
        <Action />
      </div>
    </>
  );
};

export default Home;