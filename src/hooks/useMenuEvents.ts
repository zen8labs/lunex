import { useEffect, useRef } from 'react';
import { listenToEvent, TauriEvents } from '@/lib/tauri';
import { useAppDispatch } from '@/app/hooks';
import {
  navigateToSettings,
  setAboutOpen,
  setKeyboardShortcutsOpen,
  toggleSidebar,
  setTheme,
} from '@/features/ui/state/uiSlice';
import { createChat } from '@/features/chat/state/chatsSlice';
import { useWorkspaces } from '@/features/workspace';
import { useTranslation } from 'react-i18next';

/**
 * Hook to listen for Tauri menu events and dispatch Redux actions
 */
export function useMenuEvents(options?: { onCheckUpdate?: () => void }) {
  const { onCheckUpdate } = options || {};
  const dispatch = useAppDispatch();
  const { selectedWorkspaceId } = useWorkspaces();
  const { t } = useTranslation(['common']);

  // Use refs to store latest values without recreating listeners
  const selectedWorkspaceIdRef = useRef(selectedWorkspaceId);
  const dispatchRef = useRef(dispatch);
  const tRef = useRef(t);
  const onCheckUpdateRef = useRef(onCheckUpdate);

  // Update refs when values change
  useEffect(() => {
    selectedWorkspaceIdRef.current = selectedWorkspaceId;
    dispatchRef.current = dispatch;
    tRef.current = t;
    onCheckUpdateRef.current = onCheckUpdate;
  }, [selectedWorkspaceId, dispatch, t, onCheckUpdate]);

  useEffect(() => {
    let unlisteners: (() => void)[] = [];
    let isMounted = true;

    // Setup listeners
    const setupListeners = async () => {
      // New Chat
      const unlisten1 = await listenToEvent(TauriEvents.MENU_NEW_CHAT, () => {
        const currentWorkspaceId = selectedWorkspaceIdRef.current;
        if (currentWorkspaceId && isMounted) {
          dispatchRef.current(
            createChat({
              workspaceId: currentWorkspaceId,
              title: tRef.current('newConversation', { ns: 'common' }),
            })
          );
        }
      });
      unlisteners.push(unlisten1);

      // Toggle Sidebar
      const unlisten2 = await listenToEvent(
        TauriEvents.MENU_TOGGLE_SIDEBAR,
        () => {
          if (isMounted) {
            dispatchRef.current(toggleSidebar());
          }
        }
      );
      unlisteners.push(unlisten2);

      // Theme
      const unlisten3 = await listenToEvent<'light' | 'dark' | 'system'>(
        TauriEvents.MENU_THEME,
        (theme) => {
          if (isMounted) {
            dispatchRef.current(setTheme(theme));
          }
        }
      );
      unlisteners.push(unlisten3);

      // Settings
      const unlisten4 = await listenToEvent(TauriEvents.MENU_SETTINGS, () => {
        if (isMounted) {
          dispatchRef.current(navigateToSettings());
        }
      });
      unlisteners.push(unlisten4);

      // About
      const unlisten5 = await listenToEvent(TauriEvents.MENU_ABOUT, () => {
        if (isMounted) {
          dispatchRef.current(setAboutOpen(true));
        }
      });
      unlisteners.push(unlisten5);

      // Keyboard Shortcuts
      const unlisten6 = await listenToEvent(
        TauriEvents.MENU_KEYBOARD_SHORTCUTS,
        () => {
          if (isMounted) {
            dispatchRef.current(setKeyboardShortcutsOpen(true));
          }
        }
      );
      unlisteners.push(unlisten6);

      // Check for updates
      const unlisten7 = await listenToEvent(
        TauriEvents.MENU_CHECK_UPDATES,
        async () => {
          if (isMounted) {
            if (onCheckUpdateRef.current) {
              onCheckUpdateRef.current();
            } else {
              try {
                const { check } = await import('@tauri-apps/plugin-updater');
                const update = await check();
                if (update) {
                  await update.downloadAndInstall();
                }
              } catch (error) {
                console.error('Failed to check for updates:', error);
              }
            }
          }
        }
      );
      unlisteners.push(unlisten7);

      // Documentation (placeholder - can open external link)
      const unlisten8 = await listenToEvent(
        TauriEvents.MENU_DOCUMENTATION,
        () => {
          if (isMounted) {
            // TODO: Open documentation URL
          }
        }
      );
      unlisteners.push(unlisten8);
    };

    setupListeners();

    // Cleanup function
    return () => {
      isMounted = false;
      unlisteners.forEach((unlisten) => unlisten());
      unlisteners = [];
    };
  }, []); // Setup only once on mount
}
