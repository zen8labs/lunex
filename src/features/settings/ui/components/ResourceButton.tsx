import React, { memo } from 'react';
import { Button } from '@/ui/atoms/button/button';

interface ResourceButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export const ResourceButton = memo(function ResourceButton({
  icon,
  label,
  onClick,
}: ResourceButtonProps) {
  return (
    <Button
      variant="outline"
      className="w-full justify-start h-12 gap-3 hover:bg-accent/50 group border-muted-foreground/20"
      onClick={onClick}
    >
      <div className="text-muted-foreground group-hover:text-foreground transition-colors">
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
});
