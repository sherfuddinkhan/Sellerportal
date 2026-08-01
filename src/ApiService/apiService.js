import axios from "axios";

const BASE_URL = "https://localhost:5001/api";

const apiService = {

    // Dashboard

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

    // Brands

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

    // Categories

    getCategories: () =>
        axios.get(`${BASE_URL}/category`),

    getCategoryById: (id) =>
        axios.get(`${BASE_URL}/category/${id}`),

    createCategory: (data) =>
        axios.post(`${BASE_URL}/category`, data),

    updateCategory: (id, data) =>
        axios.put(`${BASE_URL}/category/${id}`, data),

    deleteCategory: (id) =>
        axios.delete(`${BASE_URL}/category/${id}`)

};

export default apiService;