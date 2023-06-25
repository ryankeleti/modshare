import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "./auth";

export default function Nav() {
  const { auth } = useContext(AuthContext);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-transparent mb-3">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            ⚙️ Modshare
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar-content"
            aria-controls="navbar-content"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbar-content">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {!auth.authorized && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>
              )}
              {!auth.authorized && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Register
                  </NavLink>
                </li>
              )}
              {auth.authorized && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">
                    Profile ({auth.username})
                  </NavLink>
                </li>
              )}
              <li className="nav-item">
                <NavLink className="nav-link" to="/search">
                  Search
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/about">
                  About
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
