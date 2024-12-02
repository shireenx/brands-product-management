import { useCallback,useEffect,useState } from "react";

let logOutTimer;
export const useAuth=()=>{
    const [token, setToken] = useState(false);
  const [tokenExpirationDate,setTokenExpirationDate]=useState();
  const [brandId, setBrandId] = useState(false);


  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setBrandId(uid);
    const tokenExpirationDate=expirationDate || new Date(new Date().getTime()+1000*60*60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      'brandData',
      JSON.stringify({brandId:uid,token:token,expiration:tokenExpirationDate.toISOString()})
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setBrandId(null);
    localStorage.removeItem('brandData');
  }, []);

  useEffect(()=>{
    if(token&&tokenExpirationDate){
      const remainingTime=tokenExpirationDate.getTime()-new Date().getTime();
      logOutTimer=setTimeout(logout, remainingTime)
    }
    else{
      clearTimeout(logOutTimer);
    }
  },[token,logout,tokenExpirationDate]);

  useEffect(()=>{
    const storedData= JSON.parse(localStorage.getItem('brandData'));
    if(storedData && storedData.token && new Date(storedData.expiration)>new Date()){
      login(storedData.brandId,storedData.token,new Date(storedData.expiration))//checks if user is logged in when reload
    }
  },[login]);//will run once when before the app restarts though it has login dependency, login function is callback

  return {token,login,logout,brandId};
}