import React, {
  useState,
  useContext,
  createContext,
  useLayoutEffect
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  return (
    <AuthContext.Provider value={AuthValue()}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

function AuthValue() {
  const [isAuth, setIsAuth] = useState();

  const login = async (username) => {
    localStorage.setItem("access-token", username);
    localStorage.setItem("username", username);
    localStorage.setItem("userId", username);
    setIsAuth(true);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("access-token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setIsAuth(false);
    return true;
  };

  useLayoutEffect(() => {
    setIsAuth(!!localStorage.getItem("access-token"));
  }, []);

  return {
    isAuth,
    login,
    logout
  };
}
