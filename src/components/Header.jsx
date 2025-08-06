import React from "react";
import "./Header.css";

const Header = ({ isLoggedIn, user, onLogout }) => {
  return (
    <header className="header">
      <div className="brand">Cold Emailer</div>
      <div className="header-actions">
        {isLoggedIn && user ? (
          <>
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
