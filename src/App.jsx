import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/Layouts/MainLayout";

// =========================================================
// AUTH
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
// CORE ENTITIES - BRANDS, CATEGORIES, PRODUCTS
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

import Catalog from "./pages/Catalog/Catalog";
import CatalogCreate from "./pages/Catalog/CatalogCreate";
import CatalogEdit from "./pages/Catalog/CatalogEdit";
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
import DeleteProductTypeDialog from "./pages/ProductTypes/DeleteProductTypeDialog";

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
import DeleteProductDialog from "./pages/Products/DeleteProductDialog";

import InventoryAdjustmentsList from "./pages/InventoryAdjustments/InventoryAdjustmentsList";
import InventoryAdjustmentsCreate from "./pages/InventoryAdjustments/InventoryAdjustmentsCreate";
import InventoryAdjustmentsEdit from "./pages/InventoryAdjustments/InventoryAdjustmentsEdit";
import InventoryAdjustmentsView from "./pages/InventoryAdjustments/InventoryAdjustmentsView";
import InventoryAdjustmentsDetails from "./pages/InventoryAdjustments/InventoryAdjustmentsDetails";
import InventoryAdjustmentsFilters from "./pages/InventoryAdjustments/InventoryAdjustmentsFilters";  
import InventoryAdjustmentsToolbar from "./pages/InventoryAdjustments/InventoryAdjustmentsToolbar";
import InventoryAdjustmentsPagination from "./pages/InventoryAdjustments/InventoryAdjustmentsPagination";
  

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
import DeleteProductImageDialog from "./pages/ProductImages/DeleteProductImageDialog";

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
import DeleteProductInventoryDialog from "./pages/ProductInventory/DeleteProductInventoryDialog";

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
import DeleteProductPriceDialog from "./pages/ProductPrices/DeleteProductPriceDialog";

// =========================================================
// SELLERS, SUPPLIERS, MARKETPLACES, WAREHOUSES
// =========================================================
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
import SellerCustomerFilters from "./pages/SellerCustomers/SellerCustomerFilters";
import DeleteSellerCustomerDialog from "./pages/SellerCustomers/DeleteSellerCustomerDialog";

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

import WarehouseLocationList from "./pages/WarehouseLocation/WarehouseLocationList";
import WarehouseLocationCreate from "./pages/WarehouseLocation/WarehouseLocationCreate";
import WarehouseLocationEdit from "./pages/WarehouseLocation/WarehouseLocationEdit";
import WarehouseLocationDetails from "./pages/WarehouseLocation/WarehouseLocationDetails";
import WarehouseLocationSearch from "./pages/WarehouseLocation/WarehouseLocationSearch";
import WarehouseLocationFilters from "./pages/WarehouseLocation/WarehouseLocationFilters";

// =========================================================
// INVENTORY & STOCK
// =========================================================
import StockAdjustmentList from "./pages/StockAdjustment/StockAdjustmentList";
import StockAdjustmentCreate from "./pages/StockAdjustment/StockAdjustmentCreate";
import StockAdjustmentEdit from "./pages/StockAdjustment/StockAdjustmentEdit";
import StockAdjustmentView from "./pages/StockAdjustment/StockAdjustmentView";
import StockAdjustmentSearch from "./pages/StockAdjustment/StockAdjustmentSearch";
import StockAdjustmentStatistics from "./pages/StockAdjustment/StockAdjustmentStatistics";

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

import StockLedgerList from "./pages/StockLedger/StockLedgerList";
import StockLedgerCreate from "./pages/StockLedger/StockLedgerCreate";
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

import StockTransferForm from "./pages/StockTransfer/StockTransferForm";
import StockTransferView from "./pages/StockTransfer/StockTransferView";
import StockTransferList from "./pages/StockTransfer/StockTransferList";
import StockTransferDetails from "./pages/StockTransfer/StockTransferDetails";
import StockTransferEdit from "./pages/StockTransfer/StockTransferEdit";

import ShelfwiseInventoriesList from "./pages/ShelfwiseInventories/ShelfwiseInventoriesList";
import ShelfwiseInventoryCard from "./pages/ShelfwiseInventories/ShelfwiseInventoryCard";
import ShelfwiseInventoryCreate from "./pages/ShelfwiseInventories/ShelfwiseInventoryCreate";
import ShelfwiseInventoryDetails from "./pages/ShelfwiseInventories/ShelfwiseInventoryDetails";
import ShelfwiseInventoryEdit from "./pages/ShelfwiseInventories/ShelfwiseInventoryEdit";
import ShelfwiseInventoryFilters from "./pages/ShelfwiseInventories/ShelfwiseInventoryFilters";
import ShelfwiseInventoryForm from "./pages/ShelfwiseInventories/ShelfwiseInventoryForm";
import ShelfwiseInventoryModal from "./pages/ShelfwiseInventories/ShelfwiseInventoryModal";
import ShelfwiseInventoryPagination from "./pages/ShelfwiseInventories/ShelfwiseInventoryPagination";
import ShelfwiseInventorySearch from "./pages/ShelfwiseInventories/ShelfwiseInventorySearch";
import ShelfwiseInventoryStatistics from "./pages/ShelfwiseInventories/ShelfwiseInventoryStatistics";
import ShelfwiseInventoryTable from "./pages/ShelfwiseInventories/ShelfwiseInventoryTable";
import ShelfwiseInventoryToolbar from "./pages/ShelfwiseInventories/ShelfwiseInventoryToolbar";
import ShelfwiseInventoryView from "./pages/ShelfwiseInventories/ShelfwiseInventoryView";

// =========================================================
// PURCHASING & GRN
// =========================================================
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
import DeletePurchaseOrderDialog from "./pages/PurchaseOrders/DeletePurchaseOrderDialog";

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
import DeletePurchaseOrderItemDialog from "./pages/PurchaseOrderItems/DeletePurchaseOrderItemDialog";

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
import DeletePurchaseReturnDialog from "./pages/PurchaseReturns/DeletePurchaseReturnDialog";

import GoodsReceiptNoteList from "./pages/GoodsReceiptItems/GoodsReceiptNoteList";
import GoodsReceiptNoteCreate from "./pages/GoodsReceiptItems/GoodsReceiptNoteCreate";
import GoodsReceiptNoteSearch from "./pages/GoodsReceiptItems/GoodsReceiptNoteSearch";
import GoodsReceiptNoteStatistics from "./pages/GoodsReceiptItems/GoodsReceiptNoteStatistics";
import GoodsReceiptNoteDetails from "./pages/GoodsReceiptItems/GoodsReceiptNoteDetails";
import GoodsReceiptNoteEdit from "./pages/GoodsReceiptItems/GoodsReceiptNoteEdit";
import GoodsReceiptNoteView from "./pages/GoodsReceiptItems/GoodsReceiptNoteView";
import GoodsReceiptNoteFilters from "./pages/GoodsReceiptItems/GoodsReceiptNoteFilters";

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
// ORDERS & SALES
// =========================================================
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
import DeleteOrderDialog from "./pages/Orders/DeleteOrderDialog";

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
import DeleteOrderItemDialog from "./pages/OrderItems/DeleteOrderItemDialog";

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
import DeleteSalesOrderItemDialog from "./pages/SalesOrderItems/DeleteSalesOrderItemDialog";

import SaleOrderAddressesList from "./pages/SaleOrderAddresses/SaleOrderAddressesList";
import SaleOrderAddressesForm from "./pages/SaleOrderAddresses/SaleOrderAddressesForm";
import SaleOrderAddressesView from "./pages/SaleOrderAddresses/SaleOrderAddressesView";
import SaleOrderAddressesEdit from "./pages/SaleOrderAddresses/SaleOrderAddressesEdit";
import SaleOrderAddressesDelete from "./pages/SaleOrderAddresses/SaleOrderAddressesDelete";

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
import SalesInvoicePrint from "./pages/SalesInvoices/SalesInvoicePrint";
import DeleteSalesInvoiceDialog from "./pages/SalesInvoices/DeleteSalesInvoiceDialog";

import InvoiceTaxDetailCard from "./pages/InvoiceTaxDetails/InvoiceTaxDetailCard";
import InvoiceTaxDetailCreate from "./pages/InvoiceTaxDetails/InvoiceTaxDetailCreate";
import InvoiceTaxDetailDetails from "./pages/InvoiceTaxDetails/InvoiceTaxDetailDetails";
import InvoiceTaxDetailEdit from "./pages/InvoiceTaxDetails/InvoiceTaxDetailEdit";
import InvoiceTaxDetailFilters from "./pages/InvoiceTaxDetails/InvoiceTaxDetailFilters";
import InvoiceTaxDetailForm from "./pages/InvoiceTaxDetails/InvoiceTaxDetailForm";
import InvoiceTaxDetailModal from "./pages/InvoiceTaxDetails/InvoiceTaxDetailModal";
import InvoiceTaxDetailPagination from "./pages/InvoiceTaxDetails/InvoiceTaxDetailPagination";
import InvoiceTaxDetailSearch from "./pages/InvoiceTaxDetails/InvoiceTaxDetailSearch";
import InvoiceTaxDetailsList from "./pages/InvoiceTaxDetails/InvoiceTaxDetailsList";
import InvoiceTaxDetailStatistics from "./pages/InvoiceTaxDetails/InvoiceTaxDetailStatistics";
import InvoiceTaxDetailTable from "./pages/InvoiceTaxDetails/InvoiceTaxDetailTable";
import InvoiceTaxDetailToolbar from "./pages/InvoiceTaxDetails/InvoiceTaxDetailToolbar";
import InvoiceTaxDetailView from "./pages/InvoiceTaxDetails/InvoiceTaxDetailView";
import DeleteInvoiceTaxDetailDialog from "./pages/InvoiceTaxDetails/DeleteInvoiceTaxDetailDialog";

// =========================================================
// MARKETPLACE ORDERS & CUSTOMERS
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
import MarketplaceOrderView from "./pages/MarketplaceOrder/MarketplaceOrderView";

import MarketplaceOrderItemList from "./pages/MarketplaceOrderItems/MarketplaceOrderItemList";
import MarketplaceOrderItemCreate from "./pages/MarketplaceOrderItems/MarketplaceOrderItemCreate";
import MarketplaceOrderItemEdit from "./pages/MarketplaceOrderItems/MarketplaceOrderItemEdit";
import MarketplaceOrderItemDetails from "./pages/MarketplaceOrderItems/MarketplaceOrderItemDetails";
import MarketplaceOrderItemSearch from "./pages/MarketplaceOrderItems/MarketplaceOrderItemSearch";
import MarketplaceOrderItemStatistics from "./pages/MarketplaceOrderItems/MarketplaceOrderItemStatistics";

import MarketplaceCustomersList from "./pages/MarketplaceCustomers/MarketplaceCustomersList";
import MarketplaceCustomersView from "./pages/MarketplaceCustomers/MarketplaceCustomersView";
import MarketplaceCustomersDetails from "./pages/MarketplaceCustomers/MarketplaceCustomersDetails";
import MarketplaceCustomersEdit from "./pages/MarketplaceCustomers/MarketplaceCustomersEdit";
import MarketplaceCustomersSearch from "./pages/MarketplaceCustomers/MarketplaceCustomersSearch";
import MarketplaceCustomersDelete from "./pages/MarketplaceCustomers/MarketplaceCustomersDelete";
import MarketplaceCustomersTable from "./pages/MarketplaceCustomers/MarketplaceCustomersTable";
import MarketplaceCustomersCreate from "./pages/MarketplaceCustomers/MarketplaceCustomersCreate";

import MarketplaceReturnList from "./pages/MarketplaceReturns/MarketplaceReturnList";
import MarketplaceReturnSearch from "./pages/MarketplaceReturns/MarketplaceReturnSearch";
import MarketplaceReturnStatistics from "./pages/MarketplaceReturns/MarketplaceReturnStatistics";
import MarketplaceReturnView from "./pages/MarketplaceReturns/MarketplaceReturnView";
import DeleteMarketplaceReturnDialog from "./pages/MarketplaceReturns/DeleteMarketplaceReturnDialog";
import MarketplaceReturnCard from "./pages/MarketplaceReturns/MarketplaceReturnCard";
import MarketplaceReturnModal from "./pages/MarketplaceReturns/MarketplaceReturnModal";
import MarketplaceReturnPagination from "./pages/MarketplaceReturns/MarketplaceReturnPagination";
import MarketplaceReturnTable from "./pages/MarketplaceReturns/MarketplaceReturnTable";
import MarketplaceReturnToolbar from "./pages/MarketplaceReturns/MarketplaceReturnToolbar";

// =========================================================
// LOGISTICS, SHIPMENTS, DELIVERY
// =========================================================
import DeliveryChallanCard from "./pages/DeliveryChallans/DeliveryChallanCard";
import DeliveryChallanList from "./pages/DeliveryChallans/DeliveryChallanList";
import DeliveryChallanModal from "./pages/DeliveryChallans/DeliveryChallanModal";
import DeliveryChallanPagination from "./pages/DeliveryChallans/DeliveryChallanPagination";
import DeliveryChallanSearch from "./pages/DeliveryChallans/DeliveryChallanSearch";
import DeliveryChallanStatistics from "./pages/DeliveryChallans/DeliveryChallanStatistics";
import DeliveryChallanTable from "./pages/DeliveryChallans/DeliveryChallanTable";
import DeliveryChallanToolbar from "./pages/DeliveryChallans/DeliveryChallanToolbar";
import DeliveryChallanView from "./pages/DeliveryChallans/DeliveryChallanView";
import DeliveryChallanCreate from "./pages/DeliveryChallans/DeliveryChallanCreate";
import DeliveryChallanEdit from "./pages/DeliveryChallans/DeliveryChallanEdit";
import DeleteDeliveryChallanDialog from "./pages/DeliveryChallans/DeleteDeliveryChallanDialog";

import DeliveryChallanItemCard from "./pages/DeliveryChallanItem/DeliveryChallanItemCard";
import DeliveryChallanItemList from "./pages/DeliveryChallanItem/DeliveryChallanItemList";
import DeliveryChallanItemModal from "./pages/DeliveryChallanItem/DeliveryChallanItemModal";
import DeliveryChallanItemPagination from "./pages/DeliveryChallanItem/DeliveryChallanItemPagination";
import DeliveryChallanItemSearch from "./pages/DeliveryChallanItem/DeliveryChallanItemSearch";
import DeliveryChallanItemStatistics from "./pages/DeliveryChallanItem/DeliveryChallanItemStatistics";
import DeliveryChallanItemTable from "./pages/DeliveryChallanItem/DeliveryChallanItemTable";
import DeliveryChallanItemToolbar from "./pages/DeliveryChallanItem/DeliveryChallanItemToolbar";
import DeliveryChallanItemView from "./pages/DeliveryChallanItem/DeliveryChallanItemView";
import DeliveryChallanItemCreate from "./pages/DeliveryChallanItem/DeliveryChallanItemCreate";
import DeliveryChallanItemDetails from "./pages/DeliveryChallanItem/DeliveryChallanItemDetails";
import DeliveryChallanItemEdit from "./pages/DeliveryChallanItem/DeliveryChallanItemEdit";
import DeleteDeliveryChallanItemDialog from "./pages/DeliveryChallanItem/DeleteDeliveryChallanItemDialog";

import ShipmentCard from "./pages/Shipments/ShipmentCard";
import ShipmentList from "./pages/Shipments/ShipmentList";
import ShipmentModal from "./pages/Shipments/ShipmentModal";
import ShipmentPagination from "./pages/Shipments/ShipmentPagination";
import ShipmentSearch from "./pages/Shipments/ShipmentSearch";
import ShipmentStatistics from "./pages/Shipments/ShipmentStatistics";
import ShipmentTable from "./pages/Shipments/ShipmentTable";
import ShipmentToolbar from "./pages/Shipments/ShipmentToolbar";
import ShipmentView from "./pages/Shipments/ShipmentView";
import ShipmentCreate from "./pages/Shipments/ShipmentCreate";
import ShipmentEdit from "./pages/Shipments/ShipmentEdit";
import DeleteShipmentDialog from "./pages/Shipments/DeleteShipmentDialog";

import ShippingManifestCard from "./pages/ShippingManifests/ShippingManifestCard";
import ShippingManifestCreate from "./pages/ShippingManifests/ShippingManifestCreate";
import ShippingManifestDetails from "./pages/ShippingManifests/ShippingManifestDetails";
import ShippingManifestEdit from "./pages/ShippingManifests/ShippingManifestEdit";
import ShippingManifestFilters from "./pages/ShippingManifests/ShippingManifestFilters";
import ShippingManifestForm from "./pages/ShippingManifests/ShippingManifestForm";
import ShippingManifestModal from "./pages/ShippingManifests/ShippingManifestModal";
import ShippingManifestPagination from "./pages/ShippingManifests/ShippingManifestPagination";
import ShippingManifestSearch from "./pages/ShippingManifests/ShippingManifestSearch";
import ShippingManifestsList from "./pages/ShippingManifests/ShippingManifestsList";
import ShippingManifestStatistics from "./pages/ShippingManifests/ShippingManifestStatistics";
import ShippingManifestTable from "./pages/ShippingManifests/ShippingManifestTable";
import ShippingManifestToolbar from "./pages/ShippingManifests/ShippingManifestToolbar";
import ShippingManifestView from "./pages/ShippingManifests/ShippingManifestView";
import DeleteShippingManifestDialog from "./pages/ShippingManifests/DeleteShippingManifestDialog";

import ManifestPackagesList from "./pages/ManifestPackages/ManifestPackagesList";
import ManifestPackagesCreate from "./pages/ManifestPackages/ManifestPackagesCreate";
import ManifestPackagesSearch from "./pages/ManifestPackages/ManifestPackagesSearch";
import ManifestPackagesFilters from "./pages/ManifestPackages/ManifestPackagesFilters";
import ManifestPackagesStatistics from "./pages/ManifestPackages/ManifestPackagesStatistics";
import ManifestPackagesDetails from "./pages/ManifestPackages/ManifestPackagesDetails";
import ManifestPackagesView from "./pages/ManifestPackages/ManifestPackagesView";
import ManifestPackagesEdit from "./pages/ManifestPackages/ManifestPackagesEdit";

import GatepassesList from "./pages/Gatepasses/GatepassesList";
import GatepassForm from "./pages/Gatepasses/GatepassForm";
import GatepassModal from "./pages/Gatepasses/GatepassModal";
import GatepassSearch from "./pages/Gatepasses/GatepassSearch";
import GatepassStatistics from "./pages/Gatepasses/GatepassStatistics";
import GatepassPagination from "./pages/Gatepasses/GatepassPagination";
import GatepassFilters from "./pages/Gatepasses/GatepassFilters";
import GatepassTable from "./pages/Gatepasses/GatepassTable";
import GatepassToolbar from "./pages/Gatepasses/GatepassToolbar";
import GatepassView from "./pages/Gatepasses/GatepassView";
import DeleteGatepassDialog from "./pages/Gatepasses/DeleteGatepassDialog";
import GatepassCard from "./pages/Gatepasses/GatepassCard";
import GatepassCreate from "./pages/Gatepasses/GatepassCreate";
import GatepassDetails from "./pages/Gatepasses/GatepassDetails";
import GatepassEdit from "./pages/Gatepasses/GatepassEdit";
import "./pages/Gatepasses/Gatepasses.css";

// =========================================================
// CUSTOMERS, WISHLISTS, REVIEWS
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
import CustomerReturnDetails from "./pages/CustomerReturns/CustomerReturnDetails";

import WishlistCard from "./pages/Wishlists/WishlistCard";
import WishlistList from "./pages/Wishlists/WishlistList";
import WishlistModal from "./pages/Wishlists/WishlistModal";
import WishlistPagination from "./pages/Wishlists/WishlistPagination";
import WishlistSearch from "./pages/Wishlists/WishlistSearch";
import WishlistStatistics from "./pages/Wishlists/WishlistStatistics";
import WishlistTable from "./pages/Wishlists/WishlistTable";
import WishlistToolbar from "./pages/Wishlists/WishlistToolbar";
import WishlistView from "./pages/Wishlists/WishlistView";
import WishlistCreate from "./pages/Wishlists/WishlistCreate";
import WishlistDetails from "./pages/Wishlists/WishlistDetails";
import WishlistEdit from "./pages/Wishlists/WishlistEdit";
import DeleteWishlistDialog from "./pages/Wishlists/DeleteWishlistDialog";

import WishlistItemList from "./pages/WishlistItems/WishlistItemList";
import WishlistItemView from "./pages/WishlistItems/WishlistItemView";
import WishlistItemsDetails from "./pages/WishlistItems/WishlistItemsDetails";
import WishlistItemsCreate from "./pages/WishlistItems/WishlistItemsCreate";
import WishlistItemsEdit from "./pages/WishlistItems/WishlistItemsEdit";

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
import DeleteReviewDialog from "./pages/Reviews/DeleteReviewDialog";

// =========================================================
// MISC - PICKLISTS, PUTAWAY, FACILITY, REVERSE, etc
// =========================================================
import PicklistCard from "./pages/Picklists/PicklistCard";
import PicklistCreate from "./pages/Picklists/PicklistCreate";
import PicklistDetails from "./pages/Picklists/PicklistDetails";
import PicklistEdit from "./pages/Picklists/PicklistEdit";
import PicklistFilters from "./pages/Picklists/PicklistFilters";
import PicklistForm from "./pages/Picklists/PicklistForm";
import PicklistModal from "./pages/Picklists/PicklistModal";
import PicklistPagination from "./pages/Picklists/PicklistPagination";
import PicklistSearch from "./pages/Picklists/PicklistSearch";
import PicklistsList from "./pages/Picklists/PicklistsList";
import PicklistStatistics from "./pages/Picklists/PicklistStatistics";
import PicklistTable from "./pages/Picklists/PicklistTable";
import PicklistToolbar from "./pages/Picklists/PicklistToolbar";
import PicklistView from "./pages/Picklists/PicklistView";
import DeletePicklistDialog from "./pages/Picklists/DeletePicklistDialog";

import PutawayList from "./pages/Putaway/PutawayList";
import PutawayCreate from "./pages/Putaway/PutawayCreate";
import PutawayEdit from "./pages/Putaway/PutawayEdit";
import PutawayForm from "./pages/Putaway/PutawayForm";
import PutawayTable from "./pages/Putaway/PutawayTable";
import PutawayView from "./pages/Putaway/PutawayView";
import PutawayDelete from "./pages/Putaway/PutawayDelete";

import FacilityChannelCard from "./pages/FacilityChannels/FacilityChannelCard";
import FacilityChannelCreate from "./pages/FacilityChannels/FacilityChannelCreate";
import FacilityChannelDetails from "./pages/FacilityChannels/FacilityChannelDetails";
import FacilityChannelEdit from "./pages/FacilityChannels/FacilityChannelEdit";
import FacilityChannelFilters from "./pages/FacilityChannels/FacilityChannelFilters";
import FacilityChannelForm from "./pages/FacilityChannels/FacilityChannelForm";
import FacilityChannelModal from "./pages/FacilityChannels/FacilityChannelModal";
import FacilityChannelPagination from "./pages/FacilityChannels/FacilityChannelPagination";
import FacilityChannelSearch from "./pages/FacilityChannels/FacilityChannelSearch";
import FacilityChannelsList from "./pages/FacilityChannels/FacilityChannelsList";
import FacilityChannelStatistics from "./pages/FacilityChannels/FacilityChannelStatistics";
import FacilityChannelTable from "./pages/FacilityChannels/FacilityChannelTable";
import FacilityChannelToolbar from "./pages/FacilityChannels/FacilityChannelToolbar";
import FacilityChannelView from "./pages/FacilityChannels/FacilityChannelView";
import DeleteFacilityChannelDialog from "./pages/FacilityChannels/DeleteFacilityChannelDialog";

import ReversePickupAddressCard from "./pages/ReversePickupAddresses/ReversePickupAddressCard";
import ReversePickupAddressCreate from "./pages/ReversePickupAddresses/ReversePickupAddressCreate";
import ReversePickupAddressDetails from "./pages/ReversePickupAddresses/ReversePickupAddressDetails";
import ReversePickupAddressEdit from "./pages/ReversePickupAddresses/ReversePickupAddressEdit";
import ReversePickupAddressFilters from "./pages/ReversePickupAddresses/ReversePickupAddressFilters";
import ReversePickupAddressForm from "./pages/ReversePickupAddresses/ReversePickupAddressForm";
import ReversePickupAddressModal from "./pages/ReversePickupAddresses/ReversePickupAddressModal";
import ReversePickupAddressPagination from "./pages/ReversePickupAddresses/ReversePickupAddressPagination";
import ReversePickupAddressSearch from "./pages/ReversePickupAddresses/ReversePickupAddressSearch";
import ReversePickupAddressesList from "./pages/ReversePickupAddresses/ReversePickupAddressesList";
import ReversePickupAddressStatistics from "./pages/ReversePickupAddresses/ReversePickupAddressStatistics";
import ReversePickupAddressTable from "./pages/ReversePickupAddresses/ReversePickupAddressTable";
import ReversePickupAddressToolbar from "./pages/ReversePickupAddresses/ReversePickupAddressToolbar";
import ReversePickupAddressView from "./pages/ReversePickupAddresses/ReversePickupAddressView";
import DeleteReversePickupAddressDialog from "./pages/ReversePickupAddresses/DeleteReversePickupAddressDialog";

import ReversePickupItemCard from "./pages/ReversePickupItems/ReversePickupItemCard";
import ReversePickupItemCreate from "./pages/ReversePickupItems/ReversePickupItemCreate";
import ReversePickupItemDetails from "./pages/ReversePickupItems/ReversePickupItemDetails";
import ReversePickupItemEdit from "./pages/ReversePickupItems/ReversePickupItemEdit";
import ReversePickupItemFilters from "./pages/ReversePickupItems/ReversePickupItemFilters";
import ReversePickupItemForm from "./pages/ReversePickupItems/ReversePickupItemForm";
import ReversePickupItemModal from "./pages/ReversePickupItems/ReversePickupItemModal";
import ReversePickupItemPagination from "./pages/ReversePickupItems/ReversePickupItemPagination";
import ReversePickupItemSearch from "./pages/ReversePickupItems/ReversePickupItemSearch";
import ReversePickupItemsList from "./pages/ReversePickupItems/ReversePickupItemsList";
import ReversePickupItemStatistics from "./pages/ReversePickupItems/ReversePickupItemStatistics";
import ReversePickupItemTable from "./pages/ReversePickupItems/ReversePickupItemTable";
import ReversePickupItemToolbar from "./pages/ReversePickupItems/ReversePickupItemToolbar";
import ReversePickupItemView from "./pages/ReversePickupItems/ReversePickupItemView";
import DeleteReversePickupItemDialog from "./pages/ReversePickupItems/DeleteReversePickupItemDialog";

import ReversePickupCard from "./pages/ReversePickups/ReversePickupCard";
import ReversePickupCreate from "./pages/ReversePickups/ReversePickupCreate";
import ReversePickupDetails from "./pages/ReversePickups/ReversePickupDetails";
import ReversePickupEdit from "./pages/ReversePickups/ReversePickupEdit";
import ReversePickupFilters from "./pages/ReversePickups/ReversePickupFilters";
import ReversePickupForm from "./pages/ReversePickups/ReversePickupForm";
import ReversePickupModal from "./pages/ReversePickups/ReversePickupModal";
import ReversePickupPagination from "./pages/ReversePickups/ReversePickupPagination";
import ReversePickupSearch from "./pages/ReversePickups/ReversePickupSearch";
import ReversePickupsList from "./pages/ReversePickups/ReversePickupsList";
import ReversePickupStatistics from "./pages/ReversePickups/ReversePickupStatistics";
import ReversePickupTable from "./pages/ReversePickups/ReversePickupTable";
import ReversePickupToolbar from "./pages/ReversePickups/ReversePickupToolbar";
import ReversePickupView from "./pages/ReversePickups/ReversePickupView";
import DeleteReversePickupDialog from "./pages/ReversePickups/DeleteReversePickupDialog";

import SupplierAddressCard from "./pages/SupplierAddresses/SupplierAddressCard";
import SupplierAddressCreate from "./pages/SupplierAddresses/SupplierAddressCreate";
import SupplierAddressDetails from "./pages/SupplierAddresses/SupplierAddressDetails";
import SupplierAddressEdit from "./pages/SupplierAddresses/SupplierAddressEdit";
import SupplierAddressFilters from "./pages/SupplierAddresses/SupplierAddressFilters";
import SupplierAddressForm from "./pages/SupplierAddresses/SupplierAddressForm";
import SupplierAddressModal from "./pages/SupplierAddresses/SupplierAddressModal";
import SupplierAddressPagination from "./pages/SupplierAddresses/SupplierAddressPagination";
import SupplierAddressSearch from "./pages/SupplierAddresses/SupplierAddressSearch";
import SupplierAddressesList from "./pages/SupplierAddresses/SupplierAddressesList";
import SupplierAddressStatistics from "./pages/SupplierAddresses/SupplierAddressStatistics";
import SupplierAddressTable from "./pages/SupplierAddresses/SupplierAddressTable";
import SupplierAddressToolbar from "./pages/SupplierAddresses/SupplierAddressToolbar";
import SupplierAddressView from "./pages/SupplierAddresses/SupplierAddressView";
import DeleteSupplierAddressDialog from "./pages/SupplierAddresses/DeleteSupplierAddressDialog";

import SupplierContactCard from "./pages/SupplierContacts/SupplierContactCard";
import SupplierContactCreate from "./pages/SupplierContacts/SupplierContactCreate";
import SupplierContactDetails from "./pages/SupplierContacts/SupplierContactDetails";
import SupplierContactEdit from "./pages/SupplierContacts/SupplierContactEdit";
import SupplierContactFilters from "./pages/SupplierContacts/SupplierContactFilters";
import SupplierContactForm from "./pages/SupplierContacts/SupplierContactForm";
import SupplierContactModal from "./pages/SupplierContacts/SupplierContactModal";
import SupplierContactPagination from "./pages/SupplierContacts/SupplierContactPagination";
import SupplierContactSearch from "./pages/SupplierContacts/SupplierContactSearch";
import SupplierContactsList from "./pages/SupplierContacts/SupplierContactsList";
import SupplierContactStatistics from "./pages/SupplierContacts/SupplierContactStatistics";
import SupplierContactTable from "./pages/SupplierContacts/SupplierContactTable";
import SupplierContactToolbar from "./pages/SupplierContacts/SupplierContactToolbar";
import SupplierContactView from "./pages/SupplierContacts/SupplierContactView";
import SupplierContactDelete from "./pages/SupplierContacts/SupplierContactDelete";
import DeleteSupplierContactDialog from "./pages/SupplierContacts/DeleteSupplierContactDialog";

import VendorItemCustomFieldCard from "./pages/VendorItemCustomFields/VendorItemCustomFieldCard";
import VendorItemCustomFieldCreate from "./pages/VendorItemCustomFields/VendorItemCustomFieldCreate";
import VendorItemCustomFieldDetails from "./pages/VendorItemCustomFields/VendorItemCustomFieldDetails";
import VendorItemCustomFieldEdit from "./pages/VendorItemCustomFields/VendorItemCustomFieldEdit";
import VendorItemCustomFieldFilters from "./pages/VendorItemCustomFields/VendorItemCustomFieldFilters";
import VendorItemCustomFieldForm from "./pages/VendorItemCustomFields/VendorItemCustomFieldForm";
import VendorItemCustomFieldModal from "./pages/VendorItemCustomFields/VendorItemCustomFieldModal";
import VendorItemCustomFieldPagination from "./pages/VendorItemCustomFields/VendorItemCustomFieldPagination";
import VendorItemCustomFieldSearch from "./pages/VendorItemCustomFields/VendorItemCustomFieldSearch";
import VendorItemCustomFieldsList from "./pages/VendorItemCustomFields/VendorItemCustomFieldsList";
import VendorItemCustomFieldStatistics from "./pages/VendorItemCustomFields/VendorItemCustomFieldStatistics";
import VendorItemCustomFieldTable from "./pages/VendorItemCustomFields/VendorItemCustomFieldTable";
import VendorItemCustomFieldToolbar from "./pages/VendorItemCustomFields/VendorItemCustomFieldToolbar";
import VendorItemCustomFieldView from "./pages/VendorItemCustomFields/VendorItemCustomFieldView";
import DeleteVendorItemCustomFieldDialog from "./pages/VendorItemCustomFields/DeleteVendorItemCustomFieldDialog";

import VendorItemMasterCard from "./pages/VendorItemMasters/VendorItemMasterCard";
import VendorItemMasterCreate from "./pages/VendorItemMasters/VendorItemMasterCreate";
import VendorItemMasterDetails from "./pages/VendorItemMasters/VendorItemMasterDetails";
import VendorItemMasterEdit from "./pages/VendorItemMasters/VendorItemMasterEdit";
import VendorItemMasterFilters from "./pages/VendorItemMasters/VendorItemMasterFilters";
import VendorItemMasterForm from "./pages/VendorItemMasters/VendorItemMasterForm";
import VendorItemMasterModal from "./pages/VendorItemMasters/VendorItemMasterModal";
import VendorItemMasterPagination from "./pages/VendorItemMasters/VendorItemMasterPagination";
import VendorItemMasterSearch from "./pages/VendorItemMasters/VendorItemMasterSearch";
import VendorItemMastersList from "./pages/VendorItemMasters/VendorItemMastersList";
import VendorItemMasterStatistics from "./pages/VendorItemMasters/VendorItemMasterStatistics";
import VendorItemMasterTable from "./pages/VendorItemMasters/VendorItemMasterTable";
import VendorItemMasterToolbar from "./pages/VendorItemMasters/VendorItemMasterToolbar";
import VendorItemMasterView from "./pages/VendorItemMasters/VendorItemMasterView";
import DeleteVendorItemMasterDialog from "./pages/VendorItemMasters/DeleteVendorItemMasterDialog";

import NotificationCard from "./pages/Notifications/NotificationCard";
import NotificationList from "./pages/Notifications/NotificationList";
import NotificationSettings from "./pages/Notifications/NotificationSettings";
import NotificationView from "./pages/Notifications/NotificationView";

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
import DeleteOrderStatusHistoryDialog from "./pages/OrderStatusHistory/DeleteOrderStatusHistoryDialog";

import BankDetails from "./pages/PaymentsSettings/BankDetails";
import PaymentGateway from "./pages/PaymentsSettings/PaymentGateway";
import PaymentSettings from "./pages/PaymentsSettings/PaymentSettings";
import UpiSettings from "./pages/PaymentsSettings/UpiSettings";

import ExportJobModal from "./pages/ExportJobs/ExportJobModal";
import ExportJobPagination from "./pages/ExportJobs/ExportJobPagination";
import ExportJobsCard from "./pages/ExportJobs/ExportJobsCard";
import ExportJobsCreate from "./pages/ExportJobs/ExportJobsCreate";
import ExportJobsDetails from "./pages/ExportJobs/ExportJobsDetails";
import ExportJobSearch from "./pages/ExportJobs/ExportJobSearch";
import ExportJobsEdit from "./pages/ExportJobs/ExportJobsEdit";
import ExportJobsFilters from "./pages/ExportJobs/ExportJobsFilters";
import ExportJobsForm from "./pages/ExportJobs/ExportJobsForm";
import ExportJobsList from "./pages/ExportJobs/ExportJobsList";
import ExportJobsTable from "./pages/ExportJobs/ExportJobsTable";
import ExportJobsToolbar from "./pages/ExportJobs/ExportJobsToolbar";
import ExportJobView from "./pages/ExportJobs/ExportJobView";
import DeleteExportJobsDialog from "./pages/ExportJobs/DeleteExportJobsDialog";

import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* PROTECTED APPLICATION */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* DEFAULT */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="profile/card" element={<UserProfileCard />} />
        <Route path="marketplaces" element={<MarketplaceSelector />} />

        {/* BRANDS */}
        <Route path="brands" element={<BrandList />} />
        <Route path="brands/create" element={<BrandCreate />} />
        <Route path="brands/search" element={<BrandSearch />} />
        <Route path="brands/filters" element={<BrandFilters />} />
        <Route path="brands/statistics" element={<BrandStatistics />} />
        <Route path="brands/details/:id" element={<BrandDetails />} />
        <Route path="brands/view/:id" element={<BrandView />} />
        <Route path="brands/:id/edit" element={<BrandEdit />} />
        <Route path="brands/:brandId/models" element={<BrandModelTable />} />
        <Route path="brands/:brandId/models/new" element={<BrandModelForm />} />
        <Route path="brands/:brandId/models/:modelId" element={<BrandModelView />} />
        <Route path="brands/:brandId/models/:modelId/edit" element={<BrandModelForm />} />

        {/* CATEGORIES */}
        <Route path="categories" element={<CategoryList />} />
        <Route path="categories/create" element={<CategoryCreate />} />
        <Route path="categories/search" element={<CategorySearch />} />
        <Route path="categories/filters" element={<CategoryFilters />} />
        <Route path="categories/statistics" element={<CategoryStatistics />} />
        <Route path="categories/details/:id" element={<CategoryDetails />} />
        <Route path="categories/view/:id" element={<CategoryView />} />
        <Route path="categories/edit/:categoryId" element={<CategoryEdit />} />
        <Route path="categories/:id/products" element={<CategoryProducts />} />

        {/* CATALOG */}
        <Route path="catalog" element={<CatalogList />} />
        <Route path="catalog/create" element={<CatalogForm />} />
        <Route path="catalog/search" element={<CatalogSearch />} />
        <Route path="catalog/filters" element={<CatalogFilters />} />
        <Route path="catalog/latest" element={<CatalogList />} />
        <Route path="catalog/toprated" element={<CatalogList />} />
        <Route path="catalog/brand/:brandId" element={<CatalogList />} />
        <Route path="catalog/category/:categoryId" element={<CatalogList />} />
        <Route path="catalog/producttype/:productTypeId" element={<CatalogList />} />
        <Route path="catalog/:productId/images" element={<CatalogImages />} />
        <Route path="catalog/:productId/attributes" element={<CatalogAttributes />} />
        <Route path="catalog/:productId/reviews" element={<CatalogReviews />} />
        <Route path="catalog/view/:id" element={<CatalogView />} />
        <Route path="catalog/:id/edit" element={<CatalogEdit />} />
        <Route path="catalog/products" element={<CatalogView />} />

        {/* PRODUCTS */}
        <Route path="products/list" element={<ProductList />} />
        <Route path="products/create" element={<ProductCreate />} />
        <Route path="products/search" element={<ProductSearch />} />
        <Route path="products/filters" element={<ProductFilters />} />
        <Route path="products/statistics" element={<ProductStatistics />} />
        <Route path="products/view/:id" element={<ProductView />} />
        <Route path="products/edit/:id" element={<ProductEdit />} />
        <Route path="products/:id/edit" element={<ProductEdit />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="products/sku/:sku" element={<ProductView />} />
        <Route path="products/brand/:brandId" element={<ProductList />} />
        <Route path="products/category/:categoryId" element={<ProductList />} />
        <Route path="products/product-type/:productTypeId" element={<ProductList />} />
        <Route path="products/seller/:sellerId" element={<ProductList />} />
        <Route path="products/customer/:customerId" element={<ProductList />} />
        <Route path="products/seller/:sellerId/customer/:customerId" element={<ProductList />} />
        <Route path="products/status/:status" element={<ProductList />} />
        <Route path="products/paged" element={<ProductList />} />
        <Route path="products/sorted" element={<ProductList />} />

        {/* PRODUCT TYPES */}
        <Route path="product-types" element={<ProductTypeList />} />
        <Route path="product-types/create" element={<ProductTypeCreate />} />
        <Route path="product-types/search" element={<ProductTypeSearch />} />
        <Route path="product-types/filters" element={<ProductTypeFilters />} />
        <Route path="product-types/statistics" element={<ProductTypeStatistics />} />
        <Route path="product-types/details/:id" element={<ProductTypeDetails />} />
        <Route path="product-types/view/:id" element={<ProductTypeView />} />
        <Route path="product-types/edit/:id" element={<ProductTypeEdit />} />

        {/* PRODUCT ATTRIBUTES */}
        <Route path="product-attributes" element={<ProductAttributeList />} />
        <Route path="product-attributes/create" element={<ProductAttributeCreate />} />
        <Route path="product-attributes/search" element={<ProductAttributeSearch />} />
        <Route path="product-attributes/filters" element={<ProductAttributeFilters />} />
        <Route path="product-attributes/statistics" element={<ProductAttributeStatistics />} />
        <Route path="product-attributes/details/:id" element={<ProductAttributeDetails />} />
        <Route path="product-attributes/view/:id" element={<ProductAttributeView />} />
        <Route path="product-attributes/edit/:id" element={<ProductAttributeEdit />} />

        {/* PRODUCT IMAGES */}
        <Route path="product-images" element={<ProductImageList />} />
        <Route path="product-images/create" element={<ProductImageCreate />} />
        <Route path="product-images/search" element={<ProductImageSearch />} />
        <Route path="product-images/statistics" element={<ProductImageStatistics />} />
        <Route path="product-images/details/:id" element={<ProductImageDetails />} />
        <Route path="product-images/:id" element={<ProductImageDetails />} />
        <Route path="product-images/edit/:id" element={<ProductImageEdit />} />
        <Route path="product-images/delete/:id" element={<DeleteProductImageDialog />} />

        {/* PRODUCT INVENTORY */}
        <Route path="product-inventory" element={<ProductInventoryList />} />
        <Route path="product-inventory/create" element={<ProductInventoryCreate />} />
        <Route path="product-inventory/search" element={<ProductInventoryList />} />
        <Route path="product-inventory/filters" element={<ProductInventoryList />} />
        <Route path="product-inventory/statistics" element={<ProductInventoryList />} />
        <Route path="product-inventory/details/:id" element={<ProductInventoryDetails />} />
        <Route path="product-inventory/view/:id" element={<ProductInventoryView />} />
        <Route path="product-inventory/edit/:id" element={<ProductInventoryEdit />} />

        {/* PRODUCT PRICES */}
        <Route path="product-prices" element={<ProductPriceList />} />
        <Route path="product-prices/create" element={<ProductPriceCreate />} />
        <Route path="product-prices/search" element={<ProductPriceSearch />} />
        <Route path="product-prices/filters" element={<ProductPriceFilters />} />
        <Route path="product-prices/statistics" element={<ProductPriceStatistics />} />
        <Route path="product-prices/details/:id" element={<ProductPriceDetails />} />
        <Route path="product-prices/view/:id" element={<ProductPriceView />} />
        <Route path="product-prices/edit/:id" element={<ProductPriceEdit />} />

        {/* SELLERS */}
        <Route path="sellers" element={<SellerList />} />
        <Route path="sellers/create" element={<SellerCreate />} />
        <Route path="sellers/search" element={<SellerSearch />} />
        <Route path="sellers/filters" element={<SellerFilters />} />
        <Route path="sellers/statistics" element={<SellerStatistics />} />
        <Route path="sellers/details/:id" element={<SellerDetails />} />
        <Route path="sellers/view/:id" element={<SellerView />} />
        <Route path="sellers/edit/:id" element={<SellerEdit />} />

        {/* SELLER CUSTOMERS */}
        <Route path="seller-customers" element={<SellerCustomerList />} />
        <Route path="seller-customers/create" element={<SellerCustomerCreate />} />
        <Route path="seller-customers/search" element={<SellerCustomerSearch />} />
        <Route path="seller-customers/filters" element={<SellerCustomerFilters />} />
        <Route path="seller-customers/statistics" element={<SellerCustomerStatistics />} />
        <Route path="seller-customers/view/:id" element={<SellerCustomerView />} />
        <Route path="seller-customers/details/:sellerId/:customerId" element={<SellerCustomerDetails />} />
        <Route path="seller-customers/edit/:sellerId/:customerId" element={<SellerCustomerEdit />} />
        <Route path="seller-customers/delete/:sellerId/:customerId" element={<DeleteSellerCustomerDialog />} />

        {/* SUPPLIERS */}
        <Route path="suppliers" element={<SupplierList />} />
        <Route path="suppliers/create" element={<SupplierCreate />} />
        <Route path="suppliers/search" element={<SupplierSearch />} />
        <Route path="suppliers/filters" element={<SupplierFilters />} />
        <Route path="suppliers/statistics" element={<SupplierStatistics suppliers={[]} />} />
        <Route path="suppliers/details/:id" element={<SupplierDetails />} />
        <Route path="suppliers/view/:id" element={<SupplierView />} />
        <Route path="suppliers/edit/:id" element={<SupplierEdit />} />

        {/* WAREHOUSES */}
        <Route path="warehouses" element={<WarehouseList />} />
        <Route path="warehouses/create" element={<WarehouseCreate />} />
        <Route path="warehouses/details/:id" element={<WarehouseDetails />} />
        <Route path="warehouses/view/:id" element={<WarehouseView />} />
        <Route path="warehouses/edit/:id" element={<WarehouseEdit />} />

        {/* WAREHOUSE LOCATIONS */}
        <Route path="warehouse-locations" element={<WarehouseLocationList />} />
        <Route path="warehouse-locations/create" element={<WarehouseLocationCreate />} />
        <Route path="warehouse-locations/search" element={<WarehouseLocationSearch />} />
        <Route path="warehouse-locations/filters" element={<WarehouseLocationFilters />} />
        <Route path="warehouse-locations/details/:id" element={<WarehouseLocationDetails />} />
        <Route path="warehouse-locations/edit/:id" element={<WarehouseLocationEdit />} />

        {/* STOCK MANAGEMENT */}
        <Route path="stock-transfers" element={<StockTransferList />} />
        <Route path="stock-transfers/create" element={<StockTransferForm />} />
        <Route path="stock-transfers/details/:stockTransferId" element={<StockTransferDetails />} />
        <Route path="stock-transfers/:stockTransferId" element={<StockTransferView />} />
        <Route path="stock-transfers/:stockTransferId/edit" element={<StockTransferForm />} />

        <Route path="stock-adjustments" element={<StockAdjustmentList />} />
        <Route path="stock-adjustments/create" element={<StockAdjustmentCreate />} />
        <Route path="stock-adjustments/search" element={<StockAdjustmentSearch />} />
        <Route path="stock-adjustments/statistics" element={<StockAdjustmentStatistics />} />
        <Route path="stock-adjustments/view/:id" element={<StockAdjustmentView />} />
        <Route path="stock-adjustments/edit/:id" element={<StockAdjustmentEdit />} />

        <Route path="stock-ledger" element={<StockLedgerList />} />
        <Route path="stock-ledger/create" element={<StockLedgerCreate />} />
        <Route path="stock-ledger/search" element={<StockLedgerSearch />} />
        <Route path="stock-ledger/filters" element={< StockLedgerFilters/>} />
        <Route path="stock-ledger/view/:id" element={<StockLedgerDetails />} />
        <Route path="stock-ledger/edit/:id" element={<StockLedgerEdit />} />

        <Route path="stock-movements" element={<StockMovementList />} />
        <Route path="stock-movements/create" element={<StockMovementCreate />} />
        <Route path="stock-movements/details/:id" element={<StockMovementDetails />} />
        <Route path="stock-movements/edit/:id" element={<StockMovementEdit />} />
        <Route path="stock-movements/view/:id" element={<StockMovementDetails />} />

        <Route path="shelfwise-inventories" element={<ShelfwiseInventoriesList />} />
        <Route path="shelfwise-inventories/create" element={<ShelfwiseInventoryCreate />} />
        <Route path="shelfwise-inventories/search" element={<ShelfwiseInventorySearch />} />
        <Route path="shelfwise-inventories/filters" element={<ShelfwiseInventoryFilters />} />
        <Route path="shelfwise-inventories/statistics" element={<ShelfwiseInventoryStatistics />} />
        <Route path="shelfwise-inventories/view/:id" element={<ShelfwiseInventoryView />} />
        <Route path="shelfwise-inventories/:id/edit" element={<ShelfwiseInventoryEdit />} />

        {/* PURCHASE */}
        <Route path="purchase-orders" element={<PurchaseOrderList />} />
        <Route path="purchase-orders/create" element={<PurchaseOrderCreate />} />
        <Route path="purchase-orders/search" element={<PurchaseOrderSearch />} />
        <Route path="purchase-orders/statistics" element={<PurchaseOrderStatistics />} />
        <Route path="purchase-orders/details/:id" element={<PurchaseOrderDetails />} />
        <Route path="purchase-orders/:id" element={<PurchaseOrderView />} />
        <Route path="purchase-orders/edit/:id" element={<PurchaseOrderEdit />} />

        <Route path="purchase-order-items" element={<PurchaseOrderItemList />} />
        <Route path="purchase-order-items/create" element={<PurchaseOrderItemCreate />} />
        <Route path="purchase-order-items/search" element={<PurchaseOrderItemSearch />} />
        <Route path="purchase-order-items/statistics" element={<PurchaseOrderItemStatistics />} />
        <Route path="purchase-order-items/details/:id" element={<PurchaseOrderItemDetails />} />
        <Route path="purchase-order-items/:id" element={<PurchaseOrderItemView />} />
        <Route path="purchase-order-items/edit/:id" element={<PurchaseOrderItemEdit />} />

        <Route path="purchase-returns" element={<PurchaseReturnList />} />
        <Route path="purchase-returns/create" element={<PurchaseReturnCreate />} />
        <Route path="purchase-returns/search" element={<PurchaseReturnSearch />} />
        <Route path="purchase-returns/statistics" element={<PurchaseReturnStatistics />} />
        <Route path="purchase-returns/details/:id" element={<PurchaseReturnDetails />} />
        <Route path="purchase-returns/:id" element={<PurchaseReturnView />} />
        <Route path="purchase-returns/edit/:id" element={<PurchaseReturnEdit />} />

        {/* GRN */}
        <Route path="goods-receipt-notes" element={<GoodsReceiptNoteList />} />
        <Route path="goods-receipt-notes/create" element={<GoodsReceiptNoteCreate />} />
        <Route path="goods-receipt-notes/search" element={<GoodsReceiptNoteSearch />} />
        <Route path="goods-receipt-notes/filters" element={<GoodsReceiptNoteFilters />} />
        <Route path="goods-receipt-notes/statistics" element={<GoodsReceiptNoteStatistics />} />
        <Route path="goods-receipt-notes/details/:id" element={<GoodsReceiptNoteDetails />} />
        <Route path="goods-receipt-notes/:id" element={<GoodsReceiptNoteView />} />
        <Route path="goods-receipt-notes/edit/:id" element={<GoodsReceiptNoteEdit />} />

        <Route path="goods-receipt-note-items" element={<GoodsReceiptNoteItemList />} />
        <Route path="goods-receipt-note-items/create" element={<GoodsReceiptNoteItemCreate />} />
        <Route path="goods-receipt-note-items/search" element={<GoodsReceiptNoteItemSearch />} />
        <Route path="goods-receipt-note-items/filters" element={<GoodsReceiptNoteItemFilters />} />
        <Route path="goods-receipt-note-items/statistics" element={<GoodsReceiptNoteItemStatistics />} />
        <Route path="goods-receipt-note-items/details/:id" element={<GoodsReceiptNoteItemDetails />} />
        <Route path="goods-receipt-note-items/:id" element={<GoodsReceiptNoteItemView />} />
        <Route path="goods-receipt-note-items/edit/:id" element={<GoodsReceiptNoteItemEdit />} />

        {/* ORDERS */}
        <Route path="orders" element={<OrderList />} />
        <Route path="orders/create" element={<OrderCreate />} />
        <Route path="orders/details/:id" element={<OrderDetails />} />
        <Route path="orders/edit/:id" element={<OrderEdit />} />

        <Route path="order-items" element={<OrderItemList />} />
        <Route path="order-items/create" element={<OrderItemCreate />} />
        <Route path="order-items/search" element={<OrderItemSearch />} />
        <Route path="order-items/statistics" element={<OrderItemStatistics />} />
        <Route path="order-items/:id/details" element={<OrderItemDetails />} />
        <Route path="order-items/:id/view" element={<OrderItemView />} />
        <Route path="order-items/:id/edit" element={<OrderItemEdit />} />
        <Route path="order-items/:id/delete" element={<DeleteOrderItemDialog />} />

        <Route path="sales-orders" element={<SalesOrderList />} />
        <Route path="sales-orders/create" element={<SalesOrderCreate />} />
        <Route path="sales-orders/search" element={<SalesOrderSearch />} />
        <Route path="sales-orders/statistics" element={<SalesOrderStatistics />} />
        <Route path="sales-orders/details/:id" element={<SalesOrderDetails />} />
        <Route path="sales-orders/edit/:id" element={<SalesOrderEdit />} />

        <Route path="sales-order-items" element={<SalesOrderItemList />} />
        <Route path="sales-order-items/create" element={<SalesOrderItemCreate />} />
        <Route path="sales-order-items/search" element={<SalesOrderItemSearch />} />
        <Route path="sales-order-items/statistics" element={<SalesOrderItemStatistics />} />
        <Route path="sales-order-items/details/:id" element={<SalesOrderItemDetails />} />
        <Route path="sales-order-items/:id" element={<SalesOrderItemView />} />
        <Route path="sales-order-items/edit/:id" element={<SalesOrderItemEdit />} />

        <Route path="sale-order-addresses" element={<SaleOrderAddressesList />} />
        <Route path="sale-order-addresses/create" element={<SaleOrderAddressesForm />} />
        <Route path="sale-order-addresses/view/:id" element={<SaleOrderAddressesView />} />
        <Route path="sale-order-addresses/details/:id" element={<SaleOrderAddressesView />} />
        <Route path="sale-order-addresses/edit/:id" element={<SaleOrderAddressesForm />} />
        <Route path="sale-order-addresses/delete/:id" element={<SaleOrderAddressesDelete />} />

        <Route path="sales-invoices" element={<SalesInvoiceList />} />
        <Route path="sales-invoices/create" element={<SalesInvoiceCreate />} />
        <Route path="sales-invoices/search" element={<SalesInvoiceSearch />} />
        <Route path="sales-invoices/statistics" element={<SalesInvoiceStatistics />} />
        <Route path="sales-invoices/details/:id" element={<SalesInvoiceDetails />} />
        <Route path="sales-invoices/:id" element={<SalesInvoiceView />} />
        <Route path="sales-invoices/edit/:id" element={<SalesInvoiceEdit />} />
        <Route path="sales-invoices/print/:id" element={<SalesInvoicePrint />} />

        <Route path="invoice-tax-details" element={<InvoiceTaxDetailsList />} />
        <Route path="invoice-tax-details/create" element={<InvoiceTaxDetailCreate />} />
        <Route path="invoice-tax-details/details/:id" element={<InvoiceTaxDetailDetails />} />
        <Route path="invoice-tax-details/view/:id" element={<InvoiceTaxDetailDetails />} />
        <Route path="invoice-tax-details/:id/edit" element={<InvoiceTaxDetailEdit />} />
        <Route path="invoice-tax-details/edit/:id" element={<InvoiceTaxDetailEdit />} />
        <Route path="invoice-tax-details/:id" element={<InvoiceTaxDetailDetails />} />

       ///////////////////////////

       <Route
    path="/inventory-adjustments"
    element={<InventoryAdjustmentsList />}
/>

<Route
    path="/inventory-adjustments/create"
    element={<InventoryAdjustmentsCreate />}
/>

<Route
    path="/inventory-adjustments/details/:id"
    element={<InventoryAdjustmentsDetails />}
/>

<Route
    path="/inventory-adjustments/view/:id"
    element={<InventoryAdjustmentsView />}
/>

<Route
    path="/inventory-adjustments/:id/edit"
    element={<InventoryAdjustmentsEdit />}
/>


        {/* MARKETPLACE ORDERS */}
        <Route path="marketplace-orders" element={<MarketplaceOrderList />} />
        <Route path="marketplace-orders/create" element={<MarketplaceOrderCreate />} />
        <Route path="marketplace-orders/search" element={<MarketplaceOrderSearch />} />
        <Route path="marketplace-orders/statistics" element={<MarketplaceOrderStatistics />} />
        <Route path="marketplace-orders/view/:id" element={<MarketplaceOrderView />} />

        <Route path="marketplace-order-items" element={<MarketplaceOrderItemList />} />
        <Route path="marketplace-order-items/create" element={<MarketplaceOrderItemCreate />} />
        <Route path="marketplace-order-items/search" element={<MarketplaceOrderItemSearch />} />
        <Route path="marketplace-order-items/statistics" element={<MarketplaceOrderItemStatistics />} />
        <Route path="marketplace-order-items/details/:id" element={<MarketplaceOrderItemDetails />} />
        <Route path="marketplace-order-items/edit/:id" element={<MarketplaceOrderItemEdit />} />

        <Route path="marketplace-customers" element={<MarketplaceCustomersList />} />
        <Route path="marketplace-customers/create" element={<MarketplaceCustomersCreate />} />
        <Route path="marketplace-customers/search" element={<MarketplaceCustomersList />} />
        <Route path="marketplace-customers/table" element={<MarketplaceCustomersTable />} />
        <Route path="marketplace-customers/view/:id" element={<MarketplaceCustomersView />} />
        <Route path="marketplace-customers/details/:id" element={<MarketplaceCustomersDetails />} />
        <Route path="marketplace-customers/edit/:id" element={<MarketplaceCustomersEdit />} />
        <Route path="marketplace-customers/delete/:id" element={<MarketplaceCustomersDelete />} />

        <Route path="marketplace-returns" element={<MarketplaceReturnList />} />
        <Route path="marketplace-returns/search" element={<MarketplaceReturnSearch />} />
        <Route path="marketplace-returns/statistics" element={<MarketplaceReturnStatistics />} />
        <Route path="marketplace-returns/:id" element={<MarketplaceReturnView />} />

        {/* LOGISTICS */}
        <Route path="delivery-challans" element={<DeliveryChallanList />} />
        <Route path="delivery-challans/create" element={<DeliveryChallanCreate />} />
        <Route path="delivery-challans/search" element={<DeliveryChallanSearch />} />
        <Route path="delivery-challans/statistics" element={<DeliveryChallanStatistics />} />
        <Route path="delivery-challans/:id" element={<DeliveryChallanView />} />
        <Route path="delivery-challans/edit/:id" element={<DeliveryChallanEdit />} />

        <Route path="delivery-challan-items" element={<DeliveryChallanItemList />} />
        <Route path="delivery-challan-items/search" element={<DeliveryChallanItemSearch />} />
        <Route path="delivery-challan-items/statistics" element={<DeliveryChallanItemStatistics />} />
        <Route path="delivery-challan-items/details/:id" element={<DeliveryChallanItemDetails />} />
        <Route path="delivery-challan-items/:id" element={<DeliveryChallanItemView />} />
        <Route path="delivery-challan-items/edit/:id" element={<DeliveryChallanItemEdit />} />
        <Route path="delivery-challans/:challanId/items/create" element={<DeliveryChallanItemCreate />} />

        <Route path="shipments" element={<ShipmentList />} />
        <Route path="shipments/create" element={<ShipmentCreate />} />
        <Route path="shipments/search" element={<ShipmentSearch />} />
        <Route path="shipments/statistics" element={<ShipmentStatistics />} />
        <Route path="shipments/:id" element={<ShipmentView />} />
        <Route path="shipments/edit/:id" element={<ShipmentEdit />} />

        <Route path="shipping-manifests" element={<ShippingManifestsList />} />
        <Route path="shipping-manifests/create" element={<ShippingManifestCreate />} />
        <Route path="shipping-manifests/view/:id" element={<ShippingManifestView />} />
        <Route path="shipping-manifests/:id/edit" element={<ShippingManifestEdit />} />
        <Route path="shipping-manifests/:id/delete" element={<DeleteShippingManifestDialog />} />

        <Route path="manifest-packages" element={<ManifestPackagesList />} />
        <Route path="manifest-packages/create" element={<ManifestPackagesCreate />} />
        <Route path="manifest-packages/search" element={<ManifestPackagesSearch />} />
        <Route path="manifest-packages/filters" element={<ManifestPackagesFilters />} />
        <Route path="manifest-packages/statistics" element={<ManifestPackagesStatistics />} />
        <Route path="manifest-packages/details/:id" element={<ManifestPackagesDetails />} />
        <Route path="manifest-packages/view/:id" element={<ManifestPackagesView />} />
        <Route path="manifest-packages/:id/edit" element={<ManifestPackagesEdit />} />

        <Route path="gatepasses" element={<GatepassesList />} />
        <Route path="gatepasses/create" element={<GatepassCreate />} />
        <Route path="gatepasses/details/:id" element={<GatepassDetails />} />
        <Route path="gatepasses/view/:id" element={<GatepassView />} />
        <Route path="gatepasses/:id/edit" element={<GatepassEdit />} />

        {/* PICKLISTS & PUTAWAY */}
        <Route path="picklists" element={<PicklistsList />} />
        <Route path="picklists/create" element={<PicklistCreate />} />
        <Route path="picklists/view/:picklistCode" element={<PicklistView />} />
        <Route path="picklists/details/:picklistCode" element={<PicklistDetails />} />
        <Route path="picklists/edit/:picklistCode" element={<PicklistEdit />} />
        <Route path="picklists/delete/:id" element={<DeletePicklistDialog />} />

        <Route path="putaways" element={<PutawayList />} />
        <Route path="putaways/create" element={<PutawayCreate />} />
        <Route path="putaways/view/:id" element={<PutawayView />} />
        <Route path="putaways/:id/edit" element={<PutawayEdit />} />
        <Route path="putaway" element={<Navigate to="/putaways" replace />} />
        <Route path="putaway/*" element={<Navigate to="/putaways" replace />} />

        {/* CUSTOMERS & CRM */}
        <Route path="customer-addresses" element={<CustomerAddressList />} />
        <Route path="customer-addresses/search" element={<CustomerAddressSearch />} />
        <Route path="customer-addresses/statistics" element={<CustomerAddressStatistics />} />
        <Route path="customer-addresses/:id" element={<CustomerAddressView />} />

        <Route path="customer-payments" element={<CustomerPaymentList />} />
        <Route path="customer-payments/search" element={<CustomerPaymentSearch />} />
        <Route path="customer-payments/statistics" element={<CustomerPaymentStatistics />} />
        <Route path="customer-payments/:id" element={<CustomerPaymentView />} />

        <Route path="customer-returns" element={<CustomerReturnList />} />
        <Route path="customer-returns/search" element={<CustomerReturnSearch />} />
        <Route path="customer-returns/statistics" element={<CustomerReturnStatistics />} />
        <Route path="customer-returns/details/:id" element={<CustomerReturnDetails />} />
        <Route path="customer-returns/edit/:id" element={<CustomerReturnEdit />} />

        <Route path="wishlists" element={<WishlistList />} />
        <Route path="wishlists/create" element={<WishlistCreate />} />
        <Route path="wishlists/search" element={<WishlistSearch />} />
        <Route path="wishlists/statistics" element={<WishlistStatistics />} />
        <Route path="wishlists/details/:id" element={<WishlistDetails />} />
        <Route path="wishlists/:id" element={<WishlistView />} />
        <Route path="wishlists/edit/:id" element={<WishlistEdit />} />

        <Route path="wishlist-items" element={<WishlistItemList />} />
        <Route path="wishlist-items/create" element={<WishlistItemsCreate />} />
        <Route path="wishlist-items/details/:id" element={<WishlistItemsDetails />} />
        <Route path="wishlist-items/:id" element={<WishlistItemView />} />
        <Route path="wishlist-items/edit/:id" element={<WishlistItemsEdit />} />

        <Route path="reviews" element={<ReviewList />} />
        <Route path="reviews/create" element={<ReviewCreate />} />
        <Route path="reviews/search" element={<ReviewSearch />} />
        <Route path="reviews/filters" element={<ReviewFilters />} />
        <Route path="reviews/statistics" element={<ReviewStatistics />} />
        <Route path="reviews/details/:id" element={<ReviewDetails />} />
        <Route path="reviews/:id" element={<ReviewView />} />
        <Route path="reviews/edit/:id" element={<ReviewEdit />} />

        {/* SYSTEM */}
        <Route path="notifications" element={<NotificationList />} />
        <Route path="notifications/settings" element={<NotificationSettings />} />
        <Route path="notifications/view/:id" element={<NotificationView />} />

        <Route path="order-status-history" element={<OrderStatusHistoryList />} />
        <Route path="order-status-history/all" element={<OrderStatusHistoryList />} />
        <Route path="order-status-history/create" element={<CreateOrderStatusHistory />} />
        <Route path="order-status-history/view/:id" element={<OrderStatusHistoryView />} />
        <Route path="order-status-history/:id" element={<OrderStatusHistoryView />} />

        <Route path="payment-settings" element={<PaymentSettings />} />
        <Route path="payment-settings/bank-details" element={<BankDetails />} />
        <Route path="payment-settings/payment-gateway" element={<PaymentGateway />} />
        <Route path="payment-settings/upi" element={<UpiSettings />} />

        <Route path="export-jobs" element={<ExportJobsList />} />
        <Route path="export-jobs/search" element={<ExportJobSearch />} />
        <Route path="export-jobs/table" element={<ExportJobsTable />} />
        <Route path="export-jobs/toolbar" element={<ExportJobsToolbar />} />
        <Route path="export-jobs/details/:id" element={<ExportJobView />} />
        <Route path="export-jobs/:id/edit" element={<ExportJobsEdit />} />

        <Route path="facility-channels" element={<FacilityChannelsList />} />
        <Route path="facility-channels/create" element={<FacilityChannelCreate />} />
        <Route path="facility-channels/search" element={<FacilityChannelSearch />} />
        <Route path="facility-channels/filters" element={<FacilityChannelFilters />} />
        <Route path="facility-channels/statistics" element={<FacilityChannelStatistics />} />
        <Route path="facility-channels/details/:id" element={<FacilityChannelDetails />} />
        <Route path="facility-channels/view/:id" element={<FacilityChannelView />} />
        <Route path="facility-channels/:id/edit" element={<FacilityChannelEdit />} />

        <Route path="reverse-pickup-addresses" element={<ReversePickupAddressesList />} />
        <Route path="reverse-pickup-addresses/create" element={<ReversePickupAddressCreate />} />
        <Route path="reverse-pickup-addresses/search" element={<ReversePickupAddressSearch />} />
        <Route path="reverse-pickup-addresses/filters" element={<ReversePickupAddressFilters />} />
        <Route path="reverse-pickup-addresses/statistics" element={<ReversePickupAddressStatistics />} />
        <Route path="reverse-pickup-addresses/:id" element={<ReversePickupAddressDetails />} />
        <Route path="reverse-pickup-addresses/details/:id" element={<ReversePickupAddressDetails />} />
        <Route path="reverse-pickup-addresses/view/:id" element={<ReversePickupAddressView />} />
        <Route path="reverse-pickup-addresses/:id/edit" element={<ReversePickupAddressEdit />} />

        <Route path="reverse-pickup-items" element={<ReversePickupItemsList />} />
        <Route path="reverse-pickup-items/create" element={<ReversePickupItemCreate />} />
        <Route path="reverse-pickup-items/search" element={<ReversePickupItemSearch />} />
        <Route path="reverse-pickup-items/filters" element={<ReversePickupItemFilters />} />
        <Route path="reverse-pickup-items/statistics" element={<ReversePickupItemStatistics />} />
        <Route path="reverse-pickup-items/details/:id" element={<ReversePickupItemDetails />} />
        <Route path="reverse-pickup-items/view/:id" element={<ReversePickupItemView />} />
        <Route path="reverse-pickup-items/:id/edit" element={<ReversePickupItemEdit />} />

        <Route path="reverse-pickups" element={<ReversePickupsList />} />
        <Route path="reverse-pickups/create" element={<ReversePickupCreate />} />
        <Route path="reverse-pickups/search" element={<ReversePickupSearch />} />
        <Route path="reverse-pickups/filters" element={<ReversePickupFilters />} />
        <Route path="reverse-pickups/statistics" element={<ReversePickupStatistics />} />
        <Route path="reverse-pickups/details/:id" element={<ReversePickupDetails />} />
        <Route path="reverse-pickups/view/:id" element={<ReversePickupView />} />
        <Route path="reverse-pickups/:id/edit" element={<ReversePickupEdit />} />

        <Route path="supplier-addresses" element={<SupplierAddressesList />} />
        <Route path="supplier-addresses/create" element={<SupplierAddressCreate />} />
        <Route path="supplier-addresses/add" element={<SupplierAddressEdit />} />
        <Route path="supplier-addresses/view/:id" element={<SupplierAddressView />} />
        <Route path="supplier-addresses/details/:id" element={<SupplierAddressView />} />
        <Route path="supplier-addresses/:id" element={<SupplierAddressView />} />
        <Route path="supplier-addresses/:id/edit" element={<SupplierAddressEdit />} />
        <Route path="supplier-addresses/edit/:id" element={<SupplierAddressEdit />} />

        <Route path="supplier-contacts" element={<SupplierContactsList />} />
        <Route path="supplier-contacts/create" element={<SupplierContactCreate />} />
        <Route path="supplier-contacts/:id/view" element={<SupplierContactView />} />
        <Route path="supplier-contacts/:id/edit" element={<SupplierContactEdit />} />
        <Route path="supplier-contacts/:id/delete" element={<SupplierContactDelete />} />

        <Route path="vendor-item-custom-fields" element={<VendorItemCustomFieldsList />} />
        <Route path="vendor-item-custom-fields/create" element={<VendorItemCustomFieldCreate />} />
        <Route path="vendor-item-custom-fields/search" element={<VendorItemCustomFieldSearch />} />
        <Route path="vendor-item-custom-fields/filters" element={<VendorItemCustomFieldFilters />} />
        <Route path="vendor-item-custom-fields/statistics" element={<VendorItemCustomFieldStatistics />} />
        <Route path="vendor-item-custom-fields/details/:id" element={<VendorItemCustomFieldDetails />} />
        <Route path="vendor-item-custom-fields/:id/view" element={<VendorItemCustomFieldView />} />
        <Route path="vendor-item-custom-fields/:id/edit" element={<VendorItemCustomFieldEdit />} />
        <Route path="vendor-item-custom-fields/:id/delete" element={<DeleteVendorItemCustomFieldDialog />} />

        <Route path="vendor-item-masters" element={<VendorItemMastersList />} />
        <Route path="vendor-item-masters/create" element={<VendorItemMasterCreate />} />
        <Route path="vendor-item-masters/search" element={<VendorItemMasterSearch />} />
        <Route path="vendor-item-masters/filters" element={<VendorItemMasterFilters />} />
        <Route path="vendor-item-masters/statistics" element={<VendorItemMasterStatistics />} />
        <Route path="vendor-item-masters/details/:id" element={<VendorItemMasterDetails />} />
        <Route path="vendor-item-masters/view/:id" element={<VendorItemMasterView />} />
        <Route path="vendor-item-masters/:id/edit" element={<VendorItemMasterEdit />} />
        <Route path="vendor-item-masters/:id/delete" element={<DeleteVendorItemMasterDialog />} />

        {/* GLOBAL 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;