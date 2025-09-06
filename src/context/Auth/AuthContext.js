import { createContext, useEffect, useState } from "react";

export const authContext = createContext();

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userCred = JSON.parse(localStorage.getItem("user"));
    if (userCred) {
      setUser(userCred);
    }
  }, []);

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  return (
    <authContext.Provider value={{ user, setUser, logout }}>
      {children}
    </authContext.Provider>
  );
}
