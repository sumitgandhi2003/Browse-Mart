import crypto from "crypto";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";

import User from "../../model/userSchema.js";
import WebauthnCredential from "../../model/webauthnCredentialSchema.js";
import WebauthnChallenge from "../../model/webauthnChallengeSchema.js";
import WebauthnRecovery from "../../model/webauthnRecoverySchema.js";
import sendOtpEmail from "../../services/otpService.js";
import {
  RP_NAME,
  RP_ID,
  EXPECTED_ORIGIN,
  RECOVERY_COOLING_OFF_HOURS,
  checkHttpsRequirement,
  getRpID,
  getExpectedOrigin,
} from "../../config/webauthnConfig.js";
import {
  sendPasskeyAddedEmail,
  sendPasskeyRemovedEmail,
  sendRecoveryEmailVerification,
  sendPasskeyRecoveryInitiatedEmail,
  sendPasskeyRecoveryCancelledEmail,
} from "../../services/webauthnEmailService.js";

// Helper to generate a step-up token
const generateStepUpToken = (userId) => {
  return jwt.sign(
    { userId: userId.toString(), purpose: "passkey_step_up" },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "5m" }
  );
};

// 1. Generate Registration Options
export const generateRegistrationOptionsHandler = async (req, res) => {
  try {
    if (!checkHttpsRequirement(req)) {
      return res.status(400).json({
        success: false,
        message: "WebAuthn requires HTTPS in production environments.",
      });
    }

    let user = req.user;
    let email = req.body.email?.toLowerCase().trim();
    let name = req.body.name?.trim();

    let userIdString;
    let existingCredentials = [];

    if (user) {
      // User is already logged in and adding an additional passkey
      userIdString = user._id.toString();
      email = user.email;
      name = user.name;
      existingCredentials = await WebauthnCredential.find({ user_id: user._id });
    } else {
      // New user registration
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required to register a passkey.",
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        user = existingUser;
        userIdString = existingUser._id.toString();
        name = existingUser.name;
        existingCredentials = await WebauthnCredential.find({
          user_id: existingUser._id,
        });
      } else {
        // Create an ObjectId for the new user
        userIdString = new mongoose.Types.ObjectId().toString();
      }
    }

    const rpID = getRpID(req);
    const origin = getExpectedOrigin(req);

    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID,
      userID: new Uint8Array(Buffer.from(userIdString)),
      userName: email,
      userDisplayName: name || email,
      attestationType: "none",
      excludeCredentials: existingCredentials.map((cred) => ({
        id: cred.credential_id,
        transports: cred.transports || [],
      })),
      authenticatorSelection: {
        residentKey: "required",
        userVerification: "required",
      },
    });

    const challengeKey = crypto.randomUUID();
    await WebauthnChallenge.create({
      challenge: options.challenge,
      challengeKey,
      user_id: user ? user._id : null,
      email,
      name,
      userHandle: userIdString,
      type: "registration",
      rpID,
      origin,
    });

    return res.status(200).json({
      success: true,
      options,
      challengeKey,
    });
  } catch (error) {
    console.error("Error generating registration options:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate passkey registration options.",
      error: error.message,
    });
  }
};

// 2. Verify Registration Response
export const verifyRegistrationResponseHandler = async (req, res) => {
  try {
    const { attResp, challengeKey, deviceName } = req.body;
    if (!attResp || !challengeKey) {
      return res.status(400).json({
        success: false,
        message: "Missing passkey response or challenge key.",
      });
    }

    const storedChallenge = await WebauthnChallenge.findOne({
      challengeKey,
      type: "registration",
    });

    if (!storedChallenge) {
      return res.status(400).json({
        success: false,
        message: "Registration challenge has expired or is invalid. Please try again.",
      });
    }

    const expectedRPID = storedChallenge.rpID || getRpID(req);
    const expectedOrigin = storedChallenge.origin || getExpectedOrigin(req);

    const verification = await verifyRegistrationResponse({
      response: attResp,
      expectedChallenge: storedChallenge.challenge,
      expectedOrigin,
      expectedRPID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return res.status(400).json({
        success: false,
        message: "Passkey registration verification failed.",
      });
    }

    const { registrationInfo } = verification;
    const credentialID =
      registrationInfo.credential?.id || attResp.id;
    const credentialPublicKey = Buffer.from(
      registrationInfo.credential?.publicKey
    );
    const counter = registrationInfo.credential?.counter ?? 0;
    const transports =
      registrationInfo.credential?.transports ||
      attResp.response?.transports ||
      [];
    const backedUp = !!registrationInfo.credentialBackedUp;

    let user = req.user;
    if (!user) {
      if (storedChallenge.user_id) {
        user = await User.findById(storedChallenge.user_id);
      }
      if (!user) {
        user = await User.findOne({ email: storedChallenge.email });
      }
      if (!user) {
        // Create new passwordless user
        user = new User({
          _id: storedChallenge.userHandle
            ? new mongoose.Types.ObjectId(storedChallenge.userHandle)
            : new mongoose.Types.ObjectId(),
          name: storedChallenge.name || "Passkey User",
          email: storedChallenge.email,
          password: null,
          hasPassword: false,
          isVerified: false,
          recovery_email_verified_at: null,
          status: "active",
        });
        await user.save();
      }
    }

    // Save the passkey credential
    await WebauthnCredential.create({
      user_id: user._id,
      credential_id: credentialID,
      public_key: credentialPublicKey,
      sign_count: counter,
      transports,
      device_name: deviceName || "Passkey Device",
      backed_up: backedUp,
    });

    // Delete the used challenge
    await WebauthnChallenge.deleteOne({ _id: storedChallenge._id });

    // Trigger recovery email verification if not yet verified
    if (!user.recovery_email_verified_at) {
      try {
        const hashedOtp = await sendOtpEmail(
          user.email,
          "Verify Your BrowseMart Recovery Email"
        );
        if (hashedOtp) {
          user.otp = hashedOtp;
          user.otpExpireAt = new Date(Date.now() + 10 * 60 * 1000);
          await user.save();
        }
      } catch (err) {
        console.error("Error triggering recovery email verification:", err);
      }
    }

    // Send security notification email
    sendPasskeyAddedEmail({
      to: user.email,
      name: user.name,
      deviceName: deviceName || "Passkey Device",
    }).catch((err) => console.error("Error sending passkey added email:", err));

    const token = await user.generateToken();

    return res.status(200).json({
      success: true,
      verified: true,
      AuthToken: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hasPassword: user.hasPassword,
        isVerified: user.isVerified,
        recovery_email_verified_at: user.recovery_email_verified_at,
      },
    });
  } catch (error) {
    console.error("Error verifying registration response:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify passkey registration.",
      error: error.message,
    });
  }
};

// 3. Generate Authentication Options (Discoverable / Usernameless)
export const generateAuthenticationOptionsHandler = async (req, res) => {
  try {
    if (!checkHttpsRequirement(req)) {
      return res.status(400).json({
        success: false,
        message: "WebAuthn requires HTTPS in production environments.",
      });
    }

    const rpID = getRpID(req);
    const origin = getExpectedOrigin(req);

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: [], // Discoverable credential / usernameless
      userVerification: "required",
    });

    const challengeKey = crypto.randomUUID();
    await WebauthnChallenge.create({
      challenge: options.challenge,
      challengeKey,
      type: "authentication",
      rpID,
      origin,
    });

    return res.status(200).json({
      success: true,
      options,
      challengeKey,
    });
  } catch (error) {
    console.error("Error generating authentication options:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate passkey authentication options.",
      error: error.message,
    });
  }
};

// 4. Verify Authentication Response
export const verifyAuthenticationResponseHandler = async (req, res) => {
  try {
    const { authResp, challengeKey } = req.body;
    if (!authResp || !challengeKey) {
      return res.status(400).json({
        success: false,
        message: "Missing authentication response or challenge key.",
      });
    }

    const storedChallenge = await WebauthnChallenge.findOne({
      challengeKey,
      type: "authentication",
    });

    if (!storedChallenge) {
      return res.status(400).json({
        success: false,
        message: "Authentication challenge has expired or is invalid. Please try again.",
      });
    }

    // Look up credential by ID
    const credentialId = authResp.id;
    const cred = await WebauthnCredential.findOne({
      credential_id: credentialId,
    });

    if (!cred) {
      return res.status(404).json({
        success: false,
        message: "Passkey not recognized for this account.",
      });
    }

    // Confirm userHandle matches credential owner if userHandle is provided
    if (authResp.response?.userHandle) {
      let handleStr = "";
      try {
        handleStr = Buffer.from(
          authResp.response.userHandle,
          "base64url"
        ).toString("utf8");
      } catch (e) {
        handleStr = authResp.response.userHandle;
      }
      if (
        handleStr &&
        cred.user_id.toString() !== handleStr &&
        cred.user_id.toString() !== authResp.response.userHandle
      ) {
        return res.status(401).json({
          success: false,
          message: "Passkey identity mismatch.",
        });
      }
    }

    const user = await User.findById(cred.user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    if (user.status === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended by the administrator.",
      });
    }

    const expectedRPID = storedChallenge.rpID || getRpID(req);
    const expectedOrigin = storedChallenge.origin || getExpectedOrigin(req);

    const verification = await verifyAuthenticationResponse({
      response: authResp,
      expectedChallenge: storedChallenge.challenge,
      expectedOrigin,
      expectedRPID,
      credential: {
        id: cred.credential_id,
        publicKey: cred.public_key,
        counter: cred.sign_count,
        transports: cred.transports || [],
      },
    });

    if (!verification.verified || !verification.authenticationInfo) {
      return res.status(401).json({
        success: false,
        message: "Passkey authentication verification failed.",
      });
    }

    const { newCounter } = verification.authenticationInfo;

    // Check for sign count regression (log as signal, do not hard-block)
    if (newCounter < cred.sign_count && newCounter !== 0) {
      console.warn(
        `[Passkey Signal] Sign count regression detected for credential ${cred.credential_id}. Previous: ${cred.sign_count}, New: ${newCounter}`
      );
    }

    // Update credential usage
    cred.sign_count = newCounter;
    cred.last_used_at = new Date();
    await cred.save();

    // Delete used challenge
    await WebauthnChallenge.deleteOne({ _id: storedChallenge._id });

    // Issue JWT session token
    const token = await user.generateToken();

    return res.status(200).json({
      success: true,
      verified: true,
      AuthToken: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hasPassword: user.hasPassword,
        isVerified: user.isVerified,
        recovery_email_verified_at: user.recovery_email_verified_at,
      },
    });
  } catch (error) {
    console.error("Error verifying authentication response:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify passkey authentication.",
      error: error.message,
    });
  }
};

// 5. Get Registered Passkeys for Current User
export const getCredentialsHandler = async (req, res) => {
  try {
    const credentials = await WebauthnCredential.find({
      user_id: req.user._id,
    }).sort({ created_at: -1 });

    const sanitized = credentials.map((cred) => ({
      id: cred._id,
      device_name: cred.device_name,
      created_at: cred.created_at,
      last_used_at: cred.last_used_at,
      backed_up: cred.backed_up,
      transports: cred.transports,
    }));

    return res.status(200).json({
      success: true,
      credentials: sanitized,
    });
  } catch (error) {
    console.error("Error fetching passkeys:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve registered passkeys.",
    });
  }
};

// 6. Rename a Passkey
export const renameCredentialHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { device_name } = req.body;

    if (!device_name || !device_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Device name cannot be empty.",
      });
    }

    const cred = await WebauthnCredential.findOne({
      _id: id,
      user_id: req.user._id,
    });

    if (!cred) {
      return res.status(404).json({
        success: false,
        message: "Passkey not found.",
      });
    }

    cred.device_name = device_name.trim();
    await cred.save();

    return res.status(200).json({
      success: true,
      message: "Passkey renamed successfully.",
      credential: {
        id: cred._id,
        device_name: cred.device_name,
        created_at: cred.created_at,
        last_used_at: cred.last_used_at,
        backed_up: cred.backed_up,
      },
    });
  } catch (error) {
    console.error("Error renaming passkey:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to rename passkey.",
    });
  }
};

// 7. Step-Up Re-Authentication Options
export const generateReauthOptionsHandler = async (req, res) => {
  try {
    const credentials = await WebauthnCredential.find({
      user_id: req.user._id,
    });

    if (credentials.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No passkeys registered for this account.",
      });
    }

    const rpID = getRpID(req);
    const origin = getExpectedOrigin(req);

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: credentials.map((cred) => ({
        id: cred.credential_id,
        transports: cred.transports || [],
      })),
      userVerification: "required",
    });

    const challengeKey = crypto.randomUUID();
    await WebauthnChallenge.create({
      challenge: options.challenge,
      challengeKey,
      user_id: req.user._id,
      type: "reauth",
      rpID,
      origin,
    });

    return res.status(200).json({
      success: true,
      options,
      challengeKey,
    });
  } catch (error) {
    console.error("Error generating reauth options:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate re-authentication options.",
    });
  }
};

// 8. Step-Up Re-Authentication Verify
export const verifyReauthResponseHandler = async (req, res) => {
  try {
    const { authResp, challengeKey } = req.body;
    if (!authResp || !challengeKey) {
      return res.status(400).json({
        success: false,
        message: "Missing authentication response or challenge key.",
      });
    }

    const storedChallenge = await WebauthnChallenge.findOne({
      challengeKey,
      type: "reauth",
      user_id: req.user._id,
    });

    if (!storedChallenge) {
      return res.status(400).json({
        success: false,
        message: "Re-authentication challenge expired. Please try again.",
      });
    }

    const cred = await WebauthnCredential.findOne({
      credential_id: authResp.id,
      user_id: req.user._id,
    });

    if (!cred) {
      return res.status(404).json({
        success: false,
        message: "Passkey not found on your account.",
      });
    }

    const expectedRPID = storedChallenge.rpID || getRpID(req);
    const expectedOrigin = storedChallenge.origin || getExpectedOrigin(req);

    const verification = await verifyAuthenticationResponse({
      response: authResp,
      expectedChallenge: storedChallenge.challenge,
      expectedOrigin,
      expectedRPID,
      credential: {
        id: cred.credential_id,
        publicKey: cred.public_key,
        counter: cred.sign_count,
        transports: cred.transports || [],
      },
    });

    if (!verification.verified) {
      return res.status(401).json({
        success: false,
        message: "Re-authentication failed.",
      });
    }

    cred.sign_count = verification.authenticationInfo?.newCounter ?? cred.sign_count;
    cred.last_used_at = new Date();
    await cred.save();

    await WebauthnChallenge.deleteOne({ _id: storedChallenge._id });

    const stepUpToken = generateStepUpToken(req.user._id);

    return res.status(200).json({
      success: true,
      stepUpToken,
      message: "Re-authentication verified successfully.",
    });
  } catch (error) {
    console.error("Error verifying reauth:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify re-authentication.",
    });
  }
};

// 9. Delete a Passkey
export const deleteCredentialHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const stepUpToken = req.headers["x-step-up-token"] || req.body.stepUpToken;

    // Verify step-up authentication token
    if (!stepUpToken) {
      return res.status(401).json({
        success: false,
        requiresStepUp: true,
        message: "Please re-authenticate with your passkey before deleting a security key.",
      });
    }

    try {
      const decoded = jwt.verify(stepUpToken, process.env.JWT_SECRET_KEY);
      if (
        decoded.userId !== req.user._id.toString() ||
        decoded.purpose !== "passkey_step_up"
      ) {
        return res.status(403).json({
          success: false,
          requiresStepUp: true,
          message: "Invalid re-authentication token. Please try again.",
        });
      }
    } catch (err) {
      return res.status(401).json({
        success: false,
        requiresStepUp: true,
        message: "Re-authentication expired. Please confirm your identity again.",
      });
    }

    const cred = await WebauthnCredential.findOne({
      _id: id,
      user_id: req.user._id,
    });

    if (!cred) {
      return res.status(404).json({
        success: false,
        message: "Passkey not found.",
      });
    }

    // Refuse to delete if it would leave the account with zero passkeys and no password
    const allCreds = await WebauthnCredential.find({ user_id: req.user._id });
    if (allCreds.length <= 1) {
      const hasAlternativeAccess =
        req.user.password && req.user.hasPassword !== false;

      if (!hasAlternativeAccess) {
        return res.status(400).json({
          success: false,
          message:
            "Cannot delete your only passkey. Please add another passkey or set an account password first to prevent permanent lockout.",
        });
      }
    }

    const deviceName = cred.device_name;
    await WebauthnCredential.deleteOne({ _id: cred._id });

    // Send security notification email
    sendPasskeyRemovedEmail({
      to: req.user.email,
      name: req.user.name,
      deviceName,
    }).catch((err) => console.error("Error sending passkey removed email:", err));

    return res.status(200).json({
      success: true,
      message: `Passkey "${deviceName}" removed successfully.`,
    });
  } catch (error) {
    console.error("Error deleting passkey:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete passkey.",
    });
  }
};

// 10. Account Recovery: Request Magic Link
export const requestRecoveryHandler = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Recovery email is required.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Don't leak user existence; return generic success message
      return res.status(200).json({
        success: true,
        message: "If an account with this recovery email exists, recovery instructions have been sent.",
      });
    }

    // Cancel any previous pending recoveries
    await WebauthnRecovery.updateMany(
      { user_id: user._id, status: "cooling_off" },
      { status: "cancelled" }
    );

    const recoveryToken = crypto.randomBytes(32).toString("hex");
    const cancelToken = crypto.randomBytes(32).toString("hex");
    const coolingOffDurationMs = RECOVERY_COOLING_OFF_HOURS * 60 * 60 * 1000;
    const coolingOffUntil = new Date(Date.now() + coolingOffDurationMs);

    await WebauthnRecovery.create({
      user_id: user._id,
      email: user.email,
      recovery_token: recoveryToken,
      cancel_token: cancelToken,
      cooling_off_until: coolingOffUntil,
      status: "cooling_off",
    });

    const clientOrigin = getExpectedOrigin(req);
    const statusUrl = `${clientOrigin}/recover-passkey?token=${recoveryToken}`;
    const cancelUrl = `${clientOrigin}/recover-passkey/cancel/${cancelToken}`;

    await sendPasskeyRecoveryInitiatedEmail({
      to: user.email,
      name: user.name,
      coolingOffHours: RECOVERY_COOLING_OFF_HOURS,
      statusUrl,
      cancelUrl,
    });

    return res.status(200).json({
      success: true,
      message: "Recovery instructions have been sent to your verified recovery email.",
    });
  } catch (error) {
    console.error("Error requesting passkey recovery:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to initiate passkey recovery.",
    });
  }
};

// 11. Account Recovery: Cancel Recovery
export const cancelRecoveryHandler = async (req, res) => {
  try {
    const { cancelToken } = req.params;
    const recovery = await WebauthnRecovery.findOne({
      cancel_token: cancelToken,
      status: "cooling_off",
    });

    if (!recovery) {
      return res.status(404).json({
        success: false,
        message: "Recovery request not found or has already been resolved.",
      });
    }

    recovery.status = "cancelled";
    await recovery.save();

    const user = await User.findById(recovery.user_id);
    if (user) {
      sendPasskeyRecoveryCancelledEmail({
        to: user.email,
        name: user.name,
      }).catch((err) => console.error("Error sending recovery cancelled email:", err));
    }

    return res.status(200).json({
      success: true,
      message: "The pending account recovery has been successfully cancelled. Your account remains secure.",
    });
  } catch (error) {
    console.error("Error cancelling recovery:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel recovery request.",
    });
  }
};

// 12. Account Recovery: Check Status
export const getRecoveryStatusHandler = async (req, res) => {
  try {
    const { recoveryToken } = req.params;
    const recovery = await WebauthnRecovery.findOne({
      recovery_token: recoveryToken,
    });

    if (!recovery) {
      return res.status(404).json({
        success: false,
        message: "Invalid recovery token.",
      });
    }

    if (recovery.status === "cancelled") {
      return res.status(400).json({
        success: false,
        status: "cancelled",
        message: "This recovery request was cancelled.",
      });
    }

    if (recovery.status === "completed") {
      return res.status(400).json({
        success: false,
        status: "completed",
        message: "This recovery request has already been completed.",
      });
    }

    const now = new Date();
    const isCoolingOffComplete = now >= recovery.cooling_off_until;

    return res.status(200).json({
      success: true,
      status: isCoolingOffComplete ? "ready" : "cooling_off",
      cooling_off_until: recovery.cooling_off_until,
      email: recovery.email,
      isReady: isCoolingOffComplete,
    });
  } catch (error) {
    console.error("Error checking recovery status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve recovery status.",
    });
  }
};

// 13. Account Recovery: Generate Registration Options for Replacement Passkey
export const recoveryRegistrationOptionsHandler = async (req, res) => {
  try {
    const { recoveryToken } = req.body;
    const recovery = await WebauthnRecovery.findOne({
      recovery_token: recoveryToken,
      status: "cooling_off",
    });

    if (!recovery) {
      return res.status(404).json({
        success: false,
        message: "Recovery request not found or invalid.",
      });
    }

    const now = new Date();
    if (now < recovery.cooling_off_until) {
      return res.status(403).json({
        success: false,
        message: `Cooling-off period is still active until ${recovery.cooling_off_until.toISOString()}.`,
      });
    }

    const user = await User.findById(recovery.user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    const rpID = getRpID(req);
    const origin = getExpectedOrigin(req);

    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID,
      userID: new Uint8Array(Buffer.from(user._id.toString())),
      userName: user.email,
      userDisplayName: user.name || user.email,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "required",
        userVerification: "required",
      },
    });

    const challengeKey = crypto.randomUUID();
    await WebauthnChallenge.create({
      challenge: options.challenge,
      challengeKey,
      user_id: user._id,
      email: user.email,
      type: "recovery",
      rpID,
      origin,
    });

    return res.status(200).json({
      success: true,
      options,
      challengeKey,
    });
  } catch (error) {
    console.error("Error generating recovery registration options:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate passkey recovery options.",
    });
  }
};

// 14. Account Recovery: Complete and Register Replacement Passkey
export const completeRecoveryHandler = async (req, res) => {
  try {
    const { recoveryToken, challengeKey, attResp, deviceName } = req.body;
    const recovery = await WebauthnRecovery.findOne({
      recovery_token: recoveryToken,
      status: "cooling_off",
    });

    if (!recovery) {
      return res.status(404).json({
        success: false,
        message: "Recovery request not found or invalid.",
      });
    }

    if (new Date() < recovery.cooling_off_until) {
      return res.status(403).json({
        success: false,
        message: "Cooling-off period has not elapsed yet.",
      });
    }

    const storedChallenge = await WebauthnChallenge.findOne({
      challengeKey,
      type: "recovery",
      user_id: recovery.user_id,
    });

    if (!storedChallenge) {
      return res.status(400).json({
        success: false,
        message: "Recovery challenge expired. Please try again.",
      });
    }

    const expectedRPID = storedChallenge.rpID || getRpID(req);
    const expectedOrigin = storedChallenge.origin || getExpectedOrigin(req);

    const verification = await verifyRegistrationResponse({
      response: attResp,
      expectedChallenge: storedChallenge.challenge,
      expectedOrigin,
      expectedRPID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return res.status(400).json({
        success: false,
        message: "Passkey verification failed.",
      });
    }

    const { registrationInfo } = verification;
    const credentialID = registrationInfo.credential?.id || attResp.id;
    const credentialPublicKey = Buffer.from(
      registrationInfo.credential?.publicKey
    );
    const counter = registrationInfo.credential?.counter ?? 0;
    const transports =
      registrationInfo.credential?.transports ||
      attResp.response?.transports ||
      [];
    const backedUp = !!registrationInfo.credentialBackedUp;

    const user = await User.findById(recovery.user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Register the replacement passkey
    await WebauthnCredential.create({
      user_id: user._id,
      credential_id: credentialID,
      public_key: credentialPublicKey,
      sign_count: counter,
      transports,
      device_name: deviceName || "Recovered Device Passkey",
      backed_up: backedUp,
    });

    // Mark recovery as completed
    recovery.status = "completed";
    await recovery.save();

    await WebauthnChallenge.deleteOne({ _id: storedChallenge._id });

    // Mark recovery email as verified
    user.recovery_email_verified_at = new Date();
    await user.save();

    const token = await user.generateToken();

    sendPasskeyAddedEmail({
      to: user.email,
      name: user.name,
      deviceName: deviceName || "Recovered Device Passkey",
    }).catch((err) => console.error("Error sending passkey email:", err));

    return res.status(200).json({
      success: true,
      message: "Replacement passkey registered and account successfully recovered!",
      AuthToken: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hasPassword: user.hasPassword,
      },
    });
  } catch (error) {
    console.error("Error completing recovery:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to complete account recovery.",
    });
  }
};
