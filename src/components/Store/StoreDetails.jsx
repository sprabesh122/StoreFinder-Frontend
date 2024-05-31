import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card, CardContent, Typography, List, ListItem, ListItemText, CircularProgress, Container, makeStyles,
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField
} from '@material-ui/core';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

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
  reviewButton: {
    marginTop: theme.spacing(2),
  },
}));

const StoreDetails = () => {
  const { storeId } = useParams();
  const [storeDetails, setStoreDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [newReview, setNewReview] = useState({ rating: '', comment: '', date: '' });
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Retrieve the userId from localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }
  
    const reviewData = {
      ...newReview,
      date: new Date().toISOString(),
      user: { id: userId },
      store: { id: parseInt(storeId) },
    };
  
    try {
      await axios.post('http://localhost:8080/review/add', reviewData);
      setReviews([...reviews, reviewData]);
      handleClose();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };
  

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
      <Button variant="contained" color="primary" className={classes.reviewButton} onClick={handleClickOpen}>
        Add Review
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Review</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the details below to add a review for this store.
          </DialogContentText>
          <form onSubmit={handleFormSubmit}>
            <TextField
              autoFocus
              margin="dense"
              name="rating"
              label="Rating"
              type="number"
              fullWidth
              value={newReview.rating}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              name="comment"
              label="Comment"
              type="text"
              fullWidth
              value={newReview.comment}
              onChange={handleInputChange}
              required
            />
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default StoreDetails;
