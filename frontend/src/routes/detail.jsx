import React, { useEffect, useState, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { AuthContext } from "../auth";
import { get, post } from "../api";

export default function Detail() {
  const { pid } = useParams();
  const { auth } = useContext(AuthContext);
  const [project, setProject] = useState({});
  const [isSaved, setIsSaved] = useState(false);

  const fetchProject = async () => {
    const result = await get(`modrinth/projects/${pid}`).then((r) => r.json());
    setProject(result);
    if (auth.authorized) {
      const modSave = await get(`saves/user/${auth.id}/${pid}`, { token: auth.token }).then((r) =>
        r.json()
      );
      if (modSave && !modSave.error) {
        setIsSaved(true);
      }
    }
  };

  const saveProject = async (is_private) => {
    await post("saves", { modrinth_id: pid, saved_by: auth.id, is_private }, { token: auth.token});
  };

  const unsaveProject = async () => {};

  useEffect(() => {
    fetchProject();
  }, []);

  return (
    <>
      <div className="mb-3">
        <h2>{project.title}</h2>

        <p>{project.description}</p>

        {auth.authorized ? (
          isSaved ? (
            <button type="button" className="btn btn-danger" onClick={unsaveProject}>Unsave</button>
          ) : (
            <button type="button" className="btn btn-success" onClick={() => saveProject(false)}>Save</button>
          )
        ) : (
          <p>
            To save mod, please <a href="/login">login</a>.
          </p>
        )}
      </div>
    </>
  );
}
