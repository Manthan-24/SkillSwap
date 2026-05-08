import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../utils/TokenService";
import Navbar from "../components/Navbar";



export function PrivateRoute(){
    const token = getToken();

    if(token){
        // continue with the child route component
         return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
    }
    else{
        // redirect user on the login route 
        return <Navigate to={"/login"} />
    }
}