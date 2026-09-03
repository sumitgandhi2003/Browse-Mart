import dotenv from "dotenv";
dotenv.config();

export const cleanRpID = (rpId) => {
  if (!rpId) return "localhost";
  return rpId
    .trim()
    .replace(/^https?:\/\//i, "")
    .split("/")[0]
    .split(":")[0]
    .toLowerCase();
};

export const RP_NAME = process.env.RP_NAME || "BrowseMart";

/**
 * Dynamically resolves the RP_ID.
 * If explicitly set in environment variables and not localhost, uses it.
 * Otherwise, extracts the client's hostname from the incoming request's Origin or Referer.
 */
export const getRpID = (req) => {
  // If explicitly set in production/env (and not default "localhost"), use it
  if (process.env.RP_ID && process.env.RP_ID.trim().toLowerCase() !== "localhost") {
    return cleanRpID(process.env.RP_ID);
  }

  // Auto-detect from client origin / referer header
  const clientOrigin = req?.headers?.origin || req?.headers?.referer;
  if (clientOrigin) {
    try {
      const parsed = new URL(clientOrigin);
      if (
        parsed.hostname &&
        parsed.hostname !== "localhost" &&
        parsed.hostname !== "127.0.0.1"
      ) {
        return cleanRpID(parsed.hostname);
      }
    } catch (e) {
      // ignore URL parse errors
    }
  }

  // Fallback to configured RP_ID or "localhost"
  return cleanRpID(process.env.RP_ID || "localhost");
};

/**
 * Dynamically resolves the expected origin for verification.
 * If explicitly set in environment, uses it.
 * Otherwise, uses the client's Origin header.
 */
export const getExpectedOrigin = (req) => {
  if (process.env.EXPECTED_ORIGIN) {
    return process.env.EXPECTED_ORIGIN.trim().replace(/\/$/, "");
  }

  const clientOrigin = req?.headers?.origin;
  if (clientOrigin) {
    return clientOrigin.trim().replace(/\/$/, "");
  }

  if (process.env.CORS_ORIGIN_URL) {
    return process.env.CORS_ORIGIN_URL.trim().replace(/\/$/, "");
  }

  return "http://localhost:5173";
};

// Backwards-compatible constants
export const RP_ID = cleanRpID(process.env.RP_ID || "localhost");
export const EXPECTED_ORIGIN =
  process.env.EXPECTED_ORIGIN ||
  process.env.CORS_ORIGIN_URL ||
  "http://localhost:5173";

export const RECOVERY_COOLING_OFF_HOURS =
  Number(process.env.RECOVERY_COOLING_OFF_HOURS) || 24;

export const checkHttpsRequirement = (req) => {
  if (process.env.NODE_ENV !== "production") {
    return true; // Allow http in development
  }

  const hostname = req.hostname || req.headers.host || "";
  if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    return true;
  }

  const isHttps =
    req.secure || req.headers["x-forwarded-proto"] === "https";

  return isHttps;
};
