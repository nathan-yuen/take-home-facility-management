import { useMutation } from '@apollo/react-hooks';
import {
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import React, { useEffect, useMemo, useState } from 'react';
import Facility from '../../typings/Facility';
import constants from '../constants';
import { ADD, UPDATE } from '../queries';
import SizeChip from './SizeChip';

interface Props {
  open: boolean;
  facility?: Facility;
  onClose: () => void;
  onSave: (success: boolean, facility: Facility) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      '& .MuiTextField-root': {
        display: 'block',
        minWidth: '500px',
        margin: theme.spacing(1)
      },
      '& .MuiSelect-root': {
        display: 'block',
        margin: theme.spacing(1)
      }
    },
    LARGE: {
      color: constants.SIZES.LARGE
    },
    MEDIUM: {
      color: constants.SIZES.MEDIUM
    },
    SMALL: {
      color: constants.SIZES.SMALL
    }
  })
);

const renderSizeValue = (value: string) => <SizeChip size={value} />;

export default function(props: Props) {
  const classes = useStyles();
  const { open, facility, onClose, onSave } = props;
  const isEdit = facility !== null;

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [size, setSize] = useState('');
  const [fieldsError, setFieldsError] = useState({
    name: false,
    address: false,
    size: false
  });

  const [saveFacility, { loading: saving, data: result }] = useMutation(isEdit ? UPDATE : ADD);
  const [submitError, setSubmitError] = useState(null);

  const onCancelClick = () => {
    onClose();
    setName('');
    setAddress('');
    setSize('');
  };

  const onSaveClick = () => {
    const fError = { ...fieldsError };
    fError.name = name === '';
    fError.address = address === '';
    fError.size = size === '';
    setFieldsError(e => ({ ...e, ...fError }));

    if (!Object.values(fError).some((e: boolean) => e)) {
      saveFacility({
        variables: {
          facility: { id: isEdit ? facility.id : undefined, name, address, size }
        },
        refetchQueries: ['listFacilities']
      }).catch(e => {
        setSubmitError(e);
        setTimeout(() => setSubmitError(null), 3000);
      });
    }
  };

  const sizeMenuItems = useMemo(
    () =>
      Object.keys(constants.SIZES).map((s: string) => (
        <MenuItem key={s} className={classes[s]} value={s}>
          {s}
        </MenuItem>
      )),
    []
  );

  useEffect(() => {
    setName(isEdit ? facility.name : '');
    setAddress(isEdit ? facility.address : '');
    setSize(isEdit ? facility.size : '');
  }, [isEdit]);

  useEffect(() => {
    if (result && (result.addFacility || result.updateFacility)) {
      if (result.addFacility) {
        onSave(true, result.addFacility);
      } else if (result.updateFacility) {
        const { success, updated } = result.updateFacility;
        onSave(success, updated);
      }
    }
  }, [result]);

  return (
    <Dialog open={open} onClose={onClose} disableBackdropClick disableScrollLock maxWidth="md">
      <DialogTitle>{isEdit ? 'Edit' : 'Add'} Facility</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {isEdit && (
            <Grid item xs={12}>
              <TextField value={facility.id} disabled fullWidth label="ID" variant="outlined" />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={saving}
              fullWidth
              label="Name"
              variant="outlined"
              required
              error={fieldsError.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={address}
              onChange={e => setAddress(e.target.value)}
              disabled={saving}
              fullWidth
              label="Address"
              variant="outlined"
              required
              error={fieldsError.address}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl disabled={saving} fullWidth variant="outlined" required error={fieldsError.size}>
              <InputLabel id="demo-simple-select-outlined-label">Size</InputLabel>
              <Select
                id="input-size"
                label="Size"
                value={size}
                onChange={(e: React.ChangeEvent<{ value: string }>) => setSize(e.target.value)}
                renderValue={renderSizeValue}
              >
                {sizeMenuItems}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      {saving && <LinearProgress color="secondary" />}
      <Collapse in={submitError !== null}>
        <Alert severity="error" onClose={() => setSubmitError(null)}>
          <AlertTitle>Something went wrong!</AlertTitle>
          {submitError && submitError.message}
        </Alert>
      </Collapse>
      <DialogActions>
        <Button disabled={saving} onClick={onCancelClick} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button disabled={saving} onClick={onSaveClick} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
