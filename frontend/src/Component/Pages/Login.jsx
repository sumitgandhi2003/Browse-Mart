import React, { useEffect, useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useTheme } from "../../Context/themeContext";
import { Button, Input, OTPInput, PasskeyButton } from "../../LIBS";
import { customToast } from "../../utility/constant";
import axios from "axios";
import { useNavigate, useLocation, Link, useSearchParams } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa6";
import { guestUser, sellerUser } from "../../utility/constant";
import { BiLoaderAlt } from "react-icons/bi";
import { useAuth } from "../../Context/authContext";
import GoogleLoginButton from "./GoogleLoginButton";
import { startAuthentication } from "@simplewebauthn/browser";
import { usePasskeySupport } from "../../hooks/usePasskeySupport";

const Login = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { authToken, setAuthToken } = useAuth();
  const { supportsWebAuthn, supportsAutofill, platformCopy } = usePasskeySupport();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1);
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isProcessing, setIsProcessing] = useState({
    form: false,
    guestLogin: false,
    sellerLogin: false,
    otpVerification: false,
  });
  const [isPasskeyLoggingIn, setIsPasskeyLoggingIn] = useState(false);
  const redirect = new URLSearchParams(location?.search)?.get("redirect");
  const [searchParams] = useSearchParams();
  const googleError = searchParams.get("error");
  const googleErrorMessage =
    googleError === "google_cancelled"
      ? "Google sign-in was cancelled. Please try again."
      : googleError
      ? googleError
      : null;

  const handleLogin = (formData, caller) => {
    setError({});
    setErrorMessage("");
    setIsProcessing((prev) => ({ ...prev, [caller]: true }));
    axios({
      method: "POST",
      url: `${SERVER_URL}/api/auth/login`,
      data: formData,
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("AuthToken", response?.data?.AuthToken);
          setAuthToken(response?.data?.AuthToken);
          navigate(redirect ? `${redirect}` : "/");
          customToast(theme).fire({
            icon: "success",
            title: "User Login Successfully !",
          });
        }
      })
      .catch((error) => {
        const status = error?.response?.status || null;
        const {
          message = "",
          requiresVerification = undefined,
          error: apiErrorMessage = null,
        } = error?.response?.data || error;
        if (status === 403 && requiresVerification) {
          setMessage(message);
          setStep(2);
        } else {
          customToast(theme).fire({
            icon: "error",
            title: message || "Something went wrong",
            text: apiErrorMessage,
          });
        }
      })
      .finally(() => setIsProcessing((prev) => ({ ...prev, [caller]: false })));
  };

  const handlePasskeyLogin = async () => {
    setErrorMessage("");
    setIsPasskeyLoggingIn(true);
    try {
      const { data } = await axios.post(
        `${SERVER_URL}/api/webauthn/authenticate/options`
      );
      if (!data?.success) {
        throw new Error(data?.message || "Failed to fetch passkey options.");
      }

      const authResp = await startAuthentication({
        optionsJSON: data.options,
        useBrowserAutofill: false,
      });

      const verifyRes = await axios.post(
        `${SERVER_URL}/api/webauthn/authenticate/verify`,
        {
          authResp,
          challengeKey: data.challengeKey,
        }
      );

      if (verifyRes.data?.success) {
        localStorage.setItem("AuthToken", verifyRes.data.AuthToken);
        setAuthToken(verifyRes.data.AuthToken);
        customToast(theme).fire({
          icon: "success",
          title: "Logged in with Passkey!",
        });
        navigate(redirect ? `${redirect}` : "/");
      }
    } catch (err) {
      console.error("Passkey login error:", err);
      if (err.name === "NotAllowedError") {
        customToast(theme).fire({
          icon: "info",
          title: "Passkey login cancelled",
        });
      } else {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Passkey sign-in failed. Please try again.";
        setErrorMessage(msg);
      }
    } finally {
      setIsPasskeyLoggingIn(false);
    }
  };

  // Conditional UI: Passkey autofill on input
  useEffect(() => {
    let isCancelled = false;

    const runAutofill = async () => {
      if (!supportsAutofill || !supportsWebAuthn || authToken) return;
      try {
        const { data } = await axios.post(
          `${SERVER_URL}/api/webauthn/authenticate/options`
        );
        if (!data?.success || isCancelled) return;

        const authResp = await startAuthentication({
          optionsJSON: data.options,
          useBrowserAutofill: true,
        });

        if (isCancelled) return;

        setIsPasskeyLoggingIn(true);
        const verifyRes = await axios.post(
          `${SERVER_URL}/api/webauthn/authenticate/verify`,
          {
            authResp,
            challengeKey: data.challengeKey,
          }
        );

        if (verifyRes.data?.success && !isCancelled) {
          localStorage.setItem("AuthToken", verifyRes.data.AuthToken);
          setAuthToken(verifyRes.data.AuthToken);
          customToast(theme).fire({
            icon: "success",
            title: "Logged in with Passkey!",
          });
          navigate(redirect ? `${redirect}` : "/");
        }
      } catch (err) {
        if (err.name !== "AbortError" && err.name !== "NotAllowedError") {
          console.debug("Autofill passkey dismissed or not available:", err);
        }
      } finally {
        if (!isCancelled) {
          setIsPasskeyLoggingIn(false);
        }
      }
    };

    runAutofill();

    return () => {
      isCancelled = true;
    };
  }, [
    supportsAutofill,
    supportsWebAuthn,
    authToken,
    SERVER_URL,
    navigate,
    redirect,
    setAuthToken,
    theme,
  ]);

  const handleOtpSubmit = (otp) => {
    if (otp.length < 6) {
      setErrorMessage("OTP must be Six Digit");
      return;
    }
    handleOtpVerification(otp, "otpVerification");
  };

  const handleOtpVerification = (otp, caller) => {
    setIsProcessing((prev) => ({ ...prev, [caller]: true }));

    axios({
      method: "post",
      url: `${SERVER_URL}/api/auth/email-verification`,
      data: {
        otp,
        email: loginData?.email || guestUser?.email,
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
        const status = error?.response?.status;
        if (status === 400) {
          setErrorMessage(data?.message);
        }
      })
      .finally(() => {
        setIsProcessing((prev) => ({ ...prev, [caller]: false }));
      });
  };

  const onResendOTP = () => {
    setErrorMessage("");
    setMessage("");

    axios({
      method: "POST",
      url: `${SERVER_URL}/api/auth/resend-otp`,
      data: { email: loginData?.email },
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    })
      .then((response) => {
        const { status, data } = response;
        if (status === 200) {
          setMessage(data?.message);
          setErrorMessage("");
        }
      })
      .catch((error) => {
        const data = error?.response?.data;
        setErrorMessage(data?.message);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      setError({
        email: !loginData.email ? "Email is required!" : "",
        password: !loginData.password ? "Password is required!" : "",
      });
      return;
    }
    setError({});
    handleLogin(loginData, "form");
  };

  const handleGuestLogin = (e) => {
    e.preventDefault();
    handleLogin(guestUser, "guestLogin");
  };

  const handleSellerLogin = (e) => {
    e.preventDefault();
    handleLogin(sellerUser, "sellerLogin");
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const passwordToggle = () => {
    setIsPasswordShow((prev) => !prev);
  };

  useEffect(() => {
    if (authToken) navigate(redirect ? `${redirect}` : "/");
  }, [authToken, navigate, redirect]);

  return (
    !authToken && (
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
                  ? "bg-gradient-to-br from-indigo-600 via-sky-700 to-cyan-700"
                  : "bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-500"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                Browse Mart
              </p>
              <h1 className="mt-6 text-4xl font-black leading-tight text-white">
                Sign in to continue shopping smarter.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/85">
                Track orders, manage wishlist, and access personalized
                recommendations from your dashboard.
              </p>
              <div className="mt-10 space-y-3 text-sm text-white/90">
                <p>1. Fast passwordless passkey login</p>
                <p>2. Secure biometric &amp; FIDO2 verification</p>
                <p>3. Access buyer, seller, or admin flow</p>
              </div>
            </div>

            <div className="p-6 mobile:p-5 tablet:p-8">
              <h2 className="text-3xl font-black tracking-tight">
                {step === 1 ? "Welcome Back" : "Verify OTP"}
              </h2>
              <p
                className={`mt-2 text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}
              >
                {step === 1
                  ? "Login with your passkey or credentials."
                  : "Enter the verification code sent to your email."}
              </p>

              {/* ── Google OAuth Error Banner ── */}
              {googleErrorMessage && (
                <div
                  className={`mt-4 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
                    theme === "dark"
                      ? "border-red-800 bg-red-950 text-red-300"
                      : "border-red-200 bg-red-50 text-red-600"
                  }`}
                >
                  <span className="mt-0.5 text-base">⚠️</span>
                  <span>{googleErrorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-7">
                {step === 1 && (
                  <div className="space-y-4">
                    {/* ── Passkey / Biometric Passwordless Login ── */}
                    {supportsWebAuthn ? (
                      <div className="space-y-2">
                        <PasskeyButton
                          onClick={handlePasskeyLogin}
                          loading={isPasskeyLoggingIn}
                          text="Sign in with Passkey"
                          subtext={platformCopy}
                          className="w-full"
                        />
                        <div className="flex items-center justify-between px-1 text-xs">
                          <span className={theme === "dark" ? "text-slate-400" : "text-slate-500"}>
                            Passwordless &amp; Instant
                          </span>
                          <Link
                            to="/recover-passkey"
                            className="font-medium text-indigo-500 hover:text-indigo-600 hover:underline"
                          >
                            Trouble signing in?
                          </Link>
                        </div>

                        <div className="flex items-center gap-3 py-1">
                          <div className={`h-px flex-1 ${theme === "dark" ? "bg-slate-700" : "bg-slate-200"}`} />
                          <span className={`text-xs font-medium uppercase tracking-wider ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
                            or password
                          </span>
                          <div className={`h-px flex-1 ${theme === "dark" ? "bg-slate-700" : "bg-slate-200"}`} />
                        </div>
                      </div>
                    ) : (
                      <div className={`rounded-xl border p-3 text-xs ${
                        theme === "dark" ? "border-slate-700 bg-slate-800/60 text-slate-400" : "border-slate-200 bg-slate-50 text-slate-600"
                      }`}>
                        ⚠️ Your browser does not support passkeys. Please sign in using password or Google.
                      </div>
                    )}

                    <div>
                      <Input
                        type="text"
                        placeholder="Email"
                        autoComplete="username webauthn"
                        className={`w-full rounded-xl border-2 p-3 ${
                          theme === "dark"
                            ? "border-slate-700 bg-slate-800 text-white"
                            : "border-slate-300 bg-slate-50 text-slate-900"
                        }`}
                        value={loginData.email}
                        onChange={handleInput}
                        name="email"
                      />
                      {error.email && (
                        <p className="mt-1 text-sm font-medium text-red-500">
                          {error.email}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <Input
                        type={isPasswordShow ? "text" : "password"}
                        placeholder="Password"
                        autoComplete="current-password"
                        className={`w-full rounded-xl border-2 p-3 pr-10 ${
                          theme === "dark"
                            ? "border-slate-700 bg-slate-800 text-white"
                            : "border-slate-300 bg-slate-50 text-slate-900"
                        }`}
                        value={loginData.password}
                        onChange={handleInput}
                        name="password"
                      />
                      {loginData?.password && (
                        <button
                          type="button"
                          onClick={passwordToggle}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {isPasswordShow ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      )}
                      {error.password && (
                        <p className="mt-1 text-sm font-medium text-red-500">
                          {error.password}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-end">
                      <Link
                        to="/forget-password"
                        className="text-sm font-medium text-blue-500 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    {errorMessage && (
                      <p className="text-sm font-medium text-red-500">
                        {errorMessage}
                      </p>
                    )}

                    <Button
                      type="submit"
                      btntext="Login with Password"
                      className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-white"
                      onClick={handleSubmit}
                      icon={
                        isProcessing.form ? (
                          <BiLoaderAlt className="h-5 w-5 animate-spin" />
                        ) : (
                          ""
                        )
                      }
                      disabled={isProcessing.form}
                    />

                    {/* ── Google OAuth ── */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className={`h-px flex-1 ${theme === "dark" ? "bg-slate-700" : "bg-slate-200"}`} />
                      <span className={`text-xs font-medium ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>or</span>
                      <div className={`h-px flex-1 ${theme === "dark" ? "bg-slate-700" : "bg-slate-200"}`} />
                    </div>

                    <GoogleLoginButton
                      label="Continue with Google"
                      className={theme === "dark" ? "border-slate-700 bg-slate-800 text-white hover:bg-slate-700" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"}
                    />

                    <div className="pt-3">
                      <p
                        className={`mb-2 text-xs font-semibold uppercase tracking-[0.15em] ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}
                      >
                        Quick Login
                      </p>
                      <div className="grid gap-2 small-device:grid-cols-2">
                        <Button
                          className={`rounded-xl py-2 text-sm ${theme === "dark" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-800"}`}
                          icon={
                            isProcessing.guestLogin ? (
                              <BiLoaderAlt className="h-4 w-4 animate-spin" />
                            ) : (
                              ""
                            )
                          }
                          onClick={handleGuestLogin}
                          btntext="Guest"
                          disabled={isProcessing.guestLogin}
                        />
                        <Button
                          className={`rounded-xl py-2 text-sm ${theme === "dark" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-800"}`}
                          icon={
                            isProcessing.sellerLogin ? (
                              <BiLoaderAlt className="h-4 w-4 animate-spin" />
                            ) : (
                              ""
                            )
                          }
                          onClick={handleSellerLogin}
                          btntext="Seller"
                          disabled={isProcessing.sellerLogin}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <OTPInput
                    isProcessing={isProcessing.otpVerification}
                    message={message}
                    errorMessage={errorMessage}
                    onOtpVerify={handleOtpSubmit}
                    onResendOTP={onResendOTP}
                  />
                )}
              </form>

              <p
                className={`mt-6 text-center text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}
              >
                Don&apos;t have an account?{" "}
                <Link
                  className="font-semibold text-blue-500 hover:underline"
                  to="/register"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Login;
