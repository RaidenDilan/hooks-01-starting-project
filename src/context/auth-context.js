import React, { useState } from 'react';

// named export
export const AuthContext = React.createContext({
  isAuth: false,
  login: () => {}
});

const AuthContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // set to false -> initially user is not authenticated.

  const loginHandler = () => {
    setIsAuthenticated(true);
  };

  return (
    /* if the value is updated, everyone listing will get this updated value. */
    <AuthContext.Provider value={ { login: loginHandler, isAuth: isAuthenticated } }>
      { props.children }
    </AuthContext.Provider>
  );
};
export default AuthContextProvider; // default export
