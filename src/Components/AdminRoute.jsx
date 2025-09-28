// import { useContext } from "react";
// import { Navigate, useLocation } from "react-router";
// import { AuthContext } from "./AuthContext"; // adjust path
// import useUserRole from "./useUserRole";
// import LoadingSpinner from "./LoadingSpinner";

import { useContext } from "react";
import { useLocation } from "react-router";
import { AuthContext } from "./AuthContext";
import useUserRole from "./useUserRole";

// const AdminRoute = ({ children }) => {
//     const { user, loading: authLoading } = useContext(AuthContext);
//     const { data: role, isLoading: roleLoading, isError } = useUserRole(user?.email);
//     const location = useLocation();

//     // Show loading spinner if auth or role is still loading
//     if (authLoading || roleLoading) return <LoadingSpinner />;

//     // If user not logged in, role is not admin, or error fetching role
//     if (!user || isError || role !== "admin") {
//         return <Navigate to="/forbidden" state={{ from: location.pathname }} replace />;
//     }

//     // ✅ User is authenticated and role is admin
//     return children;
// };

// export default AdminRoute;


const AdminRoute = ({ children }) => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const { data: role, isLoading: roleLoading, isError } = useUserRole(user?.email || null);
    const location = useLocation();

    if (authLoading || roleLoading) return <LoadingSpinner />;

    if (!user || isError || role !== "admin") {
        return <Navigate to="/forbidden" state={{ from: location }} replace />;
    }

    return children;
};

export default AdminRoute;