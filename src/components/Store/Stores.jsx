// src/components/Store/Stores.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Grid, Card, CardContent, CardActionArea, Typography, makeStyles, Container } from '@material-ui/core';
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
  title: {
    fontSize: '2em',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  link: {
    textDecoration: 'none',
  },
}));

const Stores = () => {
  const classes = useStyles();
  const location = useLocation();
  const [filter, setFilter] = useState({});
  const [stores, setStores] = useState([]);

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

  return (
    <Container className={classes.root}>
    <Navbar />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography className={classes.title} variant="h1">
            Stores
          </Typography>
          {stores.map((store) => (
            <Card key={store.id} className={classes.card}>
              <CardActionArea>
                <Link to={`/store/${store.id}`} className={classes.link}>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      {store.name}
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
