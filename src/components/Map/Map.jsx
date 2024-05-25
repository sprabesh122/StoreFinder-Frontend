import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import 'ol/ol.css';
import { Map as OLMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Icon } from 'ol/style';
import Overlay from 'ol/Overlay'; // Import Overlay from OpenLayers
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

const Map = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null); // State to keep track of the selected shop
  const mapRef = useRef(null);
  const popupRef = useRef(null); // Reference to the popup element
  const olMap = useRef(null); // Reference to the OpenLayers map

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        error => {
          console.error("Error getting user's location:", error);
          setUserLocation({ latitude: 52.70967533219885, longitude: -8.020019531250002 });
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setUserLocation({ latitude: 52.70967533219885, longitude: -8.020019531250002 });
    }
  }, []);

  useEffect(() => {
    if (userLocation && !olMap.current) {
      olMap.current = new OLMap({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([userLocation.longitude, userLocation.latitude]),
          zoom: 14,
        }),
      });

      const userMarker = new Feature({
        geometry: new Point(fromLonLat([userLocation.longitude, userLocation.latitude])),
      });

      userMarker.setStyle(new Style({
        image: new Icon({
          color: '#0000ff',
          crossOrigin: 'anonymous',
          src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="blue" /></svg>',
          scale: 0.1,
        }),
      }));

      const vectorSource = new VectorSource({
        features: [userMarker],
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      olMap.current.addLayer(vectorLayer);

      const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:1000,${userLocation.latitude},${userLocation.longitude})[shop];out;`;

      axios.get(overpassUrl).then(response => {
        const shopsData = response.data.elements;

        // Sort shops by distance to user
        const sortedShops = shopsData.sort((a, b) => {
          const distanceA = Math.sqrt(
            Math.pow(a.lat - userLocation.latitude, 2) +
            Math.pow(a.lon - userLocation.longitude, 2)
          );
          const distanceB = Math.sqrt(
            Math.pow(b.lat - userLocation.latitude, 2) +
            Math.pow(b.lon - userLocation.longitude, 2)
          );
          return distanceA - distanceB;
        });

        // Limit to 20 nearest shops
        const nearestShops = sortedShops.slice(0, 30);

        setShops(nearestShops);
        
        nearestShops.forEach(shop => {
          const shopMarker = new Feature({
            geometry: new Point(fromLonLat([shop.lon, shop.lat])),
          });

          shopMarker.setId(shop.id); // Set shop ID for the marker
          shopMarker.set('shop', shop); // Attach shop data to the feature

          shopMarker.setStyle(new Style({
            image: new Icon({
              color: '#ff0000',
              crossOrigin: 'anonymous',
              src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="red" /></svg>',
              scale: 0.1,
            }),
          }));

          vectorSource.addFeature(shopMarker);
        });
      }).catch(error => {
        console.error('Error fetching nearby stores:', error);
      });

      // Create the popup
      const popup = new Overlay({
        element: popupRef.current,
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -50], // Offset to place the popup above the marker
      });
      olMap.current.addOverlay(popup);

      // Add click event listener to the map
      olMap.current.on('click', event => {
        const clickedFeature = olMap.current.forEachFeatureAtPixel(event.pixel, feature => feature);
        if (clickedFeature && clickedFeature.getGeometry().getType() === 'Point') {
          const coordinates = clickedFeature.getGeometry().getCoordinates();
          const shop = clickedFeature.get('shop'); // Retrieve shop data from the feature
          if (shop) {
            setSelectedShop(shop);
            popup.setPosition(coordinates);
          }
        }
      });
    }
  }, [userLocation, shops]);

  const handleCommentChange = (event) => {
    // Handle comment change
  };

  return (
    <div>
      {userLocation ? (
        <>
          <div ref={mapRef} style={{ width: '100%', height: '600px' }}></div>
          <div ref={popupRef} className="popup">
            {selectedShop && (
              <>
                <h3>{selectedShop.tags.name ? selectedShop.tags.name : 'Unnamed Shop'}</h3>
                <div>☆☆☆☆☆</div> {/* Add star ratings */}
                <textarea placeholder="Write your comment here..." onChange={handleCommentChange}></textarea>
                <button>Submit</button>
              </>
            )}
          </div>
          <div className="shops-list">
            <h2>Nearby Shops:</h2>
            <ul>
              {shops.map(shop => (
                <li key={shop.id}>
                  {shop.tags.name ? shop.tags.name : 'Unnamed Shop'}
                  <br />
                  Lat: {shop.lat}, Lon: {shop.lon}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};

export default Map;
