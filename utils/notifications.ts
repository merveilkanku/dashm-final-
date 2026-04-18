// utils/notifications.ts
import { toast } from 'sonner'; 
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export async function requestNotificationPermission(silent: boolean = false): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      const permStatus = await PushNotifications.checkPermissions();
      if (permStatus.receive === 'granted') {
        return true;
      }

      const requestStatus = await PushNotifications.requestPermissions();
      if (requestStatus.receive === 'granted') {
        if (!silent) toast.success("Notifications activées !");
        return true;
      }

      if (!silent) toast.error("Permission de notification refusée.");
      return false;
    } catch (error) {
      console.error("Error requesting native notifications:", error);
      return false;
    }
  }

  if (!('Notification' in window)) {
    console.warn("Ce navigateur ne supporte pas les notifications");
    if (!silent) toast.error("Votre navigateur ne supporte pas les notifications");
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    if (!silent) {
      toast.error(
        "Vous avez déjà refusé les notifications. Pour les activer, modifiez les paramètres de votre navigateur (clic sur l'icône de cadenas à côté de l'URL).",
        { duration: 8000 }
      );
    }
    return false;
  }

  // Permission n'est pas encore demandée
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    if (!silent) toast.success("Notifications activées !");
    return true;
  } else {
    if (!silent) toast.error("Permission refusée. Vous ne recevrez pas de notifications.");
    return false;
  }
}
export const sendPushNotification = (title: string, options?: NotificationOptions) => {
    if (Capacitor.isNativePlatform()) {
        // Native push notifications are usually handled by the OS/FCM
        // But for local notifications we could use @capacitor/local-notifications
        // For now, we'll stick to web-based if it works in WebView or just skip
        return;
    }

    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
        try {
            // Try to use Service Worker if available (better for mobile/Android)
            navigator.serviceWorker.ready.then(registration => {
                (registration as any).showNotification(title, {
                    icon: '/logo.png', // Fallback icon
                    vibrate: [200, 100, 200],
                    ...options
                });
            }).catch(() => {
                // Fallback to standard Notification
                new Notification(title, {
                    icon: '/logo.png',
                    ...options
                });
            });
        } catch (e) {
            new Notification(title, {
                icon: '/logo.png',
                ...options
            });
        }
    }
};
