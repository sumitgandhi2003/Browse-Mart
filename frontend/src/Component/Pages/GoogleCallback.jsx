import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Context/authContext";
import { useTheme } from "../../Context/themeContext";

/**
 * GoogleCallback Page
 * This page lives at /auth/google/callback.
 * Google redirects here with ?code=XXXX after the user approves.
 * We forward the code to the backend, receive a JWT, and log the user in.
 */
const GoogleCallback = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthToken } = useAuth();
  const { theme } = useTheme();
  const hasCalled = useRef(false); // Prevent double-call in StrictMode

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // User denied access on Google's screen
    if (error || !code) {
      navigate("/login?error=google_cancelled");
      return;
    }

    // Exchange the code for a JWT from our backend
    axios
      .post(`${SERVER_URL}/api/auth/google/callback`, { code })
      .then((response) => {
        if (response.status === 200 && response.data?.AuthToken) {
          localStorage.setItem("AuthToken", response.data.AuthToken);
          setAuthToken(response.data.AuthToken);
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("Google callback error:", err);
        const msg =
          err?.response?.data?.message || "Google login failed. Try again.";
        navigate(`/login?error=${encodeURIComponent(msg)}`);
      });
  }, []);

  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center gap-4 ${
        theme === "dark" ? "bg-gray-950 text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Animated Google-colored spinner */}
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
        <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center shadow-inner">
          {/* Google "G" logo colors */}
          <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        </div>
      </div>

      <p className="text-sm font-medium tracking-wide opacity-70">
        Completing Google sign-in…
      </p>
    </div>
  );
};

export default GoogleCallback;
