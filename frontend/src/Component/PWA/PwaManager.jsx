import { useCallback, useEffect, useRef, useState } from "react";
import {
  requestNotificationPermission,
  showExampleNotification,
} from "../../pwa/notifications";
import { registerAppServiceWorker } from "../../pwa/registerServiceWorker";
import "./PwaManager.css";

const PwaManager = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState(
    "Notification" in window ? Notification.permission : "unsupported",
  );
  const updateServiceWorkerRef = useRef(null);

  useEffect(() => {
    updateServiceWorkerRef.current = registerAppServiceWorker({
      onNeedRefresh() {
        setUpdateAvailable(true);
        setStatusMessage("A new Browse Mart version is ready.");
      },
      onOfflineReady() {
        setStatusMessage("Browse Mart is ready to use offline.");
      },
    });
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      console.log("✅ beforeinstallprompt event fired:", event);
      event.preventDefault();
      setInstallPrompt(event);
      setShowInstallButton(true);
      setStatusMessage("App is ready to install!");
    };

    const handleAppInstalled = () => {
      console.log("✅ App installed successfully");
      setInstallPrompt(null);
      setShowInstallButton(false);
      setStatusMessage("Browse Mart was installed successfully.");

      // Auto-hide the success message after 3 seconds
      setTimeout(() => {
        setStatusMessage("");
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    console.log("PWA listeners attached");

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setShowInstallButton(false);
    }

    setInstallPrompt(null);
  };

  const handleUpdateClick = () => {
    updateServiceWorkerRef.current?.(true);
  };

  const handleNotificationClick = useCallback(async () => {
    const permission = await requestNotificationPermission();
    setNotificationStatus(permission);

    if (permission === "granted") {
      await showExampleNotification();
    } else if (permission === "unsupported") {
      setStatusMessage("Notifications are not supported in this browser.");
    }
  }, []);

  if (
    !showInstallButton &&
    !statusMessage &&
    !updateAvailable &&
    notificationStatus !== "default"
  ) {
    return null;
  }

  return (
    <div className="pwa-manager" role="status" aria-live="polite">
      {statusMessage && <p className="pwa-manager__message">{statusMessage}</p>}

      <div className="pwa-manager__actions">
        {showInstallButton && (
          <button type="button" onClick={handleInstallClick}>
            Install App
          </button>
        )}

        {updateAvailable && (
          <button type="button" onClick={handleUpdateClick}>
            Update
          </button>
        )}

        {notificationStatus === "default" && (
          <button type="button" onClick={handleNotificationClick}>
            Enable Notifications
          </button>
        )}
      </div>
    </div>
  );
};

export default PwaManager;
