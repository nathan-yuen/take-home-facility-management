import { Grid } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React from 'react';

export default function({ count }) {
  return (
    <>
      {Array.from(Array(count).keys()).map(i => (
        <Grid key={i} item lg={4} sm={6} xs={12}>
          <Skeleton variant="rect" height="14vh" />
        </Grid>
      ))}
    </>
  );
}
