import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout() {
    const navigate = useNavigate();
    const [adminUser, setAdminUser] = useState(null);

    useEffect(() => {
        // 1. Verify Authentication
        const userStr = localStorage.getItem("currentUser");
        const token = localStorage.getItem("token");

        if (!userStr || !token) {
            return navigate("/login");
        }

        const user = JSON.parse(userStr);

        // 2. Verify Role
        if (user.isAdmin !== true) {
            alert("Access Denied: You do not have administrative privileges.");
            return navigate("/dashboard");
        }

        setAdminUser(user);
    }, [navigate]);

    if (!adminUser) return null; // Prevent flash of unauthorized content

    return (
        <div className="flex bg-zinc-950 min-h-screen font-sans text-zinc-100">
            {/* Sidebar Navigation */}
            <AdminSidebar activeUser={adminUser} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col ml-64 min-w-0">

                {/* Top Navbar */}
                <AdminNavbar
                    adminName={adminUser.name}
                    onLogout={() => {
                        localStorage.clear();
                        navigate("/login");
                    }}
                />

                {/* Dynamic Page Content */}
                <main className="p-8 mt-16 flex-1 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
