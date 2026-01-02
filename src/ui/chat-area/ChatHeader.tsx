import { useTranslation } from 'react-i18next';
import { Download, FileText, FileJson } from 'lucide-react';
import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import * as opener from '@tauri-apps/plugin-opener';
import { Button } from '@/ui/atoms/button/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/atoms/dropdown-menu';
import type { Message } from '@/store/types';

interface ChatHeaderProps {
  chatId: string;
  messages: Message[];
}

export function ChatHeader({ chatId, messages }: ChatHeaderProps) {
  const { t } = useTranslation('chat');

  const exportFile = async (
    content: string,
    filename: string,
    extension: string,
    mimeType: string
  ) => {
    // Check if running in Tauri environment
    const isTauri = '__TAURI_INTERNALS__' in window;

    if (isTauri) {
      try {
        const filePath = await save({
          defaultPath: filename,
          filters: [
            {
              name: extension.toUpperCase(),
              extensions: [extension],
            },
          ],
        });

        if (filePath) {
          await writeTextFile(filePath, content);
          // @ts-ignore
          await opener.open(filePath);
        }
        return;
      } catch (error) {
        console.error(
          'Tauri export failed, falling back to browser download',
          error
        );
      }
    }

    // Fallback for browser or failed Tauri export
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    const markdown = messages
      .map((m) => {
        const role = m.role === 'user' ? '**You**' : '**Assistant**';
        const timestamp = new Date(m.timestamp).toLocaleString();
        return `### ${role} (${timestamp})\n\n${m.content}\n\n---\n`;
      })
      .join('\n');

    exportFile(markdown, `chat-${chatId}.md`, 'md', 'text/markdown');
  };

  const handleExportJSON = () => {
    const data = {
      chatId,
      exportedAt: new Date().toISOString(),
      messages,
    };
    const json = JSON.stringify(data, null, 2);
    exportFile(json, `chat-${chatId}.json`, 'json', 'application/json');
  };

  if (messages.length === 0) return null;

  return (
    <div className="flex h-12 shrink-0 items-center justify-end border-b border-border bg-background px-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            {t('exportChat')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExportMarkdown}>
            <FileText className="mr-2 h-4 w-4" />
            Markdown (.md)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportJSON}>
            <FileJson className="mr-2 h-4 w-4" />
            JSON (.json)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
