self.addEventListener("push", (event) => {
  const fallback = {
    title: "Browse Mart",
    body: "You have a new Browse Mart notification.",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    url: "/",
  };

  const data = event.data ? event.data.json() : fallback;
  const title = data.title || fallback.title;
  const options = {
    body: data.body || fallback.body,
    icon: data.icon || fallback.icon,
    badge: data.badge || fallback.badge,
    data: {
      url: data.url || fallback.url,
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        const existingClient = clients.find((client) =>
          client.url.includes(self.location.origin),
        );

        if (existingClient) {
          existingClient.focus();
          return existingClient.navigate(urlToOpen);
        }

        return self.clients.openWindow(urlToOpen);
      }),
  );
});
