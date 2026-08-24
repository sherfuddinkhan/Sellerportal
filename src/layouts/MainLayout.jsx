import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

const MainLayout = () => {
  const menuSections = [
    {
      section: "Main",
      items: [
        { label: "Dashboard", path: "/dashboard", icon: "🏠" },
        { label: "Notifications", path: "/notifications", icon: "🔔" },
      ],
    },
    {
      section: "Catalog & Products",
      items: [
        { label: "Catalog", path: "/catalog", icon: "📚" },
        { label: "Products", path: "/products", icon: "📦" },
        { label: "Brands", path: "/brands", icon: "🏷️" },
        { label: "Categories", path: "/categories", icon: "📂" },
        { label: "Product Attributes", path: "/product-attributes", icon: "🏷️" },
        { label: "Product Images", path: "/product-images", icon: "🖼️" },
        { label: "Product Inventory", path: "/product-inventory", icon: "📊" },
        { label: "Product Prices", path: "/product-prices", icon: "💰" },
        { label: "Product Types", path: "/product-types", icon: "🔖" },
        { label: "Reviews", path: "/reviews", icon: "⭐" },
      ],
    },
    {
      section: "Orders & Fulfillment",
      items: [
        { label: "Orders", path: "/orders", icon: "🛒" },
        { label: "Order Items", path: "/order-items", icon: "📝" },
        { label: "Order Status History", path: "/order-status-history", icon: "📜" },
        { label: "Marketplace Order Items", path: "/marketplace-order-items", icon: "🛍️" },
        { label: "Cart Items", path: "/cart-items", icon: "🧺" },
        { label: "Wishlist Items", path: "/wishlist-items", icon: "❤️" },
      ],
    },
    {
      section: "Delivery & Logistics",
      items: [
        { label: "Delivery Challans", path: "/delivery-challans", icon: "📋" },
        { label: "Delivery Challan Items", path: "/delivery-challan-items", icon: "📄" },
        { label: "Shipments", path: "/shipments", icon: "🚚" },
        { label: "Warehouses", path: "/warehouses", icon: "🏭" },
        { label: "Stock Ledger", path: "/stock-ledger", icon: "📒" },
      ],
    },
    {
      section: "Procurement & Receiving",
      items: [
        { label: "Goods Receipt Notes", path: "/goods-receipt-notes", icon: "📥" },
        { label: "Goods Receipt Items", path: "/goods-receipt-items", icon: "📦" },
        { label: "Purchase Orders", path: "/purchase-orders", icon: "📑" },
        { label: "Purchase Order Items", path: "/purchase-order-items", icon: "📝" },
        { label: "Purchase Returns", path: "/purchase-returns", icon: "↩️" },
      ],
    },
    {
      section: "Customer & Finance",
      items: [
        { label: "Seller Customers", path: "/seller-customers", icon: "👥" },
        { label: "Customer Addresses", path: "/customer-addresses", icon: "📍" },
        { label: "Customer Payments", path: "/customer-payments", icon: "💳" },
        { label: "Customer Returns", path: "/customer-returns", icon: "🔄" },
        { label: "Marketplace Returns", path: "/marketplace-returns", icon: "↩️" },
        { label: "Sales Invoices", path: "/sales-invoices", icon: "🧾" },
        { label: "Payment Settings", path: "/payment-settings", icon: "⚙️" },
        { label: "Reports", path: "/reports", icon: "📈" },
        { label: "Profile", path: "/profile", icon: "👤" },
      ],
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "270px",
          backgroundColor: "#1e293b",
          color: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #334155",
        }}
      >
        <div
          style={{
            padding: "20px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            borderBottom: "1px solid #334155",
            color: "#38bdf8",
          }}
        >
          Seller Portal
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "10px 0" }}>
          {menuSections.map((group, idx) => (
            <div key={idx} style={{ marginBottom: "15px" }}>
              <div
                style={{
                  padding: "5px 20px",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  color: "#94a3b8",
                  letterSpacing: "0.05em",
                }}
              >
                {group.section}
              </div>
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 20px",
                    color: isActive ? "#ffffff" : "#cbd5e1",
                    backgroundColor: isActive ? "#0284c7" : "transparent",
                    textDecoration: "none",
                    fontSize: "0.88rem",
                    transition: "background 0.2s",
                  })}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Container */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#f8fafc" }}>
        <header
          style={{
            height: "60px",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 25px",
          }}
        >
          <span style={{ fontWeight: "600", color: "#334155" }}>Seller Portal Control Panel</span>
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <Link to="/profile" style={{ textDecoration: "none", color: "#64748b", fontSize: "0.9rem" }}>
              Profile
            </Link>
            <Link to="/login" style={{ textDecoration: "none", color: "#ef4444", fontSize: "0.9rem" }}>
              Logout
            </Link>
          </div>
        </header>

        <main style={{ flex: 1, padding: "25px", overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;