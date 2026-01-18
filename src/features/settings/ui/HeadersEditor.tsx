import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/ui/atoms/button/button';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';

interface Header {
  key: string;
  value: string;
}

interface HeadersEditorProps {
  value?: string; // JSON string
  onChange: (value: string | undefined) => void;
  label?: string;
  placeholderKey?: string;
  placeholderValue?: string;
  helperText?: string;
}

function parseHeaders(value: string) {
  try {
    const parsed = JSON.parse(value);
    const headersArray = Object.entries(parsed).map(([key, value]) => ({
      key,
      value: String(value),
    }));
    return headersArray;
  } catch {
    return [];
  }
}

export function HeadersEditor({
  value,
  onChange,
  label,
  placeholderKey,
  placeholderValue,
  helperText,
}: HeadersEditorProps) {
  const { t } = useTranslation('settings');
  const [headers, setHeaders] = useState<Header[]>(parseHeaders(value ?? ''));

  // Convert headers array to JSON string
  const updateHeaders = (newHeaders: Header[]) => {
    setHeaders(newHeaders);
    const validHeaders = newHeaders.filter(
      (h) => h.key.trim() && h.value.trim()
    );
    if (validHeaders.length > 0) {
      const headersObj = validHeaders.reduce(
        (acc, { key, value }) => {
          acc[key.trim()] = value.trim();
          return acc;
        },
        {} as Record<string, string>
      );
      onChange(JSON.stringify(headersObj));
    } else {
      onChange(undefined);
    }
  };

  const handleAdd = () => {
    updateHeaders([...headers, { key: '', value: '' }]);
  };

  const handleRemove = (index: number) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    updateHeaders(newHeaders);
  };

  const handleKeyChange = (index: number, key: string) => {
    const newHeaders = [...headers];
    newHeaders[index].key = key;
    updateHeaders(newHeaders);
  };

  const handleValueChange = (index: number, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index].value = value;
    updateHeaders(newHeaders);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label || t('headersOptional')}
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleAdd}
          className="h-7 py-0 px-2 text-xs hover:bg-muted"
        >
          <Plus className="mr-1 size-3" />
          {t('add', { defaultValue: 'Add' })}
        </Button>
      </div>

      {headers.length > 0 && (
        <div className="space-y-2">
          {headers.map((header, index) => (
            <div key={index} className="flex items-center gap-2 group">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input
                  value={header.key}
                  onChange={(e) => handleKeyChange(index, e.target.value)}
                  placeholder={placeholderKey || t('headerKeyPlaceholder')}
                  className="h-8 text-sm"
                />
                <Input
                  value={header.value}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                  placeholder={placeholderValue || t('headerValuePlaceholder')}
                  className="h-8 text-sm"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(index)}
                className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
              >
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            </div>
          ))}
          {helperText !== undefined ? (
            <p className="text-[10px] text-muted-foreground italic px-1">
              {helperText}
            </p>
          ) : (
            <p className="text-[10px] text-muted-foreground italic px-1">
              {t('headersInfo')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
