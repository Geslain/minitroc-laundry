
import { promises as fs } from 'fs';

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/app/uploads';

export class LocalStorage {
  private static async ensureDir(dirPath: string) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  static async uploadFile(
      file: File,
      userId: string,
      folder: string = 'photos'
  ): Promise<{ success: boolean; photoKey?: string; photoUrl?: string; error?: string }> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      // Create the path with the user ID using alternative methods.
      const userDir = `${UPLOAD_DIR}/${folder}/${userId}`;
      await this.ensureDir(userDir);

      // Generate a unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const photoKey = `${folder}/${userId}/${fileName}`;

      const filePath = `${UPLOAD_DIR}/${photoKey}`;

      // Save the file
      await fs.writeFile(filePath, buffer);

      // Public URL (accessible via the Next.js API)
      const photoUrl = `/api/uploads/${photoKey}`;

      return {
        success: true,
        photoKey,
        photoUrl
      };
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  static async deleteFile(photoKey: string): Promise<{ success: boolean; error?: string }> {
    try {
      const filePath = `${UPLOAD_DIR}/${photoKey}`;
      await fs.unlink(filePath);
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  static async deleteFiles(photoKeys: string[]): Promise<{ success: boolean; error?: string }> {
    try {
      await Promise.all(
          photoKeys.map(photoKey => {
            const filePath = `${UPLOAD_DIR}/${photoKey}`;
            return fs.unlink(filePath).catch(() => {
              // Ignore errors if the file does not exist.
            });
          })
      );
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression multiple:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }
}