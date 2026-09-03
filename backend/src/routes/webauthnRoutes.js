import express from "express";
import jwt from "jsonwebtoken";
import User from "../model/userSchema.js";
import userAuthentication from "../middleware/userAuthentication.js";
import {
  optionsRateLimiter,
  verifyRateLimiter,
  recoveryRateLimiter,
} from "../middleware/webauthnRateLimiter.js";
import {
  generateRegistrationOptionsHandler,
  verifyRegistrationResponseHandler,
  generateAuthenticationOptionsHandler,
  verifyAuthenticationResponseHandler,
  getCredentialsHandler,
  renameCredentialHandler,
  deleteCredentialHandler,
  generateReauthOptionsHandler,
  verifyReauthResponseHandler,
  requestRecoveryHandler,
  cancelRecoveryHandler,
  getRecoveryStatusHandler,
  recoveryRegistrationOptionsHandler,
  completeRecoveryHandler,
} from "../controllers/webauthnController/webauthnController.js";

const router = express.Router();

// Optional authentication middleware: populates req.user if valid token provided
const optionalUserAuth = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;
  const token = (authHeader && authHeader.split(" ")[1]) || "";
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded && decoded.userId) {
      const user = await User.findById(decoded.userId);
      if (user && user.status !== "blocked") {
        req.user = user;
      }
    }
  } catch (err) {
    // Ignore invalid or expired token for optional auth
  }
  next();
};

// --- Registration Endpoints ---
router.post(
  "/register/options",
  optionsRateLimiter,
  optionalUserAuth,
  generateRegistrationOptionsHandler
);
router.post(
  "/register/verify",
  verifyRateLimiter,
  optionalUserAuth,
  verifyRegistrationResponseHandler
);

// --- Authentication Endpoints (Discoverable / Usernameless) ---
router.post(
  "/authenticate/options",
  optionsRateLimiter,
  generateAuthenticationOptionsHandler
);
router.post(
  "/authenticate/verify",
  verifyRateLimiter,
  verifyAuthenticationResponseHandler
);

// --- Step-Up Re-Authentication Endpoints ---
router.post(
  "/reauth/options",
  optionsRateLimiter,
  userAuthentication,
  generateReauthOptionsHandler
);
router.post(
  "/reauth/verify",
  verifyRateLimiter,
  userAuthentication,
  verifyReauthResponseHandler
);

// --- Passkey Management Endpoints ---
router.get("/credentials", userAuthentication, getCredentialsHandler);
router.put("/credentials/:id", userAuthentication, renameCredentialHandler);
router.delete("/credentials/:id", userAuthentication, deleteCredentialHandler);

// --- Account Recovery Endpoints ---
router.post("/recovery/request", recoveryRateLimiter, requestRecoveryHandler);
router.get("/recovery/cancel/:cancelToken", cancelRecoveryHandler);
router.get("/recovery/status/:recoveryToken", getRecoveryStatusHandler);
router.post(
  "/recovery/options",
  optionsRateLimiter,
  recoveryRegistrationOptionsHandler
);
router.post(
  "/recovery/complete",
  verifyRateLimiter,
  completeRecoveryHandler
);

export default router;
