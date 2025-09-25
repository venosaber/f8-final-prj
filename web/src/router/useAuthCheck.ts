import {deleteCookie, getCookie, isTokenExpired, setNewAccessToken, setNewRefreshToken} from "./auth.ts";
import api from "../plugins/api.ts";
import {useEffect, useState} from "react";

/**
 * Try to refresh accessToken using refreshToken
 * This function is not designed to redirect, only returns a new token or null
 */
const tryRefreshToken = async () => {
    const refreshToken = getCookie('refreshToken');

    if(!refreshToken || isTokenExpired(refreshToken)) return null;
    try {
        const {data} = await api.post(
            '/auth/refresh',
            { refreshToken: refreshToken }, // payload
            { _retry: true } // set this flag to make the response interceptor skip, avoid infinite loop
        );
        const {accessToken: newAccessToken, refreshToken: newRefreshToken} = data;
        setNewAccessToken(newAccessToken);
        setNewRefreshToken(newRefreshToken);

        return newAccessToken;
    } catch (error) {
        console.error('Cannot refresh token:', error);
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        return null;
    }
}

/**
 * a custom hook to check for auth status
 * returns 2 values:
 *  - isChecking: true while checking, false when finished
 *  - isAuthenticated: true if authenticated, false if not
 */
export const useAuthCheck = () => {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = getCookie('accessToken');
            if(accessToken && !isTokenExpired(accessToken)) {
                setIsAuthenticated(true);
            } else {
                const newAccessToken = await tryRefreshToken();
                setIsAuthenticated(!!newAccessToken);
            }

            setIsChecking(false);
        }

        checkAuth();
    }, []);

    return {isChecking, isAuthenticated};
}