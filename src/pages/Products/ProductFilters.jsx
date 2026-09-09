import React, {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Paper,
    CircularProgress,
    Button,
} from "@mui/material";

// =========================================================
// NODE SERVER
// =========================================================

const SERVER_URL =
    "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const ProductFilters = ({

    sellerFilter,
    setSellerFilter,

    brandFilter,
    setBrandFilter,

    categoryFilter,
    setCategoryFilter,

    productTypeFilter,
    setProductTypeFilter,

    statusFilter,
    setStatusFilter,

}) => {

    // =====================================================
    // MASTER DATA
    // =====================================================

    const [sellers, setSellers] =
        useState([]);

    const [brands, setBrands] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [productTypes, setProductTypes] =
        useState([]);

    // =====================================================
    // UI STATE
    // =====================================================

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    // =====================================================
    // SAFE ARRAY
    //
    // Supports:
    //
    // [
    //   {...}
    // ]
    //
    // {
    //   items: [...]
    // }
    //
    // {
    //   data: [...]
    // }
    //
    // {
    //   results: [...]
    // }
    //
    // PascalCase variants are also supported.
    // =====================================================

    const getArray = (data) => {

        if (Array.isArray(data)) {
            return data;
        }

        if (Array.isArray(data?.items)) {
            return data.items;
        }

        if (Array.isArray(data?.Items)) {
            return data.Items;
        }

        if (Array.isArray(data?.data)) {
            return data.data;
        }

        if (Array.isArray(data?.Data)) {
            return data.Data;
        }

        if (Array.isArray(data?.results)) {
            return data.results;
        }

        if (Array.isArray(data?.Results)) {
            return data.Results;
        }

        return [];
    };

    // =====================================================
    // GET ERROR MESSAGE
    // =====================================================

    const getErrorMessage = (
        error,
        defaultMessage
    ) => {

        return (
            error?.response?.data?.message ||
            error?.response?.data?.title ||
            error?.response?.data?.error ||
            error?.message ||
            defaultMessage
        );
    };

    // =====================================================
    // LOAD MASTER DATA ON COMPONENT LOAD
    // =====================================================

    useEffect(() => {

        loadDropdownData();

    }, []);

    // =====================================================
    // LOAD DROPDOWN DATA
    // =====================================================
    //
    // IMPORTANT:
    //
    // Do NOT use Promise.all().
    //
    // Every API is loaded independently so that:
    //
    // Brands failure
    //     DOES NOT
    // prevent Categories from loading.
    //
    // =====================================================

    const loadDropdownData = async () => {

        setLoading(true);

        setError("");

        console.log(
            "=================================================="
        );

        console.log(
            "PRODUCT FILTER MASTER DATA"
        );

        console.log(
            "=================================================="
        );

        // =================================================
        // SELLERS
        // =================================================

        try {

            console.log(
                "GET:",
                `${SERVER_URL}/api/sellers/list`
            );

            const response =
                await axios.get(
                    `${SERVER_URL}/api/sellers/list`,
                    {
                        timeout: 30000,
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            console.log(
                "SELLERS STATUS:",
                response.status
            );

            console.log(
                "SELLERS RAW RESPONSE:",
                response.data
            );

            const sellerList =
                getArray(response.data);

            console.log(
                "SELLERS ARRAY:",
                sellerList
            );

            setSellers(
                sellerList
            );

        }
        catch (error) {

            console.error(
                "SELLERS API ERROR:",
                error
            );

            console.error(
                "SELLERS STATUS:",
                error?.response?.status
            );

            console.error(
                "SELLERS RESPONSE:",
                error?.response?.data
            );

            setSellers([]);

        }

        // =================================================
        // BRANDS
        // =================================================

        try {

            console.log(
                "GET:",
                `${SERVER_URL}/api/brands`
            );

            const response =
                await axios.get(
                    `${SERVER_URL}/api/brands`,
                    {
                        timeout: 30000,
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            console.log(
                "BRANDS STATUS:",
                response.status
            );

            console.log(
                "BRANDS RAW RESPONSE:",
                response.data
            );

            const brandList =
                getArray(response.data);

            console.log(
                "BRANDS ARRAY:",
                brandList
            );

            setBrands(
                brandList
            );

        }
        catch (error) {

            console.error(
                "BRANDS API ERROR:",
                error
            );

            console.error(
                "BRANDS STATUS:",
                error?.response?.status
            );

            console.error(
                "BRANDS RESPONSE:",
                error?.response?.data
            );

            setBrands([]);

        }

        // =================================================
        // CATEGORIES
        // =================================================

        try {

            console.log(
                "GET:",
                `${SERVER_URL}/api/categories`
            );

            const response =
                await axios.get(
                    `${SERVER_URL}/api/categories`,
                    {
                        timeout: 30000,
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            console.log(
                "CATEGORIES STATUS:",
                response.status
            );

            console.log(
                "CATEGORIES RAW RESPONSE:",
                response.data
            );

            const categoryList =
                getArray(response.data);

            console.log(
                "CATEGORIES ARRAY:",
                categoryList
            );

            setCategories(
                categoryList
            );

        }
        catch (error) {

            console.error(
                "CATEGORIES API ERROR:",
                error
            );

            console.error(
                "CATEGORIES STATUS:",
                error?.response?.status
            );

            console.error(
                "CATEGORIES RESPONSE:",
                error?.response?.data
            );

            setCategories([]);

        }

        // =================================================
        // PRODUCT TYPES
        // =================================================

        try {

            console.log(
                "GET:",
                `${SERVER_URL}/api/producttype`
            );

            const response =
                await axios.get(
                    `${SERVER_URL}/api/producttype`,
                    {
                        timeout: 30000,
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            console.log(
                "PRODUCT TYPES STATUS:",
                response.status
            );

            console.log(
                "PRODUCT TYPES RAW RESPONSE:",
                response.data
            );

            const productTypeList =
                getArray(response.data);

            console.log(
                "PRODUCT TYPES ARRAY:",
                productTypeList
            );

            setProductTypes(
                productTypeList
            );

        }
        catch (error) {

            console.error(
                "PRODUCT TYPES API ERROR:",
                error
            );

            console.error(
                "PRODUCT TYPES STATUS:",
                error?.response?.status
            );

            console.error(
                "PRODUCT TYPES RESPONSE:",
                error?.response?.data
            );

            setProductTypes([]);

        }

        // =================================================
        // FINISHED
        // =================================================

        console.log(
            "=================================================="
        );

        console.log(
            "PRODUCT FILTER MASTER DATA LOADING FINISHED"
        );

        console.log(
            "=================================================="
        );

        setLoading(false);
    };

    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const handleClearFilters = () => {

        setSellerFilter("");

        setBrandFilter("");

        setCategoryFilter("");

        setProductTypeFilter("");

        setStatusFilter("All");
    };

    // =====================================================
    // SELECT STYLE
    // =====================================================

    const selectStyle = {

        minHeight: 58,

        backgroundColor: "#fff",

        "& .MuiSelect-select": {

            display: "flex",

            alignItems: "center",

            minHeight:
                "58px !important",

            boxSizing:
                "border-box",

            fontSize: "16px",

            paddingLeft: 2,

            paddingRight: 5,
        },

        "& .MuiOutlinedInput-notchedOutline": {

            borderWidth: 1,
        },

        "&:hover .MuiOutlinedInput-notchedOutline": {

            borderWidth: 2,
        },

        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {

            borderWidth: 2,
        },
    };

    // =====================================================
    // FORM CONTROL STYLE
    // =====================================================

    const formControlStyle = {

        width: "100%",

        "& .MuiInputLabel-root": {

            fontSize: "15px",
        },

        "& .MuiInputLabel-shrink": {

            fontSize: "15px",
        },
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                width: "100%",

                display: "flex",

                justifyContent:
                    "center",

                py: 2,
            }}
        >

            <Paper
                elevation={2}
                sx={{
                    width: "100%",

                    maxWidth: 1400,

                    p: {
                        xs: 2,
                        sm: 3,
                        md: 4,
                    },

                    borderRadius: 3,

                    boxSizing:
                        "border-box",
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <Box
                    sx={{
                        textAlign:
                            "center",

                        mb: 4,
                    }}
                >

                    <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{
                            mb: 0.5,
                        }}
                    >
                        Product Filters
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Filter products by seller,
                        brand, category,
                        product type and status
                    </Typography>

                </Box>

                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <Box
                        sx={{
                            display:
                                "flex",

                            justifyContent:
                                "center",

                            mb: 3,
                        }}
                    >

                        <CircularProgress
                            size={28}
                        />

                    </Box>
                )}

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <Typography
                        color="error"
                        sx={{
                            textAlign:
                                "center",

                            mb: 3,
                        }}
                    >
                        {error}
                    </Typography>
                )}

                {/* =================================================
                    FILTER GRID
                ================================================= */}

                <Box
                    sx={{
                        display:
                            "grid",

                        gridTemplateColumns: {

                            xs:
                                "1fr",

                            sm:
                                "1fr 1fr",

                            md:
                                "repeat(3, 1fr)",

                            lg:
                                "repeat(5, 1fr)",
                        },

                        gap: 3,

                        width: "100%",
                    }}
                >

                    {/* =================================================
                        SELLER
                    ================================================= */}

                    <FormControl
                        fullWidth
                        sx={formControlStyle}
                    >

                        <InputLabel>
                            Seller
                        </InputLabel>

                        <Select
                            value={
                                sellerFilter ?? ""
                            }
                            label="Seller"
                            onChange={(event) => {

                                setSellerFilter(
                                    event.target.value
                                );

                            }}
                            sx={selectStyle}
                        >

                            <MenuItem value="">
                                All Sellers
                            </MenuItem>

                            {sellers.map(
                                (seller, index) => {

                                    const sellerId =
                                        seller?.sellerId ??
                                        seller?.SellerId;

                                    const sellerName =
                                        seller?.sellerName ??
                                        seller?.SellerName ??
                                        seller?.name ??
                                        seller?.Name ??
                                        "Unnamed Seller";

                                    if (
                                        sellerId ===
                                        undefined ||
                                        sellerId === null
                                    ) {
                                        return null;
                                    }

                                    return (

                                        <MenuItem
                                            key={
                                                sellerId ??
                                                index
                                            }
                                            value={
                                                String(
                                                    sellerId
                                                )
                                            }
                                        >

                                            {sellerId} -{" "}
                                            {sellerName}

                                        </MenuItem>
                                    );
                                }
                            )}

                        </Select>

                    </FormControl>

                    {/* =================================================
                        BRAND
                    ================================================= */}

                    <FormControl
                        fullWidth
                        sx={formControlStyle}
                    >

                        <InputLabel>
                            Brand
                        </InputLabel>

                        <Select
                            value={
                                brandFilter ?? ""
                            }
                            label="Brand"
                            onChange={(event) => {

                                setBrandFilter(
                                    event.target.value
                                );

                            }}
                            sx={selectStyle}
                        >

                            <MenuItem value="">
                                All Brands
                            </MenuItem>

                            {brands.map(
                                (brand, index) => {

                                    const brandId =
                                        brand?.brandId ??
                                        brand?.BrandId;

                                    const brandName =
                                        brand?.brandName ??
                                        brand?.BrandName ??
                                        brand?.name ??
                                        brand?.Name ??
                                        "Unnamed Brand";

                                    if (
                                        brandId ===
                                        undefined ||
                                        brandId === null
                                    ) {
                                        return null;
                                    }

                                    return (

                                        <MenuItem
                                            key={
                                                brandId ??
                                                index
                                            }
                                            value={
                                                String(
                                                    brandId
                                                )
                                            }
                                        >

                                            {brandName}

                                        </MenuItem>
                                    );
                                }
                            )}

                        </Select>

                    </FormControl>

                    {/* =================================================
                        CATEGORY
                    ================================================= */}

                    <FormControl
                        fullWidth
                        sx={formControlStyle}
                    >

                        <InputLabel>
                            Category
                        </InputLabel>

                        <Select
                            value={
                                categoryFilter ?? ""
                            }
                            label="Category"
                            onChange={(event) => {

                                setCategoryFilter(
                                    event.target.value
                                );

                            }}
                            sx={selectStyle}
                        >

                            <MenuItem value="">
                                All Categories
                            </MenuItem>

                            {categories.map(
                                (category, index) => {

                                    const categoryId =
                                        category?.categoryId ??
                                        category?.CategoryId;

                                    const categoryName =
                                        category?.categoryName ??
                                        category?.CategoryName ??
                                        category?.name ??
                                        category?.Name ??
                                        "Unnamed Category";

                                    if (
                                        categoryId ===
                                        undefined ||
                                        categoryId === null
                                    ) {
                                        return null;
                                    }

                                    return (

                                        <MenuItem
                                            key={
                                                categoryId ??
                                                index
                                            }
                                            value={
                                                String(
                                                    categoryId
                                                )
                                            }
                                        >

                                            {categoryName}

                                        </MenuItem>
                                    );
                                }
                            )}

                        </Select>

                    </FormControl>

                    {/* =================================================
                        PRODUCT TYPE
                    ================================================= */}

                    <FormControl
                        fullWidth
                        sx={formControlStyle}
                    >

                        <InputLabel>
                            Product Type
                        </InputLabel>

                        <Select
                            value={
                                productTypeFilter ?? ""
                            }
                            label="Product Type"
                            onChange={(event) => {

                                setProductTypeFilter(
                                    event.target.value
                                );

                            }}
                            sx={selectStyle}
                        >

                            <MenuItem value="">
                                All Product Types
                            </MenuItem>

                            {productTypes.map(
                                (type, index) => {

                                    const productTypeId =
                                        type?.productTypeId ??
                                        type?.ProductTypeId;

                                    const productTypeName =
                                        type?.productTypeName ??
                                        type?.ProductTypeName ??
                                        type?.name ??
                                        type?.Name ??
                                        "Unnamed Product Type";

                                    if (
                                        productTypeId ===
                                        undefined ||
                                        productTypeId === null
                                    ) {
                                        return null;
                                    }

                                    return (

                                        <MenuItem
                                            key={
                                                productTypeId ??
                                                index
                                            }
                                            value={
                                                String(
                                                    productTypeId
                                                )
                                            }
                                        >

                                            {productTypeName}

                                        </MenuItem>
                                    );
                                }
                            )}

                        </Select>

                    </FormControl>

                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <FormControl
                        fullWidth
                        sx={formControlStyle}
                    >

                        <InputLabel>
                            Status
                        </InputLabel>

                        <Select
                            value={
                                statusFilter ??
                                "All"
                            }
                            label="Status"
                            onChange={(event) => {

                                setStatusFilter(
                                    event.target.value
                                );

                            }}
                            sx={selectStyle}
                        >

                            <MenuItem value="All">
                                All
                            </MenuItem>

                            <MenuItem value="Active">
                                Active
                            </MenuItem>

                            <MenuItem value="Inactive">
                                Inactive
                            </MenuItem>

                        </Select>

                    </FormControl>

                </Box>

                {/* =================================================
                    SELECTED FILTER SUMMARY
                ================================================= */}

                <Box
                    sx={{
                        mt: 3,

                        display: "flex",

                        justifyContent:
                            "center",

                        flexWrap:
                            "wrap",

                        gap: 2,
                    }}
                >

                    {sellerFilter && (

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Seller:{" "}
                            {sellerFilter}
                        </Typography>
                    )}

                    {brandFilter && (

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Brand:{" "}
                            {brandFilter}
                        </Typography>
                    )}

                    {categoryFilter && (

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Category:{" "}
                            {categoryFilter}
                        </Typography>
                    )}

                    {productTypeFilter && (

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Product Type:{" "}
                            {productTypeFilter}
                        </Typography>
                    )}

                    {statusFilter &&
                        statusFilter !== "All" && (

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Status:{" "}
                                {statusFilter}
                            </Typography>
                        )}

                </Box>

                {/* =================================================
                    CLEAR BUTTON
                ================================================= */}

                <Box
                    sx={{
                        display:
                            "flex",

                        justifyContent:
                            "center",

                        mt: 4,
                    }}
                >

                    <Button
                        variant="outlined"
                        onClick={
                            handleClearFilters
                        }
                        sx={{
                            minWidth: 160,

                            minHeight: 44,
                        }}
                    >
                        Clear Filters
                    </Button>

                </Box>

            </Paper>

        </Box>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default ProductFilters;
