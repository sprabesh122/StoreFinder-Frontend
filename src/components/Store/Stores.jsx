// src/components/Store/Stores.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, makeStyles, Container, Button, CardActionArea } from '@material-ui/core';
import Map from '../Map/Map';
import axios from 'axios';
import Navbar from "../Navbar";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  card: {
    marginBottom: theme.spacing(2),
  },
  cardContent: {
    padding: theme.spacing(2),
  },
  cardHeader: {
    backgroundColor: '#ADD8E6', // Light blue color
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(1),
  },
  title: {
    fontSize: '2em',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  contactDetails: {
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  favoriteButton: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
  filterButton: {
    marginBottom: theme.spacing(2),
  },
}));

const Stores = () => {
  const classes = useStyles();
  const location = useLocation();
  const [filter, setFilter] = useState({});
  const [stores, setStores] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const category = query.get('category');
    const product = query.get('product');
    setFilter({ category, product });

    fetchStores({ category, product });
  }, [location]);

  const fetchStores = async (filter) => {
    let url = 'http://localhost:8080/stores/getAll';
    if (filter.category) {
      url = `http://localhost:8080/stores/category/${filter.category}`;
    } else if (filter.product) {
      url = `http://localhost:8080/stores/product/${filter.product}`;
    }

    try {
      const response = await axios.get(url);
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const addToFavorite = async (storeId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    const favoriteData = {
      dateAdded: new Date().toISOString(),
      user: { id: userId },
      store: { id: storeId },
    };

    try {
      await axios.post('http://localhost:8080/favorite-stores/add', favoriteData);
      alert('Store added to favorites!');
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const fetchFavoriteStores = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/favorite-stores/user/${userId}`);
      setStores(response.data);
      setShowFavorites(true);
    } catch (error) {
      console.error('Error fetching favorite stores:', error);
    }
  };

  return (
    <Container className={classes.root}>
      <Navbar />
      <Typography className={classes.title} variant="h1">
        Stores
      </Typography>
      <Button
        variant="contained"
        color="primary"
        className={classes.filterButton}
        onClick={fetchFavoriteStores}
      >
        Show Favorite Stores
      </Button>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          {stores.map((store) => (
            <Card key={store.id} className={classes.card}>
              <div className={classes.cardHeader}>
                <Typography variant="h5" component="h2">
                  {store.name}
                </Typography>
              </div>
              <CardContent className={classes.cardContent}>
                <Typography variant="body2" component="p">
                  Contact Details: {store.contactDetails}
                </Typography>
                {!showFavorites && (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.favoriteButton}
                    onClick={() => addToFavorite(store.id)}
                  >
                    Add to Favorite
                  </Button>
                )}
              </CardContent>
              <CardActionArea>
                <Link to={`/store/${store.id}`} className={classes.link}>
                  <CardContent>
                    <Typography variant="body2" component="p">
                      View Store Details
                    </Typography>
                  </CardContent>
                </Link>
              </CardActionArea>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12} md={8}>
          <Map />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Stores;
