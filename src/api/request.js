import axios from "axios";

export const request = axios.create({
    baseURL: 'http://192.168.1.10:3000/api/',
    withCredentials: true,
    timeout: 1000
});
