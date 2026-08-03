import axios from "axios";


const BASE_URL = "https://localhost:5001/api";


const apiService = {


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
        axios.delete(`${BASE_URL}/shipment/${id}`)

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
        params: { searchText }
    }),

};


export default apiService;