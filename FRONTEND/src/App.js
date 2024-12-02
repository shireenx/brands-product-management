import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Brands from './brand/pages/Brands';
import NewProduct from './products/pages/NewProduct';
import BrandProducts from './products/pages/BrandProducts';
import UpdateProduct from './products/pages/UpdateProduct';
import Auth from './brand/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';


const App = () => {
  const {token,login,logout,brandId}=useAuth();
  console.log("iiu")
  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Brands />
        </Route>
        <Route path="/:brandId/products" exact>
          <BrandProducts />
        </Route>
        <Route path="/products/new" exact>
          <NewProduct />
        </Route>
        <Route path="/products/:productId">
          <UpdateProduct />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Brands />
        </Route>
        <Route path="/:brandId/products" exact>
          <BrandProducts />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token:token, 
        brandId: brandId,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
