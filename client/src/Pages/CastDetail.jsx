import React, { useEffect } from "react";
import CastDetailBanner from "../Component/CastDetail/CastDetailBanner";

function CastDetail() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        color: "#ffffff",
        marginTop: "88px",
        minHeight: "100vh",
        backgroundColor: "#0b0b0b",
        paddingBottom: "40px",
      }}
    >
      <CastDetailBanner />
    </div>
  );
}

export default CastDetail;
