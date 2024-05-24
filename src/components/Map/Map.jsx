import React from 'react';

const Map = () => {
  return (
    <div>
      <iframe 
        width="100%" 
        height="600" 
        src="https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;coord=52.70967533219885, -8.020019531250002&amp;q=1%20Grafton%20Street%2C%20Dublin%2C%20Ireland&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed" 
        frameBorder="0" 
        scrolling="no" 
        marginHeight="0" 
        marginWidth="0"
        title="Google Map"
      ></iframe>
    </div>
  );
}

export default Map;
