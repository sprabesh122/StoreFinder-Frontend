// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, Grid } from "@material-ui/core";
import Login from "./components/Login";
import Register from "./components/Register";
import Stores from "./components/Store/Stores";

function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="/stores" element={<Stores />} />
          </Routes>
        </div>
      </Router>

      {/* <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <List />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map />
        </Grid>
      </Grid> */}
    </>
  );
}

export default App;
