import React, { useEffect } from "react";
import DetailBanner2 from "../Component/DetailView/DetailBanner2";

function RecomDetailView() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <style>{`
        .recom-detail-page {
          min-height: 100vh;
          margin-top: 88px;
          padding-bottom: 40px;
          box-sizing: border-box;
          background: #0b0b0b;
          color: #ffffff;
          font-family: "Montserrat", sans-serif;
          overflow-x: hidden;
        }

        .recom-detail-page h1,
        .recom-detail-page h2,
        .recom-detail-page h3 {
          color: #ffffff;
        }

        .recom-detail-page a {
          transition: color 0.3s ease;
        }

        .recom-detail-page a:hover {
          color: #d4af37;
        }

        @media (max-width: 768px) {
          .recom-detail-page {
            margin-top: 75px;
            padding-bottom: 25px;
          }
        }
      `}</style>

      <div className="recom-detail-page">
        <DetailBanner2 />
      </div>
    </>
  );
}

export default RecomDetailView;