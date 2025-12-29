/**
 * Google Drive Service - Adapter for Google Apps Script
 * Handles photo upload and retrieval from Drive folders
 */

export interface Photo {
  id: string;
  url: string;
  name: string;
  timestamp: number;
}

export interface UploadResult {
  success: boolean;
  file_id?: string;
  file_name?: string;
  error?: string;
}

export interface DriveService {
  uploadPhoto(file: File): Promise<UploadResult>;
  listPhotos(): Promise<Photo[]>;
}

export function createDriveService(script_url: string): DriveService {
  return {
    async uploadPhoto(file: File): Promise<UploadResult> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async () => {
          try {
            const base64 = (reader.result as string).split(',')[1];

            const response = await fetch(script_url, {
              method: 'POST',
              body: JSON.stringify({
                file: base64,
                fileName: file.name,
                mimeType: file.type,
              }),
            });

            const result = await response.json();

            if (result.success) {
              resolve({
                success: true,
                file_id: result.fileId,
                file_name: result.fileName,
              });
            } else {
              resolve({
                success: false,
                error: result.error || 'Unknown error',
              });
            }
          } catch (error) {
            reject(error);
          }
        };

        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    },

    async listPhotos(): Promise<Photo[]> {
      try {
        const response = await fetch(`${script_url}?action=list`, {
          method: 'GET',
          redirect: 'follow',
        });

        const data = await response.json();

        if (data.success && data.photos) {
          return data.photos as Photo[];
        }

        return [];
      } catch (error) {
        console.error('Error fetching photos from Drive:', error);
        return [];
      }
    },
  };
}

export function getDriveImageUrl(photo_id: string, size: number = 1600): string {
  return `https://drive.google.com/thumbnail?id=${photo_id}&sz=w${size}`;
}

