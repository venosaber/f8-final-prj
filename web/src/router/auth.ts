import {jwtDecode} from "jwt-decode";
import {postMethod} from "../utils/api.ts";

interface DecodedJWT {
    exp: number;
}

/******* Cookie Utils *******/
export const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : null;
};

export const setCookie = (name: string, value: string, maxAgeInSeconds?: number) => {
    let cookieString: string = `${name}=${value}; path=/; secure; samesite=strict`;
    if(maxAgeInSeconds){
        cookieString += `; max-age=${maxAgeInSeconds}`;
    }
    document.cookie = cookieString;
};

export const deleteCookie = (name: string) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict`;
};

/******** JWT utils ********/
export const isTokenExpired = (token: string): boolean => {
    try {
        const { exp } = jwtDecode<DecodedJWT>(token);
        const now: number = Date.now() / 1000;
        return exp < now;
    } catch {
        return true;
    }
};

export const getUserInfo = (token: string) => {
    try {
        return jwtDecode<any>(token);
    } catch {
        return null;
    }
}


/********** Token refreshing && Validation **********/
export const refreshToken = async () => {
    const refreshToken: string | null = getCookie('refreshToken');
    if (!refreshToken) throw new Error('No refreshToken');

    try {
        const payload = { refreshToken: refreshToken }
        const {accessToken: newAccessToken, refreshToken: newRefreshToken } = await postMethod('/auth/refresh', payload);

        setNewAccessToken(newAccessToken);
        setNewRefreshToken(newRefreshToken);

        return newAccessToken;
    } catch (error) {
        console.error('Token refresh failed:', error);
        throw new Error('Failed to refresh token');
    }
};

/*
 * check if there is an accessToken
 * if there isn't, or the accessToken is expired, try to refresh tokens
 */
export const getValidAccessToken = async () => {
    const accessToken: string | null = getCookie('accessToken');
    if (!accessToken || isTokenExpired(accessToken)) {
        try {
            return await refreshToken();
        } catch (err) {
            console.error('Cannot refresh token:', err);
            return null;
        }
    }
    return accessToken;
}

// set a new accessToken after login or refresh
export const setNewAccessToken = (accessToken: string) => {
    const {exp} = getUserInfo(accessToken);
    if (!exp) {
        console.error('New access token has no expiration time.');
        return;
    }
    const nowInSeconds: number = Math.floor(Date.now() / 1000);
    const maxAgeInSeconds: number = exp - nowInSeconds;
    if (maxAgeInSeconds < 0) {
        console.error('New access token has expired.');
        return;
    }
    setCookie('accessToken', accessToken, maxAgeInSeconds);
}

// set a new refreshToken after login or refresh
export const setNewRefreshToken = (refreshToken: string) => {
    if(!refreshToken) return;

    // Conditionally set refreshToken depending on rememberMe
    if (localStorage.getItem('rememberMe') === 'true') {

        const expiresAt: number = parseInt(localStorage.getItem('refreshTokenExpiresAt') || '0');
        const remainingMs: number = expiresAt - Date.now();
        if (remainingMs > 0) {
            setCookie('refreshToken', refreshToken, Math.floor(remainingMs/1000));
        } else {
            // refreshToken is already expired
            deleteCookie('refreshToken');
            localStorage.removeItem('refreshTokenExpiresAt');
            console.warn('Refresh token expiration from localStorage has passed. Not setting new refresh token cookie.');
        }

    } else {
        setCookie('refreshToken', refreshToken); // session cookie
    }
}


