import { useState, useCallback, useEffect, useRef } from 'react';

export const useTTS = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  const speak = useCallback((text: string) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Remove markdown symbols for better reading
    // This is a basic cleanup, can be improved
    const cleanText = text
      .replace(/#+\s/g, '') // headers
      .replace(/\*\*/g, '') // bold
      .replace(/\*/g, '') // italic
      .replace(/```[\s\S]*?```/g, '') // code blocks
      .replace(/`.*?`/g, '') // inline code
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // links
      .replace(/!\[.*?\]\(.*?\)/g, '') // images
      .replace(/>\s/g, '') // quotes
      .replace(/-\s/g, '') // list items
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Detect language (simple check for Vietnamese characters)
    const hasVietnamese =
      /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(
        cleanText
      );
    const lang = hasVietnamese ? 'vi-VN' : 'en-US';

    const voices = window.speechSynthesis.getVoices();

    const findVoice = (targetLang: string) => {
      return (
        voices.find((v) => v.lang === targetLang) ||
        voices.find((v) => v.lang.startsWith(targetLang.split('-')[0]))
      );
    };

    let voice = findVoice(lang);

    // Fallback if target language voice not found
    if (!voice) {
      voice = voices.find((v) => v.default) || voices[0];
    }

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = lang;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const toggle = useCallback(
    (text: string) => {
      if (isPlaying) {
        stop();
      } else {
        speak(text);
      }
    },
    [isPlaying, speak, stop]
  );

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return { isPlaying, speak, stop, toggle };
};
