import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Nagivate } from "react-router-dom";

import { AuthContext } from "../auth";
import { get, post } from "../api";

export default function SelfProfile() {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [user, setUser] = useState({});

  const fetchUser = async () => {
    if (auth.authorized) {
      const res = await get("users/self", { token: auth.token }).then((r) =>
        r.json()
      );
      console.log("self", res);
      setUser(res);
    } else {
      navigate("/login");
    }
  };

  const performLogout = () => {
    console.log("logout");
    logout();
    navigate("/");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <div className="mb-3">
        <h2>Hi {user.username}!</h2>
        Email: {user.email}
        <div>
          <button className="btn btn-primary" onClick={performLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
