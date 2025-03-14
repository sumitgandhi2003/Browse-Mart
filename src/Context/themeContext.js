const { createContext, useState, useContext, useEffect } = require("react");

const themeContext = createContext();
const useTheme = () => useContext(themeContext);
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });
  const toggleTheme = () => {
    // setTheme(theme === "light"? "dark" : "light");
    setTheme((prevState) => (prevState === "light" ? "dark" : "light"));
  };
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <themeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </themeContext.Provider>
  );
};

export { ThemeProvider, themeContext, useTheme };
