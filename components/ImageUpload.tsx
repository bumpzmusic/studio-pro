import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';
import { Language, translations } from '../utils/translations';

interface ImageUploadProps {
  onImagesSelected: (files: File[]) => void;
  language: Language;
  compact?: boolean; // New prop for small upload button
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImagesSelected, language, compact = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const t = translations[language];

  const processFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    
    const validFiles: File[] = [];
    Array.from(fileList).forEach(file => {
      if (file.type.startsWith('image/')) {
         validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      onImagesSelected(validFiles);
    }
  }, [onImagesSelected]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  if (compact) {
    return (
      <label className="flex flex-col items-center justify-center w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 dark:border-[#444444] hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer transition-all bg-white dark:bg-[#252525] shrink-0">
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          multiple
          onChange={(e) => processFiles(e.target.files)}
        />
        <Plus size={24} className="text-slate-400 dark:text-slate-500 mb-1" />
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.add_more}</span>
      </label>
    );
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`
        w-full h-64 sm:h-80 border-3 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200
        ${isDragging 
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 scale-[1.01]' 
          : 'border-slate-300 dark:border-[#444444] hover:border-green-400 hover:bg-slate-50 dark:hover:bg-[#2D2D2D]'
        }
      `}
    >
      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          multiple
          onChange={(e) => processFiles(e.target.files)}
        />
        <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-green-200 text-green-700' : 'bg-slate-100 dark:bg-[#333333] text-slate-400'}`}>
          {isDragging ? <ImageIcon size={32} /> : <Upload size={32} />}
        </div>
        <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
          {isDragging ? 'Drop them here!' : t.upload_label}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
          JPG, PNG (Max 4MB)
        </p>
      </label>
    </div>
  );
};