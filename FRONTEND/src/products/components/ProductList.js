import React, { useState } from 'react';
import Card from '../../shared/components/UIElements/Card';
import ProductItem from './ProductItem';
import Button from '../../shared/components/FormElements/Button';
import './ProductList.css';

const ProductList = (props) => {
  // State for the search query
  const [searchQuery, setSearchQuery] = useState('');

  // Function to handle changes in the search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter the items based on the search query
  const filteredItems = props.items.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())||product.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredItems.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No products found. Maybe create one?</h2>
          <Button to="/products/new">Add Product</Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Search input field */}
      <input
        type="text"
        placeholder="Search by name,cost"
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
      <ul className="place-list">
        {filteredItems.map((product) => (
          <ProductItem
            key={product.id}
            id={product.id}
            image={product.image}
            title={product.title}
            description={product.description}
            address={product.address}
            creatorId={product.creator}
            onDelete={props.onDeleteProduct}
          />
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
