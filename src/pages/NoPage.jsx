import React from "react";
import { useNavigate } from "react-router-dom";

const NoPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page does not exist.</p>
      <button
        onClick={() => navigate(-1)} 
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          marginTop: "20px",
          borderRadius:"40px",
          backgroundColor:"beige",
        }}
      >
        Go Back
      </button>
    </div>
  );
};

export default NoPage;