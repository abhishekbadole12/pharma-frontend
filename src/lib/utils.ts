import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveImageUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('https://drive.usercontent.google.com/download')) {
    const fileId = new URL(url).searchParams.get('id');
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (fileId && backendUrl) return `${backendUrl}/api/products/drive-image/${fileId}`;
  }
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  return backendUrl && url.startsWith('/uploads/') ? `${backendUrl}${url}` : url;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

