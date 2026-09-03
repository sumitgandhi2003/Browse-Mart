import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaFingerprint,
  FaKey,
  FaTrash,
  FaEdit,
  FaCheck,
  FaPlus,
  FaShieldAlt,
  FaLaptop,
  FaMobileAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";

import { useTheme } from "../../Context/themeContext";
import { useAuth } from "../../Context/authContext";
import { Button, Input, PasskeyButton, SectionTitle } from "../../LIBS";
import { customToast } from "../../utility/constant";
import { usePasskeySupport } from "../../hooks/usePasskeySupport";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const PasskeyManagement = () => {
  const { theme } = useTheme();
  const { authToken } = useAuth();
  const { supportsWebAuthn, platformCopy } = usePasskeySupport();

  const [credentials, setCredentials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingPasskey, setIsAddingPasskey] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Rename state
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  // Deletion step-up state
  const [deletingCred, setDeletingCred] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchCredentials = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${SERVER_URL}/api/webauthn/credentials`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (data?.success) {
        setCredentials(data.credentials || []);
      }
    } catch (err) {
      console.error("Error fetching passkeys:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchCredentials();
    }
  }, [authToken]);

  // --- Add a new passkey ---
  const handleAddPasskey = async () => {
    setIsAddingPasskey(true);
    try {
      const { data } = await axios.post(
        `${SERVER_URL}/api/webauthn/register/options`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (!data?.success) {
        throw new Error(data?.message || "Failed to get registration options");
      }

      const attResp = await startRegistration({
        optionsJSON: data.options,
      });

      const verifyRes = await axios.post(
        `${SERVER_URL}/api/webauthn/register/verify`,
        {
          attResp,
          challengeKey: data.challengeKey,
          deviceName: newDeviceName.trim() || `${platformCopy.split(",")[0]} Passkey`,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (verifyRes.data?.success) {
        customToast(theme).fire({
          icon: "success",
          title: "New passkey added successfully!",
        });
        setShowAddModal(false);
        setNewDeviceName("");
        await fetchCredentials();
      }
    } catch (err) {
      console.error("Failed to add passkey:", err);
      if (err.name === "NotAllowedError") {
        customToast(theme).fire({
          icon: "info",
          title: "Passkey registration cancelled",
        });
      } else {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to register new passkey.";
        customToast(theme).fire({
          icon: "error",
          title: msg,
        });
      }
    } finally {
      setIsAddingPasskey(false);
    }
  };

  // --- Rename passkey ---
  const handleSaveRename = async (id) => {
    if (!editingName.trim()) return;
    setIsRenaming(true);
    try {
      const { data } = await axios.put(
        `${SERVER_URL}/api/webauthn/credentials/${id}`,
        { device_name: editingName.trim() },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (data?.success) {
        customToast(theme).fire({
          icon: "success",
          title: "Passkey renamed",
        });
        setEditingId(null);
        setEditingName("");
        await fetchCredentials();
      }
    } catch (err) {
      console.error("Error renaming passkey:", err);
      customToast(theme).fire({
        icon: "error",
        title: err?.response?.data?.message || "Failed to rename passkey",
      });
    } finally {
      setIsRenaming(false);
    }
  };

  // --- Step-Up Re-Authentication & Deletion ---
  const handleConfirmDelete = async () => {
    if (!deletingCred) return;
    setIsDeleting(true);
    setDeleteError("");

    try {
      // 1. Get reauth options
      const { data: reauthOpts } = await axios.post(
        `${SERVER_URL}/api/webauthn/reauth/options`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (!reauthOpts?.success) {
        throw new Error(reauthOpts?.message || "Failed to initialize step-up authentication");
      }

      // 2. Prompt native passkey verification
      const authResp = await startAuthentication({
        optionsJSON: reauthOpts.options,
      });

      // 3. Verify step-up reauth
      const { data: reauthRes } = await axios.post(
        `${SERVER_URL}/api/webauthn/reauth/verify`,
        {
          authResp,
          challengeKey: reauthOpts.challengeKey,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (!reauthRes?.stepUpToken) {
        throw new Error("Re-authentication failed. Please try again.");
      }

      // 4. Delete with verified stepUpToken
      const deleteRes = await axios.delete(
        `${SERVER_URL}/api/webauthn/credentials/${deletingCred.id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "x-step-up-token": reauthRes.stepUpToken,
          },
        }
      );

      if (deleteRes.data?.success) {
        customToast(theme).fire({
          icon: "success",
          title: "Passkey removed",
        });
        setDeletingCred(null);
        await fetchCredentials();
      }
    } catch (err) {
      console.error("Failed to delete passkey:", err);
      if (err.name === "NotAllowedError") {
        setDeleteError("Re-authentication was cancelled. Passkey was not removed.");
      } else {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to remove passkey.";
        setDeleteError(msg);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Never used";
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Unknown";
    }
  };

  return (
    <div className="mt-8">
      <SectionTitle title="Passkeys &amp; Biometric Logins" />

      <div
        className={`rounded-2xl border p-5 shadow-sm transition-all ${
          theme === "dark"
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex flex-col gap-3 small-device:flex-row small-device:items-center small-device:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FaFingerprint className="text-xl text-indigo-500" />
              <h2 className="text-lg font-bold">Registered Passkeys</h2>
            </div>
            <p
              className={`mt-1 text-xs ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Sign in with your fingerprint, face recognition, or security key without typing a password.
            </p>
          </div>

          <Button
            btntext="Add Passkey"
            icon={<FaPlus className="text-xs" />}
            onClick={() => setShowAddModal(true)}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          />
        </div>

        {/* ── Multi-passkey Recommendation Banner ── */}
        {credentials.length === 1 && (
          <div
            className={`mt-4 flex items-start gap-3 rounded-xl border p-3.5 text-xs leading-relaxed ${
              theme === "dark"
                ? "border-amber-900/60 bg-amber-950/30 text-amber-200"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            <FaExclamationTriangle className="mt-0.5 shrink-0 text-sm text-amber-500" />
            <div>
              <p className="font-semibold">Add a backup passkey</p>
              <p className="mt-0.5">
                We strongly recommend registering at least two devices (e.g. your phone and your computer). That way, if one device is lost or wiped, you won&apos;t be locked out.
              </p>
            </div>
          </div>
        )}

        {/* ── Passkey List ── */}
        <div className="mt-5 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <BiLoaderAlt className="animate-spin text-2xl text-indigo-500" />
            </div>
          ) : credentials.length === 0 ? (
            <div
              className={`rounded-xl border border-dashed py-8 text-center text-xs ${
                theme === "dark"
                  ? "border-slate-800 text-slate-400"
                  : "border-slate-200 text-slate-500"
              }`}
            >
              <FaFingerprint className="mx-auto mb-2 text-3xl opacity-40" />
              <p className="font-semibold">No passkeys registered yet.</p>
              <p className="mt-1">
                Add a passkey to enable fast, passwordless logins on this device.
              </p>
            </div>
          ) : (
            credentials.map((cred) => {
              const isEditingThis = editingId === cred.id;
              const isPhone =
                cred.device_name?.toLowerCase().includes("phone") ||
                cred.device_name?.toLowerCase().includes("pixel") ||
                cred.device_name?.toLowerCase().includes("iphone") ||
                cred.device_name?.toLowerCase().includes("android");

              const DeviceIcon = isPhone ? FaMobileAlt : FaLaptop;

              return (
                <div
                  key={cred.id}
                  className={`flex flex-col gap-3 rounded-xl border p-4 transition-all small-device:flex-row small-device:items-center small-device:justify-between ${
                    theme === "dark"
                      ? "border-slate-800 bg-slate-800/40 hover:bg-slate-800/70"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        theme === "dark"
                          ? "bg-indigo-950/60 text-indigo-400"
                          : "bg-indigo-100 text-indigo-600"
                      }`}
                    >
                      <DeviceIcon className="text-lg" />
                    </div>

                    <div>
                      {isEditingThis ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="rounded-lg border px-2.5 py-1 text-xs"
                            placeholder="Device name"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveRename(cred.id)}
                            disabled={isRenaming}
                            className="rounded-lg bg-emerald-600 p-1.5 text-xs text-white hover:bg-emerald-700"
                          >
                            <FaCheck />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded-lg bg-slate-500 p-1.5 text-xs text-white hover:bg-slate-600"
                          >
                            &times;
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {cred.device_name}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(cred.id);
                              setEditingName(cred.device_name);
                            }}
                            className={`text-xs opacity-60 hover:opacity-100 ${
                              theme === "dark" ? "text-slate-400" : "text-slate-600"
                            }`}
                            title="Rename passkey"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      )}

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span>Created: {formatDate(cred.created_at)}</span>
                        <span>•</span>
                        <span>Last used: {formatDate(cred.last_used_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end small-device:self-auto">
                    {cred.backed_up ? (
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          theme === "dark"
                            ? "bg-indigo-950 text-indigo-300 border border-indigo-800"
                            : "bg-indigo-100 text-indigo-800"
                        }`}
                      >
                        Synced
                      </span>
                    ) : (
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          theme === "dark"
                            ? "bg-slate-800 text-slate-300 border border-slate-700"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        Device-bound
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setDeletingCred(cred);
                        setDeleteError("");
                      }}
                      className="rounded-lg border border-red-200 p-2 text-xs text-red-500 transition-colors hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/40"
                      title="Remove passkey"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Add Passkey Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl ${
              theme === "dark"
                ? "border-slate-800 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
                <FaFingerprint className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Register New Passkey</h3>
                <p className="text-xs text-slate-500">
                  Bind this device for passwordless login
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Device Label
                </label>
                <Input
                  type="text"
                  placeholder="e.g. MacBook Pro Touch ID, Pixel 8"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  className={`w-full rounded-xl border-2 p-3 ${
                    theme === "dark"
                      ? "border-slate-700 bg-slate-800 text-white"
                      : "border-slate-300 bg-slate-50 text-slate-900"
                  }`}
                />
              </div>

              <div
                className={`rounded-xl border p-3.5 text-xs leading-relaxed ${
                  theme === "dark"
                    ? "border-slate-800 bg-slate-800/40 text-slate-400"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                When you click continue, your browser will prompt you to authenticate using{" "}
                <strong>{platformCopy}</strong>.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  btntext="Cancel"
                  onClick={() => setShowAddModal(false)}
                  disabled={isAddingPasskey}
                  className={`rounded-xl px-4 py-2.5 text-xs font-semibold ${
                    theme === "dark"
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                />
                <Button
                  btntext={isAddingPasskey ? "Registering..." : "Continue"}
                  onClick={handleAddPasskey}
                  loading={isAddingPasskey}
                  disabled={isAddingPasskey}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 shadow-sm shadow-indigo-600/30"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Step-Up Delete Confirmation Modal ── */}
      {deletingCred && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl ${
              theme === "dark"
                ? "border-slate-800 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600/20 text-red-500">
                <FaTrash className="text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Remove Passkey</h3>
                <p className="text-xs text-slate-500">
                  {deletingCred.device_name}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              For security, removing a passkey requires step-up re-authentication. You will be prompted to verify your identity with an active passkey before this key is permanently deleted.
            </p>

            {deleteError && (
              <div className="mt-3 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs font-medium text-red-500">
                {deleteError}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                btntext="Cancel"
                onClick={() => {
                  setDeletingCred(null);
                  setDeleteError("");
                }}
                disabled={isDeleting}
                className={`rounded-xl px-4 py-2.5 text-xs font-semibold ${
                  theme === "dark"
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              />
              <Button
                btntext={isDeleting ? "Verifying..." : "Confirm & Remove"}
                onClick={handleConfirmDelete}
                loading={isDeleting}
                disabled={isDeleting}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-red-700 shadow-sm shadow-red-600/30"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasskeyManagement;
