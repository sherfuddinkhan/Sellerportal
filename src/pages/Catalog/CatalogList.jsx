import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    Grid,
    Paper,
    Typography
} from "@mui/material";

import axios from "axios";

import { useNavigate } from "react-router-dom";

// ================================================================
// COMPONENTS
// ================================================================

import CatalogToolbar from "./CatalogToolbar";
import CatalogSearch from "./CatalogSearch";
import CatalogStatistics from "./CatalogStatistics";
import CatalogTable from "./CatalogTable";

// ================================================================
// SERVER
// ================================================================

const SERVER_URL = "http://localhost:5000";

const API_URL = `${SERVER_URL}/api/catalog`;

// ================================================================
// EXTRACT CATALOG DATA
// ================================================================

const extractCatalogData = (response) => {

    if (!response) {
        return [];
    }

    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response.data)) {
        return response.data;
    }

    if (Array.isArray(response.products)) {
        return response.products;
    }

    if (Array.isArray(response.catalogs)) {
        return response.catalogs;
    }

    if (Array.isArray(response.items)) {
        return response.items;
    }

    if (Array.isArray(response.result)) {
        return response.result;
    }

    if (
        response.data &&
        Array.isArray(response.data.products)
    ) {
        return response.data.products;
    }

    if (
        response.data &&
        Array.isArray(response.data.items)
    ) {
        return response.data.items;
    }

    if (response.$values && Array.isArray(response.$values)) {
        return response.$values;
    }

    return [];

};

// ================================================================
// GET PRODUCT ID
// ================================================================

const getProductId = (product) =>
    Number(
        product?.productId ??
        product?.ProductId ??
        product?.id ??
        product?.Id ??
        0
    );

// ================================================================
// GET SELLER ID
// ================================================================

const getSellerId = (product) =>
    Number(
        product?.sellerId ??
        product?.SellerId ??
        0
    );

// ================================================================
// GET CUSTOMER ID
// ================================================================

const getCustomerId = (product) =>
    Number(
        product?.customerId ??
        product?.CustomerId ??
        0
    );

// ================================================================
// GET PRODUCT NAME
// ================================================================

const getProductName = (product) =>
    product?.productName ??
    product?.ProductName ??
    product?.name ??
    product?.Name ??
    "";

// ================================================================
// GET SKU
// ================================================================

const getSku = (product) =>
    product?.sku ??
    product?.SKU ??
    product?.Sku ??
    "";

// ================================================================
// GET BRAND
// ================================================================

const getBrandName = (product) =>
    product?.brandName ??
    product?.BrandName ??
    product?.brand?.brandName ??
    product?.brand?.name ??
    "";

// ================================================================
// GET CATEGORY
// ================================================================

const getCategoryName = (product) =>
    product?.categoryName ??
    product?.CategoryName ??
    product?.category?.categoryName ??
    product?.category?.name ??
    "";

// ================================================================
// GET PRODUCT TYPE
// ================================================================

const getProductType = (product) =>
    product?.productTypeName ??
    product?.ProductTypeName ??
    product?.productType?.productTypeName ??
    product?.productType?.name ??
    "";

// ================================================================
// GET PRICE
// ================================================================

const getPrice = (product) =>
    Number(
        product?.price ??
        product?.Price ??
        0
    );

// ================================================================
// GET OFFER PRICE
// ================================================================

const getOfferPrice = (product) =>
    Number(
        product?.offerPrice ??
        product?.OfferPrice ??
        0
    );

// ================================================================
// GET STOCK
// ================================================================

const getStockQuantity = (product) =>
    Number(
        product?.stockQuantity ??
        product?.StockQuantity ??
        product?.stock ??
        product?.Stock ??
        0
    );

// ================================================================
// GET AVAILABLE
// ================================================================

const getIsAvailable = (product) => {

    if (
        product?.isAvailable !== undefined
    ) {
        return Boolean(product.isAvailable);
    }

    if (
        product?.IsAvailable !== undefined
    ) {
        return Boolean(product.IsAvailable);
    }

    return true;

};

// ================================================================
// GET RATING
// ================================================================

const getRating = (product) =>
    Number(
        product?.rating ??
        product?.Rating ??
        0
    );

// ================================================================
// GET REVIEW COUNT
// ================================================================

const getReviewCount = (product) =>
    Number(
        product?.reviewCount ??
        product?.ReviewCount ??
        0
    );

// ================================================================
// GET PRIMARY IMAGE
// ================================================================

const getPrimaryImage = (product) =>
    product?.primaryImage ??
    product?.PrimaryImage ??
    product?.imageUrl ??
    product?.ImageUrl ??
    "";

// ================================================================
// NORMALIZE CATALOG
// ================================================================

const normalizeCatalog = (product) => {

    return {

        ...product,

        productId: getProductId(product),

        sellerId: getSellerId(product),

        customerId: getCustomerId(product),

        productName: getProductName(product),

        sku: getSku(product),

        brandName: getBrandName(product),

        categoryName: getCategoryName(product),

        productTypeName: getProductType(product),

        price: getPrice(product),

        offerPrice: getOfferPrice(product),

        stockQuantity: getStockQuantity(product),

        isAvailable: getIsAvailable(product),

        rating: getRating(product),

        reviewCount: getReviewCount(product),

        primaryImage: getPrimaryImage(product)

    };

};

// ================================================================
// COMPONENT
// ================================================================

const CatalogList = () => {

    const navigate = useNavigate();

    // ============================================================
    // STATE
    // ============================================================

    const [catalogs, setCatalogs] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchLoading, setSearchLoading] = useState(false);

    const [error, setError] = useState("");

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [selectedIds, setSelectedIds] = useState([]);

    const [selectedContext, setSelectedContext] = useState(null);

    // ============================================================
    // LOAD ALL CATALOG PRODUCTS
    // ============================================================

    const loadCatalogs = useCallback(async () => {

        try {

            setLoading(true);

            setError("");

            // ----------------------------------------------------
            // GET ALL
            // ----------------------------------------------------

            const response = await axios.get(
                `${API_URL}/products/all`,
                {
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            // ----------------------------------------------------
            // EXTRACT DATA
            // ----------------------------------------------------

            const rawData = extractCatalogData(
                response.data
            );

            // ----------------------------------------------------
            // NORMALIZE
            // ----------------------------------------------------

            const normalizedData =
                rawData.map(normalizeCatalog);

            setCatalogs(normalizedData);

            // ----------------------------------------------------
            // SET FIRST VALID CONTEXT
            // ----------------------------------------------------

            const firstProduct =
                normalizedData.find(
                    (product) =>
                        product.sellerId > 0 &&
                        product.customerId > 0
                );

            if (firstProduct) {

                setSelectedContext({
                    sellerId: firstProduct.sellerId,
                    customerId: firstProduct.customerId
                });

            }

            // ----------------------------------------------------
            // RESET PAGINATION
            // ----------------------------------------------------

            setPage(0);

            setSelectedIds([]);

        }
        catch (err) {

            console.error(
                "LOAD CATALOG ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data ||
                err?.message ||
                "Failed to load catalog products."
            );

            setCatalogs([]);

        }
        finally {

            setLoading(false);

        }

    }, []);

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {

        loadCatalogs();

    }, [loadCatalogs]);

    // ============================================================
    // BUILD QUERY
    // ============================================================

    const buildQuery = (
        sellerId,
        customerId
    ) => {

        return {
            sellerId: Number(sellerId),
            customerId: Number(customerId)
        };

    };


    const handleSearch = async (searchText) => {

        // --------------------------------------------------------
        // VALIDATE SEARCH
        // --------------------------------------------------------

        const search = searchText?.trim();

        if (!search) {

            return;

        }

        // --------------------------------------------------------
        // VALIDATE SELLER / CUSTOMER
        // --------------------------------------------------------

        if (
            !selectedContext?.sellerId ||
            !selectedContext?.customerId
        ) {

            setError(
                "Seller and customer are required for catalog search."
            );

            return;

        }

        try {

            setSearchLoading(true);

            setError("");

            // ----------------------------------------------------
            // POST SEARCH TO NODE
            // ----------------------------------------------------

            const response = await axios.post(
                `${API_URL}/search`,
                {
                    search: search
                },
                {
                    params: buildQuery(
                        selectedContext.sellerId,
                        selectedContext.customerId
                    ),
                    headers: {
                        "Content-Type":
                            "application/json",
                        Accept:
                            "application/json"
                    }
                }
            );

            console.log(
                "CATALOG SEARCH RESPONSE:",
                response.data
            );

            // ----------------------------------------------------
            // EXTRACT RESULT
            // ----------------------------------------------------

            const rawData =
                extractCatalogData(
                    response.data
                );

            // ----------------------------------------------------
            // NORMALIZE RESULT
            // ----------------------------------------------------

            const normalizedData =
                rawData.map(normalizeCatalog);

            // ----------------------------------------------------
            // UPDATE TABLE
            // ----------------------------------------------------

            setCatalogs(normalizedData);

            setPage(0);

            setSelectedIds([]);

            // ----------------------------------------------------
            // NO RESULT
            // ----------------------------------------------------

            if (normalizedData.length === 0) {

                setError(
                    `No products found for "${search}".`
                );

            }

        }
        catch (err) {

            console.error(
                "CATALOG SEARCH ERROR:",
                err
            );

            setCatalogs([]);

            setPage(0);

            setSelectedIds([]);

            setError(
                err?.response?.data?.message ||
                err?.response?.data ||
                err?.message ||
                "Failed to search catalog products."
            );

        }
        finally {

            setSearchLoading(false);

        }

    };

    // ============================================================
    // CLEAR SEARCH
    // ============================================================

    const handleClearSearch = () => {

        setError("");

        loadCatalogs();

    };

    // ============================================================
    // VALIDATE PRODUCT CONTEXT
    // ============================================================

    const validateProductContext = (product) => {

        const productId =
            getProductId(product);

        const sellerId =
            getSellerId(product) ||
            selectedContext?.sellerId;

        const customerId =
            getCustomerId(product) ||
            selectedContext?.customerId;

        if (!productId) {

            setError(
                "Product ID is missing."
            );

            return null;

        }

        if (!sellerId) {

            setError(
                "Seller ID is missing."
            );

            return null;

        }

        if (!customerId) {

            setError(
                "Customer ID is missing."
            );

            return null;

        }

        return {

            productId: Number(productId),

            sellerId: Number(sellerId),

            customerId: Number(customerId)

        };

    };

    // ============================================================
    // VIEW PRODUCT
    // ============================================================

    const handleView = (product) => {

        const context =
            validateProductContext(product);

        if (!context) {

            return;

        }

        navigate(
            `/catalog/products/${context.productId}` +
            `?sellerId=${context.sellerId}` +
            `&customerId=${context.customerId}`
        );

    };

    // ============================================================
    // EDIT PRODUCT
    // ============================================================

    const handleEdit = (product) => {

        const context =
            validateProductContext(product);

        if (!context) {

            return;

        }

        navigate(
            `/catalog/${context.productId}/edit` +
            `?sellerId=${context.sellerId}` +
            `&customerId=${context.customerId}`
        );

    };

    // ============================================================
    // PRODUCT IMAGES
    // ============================================================

    const handleProductImages = (product) => {

        const context =
            validateProductContext(product);

        if (!context) {

            return;

        }

        navigate(
            `/catalog/${context.productId}/images` +
            `?sellerId=${context.sellerId}` +
            `&customerId=${context.customerId}`
        );

    };

    // ============================================================
    // PRODUCT ATTRIBUTES
    // ============================================================

    const handleProductAttributes = (product) => {

        const context =
            validateProductContext(product);

        if (!context) {

            return;

        }

        navigate(
            `/catalog/${context.productId}/attributes` +
            `?sellerId=${context.sellerId}` +
            `&customerId=${context.customerId}`
        );

    };

    // ============================================================
    // PRODUCT REVIEWS
    // ============================================================

    const handleProductReviews = (product) => {

        const context =
            validateProductContext(product);

        if (!context) {

            return;

        }

        navigate(
            `/catalog/${context.productId}/reviews` +
            `?sellerId=${context.sellerId}` +
            `&customerId=${context.customerId}`
        );

    };

    // ============================================================
    // RELATED PRODUCTS
    // ============================================================

    const handleRelatedProducts = (product) => {

        const context =
            validateProductContext(product);

        if (!context) {

            return;

        }

        navigate(
            `/catalog/${context.productId}/related` +
            `?sellerId=${context.sellerId}` +
            `&customerId=${context.customerId}`
        );

    };

    // ============================================================
    // MARKETPLACE
    // ============================================================

    const handleMarketplace = (product) => {

        const context =
            validateProductContext(product);

        if (!context) {

            return;

        }

        navigate(
            `/catalog/${context.productId}/marketplace` +
            `?sellerId=${context.sellerId}` +
            `&customerId=${context.customerId}`
        );

    };

    // ============================================================
    // DELETE PRODUCT
    // ============================================================

    const handleDelete = async (product) => {

        const context =
            validateProductContext(product);

        if (!context) {

            return;

        }

        try {

            setError("");

            await axios.delete(
                `${API_URL}/${context.productId}`,
                {
                    params: buildQuery(
                        context.sellerId,
                        context.customerId
                    ),
                    headers: {
                        Accept:
                            "application/json"
                    }
                }
            );

            // ----------------------------------------------------
            // RELOAD
            // ----------------------------------------------------

            await loadCatalogs();

        }
        catch (err) {

            console.error(
                "DELETE CATALOG PRODUCT ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data ||
                err?.message ||
                "Failed to delete product."
            );

        }

    };

    // ============================================================
    // ADD PRODUCT
    // ============================================================

    const handleAdd = () => {

        if (
            !selectedContext?.sellerId ||
            !selectedContext?.customerId
        ) {

            setError(
                "Seller and customer are required."
            );

            return;

        }

        navigate(
            `/catalog/create` +
            `?sellerId=${selectedContext.sellerId}` +
            `&customerId=${selectedContext.customerId}`
        );

    };

    // ============================================================
    // REFRESH
    // ============================================================

    const handleRefresh = () => {

        setError("");

        loadCatalogs();

    };

    // ============================================================
    // CONTEXT SELECT
    // ============================================================

    const handleContextSelect = (
        sellerId,
        customerId
    ) => {

        setSelectedContext({

            sellerId: Number(sellerId),

            customerId: Number(customerId)

        });

        setPage(0);

        setSelectedIds([]);

    };

    // ============================================================
    // SELECTION
    // ============================================================

    const handleSelectionChange = (
        ids
    ) => {

        setSelectedIds(ids);

    };

    // ============================================================
    // PAGINATION
    // ============================================================

    const handlePageChange = (
        newPage
    ) => {

        setPage(newPage);

    };

    // ============================================================
    // ROWS PER PAGE
    // ============================================================

    const handleRowsPerPageChange = (
        newRowsPerPage
    ) => {

        setRowsPerPage(
            Number(newRowsPerPage)
        );

        setPage(0);

    };

    // ============================================================
    // SELLER / CUSTOMER CONTEXTS
    // ============================================================

    const sellerCustomerContexts = useMemo(() => {

        const map = new Map();

        catalogs.forEach((product) => {

            const sellerId =
                getSellerId(product);

            const customerId =
                getCustomerId(product);

            if (
                sellerId > 0 &&
                customerId > 0
            ) {

                const key =
                    `${sellerId}-${customerId}`;

                if (!map.has(key)) {

                    map.set(
                        key,
                        {
                            sellerId,
                            customerId
                        }
                    );

                }

            }

        });

        return Array.from(
            map.values()
        );

    }, [catalogs]);

    // ============================================================
    // PAGINATED DATA
    // ============================================================

    const paginatedCatalogs = useMemo(() => {

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
        rowsPerPage
    ]);

    // ============================================================
    // RENDER
    // ============================================================

    return (

        <Box sx={{ p: 2 }}>

            {/* =====================================================
                ERROR
            ====================================================== */}

            {error && (

                <Alert
                    severity={
                        error.startsWith("No products")
                            ? "info"
                            : "error"
                    }
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>

            )}

            {/* =====================================================
                SELLER / CUSTOMER CONTEXT
            ====================================================== */}

            {sellerCustomerContexts.length > 0 && (

                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 2 }}
                >

                    {sellerCustomerContexts.map(
                        (context) => {

                            const active =
                                selectedContext?.sellerId ===
                                    context.sellerId &&
                                selectedContext?.customerId ===
                                    context.customerId;

                            return (

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={
                                        `${context.sellerId}-${context.customerId}`
                                    }
                                >

                                    <Paper
                                        sx={{
                                            p: 2,
                                            cursor: "pointer",
                                            border:
                                                active
                                                    ? "2px solid"
                                                    : "1px solid",
                                            borderColor:
                                                active
                                                    ? "primary.main"
                                                    : "divider"
                                        }}
                                        onClick={() =>
                                            handleContextSelect(
                                                context.sellerId,
                                                context.customerId
                                            )
                                        }
                                    >

                                        <Typography
                                            variant="subtitle2"
                                        >
                                            Seller ID
                                        </Typography>

                                        <Chip
                                            label={
                                                context.sellerId
                                            }
                                            size="small"
                                            sx={{ mr: 1 }}
                                        />

                                        <Typography
                                            variant="subtitle2"
                                            sx={{ mt: 1 }}
                                        >
                                            Customer ID
                                        </Typography>

                                        <Chip
                                            label={
                                                context.customerId
                                            }
                                            size="small"
                                        />

                                    </Paper>

                                </Grid>

                            );

                        }
                    )}

                </Grid>

            )}

            {/* =====================================================
                TOOLBAR
            ====================================================== */}

            <CatalogToolbar

                selectedCount={
                    selectedIds.length
                }

                onAdd={
                    handleAdd
                }

                onRefresh={
                    handleRefresh
                }

                loading={
                    loading ||
                    searchLoading
                }

            />

            {/* =====================================================
                SEARCH
            ====================================================== */}

            <CatalogSearch

                sellerId={
                    selectedContext?.sellerId
                }

                customerId={
                    selectedContext?.customerId
                }

                loading={
                    searchLoading
                }

                onSearch={
                    handleSearch
                }

                onClear={
                    handleClearSearch
                }

            />

            {/* =====================================================
                STATISTICS
            ====================================================== */}

            <CatalogStatistics
                catalogs={
                    catalogs
                }
                loading={
                    loading ||
                    searchLoading
                }
            />

            {/* =====================================================
                LOADING
            ====================================================== */}

            {(loading || searchLoading) && (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        p: 4
                    }}
                >

                    <CircularProgress />

                </Box>

            )}

            {/* =====================================================
                EMPTY
            ====================================================== */}

            {!loading &&
                !searchLoading &&
                catalogs.length === 0 && (

                    <Paper
                        sx={{
                            p: 4,
                            textAlign: "center"
                        }}
                    >

                        <Typography
                            variant="h6"
                        >
                            No catalog products found
                        </Typography>

                    </Paper>

                )}

            {/* =====================================================
                TABLE
            ====================================================== */}

            {!loading &&
                !searchLoading &&
                catalogs.length > 0 && (

                    <CatalogTable

                        catalogs={
                            paginatedCatalogs
                        }

                        loading={
                            loading ||
                            searchLoading
                        }

                        sellerId={
                            selectedContext?.sellerId ??
                            null
                        }

                        customerId={
                            selectedContext?.customerId ??
                            null
                        }

                        selectedIds={
                            selectedIds
                        }

                        onSelectionChange={
                            handleSelectionChange
                        }

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

                        onDelete={
                            handleDelete
                        }

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

export default CatalogList;
