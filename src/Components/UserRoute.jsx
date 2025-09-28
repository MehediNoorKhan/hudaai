// import { useContext } from "react";
// import { Navigate, useLocation } from "react-router";
// import { AuthContext } from "./AuthContext";
// import useUserRole from "./useUserRole";
// import LoadingSpinner from "./LoadingSpinner";

// const UserRoute = ({ children }) => {
//     const { user, loading: authLoading } = useContext(AuthContext);
//     const { data: role, isLoading: roleLoading, isError } = useUserRole(user?.email);
//     const location = useLocation();

//     if (authLoading || roleLoading) {
//         return <LoadingSpinner />;
//     }

//     if (!user || isError || role !== "user") {
//         return <Navigate to="/forbidden" state={{ from: location.pathname }} replace />;
//     }

//     return children;
// };

// export default UserRoute;


import { useAuth } from "../Components/AuthContext";
import { Navigate } from "react-router";

export default function UserRoute({ children }) {
    const { user, role, loading } = useAuth();

    if (loading) return <p>Loading...</p>; // wait until user + role is ready
    if (!user) return <Navigate to="/login" />;
    if (role !== "user") return <Navigate to="/forbidden" />; // only allow user role

    return children;
}

