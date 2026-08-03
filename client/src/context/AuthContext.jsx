import React, { useEffect, useState } from "react";
import { useContext } from "react";

const AuthContext = React.createContext();

export const AuthProvider = (props) => {
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("CravingUser")) || "",
  );
  const [isLogin, setIsLogin] = useState(!!user);
  const [role, setRole] = useState(user?.role || "");

  useEffect(() => {
    setIsLogin(!!user);
    setRole(user?.role || "");
  }, [user]);

  const logout = () => {
    sessionStorage.removeItem("CravingUser");
    setUser(null);
    setIsLogin(false);
    setRole("");
  };

  const value = { user, setUser, isLogin, setIsLogin, role, setRole, logout };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);