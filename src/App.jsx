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

/////////////////////////StockMovements/////////////////////////
import StockMovementList from "./pages/StockMovements/StockMovementList";
import StockMovementCreate from "./pages/StockMovements/StockMovementCreate";
import StockMovementEdit from "./pages/StockMovements/StockMovementEdit";
import StockMovementDetails from "./pages/StockMovements/StockMovementDetails";
import StockMovementDeleteDialog from "./pages/StockMovements/StockMovementDeleteDialog";
import StockMovementToolbar from "./pages/StockMovements/StockMovementToolbar";
import StockMovementStatistics from "./pages/StockMovements/StockMovementStatistics";
import StockMovementSearch from "./pages/StockMovements/StockMovementSearch";
import StockMovementFilters from "./pages/StockMovements/StockMovementFilters";
import StockMovementTable from "./pages/StockMovements/StockMovementTable";
import StockMovementPagination from "./pages/StockMovements/StockMovementPagination";

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
import CatalogCreate from "./pages/Catalog/CatalogCreate";
import CatalogEdit from "./pages/Catalog/CatalogEdit";

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




/* =========================================================
   GOODS RECEIPT NOTE ITEM IMPORTS
========================================================= */

import GoodsReceiptNoteItemList from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemList";
import GoodsReceiptNoteItemCreate from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemCreate";
import GoodsReceiptNoteItemDetails from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemDetails";
import GoodsReceiptNoteItemEdit from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemEdit";
import GoodsReceiptNoteItemFilters from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemFilters";
import GoodsReceiptNoteItemSearch from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemSearch";
import GoodsReceiptNoteItemStatistics from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemStatistics";
import GoodsReceiptNoteItemTable from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemTable";
import GoodsReceiptNoteItemCard from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemCard";
import GoodsReceiptNoteItemForm from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemForm";
import GoodsReceiptNoteItemModal from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemModal";
import GoodsReceiptNoteItemPagination from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemPagination";
import GoodsReceiptNoteItemToolbar from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemToolbar";
import GoodsReceiptNoteItemView from "./pages/GoodsReceiptNotes/GoodsReceiptNoteItemView";
import DeleteGoodsReceiptNoteItemDialog from "./pages/GoodsReceiptNotes/DeleteGoodsReceiptNoteItemDialog";

// =========================================================
// MARKETPLACE ORDER ITEMS
// =========================================================
import MarketplaceOrderItemList from "./pages/MarketplaceOrderItems/MarketplaceOrderItemList";
import MarketplaceOrderItemCreate from "./pages/MarketplaceOrderItems/MarketplaceOrderItemCreate";
import MarketplaceOrderItemEdit from "./pages/MarketplaceOrderItems/MarketplaceOrderItemEdit";
import MarketplaceOrderItemDetails from "./pages/MarketplaceOrderItems/MarketplaceOrderItemDetails";
import MarketplaceOrderItemSearch from "./pages/MarketplaceOrderItems/MarketplaceOrderItemSearch";
import MarketplaceOrderItemStatistics from "./pages/MarketplaceOrderItems/MarketplaceOrderItemStatistics";


// =========================================================
// MARKETPLACE RETURNS
// =========================================================

import MarketplaceReturnList from "./pages/MarketplaceReturns/MarketplaceReturnList";
import MarketplaceReturnSearch from "./pages/MarketplaceReturns/MarketplaceReturnSearch";
import MarketplaceReturnStatistics from "./pages/MarketplaceReturns/MarketplaceReturnStatistics";
import MarketplaceReturnView from "./pages/MarketplaceReturns/MarketplaceReturnView";


// =========================================================
// STOCK LEDGER IMPORTS
// =========================================================
// =========================================================
// STOCK LEDGER IMPORTS
// =========================================================

import StockLedgerList
    from "./pages/StockLedger/StockLedgerList";

import StockLedgerCreate
    from "./pages/StockLedger/StockLedgerCreate";

import StockLedgerEdit
    from "./pages/StockLedger/StockLedgerEdit";

import StockLedgerView
    from "./pages/StockLedger/StockLedgerView";

import StockLedgerDetails
    from "./pages/StockLedger/StockLedgerDetails";

import StockLedgerTable
    from "./pages/StockLedger/StockLedgerTable";

import StockLedgerCard
    from "./pages/StockLedger/StockLedgerCard";

import StockLedgerSearch
    from "./pages/StockLedger/StockLedgerSearch";

import StockLedgerFilters
    from "./pages/StockLedger/StockLedgerFilters";

import StockLedgerPagination
    from "./pages/StockLedger/StockLedgerPagination";

import StockLedgerStatistics
    from "./pages/StockLedger/StockLedgerStatistics";

import StockLedgerToolbar
    from "./pages/StockLedger/StockLedgerToolbar";

import DeleteStockLedgerDialog
    from "./pages/StockLedger/DeleteStockLedgerDialog";


// =========================================================
// MARKETPLACE RETURNS
// =========================================================

import DeleteMarketplaceReturnDialog from "./pages/MarketplaceReturns/DeleteMarketplaceReturnDialog";
import MarketplaceReturnCard from "./pages/MarketplaceReturns/MarketplaceReturnCard";
import MarketplaceReturnModal from "./pages/MarketplaceReturns/MarketplaceReturnModal";
import MarketplaceReturnPagination from "./pages/MarketplaceReturns/MarketplaceReturnPagination";
import MarketplaceReturnTable from "./pages/MarketplaceReturns/MarketplaceReturnTable";
import MarketplaceReturnToolbar from "./pages/MarketplaceReturns/MarketplaceReturnToolbar";


// =========================================================
// NOTIFICATIONS
// =========================================================

import NotificationCard from "./pages/Notifications/NotificationCard";
import NotificationList from "./pages/Notifications/NotificationList";
import NotificationSettings from "./pages/Notifications/NotificationSettings";
import NotificationView from "./pages/Notifications/NotificationView";


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
/* =========================================================
   ORDER STATUS HISTORY IMPORTS
========================================================= */

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
import CreateOrderStatusHistory from "./pages/OrderStatusHistory/CreateOrderStatusHistory";
import EditOrderStatusHistory from "./pages/OrderStatusHistory/EditOrderStatusHistory";
import DetailedOrderStatusHistory from "./pages/OrderStatusHistory/DetailedOrderStatusHistory";
import OrderStatusHistoryForm from "./pages/OrderStatusHistory/OrderStatusHistoryForm";


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
import PurchaseOrderItemCreate from "./pages/PurchaseOrderItems/PurchaseOrderItemCreate";
import PurchaseOrderItemDetails from "./pages/PurchaseOrderItems/PurchaseOrderItemDetails";
import PurchaseOrderItemEdit from "./pages/PurchaseOrderItems/PurchaseOrderItemEdit";
import PurchaseOrderItemList from "./pages/PurchaseOrderItems/PurchaseOrderItemList";
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
import PurchaseOrderStatistics from "./pages/PurchaseOrders/PurchaseOrderStatistics";
import PurchaseOrderTable from "./pages/PurchaseOrders/PurchaseOrderTable";
import PurchaseOrderToolbar from "./pages/PurchaseOrders/PurchaseOrderToolbar";
import PurchaseOrderView from "./pages/PurchaseOrders/PurchaseOrderView";
import PurchaseOrderCreate from "./pages/PurchaseOrders/PurchaseOrderCreate";
import PurchaseOrderDetails from "./pages/PurchaseOrders/PurchaseOrderDetails";
import PurchaseOrderEdit from "./pages/PurchaseOrders/PurchaseOrderEdit";
import PurchaseOrderSearch from "./pages/PurchaseOrders/PurchaseOrderSearch";


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
import PurchaseReturnCreate from "./pages/PurchaseReturns/PurchaseReturnCreate";
import PurchaseReturnEdit from "./pages/PurchaseReturns/PurchaseReturnEdit";
import PurchaseReturnDetails from "./pages/PurchaseReturns/PurchaseReturnDetails";

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
import WishlistItemsDetails from "./pages/WishlistItems/WishlistItemsDetails";
import WishlistItemsCreate from "./pages/WishlistItems/WishlistItemsCreate";
import WishlistItemsEdit from "./pages/WishlistItems/WishlistItemsEdit";
import WishlistCreate from "./pages/Wishlists/WishlistCreate";
import WishlistDetails from "./pages/Wishlists/WishlistDetails";
import WishlistEdit from "./pages/Wishlists/WishlistEdit";
import WishlistItemList from "./pages/WishlistItems/WishlistItemList";
import WishlistItemView from "./pages/WishlistItems/WishlistItemView";

// =========================================================
// ORDERS
// =========================================================

import DeleteOrderDialog from "./pages/Orders/DeleteOrderDialog";
import OrderCard from "./pages/Orders/OrderCard";
import OrderList from "./pages/Orders/OrderList";
import OrderModal from "./pages/Orders/OrderModal";
import OrderPagination from "./pages/Orders/OrderPagination";
import OrderSearch from "./pages/Orders/OrderSearch";
import OrderStatistics from "./pages/Orders/OrderStatistics";
import OrderTable from "./pages/Orders/OrderTable";
import OrderToolbar from "./pages/Orders/OrderToolbar";
import OrderView from "./pages/Orders/OrderView";
import OrderCreate from "./pages/Orders/OrderCreate";
import OrderDetails from "./pages/Orders/OrderDetails";
import OrderEdit from "./pages/Orders/OrderEdit";


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
import OrderItemCreate from "./pages/OrderItems/OrderItemCreate";
import OrderItemDetails from "./pages/OrderItems/OrderItemDetails";
import OrderItemEdit from "./pages/OrderItems/OrderItemEdit";

// =========================================================
// MARKETPLACE IMPORTS
// =========================================================

import MarketplaceList from "./pages/Marketplaces/MarketplaceList";
import MarketplaceCard from "./pages/Marketplaces/MarketplaceCard";
import MarketplaceTable from "./pages/Marketplaces/MarketplaceTable";
import MarketplaceToolbar from "./pages/Marketplaces/MarketplaceToolbar";
import MarketplaceSearch from "./pages/Marketplaces/MarketplaceSearch";
import MarketplacePagination from "./pages/Marketplaces/MarketplacePagination";
import MarketplaceStatistics from "./pages/Marketplaces/MarketplaceStatistics";
import MarketplaceModal from "./pages/Marketplaces/MarketplaceModal";
import DeleteMarketplaceDialog from "./pages/Marketplaces/DeleteMarketplaceDialog";
import MarketplaceCreate from "./pages/Marketplaces/MarketplaceCreate";
import MarketplaceDetails from "./pages/Marketplaces/MarketplaceDetails";
import MarketplaceEdit from "./pages/Marketplaces/MarketplaceEdit";
import MarketplaceCardPage from "./pages/Marketplaces/MarketplaceCardPage";
import MarketplaceSelector from "./pages/Marketplaces/MarketplaceSelector";

// =========================================================
// MARKETPLACE ORDER IMPORTS
// =========================================================

import MarketplaceOrderList from "./pages/MarketplaceOrder/MarketplaceOrderList";
import MarketplaceOrderCard from "./pages/MarketplaceOrder/MarketplaceOrderCard";
import MarketplaceOrderTable from "./pages/MarketplaceOrder/MarketplaceOrderTable";
import MarketplaceOrderToolbar from "./pages/MarketplaceOrder/MarketplaceOrderToolbar";
import MarketplaceOrderSearch from "./pages/MarketplaceOrder/MarketplaceOrderSearch";
import MarketplaceOrderPagination from "./pages/MarketplaceOrder/MarketplaceOrderPagination";
import MarketplaceOrderStatistics from "./pages/MarketplaceOrder/MarketplaceOrderStatistics";
import MarketplaceOrderModal from "./pages/MarketplaceOrder/MarketplaceOrderModal";
import DeleteMarketplaceOrderDialog from "./pages/MarketplaceOrder/DeleteMarketplaceOrderDialog";
import MarketplaceOrderCreate from "./pages/MarketplaceOrder/MarketplaceOrderCreate";
import MarketplaceOrderDetails from "./pages/MarketplaceOrder/MarketplaceOrderDetails";
import MarketplaceOrderEdit from "./pages/MarketplaceOrder/MarketplaceOrderEdit";
import MarketplaceOrderCardPage from "./pages/MarketplaceOrder/MarketplaceOrderCardPage";




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

            <Route
                path="/login"
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
                PROTECTED APPLICATION
            ===================================================== */}

            <Route
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >

                {/* =================================================
                    DEFAULT
                ================================================= */}

                <Route
                    index
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

                {/* =================================================
                    DASHBOARD
                ================================================= */}

                <Route
                    path="dashboard"
                    element={<Dashboard />}
                />


                {/* =================================================
                    PROFILE
                ================================================= */}

                <Route
                    path="profile"
                    element={<UserProfile />}
                />

                <Route
                    path="profile/card"
                    element={<UserProfileCard />}
                />


                {/* =================================================
                    MARKETPLACE SELECTION
                ================================================= */}

                <Route
                    path="marketplaces"
                    element={<MarketplaceSelector />}
                />


                {/* =================================================
                    BRANDS
                ================================================= */}

                <Route
                    path="brands"
                    element={<BrandList />}
                />

                <Route
                    path="brands/create"
                    element={<BrandCreate />}
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

                <Route
                    path="brands/details/:id"
                    element={<BrandDetails />}
                />

                <Route
                    path="brands/view/:id"
                    element={<BrandView />}
                />

                <Route
                    path="brands/:id/edit"
                    element={<BrandEdit />}
                />


                {/* =================================================
                    BRAND MODELS
                ================================================= */}

                <Route
                    path="brands/:brandId/models/new"
                    element={<BrandModelForm />}
                />

                <Route
                    path="brands/:brandId/models/:modelId/edit"
                    element={<BrandModelForm />}
                />

                <Route
                    path="brands/:brandId/models/:modelId"
                    element={<BrandModelView />}
                />

                <Route
                    path="brands/:brandId/models"
                    element={<BrandModelTable />}
                />


                {/* =================================================
                    SELLERS
                ================================================= */}

                <Route
                    path="sellers"
                    element={<SellerList />}
                />

                <Route
                    path="sellers/create"
                    element={<SellerCreate />}
                />

                <Route
                    path="sellers/search"
                    element={<SellerSearch />}
                />

                <Route
                    path="sellers/filters"
                    element={<SellerFilters />}
                />

                <Route
                    path="sellers/statistics"
                    element={<SellerStatistics />}
                />

                <Route
                    path="sellers/details/:id"
                    element={<SellerDetails />}
                />

                <Route
                    path="sellers/view/:id"
                    element={<SellerView />}
                />

                <Route
                    path="sellers/edit/:id"
                    element={<SellerEdit />}
                />


                {/* =================================================
                    SELLER CUSTOMERS
                ================================================= */}

                <Route
                    path="seller-customers"
                    element={<SellerCustomerList />}
                />

                <Route
                    path="seller-customers/create"
                    element={<SellerCustomerCreate />}
                />

                <Route
                    path="seller-customers/search"
                    element={<SellerCustomerSearch />}
                />

                <Route
                    path="seller-customers/statistics"
                    element={<SellerCustomerStatistics />}
                />

                <Route
                    path="seller-customers/details/:sellerId/:customerId"
                    element={<SellerCustomerDetails />}
                />

                <Route
                    path="seller-customers/edit/:sellerId/:customerId"
                    element={<SellerCustomerEdit />}
                />


                {/* =================================================
                    CATEGORIES
                ================================================= */}

                <Route
                    path="categories"
                    element={<CategoryList />}
                />

                <Route
                    path="categories/create"
                    element={<CategoryCreate />}
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
                    path="categories/products/:id"
                    element={<CategoryProducts />}
                />


                {/* =================================================
                    WAREHOUSES
                ================================================= */}

                <Route
                    path="warehouses"
                    element={<WarehouseList />}
                />

                <Route
                    path="warehouses/create"
                    element={<WarehouseCreate />}
                />

                <Route
                    path="warehouses/details/:id"
                    element={<WarehouseDetails />}
                />

                <Route
                    path="warehouses/view/:id"
                    element={<WarehouseView />}
                />

                <Route
                    path="warehouses/edit/:id"
                    element={<WarehouseEdit />}
                />


                {/* =================================================
                    WAREHOUSE LOCATIONS
                ================================================= */}

                <Route
                    path="warehouse-locations"
                    element={<WarehouseLocationList />}
                />

                <Route
                    path="warehouse-locations/create"
                    element={<WarehouseLocationCreate />}
                />

                <Route
                    path="warehouse-locations/details/:id"
                    element={<WarehouseLocationDetails />}
                />

                <Route
                    path="warehouse-locations/edit/:id"
                    element={<WarehouseLocationEdit />}
                />


                {/* =================================================
                    CATALOG
                ================================================= */}

                <Route
                    path="catalog"
                    element={<CatalogList />}
                />

                <Route
                    path="catalog/create"
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
                    path="catalog/view/:id"
                    element={<CatalogView />}
                />

                <Route
                    path="catalog/:id/edit"
                    element={<CatalogEdit />}
                />

                <Route
                    path="catalog/products"
                    element={<CatalogView />}
                />


                {/* =================================================
                    PRODUCTS
                ================================================= */}

                <Route
                    path="products/list"
                    element={<ProductList />}
                />

                <Route
                    path="products/create"
                    element={<ProductCreate />}
                />

                <Route
                    path="products/search"
                    element={<ProductSearch />}
                />

                <Route
                    path="products/filters"
                    element={<ProductFilters />}
                />

                <Route
                    path="products/statistics"
                    element={<ProductStatistics />}
                />

                <Route
                    path="products/sku/:sku"
                    element={<ProductView />}
                />

                <Route
                    path="products/seller/:sellerId/customer/:customerId"
                    element={<ProductList />}
                />

                <Route
                    path="products/seller/:sellerId"
                    element={<ProductList />}
                />

                <Route
                    path="products/customer/:customerId"
                    element={<ProductList />}
                />

                <Route
                    path="products/brand/:brandId"
                    element={<ProductList />}
                />

                <Route
                    path="products/category/:categoryId"
                    element={<ProductList />}
                />

                <Route
                    path="products/product-type/:productTypeId"
                    element={<ProductList />}
                />

                <Route
                    path="products/status/:status"
                    element={<ProductList />}
                />

                <Route
                    path="products/paged"
                    element={<ProductList />}
                />

                <Route
                    path="products/sorted"
                    element={<ProductList />}
                />

                <Route
                    path="products/view/:id"
                    element={<ProductView />}
                />

                <Route
                    path="products/edit/:id"
                    element={<ProductEdit />}
                />

                <Route
                    path="products/:id/edit"
                    element={<ProductEdit />}
                />

                <Route
                    path="products/:id"
                    element={<ProductDetails />}
                />


                {/* =================================================
                    PRODUCT TYPES
                ================================================= */}

                <Route
                    path="product-types"
                    element={<ProductTypeList />}
                />

                <Route
                    path="product-types/create"
                    element={<ProductTypeCreate />}
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


                {/* =================================================
                    PRODUCT ATTRIBUTES
                ================================================= */}

                <Route
                    path="product-attributes"
                    element={<ProductAttributeList />}
                />

                <Route
                    path="product-attributes/create"
                    element={<ProductAttributeCreate />}
                />

                <Route
                    path="product-attributes/search"
                    element={<ProductAttributeSearch />}
                />

                <Route
                    path="product-attributes/filters"
                    element={<ProductAttributeFilters />}
                />

                <Route
                    path="product-attributes/statistics"
                    element={<ProductAttributeStatistics />}
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


                {/* =================================================
                    PRODUCT IMAGES
                ================================================= */}

                <Route
                    path="product-images"
                    element={<ProductImageList />}
                />

                <Route
                    path="product-images/create"
                    element={<ProductImageCreate />}
                />

                <Route
                    path="product-images/search"
                    element={<ProductImageSearch />}
                />

                <Route
                    path="product-images/statistics"
                    element={<ProductImageStatistics />}
                />

                <Route
                    path="product-images/details/:id"
                    element={<ProductImageDetails />}
                />

                <Route
                    path="product-images/edit/:id"
                    element={<ProductImageEdit />}
                />

                <Route
                    path="product-images/:id"
                    element={<ProductImageView />}
                />


                {/* =================================================
                    PRODUCT INVENTORY
                ================================================= */}

                <Route
                    path="product-inventory"
                    element={<ProductInventoryList />}
                />

                <Route
                    path="product-inventory/create"
                    element={<ProductInventoryCreate />}
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
                    path="product-inventory/details/:id"
                    element={<ProductInventoryDetails />}
                />

                <Route
                    path="product-inventory/edit/:id"
                    element={<ProductInventoryEdit />}
                />

                <Route
                    path="product-inventory/view/:id"
                    element={<ProductInventoryView />}
                />


                {/* =================================================
                    PRODUCT PRICES
                ================================================= */}

                <Route
                    path="product-prices"
                    element={<ProductPriceList />}
                />

                <Route
                    path="product-prices/create"
                    element={<ProductPriceCreate />}
                />

                <Route
                    path="product-prices/search"
                    element={<ProductPriceSearch />}
                />

                <Route
                    path="product-prices/filters"
                    element={<ProductPriceFilters />}
                />

                <Route
                    path="product-prices/statistics"
                    element={<ProductPriceStatistics />}
                />

                <Route
                    path="product-prices/details/:id"
                    element={<ProductPriceDetails />}
                />

                <Route
                    path="product-prices/edit/:id"
                    element={<ProductPriceEdit />}
                />

                <Route
                    path="product-prices/view/:id"
                    element={<ProductPriceView />}
                />


                {/* =================================================
                    STOCK TRANSFERS
                ================================================= */}

                <Route
                    path="stock-transfers"
                    element={<StockTransferList />}
                />

                <Route
                    path="stock-transfers/create"
                    element={<StockTransferForm />}
                />

                <Route
                    path="stock-transfers/details/:stockTransferId"
                    element={<StockTransferDetails />}
                />

                <Route
                    path="stock-transfers/:stockTransferId/edit"
                    element={<StockTransferForm />}
                />

                <Route
                    path="stock-transfers/:stockTransferId"
                    element={<StockTransferView />}
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


                {/* =================================================
                    STOCK LEDGER
                ================================================= */}

                <Route
                    path="stock-ledger"
                    element={<StockLedgerList />}
                />

                <Route
                    path="stock-ledger/create"
                    element={<StockLedgerCreate />}
                />

                <Route
                    path="stock-ledger/search"
                    element={<StockLedgerList />}
                />

                <Route
                    path="stock-ledger/filters"
                    element={<StockLedgerList />}
                />

                <Route
                    path="stock-ledger/edit/:id"
                    element={<StockLedgerEdit />}
                />

                <Route
                    path="stock-ledger/view/:id"
                    element={<StockLedgerDetails />}
                />


                {/* =================================================
                    STOCK MOVEMENTS
                ================================================= */}

                <Route
                    path="stock-movements"
                    element={<StockMovementList />}
                />

                <Route
                    path="stock-movements/create"
                    element={<StockMovementCreate />}
                />

                <Route
                    path="stock-movements/details/:id"
                    element={<StockMovementDetails />}
                />

                <Route
                    path="stock-movements/edit/:id"
                    element={<StockMovementEdit />}
                />


                {/* =================================================
                    SUPPLIERS
                ================================================= */}

                <Route
                    path="suppliers"
                    element={<SupplierList />}
                />

                <Route
                    path="suppliers/create"
                    element={<SupplierCreate />}
                />

                <Route
                    path="suppliers/search"
                    element={<SupplierSearch />}
                />

                <Route
                    path="suppliers/filters"
                    element={<SupplierFilters />}
                />

                <Route
                    path="suppliers/statistics"
                    element={<SupplierStatistics suppliers={[]} />}
                />

                <Route
                    path="suppliers/details/:id"
                    element={<SupplierDetails />}
                />

                <Route
                    path="suppliers/edit/:id"
                    element={<SupplierEdit />}
                />

                <Route
                    path="suppliers/view/:id"
                    element={<SupplierView />}
                />


                {/* =================================================
                    DELIVERY CHALLANS
                ================================================= */}

                <Route
                    path="delivery-challans"
                    element={<DeliveryChallanList />}
                />

                <Route
                    path="delivery-challans/search"
                    element={<DeliveryChallanSearch />}
                />

                <Route
                    path="delivery-challans/statistics"
                    element={<DeliveryChallanStatistics />}
                />

                <Route
                    path="delivery-challans/:id"
                    element={<DeliveryChallanView />}
                />


                {/* =================================================
                    DELIVERY CHALLAN ITEMS
                ================================================= */}

                <Route
                    path="delivery-challan-items"
                    element={<DeliveryChallanItemList />}
                />

                <Route
                    path="delivery-challan-items/search"
                    element={<DeliveryChallanItemSearch />}
                />

                <Route
                    path="delivery-challan-items/statistics"
                    element={<DeliveryChallanItemStatistics />}
                />

                <Route
                    path="delivery-challan-items/:id"
                    element={<DeliveryChallanItemView />}
                />


                {/* =================================================
                    PURCHASE ORDERS
                ================================================= */}

                <Route
                    path="purchase-orders"
                    element={<PurchaseOrderList />}
                />

                <Route
                    path="purchase-orders/create"
                    element={<PurchaseOrderCreate />}
                />

                <Route
                    path="purchase-orders/search"
                    element={<PurchaseOrderSearch />}
                />

                <Route
                    path="purchase-orders/statistics"
                    element={<PurchaseOrderStatistics />}
                />

                <Route
                    path="purchase-orders/details/:id"
                    element={<PurchaseOrderDetails />}
                />

                <Route
                    path="purchase-orders/edit/:id"
                    element={<PurchaseOrderEdit />}
                />

                <Route
                    path="purchase-orders/:id"
                    element={<PurchaseOrderView />}
                />


                {/* =================================================
                    PURCHASE ORDER ITEMS
                ================================================= */}

                <Route
                    path="purchase-order-items"
                    element={<PurchaseOrderItemList />}
                />

                <Route
                    path="purchase-order-items/create"
                    element={<PurchaseOrderItemCreate />}
                />

                <Route
                    path="purchase-order-items/search"
                    element={<PurchaseOrderItemSearch />}
                />

                <Route
                    path="purchase-order-items/statistics"
                    element={<PurchaseOrderItemStatistics />}
                />

                <Route
                    path="purchase-order-items/details/:id"
                    element={<PurchaseOrderItemDetails />}
                />

                <Route
                    path="purchase-order-items/edit/:id"
                    element={<PurchaseOrderItemEdit />}
                />

                <Route
                    path="purchase-order-items/:id"
                    element={<PurchaseOrderItemView />}
                />


                {/* =================================================
                    PURCHASE RETURNS
                ================================================= */}

                <Route
                    path="purchase-returns"
                    element={<PurchaseReturnList />}
                />

                <Route
                    path="purchase-returns/create"
                    element={<PurchaseReturnCreate />}
                />

                <Route
                    path="purchase-returns/search"
                    element={<PurchaseReturnSearch />}
                />

                <Route
                    path="purchase-returns/statistics"
                    element={<PurchaseReturnStatistics />}
                />

                <Route
                    path="purchase-returns/details/:id"
                    element={<PurchaseReturnDetails />}
                />

                <Route
                    path="purchase-returns/edit/:id"
                    element={<PurchaseReturnEdit />}
                />

                <Route
                    path="purchase-returns/:id"
                    element={<PurchaseReturnView />}
                />


                {/* =================================================
                    GOODS RECEIPT NOTE ITEMS
                ================================================= */}

                <Route
                    path="goods-receipt-note-items"
                    element={<GoodsReceiptNoteItemList />}
                />

                <Route
                    path="goods-receipt-note-items/create"
                    element={<GoodsReceiptNoteItemCreate />}
                />

                <Route
                    path="goods-receipt-note-items/search"
                    element={<GoodsReceiptNoteItemSearch />}
                />

                <Route
                    path="goods-receipt-note-items/filters"
                    element={<GoodsReceiptNoteItemFilters />}
                />

                <Route
                    path="goods-receipt-note-items/statistics"
                    element={<GoodsReceiptNoteItemStatistics />}
                />

                <Route
                    path="goods-receipt-note-items/details/:id"
                    element={<GoodsReceiptNoteItemDetails />}
                />

                <Route
                    path="goods-receipt-note-items/edit/:id"
                    element={<GoodsReceiptNoteItemEdit />}
                />


                {/* =================================================
                    ORDERS
                ================================================= */}

                <Route
                    path="orders"
                    element={<OrderList />}
                />

                <Route
                    path="orders/create"
                    element={<OrderCreate />}
                />

                <Route
                    path="orders/details/:id"
                    element={<OrderDetails />}
                />

                <Route
                    path="orders/edit/:id"
                    element={<OrderEdit />}
                />


                {/* =================================================
                    ORDER ITEMS
                ================================================= */}

                <Route
                    path="order-items"
                    element={<OrderItemList />}
                />

                <Route
                    path="order-items/create"
                    element={<OrderItemCreate />}
                />

                <Route
                    path="order-items/search"
                    element={<OrderItemSearch />}
                />

                <Route
                    path="order-items/statistics"
                    element={<OrderItemStatistics />}
                />

                <Route
                    path="order-items/details/:id"
                    element={<OrderItemDetails />}
                />

                <Route
                    path="order-items/edit/:id"
                    element={<OrderItemEdit />}
                />

                <Route
                    path="order-items/:id"
                    element={<OrderItemView />}
                />


                {/* =================================================
                    MARKETPLACE ORDER ITEMS
                ================================================= */}

                <Route
                    path="marketplace-order-items"
                    element={<MarketplaceOrderItemList />}
                />

                <Route
                    path="marketplace-order-items/create"
                    element={<MarketplaceOrderItemCreate />}
                />

                <Route
                    path="marketplace-order-items/search"
                    element={<MarketplaceOrderItemSearch />}
                />

                <Route
                    path="marketplace-order-items/statistics"
                    element={<MarketplaceOrderItemStatistics />}
                />

                <Route
                    path="marketplace-order-items/details/:id"
                    element={<MarketplaceOrderItemDetails />}
                />

                <Route
                    path="marketplace-order-items/edit/:id"
                    element={<MarketplaceOrderItemEdit />}
                />


                {/* =================================================
                    MARKETPLACE RETURNS
                ================================================= */}

                <Route
                    path="marketplace-returns"
                    element={<MarketplaceReturnList />}
                />

                <Route
                    path="marketplace-returns/search"
                    element={<MarketplaceReturnSearch />}
                />

                <Route
                    path="marketplace-returns/statistics"
                    element={<MarketplaceReturnStatistics />}
                />

                <Route
                    path="marketplace-returns/:id"
                    element={<MarketplaceReturnView />}
                />


                {/* =================================================
                    CUSTOMER ADDRESSES
                ================================================= */}

                <Route
                    path="customer-addresses"
                    element={<CustomerAddressList />}
                />

                <Route
                    path="customer-addresses/search"
                    element={<CustomerAddressSearch />}
                />

                <Route
                    path="customer-addresses/statistics"
                    element={<CustomerAddressStatistics />}
                />

                <Route
                    path="customer-addresses/:id"
                    element={<CustomerAddressView />}
                />


                {/* =================================================
                    CUSTOMER PAYMENTS
                ================================================= */}

                <Route
                    path="customer-payments"
                    element={<CustomerPaymentList />}
                />

                <Route
                    path="customer-payments/search"
                    element={<CustomerPaymentSearch />}
                />

                <Route
                    path="customer-payments/statistics"
                    element={<CustomerPaymentStatistics />}
                />

                <Route
                    path="customer-payments/:id"
                    element={<CustomerPaymentView />}
                />


                {/* =================================================
                    CUSTOMER RETURNS
                ================================================= */}

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
                    path="customer-returns/details/:id"
                    element={<CustomerReturnView />}
                />

                <Route
                    path="customer-returns/edit/:id"
                    element={<CustomerReturnEdit />}
                />


                {/* =================================================
                    NOTIFICATIONS
                ================================================= */}

                <Route
                    path="notifications"
                    element={<NotificationList />}
                />

                <Route
                    path="notifications/settings"
                    element={<NotificationSettings />}
                />

                <Route
                    path="notifications/view/:id"
                    element={<NotificationView />}
                />


                {/* =================================================
                    ORDER STATUS HISTORY
                ================================================= */}

                <Route
                    path="order-status-history"
                    element={<OrderStatusHistoryList />}
                />

                <Route
                    path="order-status-history/all"
                    element={<OrderStatusHistoryList />}
                />

                <Route
                    path="order-status-history/create"
                    element={<CreateOrderStatusHistory />}
                />

                <Route
                    path="order-status-history/view/:id"
                    element={<OrderStatusHistoryView />}
                />

                <Route
                    path="order-status-history/:id"
                    element={<OrderStatusHistoryView />}
                />


                {/* =================================================
                    PAYMENT SETTINGS
                ================================================= */}

                <Route
                    path="payment-settings"
                    element={<PaymentSettings />}
                />

                <Route
                    path="payment-settings/bank-details"
                    element={<BankDetails />}
                />

                <Route
                    path="payment-settings/payment-gateway"
                    element={<PaymentGateway />}
                />

                <Route
                    path="payment-settings/upi"
                    element={<UpiSettings />}
                />


                {/* =================================================
                    REVIEWS
                ================================================= */}

                <Route
                    path="reviews"
                    element={<ReviewList />}
                />

                <Route
                    path="reviews/create"
                    element={<ReviewCreate />}
                />

                <Route
                    path="reviews/search"
                    element={<ReviewSearch />}
                />

                <Route
                    path="reviews/filters"
                    element={<ReviewFilters />}
                />

                <Route
                    path="reviews/statistics"
                    element={<ReviewStatistics />}
                />

                <Route
                    path="reviews/details/:id"
                    element={<ReviewDetails />}
                />

                <Route
                    path="reviews/edit/:id"
                    element={<ReviewEdit />}
                />

                <Route
                    path="reviews/:id"
                    element={<ReviewView />}
                />


                {/* =================================================
                    SALES ORDERS
                ================================================= */}

                <Route
                    path="sales-orders"
                    element={<SalesOrderList />}
                />

                <Route
                    path="sales-orders/create"
                    element={<SalesOrderCreate />}
                />

                <Route
                    path="sales-orders/search"
                    element={<SalesOrderSearch />}
                />

                <Route
                    path="sales-orders/statistics"
                    element={<SalesOrderStatistics />}
                />

                <Route
                    path="sales-orders/details/:id"
                    element={<SalesOrderDetails />}
                />

                <Route
                    path="sales-orders/edit/:id"
                    element={<SalesOrderEdit />}
                />


                {/* =================================================
                    SALES ORDER ITEMS
                ================================================= */}

                <Route
                    path="sales-order-items"
                    element={<SalesOrderItemList />}
                />

                <Route
                    path="sales-order-items/create"
                    element={<SalesOrderItemCreate />}
                />

                <Route
                    path="sales-order-items/search"
                    element={<SalesOrderItemSearch />}
                />

                <Route
                    path="sales-order-items/statistics"
                    element={<SalesOrderItemStatistics />}
                />

                <Route
                    path="sales-order-items/details/:id"
                    element={<SalesOrderItemDetails />}
                />

                <Route
                    path="sales-order-items/edit/:id"
                    element={<SalesOrderItemEdit />}
                />

                <Route
                    path="sales-order-items/:id"
                    element={<SalesOrderItemView />}
                />


                {/* =================================================
                    SALES INVOICES
                ================================================= */}

                <Route
                    path="sales-invoices"
                    element={<SalesInvoiceList />}
                />

                <Route
                    path="sales-invoices/create"
                    element={<SalesInvoiceCreate />}
                />

                <Route
                    path="sales-invoices/search"
                    element={<SalesInvoiceSearch />}
                />

                <Route
                    path="sales-invoices/statistics"
                    element={<SalesInvoiceStatistics />}
                />

                <Route
                    path="sales-invoices/details/:id"
                    element={<SalesInvoiceDetails />}
                />

                <Route
                    path="sales-invoices/edit/:id"
                    element={<SalesInvoiceEdit />}
                />

                <Route
                    path="sales-invoices/:id"
                    element={<SalesInvoiceView />}
                />


                {/* =================================================
                    SHIPMENTS
                ================================================= */}

                <Route
                    path="shipments"
                    element={<ShipmentList />}
                />

                <Route
                    path="shipments/search"
                    element={<ShipmentSearch />}
                />

                <Route
                    path="shipments/statistics"
                    element={<ShipmentStatistics />}
                />

                <Route
                    path="shipments/:id"
                    element={<ShipmentView />}
                />


                {/* =================================================
                    WISHLISTS
                ================================================= */}

                <Route
                    path="wishlists"
                    element={<WishlistList />}
                />

                <Route
                    path="wishlists/create"
                    element={<WishlistCreate />}
                />

                <Route
                    path="wishlists/search"
                    element={<WishlistSearch />}
                />

                <Route
                    path="wishlists/statistics"
                    element={<WishlistStatistics />}
                />

                <Route
                    path="wishlists/details/:id"
                    element={<WishlistDetails />}
                />

                <Route
                    path="wishlists/edit/:id"
                    element={<WishlistEdit />}
                />

                <Route
                    path="wishlists/:id"
                    element={<WishlistView />}
                />


                {/* =================================================
                    WISHLIST ITEMS
                ================================================= */}

                <Route
                    path="wishlist-items"
                    element={<WishlistItemList />}
                />

                <Route
                    path="wishlist-items/create"
                    element={<WishlistItemsCreate />}
                />

                <Route
                    path="wishlist-items/details/:id"
                    element={<WishlistItemsDetails />}
                />

                <Route
                    path="wishlist-items/edit/:id"
                    element={<WishlistItemsEdit />}
                />

                <Route
                    path="wishlist-items/:id"
                    element={<WishlistItemView />}
                />


                {/* =================================================
                    GLOBAL 404
                ================================================= */}

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Route>

        </Routes>
    );
}

export default App;




