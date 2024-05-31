import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, List, ListItem, ListItemText, CircularProgress, Container, makeStyles } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  card: {
    marginBottom: theme.spacing(4),
  },
  title: {
    fontSize: '2em',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  reviewsTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

const StoreDetails = () => {
  const { storeId } = useParams();
  const [storeDetails, setStoreDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/stores/id/${storeId}`);
        setStoreDetails(response.data);
      } catch (error) {
        console.error('Error fetching store details:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/review/store/${storeId}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchStoreDetails();
    fetchReviews();
  }, [storeId]);

  if (!storeDetails) {
    return (
      <div className={classes.loading}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} variant="h2">
            {storeDetails.name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Description: {storeDetails.description}
          </Typography>
        </CardContent>
      </Card>
      <Typography className={classes.reviewsTitle} variant="h4">
        Reviews:
      </Typography>
      <List>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <ListItem key={index}>
              <ListItemText primary={review.comment} secondary={`Rating: ${review.rating} - ${review.date}`} />
            </ListItem>
          ))
        ) : (
          <Typography variant="body1">No reviews available.</Typography>
        )}
      </List>
    </Container>
  );
};

export default StoreDetails;
