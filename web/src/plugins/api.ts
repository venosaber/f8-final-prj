import axios from 'axios'
import {
    deleteCookie,
    getCookie,
    isTokenExpired,
    setNewAccessToken,
    setNewRefreshToken
} from "../router/auth.ts";

export const API_URL = import.meta.env.VITE_API_URL as string;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

let isRefreshing: boolean = false;

let failedRequests: { resolve: (value: unknown) => void, reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedRequests.forEach(request => {
        if(error) {
            request.reject(error);
        } else {
            request.resolve(token);
        }
    });
    failedRequests = [];
}

// request interceptor: auto attach access token to each request
api.interceptors.request.use(
    async (config) => {
        const accessToken: string | null = getCookie('accessToken');
        if (accessToken && !isTokenExpired(accessToken)) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// request interceptor: handle expired access token and auto refresh
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // if the error is 401 Unauthorized and this request hasn't been retried
        if (error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // if there is another refresh process running, add this request to a queue
                return new Promise((resolve, reject) => {
                    failedRequests.push({resolve, reject});
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch((error) => {
                    return Promise.reject(error);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken: string | null = getCookie('refreshToken');
            if (!refreshToken || isTokenExpired(refreshToken)) {
                // if the refresh token is also invalid, log out the user
                deleteCookie('accessToken');
                deleteCookie('refreshToken');
                window.location.href = '/login';
                isRefreshing = false;
                return Promise.reject(error);
            }

            try {
                const payload = { refreshToken: refreshToken }
                const { data } = await api.post('/auth/refresh', payload);
                const newAccessToken = data.accessToken;
                const newRefreshToken = data.refreshToken;

                // update the cookie
                setNewAccessToken(newAccessToken);
                setNewRefreshToken(newRefreshToken);

                // update the header for the original request and retry
                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                processQueue(null, newAccessToken); // retry requests in queue
                return api(originalRequest);

            } catch (refreshError) {
                // if refresh failed, log out the user
                deleteCookie('accessToken');
                deleteCookie('refreshToken');
                processQueue(refreshError, null);
                window.location.href = '/login';
                return Promise.reject(refreshError);

            } finally {
                isRefreshing = false;
            }
        }
    }
)

export default api