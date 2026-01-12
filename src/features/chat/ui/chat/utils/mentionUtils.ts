/**
 * Utility to parse mentions from message content
 * Checks for @mentions at the very beginning of the content
 */
export function parseMessageMentions(content: string) {
  if (!content || !content.startsWith('@')) {
    return { mentions: [], cleanedContent: content };
  }

  // Regex to match mentions at the start of the string
  // Matches one or more @tokens optionally followed by whitespace
  // Example: "@agent1 @agent2.id Hello" -> group 0 is "@agent1 @agent2.id "
  const startMentionRegex = /^((?:@[a-zA-Z0-9.-]+\s*)+)/;
  const match = content.match(startMentionRegex);

  if (!match) {
    return { mentions: [], cleanedContent: content };
  }

  const fullMentionStr = match[0];
  // Extract individual IDs (remove @)
  const mentions =
    fullMentionStr.match(/@([a-zA-Z0-9.-]+)/g)?.map((m) => m.substring(1)) ||
    [];

  if (mentions.length === 0) {
    return { mentions: [], cleanedContent: content };
  }

  // Clean the content by removing the prefix mentions
  const cleanedContent = content.substring(fullMentionStr.length).trim();

  return { mentions, cleanedContent };
}
