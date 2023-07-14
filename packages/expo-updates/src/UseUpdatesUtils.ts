import * as Updates from './Updates';
import type { UpdatesNativeStateMachineContext } from './Updates.types';
import type { CurrentlyRunningInfo, UseUpdatesStateType } from './UseUpdates.types';

// The currently running info, constructed from Updates constants
export const currentlyRunning: CurrentlyRunningInfo = {
  updateId: Updates.updateId,
  channel: Updates.channel,
  createdAt: Updates.createdAt,
  isEmbeddedLaunch: Updates.isEmbeddedLaunch,
  isEmergencyLaunch: Updates.isEmergencyLaunch,
  manifest: Updates.manifest,
  runtimeVersion: Updates.runtimeVersion,
};

/////// Internal functions ////////

// Constructs the availableUpdate from the native state change event context
export const availableUpdateFromContext = (context: { [key: string]: any }) => {
  const manifest = context?.latestManifest;
  return manifest
    ? {
        updateId: manifest?.id ?? null,
        createdAt:
          manifest && 'createdAt' in manifest && manifest.createdAt
            ? new Date(manifest.createdAt)
            : manifest && 'publishedTime' in manifest && manifest.publishedTime
            ? new Date(manifest.publishedTime)
            : null,
        manifest: manifest || null,
      }
    : undefined;
};

// Constructs the downloadedUpdate from the native state change event context
export const downloadedUpdateFromContext = (context: { [key: string]: any }) => {
  const manifest = context?.downloadedManifest;
  return manifest
    ? {
        updateId: manifest?.id ?? null,
        createdAt:
          manifest && 'createdAt' in manifest && manifest.createdAt
            ? new Date(manifest.createdAt)
            : manifest && 'publishedTime' in manifest && manifest.publishedTime
            ? new Date(manifest.publishedTime)
            : null,
        manifest: manifest || null,
      }
    : undefined;
};

// Default useUpdates() state
export const defaultUseUpdatesState: UseUpdatesStateType = {
  isChecking: false,
  isDownloading: false,
  isUpdateAvailable: false,
  isUpdatePending: false,
};

// Transform the useUpdates() state based on native state machine context
export const reduceUpdatesStateFromContext = (
  updatesState: UseUpdatesStateType,
  context: UpdatesNativeStateMachineContext
) => {
  if (context.isChecking) {
    return {
      ...updatesState,
      isChecking: true,
      lastCheckForUpdateTimeSinceRestart: new Date(),
    };
  }
  const availableUpdate = availableUpdateFromContext(context);
  const downloadedUpdate = downloadedUpdateFromContext(context);
  return {
    ...updatesState,
    isUpdateAvailable: context.isUpdateAvailable,
    isUpdatePending: context.isUpdatePending,
    isChecking: context.isChecking,
    isDownloading: context.isDownloading,
    availableUpdate,
    downloadedUpdate,
    checkError: context.checkError,
    downloadError: context.downloadError,
  };
};
