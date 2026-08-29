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
        // KEEP ORIGINAL API OBJECT
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


                // =================================================
                // RESPONSE
                // =================================================

                const data =
                    await response.json();


                console.log(
                    "Catalog RAW Response:",
                    data
                );


                // =================================================
                // EXTRACT ARRAY
                // =================================================

                const catalogData =
                    extractCatalogData(data);


                console.log(
                    "Catalogs Extracted:",
                    catalogData
                );


                console.log(
                    "Catalog Count:",
                    catalogData.length
                );


                // =================================================
                // NORMALIZE ALL RECORDS
                // =================================================

                const mappedCatalogs =
                    catalogData.map(
                        normalizeCatalog
                    );


                console.log(
                    "========================================"
                );

                console.log(
                    "MAPPED CATALOG DATA"
                );

                console.log(
                    "========================================"
                );


                mappedCatalogs.forEach(
                    (catalog) => {

                        console.log(
                            {
                                productId:
                                    catalog.productId,

                                sellerId:
                                    catalog.sellerId,

                                customerId:
                                    catalog.customerId,

                                productName:
                                    catalog.productName,

                                sku:
                                    catalog.sku,

                                brandName:
                                    catalog.brandName,

                                categoryName:
                                    catalog.categoryName,

                                productType:
                                    catalog.productType,

                                price:
                                    catalog.price,

                                offerPrice:
                                    catalog.offerPrice,

                                stockQuantity:
                                    catalog.stockQuantity,

                                isAvailable:
                                    catalog.isAvailable,

                                rating:
                                    catalog.rating,

                                reviewCount:
                                    catalog.reviewCount,

                                primaryImage:
                                    catalog.primaryImage,
                            }
                        );

                    }
                );


                setCatalogs(
                    mappedCatalogs
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
    // VIEW
    // =====================================================

    const handleView = (
        catalog
    ) => {

        const productId =
            getProductId(catalog);

        const sellerId =
            getSellerId(catalog);

        const customerId =
            getCustomerId(catalog);


        console.log(
            "VIEW CATALOG CONTEXT:",
            {
                productId,
                sellerId,
                customerId,
            }
        );


        if (!productId) {

            setError(
                "Product ID is missing."
            );

            return;

        }


        if (!sellerId) {

            setError(
                "Seller ID is missing."
            );

            return;

        }


        if (!customerId) {

            setError(
                "Customer ID is missing."
            );

            return;

        }


        const params =
            new URLSearchParams();


        params.set(
            "sellerId",
            sellerId
        );


        params.set(
            "customerId",
            customerId
        );


        navigate(
            `/catalog/products?${params.toString()}`
        );

    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (
        catalog
    ) => {

        const productId =
            getProductId(catalog);

        const sellerId =
            getSellerId(catalog);

        const customerId =
            getCustomerId(catalog);


        if (!productId) {

            setError(
                "Product ID is missing."
            );

            return;

        }


        if (!sellerId) {

            setError(
                "Seller ID is missing."
            );

            return;

        }


        if (!customerId) {

            setError(
                "Customer ID is missing."
            );

            return;

        }


        const params =
            new URLSearchParams();


        params.set(
            "sellerId",
            sellerId
        );


        params.set(
            "customerId",
            customerId
        );


        navigate(
            `/catalog/${productId}/edit?${params.toString()}`
        );

    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (
        catalog
    ) => {

        const productId =
            getProductId(catalog);

        const sellerId =
            getSellerId(catalog);

        const customerId =
            getCustomerId(catalog);

        const productName =
            getProductName(catalog);


        console.log(
            "DELETE CATALOG CONTEXT:",
            {
                productId,
                sellerId,
                customerId,
            }
        );


        if (!productId) {

            setError(
                "Product ID is missing."
            );

            return;

        }


        if (!sellerId) {

            setError(
                "Seller ID is missing."
            );

            return;

        }


        if (!customerId) {

            setError(
                "Customer ID is missing."
            );

            return;

        }


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


            const params =
                new URLSearchParams();


            params.set(
                "sellerId",
                sellerId
            );


            params.set(
                "customerId",
                customerId
            );


            const url =
                `${API_URL}/${productId}?${params.toString()}`;


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


            console.log(
                "Delete HTTP Status:",
                response.status
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

                    console.error(
                        "Delete API returned non-JSON response."
                    );

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

    };


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
                        getSellerId(catalog);

                    const customerId =
                        getCustomerId(catalog);


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
    // LOADING
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
                        Catalog Seller / Customer
                        Context
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
                onRefresh={
                    loadCatalogs
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
                                No catalog products are
                                currently available.
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
                    // PRODUCT ACTIONS
                    // -----------------------------------------

                    onView={
                        handleView
                    }

                    onEdit={
                        handleEdit
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
