const { createContext, useState, useContext, useEffect } = require("react");
const authContext = createContext();
const useAuth = () => useContext(authContext);
const AuthProvider = ({ children }) => {
  //   const [theme, setTheme] = useState(() => {
  //     return localStorage.getItem("theme") || "dark";
  //   });
  //   const toggleTheme = () => {
  //     // setTheme(theme === "light"? "dark" : "light");
  //     setTheme((prevState) => (prevState === "light" ? "dark" : "light"));
  //   };
  //   useEffect(() => {
  //     localStorage.setItem("theme", theme);
  //   }, [theme]);

  const [authToken, setAuthToken] = useState(
    () => localStorage.getItem("AuthToken") || null
  );
  return (
    <authContext.Provider value={{ authToken, setAuthToken }}>
      {children}
    </authContext.Provider>
  );
};

export { AuthProvider, authContext, useAuth };
