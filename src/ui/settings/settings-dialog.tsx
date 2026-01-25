import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui/atoms/dialog';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/ui/atoms/button/button';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  activeViewTitle?: string;
  onBack?: () => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  title,
  children,
  activeViewTitle,
  onBack,
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[600px] w-full h-[700px] p-0 overflow-hidden flex flex-col gap-0 border-none shadow-2xl"
        showCloseButton
      >
        <DialogHeader className="px-5 border-b shrink-0 flex flex-row items-center gap-4 space-y-0">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -ml-2"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <DialogTitle className="text-lg font-semibold truncate leading-none p-0 my-4">
            {activeViewTitle || title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden relative bg-muted/30">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SettingsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-4 p-4', className)}>{children}</div>
  );
}

export function SettingsSection({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {title && (
        <h3 className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest px-1">
          {title}
        </h3>
      )}
      <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
        {children}
      </div>
    </div>
  );
}
