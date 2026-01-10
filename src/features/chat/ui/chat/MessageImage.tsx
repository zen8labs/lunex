import { useState, useEffect } from 'react';
import { readFile } from '@tauri-apps/plugin-fs';
import { convertFileSrc } from '@tauri-apps/api/core';

interface MessageImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: (url: string) => void;
}

export const MessageImage = ({
  src,
  alt,
  className,
  onClick,
}: MessageImageProps) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let url: string | null = null;

    const loadLocalImage = async () => {
      // Only handle local paths (not data: or http/s:)
      if (!src.startsWith('data:') && !src.startsWith('http')) {
        try {
          const contents = await readFile(src);
          const blob = new Blob([contents]);
          url = URL.createObjectURL(blob);
          if (active) {
            setObjectUrl(url);
          } else {
            URL.revokeObjectURL(url);
          }
        } catch (err) {
          console.error('Failed to load local image:', src, err);
        }
      }
    };

    loadLocalImage();

    return () => {
      active = false;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [src]);

  // Determine the display source
  const displaySrc = (() => {
    if (src.startsWith('data:') || src.startsWith('http')) {
      return src;
    }
    if (objectUrl) {
      return objectUrl;
    }
    // Fallback to convertFileSrc (asset://) if objectUrl not ready or failed,
    // though likely if readFile failed, convertFileSrc might also fail if it's permission issue.
    // But convertFileSrc is immediate.
    return convertFileSrc(src);
  })();

  return (
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      loading="lazy"
      onClick={() => onClick?.(displaySrc)}
      onError={() => {
        console.error('Image load error for src:', displaySrc);
      }}
    />
  );
};
