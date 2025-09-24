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

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
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
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser ? { ...currentUser, email: currentUser.email?.toLowerCase() } : null);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        loading,
        createUser,
        updateUserProfile,
        googleLogin,
        login,
        logOut,
    };

    return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
