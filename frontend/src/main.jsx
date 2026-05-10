import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./Component/App/App.jsx";
import { CartProvider } from "./Context/cartContext.jsx";
import { ThemeProvider } from "./Context/themeContext.jsx";
import { AuthProvider } from "./Context/authContext.jsx";
import { UserProvider } from "./Context/userContext.jsx";
import { CategoryProvider } from "./Context/categoryContext.jsx";
import PwaManager from "./Component/PWA/PwaManager.jsx";

// Suppress Chrome extension errors silently
try {
  if (typeof chrome !== "undefined" && chrome?.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener(() => true);
  }
} catch (e) {
  // Silently ignore chrome API errors
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <CartProvider>
            <CategoryProvider>
              <App />
              {/* <PwaManager /> */}
            </CategoryProvider>
          </CartProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
