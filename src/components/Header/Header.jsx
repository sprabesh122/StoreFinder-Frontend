import React from 'react';
import { AppBar, Toolbar, Typography, InputBase, Box, Input } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const Header = () => {
  return (
    <AppBar position='static' style={{ backgroundColor: '#2196f3' }}>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h4' style={{ display: 'flex', alignItems: 'center', color: '#ffffff, ', marginLeft: '20px' }}>
          Locate Your Store
        </Typography>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant='h4' style={{ display: 'flex', alignItems: 'center', color: '#ffffff', marginRight: '20px', whiteSpace: 'nowrap' }}>
            Explore New Stores
          </Typography>

          <div style={{ position: 'relative', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.15)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)' }, marginRight: '20px', marginLeft: '0', width: '100%' }}>
            <div style={{ padding: '10px', height: '100%', position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SearchIcon style={{ color: '#ffffff' }} />
            </div>
            <InputBase placeholder="Search..." style={{ color: '#ffffff', padding: '10px', paddingLeft: 'calc(1em + 40px)', transition: 'width 300ms', width: '100%' }} />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default Header;
