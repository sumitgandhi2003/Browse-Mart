import dotenv from "dotenv";
dotenv.config();

const cleanRpID = (rpId) => {
  if (!rpId) return "localhost";
  return rpId.replace(/^https?:\/\//i, "").split(":")[0];
};

export const RP_NAME = process.env.RP_NAME || "BrowseMart";
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
