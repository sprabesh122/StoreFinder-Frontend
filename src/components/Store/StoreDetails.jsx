import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const StoreDetails = () => {
  const { storeId } = useParams();
  const [storeDetails, setStoreDetails] = useState(null);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/stores/id/${storeId}`);
        setStoreDetails(response.data);
      } catch (error) {
        console.error('Error fetching store details:', error);
      }
    };

    fetchStoreDetails();
  }, [storeId]);

  if (!storeDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{storeDetails.name}</h2>
      <p>Description: {storeDetails.description}</p>
      <h3>Reviews:</h3>
      <ul>
        {storeDetails.reviews && storeDetails.reviews.map((review, index) => (
          <li key={index}>{review}</li>
        ))}
      </ul>
    </div>
  );
};

export default StoreDetails;
