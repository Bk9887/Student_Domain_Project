import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const token = localStorage.getItem("token");

    // If not logged in, or strictly not an admin, kick them back to their dashboard
    if (!user || !token || user.isAdmin !== true) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
