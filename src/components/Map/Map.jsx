import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import 'ol/ol.css';
import { Map as OLMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Icon } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

const Map = () => {
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);

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
    if (userLocation) {
      const olMap = new OLMap({
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

      olMap.addLayer(vectorLayer);

      const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:1000,${userLocation.latitude},${userLocation.longitude})[shop];out;`;

      axios.get(overpassUrl).then(response => {
        const shops = response.data.elements;
        shops.forEach(shop => {
          console.log(shop);
          const shopMarker = new Feature({
            geometry: new Point(fromLonLat([shop.lon, shop.lat])),
          });

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
    }
  }, [userLocation]);

  return (
    <div>
      {userLocation ? (
        <div ref={mapRef} style={{ width: '100%', height: '600px' }}></div>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};

export default Map;
