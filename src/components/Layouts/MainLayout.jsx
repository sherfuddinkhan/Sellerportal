// =========================================================
// MainLayout.jsx - FINAL FIXED - NOTHING MISSING
// All APIs from Apinames.docx + Original MainLayout
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
    const handleItemClick = (item) => {
        if (!item) return;
        if (item.path && item.path!== "#") navigate(item.path);
        if (Array.isArray(item.children) && item.children.length > 0) openItem(item.label);
    };
    const handleChildClick = (item, child) => {
        if (!child ||!child.path) return;
        if (item?.label) openItem(item.label);
        navigate(child.path);
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
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
                { label: "Profile", path: "/profile", icon: "👤", children: [
                    { label: "User Profile", path: "/profile" },
                    { label: "Profile Card", path: "/profile/card" },
                ]},
                { label: "Notifications", path: "/notifications", icon: "🔔", children: [
                    { label: "Notification List", path: "/notifications" },
                    { label: "Create Notification", path: "/notifications/create" },
                ]},
                { label: "Reviews", path: "/reviews", icon: "⭐", children: [
                    { label: "Review List", path: "/reviews" },
                    { label: "Create Review", path: "/reviews/create" },
                ]},
            ],
        },
        {
            section: "Seller Management",
            items: [
                { label: "Sellers", path: "/sellers", icon: "🏪", children: [
                    { label: "Seller List", path: "/sellers" },
                    { label: "Create Seller", path: "/sellers/create" },
                ]},
                { label: "Seller Customers", path: "/seller-customers", icon: "👥", children: [
                    { label: "Customer List", path: "/seller-customers" },
                    { label: "Create Customer", path: "/seller-customers/create" },
                ]},
                { label: "Marketplace Customers", path: "/marketplace-customers", icon: "🧑‍🤝‍🧑", children: [
                    { label: "Customer List", path: "/marketplace-customers" },
                    { label: "Create Customer", path: "/marketplace-customers/create" },
                ]},
            ],
        },
        {
            section: "Catalog & Products",
            items: [
                { label: "Catalog", path: "/catalog", icon: "📚", children: [
                    { label: "Catalog List", path: "/catalog" },
                    { label: "Create Catalog", path: "/catalog/create" },
                ]},
                { label: "Brands", path: "/brands", icon: "🏷", children: [
                    { label: "Brand List", path: "/brands" },
                    { label: "Create Brand", path: "/brands/create" },
                ]},
                { label: "Categories", path: "/categories", icon: "🗂", children: [
                    { label: "Category List", path: "/categories" },
                    { label: "Create Category", path: "/categories/create" },
                ]},
                { label: "Product Types", path: "/product-types", icon: "🧩", children: [
                    { label: "Product Type List", path: "/product-types" },
                    { label: "Create Product Type", path: "/product-types/create" },
                ]},
                { label: "Product Attributes", path: "/product-attributes", icon: "🏷", children: [
                    { label: "Attribute List", path: "/product-attributes" },
                    { label: "Create Attribute", path: "/product-attributes/create" },
                ]},
                { label: "Product Images", path: "/product-images", icon: "🖼", children: [
                    { label: "Image List", path: "/product-images" },
                    { label: "Create Image", path: "/product-images/create" },
                ]},
                { label: "Product Prices", path: "/product-prices", icon: "💰", children: [
                    { label: "Price List", path: "/product-prices" },
                    { label: "Create Price", path: "/product-prices/create" },
                ]},
                { label: "Products", path: "/products/list", icon: "📦", children: [
                    { label: "Product List", path: "/products/list" },
                    { label: "Create Product", path: "/products/create" },
                ]},
                { label: "Product Inventory", path: "/product-inventory", icon: "📦", children: [
                    { label: "Inventory List", path: "/product-inventory" },
                    { label: "Create Inventory", path: "/product-inventory/create" },
                ]},
                { label: "Vendor Item Masters", path: "/vendor-item-masters", icon: "🏷", children: [
                    { label: "Master List", path: "/vendor-item-masters" },
                    { label: "Create Master", path: "/vendor-item-masters/create" },
                ]},
                { label: "Vendor Item Custom Fields", path: "/vendor-item-custom-fields", icon: "🔧", children: [
                    { label: "Field List", path: "/vendor-item-custom-fields" },
                    { label: "Create Field", path: "/vendor-item-custom-fields/create" },
                ]},
            ],
        },
        {
            section: "Orders",
            items: [
                { label: "Sales Orders", path: "/sales-orders", icon: "🛒", children: [
                    { label: "Order List", path: "/sales-orders" },
                    { label: "Create Order", path: "/sales-orders/create" },
                ]},
                { label: "Sale Order Addresses", path: "/sale-order-addresses", icon: "📍", children: [
                    { label: "Address List", path: "/sale-order-addresses" },
                    { label: "Create Address", path: "/sale-order-addresses/create" },
                ]},
                { label: "Sales Order Items", path: "/sales-order-items", icon: "📝", children: [
                    { label: "Item List", path: "/sales-order-items" },
                    { label: "Create Item", path: "/sales-order-items/create" },
                ]},
                { label: "Order Items", path: "/order-items", icon: "📦", children: [
                    { label: "Order Item List", path: "/order-items" },
                    { label: "Create Item", path: "/order-items/create" },
                ]},
                { label: "Order Status History", path: "/order-status-history", icon: "📜", children: [
                    { label: "History List", path: "/order-status-history" },
                    { label: "Create History", path: "/order-status-history/create" },
                ]},
                { label: "Marketplace Orders", path: "/marketplace-orders", icon: "🌐", children: [
                    { label: "Order List", path: "/marketplace-orders" },
                    { label: "Create Order", path: "/marketplace-orders/create" },
                ]},
                { label: "Marketplace Order Items", path: "/marketplace-order-items", icon: "🛍", children: [
                    { label: "Item List", path: "/marketplace-order-items" },
                    { label: "Create Item", path: "/marketplace-order-items/create" },
                ]},
                { label: "Picklists", path: "/picklists", icon: "📋", children: [
                    { label: "Picklist List", path: "/picklists" },
                    { label: "Create Picklist", path: "/picklists/create" },
                ]},
            ],
        },
        {
            section: "Delivery & Logistics",
            items: [
                { label: "Delivery Challans", path: "/delivery-challans", icon: "📋", children: [
                    { label: "Challan List", path: "/delivery-challans" },
                    { label: "Create Challan", path: "/delivery-challans/create" },
                ]},
                { label: "Delivery Challan Items", path: "/delivery-challan-items", icon: "📄", children: [
                    { label: "Item List", path: "/delivery-challan-items" },
                    { label: "Create Item", path: "/delivery-challan-items/create" },
                ]},
                { label: "Shipments", path: "/shipments", icon: "🚚", children: [
                    { label: "Shipment List", path: "/shipments" },
                    { label: "Create Shipment", path: "/shipments/create" },
                ]},
                { label: "Shipping Manifests", path: "/shipping-manifests", icon: "📦", children: [
                    { label: "Manifest List", path: "/shipping-manifests" },
                    { label: "Create Manifest", path: "/shipping-manifests/create" },
                ]},
                { label: "Manifest Packages", path: "/manifest-packages", icon: "📦", children: [
                    { label: "Package List", path: "/manifest-packages" },
                    { label: "Create Package", path: "/manifest-packages/create" },
                ]},
                { label: "Gatepass", path: "/gatepass", icon: "🚪", children: [
                    { label: "Gatepass List", path: "/gatepass" },
                    { label: "Create Gatepass", path: "/gatepass/create" },
                ]},
                { label: "Warehouses", path: "/warehouses", icon: "🏭", children: [
                    { label: "Warehouse List", path: "/warehouses" },
                    { label: "Create Warehouse", path: "/warehouses/create" },
                ]},
                { label: "Warehouse Locations", path: "/warehouse-locations", icon: "📍", children: [
                    { label: "Location List", path: "/warehouse-locations" },
                    { label: "Create Location", path: "/warehouse-locations/create" },
                ]},
                { label: "Stock Ledger", path: "/stock-ledger", icon: "📒", children: [
                    { label: "Ledger List", path: "/stock-ledger" },
                    { label: "Create Entry", path: "/stock-ledger/create" },
                ]},
                { label: "Stock Movements", path: "/stock-movements", icon: "🔀", children: [
                    { label: "Movement List", path: "/stock-movements" },
                    { label: "Create Movement", path: "/stock-movements/create" },
                ]},
                { label: "Stock Transfers", path: "/stock-transfers", icon: "↔", children: [
                    { label: "Transfer List", path: "/stock-transfers" },
                    { label: "Create Transfer", path: "/stock-transfers/create" },
                ]},
                { label: "Stock Adjustments", path: "/stock-adjustments", icon: "⚖", children: [
                    { label: "Adjustment List", path: "/stock-adjustments" },
                    { label: "Create Adjustment", path: "/stock-adjustments/create" },
                ]},
                { label: "Inventory Adjustments", path: "/inventory-adjustments", icon: "📊", children: [
                    { label: "Adjustment List", path: "/inventory-adjustments" },
                    { label: "Create Adjustment", path: "/inventory-adjustments/create" },
                ]},
            ],
        },
        {
            section: "Procurement & Receiving",
            items: [
                { label: "Purchase Orders", path: "/purchase-orders", icon: "📑", children: [
                    { label: "Order List", path: "/purchase-orders" },
                    { label: "Create Order", path: "/purchase-orders/create" },
                ]},
                { label: "Purchase Order Items", path: "/purchase-order-items", icon: "📝", children: [
                    { label: "Item List", path: "/purchase-order-items" },
                    { label: "Create Item", path: "/purchase-order-items/create" },
                ]},
                { label: "Purchase Returns", path: "/purchase-returns", icon: "↩", children: [
                    { label: "Return List", path: "/purchase-returns" },
                    { label: "Create Return", path: "/purchase-returns/create" },
                ]},
                { label: "Goods Receipt Notes", path: "/goods-receipt-notes", icon: "📥", children: [
                    { label: "GRN List", path: "/goods-receipt-notes" },
                    { label: "Create GRN", path: "/goods-receipt-notes/create" },
                  
                ]},
                { label: "Goods Receipt Items", path: "/goods-receipt-note-items", icon: "📦", children: [
                    { label: "Item List", path: "/goods-receipt-note-items" },
                    { label: "Create Item", path: "/goods-receipt-note-items/create" },
                ]},
                { label: "Putaway", path: "/putaway", icon: "📥", children: [
                    { label: "Putaway List", path: "/putaway" },
                    { label: "Create Putaway", path: "/putaway/create" },
                ]},
                { label: "Suppliers", path: "/suppliers", icon: "🏢", children: [
                    { label: "Supplier List", path: "/suppliers" },
                    { label: "Create Supplier", path: "/suppliers/create" },
                ]},
            ],
        },
        {
            section: "Customers",
            items: [
                { label: "Customer Addresses", path: "/customer-addresses", icon: "📍", children: [
                    { label: "Address List", path: "/customer-addresses" },
                    { label: "Create Address", path: "/customer-addresses/create" },
                ]},
                { label: "Customer Payments", path: "/customer-payments", icon: "💳", children: [
                    { label: "Payment List", path: "/customer-payments" },
                    { label: "Create Payment", path: "/customer-payments/create" },
                ]},
                { label: "Customer Returns", path: "/customer-returns", icon: "🔄", children: [
                    { label: "Return List", path: "/customer-returns" },
                    { label: "Create Return", path: "/customer-returns/create" },
                ]},
                { label: "Wishlists", path: "/wishlists", icon: "❤", children: [
                    { label: "Wishlist List", path: "/wishlists" },
                    { label: "Create Wishlist", path: "/wishlists/create" },
                ]},
                { label: "Wishlist Items", path: "/wishlist-items", icon: "🛍", children: [
                    { label: "Item List", path: "/wishlist-items" },
                    { label: "Create Item", path: "/wishlist-items/create" },
                ]},
            ],
        },
        {
            section: "Marketplace",
            items: [
                { label: "Marketplaces", path: "/marketplaces", icon: "🌐", children: [
                    { label: "Marketplace List", path: "/marketplaces" },
                    { label: "Create Marketplace", path: "/marketplaces/create" },
                ]},
                { label: "Marketplace Returns", path: "/marketplace-returns", icon: "↩", children: [
                    { label: "Return List", path: "/marketplace-returns" },
                    { label: "Create Return", path: "/marketplace-returns/create" },
                ]},
            ],
        },
        {
            section: "Sales & Finance",
            items: [
                { label: "Sales Invoices", path: "/sales-invoices", icon: "🧾", children: [
                    { label: "Invoice List", path: "/sales-invoices" },
                    { label: "Create Invoice", path: "/sales-invoices/create" },
                ]},
                { label: "Payments", path: "/payments", icon: "💳", children: [
                    { label: "Payment List", path: "/payments" },
                    { label: "Create Payment", path: "/payments/create" },
                ]},
                { label: "Payment Settings", path: "/payments/settings", icon: "⚙", children: [
                    { label: "Payment Settings", path: "/payments/settings" },
                    { label: "Bank Details", path: "/payments/bank-details" },
                    { label: "Payment Gateway", path: "/payments/gateway" },
                    { label: "UPI Settings", path: "/payments/upi" },
                ]},
                { label: "Reports", path: "/reports", icon: "📈", children: [
                    { label: "Reports Dashboard", path: "/reports" },
                    { label: "Sales Report", path: "/reports/sales" },
                    { label: "Order Report", path: "/reports/orders" },
                    { label: "Inventory Report", path: "/reports/inventory" },
                    { label: "Product Report", path: "/reports/products" },
                    { label: "Customer Report", path: "/reports/customers" },
                    { label: "Purchase Report", path: "/reports/purchases" },
                    { label: "Stock Report", path: "/reports/stock" },
                ]},
            ],
        },
        {
            section: "Invoices & Compliance",
            items: [
                { label: "E-Invoices", path: "/einvoices", icon: "🧾", children: [
                    { label: "E-Invoice List", path: "/einvoices" },
                    { label: "Create E-Invoice", path: "/einvoices/create" },
                ]},
                { label: "E-Way Bills", path: "/ewaybills", icon: "🛣", children: [
                    { label: "E-Way Bill List", path: "/ewaybills" },
                    { label: "Create E-Way Bill", path: "/ewaybills/create" },
                ]},
                { label: "Invoice Tax Details", path: "/invoice-tax-details", icon: "💸", children: [
                    { label: "Tax Detail List", path: "/invoice-tax-details" },
                    { label: "Create Tax Detail", path: "/invoice-tax-details/create" },
                ]},
            ],
        },
        {
            section: "Fulfillment & Warehousing",
            items: [
                { label: "Shelfwise Inventories", path: "/shelfwise-inventories", icon: "🗄", children: [
                    { label: "Inventory List", path: "/shelfwise-inventories" },
                    { label: "Create Entry", path: "/shelfwise-inventories/create" },
                ]},
            ],
        },
        {
            section: "Reverse Logistics",
            items: [
                { label: "Reverse Pickups", path: "/reverse-pickups", icon: "↩", children: [
                    { label: "Pickup List", path: "/reverse-pickups" },
                    { label: "Create Pickup", path: "/reverse-pickups/create" },
                ]},
                { label: "Reverse Pickup Addresses", path: "/reverse-pickup-addresses", icon: "📍", children: [
                    { label: "Address List", path: "/reverse-pickup-addresses" },
                    { label: "Create Address", path: "/reverse-pickup-addresses/create" },
                ]},
                { label: "Reverse Pickup Items", path: "/reverse-pickup-items", icon: "📦", children: [
                    { label: "Item List", path: "/reverse-pickup-items" },
                    { label: "Create Item", path: "/reverse-pickup-items/create" },
                ]},
            ],
        },
        {
            section: "Supplier Extended",
            items: [
                { label: "Supplier Addresses", path: "/supplier-addresses", icon: "🏠", children: [
                    { label: "Address List", path: "/supplier-addresses" },
                    { label: "Create Address", path: "/supplier-addresses/create" },
                ]},
                { label: "Supplier Contacts", path: "/supplier-contacts", icon: "📞", children: [
                    { label: "Contact List", path: "/supplier-contacts" },
                    { label: "Create Contact", path: "/supplier-contacts/create" },
                ]},
                { label: "Suppliers", path: "/suppliers", icon: "🏢", children: [
                    { label: "Supplier List", path: "/suppliers" },
                    { label: "Create Supplier", path: "/suppliers/create" },
                ]},
            ],
        },
        {
            section: "Channel & Export",
            items: [
                { label: "Facility Channels", path: "/facility-channels", icon: "🔗", children: [
                    { label: "Channel List", path: "/facility-channels" },
                    { label: "Create Channel", path: "/facility-channels/create" },
                ]},
                { label: "Export Jobs", path: "/export-jobs", icon: "📤", children: [
                    { label: "Job List", path: "/export-jobs" },
                    { label: "Create Job", path: "/export-jobs/create" },
                ]},
            ],
        },
    ];

    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif", backgroundColor: "#f8fafc" }}>
            <aside style={{ width: "280px", backgroundColor: "#1e293b", color: "#f8fafc", display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, left: 0, overflow: "hidden", zIndex: 100, borderRight: "1px solid #334155" }}>
                <div style={{ height: "60px", display: "flex", alignItems: "center", padding: "0 20px", fontSize: "1.2rem", fontWeight: "700", borderBottom: "1px solid #334155", color: "#38bdf8", flexShrink: 0 }}>Seller Portal</div>
                <nav style={{ flex: 1, overflowY: "auto", padding: "10px 0" }}>
                    {menuSections.map((group, groupIndex) => {
                        if (!group ||!Array.isArray(group.items)) return null;
                        const isGroupOpen = openSections[group.section]!== false;
                        return (
                            <div key={`${group.section}-${groupIndex}`} style={{ marginBottom: "10px" }}>
                                <button type="button" onClick={() => toggleSection(group.section)} style={{ width: "100%", border: "none", background: "transparent", color: "#94a3b8", padding: "8px 20px", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "600", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left" }}>
                                    <span>{group.section}</span><span>{isGroupOpen? "▲" : "▼"}</span>
                                </button>
                                {isGroupOpen && (
                                    <div>
                                        {group.items.map((item, itemIndex) => {
                                            if (!item) return null;
                                            const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                                            const isItemOpen = openItems[item.label] === true;
                                            return (
                                                <div key={`${group.section}-${item.label}-${itemIndex}`} style={{ width: "100%" }}>
                                                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                                        <NavLink to={item.path || "#"} end onClick={(event) => { if (!item.path || item.path === "#") { event.preventDefault(); return; } handleItemClick(item); }} style={({ isActive }) => ({ flex: 1, display: "flex", alignItems: "center", gap: "10px", padding: "9px 20px", color: isActive? "#ffffff" : "#cbd5e1", backgroundColor: isActive? "#0284c7" : isItemOpen? "#26364d" : "transparent", textDecoration: "none", fontSize: "0.88rem", cursor: "pointer", minWidth: 0 })}>
                                                            <span style={{ width: "22px", minWidth: "22px", textAlign: "center" }}>{item.icon || "•"}</span>
                                                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</span>
                                                        </NavLink>
                                                        {hasChildren && (
                                                            <button type="button" aria-label={isItemOpen? `Collapse ${item.label}` : `Expand ${item.label}`} onClick={(event) => { event.preventDefault(); event.stopPropagation(); toggleItem(item.label); }} style={{ width: "42px", minWidth: "42px", height: "38px", border: "none", backgroundColor: isItemOpen? "#26364d" : "transparent", color: "#cbd5e1", cursor: "pointer", fontSize: "10px" }}>{isItemOpen? "▲" : "▼"}</button>
                                                        )}
                                                    </div>
                                                    {hasChildren && isItemOpen && (
                                                        <div style={{ backgroundColor: "#172033", paddingBottom: "4px" }}>
                                                            {item.children.map((child, childIndex) => {
                                                                if (!child ||!child.path) return null;
                                                                return (
                                                                    <NavLink key={`${item.label}-${child.path}-${childIndex}`} to={child.path} onClick={(event) => { event.stopPropagation(); handleChildClick(item, child); }} style={({ isActive }) => ({ display: "block", width: "100%", boxSizing: "border-box", padding: "7px 20px 7px 52px", color: isActive? "#38bdf8" : "#94a3b8", backgroundColor: isActive? "#1e3a5f" : "transparent", textDecoration: "none", fontSize: "0.82rem" })}>
                                                                        {child.label}
                                                                    </NavLink>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
                <div style={{ borderTop: "1px solid #334155", padding: "12px", flexShrink: 0 }}>
                    <button type="button" onClick={handleLogout} style={{ width: "100%", border: "none", background: "#7f1d1d", color: "#ffffff", padding: "10px", borderRadius: "6px", cursor: "pointer", fontSize: "0.88rem" }}>🚪 Logout</button>
                </div>
            </aside>
            <div style={{ flex: 1, marginLeft: "280px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <header style={{ height: "60px", backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 25px", position: "sticky", top: 0, zIndex: 10 }}>
                    <div style={{ fontWeight: "600", color: "#334155" }}>Seller Portal Control Panel</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <Link to="/profile" style={{ textDecoration: "none", color: "#64748b", fontSize: "0.9rem" }}>👤 Profile</Link>
                        <button type="button" onClick={handleLogout} style={{ border: "none", background: "transparent", color: "#ef4444", cursor: "pointer", fontSize: "0.9rem" }}>Logout</button>
                    </div>
                </header>
                <main style={{ flex: 1, padding: "25px", overflowY: "auto" }}><Outlet /></main>
            </div>
        </div>
    );
};
export default MainLayout;