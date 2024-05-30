// src/components/Store/Stores.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import Map from '../Map/Map';
import List from '../List/List';
import axios from 'axios';

const Stores = () => {
  const location = useLocation();
  const [filter, setFilter] = useState({});
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const category = query.get('category');
    const product = query.get('product');
    setFilter({ category, product});

    fetchStores({ category, product});
  }, [location]);

  useEffect(() => {
    console.log('Stores:', stores);
  }, [stores]); 

  const fetchStores = async (filter) => {
    let url = 'http://localhost:8080/stores/getAll';
    if (filter.category) {
      url = `http://localhost:8080/stores/category/${filter.category}`;
    } else if (filter.product) {
      url = `http://localhost:8080/stores/product/${filter.product}`;
    }

    try {
      const response = await axios.get(url);
      // console.log('Response:', response.data);
      setStores(response.data);
      console.log('Stores', stores)
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  return (
    <Grid container style={{ width: '100%' }}>
      <Grid item xs={12} md={4}>
        <h1 style={{ fontSize: '2em', fontWeight: 'bold' }}>Stores</h1>
        {stores.map(store => (
          <div key={store.id}>
            <Link to={`/store/${store.id}`}>
              <p>{store.name}</p>
            </Link>
          </div>
        ))}
      </Grid>
      <Grid item xs={12} md={8}>
        <Map/>
      </Grid>
    </Grid>
  );
};

export default Stores;
