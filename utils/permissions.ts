import { Geolocation } from '@capacitor/geolocation';
import { Camera } from '@capacitor/camera';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export const requestAllPermissions = async () => {
    if (!Capacitor.isNativePlatform()) return;

    try {
        console.log("Requesting all permissions...");

        // Geolocation
        const geoPerm = await Geolocation.requestPermissions();
        console.log("Geolocation permission:", geoPerm.location);

        // Camera
        const camPerm = await Camera.requestPermissions();
        console.log("Camera permission:", camPerm.camera);

        // Notifications
        try {
            const notifPerm = await PushNotifications.requestPermissions();
            console.log("Notifications permission:", notifPerm.receive);
        } catch (e) {
            console.warn("Notifications permission request failed (likely missing google-services.json):", e);
        }

    } catch (error) {
        console.error("Error requesting permissions:", error);
    }
};
