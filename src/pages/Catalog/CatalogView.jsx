// =========================================================
// CatalogView.jsx
// Catalog Products View
//
// API:
// GET https://localhost:7203/api/catalog/products
//     ?sellerId=6
//     &customerId=3
//
// Frontend:
// http://localhost:5173/catalog/products
//     ?sellerId=6
//     &customerId=3
// =========================================================

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    Add,
    Category,
    CheckCircle,
    Delete,
    Edit,
    Inventory2,
    Refresh,
    Search,
    Visibility,
    Warning,
    Cancel,
} from "@mui/icons-material";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

// =========================================================
// CONFIG
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// HELPERS
// =========================================================

const getValue = (...values) => {
    for (const value of values) {
        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }
    }

    return null;
};


// =========================================================
// EXTRACT ARRAY FROM API RESPONSE
// =========================================================

const getArray = (data) => {

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.products)) {
        return data.products;
    }

    if (Array.isArray(data?.Products)) {
        return data.Products;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    if (Array.isArray(data?.items)) {
        return data.items;
    }

    if (Array.isArray(data?.$values)) {
        return data.$values;
    }

    if (
        Array.isArray(
            data?.data?.products
        )
    ) {
        return data.data.products;
    }

    if (
        Array.isArray(
            data?.data?.Products
        )
    ) {
        return data.data.Products;
    }

    if (
        Array.isArray(
            data?.data?.items
        )
    ) {
        return data.data.items;
    }

    return [];
};


// =========================================================
// COMPONENT
// =========================================================

const CatalogView = () => {

    const navigate = useNavigate();

    const [
        searchParams,
    ] = useSearchParams();


    // =====================================================
    // SELLER / CUSTOMER CONTEXT
    // =====================================================

    const sellerId =
        searchParams.get("sellerId");

    const customerId =
        searchParams.get("customerId");


    // =====================================================
    // STATE
    // =====================================================

    const [
        products,
        setProducts,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        statusFilter,
        setStatusFilter,
    ] = useState("all");

    const [
        categoryFilter,
        setCategoryFilter,
    ] = useState("all");

    const [
        page,
        setPage,
    ] = useState(0);

    const [
        rowsPerPage,
        setRowsPerPage,
    ] = useState(10);


    // =====================================================
    // GET PRODUCT ID
    // =====================================================

    const getProductId = useCallback(
        (product) => {

            return getValue(
                product?.productId,
                product?.ProductId,
                product?.id,
                product?.Id
            );

        },
        []
    );


    // =====================================================
    // GET SELLER ID
    // =====================================================

    const getSellerId = useCallback(
        (product) => {

            return getValue(
                product?.sellerId,
                product?.SellerId,
                sellerId
            );

        },
        [sellerId]
    );


    // =====================================================
    // GET CUSTOMER ID
    // =====================================================

    const getCustomerId = useCallback(
        (product) => {

            return getValue(
                product?.customerId,
                product?.CustomerId,
                customerId
            );

        },
        [customerId]
    );


    // =====================================================
    // GET PRODUCT NAME
    // =====================================================

    const getProductName = useCallback(
        (product) => {

            return (
                getValue(
                    product?.productName,
                    product?.ProductName,
                    product?.name,
                    product?.Name,
                    product?.product?.productName,
                    product?.product?.ProductName
                ) || "—"
            );

        },
        []
    );


    // =====================================================
    // GET SKU / PRODUCT CODE
    // =====================================================

    const getProductCode = useCallback(
        (product) => {

            return (
                getValue(
                    product?.sku,
                    product?.SKU,
                    product?.productCode,
                    product?.ProductCode,
                    product?.product?.sku,
                    product?.product?.SKU,
                    product?.product?.productCode,
                    product?.product?.ProductCode
                ) || "—"
            );

        },
        []
    );


    // =====================================================
    // GET BRAND
    // =====================================================

    const getBrandName = useCallback(
        (product) => {

            return (
                getValue(
                    product?.brandName,
                    product?.BrandName,
                    product?.brand?.brandName,
                    product?.brand?.BrandName,
                    product?.product?.brandName,
                    product?.product?.BrandName,
                    product?.product?.brand?.brandName,
                    product?.product?.brand?.BrandName
                ) || "—"
            );

        },
        []
    );


    // =====================================================
    // GET CATEGORY
    // =====================================================

    const getCategoryName = useCallback(
        (product) => {

            return (
                getValue(
                    product?.categoryName,
                    product?.CategoryName,
                    product?.category?.categoryName,
                    product?.category?.CategoryName,
                    product?.product?.categoryName,
                    product?.product?.CategoryName,
                    product?.product?.category?.categoryName,
                    product?.product?.category?.CategoryName
                ) || "—"
            );

        },
        []
    );


    // =====================================================
    // GET PRICE
    // =====================================================

    const getPrice = useCallback(
        (product) => {

            return getValue(
                product?.price,
                product?.Price,
                product?.sellingPrice,
                product?.SellingPrice,
                product?.sellingPriceAmount,
                product?.SellingPriceAmount,
                product?.productPrice,
                product?.ProductPrice,
                product?.product?.price,
                product?.product?.Price,
                product?.product?.sellingPrice,
                product?.product?.SellingPrice
            );

        },
        []
    );


    // =====================================================
    // GET STOCK
    // =====================================================

    const getStock = useCallback(
        (product) => {

            const value =
                getValue(
                    product?.stockQuantity,
                    product?.StockQuantity,
                    product?.stock,
                    product?.Stock,
                    product?.quantity,
                    product?.Quantity,
                    product?.productInventory?.quantity,
                    product?.productInventory?.Quantity,
                    product?.inventory?.quantity,
                    product?.inventory?.Quantity,
                    product?.product?.stockQuantity,
                    product?.product?.StockQuantity
                );

            const number =
                Number(value ?? 0);

            return Number.isNaN(number)
                ? 0
                : number;

        },
        []
    );


    // =====================================================
    // GET STATUS
    // =====================================================

    const getStatus = useCallback(
        (product) => {

            const status =
                getValue(
                    product?.status,
                    product?.Status,
                    product?.catalogStatus,
                    product?.CatalogStatus
                );

            if (status) {
                return String(status);
            }

            const isActive =
                getValue(
                    product?.isActive,
                    product?.IsActive
                );

            if (isActive === true) {
                return "Active";
            }

            if (isActive === false) {
                return "Inactive";
            }

            const isAvailable =
                getValue(
                    product?.isAvailable,
                    product?.IsAvailable
                );

            if (isAvailable === true) {
                return "Available";
            }

            if (isAvailable === false) {
                return "Unavailable";
            }

            return "Unknown";

        },
        []
    );


    // =====================================================
    // LOAD PRODUCTS
    // =====================================================

    const loadProducts = useCallback(
        async () => {

            // -------------------------------------------------
            // SELLER ID REQUIRED
            // -------------------------------------------------

            if (!sellerId) {

                setError(
                    "Seller ID is missing from the URL."
                );

                setProducts([]);

                return;
            }


            // -------------------------------------------------
            // CUSTOMER ID REQUIRED
            // -------------------------------------------------

            if (!customerId) {

                setError(
                    "Customer ID is missing from the URL."
                );

                setProducts([]);

                return;
            }


            try {

                setLoading(true);

                setError("");


                // =============================================
                // BUILD API QUERY
                // =============================================

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


                // =============================================
                // API URL
                // =============================================

                const url =
                    `${SERVER_URL}/api/catalog/products?${params.toString()}`;


                // =============================================
                // DEBUG
                // =============================================

                console.log(
                    "========================================"
                );

                console.log(
                    "CATALOG PRODUCTS API"
                );

                console.log(
                    "Seller ID:",
                    sellerId
                );

                console.log(
                    "Customer ID:",
                    customerId
                );

                console.log(
                    "GET:",
                    url
                );


                // =============================================
                // REQUEST
                // =============================================

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
                    "HTTP STATUS:",
                    response.status
                );


                // =============================================
                // ERROR
                // =============================================

                if (!response.ok) {

                    let message =
                        `Unable to load catalog. HTTP ${response.status}`;

                    try {

                        const errorData =
                            await response.json();

                        message =
                            errorData?.message ??
                            errorData?.Message ??
                            errorData?.title ??
                            errorData?.Title ??
                            errorData?.error ??
                            errorData?.Error ??
                            message;

                    }
                    catch {
                        // Ignore invalid JSON
                    }

                    throw new Error(
                        message
                    );
                }


                // =============================================
                // JSON
                // =============================================

                const data =
                    await response.json();


                console.log(
                    "CATALOG API RESPONSE:",
                    data
                );


                // =============================================
                // EXTRACT PRODUCTS
                // =============================================

                const extractedProducts =
                    getArray(data);


                console.log(
                    "EXTRACTED PRODUCTS:",
                    extractedProducts
                );


                // =============================================
                // FORCE SELLER / CUSTOMER CONTEXT
                // =============================================

                const normalizedProducts =
                    extractedProducts.map(
                        (product) => {

                            return {
                                ...product,

                                sellerId:
                                    getValue(
                                        product?.sellerId,
                                        product?.SellerId,
                                        sellerId
                                    ),

                                customerId:
                                    getValue(
                                        product?.customerId,
                                        product?.CustomerId,
                                        customerId
                                    ),
                            };

                        }
                    );


                setProducts(
                    normalizedProducts
                );

                setPage(0);

            }
            catch (err) {

                console.error(
                    "Catalog API error:",
                    err
                );

                setError(
                    err?.message ||
                    "Unable to load catalog products."
                );

                setProducts([]);

            }
            finally {

                setLoading(false);

            }

        },
        [
            sellerId,
            customerId,
        ]
    );


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(
        () => {

            loadProducts();

        },
        [
            loadProducts,
        ]
    );


    // =====================================================
    // CATEGORIES
    // =====================================================

    const categories =
        useMemo(
            () => {

                const values =
                    products
                        .map(
                            (product) =>
                                getCategoryName(
                                    product
                                )
                        )
                        .filter(
                            (value) =>
                                value &&
                                value !== "—"
                        );

                return [
                    ...new Set(values),
                ];

            },
            [
                products,
                getCategoryName,
            ]
        );


    // =====================================================
    // FILTER PRODUCTS
    // =====================================================

    const filteredProducts =
        useMemo(
            () => {

                const searchText =
                    search
                        .trim()
                        .toLowerCase();


                return products.filter(
                    (product) => {

                        const productId =
                            getProductId(
                                product
                            );

                        const productName =
                            getProductName(
                                product
                            );

                        const productCode =
                            getProductCode(
                                product
                            );

                        const brandName =
                            getBrandName(
                                product
                            );

                        const categoryName =
                            getCategoryName(
                                product
                            );


                        const matchesSearch =
                            !searchText ||
                            String(
                                productId ?? ""
                            )
                                .toLowerCase()
                                .includes(
                                    searchText
                                ) ||

                            productName
                                .toLowerCase()
                                .includes(
                                    searchText
                                ) ||

                            productCode
                                .toLowerCase()
                                .includes(
                                    searchText
                                ) ||

                            brandName
                                .toLowerCase()
                                .includes(
                                    searchText
                                );


                        const status =
                            getStatus(
                                product
                            );


                        const matchesStatus =
                            statusFilter === "all" ||
                            status.toLowerCase() ===
                                statusFilter.toLowerCase();


                        const matchesCategory =
                            categoryFilter === "all" ||
                            categoryName ===
                                categoryFilter;


                        return (
                            matchesSearch &&
                            matchesStatus &&
                            matchesCategory
                        );

                    }
                );

            },
            [
                products,
                search,
                statusFilter,
                categoryFilter,
                getProductId,
                getProductName,
                getProductCode,
                getBrandName,
                getCategoryName,
                getStatus,
            ]
        );


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalProducts =
        products.length;


    const activeProducts =
        products.filter(
            (product) =>
                getStatus(product)
                    .toLowerCase() ===
                "active"
        ).length;


    const inactiveProducts =
        products.filter(
            (product) =>
                getStatus(product)
                    .toLowerCase() ===
                "inactive"
        ).length;


    const lowStockProducts =
        products.filter(
            (product) => {

                const stock =
                    getStock(product);

                return (
                    stock > 0 &&
                    stock <= 10
                );

            }
        ).length;


    const outOfStockProducts =
        products.filter(
            (product) =>
                getStock(product) <= 0
        ).length;


    // =====================================================
    // PAGINATION
    // =====================================================

    const paginatedProducts =
        filteredProducts.slice(
            page * rowsPerPage,
            page * rowsPerPage +
                rowsPerPage
        );


    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handleChangePage =
        (event, newPage) => {

            setPage(newPage);

        };


    // =====================================================
    // ROWS PER PAGE
    // =====================================================

    const handleChangeRowsPerPage =
        (event) => {

            setRowsPerPage(
                parseInt(
                    event.target.value,
                    10
                )
            );

            setPage(0);

        };


    // =====================================================
    // VIEW PRODUCT
    // =====================================================

    const handleView =
        (product) => {

            const productId =
                getProductId(
                    product
                );

            const currentSellerId =
                getSellerId(
                    product
                );

            const currentCustomerId =
                getCustomerId(
                    product
                );


            console.log(
                "VIEW PRODUCT:",
                {
                    productId,
                    sellerId:
                        currentSellerId,
                    customerId:
                        currentCustomerId,
                }
            );


            if (!productId) {

                setError(
                    "Product ID is missing from the selected catalog record."
                );

                return;

            }


            if (!currentSellerId) {

                setError(
                    "Seller ID is missing."
                );

                return;

            }


            if (!currentCustomerId) {

                setError(
                    "Customer ID is missing."
                );

                return;

            }


            const params =
                new URLSearchParams();

            params.set(
                "sellerId",
                currentSellerId
            );

            params.set(
                "customerId",
                currentCustomerId
            );


            const frontendUrl =
                `/catalog/${encodeURIComponent(
                    productId
                )}?${params.toString()}`;


            console.log(
                "Navigating to:",
                frontendUrl
            );


            navigate(
                frontendUrl
            );

        };


    // =====================================================
    // EDIT PRODUCT
    // =====================================================

    const handleEdit =
        (product) => {

            const productId =
                getProductId(
                    product
                );

            if (!productId) {

                setError(
                    "Product ID is missing."
                );

                return;

            }


            const currentSellerId =
                getSellerId(
                    product
                );

            const currentCustomerId =
                getCustomerId(
                    product
                );


            const params =
                new URLSearchParams();

            params.set(
                "sellerId",
                currentSellerId
            );

            params.set(
                "customerId",
                currentCustomerId
            );


            navigate(
                `/catalog/${encodeURIComponent(
                    productId
                )}/edit?${params.toString()}`
            );

        };


    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    const handleDelete =
        async (product) => {

            const productId =
                getProductId(
                    product
                );

            if (!productId) {

                setError(
                    "Product ID is missing."
                );

                return;

            }


            const confirmed =
                window.confirm(
                    `Are you sure you want to delete product ${productId}?`
                );


            if (!confirmed) {
                return;
            }


            try {

                setError("");


                const params =
                    new URLSearchParams();

                params.set(
                    "sellerId",
                    getSellerId(product)
                );

                params.set(
                    "customerId",
                    getCustomerId(product)
                );


                const url =
                    `${SERVER_URL}/api/catalog/${encodeURIComponent(
                        productId
                    )}?${params.toString()}`;


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

                    let message =
                        `Delete failed. HTTP ${response.status}`;

                    try {

                        const data =
                            await response.json();

                        message =
                            data?.message ??
                            data?.title ??
                            data?.error ??
                            message;

                    }
                    catch {
                        // Ignore
                    }

                    throw new Error(
                        message
                    );

                }


                setProducts(
                    (previous) =>
                        previous.filter(
                            (item) =>
                                getProductId(
                                    item
                                ) !==
                                productId
                        )
                );


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

        };


    // =====================================================
    // ADD PRODUCT
    // =====================================================

    const handleAddProduct =
        () => {

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
                `/products/create?${params.toString()}`
            );

        };


    // =====================================================
    // FORMAT PRICE
    // =====================================================

    const formatPrice =
        (value) => {

            if (
                value === undefined ||
                value === null ||
                value === ""
            ) {
                return "—";
            }


            const number =
                Number(value);


            if (
                Number.isNaN(number)
            ) {
                return String(value);
            }


            return `₹${number.toLocaleString(
                "en-IN",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }
            )}`;

        };


    // =====================================================
    // STATUS CHIP
    // =====================================================

    const renderStatus =
        (status) => {

            const normalized =
                String(status)
                    .toLowerCase();


            if (
                normalized ===
                "active"
            ) {

                return (
                    <Chip
                        icon={
                            <CheckCircle />
                        }
                        label="Active"
                        color="success"
                        size="small"
                    />
                );

            }


            if (
                normalized ===
                "inactive"
            ) {

                return (
                    <Chip
                        icon={
                            <Cancel />
                        }
                        label="Inactive"
                        size="small"
                    />
                    );

            }


            return (
                <Chip
                    label={status}
                    size="small"
                />
            );

        };


    // =====================================================
    // STOCK CHIP
    // =====================================================

    const renderStock =
        (stock) => {

            if (stock <= 0) {

                return (
                    <Chip
                        label="Out of Stock"
                        color="error"
                        size="small"
                    />
                );

            }


            if (stock <= 10) {

                return (
                    <Chip
                        icon={
                            <Warning />
                        }
                        label={`Low (${stock})`}
                        color="warning"
                        size="small"
                    />
                );

            }


            return (
                <Chip
                    label={stock}
                    color="success"
                    size="small"
                />
            );

        };


    // =====================================================
    // INVALID CONTEXT
    // =====================================================

    if (
        !sellerId ||
        !customerId
    ) {

        return (

            <Box
                sx={{
                    p: 3,
                }}
            >

                <Alert
                    severity="error"
                >
                    {!sellerId
                        ? "Seller ID is missing from the URL."
                        : "Customer ID is missing from the URL."}
                </Alert>

            </Box>

        );

    }


    // =====================================================
    // RENDER
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
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: {
                        xs: "flex-start",
                        md: "center",
                    },
                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Catalog Products
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.5,
                        }}
                    >
                        Products for Seller{" "}
                        <strong>
                            {sellerId}
                        </strong>{" "}
                        and Customer{" "}
                        <strong>
                            {customerId}
                        </strong>
                    </Typography>

                </Box>


                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                    }}
                >

                    <Tooltip
                        title="Refresh Catalog"
                    >

                        <IconButton
                            onClick={
                                loadProducts
                            }
                            disabled={
                                loading
                            }
                        >
                            <Refresh />
                        </IconButton>

                    </Tooltip>


                    <Button
                        variant="contained"
                        startIcon={
                            <Add />
                        }
                        onClick={
                            handleAddProduct
                        }
                    >
                        Add Product
                    </Button>

                </Box>

            </Box>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                    }}
                    onClose={() =>
                        setError("")
                    }
                >
                    {error}
                </Alert>

            )}


            {/* =================================================
                CONTEXT
            ================================================= */}

            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                }}
            >

                <Grid
                    container
                    spacing={2}
                >

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Seller ID
                        </Typography>

                        <Typography
                            fontWeight="bold"
                        >
                            {sellerId}
                        </Typography>

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Customer ID
                        </Typography>

                        <Typography
                            fontWeight="bold"
                        >
                            {customerId}
                        </Typography>

                    </Grid>

                </Grid>

            </Paper>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <Grid
                container
                spacing={2}
                sx={{
                    mb: 3,
                }}
            >

                {/* TOTAL */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <Paper
                        sx={{
                            p: 2.5,
                            borderRadius: 2,
                        }}
                    >

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Total Products
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{
                                mt: 1,
                            }}
                        >
                            {totalProducts}
                        </Typography>

                    </Paper>

                </Grid>


                {/* ACTIVE */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <Paper
                        sx={{
                            p: 2.5,
                            borderRadius: 2,
                        }}
                    >

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Active Products
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{
                                mt: 1,
                            }}
                        >
                            {activeProducts}
                        </Typography>

                    </Paper>

                </Grid>


                {/* LOW STOCK */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <Paper
                        sx={{
                            p: 2.5,
                            borderRadius: 2,
                        }}
                    >

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Low Stock
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{
                                mt: 1,
                            }}
                        >
                            {lowStockProducts}
                        </Typography>

                    </Paper>

                </Grid>


                {/* OUT OF STOCK */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <Paper
                        sx={{
                            p: 2.5,
                            borderRadius: 2,
                        }}
                    >

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Out of Stock
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{
                                mt: 1,
                            }}
                        >
                            {outOfStockProducts}
                        </Typography>

                    </Paper>

                </Grid>

            </Grid>


            {/* =================================================
                FILTERS
            ================================================= */}

            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                }}
            >

                <Grid
                    container
                    spacing={2}
                >

                    {/* SEARCH */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Search Products"
                            placeholder="Search by product, code, brand or ID..."
                            value={
                                search
                            }
                            onChange={(event) => {

                                setSearch(
                                    event.target.value
                                );

                                setPage(0);

                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment
                                        position="start"
                                    >
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />

                    </Grid>


                    {/* STATUS */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <TextField
                            fullWidth
                            select
                            label="Status"
                            value={
                                statusFilter
                            }
                            onChange={(event) => {

                                setStatusFilter(
                                    event.target.value
                                );

                                setPage(0);

                            }}
                        >

                            <MenuItem value="all">
                                All Statuses
                            </MenuItem>

                            <MenuItem value="active">
                                Active
                            </MenuItem>

                            <MenuItem value="inactive">
                                Inactive
                            </MenuItem>

                        </TextField>

                    </Grid>


                    {/* CATEGORY */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <TextField
                            fullWidth
                            select
                            label="Category"
                            value={
                                categoryFilter
                            }
                            onChange={(event) => {

                                setCategoryFilter(
                                    event.target.value
                                );

                                setPage(0);

                            }}
                        >

                            <MenuItem value="all">
                                All Categories
                            </MenuItem>

                            {categories.map(
                                (
                                    category
                                ) => (

                                    <MenuItem
                                        key={
                                            category
                                        }
                                        value={
                                            category
                                        }
                                    >
                                        {category}
                                    </MenuItem>

                                )
                            )}

                        </TextField>

                    </Grid>

                </Grid>

            </Paper>


            {/* =================================================
                TABLE
            ================================================= */}

            <Paper
                sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            >

                <Box
                    sx={{
                        p: 2,
                        display: "flex",
                        alignItems:
                            "center",
                        gap: 1,
                    }}
                >

                    <Category />

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Product Catalog
                    </Typography>

                    <Chip
                        label={
                            filteredProducts.length
                        }
                        size="small"
                    />

                </Box>


                <TableContainer
                    sx={{
                        overflowX:
                            "auto",
                    }}
                >

                    <Table
                        stickyHeader
                        size="small"
                        sx={{
                            minWidth: 1200,
                        }}
                    >

                        <TableHead>

                            <TableRow>

                                <TableCell>
                                    <strong>
                                        Product ID
                                    </strong>
                                </TableCell>

                                <TableCell>
                                    <strong>
                                        Seller ID
                                    </strong>
                                </TableCell>

                                <TableCell>
                                    <strong>
                                        Customer ID
                                    </strong>
                                </TableCell>

                                <TableCell>
                                    <strong>
                                        Product
                                    </strong>
                                </TableCell>

                                <TableCell>
                                    <strong>
                                        SKU
                                    </strong>
                                </TableCell>

                                <TableCell>
                                    <strong>
                                        Brand
                                    </strong>
                                </TableCell>

                                <TableCell>
                                    <strong>
                                        Category
                                    </strong>
                                </TableCell>

                                <TableCell align="right">
                                    <strong>
                                        Price
                                    </strong>
                                </TableCell>

                                <TableCell align="center">
                                    <strong>
                                        Stock
                                    </strong>
                                </TableCell>

                                <TableCell align="center">
                                    <strong>
                                        Status
                                    </strong>
                                </TableCell>

                                <TableCell align="center">
                                    <strong>
                                        Actions
                                    </strong>
                                </TableCell>

                            </TableRow>

                        </TableHead>


                        <TableBody>

                            {loading ? (

                                <TableRow>

                                    <TableCell
                                        colSpan={11}
                                        align="center"
                                        sx={{
                                            py: 7,
                                        }}
                                    >

                                        <CircularProgress />

                                        <Typography
                                            sx={{
                                                mt: 2,
                                            }}
                                            color="text.secondary"
                                        >
                                            Loading catalog products...
                                        </Typography>

                                    </TableCell>

                                </TableRow>

                            ) : paginatedProducts.length === 0 ? (

                                <TableRow>

                                    <TableCell
                                        colSpan={11}
                                        align="center"
                                        sx={{
                                            py: 7,
                                        }}
                                    >

                                        <Inventory2
                                            sx={{
                                                fontSize: 50,
                                                opacity: 0.4,
                                                mb: 1,
                                            }}
                                        />

                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                        >
                                            No Products Found
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            No catalog products match your current filters.
                                        </Typography>

                                    </TableCell>

                                </TableRow>

                            ) : (

                                paginatedProducts.map(
                                    (
                                        product,
                                        index
                                    ) => {

                                        const productId =
                                            getProductId(
                                                product
                                            );

                                        const currentSellerId =
                                            getSellerId(
                                                product
                                            );

                                        const currentCustomerId =
                                            getCustomerId(
                                                product
                                            );

                                        const productName =
                                            getProductName(
                                                product
                                            );

                                        const productCode =
                                            getProductCode(
                                                product
                                            );

                                        const brandName =
                                            getBrandName(
                                                product
                                            );

                                        const categoryName =
                                            getCategoryName(
                                                product
                                            );

                                        const price =
                                            getPrice(
                                                product
                                            );

                                        const stock =
                                            getStock(
                                                product
                                            );

                                        const status =
                                            getStatus(
                                                product
                                            );


                                        return (

                                            <TableRow
                                                key={
                                                    productId ??
                                                    index
                                                }
                                                hover
                                            >

                                                {/* PRODUCT ID */}

                                                <TableCell>

                                                    <Chip
                                                        label={
                                                            productId ??
                                                            "—"
                                                        }
                                                        size="small"
                                                        variant="outlined"
                                                    />

                                                </TableCell>


                                                {/* SELLER */}

                                                <TableCell>

                                                    <Chip
                                                        label={
                                                            currentSellerId ??
                                                            "—"
                                                        }
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />

                                                </TableCell>


                                                {/* CUSTOMER */}

                                                <TableCell>

                                                    <Chip
                                                        label={
                                                            currentCustomerId ??
                                                            "—"
                                                        }
                                                        size="small"
                                                        color="secondary"
                                                        variant="outlined"
                                                    />

                                                </TableCell>


                                                {/* PRODUCT */}

                                                <TableCell>

                                                    <Box
                                                        sx={{
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 1.5,
                                                            minWidth: 240,
                                                        }}
                                                    >

                                                        <Avatar
                                                            variant="rounded"
                                                            sx={{
                                                                width: 42,
                                                                height: 42,
                                                            }}
                                                            src={
                                                                getValue(
                                                                    product?.imageUrl,
                                                                    product?.ImageUrl,
                                                                    product?.image,
                                                                    product?.Image,
                                                                    product?.product?.imageUrl,
                                                                    product?.product?.ImageUrl
                                                                ) || ""
                                                            }
                                                        >
                                                            <Inventory2 />
                                                        </Avatar>


                                                        <Typography
                                                            variant="body2"
                                                            fontWeight="600"
                                                        >
                                                            {
                                                                productName
                                                            }
                                                        </Typography>

                                                    </Box>

                                                </TableCell>


                                                {/* SKU */}

                                                <TableCell>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {
                                                            productCode
                                                        }
                                                    </Typography>

                                                </TableCell>


                                                {/* BRAND */}

                                                <TableCell>
                                                    {
                                                        brandName
                                                    }
                                                </TableCell>


                                                {/* CATEGORY */}

                                                <TableCell>

                                                    <Typography
                                                        variant="body2"
                                                    >
                                                        {
                                                            categoryName
                                                        }
                                                    </Typography>

                                                </TableCell>


                                                {/* PRICE */}

                                                <TableCell
                                                    align="right"
                                                >

                                                    {
                                                        formatPrice(
                                                            price
                                                        )
                                                    }

                                                </TableCell>


                                                {/* STOCK */}

                                                <TableCell
                                                    align="center"
                                                >

                                                    {
                                                        renderStock(
                                                            stock
                                                        )
                                                    }

                                                </TableCell>


                                                {/* STATUS */}

                                                <TableCell
                                                    align="center"
                                                >

                                                    {
                                                        renderStatus(
                                                            status
                                                        )
                                                    }

                                                </TableCell>


                                                {/* ACTIONS */}

                                                <TableCell
                                                    align="center"
                                                >

                                                    <Box
                                                        sx={{
                                                            display:
                                                                "flex",
                                                            justifyContent:
                                                                "center",
                                                            gap: 0.5,
                                                        }}
                                                    >

                                                        {/* VIEW */}

                                                        <Tooltip
                                                            title="View Product"
                                                        >

                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() =>
                                                                    handleView(
                                                                        product
                                                                    )
                                                                }
                                                            >

                                                                <Visibility
                                                                    fontSize="small"
                                                                />

                                                            </IconButton>

                                                        </Tooltip>


                                                        {/* EDIT */}

                                                        <Tooltip
                                                            title="Edit Product"
                                                        >

                                                            <IconButton
                                                                size="small"
                                                                color="warning"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        product
                                                                    )
                                                                }
                                                            >

                                                                <Edit
                                                                    fontSize="small"
                                                                />

                                                            </IconButton>

                                                        </Tooltip>


                                                        {/* DELETE */}

                                                        <Tooltip
                                                            title="Delete Product"
                                                        >

                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        product
                                                                    )
                                                                }
                                                            >

                                                                <Delete
                                                                    fontSize="small"
                                                                />

                                                            </IconButton>

                                                        </Tooltip>

                                                    </Box>

                                                </TableCell>

                                            </TableRow>

                                        );

                                    }
                                )

                            )}

                        </TableBody>

                    </Table>

                </TableContainer>


                {/* =================================================
                    PAGINATION
                ================================================= */}

                <TablePagination
                    component="div"
                    count={
                        filteredProducts.length
                    }
                    page={page}
                    onPageChange={
                        handleChangePage
                    }
                    rowsPerPage={
                        rowsPerPage
                    }
                    onRowsPerPageChange={
                        handleChangeRowsPerPage
                    }
                    rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        50,
                    ]}
                />

            </Paper>

        </Box>
    );
};


export default CatalogView;
