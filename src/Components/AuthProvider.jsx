// import React, { useEffect, useState } from "react";
// import {
//     createUserWithEmailAndPassword,
//     GoogleAuthProvider,
//     onAuthStateChanged,
//     signInWithEmailAndPassword,
//     signInWithPopup,
//     signOut,
//     updateProfile,
// } from "firebase/auth";
// import { auth } from "../Firebase.config.init";
// import { AuthContext } from "./AuthContext";

// const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const googleProvider = new GoogleAuthProvider();

//     const createUser = (email, password) => {
//         setLoading(true);
//         return createUserWithEmailAndPassword(auth, email, password)
//             .finally(() => setLoading(false));
//     };

//     const googleLogin = () => {
//         return signInWithPopup(auth, googleProvider);
//     };

//     const updateUserProfile = (name, photoURL) => {
//         if (auth.currentUser) {
//             return updateProfile(auth.currentUser, { displayName: name, photoURL });
//         }
//         return Promise.reject(new Error("No user is logged in"));
//     };

//     const login = (email, password) => {
//         return signInWithEmailAndPassword(auth, email, password);
//     };

//     const logOut = () => {
//         setUser(null);
//         return signOut(auth);
//     };

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//             setUser(currentUser ? { ...currentUser, email: currentUser.email?.toLowerCase() } : null);
//             setLoading(false);
//         });
//         return () => unsubscribe();
//     }, []);

//     const authInfo = {
//         user,
//         loading,
//         createUser,
//         updateUserProfile,
//         googleLogin,
//         login,
//         logOut,
//     };

//     return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
// };

// export default AuthProvider;


// Updated AuthProvider.js - Add role management
import React, { useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import { auth } from "../Firebase.config.init";
import { AuthContext } from "./AuthContext";
import useAxiosSecure from "./useAxiosSecure"; // Make sure this import path is correct

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // Add role state
    const [loading, setLoading] = useState(true);
    const axiosSecure = useAxiosSecure();
    const googleProvider = new GoogleAuthProvider();

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
            .finally(() => setLoading(false));
    };

    const googleLogin = () => {
        return signInWithPopup(auth, googleProvider);
    };

    const updateUserProfile = (name, photoURL) => {
        if (auth.currentUser) {
            return updateProfile(auth.currentUser, { displayName: name, photoURL });
        }
        return Promise.reject(new Error("No user is logged in"));
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logOut = () => {
        setUser(null);
        setRole(null); // Clear role on logout
        return signOut(auth);
    };

    // Fetch user role from backend
    const fetchUserRole = async (userEmail) => {
        if (!userEmail) {
            console.log("No email provided for role fetch");
            setRole(null);
            return;
        }

        try {
            console.log("Fetching role for:", userEmail);
            const response = await axiosSecure.get(`/users/role/${userEmail}`);
            console.log("Role response:", response.data);

            if (response.data && response.data.role) {
                setRole(response.data.role);
                console.log("Role set to:", response.data.role);
            } else {
                console.log("No role found in response");
                setRole(null);
            }
        } catch (error) {
            console.error("Error fetching user role:", error);
            console.error("Error details:", error.response?.data);
            setRole(null);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            console.log("Auth state changed:", currentUser?.email);

            if (currentUser) {
                const normalizedUser = {
                    ...currentUser,
                    email: currentUser.email?.toLowerCase()
                };
                setUser(normalizedUser);

                // Fetch role after user is set
                await fetchUserRole(normalizedUser.email);
            } else {
                setUser(null);
                setRole(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [axiosSecure]);

    const authInfo = {
        user,
        role,        // Add role to context
        loading,
        createUser,
        updateUserProfile,
        googleLogin,
        login,
        logOut,
        fetchUserRole, // Optional: allow manual role refresh
    };

    return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;