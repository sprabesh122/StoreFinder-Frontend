import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { Typography, Container, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Card, CardContent, makeStyles, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
  form: {
    marginBottom: theme.spacing(4),
  },
  card: {
    backgroundColor: "#ADD8E6",
    color: theme.palette.secondary.contrastText,
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
    transition: "0.3s",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.2)",
    },
  },
  cardContent: {
    padding: theme.spacing(3),
  },
}));

const AdminPage = () => {
  const classes = useStyles();
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactDetails: "",
    operatingHours: "",
    description: "",
    logoImageUrl: "",
    categoryId: "",
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/categories/getAll");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchStores = async () => {
      try {
        const response = await axios.get("http://localhost:8080/stores/getAll");
        setStores(response.data);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchCategories();
    fetchStores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const sendEmailsToUsers = async (storeData) => {
    try {
      const usersResponse = await axios.get("http://localhost:8080/users/getAll");
      const users = usersResponse.data;

      const emailPromises = users.map(async (user) => {
        const userEmailResponse = await axios.get(`http://localhost:8080/users/${user.userId}`);
        const userEmail = userEmailResponse.data.email;
        console.log(userEmail)
        const subject = `New Store Added: ${storeData.name}`;
        const text = `A new store has been added:\n\n` +
                     `Name: ${storeData.name}\n` +
                     `Address: ${storeData.address}\n` +
                     `Contact Details: ${storeData.contactDetails}\n` +
                     `Operating Hours: ${storeData.operatingHours}\n` +
                     `Description: ${storeData.description}`;

        return axios.post("http://localhost:8080/mail/sendmail", null, {
          params: {
            to: userEmail,
            subject: subject,
            text: text,
          }
        });
      });

      await Promise.all(emailPromises);
      console.log("Emails sent successfully.");
    } catch (error) {
      console.error("Error sending emails:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storeResponse = await axios.post("http://localhost:8080/stores/add", {
        ...formData,
      });

      const storeData = storeResponse.data;
  
      const storeId = storeResponse.data.id;
  
      await axios.post(`http://localhost:8080/stores/${storeId}/categories/add`, {
        id: formData.categoryId,
      });

      await sendEmailsToUsers(formData);

      setSuccess(true);
    } catch (error) {
      console.error("Error adding store:", error);
    }
  };


  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Paper className={classes.formContainer}>
          <Typography variant="h4" align="center" gutterBottom>
            Add New Store
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField name="name" label="Store Name" fullWidth onChange={handleChange} required variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="address" label="Address" fullWidth onChange={handleChange} required variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="contactDetails" label="Contact Details" fullWidth onChange={handleChange} required variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="operatingHours" label="Operating Hours" fullWidth onChange={handleChange} required variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField name="description" label="Description" fullWidth multiline rows={4} onChange={handleChange} required variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField name="logoImageUrl" label="Logo Image URL" fullWidth onChange={handleChange} required variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Select Category</InputLabel>
                  <Select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Add Store
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
        <Grid container spacing={3}>
          {stores.map((store) => (
            <Grid key={store.id} item xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <Typography variant="h5" component="h2">
                    {store.name}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {store.address}
                  </Typography>
                  <Typography variant="body2" component="p">
                    Contact: {store.contactDetails}
                  </Typography>
                  <Typography variant="body2" component="p">
                    Operating Hours: {store.operatingHours}
                  </Typography>
                  <Typography variant="body2" component="p">
                    Description: {store.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default AdminPage;
