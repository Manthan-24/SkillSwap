import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../utils/TokenService";


const PublicRoute = () => {

  const token = getToken();

  return token ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoute;