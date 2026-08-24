import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// =========================================================
// LAYOUT & AUTH ROUTE
// =========================================================
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

// =========================================================
// AUTH MANAGEMENT
// =========================================================
import Login from "./pages/AuthManagement/Login";
import Register from "./pages/AuthManagement/Register";
import ForgotPassword from "./pages/AuthManagement/ForgotPassword";
import ResetPassword from "./pages/AuthManagement/ResetPassword";
import Unauthorized from "./pages/AuthManagement/Unauthorized";

// =========================================================
// PAGES (Based on Project Folder Structure)
// =========================================================
import Dashboard from "./pages/Dashboard001/Dashboard";
import Brands from "./pages/Brands/Brands";
import CartItems from "./pages/CartItems/CartItems";
import Catalog from "./pages/Catalog/Catalog";
import Categories from "./pages/Categories/Categories";
import CustomerAddresses from "./pages/CustomerAddresses/CustomerAddresses";
import CustomerPayments from "./pages/CustomerPayments/CustomerPayments";
import CustomerReturns from "./pages/CustomerReturns/CustomerReturns";
import DeliveryChallanItem from "./pages/DeliveryChallanItem/DeliveryChallanItem";
import DeliveryChallans from "./pages/DeliveryChallans/DeliveryChallans";
import GoodsReceiptItems from "./pages/GoodsReceiptItems/GoodsReceiptItems";
import GoodsReceiptNotes from "./pages/GoodsReceiptNotes/GoodsReceiptNotes";
import MarketplaceOrderItem from "./pages/MarketplaceOrderItem/MarketplaceOrderItem";
import MarketplaceReturn from "./pages/MarketplaceReturn/MarketplaceReturn";
import Notifications from "./pages/Notifications/Notifications";
import OrderItems from "./pages/OrderItems/OrderItems";
import Orders from "./pages/Orders/Orders";
import OrderStatusHistory from "./pages/OrderStatusHistory/OrderStatusHistory";
import PaymentsSettings from "./pages/PaymentsSettings/PaymentsSettings";
import ProductAttributes from "./pages/ProductAttributes/ProductAttributes";
import ProductImages from "./pages/ProductImages/ProductImages";
import ProductInventory from "./pages/ProductInventory/ProductInventory";
import ProductPrices from "./pages/ProductPrices/ProductPrices";
import Products from "./pages/Products/Products";
import ProductTypes from "./pages/ProductTypes/ProductTypes";
import Profile from "./pages/Profile/Profile";
import PurchaseOrderItems from "./pages/PurchaseOrderItems/PurchaseOrderItems";
import PurchaseOrders from "./pages/PurchaseOrders/PurchaseOrders";
import PurchaseReturns from "./pages/PurchaseReturns/PurchaseReturns";
import Reports from "./pages/Reports/Reports";
import Reviews from "./pages/Reviews/Reviews";
import SalesInvoices from "./pages/SalesInvoices/SalesInvoices";
import SalesOrderItems from "./pages/SalesOrderItems/SalesOrderItems";
import SalesOrders from "./pages/SalesOrders/SalesOrders";
import SellerCustomers from "./pages/SellerCustomers/SellerCustomers";
import Shipments from "./pages/Shipments/Shipments";
import ShoppingCart from "./pages/ShoppingCart/ShoppingCart";
import StockLedger from "./pages/StockLedger/StockLedger";
import Warehouses from "./pages/Warehouses/Warehouses";
import WishlistItems from "./pages/WishlistItems/WishlistItems";

function App() {
  return (
    <Routes>
      {/* =====================================================
          PUBLIC AUTH ROUTES
      ===================================================== */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* =====================================================
          PROTECTED APPLICATION ROUTES
      ===================================================== */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Main Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notifications" element={<Notifications />} />

          {/* Product & Catalog */}
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/products" element={<Products />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/product-attributes" element={<ProductAttributes />} />
          <Route path="/product-images" element={<ProductImages />} />
          <Route path="/product-inventory" element={<ProductInventory />} />
          <Route path="/product-prices" element={<ProductPrices />} />
          <Route path="/product-types" element={<ProductTypes />} />
          <Route path="/reviews" element={<Reviews />} />

          {/* Orders & Cart */}
          <Route path="/orders" element={<Orders />} />
          <Route path="/order-items" element={<OrderItems />} />
          <Route path="/order-status-history" element={<OrderStatusHistory />} />
          <Route path="/sales-orders" element={<SalesOrders />} />
          <Route path="/sales-order-items" element={<SalesOrderItems />} />
          <Route path="/marketplace-order-items" element={<MarketplaceOrderItem />} />
          <Route path="/cart-items" element={<CartItems />} />
          <Route path="/shopping-cart" element={<ShoppingCart />} />
          <Route path="/wishlist-items" element={<WishlistItems />} />

          {/* Delivery & Logistics */}
          <Route path="/delivery-challans" element={<DeliveryChallans />} />
          <Route path="/delivery-challan-items" element={<DeliveryChallanItem />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/warehouses" element={<Warehouses />} />
          <Route path="/stock-ledger" element={<StockLedger />} />

          {/* Procurement & Goods Receipt */}
          <Route path="/goods-receipt-notes" element={<GoodsReceiptNotes />} />
          <Route path="/goods-receipt-items" element={<GoodsReceiptItems />} />
          <Route path="/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/purchase-order-items" element={<PurchaseOrderItems />} />
          <Route path="/purchase-returns" element={<PurchaseReturns />} />

          {/* Customer & Finance */}
          <Route path="/seller-customers" element={<SellerCustomers />} />
          <Route path="/customer-addresses" element={<CustomerAddresses />} />
          <Route path="/customer-payments" element={<CustomerPayments />} />
          <Route path="/customer-returns" element={<CustomerReturns />} />
          <Route path="/marketplace-returns" element={<MarketplaceReturn />} />
          <Route path="/sales-invoices" element={<SalesInvoices />} />
          <Route path="/payment-settings" element={<PaymentsSettings />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* =====================================================
          CATCH-ALL / INVALID ROUTE
      ===================================================== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;