import { useEffect, useState, useContext, createContext } from "react";

// CREDIT: https://dayvster.com/blog/use-context-for-auth
// and     https://dev.to/dancrtis/learn-to-usecontext-with-hooks-in-3-minutes-4c4g

export const AuthContext = createContext({
  token: "",
  id: "",
  username: "",
  authorized: false,
});

const useLocalStorage = () => {
  const [value, setValue] = useState(null);

  const setItem = (k, v) => {
    localStorage.setItem(k, v);
    setValue(v);
  };

  const getItem = (k) => {
    const v = localStorage.getItem(k);
    setValue(v);
    return v;
  };

  const removeItem = (k) => {
    localStorage.removeItem(k);
    setValue(null);
  };

  return { value, setItem, getItem, removeItem };
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() =>
    JSON.parse(localStorage.getItem("auth")));

  useEffect(() => {
    try {
      localStorage.setItem("auth", JSON.stringify(auth));
    } catch (e) {
      console.log(e);
    }
  }, [auth]);

  const login = (token, id, username) => {
    setAuth({ token, id, username, authorized: true });
  };

  const logout = () => {
    setAuth({ token: "", id: "", username: "", authorized: false });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
