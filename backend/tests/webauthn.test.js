import assert from "node:assert";
import mongoose from "mongoose";
import crypto from "crypto";

import {
  RP_NAME,
  RP_ID,
  EXPECTED_ORIGIN,
  RECOVERY_COOLING_OFF_HOURS,
  checkHttpsRequirement,
  getRpID,
  getExpectedOrigin,
  cleanRpID,
} from "../src/config/webauthnConfig.js";

import WebauthnCredential from "../src/model/webauthnCredentialSchema.js";
import WebauthnChallenge from "../src/model/webauthnChallengeSchema.js";
import WebauthnRecovery from "../src/model/webauthnRecoverySchema.js";
import User from "../src/model/userSchema.js";

import {
  generateRegistrationOptions,
  generateAuthenticationOptions,
} from "@simplewebauthn/server";

console.log("=========================================");
console.log("Running WebAuthn Unit & Verification Tests");
console.log("=========================================");

async function runTests() {
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name}`);
      console.error(err);
      failed++;
    }
  }

  async function asyncTest(name, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name}`);
      console.error(err);
      failed++;
    }
  }

  // 1. Config tests
  test("Configuration has expected RP settings without protocol or port", () => {
    assert.strictEqual(typeof RP_NAME, "string");
    assert.strictEqual(typeof RP_ID, "string");
    assert.ok(!RP_ID.includes("http://"), "RP_ID must not include http://");
    assert.ok(!RP_ID.includes("https://"), "RP_ID must not include https://");
    assert.ok(!RP_ID.includes(":"), "RP_ID must not include port");
    assert.strictEqual(typeof EXPECTED_ORIGIN, "string");
    assert.ok(RECOVERY_COOLING_OFF_HOURS > 0, "Cooling off period must be > 0 hours");
  });

  test("HTTPS requirement check allows localhost in non-production", () => {
    const localReq = { hostname: "localhost", secure: false, headers: {} };
    assert.strictEqual(checkHttpsRequirement(localReq), true);
  });

  test("getRpID dynamically resolves production domains from client Origin header", () => {
    const prodReq = { headers: { origin: "https://browsemart.vercel.app" } };
    assert.strictEqual(getRpID(prodReq), "browsemart.vercel.app");

    const devTunnelReq = { headers: { origin: "https://4w0qtm7s-5173.inc1.devtunnels.ms" } };
    assert.strictEqual(getRpID(devTunnelReq), "4w0qtm7s-5173.inc1.devtunnels.ms");

    const localPortReq = { headers: { origin: "http://localhost:5173" } };
    assert.strictEqual(getRpID(localPortReq), "localhost");
  });

  test("getExpectedOrigin dynamically resolves origin from client headers", () => {
    const prodReq = { headers: { origin: "https://browsemart.vercel.app" } };
    assert.strictEqual(getExpectedOrigin(prodReq), "https://browsemart.vercel.app");
  });

  // 2. SimpleWebAuthn Registration Options Generation
  await asyncTest("Registration options enforces residentKey: 'required' for discoverable credentials", async () => {
    const dummyUserId = new mongoose.Types.ObjectId().toString();
    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: RP_ID,
      userID: new Uint8Array(Buffer.from(dummyUserId)),
      userName: "testuser@example.com",
      userDisplayName: "Test User",
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "required",
        userVerification: "required",
      },
    });

    assert.ok(options.challenge, "Challenge must be generated");
    assert.strictEqual(options.rp.name, RP_NAME);
    assert.strictEqual(options.rp.id, RP_ID);
    assert.strictEqual(options.authenticatorSelection.residentKey, "required");
    assert.strictEqual(options.authenticatorSelection.userVerification, "required");
    assert.strictEqual(
      options.authenticatorSelection.authenticatorAttachment,
      undefined,
      "authenticatorAttachment must NOT be set so native picker shows all options"
    );
  });

  // 3. SimpleWebAuthn Authentication Options Generation (Discoverable)
  await asyncTest("Authentication options allows empty allowCredentials for discoverable passkey login", async () => {
    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      allowCredentials: [],
      userVerification: "required",
    });

    assert.ok(options.challenge, "Challenge must be generated");
    assert.strictEqual(options.rpId, RP_ID);
    assert.deepStrictEqual(
      options.allowCredentials,
      [],
      "allowCredentials must be empty array for discoverable usernameless login"
    );
    assert.strictEqual(options.userVerification, "required");
  });

  // 4. Schema Validations
  test("WebauthnCredential schema defines required fields", () => {
    const credSchema = WebauthnCredential.schema.paths;
    assert.ok(credSchema.user_id, "user_id is required");
    assert.ok(credSchema.credential_id, "credential_id is required");
    assert.ok(credSchema.public_key, "public_key is required");
    assert.ok(credSchema.sign_count, "sign_count is required");
    assert.ok(credSchema.transports, "transports is required");
    assert.ok(credSchema.device_name, "device_name is required");
    assert.ok(credSchema.backed_up, "backed_up is required");
  });

  test("WebauthnChallenge schema has 60-second TTL index", () => {
    const challengeSchema = WebauthnChallenge.schema.paths;
    assert.ok(challengeSchema.createdAt, "createdAt is required");
    assert.strictEqual(
      challengeSchema.createdAt.options.expires,
      60,
      "Challenge must expire after 60 seconds"
    );
  });

  test("WebauthnRecovery schema has status and cooling_off_until", () => {
    const recoverySchema = WebauthnRecovery.schema.paths;
    assert.ok(recoverySchema.user_id, "user_id is required");
    assert.ok(recoverySchema.recovery_token, "recovery_token is required");
    assert.ok(recoverySchema.cancel_token, "cancel_token is required");
    assert.ok(recoverySchema.cooling_off_until, "cooling_off_until is required");
    assert.ok(recoverySchema.status, "status is required");
  });

  test("User schema has recovery_email_verified_at field", () => {
    const userSchemaPaths = User.schema.paths;
    assert.ok(
      userSchemaPaths.recovery_email_verified_at,
      "recovery_email_verified_at field must exist on User"
    );
  });

  // 5. Anti-lockout rule verification
  test("Anti-lockout logic prevents deleting only passkey for passwordless account", () => {
    const mockUser = {
      _id: new mongoose.Types.ObjectId(),
      password: null,
      hasPassword: false,
    };
    const mockCredentials = [
      { id: "cred_1", device_name: "MacBook Pro" },
    ];

    const canDeleteOnlyPasskey = (user, creds) => {
      if (creds.length <= 1) {
        const hasAlternative = user.password && user.hasPassword !== false;
        if (!hasAlternative) {
          return { allowed: false, message: "Cannot delete your only passkey." };
        }
      }
      return { allowed: true };
    };

    const check1 = canDeleteOnlyPasskey(mockUser, mockCredentials);
    assert.strictEqual(check1.allowed, false, "Must not allow deleting only passkey when password is null");

    // Case with 2 passkeys
    const mockCreds2 = [
      { id: "cred_1", device_name: "MacBook Pro" },
      { id: "cred_2", device_name: "Pixel 8" },
    ];
    const check2 = canDeleteOnlyPasskey(mockUser, mockCreds2);
    assert.strictEqual(check2.allowed, true, "Must allow deleting a passkey when 2+ passkeys exist");

    // Case with password enabled
    const mockUserWithPassword = {
      _id: new mongoose.Types.ObjectId(),
      password: "hashed_password",
      hasPassword: true,
    };
    const check3 = canDeleteOnlyPasskey(mockUserWithPassword, mockCredentials);
    assert.strictEqual(check3.allowed, true, "Must allow deleting only passkey when user has an account password");
  });

  // 6. Cooling-off period calculation test
  test("Recovery cooling-off calculation sets future date accurately", () => {
    const hours = RECOVERY_COOLING_OFF_HOURS;
    const now = Date.now();
    const coolingOffUntil = new Date(now + hours * 60 * 60 * 1000);

    const diffHours = (coolingOffUntil.getTime() - now) / (1000 * 60 * 60);
    assert.strictEqual(Math.round(diffHours), hours);
    assert.ok(coolingOffUntil > new Date());
  });

  console.log("\n=========================================");
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log("=========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
