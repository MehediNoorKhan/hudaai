import { Navigate } from "react-router";
import useUserRole from "./useUserRole";

const AdminRoute = ({ children }) => {
    const [role, loading] = useUserRole(); // ✅ array destructure

    console.log("role inside admin route", role);

    if (loading) {
        return <p className="text-center mt-10">Checking permissions...</p>;
    }

    if (role !== "admin") {
        console.log("Adminroute role is:", role);
        return <Navigate to="/forbidden" />;
    }

    return children;
};

export default AdminRoute;
