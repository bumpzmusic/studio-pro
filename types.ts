export interface StyleOption {
  id: string;
  name: string;
  prompt: string;
  description: string;
  color: string;
}

export interface GeneratedImage {
  data: string; // Base64 string
  mimeType: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "16:9" | "9:16";

export interface GalleryItem {
  id: string;
  file: File;
  preview: string; // Original base64
  generated: GeneratedImage | null;
  status: AppStatus;
  error?: string;
}