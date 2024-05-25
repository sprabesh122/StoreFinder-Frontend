// src/components/Store/Stores.jsx
import React from 'react';
import { Grid } from '@material-ui/core';
import Map from '../Map/Map';
import List from '../List/List';

const Stores = () => {
  return (
    <Grid style={{ width: '100%' }}>
      {/* <Grid item xs={12} md={4}>
        <List />
      </Grid> */}
      <Grid item xs={12} md={12}>
        <Map />
      </Grid>
    </Grid>
  );
};

export default Stores;
