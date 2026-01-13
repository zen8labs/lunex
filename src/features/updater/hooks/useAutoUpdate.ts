import { useEffect, useState } from 'react';
import { useUpdate } from '../lib/useUpdate';

export function useAutoUpdate() {
  const {
    status,
    update,
    error,
    checkUpdate,
    installUpdate,
    downloadProgress,
  } = useUpdate();
  const [modalOpen, setModalOpen] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  // Automatically check for updates on mount
  useEffect(() => {
    if (!hasChecked) {
      checkUpdate(true).then(() => {
        setHasChecked(true);
      });
    }
  }, [checkUpdate, hasChecked]);

  // If an update is available, show the modal
  useEffect(() => {
    if (status === 'available' && update) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModalOpen(true);
    }
  }, [status, update]);

  return {
    status,
    update,
    error,
    modalOpen,
    setModalOpen,
    checkUpdate,
    installUpdate,
    downloadProgress,
  };
}
