import * as Updates from './Updates';
import type { UpdatesNativeStateMachineContext } from './Updates.types';
import type { CurrentlyRunningInfo, UseUpdatesStateType } from './UseUpdates.types';
export declare const currentlyRunning: CurrentlyRunningInfo;
export declare const availableUpdateFromContext: (context: {
    [key: string]: any;
}) => {
    updateId: any;
    createdAt: Date | null;
    manifest: any;
} | undefined;
export declare const downloadedUpdateFromContext: (context: {
    [key: string]: any;
}) => {
    updateId: any;
    createdAt: Date | null;
    manifest: any;
} | undefined;
export declare const defaultUseUpdatesState: UseUpdatesStateType;
export declare const reduceUpdatesStateFromContext: (updatesState: UseUpdatesStateType, context: UpdatesNativeStateMachineContext) => {
    isChecking: boolean;
    lastCheckForUpdateTimeSinceRestart: Date;
    availableUpdate?: import("./UseUpdates.types").UpdateInfo | undefined;
    downloadedUpdate?: import("./UseUpdates.types").UpdateInfo | undefined;
    checkError?: Error | undefined;
    downloadError?: Error | undefined;
    isUpdateAvailable: boolean;
    isUpdatePending: boolean;
    isDownloading: boolean;
    logEntries?: Updates.UpdatesLogEntry[] | undefined;
} | {
    isUpdateAvailable: boolean;
    isUpdatePending: boolean;
    isChecking: false;
    isDownloading: boolean;
    availableUpdate: {
        updateId: any;
        createdAt: Date | null;
        manifest: any;
    } | undefined;
    downloadedUpdate: {
        updateId: any;
        createdAt: Date | null;
        manifest: any;
    } | undefined;
    checkError: Error | undefined;
    downloadError: Error | undefined;
    lastCheckForUpdateTimeSinceRestart?: Date | undefined;
    logEntries?: Updates.UpdatesLogEntry[] | undefined;
};
//# sourceMappingURL=UseUpdatesUtils.d.ts.map