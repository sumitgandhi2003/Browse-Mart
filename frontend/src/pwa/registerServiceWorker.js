import { registerSW } from "virtual:pwa-register";

export const registerAppServiceWorker = ({ onNeedRefresh, onOfflineReady }) =>
  registerSW({
    immediate: true,
    onNeedRefresh,
    onOfflineReady,
    onRegisteredSW(swUrl, registration) {
      console.info("Service worker registered:", swUrl, registration);
    },
    onRegisterError(error) {
      console.error("Service worker registration failed:", error);
    },
  });
