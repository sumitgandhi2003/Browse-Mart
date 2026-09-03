import React, { useState, useEffect } from "react";
import { useTheme } from "../../Context/themeContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Input, OTPInput, PasskeyButton } from "../../LIBS";
import { FaMoon, FaSun } from "react-icons/fa6";
import { FaEyeSlash, FaEye, FaFingerprint, FaLock } from "react-icons/fa";
import axios from "axios";
import { BiLoaderAlt } from "react-icons/bi";
import { useAuth } from "../../Context/authContext";
import { customToast } from "../../utility/constant";
import GoogleLoginButton from "./GoogleLoginButton";
import { startRegistration } from "@simplewebauthn/browser";
import { usePasskeySupport } from "../../hooks/usePasskeySupport";

const RegisterPage = ({ userDetail }) => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { authToken, setAuthToken } = useAuth();
  const { supportsWebAuthn, platformCopy } = usePasskeySupport();

  const [registrationMode, setRegistrationMode] = useState("passkey"); // "passkey" | "password"
  const [isProcessing, setIsProcessing] = useState(false);
  const [passkeyProcessing, setPasskeyProcessing] = useState(false);

  // Traditional password registration data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  // Passkey registration data
  const [passkeyData, setPasskeyData] = useState({
    name: "",
    email: "",
    deviceName: "",
  });

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1); // 1: Form, 2: Registration OTP (password flow), 3: Recovery Email Verification (passkey flow)
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryOtp, setRecoveryOtp] = useState("");
  const [recoveryProcessing, setRecoveryProcessing] = useState(false);

  const [error, setError] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    phoneNumber: "",
    passwordValidation: "",
  });

  const [isPasswordShow, setIsPasswordShow] = useState({
    password: false,
    confirmPassword: false,
  });

  const redirect = new URLSearchParams(location?.search)?.get("redirect");

  const passwordToggle = (field) => {
    setIsPasswordShow((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const checkValidation = () => {
    let errors = {};

    if (!formData.name) errors.name = "Name is required!";
    if (!formData.email) errors.email = "Email is required!";
    if (formData.email && !emailRegex.test(formData.email))
      errors.email = "Email is Not Valid!";
    if (!formData.phoneNumber) errors.phoneNumber = "Mobile No is required!";
    if (
      formData.phoneNumber &&
      formData.phoneNumber.length !== 10
    )
      errors.phoneNumber = "Mobile No must be 10 digits";

    if (!formData.password) errors.password = "Password is required!";
    if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long!";
    }
    if (!formData.confirmPassword)
      errors.confirmPassword = "Confirm Password is required!";
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      errors.passwordValidation = "Passwords do not match!";
    }

    if (Object.keys(errors).length > 0) {
      setError(errors);
      return false;
    }

    setError({});
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasskeyChange = (e) => {
    setPasskeyData({ ...passkeyData, [e.target.name]: e.target.value });
  };

  // --- Passkey Passwordless Registration ---
  const handlePasskeyRegister = async (e) => {
    e.preventDefault();
    if (!passkeyData.name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!passkeyData.email.trim() || !emailRegex.test(passkeyData.email)) {
      setErrorMessage("Please enter a valid recovery email address.");
      return;
    }

    setErrorMessage("");
    setPasskeyProcessing(true);

    try {
      // 1. Get registration options from server
      const { data } = await axios.post(
        `${SERVER_URL}/api/webauthn/register/options`,
        {
          email: passkeyData.email.toLowerCase().trim(),
          name: passkeyData.name.trim(),
        }
      );

      if (!data?.success) {
        throw new Error(data?.message || "Failed to start passkey setup.");
      }

      // 2. Prompt native browser authenticator
      const attResp = await startRegistration({
        optionsJSON: data.options,
      });

      // 3. Verify registration on server
      const verifyRes = await axios.post(
        `${SERVER_URL}/api/webauthn/register/verify`,
        {
          attResp,
          challengeKey: data.challengeKey,
          deviceName:
            passkeyData.deviceName.trim() ||
            `${platformCopy.split(",")[0]} Passkey`,
        }
      );

      if (verifyRes.data?.success) {
        localStorage.setItem("AuthToken", verifyRes.data.AuthToken);
        setAuthToken(verifyRes.data.AuthToken);
        customToast(theme).fire({
          icon: "success",
          title: "Account Created with Passkey!",
        });

        setRecoveryEmail(passkeyData.email);
        // Advance to Step 3: Recovery Email Verification prompt
        setStep(3);
      }
    } catch (err) {
      console.error("Passkey registration error:", err);
      if (err.name === "NotAllowedError") {
        customToast(theme).fire({
          icon: "info",
          title: "Passkey setup was cancelled",
        });
      } else if (err.name === "InvalidStateError") {
        setErrorMessage(
          "An authenticator is already registered for this account on this device."
        );
      } else {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Passkey registration failed. Please try again.";
        setErrorMessage(msg);
      }
    } finally {
      setPasskeyProcessing(false);
    }
  };

  // Verify Recovery Email in Step 3
  const handleVerifyRecoveryEmail = async (otpToVerify) => {
    setRecoveryProcessing(true);
    setErrorMessage("");
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/auth/email-verification`,
        {
          otp: otpToVerify,
          email: recoveryEmail,
        }
      );

      if (response.status === 201 || response.data?.success) {
        customToast(theme).fire({
          icon: "success",
          title: "Recovery Email Verified!",
        });
        navigate(redirect ? `${redirect}` : "/");
      }
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message || "Invalid OTP code. Please try again."
      );
    } finally {
      setRecoveryProcessing(false);
    }
  };

  // Skip Recovery Email Verification
  const handleAcknowledgeAndProceed = () => {
    navigate(redirect ? `${redirect}` : "/");
  };

  // --- Password Registration ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = checkValidation();
    if (!isValid) return;
    handleRegistration();
  };

  const handleRegistration = () => {
    setIsProcessing(true);
    axios({
      method: "POST",
      url: `${SERVER_URL}/api/auth/register`,
      data: formData,
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    })
      .then((response) => {
        const { status, data } = response;
        if (status === 200) {
          setMessage(data?.message);
          setErrorMessage("");
          setStep(2);
        }
      })
      .catch((error) => {
        console.error(error);
        const { message: apiMsg = "" } = error?.response?.data || error;
        setErrorMessage(apiMsg);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  const onOtpVerify = (otp) => {
    if (otp.length < 6) {
      setErrorMessage("OTP must be 6 digits");
      return;
    }
    setErrorMessage("");
    setIsProcessing(true);
    axios({
      method: "post",
      url: `${SERVER_URL}/api/auth/email-verification`,
      data: {
        otp,
        email: formData?.email,
      },
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    })
      .then((response) => {
        if (response.status === 201) {
          localStorage.setItem("AuthToken", response?.data?.authToken);
          setAuthToken(response?.data?.authToken);
          navigate(redirect ? `${redirect}` : "/");
        }
      })
      .catch((error) => {
        const data = error?.response?.data;
        setErrorMessage(data?.message || "OTP verification failed");
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  const onResendOTP = () => {
    setErrorMessage("");
    setMessage("");
    const emailToUse =
      step === 3 ? recoveryEmail : formData?.email;

    axios({
      method: "POST",
      url: `${SERVER_URL}/api/auth/resend-otp`,
      data: { email: emailToUse },
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    })
      .then((response) => {
        const { status, data } = response;
        if (status === 200) {
          setMessage(data?.message || "OTP resent successfully");
          setErrorMessage("");
        }
      })
      .catch((error) => {
        const { message: apiMsg = "Failed to resend OTP" } =
          error?.response?.data || {};
        setErrorMessage(apiMsg);
      });
  };

  useEffect(() => {
    if (userDetail && step !== 3) {
      navigate("/");
    }
  }, [userDetail, step, navigate]);

  return (
    (!authToken || step === 3) && (
      <div
        className={`min-h-screen transition-all duration-300 ${
          theme === "dark"
            ? "bg-gray-950 text-white"
            : "bg-slate-100 text-slate-900"
        }`}
      >
        <Button
          onClick={toggleTheme}
          className={`fixed right-5 top-5 z-20 h-10 w-10 rounded-full shadow ${
            theme === "dark" ? "bg-slate-800" : "bg-white"
          }`}
          icon={
            theme === "dark" ? (
              <FaSun className="h-5 w-5 text-amber-300" />
            ) : (
              <FaMoon className="h-5 w-5 text-slate-700" />
            )
          }
        />

        <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 tablet:px-6">
          <div
            className={`grid w-full overflow-hidden rounded-3xl border shadow-2xl laptop:grid-cols-[1.05fr_1fr] ${
              theme === "dark"
                ? "border-slate-800 bg-slate-900"
                : "border-slate-200 bg-white"
            }`}
          >
            <div
              className={`hidden p-10 laptop:block ${
                theme === "dark"
                  ? "bg-gradient-to-br from-fuchsia-700 via-indigo-700 to-blue-700"
                  : "bg-gradient-to-br from-fuchsia-500 via-indigo-500 to-blue-500"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                New On Browse Mart
              </p>
              <h1 className="mt-6 text-4xl font-black leading-tight text-white">
                Create your account with next-gen security.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/85">
                Experience instant, passwordless sign-ins using biometric passkeys,
                or register with traditional credentials.
              </p>
              <div className="mt-10 space-y-3 text-sm text-white/90">
                <p>🔑 Instant passkey biometric login</p>
                <p>🛡️ Phishing-resistant FIDO2 encryption</p>
                <p>⚡ Fast checkout with saved profile</p>
              </div>
            </div>

            <div className="p-6 mobile:p-5 tablet:p-8">
              <h2 className="text-3xl font-black tracking-tight">
                {step === 1
                  ? "Create Account"
                  : step === 2
                  ? "Verify OTP"
                  : "Verify Recovery Email"}
              </h2>
              <p
                className={`mt-2 text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}
              >
                {step === 1
                  ? "Select your preferred signup method to get started."
                  : step === 2
                  ? "Enter the verification code sent to your email."
                  : "Your passkey account is active! Please verify your recovery email to prevent lockout."}
              </p>

              {/* ── Method Selection Tabs (Step 1) ── */}
              {step === 1 && (
                <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-200/70 p-1 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setRegistrationMode("passkey");
                      setErrorMessage("");
                    }}
                    className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-all ${
                      registrationMode === "passkey"
                        ? "bg-white text-indigo-600 shadow-sm dark:bg-indigo-600 dark:text-white"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    <FaFingerprint className="text-sm" />
                    <span>Passkey (Recommended)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegistrationMode("password");
                      setErrorMessage("");
                    }}
                    className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-all ${
                      registrationMode === "password"
                        ? "bg-white text-indigo-600 shadow-sm dark:bg-indigo-600 dark:text-white"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    <FaLock className="text-xs" />
                    <span>Password</span>
                  </button>
                </div>
              )}

              {/* ── STEP 1: Passkey Signup Flow ── */}
              {step === 1 && registrationMode === "passkey" && (
                <form onSubmit={handlePasskeyRegister} className="mt-5 space-y-4">
                  <div
                    className={`rounded-xl border p-3.5 text-xs leading-relaxed ${
                      theme === "dark"
                        ? "border-indigo-900/50 bg-indigo-950/40 text-indigo-200"
                        : "border-indigo-100 bg-indigo-50/80 text-indigo-900"
                    }`}
                  >
                    <p className="font-semibold">✨ Passwordless Authentication</p>
                    <p className="mt-1">
                      You will register a passkey bound to this device (
                      {platformCopy}). Your email will serve as your verified recovery contact if
                      you ever lose your device.
                    </p>
                  </div>

                  <div>
                    <Input
                      type="text"
                      name="name"
                      value={passkeyData.name}
                      onChange={handlePasskeyChange}
                      required
                      className={`w-full rounded-xl border-2 p-3 ${
                        theme === "dark"
                          ? "border-slate-700 bg-slate-800 text-white"
                          : "border-slate-300 bg-slate-50 text-slate-900"
                      }`}
                      placeholder="Full Name"
                    />
                  </div>

                  <div>
                    <Input
                      type="email"
                      name="email"
                      value={passkeyData.email}
                      onChange={handlePasskeyChange}
                      required
                      className={`w-full rounded-xl border-2 p-3 ${
                        theme === "dark"
                          ? "border-slate-700 bg-slate-800 text-white"
                          : "border-slate-300 bg-slate-50 text-slate-900"
                      }`}
                      placeholder="Recovery Email"
                    />
                    <p className="mt-1 text-[11px] text-slate-500">
                      Used for emergency account recovery and security alerts.
                    </p>
                  </div>

                  <div>
                    <Input
                      type="text"
                      name="deviceName"
                      value={passkeyData.deviceName}
                      onChange={handlePasskeyChange}
                      className={`w-full rounded-xl border-2 p-3 ${
                        theme === "dark"
                          ? "border-slate-700 bg-slate-800 text-white"
                          : "border-slate-300 bg-slate-50 text-slate-900"
                      }`}
                      placeholder="Device Label (e.g. MacBook Pro, My Phone)"
                    />
                  </div>

                  {errorMessage && (
                    <p className="text-sm font-medium text-red-500">
                      {errorMessage}
                    </p>
                  )}

                  <PasskeyButton
                    onClick={handlePasskeyRegister}
                    loading={passkeyProcessing}
                    text="Create Account with Passkey"
                    subtext={platformCopy}
                    className="w-full"
                  />

                  {/* ── Google OAuth ── */}
                  <div className="flex items-center gap-3 pt-1">
                    <div
                      className={`h-px flex-1 ${
                        theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        theme === "dark" ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      or
                    </span>
                    <div
                      className={`h-px flex-1 ${
                        theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                      }`}
                    />
                  </div>

                  <GoogleLoginButton
                    label="Sign up with Google"
                    className={
                      theme === "dark"
                        ? "border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                        : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                    }
                  />
                </form>
              )}

              {/* ── STEP 1: Traditional Password Signup Flow ── */}
              {step === 1 && registrationMode === "password" && (
                <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
                  <div>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full rounded-xl border-2 p-3 ${
                        theme === "dark"
                          ? "border-slate-700 bg-slate-800 text-white"
                          : "border-slate-300 bg-slate-50 text-slate-900"
                      }`}
                      placeholder="Full Name"
                    />
                    {error.name && (
                      <p className="mt-1 text-sm font-medium text-red-500">
                        {error.name}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-3 small-device:grid-cols-2">
                    <div>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`w-full rounded-xl border-2 p-3 ${
                          theme === "dark"
                            ? "border-slate-700 bg-slate-800 text-white"
                            : "border-slate-300 bg-slate-50 text-slate-900"
                        }`}
                        placeholder="Email"
                      />
                      {error.email && (
                        <p className="mt-1 text-sm font-medium text-red-500">
                          {error.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <Input
                        type="number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        className={`w-full rounded-xl border-2 p-3 ${
                          theme === "dark"
                            ? "border-slate-700 bg-slate-800 text-white"
                            : "border-slate-300 bg-slate-50 text-slate-900"
                        }`}
                        placeholder="Mobile Number"
                      />
                      {error.phoneNumber && (
                        <p className="mt-1 text-sm font-medium text-red-500">
                          {error.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3 small-device:grid-cols-2">
                    <div className="relative">
                      <Input
                        type={isPasswordShow.password ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className={`w-full rounded-xl border-2 p-3 pr-10 ${
                          theme === "dark"
                            ? "border-slate-700 bg-slate-800 text-white"
                            : "border-slate-300 bg-slate-50 text-slate-900"
                        }`}
                        placeholder="Password"
                      />
                      {formData.password && (
                        <button
                          type="button"
                          onClick={() => passwordToggle("password")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {isPasswordShow.password ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      )}
                      {error.password && (
                        <p className="mt-1 text-sm font-medium text-red-500">
                          {error.password}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <Input
                        type={
                          isPasswordShow.confirmPassword ? "text" : "password"
                        }
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className={`w-full rounded-xl border-2 p-3 pr-10 ${
                          theme === "dark"
                            ? "border-slate-700 bg-slate-800 text-white"
                            : "border-slate-300 bg-slate-50 text-slate-900"
                        }`}
                        placeholder="Confirm Password"
                      />
                      {formData.confirmPassword && (
                        <button
                          type="button"
                          onClick={() => passwordToggle("confirmPassword")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {isPasswordShow.confirmPassword ? (
                            <FaEyeSlash />
                          ) : (
                            <FaEye />
                          )}
                        </button>
                      )}
                      {error.confirmPassword && (
                        <p className="mt-1 text-sm font-medium text-red-500">
                          {error.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  {error.passwordValidation && (
                    <p className="text-sm font-medium text-red-500">
                      {error.passwordValidation}
                    </p>
                  )}

                  {errorMessage && (
                    <p className="text-sm font-medium text-red-500">
                      {errorMessage}
                    </p>
                  )}

                  <Button
                    btntext={isProcessing ? "Please wait..." : "Create Account with Password"}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-white"
                    onClick={handleSubmit}
                    icon={
                      isProcessing ? (
                        <BiLoaderAlt className="h-5 w-5 animate-spin" />
                      ) : (
                        ""
                      )
                    }
                    disabled={isProcessing}
                  />

                  {/* ── Google OAuth ── */}
                  <div className="flex items-center gap-3 pt-1">
                    <div
                      className={`h-px flex-1 ${
                        theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        theme === "dark" ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      or
                    </span>
                    <div
                      className={`h-px flex-1 ${
                        theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                      }`}
                    />
                  </div>

                  <GoogleLoginButton
                    label="Sign up with Google"
                    className={
                      theme === "dark"
                        ? "border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                        : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                    }
                  />
                </form>
              )}

              {/* ── STEP 2: Password Registration OTP Verification ── */}
              {step === 2 && (
                <div className="mt-7">
                  <OTPInput
                    message={message}
                    errorMessage={errorMessage}
                    onOtpVerify={onOtpVerify}
                    isProcessing={isProcessing}
                    onResendOTP={onResendOTP}
                  />
                </div>
              )}

              {/* ── STEP 3: Passkey Post-Signup Recovery Email Verification ── */}
              {step === 3 && (
                <div className="mt-6 space-y-4">
                  <div
                    className={`rounded-2xl border p-5 ${
                      theme === "dark"
                        ? "border-emerald-800/60 bg-emerald-950/40 text-emerald-200"
                        : "border-emerald-200 bg-emerald-50 text-emerald-900"
                    }`}
                  >
                    <p className="font-bold text-base">
                      🎉 Account Registered with Passkey!
                    </p>
                    <p className="mt-1 text-xs leading-relaxed">
                      We sent a 6-digit verification code to{" "}
                      <strong>{recoveryEmail}</strong>. Verifying your recovery email
                      ensures that you can always recover your account if this device is
                      lost or replaced.
                    </p>
                  </div>

                  <OTPInput
                    message={message || "Enter OTP sent to your recovery email"}
                    errorMessage={errorMessage}
                    onOtpVerify={handleVerifyRecoveryEmail}
                    isProcessing={recoveryProcessing}
                    onResendOTP={onResendOTP}
                  />

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={handleAcknowledgeAndProceed}
                      className={`text-xs ${
                        theme === "dark"
                          ? "text-slate-400 hover:text-white"
                          : "text-slate-500 hover:text-slate-800"
                      } underline underline-offset-4`}
                    >
                      I&apos;ll verify later (I understand the lockout risk) &rarr;
                    </button>
                  </div>
                </div>
              )}

              <p
                className={`mt-6 text-center text-sm ${
                  theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Already have an account?{" "}
                <Link
                  className="font-semibold text-blue-500 hover:underline"
                  to="/login"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default RegisterPage;
