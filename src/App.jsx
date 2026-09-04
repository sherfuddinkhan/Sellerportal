import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
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
import BrandModelTable from "./pages/Brands/BrandModelTable";
import BrandModelForm from "./pages/Brands/BrandModelForm";
import BrandModelView from "./pages/Brands/BrandModelView";


// =========================================================
// STOCK ADJUSTMENT MANAGEMENT
// =========================================================

import StockAdjustmentList from "./pages/StockAdjustment/StockAdjustmentList";
import StockAdjustmentCreate from "./pages/StockAdjustment/StockAdjustmentCreate";
import StockAdjustmentEdit from "./pages/StockAdjustment/StockAdjustmentEdit";
import StockAdjustmentView from "./pages/StockAdjustment/StockAdjustmentView";
import StockAdjustmentSearch from "./pages/StockAdjustment/StockAdjustmentSearch";
import StockAdjustmentStatistics from "./pages/StockAdjustment/StockAdjustmentStatistics";
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
import CatalogForm from "./pages/Catalog/CatalogForm";
import CatalogFilters from "./pages/Catalog/CatalogFilters";
import DeleteCatalogDialog from "./pages/Catalog/DeleteCatalogDialog";
import CatalogReviews from "./pages/Catalog/CatalogReviews";
import Catalog from "./pages/Catalog/Catalog";

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
import CategoryProducts from "./pages/Categories/CategoryProducts";


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
import CustomerReturnEdit from "./pages/CustomerReturns/CustomerReturnEdit";
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
// STOCK LEDGER IMPORTS
// =========================================================

import StockLedgerList from "./pages/StockLedger/StockLedgerList";
import StockLedgerCreate  from "./pages/StockLedger/StockLedgerCreate";
import StockLedgerEdit from "./pages/StockLedger/StockLedgerEdit";
import StockLedgerView from "./pages/StockLedger/StockLedgerView";
import StockLedgerDetails from "./pages/StockLedger/StockLedgerDetails";
import StockLedgerTable from "./pages/StockLedger/StockLedgerTable";
import StockLedgerCard from "./pages/StockLedger/StockLedgerCard";
import StockLedgerSearch from "./pages/StockLedger/StockLedgerSearch";
import StockLedgerFilters from "./pages/StockLedger/StockLedgerFilters";
import StockLedgerPagination from "./pages/StockLedger/StockLedgerPagination";
import StockLedgerStatistics from "./pages/StockLedger/StockLedgerStatistics";
import StockLedgerToolbar from "./pages/StockLedger/StockLedgerToolbar";
import DeleteStockLedgerDialog from "./pages/StockLedger/DeleteStockLedgerDialog";



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

//////////////// seller ////////////////////////////
import SellerList from "./pages/Seller/SellerList";
import SellerForm from "./pages/Seller/SellerForm";
import SellerView from "./pages/Seller/SellerView";
import SellerTable from "./pages/Seller/SellerTable";
import SellerSearch from "./pages/Seller/SellerSearch";
import SellerFilters from "./pages/Seller/SellerFilters";
import SellerToolbar from "./pages/Seller/SellerToolbar";
import SellerStatistics from "./pages/Seller/SellerStatistics";
import SellerPagination from "./pages/Seller/SellerPagination";
import SellerEdit from "./pages/Seller/SellerEdit";
import SellerCreate from "./pages/Seller/SellerCreate";
import SellerDetails from "./pages/Seller/SellerDetails";

//////////////// supplier ////////////////////////////
import SupplierList from "./pages/Supplier/SupplierList";
import SupplierEdit from "./pages/Supplier/SupplierEdit";
import SupplierView from "./pages/Supplier/SupplierView";
import SupplierDetails from "./pages/Supplier/SupplierDetails";
import SupplierCreate from "./pages/Supplier/SupplierCreate";
import SupplierStatistics from "./pages/Supplier/SupplierStatistics";
import SupplierPagination from "./pages/Supplier/SupplierPagination";
import SupplierFilters from "./pages/Supplier/SupplierFilters";
import SupplierSearch from "./pages/Supplier/SupplierSearch";
import SupplierToolbar from "./pages/Supplier/SupplierToolbar";
import SupplierTable from "./pages/Supplier/SupplierTable";
import SupplierCard from "./pages/Supplier/SupplierCard";



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
// Product Attribute Imports
// =========================================================

import ProductAttributeList from "./pages/ProductAttributes/ProductAttributeList";
import ProductAttributeCreate from "./pages/ProductAttributes/ProductAttributeCreate";
import ProductAttributeView from "./pages/ProductAttributes/ProductAttributeView";
import ProductAttributeDetails from "./pages/ProductAttributes/ProductAttributeDetails";
import ProductAttributeEdit from "./pages/ProductAttributes/ProductAttributeEdit";
import ProductAttributeSearch from "./pages/ProductAttributes/ProductAttributeSearch";
import ProductAttributeStatistics from "./pages/ProductAttributes/ProductAttributeStatistics";
import ProductAttributeFilters from "./pages/ProductAttributes/ProductAttributeFilters";
import ProductAttributeTable from "./pages/ProductAttributes/ProductAttributeTable";
import ProductAttributeCard from "./pages/ProductAttributes/ProductAttributeCard";
import ProductAttributeForm from "./pages/ProductAttributes/ProductAttributeForm";
import ProductAttributeModal from "./pages/ProductAttributes/ProductAttributeModal";
import ProductAttributePagination from "./pages/ProductAttributes/ProductAttributePagination";
import ProductAttributeToolbar from "./pages/ProductAttributes/ProductAttributeToolbar";




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
import ProductImageCreate from "./pages/ProductImages/ProductImageCreate"; 
import ProductImageEdit from "./pages/ProductImages/ProductImageEdit"; 
import ProductImageDetails from "./pages/ProductImages/ProductImageDetails";

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
import ProductInventoryCreate from "./pages/ProductInventory/ProductInventoryCreate";
import ProductInventoryEdit from "./pages/ProductInventory/ProductInventoryEdit";


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
//  STOCK TRANSFER
// =========================================================
import StockTransferForm from "./pages/StockTransfer/StockTransferForm"; 
import StockTransferView from "./pages/StockTransfer/StockTransferView";
import StockTransferList from "./pages/StockTransfer/StockTransferList";
import StockTransferDetails  from "./pages/StockTransfer/StockTransferDetails";
import StockTransferEdit from "./pages/StockTransfer/StockTransferEdit";
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
// WAREHOUSE MANAGEMENT IMPORTS
// =========================================================
import WarehouseList from "./pages/Warehouses/WarehouseList";
import WarehouseDetails from "./pages/Warehouses/WarehouseDetails";
import WarehouseView from "./pages/Warehouses/WarehouseView";
import WarehouseModal from "./pages/Warehouses/WarehouseModal";
import WarehouseTable from "./pages/Warehouses/WarehouseTable";
import WarehouseCard from "./pages/Warehouses/WarehouseCard";
import WarehouseToolbar from "./pages/Warehouses/WarehouseToolbar";
import WarehouseSearch from "./pages/Warehouses/WarehouseSearch";
import WarehouseStatistics from "./pages/Warehouses/WarehouseStatistics";
import WarehousePagination from "./pages/Warehouses/WarehousePagination";
import DeleteWarehouseDialog from "./pages/Warehouses/DeleteWarehouseDialog";
import WarehouseCreate from "./pages/Warehouses/WarehouseCreate";
import WarehouseEdit from "./pages/Warehouses/WarehouseEdit";


// =========================================================
// WAREHOUSE locations  IMPORTS
// =========================================================
import WarehouseLocationList from "./pages/WarehouseLocation/WarehouseLocationList";
import WarehouseLocationCreate from "./pages/WarehouseLocation/WarehouseLocationCreate";
import WarehouseLocationEdit from "./pages/WarehouseLocation/WarehouseLocationEdit";
import WarehouseLocationDetails from "./pages/WarehouseLocation/WarehouseLocationDetails";

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
// SalesOrder
// =========================================================
import SalesOrderList from "./pages/SalesOrders/SalesOrderList";
import SalesOrderDetails from "./pages/SalesOrders/SalesOrderDetails";
import SalesOrderSearch from "./pages/SalesOrders/SalesOrderSearch";
import SalesOrderStatistics from "./pages/SalesOrders/SalesOrderStatistics";
import SalesOrderEdit from "./pages/SalesOrders/SalesOrderEdit";
import SalesOrderModal from "./pages/SalesOrders/SalesOrderModal";
import SalesOrderToolbar from "./pages/SalesOrders/SalesOrderToolbar";
import SalesOrderTable from "./pages/SalesOrders/SalesOrderTable";
import SalesOrderCard from "./pages/SalesOrders/SalesOrderCard";
import SalesOrderPagination from "./pages/SalesOrders/SalesOrderPagination";
import DeleteSalesOrderDialog from "./pages/SalesOrders/DeleteSalesOrderDialog";
import SalesOrderCreate from "./pages/SalesOrders/SalesOrderCreate";



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
import ReviewCreate from "./pages/Reviews/ReviewCreate";
import ReviewDetails from "./pages/Reviews/ReviewDetails";
import ReviewEdit from "./pages/Reviews/ReviewEdit";
import ReviewFilters from "./pages/Reviews/ReviewFilters";
import ReviewForm from "./pages/Reviews/ReviewForm";




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
import SalesInvoiceCreate from "./pages/SalesInvoices/SalesInvoiceCreate";
import SalesInvoiceDetails from "./pages/SalesInvoices/SalesInvoiceDetails";
import SalesInvoiceEdit from "./pages/SalesInvoices/SalesInvoiceEdit";
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
import SalesOrderItemDetails from "./pages/SalesOrderItems/SalesOrderItemDetails";
import SalesOrderItemCreate from "./pages/SalesOrderItems/SalesOrderItemCreate";
import SalesOrderItemEdit from "./pages/SalesOrderItems/SalesOrderItemEdit";




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
import SellerCustomerCreate from "./pages/SellerCustomers/SellerCustomerCreate";
import SellerCustomerDetails from "./pages/SellerCustomers/SellerCustomerDetails";
import SellerCustomerEdit from "./pages/SellerCustomers/SellerCustomerEdit";

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


// =========================================================
// APP
// =========================================================


function App() {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />


      {/* =====================================================
          PROTECTED APPLICATION
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
          element={<Navigate to="/dashboard"  />}
        />

        {/* ===================================================
            DASHBOARD
        =================================================== */}

        <Route path="dashboard" element={<Dashboard />} />


        {/* ===================================================
            PROFILE
        =================================================== */}

        <Route path="profile" element={<UserProfile />} />
        <Route path="profile/card" element={<UserProfileCard />} />


      {/* ===================================================
    BRANDS
=================================================== */}

<Route
    path="brands"
    element={<BrandList />}
/>

<Route
    path="brands/create"
    element={<BrandCreate />}
/>

<Route
    path="brands/details/:id"
    element={<BrandDetails />}
/>

<Route
    path="brands/:id/edit"
    element={<BrandEdit />}
/>

<Route
    path="brands/view/:id"
    element={<BrandView />}
/>

<Route
    path="brands/search"
    element={<BrandSearch />}
/>

<Route
    path="brands/filters"
    element={<BrandFilters />}
/>

<Route
    path="brands/statistics"
    element={<BrandStatistics />}
/>

// =========================================================
// WAREHOUSE MANAGEMENT
// =========================================================

<Route
    path="warehouses"
    element={<WarehouseList />}
/>

<Route
    path="warehouses/:id"
    element={<WarehouseDetails />}
/>
<Route
    path="warehouses/details/:id"
    element={<WarehouseDetails />}
/>
// =========================================================
// WAREHOUSE MANAGEMENT
// =========================================================

<Route
    path="warehouses"
    element={<WarehouseList />}
/>

<Route
    path="warehouses/:id"
    element={<WarehouseDetails />}
/>

<Route
    path="warehouses/view/:id"
    element={<WarehouseView />}
/>

<Route
    path="warehouses/edit/:id"
    element={<WarehouseList />}
/>
<Route
    path="warehouse-locations"
    element={
        <WarehouseLocationList />
    }
/>

<Route
    path="warehouse-locations/create"
    element={
        <WarehouseLocationCreate />
    }
/>

<Route
    path="warehouse-locations/edit/:id"
    element={
        <WarehouseLocationEdit />
    }
/>

<Route
    path="warehouse-locations/details/:id"
    element={
        <WarehouseLocationDetails />
    }
/>
{/* ===================================================
    BRAND MODELS
=================================================== */}

<Route
    path="brands/:brandId/models"
    element={<BrandModelTable />}
/>

<Route
    path="brands/:brandId/models/new"
    element={<BrandModelForm />}
/>

<Route
    path="brands/:brandId/models/:modelId"
    element={<BrandModelView />}
/>

<Route
    path="brands/:brandId/models/:modelId/edit"
    element={<BrandModelForm />}
/>

{/* =========================================================
    CATALOG
========================================================= */}

<Route
    path="catalog"
    element={<CatalogList />}
/>

<Route
    path="catalog/create"
    element={<CatalogForm />}
/>

<Route
    path="catalog/view/:id"
    element={<CatalogView />}
/>

<Route
    path="catalog/:id/edit"
    element={<CatalogForm />}
/>

<Route
    path="catalog/search"
    element={<CatalogSearch />}
/>

<Route
    path="catalog/filters"
    element={<CatalogFilters />}
/>

<Route
    path="catalog/brand/:brandId"
    element={<CatalogList />}
/>

<Route
    path="catalog/category/:categoryId"
    element={<CatalogList />}
/>

<Route
    path="catalog/producttype/:productTypeId"
    element={<CatalogList />}
/>

<Route
    path="catalog/latest"
    element={<CatalogList />}
/>

<Route
    path="catalog/featured"
    element={<CatalogList />}
/>

<Route
    path="catalog/toprated"
    element={<CatalogList />}
/>

<Route
    path="catalog/bestsellers"
    element={<CatalogList />}
/>

<Route
    path="catalog/:productId/images"
    element={<CatalogImages />}
/>

<Route
    path="catalog/:productId/attributes"
    element={<CatalogAttributes />}
/>

<Route
    path="catalog/:productId/reviews"
    element={<CatalogReviews />}
/>
<Route
    path="/catalog/products"
    element={<CatalogView />}
/>
{/* Catalog Route */}
        <Route path="catalog" element={<Catalog />} />


  {/* ===================================================
           Seller
        =================================================== */}

<Route
    path="/sellers"
    element={<SellerList />}
/>

<Route
    path="/sellers/create"
    element={<SellerCreate />}
/>

<Route
    path="/sellers/details/:id"
    element={<SellerDetails />}
/>

<Route
    path="/sellers/edit/:id"
    element={<SellerEdit />}
/>

<Route
    path="/sellers/search"
    element={<SellerSearch />}
/>

<Route
    path="/sellers/filters"
    element={<SellerFilters />}
/>

<Route
    path="/sellers/statistics"
    element={<SellerStatistics />}
/>

<Route
    path="/sellers/view/:id"
    element={<SellerView />}
/>



        {/* ===================================================
            CATEGORIES
        =================================================== */}
      // =========================================================
// CATEGORY ROUTES
// =========================================================

<Route
    path="categories"
    element={<CategoryList />}
/>

<Route
    path="categories/create"
    element={<CategoryCreate />}
/>

<Route
    path="categories/details/:id"
    element={<CategoryDetails />}
/>

<Route
    path="categories/edit/:categoryId"
    element={<CategoryEdit />}
/>

<Route
    path="categories/view/:id"
    element={<CategoryView />}
/>

<Route
    path="categories/search"
    element={<CategorySearch />}
/>

<Route
    path="categories/filters"
    element={<CategoryFilters />}
/>

<Route
    path="categories/statistics"
    element={<CategoryStatistics />}
/>

<Route
    path="categories/table"
    element={<CategoryList />}
/>

<Route
    path="categories/:id/products"
    element={<CategoryProducts />}
/>

<Route
    path="categories/form"
    element={<CategoryForm />}
/>

<Route
    path="categories/modal"
    element={<CategoryModal />}
/>

<Route
    path="categories/card"
    element={
        <CategoryCard
            category={{
                categoryId: 1,
                categoryName: "Mobiles",
                description:
                    "Mobile phones and accessories",
                parentCategoryName:
                    "Electronics",
                isActive: true
            }}
        />
    }
/>
       
        

        {/* ===================================================
            CUSTOMER ADDRESSES
        =================================================== */}

        <Route path="customer-addresses" element={<CustomerAddressList />} />
        <Route path="customer-addresses/:id" element={<CustomerAddressView />} />
        <Route path="customer-addresses/search" element={<CustomerAddressSearch />} />
        <Route path="customer-addresses/statistics" element={<CustomerAddressStatistics />} />


        {/* ===================================================
            CUSTOMER PAYMENTS
        =================================================== */}

        <Route path="customer-payments" element={<CustomerPaymentList />} />
        <Route path="customer-payments/:id" element={<CustomerPaymentView />} />
        <Route path="customer-payments/search" element={<CustomerPaymentSearch />} />
        <Route path="customer-payments/statistics" element={<CustomerPaymentStatistics />} />



// ========================================================= // ROUTES // ========================================================= 
// =========================================================
// stock-transfers ROUTES
// =========================================================

<Route
    path="stock-transfers"
    element={<StockTransferList />}
/>

<Route
    path="stock-transfers/create"
    element={
        <StockTransferForm
            onSuccess={() => {
                window.location.href =
                    "/stock-transfers";
            }}
            onCancel={() => {
                window.location.href =
                    "/stock-transfers";
            }}
        />
    }
/>

<Route
    path="/stock-transfers/create"
    element={<StockTransferForm />}
/>

<Route
    path="/stock-transfers/:stockTransferId"
    element={<StockTransferView />}
/>

<Route
    path="/stock-transfers/:stockTransferId/edit"
    element={<StockTransferForm />}
/>
<Route
    path="/stock-transfers/:stockTransferId"
    element={<StockTransferView />}
/>

<Route
    path="/stock-transfers/:stockTransferId/edit"
    element={<StockTransferForm />}
/>
<Route path="stock-transfers/:stockTransferId" element={<StockTransferView />} />
<Route path="stock-transfers/:stockTransferId/edit" element={<StockTransferForm />} />
<Route path="stock-transfers/details/:stockTransferId" element={<StockTransferDetails />} />
<Route
    path="stock-transfers/:stockTransferId/edit"
    element={<StockTransferEdit />}
/>

          {/* ===================================================
    CUSTOMER RETURNS
=================================================== */}

<Route
    path="customer-returns"
    element={<CustomerReturnList />}
/>
<Route
    path="customer-returns"
    element={<CustomerReturnList />}
/>

<Route
    path="customer-returns/search"
    element={<CustomerReturnSearch />}
/>

<Route
    path="customer-returns/statistics"
    element={<CustomerReturnStatistics />}
/>

<Route
    path="customer-returns/:id"
    element={<CustomerReturnView />}
/>

<Route
    path="customer-returns/:id/edit"
    element={<CustomerReturnEdit />}
/>

<Route
    path="customer-returns/details/:id"
    element={<CustomerReturnView />}
/>

<Route
    path="customer-returns/edit/:id"
    element={<CustomerReturnEdit />}
/>

            {/* =================================================
                STOCK ADJUSTMENTS
            ================================================= */}

            <Route
                path="stock-adjustments"
                element={<StockAdjustmentList />}
            />

            <Route
                path="stock-adjustments/create"
                element={<StockAdjustmentCreate />}
            />

            <Route
                path="stock-adjustments/search"
                element={<StockAdjustmentSearch />}
            />

            <Route
                path="stock-adjustments/statistics"
                element={<StockAdjustmentStatistics />}
            />

            <Route
                path="stock-adjustments/view/:id"
                element={<StockAdjustmentView />}
            />

            <Route
                path="stock-adjustments/edit/:id"
                element={<StockAdjustmentEdit />}
            />
 


    {/* =====================================================
        STOCK LEDGER
    ====================================================== */}

    <Route
        path="/stock-ledger"
        element={<StockLedgerList />}
    />

    <Route
        path="/stock-ledger/create"
        element={<StockLedgerCreate />}
    />

    <Route
        path="/stock-ledger/edit/:id"
        element={<StockLedgerEdit />}
    />

    <Route
        path="/stock-ledger/view/:id"
        element={<StockLedgerDetails />}
    />
                <Route
                    path="/stock-ledger"
                    element={<StockLedgerList />}
                />

                <Route
                    path="/stock-ledger/create"
                    element={<StockLedgerCreate />}
                />
                <Route
                    path="/stock-ledger/edit/:id"
                    element={<StockLedgerEdit /> }
                />
                <Route
                    path="/stock-ledger/view/:id"
                    element={<StockLedgerDetails />}
                    />

                    <Route
    path="/stock-ledger/create"
    element={<StockLedgerCreate />}
/>


    {/* =====================================================
        SUPPLIER MAIN PAGES
       ===================================================== */}

    <Route
        path="/suppliers"
        element={<SupplierList />}
    />

    <Route
        path="/suppliers/create"
        element={<SupplierCreate />}
    />

    <Route
        path="/suppliers/edit/:id"
        element={<SupplierEdit />}
    />

    <Route
        path="/suppliers/view/:id"
        element={<SupplierView />}
    />

    <Route
        path="/suppliers/details/:id"
        element={<SupplierDetails />}
    />
<Route
    path="/suppliers/card"
    element={
        <SupplierCard
            supplier={null}
        />
    }
/>

    {/* =====================================================
        SUPPLIER STATISTICS
       ===================================================== */}

    <Route
        path="/suppliers/statistics"
        element={
            <SupplierStatistics
                suppliers={[]}
            />
        }
    />


    {/* =====================================================
        SUPPLIER PAGINATION
       ===================================================== */}

    <Route
        path="/suppliers/pagination"
        element={
            <SupplierPagination
                page={1}
                setPage={() => {}}
                rowsPerPage={10}
                setRowsPerPage={() => {}}
                totalPages={1}
                totalItems={0}
            />
        }
    />


    {/* =====================================================
        SUPPLIER FILTERS
       ===================================================== */}

    <Route
        path="/suppliers/filters"
        element={
            <SupplierFilters
                sort=""
                setSort={() => {}}
            />
        }
    />


    {/* =====================================================
        SUPPLIER SEARCH
       ===================================================== */}

    <Route
        path="/suppliers/search"
        element={
            <SupplierSearch
                searchText=""
                setSearchText={() => {}}
            />
        }
    />


    {/* =====================================================
        SUPPLIER TOOLBAR
       ===================================================== */}

    <Route
        path="/suppliers/toolbar"
        element={
            <SupplierToolbar
                searchText=""
                setSearchText={() => {}}
                sort=""
                setSort={() => {}}
                onCreate={() => {}}
                onRefresh={() => {}}
            />
        }
    />


    {/* =====================================================
        SUPPLIER TABLE
       ===================================================== */}

    <Route
        path="/suppliers/table"
        element={
            <SupplierTable
                suppliers={[]}
                onView={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
            />
        }
    />
        {/* ===================================================
            DELIVERY CHALLANS
        =================================================== */}

        <Route path="delivery-challans" element={<DeliveryChallanList />} />
        <Route path="delivery-challans/:id" element={<DeliveryChallanView />} />
        <Route path="delivery-challans/search" element={<DeliveryChallanSearch />} />
        <Route path="delivery-challans/statistics" element={<DeliveryChallanStatistics />} />


        {/* ===================================================
            DELIVERY CHALLAN ITEMS
        =================================================== */}

        <Route path="delivery-challan-items" element={<DeliveryChallanItemList />} />
        <Route path="delivery-challan-items/:id" element={<DeliveryChallanItemView />} />
        <Route path="delivery-challan-items/search" element={<DeliveryChallanItemSearch />} />
        <Route path="delivery-challan-items/statistics" element={<DeliveryChallanItemStatistics />} />


        {/* ===================================================
            GOODS RECEIPT NOTES
        =================================================== */}

        <Route path="goods-receipt-notes" element={<GoodsReceiptNoteList />} />
        <Route path="goods-receipt-notes/:id" element={<GoodsReceiptNoteView />} />
        <Route path="goods-receipt-notes/search" element={<GoodsReceiptNoteSearch />} />
        <Route path="goods-receipt-notes/statistics" element={<GoodsReceiptNoteStatistics />} />


        {/* ===================================================
            GOODS RECEIPT ITEMS
        =================================================== */}

        <Route path="goods-receipt-items" element={<GoodsReceiptNoteItemList />} />
        <Route path="goods-receipt-items/:id" element={<GoodsReceiptNoteItemView />} />
        <Route path="goods-receipt-items/search" element={<GoodsReceiptNoteItemSearch />} />
        <Route path="goods-receipt-items/statistics" element={<GoodsReceiptNoteItemStatistics />} />


        {/* ===================================================
            MARKETPLACE ORDER ITEMS
        =================================================== */}

        <Route path="marketplace-order-items" element={<MarketplaceOrderItemList />} />
        <Route path="marketplace-order-items/:id" element={<MarketplaceOrderItemView />} />
        <Route path="marketplace-order-items/search" element={<MarketplaceOrderItemSearch />} />
        <Route path="marketplace-order-items/statistics" element={<MarketplaceOrderItemStatistics />} />


        {/* ===================================================
            MARKETPLACE RETURNS
        =================================================== */}

        <Route path="marketplace-returns" element={<MarketplaceReturnList />} />
        <Route path="marketplace-returns/:id" element={<MarketplaceReturnView />} />
        <Route path="marketplace-returns/search" element={<MarketplaceReturnSearch />} />
        <Route path="marketplace-returns/statistics" element={<MarketplaceReturnStatistics />} />


        {/* ===================================================
            NOTIFICATIONS
        =================================================== */}

        <Route path="notifications" element={<NotificationList />} />
        <Route path="notifications/:id" element={<NotificationView />} />
        <Route path="notifications/settings" element={<NotificationSettings />} />


        {/* ===================================================
            ORDER ITEMS
        =================================================== */}

        <Route path="order-items" element={<OrderItemList />} />
        <Route path="order-items/:id" element={<OrderItemView />} />
        <Route path="order-items/search" element={<OrderItemSearch />} />
        <Route path="order-items/statistics" element={<OrderItemStatistics />} />


        {/* ===================================================
            ORDER STATUS HISTORY
        =================================================== */}

        <Route path="order-status-history" element={<OrderStatusHistoryList />} />
        <Route path="order-status-history/:id" element={<OrderStatusHistoryView />} />
        <Route path="order-status-history/search" element={<OrderStatusHistorySearch />} />
        <Route path="order-status-history/statistics" element={<OrderStatusHistoryStatistics />} />


        {/* ===================================================
            PAYMENT SETTINGS
        =================================================== */}

        <Route path="payment-settings" element={<PaymentSettings />} />
        <Route path="payment-settings/bank-details" element={<BankDetails />} />
        <Route path="payment-settings/payment-gateway" element={<PaymentGateway />} />
        <Route path="payment-settings/upi" element={<UpiSettings />} />


   
{/* =========================================================
    PRODUCT ATTRIBUTES
    ========================================================= */}

<Route
    path="product-attributes"
    element={<ProductAttributeList />}
/>

<Route
    path="product-attributes/create"
    element={<ProductAttributeCreate />}
/>

<Route
    path="product-attributes/details/:id"
    element={<ProductAttributeDetails />}
/>

<Route
    path="product-attributes/view/:id"
    element={<ProductAttributeView />}
/>

<Route
    path="product-attributes/edit/:id"
    element={<ProductAttributeEdit />}
/>

<Route
    path="product-attributes/search"
    element={<ProductAttributeSearch />}
/>

<Route
    path="product-attributes/statistics"
    element={<ProductAttributeStatistics />}
/>

<Route
    path="product-attributes/filters"
    element={<ProductAttributeFilters />}
/>

<Route
    path="product-attributes/table"
    element={<ProductAttributeTable />}
/>

<Route
    path="product-attributes/card"
    element={<ProductAttributeCard />}
/>

<Route
    path="product-attributes/form"
    element={<ProductAttributeForm />}
/>

<Route
    path="product-attributes/modal"
    element={<ProductAttributeModal />}
/>

<Route
    path="product-attributes/pagination"
    element={<ProductAttributePagination />}
/>

<Route
    path="product-attributes/toolbar"
    element={<ProductAttributeToolbar />}
/>




        {/* ===================================================
            PRODUCT IMAGES
        =================================================== */}

        <Route path="product-images" element={<ProductImageList />} />
        <Route path="product-images/:id" element={<ProductImageView />} />
        <Route path="product-images/search" element={<ProductImageSearch />} />
        <Route path="product-images/statistics" element={<ProductImageStatistics />} />
        <Route path="/" element={<MainLayout />}>

    {/* Product Images */}
    <Route
        path="product-images"
        element={<ProductImageList />}
    />

    <Route
        path="product-images/create"
        element={<ProductImageCreate />}
    />

    <Route
        path="product-images/edit/:id"
        element={<ProductImageEdit />}
    />

    <Route
        path="product-images/details/:id"
        element={<ProductImageDetails />}
    />

</Route>


     
{/* =====================================================
PRODUCT INVENTORY
===================================================== */}

<Route
path="product-inventory"
element={<ProductInventoryList />}
/>

<Route
path="product-inventory/create"
element={<ProductInventoryCreate />}
/>

<Route
path="product-inventory/details/:id"
element={<ProductInventoryView />}
/>

<Route
path="product-inventory/edit/:id"
element={<ProductInventoryEdit />}
/>

<Route
path="product-inventory/search"
element={<ProductInventoryList />}
/>

<Route
path="product-inventory/filters"
element={<ProductInventoryList />}
/>

<Route
path="product-inventory/statistics"
element={<ProductInventoryList />}
/>

<Route
path="product-inventory/table"
element={<ProductInventoryList />}
/>

<Route
path="product-inventory/card"
element={<ProductInventoryList />}
/>

<Route
path="product-inventory/form"
element={<ProductInventoryList />}
/>

<Route
path="product-inventory/modal"
element={<ProductInventoryList />}
/>

<Route
path="product-inventory/pagination"
element={<ProductInventoryList />}
/>

<Route
path="product-inventory/toolbar"
element={<ProductInventoryList />}
/>
<Route
    path="product-inventory/details/:id"
    element={<ProductInventoryDetails />}
/>
<Route
    path="product-inventory/view/:id"
    element={<ProductInventoryView />}
/>

{/* =========================================================
PRODUCT PRICE ROUTES
========================================================= */}

{/* Product Price List */}
<Route
path="product-prices"
element={<ProductPriceList />}
/>

{/* Create Product Price */}
<Route
path="product-prices/create"
element={<ProductPriceCreate />}
/>

{/* Product Price Details */}
<Route
path="product-prices/details/:id"
element={<ProductPriceDetails />}
/>


{/* Product Price Edit */}
<Route
path="product-prices/edit/:id"
element={<ProductPriceEdit />}
/>

{/* Product Price View */}
<Route
path="product-prices/view/:id"
element={<ProductPriceView />}
/>

{/* Product Price Search */}
<Route
path="product-prices/search"
element={<ProductPriceSearch />}
/>

{/* Product Price Filters */}
<Route
path="product-prices/filters"
element={<ProductPriceFilters />}
/>

{/* Product Price Statistics */}
<Route
path="product-prices/statistics"
element={<ProductPriceStatistics />}
/>

{/* Product Price Table */}
<Route
path="product-prices/table"
element={<ProductPriceTable />}
/>

{/* Product Price Card */}
<Route
path="product-prices/card"
element={<ProductPriceCard />}
/>

{/* Product Price Form */}
<Route
path="product-prices/form"
element={<ProductPriceForm />}
/>

{/* Product Price Modal */}
<Route
path="product-prices/modal"
element={<ProductPriceModal />}
/>

{/* Product Price Pagination */}
<Route
path="product-prices/pagination"
element={<ProductPricePagination />}
/>

{/* Product Price Toolbar */}
<Route
path="product-prices/toolbar"
element={<ProductPriceToolbar />}
/>




        {/* ===================================================
            PRODUCTS
        =================================================== */}


<Route path="products" element={<Products />} />
<Route path="products/list" element={<ProductList />} />
<Route path="products/create" element={<ProductCreate />} />

{/* Product details */}
<Route path="products/:id" element={<ProductDetails />} />

{/* Product edit - recommended */}
<Route path="products/:id/edit" element={<ProductEdit />} />

{/* Product edit - also support /products/edit/:id */}
<Route path="products/edit/:id" element={<ProductEdit />} />

{/* Product view */}
<Route path="products/view/:id" element={<ProductView />} />

{/* Product search */}
<Route path="products/search" element={<ProductSearch />} />

{/* Product filters */}
<Route path="products/filters" element={<ProductFilters />} />

{/* Product statistics */}
<Route path="products/statistics" element={<ProductStatistics />} />


      {/* ===================================================
    PRODUCT TYPES
=================================================== */}
<Route
    path="product-types"
    element={<ProductTypeList />}
/>

<Route
    path="product-types/create"
    element={<ProductTypeCreate />}
/>

<Route
    path="product-types/details/:id"
    element={<ProductTypeDetails />}
/>

<Route
    path="product-types/edit/:id"
    element={<ProductTypeEdit />}
/>

<Route
    path="product-types/view/:id"
    element={<ProductTypeView />}
/>

<Route
    path="product-types/search"
    element={<ProductTypeSearch />}
/>

<Route
    path="product-types/filters"
    element={<ProductTypeFilters />}
/>

<Route
    path="product-types/statistics"
    element={<ProductTypeStatistics />}
/>

<Route
    path="product-types/table"
    element={<ProductTypeTable />}
/>

<Route
    path="product-types/card"
    element={<ProductTypeCard />}
/>

<Route
    path="product-types/form"
    element={<ProductTypeForm />}
/>

<Route
    path="product-types/modal"
    element={<ProductTypeModal />}
/>

<Route
    path="product-types/pagination"
    element={<ProductTypePagination />}
/>

<Route
    path="product-types/toolbar"
    element={<ProductTypeToolbar />}
/>


        {/* ===================================================
            PURCHASE ORDER ITEMS
        =================================================== */}

        <Route path="purchase-order-items" element={<PurchaseOrderItemList />} />
        <Route path="purchase-order-items/:id" element={<PurchaseOrderItemView />} />
        <Route path="purchase-order-items/search" element={<PurchaseOrderItemSearch />} />
        <Route path="purchase-order-items/statistics" element={<PurchaseOrderItemStatistics />} />


        {/* ===================================================
            PURCHASE ORDERS
        =================================================== */}

        <Route path="purchase-orders" element={<PurchaseOrderList />} />
        <Route path="purchase-orders/:id" element={<PurchaseOrderView />} />
        <Route path="purchase-orders/search" element={<PurchaseOrderSearch />} />
        <Route path="purchase-orders/statistics" element={<PurchaseOrderStatistics />} />
        <Route
    path="/purchase-orders"
    element={<PurchaseOrderList />}
/>

<Route
    path="/purchase-orders/create"
    element={<PurchaseOrderCreate />}
/>

<Route
    path="/purchase-orders/details/:id"
    element={<PurchaseOrderDetails />}
/>

<Route
    path="/purchase-orders/edit/:id"
    element={<PurchaseOrderEdit />}
/>


        {/* ===================================================
            PURCHASE RETURNS
        =================================================== */}

        <Route path="purchase-returns" element={<PurchaseReturnList />} />
        <Route path="purchase-returns/:id" element={<PurchaseReturnView />} />
        <Route path="purchase-returns/search" element={<PurchaseReturnSearch />} />
        <Route path="purchase-returns/statistics" element={<PurchaseReturnStatistics />} />


        {/* ===================================================
            REVIEWS
        =================================================== */}

        <Route path="reviews" element={<ReviewList />} />
        <Route path="reviews/:id" element={<ReviewView />} />
        <Route path="reviews/search" element={<ReviewSearch />} />
        <Route path="reviews/statistics" element={<ReviewStatistics />} />
<Route
    path="/reviews/create"
    element={<ReviewCreate />}
/>

<Route
    path="/reviews/details/:id"
    element={<ReviewDetails />}
/>

<Route
    path="/reviews/edit/:id"
    element={<ReviewEdit />}
/>
<Route
    path="/reviews/filters"
    element={<ReviewFilters />}
/>

<Route
    path="/reviews/statistics"
    element={<ReviewStatistics />}
/>

<Route
    path="/reviews/table"
    element={<ReviewTable />}
/>

<Route
    path="/reviews/card"
    element={<ReviewCard />}
/>

<Route
    path="/reviews/form"
    element={<ReviewForm />}
/>

<Route
    path="/reviews/modal"
    element={<ReviewModal />}
/>

<Route
    path="/reviews/pagination"
    element={<ReviewPagination />}
/>

<Route
    path="/reviews/toolbar"
    element={<ReviewToolbar />}
/>
<Route
    path="/reviews/table"
    element={<ReviewTable />}
/>


        {/* ===================================================
            SALES INVOICES
        =================================================== */}

        <Route path="sales-invoices" element={<SalesInvoiceList />} />
        <Route path="sales-invoices/:id" element={<SalesInvoiceView />} />
        <Route path="sales-invoices/search" element={<SalesInvoiceSearch />} />
        <Route path="sales-invoices/statistics" element={<SalesInvoiceStatistics />} />

        <Route
    path="/sales-invoices/create"
    element={<SalesInvoiceCreate />}
/>

<Route
    path="/sales-invoices/details/:id"
    element={<SalesInvoiceDetails />}
/>

<Route
    path="/sales-invoices/edit/:id"
    element={<SalesInvoiceEdit />}
/>


        {/* ===================================================
            SALES ORDER ITEMS
        =================================================== */}

        <Route path="sales-order-items" element={<SalesOrderItemList />} />
        <Route path="sales-order-items/:id" element={<SalesOrderItemView />} />
        <Route path="sales-order-items/search" element={<SalesOrderItemSearch />} />
        <Route path="sales-order-items/statistics" element={<SalesOrderItemStatistics />} />
        <Route
    path="/sales-order-items"
    element={<SalesOrderItemList />}
/>

<Route
    path="/sales-order-items/create"
    element={<SalesOrderItemCreate />}
/>

<Route
    path="/sales-order-items/details/:id"
    element={<SalesOrderItemDetails />}
/>

<Route
    path="/sales-order-items/edit/:id"
    element={<SalesOrderItemEdit />}
/>
  
{/* ===================================================
    SALES ORDERS
=================================================== */}

{/* Sales Order List */}
<Route
    path="sales-orders"
    element={<SalesOrderList />}
/>
{/* Create Sales Order */} 
<Route path="sales-orders/create" element={<SalesOrderCreate />} />

{/* Sales Order Details */}
<Route
    path="sales-orders/details/:id"
    element={<SalesOrderDetails />}
/>

{/* Sales Order Search */}
<Route
    path="sales-orders/search"
    element={<SalesOrderSearch />}
/>

{/* Sales Order Statistics */}
<Route
    path="sales-orders/statistics"
    element={<SalesOrderStatistics />}
/>
<Route path="sales-orders/card" element={<SalesOrderCard />} />

<Route path="sales-orders/edit/:id" element={<SalesOrderEdit />} />

<Route path="sales-orders/toolbar" element={<SalesOrderToolbar />} />

<Route path="sales-orders/pagination" element={<SalesOrderPagination />} />
<Route path="sales-orders/modal" element={<SalesOrderModal />} />

        {/* ===================================================
    SELLER CUSTOMERS
=================================================== */}

<Route
    path="/seller-customers"
    element={<SellerCustomerList />}
/>
<Route path="sales-orders/table" element={<SalesOrderTable />} />
<Route
    path="/seller-customers/create"
    element={<SellerCustomerCreate />}
/>
<Route path="/seller-customers/:customerId" element={<SellerCustomerView />} />
<Route
    path="/seller-customers/:id"
    element={<SellerCustomerDetails />}
/>

<Route
    path="/seller-customers/details/:sellerId/:customerId"
    element={<SellerCustomerDetails />}
/>

<Route
    path="/seller-customers/edit/:sellerId/:customerId"
    element={<SellerCustomerEdit />}
/>

<Route
    path="/seller-customers/edit/:id"
    element={<SellerCustomerEdit />}
/>

<Route
    path="/seller-customers/search"
    element={<SellerCustomerSearch />}
/>

<Route
    path="/seller-customers/statistics"
    element={<SellerCustomerStatistics />}
/>


        {/* ===================================================
            SHIPMENTS
        =================================================== */}

        <Route path="shipments" element={<ShipmentList />} />
        <Route path="shipments/:id" element={<ShipmentView />} />
        <Route path="shipments/search" element={<ShipmentSearch />} />
        <Route path="shipments/statistics" element={<ShipmentStatistics />} />


        {/* ===================================================
            WISHLISTS
        =================================================== */}

        <Route path="wishlists" element={<WishlistList />} />
        <Route path="wishlists/:id" element={<WishlistView />} />
        <Route path="wishlists/search" element={<WishlistSearch />} />
        <Route path="wishlists/statistics" element={<WishlistStatistics />} />

      </Route>


      {/* =====================================================
          GLOBAL 404
      ===================================================== */}

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default App;




