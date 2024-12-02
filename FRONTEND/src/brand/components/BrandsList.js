import React from 'react';

import BrandItem from './BrandItem';
import Card from '../../shared/components/UIElements/Card';
import './BrandsList.css';

const BrandsList = props => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No Brands found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.items.map(brand => (
        <BrandItem
          key={brand.id}
          id={brand.id}
          image={brand.image}
          name={brand.name}
          b_description={brand.b_description}
          placeCount={brand.products.length}
        />
      ))}
    </ul>
  );
};

export default BrandsList;
