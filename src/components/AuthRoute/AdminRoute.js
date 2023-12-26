import React from "react";
import ErrorMsg from "../ErrorMsg/ErrorMsg";

const AdminRoute = ({ children }) => {
  // get user from local storage
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const isAdmin = user?.userInfo?.isAdmin ? true : false;

  if (isAdmin) return <ErrorMsg message={"Acces denied"} />;
  return <>{children}</>;
};

export default AdminRoute;
