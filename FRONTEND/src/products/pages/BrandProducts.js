import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ProductList from '../components/ProductList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const BrandProducts = () => {
  const [loadedProducts, setLoadedProducts] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const brandId = useParams().brandId;
  console.log(brandId)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responseData = await sendRequest(
          `https://brands-product-management-backend.onrender.com/api/products/brand/${brandId}`
        );
        setLoadedProducts(responseData.products);
      } catch (err) {}
    };
    fetchProducts();
  }, [sendRequest, brandId]);

  const productDeletedHandler = deletedProductId => {
    setLoadedProducts(prevProducts =>
      prevProducts.filter(product => product.id !== deletedProductId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedProducts && (
        <ProductList items={loadedProducts} onDeleteProduct={productDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default BrandProducts;
