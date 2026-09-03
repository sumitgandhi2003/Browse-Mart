import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaShieldAlt,
  FaClock,
  FaFingerprint,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
} from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import { startRegistration } from "@simplewebauthn/browser";

import { useTheme } from "../../Context/themeContext";
import { useAuth } from "../../Context/authContext";
import { Button, Input, PasskeyButton } from "../../LIBS";
import { customToast } from "../../utility/constant";
import { usePasskeySupport } from "../../hooks/usePasskeySupport";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const PasskeyRecoveryPage = () => {
  const { theme } = useTheme();
  const { setAuthToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token");
  const { platformCopy } = usePasskeySupport();

  const [email, setEmail] = useState("");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Status check state
  const [recoveryToken, setRecoveryToken] = useState(tokenFromUrl || "");
  const [statusData, setStatusData] = useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(!!tokenFromUrl);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isReady, setIsReady] = useState(false);

  // New passkey registration state
  const [deviceName, setDeviceName] = useState("");
  const [isRegisteringNew, setIsRegisteringNew] = useState(false);

  // 1. Submit recovery request
  const handleRequestRecovery = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Please enter your verified recovery email.");
      return;
    }

    setIsSubmittingEmail(true);
    setErrorMessage("");
    try {
      const { data } = await axios.post(
        `${SERVER_URL}/api/webauthn/recovery/request`,
        { email: email.toLowerCase().trim() }
      );

      if (data?.success) {
        setEmailSent(true);
        setMessage(data.message);
      }
    } catch (err) {
      console.error("Error requesting recovery:", err);
      setErrorMessage(
        err?.response?.data?.message || "Failed to initiate recovery request."
      );
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  // 2. Fetch recovery status if token is present
  const fetchStatus = async (token) => {
    if (!token) return;
    setIsCheckingStatus(true);
    try {
      const { data } = await axios.get(
        `${SERVER_URL}/api/webauthn/recovery/status/${token}`
      );
      if (data?.success) {
        setStatusData(data);
        setIsReady(!!data.isReady);
      }
    } catch (err) {
      console.error("Error fetching recovery status:", err);
      setErrorMessage(
        err?.response?.data?.message || "Invalid or expired recovery link."
      );
    } finally {
      setIsCheckingStatus(false);
    }
  };

  useEffect(() => {
    if (tokenFromUrl) {
      setRecoveryToken(tokenFromUrl);
      fetchStatus(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  // 3. Live countdown timer for cooling-off period
  useEffect(() => {
    if (!statusData?.cooling_off_until) return;

    const updateTimer = () => {
      const targetTime = new Date(statusData.cooling_off_until).getTime();
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setIsReady(true);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
        setIsReady(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [statusData]);

  // 4. Complete recovery and register replacement passkey
  const handleRegisterReplacementPasskey = async () => {
    setIsRegisteringNew(true);
    setErrorMessage("");

    try {
      // Get registration options for recovery
      const { data: optRes } = await axios.post(
        `${SERVER_URL}/api/webauthn/recovery/options`,
        { recoveryToken }
      );

      if (!optRes?.success) {
        throw new Error(optRes?.message || "Failed to start passkey setup");
      }

      // Prompt native authenticator
      const attResp = await startRegistration({
        optionsJSON: optRes.options,
      });

      // Complete recovery on backend
      const { data: completeRes } = await axios.post(
        `${SERVER_URL}/api/webauthn/recovery/complete`,
        {
          recoveryToken,
          challengeKey: optRes.challengeKey,
          attResp,
          deviceName: deviceName.trim() || `${platformCopy.split(",")[0]} Replacement Passkey`,
        }
      );

      if (completeRes?.success) {
        localStorage.setItem("AuthToken", completeRes.AuthToken);
        setAuthToken(completeRes.AuthToken);
        customToast(theme).fire({
          icon: "success",
          title: "Account recovered and replacement passkey registered!",
        });
        navigate("/profile/security");
      }
    } catch (err) {
      console.error("Failed to complete recovery:", err);
      if (err.name === "NotAllowedError") {
        customToast(theme).fire({
          icon: "info",
          title: "Passkey setup cancelled",
        });
      } else {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to register replacement passkey.";
        setErrorMessage(msg);
      }
    } finally {
      setIsRegisteringNew(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-all duration-300 ${
        theme === "dark" ? "bg-gray-950 text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      <div
        className={`w-full max-w-lg rounded-3xl border p-8 shadow-2xl ${
          theme === "dark"
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >
        <Link
          to="/login"
          className={`inline-flex items-center gap-2 text-xs font-medium ${
            theme === "dark" ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
          } mb-6 transition-colors`}
        >
          <FaArrowLeft /> Back to Login
        </Link>

        {/* ── View 1: Request Recovery Email ── */}
        {!recoveryToken && (
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 mb-4">
              <FaShieldAlt className="text-2xl" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight">
              Passwordless Account Recovery
            </h1>
            <p
              className={`mt-2 text-xs leading-relaxed ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Lost your device or passkeys? Enter your verified recovery email. We will send a secure link to initiate passkey replacement.
            </p>

            {emailSent ? (
              <div
                className={`mt-6 rounded-2xl border p-5 ${
                  theme === "dark"
                    ? "border-emerald-800/60 bg-emerald-950/40 text-emerald-200"
                    : "border-emerald-200 bg-emerald-50 text-emerald-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-xl text-emerald-500 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">Recovery Email Sent</h4>
                    <p className="mt-1 text-xs">{message}</p>
                  </div>
                </div>
                <p className="mt-3 text-[11px] opacity-80 border-t border-emerald-800/20 pt-2">
                  Check your inbox and click the &quot;View Recovery Status&quot; link in the email to track the cooling-off period.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestRecovery} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Verified Recovery Email
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your account email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full rounded-xl border-2 p-3 ${
                      theme === "dark"
                        ? "border-slate-700 bg-slate-800 text-white"
                        : "border-slate-300 bg-slate-50 text-slate-900"
                    }`}
                  />
                </div>

                {errorMessage && (
                  <p className="text-xs font-medium text-red-500">
                    {errorMessage}
                  </p>
                )}

                <Button
                  type="submit"
                  btntext={isSubmittingEmail ? "Sending Link..." : "Send Recovery Link"}
                  loading={isSubmittingEmail}
                  disabled={isSubmittingEmail}
                  className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white hover:bg-indigo-700 shadow-sm shadow-indigo-600/30"
                />
              </form>
            )}
          </div>
        )}

        {/* ── View 2: Cooling-off Period Countdown & Replacement Passkey Setup ── */}
        {recoveryToken && (
          <div>
            {isCheckingStatus ? (
              <div className="py-12 text-center">
                <BiLoaderAlt className="mx-auto animate-spin text-3xl text-indigo-500" />
                <p className="mt-3 text-xs text-slate-500">
                  Checking recovery status...
                </p>
              </div>
            ) : statusData ? (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      isReady ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"
                    } shadow-lg`}
                  >
                    {isReady ? (
                      <FaFingerprint className="text-2xl" />
                    ) : (
                      <FaClock className="text-2xl" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {isReady ? "Ready to Register Replacement Passkey" : "Security Cooling-Off Active"}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Account: {statusData.email}
                    </p>
                  </div>
                </div>

                {!isReady ? (
                  <>
                    <div
                      className={`rounded-2xl border p-5 ${
                        theme === "dark"
                          ? "border-amber-900/60 bg-amber-950/30 text-amber-200"
                          : "border-amber-200 bg-amber-50 text-amber-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <FaExclamationTriangle className="text-amber-500" />
                        <span>Security Cooling-Off Period</span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed">
                        To protect your account against unauthorized recovery, a cooling-off period is enforced before a replacement passkey can be created. A security alert with a one-click cancel link was emailed to your address.
                      </p>
                    </div>

                    {/* ── Countdown Timer Display ── */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-5 text-center">
                      <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
                        Time Remaining Until Recovery Unlocks
                      </p>
                      <div className="flex items-center justify-center gap-4 text-center">
                        <div className="flex flex-col">
                          <span className="text-3xl font-black text-indigo-400">
                            {String(timeLeft.hours).padStart(2, "0")}
                          </span>
                          <span className="text-[10px] uppercase text-slate-500 font-bold">
                            Hours
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-slate-600">:</span>
                        <div className="flex flex-col">
                          <span className="text-3xl font-black text-indigo-400">
                            {String(timeLeft.minutes).padStart(2, "0")}
                          </span>
                          <span className="text-[10px] uppercase text-slate-500 font-bold">
                            Mins
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-slate-600">:</span>
                        <div className="flex flex-col">
                          <span className="text-3xl font-black text-indigo-400">
                            {String(timeLeft.seconds).padStart(2, "0")}
                          </span>
                          <span className="text-[10px] uppercase text-slate-500 font-bold">
                            Secs
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div
                      className={`rounded-2xl border p-4 text-xs ${
                        theme === "dark"
                          ? "border-emerald-800/60 bg-emerald-950/40 text-emerald-200"
                          : "border-emerald-200 bg-emerald-50 text-emerald-900"
                      }`}
                    >
                      <p className="font-bold text-sm">
                        🎉 Cooling-off period complete!
                      </p>
                      <p className="mt-1">
                        You can now register a replacement passkey for this device to regain complete access to your account.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Device Name
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g. My New Laptop, Replacement Phone"
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        className={`w-full rounded-xl border-2 p-3 ${
                          theme === "dark"
                            ? "border-slate-700 bg-slate-800 text-white"
                            : "border-slate-300 bg-slate-50 text-slate-900"
                        }`}
                      />
                    </div>

                    {errorMessage && (
                      <p className="text-xs font-medium text-red-500">
                        {errorMessage}
                      </p>
                    )}

                    <PasskeyButton
                      onClick={handleRegisterReplacementPasskey}
                      loading={isRegisteringNew}
                      text="Register Replacement Passkey"
                      subtext={platformCopy}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-red-500">
                {errorMessage || "Unable to locate recovery session."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PasskeyRecoveryPage;
