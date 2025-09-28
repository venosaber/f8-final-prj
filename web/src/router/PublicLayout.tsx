import {Navigate, Outlet} from "react-router-dom";
import {useAuthCheck} from "./useAuthCheck.ts";
import {CheckingAuth} from "../components";

export default function PublicLayout() {
    const {isChecking, isAuthenticated} = useAuthCheck();

    // while checking, show a loading component
    if (isChecking) return <CheckingAuth/>;
    // after checking, if authenticated => redirect to the dashboard
    if (isAuthenticated) {
        return <Navigate to="/classes"/>
    }
    // after checking, if unauthenticated => display the content
    return <Outlet/>
}