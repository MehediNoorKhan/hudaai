// // src/Hooks/axiosSecure.js
// import axios from "axios";
// import { getAuth } from "firebase/auth";

// const axiosSecure = axios.create({
//     baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
// });

// // Interceptor to attach Firebase token automatically
// axiosSecure.interceptors.request.use(async (config) => {
//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (user) {
//         const token = await user.getIdToken(); // Firebase ID token
//         config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

// export default axiosSecure;


import axios from "axios";

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Attach JWT to each request
axiosSecure.interceptors.request.use((config) => {
    const token = localStorage.getItem("access-token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosSecure;
