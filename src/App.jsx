import { Routes, Route } from "react-router-dom";
// =========================================================
// AUTH PAGES
// =========================================================

import Login from "./pages/AuthManagement/Login";
import Register from "./pages/AuthManagement/Register";
import UserProfile from "./pages/AuthManagement/UserProfile";
import Unauthorized from "./pages/AuthManagement/Unauthorized";

import ChangePassword from "./pages/AuthManagement/ChangePassword";
import ForgotPassword from "./pages/AuthManagement/ForgotPassword";
import ResetPassword from "./pages/AuthManagement/ResetPassword";

// =========================================================
// DASHBOARD
// =========================================================
import Dashboard from "./pages/Dashboard/Dashboard";

// =========================================================
// LAYOUT
// =========================================================
import MainLayout from "./components/Layout/MainLayout";


// =========================================================
// PROTECTED ROUTE
// =========================================================
import ProtectedRoute from "./components/Auth/ProtectedRoute";

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

                {/* =====================================================
                    PUBLIC ROUTES
                ===================================================== */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />

                <Route
                    path="/unauthorized"
                    element={<Unauthorized />}
                />


                {/* =====================================================
                    PROTECTED ROUTES
                ===================================================== */}

                <Route element={<ProtectedRoute />}>

                    <Route element={<MainLayout />}>

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/profile"
                            element={<UserProfile />}
                        />

                        <Route
                            path="/change-password"
                            element={<ChangePassword />}
                        />

                    </Route>

                </Route>


                {/* =====================================================
                    FALLBACK
                ===================================================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;