import { useState, useCallback } from "react";
import { protectedAxios } from "../../axios";

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  [key: string]: string | number | boolean | undefined;
}

interface UseImageUploadReturn {
  uploadImage: (file: File) => Promise<string>;
  isUploading: boolean;
  error: string | null;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(
    async (file: File): Promise<string> => {
      setIsUploading(true);
      setError(null);

      try {
        // Validate file
        if (!file.type.startsWith("image/")) {
          throw new Error("Please select an image file");
        }

        if (file.size > 10 * 1024 * 1024) {
          throw new Error("Image must be less than 10MB");
        }

        // Get upload signature from backend
        interface SignatureData {
          apiKey: string;
          timestamp: string;
          signature: string;
          folder?: string;
          cloudName: string;
        }
        let signature: SignatureData;
        try {
          const signatureResponse = await protectedAxios.post(
            "/user/upload-signature"
          );
          signature = signatureResponse.data?.data || signatureResponse.data;
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : "Failed to get upload signature";
          throw new Error(errorMsg);
        }

        // Upload to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signature.apiKey);
        formData.append("timestamp", signature.timestamp.toString());
        formData.append("signature", signature.signature);
        formData.append("folder", signature.folder || "chronovah");

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!cloudinaryResponse.ok) {
          throw new Error("Failed to upload image to Cloudinary");
        }

        const uploadedData = (await cloudinaryResponse.json()) as CloudinaryResponse;

        return uploadedData.secure_url;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to upload image";
        setError(errorMessage);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  return {
    uploadImage,
    isUploading,
    error,
  };
};
