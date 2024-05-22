import React, { useEffect, useState } from "react";
import { Box, Container, Paper, TextField, Button } from "@material-ui/core";
import useStyles from "./styles";

export default function List() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [students, setStudents] = useState([]);
  const classes = useStyles();

  const handleClick = (e) => {
    e.preventDefault();
    const student = { name, address };
    console.log(student);
    fetch("http://localhost:8080/student/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    }).then(() => {
      console.log("New Student Added!");
      setStudents([...students, student]);
      setName("");
      
      setAddress("");
    });
  };

  useEffect(() => {
    fetch("http://localhost:8080/student/getAll")
      .then((res) => res.json())
      .then((result) => {
        setStudents(result);
      });
  }, []);

  return (
    <Container className={classes.container}>
      <Paper elevation={3} className={classes.paper}>
        <h1 className={classes.title}>Add Student</h1>
        <form className={classes.form} noValidate autoComplete="off">
          <TextField
            id="outlined-basic"
            label="Student Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Student Address"
            variant="outlined"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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

      <h1 className={classes.title}>Students</h1>
      <Paper elevation={3} className={classes.paper}>
        {students.map((student) => (
          <Paper elevation={6} className={classes.studentPaper} key={student.id}>
            <div><strong>Id:</strong> {student.id}</div>
            <div><strong>Name:</strong> {student.name}</div>
            <div><strong>Address:</strong> {student.address}</div>
          </Paper>
        ))}
      </Paper>
    </Container>
  );
}
