import React, { useState, useContext } from "react";

import { AuthContext } from "../auth";
import { post } from "../api";

export default function Register() {
  const roles = ["user", "moderator", "admin"];

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(roles[0]);

  const register = async (e) => {
    e.preventDefault();
    await post("auth/register", { username, email, password, role });
  };

  return (
    <>
      <form onSubmit={register}>
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
          <label htmlFor="input-email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="input-email"
            value={email}
            placeholder="me@mail.com"
            onChange={(e) => setEmail(e.target.value)}
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
            placeholder="something secret"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="input-role" className="form-label">
            Role
          </label>
          <select
            className="form-select"
            id="input-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </>
  );
}
