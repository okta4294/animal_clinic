import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import { UTApi } from "uploadthing/server";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

// Fungsi untuk menghapus file dari UploadThing
export const deleteUploadThingFile = async (fileUrl: string) => {
  try {
    // Ekstrak file key dari URL UploadThing
    // Contoh URL: https://utfs.io/f/2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg
    const url = new URL(fileUrl);
    
    // File key adalah bagian setelah /f/ dalam pathname
    const pathParts = url.pathname.split('/');
    const fileKey = pathParts[pathParts.length - 1]; // Ambil bagian terakhir
    
    if (!fileKey) {
      throw new Error("Invalid file URL - cannot extract file key");
    }

    console.log("Extracted file key:", fileKey); // Untuk debugging

    const response = await fetch('/api/delete-file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileKey }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete file from UploadThing');
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error deleting file from UploadThing:', error);
    throw error;
  }
};

// Export UTApi untuk digunakan di API routes
export { UTApi };

