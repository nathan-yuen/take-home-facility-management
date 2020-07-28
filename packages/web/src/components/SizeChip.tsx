import { Chip } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import constants from '../constants';

interface Props {
  className?: string;
  children?: React.ReactNode;
  size: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    LARGE: {
      background: constants.SIZES.LARGE
    },
    MEDIUM: {
      background: constants.SIZES.MEDIUM
    },
    SMALL: {
      background: constants.SIZES.SMALL
    }
  })
);

export default function SizeChip(props: Props) {
  const classes = useStyles();
  const { className, children, size, ...other } = props;

  return <Chip className={clsx(classes[size], className)} {...other} label={size} />;
}
