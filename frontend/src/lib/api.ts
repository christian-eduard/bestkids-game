import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
if (typeof window !== 'undefined') {
    console.log('🚀 BestKids Frontend using API URL:', API_URL || '(current host)');
}
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('token');
            const isAuthRoute = window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/register');
            const isDevRoute = window.location.pathname.startsWith('/dev/feedback');
            
            if (!isAuthRoute && !isDevRoute) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
