import React from "react";
import ErrorMsg from "../ErrorMsg/ErrorMsg";

const AuthRoute = ({ children }) => {
  // get user from local storage

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const isLoggedIn = user?.token ? true : false;
  console.log(isLoggedIn + "AuthRoute");

    if (!isLoggedIn) return <ErrorMsg message={"Acces denied"} />;
  return <>{children}</>;
};

export default AuthRoute;
