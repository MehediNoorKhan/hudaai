import { Navigate } from "react-router";
import useUserRole from "./useUserRole";
import LoadingSpinner from "./LoadingSpinner";

const AdminRoute = ({ children }) => {
    const [role, loading] = useUserRole(); // ✅ array destructure

    console.log("role inside admin route", role);

    if (loading) {
        return <LoadingSpinner></LoadingSpinner>;
    }

    if (role !== "admin") {
        console.log("Adminroute role is:", role);
        return <Navigate to="/forbidden" />;
    }

    return children;
};

export default AdminRoute;
