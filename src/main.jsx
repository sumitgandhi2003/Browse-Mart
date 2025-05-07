import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./Component/App/App.jsx";
import { CartProvider } from "./Context/cartContext.jsx";
import { ThemeProvider } from "./Context/themeContext.jsx";
import { AuthProvider } from "./Context/authContext.jsx";
import { UserProvider } from "./Context/userContext.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <ThemeProvider>
    <AuthProvider>
      <UserProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </UserProvider>
    </AuthProvider>
  </ThemeProvider>
  // </StrictMode>
);
