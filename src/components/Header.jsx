import React from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ isLoggedIn, user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="brand" onClick={() => navigate("/")}>
        Cold Email Generator
      </div>
      <div className="header-actions">
        {isLoggedIn && user ? (
          <>
            <Link className="logout-btn" to="/chat">
              Find Connections
            </Link>

            <span className="user-profile">{user.email}</span>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
