import axios from "axios";

export const request = axios.create({
    baseURL: 'http://localhost:3001/api/',
    timeout: 1000
});

request.interceptors.request.use((config) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user && user.accessToken) {
            config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
    } catch (e) {
        console.log('gagal setup token', e)
    }
    return config;
});
