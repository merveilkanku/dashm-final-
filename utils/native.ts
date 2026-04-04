import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export const pickImage = async () => {
  if (!Capacitor.isNativePlatform()) {
    return null; // Fallback to HTML input on web
  }

  try {
    const permissions = await Camera.checkPermissions();
    if (permissions.camera !== 'granted' || permissions.photos !== 'granted') {
      await Camera.requestPermissions();
    }

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

export const pickFile = async (mimeTypes: string[] = ['application/pdf', 'image/*']) => {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }

  try {
    const result = await FilePicker.pickFiles({
      types: mimeTypes,
      readData: true
    });

    if (result.files && result.files.length > 0) {
      const file = result.files[0];
      if (file.data) {
          // Convert base64 to blob if needed, but FilePicker usually gives us enough
          // However, to be compatible with existing code expecting a File object:
          const byteCharacters = atob(file.data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: file.mimeType });
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
        const coordinates = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true
        });
        return {
            lat: coordinates.coords.latitude,
            lng: coordinates.coords.longitude
        };
    } catch (error) {
        console.error('Error getting location:', error);
        return null;
    }
};
