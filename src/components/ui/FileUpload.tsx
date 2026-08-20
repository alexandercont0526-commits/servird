"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  folder?: string;
  className?: string;
}

export default function FileUpload({
  onUpload,
  accept = { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
  maxSize = 5 * 1024 * 1024,
  folder = "servird",
  className,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      setIsUploading(true);
      setError("");

      try {
        for (const file of acceptedFiles) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", folder);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          if (data.success) {
            onUpload(data.data.url);
          } else {
            setError(data.error || "Error al subir archivo");
          }
        }
      } catch {
        setError("Error de conexión al subir");
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload, folder]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${className || ""}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
            <span className="text-sm text-gray-500">Subiendo...</span>
          </div>
        ) : (
          <>
            <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-500">
              {isDragActive ? "Suelta el archivo aquí" : "Arrastra o haz clic para subir"}
            </p>
            <p className="text-xs text-gray-400 mt-1">Máx. {Math.round(maxSize / 1024 / 1024)}MB</p>
          </>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
