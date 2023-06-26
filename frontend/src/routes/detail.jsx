import React, { useEffect, useState, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { AuthContext } from "../auth";
import { get, post } from "../api";

export default function Detail() {
  const { pid } = useParams();
  const { auth } = useContext(AuthContext);
  const [project, setProject] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchProject = async () => {
    console.log("pid", pid);
    const result = await get(`modrinth/projects/${pid}`).then((r) => r.json());
    setProject(result);
    if (auth.authorized) {
      const modSave = await get(`saves/user/${auth.id}/${pid}`, {
        token: auth.token,
      }).then((r) => r.json());
      if (modSave && !modSave.error) {
        console.log("modSave", modSave);
        setIsSaved(true);
      }
    }
  };

  const fetchUsers = async () => {
    const users = await get(`saves/${pid}/users`, { token: auth.token }).then(
      (r) => r.json()
    );
    console.log(users);
    setUsers(users);
  };

  const saveProject = async (e) => {
    e.preventDefault();
    await post(
      "saves",
      { modrinth_id: pid, saved_by: auth.id, is_private: isPrivate },
      { token: auth.token }
    );
    setIsSaved(true);
  };

  const unsaveProject = async () => {
    setIsSaved(false);
  };

  useEffect(() => {
    fetchProject();
    fetchUsers();
  }, []);

  return (
    <>
      <div className="mb-3">
        <h2>{project.title}</h2>

        <p>{project.description}</p>
        <p><a href={`https://modrinth.com/project/${project.id}`}>View on Modrinth</a></p>

        {auth.authorized ? (
          isSaved ? (
            <button
              type="button"
              className="btn btn-danger"
              onClick={unsaveProject}
            >
              Unsave
            </button>
          ) : (
            <form onSubmit={saveProject}>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="input-privacy"
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="input-privacy">
                  Private
                </label>
              </div>
              <button type="submit" className="btn btn-success">
                Save
              </button>
            </form>
          )
        ) : (
          <p>
            To save a mod, please <a href="/login">login</a>.
          </p>
        )}
      </div>
      <div className="mb-3 list-group">
        {users.length ? (
          users.map(({ saved_by }) => (
            <a
              href={`/profile/${saved_by._id}`}
              className="list-group-item list-group-item-action"
            >
              <h5 className="mb-1">Saved by {saved_by.username}</h5>
            </a>
          ))
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
