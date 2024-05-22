import React, { useEffect, useState } from "react";
import { Box, Container, Paper, TextField, Button } from "@material-ui/core";
import useStyles from "./styles";

export default function List() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const classes = useStyles();

  const handleClick = (e) => {
    e.preventDefault();
    const user = { username, email, password: 'defaultPassword', role: 'user' }; // Add default password and role
    console.log(user);
    fetch("http://localhost:8080/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    }).then(() => {
      console.log("New User Added!");
      setUsers([...users, user]);
      setUsername("");
      setEmail("");
    });
  };

  useEffect(() => {
    fetch("http://localhost:8080/users")
      .then((res) => res.json())
      .then((result) => {
        setUsers(result);
      });
  }, []);

  return (
    <Container className={classes.container}>
      <Paper elevation={3} className={classes.paper}>
        <h1 className={classes.title}>Add User</h1>
        <form className={classes.form} noValidate autoComplete="off">
          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.submitButton}
            onClick={handleClick}
          >
            Submit
          </Button>
        </form>
      </Paper>

      <h1 className={classes.title}>Users</h1>
      <Paper elevation={3} className={classes.paper}>
        {users.map((user) => (
          <Paper elevation={6} className={classes.studentPaper} key={user.id}>
            <div><strong>Id:</strong> {user.id}</div>
            <div><strong>Username:</strong> {user.username}</div>
            <div><strong>Email:</strong> {user.email}</div>
          </Paper>
        ))}
      </Paper>
    </Container>
  );
}
