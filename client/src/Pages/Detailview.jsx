import React, { useEffect } from "react";
import DetailBanner from "../Component/DetailView/DetailBanner";

const Detailview = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main
      style={{
        color: "#f5f2fa",
        paddingTop: "88px",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <DetailBanner />
    </main>
  );
};

export default Detailview;