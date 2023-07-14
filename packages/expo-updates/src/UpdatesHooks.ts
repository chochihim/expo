import { useEffect, useRef, useState } from 'react';

import * as Updates from './Updates';
import { UpdateEvent, UpdatesNativeStateMachineContext } from './Updates.types';
import { addListener, addUpdatesStateChangeListener } from './UpdatesEmitter';

/**
 * React hook to create an [`UpdateEvent`](#updateevent) listener subscription on mount, using
 * [`addListener`](#updatesaddlistenerlistener). It calls `remove()` on the subscription during unmount.
 *
 * @param listener A function that will be invoked with an [`UpdateEvent`](#updateevent) instance
 * and should not return any value.
 *
 * @example
 * ```ts
 * function App() {
 *   const eventListener = (event) => {
 *     if (event.type === Updates.UpdateEventType.ERROR) {
 *       // Handle error
 *     } else if (event.type === Updates.UpdateEventType.NO_UPDATE_AVAILABLE) {
 *       // Handle no update available
 *     } else if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
 *       // Handle update available
 *     }
 *   };
 *   Updates.useUpdateEvents(eventListener);
 *   // React Component...
 * }
 * ```
 */
export const useUpdateEvents = (listener: (event: UpdateEvent) => void) => {
  const listenerRef = useRef<typeof listener>();

  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  useEffect(() => {
    if (listenerRef.current) {
      const subscription = addListener(listenerRef.current);
      return () => {
        subscription.remove();
      };
    }
    return undefined;
  }, []);
};

/**
 * @hidden
 */
export const useNativeStateMachineContext: () => UpdatesNativeStateMachineContext = () => {
  // Hook to return the Updates state machine context maintained
  // in native code.
  // Eventually, this will be used to construct the information returned by `useUpdates()`.
  // Used internally by this module and not exported publicly.
  const [localState, setLocalState] = useState<UpdatesNativeStateMachineContext>({
    isUpdateAvailable: false,
    isUpdatePending: false,
    isRollback: false,
    isChecking: false,
    isDownloading: false,
    isRestarting: false,
    checkError: undefined,
    downloadError: undefined,
    latestManifest: undefined,
    downloadedManifest: undefined,
  });
  useEffect(() => {
    Updates.getNativeStateMachineContextAsync().then((context) => {
      setLocalState(context);
    });
    const subscription = addUpdatesStateChangeListener((event) => {
      setLocalState(event.context);
    });
    return () => subscription.remove();
  }, []);
  return localState;
};
