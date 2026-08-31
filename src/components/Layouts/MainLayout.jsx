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
    // TOGGLE SECTION
    // =========================================================

    const toggleSection = (key) => {

        setOpenSections((previous) => ({
            ...previous,
            [key]: !previous[key],
        }));

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
    // MENU
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
                            label: "Notification Card",
                            path: "/notifications/card",
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
                            label: "Seller Details",
                            path: "/sellers/details/:id",
                        },
                        {
                            label: "Edit Seller",
                            path: "/sellers/edit/:id",
                        },
                        {
                            label: "Seller Filters",
                            path: "/sellers/filters",
                        },
                        {
                            label: "Search Sellers",
                            path: "/sellers/search",
                        },
                        {
                            label: "Seller Statistics",
                            path: "/sellers/statistics",
                        },
                        {
                            label: "Seller Table",
                            path: "/sellers/table",
                        },
                        {
                            label: "Seller Card",
                            path: "/sellers/card",
                        },
                        {
                            label: "Seller Form",
                            path: "/sellers/form",
                        },
                        {
                            label: "Seller Modal",
                            path: "/sellers/modal",
                        },
                        {
                            label: "Seller Pagination",
                            path: "/sellers/pagination",
                        },
                        {
                            label: "Seller Toolbar",
                            path: "/sellers/toolbar",
                        },
                        {
                            label: "Seller View",
                            path: "/sellers/view/:id",
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
                        {
                            label: "Brand Statistics",
                            path: "/brands/statistics",
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
                            label: "Category Details",
                            path: "/categories/details/:id",
                        },
                        {
                            label: "Edit Category",
                            path: "/categories/edit/:id",
                        },
                        {
                            label: "Category Filters",
                            path: "/categories/filters",
                        },
                        {
                            label: "Search Categories",
                            path: "/categories/search",
                        },
                        {
                            label: "Category Statistics",
                            path: "/categories/statistics",
                        },
                        {
                            label: "Category Table",
                            path: "/categories/table",
                        },
                        {
                            label: "Category Card",
                            path: "/categories/card",
                        },
                        {
                            label: "Category Form",
                            path: "/categories/form",
                        },
                        {
                            label: "Category Modal",
                            path: "/categories/modal",
                        },
                        {
                            label: "Category Pagination",
                            path: "/categories/pagination",
                        },
                        {
                            label: "Category Toolbar",
                            path: "/categories/toolbar",
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
                            label: "Product Type Details",
                            path: "/product-types/details/:id",
                        },
                        {
                            label: "Edit Product Type",
                            path: "/product-types/edit/:id",
                        },
                        {
                            label: "Product Type Filters",
                            path: "/product-types/filters",
                        },
                        {
                            label: "Search Product Types",
                            path: "/product-types/search",
                        },
                        {
                            label: "Product Type Statistics",
                            path: "/product-types/statistics",
                        },
                        {
                            label: "Product Type Table",
                            path: "/product-types/table",
                        },
                        {
                            label: "Product Type Card",
                            path: "/product-types/card",
                        },
                        {
                            label: "Product Type Form",
                            path: "/product-types/form",
                        },
                        {
                            label: "Product Type Modal",
                            path: "/product-types/modal",
                        },
                        {
                            label: "Product Type Pagination",
                            path: "/product-types/pagination",
                        },
                        {
                            label: "Product Type Toolbar",
                            path: "/product-types/toolbar",
                        },
                    ],
                },

                {
                    label: "Products",
                    path: "/products",
                    icon: "📦",

                    children: [
                        {
                            label: "Products Dashboard",
                            path: "/products",
                        },
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
                            label: "Search",
                            path: "/products/search",
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
                            label: "Card",
                            path: "/sales-orders/card",
                        },
                        {
                            label: "Details",
                            path: "/sales-orders/details/:id",
                        },
                        {
                            label: "Edit",
                            path: "/sales-orders/edit/:id",
                        },
                        {
                            label: "Modal",
                            path: "/sales-orders/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/sales-orders/pagination",
                        },
                        {
                            label: "Search",
                            path: "/sales-orders/search",
                        },
                        {
                            label: "Statistics",
                            path: "/sales-orders/statistics",
                        },
                        {
                            label: "Table",
                            path: "/sales-orders/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/sales-orders/toolbar",
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
                            label: "Card",
                            path: "/sales-order-items/card",
                        },
                        {
                            label: "Details",
                            path: "/sales-order-items/details/:id",
                        },
                        {
                            label: "Edit",
                            path: "/sales-order-items/edit/:id",
                        },
                        {
                            label: "Modal",
                            path: "/sales-order-items/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/sales-order-items/pagination",
                        },
                        {
                            label: "Search",
                            path: "/sales-order-items/search",
                        },
                        {
                            label: "Statistics",
                            path: "/sales-order-items/statistics",
                        },
                        {
                            label: "Table",
                            path: "/sales-order-items/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/sales-order-items/toolbar",
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
                            label: "Card",
                            path: "/order-items/card",
                        },
                        {
                            label: "Details",
                            path: "/order-items/details/:id",
                        },
                        {
                            label: "Edit",
                            path: "/order-items/edit/:id",
                        },
                        {
                            label: "Modal",
                            path: "/order-items/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/order-items/pagination",
                        },
                        {
                            label: "Search",
                            path: "/order-items/search",
                        },
                        {
                            label: "Statistics",
                            path: "/order-items/statistics",
                        },
                        {
                            label: "Table",
                            path: "/order-items/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/order-items/toolbar",
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
                            label: "Card",
                            path: "/order-status-history/card",
                        },
                        {
                            label: "Details",
                            path: "/order-status-history/details/:id",
                        },
                        {
                            label: "Edit",
                            path: "/order-status-history/edit/:id",
                        },
                        {
                            label: "Modal",
                            path: "/order-status-history/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/order-status-history/pagination",
                        },
                        {
                            label: "Search",
                            path: "/order-status-history/search",
                        },
                        {
                            label: "Statistics",
                            path: "/order-status-history/statistics",
                        },
                        {
                            label: "Table",
                            path: "/order-status-history/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/order-status-history/toolbar",
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
                            label: "Card",
                            path: "/delivery-challans/card",
                        },
                        {
                            label: "Details",
                            path: "/delivery-challans/details/:id",
                        },
                        {
                            label: "Edit Challan",
                            path: "/delivery-challans/edit/:id",
                        },
                        {
                            label: "Modal",
                            path: "/delivery-challans/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/delivery-challans/pagination",
                        },
                        {
                            label: "Search",
                            path: "/delivery-challans/search",
                        },
                        {
                            label: "Statistics",
                            path: "/delivery-challans/statistics",
                        },
                        {
                            label: "Table",
                            path: "/delivery-challans/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/delivery-challans/toolbar",
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
                            label: "Card",
                            path: "/delivery-challan-items/card",
                        },
                        {
                            label: "Details",
                            path: "/delivery-challan-items/details/:id",
                        },
                        {
                            label: "Edit Item",
                            path: "/delivery-challan-items/edit/:id",
                        },
                        {
                            label: "Modal",
                            path: "/delivery-challan-items/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/delivery-challan-items/pagination",
                        },
                        {
                            label: "Search",
                            path: "/delivery-challan-items/search",
                        },
                        {
                            label: "Statistics",
                            path: "/delivery-challan-items/statistics",
                        },
                        {
                            label: "Table",
                            path: "/delivery-challan-items/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/delivery-challan-items/toolbar",
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
                            label: "Create Shipment",
                            path: "/shipments/create",
                        },
                        {
                            label: "Card",
                            path: "/shipments/card",
                        },
                        {
                            label: "Details",
                            path: "/shipments/details/:id",
                        },
                        {
                            label: "Edit Shipment",
                            path: "/shipments/edit/:id",
                        },
                        {
                            label: "Modal",
                            path: "/shipments/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/shipments/pagination",
                        },
                        {
                            label: "Search",
                            path: "/shipments/search",
                        },
                        {
                            label: "Statistics",
                            path: "/shipments/statistics",
                        },
                        {
                            label: "Table",
                            path: "/shipments/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/shipments/toolbar",
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
                        {
                            label: "Warehouse Card",
                            path: "/warehouses/card",
                        },
                        {
                            label: "Warehouse Details",
                            path: "/warehouses/details/:id",
                        },
                        {
                            label: "Edit Warehouse",
                            path: "/warehouses/edit/:id",
                        },
                        {
                            label: "Warehouse Filters",
                            path: "/warehouses/filters",
                        },
                        {
                            label: "Warehouse Form",
                            path: "/warehouses/form",
                        },
                        {
                            label: "Warehouse Modal",
                            path: "/warehouses/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/warehouses/pagination",
                        },
                        {
                            label: "Search",
                            path: "/warehouses/search",
                        },
                        {
                            label: "Statistics",
                            path: "/warehouses/statistics",
                        },
                        {
                            label: "Table",
                            path: "/warehouses/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/warehouses/toolbar",
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
                        {
                            label: "Location Card",
                            path: "/warehouse-locations/card",
                        },
                        {
                            label: "Location Details",
                            path: "/warehouse-locations/details/:id",
                        },
                        {
                            label: "Edit Location",
                            path: "/warehouse-locations/edit/:id",
                        },
                        {
                            label: "Location Filters",
                            path: "/warehouse-locations/filters",
                        },
                        {
                            label: "Location Form",
                            path: "/warehouse-locations/form",
                        },
                        {
                            label: "Location Modal",
                            path: "/warehouse-locations/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/warehouse-locations/pagination",
                        },
                        {
                            label: "Search",
                            path: "/warehouse-locations/search",
                        },
                        {
                            label: "Statistics",
                            path: "/warehouse-locations/statistics",
                        },
                        {
                            label: "Table",
                            path: "/warehouse-locations/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/warehouse-locations/toolbar",
                        },
                    ],
                },

                {
                    label: "Stock Ledger",
                    path: "/stock-ledger",
                    icon: "📒",

                    children: [
                        {
                            label: "Ledger List",
                            path: "/stock-ledger",
                        },
                        {
                            label: "Create Ledger Entry",
                            path: "/stock-ledger/create",
                        },
                        {
                            label: "Ledger Card",
                            path: "/stock-ledger/card",
                        },
                        {
                            label: "Ledger Details",
                            path: "/stock-ledger/details/:id",
                        },
                        {
                            label: "Edit Ledger",
                            path: "/stock-ledger/edit/:id",
                        },
                        {
                            label: "Ledger Filters",
                            path: "/stock-ledger/filters",
                        },
                        {
                            label: "Ledger Form",
                            path: "/stock-ledger/form",
                        },
                        {
                            label: "Ledger Modal",
                            path: "/stock-ledger/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/stock-ledger/pagination",
                        },
                        {
                            label: "Search",
                            path: "/stock-ledger/search",
                        },
                        {
                            label: "Statistics",
                            path: "/stock-ledger/statistics",
                        },
                        {
                            label: "Table",
                            path: "/stock-ledger/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/stock-ledger/toolbar",
                        },
                    ],
                },

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
                            label: "Movement Card",
                            path: "/stock-movements/card",
                        },
                        {
                            label: "Movement Details",
                            path: "/stock-movements/details/:id",
                        },
                        {
                            label: "Edit Movement",
                            path: "/stock-movements/edit/:id",
                        },
                        {
                            label: "Movement Filters",
                            path: "/stock-movements/filters",
                        },
                        {
                            label: "Movement Form",
                            path: "/stock-movements/form",
                        },
                        {
                            label: "Movement Modal",
                            path: "/stock-movements/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/stock-movements/pagination",
                        },
                        {
                            label: "Search",
                            path: "/stock-movements/search",
                        },
                        {
                            label: "Statistics",
                            path: "/stock-movements/statistics",
                        },
                        {
                            label: "Table",
                            path: "/stock-movements/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/stock-movements/toolbar",
                        },
                    ],
                },

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
                            label: "Transfer Card",
                            path: "/stock-transfers/card",
                        },
                        {
                            label: "Transfer Details",
                            path: "/stock-transfers/details/:id",
                        },
                        {
                            label: "Edit Transfer",
                            path: "/stock-transfers/edit/:id",
                        },
                        {
                            label: "Transfer Filters",
                            path: "/stock-transfers/filters",
                        },
                        {
                            label: "Transfer Form",
                            path: "/stock-transfers/form",
                        },
                        {
                            label: "Transfer Modal",
                            path: "/stock-transfers/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/stock-transfers/pagination",
                        },
                        {
                            label: "Search",
                            path: "/stock-transfers/search",
                        },
                        {
                            label: "Statistics",
                            path: "/stock-transfers/statistics",
                        },
                        {
                            label: "Table",
                            path: "/stock-transfers/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/stock-transfers/toolbar",
                        },
                    ],
                },

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
                            label: "Adjustment Card",
                            path: "/stock-adjustments/card",
                        },
                        {
                            label: "Adjustment Details",
                            path: "/stock-adjustments/details/:id",
                        },
                        {
                            label: "Edit Adjustment",
                            path: "/stock-adjustments/edit/:id",
                        },
                        {
                            label: "Adjustment Filters",
                            path: "/stock-adjustments/filters",
                        },
                        {
                            label: "Adjustment Form",
                            path: "/stock-adjustments/form",
                        },
                        {
                            label: "Adjustment Modal",
                            path: "/stock-adjustments/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/stock-adjustments/pagination",
                        },
                        {
                            label: "Search",
                            path: "/stock-adjustments/search",
                        },
                        {
                            label: "Statistics",
                            path: "/stock-adjustments/statistics",
                        },
                        {
                            label: "Table",
                            path: "/stock-adjustments/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/stock-adjustments/toolbar",
                        },
                    ],
                },
            ],
        },

        // =====================================================
        // PROCUREMENT
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
                            label: "Card",
                            path: "/purchase-orders/card",
                        },
                        {
                            label: "Details",
                            path: "/purchase-orders/details/:id",
                        },
                        {
                            label: "Edit Purchase Order",
                            path: "/purchase-orders/edit/:id",
                        },
                        {
                            label: "Modal",
                            path: "/purchase-orders/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/purchase-orders/pagination",
                        },
                        {
                            label: "Search",
                            path: "/purchase-orders/search",
                        },
                        {
                            label: "Statistics",
                            path: "/purchase-orders/statistics",
                        },
                        {
                            label: "Table",
                            path: "/purchase-orders/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/purchase-orders/toolbar",
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
                            label: "Card",
                            path: "/purchase-order-items/card",
                        },
                        {
                            label: "Details",
                            path: "/purchase-order-items/details/:id",
                        },
                        {
                            label: "Edit Item",
                            path: "/purchase-order-items/edit/:id",
                        },
                        {
                            label: "Modal",
                            path: "/purchase-order-items/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/purchase-order-items/pagination",
                        },
                        {
                            label: "Search",
                            path: "/purchase-order-items/search",
                        },
                        {
                            label: "Statistics",
                            path: "/purchase-order-items/statistics",
                        },
                        {
                            label: "Table",
                            path: "/purchase-order-items/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/purchase-order-items/toolbar",
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
                            label: "Card",
                            path: "/purchase-returns/card",
                        },
                        {
                            label: "Details",
                            path: "/purchase-returns/details/:id",
                        },
                        {
                            label: "Edit Return",
                            path: "/purchase-returns/edit/:id",
                        },
                        {
                            label: "Modal",
                            path: "/purchase-returns/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/purchase-returns/pagination",
                        },
                        {
                            label: "Search",
                            path: "/purchase-returns/search",
                        },
                        {
                            label: "Statistics",
                            path: "/purchase-returns/statistics",
                        },
                        {
                            label: "Table",
                            path: "/purchase-returns/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/purchase-returns/toolbar",
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
                            label: "GRN Card",
                            path: "/goods-receipt-notes/card",
                        },
                        {
                            label: "GRN Details",
                            path: "/goods-receipt-notes/details/:id",
                        },
                        {
                            label: "Edit GRN",
                            path: "/goods-receipt-notes/edit/:id",
                        },
                        {
                            label: "GRN Modal",
                            path: "/goods-receipt-notes/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/goods-receipt-notes/pagination",
                        },
                        {
                            label: "Search",
                            path: "/goods-receipt-notes/search",
                        },
                        {
                            label: "Statistics",
                            path: "/goods-receipt-notes/statistics",
                        },
                        {
                            label: "Table",
                            path: "/goods-receipt-notes/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/goods-receipt-notes/toolbar",
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
                            label: "Item Card",
                            path: "/goods-receipt-note-items/card",
                        },
                        {
                            label: "Item Details",
                            path: "/goods-receipt-note-items/details/:id",
                        },
                        {
                            label: "Edit Item",
                            path: "/goods-receipt-note-items/edit/:id",
                        },
                        {
                            label: "Item Modal",
                            path: "/goods-receipt-note-items/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/goods-receipt-note-items/pagination",
                        },
                        {
                            label: "Search",
                            path: "/goods-receipt-note-items/search",
                        },
                        {
                            label: "Statistics",
                            path: "/goods-receipt-note-items/statistics",
                        },
                        {
                            label: "Table",
                            path: "/goods-receipt-note-items/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/goods-receipt-note-items/toolbar",
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
                            label: "Supplier Card",
                            path: "/suppliers/card",
                        },
                        {
                            label: "Supplier Details",
                            path: "/suppliers/details/:id",
                        },
                        {
                            label: "Edit Supplier",
                            path: "/suppliers/edit/:id",
                        },
                        {
                            label: "Supplier Filters",
                            path: "/suppliers/filters",
                        },
                        {
                            label: "Supplier Form",
                            path: "/suppliers/form",
                        },
                        {
                            label: "Supplier Modal",
                            path: "/suppliers/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/suppliers/pagination",
                        },
                        {
                            label: "Search",
                            path: "/suppliers/search",
                        },
                        {
                            label: "Statistics",
                            path: "/suppliers/statistics",
                        },
                        {
                            label: "Table",
                            path: "/suppliers/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/suppliers/toolbar",
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
        {
            label: "Customer Table",
            path: "/seller-customers/table",
        },
        {
            label: "Customer Card",
            path: "/seller-customers/card",
        },
        {
            label: "Customer Form",
            path: "/seller-customers/form",
        },
        {
            label: "Customer Modal",
            path: "/seller-customers/modal",
        },
        {
            label: "Customer Pagination",
            path: "/seller-customers/pagination",
        },
        {
            label: "Customer Toolbar",
            path: "/seller-customers/toolbar",
        },
    ],
},

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
                            label: "Address Card",
                            path: "/customer-addresses/card",
                        },
                        {
                            label: "Address Details",
                            path: "/customer-addresses/details/:id",
                        },
                        {
                            label: "Edit Address",
                            path: "/customer-addresses/edit/:id",
                        },
                        {
                            label: "Address Filters",
                            path: "/customer-addresses/filters",
                        },
                        {
                            label: "Address Form",
                            path: "/customer-addresses/form",
                        },
                        {
                            label: "Address Modal",
                            path: "/customer-addresses/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/customer-addresses/pagination",
                        },
                        {
                            label: "Search",
                            path: "/customer-addresses/search",
                        },
                        {
                            label: "Statistics",
                            path: "/customer-addresses/statistics",
                        },
                        {
                            label: "Table",
                            path: "/customer-addresses/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/customer-addresses/toolbar",
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
                            label: "Payment Card",
                            path: "/customer-payments/card",
                        },
                        {
                            label: "Payment Details",
                            path: "/customer-payments/details/:id",
                        },
                        {
                            label: "Edit Payment",
                            path: "/customer-payments/edit/:id",
                        },
                        {
                            label: "Payment Filters",
                            path: "/customer-payments/filters",
                        },
                        {
                            label: "Payment Form",
                            path: "/customer-payments/form",
                        },
                        {
                            label: "Payment Modal",
                            path: "/customer-payments/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/customer-payments/pagination",
                        },
                        {
                            label: "Search",
                            path: "/customer-payments/search",
                        },
                        {
                            label: "Statistics",
                            path: "/customer-payments/statistics",
                        },
                        {
                            label: "Table",
                            path: "/customer-payments/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/customer-payments/toolbar",
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
                            label: "Return Card",
                            path: "/customer-returns/card",
                        },
                        {
                            label: "Return Details",
                            path: "/customer-returns/details/:id",
                        },
                        {
                            label: "Edit Return",
                            path: "/customer-returns/edit/:id",
                        },
                        {
                            label: "Return Filters",
                            path: "/customer-returns/filters",
                        },
                        {
                            label: "Return Form",
                            path: "/customer-returns/form",
                        },
                        {
                            label: "Return Modal",
                            path: "/customer-returns/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/customer-returns/pagination",
                        },
                        {
                            label: "Search",
                            path: "/customer-returns/search",
                        },
                        {
                            label: "Statistics",
                            path: "/customer-returns/statistics",
                        },
                        {
                            label: "Table",
                            path: "/customer-returns/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/customer-returns/toolbar",
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
                            label: "Wishlist Card",
                            path: "/wishlists/card",
                        },
                        {
                            label: "Wishlist Details",
                            path: "/wishlists/details/:id",
                        },
                        {
                            label: "Edit Wishlist",
                            path: "/wishlists/edit/:id",
                        },
                        {
                            label: "Wishlist Filters",
                            path: "/wishlists/filters",
                        },
                        {
                            label: "Wishlist Form",
                            path: "/wishlists/form",
                        },
                        {
                            label: "Wishlist Modal",
                            path: "/wishlists/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/wishlists/pagination",
                        },
                        {
                            label: "Search",
                            path: "/wishlists/search",
                        },
                        {
                            label: "Statistics",
                            path: "/wishlists/statistics",
                        },
                        {
                            label: "Table",
                            path: "/wishlists/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/wishlists/toolbar",
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
                            label: "Card",
                            path: "/marketplace-order-items/card",
                        },
                        {
                            label: "Details",
                            path: "/marketplace-order-items/details/:id",
                        },
                        {
                            label: "Edit Item",
                            path: "/marketplace-order-items/edit/:id",
                        },
                        {
                            label: "Modal",
                            path: "/marketplace-order-items/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/marketplace-order-items/pagination",
                        },
                        {
                            label: "Search",
                            path: "/marketplace-order-items/search",
                        },
                        {
                            label: "Statistics",
                            path: "/marketplace-order-items/statistics",
                        },
                        {
                            label: "Table",
                            path: "/marketplace-order-items/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/marketplace-order-items/toolbar",
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
                            label: "Card",
                            path: "/marketplace-returns/card",
                        },
                        {
                            label: "Details",
                            path: "/marketplace-returns/details/:id",
                        },
                        {
                            label: "Edit Return",
                            path: "/marketplace-returns/edit/:id",
                        },
                        {
                            label: "Modal",
                            path: "/marketplace-returns/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/marketplace-returns/pagination",
                        },
                        {
                            label: "Search",
                            path: "/marketplace-returns/search",
                        },
                        {
                            label: "Statistics",
                            path: "/marketplace-returns/statistics",
                        },
                        {
                            label: "Table",
                            path: "/marketplace-returns/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/marketplace-returns/toolbar",
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
                            label: "Invoice Card",
                            path: "/sales-invoices/card",
                        },
                        {
                            label: "Invoice Details",
                            path: "/sales-invoices/details/:id",
                        },
                        {
                            label: "Edit Invoice",
                            path: "/sales-invoices/edit/:id",
                        },
                        {
                            label: "Invoice Filters",
                            path: "/sales-invoices/filters",
                        },
                        {
                            label: "Invoice Form",
                            path: "/sales-invoices/form",
                        },
                        {
                            label: "Invoice Modal",
                            path: "/sales-invoices/modal",
                        },
                        {
                            label: "Pagination",
                            path: "/sales-invoices/pagination",
                        },
                        {
                            label: "Search",
                            path: "/sales-invoices/search",
                        },
                        {
                            label: "Statistics",
                            path: "/sales-invoices/statistics",
                        },
                        {
                            label: "Table",
                            path: "/sales-invoices/table",
                        },
                        {
                            label: "Toolbar",
                            path: "/sales-invoices/toolbar",
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
                        {
                            label: "Export",
                            path: "/reports/export",
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

                    {menuSections.map((group) => {

                        const isGroupOpen =
                            openSections[group.section] !== false;

                        return (

                            <div
                                key={group.section}
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
                                        toggleSection(group.section)
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
                                        {isGroupOpen ? "▲" : "▼"}
                                    </span>

                                </button>

                                {/* =====================================
                                    ITEMS
                                ====================================== */}

                                {isGroupOpen &&
                                    group.items.map((item) => {

                                        const hasChildren =
                                            Array.isArray(item.children) &&
                                            item.children.length > 0;

                                        const isItemOpen =
                                            openSections[item.label] === true;

                                        return (

                                            <div
                                                key={`${group.section}-${item.label}`}
                                                style={{
                                                    width: "100%",
                                                }}
                                            >

                                                {/* =================================
                                                    PARENT
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
                                                        to={item.path}
                                                        end
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
                                                        })}
                                                        onClick={() => {

                                                            if (hasChildren) {

                                                                setOpenSections(
                                                                    (previous) => ({
                                                                        ...previous,
                                                                        [item.label]: true,
                                                                    })
                                                                );

                                                            }

                                                        }}
                                                    >

                                                        <span>
                                                            {item.icon}
                                                        </span>

                                                        <span>
                                                            {item.label}
                                                        </span>

                                                    </NavLink>

                                                    {/* =============================
                                                        EXPAND/COLLAPSE
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

                                                                toggleSection(
                                                                    item.label
                                                                );

                                                            }}
                                                            style={{
                                                                width: "42px",
                                                                height: "100%",
                                                                border: "none",
                                                                backgroundColor:
                                                                    isItemOpen
                                                                        ? "#26364d"
                                                                        : "transparent",
                                                                color: "#cbd5e1",
                                                                cursor: "pointer",
                                                                fontSize: "11px",
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
                                                                paddingBottom: "4px",
                                                            }}
                                                        >

                                                            {item.children.map(
                                                                (child, index) => (

                                                                    <NavLink
                                                                        key={`${item.label}-${child.path}-${index}`}
                                                                        to={child.path}
                                                                        style={({ isActive }) => ({
                                                                            display: "block",
                                                                            width: "100%",
                                                                            boxSizing: "border-box",
                                                                            padding: "7px 20px 7px 52px",
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

                                                                )
                                                            )}

                                                        </div>

                                                    )}

                                            </div>

                                        );

                                    })}

                            </div>

                        );

                    })}

                </nav>

                {/* =================================================
                    FOOTER
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
