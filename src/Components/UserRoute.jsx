import { Navigate } from "react-router";
import LoadingSpinner from "./LoadingSpinner";
import useUserRole from "../Components/useUserRole";
import { getAuth } from "firebase/auth";

export default function UserRoute({ children }) {
    const [role, loading] = useUserRole();
    const auth = getAuth();
    const user = auth.currentUser;

    if (loading) return <LoadingSpinner />; // wait until role is fetched
    if (!user) return <Navigate to="/login" replace />;
    if (role !== "user") return <Navigate to="/forbidden" replace />;

    return children;
}
