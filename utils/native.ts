import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

/**
 * Picks an image from the camera or gallery.
 * Optimized for large files by using webPath and fetch.
 */
export const pickImage = async () => {
  if (!Capacitor.isNativePlatform()) {
    return null; // Fallback to HTML input handled by the component
  }

  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt // Offers Camera or Gallery
    });

    if (photo.webPath) {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();
      return new File([blob], `photo_${Date.now()}.${photo.format}`, { type: blob.type });
    }
    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
};

/**
 * Picks a file (PDF, Video, etc.) from the device.
 * Optimized for large files by avoiding base64 conversion (atob).
 */
export const pickFile = async (mimeTypes: string[] = ['application/pdf', 'image/*', 'video/*']) => {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }

  try {
    const result = await FilePicker.pickFiles({
      types: mimeTypes,
      readData: false // DO NOT read data as base64 to avoid crashes on large files
    });

    if (result.files && result.files.length > 0) {
      const file = result.files[0];

      // On native platform, we use the path and convert it to a fetchable source
      if (file.path) {
          const webPath = Capacitor.convertFileSrc(file.path);
          const response = await fetch(webPath);
          const blob = await response.blob();
          return new File([blob], file.name, { type: file.mimeType });
      }
    }
    return null;
  } catch (error) {
    console.error('Error picking file:', error);
    return null;
  }
};

export const getCurrentLocation = async () => {
    try {
        const permission = await Geolocation.checkPermissions();
        if (permission.location !== 'granted') {
            await Geolocation.requestPermissions();
        }
        const coordinates = await Geolocation.getCurrentPosition();
        return {
            lat: coordinates.coords.latitude,
            lng: coordinates.coords.longitude
        };
    } catch (error) {
        console.error('Error getting location:', error);
        return null;
    }
};
