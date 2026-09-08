'use client';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useRef } from 'react';

export function TelegramPopup({ open, onOpenChange, title, message, url }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; message: string; url: string }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent showCloseButton={false} className="telegram-popup" initialFocus={titleRef}>
      <DialogTitle ref={titleRef} tabIndex={-1} className="telegram-title">{title}</DialogTitle>
      <DialogDescription className="telegram-description">{message}</DialogDescription>
      <div className="telegram-actions">
        <DialogClose className="telegram-cancel">Cancel</DialogClose>
        <a className="telegram-join" href={url} target="_blank" rel="noopener noreferrer" onClick={() => onOpenChange(false)}>Join</a>
      </div>
    </DialogContent>
  </Dialog>;
}
