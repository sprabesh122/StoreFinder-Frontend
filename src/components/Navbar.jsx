import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Select, MenuItem, FormControl, InputLabel, TextField } from "@material-ui/core";

const Navbar = () => {
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const navigate = useNavigate();

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
    setFilterValue(""); // Reset filter value when filter type changes
  };

  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleSearch = () => {
    if (filterValue) {
      navigate(`/stores?${filterType}=${filterValue}`);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">
          StoreFinder-App
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FormControl variant="outlined" style={{ minWidth: 200, marginRight: 16 }}>
            <InputLabel style={{ color: '#fff' }}>Filter By</InputLabel>
            <Select
              value={filterType}
              onChange={handleFilterTypeChange}
              label="Filter By"
              inputProps={{ style: { color: '#fff' } }}
              style={{ color: '#fff' }}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="product">Product</MenuItem>
            
            </Select>
          </FormControl>
          {filterType && (
            <TextField
              variant="outlined"
              value={filterValue}
              onChange={handleFilterValueChange}
              placeholder={`Enter ${filterType}`}
              InputProps={{ style: { color: '#fff' } }}
              InputLabelProps={{ style: { color: '#fff' } }}
              style={{ marginRight: 16, color: 'white', minWidth: 200 }}
            />
          )}
          <Button color="inherit" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
