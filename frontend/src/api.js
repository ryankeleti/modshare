const API_BASE = `http://localhost:4000/api`;

export const get = async (path, options) => {
  const url = `${API_BASE}/${path}`;

  const headers = {};

  if (options && options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  return await fetch(url, {
    method: "GET",
    headers,
    mode: "cors",
  });
};

export const post = async (path, body, options) => {
  const url = `${API_BASE}/${path}`;

  const headers = {
    "Content-Type": "application/json",
  };

  if (options && options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  return await fetch(url, {
    method: "POST",
    headers,
    mode: "cors",
    body: JSON.stringify(body),
  });
};

export const put = async (path, body, options) => {
  const url = `${API_BASE}/${path}`;

  const headers = {
    "Content-Type": "application/json",
  };

  if (options && options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  return await fetch(url, {
    method: "PUT",
    headers,
    mode: "cors",
    body: JSON.stringify(body),
  });
};

export const del = async (path, options) => {
  const url = `${API_BASE}/${path}`;

  const headers = {};

  if (options && options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  return await fetch(url, {
    method: "DELETE",
    headers,
    mode: "cors",
  });
};
