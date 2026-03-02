import { memo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FormDialog } from '@/ui/molecules/FormDialog';
import type { LLMConnection } from '../types';
import { LLMConnectionForm } from './LLMConnectionForm';

interface LLMConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connection: LLMConnection | null;
  onSave: (connection: Omit<LLMConnection, 'id'>) => void;
  onDelete?: () => void;
}

/**
 * Memoized dialog wrapper for LLM connection form.
 * Renders Save/Delete in the dialog footer so they stay visible on all platforms (e.g. Windows WebView).
 */
export const LLMConnectionDialog = memo(function LLMConnectionDialog({
  open,
  onOpenChange,
  connection,
  onSave,
  onDelete,
}: LLMConnectionDialogProps) {
  const { t } = useTranslation(['settings', 'common']);
  const [footer, setFooter] = useState<React.ReactNode>(null);

  const handleFooterRender = useCallback((node: React.ReactNode) => {
    setFooter(node);
  }, []);

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={connection ? t('editConnection') : t('addNewConnection')}
      description={t('configureConnection')}
      maxWidth="2xl"
      scrollable={true}
      scrollableHeightClass="min-h-0 flex-1"
      footer={footer}
    >
      <LLMConnectionForm
        connection={connection}
        onSave={onSave}
        onDelete={onDelete}
        onClose={() => onOpenChange(false)}
        onFooterRender={handleFooterRender}
      />
    </FormDialog>
  );
});
