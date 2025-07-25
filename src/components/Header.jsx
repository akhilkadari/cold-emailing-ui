import React from "react";
import "./Header.css";

const Header = ({ isLoggedIn, user, onLogin, onLogout }) => {
  return (
    <header className="header">
      <div className="brand">Cold Emailer</div>
      <div className="header-actions">
        {isLoggedIn && user ? (
          <>
            <span className="user-profile">
              {user.name} ({user.email})
            </span>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="login-btn" onClick={onLogin}>
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
