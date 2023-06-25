import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";

import { AuthContext } from "../auth";
import { get, post } from "../api";

export default function Profile() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { uid } = useParams();

  const [user, setUser] = useState({});

  const fetchUser = async () => {
    const user = await get(`users/${uid}`).then((r) => r.json());
    console.log("profile for", user);
    setUser(user);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <div className="mb-3">
        {user.error && <p>No such user!</p>}
        {user.username && <p>{user.username}</p>}
      </div>
    </>
  );
}
