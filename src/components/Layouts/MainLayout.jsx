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
                    { label: "View Auth", path: "/auth-management/view/:id" },
                    { label: "Edit Auth", path: "/auth-management/edit/:id" },
                ]},
                { label: "Profile", path: "/profile", icon: "👤", children: [
                    { label: "User Profile", path: "/profile" },
                    { label: "Profile Card", path: "/profile/card" },
                ]},
                { label: "Notifications", path: "/notifications", icon: "🔔", children: [
                    { label: "Notification List", path: "/notifications" },
                    { label: "Create Notification", path: "/notifications/create" },
                    { label: "View Notification", path: "/notifications/view/:id" },
                    { label: "Edit Notification", path: "/notifications/edit/:id" },
                    { label: "Notification Settings", path: "/notifications/settings" },
                ]},
                { label: "Reviews", path: "/reviews", icon: "⭐", children: [
                    { label: "Review List", path: "/reviews" },
                    { label: "Create Review", path: "/reviews/create" },
                    { label: "View Review", path: "/reviews/view/:id" },
                    { label: "Edit Review", path: "/reviews/edit/:id" },
                    { label: "Review Filters", path: "/reviews/filters" },
                    { label: "Search Reviews", path: "/reviews/search" },
                    { label: "Statistics", path: "/reviews/statistics" },
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
                    { label: "Search", path: "/seller-customers/search" },
                ]},
                { label: "Marketplace Customers", path: "/marketplace-customers", icon: "🧑‍🤝‍🧑", children: [
                    { label: "Customer List", path: "/marketplace-customers" },
                    { label: "Create Customer", path: "/marketplace-customers/create" },
                    { label: "View Customer", path: "/marketplace-customers/view/:id" },
                    { label: "Edit Customer", path: "/marketplace-customers/edit/:id" },
                    { label: "Search", path: "/marketplace-customers/search" },
                    { label: "Statistics", path: "/marketplace-customers/statistics" },
                ]},
            ],
        },
        {
            section: "Catalog & Products",
            items: [
                { label: "Catalog", path: "/catalog", icon: "📚", children: [
                    { label: "Catalog List", path: "/catalog" },
                    { label: "Create Catalog", path: "/catalog/create" },
                    { label: "View Catalog", path: "/catalog/view/:id" },
                    { label: "Edit Catalog", path: "/catalog/edit/:id" },
                ]},
                { label: "Brands", path: "/brands", icon: "🏷", children: [
                    { label: "Brand List", path: "/brands" },
                    { label: "Create Brand", path: "/brands/create" },
                    { label: "View Brand", path: "/brands/view/:id" },
                    { label: "Edit Brand", path: "/brands/edit/:id" },
                    { label: "Brand Filters", path: "/brands/filters" },
                    { label: "Search", path: "/brands/search" },
                ]},
                { label: "Categories", path: "/categories", icon: "🗂", children: [
                    { label: "Category List", path: "/categories" },
                    { label: "Create Category", path: "/categories/create" },
                    { label: "View Category", path: "/categories/view/:id" },
                    { label: "Edit Category", path: "/categories/edit/:id" },
                ]},
                { label: "Product Types", path: "/product-types", icon: "🧩", children: [
                    { label: "Product Type List", path: "/product-types" },
                    { label: "Create Product Type", path: "/product-types/create" },
                    { label: "View Type", path: "/product-types/view/:id" },
                    { label: "Edit Type", path: "/product-types/edit/:id" },
                ]},
                { label: "Product Attributes", path: "/product-attributes", icon: "🏷", children: [
                    { label: "Attribute List", path: "/product-attributes" },
                    { label: "Create Attribute", path: "/product-attributes/create" },
                    { label: "View Attribute", path: "/product-attributes/view/:id" },
                    { label: "Edit Attribute", path: "/product-attributes/edit/:id" },
                ]},
                { label: "Product Images", path: "/product-images", icon: "🖼", children: [
                    { label: "Image List", path: "/product-images" },
                    { label: "Create Image", path: "/product-images/create" },
                    { label: "View Image", path: "/product-images/view/:id" },
                    { label: "Edit Image", path: "/product-images/edit/:id" },
                    { label: "Statistics", path: "/product-images/statistics" },
                ]},
                { label: "Product Prices", path: "/product-prices", icon: "💰", children: [
                    { label: "Price List", path: "/product-prices" },
                    { label: "Create Price", path: "/product-prices/create" },
                    { label: "View Price", path: "/product-prices/view/:id" },
                    { label: "Edit Price", path: "/product-prices/edit/:id" },
                    { label: "Statistics", path: "/product-prices/statistics" },
                ]},
                { label: "Products", path: "/products/list", icon: "📦", children: [
                    { label: "Product List", path: "/products/list" },
                    { label: "Create Product", path: "/products/create" },
                    { label: "View Product", path: "/products/view/:id" },
                    { label: "Edit Product", path: "/products/edit/:id" },
                    { label: "Search", path: "/products/search" },
                    { label: "Statistics", path: "/products/statistics" },
                ]},
                { label: "Product Inventory", path: "/product-inventory", icon: "📦", children: [
                    { label: "Inventory List", path: "/product-inventory" },
                    { label: "Create Inventory", path: "/product-inventory/create" },
                    { label: "View Inventory", path: "/product-inventory/view/:id" },
                    { label: "Edit Inventory", path: "/product-inventory/edit/:id" },
                    { label: "Statistics", path: "/product-inventory/statistics" },
                ]},
                { label: "Vendor Item Masters", path: "/vendor-item-masters", icon: "🏷", children: [
                    { label: "Master List", path: "/vendor-item-masters" },
                    { label: "Create Master", path: "/vendor-item-masters/create" },
                    { label: "View Master", path: "/vendor-item-masters/view/:id" },
                    { label: "Edit Master", path: "/vendor-item-masters/edit/:id" },
                    { label: "Search", path: "/vendor-item-masters/search" },
                    { label: "Statistics", path: "/vendor-item-masters/statistics" },
                ]},
                { label: "Vendor Item Custom Fields", path: "/vendor-item-custom-fields", icon: "🔧", children: [
                    { label: "Field List", path: "/vendor-item-custom-fields" },
                    { label: "Create Field", path: "/vendor-item-custom-fields/create" },
                    { label: "View Field", path: "/vendor-item-custom-fields/view/:id" },
                    { label: "Edit Field", path: "/vendor-item-custom-fields/edit/:id" },
                    { label: "Search", path: "/vendor-item-custom-fields/search" },
                ]},
            ],
        },
        {
            section: "Orders",
            items: [
                { label: "Sales Orders", path: "/sales-orders", icon: "🛒", children: [
                    { label: "Order List", path: "/sales-orders" },
                    { label: "Create Order", path: "/sales-orders/create" },
                    { label: "View Order", path: "/sales-orders/view/:id" },
                    { label: "Edit Order", path: "/sales-orders/edit/:id" },
                    { label: "Search", path: "/sales-orders/search" },
                    { label: "Filters", path: "/sales-orders/filters" },
                ]},
                { label: "Sale Order Addresses", path: "/sale-order-addresses", icon: "📍", children: [
                    { label: "Address List", path: "/sale-order-addresses" },
                    { label: "Create Address", path: "/sale-order-addresses/create" },
                    { label: "View Address", path: "/sale-order-addresses/view/:id" },
                    { label: "Edit Address", path: "/sale-order-addresses/edit/:id" },
                    { label: "Search", path: "/sale-order-addresses/search" },
                ]},
                { label: "Sales Order Items", path: "/sales-order-items", icon: "📝", children: [
                    { label: "Item List", path: "/sales-order-items" },
                    { label: "Create Item", path: "/sales-order-items/create" },
                    { label: "View Item", path: "/sales-order-items/view/:id" },
                    { label: "Edit Item", path: "/sales-order-items/edit/:id" },
                ]},
                { label: "Order Items", path: "/order-items", icon: "📦", children: [
                    { label: "Order Item List", path: "/order-items" },
                    { label: "Create Item", path: "/order-items/create" },
                    { label: "View Item", path: "/order-items/view/:id" },
                    { label: "Edit Item", path: "/order-items/edit/:id" },
                ]},
                { label: "Order Status History", path: "/order-status-history", icon: "📜", children: [
                    { label: "History List", path: "/order-status-history" },
                    { label: "Create History", path: "/order-status-history/create" },
                    { label: "View History", path: "/order-status-history/view/:id" },
                    { label: "Edit History", path: "/order-status-history/edit/:id" },
                    { label: "Search", path: "/order-status-history/search" },
                ]},
                { label: "Marketplace Orders", path: "/marketplace-orders", icon: "🌐", children: [
                    { label: "Order List", path: "/marketplace-orders" },
                    { label: "Create Order", path: "/marketplace-orders/create" },
                    { label: "View Order", path: "/marketplace-orders/view/:id" },
                    { label: "Edit Order", path: "/marketplace-orders/edit/:id" },
                    { label: "Search", path: "/marketplace-orders/search" },
                ]},
                { label: "Marketplace Order Items", path: "/marketplace-order-items", icon: "🛍", children: [
                    { label: "Item List", path: "/marketplace-order-items" },
                    { label: "Create Item", path: "/marketplace-order-items/create" },
                    { label: "View Item", path: "/marketplace-order-items/view/:id" },
                    { label: "Edit Item", path: "/marketplace-order-items/edit/:id" },
                    { label: "Search", path: "/marketplace-order-items/search" },
                    { label: "Statistics", path: "/marketplace-order-items/statistics" },
                ]},
                { label: "Picklists", path: "/picklists", icon: "📋", children: [
                    { label: "Picklist List", path: "/picklists" },
                    { label: "Create Picklist", path: "/picklists/create" },
                    { label: "View Picklist", path: "/picklists/view/:id" },
                    { label: "Edit Picklist", path: "/picklists/edit/:id" },
                    { label: "Search", path: "/picklists/search" },
                ]},
            ],
        },
        {
            section: "Delivery & Logistics",
            items: [
                { label: "Delivery Challans", path: "/delivery-challans", icon: "📋", children: [
                    { label: "Challan List", path: "/delivery-challans" },
                    { label: "Create Challan", path: "/delivery-challans/create" },
                    { label: "View Challan", path: "/delivery-challans/view/:id" },
                    { label: "Edit Challan", path: "/delivery-challans/edit/:id" },
                ]},
                { label: "Delivery Challan Items", path: "/delivery-challan-items", icon: "📄", children: [
                    { label: "Item List", path: "/delivery-challan-items" },
                    { label: "Create Item", path: "/delivery-challan-items/create" },
                    { label: "View Item", path: "/delivery-challan-items/view/:id" },
                    { label: "Edit Item", path: "/delivery-challan-items/edit/:id" },
                ]},
                { label: "Shipments", path: "/shipments", icon: "🚚", children: [
                    { label: "Shipment List", path: "/shipments" },
                    { label: "Create Shipment", path: "/shipments/create" },
                    { label: "View Shipment", path: "/shipments/view/:id" },
                    { label: "Edit Shipment", path: "/shipments/edit/:id" },
                    { label: "Search", path: "/shipments/search" },
                ]},
                { label: "Shipping Manifests", path: "/shipping-manifests", icon: "📦", children: [
                    { label: "Manifest List", path: "/shipping-manifests" },
                    { label: "Create Manifest", path: "/shipping-manifests/create" },
                    { label: "View Manifest", path: "/shipping-manifests/view/:id" },
                    { label: "Edit Manifest", path: "/shipping-manifests/edit/:id" },
                    { label: "Search", path: "/shipping-manifests/search" },
                ]},
                { label: "Manifest Packages", path: "/manifest-packages", icon: "📦", children: [
                    { label: "Package List", path: "/manifest-packages" },
                    { label: "Create Package", path: "/manifest-packages/create" },
                    { label: "View Package", path: "/manifest-packages/view/:id" },
                    { label: "Edit Package", path: "/manifest-packages/edit/:id" },
                    { label: "Search", path: "/manifest-packages/search" },
                ]},
                { label: "Gatepass", path: "/gatepass", icon: "🚪", children: [
                    { label: "Gatepass List", path: "/gatepass" },
                    { label: "Create Gatepass", path: "/gatepass/create" },
                    { label: "View Gatepass", path: "/gatepass/view/:id" },
                    { label: "Edit Gatepass", path: "/gatepass/edit/:id" },
                    { label: "Search", path: "/gatepass/search" },
                ]},
                { label: "Warehouses", path: "/warehouses", icon: "🏭", children: [
                    { label: "Warehouse List", path: "/warehouses" },
                    { label: "Create Warehouse", path: "/warehouses/create" },
                    { label: "View Warehouse", path: "/warehouses/view/:id" },
                    { label: "Edit Warehouse", path: "/warehouses/edit/:id" },
                ]},
                { label: "Warehouse Locations", path: "/warehouse-locations", icon: "📍", children: [
                    { label: "Location List", path: "/warehouse-locations" },
                    { label: "Create Location", path: "/warehouse-locations/create" },
                    { label: "View Location", path: "/warehouse-locations/view/:id" },
                    { label: "Edit Location", path: "/warehouse-locations/edit/:id" },
                ]},
                { label: "Stock Ledger", path: "/stock-ledger", icon: "📒", children: [
                    { label: "Ledger List", path: "/stock-ledger" },
                    { label: "Create Entry", path: "/stock-ledger/create" },
                    { label: "View Entry", path: "/stock-ledger/view/:id" },
                    { label: "Edit Entry", path: "/stock-ledger/edit/:id" },
                    { label: "Search", path: "/stock-ledger/search" },
                    { label: "Filters", path: "/stock-ledger/filters" },
                ]},
                { label: "Stock Movements", path: "/stock-movements", icon: "🔀", children: [
                    { label: "Movement List", path: "/stock-movements" },
                    { label: "Create Movement", path: "/stock-movements/create" },
                    { label: "View Movement", path: "/stock-movements/view/:id" },
                    { label: "Edit Movement", path: "/stock-movements/edit/:id" },
                    { label: "Search", path: "/stock-movements/search" },
                    { label: "Filters", path: "/stock-movements/filters" },
                    { label: "Statistics", path: "/stock-movements/statistics" },
                ]},
                { label: "Stock Transfers", path: "/stock-transfers", icon: "↔", children: [
                    { label: "Transfer List", path: "/stock-transfers" },
                    { label: "Create Transfer", path: "/stock-transfers/create" },
                    { label: "View Transfer", path: "/stock-transfers/view/:id" },
                    { label: "Edit Transfer", path: "/stock-transfers/edit/:id" },
                    { label: "Search", path: "/stock-transfers/search" },
                    { label: "Filters", path: "/stock-transfers/filters" },
                    { label: "Statistics", path: "/stock-transfers/statistics" },
                ]},
                { label: "Stock Adjustments", path: "/stock-adjustments", icon: "⚖", children: [
                    { label: "Adjustment List", path: "/stock-adjustments" },
                    { label: "Create Adjustment", path: "/stock-adjustments/create" },
                    { label: "View Adjustment", path: "/stock-adjustments/view/:id" },
                    { label: "Edit Adjustment", path: "/stock-adjustments/edit/:id" },
                    { label: "Search", path: "/stock-adjustments/search" },
                    { label: "Statistics", path: "/stock-adjustments/statistics" },
                ]},
                { label: "Inventory Adjustments", path: "/inventory-adjustments", icon: "📊", children: [
                    { label: "Adjustment List", path: "/inventory-adjustments" },
                    { label: "Create Adjustment", path: "/inventory-adjustments/create" },
                    { label: "View Adjustment", path: "/inventory-adjustments/view/:id" },
                    { label: "Edit Adjustment", path: "/inventory-adjustments/edit/:id" },
                    { label: "Search", path: "/inventory-adjustments/search" },
                    { label: "Statistics", path: "/inventory-adjustments/statistics" },
                ]},
            ],
        },
        {
            section: "Procurement & Receiving",
            items: [
                { label: "Purchase Orders", path: "/purchase-orders", icon: "📑", children: [
                    { label: "Order List", path: "/purchase-orders" },
                    { label: "Create Order", path: "/purchase-orders/create" },
                    { label: "View Order", path: "/purchase-orders/view/:id" },
                    { label: "Edit Order", path: "/purchase-orders/edit/:id" },
                ]},
                { label: "Purchase Order Items", path: "/purchase-order-items", icon: "📝", children: [
                    { label: "Item List", path: "/purchase-order-items" },
                    { label: "Create Item", path: "/purchase-order-items/create" },
                    { label: "View Item", path: "/purchase-order-items/view/:id" },
                    { label: "Edit Item", path: "/purchase-order-items/edit/:id" },
                ]},
                { label: "Purchase Returns", path: "/purchase-returns", icon: "↩", children: [
                    { label: "Return List", path: "/purchase-returns" },
                    { label: "Create Return", path: "/purchase-returns/create" },
                    { label: "View Return", path: "/purchase-returns/view/:id" },
                    { label: "Edit Return", path: "/purchase-returns/edit/:id" },
                ]},
                { label: "Goods Receipt Notes", path: "/goods-receipt-notes", icon: "📥", children: [
                    { label: "GRN List", path: "/goods-receipt-notes" },
                    { label: "Create GRN", path: "/goods-receipt-notes/create" },
                    { label: "View GRN", path: "/goods-receipt-notes/view/:id" },
                    { label: "Edit GRN", path: "/goods-receipt-notes/edit/:id" },
                    { label: "Search", path: "/goods-receipt-notes/search" },
                    { label: "Statistics", path: "/goods-receipt-notes/statistics" },
                ]},
                { label: "Goods Receipt Items", path: "/goods-receipt-note-items", icon: "📦", children: [
                    { label: "Item List", path: "/goods-receipt-note-items" },
                    { label: "Create Item", path: "/goods-receipt-note-items/create" },
                    { label: "View Item", path: "/goods-receipt-note-items/view/:id" },
                    { label: "Edit Item", path: "/goods-receipt-note-items/edit/:id" },
                    { label: "Search", path: "/goods-receipt-note-items/search" },
                    { label: "Filters", path: "/goods-receipt-note-items/filters" },
                    { label: "Statistics", path: "/goods-receipt-note-items/statistics" },
                ]},
                { label: "Putaway", path: "/putaway", icon: "📥", children: [
                    { label: "Putaway List", path: "/putaway" },
                    { label: "Create Putaway", path: "/putaway/create" },
                    { label: "View Putaway", path: "/putaway/view/:id" },
                    { label: "Edit Putaway", path: "/putaway/edit/:id" },
                    { label: "Search", path: "/putaway/search" },
                    { label: "Statistics", path: "/putaway/statistics" },
                ]},
                { label: "Suppliers", path: "/suppliers", icon: "🏢", children: [
                    { label: "Supplier List", path: "/suppliers" },
                    { label: "Create Supplier", path: "/suppliers/create" },
                    { label: "View Supplier", path: "/suppliers/view/:id" },
                    { label: "Edit Supplier", path: "/suppliers/edit/:id" },
                ]},
            ],
        },
        {
            section: "Customers",
            items: [
                { label: "Customer Addresses", path: "/customer-addresses", icon: "📍", children: [
                    { label: "Address List", path: "/customer-addresses" },
                    { label: "Create Address", path: "/customer-addresses/create" },
                    { label: "View Address", path: "/customer-addresses/view/:id" },
                    { label: "Edit Address", path: "/customer-addresses/edit/:id" },
                    { label: "Search", path: "/customer-addresses/search" },
                    { label: "Statistics", path: "/customer-addresses/statistics" },
                ]},
                { label: "Customer Payments", path: "/customer-payments", icon: "💳", children: [
                    { label: "Payment List", path: "/customer-payments" },
                    { label: "Create Payment", path: "/customer-payments/create" },
                    { label: "View Payment", path: "/customer-payments/view/:id" },
                    { label: "Edit Payment", path: "/customer-payments/edit/:id" },
                    { label: "Search", path: "/customer-payments/search" },
                    { label: "Statistics", path: "/customer-payments/statistics" },
                ]},
                { label: "Customer Returns", path: "/customer-returns", icon: "🔄", children: [
                    { label: "Return List", path: "/customer-returns" },
                    { label: "Create Return", path: "/customer-returns/create" },
                    { label: "View Return", path: "/customer-returns/view/:id" },
                    { label: "Edit Return", path: "/customer-returns/edit/:id" },
                    { label: "Search", path: "/customer-returns/search" },
                    { label: "Statistics", path: "/customer-returns/statistics" },
                ]},
                { label: "Wishlists", path: "/wishlists", icon: "❤", children: [
                    { label: "Wishlist List", path: "/wishlists" },
                    { label: "Create Wishlist", path: "/wishlists/create" },
                    { label: "View Wishlist", path: "/wishlists/view/:id" },
                    { label: "Edit Wishlist", path: "/wishlists/edit/:id" },
                    { label: "Search", path: "/wishlists/search" },
                    { label: "Statistics", path: "/wishlists/statistics" },
                ]},
                { label: "Wishlist Items", path: "/wishlist-items", icon: "🛍", children: [
                    { label: "Item List", path: "/wishlist-items" },
                    { label: "Create Item", path: "/wishlist-items/create" },
                    { label: "View Item", path: "/wishlist-items/view/:id" },
                    { label: "Edit Item", path: "/wishlist-items/edit/:id" },
                ]},
            ],
        },
        {
            section: "Marketplace",
            items: [
                { label: "Marketplaces", path: "/marketplaces", icon: "🌐", children: [
                    { label: "Marketplace List", path: "/marketplaces" },
                    { label: "Create Marketplace", path: "/marketplaces/create" },
                    { label: "View Marketplace", path: "/marketplaces/view/:id" },
                    { label: "Edit Marketplace", path: "/marketplaces/edit/:id" },
                    { label: "Search", path: "/marketplaces/search" },
                ]},
                { label: "Marketplace Returns", path: "/marketplace-returns", icon: "↩", children: [
                    { label: "Return List", path: "/marketplace-returns" },
                    { label: "Create Return", path: "/marketplace-returns/create" },
                    { label: "View Return", path: "/marketplace-returns/view/:id" },
                    { label: "Edit Return", path: "/marketplace-returns/edit/:id" },
                    { label: "Search", path: "/marketplace-returns/search" },
                    { label: "Statistics", path: "/marketplace-returns/statistics" },
                ]},
            ],
        },
        {
            section: "Sales & Finance",
            items: [
                { label: "Sales Invoices", path: "/sales-invoices", icon: "🧾", children: [
                    { label: "Invoice List", path: "/sales-invoices" },
                    { label: "Create Invoice", path: "/sales-invoices/create" },
                    { label: "View Invoice", path: "/sales-invoices/view/:id" },
                    { label: "Edit Invoice", path: "/sales-invoices/edit/:id" },
                    { label: "Search", path: "/sales-invoices/search" },
                ]},
                { label: "Payments", path: "/payments", icon: "💳", children: [
                    { label: "Payment List", path: "/payments" },
                    { label: "Create Payment", path: "/payments/create" },
                    { label: "View Payment", path: "/payments/view/:id" },
                    { label: "Edit Payment", path: "/payments/edit/:id" },
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
                    { label: "View E-Invoice", path: "/einvoices/view/:id" },
                    { label: "Edit E-Invoice", path: "/einvoices/edit/:id" },
                    { label: "Search", path: "/einvoices/search" },
                    { label: "Filters", path: "/einvoices/filters" },
                    { label: "Statistics", path: "/einvoices/statistics" },
                ]},
                { label: "E-Way Bills", path: "/ewaybills", icon: "🛣", children: [
                    { label: "E-Way Bill List", path: "/ewaybills" },
                    { label: "Create E-Way Bill", path: "/ewaybills/create" },
                    { label: "View E-Way Bill", path: "/ewaybills/view/:id" },
                    { label: "Edit E-Way Bill", path: "/ewaybills/edit/:id" },
                    { label: "Search", path: "/ewaybills/search" },
                    { label: "Filters", path: "/ewaybills/filters" },
                    { label: "Statistics", path: "/ewaybills/statistics" },
                ]},
                { label: "Invoice Tax Details", path: "/invoice-tax-details", icon: "💸", children: [
                    { label: "Tax Detail List", path: "/invoice-tax-details" },
                    { label: "Create Tax Detail", path: "/invoice-tax-details/create" },
                    { label: "View Tax Detail", path: "/invoice-tax-details/view/:id" },
                    { label: "Edit Tax Detail", path: "/invoice-tax-details/edit/:id" },
                    { label: "Search", path: "/invoice-tax-details/search" },
                    { label: "Statistics", path: "/invoice-tax-details/statistics" },
                ]},
            ],
        },
        {
            section: "Fulfillment & Warehousing",
            items: [
                { label: "Shelfwise Inventories", path: "/shelfwise-inventories", icon: "🗄", children: [
                    { label: "Inventory List", path: "/shelfwise-inventories" },
                    { label: "Create Entry", path: "/shelfwise-inventories/create" },
                    { label: "View Entry", path: "/shelfwise-inventories/view/:id" },
                    { label: "Edit Entry", path: "/shelfwise-inventories/edit/:id" },
                    { label: "Search", path: "/shelfwise-inventories/search" },
                    { label: "Filters", path: "/shelfwise-inventories/filters" },
                    { label: "Statistics", path: "/shelfwise-inventories/statistics" },
                ]},
            ],
        },
        {
            section: "Reverse Logistics",
            items: [
                { label: "Reverse Pickups", path: "/reverse-pickups", icon: "↩", children: [
                    { label: "Pickup List", path: "/reverse-pickups" },
                    { label: "Create Pickup", path: "/reverse-pickups/create" },
                    { label: "View Pickup", path: "/reverse-pickups/view/:id" },
                    { label: "Edit Pickup", path: "/reverse-pickups/edit/:id" },
                    { label: "Search", path: "/reverse-pickups/search" },
                    { label: "Filters", path: "/reverse-pickups/filters" },
                    { label: "Statistics", path: "/reverse-pickups/statistics" },
                ]},
                { label: "Reverse Pickup Addresses", path: "/reverse-pickup-addresses", icon: "📍", children: [
                    { label: "Address List", path: "/reverse-pickup-addresses" },
                    { label: "Create Address", path: "/reverse-pickup-addresses/create" },
                    { label: "View Address", path: "/reverse-pickup-addresses/view/:id" },
                    { label: "Edit Address", path: "/reverse-pickup-addresses/edit/:id" },
                    { label: "Search", path: "/reverse-pickup-addresses/search" },
                    { label: "Filters", path: "/reverse-pickup-addresses/filters" },
                    { label: "Statistics", path: "/reverse-pickup-addresses/statistics" },
                ]},
                { label: "Reverse Pickup Items", path: "/reverse-pickup-items", icon: "📦", children: [
                    { label: "Item List", path: "/reverse-pickup-items" },
                    { label: "Create Item", path: "/reverse-pickup-items/create" },
                    { label: "View Item", path: "/reverse-pickup-items/view/:id" },
                    { label: "Edit Item", path: "/reverse-pickup-items/edit/:id" },
                    { label: "Search", path: "/reverse-pickup-items/search" },
                    { label: "Filters", path: "/reverse-pickup-items/filters" },
                ]},
            ],
        },
        {
            section: "Supplier Extended",
            items: [
                { label: "Supplier Addresses", path: "/supplier-addresses", icon: "🏠", children: [
                    { label: "Address List", path: "/supplier-addresses" },
                    { label: "Create Address", path: "/supplier-addresses/create" },
                    { label: "View Address", path: "/supplier-addresses/view/:id" },
                    { label: "Edit Address", path: "/supplier-addresses/edit/:id" },
                    { label: "Search", path: "/supplier-addresses/search" },
                    { label: "Statistics", path: "/supplier-addresses/statistics" },
                ]},
                { label: "Supplier Contacts", path: "/supplier-contacts", icon: "📞", children: [
                    { label: "Contact List", path: "/supplier-contacts" },
                    { label: "Create Contact", path: "/supplier-contacts/create" },
                    { label: "View Contact", path: "/supplier-contacts/view/:id" },
                    { label: "Edit Contact", path: "/supplier-contacts/edit/:id" },
                    { label: "Search", path: "/supplier-contacts/search" },
                    { label: "Filters", path: "/supplier-contacts/filters" },
                ]},
                { label: "Suppliers", path: "/suppliers", icon: "🏢", children: [
                    { label: "Supplier List", path: "/suppliers" },
                    { label: "Create Supplier", path: "/suppliers/create" },
                    { label: "View Supplier", path: "/suppliers/view/:id" },
                    { label: "Edit Supplier", path: "/suppliers/edit/:id" },
                ]},
            ],
        },
        {
            section: "Channel & Export",
            items: [
                { label: "Facility Channels", path: "/facility-channels", icon: "🔗", children: [
                    { label: "Channel List", path: "/facility-channels" },
                    { label: "Create Channel", path: "/facility-channels/create" },
                    { label: "View Channel", path: "/facility-channels/view/:id" },
                    { label: "Edit Channel", path: "/facility-channels/edit/:id" },
                    { label: "Search", path: "/facility-channels/search" },
                    { label: "Filters", path: "/facility-channels/filters" },
                ]},
                { label: "Export Jobs", path: "/export-jobs", icon: "📤", children: [
                    { label: "Job List", path: "/export-jobs" },
                    { label: "Create Job", path: "/export-jobs/create" },
                    { label: "View Job", path: "/export-jobs/view/:id" },
                    { label: "Edit Job", path: "/export-jobs/edit/:id" },
                    { label: "Search", path: "/export-jobs/search" },
                    { label: "Statistics", path: "/export-jobs/statistics" },
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