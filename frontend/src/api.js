import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // L'URL de votre API Laravel locale
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Important pour Sanctum (cookies de session/CSRF)
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
