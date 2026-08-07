import axios from "axios";


const BASE_URL = "https://localhost:5001/api";


const apiService = {

  // ==========================================================
  // Authentication
  // ==========================================================

  login: (credentials) =>
    axios.post(`${BASE_URL}/auth/login`, credentials),

  register: (user) =>
    axios.post(`${BASE_URL}/auth/register`, user),

  logout: () =>
    axios.post(`${BASE_URL}/auth/logout`),

  forgotPassword: (email) =>
    axios.post(`${BASE_URL}/auth/forgot-password`, { email }),

  resetPassword: (model) =>
    axios.post(`${BASE_URL}/auth/reset-password`, model),

  changePassword: (model) =>
    axios.post(`${BASE_URL}/auth/change-password`, model),

  getCurrentUser: () =>
    axios.get(`${BASE_URL}/auth/me`),

  updateProfile: (model) =>
    axios.put(`${BASE_URL}/auth/profile`, model),

  refreshToken: (refreshToken) =>
    axios.post(`${BASE_URL}/auth/refresh-token`, {
      refreshToken,
    }),

    // ==========================================================
    // Dashboard
    // ==========================================================

    getDashboardSummary: () =>
        axios.get(`${BASE_URL}/dashboard/summary`),

    getDashboardStatistics: () =>
        axios.get(`${BASE_URL}/dashboard/statistics`),

    getInventoryChart: () =>
        axios.get(`${BASE_URL}/dashboard/inventory-chart`),

    getOrderChart: () =>
        axios.get(`${BASE_URL}/dashboard/order-chart`),

    getLowStockProducts: () =>
        axios.get(`${BASE_URL}/dashboard/low-stock-products`),



    // ==========================================================
    // Brands
    // ==========================================================

    getBrands: () =>
        axios.get(`${BASE_URL}/brand`),

    getBrandById: (id) =>
        axios.get(`${BASE_URL}/brand/${id}`),

    createBrand: (data) =>
        axios.post(`${BASE_URL}/brand`, data),

    updateBrand: (id, data) =>
        axios.put(`${BASE_URL}/brand/${id}`, data),

    deleteBrand: (id) =>
        axios.delete(`${BASE_URL}/brand/${id}`),

    // ==========================================================
// Brand Additional Services
// ==========================================================

getBrandStatistics: () =>
    axios.get(`${BASE_URL}/brand/statistics`),

searchBrands: (searchText) =>
    axios.get(`${BASE_URL}/brand/search`, {
        params: {
            searchText
        }
    }),



    // ==========================================================
    // Categories
    // ==========================================================

    getCategories: () =>
        axios.get(`${BASE_URL}/category`),

    getCategoryById: (id) =>
        axios.get(`${BASE_URL}/category/${id}`),

    createCategory: (data) =>
        axios.post(`${BASE_URL}/category`, data),

    updateCategory: (id, data) =>
        axios.put(`${BASE_URL}/category/${id}`, data),

    deleteCategory: (id) =>
        axios.delete(`${BASE_URL}/category/${id}`),

    searchCategories: (searchText) =>
        axios.get(`${BASE_URL}/category/search`, {
            params: {
                searchText
            }
        }),

    getCategoryStatistics: () =>
        axios.get(`${BASE_URL}/category/statistics`),



    // ==========================================================
    // Product Types
    // ==========================================================

    getProductTypes: () =>
        axios.get(`${BASE_URL}/producttype`),

    getProductTypeById: (id) =>
        axios.get(`${BASE_URL}/producttype/${id}`),

    createProductType: (data) =>
        axios.post(`${BASE_URL}/producttype`, data),

    updateProductType: (id, data) =>
        axios.put(`${BASE_URL}/producttype/${id}`, data),

    deleteProductType: (id) =>
        axios.delete(`${BASE_URL}/producttype/${id}`),
    // ==========================================================
// Product Type Additional Services
// ==========================================================

getProductTypeStatistics: () =>
    axios.get(`${BASE_URL}/producttype/statistics`),

searchProductTypes: (searchText) =>
    axios.get(`${BASE_URL}/producttype/search`, {
        params: {
            searchText
        }
    }),



    // ==========================================================
    // Products
    // ==========================================================

    getProducts: () =>
        axios.get(`${BASE_URL}/product`),

    getProductById: (id) =>
        axios.get(`${BASE_URL}/product/${id}`),

    createProduct: (data) =>
        axios.post(`${BASE_URL}/product`, data),

    updateProduct: (id, data) =>
        axios.put(`${BASE_URL}/product/${id}`, data),

    deleteProduct: (id) =>
        axios.delete(`${BASE_URL}/product/${id}`),

    // ==========================================================
// Product Additional Services
// ==========================================================

getProductStatistics: () =>
    axios.get(`${BASE_URL}/product/statistics`),

searchProducts: (searchText) =>
    axios.get(`${BASE_URL}/product/search`, {
        params: {
            searchText
        }
    }),


    // ==========================================================
    // Product Prices
    // ==========================================================

    getProductPrices: () =>
        axios.get(`${BASE_URL}/productprice`),

    getProductPriceById: (id) =>
        axios.get(`${BASE_URL}/productprice/${id}`),

    createProductPrice: (data) =>
        axios.post(`${BASE_URL}/productprice`, data),

    updateProductPrice: (id, data) =>
        axios.put(`${BASE_URL}/productprice/${id}`, data),

    deleteProductPrice: (id) =>
        axios.delete(`${BASE_URL}/productprice/${id}`),

    // ==========================================================
// Product Price Additional Services
// ==========================================================

getProductPriceStatistics: () =>
    axios.get(`${BASE_URL}/productprice/statistics`),

searchProductPrices: (searchText) =>
    axios.get(`${BASE_URL}/productprice/search`, {
        params: {
            searchText
        }
    }),



    // ==========================================================
    // Inventory
    // ==========================================================

    getInventories: () =>
        axios.get(`${BASE_URL}/inventory`),

    getInventoryById: (id) =>
        axios.get(`${BASE_URL}/inventory/${id}`),

    createInventory: (data) =>
        axios.post(`${BASE_URL}/inventory`, data),

    updateInventory: (id, data) =>
        axios.put(`${BASE_URL}/inventory/${id}`, data),

    deleteInventory: (id) =>
        axios.delete(`${BASE_URL}/inventory/${id}`),

    getLowStockInventory: () =>
        axios.get(`${BASE_URL}/inventory/low-stock`),

    getInventoryStatistics: () =>
        axios.get(`${BASE_URL}/inventory/statistics`),

    // ==========================================================
// Inventory Search
// ==========================================================

searchInventories: (searchText) =>
    axios.get(`${BASE_URL}/inventory/search`, {
        params:{
            searchText
        }
    }),




    // ==========================================================
    // Customer Payments
    // ==========================================================

    getCustomerPayments: () =>
        axios.get(`${BASE_URL}/customerpayment`),

    getCustomerPaymentById: (id) =>
        axios.get(`${BASE_URL}/customerpayment/${id}`),

    createCustomerPayment: (data) =>
        axios.post(`${BASE_URL}/customerpayment`, data),

    updateCustomerPayment: (id, data) =>
        axios.put(`${BASE_URL}/customerpayment/${id}`, data),

    deleteCustomerPayment: (id) =>
        axios.delete(`${BASE_URL}/customerpayment/${id}`),


// ==========================================================
// Customer Payment Additional Services
// ==========================================================

getCustomerPaymentStatistics: () =>
    axios.get(`${BASE_URL}/customerpayment/statistics`),

searchCustomerPayments: (searchText) =>
    axios.get(`${BASE_URL}/customerpayment/search`, {
        params:{
            searchText
        }
    }),

    // ==========================================================
    // Customer Returns
    // ==========================================================

    getCustomerReturns: () =>
        axios.get(`${BASE_URL}/customerreturn`),

    getCustomerReturnById: (id) =>
        axios.get(`${BASE_URL}/customerreturn/${id}`),

    createCustomerReturn: (data) =>
        axios.post(`${BASE_URL}/customerreturn`, data),

    updateCustomerReturn: (id, data) =>
        axios.put(`${BASE_URL}/customerreturn/${id}`, data),

    deleteCustomerReturn: (id) =>
        axios.delete(`${BASE_URL}/customerreturn/${id}`),


// ==========================================================
// Customer Return Additional Services
// ==========================================================

getCustomerReturnStatistics: () =>
    axios.get(`${BASE_URL}/customerreturn/statistics`),

searchCustomerReturns: (searchText) =>
    axios.get(`${BASE_URL}/customerreturn/search`, {
        params:{
            searchText
        }
    }),

    // ==========================================================
    // Orders
    // ==========================================================

    getOrders: () =>
        axios.get(`${BASE_URL}/order`),

    getOrderById: (id) =>
        axios.get(`${BASE_URL}/order/${id}`),

    createOrder: (data) =>
        axios.post(`${BASE_URL}/order`, data),

    updateOrder: (id, data) =>
        axios.put(`${BASE_URL}/order/${id}`, data),

    deleteOrder: (id) =>
        axios.delete(`${BASE_URL}/order/${id}`),


// ==========================================================
// Order Additional Services
// ==========================================================

getOrderStatistics: () =>
    axios.get(`${BASE_URL}/order/statistics`),

searchOrders: (searchText) =>
    axios.get(`${BASE_URL}/order/search`, {
        params:{
            searchText
        }
    }),

    // ==========================================================
    // Order Items
    // ==========================================================

    getOrderItems: () =>
        axios.get(`${BASE_URL}/orderitem`),

    getOrderItemById: (id) =>
        axios.get(`${BASE_URL}/orderitem/${id}`),

    createOrderItem: (data) =>
        axios.post(`${BASE_URL}/orderitem`, data),

    updateOrderItem: (id, data) =>
        axios.put(`${BASE_URL}/orderitem/${id}`, data),

    deleteOrderItem: (id) =>
        axios.delete(`${BASE_URL}/orderitem/${id}`),


// ==========================================================
// Order Item Additional Services
// ==========================================================

getOrderItemStatistics: () =>
    axios.get(`${BASE_URL}/orderitem/statistics`),

searchOrderItems: (searchText) =>
    axios.get(`${BASE_URL}/orderitem/search`, {
        params:{
            searchText
        }
    }),

    // ==========================================================
    // Order Status History
    // ==========================================================

    getOrderStatusHistory: () =>
        axios.get(`${BASE_URL}/orderstatushistory`),

    getOrderStatusHistoryById: (id) =>
        axios.get(`${BASE_URL}/orderstatushistory/${id}`),

    createOrderStatusHistory: (data) =>
        axios.post(`${BASE_URL}/orderstatushistory`, data),

    updateOrderStatusHistory: (id, data) =>
        axios.put(`${BASE_URL}/orderstatushistory/${id}`, data),

    deleteOrderStatusHistory: (id) =>
        axios.delete(`${BASE_URL}/orderstatushistory/${id}`),

    // ==========================================================
    // Shipments
    // ==========================================================

    getShipments: () =>
        axios.get(`${BASE_URL}/shipment`),

    getShipmentById: (id) =>
        axios.get(`${BASE_URL}/shipment/${id}`),

    createShipment: (data) =>
        axios.post(`${BASE_URL}/shipment`, data),

    updateShipment: (id, data) =>
        axios.put(`${BASE_URL}/shipment/${id}`, data),

    deleteShipment: (id) =>
        axios.delete(`${BASE_URL}/shipment/${id}`),

// ==========================================================
// Shipment Additional Services
// ==========================================================

getShipmentStatistics: () =>
    axios.get(`${BASE_URL}/shipment/statistics`),

searchShipments: (searchText) =>
    axios.get(`${BASE_URL}/shipment/search`, {
        params:{
            searchText
        }
    }),

    // ==========================================================
    // Sales Orders
    // ==========================================================

    getSalesOrders: () =>
        axios.get(`${BASE_URL}/salesorder`),

    getSalesOrderById: (id) =>
        axios.get(`${BASE_URL}/salesorder/${id}`),

    createSalesOrder: (data) =>
        axios.post(`${BASE_URL}/salesorder`, data),

    updateSalesOrder: (id, data) =>
        axios.put(`${BASE_URL}/salesorder/${id}`, data),

    deleteSalesOrder: (id) =>
        axios.delete(`${BASE_URL}/salesorder/${id}`),

    getSalesOrderStatistics: () =>
        axios.get(`${BASE_URL}/salesorder/statistics`),

    searchSalesOrders: (searchText) =>
        axios.get(`${BASE_URL}/salesorder/search`, {
            params: {
                searchText
            }
        }),

  // ==========================================================
// Purchase Orders
// ==========================================================

getPurchaseOrders: () =>
    axios.get(`${BASE_URL}/purchaseorder`),

getPurchaseOrderById: (id) =>
    axios.get(`${BASE_URL}/purchaseorder/${id}`),

createPurchaseOrder: (data) =>
    axios.post(`${BASE_URL}/purchaseorder`, data),

updatePurchaseOrder: (id, data) =>
    axios.put(`${BASE_URL}/purchaseorder/${id}`, data),

deletePurchaseOrder: (id) =>
    axios.delete(`${BASE_URL}/purchaseorder/${id}`),

getPurchaseOrderStatistics: () =>
    axios.get(`${BASE_URL}/purchaseorder/statistics`),

searchPurchaseOrders: (searchText) =>
    axios.get(`${BASE_URL}/purchaseorder/search`, {
        params: {
            searchText
        }
    }),
// ==========================================================
// Purchase Order Item Additional Services
// ==========================================================

getPurchaseOrderItemStatistics: () =>
    axios.get(`${BASE_URL}/purchaseorderitem/statistics`),

searchPurchaseOrderItems: (searchText) =>
    axios.get(`${BASE_URL}/purchaseorderitem/search`, {
        params:{
            searchText
        }
    }),


// ==========================================================
// Purchase Order Items
// ==========================================================

getPurchaseOrderItems: () =>
    axios.get(`${BASE_URL}/purchaseorderitem`),

getPurchaseOrderItemById: (id) =>
    axios.get(`${BASE_URL}/purchaseorderitem/${id}`),

createPurchaseOrderItem: (data) =>
    axios.post(`${BASE_URL}/purchaseorderitem`, data),

updatePurchaseOrderItem: (id, data) =>
    axios.put(`${BASE_URL}/purchaseorderitem/${id}`, data),

deletePurchaseOrderItem: (id) =>
    axios.delete(`${BASE_URL}/purchaseorderitem/${id}`),



// ==========================================================
// Goods Receipt Notes
// ==========================================================

getGoodsReceiptNotes: () =>
    axios.get(`${BASE_URL}/goodsreceiptnote`),

getGoodsReceiptNoteById: (id) =>
    axios.get(`${BASE_URL}/goodsreceiptnote/${id}`),

createGoodsReceiptNote: (data) =>
    axios.post(`${BASE_URL}/goodsreceiptnote`, data),

updateGoodsReceiptNote: (id, data) =>
    axios.put(`${BASE_URL}/goodsreceiptnote/${id}`, data),

deleteGoodsReceiptNote: (id) =>
    axios.delete(`${BASE_URL}/goodsreceiptnote/${id}`),

getGoodsReceiptNoteStatistics: () =>
    axios.get(`${BASE_URL}/goodsreceiptnote/statistics`),

searchGoodsReceiptNotes: (searchText) =>
    axios.get(`${BASE_URL}/goodsreceiptnote/search`, {
        params: {
            searchText
        }
    }),



// ==========================================================
// Goods Receipt Note Items
// ==========================================================

getGoodsReceiptNoteItems: () =>
    axios.get(`${BASE_URL}/goodsreceiptnoteitem`),

getGoodsReceiptNoteItemById: (id) =>
    axios.get(`${BASE_URL}/goodsreceiptnoteitem/${id}`),

createGoodsReceiptNoteItem: (data) =>
    axios.post(`${BASE_URL}/goodsreceiptnoteitem`, data),

updateGoodsReceiptNoteItem: (id, data) =>
    axios.put(`${BASE_URL}/goodsreceiptnoteitem/${id}`, data),

deleteGoodsReceiptNoteItem: (id) =>
    axios.delete(`${BASE_URL}/goodsreceiptnoteitem/${id}`),

getGoodsReceiptNoteItemStatistics: () =>
    axios.get(`${BASE_URL}/goodsreceiptnoteitem/statistics`),

searchGoodsReceiptNoteItems: (searchText) =>
    axios.get(`${BASE_URL}/goodsreceiptnoteitem/search`, {
        params: {
            searchText
        }
    }),



// ==========================================================
// Stock Ledger
// ==========================================================

getStockLedgers: () =>
    axios.get(`${BASE_URL}/stockledger`),

getStockLedgerById: (id) =>
    axios.get(`${BASE_URL}/stockledger/${id}`),

createStockLedger: (data) =>
    axios.post(`${BASE_URL}/stockledger`, data),

updateStockLedger: (id, data) =>
    axios.put(`${BASE_URL}/stockledger/${id}`, data),

deleteStockLedger: (id) =>
    axios.delete(`${BASE_URL}/stockledger/${id}`),

getStockLedgerStatistics: () =>
    axios.get(`${BASE_URL}/stockledger/statistics`),

searchStockLedgers: (searchText) =>
    axios.get(`${BASE_URL}/stockledger/search`, {
        params: {
            searchText
        }
    }),

    getStockLedgerByProduct: (productId) =>
    axios.get(`${BASE_URL}/stockledger/product/${productId}`),

getStockLedgerByWarehouse: (warehouseId) =>
    axios.get(`${BASE_URL}/stockledger/warehouse/${warehouseId}`),

getCurrentStockBalance: (productId, warehouseId) =>
    axios.get(`${BASE_URL}/stockledger/current-stock`, {
        params:{
            productId,
            warehouseId
        }
    }),
// ==========================================================
// Delivery Challans
// ==========================================================

getDeliveryChallans: () =>
    axios.get(`${BASE_URL}/deliverychallan`),

getDeliveryChallanById: (id) =>
    axios.get(`${BASE_URL}/deliverychallan/${id}`),

createDeliveryChallan: (data) =>
    axios.post(`${BASE_URL}/deliverychallan`, data),

updateDeliveryChallan: (id, data) =>
    axios.put(`${BASE_URL}/deliverychallan/${id}`, data),

deleteDeliveryChallan: (id) =>
    axios.delete(`${BASE_URL}/deliverychallan/${id}`),

getDeliveryChallanStatistics: () =>
    axios.get(`${BASE_URL}/deliverychallan/statistics`),

searchDeliveryChallans: (searchText) =>
    axios.get(`${BASE_URL}/deliverychallan/search`, {
        params: {
            searchText
        }
    }
),
const getMarketplaceOrderItems = () =>
    axiosInstance.get("/MarketplaceOrderItems");

const getMarketplaceOrderItem = (id) =>
    axiosInstance.get(`/MarketplaceOrderItems/${id}`);

const createMarketplaceOrderItem = (data) =>
    axiosInstance.post("/MarketplaceOrderItems", data);

const updateMarketplaceOrderItem = (id, data) =>
    axiosInstance.put(`/MarketplaceOrderItems/${id}`, data);

const deleteMarketplaceOrderItem = (id) =>
    axiosInstance.delete(`/MarketplaceOrderItems/${id}`);
};




export default apiService;