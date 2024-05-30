// src/components/List/List.jsx
import React from 'react';

const List = ({ stores }) => {
  return (
    <div>
      {stores.length > 0 ? (
        <ul>
          {stores.map(store => (
            <li key={store.id}>{store.name}</li>
          ))}
        </ul>
      ) : (
        <div>No stores found</div>
      )}
    </div>
  );
};

export default List;
