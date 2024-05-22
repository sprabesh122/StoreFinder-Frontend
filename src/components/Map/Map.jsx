import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const Map = () => {
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3ByYWJlc2gxMjIiLCJhIjoiY2x3ZjB6ZGhpMTI0dTJqcG5uaHB6ZHZzdiJ9.CEJJ8swXx9wB5rg_ySqaCg';

    const map = new mapboxgl.Map({
      container: 'map-container',
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 12,
    });

    // user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setCenter([longitude, latitude]);
        },
        () => {
          map.setCenter([77.5946, 12.9716]); // 
        }
      );
    } else {
      map.setCenter([77.5946, 12.9716]); 
    }

    // Cleanup function to remove the map on component unmount
    return () => map.remove();
  }, []);

  return (
    <div id="map-container" style={{ width: '100%', height: '400px' }}></div>
  );
};

export default Map;
