import { useEffect, useRef } from 'react';

interface UseTextareaAutoResizeProps {
  val: string;
  minHeight?: number;
  maxHeight?: number;
}

export function useTextareaAutoResize({
  val,
  minHeight = 40,
  maxHeight = 200,
}: UseTextareaAutoResizeProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Note: We use JS resize + debounce instead of CSS `field-sizing: content`
    // because `field-sizing` is not yet supported in WebKit (Safari/Tauri macOS).
    // The CSS Grid hack approach (textarea over hidden div) doubles DOM nodes
    // and doesn't offer better performance than this debounced JS solution.
    const resize = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        const newHeight = Math.max(
          minHeight,
          Math.min(scrollHeight, maxHeight)
        );
        textarea.style.height = `${newHeight}px`;
        textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
      }
    };

    // Immediate resize if input is cleared
    if (!val) {
      resize();
      return;
    }

    // Debounce resize to prevent lag with large input
    const timer = setTimeout(resize, 20);
    return () => clearTimeout(timer);
  }, [val, minHeight, maxHeight]);

  return { textareaRef };
}
