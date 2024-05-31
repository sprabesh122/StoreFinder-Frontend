import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Select, MenuItem, FormControl, InputLabel, TextField, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    justifyContent: 'space-between',
  },
  title: {
    flexGrow: 1,
    color: '#fff',
    textDecoration: 'none',
  },
  formControl: {
    minWidth: 150,
    marginRight: theme.spacing(2),
    '& .MuiOutlinedInput-input': {
      color: '#fff',
    },
    '& .MuiInputLabel-outlined': {
      color: '#fff',
    },
    '& .MuiSelect-icon': {
      color: '#fff',
    },
  },
  textField: {
    marginRight: theme.spacing(2),
    minWidth: 200,
    '& .MuiOutlinedInput-input': {
      color: '#fff',
    },
    '& .MuiInputLabel-outlined': {
      color: '#fff',
    },
  },
  button: {
    color: '#fff',
    borderColor: '#fff',
  },
}));

const Navbar = () => {
  const classes = useStyles();
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
      <Toolbar className={classes.toolbar}>
        <Typography component={Link} to="/" variant="h6" className={classes.title}>
          StoreFinder-App
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Filter By</InputLabel>
            <Select
              value={filterType}
              onChange={handleFilterTypeChange}
              label="Filter By"
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
              className={classes.textField}
            />
          )}
          <Button variant="outlined" className={classes.button} onClick={handleSearch}>
            Search
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
