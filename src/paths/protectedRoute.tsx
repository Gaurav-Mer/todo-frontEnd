import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface OverAllSt {
  children: ReactNode;
  userData?: Record<string | any, string | any>;
  pageType: string;
}

const ProtectedRoute: React.FC<OverAllSt> = ({
  children,
  userData,
  pageType,
}) => {
  const pages = ["login", "register"];
  if (
    pages.includes(pageType) &&
    userData &&
    Object.keys(userData)?.length > 0
  ) {
    return <Navigate to={"/"} />;
  }
  //IF non  login
  if (
    (pageType === "home" || pageType === "team") &&
    (!userData || !userData.email)
  ) {
    return <Navigate to={"/login"} />;
  }

  return <div>{children}</div>;
};

export default ProtectedRoute;
