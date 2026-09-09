// =========================================================
// ProductList.jsx
// Marketplace Seller Portal
// Product Management
// =========================================================

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Alert,
    Box,
    Snackbar,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import ProductToolbar from "./ProductToolbar";
import ProductStatistics from "./ProductStatistics";
import ProductSearch from "./ProductSearch";
import ProductTable from "./ProductTable";
import ProductPagination from "./ProductPagination";
import DeleteProductDialog from "./DeleteProductDialog";

// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";

const PRODUCT_API = `${SERVER_URL}/api/products`;

// =========================================================
// HELPERS
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

        BrandId: getValue(
            item,
            "brandId",
            "BrandId"
        ),

        CategoryId: getValue(
            item,
            "categoryId",
            "CategoryId"
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
            true,
    };
};

// =========================================================
// EXTRACT PRODUCT ARRAY
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
// SAFE JSON RESPONSE
// =========================================================

const getJsonResponse = async (response) => {
    const contentType =
        response.headers.get("content-type") || "";

    if (
        contentType.includes("application/json")
    ) {
        return await response.json();
    }

    return {};
};

// =========================================================
// COMPONENT
// =========================================================

const ProductList = () => {
    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [products, setProducts] = useState([]);

    const [filteredProducts, setFilteredProducts] =
        useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

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

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);

    const [errorMessage, setErrorMessage] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    // =====================================================
    // LOAD ALL PRODUCTS
    //
    // GET /api/products
    // =====================================================

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            console.log(
                "========================================"
            );

            console.log("GET ALL PRODUCTS");

            console.log(
                "URL:",
                PRODUCT_API
            );

            console.log(
                "========================================"
            );

            const response = await fetch(
                PRODUCT_API,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            const responseData =
                await getJsonResponse(response);

            console.log(
                "PRODUCT STATUS:",
                response.status
            );

            console.log(
                "PRODUCT RESPONSE:",
                responseData
            );

            if (!response.ok) {
                throw new Error(
                    responseData?.message ||
                    "Failed to load products."
                );
            }

            const data =
                extractProducts(responseData);

            const normalized =
                data.map(normalizeProduct);

            setProducts(normalized);

            setFilteredProducts(normalized);
        } catch (error) {
            console.error(
                "LOAD PRODUCTS ERROR:",
                error
            );

            setProducts([]);

            setFilteredProducts([]);

            setErrorMessage(
                error?.message ||
                "Failed to load products."
            );
        } finally {
            setLoading(false);
        }
    }, []);

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

        // -------------------------------------------------
        // SEARCH
        // -------------------------------------------------

        const search =
            searchText
                .trim()
                .toLowerCase();

        if (search) {
            result = result.filter((item) => {
                const searchableValues = [
                    item.ProductId,
                    item.ProductName,
                    item.ProductCode,
                    item.SKU,
                    item.SellerId,
                    item.CustomerId,
                    item.BrandId,
                    item.CategoryId,
                    item.ProductTypeId,
                    item.Description,

                    item.brandName,
                    item.BrandName,

                    item.categoryName,
                    item.CategoryName,

                    item.productTypeName,
                    item.ProductTypeName,
                ];

                return searchableValues.some(
                    (value) =>
                        String(value ?? "")
                            .toLowerCase()
                            .includes(search)
                );
            });
        }

        // -------------------------------------------------
        // STATUS
        // -------------------------------------------------

        if (statusFilter !== "All") {
            result = result.filter((item) => {
                const active =
                    item.IsActive === true ||
                    item.IsActive === 1 ||
                    item.IsActive === "true";

                return statusFilter === "Active"
                    ? active
                    : !active;
            });
        }

        // -------------------------------------------------
        // CATEGORY
        // -------------------------------------------------

        if (categoryFilter !== "") {
            result = result.filter(
                (item) =>
                    String(item.CategoryId) ===
                    String(categoryFilter)
            );
        }

        // -------------------------------------------------
        // BRAND
        // -------------------------------------------------

        if (brandFilter !== "") {
            result = result.filter(
                (item) =>
                    String(item.BrandId) ===
                    String(brandFilter)
            );
        }

        // -------------------------------------------------
        // PRODUCT TYPE
        // -------------------------------------------------

        if (productTypeFilter !== "") {
            result = result.filter(
                (item) =>
                    String(item.ProductTypeId) ===
                    String(productTypeFilter)
            );
        }

        setFilteredProducts(result);
    }, [
        products,
        searchText,
        statusFilter,
        categoryFilter,
        brandFilter,
        productTypeFilter,
    ]);

    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredProducts.length /
            pageSize
        )
    );

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [
        page,
        totalPages,
    ]);

    const pagedProducts = useMemo(() => {
        const start =
            (page - 1) * pageSize;

        const end =
            start + pageSize;

        return filteredProducts.slice(
            start,
            end
        );
    }, [
        filteredProducts,
        page,
        pageSize,
    ]);

    // =====================================================
    // GET PRODUCT BY ID
    //
    // GET /api/products/{id}
    // =====================================================

    const getProductById = async (id) => {
        if (
            id === null ||
            id === undefined ||
            id === ""
        ) {
            throw new Error(
                "Product ID is missing."
            );
        }

        const response = await fetch(
            `${PRODUCT_API}/${encodeURIComponent(id)}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const responseData =
            await getJsonResponse(response);

        if (!response.ok) {
            throw new Error(
                responseData?.message ||
                "Product not found."
            );
        }

        return (
            responseData?.data ||
            responseData?.product ||
            responseData
        );
    };

    // =====================================================
    // GET PRODUCT BY SKU
    //
    // GET /api/products/sku/{sku}
    // =====================================================

    const getProductBySKU = async (sku) => {
        if (!sku) {
            throw new Error(
                "Product SKU is missing."
            );
        }

        const response = await fetch(
            `${PRODUCT_API}/sku/${encodeURIComponent(sku)}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const responseData =
            await getJsonResponse(response);

        if (!response.ok) {
            throw new Error(
                responseData?.message ||
                "Product with the specified SKU was not found."
            );
        }

        return (
            responseData?.data ||
            responseData?.product ||
            responseData
        );
    };

    // =====================================================
    // GET PRODUCTS BY SELLER
    //
    // GET /api/products/seller/{sellerId}
    // =====================================================

    const getProductsBySeller = async (
        sellerId
    ) => {
        const response = await fetch(
            `${PRODUCT_API}/seller/${encodeURIComponent(
                sellerId
            )}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const responseData =
            await getJsonResponse(response);

        if (!response.ok) {
            throw new Error(
                responseData?.message ||
                "Failed to load seller products."
            );
        }

        return extractProducts(
            responseData
        );
    };

    // =====================================================
    // GET PRODUCTS BY CUSTOMER
    //
    // GET /api/products/customer/{customerId}
    // =====================================================

    const getProductsByCustomer = async (
        customerId
    ) => {
        const response = await fetch(
            `${PRODUCT_API}/customer/${encodeURIComponent(
                customerId
            )}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const responseData =
            await getJsonResponse(response);

        if (!response.ok) {
            throw new Error(
                responseData?.message ||
                "Failed to load customer products."
            );
        }

        return extractProducts(
            responseData
        );
    };

    // =====================================================
    // GET PRODUCTS BY SELLER + CUSTOMER
    //
    // GET /api/products/seller/{sellerId}/customer/{customerId}
    // =====================================================

    const getProductsBySellerCustomer = async (
        sellerId,
        customerId
    ) => {
        const response = await fetch(
            `${PRODUCT_API}/seller/${encodeURIComponent(
                sellerId
            )}/customer/${encodeURIComponent(
                customerId
            )}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const responseData =
            await getJsonResponse(response);

        if (!response.ok) {
            throw new Error(
                responseData?.message ||
                "Failed to load seller/customer products."
            );
        }

        return extractProducts(
            responseData
        );
    };

    // =====================================================
    // GET PRODUCTS BY BRAND
    //
    // GET /api/products/brand/{brandId}
    // =====================================================

    const getProductsByBrand = async (
        brandId
    ) => {
        const response = await fetch(
            `${PRODUCT_API}/brand/${encodeURIComponent(
                brandId
            )}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const responseData =
            await getJsonResponse(response);

        if (!response.ok) {
            throw new Error(
                responseData?.message ||
                "Failed to load brand products."
            );
        }

        return extractProducts(
            responseData
        );
    };

    // =====================================================
    // GET PRODUCTS BY CATEGORY
    //
    // GET /api/products/category/{categoryId}
    // =====================================================

    const getProductsByCategory = async (
        categoryId
    ) => {
        const response = await fetch(
            `${PRODUCT_API}/category/${encodeURIComponent(
                categoryId
            )}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const responseData =
            await getJsonResponse(response);

        if (!response.ok) {
            throw new Error(
                responseData?.message ||
                "Failed to load category products."
            );
        }

        return extractProducts(
            responseData
        );
    };

    // =====================================================
    // GET PRODUCTS BY PRODUCT TYPE
    //
    // GET /api/products/product-type/{productTypeId}
    // =====================================================

    const getProductsByProductType = async (
        productTypeId
    ) => {
        const response = await fetch(
            `${PRODUCT_API}/product-type/${encodeURIComponent(
                productTypeId
            )}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const responseData =
            await getJsonResponse(response);

        if (!response.ok) {
            throw new Error(
                responseData?.message ||
                "Failed to load product type products."
            );
        }

        return extractProducts(
            responseData
        );
    };

    // =====================================================
    // GET PRODUCTS BY STATUS
    //
    // GET /api/products/status/{status}
    // =====================================================

    const getProductsByStatus = async (
        status
    ) => {
        const response = await fetch(
            `${PRODUCT_API}/status/${encodeURIComponent(
                status
            )}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const responseData =
            await getJsonResponse(response);

        if (!response.ok) {
            throw new Error(
                responseData?.message ||
                "Failed to load products by status."
            );
        }

        return extractProducts(
            responseData
        );
    };

    // =====================================================
    // SEARCH PRODUCTS
    //
    // GET /api/products/search?search=phone
    // =====================================================

    const searchProducts = async (
        search
    ) => {
        const params =
            new URLSearchParams();

        if (
            search &&
            search.trim()
        ) {
            params.set(
                "search",
                search.trim()
            );
        }

        const response = await fetch(
            `${PRODUCT_API}/search?${params.toString()}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const responseData =
            await getJsonResponse(response);

        if (!response.ok) {
            throw new Error(
                responseData?.message ||
                "Product search failed."
            );
        }

        return extractProducts(
            responseData
        );
    };

    // =====================================================
    // GET STATISTICS
    //
    // GET /api/products/stats
    // =====================================================

    const getStatistics = async () => {
        const response = await fetch(
            `${PRODUCT_API}/stats`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const responseData =
            await getJsonResponse(response);

        if (!response.ok) {
            throw new Error(
                responseData?.message ||
                "Failed to load product statistics."
            );
        }

        return responseData;
    };

    // =====================================================
    // GET PAGED PRODUCTS
    //
    // GET /api/products/paged?page=1&limit=15
    // =====================================================

    const getPagedProducts = async (
        requestedPage = 1,
        requestedLimit = 15
    ) => {
        const params =
            new URLSearchParams({
                page: String(
                    requestedPage
                ),
                limit: String(
                    requestedLimit
                ),
            });

        const response = await fetch(
            `${PRODUCT_API}/paged?${params.toString()}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const responseData =
            await getJsonResponse(response);

        if (!response.ok) {
            throw new Error(
                responseData?.message ||
                "Failed to load paged products."
            );
        }

        return responseData;
    };

    // =====================================================
    // GET SORTED PRODUCTS
    //
    // GET /api/products/sorted?sort=name_asc
    // =====================================================

    const getSortedProducts = async (
        sort
    ) => {
        const params =
            new URLSearchParams();

        if (sort) {
            params.set(
                "sort",
                sort
            );
        }

        const response = await fetch(
            `${PRODUCT_API}/sorted?${params.toString()}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const responseData =
            await getJsonResponse(response);

        if (!response.ok) {
            throw new Error(
                responseData?.message ||
                "Failed to sort products."
            );
        }

        return extractProducts(
            responseData
        );
    };

    // =====================================================
    // CREATE PRODUCT
    //
    // POST /api/products
    // =====================================================

    const createProduct = async (
        data
    ) => {
        const response = await fetch(
            PRODUCT_API,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        const responseData =
            await getJsonResponse(response);

        if (!response.ok) {
            throw new Error(
                responseData?.message ||
                "Failed to create product."
            );
        }

        return responseData;
    };

    // =====================================================
    // UPDATE PRODUCT
    //
    // PUT /api/products/{id}
    // =====================================================

    const updateProduct = async (
        id,
        data
    ) => {
        if (
            id === null ||
            id === undefined ||
            id === ""
        ) {
            throw new Error(
                "Product ID is required for update."
            );
        }

        const response = await fetch(
            `${PRODUCT_API}/${encodeURIComponent(id)}`,
            {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        const responseData =
            await getJsonResponse(response);

        if (!response.ok) {
            throw new Error(
                responseData?.message ||
                "Failed to update product."
            );
        }

        return responseData;
    };

    // =====================================================
    // DELETE PRODUCT
    //
    // DELETE /api/products/{id}
    // =====================================================

    const deleteProduct = async (
        id
    ) => {
        if (
            id === null ||
            id === undefined ||
            id === ""
        ) {
            throw new Error(
                "Product ID is required for deletion."
            );
        }

        const response = await fetch(
            `${PRODUCT_API}/${encodeURIComponent(id)}`,
            {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const responseData =
            await getJsonResponse(response);

        if (!response.ok) {
            throw new Error(
                responseData?.message ||
                "Failed to delete product."
            );
        }

        return responseData;
    };

    // =====================================================
    // ADD PRODUCT
    // =====================================================

    const handleAdd = () => {
        navigate(
            "/products/create"
        );
    };

    // =====================================================
    // VIEW PRODUCT
    //
    // First fetch by ID.
    // Then navigate to details page.
    // =====================================================

    const handleView = async (
        row
    ) => {
        try {
            const productId =
                getValue(
                    row,
                    "productId",
                    "ProductId"
                );

            if (
                productId === "" ||
                productId === null ||
                productId === undefined
            ) {
                setErrorMessage(
                    "Product ID is not available."
                );

                return;
            }

            setLoading(true);

            console.log(
                "VIEW PRODUCT ID:",
                productId
            );

            // Verify product exists using ID
            await getProductById(
                productId
            );

            // Navigate using ID
            navigate(
                `/products/details/${productId}`
            );
        } catch (error) {
            console.error(
                "VIEW PRODUCT ERROR:",
                error
            );

            setErrorMessage(
                error?.message ||
                "Failed to load product."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // VIEW BY SKU
    // =====================================================

    const handleViewBySKU = async (
        row
    ) => {
        try {
            const sku =
                getValue(
                    row,
                    "sku",
                    "SKU"
                );

            if (!sku) {
                setErrorMessage(
                    "Product SKU is not available."
                );

                return;
            }

            setLoading(true);

            const product =
                await getProductBySKU(
                    sku
                );

            const productId =
                getValue(
                    product,
                    "productId",
                    "ProductId"
                );

            if (
                productId !== "" &&
                productId !== null &&
                productId !== undefined
            ) {
                navigate(
                    `/products/details/${productId}`
                );

                return;
            }

            setSelectedProduct(
                normalizeProduct(
                    product
                )
            );
        } catch (error) {
            console.error(
                "VIEW PRODUCT BY SKU ERROR:",
                error
            );

            setErrorMessage(
                error?.message ||
                "Failed to load product by SKU."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // EDIT PRODUCT
    //
    // Navigate with ProductId.
    // ProductEdit page should perform:
    //
    // GET /api/products/{id}
    //
    // and then:
    //
    // PUT /api/products/{id}
    // =====================================================

    const handleEdit = (
        row
    ) => {
        const productId =
            getValue(
                row,
                "productId",
                "ProductId"
            );

        if (
            productId === "" ||
            productId === null ||
            productId === undefined
        ) {
            setErrorMessage(
                "Product ID is not available."
            );

            return;
        }

        console.log(
            "EDIT PRODUCT ID:",
            productId
        );

        navigate(
            `/products/edit/${productId}`
        );
    };

    // =====================================================
    // DELETE CLICK
    // =====================================================

    const handleDeleteClick = (
        row
    ) => {
        const product =
            normalizeProduct(
                row
            );

        setSelectedProduct(
            product
        );

        setDeleteOpen(true);
    };

    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    const handleDelete = async (
        id
    ) => {
        try {
            setLoading(true);
            setErrorMessage("");

            await deleteProduct(
                id
            );

            setSuccessMessage(
                "Product deleted successfully."
            );

            await loadProducts();
        } catch (error) {
            console.error(
                "DELETE PRODUCT ERROR:",
                error
            );

            setErrorMessage(
                error?.message ||
                "Failed to delete product."
            );
        } finally {
            setLoading(false);

            setDeleteOpen(false);

            setSelectedProduct(
                null
            );
        }
    };

    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const clearFilters = () => {
        setSearchText("");

        setStatusFilter("All");

        setCategoryFilter("");

        setBrandFilter("");

        setProductTypeFilter("");

        setPage(1);

        loadProducts();
    };

    // =====================================================
    // SEARCH HANDLER
    // =====================================================

    const handleSearch = async () => {
        const search =
            searchText.trim();

        if (!search) {
            await loadProducts();

            setPage(1);

            return;
        }

        try {
            setLoading(true);
            setErrorMessage("");

            const result =
                await searchProducts(
                    search
                );

            const normalized =
                result.map(
                    normalizeProduct
                );

            setProducts(
                normalized
            );

            setFilteredProducts(
                normalized
            );

            setPage(1);
        } catch (error) {
            console.error(
                "SEARCH PRODUCTS ERROR:",
                error
            );

            setErrorMessage(
                error?.message ||
                "Product search failed."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box
            sx={{
                p: 3,
                width: "100%",
            }}
        >

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <ProductToolbar
                onAdd={handleAdd}

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

                onLoadStatistics={
                    getStatistics
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

                onSearch={
                    handleSearch
                }
            />

            {/* =================================================
                PRODUCT TABLE
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

                onViewBySKU={
                    handleViewBySKU
                }

                onEdit={
                    handleEdit
                }

                onDelete={
                    handleDeleteClick
                }

                // =============================================
                // BACKEND FILTER ROUTES
                // =============================================

                onSellerProducts={
                    getProductsBySeller
                }

                onCustomerProducts={
                    getProductsByCustomer
                }

                onSellerCustomerProducts={
                    getProductsBySellerCustomer
                }

                onBrandProducts={
                    getProductsByBrand
                }

                onCategoryProducts={
                    getProductsByCategory
                }

                onProductTypeProducts={
                    getProductsByProductType
                }

                onStatusProducts={
                    getProductsByStatus
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

                        setPage(1);
                    }
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
                ERROR
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
                    {
                        errorMessage
                    }
                </Alert>
            </Snackbar>

            {/* =================================================
                SUCCESS
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
                    {
                        successMessage
                    }
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default ProductList;
