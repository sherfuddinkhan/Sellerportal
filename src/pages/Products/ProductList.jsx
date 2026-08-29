// =========================================================
// ProductList.jsx
// =========================================================

import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
    Alert,
    Box,
    Snackbar
} from "@mui/material";

import ProductToolbar from "./ProductToolbar";
import ProductStatistics from "./ProductStatistics";
import ProductSearch from "./ProductSearch";
import ProductTable from "./ProductTable";
import ProductPagination from "./ProductPagination";
import ProductModal from "./ProductModal";
import DeleteProductDialog from "./DeleteProductDialog";

// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// HELPER
// =========================================================

const getValue = (item, ...keys) => {
    for (const key of keys) {
        if (
            item &&
            item[key] !== undefined &&
            item[key] !== null
        ) {
            return item[key];
        }
    }

    return "";
};

// =========================================================
// NORMALIZE PRODUCT
// Handles both:
// productId / ProductId
// productName / ProductName
// =========================================================

const normalizeProduct = (item = {}) => {

    return {
        ...item,

        ProductId: getValue(
            item,
            "productId",
            "ProductId"
        ),

        ProductName: getValue(
            item,
            "productName",
            "ProductName"
        ),

        ProductCode: getValue(
            item,
            "productCode",
            "ProductCode"
        ),

        SKU: getValue(
            item,
            "sku",
            "SKU"
        ),

        SellerId: getValue(
            item,
            "sellerId",
            "SellerId"
        ),

        CustomerId: getValue(
            item,
            "customerId",
            "CustomerId"
        ),

        CategoryId: getValue(
            item,
            "categoryId",
            "CategoryId"
        ),

        BrandId: getValue(
            item,
            "brandId",
            "BrandId"
        ),

        ProductTypeId: getValue(
            item,
            "productTypeId",
            "ProductTypeId"
        ),

        Description: getValue(
            item,
            "description",
            "Description"
        ),

        IsActive:
            item.isActive ??
            item.IsActive ??
            true
    };
};

// =========================================================
// EXTRACT ARRAY FROM API RESPONSE
// Supports:
// []
// { data: [] }
// { products: [] }
// { items: [] }
// { result: [] }
// =========================================================

const extractProducts = (responseData) => {

    if (Array.isArray(responseData)) {
        return responseData;
    }

    if (
        responseData &&
        Array.isArray(responseData.data)
    ) {
        return responseData.data;
    }

    if (
        responseData &&
        Array.isArray(responseData.products)
    ) {
        return responseData.products;
    }

    if (
        responseData &&
        Array.isArray(responseData.items)
    ) {
        return responseData.items;
    }

    if (
        responseData &&
        Array.isArray(responseData.result)
    ) {
        return responseData.result;
    }

    return [];
};

// =========================================================
// COMPONENT
// =========================================================

const ProductList = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [products, setProducts] = useState([]);

    const [filteredProducts, setFilteredProducts] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [searchText, setSearchText] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [categoryFilter, setCategoryFilter] =
        useState("");

    const [brandFilter, setBrandFilter] =
        useState("");

    const [productTypeFilter, setProductTypeFilter] =
        useState("");

    const [selectedProduct, setSelectedProduct] =
        useState(null);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [page, setPage] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    const [errorMessage, setErrorMessage] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    // =====================================================
    // LOAD ALL PRODUCTS
    //
    // Node:
    // GET /api/catalog/products/all
    //
    // ASP.NET:
    // GET /api/catalog/products/all
    // =====================================================

    const loadProducts = useCallback(
        async () => {

            try {

                setLoading(true);

                console.log(
                    "================================="
                );

                console.log(
                    "LOADING CATALOG PRODUCTS"
                );

                console.log(
                    "URL:",
                    `${SERVER_URL}/api/catalog/products/all`
                );

                console.log(
                    "================================="
                );

                const response = await fetch(
                    `${SERVER_URL}/api/catalog/products/all`,
                    {
                        method: "GET",
                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );

                const responseData =
                    await response.json();

                console.log(
                    "PRODUCT API STATUS:",
                    response.status
                );

                console.log(
                    "PRODUCT API RESPONSE:",
                    responseData
                );

                if (!response.ok) {

                    throw new Error(
                        responseData?.message ||
                        "Failed to load products"
                    );
                }

                const data =
                    extractProducts(
                        responseData
                    );

                const normalized =
                    data.map(
                        normalizeProduct
                    );

                console.log(
                    "NORMALIZED PRODUCTS:",
                    normalized
                );

                setProducts(normalized);

                setFilteredProducts(
                    normalized
                );

            }
            catch (error) {

                console.error(
                    "LOAD PRODUCTS ERROR:",
                    error
                );

                setProducts([]);

                setFilteredProducts([]);

                setErrorMessage(
                    error.message ||
                    "Failed to load products"
                );

            }
            finally {

                setLoading(false);

            }

        },
        []
    );

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadProducts();

    }, [loadProducts]);

    // =====================================================
    // SEARCH + FILTER
    // =====================================================

    useEffect(() => {

        let result = [...products];

        // =================================================
        // SEARCH
        // =================================================

        const search =
            searchText
                .trim()
                .toLowerCase();

        if (search) {

            result = result.filter(
                (item) => {

                    const searchableValues = [

                        item.ProductId,

                        item.ProductName,

                        item.ProductCode,

                        item.SKU,

                        item.SellerId,

                        item.CustomerId,

                        item.CategoryId,

                        item.BrandId,

                        item.ProductTypeId,

                        item.Description,

                        item.brandName,

                        item.BrandName,

                        item.categoryName,

                        item.CategoryName,

                        item.productTypeName,

                        item.ProductTypeName

                    ];

                    return searchableValues.some(
                        (value) =>
                            String(
                                value ?? ""
                            )
                                .toLowerCase()
                                .includes(search)
                    );

                }
            );

        }

        // =================================================
        // STATUS
        // =================================================

        if (
            statusFilter !== "All"
        ) {

            result =
                result.filter(
                    (item) => {

                        const active =
                            item.IsActive === true ||
                            item.IsActive === 1 ||
                            item.IsActive === "true";

                        return statusFilter ===
                            "Active"
                            ? active
                            : !active;

                    }
                );

        }

        // =================================================
        // CATEGORY
        // =================================================

        if (categoryFilter !== "") {

            result =
                result.filter(
                    (item) =>
                        String(
                            item.CategoryId
                        ) ===
                        String(
                            categoryFilter
                        )
                );

        }

        // =================================================
        // BRAND
        // =================================================

        if (brandFilter !== "") {

            result =
                result.filter(
                    (item) =>
                        String(
                            item.BrandId
                        ) ===
                        String(
                            brandFilter
                        )
                );

        }

        // =================================================
        // PRODUCT TYPE
        // =================================================

        if (
            productTypeFilter !== ""
        ) {

            result =
                result.filter(
                    (item) =>
                        String(
                            item.ProductTypeId
                        ) ===
                        String(
                            productTypeFilter
                        )
                );

        }

        setFilteredProducts(result);

        // =================================================
        // Keep current page valid
        // =================================================

        const calculatedPages =
            Math.max(
                1,
                Math.ceil(
                    result.length /
                    pageSize
                )
            );

        if (
            page >
            calculatedPages
        ) {

            setPage(
                calculatedPages
            );

        }

    }, [
        products,
        searchText,
        statusFilter,
        categoryFilter,
        brandFilter,
        productTypeFilter,
        page,
        pageSize
    ]);

    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredProducts.length /
                pageSize
            )
        );

    const pagedProducts =
        useMemo(
            () => {

                const start =
                    (page - 1) *
                    pageSize;

                const end =
                    start +
                    pageSize;

                return filteredProducts.slice(
                    start,
                    end
                );

            },
            [
                filteredProducts,
                page,
                pageSize
            ]
        );

    // =====================================================
    // CREATE PRODUCT
    //
    // Node:
    // POST /api/catalog/products
    // =====================================================

    const createProduct =
        async (data) => {

            console.log(
                "CREATE PRODUCT REQUEST:",
                data
            );

            const response =
                await fetch(
                    `${SERVER_URL}/api/catalog/products`,
                    {
                        method: "POST",

                        headers: {
                            Accept:
                                "application/json",

                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                data
                            )
                    }
                );

            const responseData =
                await response.json();

            console.log(
                "CREATE PRODUCT RESPONSE:",
                responseData
            );

            if (!response.ok) {

                throw new Error(
                    responseData?.message ||
                    "Failed to create product"
                );

            }

            return responseData;
        };

    // =====================================================
    // UPDATE PRODUCT
    //
    // Node:
    // PUT /api/catalog/:id
    // =====================================================

    const updateProduct =
        async (
            id,
            data
        ) => {

            console.log(
                "UPDATE PRODUCT:",
                id,
                data
            );

            const response =
                await fetch(
                    `${SERVER_URL}/api/catalog/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            Accept:
                                "application/json",

                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                data
                            )
                    }
                );

            const responseData =
                await response.json();

            console.log(
                "UPDATE PRODUCT RESPONSE:",
                responseData
            );

            if (!response.ok) {

                throw new Error(
                    responseData?.message ||
                    "Failed to update product"
                );

            }

            return responseData;
        };

    // =====================================================
    // SAVE PRODUCT
    // =====================================================

    const handleSave =
        async (data) => {

            try {

                setLoading(true);

                console.log(
                    "================================="
                );

                console.log(
                    "SAVE PRODUCT"
                );

                console.log(
                    "DATA:",
                    data
                );

                console.log(
                    "================================="
                );

                const productId =
                    getValue(
                        data,
                        "productId",
                        "ProductId"
                    );

                // =============================================
                // UPDATE
                // =============================================

                if (
                    productId !== "" &&
                    productId !== null &&
                    productId !== undefined
                ) {

                    await updateProduct(
                        productId,
                        data
                    );

                    setSuccessMessage(
                        "Product updated successfully"
                    );

                }

                // =============================================
                // CREATE
                // =============================================

                else {

                    await createProduct(
                        data
                    );

                    setSuccessMessage(
                        "Product created successfully"
                    );

                }

                // =============================================
                // RELOAD
                // =============================================

                await loadProducts();

                // =============================================
                // CLOSE MODAL
                // =============================================

                setSelectedProduct(
                    null
                );

            }
            catch (error) {

                console.error(
                    "SAVE PRODUCT ERROR:",
                    error
                );

                setErrorMessage(
                    error.message ||
                    "Failed to save product"
                );

            }
            finally {

                setLoading(false);

            }

        };

    // =====================================================
    // DELETE PRODUCT
    //
    // Node:
    // DELETE /api/catalog/:id
    // =====================================================

    const handleDelete =
        async (id) => {

            try {

                setLoading(true);

                console.log(
                    "DELETE PRODUCT:",
                    id
                );

                const response =
                    await fetch(
                        `${SERVER_URL}/api/catalog/${id}`,
                        {
                            method: "DELETE",

                            headers: {
                                Accept:
                                    "application/json"
                            }
                        }
                    );

                let responseData = {};

                const contentType =
                    response.headers.get(
                        "content-type"
                    );

                if (
                    contentType &&
                    contentType.includes(
                        "application/json"
                    )
                ) {

                    responseData =
                        await response.json();

                }

                console.log(
                    "DELETE RESPONSE:",
                    responseData
                );

                if (!response.ok) {

                    throw new Error(
                        responseData?.message ||
                        "Failed to delete product"
                    );

                }

                setSuccessMessage(
                    "Product deleted successfully"
                );

                await loadProducts();

            }
            catch (error) {

                console.error(
                    "DELETE PRODUCT ERROR:",
                    error
                );

                setErrorMessage(
                    error.message ||
                    "Failed to delete product"
                );

            }
            finally {

                setLoading(false);

                setDeleteOpen(false);

                setSelectedProduct(
                    null
                );

            }

        };

    // =====================================================
    // VIEW
    // =====================================================

    const handleView =
        async (row) => {

            try {

                const productId =
                    getValue(
                        row,
                        "productId",
                        "ProductId"
                    );

                if (!productId) {

                    setSelectedProduct(
                        row
                    );

                    return;
                }

                console.log(
                    "VIEW PRODUCT:",
                    productId
                );

                const response =
                    await fetch(
                        `${SERVER_URL}/api/catalog/products/${productId}`,
                        {
                            method: "GET",

                            headers: {
                                Accept:
                                    "application/json"
                            }
                        }
                    );

                const responseData =
                    await response.json();

                console.log(
                    "VIEW PRODUCT RESPONSE:",
                    responseData
                );

                if (!response.ok) {

                    throw new Error(
                        responseData?.message ||
                        "Failed to fetch product"
                    );

                }

                const product =
                    responseData?.data ||
                    responseData?.product ||
                    responseData;

                setSelectedProduct(
                    normalizeProduct(
                        product
                    )
                );

            }
            catch (error) {

                console.error(
                    "VIEW PRODUCT ERROR:",
                    error
                );

                setErrorMessage(
                    error.message ||
                    "Failed to load product details"
                );

            }

        };

    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit =
        (row) => {

            console.log(
                "EDIT PRODUCT:",
                row
            );

            setSelectedProduct(
                normalizeProduct(
                    row
                )
            );

        };

    // =====================================================
    // DELETE CLICK
    // =====================================================

    const handleDeleteClick =
        (row) => {

            console.log(
                "DELETE CLICK:",
                row
            );

            setSelectedProduct(
                normalizeProduct(
                    row
                )
            );

            setDeleteOpen(
                true
            );

        };

    // =====================================================
    // ADD PRODUCT
    // =====================================================

    const handleAdd =
        () => {

            setSelectedProduct(
                {}
            );

        };

    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const clearFilters =
        () => {

            setSearchText("");

            setStatusFilter(
                "All"
            );

            setCategoryFilter(
                ""
            );

            setBrandFilter(
                ""
            );

            setProductTypeFilter(
                ""
            );

            setPage(1);

        };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                p: 3,
                width: "100%"
            }}
        >

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <ProductToolbar
                onAdd={
                    handleAdd
                }

                onRefresh={
                    loadProducts
                }

                onExport={() =>
                    console.log(
                        "Export Products"
                    )
                }
            />

            {/* =================================================
                STATISTICS
            ================================================= */}

            <ProductStatistics
                products={
                    products
                }
            />

            {/* =================================================
                SEARCH + FILTER
            ================================================= */}

            <ProductSearch
                searchText={
                    searchText
                }

                setSearchText={
                    setSearchText
                }

                statusFilter={
                    statusFilter
                }

                setStatusFilter={
                    setStatusFilter
                }

                categoryFilter={
                    categoryFilter
                }

                setCategoryFilter={
                    setCategoryFilter
                }

                brandFilter={
                    brandFilter
                }

                setBrandFilter={
                    setBrandFilter
                }

                productTypeFilter={
                    productTypeFilter
                }

                setProductTypeFilter={
                    setProductTypeFilter
                }

                products={
                    products
                }

                onClearFilters={
                    clearFilters
                }
            />

            {/* =================================================
                TABLE
            ================================================= */}

            <ProductTable
                products={
                    pagedProducts
                }

                loading={
                    loading
                }

                onView={
                    handleView
                }

                onEdit={
                    handleEdit
                }

                onDelete={
                    handleDeleteClick
                }
            />

            {/* =================================================
                PAGINATION
            ================================================= */}

            <ProductPagination
                page={
                    page
                }

                totalPages={
                    totalPages
                }

                pageSize={
                    pageSize
                }

                totalRecords={
                    filteredProducts.length
                }

                onPageChange={
                    setPage
                }

                onPageSizeChange={
                    (size) => {

                        setPageSize(
                            size
                        );

                        setPage(
                            1
                        );

                    }
                }
            />

            {/* =================================================
                PRODUCT MODAL
            ================================================= */}

            <ProductModal
                open={
                    Boolean(
                        selectedProduct
                    ) &&
                    !deleteOpen
                }

                product={
                    selectedProduct
                }

                onClose={() =>
                    setSelectedProduct(
                        null
                    )
                }

                onSave={
                    handleSave
                }
            />

            {/* =================================================
                DELETE DIALOG
            ================================================= */}

            <DeleteProductDialog
                open={
                    deleteOpen
                }

                product={
                    selectedProduct
                }

                onClose={() => {

                    setDeleteOpen(
                        false
                    );

                    setSelectedProduct(
                        null
                    );

                }}

                onDeleted={
                    handleDelete
                }
            />

            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            <Snackbar
                open={
                    Boolean(
                        errorMessage
                    )
                }

                autoHideDuration={
                    5000
                }

                onClose={() =>
                    setErrorMessage("")
                }
            >

                <Alert
                    severity="error"
                    onClose={() =>
                        setErrorMessage("")
                    }
                >
                    {errorMessage}
                </Alert>

            </Snackbar>

            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            <Snackbar
                open={
                    Boolean(
                        successMessage
                    )
                }

                autoHideDuration={
                    3000
                }

                onClose={() =>
                    setSuccessMessage("")
                }
            >

                <Alert
                    severity="success"
                    onClose={() =>
                        setSuccessMessage("")
                    }
                >
                    {successMessage}
                </Alert>

            </Snackbar>

        </Box>

    );

};

export default ProductList;
