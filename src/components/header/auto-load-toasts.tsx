import { Alert, Snackbar } from '@mui/material';

import useStore from '../../store';

import './auto-load-toasts.scss';

export function AutoLoadToasts() {
  const loadDataError = useStore((s) => s.savingLoading.loadDataError);
  const oldSaveData = useStore((s) => s.savingLoading.oldSaveData);

  return <>
    <Snackbar open={loadDataError != null} autoHideDuration={6000}>
      <Alert severity="error" sx={{ width: '100%' }} className='auto-load-error'>
        Error Migrating an older save:
        {loadDataError && <>
          <p>Tried to migrate from {loadDataError.saveVersion} to {loadDataError.failedMigrationVersion} but received error:</p>
          <code>{(loadDataError.exception as Error).message}</code>
          <p>Please reach out on Reddit or Discord with this error and your save data:</p>
          <textarea>{oldSaveData}</textarea>
        </>}
      </Alert>
    </Snackbar>
  </>;
}