const { createContext, useState } = require("react");

const themeContext = createContext();
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    // setTheme(theme === "light"? "dark" : "light");
    setTheme((prevState) => (prevState === "light" ? "dark" : "light"));
  };
  return (
    <themeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </themeContext.Provider>
  );
};

export { ThemeProvider, themeContext };
