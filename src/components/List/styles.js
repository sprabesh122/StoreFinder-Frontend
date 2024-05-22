import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    marginBottom: "30px",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  loading: {
    height: "600px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: "25px",
  },
  marginBottom: {
    marginBottom: "30px",
  },
  list: {
    height: "75vh",
    overflow: "auto",
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(4),
    margin: theme.spacing(2, "auto"),
    maxWidth: 600,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
  studentPaper: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    textAlign: "left",
  },
  title: {
    color: theme.palette.primary.main,
    textAlign: "center",
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    alignSelf: "center",
    marginTop: theme.spacing(2),
  },
}));
