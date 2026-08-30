// =========================================================
// Catalog.jsx
// Central Catalog Management Page
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
    Chip,
    CircularProgress,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import CatalogToolbar from "./CatalogToolbar";
import CatalogStatistics from "./CatalogStatistics";
import CatalogTable from "./CatalogTable";


// =========================================================
// CONFIG
// =========================================================

const SERVER_URL =
    "http://localhost:5000";


// =========================================================
// RESPONSE ARRAY HELPER
// =========================================================

const getArrayData = (data) => {

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    if (Array.isArray(data?.products)) {
        return data.products;
    }

    if (Array.isArray(data?.catalogs)) {
        return data.catalogs;
    }

    if (Array.isArray(data?.items)) {
        return data.items;
    }

    if (Array.isArray(data?.result)) {
        return data.result;
    }

    if (Array.isArray(data?.$values)) {
        return data.$values;
    }

    return [];
};


// =========================================================
// NORMALIZE ID
// =========================================================

const normalizeId = (value) => {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return null;
    }

    return value;
};


// =========================================================
// PRODUCT ID
// =========================================================

const getProductId = (product) => {

    return normalizeId(
        product?.productId ??
        product?.ProductId ??
        product?.id ??
        product?.Id ??
        product?.catalogId ??
        product?.CatalogId
    );
};


// =========================================================
// SELLER ID
// =========================================================

const getSellerId = (product) => {

    return normalizeId(
        product?.sellerId ??
        product?.SellerId ??
        product?.seller?.sellerId ??
        product?.seller?.SellerId
    );
};


// =========================================================
// CUSTOMER ID
// =========================================================

const getCustomerId = (product) => {

    return normalizeId(
        product?.customerId ??
        product?.CustomerId ??
        product?.customer?.customerId ??
        product?.customer?.CustomerId
    );
};


// =========================================================
// PRODUCT NAME
// =========================================================

const getProductName = (product) => {

    return (
        product?.productName ??
        product?.ProductName ??
        product?.name ??
        product?.Name ??
        "this product"
    );
};


// =========================================================
// COMPONENT
// =========================================================

const Catalog = () => {

    const navigate =
        useNavigate();

    const [
        searchParams,
    ] = useSearchParams();


    // =====================================================
    // PAGE SELLER / CUSTOMER CONTEXT
    // =====================================================

    const pageSellerId =
        searchParams.get("sellerId");

    const pageCustomerId =
        searchParams.get("customerId");


    // =====================================================
    // CENTRAL CATALOG CONTEXT
    // =====================================================

    const catalogSellerId =
        normalizeId(
            pageSellerId
        );

    const catalogCustomerId =
        normalizeId(
            pageCustomerId
        );


    // =====================================================
    // STATE
    // =====================================================

    const [
        catalogs,
        setCatalogs,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        page,
        setPage,
    ] = useState(0);

    const [
        rowsPerPage,
        setRowsPerPage,
    ] = useState(10);


    // =====================================================
    // BUILD QUERY
    // =====================================================

    const buildQuery = useCallback(
        (
            sellerId,
            customerId
        ) => {

            const params =
                new URLSearchParams();

            const validSellerId =
                normalizeId(
                    sellerId
                );

            const validCustomerId =
                normalizeId(
                    customerId
                );

            if (
                validSellerId !== null
            ) {

                params.set(
                    "sellerId",
                    String(
                        validSellerId
                    )
                );
            }

            if (
                validCustomerId !== null
            ) {

                params.set(
                    "customerId",
                    String(
                        validCustomerId
                    )
                );
            }

            const query =
                params.toString();

            return query
                ? `?${query}`
                : "";
        },
        []
    );


    // =====================================================
    // GET PRODUCT CONTEXT
    // =====================================================

    const getProductContext =
        useCallback(
            (product) => {

                const productId =
                    getProductId(
                        product
                    );

                /*
                 * IMPORTANT:
                 *
                 * Product-level IDs have priority.
                 *
                 * Example:
                 *
                 * Product 3
                 * sellerId = 5
                 * customerId = 2
                 *
                 * Product 6
                 * sellerId = 6
                 * customerId = 3
                 *
                 * If product IDs exist, use them.
                 *
                 * Otherwise use the page context.
                 */

                const sellerId =
                    getSellerId(
                        product
                    ) ??
                    catalogSellerId;

                const customerId =
                    getCustomerId(
                        product
                    ) ??
                    catalogCustomerId;

                return {
                    productId,
                    sellerId,
                    customerId,
                };
            },
            [
                catalogSellerId,
                catalogCustomerId,
            ]
        );


    // =====================================================
    // VALIDATE PRODUCT CONTEXT
    // =====================================================

    const validateProductContext =
        useCallback(
            (product) => {

                const context =
                    getProductContext(
                        product
                    );

                const {
                    productId,
                    sellerId,
                    customerId,
                } = context;


                console.log(
                    "========================================"
                );

                console.log(
                    "CATALOG PRODUCT CONTEXT"
                );

                console.log({
                    productId,
                    sellerId,
                    customerId,
                });


                // -------------------------------------------------
                // PRODUCT ID
                // -------------------------------------------------

                if (
                    productId === null
                ) {

                    setError(
                        "Product ID is missing."
                    );

                    return null;
                }


                // -------------------------------------------------
                // SELLER ID
                // -------------------------------------------------

                if (
                    sellerId === null
                ) {

                    setError(
                        "Seller ID is missing."
                    );

                    return null;
                }


                // -------------------------------------------------
                // CUSTOMER ID
                // -------------------------------------------------

                if (
                    customerId === null
                ) {

                    setError(
                        "Customer ID is missing."
                    );

                    return null;
                }


                return {
                    productId,
                    sellerId,
                    customerId,
                };
            },
            [
                getProductContext,
            ]
        );


    // =====================================================
    // LOAD ALL CATALOG PRODUCTS
    // =====================================================

    const loadCatalogs =
        useCallback(
            async () => {

                try {

                    setLoading(
                        true
                    );

                    setError("");


                    const url =
                        `${SERVER_URL}/api/catalog/products/all`;


                    console.log(
                        "========================================"
                    );

                    console.log(
                        "CATALOG LOAD"
                    );

                    console.log(
                        "GET:",
                        url
                    );

                    console.log(
                        "PAGE SELLER ID:",
                        catalogSellerId
                    );

                    console.log(
                        "PAGE CUSTOMER ID:",
                        catalogCustomerId
                    );


                    const response =
                        await fetch(
                            url,
                            {
                                method: "GET",

                                headers: {
                                    Accept:
                                        "application/json",
                                },
                            }
                        );


                    console.log(
                        "Catalog HTTP Status:",
                        response.status
                    );


                    if (
                        !response.ok
                    ) {

                        let message =
                            `Unable to load catalog. HTTP ${response.status}`;


                        try {

                            const errorData =
                                await response.json();

                            message =
                                errorData?.message ??
                                errorData?.title ??
                                errorData?.error ??
                                message;

                        }
                        catch {

                            // Non JSON response

                        }


                        throw new Error(
                            message
                        );
                    }


                    const data =
                        await response.json();


                    console.log(
                        "Catalog API Response:",
                        data
                    );


                    const result =
                        getArrayData(
                            data
                        );


                    console.log(
                        "Catalog Products:",
                        result
                    );


                    // =================================================
                    // NORMALIZE PRODUCTS
                    // =================================================

                    const normalizedProducts =
                        result.map(
                            (product) => {

                                const productSellerId =
                                    getSellerId(
                                        product
                                    ) ??
                                    catalogSellerId;

                                const productCustomerId =
                                    getCustomerId(
                                        product
                                    ) ??
                                    catalogCustomerId;


                                return {
                                    ...product,

                                    sellerId:
                                        productSellerId,

                                    customerId:
                                        productCustomerId,
                                };
                            }
                        );


                    // =================================================
                    // DEBUG EACH PRODUCT
                    // =================================================

                    normalizedProducts.forEach(
                        (product) => {

                            console.log(
                                "----------------------------------------"
                            );

                            console.log(
                                "CATALOG PRODUCT"
                            );

                            console.log(
                                "Product ID:",
                                getProductId(
                                    product
                                )
                            );

                            console.log(
                                "Seller ID:",
                                getSellerId(
                                    product
                                )
                            );

                            console.log(
                                "Customer ID:",
                                getCustomerId(
                                    product
                                )
                            );

                            console.log(
                                "Product Name:",
                                getProductName(
                                    product
                                )
                            );

                        }
                    );


                    setCatalogs(
                        normalizedProducts
                    );

                    setPage(0);

                }
                catch (err) {

                    console.error(
                        "Catalog loading error:",
                        err
                    );

                    setCatalogs([]);

                    setError(
                        err?.message ||
                        "Unable to load catalog products."
                    );

                }
                finally {

                    setLoading(
                        false
                    );
                }

            },
            [
                catalogSellerId,
                catalogCustomerId,
            ]
        );


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(
        () => {

            loadCatalogs();

        },
        [
            loadCatalogs,
        ]
    );
// =========================================================
// VIEW PRODUCT
// =========================================================

const handleViewProduct = (catalog) => {

    console.log("====================================");
    console.log("VIEW PRODUCT CLICKED");
    console.log("Selected Catalog:", catalog);

    // ---------------------------------------------------------
    // PRODUCT ID
    // ---------------------------------------------------------

    const productId =
        catalog?.productId ??
        catalog?.ProductId ??
        catalog?.catalogId ??
        catalog?.CatalogId ??
        catalog?.id ??
        catalog?.Id;

    // ---------------------------------------------------------
    // SELLER ID
    // ---------------------------------------------------------

    const sellerId =
        catalog?.sellerId ??
        catalog?.SellerId ??
        catalog?.seller?.sellerId ??
        catalog?.seller?.SellerId;

    // ---------------------------------------------------------
    // CUSTOMER ID
    // ---------------------------------------------------------

    const customerId =
        catalog?.customerId ??
        catalog?.CustomerId ??
        catalog?.customer?.customerId ??
        catalog?.customer?.CustomerId;

    console.log("------------------------------------");
    console.log("Product ID:", productId);
    console.log("Seller ID:", sellerId);
    console.log("Customer ID:", customerId);
    console.log("------------------------------------");

    // ---------------------------------------------------------
    // VALIDATE PRODUCT ID
    // ---------------------------------------------------------

    if (
        productId === undefined ||
        productId === null ||
        productId === ""
    ) {
        setError("Product ID is missing.");
        return;
    }

    // ---------------------------------------------------------
    // VALIDATE SELLER ID
    // ---------------------------------------------------------

    if (
        sellerId === undefined ||
        sellerId === null ||
        sellerId === ""
    ) {
        setError(
            "Seller ID is missing. Please open Catalog with sellerId."
        );
        return;
    }

    // ---------------------------------------------------------
    // VALIDATE CUSTOMER ID
    // ---------------------------------------------------------

    if (
        customerId === undefined ||
        customerId === null ||
        customerId === ""
    ) {
        setError(
            "Customer ID is missing. Please open Catalog with customerId."
        );
        return;
    }

    // ---------------------------------------------------------
    // BUILD URL
    // ---------------------------------------------------------
const url = `https://localhost:7203/api/catalog/products` + `?sellerId=${encodeURIComponent(sellerId)}` + `&customerId=${encodeURIComponent(customerId)}`;

    console.log("====================================");
    console.log("NAVIGATING TO PRODUCT DETAILS");
    console.log("URL:", url);
    console.log("====================================");

    // ---------------------------------------------------------
    // NAVIGATE
    // ---------------------------------------------------------

    navigate(url);
};

    // =====================================================
    // EDIT PRODUCT
    // =====================================================

    const handleEditProduct =
        useCallback(
            (product) => {

                const context =
                    validateProductContext(
                        product
                    );

                if (!context) {
                    return;
                }


                const {
                    productId,
                    sellerId,
                    customerId,
                } = context;


                navigate(
                    `/catalog/${productId}/edit` +
                    buildQuery(
                        sellerId,
                        customerId
                    )
                );
            },
            [
                validateProductContext,
                buildQuery,
                navigate,
            ]
        );


    // =====================================================
    // PRODUCT IMAGES
    // =====================================================

    const handleProductImages = useCallback(
    (product) => {

        console.log("================================");
        console.log("PRODUCT IMAGES CLICKED");
        console.log("Product:", product);

        const context =
            validateProductContext(product);

        console.log("Validated Context:", context);

        if (!context) {
            console.error(
                "Product context validation FAILED"
            );
            return;
        }

        const {
            productId,
            sellerId,
            customerId,
        } = context;

        console.log("Product ID:", productId);
        console.log("Seller ID:", sellerId);
        console.log("Customer ID:", customerId);

        const query =
            buildQuery(
                sellerId,
                customerId
            );

        console.log("Query:", query);

        const route =
            `/catalog/${productId}/images` +
            query;

        console.log("Navigating to:", route);

        navigate(route);

    },
    [
        validateProductContext,
        buildQuery,
        navigate,
    ]
);


    // =====================================================
    // PRODUCT ATTRIBUTES
    // =====================================================

    const handleProductAttributes =
        useCallback(
            (product) => {

                const context =
                    validateProductContext(
                        product
                    );

                if (!context) {
                    return;
                }


                const {
                    productId,
                    sellerId,
                    customerId,
                } = context;


                navigate(
                    `/catalog/${productId}/attributes` +
                    buildQuery(
                        sellerId,
                        customerId
                    )
                );
            },
            [
                validateProductContext,
                buildQuery,
                navigate,
            ]
        );


    // =====================================================
    // PRODUCT REVIEWS
    // =====================================================

    const handleProductReviews =
        useCallback(
            (product) => {

                const context =
                    validateProductContext(
                        product
                    );

                if (!context) {
                    return;
                }


                const {
                    productId,
                    sellerId,
                    customerId,
                } = context;


                navigate(
                    `/catalog/${productId}/reviews` +
                    buildQuery(
                        sellerId,
                        customerId
                    )
                );
            },
            [
                validateProductContext,
                buildQuery,
                navigate,
            ]
        );


    // =====================================================
    // RELATED PRODUCTS
    // =====================================================

    const handleRelatedProducts =
        useCallback(
            (product) => {

                const context =
                    validateProductContext(
                        product
                    );

                if (!context) {
                    return;
                }


                const {
                    productId,
                    sellerId,
                    customerId,
                } = context;


                navigate(
                    `/catalog/${productId}/related` +
                    buildQuery(
                        sellerId,
                        customerId
                    )
                );
            },
            [
                validateProductContext,
                buildQuery,
                navigate,
            ]
        );


    // =====================================================
    // MARKETPLACE
    // =====================================================

    const handleMarketplace =
        useCallback(
            (product) => {

                const context =
                    validateProductContext(
                        product
                    );

                if (!context) {
                    return;
                }


                const {
                    productId,
                    sellerId,
                    customerId,
                } = context;


                navigate(
                    `/catalog/${productId}/marketplace` +
                    buildQuery(
                        sellerId,
                        customerId
                    )
                );
            },
            [
                validateProductContext,
                buildQuery,
                navigate,
            ]
        );


    // =====================================================
    // PUBLISH
    // =====================================================

    const handlePublishProduct =
        useCallback(
            (product) => {

                const context =
                    validateProductContext(
                        product
                    );

                if (!context) {
                    return;
                }


                const {
                    productId,
                    sellerId,
                    customerId,
                } = context;


                navigate(
                    `/catalog/${productId}/publish` +
                    buildQuery(
                        sellerId,
                        customerId
                    )
                );
            },
            [
                validateProductContext,
                buildQuery,
                navigate,
            ]
        );


    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    const handleDeleteProduct =
        useCallback(
            async (product) => {

                const context =
                    validateProductContext(
                        product
                    );

                if (!context) {
                    return;
                }


                const {
                    productId,
                    sellerId,
                    customerId,
                } = context;


                const productName =
                    getProductName(
                        product
                    );


                const confirmed =
                    window.confirm(
                        `Are you sure you want to delete "${productName}"?`
                    );


                if (!confirmed) {
                    return;
                }


                try {

                    setLoading(
                        true
                    );

                    setError("");


                    const url =
                        `${SERVER_URL}/api/catalog/${productId}` +
                        buildQuery(
                            sellerId,
                            customerId
                        );


                    console.log(
                        "DELETE:",
                        url
                    );


                    const response =
                        await fetch(
                            url,
                            {
                                method: "DELETE",

                                headers: {
                                    Accept:
                                        "application/json",
                                },
                            }
                        );


                    if (
                        !response.ok
                    ) {

                        let message =
                            `Delete failed. HTTP ${response.status}`;


                        try {

                            const errorData =
                                await response.json();

                            message =
                                errorData?.message ??
                                errorData?.title ??
                                errorData?.error ??
                                message;

                        }
                        catch {

                            // Ignore

                        }


                        throw new Error(
                            message
                        );
                    }


                    await loadCatalogs();

                }
                catch (err) {

                    console.error(
                        "Delete product error:",
                        err
                    );

                    setError(
                        err?.message ||
                        "Unable to delete product."
                    );

                }
                finally {

                    setLoading(
                        false
                    );
                }

            },
            [
                validateProductContext,
                buildQuery,
                loadCatalogs,
            ]
        );


    // =====================================================
    // CREATE PRODUCT
    // =====================================================

    const handleCreateProduct =
        useCallback(
            () => {

                if (
                    catalogSellerId === null ||
                    catalogCustomerId === null
                ) {

                    setError(
                        "Seller ID and Customer ID are required to create a product."
                    );

                    return;
                }


                navigate(
                    `/catalog/create` +
                    buildQuery(
                        catalogSellerId,
                        catalogCustomerId
                    )
                );
            },
            [
                catalogSellerId,
                catalogCustomerId,
                buildQuery,
                navigate,
            ]
        );


    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch =
        useCallback(
            () => {

                if (
                    catalogSellerId === null ||
                    catalogCustomerId === null
                ) {

                    setError(
                        "Seller ID and Customer ID are required for catalog search."
                    );

                    return;
                }


                navigate(
                    `/catalog/search` +
                    buildQuery(
                        catalogSellerId,
                        catalogCustomerId
                    )
                );
            },
            [
                catalogSellerId,
                catalogCustomerId,
                buildQuery,
                navigate,
            ]
        );


    // =====================================================
    // LATEST
    // =====================================================

    const handleLatestProducts =
        useCallback(
            () => {

                if (
                    catalogSellerId === null ||
                    catalogCustomerId === null
                ) {

                    setError(
                        "Seller ID and Customer ID are required."
                    );

                    return;
                }
                navigate(`/catalog/latest` +buildQuery(catalogSellerId,catalogCustomerId)
                );
            },
            [
                catalogSellerId,
                catalogCustomerId,
                buildQuery,
                navigate,
            ]
        );


    // =====================================================
    // FEATURED
    // =====================================================

    const handleFeaturedProducts =
        useCallback(
            () => {

                if (
                    catalogSellerId === null ||
                    catalogCustomerId === null
                ) {
                    setError( "Seller ID and Customer ID are required.");
                    return;
                }
                navigate(`/catalog/featured` +buildQuery(catalogSellerId,catalogCustomerId)
                );
            },
            [
                catalogSellerId,
                catalogCustomerId,
                buildQuery,
                navigate,
            ]
        );


    // =====================================================
    // TOP RATED
    // =====================================================

    const handleTopRatedProducts =
        useCallback(
            () => {

                if (
                    catalogSellerId === null ||
                    catalogCustomerId === null
                ) {
                    setError("Seller ID and Customer ID are required.");
                    return;
                }
                navigate(`/catalog/toprated` +buildQuery(catalogSellerId,catalogCustomerId)
                );
            },
            [
                catalogSellerId,
                catalogCustomerId,
                buildQuery,
                navigate,
            ]
        );


    // =====================================================
    // BEST SELLING
    // =====================================================

    const handleBestSellingProducts =
        useCallback(
            () => {

                if (
                    catalogSellerId === null ||
                    catalogCustomerId === null
                ) {
                    setError("Seller ID and Customer ID are required.");
                    return;
                }
                navigate(`/catalog/bestsellers` +buildQuery(catalogSellerId,catalogCustomerId));
            },
            [
                catalogSellerId,
                catalogCustomerId,
                buildQuery,
                navigate,
            ]
        );


    // =====================================================
    // PAGINATION
    // =====================================================

    const paginatedCatalogs =
        useMemo(
            () => {

                const start =
                    page *
                    rowsPerPage;

                const end =
                    start +
                    rowsPerPage;

                return catalogs.slice(
                    start,
                    end
                );

            },
            [
                catalogs,
                page,
                rowsPerPage,
            ]
        );


    // =====================================================
    // INITIAL LOADING
    // =====================================================

    if (
        loading &&
        catalogs.length === 0
    ) {

        return (

            <Box
                sx={{
                    minHeight: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >

                <CircularProgress />

            </Box>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <Box
            sx={{
                p: 3,
                width: "100%",
                boxSizing: "border-box",
            }}
        >

            {/* =================================================
                CATALOG CONTEXT
            ================================================= */}

            <Box
                sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "background.paper",
                }}
            >

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={2}
                    alignItems={{
                        xs: "flex-start",
                        sm: "center",
                    }}
                >

                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                    >
                        Catalog Context
                    </Typography>


                    <Chip
                        label={
                            `Seller ID: ${
                                catalogSellerId ??
                                "Not Set"
                            }`
                        }
                        color={
                            catalogSellerId !== null
                                ? "primary"
                                : "default"
                        }
                        variant="outlined"
                    />


                    <Chip
                        label={
                            `Customer ID: ${
                                catalogCustomerId ??
                                "Not Set"
                            }`
                        }
                        color={
                            catalogCustomerId !== null
                                ? "secondary"
                                : "default"
                        }
                        variant="outlined"
                    />

                </Stack>


                <Divider
                    sx={{
                        my: 1.5,
                    }}
                />


                <Typography
                    variant="caption"
                    color="text.secondary"
                >
                    These IDs are automatically passed to
                    product View, Edit, Images, Attributes,
                    Reviews, Related Products, Marketplace,
                    Publish, Delete, Create and Search pages.
                </Typography>

            </Box>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                    }}
                    onClose={() =>
                        setError("")
                    }
                >
                    {error}
                </Alert>

            )}


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <CatalogToolbar

                sellerId={
                    catalogSellerId
                }

                customerId={
                    catalogCustomerId
                }

                onRefresh={
                    loadCatalogs
                }

                onCreate={
                    handleCreateProduct
                }

                onSearch={
                    handleSearch
                }

                onLatest={
                    handleLatestProducts
                }

                onFeatured={
                    handleFeaturedProducts
                }

                onTopRated={
                    handleTopRatedProducts
                }

                onBestSelling={
                    handleBestSellingProducts
                }

            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <CatalogStatistics

                catalogs={
                    catalogs
                }

                sellerId={
                    catalogSellerId
                }

                customerId={
                    catalogCustomerId
                }

            />


            {/* =================================================
                TABLE
            ================================================= */}

            <CatalogTable

                catalogs={
                    paginatedCatalogs
                }

                loading={
                    loading
                }

                // ---------------------------------------------
                // PAGE CONTEXT
                // ---------------------------------------------

                sellerId={
                    catalogSellerId
                }

                customerId={
                    catalogCustomerId
                }

                // ---------------------------------------------
                // PRODUCT ACTIONS
                // ---------------------------------------------

                onView={
                    handleViewProduct
                }

                onEdit={
                    handleEditProduct
                }

                onImages={
                    handleProductImages
                }

                onAttributes={
                    handleProductAttributes
                }

                onReviews={
                    handleProductReviews
                }

                onRelated={
                    handleRelatedProducts
                }

                onMarketplace={
                    handleMarketplace
                }

                onPublish={
                    handlePublishProduct
                }

                onDelete={
                    handleDeleteProduct
                }

                // ---------------------------------------------
                // PAGINATION
                // ---------------------------------------------

                page={
                    page
                }

                rowsPerPage={
                    rowsPerPage
                }

                totalCount={
                    catalogs.length
                }

                onPageChange={
                    (
                        event,
                        newPage
                    ) => {

                        setPage(
                            newPage
                        );
                    }
                }

                onRowsPerPageChange={
                    (event) => {

                        const value =
                            parseInt(
                                event.target.value,
                                10
                            );

                        setRowsPerPage(
                            value
                        );

                        setPage(0);
                    }
                }

            />

        </Box>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default Catalog;
