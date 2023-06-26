import React, { useEffect, useState, useContext } from "react";

import { AuthContext } from "../auth";
import { get } from "../api";

export default function Root() {
  const [randomProjects, setRandomProjects] = useState([]);
  const [following, setFollowing] = useState([]);
  const { auth } = useContext(AuthContext);

  const fetchRandomProjects = async () => {
    await get("modrinth/random")
      .then((resp) => resp.json())
      .then((data) => setRandomProjects(data));
  };

  const fetchFollowing = async () => {
    if (auth.authorized) {
      const result = await get(`users/${auth.id}/following`).then((r) =>
        r.json()
      );
      console.log("following", result);
      setFollowing(result);
    }
  };

  useEffect(() => {
    fetchRandomProjects();
    fetchFollowing();
  }, []);

  return (
    <>
      <div>
        {auth.authorized && (
          <>
            <h2>Following</h2>
            <div className="mb-3 list-group">
              {following.map(({ followee }) => (
                <a
                  href={`/profile/${followee._id}`}
                  className="list-group-item list-group-item-action"
                >
                  {followee.username}
                </a>
              ))}
            </div>
          </>
        )}
        <h2>Explore</h2>
        <div className="list-group">
          {randomProjects.map((item) => (
            <a
              href={`/details/${item.id}`}
              className="list-group-item list-group-item-action"
            >
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{item.title}</h5>
                <img
                  src={item.icon_url}
                  className="img-thumbnail rounded mb-1"
                  alt="Project icon"
                  width="100px"
                  height="100px"
                />
              </div>
              <small>{item.description}</small>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
