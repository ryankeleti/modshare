import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Nagivate } from "react-router-dom";

import { AuthContext } from "../auth";
import { get, post } from "../api";

export default function SelfProfile() {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [email, setEmail] = useState("");
  const [saves, setSaves] = useState([]);

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

  const fetchSaves = async () => {
    const saveIds = await get(`saves/user/${auth.id}`, {
      token: auth.token,
    }).then((r) => r.json());
    console.log(saveIds);

    const saves = await Promise.all(
      saveIds.map(
        async ({ modrinth_id }) =>
          await get(`modrinth/projects/${modrinth_id}`).then((r) => r.json())
      )
    );

    console.log(saves);
    setSaves(saves);
  };

  const performLogout = () => {
    console.log("logout");
    logout();
    navigate("/");
  };

  const changeEmail = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    fetchUser();
    fetchSaves();
  }, []);

  return (
    <>
      <div className="mb-3">
        <h2>Hi {user.username}!</h2>
        Email: {user.email}
      </div>
      <form onSubmit={changeEmail}>
        <div className="m-auto input-group mb-3">
          <input
            id="input-email"
            type="email"
            className="form-control"
            placeholder="changed@address.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn btn-outline-primary" type="submit">
            Change email
          </button>
        </div>
      </form>

      <div className="mb-3">
        <button className="btn btn-primary" onClick={performLogout}>
          Logout
        </button>
      </div>
      <div className="mb-3 list-group">
        <h2>My saves</h2> <hr />
        {saves.length &&
          saves.map((save) => (
            <a
              href={`/details/${save.id}`}
              className="list-group-item list-group-item-action"
            >
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{save.title}</h5>
                <img
                  src={save.icon_url}
                  className="img-thumbnail rounded mb-1"
                  alt="Project icon"
                  width="100px"
                  height="100px"
                />
              </div>
              <small>{save.description}</small>
            </a>
          ))}
      </div>
    </>
  );
}
