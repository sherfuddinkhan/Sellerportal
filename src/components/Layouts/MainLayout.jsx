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

  const [openSections, setOpenSections] = useState({});

  // =========================================================
  // TOGGLE SECTION
  // =========================================================

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // =========================================================
  // SIDEBAR MENU
  // All routes correspond to App.jsx
  // =========================================================

  const menuSections = [
    // =======================================================
    // MAIN
    // =======================================================

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

    // =======================================================
    // CATALOG & PRODUCTS
    // =======================================================

    {
      section: "Catalog & Products",
      items: [
        // ---------------------------------------------------
        // CATALOG
        // ---------------------------------------------------

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
              label: "Catalog Attributes",
              path: "/catalog/attributes",
            },
            {
              label: "Catalog Card",
              path: "/catalog/card",
            },
            {
              label: "Catalog Images",
              path: "/catalog/images",
            },
            {
              label: "Marketplace",
              path: "/catalog/marketplace",
            },
            {
              label: "Publish",
              path: "/catalog/publish",
            },
            {
              label: "Pagination",
              path: "/catalog/pagination",
            },
            {
              label: "Search",
              path: "/catalog/search",
            },
            {
              label: "Statistics",
              path: "/catalog/statistics",
            },
            {
              label: "Table",
              path: "/catalog/table",
            },
            {
              label: "Toolbar",
              path: "/catalog/toolbar",
            },
            {
              label: "Variants",
              path: "/catalog/variants",
            },
            {
              label: "Modal",
              path: "/catalog/modal",
            },
            {
              label: "View Details",
              path: "/catalog/view/:id",
            },
            {
              label: "Delete",
              path: "/catalog/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // PRODUCTS
        // ---------------------------------------------------

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
              label: "Product Card",
              path: "/products/card",
            },
            {
              label: "Create Product",
              path: "/products/create",
            },
            {
              label: "Product Details",
              path: "/products/details/:id",
            },
            {
              label: "Edit Product",
              path: "/products/edit/:id",
            },
            {
              label: "Product Filters",
              path: "/products/filters",
            },
            {
              label: "Product Form",
              path: "/products/form",
            },
            {
              label: "Product Modal",
              path: "/products/modal",
            },
            {
              label: "Pagination",
              path: "/products/pagination",
            },
            {
              label: "Search",
              path: "/products/search",
            },
            {
              label: "Statistics",
              path: "/products/statistics",
            },
            {
              label: "Table",
              path: "/products/table",
            },
            {
              label: "Toolbar",
              path: "/products/toolbar",
            },
            {
              label: "View Product",
              path: "/products/view/:id",
            },
            {
              label: "Delete Product",
              path: "/products/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // BRANDS
        // ---------------------------------------------------

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
              label: "Brand Card",
              path: "/brands/card",
            },
            {
              label: "Create Brand",
              path: "/brands/create",
            },
            {
              label: "Brand Details",
              path: "/brands/details/:id",
            },
            {
              label: "Edit Brand",
              path: "/brands/edit/:id",
            },
            {
              label: "Brand Filters",
              path: "/brands/filters",
            },
            {
              label: "Brand Form",
              path: "/brands/form",
            },
            {
              label: "Brand Modal",
              path: "/brands/modal",
            },
            {
              label: "Pagination",
              path: "/brands/pagination",
            },
            {
              label: "Search",
              path: "/brands/search",
            },
            {
              label: "Statistics",
              path: "/brands/statistics",
            },
            {
              label: "Table",
              path: "/brands/table",
            },
            {
              label: "Toolbar",
              path: "/brands/toolbar",
            },
            {
              label: "View Brand",
              path: "/brands/view/:id",
            },
            {
              label: "Delete Brand",
              path: "/brands/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // CATEGORIES
        // ---------------------------------------------------

        {
          label: "Categories",
          path: "/categories",
          icon: "📂",
          children: [
            {
              label: "Category List",
              path: "/categories",
            },
            {
              label: "Category Card",
              path: "/categories/card",
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
              label: "Category Form",
              path: "/categories/form",
            },
            {
              label: "Category Modal",
              path: "/categories/modal",
            },
            {
              label: "Pagination",
              path: "/categories/pagination",
            },
            {
              label: "Search",
              path: "/categories/search",
            },
            {
              label: "Statistics",
              path: "/categories/statistics",
            },
            {
              label: "Table",
              path: "/categories/table",
            },
            {
              label: "Toolbar",
              path: "/categories/toolbar",
            },
            {
              label: "View Category",
              path: "/categories/view/:id",
            },
            {
              label: "Delete Category",
              path: "/categories/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // PRODUCT ATTRIBUTES
        // ---------------------------------------------------

        {
          label: "Product Attributes",
          path: "/product-attributes",
          icon: "🔖",
          children: [
            {
              label: "Attribute List",
              path: "/product-attributes",
            },
            {
              label: "Attribute Card",
              path: "/product-attributes/card",
            },
            {
              label: "Attribute Modal",
              path: "/product-attributes/modal",
            },
            {
              label: "Pagination",
              path: "/product-attributes/pagination",
            },
            {
              label: "Search",
              path: "/product-attributes/search",
            },
            {
              label: "Statistics",
              path: "/product-attributes/statistics",
            },
            {
              label: "Table",
              path: "/product-attributes/table",
            },
            {
              label: "Toolbar",
              path: "/product-attributes/toolbar",
            },
            {
              label: "View Attribute",
              path: "/product-attributes/view/:id",
            },
            {
              label: "Delete Attribute",
              path: "/product-attributes/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // PRODUCT IMAGES
        // ---------------------------------------------------

        {
          label: "Product Images",
          path: "/product-images",
          icon: "🖼️",
          children: [
            {
              label: "Image List",
              path: "/product-images",
            },
            {
              label: "Image Card",
              path: "/product-images/card",
            },
            {
              label: "Image Modal",
              path: "/product-images/modal",
            },
            {
              label: "Pagination",
              path: "/product-images/pagination",
            },
            {
              label: "Search",
              path: "/product-images/search",
            },
            {
              label: "Statistics",
              path: "/product-images/statistics",
            },
            {
              label: "Table",
              path: "/product-images/table",
            },
            {
              label: "Toolbar",
              path: "/product-images/toolbar",
            },
            {
              label: "View Image",
              path: "/product-images/view/:id",
            },
            {
              label: "Delete Image",
              path: "/product-images/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // PRODUCT INVENTORY
        // ---------------------------------------------------

        {
          label: "Product Inventory",
          path: "/product-inventory",
          icon: "📊",
          children: [
            {
              label: "Inventory List",
              path: "/product-inventory",
            },
            {
              label: "Inventory Card",
              path: "/product-inventory/card",
            },
            {
              label: "Inventory Details",
              path: "/product-inventory/details/:id",
            },
            {
              label: "Inventory Filters",
              path: "/product-inventory/filters",
            },
            {
              label: "Inventory Modal",
              path: "/product-inventory/modal",
            },
            {
              label: "Pagination",
              path: "/product-inventory/pagination",
            },
            {
              label: "Search",
              path: "/product-inventory/search",
            },
            {
              label: "Statistics",
              path: "/product-inventory/statistics",
            },
            {
              label: "Table",
              path: "/product-inventory/table",
            },
            {
              label: "Toolbar",
              path: "/product-inventory/toolbar",
            },
            {
              label: "View Inventory",
              path: "/product-inventory/view/:id",
            },
            {
              label: "Delete Inventory",
              path: "/product-inventory/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // PRODUCT PRICES
        // ---------------------------------------------------

        {
          label: "Product Prices",
          path: "/product-prices",
          icon: "💰",
          children: [
            {
              label: "Price List",
              path: "/product-prices",
            },
            {
              label: "Price Card",
              path: "/product-prices/card",
            },
            {
              label: "Create Price",
              path: "/product-prices/create",
            },
            {
              label: "Price Details",
              path: "/product-prices/details/:id",
            },
            {
              label: "Edit Price",
              path: "/product-prices/edit/:id",
            },
            {
              label: "Price Filters",
              path: "/product-prices/filters",
            },
            {
              label: "Price Form",
              path: "/product-prices/form",
            },
            {
              label: "Price Modal",
              path: "/product-prices/modal",
            },
            {
              label: "Pagination",
              path: "/product-prices/pagination",
            },
            {
              label: "Search",
              path: "/product-prices/search",
            },
            {
              label: "Statistics",
              path: "/product-prices/statistics",
            },
            {
              label: "Table",
              path: "/product-prices/table",
            },
            {
              label: "Toolbar",
              path: "/product-prices/toolbar",
            },
            {
              label: "View Price",
              path: "/product-prices/view/:id",
            },
            {
              label: "Delete Price",
              path: "/product-prices/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // PRODUCT TYPES
        // ---------------------------------------------------

        {
          label: "Product Types",
          path: "/product-types",
          icon: "🗂️",
          children: [
            {
              label: "Type List",
              path: "/product-types",
            },
            {
              label: "Type Card",
              path: "/product-types/card",
            },
            {
              label: "Create Type",
              path: "/product-types/create",
            },
            {
              label: "Type Details",
              path: "/product-types/details/:id",
            },
            {
              label: "Edit Type",
              path: "/product-types/edit/:id",
            },
            {
              label: "Type Filters",
              path: "/product-types/filters",
            },
            {
              label: "Type Form",
              path: "/product-types/form",
            },
            {
              label: "Type Modal",
              path: "/product-types/modal",
            },
            {
              label: "Pagination",
              path: "/product-types/pagination",
            },
            {
              label: "Search",
              path: "/product-types/search",
            },
            {
              label: "Statistics",
              path: "/product-types/statistics",
            },
            {
              label: "Table",
              path: "/product-types/table",
            },
            {
              label: "Toolbar",
              path: "/product-types/toolbar",
            },
            {
              label: "View Type",
              path: "/product-types/view/:id",
            },
            {
              label: "Delete Type",
              path: "/product-types/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // REVIEWS
        // ---------------------------------------------------

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
              label: "Review Card",
              path: "/reviews/card",
            },
            {
              label: "Review Modal",
              path: "/reviews/modal",
            },
            {
              label: "Pagination",
              path: "/reviews/pagination",
            },
            {
              label: "Search",
              path: "/reviews/search",
            },
            {
              label: "Statistics",
              path: "/reviews/statistics",
            },
            {
              label: "Table",
              path: "/reviews/table",
            },
            {
              label: "Toolbar",
              path: "/reviews/toolbar",
            },
            {
              label: "View Review",
              path: "/reviews/view/:id",
            },
            {
              label: "Delete Review",
              path: "/reviews/delete/:id",
            },
          ],
        },
      ],
    },

    // =======================================================
    // ORDERS
    // =======================================================

    {
      section: "Orders",
      items: [
        // ---------------------------------------------------
        // SALES ORDERS
        // ---------------------------------------------------

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
              label: "Card",
              path: "/sales-orders/card",
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
            {
              label: "View Order",
              path: "/sales-orders/view/:id",
            },
            {
              label: "Delete Order",
              path: "/sales-orders/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // SALES ORDER ITEMS
        // ---------------------------------------------------

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
              label: "Card",
              path: "/sales-order-items/card",
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
            {
              label: "View Item",
              path: "/sales-order-items/view/:id",
            },
            {
              label: "Delete Item",
              path: "/sales-order-items/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // ORDER ITEMS
        // ---------------------------------------------------

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
              label: "Card",
              path: "/order-items/card",
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
            {
              label: "View Item",
              path: "/order-items/view/:id",
            },
            {
              label: "Delete Item",
              path: "/order-items/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // ORDER STATUS HISTORY
        // ---------------------------------------------------

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
              label: "Card",
              path: "/order-status-history/card",
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
            {
              label: "View History",
              path: "/order-status-history/view/:id",
            },
            {
              label: "Delete History",
              path: "/order-status-history/delete/:id",
            },
          ],
        },
      ],
    },

    // =======================================================
    // DELIVERY & LOGISTICS
    // =======================================================

    {
      section: "Delivery & Logistics",
      items: [
        // ---------------------------------------------------
        // DELIVERY CHALLANS
        // ---------------------------------------------------

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
              label: "Card",
              path: "/delivery-challans/card",
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
            {
              label: "View Challan",
              path: "/delivery-challans/view/:id",
            },
            {
              label: "Delete Challan",
              path: "/delivery-challans/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // DELIVERY CHALLAN ITEMS
        // ---------------------------------------------------

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
              label: "Card",
              path: "/delivery-challan-items/card",
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
            {
              label: "View Item",
              path: "/delivery-challan-items/view/:id",
            },
            {
              label: "Delete Item",
              path: "/delivery-challan-items/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // SHIPMENTS
        // ---------------------------------------------------

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
              label: "Card",
              path: "/shipments/card",
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
            {
              label: "View Shipment",
              path: "/shipments/view/:id",
            },
            {
              label: "Delete Shipment",
              path: "/shipments/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // NOTE:
        // Warehouses, Warehouse Locations, Stock Ledger,
        // Stock Movements, Stock Transfers and Stock
        // Adjustments are NOT included here because they
        // currently do not have routes in the supplied App.jsx.
        // ---------------------------------------------------
      ],
    },

    // =======================================================
    // PROCUREMENT & RECEIVING
    // =======================================================

    {
      section: "Procurement & Receiving",
      items: [
        // ---------------------------------------------------
        // PURCHASE ORDERS
        // ---------------------------------------------------

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
              label: "Card",
              path: "/purchase-orders/card",
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
            {
              label: "View Purchase Order",
              path: "/purchase-orders/view/:id",
            },
            {
              label: "Delete Purchase Order",
              path: "/purchase-orders/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // PURCHASE ORDER ITEMS
        // ---------------------------------------------------

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
              label: "Card",
              path: "/purchase-order-items/card",
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
            {
              label: "View Item",
              path: "/purchase-order-items/view/:id",
            },
            {
              label: "Delete Item",
              path: "/purchase-order-items/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // PURCHASE RETURNS
        // ---------------------------------------------------

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
              label: "Card",
              path: "/purchase-returns/card",
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
            {
              label: "View Return",
              path: "/purchase-returns/view/:id",
            },
            {
              label: "Delete Return",
              path: "/purchase-returns/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // GOODS RECEIPT NOTES
        // ---------------------------------------------------

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
              label: "GRN Card",
              path: "/goods-receipt-notes/card",
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
            {
              label: "View GRN",
              path: "/goods-receipt-notes/view/:id",
            },
            {
              label: "Delete GRN",
              path: "/goods-receipt-notes/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // GOODS RECEIPT ITEMS
        // ---------------------------------------------------

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
              label: "Item Card",
              path: "/goods-receipt-note-items/card",
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
            {
              label: "View Item",
              path: "/goods-receipt-note-items/view/:id",
            },
            {
              label: "Delete Item",
              path: "/goods-receipt-note-items/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // SUPPLIERS
        // ---------------------------------------------------

        {
          label: "Suppliers",
          path: "/suppliers",
          icon: "🏢",
        },
      ],
    },

    // =======================================================
    // CUSTOMERS
    // =======================================================

    {
      section: "Customers",
      items: [
        // ---------------------------------------------------
        // SELLER CUSTOMERS
        // ---------------------------------------------------

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
              label: "Customer Card",
              path: "/seller-customers/card",
            },
            {
              label: "Customer Modal",
              path: "/seller-customers/modal",
            },
            {
              label: "Pagination",
              path: "/seller-customers/pagination",
            },
            {
              label: "Search",
              path: "/seller-customers/search",
            },
            {
              label: "Statistics",
              path: "/seller-customers/statistics",
            },
            {
              label: "Table",
              path: "/seller-customers/table",
            },
            {
              label: "Toolbar",
              path: "/seller-customers/toolbar",
            },
            {
              label: "View Customer",
              path: "/seller-customers/view/:id",
            },
            {
              label: "Delete Customer",
              path: "/seller-customers/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // CUSTOMER ADDRESSES
        // ---------------------------------------------------

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
              label: "Address Card",
              path: "/customer-addresses/card",
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
            {
              label: "View Address",
              path: "/customer-addresses/view/:id",
            },
            {
              label: "Delete Address",
              path: "/customer-addresses/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // CUSTOMER PAYMENTS
        // ---------------------------------------------------

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
              label: "Payment Card",
              path: "/customer-payments/card",
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
            {
              label: "View Payment",
              path: "/customer-payments/view/:id",
            },
            {
              label: "Delete Payment",
              path: "/customer-payments/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // CUSTOMER RETURNS
        // ---------------------------------------------------

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
              label: "Return Card",
              path: "/customer-returns/card",
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
            {
              label: "View Return",
              path: "/customer-returns/view/:id",
            },
            {
              label: "Delete Return",
              path: "/customer-returns/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // WISHLISTS
        // ---------------------------------------------------

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
              label: "Wishlist Card",
              path: "/wishlists/card",
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
            {
              label: "View Wishlist",
              path: "/wishlists/view/:id",
            },
            {
              label: "Delete Wishlist",
              path: "/wishlists/delete/:id",
            },
          ],
        },
      ],
    },

    // =======================================================
    // MARKETPLACE
    // =======================================================

    {
      section: "Marketplace",
      items: [
        {
          label: "Marketplaces",
          path: "/marketplaces",
          icon: "🌐",
        },

        // ---------------------------------------------------
        // MARKETPLACE ORDER ITEMS
        // ---------------------------------------------------

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
              label: "Card",
              path: "/marketplace-order-items/card",
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
            {
              label: "View Item",
              path: "/marketplace-order-items/view/:id",
            },
            {
              label: "Delete Item",
              path: "/marketplace-order-items/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // MARKETPLACE RETURNS
        // ---------------------------------------------------

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
              label: "Card",
              path: "/marketplace-returns/card",
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
            {
              label: "View Return",
              path: "/marketplace-returns/view/:id",
            },
            {
              label: "Delete Return",
              path: "/marketplace-returns/delete/:id",
            },
          ],
        },
      ],
    },

    // =======================================================
    // SALES & FINANCE
    // =======================================================

    {
      section: "Sales & Finance",
      items: [
        // ---------------------------------------------------
        // SALES INVOICES
        // ---------------------------------------------------

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
              label: "Invoice Card",
              path: "/sales-invoices/card",
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
            {
              label: "View Invoice",
              path: "/sales-invoices/view/:id",
            },
            {
              label: "Delete Invoice",
              path: "/sales-invoices/delete/:id",
            },
          ],
        },

        // ---------------------------------------------------
        // PAYMENT SETTINGS
        // ---------------------------------------------------

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

        // ---------------------------------------------------
        // REPORTS
        // ---------------------------------------------------

        {
          label: "Reports",
          path: "/reports",
          icon: "📈",
        },
      ],
    },
  ];

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
  // RENDER
  // =========================================================

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        style={{
          width: "280px",
          backgroundColor: "#1e293b",
          color: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #334155",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          overflow: "hidden",
          zIndex: 100,
        }}
      >
        {/* =================================================
            LOGO
        ================================================== */}

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

        {/* =================================================
            NAVIGATION
        ================================================== */}

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
                {/* Section Header */}

                <div
                  onClick={() =>
                    toggleSection(group.section)
                  }
                  style={{
                    padding: "8px 20px",
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    color: "#94a3b8",
                    letterSpacing: "0.08em",
                    fontWeight: "600",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <span>{group.section}</span>

                  <span
                    style={{
                      fontSize: "10px",
                    }}
                  >
                    {isGroupOpen ? "▲" : "▼"}
                  </span>
                </div>

                {/* Section Items */}

                {isGroupOpen &&
                  group.items.map((item) => {
                    const hasChildren =
                      Array.isArray(item.children) &&
                      item.children.length > 0;

                    const isItemOpen =
                      openSections[item.label] === true;

                    return (
                      <div key={item.path}>
                        {/* Parent */}

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <NavLink
                            to={item.path}
                            end={!hasChildren}
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
                                : "transparent",
                              textDecoration: "none",
                              fontSize: "0.88rem",
                              transition:
                                "background 0.2s",
                            })}
                          >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                          </NavLink>

                          {/* Expand */}

                          {hasChildren && (
                            <button
                              type="button"
                              onClick={() =>
                                toggleSection(
                                  item.label
                                )
                              }
                              style={{
                                border: "none",
                                background:
                                  "transparent",
                                color: "#cbd5e1",
                                cursor: "pointer",
                                padding: "8px 15px",
                                fontSize: "12px",
                              }}
                            >
                              {isItemOpen
                                ? "▲"
                                : "▼"}
                            </button>
                          )}
                        </div>

                        {/* =================================================
                            CHILDREN
                        ================================================== */}

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
                                (child) => (
                                  <NavLink
                                    key={child.path}
                                    to={child.path}
                                    style={({
                                      isActive,
                                    }) => ({
                                      display:
                                        "block",
                                      padding:
                                        "7px 20px 7px 52px",
                                      color: isActive
                                        ? "#38bdf8"
                                        : "#94a3b8",
                                      backgroundColor:
                                        isActive
                                          ? "#1e3a5f"
                                          : "transparent",
                                      textDecoration:
                                        "none",
                                      fontSize:
                                        "0.82rem",
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
            SIDEBAR FOOTER
        ================================================== */}

        <div
          style={{
            borderTop: "1px solid #334155",
            padding: "12px",
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

      {/* =====================================================
          MAIN CONTENT AREA
      ====================================================== */}

      <div
        style={{
          flex: 1,
          marginLeft: "280px",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
        }}
      >
        {/* =================================================
            HEADER
        ================================================== */}

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
          <span
            style={{
              fontWeight: "600",
              color: "#334155",
            }}
          >
            Seller Portal Control Panel
          </span>

          <div
            style={{
              display: "flex",
              gap: "15px",
              alignItems: "center",
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
            PAGE CONTENT
        ================================================== */}

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
