const menuItems = [
  {
    id: 1,
    label: "Dashboard",
    path: "/dashboard",
  },

  {
    id: 2,
    label: "Masters",
    children: [
      { id: 21, label: "Products", path: "/products" },
      { id: 22, label: "Categories", path: "/categories" },
      { id: 23, label: "Brands", path: "/brands" },
      { id: 24, label: "Product Types", path: "/product-types" },
      { id: 25, label: "Product Prices", path: "/product-prices" },
      { id: 26, label: "Product Inventory", path: "/product-inventory" },
      { id: 27, label: "Product Images", path: "/product-images" },
      { id: 28, label: "Product Attributes", path: "/product-attributes" },
      { id: 29, label: "Warehouses", path: "/warehouses" },
    ],
  },

  {
    id: 3,
    label: "Customers",
    children: [
      { id: 31, label: "Seller Customers", path: "/customers" },
      { id: 32, label: "Customer Addresses", path: "/customer-addresses" },
      { id: 33, label: "Customer Payments", path: "/customer-payments" },
      { id: 34, label: "Customer Returns", path: "/customer-returns" },
    ],
  },

  {
    id: 4,
    label: "Orders",
    children: [
      { id: 41, label: "Orders", path: "/orders" },
      { id: 42, label: "Order Items", path: "/order-items" },
      { id: 43, label: "Order Status History", path: "/order-status-history" },
    ],
  },

  {
    id: 5,
    label: "Marketplace",
    children: [
      { id: 51, label: "Marketplace Order Items", path: "/marketplace-order-items" },
      { id: 52, label: "Marketplace Returns", path: "/marketplace-returns" },
    ],
  },

  {
    id: 6,
    label: "Purchase",
    children: [
      { id: 61, label: "Purchase Orders", path: "/purchase-orders" },
      { id: 62, label: "Purchase Order Items", path: "/purchase-order-items" },
      { id: 63, label: "Purchase Returns", path: "/purchase-returns" },
    ],
  },

  {
    id: 7,
    label: "Sales",
    children: [
      { id: 71, label: "Sales Orders", path: "/sales-orders" },
      { id: 72, label: "Sales Order Items", path: "/sales-order-items" },
      { id: 73, label: "Sales Invoices", path: "/sales-invoices" },
    ],
  },

  {
    id: 8,
    label: "Reports",
    path: "/reports/dashboard",
  },

  {
    id: 9,
    label: "Profile",
    path: "/my-profile",
  },
];

export default menuItems;