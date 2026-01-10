/**
 * Utility functions for model capabilities detection
 */

import type { LLMConnection } from '../types';

/**
 * Filter LLM connections to only include enabled ones
 */
export function getEnabledLLMConnections(
  connections: LLMConnection[]
): LLMConnection[] {
  return connections.filter((conn) => conn.enabled);
}

/**
 * Check if a model supports vision/image inputs
 * Based on model name patterns for common vision-capable models
 */
export function isVisionModel(modelName: string | undefined | null): boolean {
  if (!modelName) return false;

  const name = modelName.toLowerCase();

  // OpenAI Vision models
  // GPT-4o and variants (all support vision)
  if (name.startsWith('gpt-4o')) {
    return true;
  }

  // GPT-4 Turbo (supports vision)
  if (name.startsWith('gpt-4-turbo')) {
    return true;
  }

  // GPT-4 with vision (specific versions)
  if (
    name.startsWith('gpt-4') &&
    (name.includes('vision') ||
      name.includes('0125-preview') ||
      name.includes('1106-preview') ||
      name.includes('2024-04-09') ||
      name.includes('2024-08-06') ||
      name.includes('2024-11-20'))
  ) {
    return true;
  }

  // O1 models (support multimodal from Jan 2025)
  if (name.startsWith('o1')) {
    return true;
  }

  // GPT-5 models (support multimodal)
  if (name.startsWith('gpt-5')) {
    return true;
  }

  // Claude Vision models (Anthropic)
  if (
    name.includes('claude-3') ||
    name.includes('claude-3-5') ||
    name.includes('claude-3-opus') ||
    name.includes('claude-3-sonnet') ||
    name.includes('claude-3-haiku') ||
    name.includes('claude-3-5-sonnet') ||
    name.includes('claude-3-5-opus')
  ) {
    return true;
  }

  // Gemini Vision models (Google) - All Gemini 1.0+ support vision
  if (name.startsWith('gemini')) {
    return true;
  }

  // Ollama vision models (common patterns)
  if (
    name.includes('llava') ||
    name.includes('bakllava') ||
    name.includes('minicpm-v') ||
    name.includes('moondream') ||
    name.includes('vision')
  ) {
    return true;
  }

  return false;
}

/**
 * Get a list of known vision-capable model name patterns
 * Useful for debugging or displaying supported models
 */
export function getVisionModelPatterns(): string[] {
  return [
    'gpt-4-vision',
    'gpt-4-turbo',
    'gpt-4o',
    'gpt-4o-mini',
    'claude-3',
    'claude-3-5',
    'gemini-pro-vision',
    'gemini-1.5',
    'llava',
    'bakllava',
  ];
}
