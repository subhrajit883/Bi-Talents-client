import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => {
    try {
        return localStorage.getItem("token");
    } catch (_) {
        return null;
    }
};

const withAuth = (config = {}) => {
    const token = getAuthToken();
    const headers = { ...(config.headers || {}) };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return { ...config, headers };
};

export const apiClient = axios.create({
    baseURL: BASE_URL,
});

apiClient.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const categoryUrl = {
    getAll: `${BASE_URL}/categories`,
    create: `${BASE_URL}/categories`,
    update: `${BASE_URL}/categories/`,
    delete: `${BASE_URL}/categories/`,
};

export const clientUrl = {
    getAll: `${BASE_URL}/clients`,

};
export const clientInterestUrl = {
    getAll: `${BASE_URL}/interests`,
};

export const talentUrl = {
    catWise: `${BASE_URL}/talents/category`,
    getAll: `${BASE_URL}/talents`,
    getTalentById: `${BASE_URL}/talents/`,
    create: `${BASE_URL}/talents`,
    update: `${BASE_URL}/talents/`,
    delete: `${BASE_URL}/talents/`,
};

export const authUrl = {
    adminlogin: `${BASE_URL}/auth/admin/login`,
};

export { withAuth };
