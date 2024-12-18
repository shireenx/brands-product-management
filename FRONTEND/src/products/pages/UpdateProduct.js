import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './ProductForm.css';

const UpdateProduct = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedProduct, setLoadedProduct] = useState();
  const productId = useParams().productId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const responseData = await sendRequest(
          `https://brands-product-management-backend.onrender.com/api/products/${productId}`
        );
        setLoadedProduct(responseData.product);
        setFormData(
          {
            title: {
              value: responseData.product.title,
              isValid: true
            },
            description: {
              value: responseData.product.description,
              isValid: true
            }
          },
          true
        );

      } catch (err) {}
    };
    fetchProduct();
  }, [sendRequest, productId, setFormData]);

  const productUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        `https://brands-product-management-backend.onrender.com/api/products/${productId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address:formState.inputs.address.value
        }),
        {
          'Content-Type': 'application/json',
          Authorization:'Bearer '+auth.token
        }
      );
      history.push('/' + auth.brandId + '/products');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedProduct && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedProduct && (
        <form className="place-form" onSubmit={productUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Product name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a product name"
            onInput={inputHandler}
            initialValue={loadedProduct.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedProduct.description}
            initialValid={true}
          />
          
          <Input
          id="address"
          element="input"
          label="Cost"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid Cost."
          onInput={inputHandler}
          initialValue={loadedProduct.address}
          initialValid={true}
        />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PRODUCT
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateProduct;
