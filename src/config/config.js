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

apiClient.interceptors.response.use(
    (response) => {
        const msg = response.data?.message;
        if (
            response.data &&
            response.data.success === false &&
            typeof msg === "string" &&
            (msg.toLowerCase().includes("invalid or expired token") ||
                msg.toLowerCase().includes("jwt expired"))
        ) {
            localStorage.removeItem("token");
            if (window.location.pathname !== "/adminlogin") {
                window.location.href = "/adminlogin";
            }
        }
        return response;
    },
    (error) => {
        const message = error.response?.data?.message || "";
        const status = error.response?.status;

        if (
            status === 401 ||
            status === 403 ||
            (typeof message === "string" &&
                (message.toLowerCase().includes("invalid or expired token") ||
                    message.toLowerCase().includes("jwt expired") ||
                    message.toLowerCase().includes("unauthorized")))
        ) {
            localStorage.removeItem("token");
            if (window.location.pathname !== "/adminlogin") {
                window.location.href = "/adminlogin";
            }
        }
        return Promise.reject(error);
    }
);

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
    create: `${BASE_URL}/interests`,
    getMy: `${BASE_URL}/interests/my`,
};

export const talentUrl = {
    catWise: `${BASE_URL}/talents/category`,
    getAll: `${BASE_URL}/talents`,
    getTalentById: `${BASE_URL}/talents/`,
    recommended: `${BASE_URL}/talents/recommended`,
    create: `${BASE_URL}/talents`,
    update: `${BASE_URL}/talents/`,
    delete: `${BASE_URL}/talents/`,
};

export const talentEnquiryUrl = {
    getAll: `${BASE_URL}/talent-enquiries`,
    create: `${BASE_URL}/talent-enquiries`,
    delete: `${BASE_URL}/talent-enquiries/`,
};

export const authUrl = {
    adminlogin: `${BASE_URL}/auth/admin/login`,
    clientRegister: `${BASE_URL}/auth/client/register`,
    clientLogin: `${BASE_URL}/auth/client/login`,
    forgotPassword: `${BASE_URL}/auth/forgot-password`,
    resetPassword: `${BASE_URL}/auth/reset-password`,
};

export { withAuth };

