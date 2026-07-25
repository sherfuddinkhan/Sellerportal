import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Boxes,
  BarChart3,
  Users,
  Settings,
  LogOut
} from "lucide-react";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <h2>Seller Portal</h2>
        </div>
        <nav className="nav-menu">
          <NavLink to="/dashboard" className="nav-item">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/products" className="nav-item">
            <Package size={20} />
            <span>Products</span>
          </NavLink>
          <NavLink to="/orders" className="nav-item">
            <ShoppingCart size={20} />
            <span>Orders</span>
          </NavLink>
          <NavLink to="/inventory" className="nav-item">
            <Boxes size={20} />
            <span>Inventory</span>
          </NavLink>
          <NavLink to="/reports" className="nav-item">
            <BarChart3 size={20} />
            <span>Reports</span>
          </NavLink>
          <NavLink to="/customers" className="nav-item">
            <Users size={20} />
            <span>Customers</span>
          </NavLink>
          <NavLink to="/settings" className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="header">
          <h1>Dashboard Overview</h1>
          <button className="logout-btn" onClick={logout}>
            <LogOut size={18} />
            Logout
          </button>
        </header>

        <section className="cards-grid">
          <div className="card">
            <h3>Total Products</h3>
            <p className="card-value">120</p>
          </div>
          <div className="card">
            <h3>Total Orders</h3>
            <p className="card-value">35</p>
          </div>
          <div className="card">
            <h3>Revenue</h3>
            <p className="card-value">$25,000</p>
          </div>
          <div className="card">
            <h3>Inventory</h3>
            <p className="card-value">450</p>
          </div>
        </section>

        <section className="page-body">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;