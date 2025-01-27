import { useCallback, useState } from 'react';

// ----------------------------------------------------------------------

export type UsePopoverReturnType = {
  onClose: VoidFunction;
  open: HTMLElement | null;
  onOpen: (event: React.MouseEvent<HTMLElement>) => void;
  setOpen: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
};

export default function usePopover(): UsePopoverReturnType {
  const [open, setOpen] = useState<HTMLElement | null>(null);

  const onOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  }, []);

  const onClose = useCallback(() => {
    setOpen(null);
  }, []);

  return {
    open,
    onOpen,
    onClose,
    setOpen,
  };
}
