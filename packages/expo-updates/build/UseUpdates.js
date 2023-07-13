import { useEffect, useState } from 'react';
import * as Updates from './Updates';
import { emitUseUpdatesEvent } from './UpdatesEmitter';
import { useNativeStateMachineContext } from './UpdatesHooks';
import { UseUpdatesInternalEventType, } from './UseUpdates.types';
import { useUpdatesInternalEvents } from './UseUpdatesHooks';
import { currentlyRunning, defaultUseUpdatesState, reduceUpdatesStateFromContext, } from './UseUpdatesUtils';
/**
 * Calls [`Updates.checkForUpdateAsync()`](https://docs.expo.dev/versions/latest/sdk/updates/#updatescheckforupdateasync)
 * and refreshes the `availableUpdate` property with the result.
 * If an error occurs, the `error` property will be set.
 */
const checkForUpdate = () => {
    Updates.checkForUpdateAsync();
};
/**
 * Downloads an update, if one is available, using
 * [`Updates.fetchUpdateAsync()`](https://docs.expo.dev/versions/latest/sdk/updates/#updatesfetchupdateasync).
 * This should not be called unless `isUpdateAvailable` is true.
 * If an error occurs, the `error` property will be set.
 */
const downloadUpdate = () => {
    Updates.fetchUpdateAsync();
};
/**
 * Runs an update by calling [`Updates.reloadAsync()`](https://docs.expo.dev/versions/latest/sdk/updates/#updatesreloadasync).
 * This instructs the app to reload using the most recently downloaded version.
 * This is useful for triggering a newly downloaded update to launch without the user needing to manually restart the app.
 * This should not be called unless there is an available update
 * that has already been successfully downloaded (`isUpdatePending` is true).
 * If an error occurs, the `error` property will be set.
 */
const runUpdate = () => {
    Updates.reloadAsync();
};
/**
 * Calls `Updates.readLogEntriesAsync()` and sets the `logEntries` property to the results.
 * If an error occurs, the `error` property will be set.
 *
 * @param maxAge Max age of log entries to read, in ms. Defaults to 3600000 (1 hour).
 */
const readLogEntries = (maxAge = 3600000) => {
    Updates.readLogEntriesAsync(maxAge)
        .then((logEntries) => {
        emitUseUpdatesEvent({
            type: UseUpdatesInternalEventType.READ_LOG_ENTRIES_COMPLETE,
            logEntries,
        });
    })
        .catch((error) => {
        emitUseUpdatesEvent({
            type: UseUpdatesInternalEventType.ERROR,
            error,
        });
    });
};
/**
 * Hook that obtains information on available updates and on the currently running update.
 *
 * @return the structures with information on currently running and available updates.
 *
 * @example
 * ```tsx UpdatesDemo.tsx
 * import { StatusBar } from 'expo-status-bar';
 * import React from 'react';
 * import { Pressable, Text, View } from 'react-native';
 *
 * import type { UseUpdatesEvent } from '@expo/use-updates';
 * import {
 *   useUpdates,
 *   checkForUpdate,
 *   downloadUpdate,
 *   runUpdate,
 * } from '@expo/use-updates';
 *
 * export default function UpdatesDemo() {
 *   const { currentlyRunning, availableUpdate, isUpdateAvailable, isUpdatePending } = useUpdates();
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
 *       <Button pressHandler={checkForUpdate} text="Check manually for updates" />
 *       {showDownloadButton ? (
 *         <Button pressHandler={downloadUpdate} text="Download and run update" />
 *       ) : null}
 *       <StatusBar style="auto" />
 *     </View>
 *   );
 * }
 * ```
 */
const useUpdates = () => {
    const [updatesState, setUpdatesState] = useState(defaultUseUpdatesState);
    const context = useNativeStateMachineContext();
    // Change the state based on native state machine context changes
    useEffect(() => {
        setUpdatesState((updatesState) => reduceUpdatesStateFromContext(updatesState, context));
    }, [context]);
    // Set up listener for events from readLogEntriesAsync
    useUpdatesInternalEvents((event) => {
        switch (event.type) {
            case UseUpdatesInternalEventType.ERROR:
                setUpdatesState((updatesState) => ({
                    ...updatesState,
                    error: event.error,
                }));
                break;
            case UseUpdatesInternalEventType.READ_LOG_ENTRIES_COMPLETE:
                setUpdatesState((updatesState) => ({
                    ...updatesState,
                    logEntries: event?.logEntries,
                }));
                break;
            default:
                break;
        }
    });
    // Return the updates info and the user facing functions
    return {
        currentlyRunning,
        ...updatesState,
    };
};
export { checkForUpdate, downloadUpdate, runUpdate, readLogEntries, useUpdates };
//# sourceMappingURL=UseUpdates.js.map