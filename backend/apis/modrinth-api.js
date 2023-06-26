// Wrapper around modrinth API.
// https://docs.modrinth.com/api-spec/

import express from "express";

const API_BASE = "https://api.modrinth.com/v2";

const get = async (path) => {
  const url = `${API_BASE}/${path}`;

  console.log(`GET ${url}`);

  return await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "modshare",
    },
    mode: "cors",
  });
};

const modrinthApi = express.Router();

modrinthApi.get("/search", async (req, res) => {
  const facets = [
    [
      "categories:'forge'",
      "categories:'fabric'",
      "categories:'quilt'",
      "categories:'liteloader'",
      "categories:'modloader'",
      "categories:'rift'",
    ],
    ["project_type:mod"],
  ];
  const query = req.query.criteria;
  const results = await get(
    `search?query=${query}&limit=30&facets=${JSON.stringify(
      facets
    )}&index=relevance`
  ).then((r) => r.json());
  res.json(results);
});

modrinthApi.get("/random", async (req, res) => {
  const results = await get(`projects_random?count=20`).then((r) => r.json());
  res.json(results);
});

modrinthApi.get("/projects/:pid", async (req, res) => {
  const pid = req.params.pid;
  if (pid !== undefined && pid) {
    const project = await get(`project/${pid}`).then((r) => r.json());
    res.json(project);
  }
});

export default modrinthApi;
