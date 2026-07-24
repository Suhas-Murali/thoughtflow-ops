import { useState, useCallback } from 'react';
import { uploadFile } from '../services/api';
import { useUpload } from '../context/UploadContext';

function FileUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const { isUploading, setIsUploading, setLastUploadResult } = useUpload();

  const handleFile = useCallback(async (file) => {
    if (!file) return;

    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const isValid = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!isValid) {
      setError('Please upload an Excel (.xlsx, .xls) or CSV file.');
      return;
    }

    setError(null);
    setIsUploading(true);
    setProgress(0);

    try {
      const result = await uploadFile(file, setProgress);
      setLastUploadResult(result);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [setIsUploading, setLastUploadResult]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: isDragging ? '2px solid #4f46e5' : '2px dashed #ccc',
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          backgroundColor: isDragging ? '#eef2ff' : '#fafafa',
          cursor: 'pointer',
        }}
        onClick={() => document.getElementById('file-input').click()}
      >
        <p>Drag and drop an Excel file here, or click to browse</p>
        <input
          id="file-input"
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
      </div>

      {isUploading && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progress}%`,
                background: '#4f46e5',
                height: '8px',
                transition: 'width 0.2s',
              }}
            />
          </div>
          <p>{progress}% uploaded — processing may take a moment after upload completes...</p>
        </div>
      )}

      {error && <p style={{ color: 'red', marginTop: '12px' }}>{error}</p>}
    </div>
  );
}

export default FileUploader;