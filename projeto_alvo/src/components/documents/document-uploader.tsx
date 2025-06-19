"use client";

import { useState } from "react";
import { getFirebaseDb, getFirebaseStorage } from "@/lib/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";

interface DocumentUploaderProps {
  onTextExtracted: (text: string) => void;
}

export function DocumentUploader({ onTextExtracted }: DocumentUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const processFile = async (file: File) => {
    const storage = getFirebaseStorage();
    const db = getFirebaseDb();
    const docId = crypto.randomUUID();
    const storageRef = ref(storage, `uploads/${docId}/${file.name}`);
    setUploading(true);
    await uploadBytes(storageRef, file);
    await setDoc(doc(db, "ocr_requests", docId), {
      storagePath: storageRef.fullPath,
      createdAt: serverTimestamp(),
    });
    const unsub = onSnapshot(doc(db, "ocr_results", docId), (snap) => {
      const data = snap.data();
      if (data?.text) {
        onTextExtracted(data.text as string);
        setUploading(false);
        unsub();
      }
    });
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    processFile(files[0]);
  };

  return (
    <div className="space-y-2">
      <div
        className={`border-2 border-dashed rounded p-6 text-center cursor-pointer ${isDragOver ? "bg-gray-100" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => document.getElementById("doc-upload-input")?.click()}
      >
        <p className="text-sm">Arraste uma imagem ou clique para fazer upload</p>
      </div>
      <input
        id="doc-upload-input"
        type="file"
        accept="image/*"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      {uploading && (
        <p className="text-sm text-muted-foreground">Processando arquivo...</p>
      )}
    </div>
  );
}
