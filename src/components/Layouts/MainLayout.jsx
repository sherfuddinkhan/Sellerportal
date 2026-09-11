// =========================================================
// MainLayout.jsx
// =========================================================

import React, { useState } from "react";

import {
    Link,
    NavLink,
    Outlet,
    useNavigate,
} from "react-router-dom";

// =========================================================
// MAIN LAYOUT
// =========================================================

const MainLayout = () => {

    const navigate = useNavigate();

    // =========================================================
    // SECTION STATE
    // =========================================================

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
    });

    // =========================================================
    // ITEM STATE
    // =========================================================

    const [openItems, setOpenItems] = useState({});

    // =========================================================
    // TOGGLE SECTION
    // =========================================================

    const toggleSection = (sectionName) => {

        setOpenSections((previous) => ({
            ...previous,
            [sectionName]: !previous[sectionName],
        }));

    };

    // =========================================================
    // TOGGLE ITEM
    // =========================================================

    const toggleItem = (itemLabel) => {

        setOpenItems((previous) => ({
            ...previous,
            [itemLabel]: !previous[itemLabel],
        }));

    };

    // =========================================================
    // OPEN ITEM
    // =========================================================

    const openItem = (itemLabel) => {

        setOpenItems((previous) => ({
            ...previous,
            [itemLabel]: true,
        }));

    };

    // =========================================================
    // HANDLE PARENT ITEM CLICK
    //
    // Parent:
    // 1. Navigate to item.path
    // 2. Open children
    //
    // Arrow:
    // Only toggles children.
    // =========================================================

    const handleItemClick = (item) => {

        if (!item) {
            return;
        }

        if (item.path && item.path !== "#") {
            navigate(item.path);
        }

        if (
            Array.isArray(item.children) &&
            item.children.length > 0
        ) {
            openItem(item.label);
        }

    };

    // =========================================================
    // HANDLE CHILD CLICK
    // =========================================================

    const handleChildClick = (item, child) => {

        if (!child || !child.path) {
            return;
        }

        // Keep parent expanded
        if (item?.label) {
            openItem(item.label);
        }

        navigate(child.path);

    };

    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        navigate("/login", {
            replace: true,
        });

    };

    // =========================================================
    // MENU SECTIONS
    // =========================================================

    const menuSections = [

        // =====================================================
        // MAIN
        // =====================================================

        {
            section: "Main",

            items: [

                {
                    label: "Dashboard",
                    path: "/dashboard",
                    icon: "🏠",
                },

                {
                    label: "Profile",
                    path: "/profile",
                    icon: "👤",

                    children: [
                        {
                            label: "User Profile",
                            path: "/profile",
                        },
                        {
                            label: "Profile Card",
                            path: "/profile/card",
                        },
                    ],
                },

                {
                    label: "Notifications",
                    path: "/notifications",
                    icon: "🔔",

                    children: [
                        {
                            label: "Notification List",
                            path: "/notifications",
                        },
                        {
                            label: "Notification Settings",
                            path: "/notifications/settings",
                        },
                        {
                            label: "Notification View",
                            path: "/notifications/view/:id",
                        },
                    ],
                },

                {
                    label: "Reviews",
                    path: "/reviews",
                    icon: "⭐",

                    children: [
                        {
                            label: "Review List",
                            path: "/reviews",
                        },
                        {
                            label: "Create Review",
                            path: "/reviews/create",
                        },
                        {
                            label: "Review Filters",
                            path: "/reviews/filters",
                        },
                        {
                            label: "Search Reviews",
                            path: "/reviews/search",
                        },
                    ],
                },

            ],
        },

        // =====================================================
        // SELLER MANAGEMENT
        // =====================================================

        {
            section: "Seller Management",

            items: [

                {
                    label: "Sellers",
                    path: "/sellers",
                    icon: "🏪",

                    children: [
                        {
                            label: "Seller List",
                            path: "/sellers",
                        },
                        {
                            label: "Create Seller",
                            path: "/sellers/create",
                        },
                        {
                            label: "Seller Filters",
                            path: "/sellers/filters",
                        },
                        {
                            label: "Search Sellers",
                            path: "/sellers/search",
                        },
                    ],
                },

                {
                    label: "Seller Customers",
                    path: "/seller-customers",
                    icon: "👥",

                    children: [
                        {
                            label: "Customer List",
                            path: "/seller-customers",
                        },
                        {
                            label: "Create Customer",
                            path: "/seller-customers/create",
                        },
                        {
                            label: "Customer Filters",
                            path: "/seller-customers/filters",
                        },
                        {
                            label: "Search Customers",
                            path: "/seller-customers/search",
                        },
                        {
                            label: "Customer Statistics",
                            path: "/seller-customers/statistics",
                        },
                    ],
                },

            ],
        },

        // =====================================================
        // CATALOG & PRODUCTS
        // =====================================================

        {
            section: "Catalog & Products",

            items: [

                {
                    label: "Catalog",
                    path: "/catalog",
                    icon: "📚",

                    children: [
                        {
                            label: "Catalog List",
                            path: "/catalog",
                        },
                        {
                            label: "Create Catalog",
                            path: "/catalog/create",
                        },
                        {
                            label: "Search",
                            path: "/catalog/search",
                        },
                        {
                            label: "Latest Products",
                            path: "/catalog/latest",
                        },
                        {
                            label: "Featured Products",
                            path: "/catalog/featured",
                        },
                        {
                            label: "Top Rated",
                            path: "/catalog/toprated",
                        },
                        {
                            label: "Best Sellers",
                            path: "/catalog/bestsellers",
                        },
                    ],
                },

                {
                    label: "Brands",
                    path: "/brands",
                    icon: "🏷️",

                    children: [
                        {
                            label: "Brand List",
                            path: "/brands",
                        },
                        {
                            label: "Create Brand",
                            path: "/brands/create",
                        },
                        {
                            label: "Brand Filters",
                            path: "/brands/filters",
                        },
                        {
                            label: "Search Brands",
                            path: "/brands/search",
                        },
                    ],
                },

                {
                    label: "Categories",
                    path: "/categories",
                    icon: "🗂️",

                    children: [
                        {
                            label: "Category List",
                            path: "/categories",
                        },
                        {
                            label: "Create Category",
                            path: "/categories/create",
                        },
                        {
                            label: "Category Filters",
                            path: "/categories/filters",
                        },
                        {
                            label: "Search Categories",
                            path: "/categories/search",
                        },
                    ],
                },

                {
                    label: "Product Types",
                    path: "/product-types",
                    icon: "🧩",

                    children: [
                        {
                            label: "Product Type List",
                            path: "/product-types",
                        },
                        {
                            label: "Create Product Type",
                            path: "/product-types/create",
                        },
                        {
                            label: "Product Type Filters",
                            path: "/product-types/filters",
                        },
                        {
                            label: "Search Product Types",
                            path: "/product-types/search",
                        },
                    ],
                },

                {
                    label: "Product Attributes",
                    path: "/product-attributes",
                    icon: "🏷️",

                    children: [
                        {
                            label: "Product Attribute List",
                            path: "/product-attributes",
                        },
                        {
                            label: "Create Product Attribute",
                            path: "/product-attributes/create",
                        },
                        {
                            label: "Product Attribute Filters",
                            path: "/product-attributes/filters",
                        },
                        {
                            label: "Search Product Attributes",
                            path: "/product-attributes/search",
                        },
                    ],
                },

                {
                    label: "Product Images",
                    path: "/product-images",
                    icon: "🖼️",

                    children: [
                        {
                            label: "Product Image List",
                            path: "/product-images",
                        },
                        {
                            label: "Create Product Image",
                            path: "/product-images/create",
                        },
                        {
                            label: "Search Product Images",
                            path: "/product-images/search",
                        },
                        {
                            label: "Product Image Statistics",
                            path: "/product-images/statistics",
                        },
                    ],
                },

                {
                    label: "Product Prices",
                    path: "/product-prices",
                    icon: "💰",

                    children: [
                        {
                            label: "Product Price List",
                            path: "/product-prices",
                        },
                        {
                            label: "Create Product Price",
                            path: "/product-prices/create",
                        },
                        {
                            label: "Search Product Prices",
                            path: "/product-prices/search",
                        },
                        {
                            label: "Product Price Filters",
                            path: "/product-prices/filters",
                        },
                        {
                            label: "Product Price Statistics",
                            path: "/product-prices/statistics",
                        },
                    ],
                },

                {
                    label: "Products",
                    path: "/products/list",
                    icon: "📦",

                    children: [
                        {
                            label: "Product List",
                            path: "/products/list",
                        },
                        {
                            label: "Create Product",
                            path: "/products/create",
                        },
                        {
                            label: "Product Filters",
                            path: "/products/filters",
                        },
                        {
                            label: "Search Products",
                            path: "/products/search",
                        },
                        {
                            label: "Product Statistics",
                            path: "/products/statistics",
                        },
                    ],
                },

                {
                    label: "Product Inventory",
                    path: "/product-inventory",
                    icon: "📦",

                    children: [
                        {
                            label: "Inventory List",
                            path: "/product-inventory",
                        },
                        {
                            label: "Create Inventory",
                            path: "/product-inventory/create",
                        },
                        {
                            label: "Inventory Filters",
                            path: "/product-inventory/filters",
                        },
                        {
                            label: "Search Inventory",
                            path: "/product-inventory/search",
                        },
                        {
                            label: "Inventory Statistics",
                            path: "/product-inventory/statistics",
                        },
                    ],
                },

            ],
        },

        // =====================================================
        // ORDERS
        // =====================================================

        {
            section: "Orders",

            items: [

                {
                    label: "Sales Orders",
                    path: "/sales-orders",
                    icon: "🛒",

                    children: [
                        {
                            label: "Sales Order List",
                            path: "/sales-orders",
                        },
                        {
                            label: "Create Sales Order",
                            path: "/sales-orders/create",
                        },
                        {
                            label: "Search",
                            path: "/sales-orders/search",
                        },
                        {
                            label: "Statistics",
                            path: "/sales-orders/statistics",
                        },
                    ],
                },

                {
                    label: "Sales Order Items",
                    path: "/sales-order-items",
                    icon: "📝",

                    children: [
                        {
                            label: "Item List",
                            path: "/sales-order-items",
                        },
                        {
                            label: "Create Item",
                            path: "/sales-order-items/create",
                        },
                        {
                            label: "Search",
                            path: "/sales-order-items/search",
                        },
                        {
                            label: "Statistics",
                            path: "/sales-order-items/statistics",
                        },
                    ],
                },

                {
                    label: "Order Items",
                    path: "/order-items",
                    icon: "📦",

                    children: [
                        {
                            label: "Order Item List",
                            path: "/order-items",
                        },
                        {
                            label: "Create Item",
                            path: "/order-items/create",
                        },
                        {
                            label: "Search",
                            path: "/order-items/search",
                        },
                        {
                            label: "Statistics",
                            path: "/order-items/statistics",
                        },
                    ],
                },

                {
                    label: "Order Status History",
                    path: "/order-status-history",
                    icon: "📜",

                    children: [
                        {
                            label: "Status History List",
                            path: "/order-status-history",
                        },
                        {
                            label: "Create History",
                            path: "/order-status-history/create",
                        },
                        {
                            label: "Search",
                            path: "/order-status-history/search",
                        },
                    ],
                },

            ],
        },

        // =====================================================
        // DELIVERY & LOGISTICS
        // =====================================================

        {
            section: "Delivery & Logistics",

            items: [

                {
                    label: "Delivery Challans",
                    path: "/delivery-challans",
                    icon: "📋",

                    children: [
                        {
                            label: "Challan List",
                            path: "/delivery-challans",
                        },
                        {
                            label: "Create Challan",
                            path: "/delivery-challans/create",
                        },
                        {
                            label: "Search",
                            path: "/delivery-challans/search",
                        },
                        {
                            label: "Statistics",
                            path: "/delivery-challans/statistics",
                        },
                    ],
                },

                {
                    label: "Delivery Challan Items",
                    path: "/delivery-challan-items",
                    icon: "📄",

                    children: [
                        {
                            label: "Item List",
                            path: "/delivery-challan-items",
                        },
                        {
                            label: "Create Item",
                            path: "/delivery-challan-items/create",
                        },
                        {
                            label: "Search",
                            path: "/delivery-challan-items/search",
                        },
                        {
                            label: "Statistics",
                            path: "/delivery-challan-items/statistics",
                        },
                    ],
                },

                {
                    label: "Shipments",
                    path: "/shipments",
                    icon: "🚚",

                    children: [
                        {
                            label: "Shipment List",
                            path: "/shipments",
                        },
                        {
                            label: "Search",
                            path: "/shipments/search",
                        },
                    ],
                },

                {
                    label: "Warehouses",
                    path: "/warehouses",
                    icon: "🏭",

                    children: [
                        {
                            label: "Warehouse List",
                            path: "/warehouses",
                        },
                        {
                            label: "Create Warehouse",
                            path: "/warehouses/create",
                        },  
                    ],
                },

                {
                    label: "Warehouse Locations",
                    path: "/warehouse-locations",
                    icon: "📍",

                    children: [
                        {
                            label: "Location List",
                            path: "/warehouse-locations",
                        },
                        {
                            label: "Create Location",
                            path: "/warehouse-locations/create",
                        },
                      
                    ],
                },

                // =================================================
                // STOCK LEDGER
                // =================================================

                {
                    label: "Stock Ledger",
                    path: "/stock-ledger",
                    icon: "📒",

                    children: [
                        {
                            label: "Stock Ledger List",
                            path: "/stock-ledger",
                        },
                        {
                            label: "Create Stock Ledger",
                            path: "/stock-ledger/create",
                        },
                        {
                            label: "Search Stock Ledger",
                            path: "/stock-ledger/search",
                        },
                        {
                            label: "Stock Ledger Filters",
                            path: "/stock-ledger/filters",
                        },
                    ],
                },

                // =================================================
                // STOCK MOVEMENTS
                // =================================================

                {
                    label: "Stock Movements",
                    path: "/stock-movements",
                    icon: "🔀",

                    children: [
                        {
                            label: "Movement List",
                            path: "/stock-movements",
                        },
                        {
                            label: "Create Movement",
                            path: "/stock-movements/create",
                        },
                        {
                            label: "Movement Details",
                            path: "/stock-movements/details/:id",
                        },
                        {
                            label: "Search",
                            path: "/stock-movements/search",
                        },
                        {
                            label: "Filters",
                            path: "/stock-movements/filters",
                        },
                        {
                            label: "Statistics",
                            path: "/stock-movements/statistics",
                        },
                    ],
                },

                // =================================================
                // STOCK TRANSFERS
                // =================================================

                {
                    label: "Stock Transfers",
                    path: "/stock-transfers",
                    icon: "↔️",

                    children: [
                        {
                            label: "Transfer List",
                            path: "/stock-transfers",
                        },
                        {
                            label: "Create Transfer",
                            path: "/stock-transfers/create",
                        },
                        {
                            label: "Search",
                            path: "/stock-transfers/search",
                        },
                        {
                            label: "Filters",
                            path: "/stock-transfers/filters",
                        },
                        {
                            label: "Statistics",
                            path: "/stock-transfers/statistics",
                        },
                    ],
                },

                // =================================================
                // STOCK ADJUSTMENTS
                // =================================================

                {
                    label: "Stock Adjustments",
                    path: "/stock-adjustments",
                    icon: "⚖️",

                    children: [
                        {
                            label: "Adjustment List",
                            path: "/stock-adjustments",
                        },
                        {
                            label: "Create Adjustment",
                            path: "/stock-adjustments/create",
                        },
                        {
                            label: "Search",
                            path: "/stock-adjustments/search",
                        },
                        {
                            label: "Statistics",
                            path: "/stock-adjustments/statistics",
                        },
                    ],
                },

            ],
        },

        // =====================================================
        // PROCUREMENT & RECEIVING
        // =====================================================

        {
            section: "Procurement & Receiving",

            items: [

                {
                    label: "Purchase Orders",
                    path: "/purchase-orders",
                    icon: "📑",

                    children: [
                        {
                            label: "Purchase Order List",
                            path: "/purchase-orders",
                        },
                        {
                            label: "Create Purchase Order",
                            path: "/purchase-orders/create",
                        },
                        {
                            label: "Search",
                            path: "/purchase-orders/search",
                        },
                        {
                            label: "Statistics",
                            path: "/purchase-orders/statistics",
                        },
                    ],
                },

                {
                    label: "Purchase Order Items",
                    path: "/purchase-order-items",
                    icon: "📝",

                    children: [
                        {
                            label: "Item List",
                            path: "/purchase-order-items",
                        },
                        {
                            label: "Create Item",
                            path: "/purchase-order-items/create",
                        },
                        {
                            label: "Search",
                            path: "/purchase-order-items/search",
                        },
                        {
                            label: "Statistics",
                            path: "/purchase-order-items/statistics",
                        },
                    ],
                },

                {
                    label: "Purchase Returns",
                    path: "/purchase-returns",
                    icon: "↩️",

                    children: [
                        {
                            label: "Return List",
                            path: "/purchase-returns",
                        },
                        {
                            label: "Create Return",
                            path: "/purchase-returns/create",
                        },
                        {
                            label: "Search",
                            path: "/purchase-returns/search",
                        },
                        {
                            label: "Statistics",
                            path: "/purchase-returns/statistics",
                        },
                    ],
                },

                {
                    label: "Goods Receipt Notes",
                    path: "/goods-receipt-notes",
                    icon: "📥",

                    children: [
                        {
                            label: "GRN List",
                            path: "/goods-receipt-notes",
                        },
                        {
                            label: "Create GRN",
                            path: "/goods-receipt-notes/create",
                        },
                        {
                            label: "Search",
                            path: "/goods-receipt-notes/search",
                        },
                        {
                            label: "Statistics",
                            path: "/goods-receipt-notes/statistics",
                        },
                    ],
                },

                {
                    label: "Goods Receipt Items",
                    path: "/goods-receipt-note-items",
                    icon: "📦",

                    children: [
                        {
                            label: "Item List",
                            path: "/goods-receipt-note-items",
                        },
                        {
                            label: "Create Item",
                            path: "/goods-receipt-note-items/create",
                        },
                        {
                            label: "Search",
                            path: "/goods-receipt-note-items/search",
                        },
                        {
                            label: "Filters",
                            path: "/goods-receipt-note-items/filters",
                        },
                        {
                            label: "Statistics",
                            path: "/goods-receipt-note-items/statistics",
                        },
                    ],
                },

                {
                    label: "Suppliers",
                    path: "/suppliers",
                    icon: "🏢",

                    children: [
                        {
                            label: "Supplier List",
                            path: "/suppliers",
                        },
                        {
                            label: "Create Supplier",
                            path: "/suppliers/create",
                        },
                        {
                            label: "Search",
                            path: "/suppliers/search",
                        },
                        {
                            label: "Filters",
                            path: "/suppliers/filters",
                        },
                        {
                            label: "Statistics",
                            path: "/suppliers/statistics",
                        },
                    ],
                },

            ],
        },

        // =====================================================
        // CUSTOMERS
        // =====================================================

        {
            section: "Customers",

            items: [

                {
                    label: "Customer Addresses",
                    path: "/customer-addresses",
                    icon: "📍",

                    children: [
                        {
                            label: "Address List",
                            path: "/customer-addresses",
                        },
                        {
                            label: "Create Address",
                            path: "/customer-addresses/create",
                        },
                        {
                            label: "Search",
                            path: "/customer-addresses/search",
                        },
                        {
                            label: "Statistics",
                            path: "/customer-addresses/statistics",
                        },
                    ],
                },

                {
                    label: "Customer Payments",
                    path: "/customer-payments",
                    icon: "💳",

                    children: [
                        {
                            label: "Payment List",
                            path: "/customer-payments",
                        },
                        {
                            label: "Create Payment",
                            path: "/customer-payments/create",
                        },
                        {
                            label: "Search",
                            path: "/customer-payments/search",
                        },
                        {
                            label: "Statistics",
                            path: "/customer-payments/statistics",
                        },
                    ],
                },

                {
                    label: "Customer Returns",
                    path: "/customer-returns",
                    icon: "🔄",

                    children: [
                        {
                            label: "Return List",
                            path: "/customer-returns",
                        },
                        {
                            label: "Create Return",
                            path: "/customer-returns/create",
                        },
                        {
                            label: "Search",
                            path: "/customer-returns/search",
                        },
                        {
                            label: "Statistics",
                            path: "/customer-returns/statistics",
                        },
                    ],
                },

                {
                    label: "Wishlists",
                    path: "/wishlists",
                    icon: "❤️",

                    children: [
                        {
                            label: "Wishlist List",
                            path: "/wishlists",
                        },
                        {
                            label: "Create Wishlist",
                            path: "/wishlists/create",
                        },
                        {
                            label: "Search",
                            path: "/wishlists/search",
                        },
                        {
                            label: "Statistics",
                            path: "/wishlists/statistics",
                        },
                    ],
                },

                {
                    label: "Wishlist Items",
                    path: "/wishlist-items",
                    icon: "🛍️",

                    children: [
                        {
                            label: "Wishlist Item List",
                            path: "/wishlist-items",
                        },
                        {
                            label: "Create Wishlist Item",
                            path: "/wishlist-items/create",
                        },
                        {
                            label: "Search",
                            path: "/wishlist-items/search",
                        },
                        {
                            label: "Statistics",
                            path: "/wishlist-items/statistics",
                        },
                    ],
                },

            ],
        },

        // =====================================================
        // MARKETPLACE
        // =====================================================

        {
            section: "Marketplace",

            items: [

                {
                    label: "Marketplaces",
                    path: "/marketplaces",
                    icon: "🌐",
                },

                {
                    label: "Marketplace Order Items",
                    path: "/marketplace-order-items",
                    icon: "🛍️",

                    children: [
                        {
                            label: "Order Item List",
                            path: "/marketplace-order-items",
                        },
                        {
                            label: "Create Item",
                            path: "/marketplace-order-items/create",
                        },
                        {
                            label: "Search",
                            path: "/marketplace-order-items/search",
                        },
                        {
                            label: "Statistics",
                            path: "/marketplace-order-items/statistics",
                        },
                    ],
                },

                {
                    label: "Marketplace Returns",
                    path: "/marketplace-returns",
                    icon: "↩️",

                    children: [
                        {
                            label: "Return List",
                            path: "/marketplace-returns",
                        },
                        {
                            label: "Create Return",
                            path: "/marketplace-returns/create",
                        },
                        {
                            label: "Search",
                            path: "/marketplace-returns/search",
                        },
                        {
                            label: "Statistics",
                            path: "/marketplace-returns/statistics",
                        },
                    ],
                },

            ],
        },

        // =====================================================
        // SALES & FINANCE
        // =====================================================

        {
            section: "Sales & Finance",

            items: [

                {
                    label: "Sales Invoices",
                    path: "/sales-invoices",
                    icon: "🧾",

                    children: [
                        {
                            label: "Invoice List",
                            path: "/sales-invoices",
                        },
                        {
                            label: "Create Invoice",
                            path: "/sales-invoices/create",
                        },
                        {
                            label: "Search",
                            path: "/sales-invoices/search",
                        },
                        {
                            label: "Statistics",
                            path: "/sales-invoices/statistics",
                        },
                    ],
                },

                {
                    label: "Payment Settings",
                    path: "/payments/settings",
                    icon: "⚙️",

                    children: [
                        {
                            label: "Payment Settings",
                            path: "/payments/settings",
                        },
                        {
                            label: "Bank Details",
                            path: "/payments/bank-details",
                        },
                        {
                            label: "Payment Gateway",
                            path: "/payments/gateway",
                        },
                        {
                            label: "UPI Settings",
                            path: "/payments/upi",
                        },
                    ],
                },

                {
                    label: "Reports",
                    path: "/reports",
                    icon: "📈",

                    children: [
                        {
                            label: "Reports Dashboard",
                            path: "/reports",
                        },
                        {
                            label: "Sales Report",
                            path: "/reports/sales",
                        },
                        {
                            label: "Order Report",
                            path: "/reports/orders",
                        },
                        {
                            label: "Inventory Report",
                            path: "/reports/inventory",
                        },
                        {
                            label: "Product Report",
                            path: "/reports/products",
                        },
                        {
                            label: "Customer Report",
                            path: "/reports/customers",
                        },
                        {
                            label: "Purchase Report",
                            path: "/reports/purchases",
                        },
                        {
                            label: "Stock Report",
                            path: "/reports/stock",
                        },
                    ],
                },

            ],
        },

    ];

    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                fontFamily: "Arial, sans-serif",
                backgroundColor: "#f8fafc",
            }}
        >

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside
                style={{
                    width: "280px",
                    backgroundColor: "#1e293b",
                    color: "#f8fafc",
                    display: "flex",
                    flexDirection: "column",
                    position: "fixed",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    overflow: "hidden",
                    zIndex: 100,
                    borderRight: "1px solid #334155",
                }}
            >

                {/* =================================================
                    LOGO
                ================================================= */}

                <div
                    style={{
                        height: "60px",
                        display: "flex",
                        alignItems: "center",
                        padding: "0 20px",
                        fontSize: "1.2rem",
                        fontWeight: "700",
                        borderBottom: "1px solid #334155",
                        color: "#38bdf8",
                        flexShrink: 0,
                    }}
                >
                    Seller Portal
                </div>

                {/* =================================================
                    NAVIGATION
                ================================================= */}

                <nav
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "10px 0",
                    }}
                >

                    {menuSections.map(
                        (group, groupIndex) => {

                            if (
                                !group ||
                                !Array.isArray(group.items)
                            ) {

                                console.error(
                                    "Invalid menu section:",
                                    group
                                );

                                return null;
                            }

                            const isGroupOpen =
                                openSections[group.section] !== false;

                            return (

                                <div
                                    key={`${group.section}-${groupIndex}`}
                                    style={{
                                        marginBottom: "10px",
                                    }}
                                >

                                    {/* =====================================
                                        SECTION HEADER
                                    ====================================== */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleSection(
                                                group.section
                                            )
                                        }
                                        style={{
                                            width: "100%",
                                            border: "none",
                                            background: "transparent",
                                            color: "#94a3b8",
                                            padding: "8px 20px",
                                            fontSize: "0.72rem",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.08em",
                                            fontWeight: "600",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            textAlign: "left",
                                        }}
                                    >

                                        <span>
                                            {group.section}
                                        </span>

                                        <span>
                                            {isGroupOpen
                                                ? "▲"
                                                : "▼"}
                                        </span>

                                    </button>

                                    {/* =====================================
                                        SECTION ITEMS
                                    ====================================== */}

                                    {isGroupOpen && (

                                        <div>

                                            {group.items.map(
                                                (
                                                    item,
                                                    itemIndex
                                                ) => {

                                                    if (!item) {
                                                        return null;
                                                    }

                                                    const hasChildren =
                                                        Array.isArray(
                                                            item.children
                                                        ) &&
                                                        item.children.length > 0;

                                                    const isItemOpen =
                                                        openItems[item.label] === true;

                                                    return (

                                                        <div
                                                            key={`${group.section}-${item.label}-${itemIndex}`}
                                                            style={{
                                                                width: "100%",
                                                            }}
                                                        >

                                                            {/* =================================
                                                                PARENT ROW
                                                            ================================== */}

                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    width: "100%",
                                                                }}
                                                            >

                                                                {/* =============================
                                                                    PARENT LINK
                                                                ============================== */}

                                                                <NavLink
                                                                    to={
                                                                        item.path ||
                                                                        "#"
                                                                    }
                                                                    end
                                                                    onClick={(event) => {

                                                                        if (
                                                                            !item.path ||
                                                                            item.path === "#"
                                                                        ) {
                                                                            event.preventDefault();
                                                                            return;
                                                                        }

                                                                        handleItemClick(
                                                                            item
                                                                        );

                                                                    }}
                                                                    style={({ isActive }) => ({

                                                                        flex: 1,

                                                                        display: "flex",

                                                                        alignItems: "center",

                                                                        gap: "10px",

                                                                        padding: "9px 20px",

                                                                        color: isActive
                                                                            ? "#ffffff"
                                                                            : "#cbd5e1",

                                                                        backgroundColor: isActive
                                                                            ? "#0284c7"
                                                                            : isItemOpen
                                                                                ? "#26364d"
                                                                                : "transparent",

                                                                        textDecoration: "none",

                                                                        fontSize: "0.88rem",

                                                                        cursor: "pointer",

                                                                        minWidth: 0,

                                                                    })}
                                                                >

                                                                    <span
                                                                        style={{
                                                                            width: "22px",
                                                                            minWidth: "22px",
                                                                            textAlign: "center",
                                                                        }}
                                                                    >
                                                                        {item.icon || "•"}
                                                                    </span>

                                                                    <span
                                                                        style={{
                                                                            overflow: "hidden",
                                                                            textOverflow: "ellipsis",
                                                                            whiteSpace: "nowrap",
                                                                        }}
                                                                    >
                                                                        {item.label}
                                                                    </span>

                                                                </NavLink>

                                                                {/* =============================
                                                                    EXPAND / COLLAPSE BUTTON
                                                                ============================== */}

                                                                {hasChildren && (

                                                                    <button
                                                                        type="button"
                                                                        aria-label={
                                                                            isItemOpen
                                                                                ? `Collapse ${item.label}`
                                                                                : `Expand ${item.label}`
                                                                        }
                                                                        onClick={(event) => {

                                                                            event.preventDefault();

                                                                            event.stopPropagation();

                                                                            toggleItem(
                                                                                item.label
                                                                            );

                                                                        }}
                                                                        style={{
                                                                            width: "42px",
                                                                            minWidth: "42px",
                                                                            height: "38px",
                                                                            border: "none",
                                                                            backgroundColor:
                                                                                isItemOpen
                                                                                    ? "#26364d"
                                                                                    : "transparent",
                                                                            color: "#cbd5e1",
                                                                            cursor: "pointer",
                                                                            fontSize: "10px",
                                                                        }}
                                                                    >

                                                                        {isItemOpen
                                                                            ? "▲"
                                                                            : "▼"}

                                                                    </button>

                                                                )}

                                                            </div>

                                                            {/* =================================
                                                                CHILDREN
                                                            ================================== */}

                                                            {hasChildren &&
                                                                isItemOpen && (

                                                                    <div
                                                                        style={{
                                                                            backgroundColor:
                                                                                "#172033",
                                                                            paddingBottom:
                                                                                "4px",
                                                                        }}
                                                                    >

                                                                        {item.children.map(
                                                                            (
                                                                                child,
                                                                                childIndex
                                                                            ) => {

                                                                                if (
                                                                                    !child ||
                                                                                    !child.path
                                                                                ) {
                                                                                    return null;
                                                                                }

                                                                                return (

                                                                                    <NavLink
                                                                                        key={`${item.label}-${child.path}-${childIndex}`}
                                                                                        to={child.path}
                                                                                        onClick={(event) => {

                                                                                            event.stopPropagation();

                                                                                            handleChildClick(
                                                                                                item,
                                                                                                child
                                                                                            );

                                                                                        }}
                                                                                        style={({ isActive }) => ({

                                                                                            display: "block",

                                                                                            width: "100%",

                                                                                            boxSizing: "border-box",

                                                                                            padding:
                                                                                                "7px 20px 7px 52px",

                                                                                            color: isActive
                                                                                                ? "#38bdf8"
                                                                                                : "#94a3b8",

                                                                                            backgroundColor: isActive
                                                                                                ? "#1e3a5f"
                                                                                                : "transparent",

                                                                                            textDecoration: "none",

                                                                                            fontSize: "0.82rem",

                                                                                        })}
                                                                                    >

                                                                                        {child.label}

                                                                                    </NavLink>

                                                                                );

                                                                            }
                                                                        )}

                                                                    </div>

                                                                )}

                                                        </div>

                                                    );

                                                }
                                            )}

                                        </div>

                                    )}

                                </div>

                            );

                        }
                    )}

                </nav>

                {/* =================================================
                    SIDEBAR FOOTER
                ================================================= */}

                <div
                    style={{
                        borderTop: "1px solid #334155",
                        padding: "12px",
                        flexShrink: 0,
                    }}
                >

                    <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                            width: "100%",
                            border: "none",
                            background: "#7f1d1d",
                            color: "#ffffff",
                            padding: "10px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "0.88rem",
                        }}
                    >
                        🚪 Logout
                    </button>

                </div>

            </aside>

            {/* =================================================
                MAIN AREA
            ================================================= */}

            <div
                style={{
                    flex: 1,
                    marginLeft: "280px",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <header
                    style={{
                        height: "60px",
                        backgroundColor: "#ffffff",
                        borderBottom: "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 25px",
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                    }}
                >

                    <div
                        style={{
                            fontWeight: "600",
                            color: "#334155",
                        }}
                    >
                        Seller Portal Control Panel
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                        }}
                    >

                        <Link
                            to="/profile"
                            style={{
                                textDecoration: "none",
                                color: "#64748b",
                                fontSize: "0.9rem",
                            }}
                        >
                            👤 Profile
                        </Link>

                        <button
                            type="button"
                            onClick={handleLogout}
                            style={{
                                border: "none",
                                background: "transparent",
                                color: "#ef4444",
                                cursor: "pointer",
                                fontSize: "0.9rem",
                            }}
                        >
                            Logout
                        </button>

                    </div>

                </header>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <main
                    style={{
                        flex: 1,
                        padding: "25px",
                        overflowY: "auto",
                    }}
                >

                    <Outlet />

                </main>

            </div>

        </div>

    );

};

export default MainLayout;
