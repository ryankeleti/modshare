import React, { useEffect, useState, useContext } from "react";

import { AuthContext } from "../auth";
import { get } from "../api";

export default function Root() {
  const [randomProjects, setRandomProjects] = useState([]);
  const { auth } = useContext(AuthContext);
  console.log("root auth", auth);

  const fetchRandomProjects = () => {
    get("modrinth/random")
      .then((resp) => resp.json())
      .then((data) => setRandomProjects(data));
  };

  useEffect(() => fetchRandomProjects(), []);

  return (
    <>
      <div>
        {!auth.authorized && (
          <ul>
            {randomProjects.map((project) => (
              <li>{project.title}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
