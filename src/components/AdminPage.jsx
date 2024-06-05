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
    fontSize: "40px",
  },
  formContainer: {
    padding: theme.spacing(4),
    // borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    height: '100%', 
    border:"2px solid black"
  },
  header: {
    marginBottom: theme.spacing(4),
  },
  form: {
    marginBottom: theme.spacing(6), 
    '& > *': {
      marginBottom: theme.spacing(2), 
    },
  },
  card: {
    backgroundColor: "#ADD8E6",
    color: theme.palette.secondary.contrastText,
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
    transition: "0.3s",
    width: '100%',
    maxWidth: '300px',
    
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.2)",
      fontWeight: "bold",
      color: "#000", 
    },
    padding: '10px',
  },
  cardContent: {
    padding: theme.spacing(3),
    color: "#000", 
    fontWeight: "bold", 
    fontSize: "1.2rem", 
  },
  cardsContainer: {
    margin: theme.spacing(4), 
  },
  gridContainer: {
    height: '100%', 
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storeResponse = await axios.post("http://localhost:8080/stores/add", {
        ...formData,
      });
  
      const storeId = storeResponse.data.id;
  
      await axios.post(`http://localhost:8080/stores/${storeId}/categories/add`, {
        id: formData.categoryId,
      });
  
      setSuccess(true);
    } catch (error) {
      console.error("Error adding store:", error);
    }
  };

  if (success) {
    return <Navigate to="/stores" />;
  }

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <Grid container className={classes.gridContainer}>
          <Grid item xs={12} md={6}>
            <Paper className={classes.formContainer}>
              <Typography variant="h4" align="center" gutterBottom className={classes.header}>
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
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3} justifyContent="center" className={classes.cardsContainer}>
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
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default AdminPage;
