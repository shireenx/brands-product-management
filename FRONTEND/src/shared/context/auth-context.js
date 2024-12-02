import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  brandId: null,
  token:null,
  login: () => {},
  logout: () => {}
});
