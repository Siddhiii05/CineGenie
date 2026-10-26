import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .not-found-page {
          min-height: calc(100vh - 88px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px 20px;
          box-sizing: border-box;
          background: radial-gradient(
            circle at center,
            #211d15 0%,
            #111111 45%,
            #080808 100%
          );
          color: #ffffff;
          font-family: "Montserrat", sans-serif;
          text-align: center;
        }

        .not-found-content {
          max-width: 650px;
        }

        .not-found-code {
          display: block;
          margin-bottom: 10px;
          color: #d4af37;
          font-size: clamp(90px, 18vw, 160px);
          font-weight: 900;
          line-height: 1;
          letter-spacing: 8px;
          text-shadow: 0 0 35px rgba(212, 175, 55, 0.2);
        }

        .not-found-content h1 {
          margin: 25px 0 15px;
          font-size: clamp(25px, 5vw, 38px);
          font-weight: 700;
        }

        .not-found-content h1 span {
          color: #d4af37;
        }

        .not-found-content p {
          max-width: 500px;
          margin: 0 auto 30px;
          color: #aaaaaa;
          font-size: 15px;
          line-height: 1.8;
        }

        .not-found-button {
          padding: 13px 28px;
          border: 1px solid #d4af37;
          border-radius: 6px;
          background: #d4af37;
          color: #111111;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .not-found-button:hover {
          background: transparent;
          color: #d4af37;
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(212, 175, 55, 0.15);
        }

        @media (max-width: 480px) {
          .not-found-page {
            padding: 25px 18px;
          }

          .not-found-content p {
            font-size: 14px;
          }

          .not-found-code {
            letter-spacing: 4px;
          }
        }
      `}</style>

      <div className="not-found-page">
        <div className="not-found-content">
          <span className="not-found-code">404</span>

          <h1>
            Oops! <span>Page Not Found</span>
          </h1>

          <p>
            Looks like this page has disappeared into another universe.
            The movie you're looking for isn't playing here.
          </p>

          <button
            className="not-found-button"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </>
  );
};

export default NotFound;