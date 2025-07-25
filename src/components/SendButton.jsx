import React from "react";
import "./SendButton.css";

const SendButton = ({ count, onClick, loading, disabled, error, success }) => {
  return (
    <div className="send-btn-wrapper">
      <div className="send-summary">
        You’re sending {count} email{count !== 1 ? "s" : ""}
      </div>
      <button
        className="send-btn"
        onClick={onClick}
        disabled={disabled || loading}
      >
        {loading ? <span className="spinner" /> : "Send Emails"}
      </button>
      {error && <div className="send-error">{error}</div>}
      {success && <div className="send-success">Emails sent successfully!</div>}
    </div>
  );
};

export default SendButton;
