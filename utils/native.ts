import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FilePicker } from '@capawesome/capacitor-file-picker';

/**
 * Standard native image picker for Capacitor.
 * This is much more stable on Android than <input type="file"> which often
 * causes the Activity to restart and the app to reload to the home screen.
 */
export async function pickImage() {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt // Propose Galerie ou Appareil photo
    });

    if (image.webPath) {
      const response = await fetch(image.webPath);
      const blob = await response.blob();
      // Ensure we use a filename that makes sense
      const filename = `photo_${Date.now()}.${image.format}`;
      return new File([blob], filename, { type: blob.type });
    }
    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
}

/**
 * Native file picker for PDFs and other documents.
 * Prevents Android Activity crash.
 */
export async function pickFile() {
  try {
    const result = await FilePicker.pickFiles({
      types: ['application/pdf', 'image/*'],
      multiple: false,
      readData: true
    });

    if (result.files.length > 0) {
      const file = result.files[0];
      if (file.data) {
          // Convert base64 to blob
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
}
