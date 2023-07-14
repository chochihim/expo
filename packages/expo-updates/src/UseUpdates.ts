import { useEffect, useState } from 'react';

import { useNativeStateMachineContext } from './UpdatesHooks';
import {
  CurrentlyRunningInfo,
  UpdateInfo,
  UseUpdatesStateType,
  UseUpdatesReturnType,
} from './UseUpdates.types';
import {
  currentlyRunning,
  defaultUseUpdatesState,
  reduceUpdatesStateFromContext,
} from './UseUpdatesUtils';

export type { CurrentlyRunningInfo, UpdateInfo, UseUpdatesReturnType };

/**
 * Hook that obtains information on available updates and on the currently running update.
 *
 * @return the structures with information on currently running and available updates.
 *
 * @example
 * ```tsx UpdatesDemo.tsx
 * import { StatusBar } from 'expo-status-bar';
 * import * as Updates from 'expo-updates';
 * import React from 'react';
 * import { Pressable, Text, View } from 'react-native';
 *
 * export default function UpdatesDemo() {
 *   const {
 *     currentlyRunning,
 *     availableUpdate,
 *     isUpdateAvailable,
 *     isUpdatePending
 *   } = Updates.useUpdates();
 *
 *   React.useEffect(() => {
 *     if (isUpdatePending) {
 *       // Update has successfully downloaded
 *       runUpdate();
 *     }
 *   }, [isUpdatePending]);
 *
 *   // If true, we show the button to download and run the update
 *   const showDownloadButton = isUpdateAvailable;
 *
 *   // Show whether or not we are running embedded code or an update
 *   const runTypeMessage = currentlyRunning.isEmbeddedLaunch
 *     ? 'This app is running from built-in code'
 *     : 'This app is running an update';
 *
 *   return (
 *     <View style={styles.container}>
 *       <Text style={styles.headerText}>Updates Demo</Text>
 *       <Text>{runTypeMessage}</Text>
 *       <Button pressHandler={() => Updates.checkForUpdateAsync()} text="Check manually for updates" />
 *       {showDownloadButton ? (
 *         <Button pressHandler={() => Updates.fetchUpdateAsync()} text="Download and run update" />
 *       ) : null}
 *       <StatusBar style="auto" />
 *     </View>
 *   );
 * }
 * ```
 */
export const useUpdates: () => UseUpdatesReturnType = () => {
  const [updatesState, setUpdatesState] = useState<UseUpdatesStateType>(defaultUseUpdatesState);

  const context = useNativeStateMachineContext();

  // Change the state based on native state machine context changes
  useEffect(() => {
    setUpdatesState((updatesState) => reduceUpdatesStateFromContext(updatesState, context));
  }, [context]);

  // Return the updates info and the user facing functions
  return {
    currentlyRunning,
    ...updatesState,
  };
};
