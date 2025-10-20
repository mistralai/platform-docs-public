'use client';

import * as Dialog from '@radix-ui/react-dialog';

export const MobileMenuProvider = Dialog.Root;

export const MobileMenuTrigger = Dialog.Trigger;

export const MobileMenuClose = Dialog.Close;

export const MobileMenuContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Dialog.Portal>
      <Dialog.Overlay
        data-dialog-type="overlay"
        className="fixed top-header inset-0 dark:bg-black/50 bg-white/50 z-[9999] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      />

      <Dialog.Content
        onInteractOutside={e => {
          if (
            e.target instanceof HTMLElement &&
            e.target.dataset['dialogType'] != 'overlay'
          ) {
            e.preventDefault();
          }
        }}
        className="fixed focus:outline-none pointer-events-none top-header group/menu-content left-0 right-0 z-[10000]"
      >
        <Dialog.Title className="sr-only">Mobile Menu</Dialog.Title>
        <Dialog.Description className="sr-only">
          Mobile Menu Links
        </Dialog.Description>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
};
