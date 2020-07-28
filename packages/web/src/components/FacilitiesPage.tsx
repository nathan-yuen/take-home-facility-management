import { useMutation } from '@apollo/react-hooks';
import {
  Button,
  Chip,
  CircularProgress,
  Container,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Theme
} from '@material-ui/core';
import { AddCircle } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import Facility from '../../typings/Facility';
import { REMOVE } from '../queries';
import FacilitiyFormDialog from './FacilityFormDialog';
import FacilityList from './FacilityList';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'fixed',
      bottom: theme.spacing(4),
      right: theme.spacing(4)
    },
    fabIcon: {
      marginRight: theme.spacing(1)
    }
  })
);

export default function() {
  const classes = useStyles();

  const [remove, { loading: removeLoading }] = useMutation(REMOVE);
  const [removalSuccess, setRemovalSuccess] = useState(false);

  const [isCreate, setIsCreate] = useState(false);
  const [toEdit, setToEdit] = useState(null);
  const [toRemove, setToRemove] = useState(null);

  const [result, setResult] = useState({ show: false, success: false, message: '' });

  const onRemoveCancel = () => setToRemove(null);

  const onRemoveConfirm = useCallback(() => {
    remove({
      variables: { id: toRemove.id },
      refetchQueries: ['listFacilities'],
      optimisticResponse: {}
    }).then(result => {
      if (result.data && result.data.removeFacility) {
        setRemovalSuccess(result.data.removeFacility);
        if (result.data.removeFacility) {
          setToRemove(null);
          setTimeout(() => setRemovalSuccess(false), 300);
        }
      }
    });
  }, [toRemove]);

  const onFormDailogClose = () => {
    setIsCreate(null);
    setToEdit(null);
  };

  const onSave = (success: boolean, facility: Facility) => {
    if (success) {
      setIsCreate(null);
      setToEdit(null);
    }
    let message;

    if (isCreate) {
      message = success ? `Facility: ${facility.name} was successfully added!` : `Unable to add facility!`;
    } else {
      message = success
        ? `Facility: ${facility.name} was successfully updated!`
        : `Unable to update facility: ${facility.name}!`;
    }

    setResult({
      show: true,
      success,
      message
    });
  };

  const onMessageDismiss = () => setResult(re => ({ ...re, show: false }));

  return (
    <>
      <FacilityList
        onEditFacility={f => {
          console.log(f);
          setToEdit(f);
        }}
        onRemoveFacility={f => setToRemove(f)}
      />
      <Fab color="primary" variant="extended" onClick={() => setIsCreate(true)} className={classes.fab}>
        <AddCircle className={classes.fabIcon} />
        Add Facility
      </Fab>
      <FacilitiyFormDialog
        open={isCreate || toEdit !== null}
        facility={toEdit}
        onClose={onFormDailogClose}
        onSave={onSave}
      />
      <Dialog open={toRemove !== null} onClose={onRemoveCancel} disableBackdropClick>
        <DialogTitle>{removeLoading ? 'Removing...' : 'Remove'}</DialogTitle>
        <DialogContent>
          {!removeLoading && !removalSuccess && <>Are you sure to remove facility - {toRemove && toRemove.name}?</>}
          {(removeLoading || removalSuccess) && <CircularProgress color="secondary" size={48} />}
        </DialogContent>
        {!removeLoading && !removalSuccess && (
          <DialogActions>
            <Button onClick={onRemoveCancel} color="secondary" disabled={removeLoading}>
              Cancel
            </Button>
            <Button onClick={onRemoveConfirm} color="primary" disabled={removeLoading} variant="contained" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        )}
      </Dialog>
      <Snackbar open={result.show} autoHideDuration={3000} onClose={onMessageDismiss}>
        <Alert onClose={onMessageDismiss} severity={result.success ? 'success' : 'error'}>
          {result && result.message}
        </Alert>
      </Snackbar>
    </>
  );
}
