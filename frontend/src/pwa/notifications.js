export const canUseNotifications = () =>
  "Notification" in window && "serviceWorker" in navigator;

export const requestNotificationPermission = async () => {
  if (!canUseNotifications()) {
    return "unsupported";
  }

  return Notification.requestPermission();
};

export const showExampleNotification = async () => {
  if (!canUseNotifications() || Notification.permission !== "granted") {
    return false;
  }

  const registration = await navigator.serviceWorker.ready;
  await registration.showNotification("Browse Mart", {
    body: "Notifications are enabled for Browse Mart.",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    tag: "browse-mart-example",
  });

  return true;
};
