import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";

import { AuthContext } from "../auth";
import { get, post } from "../api";

export default function Profile() {
  const { auth } = useContext(AuthContext);
  const { uid } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [saves, setSaves] = useState([]);

  const fetchUser = async () => {
    const user = await get(`users/${uid}`).then((r) => r.json());
    console.log("profile for", user);
    setUser(user);
  };

  const fetchSaves = async () => {
    const saveIds = await get(`saves/user/${uid}`, { token: auth.token }).then(
      (r) => r.json()
    );
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

  useEffect(() => {
    fetchUser();
    fetchSaves();
  }, []);

  return (
    <>
      <div className="mb-3">
        {user.error && <p>No such user!</p>}
        {user.username && (
          <h1>
            {user.username}
            {"'"}s profile
          </h1>
        )}
      </div>

      <div className="list-group">
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
