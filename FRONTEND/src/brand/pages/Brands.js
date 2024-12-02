import React, { useEffect, useState } from 'react';

import BrandsList from '../components/BrandsList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Brands = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedBrands, setLoadedBrands] = useState();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const responseData = await sendRequest(
          'https://brands-product-management-backend.onrender.com/api/brands'
        );
        console.log(responseData.brands);
        setLoadedBrands(responseData.brands);
      } catch (err) {}
    };
    fetchBrands();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedBrands && <BrandsList items={loadedBrands} />}
    </React.Fragment>
  );
};

export default Brands;
