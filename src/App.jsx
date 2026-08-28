import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// =========================================================
// MAIN LAYOUT
// =========================================================
import MainLayout from "./components/Layouts/MainLayout";

// =========================================================
// AUTH MANAGEMENT
// =========================================================
import Login from "./pages/AuthManagement/Login";
import Register from "./pages/AuthManagement/Register";
import ForgotPassword from "./pages/AuthManagement/ForgotPassword";
import ResetPassword from "./pages/AuthManagement/ResetPassword";
import Unauthorized from "./pages/AuthManagement/Unauthorized";
import UserProfile from "./pages/AuthManagement/UserProfile";
import UserProfileCard from "./pages/AuthManagement/UserProfileCard";

// =========================================================
// DASHBOARD
// =========================================================
import Dashboard from "./pages/Dashboard001/Dashboard";

// =========================================================
// BRANDS
// =========================================================
import BrandCard from "./pages/Brands/BrandCard";
import BrandCreate from "./pages/Brands/BrandCreate";
import BrandDetails from "./pages/Brands/BrandDetails";
import BrandEdit from "./pages/Brands/BrandEdit";
import BrandFilters from "./pages/Brands/BrandFilters";
import BrandForm from "./pages/Brands/BrandForm";
import BrandList from "./pages/Brands/BrandList";
import BrandModal from "./pages/Brands/BrandModal";
import BrandPagination from "./pages/Brands/BrandPagination";
import BrandSearch from "./pages/Brands/BrandSearch";
import BrandStatistics from "./pages/Brands/BrandStatistics";
import BrandTable from "./pages/Brands/BrandTable";
import BrandToolbar from "./pages/Brands/BrandToolbar";
import BrandView from "./pages/Brands/BrandView";
import DeleteBrandDialog from "./pages/Brands/DeleteBrandDialog";

// =========================================================
// CATALOG
// =========================================================
import CatalogAttributes from "./pages/Catalog/CatalogAttributes";
import CatalogCard from "./pages/Catalog/CatalogCard";
import CatalogImages from "./pages/Catalog/CatalogImages";
import CatalogList from "./pages/Catalog/CatalogList";
import CatalogMarketplace from "./pages/Catalog/CatalogMarketplace";
import CatalogModal from "./pages/Catalog/CatalogModal";
import CatalogPagination from "./pages/Catalog/CatalogPagination";
import CatalogPublish from "./pages/Catalog/CatalogPublish";
import CatalogSearch from "./pages/Catalog/CatalogSearch";
import CatalogStatistics from "./pages/Catalog/CatalogStatistics";
import CatalogTable from "./pages/Catalog/CatalogTable";
import CatalogToolbar from "./pages/Catalog/CatalogToolbar";
import CatalogVariants from "./pages/Catalog/CatalogVariants";
import CatalogView from "./pages/Catalog/CatalogView";
import DeleteCatalogDialog from "./pages/Catalog/DeleteCatalogDialog";

// =========================================================
// CATEGORIES
// =========================================================
import CategoryCard from "./pages/Categories/CategoryCard";
import CategoryCreate from "./pages/Categories/CategoryCreate";
import CategoryDetails from "./pages/Categories/CategoryDetails";
import CategoryEdit from "./pages/Categories/CategoryEdit";
import CategoryFilters from "./pages/Categories/CategoryFilters";
import CategoryForm from "./pages/Categories/CategoryForm";
import CategoryList from "./pages/Categories/CategoryList";
import CategoryModal from "./pages/Categories/CategoryModal";
import CategoryPagination from "./pages/Categories/CategoryPagination";
import CategorySearch from "./pages/Categories/CategorySearch";
import CategoryStatistics from "./pages/Categories/CategoryStatistics";
import CategoryTable from "./pages/Categories/CategoryTable";
import CategoryToolbar from "./pages/Categories/CategoryToolbar";
import CategoryView from "./pages/Categories/CategoryView";
import DeleteCategoryDialog from "./pages/Categories/DeleteCategoryDialog";

// =========================================================
// CUSTOMER ADDRESSES
// =========================================================
import CustomerAddressCard from "./pages/CustomerAddresses/CustomerAddressCard";
import CustomerAddressList from "./pages/CustomerAddresses/CustomerAddressList";
import CustomerAddressModal from "./pages/CustomerAddresses/CustomerAddressModal";
import CustomerAddressPagination from "./pages/CustomerAddresses/CustomerAddressPagination";
import CustomerAddressSearch from "./pages/CustomerAddresses/CustomerAddressSearch";
import CustomerAddressStatistics from "./pages/CustomerAddresses/CustomerAddressStatistics";
import CustomerAddressTable from "./pages/CustomerAddresses/CustomerAddressTable";
import CustomerAddressToolbar from "./pages/CustomerAddresses/CustomerAddressToolbar";
import CustomerAddressView from "./pages/CustomerAddresses/CustomerAddressView";
import DeleteCustomerAddressDialog from "./pages/CustomerAddresses/DeleteCustomerAddressDialog";

// =========================================================
// CUSTOMER PAYMENTS
// =========================================================
import CustomerPaymentCard from "./pages/CustomerPayments/CustomerPaymentCard";
import CustomerPaymentList from "./pages/CustomerPayments/CustomerPaymentList";
import CustomerPaymentModal from "./pages/CustomerPayments/CustomerPaymentModal";
import CustomerPaymentPagination from "./pages/CustomerPayments/CustomerPaymentPagination";
import CustomerPaymentSearch from "./pages/CustomerPayments/CustomerPaymentSearch";
import CustomerPaymentStatistics from "./pages/CustomerPayments/CustomerPaymentStatistics";
import CustomerPaymentTable from "./pages/CustomerPayments/CustomerPaymentTable";
import CustomerPaymentToolbar from "./pages/CustomerPayments/CustomerPaymentToolbar";
import CustomerPaymentView from "./pages/CustomerPayments/CustomerPaymentView";
import DeleteCustomerPaymentDialog from "./pages/CustomerPayments/DeleteCustomerPaymentDialog";

// =========================================================
// CUSTOMER RETURNS
// =========================================================
import CustomerReturnCard from "./pages/CustomerReturns/CustomerReturnCard";
import CustomerReturnList from "./pages/CustomerReturns/CustomerReturnList";
import CustomerReturnModal from "./pages/CustomerReturns/CustomerReturnModal";
import CustomerReturnPagination from "./pages/CustomerReturns/CustomerReturnPagination";
import CustomerReturnSearch from "./pages/CustomerReturns/CustomerReturnSearch";
import CustomerReturnStatistics from "./pages/CustomerReturns/CustomerReturnStatistics";
import CustomerReturnTable from "./pages/CustomerReturns/CustomerReturnTable";
import CustomerReturnToolbar from "./pages/CustomerReturns/CustomerReturnToolbar";
import CustomerReturnView from "./pages/CustomerReturns/CustomerReturnView";
import DeleteCustomerReturnDialog from "./pages/CustomerReturns/DeleteCustomerReturnDialog";

// =========================================================
// DELIVERY CHALLANS
// =========================================================
import DeleteDeliveryChallanDialog from "./pages/DeliveryChallans/DeleteDeliveryChallanDialog";
import DeliveryChallanCard from "./pages/DeliveryChallans/DeliveryChallanCard";
import DeliveryChallanList from "./pages/DeliveryChallans/DeliveryChallanList";
import DeliveryChallanModal from "./pages/DeliveryChallans/DeliveryChallanModal";
import DeliveryChallanPagination from "./pages/DeliveryChallans/DeliveryChallanPagination";
import DeliveryChallanSearch from "./pages/DeliveryChallans/DeliveryChallanSearch";
import DeliveryChallanStatistics from "./pages/DeliveryChallans/DeliveryChallanStatistics";
import DeliveryChallanTable from "./pages/DeliveryChallans/DeliveryChallanTable";
import DeliveryChallanToolbar from "./pages/DeliveryChallans/DeliveryChallanToolbar";
import DeliveryChallanView from "./pages/DeliveryChallans/DeliveryChallanView";

// =========================================================
// DELIVERY CHALLAN ITEMS
// =========================================================
import DeleteDeliveryChallanItemDialog from "./pages/DeliveryChallanItem/DeleteDeliveryChallanItemDialog";
import DeliveryChallanItemCard from "./pages/DeliveryChallanItem/DeliveryChallanItemCard";
import DeliveryChallanItemList from "./pages/DeliveryChallanItem/DeliveryChallanItemList";
import DeliveryChallanItemModal from "./pages/DeliveryChallanItem/DeliveryChallanItemModal";
import DeliveryChallanItemPagination from "./pages/DeliveryChallanItem/DeliveryChallanItemPagination";
import DeliveryChallanItemSearch from "./pages/DeliveryChallanItem/DeliveryChallanItemSearch";
import DeliveryChallanItemStatistics from "./pages/DeliveryChallanItem/DeliveryChallanItemStatistics";
import DeliveryChallanItemTable from "./pages/DeliveryChallanItem/DeliveryChallanItemTable";
import DeliveryChallanItemToolbar from "./pages/DeliveryChallanItem/DeliveryChallanItemToolbar";
import DeliveryChallanItemView from "./pages/DeliveryChallanItem/DeliveryChallanItemView";

// =========================================================
// GOODS RECEIPT NOTES
// =========================================================
import DeleteGoodsReceiptNoteDialog from "./pages/GoodsReceiptItems/DeleteGoodsReceiptNoteDialog";
import GoodsReceiptNoteCard from "./pages/GoodsReceiptItems/GoodsReceiptNoteCard";
import GoodsReceiptNoteList from "./pages/GoodsReceiptItems/GoodsReceiptNoteList";
import GoodsReceiptNoteModal from "./pages/GoodsReceiptItems/GoodsReceiptNoteModal";
import GoodsReceiptNotePagination from "./pages/GoodsReceiptItems/GoodsReceiptNotePagination";
import GoodsReceiptNoteSearch from "./pages/GoodsReceiptItems/GoodsReceiptNoteSearch";
import GoodsReceiptNoteStatistics from "./pages/GoodsReceiptItems/GoodsReceiptNoteStatistics";
import GoodsReceiptNoteTable from "./pages/GoodsReceiptItems/GoodsReceiptNoteTable";
import GoodsReceiptNoteToolbar from "./pages/GoodsReceiptItems/GoodsReceiptNoteToolbar";
import GoodsReceiptNoteView from "./pages/GoodsReceiptItems/GoodsReceiptNoteView";

// =========================================================
// GOODS RECEIPT ITEMS
// =========================================================
import DeleteGoodsReceiptNoteItemDialog from "./pages/GoodsReceiptNotes/DeleteGoodsReceiptNoteItemDialog";
import GoodsReceiptNoteItemCard from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemCard";
import GoodsReceiptNoteItemList from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemList";
import GoodsReceiptNoteItemModal from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemModal";
import GoodsReceiptNoteItemPagination from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemPagination";
import GoodsReceiptNoteItemSearch from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemSearch";
import GoodsReceiptNoteItemStatistics from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemStatistics";
import GoodsReceiptNoteItemTable from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemTable";
import GoodsReceiptNoteItemToolbar from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemToolbar";
import GoodsReceiptNoteItemView from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemView";

// =========================================================
// MARKETPLACE ORDER ITEMS
// =========================================================
import DeleteMarketplaceOrderItemDialog from "./pages/MarketplaceOrderItem/DeleteMarketplaceOrderItemDialog";
import MarketplaceOrderItemCard from "./pages/MarketplaceOrderItem/MarketplaceOrderItemCard";
import MarketplaceOrderItemList from "./pages/MarketplaceOrderItem/MarketplaceOrderItemList";
import MarketplaceOrderItemModal from "./pages/MarketplaceOrderItem/MarketplaceOrderItemModal";
import MarketplaceOrderItemPagination from "./pages/MarketplaceOrderItem/MarketplaceOrderItemPagination";
import MarketplaceOrderItemSearch from "./pages/MarketplaceOrderItem/MarketplaceOrderItemSearch";
import MarketplaceOrderItemStatistics from "./pages/MarketplaceOrderItem/MarketplaceOrderItemStatistics";
import MarketplaceOrderItemTable from "./pages/MarketplaceOrderItem/MarketplaceOrderItemTable";
import MarketplaceOrderItemToolbar from "./pages/MarketplaceOrderItem/MarketplaceOrderItemToolbar";
import MarketplaceOrderItemView from "./pages/MarketplaceOrderItem/MarketplaceOrderItemView";

// =========================================================
// MARKETPLACE RETURNS
// =========================================================
import DeleteMarketplaceReturnDialog from "./pages/MarketplaceReturn/DeleteMarketplaceReturnDialog";
import MarketplaceReturnCard from "./pages/MarketplaceReturn/MarketplaceReturnCard";
import MarketplaceReturnList from "./pages/MarketplaceReturn/MarketplaceReturnList";
import MarketplaceReturnModal from "./pages/MarketplaceReturn/MarketplaceReturnModal";
import MarketplaceReturnPagination from "./pages/MarketplaceReturn/MarketplaceReturnPagination";
import MarketplaceReturnSearch from "./pages/MarketplaceReturn/MarketplaceReturnSearch";
import MarketplaceReturnStatistics from "./pages/MarketplaceReturn/MarketplaceReturnStatistics";
import MarketplaceReturnTable from "./pages/MarketplaceReturn/MarketplaceReturnTable";
import MarketplaceReturnToolbar from "./pages/MarketplaceReturn/MarketplaceReturnToolbar";
import MarketplaceReturnView from "./pages/MarketplaceReturn/MarketplaceReturnView";

// =========================================================
// NOTIFICATIONS
// =========================================================
import NotificationCard from "./pages/Notifications/NotificationCard";
import NotificationList from "./pages/Notifications/NotificationList";
import NotificationSettings from "./pages/Notifications/NotificationSettings";
import NotificationView from "./pages/Notifications/NotificationView";

// =========================================================
// ORDER ITEMS
// =========================================================
import DeleteOrderItemDialog from "./pages/OrderItems/DeleteOrderItemDialog";
import OrderItemCard from "./pages/OrderItems/OrderItemCard";
import OrderItemList from "./pages/OrderItems/OrderItemList";
import OrderItemModal from "./pages/OrderItems/OrderItemModal";
import OrderItemPagination from "./pages/OrderItems/OrderItemPagination";
import OrderItemSearch from "./pages/OrderItems/OrderItemSearch";
import OrderItemStatistics from "./pages/OrderItems/OrderItemStatistics";
import OrderItemTable from "./pages/OrderItems/OrderItemTable";
import OrderItemToolbar from "./pages/OrderItems/OrderItemToolbar";
import OrderItemView from "./pages/OrderItems/OrderItemView";

// =========================================================
// ORDER STATUS HISTORY
// =========================================================
import DeleteOrderStatusHistoryDialog from "./pages/OrderStatusHistory/DeleteOrderStatusHistoryDialog";
import OrderStatusHistoryCard from "./pages/OrderStatusHistory/OrderStatusHistoryCard";
import OrderStatusHistoryList from "./pages/OrderStatusHistory/OrderStatusHistoryList";
import OrderStatusHistoryModal from "./pages/OrderStatusHistory/OrderStatusHistoryModal";
import OrderStatusHistoryPagination from "./pages/OrderStatusHistory/OrderStatusHistoryPagination";
import OrderStatusHistorySearch from "./pages/OrderStatusHistory/OrderStatusHistorySearch";
import OrderStatusHistoryStatistics from "./pages/OrderStatusHistory/OrderStatusHistoryStatistics";
import OrderStatusHistoryTable from "./pages/OrderStatusHistory/OrderStatusHistoryTable";
import OrderStatusHistoryToolbar from "./pages/OrderStatusHistory/OrderStatusHistoryToolbar";
import OrderStatusHistoryView from "./pages/OrderStatusHistory/OrderStatusHistoryView";

// =========================================================
// PAYMENT SETTINGS
// =========================================================
import BankDetails from "./pages/PaymentsSettings/BankDetails";
import PaymentGateway from "./pages/PaymentsSettings/PaymentGateway";
import PaymentSettings from "./pages/PaymentsSettings/PaymentSettings";
import UpiSettings from "./pages/PaymentsSettings/UpiSettings";

// =========================================================
// PRODUCT ATTRIBUTES
// =========================================================
import DeleteProductAttributeDialog from "./pages/ProductAttributes/DeleteProductAttributeDialog";
import ProductAttributeCard from "./pages/ProductAttributes/ProductAttributeCard";
import ProductAttributeList from "./pages/ProductAttributes/ProductAttributeList";
import ProductAttributeModal from "./pages/ProductAttributes/ProductAttributeModal";
import ProductAttributePagination from "./pages/ProductAttributes/ProductAttributePagination";
import ProductAttributeSearch from "./pages/ProductAttributes/ProductAttributeSearch";
import ProductAttributeStatistics from "./pages/ProductAttributes/ProductAttributeStatistics";
import ProductAttributeTable from "./pages/ProductAttributes/ProductAttributeTable";
import ProductAttributeToolbar from "./pages/ProductAttributes/ProductAttributeToolbar";
import ProductAttributeView from "./pages/ProductAttributes/ProductAttributeView";

// =========================================================
// PRODUCT IMAGES
// =========================================================
import DeleteProductImageDialog from "./pages/ProductImages/DeleteProductImageDialog";
import ProductImageCard from "./pages/ProductImages/ProductImageCard";
import ProductImageList from "./pages/ProductImages/ProductImageList";
import ProductImageModal from "./pages/ProductImages/ProductImageModal";
import ProductImagePagination from "./pages/ProductImages/ProductImagePagination";
import ProductImageSearch from "./pages/ProductImages/ProductImageSearch";
import ProductImageStatistics from "./pages/ProductImages/ProductImageStatistics";
import ProductImageTable from "./pages/ProductImages/ProductImageTable";
import ProductImageToolbar from "./pages/ProductImages/ProductImageToolbar";
import ProductImageView from "./pages/ProductImages/ProductImageView";

// =========================================================
// PRODUCT INVENTORY
// =========================================================
import DeleteProductInventoryDialog from "./pages/ProductInventory/DeleteProductInventoryDialog";
import ProductInventoryCard from "./pages/ProductInventory/ProductInventoryCard";
import ProductInventoryDetails from "./pages/ProductInventory/ProductInventoryDetails";
import ProductInventoryFilters from "./pages/ProductInventory/ProductInventoryFilters";
import ProductInventoryList from "./pages/ProductInventory/ProductInventoryList";
import ProductInventoryModal from "./pages/ProductInventory/ProductInventoryModal";
import ProductInventoryPagination from "./pages/ProductInventory/ProductInventoryPagination";
import ProductInventorySearch from "./pages/ProductInventory/ProductInventorySearch";
import ProductInventoryStatistics from "./pages/ProductInventory/ProductInventoryStatistics";
import ProductInventoryTable from "./pages/ProductInventory/ProductInventoryTable";
import ProductInventoryToolbar from "./pages/ProductInventory/ProductInventoryToolbar";
import ProductInventoryView from "./pages/ProductInventory/ProductInventoryView";

// =========================================================
// PRODUCT PRICES
// =========================================================
import DeleteProductPriceDialog from "./pages/ProductPrices/DeleteProductPriceDialog";
import ProductPriceCard from "./pages/ProductPrices/ProductPriceCard";
import ProductPriceCreate from "./pages/ProductPrices/ProductPriceCreate";
import ProductPriceDetails from "./pages/ProductPrices/ProductPriceDetails";
import ProductPriceEdit from "./pages/ProductPrices/ProductPriceEdit";
import ProductPriceFilters from "./pages/ProductPrices/ProductPriceFilters";
import ProductPriceForm from "./pages/ProductPrices/ProductPriceForm";
import ProductPriceList from "./pages/ProductPrices/ProductPriceList";
import ProductPriceModal from "./pages/ProductPrices/ProductPriceModal";
import ProductPricePagination from "./pages/ProductPrices/ProductPricePagination";
import ProductPriceSearch from "./pages/ProductPrices/ProductPriceSearch";
import ProductPriceStatistics from "./pages/ProductPrices/ProductPriceStatistics";
import ProductPriceTable from "./pages/ProductPrices/ProductPriceTable";
import ProductPriceToolbar from "./pages/ProductPrices/ProductPriceToolbar";
import ProductPriceView from "./pages/ProductPrices/ProductPriceView";

// =========================================================
// PRODUCTS
// =========================================================
import DeleteProductDialog from "./pages/Products/DeleteProductDialog";
import ProductCard from "./pages/Products/ProductCard";
import ProductCreate from "./pages/Products/ProductCreate";
import ProductDetails from "./pages/Products/ProductDetails";
import ProductEdit from "./pages/Products/ProductEdit";
import ProductFilters from "./pages/Products/ProductFilters";
import ProductForm from "./pages/Products/ProductForm";
import ProductList from "./pages/Products/ProductList";
import ProductModal from "./pages/Products/ProductModal";
import ProductPagination from "./pages/Products/ProductPagination";
import Products from "./pages/Products/Products";
import ProductSearch from "./pages/Products/ProductSearch";
import ProductStatistics from "./pages/Products/ProductStatistics";
import ProductTable from "./pages/Products/ProductTable";
import ProductToolbar from "./pages/Products/ProductToolbar";
import ProductView from "./pages/Products/ProductView";

// =========================================================
// PRODUCT TYPES
// =========================================================
import DeleteProductTypeDialog from "./pages/ProductTypes/DeleteProductTypeDialog";
import ProductTypeCard from "./pages/ProductTypes/ProductTypeCard";
import ProductTypeCreate from "./pages/ProductTypes/ProductTypeCreate";
import ProductTypeDetails from "./pages/ProductTypes/ProductTypeDetails";
import ProductTypeEdit from "./pages/ProductTypes/ProductTypeEdit";
import ProductTypeFilters from "./pages/ProductTypes/ProductTypeFilters";
import ProductTypeForm from "./pages/ProductTypes/ProductTypeForm";
import ProductTypeList from "./pages/ProductTypes/ProductTypeList";
import ProductTypeModal from "./pages/ProductTypes/ProductTypeModal";
import ProductTypePagination from "./pages/ProductTypes/ProductTypePagination";
import ProductTypeSearch from "./pages/ProductTypes/ProductTypeSearch";
import ProductTypeStatistics from "./pages/ProductTypes/ProductTypeStatistics";
import ProductTypeTable from "./pages/ProductTypes/ProductTypeTable";
import ProductTypeToolbar from "./pages/ProductTypes/ProductTypeToolbar";
import ProductTypeView from "./pages/ProductTypes/ProductTypeView";

// =========================================================
// PURCHASE ORDER ITEMS
// =========================================================
import DeletePurchaseOrderItemDialog from "./pages/PurchaseOrderItems/DeletePurchaseOrderItemDialog";
import PurchaseOrderItemCard from "./pages/PurchaseOrderItems/PurchaseOrderItemCard";
import PurchaseOrderItemList from "./pages/PurchaseOrderItems/PurchaseOrderItemList";
import PurchaseOrderItemModal from "./pages/PurchaseOrderItems/PurchaseOrderItemModal";
import PurchaseOrderItemPagination from "./pages/PurchaseOrderItems/PurchaseOrderItemPagination";
import PurchaseOrderItemSearch from "./pages/PurchaseOrderItems/PurchaseOrderItemSearch";
import PurchaseOrderItemStatistics from "./pages/PurchaseOrderItems/PurchaseOrderItemStatistics";
import PurchaseOrderItemTable from "./pages/PurchaseOrderItems/PurchaseOrderItemTable";
import PurchaseOrderItemToolbar from "./pages/PurchaseOrderItems/PurchaseOrderItemToolbar";
import PurchaseOrderItemView from "./pages/PurchaseOrderItems/PurchaseOrderItemView";

// =========================================================
// PURCHASE ORDERS
// =========================================================
import DeletePurchaseOrderDialog from "./pages/PurchaseOrders/DeletePurchaseOrderDialog";
import PurchaseOrderCard from "./pages/PurchaseOrders/PurchaseOrderCard";
import PurchaseOrderList from "./pages/PurchaseOrders/PurchaseOrderList";
import PurchaseOrderModal from "./pages/PurchaseOrders/PurchaseOrderModal";
import PurchaseOrderPagination from "./pages/PurchaseOrders/PurchaseOrderPagination";
import PurchaseOrderSearch from "./pages/PurchaseOrders/PurchaseOrderSearch";
import PurchaseOrderStatistics from "./pages/PurchaseOrders/PurchaseOrderStatistics";
import PurchaseOrderTable from "./pages/PurchaseOrders/PurchaseOrderTable";
import PurchaseOrderToolbar from "./pages/PurchaseOrders/PurchaseOrderToolbar";
import PurchaseOrderView from "./pages/PurchaseOrders/PurchaseOrderView";

// =========================================================
// PURCHASE RETURNS
// =========================================================
import DeletePurchaseReturnDialog from "./pages/PurchaseReturns/DeletePurchaseReturnDialog";
import PurchaseReturnCard from "./pages/PurchaseReturns/PurchaseReturnCard";
import PurchaseReturnList from "./pages/PurchaseReturns/PurchaseReturnList";
import PurchaseReturnModal from "./pages/PurchaseReturns/PurchaseReturnModal";
import PurchaseReturnPagination from "./pages/PurchaseReturns/PurchaseReturnPagination";
import PurchaseReturnSearch from "./pages/PurchaseReturns/PurchaseReturnSearch";
import PurchaseReturnStatistics from "./pages/PurchaseReturns/PurchaseReturnStatistics";
import PurchaseReturnTable from "./pages/PurchaseReturns/PurchaseReturnTable";
import PurchaseReturnToolbar from "./pages/PurchaseReturns/PurchaseReturnToolbar";
import PurchaseReturnView from "./pages/PurchaseReturns/PurchaseReturnView";

// =========================================================
// REVIEWS
// =========================================================
import DeleteReviewDialog from "./pages/Reviews/DeleteReviewDialog";
import ReviewCard from "./pages/Reviews/ReviewCard";
import ReviewList from "./pages/Reviews/ReviewList";
import ReviewModal from "./pages/Reviews/ReviewModal";
import ReviewPagination from "./pages/Reviews/ReviewPagination";
import ReviewSearch from "./pages/Reviews/ReviewSearch";
import ReviewStatistics from "./pages/Reviews/ReviewStatistics";
import ReviewTable from "./pages/Reviews/ReviewTable";
import ReviewToolbar from "./pages/Reviews/ReviewToolbar";
import ReviewView from "./pages/Reviews/ReviewView";

// =========================================================
// SALES INVOICES
// =========================================================
import DeleteSalesInvoiceDialog from "./pages/SalesInvoices/DeleteSalesInvoiceDialog";
import SalesInvoiceCard from "./pages/SalesInvoices/SalesInvoiceCard";
import SalesInvoiceList from "./pages/SalesInvoices/SalesInvoiceList";
import SalesInvoiceModal from "./pages/SalesInvoices/SalesInvoiceModal";
import SalesInvoicePagination from "./pages/SalesInvoices/SalesInvoicePagination";
import SalesInvoiceSearch from "./pages/SalesInvoices/SalesInvoiceSearch";
import SalesInvoiceStatistics from "./pages/SalesInvoices/SalesInvoiceStatistics";
import SalesInvoiceTable from "./pages/SalesInvoices/SalesInvoiceTable";
import SalesInvoiceToolbar from "./pages/SalesInvoices/SalesInvoiceToolbar";
import SalesInvoiceView from "./pages/SalesInvoices/SalesInvoiceView";

// =========================================================
// SALES ORDER ITEMS
// =========================================================
import DeleteSalesOrderItemDialog from "./pages/SalesOrderItems/DeleteSalesOrderItemDialog";
import SalesOrderItemCard from "./pages/SalesOrderItems/SalesOrderItemCard";
import SalesOrderItemList from "./pages/SalesOrderItems/SalesOrderItemList";
import SalesOrderItemModal from "./pages/SalesOrderItems/SalesOrderItemModal";
import SalesOrderItemPagination from "./pages/SalesOrderItems/SalesOrderItemPagination";
import SalesOrderItemSearch from "./pages/SalesOrderItems/SalesOrderItemSearch";
import SalesOrderItemStatistics from "./pages/SalesOrderItems/SalesOrderItemStatistics";
import SalesOrderItemTable from "./pages/SalesOrderItems/SalesOrderItemTable";
import SalesOrderItemToolbar from "./pages/SalesOrderItems/SalesOrderItemToolbar";
import SalesOrderItemView from "./pages/SalesOrderItems/SalesOrderItemView";

// =========================================================
// SALES ORDERS
// =========================================================
import DeleteSalesOrderDialog from "./pages/SalesOrders/DeleteSalesOrderDialog";
import SalesOrderCard from "./pages/SalesOrders/SalesOrderCard";
import SalesOrderList from "./pages/SalesOrders/SalesOrderList";
import SalesOrderModal from "./pages/SalesOrders/SalesOrderModal";
import SalesOrderPagination from "./pages/SalesOrders/SalesOrderPagination";
import SalesOrderSearch from "./pages/SalesOrders/SalesOrderSearch";
import SalesOrderStatistics from "./pages/SalesOrders/SalesOrderStatistics";
import SalesOrderTable from "./pages/SalesOrders/SalesOrderTable";
import SalesOrderToolbar from "./pages/SalesOrders/SalesOrderToolbar";
import SalesOrderView from "./pages/SalesOrders/SalesOrderView";

// =========================================================
// SELLER CUSTOMERS
// =========================================================
import DeleteSellerCustomerDialog from "./pages/SellerCustomers/DeleteSellerCustomerDialog";
import SellerCustomerCard from "./pages/SellerCustomers/SellerCustomerCard";
import SellerCustomerList from "./pages/SellerCustomers/SellerCustomerList";
import SellerCustomerModal from "./pages/SellerCustomers/SellerCustomerModal";
import SellerCustomerPagination from "./pages/SellerCustomers/SellerCustomerPagination";
import SellerCustomerSearch from "./pages/SellerCustomers/SellerCustomerSearch";
import SellerCustomerStatistics from "./pages/SellerCustomers/SellerCustomerStatistics";
import SellerCustomerTable from "./pages/SellerCustomers/SellerCustomerTable";
import SellerCustomerToolbar from "./pages/SellerCustomers/SellerCustomerToolbar";
import SellerCustomerView from "./pages/SellerCustomers/SellerCustomerView";

// =========================================================
// SHIPMENTS
// =========================================================
import DeleteShipmentDialog from "./pages/Shipments/DeleteShipmentDialog";
import ShipmentCard from "./pages/Shipments/ShipmentCard";
import ShipmentList from "./pages/Shipments/ShipmentList";
import ShipmentModal from "./pages/Shipments/ShipmentModal";
import ShipmentPagination from "./pages/Shipments/ShipmentPagination";
import ShipmentSearch from "./pages/Shipments/ShipmentSearch";
import ShipmentStatistics from "./pages/Shipments/ShipmentStatistics";
import ShipmentTable from "./pages/Shipments/ShipmentTable";
import ShipmentToolbar from "./pages/Shipments/ShipmentToolbar";
import ShipmentView from "./pages/Shipments/ShipmentView";

// =========================================================
// WISHLISTS
// =========================================================
import DeleteWishlistDialog from "./pages/Wishlists/DeleteWishlistDialog";
import WishlistCard from "./pages/Wishlists/WishlistCard";
import WishlistList from "./pages/Wishlists/WishlistList";
import WishlistModal from "./pages/Wishlists/WishlistModal";
import WishlistPagination from "./pages/Wishlists/WishlistPagination";
import WishlistSearch from "./pages/Wishlists/WishlistSearch";
import WishlistStatistics from "./pages/Wishlists/WishlistStatistics";
import WishlistTable from "./pages/Wishlists/WishlistTable";
import WishlistToolbar from "./pages/Wishlists/WishlistToolbar";
import WishlistView from "./pages/Wishlists/WishlistView";

// =========================================================
// NOT FOUND
// =========================================================
import NotFound from "./pages/NotFound/NotFound";


function App() {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

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
          PROTECTED APPLICATION
          EVERYTHING BELOW IS INSIDE MAIN LAYOUT
      ===================================================== */}

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >

        {/* ===================================================
            DEFAULT
        =================================================== */}

        <Route
          index
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* ===================================================
            DASHBOARD
        =================================================== */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* ===================================================
            PROFILE
        =================================================== */}

        <Route
          path="/profile"
          element={<UserProfile />}
        />

        <Route
          path="/profile/card"
          element={<UserProfileCard />}
        />


        {/* ===================================================
            BRANDS
        =================================================== */}

        <Route path="/brands" element={<BrandList />} />
        <Route path="/brands/card" element={<BrandCard />} />
        <Route path="/brands/create" element={<BrandCreate />} />
        <Route path="/brands/details/:id" element={<BrandDetails />} />
        <Route path="/brands/edit/:id" element={<BrandEdit />} />
        <Route path="/brands/filters" element={<BrandFilters />} />
        <Route path="/brands/form" element={<BrandForm />} />
        <Route path="/brands/modal" element={<BrandModal />} />
        <Route path="/brands/pagination" element={<BrandPagination />} />
        <Route path="/brands/search" element={<BrandSearch />} />
        <Route path="/brands/statistics" element={<BrandStatistics />} />
        <Route path="/brands/table" element={<BrandTable />} />
        <Route path="/brands/toolbar" element={<BrandToolbar />} />
        <Route path="/brands/view/:id" element={<BrandView />} />
        <Route path="/brands/delete/:id" element={<DeleteBrandDialog />} />


        {/* ===================================================
            CATALOG
        =================================================== */}

        <Route path="/catalog" element={<CatalogList />} />
        <Route path="/catalog/attributes" element={<CatalogAttributes />} />
        <Route path="/catalog/card" element={<CatalogCard />} />
        <Route path="/catalog/images" element={<CatalogImages />} />
        <Route path="/catalog/marketplace" element={<CatalogMarketplace />} />
        <Route path="/catalog/modal" element={<CatalogModal />} />
        <Route path="/catalog/pagination" element={<CatalogPagination />} />
        <Route path="/catalog/publish" element={<CatalogPublish />} />
        <Route path="/catalog/search" element={<CatalogSearch />} />
        <Route path="/catalog/statistics" element={<CatalogStatistics />} />
        <Route path="/catalog/table" element={<CatalogTable />} />
        <Route path="/catalog/toolbar" element={<CatalogToolbar />} />
        <Route path="/catalog/variants" element={<CatalogVariants />} />
        <Route path="/catalog/view/:id" element={<CatalogView />} />
        <Route path="/catalog/delete/:id" element={<DeleteCatalogDialog />} />


        {/* ===================================================
            CATEGORIES
        =================================================== */}

        <Route path="/categories" element={<CategoryList />} />
        <Route path="/categories/card" element={<CategoryCard />} />
        <Route path="/categories/create" element={<CategoryCreate />} />
        <Route path="/categories/details/:id" element={<CategoryDetails />} />
        <Route path="/categories/edit/:id" element={<CategoryEdit />} />
        <Route path="/categories/filters" element={<CategoryFilters />} />
        <Route path="/categories/form" element={<CategoryForm />} />
        <Route path="/categories/modal" element={<CategoryModal />} />
        <Route path="/categories/pagination" element={<CategoryPagination />} />
        <Route path="/categories/search" element={<CategorySearch />} />
        <Route path="/categories/statistics" element={<CategoryStatistics />} />
        <Route path="/categories/table" element={<CategoryTable />} />
        <Route path="/categories/toolbar" element={<CategoryToolbar />} />
        <Route path="/categories/view/:id" element={<CategoryView />} />
        <Route path="/categories/delete/:id" element={<DeleteCategoryDialog />} />


        {/* ===================================================
            CUSTOMER ADDRESSES
        =================================================== */}

        <Route path="/customer-addresses" element={<CustomerAddressList />} />
        <Route path="/customer-addresses/card" element={<CustomerAddressCard />} />
        <Route path="/customer-addresses/modal" element={<CustomerAddressModal />} />
        <Route path="/customer-addresses/pagination" element={<CustomerAddressPagination />} />
        <Route path="/customer-addresses/search" element={<CustomerAddressSearch />} />
        <Route path="/customer-addresses/statistics" element={<CustomerAddressStatistics />} />
        <Route path="/customer-addresses/table" element={<CustomerAddressTable />} />
        <Route path="/customer-addresses/toolbar" element={<CustomerAddressToolbar />} />
        <Route path="/customer-addresses/view/:id" element={<CustomerAddressView />} />
        <Route path="/customer-addresses/delete/:id" element={<DeleteCustomerAddressDialog />} />


        {/* ===================================================
            CUSTOMER PAYMENTS
        =================================================== */}

        <Route path="/customer-payments" element={<CustomerPaymentList />} />
        <Route path="/customer-payments/card" element={<CustomerPaymentCard />} />
        <Route path="/customer-payments/modal" element={<CustomerPaymentModal />} />
        <Route path="/customer-payments/pagination" element={<CustomerPaymentPagination />} />
        <Route path="/customer-payments/search" element={<CustomerPaymentSearch />} />
        <Route path="/customer-payments/statistics" element={<CustomerPaymentStatistics />} />
        <Route path="/customer-payments/table" element={<CustomerPaymentTable />} />
        <Route path="/customer-payments/toolbar" element={<CustomerPaymentToolbar />} />
        <Route path="/customer-payments/view/:id" element={<CustomerPaymentView />} />
        <Route path="/customer-payments/delete/:id" element={<DeleteCustomerPaymentDialog />} />


        {/* ===================================================
            CUSTOMER RETURNS
        =================================================== */}

        <Route path="/customer-returns" element={<CustomerReturnList />} />
        <Route path="/customer-returns/card" element={<CustomerReturnCard />} />
        <Route path="/customer-returns/modal" element={<CustomerReturnModal />} />
        <Route path="/customer-returns/pagination" element={<CustomerReturnPagination />} />
        <Route path="/customer-returns/search" element={<CustomerReturnSearch />} />
        <Route path="/customer-returns/statistics" element={<CustomerReturnStatistics />} />
        <Route path="/customer-returns/table" element={<CustomerReturnTable />} />
        <Route path="/customer-returns/toolbar" element={<CustomerReturnToolbar />} />
        <Route path="/customer-returns/view/:id" element={<CustomerReturnView />} />
        <Route path="/customer-returns/delete/:id" element={<DeleteCustomerReturnDialog />} />


        {/* ===================================================
            DELIVERY CHALLANS
        =================================================== */}

        <Route path="/delivery-challans" element={<DeliveryChallanList />} />
        <Route path="/delivery-challans/card" element={<DeliveryChallanCard />} />
        <Route path="/delivery-challans/modal" element={<DeliveryChallanModal />} />
        <Route path="/delivery-challans/pagination" element={<DeliveryChallanPagination />} />
        <Route path="/delivery-challans/search" element={<DeliveryChallanSearch />} />
        <Route path="/delivery-challans/statistics" element={<DeliveryChallanStatistics />} />
        <Route path="/delivery-challans/table" element={<DeliveryChallanTable />} />
        <Route path="/delivery-challans/toolbar" element={<DeliveryChallanToolbar />} />
        <Route path="/delivery-challans/view/:id" element={<DeliveryChallanView />} />
        <Route path="/delivery-challans/delete/:id" element={<DeleteDeliveryChallanDialog />} />


        {/* ===================================================
            DELIVERY CHALLAN ITEMS
        =================================================== */}

        <Route path="/delivery-challan-items" element={<DeliveryChallanItemList />} />
        <Route path="/delivery-challan-items/card" element={<DeliveryChallanItemCard />} />
        <Route path="/delivery-challan-items/modal" element={<DeliveryChallanItemModal />} />
        <Route path="/delivery-challan-items/pagination" element={<DeliveryChallanItemPagination />} />
        <Route path="/delivery-challan-items/search" element={<DeliveryChallanItemSearch />} />
        <Route path="/delivery-challan-items/statistics" element={<DeliveryChallanItemStatistics />} />
        <Route path="/delivery-challan-items/table" element={<DeliveryChallanItemTable />} />
        <Route path="/delivery-challan-items/toolbar" element={<DeliveryChallanItemToolbar />} />
        <Route path="/delivery-challan-items/view/:id" element={<DeliveryChallanItemView />} />
        <Route path="/delivery-challan-items/delete/:id" element={<DeleteDeliveryChallanItemDialog />} />


        {/* ===================================================
            GOODS RECEIPT NOTES
        =================================================== */}

        <Route path="/goods-receipt-notes" element={<GoodsReceiptNoteList />} />
        <Route path="/goods-receipt-notes/card" element={<GoodsReceiptNoteCard />} />
        <Route path="/goods-receipt-notes/modal" element={<GoodsReceiptNoteModal />} />
        <Route path="/goods-receipt-notes/pagination" element={<GoodsReceiptNotePagination />} />
        <Route path="/goods-receipt-notes/search" element={<GoodsReceiptNoteSearch />} />
        <Route path="/goods-receipt-notes/statistics" element={<GoodsReceiptNoteStatistics />} />
        <Route path="/goods-receipt-notes/table" element={<GoodsReceiptNoteTable />} />
        <Route path="/goods-receipt-notes/toolbar" element={<GoodsReceiptNoteToolbar />} />
        <Route path="/goods-receipt-notes/view/:id" element={<GoodsReceiptNoteView />} />
        <Route path="/goods-receipt-notes/delete/:id" element={<DeleteGoodsReceiptNoteDialog />} />


        {/* ===================================================
            GOODS RECEIPT ITEMS
        =================================================== */}

        <Route path="/goods-receipt-note-items" element={<GoodsReceiptNoteItemList />} />
        <Route path="/goods-receipt-note-items/card" element={<GoodsReceiptNoteItemCard />} />
        <Route path="/goods-receipt-note-items/modal" element={<GoodsReceiptNoteItemModal />} />
        <Route path="/goods-receipt-note-items/pagination" element={<GoodsReceiptNoteItemPagination />} />
        <Route path="/goods-receipt-note-items/search" element={<GoodsReceiptNoteItemSearch />} />
        <Route path="/goods-receipt-note-items/statistics" element={<GoodsReceiptNoteItemStatistics />} />
        <Route path="/goods-receipt-note-items/table" element={<GoodsReceiptNoteItemTable />} />
        <Route path="/goods-receipt-note-items/toolbar" element={<GoodsReceiptNoteItemToolbar />} />
        <Route path="/goods-receipt-note-items/view/:id" element={<GoodsReceiptNoteItemView />} />
        <Route path="/goods-receipt-note-items/delete/:id" element={<DeleteGoodsReceiptNoteItemDialog />} />


        {/* ===================================================
            MARKETPLACE ORDER ITEMS
        =================================================== */}

        <Route path="/marketplace-order-items" element={<MarketplaceOrderItemList />} />
        <Route path="/marketplace-order-items/card" element={<MarketplaceOrderItemCard />} />
        <Route path="/marketplace-order-items/modal" element={<MarketplaceOrderItemModal />} />
        <Route path="/marketplace-order-items/pagination" element={<MarketplaceOrderItemPagination />} />
        <Route path="/marketplace-order-items/search" element={<MarketplaceOrderItemSearch />} />
        <Route path="/marketplace-order-items/statistics" element={<MarketplaceOrderItemStatistics />} />
        <Route path="/marketplace-order-items/table" element={<MarketplaceOrderItemTable />} />
        <Route path="/marketplace-order-items/toolbar" element={<MarketplaceOrderItemToolbar />} />
        <Route path="/marketplace-order-items/view/:id" element={<MarketplaceOrderItemView />} />
        <Route path="/marketplace-order-items/delete/:id" element={<DeleteMarketplaceOrderItemDialog />} />


        {/* ===================================================
            MARKETPLACE RETURNS
        =================================================== */}

        <Route path="/marketplace-returns" element={<MarketplaceReturnList />} />
        <Route path="/marketplace-returns/card" element={<MarketplaceReturnCard />} />
        <Route path="/marketplace-returns/modal" element={<MarketplaceReturnModal />} />
        <Route path="/marketplace-returns/pagination" element={<MarketplaceReturnPagination />} />
        <Route path="/marketplace-returns/search" element={<MarketplaceReturnSearch />} />
        <Route path="/marketplace-returns/statistics" element={<MarketplaceReturnStatistics />} />
        <Route path="/marketplace-returns/table" element={<MarketplaceReturnTable />} />
        <Route path="/marketplace-returns/toolbar" element={<MarketplaceReturnToolbar />} />
        <Route path="/marketplace-returns/view/:id" element={<MarketplaceReturnView />} />
        <Route path="/marketplace-returns/delete/:id" element={<DeleteMarketplaceReturnDialog />} />


        {/* ===================================================
            NOTIFICATIONS
        =================================================== */}

        <Route path="/notifications" element={<NotificationList />} />
        <Route path="/notifications/card" element={<NotificationCard />} />
        <Route path="/notifications/settings" element={<NotificationSettings />} />
        <Route path="/notifications/view/:id" element={<NotificationView />} />


        {/* ===================================================
            ORDER ITEMS
        =================================================== */}

        <Route path="/order-items" element={<OrderItemList />} />
        <Route path="/order-items/card" element={<OrderItemCard />} />
        <Route path="/order-items/modal" element={<OrderItemModal />} />
        <Route path="/order-items/pagination" element={<OrderItemPagination />} />
        <Route path="/order-items/search" element={<OrderItemSearch />} />
        <Route path="/order-items/statistics" element={<OrderItemStatistics />} />
        <Route path="/order-items/table" element={<OrderItemTable />} />
        <Route path="/order-items/toolbar" element={<OrderItemToolbar />} />
        <Route path="/order-items/view/:id" element={<OrderItemView />} />
        <Route path="/order-items/delete/:id" element={<DeleteOrderItemDialog />} />


        {/* ===================================================
            ORDER STATUS HISTORY
        =================================================== */}

        <Route path="/order-status-history" element={<OrderStatusHistoryList />} />
        <Route path="/order-status-history/card" element={<OrderStatusHistoryCard />} />
        <Route path="/order-status-history/modal" element={<OrderStatusHistoryModal />} />
        <Route path="/order-status-history/pagination" element={<OrderStatusHistoryPagination />} />
        <Route path="/order-status-history/search" element={<OrderStatusHistorySearch />} />
        <Route path="/order-status-history/statistics" element={<OrderStatusHistoryStatistics />} />
        <Route path="/order-status-history/table" element={<OrderStatusHistoryTable />} />
        <Route path="/order-status-history/toolbar" element={<OrderStatusHistoryToolbar />} />
        <Route path="/order-status-history/view/:id" element={<OrderStatusHistoryView />} />
        <Route path="/order-status-history/delete/:id" element={<DeleteOrderStatusHistoryDialog />} />


        {/* ===================================================
            PAYMENT SETTINGS
        =================================================== */}

        <Route path="/payments/settings" element={<PaymentSettings />} />
        <Route path="/payments/bank-details" element={<BankDetails />} />
        <Route path="/payments/gateway" element={<PaymentGateway />} />
        <Route path="/payments/upi" element={<UpiSettings />} />


        {/* ===================================================
            PRODUCT ATTRIBUTES
        =================================================== */}

        <Route path="/product-attributes" element={<ProductAttributeList />} />
        <Route path="/product-attributes/card" element={<ProductAttributeCard />} />
        <Route path="/product-attributes/modal" element={<ProductAttributeModal />} />
        <Route path="/product-attributes/pagination" element={<ProductAttributePagination />} />
        <Route path="/product-attributes/search" element={<ProductAttributeSearch />} />
        <Route path="/product-attributes/statistics" element={<ProductAttributeStatistics />} />
        <Route path="/product-attributes/table" element={<ProductAttributeTable />} />
        <Route path="/product-attributes/toolbar" element={<ProductAttributeToolbar />} />
        <Route path="/product-attributes/view/:id" element={<ProductAttributeView />} />
        <Route path="/product-attributes/delete/:id" element={<DeleteProductAttributeDialog />} />


        {/* ===================================================
            PRODUCT IMAGES
        =================================================== */}

        <Route path="/product-images" element={<ProductImageList />} />
        <Route path="/product-images/card" element={<ProductImageCard />} />
        <Route path="/product-images/modal" element={<ProductImageModal />} />
        <Route path="/product-images/pagination" element={<ProductImagePagination />} />
        <Route path="/product-images/search" element={<ProductImageSearch />} />
        <Route path="/product-images/statistics" element={<ProductImageStatistics />} />
        <Route path="/product-images/table" element={<ProductImageTable />} />
        <Route path="/product-images/toolbar" element={<ProductImageToolbar />} />
        <Route path="/product-images/view/:id" element={<ProductImageView />} />
        <Route path="/product-images/delete/:id" element={<DeleteProductImageDialog />} />


        {/* ===================================================
            PRODUCT INVENTORY
        =================================================== */}

        <Route path="/product-inventory" element={<ProductInventoryList />} />
        <Route path="/product-inventory/card" element={<ProductInventoryCard />} />
        <Route path="/product-inventory/details/:id" element={<ProductInventoryDetails />} />
        <Route path="/product-inventory/filters" element={<ProductInventoryFilters />} />
        <Route path="/product-inventory/modal" element={<ProductInventoryModal />} />
        <Route path="/product-inventory/pagination" element={<ProductInventoryPagination />} />
        <Route path="/product-inventory/search" element={<ProductInventorySearch />} />
        <Route path="/product-inventory/statistics" element={<ProductInventoryStatistics />} />
        <Route path="/product-inventory/table" element={<ProductInventoryTable />} />
        <Route path="/product-inventory/toolbar" element={<ProductInventoryToolbar />} />
        <Route path="/product-inventory/view/:id" element={<ProductInventoryView />} />
        <Route path="/product-inventory/delete/:id" element={<DeleteProductInventoryDialog />} />


        {/* ===================================================
            PRODUCT PRICES
        =================================================== */}

        <Route path="/product-prices" element={<ProductPriceList />} />
        <Route path="/product-prices/card" element={<ProductPriceCard />} />
        <Route path="/product-prices/create" element={<ProductPriceCreate />} />
        <Route path="/product-prices/details/:id" element={<ProductPriceDetails />} />
        <Route path="/product-prices/edit/:id" element={<ProductPriceEdit />} />
        <Route path="/product-prices/filters" element={<ProductPriceFilters />} />
        <Route path="/product-prices/form" element={<ProductPriceForm />} />
        <Route path="/product-prices/modal" element={<ProductPriceModal />} />
        <Route path="/product-prices/pagination" element={<ProductPricePagination />} />
        <Route path="/product-prices/search" element={<ProductPriceSearch />} />
        <Route path="/product-prices/statistics" element={<ProductPriceStatistics />} />
        <Route path="/product-prices/table" element={<ProductPriceTable />} />
        <Route path="/product-prices/toolbar" element={<ProductPriceToolbar />} />
        <Route path="/product-prices/view/:id" element={<ProductPriceView />} />
        <Route path="/product-prices/delete/:id" element={<DeleteProductPriceDialog />} />


        {/* ===================================================
            PRODUCTS
        =================================================== */}

        <Route path="/products" element={<Products />} />
        <Route path="/products/list" element={<ProductList />} />
        <Route path="/products/card" element={<ProductCard />} />
        <Route path="/products/create" element={<ProductCreate />} />
        <Route path="/products/details/:id" element={<ProductDetails />} />
        <Route path="/products/edit/:id" element={<ProductEdit />} />
        <Route path="/products/filters" element={<ProductFilters />} />
        <Route path="/products/form" element={<ProductForm />} />
        <Route path="/products/modal" element={<ProductModal />} />
        <Route path="/products/pagination" element={<ProductPagination />} />
        <Route path="/products/search" element={<ProductSearch />} />
        <Route path="/products/statistics" element={<ProductStatistics />} />
        <Route path="/products/table" element={<ProductTable />} />
        <Route path="/products/toolbar" element={<ProductToolbar />} />
        <Route path="/products/view/:id" element={<ProductView />} />
        <Route path="/products/delete/:id" element={<DeleteProductDialog />} />


        {/* ===================================================
            PRODUCT TYPES
        =================================================== */}

        <Route path="/product-types" element={<ProductTypeList />} />
        <Route path="/product-types/card" element={<ProductTypeCard />} />
        <Route path="/product-types/create" element={<ProductTypeCreate />} />
        <Route path="/product-types/details/:id" element={<ProductTypeDetails />} />
        <Route path="/product-types/edit/:id" element={<ProductTypeEdit />} />
        <Route path="/product-types/filters" element={<ProductTypeFilters />} />
        <Route path="/product-types/form" element={<ProductTypeForm />} />
        <Route path="/product-types/modal" element={<ProductTypeModal />} />
        <Route path="/product-types/pagination" element={<ProductTypePagination />} />
        <Route path="/product-types/search" element={<ProductTypeSearch />} />
        <Route path="/product-types/statistics" element={<ProductTypeStatistics />} />
        <Route path="/product-types/table" element={<ProductTypeTable />} />
        <Route path="/product-types/toolbar" element={<ProductTypeToolbar />} />
        <Route path="/product-types/view/:id" element={<ProductTypeView />} />
        <Route path="/product-types/delete/:id" element={<DeleteProductTypeDialog />} />


        {/* ===================================================
            PURCHASE ORDERS
        =================================================== */}

        <Route path="/purchase-orders" element={<PurchaseOrderList />} />
        <Route path="/purchase-orders/card" element={<PurchaseOrderCard />} />
        <Route path="/purchase-orders/modal" element={<PurchaseOrderModal />} />
        <Route path="/purchase-orders/pagination" element={<PurchaseOrderPagination />} />
        <Route path="/purchase-orders/search" element={<PurchaseOrderSearch />} />
        <Route path="/purchase-orders/statistics" element={<PurchaseOrderStatistics />} />
        <Route path="/purchase-orders/table" element={<PurchaseOrderTable />} />
        <Route path="/purchase-orders/toolbar" element={<PurchaseOrderToolbar />} />
        <Route path="/purchase-orders/view/:id" element={<PurchaseOrderView />} />
        <Route path="/purchase-orders/delete/:id" element={<DeletePurchaseOrderDialog />} />


        {/* ===================================================
            PURCHASE ORDER ITEMS
        =================================================== */}

        <Route path="/purchase-order-items" element={<PurchaseOrderItemList />} />
        <Route path="/purchase-order-items/card" element={<PurchaseOrderItemCard />} />
        <Route path="/purchase-order-items/modal" element={<PurchaseOrderItemModal />} />
        <Route path="/purchase-order-items/pagination" element={<PurchaseOrderItemPagination />} />
        <Route path="/purchase-order-items/search" element={<PurchaseOrderItemSearch />} />
        <Route path="/purchase-order-items/statistics" element={<PurchaseOrderItemStatistics />} />
        <Route path="/purchase-order-items/table" element={<PurchaseOrderItemTable />} />
        <Route path="/purchase-order-items/toolbar" element={<PurchaseOrderItemToolbar />} />
        <Route path="/purchase-order-items/view/:id" element={<PurchaseOrderItemView />} />
        <Route path="/purchase-order-items/delete/:id" element={<DeletePurchaseOrderItemDialog />} />


        {/* ===================================================
            PURCHASE RETURNS
        =================================================== */}

        <Route path="/purchase-returns" element={<PurchaseReturnList />} />
        <Route path="/purchase-returns/card" element={<PurchaseReturnCard />} />
        <Route path="/purchase-returns/modal" element={<PurchaseReturnModal />} />
        <Route path="/purchase-returns/pagination" element={<PurchaseReturnPagination />} />
        <Route path="/purchase-returns/search" element={<PurchaseReturnSearch />} />
        <Route path="/purchase-returns/statistics" element={<PurchaseReturnStatistics />} />
        <Route path="/purchase-returns/table" element={<PurchaseReturnTable />} />
        <Route path="/purchase-returns/toolbar" element={<PurchaseReturnToolbar />} />
        <Route path="/purchase-returns/view/:id" element={<PurchaseReturnView />} />
        <Route path="/purchase-returns/delete/:id" element={<DeletePurchaseReturnDialog />} />


        {/* ===================================================
            REVIEWS
        =================================================== */}

        <Route path="/reviews" element={<ReviewList />} />
        <Route path="/reviews/card" element={<ReviewCard />} />
        <Route path="/reviews/modal" element={<ReviewModal />} />
        <Route path="/reviews/pagination" element={<ReviewPagination />} />
        <Route path="/reviews/search" element={<ReviewSearch />} />
        <Route path="/reviews/statistics" element={<ReviewStatistics />} />
        <Route path="/reviews/table" element={<ReviewTable />} />
        <Route path="/reviews/toolbar" element={<ReviewToolbar />} />
        <Route path="/reviews/view/:id" element={<ReviewView />} />
        <Route path="/reviews/delete/:id" element={<DeleteReviewDialog />} />


        {/* ===================================================
            SALES INVOICES
        =================================================== */}

        <Route path="/sales-invoices" element={<SalesInvoiceList />} />
        <Route path="/sales-invoices/card" element={<SalesInvoiceCard />} />
        <Route path="/sales-invoices/modal" element={<SalesInvoiceModal />} />
        <Route path="/sales-invoices/pagination" element={<SalesInvoicePagination />} />
        <Route path="/sales-invoices/search" element={<SalesInvoiceSearch />} />
        <Route path="/sales-invoices/statistics" element={<SalesInvoiceStatistics />} />
        <Route path="/sales-invoices/table" element={<SalesInvoiceTable />} />
        <Route path="/sales-invoices/toolbar" element={<SalesInvoiceToolbar />} />
        <Route path="/sales-invoices/view/:id" element={<SalesInvoiceView />} />
        <Route path="/sales-invoices/delete/:id" element={<DeleteSalesInvoiceDialog />} />


        {/* ===================================================
            SALES ORDERS
        =================================================== */}

        <Route path="/sales-orders" element={<SalesOrderList />} />
        <Route path="/sales-orders/card" element={<SalesOrderCard />} />
        <Route path="/sales-orders/modal" element={<SalesOrderModal />} />
        <Route path="/sales-orders/pagination" element={<SalesOrderPagination />} />
        <Route path="/sales-orders/search" element={<SalesOrderSearch />} />
        <Route path="/sales-orders/statistics" element={<SalesOrderStatistics />} />
        <Route path="/sales-orders/table" element={<SalesOrderTable />} />
        <Route path="/sales-orders/toolbar" element={<SalesOrderToolbar />} />
        <Route path="/sales-orders/view/:id" element={<SalesOrderView />} />
        <Route path="/sales-orders/delete/:id" element={<DeleteSalesOrderDialog />} />


        {/* ===================================================
            SALES ORDER ITEMS
        =================================================== */}

        <Route path="/sales-order-items" element={<SalesOrderItemList />} />
        <Route path="/sales-order-items/card" element={<SalesOrderItemCard />} />
        <Route path="/sales-order-items/modal" element={<SalesOrderItemModal />} />
        <Route path="/sales-order-items/pagination" element={<SalesOrderItemPagination />} />
        <Route path="/sales-order-items/search" element={<SalesOrderItemSearch />} />
        <Route path="/sales-order-items/statistics" element={<SalesOrderItemStatistics />} />
        <Route path="/sales-order-items/table" element={<SalesOrderItemTable />} />
        <Route path="/sales-order-items/toolbar" element={<SalesOrderItemToolbar />} />
        <Route path="/sales-order-items/view/:id" element={<SalesOrderItemView />} />
        <Route path="/sales-order-items/delete/:id" element={<DeleteSalesOrderItemDialog />} />


        {/* ===================================================
            SELLER CUSTOMERS
        =================================================== */}

        <Route path="/seller-customers" element={<SellerCustomerList />} />
        <Route path="/seller-customers/card" element={<SellerCustomerCard />} />
        <Route path="/seller-customers/modal" element={<SellerCustomerModal />} />
        <Route path="/seller-customers/pagination" element={<SellerCustomerPagination />} />
        <Route path="/seller-customers/search" element={<SellerCustomerSearch />} />
        <Route path="/seller-customers/statistics" element={<SellerCustomerStatistics />} />
        <Route path="/seller-customers/table" element={<SellerCustomerTable />} />
        <Route path="/seller-customers/toolbar" element={<SellerCustomerToolbar />} />
        <Route path="/seller-customers/view/:id" element={<SellerCustomerView />} />
        <Route path="/seller-customers/delete/:id" element={<DeleteSellerCustomerDialog />} />


        {/* ===================================================
            SHIPMENTS
        =================================================== */}

        <Route path="/shipments" element={<ShipmentList />} />
        <Route path="/shipments/card" element={<ShipmentCard />} />
        <Route path="/shipments/modal" element={<ShipmentModal />} />
        <Route path="/shipments/pagination" element={<ShipmentPagination />} />
        <Route path="/shipments/search" element={<ShipmentSearch />} />
        <Route path="/shipments/statistics" element={<ShipmentStatistics />} />
        <Route path="/shipments/table" element={<ShipmentTable />} />
        <Route path="/shipments/toolbar" element={<ShipmentToolbar />} />
        <Route path="/shipments/view/:id" element={<ShipmentView />} />
        <Route path="/shipments/delete/:id" element={<DeleteShipmentDialog />} />


        {/* ===================================================
            WISHLISTS
        =================================================== */}

        <Route path="/wishlists" element={<WishlistList />} />
        <Route path="/wishlists/card" element={<WishlistCard />} />
        <Route path="/wishlists/modal" element={<WishlistModal />} />
        <Route path="/wishlists/pagination" element={<WishlistPagination />} />
        <Route path="/wishlists/search" element={<WishlistSearch />} />
        <Route path="/wishlists/statistics" element={<WishlistStatistics />} />
        <Route path="/wishlists/table" element={<WishlistTable />} />
        <Route path="/wishlists/toolbar" element={<WishlistToolbar />} />
        <Route path="/wishlists/view/:id" element={<WishlistView />} />
        <Route path="/wishlists/delete/:id" element={<DeleteWishlistDialog />} />

      </Route>


      {/* =====================================================
          404
      ===================================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default App;
