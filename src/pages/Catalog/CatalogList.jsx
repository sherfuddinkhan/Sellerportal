// =========================================================
// CatalogList.jsx
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
    Grid,
    Paper,
    Typography,
} from "@mui/material";

import {
    useNavigate,
} from "react-router-dom";

import CatalogToolbar from "./CatalogToolbar";
import CatalogStatistics from "./CatalogStatistics";
import CatalogTable from "./CatalogTable";


// =========================================================
// API CONFIGURATION
// =========================================================

const API_URL =
    "http://localhost:5000/api/catalog";


// =========================================================
// RESPONSE DATA HELPER
// =========================================================

const extractCatalogData = (data) => {

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    if (Array.isArray(data?.catalogs)) {
        return data.catalogs;
    }

    if (Array.isArray(data?.products)) {
        return data.products;
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
// FIELD HELPERS
// =========================================================

const getProductId = (catalog) => {

    return (
        catalog?.productId ??
        catalog?.ProductId ??
        catalog?.catalogId ??
        catalog?.CatalogId ??
        catalog?.id ??
        catalog?.Id ??
        null
    );

};


const getSellerId = (catalog) => {

    return (
        catalog?.sellerId ??
        catalog?.SellerId ??
        catalog?.seller?.sellerId ??
        catalog?.seller?.SellerId ??
        null
    );

};


const getCustomerId = (catalog) => {

    return (
        catalog?.customerId ??
        catalog?.CustomerId ??
        catalog?.customer?.customerId ??
        catalog?.customer?.CustomerId ??
        null
    );

};


const getProductName = (catalog) => {

    return (
        catalog?.productName ??
        catalog?.ProductName ??
        catalog?.catalogName ??
        catalog?.CatalogName ??
        catalog?.name ??
        catalog?.Name ??
        ""
    );

};


const getSku = (catalog) => {

    return (
        catalog?.sku ??
        catalog?.SKU ??
        catalog?.Sku ??
        ""
    );

};


const getBrandName = (catalog) => {

    return (
        catalog?.brandName ??
        catalog?.BrandName ??
        catalog?.brand?.brandName ??
        catalog?.brand?.BrandName ??
        ""
    );

};


const getCategoryName = (catalog) => {

    return (
        catalog?.categoryName ??
        catalog?.CategoryName ??
        catalog?.category?.categoryName ??
        catalog?.category?.CategoryName ??
        ""
    );

};


const getProductType = (catalog) => {

    return (
        catalog?.productType ??
        catalog?.ProductType ??
        catalog?.productTypeName ??
        catalog?.ProductTypeName ??
        ""
    );

};


const getPrice = (catalog) => {

    return (
        catalog?.price ??
        catalog?.Price ??
        0
    );

};


const getOfferPrice = (catalog) => {

    return (
        catalog?.offerPrice ??
        catalog?.OfferPrice ??
        null
    );

};


const getStockQuantity = (catalog) => {

    return (
        catalog?.stockQuantity ??
        catalog?.StockQuantity ??
        0
    );

};


const getIsAvailable = (catalog) => {

    return (
        catalog?.isAvailable ??
        catalog?.IsAvailable ??
        false
    );

};


const getRating = (catalog) => {

    return (
        catalog?.rating ??
        catalog?.Rating ??
        0
    );

};


const getReviewCount = (catalog) => {

    return (
        catalog?.reviewCount ??
        catalog?.ReviewCount ??
        0
    );

};


const getPrimaryImage = (catalog) => {

    return (
        catalog?.primaryImage ??
        catalog?.PrimaryImage ??
        catalog?.imageUrl ??
        catalog?.ImageUrl ??
        ""
    );

};


// =========================================================
// NORMALIZE CATALOG
// =========================================================

const normalizeCatalog = (catalog) => {

    return {

        // ---------------------------------------------
        // IDENTIFICATION
        // ---------------------------------------------

        productId:
            getProductId(catalog),

        sellerId:
            getSellerId(catalog),

        customerId:
            getCustomerId(catalog),


        // ---------------------------------------------
        // PRODUCT INFORMATION
        // ---------------------------------------------

        productName:
            getProductName(catalog),

        sku:
            getSku(catalog),

        brandName:
            getBrandName(catalog),

        categoryName:
            getCategoryName(catalog),

        productType:
            getProductType(catalog),


        // ---------------------------------------------
        // PRICE
        // ---------------------------------------------

        price:
            getPrice(catalog),

        offerPrice:
            getOfferPrice(catalog),


        // ---------------------------------------------
        // INVENTORY
        // ---------------------------------------------

        stockQuantity:
            getStockQuantity(catalog),

        isAvailable:
            getIsAvailable(catalog),


        // ---------------------------------------------
        // REVIEWS
        // ---------------------------------------------

        rating:
            getRating(catalog),

        reviewCount:
            getReviewCount(catalog),


        // ---------------------------------------------
        // IMAGE
        // ---------------------------------------------

        primaryImage:
            getPrimaryImage(catalog),


        // ---------------------------------------------
        // KEEP ORIGINAL API DATA
        // ---------------------------------------------

        ...catalog,

    };

};


// =========================================================
// COMPONENT
// =========================================================

const CatalogList = () => {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [catalogs, setCatalogs] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [page, setPage] =
        useState(0);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);

    const [selectedIds, setSelectedIds] =
        useState([]);


    // =====================================================
    // LOAD CATALOGS
    // =====================================================

    const loadCatalogs = useCallback(
        async () => {

            try {

                setLoading(true);

                setError("");


                const url =
                    `${API_URL}/products/all`;


                console.log(
                    "========================================"
                );

                console.log(
                    "LOADING CATALOGS"
                );

                console.log(
                    "GET:",
                    url
                );

                console.log(
                    "========================================"
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


                if (!response.ok) {

                    let errorMessage =
                        `HTTP ${response.status}: ${response.statusText}`;


                    try {

                        const errorData =
                            await response.json();


                        console.error(
                            "Catalog API Error:",
                            errorData
                        );


                        errorMessage =
                            errorData?.message ||
                            errorData?.title ||
                            errorData?.error ||
                            errorMessage;

                    }
                    catch {

                        console.error(
                            "Catalog API returned non-JSON error."
                        );

                    }


                    throw new Error(
                        errorMessage
                    );

                }


                const data =
                    await response.json();


                console.log(
                    "Catalog RAW Response:",
                    data
                );


                const catalogData =
                    extractCatalogData(data);


                console.log(
                    "Catalogs Extracted:",
                    catalogData
                );


                const mappedCatalogs =
                    catalogData.map(
                        normalizeCatalog
                    );


                console.log(
                    "MAPPED CATALOG DATA:",
                    mappedCatalogs
                );


                setCatalogs(
                    mappedCatalogs
                );

                setSelectedIds([]);

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

                setLoading(false);

            }

        },
        []
    );


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadCatalogs();

    }, [
        loadCatalogs,
    ]);


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


            if (
                sellerId !== null &&
                sellerId !== undefined
            ) {

                params.set(
                    "sellerId",
                    sellerId
                );

            }


            if (
                customerId !== null &&
                customerId !== undefined
            ) {

                params.set(
                    "customerId",
                    customerId
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
    // VALIDATE PRODUCT CONTEXT
    // =====================================================

    const validateProductContext =
        useCallback(
            (product) => {

                if (!product) {

                    setError(
                        "Product information is missing."
                    );

                    return null;

                }


                const productId =
                    getProductId(product);


                const sellerId =
                    getSellerId(product);


                const customerId =
                    getCustomerId(product);


                console.log(
                    "VALIDATING PRODUCT CONTEXT:",
                    {
                        productId,
                        sellerId,
                        customerId,
                    }
                );


                if (
                    productId === null ||
                    productId === undefined
                ) {

                    setError(
                        "Product ID is missing."
                    );

                    return null;

                }


                if (
                    sellerId === null ||
                    sellerId === undefined
                ) {

                    setError(
                        "Seller ID is missing."
                    );

                    return null;

                }


                if (
                    customerId === null ||
                    customerId === undefined
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
            []
        );


    // =====================================================
    // VIEW PRODUCT
    // =====================================================

    const handleView =
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
                    sellerId,
                    customerId,
                } = context;


                const query =
                    buildQuery(
                        sellerId,
                        customerId
                    );


                console.log(
                    "VIEW PRODUCT:",
                    product
                );


                navigate(
                    `/catalog/products${query}`
                );

            },
            [
                validateProductContext,
                buildQuery,
                navigate,
            ]
        );


    // =====================================================
    // EDIT PRODUCT
    // =====================================================

    const handleEdit =
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


                console.log(
                    "EDIT PRODUCT:",
                    context
                );


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

    const handleProductImages =
        useCallback(
            (product) => {

                console.log(
                    "========================================"
                );

                console.log(
                    "PRODUCT IMAGES CLICKED"
                );

                console.log(
                    "Product:",
                    product
                );


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


                const query =
                    buildQuery(
                        sellerId,
                        customerId
                    );


                const route =
                    `/catalog/${productId}/images` +
                    query;


                console.log(
                    "IMAGES NAVIGATION:",
                    route
                );


                navigate(
                    route
                );

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

                console.log(
                    "========================================"
                );

                console.log(
                    "PRODUCT ATTRIBUTES CLICKED"
                );

                console.log(
                    "Product:",
                    product
                );


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


                const route =
                    `/catalog/${productId}/attributes` +
                    buildQuery(
                        sellerId,
                        customerId
                    );


                console.log(
                    "ATTRIBUTES NAVIGATION:",
                    route
                );


                navigate(
                    route
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

                console.log(
                    "========================================"
                );

                console.log(
                    "PRODUCT REVIEWS CLICKED"
                );

                console.log(
                    "Product:",
                    product
                );


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


                const route =
                    `/catalog/${productId}/reviews` +
                    buildQuery(
                        sellerId,
                        customerId
                    );


                console.log(
                    "REVIEWS NAVIGATION:",
                    route
                );


                navigate(
                    route
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

                console.log(
                    "RELATED PRODUCTS CLICKED:",
                    product
                );


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


                const route =
                    `/catalog/${productId}/related` +
                    buildQuery(
                        sellerId,
                        customerId
                    );


                console.log(
                    "RELATED NAVIGATION:",
                    route
                );


                navigate(
                    route
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

                console.log(
                    "========================================"
                );

                console.log(
                    "MARKETPLACE CLICKED"
                );

                console.log(
                    "Product:",
                    product
                );


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


                const route =
                    `/catalog/${productId}/marketplace` +
                    buildQuery(
                        sellerId,
                        customerId
                    );


                console.log(
                    "MARKETPLACE NAVIGATION:",
                    route
                );


                navigate(
                    route
                );

            },
            [
                validateProductContext,
                buildQuery,
                navigate,
            ]
        );


    // =====================================================
    // PUBLISH PRODUCT
    // =====================================================

    const handlePublishProduct =
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


                console.log(
                    "PUBLISH PRODUCT:",
                    context
                );


                const confirmed =
                    window.confirm(
                        `Publish product #${productId}?`
                    );


                if (!confirmed) {
                    return;
                }


                try {

                    setLoading(true);

                    setError("");


                    const query =
                        buildQuery(
                            sellerId,
                            customerId
                        );


                    const url =
                        `${API_URL}/${productId}/publish${query}`;


                    console.log(
                        "PUBLISH:",
                        url
                    );


                    const response =
                        await fetch(
                            url,
                            {
                                method: "PUT",

                                headers: {
                                    Accept:
                                        "application/json",
                                },
                            }
                        );


                    if (!response.ok) {

                        let errorMessage =
                            `Publish failed: HTTP ${response.status}`;


                        try {

                            const data =
                                await response.json();


                            errorMessage =
                                data?.message ||
                                data?.title ||
                                data?.error ||
                                errorMessage;

                        }
                        catch {
                            // Non JSON response
                        }


                        throw new Error(
                            errorMessage
                        );

                    }


                    await loadCatalogs();

                }
                catch (err) {

                    console.error(
                        "Publish error:",
                        err
                    );


                    setError(
                        err?.message ||
                        "Unable to publish product."
                    );

                }
                finally {

                    setLoading(false);

                }

            },
            [
                validateProductContext,
                buildQuery,
                loadCatalogs,
            ]
        );


    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    const handleDelete =
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

                    setLoading(true);

                    setError("");


                    const query =
                        buildQuery(
                            sellerId,
                            customerId
                        );


                    const url =
                        `${API_URL}/${productId}${query}`;


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


                    if (!response.ok) {

                        let errorMessage =
                            `Delete failed: HTTP ${response.status}`;


                        try {

                            const errorData =
                                await response.json();


                            errorMessage =
                                errorData?.message ||
                                errorData?.title ||
                                errorData?.error ||
                                errorMessage;

                        }
                        catch {
                            // Non JSON response
                        }


                        throw new Error(
                            errorMessage
                        );

                    }


                    await loadCatalogs();

                }
                catch (err) {

                    console.error(
                        "Catalog delete error:",
                        err
                    );


                    setError(
                        err?.message ||
                        "Unable to delete catalog product."
                    );

                }
                finally {

                    setLoading(false);

                }

            },
            [
                validateProductContext,
                buildQuery,
                loadCatalogs,
            ]
        );


    // =====================================================
    // SELECTION
    // =====================================================

    const handleSelectionChange =
        useCallback(
            (ids) => {

                setSelectedIds(
                    ids
                );

            },
            []
        );


    // =====================================================
    // PAGINATION
    // =====================================================

    const paginatedCatalogs =
        useMemo(() => {

            const start =
                page * rowsPerPage;

            const end =
                start + rowsPerPage;


            return catalogs.slice(
                start,
                end
            );

        }, [
            catalogs,
            page,
            rowsPerPage,
        ]);


    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange = (
        event,
        newPage
    ) => {

        setPage(
            newPage
        );

    };


    // =====================================================
    // ROWS PER PAGE
    // =====================================================

    const handleRowsPerPageChange = (
        event
    ) => {

        const newRowsPerPage =
            parseInt(
                event.target.value,
                10
            );


        setRowsPerPage(
            newRowsPerPage
        );

        setPage(0);

    };


    // =====================================================
    // CONTEXT SUMMARY
    // =====================================================

    const sellerCustomerContexts =
        useMemo(() => {

            const map =
                new Map();


            catalogs.forEach(
                (catalog) => {

                    const sellerId =
                        getSellerId(
                            catalog
                        );

                    const customerId =
                        getCustomerId(
                            catalog
                        );


                    if (
                        sellerId !== null &&
                        customerId !== null
                    ) {

                        const key =
                            `${sellerId}-${customerId}`;


                        if (
                            !map.has(key)
                        ) {

                            map.set(
                                key,
                                {
                                    sellerId,
                                    customerId,
                                }
                            );

                        }

                    }

                }
            );


            return Array.from(
                map.values()
            );

        }, [
            catalogs,
        ]);


    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (
        loading &&
        catalogs.length === 0
    ) {

        return (

            <Box
                sx={{
                    width: "100%",
                    minHeight: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2,
                }}
            >

                <CircularProgress />

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Loading catalogs...
                </Typography>

            </Box>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <Box
            sx={{
                width: "100%",
                p: 3,
                boxSizing: "border-box",
            }}
        >

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
                CATALOG CONTEXT
            ================================================= */}

            {sellerCustomerContexts.length > 0 && (

                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        mb: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                    }}
                >

                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{
                            mb: 1.5,
                        }}
                    >
                        Catalog Seller / Customer Context
                    </Typography>


                    <Grid
                        container
                        spacing={2}
                    >

                        {sellerCustomerContexts.map(
                            (
                                context,
                                index
                            ) => (

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={
                                        `${context.sellerId}-${context.customerId}-${index}`
                                    }
                                >

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            flexWrap: "wrap",
                                        }}
                                    >

                                        <Chip
                                            label={
                                                `Seller ID: ${context.sellerId}`
                                            }
                                            size="small"
                                            variant="outlined"
                                        />


                                        <Chip
                                            label={
                                                `Customer ID: ${context.customerId}`
                                            }
                                            size="small"
                                            variant="outlined"
                                        />

                                    </Box>

                                </Grid>

                            )
                        )}

                    </Grid>

                </Paper>

            )}


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <CatalogToolbar

                selectedCount={
                    selectedIds.length
                }

                onAdd={() =>
                    navigate(
                        "/catalog/create"
                    )
                }

                onRefresh={
                    loadCatalogs
                }

                onFilter={() =>
                    console.log(
                        "Catalog Filter clicked"
                    )
                }

                onImport={() =>
                    console.log(
                        "Catalog Import clicked"
                    )
                }

                onExportExcel={() =>
                    console.log(
                        "Export Excel clicked"
                    )
                }

                onExportPDF={() =>
                    console.log(
                        "Export PDF clicked"
                    )
                }

                onPrint={() =>
                    window.print()
                }

                onPublish={() => {

                    console.log(
                        "Publish Selected:",
                        selectedIds
                    );

                }}

                onUnpublish={() => {

                    console.log(
                        "Unpublish Selected:",
                        selectedIds
                    );

                }}

                onDeleteSelected={() => {

                    console.log(
                        "Delete Selected:",
                        selectedIds
                    );

                }}

                onToggleView={() =>
                    console.log(
                        "Toggle View clicked"
                    )
                }

            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <CatalogStatistics
                catalogs={
                    catalogs
                }
            />


            {/* =================================================
                EMPTY
            ================================================= */}

            {!loading &&
                catalogs.length === 0 && (

                    <Box
                        sx={{
                            minHeight: 250,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            mt: 2,
                        }}
                    >

                        <Box
                            sx={{
                                textAlign: "center",
                            }}
                        >

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                            >
                                No Catalogs Found
                            </Typography>


                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mt: 1,
                                }}
                            >
                                No catalog products are currently available.
                            </Typography>

                        </Box>

                    </Box>

                )}


            {/* =================================================
                TABLE
            ================================================= */}

            {catalogs.length > 0 && (

                <CatalogTable

                    catalogs={
                        paginatedCatalogs
                    }

                    loading={
                        loading
                    }


                    // -----------------------------------------
                    // CONTEXT
                    // -----------------------------------------

                    sellerId={
                        null
                    }

                    customerId={
                        null
                    }


                    // -----------------------------------------
                    // SELECTION
                    // -----------------------------------------

                    selectedIds={
                        selectedIds
                    }

                    onSelectionChange={
                        handleSelectionChange
                    }


                    // -----------------------------------------
                    // PRODUCT ACTIONS
                    // -----------------------------------------

                    onView={
                        handleView
                    }

                    onEdit={
                        handleEdit
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
                        handleDelete
                    }


                    // -----------------------------------------
                    // PAGINATION
                    // -----------------------------------------

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
                        handlePageChange
                    }

                    onRowsPerPageChange={
                        handleRowsPerPageChange
                    }

                />

            )}

        </Box>

    );

};


// =========================================================
// EXPORT
// =========================================================

export default CatalogList;