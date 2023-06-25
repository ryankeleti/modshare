import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { get } from "../api";

export default function Search() {
  const [results, setResults] = useState([]);
  const [params, setParams] = useSearchParams();

  const search = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    console.log(data);
    setParams({ criteria: data.get("criteria").toString() });
    await fetchSearch();
  };

  const fetchSearch = async () => {
    if (params) {
      const criteria = params.get("criteria");
      if (criteria) {
        console.log("criteria", criteria);
        if (criteria) {
          await get(`modrinth/search?criteria=${criteria.toString()}`)
            .then((resp) => resp.json())
            .then((data) => setResults(data.hits));
        }
      }
    }
  };

  const SearchItem = ({ item }) => {
    return (
      <a
        href={`details/${item.project_id}`}
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
    );
  };

  useEffect(() => {
    fetchSearch();
  }, [params]);

  return (
    <>
      <form onSubmit={search}>
        <div className="form-search m-auto input-group mb-3">
          <input
            id="input-search"
            type="search"
            className="form-control"
            placeholder="Search"
            name="criteria"
          />
          <button className="btn btn-outline-primary" type="submit">
            Search
          </button>
        </div>
      </form>
      <div className="search-results w-100 m-auto">
        {results.length ? (
          <div className="list-group">
            {results.map((item) => (
              <SearchItem item={item} />
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
