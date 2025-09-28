import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import useAxiosSecure from "./useAxiosSecure";

export default function useUserRole() {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            console.log("Auth state changed, currentUser:", currentUser?.email); // Debug

            if (currentUser && currentUser.email) {
                try {
                    console.log("Fetching role for:", currentUser.email); // Debug

                    // Make sure the URL matches your backend route
                    const res = await axiosSecure.get(`/users/role/${currentUser.email}`);

                    console.log("Role response:", res.data); // Debug

                    if (res.data && res.data.role) {
                        setRole(res.data.role);
                        console.log("Role set to:", res.data.role); // Debug
                    } else {
                        console.log("No role found in response"); // Debug
                        setRole(null);
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                    console.error("Error details:", error.response?.data); // Debug
                    setRole(null);
                }
            } else {
                console.log("No current user, setting role to null"); // Debug
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [axiosSecure]);

    return [role, loading];
}