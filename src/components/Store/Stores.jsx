import React from 'react';
import Header from '../Header/Header';
import { CssBaseline, Grid } from '@material-ui/core';
import Map from '../Map/Map';
import List from '../List/List';

const Stores = () => {
  return (
    <>
      <CssBaseline />
      <Header />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <List />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Map />
        </div>
      </div>
      
    </>
  );
};

export default Stores;
