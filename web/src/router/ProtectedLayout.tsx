import {Navigate, Outlet} from "react-router-dom";
import {useAuthCheck} from "./useAuthCheck.ts";
import {CheckingAuth} from "../components";

export default function ProtectedLayout() {
    const {isChecking, isAuthenticated} = useAuthCheck();

    // while checking, show a loading component
    if (isChecking) return <CheckingAuth />;
    // after checking, if unauthenticated => redirect to the login page
    if(!isAuthenticated){
        return <Navigate to="/login" />
    }
    // after checking, if authenticated => display the content
    return <Outlet />
}