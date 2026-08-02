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
            params: { searchText }
        }),

    getActiveCategories: () =>
        axios.get(`${BASE_URL}/category/active`),

    getInactiveCategories: () =>
        axios.get(`${BASE_URL}/category/inactive`),

    getParentCategories: () =>
        axios.get(`${BASE_URL}/category/parents`),

    getCategoryStatistics: () =>
        axios.get(`${BASE_URL}/category/statistics`),

    activateCategory: (id) =>
        axios.put(`${BASE_URL}/category/${id}/activate`),

    deactivateCategory: (id) =>
        axios.put(`${BASE_URL}/category/${id}/deactivate`),

    bulkDeleteCategories: (ids) =>
        axios.post(`${BASE_URL}/category/bulk-delete`, ids),

    exportCategories: () =>
        axios.get(`${BASE_URL}/category/export`, {
            responseType: "blob"
        }),

    importCategories: (formData) =>
        axios.post(
            `${BASE_URL}/category/import`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        ),

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

};

export default apiService;