// =========================================================
// MainLayout.jsx - FIXED - No duplicate routes
// =========================================================
import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

const MainLayout = () => {
    const navigate = useNavigate();
    const [openSections, setOpenSections] = useState({
        Main: true,
        "Seller Management": true,
        "Catalog & Products": true,
        Orders: true,
        "Delivery & Logistics": true,
        "Procurement & Receiving": true,
        Customers: true,
        Marketplace: true,
        "Sales & Finance": true,
        "Invoices & Compliance": true,
        "Fulfillment & Warehousing": true,
        "Reverse Logistics": true,
        "Supplier Extended": true,
        "Channel & Export": true,
    });
    const [openItems, setOpenItems] = useState({});

    const toggleSection = (sectionName) => {
        setOpenSections((prev) => ({...prev, [sectionName]:!prev[sectionName] }));
    };
    const toggleItem = (itemLabel) => {
        setOpenItems((prev) => ({...prev, [itemLabel]:!prev[itemLabel] }));
    };
    const openItem = (itemLabel) => {
        setOpenItems((prev) => ({...prev, [itemLabel]: true }));
    };

    const menuSections = [
        {
            section: "Main",
            items: [
                { label: "Dashboard", path: "/dashboard", icon: "🏠" },
                { label: "Auth Management", path: "/auth-management", icon: "🔐", children: [
                    { label: "Auth List", path: "/auth-management" },
                    { label: "Create Auth", path: "/auth-management/create" },
                ]},
                { label: "Profile", path: "/profile", icon: "👤" },
                { label: "Notifications", path: "/notifications", icon: "🔔" },
                { label: "Reviews", path: "/reviews", icon: "⭐" },
            ],
        },
        {
            section: "Seller Management",
            items: [
                { label: "Sellers", path: "/sellers", icon: "🏪" },
                { label: "Seller Customers", path: "/seller-customers", icon: "👥" },
                { label: "Marketplace Customers", path: "/marketplace-customers", icon: "🧑‍🤝‍🧑" },
            ],
        },
        {
            section: "Catalog & Products",
            items: [
                { label: "Catalog", path: "/catalog", icon: "📚" },
                { label: "Brands", path: "/brands", icon: "🏷️" },
                { label: "Categories", path: "/categories", icon: "🗂️" },
                { label: "Product Types", path: "/product-types", icon: "🧩" },
                { label: "Product Attributes", path: "/product-attributes", icon: "🔖" },
                { label: "Product Images", path: "/product-images", icon: "🖼️" },
                { label: "Product Prices", path: "/product-prices", icon: "💰" },
                { label: "Products", path: "/products/list", icon: "📦" },
                { label: "Product Inventory", path: "/product-inventory", icon: "📊" },
                { label: "Vendor Item Masters", path: "/vendor-item-masters", icon: "🏷️" },
                { label: "Vendor Item Custom Fields", path: "/vendor-item-custom-fields", icon: "🔧" },
            ],
        },
        {
            section: "Orders",
            items: [
                { label: "Sales Orders", path: "/sales-orders", icon: "🛒" },
                { label: "Sale Order Addresses", path: "/sale-order-addresses", icon: "📍" },
                { label: "Sales Order Items", path: "/sales-order-items", icon: "📝" },
                { label: "Order Items", path: "/order-items", icon: "📦" }, // <-- This will now work with Node proxy
                { label: "Order Status History", path: "/order-status-history", icon: "📜" },
                { label: "Marketplace Orders", path: "/marketplace-orders", icon: "🌐" },
                { label: "Marketplace Order Items", path: "/marketplace-order-items", icon: "🛍️" },
                { label: "Picklists", path: "/picklists", icon: "📋" },
            ],
        },
        {
            section: "Delivery & Logistics",
            items: [
                { label: "Delivery Challans", path: "/delivery-challans", icon: "📋" },
                { label: "Delivery Challan Items", path: "/delivery-challan-items", icon: "📄" },
                { label: "Shipments", path: "/shipments", icon: "🚚" },
                { label: "Shipping Manifests", path: "/shipping-manifests", icon: "📦" },
                { label: "Manifest Packages", path: "/manifest-packages", icon: "📦" },
                { label: "Gatepass", path: "/gatepass", icon: "🚪" },
                { label: "Warehouses", path: "/warehouses", icon: "🏭" },
                { label: "Warehouse Locations", path: "/warehouse-locations", icon: "📍" },
                { label: "Stock Ledger", path: "/stock-ledger", icon: "📒" },
                { label: "Stock Movements", path: "/stock-movements", icon: "🔀" },
                { label: "Stock Transfers", path: "/stock-transfers", icon: "↔️" },
                { label: "Stock Adjustments", path: "/stock-adjustments", icon: "⚖️" },
                { label: "Inventory Adjustments", path: "/inventory-adjustments", icon: "📊" },
            ],
        },
        {
            section: "Procurement & Receiving",
            items: [
                { label: "Purchase Orders", path: "/purchase-orders", icon: "📑" },
                { label: "Purchase Order Items", path: "/purchase-order-items", icon: "📝" },
                { label: "Purchase Returns", path: "/purchase-returns", icon: "↩️" },
                { label: "Goods Receipt Notes", path: "/goods-receipt-notes", icon: "📥" },
                { label: "Goods Receipt Items", path: "/goods-receipt-note-items", icon: "📦" },
                { label: "Putaway", path: "/putaway", icon: "📥" },
                { label: "Suppliers", path: "/suppliers", icon: "🏢" }, // KEEP ONLY HERE
            ],
        },
        //... rest of your sections (Customers, Marketplace, Sales & Finance, etc.) - keep as is
        // BUT remove the duplicate Suppliers from "Supplier Extended"
        {
            section: "Supplier Extended",
            items: [
                { label: "Supplier Addresses", path: "/supplier-addresses", icon: "🏠" },
                { label: "Supplier Contacts", path: "/supplier-contacts", icon: "📞" },
                // REMOVED duplicate Suppliers here
            ],
        },
        {
            section: "Customers",
            items: [
                { label: "Customer Addresses", path: "/customer-addresses", icon: "📍" },
                { label: "Customer Payments", path: "/customer-payments", icon: "💳" },
                { label: "Customer Returns", path: "/customer-returns", icon: "🔄" },
                { label: "Wishlists", path: "/wishlists", icon: "❤️" },
                { label: "Wishlist Items", path: "/wishlist-items", icon: "🛍️" },
            ],
        },
        {
            section: "Marketplace",
            items: [
                { label: "Marketplaces", path: "/marketplaces", icon: "🌐" },
                { label: "Marketplace Returns", path: "/marketplace-returns", icon: "↩️" },
            ],
        },
        {
            section: "Sales & Finance",
            items: [
                { label: "Sales Invoices", path: "/sales-invoices", icon: "🧾" },
                { label: "Payments", path: "/payments", icon: "💳" },
                { label: "Payment Settings", path: "/payments/settings", icon: "⚙️" },
            ],
        },
        {
            section: "Invoices & Compliance",
            items: [
                { label: "E-Invoices", path: "/einvoices", icon: "🧾" },
                { label: "E-Way Bills", path: "/ewaybills", icon: "🛣️" },
                { label: "Invoice Tax Details", path: "/invoice-tax-details", icon: "💸" },
            ],
        },
        {
            section: "Fulfillment & Warehousing",
            items: [
                { label: "Shelfwise Inventories", path: "/shelfwise-inventories", icon: "🗄️" },
            ],
        },
        {
            section: "Reverse Logistics",
            items: [
                { label: "Reverse Pickups", path: "/reverse-pickups", icon: "↩️" },
                { label: "Reverse Pickup Addresses", path: "/reverse-pickup-addresses", icon: "📍" },
                { label: "Reverse Pickup Items", path: "/reverse-pickup-items", icon: "📦" },
            ],
        },
        {
            section: "Channel & Export",
            items: [
                { label: "Facility Channels", path: "/facility-channels", icon: "🔗" },
                { label: "Export Jobs", path: "/export-jobs", icon: "📤" },
            ],
        },
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login", { replace: true });
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif", backgroundColor: "#f8fafc" }}>
            <aside style={{ width: "280px", backgroundColor: "#1e293b", color: "#f8fafc", display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, left: 0, overflow: "hidden", zIndex: 100 }}>
                <div style={{ height: "60px", display: "flex", alignItems: "center", padding: "0 20px", fontSize: "1.2rem", fontWeight: "700", borderBottom: "1px solid #334155", color: "#38bdf8" }}>Seller Portal</div>
                <nav style={{ flex: 1, overflowY: "auto", padding: "10px 0" }}>
                    {menuSections.map((group) => (
                        <div key={group.section} style={{ marginBottom: "10px" }}>
                            <button onClick={() => toggleSection(group.section)} style={{ width: "100%", border: "none", background: "transparent", color: "#94a3b8", padding: "8px 20px", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: "600", display: "flex", justifyContent: "space-between", cursor: "pointer" }}>
                                <span>{group.section}</span><span>{openSections[group.section]? "▲" : "▼"}</span>
                            </button>
                            {openSections[group.section] && (
                                <div>
                                    {group.items.map((item) => {
                                        const hasChildren = item.children?.length > 0;
                                        const isItemOpen = openItems[item.label];
                                        return (
                                            <div key={item.label}>
                                                <div style={{ display: "flex" }}>
                                                    <NavLink to={item.path} style={({ isActive }) => ({ flex: 1, display: "flex", gap: "10px", padding: "9px 20px", color: isActive? "#fff" : "#cbd5e1", backgroundColor: isActive? "#0284c7" : "transparent", textDecoration: "none", fontSize: "0.88rem" })}>
                                                        <span>{item.icon}</span><span>{item.label}</span>
                                                    </NavLink>
                                                    {hasChildren && (
                                                        <button onClick={() => toggleItem(item.label)} style={{ width: "42px", background: "transparent", border: "none", color: "#cbd5e1", cursor: "pointer" }}>{isItemOpen? "▲" : "▼"}</button>
                                                    )}
                                                </div>
                                                {hasChildren && isItemOpen && (
                                                    <div style={{ backgroundColor: "#172033" }}>
                                                        {item.children.map((child) => (
                                                            <NavLink key={child.path} to={child.path} style={({ isActive }) => ({ display: "block", padding: "7px 20px 7px 52px", color: isActive? "#38bdf8" : "#94a3b8", backgroundColor: isActive? "#1e3a5f" : "transparent", textDecoration: "none", fontSize: "0.82rem" })}>
                                                                {child.label}
                                                            </NavLink>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
                <div style={{ borderTop: "1px solid #334155", padding: "12px" }}>
                    <button onClick={handleLogout} style={{ width: "100%", border: "none", background: "#7f1d1d", color: "#fff", padding: "10px", borderRadius: "6px", cursor: "pointer" }}>🚪 Logout</button>
                </div>
            </aside>
            <div style={{ flex: 1, marginLeft: "280px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <header style={{ height: "60px", backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 25px", position: "sticky", top: 0, zIndex: 10 }}>
                    <div style={{ fontWeight: "600", color: "#334155" }}>Seller Portal Control Panel</div>
                    <div style={{ display: "flex", gap: "15px" }}>
                        <Link to="/profile" style={{ textDecoration: "none", color: "#64748b" }}>👤 Profile</Link>
                        <button onClick={handleLogout} style={{ border: "none", background: "transparent", color: "#ef4444", cursor: "pointer" }}>Logout</button>
                    </div>
                </header>
                <main style={{ flex: 1, padding: "25px", overflowY: "auto" }}><Outlet /></main>
            </div>
        </div>
    );
};

export default MainLayout;
