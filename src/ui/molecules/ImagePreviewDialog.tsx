import { Dialog, DialogContent } from '@/ui/atoms/dialog/component';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setImagePreviewOpen } from '@/features/ui/state/uiSlice';
import { X } from 'lucide-react';
import { Button } from '@/ui/atoms/button/button';

export function ImagePreviewDialog() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.ui.imagePreviewOpen);
  const imageUrl = useAppSelector((state) => state.ui.imagePreviewUrl);

  const handleClose = () => {
    dispatch(setImagePreviewOpen({ open: false }));
  };

  if (!imageUrl) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none overflow-hidden flex items-center justify-center">
        <div className="relative flex items-center justify-center w-full h-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-2 right-2 z-50 rounded-full bg-background/50 hover:bg-background/80 text-foreground backdrop-blur-sm"
          >
            <X className="h-5 w-5" />
          </Button>
          <img
            src={imageUrl}
            alt="Preview"
            className="object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
