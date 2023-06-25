import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../auth";
import { get, post } from "../api";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const performLogin = async (e) => {
    e.preventDefault();

    const authRes = await post(`auth/login`, { username, password }).then((r) =>
      r.json()
    );

    console.log("auth", authRes);
    const token = authRes.token;

    const user = await get("users/self", {token}).then((r) => r.json());
    console.log("user", user);

    if (token) {
      login(token, user.id, username);
      navigate("/");
    } else {
      alert("Login failed!");
    }
  };

  return (
    <>
      <form onSubmit={performLogin}>
        <div className="mb-3">
          <label htmlFor="input-username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="input-username"
            value={username}
            placeholder="my-unique-name"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="input-password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="input-password"
            value={password}
            placeholder="my secret password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </>
  );
}
