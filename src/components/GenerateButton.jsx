import React from "react";
import "./GenerateButton.css";

const GenerateButton = ({ onClick, loading, error }) => {
  return (
    <div className="generate-btn-wrapper">
      <button className="generate-btn" onClick={onClick} disabled={loading}>
        {loading ? <span className="spinner" /> : "Generate Emails"}
      </button>
      {error && <div className="error-msg">{error}</div>}
    </div>
  );
};

export default GenerateButton;
