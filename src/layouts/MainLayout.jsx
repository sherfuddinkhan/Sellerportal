import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

function MainLayout() {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/", { replace: true });
    };

    return (
        <div className="main-layout">

            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <aside className="sidebar">

                <h2>Marketplace Seller Portal</h2>

                <nav>

                    <button
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/profile")}
                    >
                        Profile
                    </button>

                    <button
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </nav>

            </aside>


            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <main className="main-content">

                <Outlet />

            </main>

        </div>
    );
}

export default MainLayout;