
import { useAuth } from "../Components/AuthContext";
import { Navigate } from "react-router";

export default function UserRoute({ children }) {
    const { user, role, loading } = useAuth();

    if (loading) return <p>Loading...</p>; // wait until user + role is ready
    if (!user) return <Navigate to="/login" />;
    if (role !== "user") return <Navigate to="/forbidden" />; // only allow user role

    return children;
}
