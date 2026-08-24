import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// =========================================================
// LAYOUT & AUTHENTICATION
// =========================================================
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

// AUTH MANAGEMENT
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
import CatalogSEO from "./pages/Catalog/CatalogSEO";
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
// DELIVERY CHALLAN ITEM
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
// GOODS RECEIPT ITEMS
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
// GOODS RECEIPT NOTES
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
// MARKETPLACE ORDER ITEM
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
// MARKETPLACE RETURN
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
// NOT FOUND & NOTIFICATIONS
// =========================================================
import NotFound from "./pages/NotFound/NotFound";
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
// PAYMENTS SETTINGS
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
// PROFILE
// =========================================================
import ChangePassword from "./pages/Profile/ChangePassword";
import Profile from "./pages/Profile/Profile";
import ProfileAvatar from "./pages/Profile/ProfileAvatar";
import ProfileEdit from "./pages/Profile/ProfileEdit";
import ProfileView from "./pages/Profile/ProfileView";

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
// CORRECT:
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
// REPORTS SUB-COMPONENTS
// =========================================================
// 1. CustomerReport
import CustomerReportCard from "./pages/Reports/CustomerReport/CustomerReportCard";
import CustomerReportExport from "./pages/Reports/CustomerReport/CustomerReportExport";
import CustomerReportFilter from "./pages/Reports/CustomerReport/CustomerReportFilter";
import CustomerReportList from "./pages/Reports/CustomerReport/CustomerReportList";
import CustomerReportModal from "./pages/Reports/CustomerReport/CustomerReportModal";
import CustomerReportPagination from "./pages/Reports/CustomerReport/CustomerReportPagination";
import CustomerReportSearch from "./pages/Reports/CustomerReport/CustomerReportSearch";
import CustomerReportStatistics from "./pages/Reports/CustomerReport/CustomerReportStatistics";
import CustomerReportTable from "./pages/Reports/CustomerReport/CustomerReportTable";
import CustomerReportToolbar from "./pages/Reports/CustomerReport/CustomerReportToolbar";
import CustomerReportView from "./pages/Reports/CustomerReport/CustomerReportView";

// 2. DashboardReport
import DashboardReportCard from "./pages/Reports/DashboardReport/DashboardReportCard";
import DashboardReportExport from "./pages/Reports/DashboardReport/DashboardReportExport";
import DashboardReportFilter from "./pages/Reports/DashboardReport/DashboardReportFilter";
import DashboardReportList from "./pages/Reports/DashboardReport/DashboardReportList";
import DashboardReportModal from "./pages/Reports/DashboardReport/DashboardReportModal";
import DashboardReportPagination from "./pages/Reports/DashboardReport/DashboardReportPagination";
import DashboardReportSearch from "./pages/Reports/DashboardReport/DashboardReportSearch";
import DashboardReportStatistics from "./pages/Reports/DashboardReport/DashboardReportStatistics";
import DashboardReportTable from "./pages/Reports/DashboardReport/DashboardReportTable";
import DashboardReportToolbar from "./pages/Reports/DashboardReport/DashboardReportToolbar";
import DashboardReportView from "./pages/Reports/DashboardReport/DashboardReportView";

// 3. InventoryReport
import InventoryReportCard from "./pages/Reports/InventoryReport/InventoryReportCard";
import InventoryReportExport from "./pages/Reports/InventoryReport/InventoryReportExport";
import InventoryReportFilter from "./pages/Reports/InventoryReport/InventoryReportFilter";
import InventoryReportList from "./pages/Reports/InventoryReport/InventoryReportList";
import InventoryReportModal from "./pages/Reports/InventoryReport/InventoryReportModal";
import InventoryReportPagination from "./pages/Reports/InventoryReport/InventoryReportPagination";
import InventoryReportSearch from "./pages/Reports/InventoryReport/InventoryReportSearch";
import InventoryReportStatistics from "./pages/Reports/InventoryReport/InventoryReportStatistics";
import InventoryReportTable from "./pages/Reports/InventoryReport/InventoryReportTable";
import InventoryReportToolbar from "./pages/Reports/InventoryReport/InventoryReportToolbar";
import InventoryReportView from "./pages/Reports/InventoryReport/InventoryReportView";

// 4. LowStockReport
import LowStockReportCard from "./pages/Reports/LowStockReport/LowStockReportCard";
import LowStockReportExport from "./pages/Reports/LowStockReport/LowStockReportExport";
import LowStockReportFilter from "./pages/Reports/LowStockReport/LowStockReportFilter";
import LowStockReportList from "./pages/Reports/LowStockReport/LowStockReportList";
import LowStockReportModal from "./pages/Reports/LowStockReport/LowStockReportModal";
import LowStockReportPagination from "./pages/Reports/LowStockReport/LowStockReportPagination";
import LowStockReportSearch from "./pages/Reports/LowStockReport/LowStockReportSearch";
import LowStockReportStatistics from "./pages/Reports/LowStockReport/LowStockReportStatistics";
import LowStockReportTable from "./pages/Reports/LowStockReport/LowStockReportTable";
import LowStockReportToolbar from "./pages/Reports/LowStockReport/LowStockReportToolbar";
import LowStockReportView from "./pages/Reports/LowStockReport/LowStockReportView";

// 5. MarketplaceReport
import MarketplaceReportCard from "./pages/Reports/MarketplaceReport/MarketplaceReportCard";
import MarketplaceReportExport from "./pages/Reports/MarketplaceReport/MarketplaceReportExport";
import MarketplaceReportFilter from "./pages/Reports/MarketplaceReport/MarketplaceReportFilter";
import MarketplaceReportList from "./pages/Reports/MarketplaceReport/MarketplaceReportList";
import MarketplaceReportModal from "./pages/Reports/MarketplaceReport/MarketplaceReportModal";
import MarketplaceReportPagination from "./pages/Reports/MarketplaceReport/MarketplaceReportPagination";
import MarketplaceReportSearch from "./pages/Reports/MarketplaceReport/MarketplaceReportSearch";
import MarketplaceReportStatistics from "./pages/Reports/MarketplaceReport/MarketplaceReportStatistics";
import MarketplaceReportTable from "./pages/Reports/MarketplaceReport/MarketplaceReportTable";
import MarketplaceReportToolbar from "./pages/Reports/MarketplaceReport/MarketplaceReportToolbar";
import MarketplaceReportView from "./pages/Reports/MarketplaceReport/MarketplaceReportView";

// 6. OrderReport
import OrderReportCard from "./pages/Reports/OrderReport/OrderReportCard";
import OrderReportExport from "./pages/Reports/OrderReport/OrderReportExport";
import OrderReportFilter from "./pages/Reports/OrderReport/OrderReportFilter";
import OrderReportList from "./pages/Reports/OrderReport/OrderReportList";
import OrderReportModal from "./pages/Reports/OrderReport/OrderReportModal";
import OrderReportPagination from "./pages/Reports/OrderReport/OrderReportPagination";
import OrderReportSearch from "./pages/Reports/OrderReport/OrderReportSearch";
import OrderReportStatistics from "./pages/Reports/OrderReport/OrderReportStatistics";
import OrderReportTable from "./pages/Reports/OrderReport/OrderReportTable";
import OrderReportToolbar from "./pages/Reports/OrderReport/OrderReportToolbar";
import OrderReportView from "./pages/Reports/OrderReport/OrderReportView";

// 7. PaymentReport
import PaymentReportCard from "./pages/Reports/PaymentReport/PaymentReportCard";
import PaymentReportExport from "./pages/Reports/PaymentReport/PaymentReportExport";
import PaymentReportFilter from "./pages/Reports/PaymentReport/PaymentReportFilter";
import PaymentReportList from "./pages/Reports/PaymentReport/PaymentReportList";
import PaymentReportPagination from "./pages/Reports/PaymentReport/PaymentReportPagination";
import PaymentReportSearch from "./pages/Reports/PaymentReport/PaymentReportSearch";
import PaymentReportStatistics from "./pages/Reports/PaymentReport/PaymentReportStatistics";
import PaymentReportTable from "./pages/Reports/PaymentReport/PaymentReportTable";
import PaymentReportToolbar from "./pages/Reports/PaymentReport/PaymentReportToolbar";
import PaymentReportView from "./pages/Reports/PaymentReport/PaymentReportView";

// 8. ProfitLossReport
import ProfitLossReportCard from "./pages/Reports/ProfitLossReport/ProfitLossReportCard";
import ProfitLossReportExport from "./pages/Reports/ProfitLossReport/ProfitLossReportExport";
import ProfitLossReportFilter from "./pages/Reports/ProfitLossReport/ProfitLossReportFilter";
import ProfitLossReportList from "./pages/Reports/ProfitLossReport/ProfitLossReportList";
import ProfitLossReportModal from "./pages/Reports/ProfitLossReport/ProfitLossReportModal";
import ProfitLossReportPagination from "./pages/Reports/ProfitLossReport/ProfitLossReportPagination";
import ProfitLossReportSearch from "./pages/Reports/ProfitLossReport/ProfitLossReportSearch";
import ProfitLossReportStatistics from "./pages/Reports/ProfitLossReport/ProfitLossReportStatistics";
import ProfitLossReportTable from "./pages/Reports/ProfitLossReport/ProfitLossReportTable";
import ProfitLossReportToolbar from "./pages/Reports/ProfitLossReport/ProfitLossReportToolbar";
import ProfitLossReportView from "./pages/Reports/ProfitLossReport/ProfitLossReportView";

// 9. PurchaseReport
import PurchaseReportCard from "./pages/Reports/PurchaseReport/PurchaseReportCard";
import PurchaseReportExport from "./pages/Reports/PurchaseReport/PurchaseReportExport";
import PurchaseReportFilter from "./pages/Reports/PurchaseReport/PurchaseReportFilter";
import PurchaseReportList from "./pages/Reports/PurchaseReport/PurchaseReportList";
import PurchaseReportModal from "./pages/Reports/PurchaseReport/PurchaseReportModal";
import PurchaseReportPagination from "./pages/Reports/PurchaseReport/PurchaseReportPagination";
import PurchaseReportSearch from "./pages/Reports/PurchaseReport/PurchaseReportSearch";
import PurchaseReportStatistics from "./pages/Reports/PurchaseReport/PurchaseReportStatistics";
import PurchaseReportTable from "./pages/Reports/PurchaseReport/PurchaseReportTable";
import PurchaseReportToolbar from "./pages/Reports/PurchaseReport/PurchaseReportToolbar";
import PurchaseReportView from "./pages/Reports/PurchaseReport/PurchaseReportView";

// 10. ReturnReport
import ReturnReportCard from "./pages/Reports/ReturnReport/ReturnReportCard";
import ReturnReportExport from "./pages/Reports/ReturnReport/ReturnReportExport";
import ReturnReportFilter from "./pages/Reports/ReturnReport/ReturnReportFilter";
import ReturnReportList from "./pages/Reports/ReturnReport/ReturnReportList";
import ReturnReportModal from "./pages/Reports/ReturnReport/ReturnReportModal";
import ReturnReportPagination from "./pages/Reports/ReturnReport/ReturnReportPagination";
import ReturnReportSearch from "./pages/Reports/ReturnReport/ReturnReportSearch";
import ReturnReportStatistics from "./pages/Reports/ReturnReport/ReturnReportStatistics";
import ReturnReportTable from "./pages/Reports/ReturnReport/ReturnReportTable";
import ReturnReportToolbar from "./pages/Reports/ReturnReport/ReturnReportToolbar";
import ReturnReportView from "./pages/Reports/ReturnReport/ReturnReportView";

// 11. SalesReport
import SalesReportCard from "./pages/Reports/SalesReport/SalesReportCard";
import SalesReportChart from "./pages/Reports/SalesReport/SalesReportChart";
import SalesReportExport from "./pages/Reports/SalesReport/SalesReportExport";
import SalesReportFilter from "./pages/Reports/SalesReport/SalesReportFilter";
import SalesReportList from "./pages/Reports/SalesReport/SalesReportList";
import SalesReportModal from "./pages/Reports/SalesReport/SalesReportModal";
import SalesReportPagination from "./pages/Reports/SalesReport/SalesReportPagination";
import SalesReportSearch from "./pages/Reports/SalesReport/SalesReportSearch";
import SalesReportStatistics from "./pages/Reports/SalesReport/SalesReportStatistics";
import SalesReportTable from "./pages/Reports/SalesReport/SalesReportTable";
import SalesReportToolbar from "./pages/Reports/SalesReport/SalesReportToolbar";
import SalesReportView from "./pages/Reports/SalesReport/SalesReportView";

// 12. StockLedgerReport
import StockLedgerReportCard from "./pages/Reports/StockLedgerReport/StockLedgerReportCard";
import StockLedgerReportChart from "./pages/Reports/StockLedgerReport/StockLedgerReportChart";
import StockLedgerReportExport from "./pages/Reports/StockLedgerReport/StockLedgerReportExport";
import StockLedgerReportFilter from "./pages/Reports/StockLedgerReport/StockLedgerReportFilter";
import StockLedgerReportList from "./pages/Reports/StockLedgerReport/StockLedgerReportList";
import StockLedgerReportModal from "./pages/Reports/StockLedgerReport/StockLedgerReportModal";
import StockLedgerReportPagination from "./pages/Reports/StockLedgerReport/StockLedgerReportPagination";
import StockLedgerReportSearch from "./pages/Reports/StockLedgerReport/StockLedgerReportSearch";
import StockLedgerReportStatistics from "./pages/Reports/StockLedgerReport/StockLedgerReportStatistics";
import StockLedgerReportTable from "./pages/Reports/StockLedgerReport/StockLedgerReportTable";
import StockLedgerReportToolbar from "./pages/Reports/StockLedgerReport/StockLedgerReportToolbar";
import StockLedgerReportView from "./pages/Reports/StockLedgerReport/StockLedgerReportView";

// 13. StockMovementReport
import StockMovementReportCard from "./pages/Reports/StockMovementReport/StockMovementReportCard";
import StockMovementReportChart from "./pages/Reports/StockMovementReport/StockMovementReportChart";
import StockMovementReportExport from "./pages/Reports/StockMovementReport/StockMovementReportExport";
import StockMovementReportFilter from "./pages/Reports/StockMovementReport/StockMovementReportFilter";
import StockMovementReportList from "./pages/Reports/StockMovementReport/StockMovementReportList";
import StockMovementReportModal from "./pages/Reports/StockMovementReport/StockMovementReportModal";
import StockMovementReportPagination from "./pages/Reports/StockMovementReport/StockMovementReportPagination";
import StockMovementReportSearch from "./pages/Reports/StockMovementReport/StockMovementReportSearch";
import StockMovementReportStatistics from "./pages/Reports/StockMovementReport/StockMovementReportStatistics";
import StockMovementReportTable from "./pages/Reports/StockMovementReport/StockMovementReportTable";
import StockMovementReportToolbar from "./pages/Reports/StockMovementReport/StockMovementReportToolbar";
import StockMovementReportView from "./pages/Reports/StockMovementReport/StockMovementReportView";

// 14. SuppliesReport
import SuppliesReportCard from "./pages/Reports/SuppliesReport/SuppliesReportCard";
import SuppliesReportChart from "./pages/Reports/SuppliesReport/SuppliesReportChart";
import SuppliesReportExport from "./pages/Reports/SuppliesReport/SuppliesReportExport";
import SuppliesReportFilter from "./pages/Reports/SuppliesReport/SuppliesReportFilter";
import SuppliesReportList from "./pages/Reports/SuppliesReport/SuppliesReportList";
import SuppliesReportModal from "./pages/Reports/SuppliesReport/SuppliesReportModal";
import SuppliesReportPagination from "./pages/Reports/SuppliesReport/SuppliesReportPagination";
import SuppliesReportSearch from "./pages/Reports/SuppliesReport/SuppliesReportSearch";
import SuppliesReportStatistics from "./pages/Reports/SuppliesReport/SuppliesReportStatistics";
import SuppliesReportTable from "./pages/Reports/SuppliesReport/SuppliesReportTable";
import SuppliesReportToolbar from "./pages/Reports/SuppliesReport/SuppliesReportToolbar";
import SuppliesReportView from "./pages/Reports/SuppliesReport/SuppliesReporView";

// 15. TaxReport
import TaxReportCard from "./pages/Reports/TaxReport/TaxReportCard";
import TaxReportChart from "./pages/Reports/TaxReport/TaxReportChart";
import TaxReportExport from "./pages/Reports/TaxReport/TaxReportExport";
import TaxReportFilter from "./pages/Reports/TaxReport/TaxReportFilter";
import TaxReportList from "./pages/Reports/TaxReport/TaxReportList";
import TaxReportModal from "./pages/Reports/TaxReport/TaxReportModal";
import TaxReportPagination from "./pages/Reports/TaxReport/TaxReportPagination";
import TaxReportSearch from "./pages/Reports/TaxReport/TaxReportSearch";
import TaxReportStatistics from "./pages/Reports/TaxReport/TaxReportStatistics";
import TaxReportTable from "./pages/Reports/TaxReport/TaxReportTable";
import TaxReportToolbar from "./pages/Reports/TaxReport/TaxReportToolbar";
import TaxReportView from "./pages/Reports/TaxReport/TaxReportView";

function App() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Layout Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* User Profile */}
        <Route path="profile" element={<Profile />} />
        <Route path="profile/edit" element={<ProfileEdit />} />
        <Route path="profile/avatar" element={<ProfileAvatar />} />
        <Route path="profile/view" element={<ProfileView />} />
        <Route path="profile/change-password" element={<ChangePassword />} />
        <Route path="user-profile" element={<UserProfile />} />
        <Route path="user-profile/card" element={<UserProfileCard />} />

        {/* Brands */}
        <Route path="brands" element={<BrandList />} />
        <Route path="brands/create" element={<BrandCreate />} />
        <Route path="brands/edit/:id" element={<BrandEdit />} />
        <Route path="brands/details/:id" element={<BrandDetails />} />
        <Route path="brands/view" element={<BrandView />} />
        <Route path="brands/card" element={<BrandCard />} />
        <Route path="brands/filters" element={<BrandFilters />} />
        <Route path="brands/form" element={<BrandForm />} />
        <Route path="brands/modal" element={<BrandModal />} />
        <Route path="brands/pagination" element={<BrandPagination />} />
        <Route path="brands/search" element={<BrandSearch />} />
        <Route path="brands/statistics" element={<BrandStatistics />} />
        <Route path="brands/table" element={<BrandTable />} />
        <Route path="brands/toolbar" element={<BrandToolbar />} />
        <Route path="brands/delete" element={<DeleteBrandDialog />} />

        {/* Catalog */}
        <Route path="catalog" element={<CatalogList />} />
        <Route path="catalog/attributes" element={<CatalogAttributes />} />
        <Route path="catalog/card" element={<CatalogCard />} />
        <Route path="catalog/images" element={<CatalogImages />} />
        <Route path="catalog/marketplace" element={<CatalogMarketplace />} />
        <Route path="catalog/modal" element={<CatalogModal />} />
        <Route path="catalog/pagination" element={<CatalogPagination />} />
        <Route path="catalog/publish" element={<CatalogPublish />} />
        <Route path="catalog/search" element={<CatalogSearch />} />
        <Route path="catalog/seo" element={<CatalogSEO />} />
        <Route path="catalog/statistics" element={<CatalogStatistics />} />
        <Route path="catalog/table" element={<CatalogTable />} />
        <Route path="catalog/toolbar" element={<CatalogToolbar />} />
        <Route path="catalog/variants" element={<CatalogVariants />} />
        <Route path="catalog/view" element={<CatalogView />} />
        <Route path="catalog/delete" element={<DeleteCatalogDialog />} />

        {/* Categories */}
        <Route path="categories" element={<CategoryList />} />
        <Route path="categories/create" element={<CategoryCreate />} />
        <Route path="categories/edit/:id" element={<CategoryEdit />} />
        <Route path="categories/details/:id" element={<CategoryDetails />} />
        <Route path="categories/card" element={<CategoryCard />} />
        <Route path="categories/filters" element={<CategoryFilters />} />
        <Route path="categories/form" element={<CategoryForm />} />
        <Route path="categories/modal" element={<CategoryModal />} />
        <Route path="categories/pagination" element={<CategoryPagination />} />
        <Route path="categories/search" element={<CategorySearch />} />
        <Route path="categories/statistics" element={<CategoryStatistics />} />
        <Route path="categories/table" element={<CategoryTable />} />
        <Route path="categories/toolbar" element={<CategoryToolbar />} />
        <Route path="categories/view" element={<CategoryView />} />
        <Route path="categories/delete" element={<DeleteCategoryDialog />} />

        {/* Customer Addresses */}
        <Route path="customer-addresses" element={<CustomerAddressList />} />
        <Route path="customer-addresses/card" element={<CustomerAddressCard />} />
        <Route path="customer-addresses/modal" element={<CustomerAddressModal />} />
        <Route path="customer-addresses/pagination" element={<CustomerAddressPagination />} />
        <Route path="customer-addresses/search" element={<CustomerAddressSearch />} />
        <Route path="customer-addresses/statistics" element={<CustomerAddressStatistics />} />
        <Route path="customer-addresses/table" element={<CustomerAddressTable />} />
        <Route path="customer-addresses/toolbar" element={<CustomerAddressToolbar />} />
        <Route path="customer-addresses/view" element={<CustomerAddressView />} />
        <Route path="customer-addresses/delete" element={<DeleteCustomerAddressDialog />} />

        {/* Customer Payments */}
        <Route path="customer-payments" element={<CustomerPaymentList />} />
        <Route path="customer-payments/card" element={<CustomerPaymentCard />} />
        <Route path="customer-payments/modal" element={<CustomerPaymentModal />} />
        <Route path="customer-payments/pagination" element={<CustomerPaymentPagination />} />
        <Route path="customer-payments/search" element={<CustomerPaymentSearch />} />
        <Route path="customer-payments/statistics" element={<CustomerPaymentStatistics />} />
        <Route path="customer-payments/table" element={<CustomerPaymentTable />} />
        <Route path="customer-payments/toolbar" element={<CustomerPaymentToolbar />} />
        <Route path="customer-payments/view" element={<CustomerPaymentView />} />
        <Route path="customer-payments/delete" element={<DeleteCustomerPaymentDialog />} />

        {/* Customer Returns */}
        <Route path="customer-returns" element={<CustomerReturnList />} />
        <Route path="customer-returns/card" element={<CustomerReturnCard />} />
        <Route path="customer-returns/modal" element={<CustomerReturnModal />} />
        <Route path="customer-returns/pagination" element={<CustomerReturnPagination />} />
        <Route path="customer-returns/search" element={<CustomerReturnSearch />} />
        <Route path="customer-returns/statistics" element={<CustomerReturnStatistics />} />
        <Route path="customer-returns/table" element={<CustomerReturnTable />} />
        <Route path="customer-returns/toolbar" element={<CustomerReturnToolbar />} />
        <Route path="customer-returns/view" element={<CustomerReturnView />} />
        <Route path="customer-returns/delete" element={<DeleteCustomerReturnDialog />} />

        {/* Delivery Challans & Items */}
        <Route path="delivery-challans" element={<DeliveryChallanList />} />
        <Route path="delivery-challans/card" element={<DeliveryChallanCard />} />
        <Route path="delivery-challans/modal" element={<DeliveryChallanModal />} />
        <Route path="delivery-challans/pagination" element={<DeliveryChallanPagination />} />
        <Route path="delivery-challans/search" element={<DeliveryChallanSearch />} />
        <Route path="delivery-challans/statistics" element={<DeliveryChallanStatistics />} />
        <Route path="delivery-challans/table" element={<DeliveryChallanTable />} />
        <Route path="delivery-challans/toolbar" element={<DeliveryChallanToolbar />} />
        <Route path="delivery-challans/view" element={<DeliveryChallanView />} />
        <Route path="delivery-challans/delete" element={<DeleteDeliveryChallanDialog />} />
        
        <Route path="delivery-challan-items" element={<DeliveryChallanItemList />} />
        <Route path="delivery-challan-items/card" element={<DeliveryChallanItemCard />} />
        <Route path="delivery-challan-items/modal" element={<DeliveryChallanItemModal />} />
        <Route path="delivery-challan-items/pagination" element={<DeliveryChallanItemPagination />} />
        <Route path="delivery-challan-items/search" element={<DeliveryChallanItemSearch />} />
        <Route path="delivery-challan-items/statistics" element={<DeliveryChallanItemStatistics />} />
        <Route path="delivery-challan-items/table" element={<DeliveryChallanItemTable />} />
        <Route path="delivery-challan-items/toolbar" element={<DeliveryChallanItemToolbar />} />
        <Route path="delivery-challan-items/view" element={<DeliveryChallanItemView />} />
        <Route path="delivery-challan-items/delete" element={<DeleteDeliveryChallanItemDialog />} />

        {/* Goods Receipt Notes & Items */}
        <Route path="goods-receipt-notes" element={<GoodsReceiptNoteList />} />
        <Route path="goods-receipt-notes/card" element={<GoodsReceiptNoteCard />} />
        <Route path="goods-receipt-notes/modal" element={<GoodsReceiptNoteModal />} />
        <Route path="goods-receipt-notes/pagination" element={<GoodsReceiptNotePagination />} />
        <Route path="goods-receipt-notes/search" element={<GoodsReceiptNoteSearch />} />
        <Route path="goods-receipt-notes/statistics" element={<GoodsReceiptNoteStatistics />} />
        <Route path="goods-receipt-notes/table" element={<GoodsReceiptNoteTable />} />
        <Route path="goods-receipt-notes/toolbar" element={<GoodsReceiptNoteToolbar />} />
        <Route path="goods-receipt-notes/view" element={<GoodsReceiptNoteView />} />
        <Route path="goods-receipt-notes/delete" element={<DeleteGoodsReceiptNoteDialog />} />

        <Route path="goods-receipt-note-items" element={<GoodsReceiptNoteItemList />} />
        <Route path="goods-receipt-note-items/card" element={<GoodsReceiptNoteItemCard />} />
        <Route path="goods-receipt-note-items/modal" element={<GoodsReceiptNoteItemModal />} />
        <Route path="goods-receipt-note-items/pagination" element={<GoodsReceiptNoteItemPagination />} />
        <Route path="goods-receipt-note-items/search" element={<GoodsReceiptNoteItemSearch />} />
        <Route path="goods-receipt-note-items/statistics" element={<GoodsReceiptNoteItemStatistics />} />
        <Route path="goods-receipt-note-items/table" element={<GoodsReceiptNoteItemTable />} />
        <Route path="goods-receipt-note-items/toolbar" element={<GoodsReceiptNoteItemToolbar />} />
        <Route path="goods-receipt-note-items/view" element={<GoodsReceiptNoteItemView />} />
        <Route path="goods-receipt-note-items/delete" element={<DeleteGoodsReceiptNoteItemDialog />} />

        {/* Marketplace Order Items & Returns */}
        <Route path="marketplace-order-items" element={<MarketplaceOrderItemList />} />
        <Route path="marketplace-order-items/card" element={<MarketplaceOrderItemCard />} />
        <Route path="marketplace-order-items/modal" element={<MarketplaceOrderItemModal />} />
        <Route path="marketplace-order-items/pagination" element={<MarketplaceOrderItemPagination />} />
        <Route path="marketplace-order-items/search" element={<MarketplaceOrderItemSearch />} />
        <Route path="marketplace-order-items/statistics" element={<MarketplaceOrderItemStatistics />} />
        <Route path="marketplace-order-items/table" element={<MarketplaceOrderItemTable />} />
        <Route path="marketplace-order-items/toolbar" element={<MarketplaceOrderItemToolbar />} />
        <Route path="marketplace-order-items/view" element={<MarketplaceOrderItemView />} />
        <Route path="marketplace-order-items/delete" element={<DeleteMarketplaceOrderItemDialog />} />

        <Route path="marketplace-returns" element={<MarketplaceReturnList />} />
        <Route path="marketplace-returns/card" element={<MarketplaceReturnCard />} />
        <Route path="marketplace-returns/modal" element={<MarketplaceReturnModal />} />
        <Route path="marketplace-returns/pagination" element={<MarketplaceReturnPagination />} />
        <Route path="marketplace-returns/search" element={<MarketplaceReturnSearch />} />
        <Route path="marketplace-returns/statistics" element={<MarketplaceReturnStatistics />} />
        <Route path="marketplace-returns/table" element={<MarketplaceReturnTable />} />
        <Route path="marketplace-returns/toolbar" element={<MarketplaceReturnToolbar />} />
        <Route path="marketplace-returns/view" element={<MarketplaceReturnView />} />
        <Route path="marketplace-returns/delete" element={<DeleteMarketplaceReturnDialog />} />

        {/* Notifications */}
        <Route path="notifications" element={<NotificationList />} />
        <Route path="notifications/card" element={<NotificationCard />} />
        <Route path="notifications/settings" element={<NotificationSettings />} />
        <Route path="notifications/view" element={<NotificationView />} />

        {/* Order Items & Status History */}
        <Route path="order-items" element={<OrderItemList />} />
        <Route path="order-items/card" element={<OrderItemCard />} />
        <Route path="order-items/modal" element={<OrderItemModal />} />
        <Route path="order-items/pagination" element={<OrderItemPagination />} />
        <Route path="order-items/search" element={<OrderItemSearch />} />
        <Route path="order-items/statistics" element={<OrderItemStatistics />} />
        <Route path="order-items/table" element={<OrderItemTable />} />
        <Route path="order-items/toolbar" element={<OrderItemToolbar />} />
        <Route path="order-items/view" element={<OrderItemView />} />
        <Route path="order-items/delete" element={<DeleteOrderItemDialog />} />

        <Route path="order-status-history" element={<OrderStatusHistoryList />} />
        <Route path="order-status-history/card" element={<OrderStatusHistoryCard />} />
        <Route path="order-status-history/modal" element={<OrderStatusHistoryModal />} />
        <Route path="order-status-history/pagination" element={<OrderStatusHistoryPagination />} />
        <Route path="order-status-history/search" element={<OrderStatusHistorySearch />} />
        <Route path="order-status-history/statistics" element={<OrderStatusHistoryStatistics />} />
        <Route path="order-status-history/table" element={<OrderStatusHistoryTable />} />
        <Route path="order-status-history/toolbar" element={<OrderStatusHistoryToolbar />} />
        <Route path="order-status-history/view" element={<OrderStatusHistoryView />} />
        <Route path="order-status-history/delete" element={<DeleteOrderStatusHistoryDialog />} />

        {/* Payment Settings */}
        <Route path="payment-settings" element={<PaymentSettings />} />
        <Route path="payment-settings/bank" element={<BankDetails />} />
        <Route path="payment-settings/gateway" element={<PaymentGateway />} />
        <Route path="payment-settings/upi" element={<UpiSettings />} />

        {/* Products & Related Details */}
        <Route path="products" element={<Products />} />
        <Route path="products/list" element={<ProductList />} />
        <Route path="products/create" element={<ProductCreate />} />
        <Route path="products/edit/:id" element={<ProductEdit />} />
        <Route path="products/details/:id" element={<ProductDetails />} />
        <Route path="products/card" element={<ProductCard />} />
        <Route path="products/filters" element={<ProductFilters />} />
        <Route path="products/form" element={<ProductForm />} />
        <Route path="products/modal" element={<ProductModal />} />
        <Route path="products/pagination" element={<ProductPagination />} />
        <Route path="products/search" element={<ProductSearch />} />
        <Route path="products/statistics" element={<ProductStatistics />} />
        <Route path="products/table" element={<ProductTable />} />
        <Route path="products/toolbar" element={<ProductToolbar />} />
        <Route path="products/view" element={<ProductView />} />
        <Route path="products/delete" element={<DeleteProductDialog />} />

        <Route path="product-attributes" element={<ProductAttributeList />} />
        <Route path="product-attributes/card" element={<ProductAttributeCard />} />
        <Route path="product-attributes/modal" element={<ProductAttributeModal />} />
        <Route path="product-attributes/pagination" element={<ProductAttributePagination />} />
        <Route path="product-attributes/search" element={<ProductAttributeSearch />} />
        <Route path="product-attributes/statistics" element={<ProductAttributeStatistics />} />
        <Route path="product-attributes/table" element={<ProductAttributeTable />} />
        <Route path="product-attributes/toolbar" element={<ProductAttributeToolbar />} />
        <Route path="product-attributes/view" element={<ProductAttributeView />} />
        <Route path="product-attributes/delete" element={<DeleteProductAttributeDialog />} />

        <Route path="product-images" element={<ProductImageList />} />
        <Route path="product-images/card" element={<ProductImageCard />} />
        <Route path="product-images/modal" element={<ProductImageModal />} />
        <Route path="product-images/pagination" element={<ProductImagePagination />} />
        <Route path="product-images/search" element={<ProductImageSearch />} />
        <Route path="product-images/statistics" element={<ProductImageStatistics />} />
        <Route path="product-images/table" element={<ProductImageTable />} />
        <Route path="product-images/toolbar" element={<ProductImageToolbar />} />
        <Route path="product-images/view" element={<ProductImageView />} />
        <Route path="product-images/delete" element={<DeleteProductImageDialog />} />

        <Route path="product-inventory" element={<ProductInventoryList />} />
        <Route path="product-inventory/card" element={<ProductInventoryCard />} />
        <Route path="product-inventory/details" element={<ProductInventoryDetails />} />
        <Route path="product-inventory/filters" element={<ProductInventoryFilters />} />
        <Route path="product-inventory/modal" element={<ProductInventoryModal />} />
        <Route path="product-inventory/pagination" element={<ProductInventoryPagination />} />
        <Route path="product-inventory/search" element={<ProductInventorySearch />} />
        <Route path="product-inventory/statistics" element={<ProductInventoryStatistics />} />
        <Route path="product-inventory/table" element={<ProductInventoryTable />} />
        <Route path="product-inventory/toolbar" element={<ProductInventoryToolbar />} />
        <Route path="product-inventory/view" element={<ProductInventoryView />} />
        <Route path="product-inventory/delete" element={<DeleteProductInventoryDialog />} />

        <Route path="product-prices" element={<ProductPriceList />} />
        <Route path="product-prices/create" element={<ProductPriceCreate />} />
        <Route path="product-prices/edit/:id" element={<ProductPriceEdit />} />
        <Route path="product-prices/details/:id" element={<ProductPriceDetails />} />
        <Route path="product-prices/card" element={<ProductPriceCard />} />
        <Route path="product-prices/filters" element={<ProductPriceFilters />} />
        <Route path="product-prices/form" element={<ProductPriceForm />} />
        <Route path="product-prices/modal" element={<ProductPriceModal />} />
        <Route path="product-prices/pagination" element={<ProductPricePagination />} />
        <Route path="product-prices/search" element={<ProductPriceSearch />} />
        <Route path="product-prices/statistics" element={<ProductPriceStatistics />} />
        <Route path="product-prices/table" element={<ProductPriceTable />} />
        <Route path="product-prices/toolbar" element={<ProductPriceToolbar />} />
        <Route path="product-prices/view" element={<ProductPriceView />} />
        <Route path="product-prices/delete" element={<DeleteProductPriceDialog />} />

        <Route path="product-types" element={<ProductTypeList />} />
        <Route path="product-types/create" element={<ProductTypeCreate />} />
        <Route path="product-types/edit/:id" element={<ProductTypeEdit />} />
        <Route path="product-types/details/:id" element={<ProductTypeDetails />} />
        <Route path="product-types/card" element={<ProductTypeCard />} />
        <Route path="product-types/filters" element={<ProductTypeFilters />} />
        <Route path="product-types/form" element={<ProductTypeForm />} />
        <Route path="product-types/modal" element={<ProductTypeModal />} />
        <Route path="product-types/pagination" element={<ProductTypePagination />} />
        <Route path="product-types/search" element={<ProductTypeSearch />} />
        <Route path="product-types/statistics" element={<ProductTypeStatistics />} />
        <Route path="product-types/table" element={<ProductTypeTable />} />
        <Route path="product-types/toolbar" element={<ProductTypeToolbar />} />
        <Route path="product-types/view" element={<ProductTypeView />} />
        <Route path="product-types/delete" element={<DeleteProductTypeDialog />} />

        {/* Purchase Orders, Items & Returns */}
        <Route path="purchase-orders" element={<PurchaseOrderList />} />
        <Route path="purchase-orders/card" element={<PurchaseOrderCard />} />
        <Route path="purchase-orders/modal" element={<PurchaseOrderModal />} />
        <Route path="purchase-orders/pagination" element={<PurchaseOrderPagination />} />
        <Route path="purchase-orders/search" element={<PurchaseOrderSearch />} />
        <Route path="purchase-orders/statistics" element={<PurchaseOrderStatistics />} />
        <Route path="purchase-orders/table" element={<PurchaseOrderTable />} />
        <Route path="purchase-orders/toolbar" element={<PurchaseOrderToolbar />} />
        <Route path="purchase-orders/view" element={<PurchaseOrderView />} />
        <Route path="purchase-orders/delete" element={<DeletePurchaseOrderDialog />} />

        <Route path="purchase-order-items" element={<PurchaseOrderItemList />} />
        <Route path="purchase-order-items/card" element={<PurchaseOrderItemCard />} />
        <Route path="purchase-order-items/modal" element={<PurchaseOrderItemModal />} />
        <Route path="purchase-order-items/pagination" element={<PurchaseOrderItemPagination />} />
        <Route path="purchase-order-items/search" element={<PurchaseOrderItemSearch />} />
        <Route path="purchase-order-items/statistics" element={<PurchaseOrderItemStatistics />} />
        <Route path="purchase-order-items/table" element={<PurchaseOrderItemTable />} />
        <Route path="purchase-order-items/toolbar" element={<PurchaseOrderItemToolbar />} />
        <Route path="purchase-order-items/view" element={<PurchaseOrderItemView />} />
        <Route path="purchase-order-items/delete" element={<DeletePurchaseOrderItemDialog />} />

        <Route path="purchase-returns" element={<PurchaseReturnList />} />
        <Route path="purchase-returns/card" element={<PurchaseReturnCard />} />
        <Route path="purchase-returns/modal" element={<PurchaseReturnModal />} />
        <Route path="purchase-returns/pagination" element={<PurchaseReturnPagination />} />
        <Route path="purchase-returns/search" element={<PurchaseReturnSearch />} />
        <Route path="purchase-returns/statistics" element={<PurchaseReturnStatistics />} />
        <Route path="purchase-returns/table" element={<PurchaseReturnTable />} />
        <Route path="purchase-returns/toolbar" element={<PurchaseReturnToolbar />} />
        <Route path="purchase-returns/view" element={<PurchaseReturnView />} />
        <Route path="purchase-returns/delete" element={<DeletePurchaseReturnDialog />} />

        {/* Reviews */}
        <Route path="reviews" element={<ReviewList />} />
        <Route path="reviews/card" element={<ReviewCard />} />
        <Route path="reviews/modal" element={<ReviewModal />} />
        <Route path="reviews/pagination" element={<ReviewPagination />} />
        <Route path="reviews/search" element={<ReviewSearch />} />
        <Route path="reviews/statistics" element={<ReviewStatistics />} />
        <Route path="reviews/table" element={<ReviewTable />} />
        <Route path="reviews/toolbar" element={<ReviewToolbar />} />
        <Route path="reviews/view" element={<ReviewView />} />
        <Route path="reviews/delete" element={<DeleteReviewDialog />} />

        {/* Sales Invoices, Orders & Items */}
        <Route path="sales-invoices" element={<SalesInvoiceList />} />
        <Route path="sales-invoices/card" element={<SalesInvoiceCard />} />
        <Route path="sales-invoices/modal" element={<SalesInvoiceModal />} />
        <Route path="sales-invoices/pagination" element={<SalesInvoicePagination />} />
        <Route path="sales-invoices/search" element={<SalesInvoiceSearch />} />
        <Route path="sales-invoices/statistics" element={<SalesInvoiceStatistics />} />
        <Route path="sales-invoices/table" element={<SalesInvoiceTable />} />
        <Route path="sales-invoices/toolbar" element={<SalesInvoiceToolbar />} />
        <Route path="sales-invoices/view" element={<SalesInvoiceView />} />
        <Route path="sales-invoices/delete" element={<DeleteSalesInvoiceDialog />} />

        <Route path="sales-orders" element={<SalesOrderList />} />
        <Route path="sales-orders/card" element={<SalesOrderCard />} />
        <Route path="sales-orders/modal" element={<SalesOrderModal />} />
        <Route path="sales-orders/pagination" element={<SalesOrderPagination />} />
        <Route path="sales-orders/search" element={<SalesOrderSearch />} />
        <Route path="sales-orders/statistics" element={<SalesOrderStatistics />} />
        <Route path="sales-orders/table" element={<SalesOrderTable />} />
        <Route path="sales-orders/toolbar" element={<SalesOrderToolbar />} />
        <Route path="sales-orders/view" element={<SalesOrderView />} />
        <Route path="sales-orders/delete" element={<DeleteSalesOrderDialog />} />

        <Route path="sales-order-items" element={<SalesOrderItemList />} />
        <Route path="sales-order-items/card" element={<SalesOrderItemCard />} />
        <Route path="sales-order-items/modal" element={<SalesOrderItemModal />} />
        <Route path="sales-order-items/pagination" element={<SalesOrderItemPagination />} />
        <Route path="sales-order-items/search" element={<SalesOrderItemSearch />} />
        <Route path="sales-order-items/statistics" element={<SalesOrderItemStatistics />} />
        <Route path="sales-order-items/table" element={<SalesOrderItemTable />} />
        <Route path="sales-order-items/toolbar" element={<SalesOrderItemToolbar />} />
        <Route path="sales-order-items/view" element={<SalesOrderItemView />} />
        <Route path="sales-order-items/delete" element={<DeleteSalesOrderItemDialog />} />

        {/* Seller Customers */}
        <Route path="seller-customers" element={<SellerCustomerList />} />
        <Route path="seller-customers/card" element={<SellerCustomerCard />} />
        <Route path="seller-customers/modal" element={<SellerCustomerModal />} />
        <Route path="seller-customers/pagination" element={<SellerCustomerPagination />} />
        <Route path="seller-customers/search" element={<SellerCustomerSearch />} />
        <Route path="seller-customers/statistics" element={<SellerCustomerStatistics />} />
        <Route path="seller-customers/table" element={<SellerCustomerTable />} />
        <Route path="seller-customers/toolbar" element={<SellerCustomerToolbar />} />
        <Route path="seller-customers/view" element={<SellerCustomerView />} />
        <Route path="seller-customers/delete" element={<DeleteSellerCustomerDialog />} />

        {/* Shipments */}
        <Route path="shipments" element={<ShipmentList />} />
        <Route path="shipments/card" element={<ShipmentCard />} />
        <Route path="shipments/modal" element={<ShipmentModal />} />
        <Route path="shipments/pagination" element={<ShipmentPagination />} />
        <Route path="shipments/search" element={<ShipmentSearch />} />
        <Route path="shipments/statistics" element={<ShipmentStatistics />} />
        <Route path="shipments/table" element={<ShipmentTable />} />
        <Route path="shipments/toolbar" element={<ShipmentToolbar />} />
        <Route path="shipments/view" element={<ShipmentView />} />
        <Route path="shipments/delete" element={<DeleteShipmentDialog />} />

        {/* Wishlists */}
        <Route path="wishlists" element={<WishlistList />} />
        <Route path="wishlists/card" element={<WishlistCard />} />
        <Route path="wishlists/modal" element={<WishlistModal />} />
        <Route path="wishlists/pagination" element={<WishlistPagination />} />
        <Route path="wishlists/search" element={<WishlistSearch />} />
        <Route path="wishlists/statistics" element={<WishlistStatistics />} />
        <Route path="wishlists/table" element={<WishlistTable />} />
        <Route path="wishlists/toolbar" element={<WishlistToolbar />} />
        <Route path="wishlists/view" element={<WishlistView />} />
        <Route path="wishlists/delete" element={<DeleteWishlistDialog />} />

        {/* =========================================================
            REPORTS SUB-COMPONENTS ROUTES
           ========================================================= */}
        {/* 1. Customer Report */}
        <Route path="reports/customer" element={<CustomerReportView />} />
        <Route path="reports/customer/card" element={<CustomerReportCard />} />
        <Route path="reports/customer/export" element={<CustomerReportExport />} />
        <Route path="reports/customer/filter" element={<CustomerReportFilter />} />
        <Route path="reports/customer/list" element={<CustomerReportList />} />
        <Route path="reports/customer/modal" element={<CustomerReportModal />} />
        <Route path="reports/customer/pagination" element={<CustomerReportPagination />} />
        <Route path="reports/customer/search" element={<CustomerReportSearch />} />
        <Route path="reports/customer/statistics" element={<CustomerReportStatistics />} />
        <Route path="reports/customer/table" element={<CustomerReportTable />} />
        <Route path="reports/customer/toolbar" element={<CustomerReportToolbar />} />

        {/* 2. Dashboard Report */}
        <Route path="reports/dashboard" element={<DashboardReportView />} />
        <Route path="reports/dashboard/card" element={<DashboardReportCard />} />
        <Route path="reports/dashboard/export" element={<DashboardReportExport />} />
        <Route path="reports/dashboard/filter" element={<DashboardReportFilter />} />
        <Route path="reports/dashboard/list" element={<DashboardReportList />} />
        <Route path="reports/dashboard/modal" element={<DashboardReportModal />} />
        <Route path="reports/dashboard/pagination" element={<DashboardReportPagination />} />
        <Route path="reports/dashboard/search" element={<DashboardReportSearch />} />
        <Route path="reports/dashboard/statistics" element={<DashboardReportStatistics />} />
        <Route path="reports/dashboard/table" element={<DashboardReportTable />} />
        <Route path="reports/dashboard/toolbar" element={<DashboardReportToolbar />} />

        {/* 3. Inventory Report */}
        <Route path="reports/inventory" element={<InventoryReportView />} />
        <Route path="reports/inventory/card" element={<InventoryReportCard />} />
        <Route path="reports/inventory/export" element={<InventoryReportExport />} />
        <Route path="reports/inventory/filter" element={<InventoryReportFilter />} />
        <Route path="reports/inventory/list" element={<InventoryReportList />} />
        <Route path="reports/inventory/modal" element={<InventoryReportModal />} />
        <Route path="reports/inventory/pagination" element={<InventoryReportPagination />} />
        <Route path="reports/inventory/search" element={<InventoryReportSearch />} />
        <Route path="reports/inventory/statistics" element={<InventoryReportStatistics />} />
        <Route path="reports/inventory/table" element={<InventoryReportTable />} />
        <Route path="reports/inventory/toolbar" element={<InventoryReportToolbar />} />

        {/* 4. Low Stock Report */}
        <Route path="reports/low-stock" element={<LowStockReportView />} />
        <Route path="reports/low-stock/card" element={<LowStockReportCard />} />
        <Route path="reports/low-stock/export" element={<LowStockReportExport />} />
        <Route path="reports/low-stock/filter" element={<LowStockReportFilter />} />
        <Route path="reports/low-stock/list" element={<LowStockReportList />} />
        <Route path="reports/low-stock/modal" element={<LowStockReportModal />} />
        <Route path="reports/low-stock/pagination" element={<LowStockReportPagination />} />
        <Route path="reports/low-stock/search" element={<LowStockReportSearch />} />
        <Route path="reports/low-stock/statistics" element={<LowStockReportStatistics />} />
        <Route path="reports/low-stock/table" element={<LowStockReportTable />} />
        <Route path="reports/low-stock/toolbar" element={<LowStockReportToolbar />} />

        {/* 5. Marketplace Report */}
        <Route path="reports/marketplace" element={<MarketplaceReportView />} />
        <Route path="reports/marketplace/card" element={<MarketplaceReportCard />} />
        <Route path="reports/marketplace/export" element={<MarketplaceReportExport />} />
        <Route path="reports/marketplace/filter" element={<MarketplaceReportFilter />} />
        <Route path="reports/marketplace/list" element={<MarketplaceReportList />} />
        <Route path="reports/marketplace/modal" element={<MarketplaceReportModal />} />
        <Route path="reports/marketplace/pagination" element={<MarketplaceReportPagination />} />
        <Route path="reports/marketplace/search" element={<MarketplaceReportSearch />} />
        <Route path="reports/marketplace/statistics" element={<MarketplaceReportStatistics />} />
        <Route path="reports/marketplace/table" element={<MarketplaceReportTable />} />
        <Route path="reports/marketplace/toolbar" element={<MarketplaceReportToolbar />} />

        {/* 6. Order Report */}
        <Route path="reports/order" element={<OrderReportView />} />
        <Route path="reports/order/card" element={<OrderReportCard />} />
        <Route path="reports/order/export" element={<OrderReportExport />} />
        <Route path="reports/order/filter" element={<OrderReportFilter />} />
        <Route path="reports/order/list" element={<OrderReportList />} />
        <Route path="reports/order/modal" element={<OrderReportModal />} />
        <Route path="reports/order/pagination" element={<OrderReportPagination />} />
        <Route path="reports/order/search" element={<OrderReportSearch />} />
        <Route path="reports/order/statistics" element={<OrderReportStatistics />} />
        <Route path="reports/order/table" element={<OrderReportTable />} />
        <Route path="reports/order/toolbar" element={<OrderReportToolbar />} />

        {/* 7. Payment Report */}
        <Route path="reports/payment" element={<PaymentReportView />} />
        <Route path="reports/payment/card" element={<PaymentReportCard />} />
        <Route path="reports/payment/export" element={<PaymentReportExport />} />
        <Route path="reports/payment/filter" element={<PaymentReportFilter />} />
        <Route path="reports/payment/list" element={<PaymentReportList />} />
        <Route path="reports/payment/pagination" element={<PaymentReportPagination />} />
        <Route path="reports/payment/search" element={<PaymentReportSearch />} />
        <Route path="reports/payment/statistics" element={<PaymentReportStatistics />} />
        <Route path="reports/payment/table" element={<PaymentReportTable />} />
        <Route path="reports/payment/toolbar" element={<PaymentReportToolbar />} />

        {/* 8. Profit & Loss Report */}
        <Route path="reports/profit-loss" element={<ProfitLossReportView />} />
        <Route path="reports/profit-loss/card" element={<ProfitLossReportCard />} />
        <Route path="reports/profit-loss/export" element={<ProfitLossReportExport />} />
        <Route path="reports/profit-loss/filter" element={<ProfitLossReportFilter />} />
        <Route path="reports/profit-loss/list" element={<ProfitLossReportList />} />
        <Route path="reports/profit-loss/modal" element={<ProfitLossReportModal />} />
        <Route path="reports/profit-loss/pagination" element={<ProfitLossReportPagination />} />
        <Route path="reports/profit-loss/search" element={<ProfitLossReportSearch />} />
        <Route path="reports/profit-loss/statistics" element={<ProfitLossReportStatistics />} />
        <Route path="reports/profit-loss/table" element={<ProfitLossReportTable />} />
        <Route path="reports/profit-loss/toolbar" element={<ProfitLossReportToolbar />} />

        {/* 9. Purchase Report */}
        <Route path="reports/purchase" element={<PurchaseReportView />} />
        <Route path="reports/purchase/card" element={<PurchaseReportCard />} />
        <Route path="reports/purchase/export" element={<PurchaseReportExport />} />
        <Route path="reports/purchase/filter" element={<PurchaseReportFilter />} />
        <Route path="reports/purchase/list" element={<PurchaseReportList />} />
        <Route path="reports/purchase/modal" element={<PurchaseReportModal />} />
        <Route path="reports/purchase/pagination" element={<PurchaseReportPagination />} />
        <Route path="reports/purchase/search" element={<PurchaseReportSearch />} />
        <Route path="reports/purchase/statistics" element={<PurchaseReportStatistics />} />
        <Route path="reports/purchase/table" element={<PurchaseReportTable />} />
        <Route path="reports/purchase/toolbar" element={<PurchaseReportToolbar />} />

        {/* 10. Return Report */}
        <Route path="reports/return" element={<ReturnReportView />} />
        <Route path="reports/return/card" element={<ReturnReportCard />} />
        <Route path="reports/return/export" element={<ReturnReportExport />} />
        <Route path="reports/return/filter" element={<ReturnReportFilter />} />
        <Route path="reports/return/list" element={<ReturnReportList />} />
        <Route path="reports/return/modal" element={<ReturnReportModal />} />
        <Route path="reports/return/pagination" element={<ReturnReportPagination />} />
        <Route path="reports/return/search" element={<ReturnReportSearch />} />
        <Route path="reports/return/statistics" element={<ReturnReportStatistics />} />
        <Route path="reports/return/table" element={<ReturnReportTable />} />
        <Route path="reports/return/toolbar" element={<ReturnReportToolbar />} />

        {/* 11. Sales Report */}
        <Route path="reports/sales" element={<SalesReportView />} />
        <Route path="reports/sales/card" element={<SalesReportCard />} />
        <Route path="reports/sales/chart" element={<SalesReportChart />} />
        <Route path="reports/sales/export" element={<SalesReportExport />} />
        <Route path="reports/sales/filter" element={<SalesReportFilter />} />
        <Route path="reports/sales/list" element={<SalesReportList />} />
        <Route path="reports/sales/modal" element={<SalesReportModal />} />
        <Route path="reports/sales/pagination" element={<SalesReportPagination />} />
        <Route path="reports/sales/search" element={<SalesReportSearch />} />
        <Route path="reports/sales/statistics" element={<SalesReportStatistics />} />
        <Route path="reports/sales/table" element={<SalesReportTable />} />
        <Route path="reports/sales/toolbar" element={<SalesReportToolbar />} />

        {/* 12. Stock Ledger Report */}
        <Route path="reports/stock-ledger" element={<StockLedgerReportView />} />
        <Route path="reports/stock-ledger/card" element={<StockLedgerReportCard />} />
        <Route path="reports/stock-ledger/chart" element={<StockLedgerReportChart />} />
        <Route path="reports/stock-ledger/export" element={<StockLedgerReportExport />} />
        <Route path="reports/stock-ledger/filter" element={<StockLedgerReportFilter />} />
        <Route path="reports/stock-ledger/list" element={<StockLedgerReportList />} />
        <Route path="reports/stock-ledger/modal" element={<StockLedgerReportModal />} />
        <Route path="reports/stock-ledger/pagination" element={<StockLedgerReportPagination />} />
        <Route path="reports/stock-ledger/search" element={<StockLedgerReportSearch />} />
        <Route path="reports/stock-ledger/statistics" element={<StockLedgerReportStatistics />} />
        <Route path="reports/stock-ledger/table" element={<StockLedgerReportTable />} />
        <Route path="reports/stock-ledger/toolbar" element={<StockLedgerReportToolbar />} />

        {/* 13. Stock Movement Report */}
        <Route path="reports/stock-movement" element={<StockMovementReportView />} />
        <Route path="reports/stock-movement/card" element={<StockMovementReportCard />} />
        <Route path="reports/stock-movement/chart" element={<StockMovementReportChart />} />
        <Route path="reports/stock-movement/export" element={<StockMovementReportExport />} />
        <Route path="reports/stock-movement/filter" element={<StockMovementReportFilter />} />
        <Route path="reports/stock-movement/list" element={<StockMovementReportList />} />
        <Route path="reports/stock-movement/modal" element={<StockMovementReportModal />} />
        <Route path="reports/stock-movement/pagination" element={<StockMovementReportPagination />} />
        <Route path="reports/stock-movement/search" element={<StockMovementReportSearch />} />
        <Route path="reports/stock-movement/statistics" element={<StockMovementReportStatistics />} />
        <Route path="reports/stock-movement/table" element={<StockMovementReportTable />} />
        <Route path="reports/stock-movement/toolbar" element={<StockMovementReportToolbar />} />

        {/* 14. Supplies Report */}
        <Route path="reports/supplies" element={<SuppliesReportView />} />
        <Route path="reports/supplies/card" element={<SuppliesReportCard />} />
        <Route path="reports/supplies/chart" element={<SuppliesReportChart />} />
        <Route path="reports/supplies/export" element={<SuppliesReportExport />} />
        <Route path="reports/supplies/filter" element={<SuppliesReportFilter />} />
        <Route path="reports/supplies/list" element={<SuppliesReportList />} />
        <Route path="reports/supplies/modal" element={<SuppliesReportModal />} />
        <Route path="reports/supplies/pagination" element={<SuppliesReportPagination />} />
        <Route path="reports/supplies/search" element={<SuppliesReportSearch />} />
        <Route path="reports/supplies/statistics" element={<SuppliesReportStatistics />} />
        <Route path="reports/supplies/table" element={<SuppliesReportTable />} />
        <Route path="reports/supplies/toolbar" element={<SuppliesReportToolbar />} />

        {/* 15. Tax Report */}
        <Route path="reports/tax" element={<TaxReportView />} />
        <Route path="reports/tax/card" element={<TaxReportCard />} />
        <Route path="reports/tax/chart" element={<TaxReportChart />} />
        <Route path="reports/tax/export" element={<TaxReportExport />} />
        <Route path="reports/tax/filter" element={<TaxReportFilter />} />
        <Route path="reports/tax/list" element={<TaxReportList />} />
        <Route path="reports/tax/modal" element={<TaxReportModal />} />
        <Route path="reports/tax/pagination" element={<TaxReportPagination />} />
        <Route path="reports/tax/search" element={<TaxReportSearch />} />
        <Route path="reports/tax/statistics" element={<TaxReportStatistics />} />
        <Route path="reports/tax/table" element={<TaxReportTable />} />
        <Route path="reports/tax/toolbar" element={<TaxReportToolbar />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;