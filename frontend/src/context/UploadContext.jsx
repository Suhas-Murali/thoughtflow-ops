import { createContext, useContext, useState } from 'react';

const UploadContext = createContext(null);

export function UploadProvider({ children }) {
  const [isUploading, setIsUploading] = useState(false);
  const [lastUploadResult, setLastUploadResult] = useState(null);

  return (
    <UploadContext.Provider value={{ isUploading, setIsUploading, lastUploadResult, setLastUploadResult }}>
      {children}
    </UploadContext.Provider>
  );
}

export function useUpload() {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
}