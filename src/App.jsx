import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import MainLayout from "./layouts/MainLayout";

// Auth
import Login from "./pages/AuthManagement/Login";
import Register from "./pages/AuthManagement/Register";
import ForgotPassword from "./pages/AuthManagement/ForgotPassword";
import ResetPassword from "./pages/AuthManagement/ResetPassword";
import ChangePassword from "./pages/AuthManagement/ChangePassword";
import UserProfile from "./pages/AuthManagement/UserProfile";
import Unauthorized from "./pages/AuthManagement/Unauthorized";

// Dashboard
import Dashboard from "./pages/Dashboard/Dashboard";

// Masters
//import Products from "./pages/Products/Products";
//import ProductTypes from "./pages/ProductTypes/ProductTypeList";
//import ProductPrices from "./pages/ProductPrices/ProductPriceList";
//import ProductInventory from "./pages/ProductInventory/ProductInventoryList";
//import ProductImages from "./pages/ProductImages/ProductImageList";
//import ProductAttributes from "./pages/ProductAttributes/ProductAttributeList";
//import Categories from "./pages/Categories/CategoryList";
//import Brands from "./pages/Brands/BrandList";
//import Warehouses from "./pages/Warehouses/WarehouseList";
// Customers
//import SellerCustomers from "./pages/SellerCustomers/SellerCustomerList";
//import CustomerAddresses from "./pages/CustomerAddresses/CustomerAddressList";
//import CustomerPayments from "./pages/CustomerPayments/CustomerPaymentList";
//import CustomerReturns from "./pages/CustomerReturns/CustomerReturnList";
// Orders
//import Orders from "./pages/Orders/Orders";
//import OrderItems from "./pages/OrderItems/OrderItemList";
//import OrderStatusHistory from "./pages/OrderStatusHistory/OrderStatusHistoryList";
// Marketplace
//import MarketplaceOrderItems from "./pages/MarketplaceOrderItem/MarketplaceOrderItemList";
//import MarketplaceReturns from "./pages/MarketplaceReturn/MarketplaceReturnList";
// Purchase
//import PurchaseOrders from "./pages/PurchaseOrders/PurchaseOrderList";
//import PurchaseOrderItems from "./pages/PurchaseOrderItems/PurchaseOrderItemList";
//import PurchaseReturns from "./pages/PurchaseReturns/PurchaseReturnList";
// Sales
//import SalesOrders from "./pages/SalesOrders/SalesOrderList";
//import SalesOrderItems from "./pages/SalesOrderItems/SalesOrderItemList";
//import SalesInvoices from "./pages/SalesInvoices/SalesInvoiceList";
// Inventory
///import StockLedger from "./pages/StockLedger/StockLedgerList";
// Cart
//import ShoppingCart from "./pages/ShoppingCart/ShoppingCartList";
//import CartItems from "./pages/CartItems/CartItemList";
// Wishlist
//import Wishlists from "./pages/Wishlists/WishlistList";
//import WishlistItems from "./pages/WishlistItems/WishlistItemList";
// Shipment
//import Shipments from "./pages/Shipments/ShipmentList";
// Reviews
import Reviews from "./pages/Reviews/ReviewList";
// Catalog
//import Catalog from "./pages/Catalog/CatalogList";

// Delivery Challans
import DeliveryChallans from "./pages/DeliveryChallans/DeliveryChallanList";
import DeliveryChallanItems from "./pages/DeliveryChallanItem/DeliveryChallanItemList";

// Goods Receipt
import GoodsReceiptNotes from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemList";
import GoodsReceiptItems from "./pages/GoodsReceiptItems/GoodsReceiptNoteList";

// Notifications
//import Notifications from "./pages/Notifications/NotificationList";

// Payment Settings
//import PaymentSettings from "./pages/PaymentsSettings/PaymentSettings";

// Profile
//import Profile from "./pages/Profile/Profile";

// Reports
//import DashboardReport from "./pages/Reports/DashboardReport/DashboardReportList";
//import SalesReport from "./pages/Reports/SalesReport/SalesReportList";
//import CustomerReport from "./pages/Reports/CustomerReport/CustomerReportList";
//import InventoryReport from "./pages/Reports/InventoryReport/InventoryReportList";
//import MarketplaceReport from "./pages/Reports/MarketplaceReport/MarketplaceReportList";
//import OrderReport from "./pages/Reports/OrderReport/OrderReportList";
//import PaymentReport from "./pages/Reports/PaymentReport/PaymentReportList";
//import ProfitLossReport from "./pages/Reports/ProfitLossReport/ProfitLossReportList";
//import PurchaseReport from "./pages/Reports/PurchaseReport/PurchaseReportList";
//import ReturnReport from "./pages/Reports/ReturnReport/ReturnReportList";
//import StockLedgerReport from "./pages/Reports/StockLedgerReport/StockLedgerReportList";
//import StockMovementReport from "./pages/Reports/StockMovementReport/StockMovementReportList";
//import SupplierReport from "./pages/Reports/Supplier Report/SupplierReportList";
//import TaxReport from "./pages/Reports/TaxReport/TaxReportList";
//import LowStockReport from "./pages/Reports/LowStockReport/LowStockReportList";

// Not Found
//import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes with Sidebar */}
        <Route element={<MainLayout />}>

          <Route path="/dashboard" element={<Dashboard />} />

          {/* Masters */}
          <Route path="/products" element={<Products />} />
          <Route path="/product-types" element={<ProductTypes />} />
          <Route path="/product-prices" element={<ProductPrices />} />
          <Route path="/product-inventory" element={<ProductInventory />} />
          <Route path="/product-images" element={<ProductImages />} />
          <Route path="/product-attributes" element={<ProductAttributes />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/warehouses" element={<Warehouses />} />

          {/* Customers */}
          <Route path="/customers" element={<SellerCustomers />} />
          <Route path="/customer-addresses" element={<CustomerAddresses />} />
          <Route path="/customer-payments" element={<CustomerPayments />} />
          <Route path="/customer-returns" element={<CustomerReturns />} />

          {/* Orders */}
          <Route path="/orders" element={<Orders />} />
          <Route path="/order-items" element={<OrderItems />} />
          <Route path="/order-status-history" element={<OrderStatusHistory />} />

          {/* Marketplace */}
          <Route path="/marketplace-order-items" element={<MarketplaceOrderItems />} />
          <Route path="/marketplace-returns" element={<MarketplaceReturns />} />

          {/* Purchase */}
          <Route path="/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/purchase-order-items" element={<PurchaseOrderItems />} />
          <Route path="/purchase-returns" element={<PurchaseReturns />} />

          {/* Sales */}
          <Route path="/sales-orders" element={<SalesOrders />} />
          <Route path="/sales-order-items" element={<SalesOrderItems />} />
          <Route path="/sales-invoices" element={<SalesInvoices />} />

          {/* Inventory */}
          <Route path="/stock-ledger" element={<StockLedger />} />

          {/* Shopping */}
       {/*  <Route path="/shopping-cart" element={<ShoppingCart />} />*/}
          <Route path="/cart-items" element={<CartItems />} />
          <Route path="/wishlists" element={<Wishlists />} />
          <Route path="/wishlist-items" element={<WishlistItems />} />

          {/* Logistics */}
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/delivery-challans" element={<DeliveryChallans />} />
          <Route path="/delivery-challan-items" element={<DeliveryChallanItems />} />
          <Route path="/goods-receipt-notes" element={<GoodsReceiptNotes />} />
          <Route path="/goods-receipt-items" element={<GoodsReceiptItems />} />

          {/* Other */}
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/payment-settings" element={<PaymentSettings />} />
          <Route path="/my-profile" element={<Profile />} />

          {/* Reports */}
           {/*  <Route path="/reports/dashboard" element={<DashboardReport />} />
          <Route path="/reports/sales" element={<SalesReport />} />
          <Route path="/reports/customers" element={<CustomerReport />} />
          <Route path="/reports/inventory" element={<InventoryReport />} />
          <Route path="/reports/marketplace" element={<MarketplaceReport />} />
          <Route path="/reports/orders" element={<OrderReport />} />
          <Route path="/reports/payments" element={<PaymentReport />} />
          <Route path="/reports/profit-loss" element={<ProfitLossReport />} />
          <Route path="/reports/purchases" element={<PurchaseReport />} />
          <Route path="/reports/returns" element={<ReturnReport />} />
          <Route path="/reports/stock-ledger" element={<StockLedgerReport />} />
          <Route path="/reports/stock-movement" element={<StockMovementReport />} />
          <Route path="/reports/suppliers" element={<SupplierReport />} />
          <Route path="/reports/tax" element={<TaxReport />} />
          <Route path="/reports/low-stock" element={<LowStockReport />} />
          */}

        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;