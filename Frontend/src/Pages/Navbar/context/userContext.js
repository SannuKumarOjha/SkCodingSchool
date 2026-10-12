import { createContext, useState, useContext, useEffect } from "react";
import api from "../../../api";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 important

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.removeItem("user");
      setUser(null);
      setLoading(false);
      return () => {
        active = false;
      };
    }

    api.get("/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!active) return;
        const currentUser = response.data.user;
        if (currentUser?.isVerified !== true) {
          throw new Error("Account email is not verified.");
        }
        localStorage.setItem("user", JSON.stringify(currentUser));
        setUser(currentUser);
      })
      .catch(() => {
        if (!active) return;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);