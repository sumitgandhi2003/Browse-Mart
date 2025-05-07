import React, { useState, createContext, useContext } from "react";

const UserContext = createContext();
const useUser = () => useContext(UserContext);
const UserProvider = ({ children }) => {
  const [userDetail, setUserDetail] = useState();

  return (
    <UserContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext, useUser };
