// =========================================================
// ProductFilters.jsx
// Marketplace Seller Portal
// Product Management
//
// Uses server.js directly
// No apiService
// =========================================================

import React, { useEffect, useState } from "react";

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
// SERVER URL
// =========================================================

const SERVER_URL = "http://localhost:5000";


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

    const [sellers, setSellers] = useState([]);

    const [brands, setBrands] = useState([]);

    const [categories, setCategories] = useState([]);

    const [productTypes, setProductTypes] = useState([]);


    // =====================================================
    // UI STATE
    // =====================================================

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    // =====================================================
    // SAFE ARRAY
    // =====================================================

    const getArray = (data) => {

        if (Array.isArray(data)) {
            return data;
        }

        if (Array.isArray(data?.items)) {
            return data.items;
        }

        if (Array.isArray(data?.data)) {
            return data.data;
        }

        return [];
    };


    // =====================================================
    // LOAD ALL DROPDOWN DATA
    // =====================================================

    useEffect(() => {

        loadDropdownData();

    }, []);


    // =====================================================
    // LOAD DROPDOWN DATA
    // =====================================================

    const loadDropdownData = async () => {

        try {

            setLoading(true);

            setError("");


            const [

                sellersResponse,

                brandsResponse,

                categoriesResponse,

                productTypesResponse,

            ] = await Promise.all([

                // ---------------------------------------------
                // SELLERS
                // ---------------------------------------------

                axios.get(
                    `${SERVER_URL}/api/sellers/list`
                ),

                // ---------------------------------------------
                // BRANDS
                // ---------------------------------------------

                axios.get(
                    `${SERVER_URL}/api/brands`
                ),

                // ---------------------------------------------
                // CATEGORIES
                // ---------------------------------------------

                axios.get(
                    `${SERVER_URL}/api/categories`
                ),

                // ---------------------------------------------
                // PRODUCT TYPES
                // ---------------------------------------------

                axios.get(
                    `${SERVER_URL}/api/producttype`
                ),

            ]);


            // =================================================
            // SET SELLERS
            // =================================================

            setSellers(
                getArray(
                    sellersResponse.data
                )
            );


            // =================================================
            // SET BRANDS
            // =================================================

            setBrands(
                getArray(
                    brandsResponse.data
                )
            );


            // =================================================
            // SET CATEGORIES
            // =================================================

            setCategories(
                getArray(
                    categoriesResponse.data
                )
            );


            // =================================================
            // SET PRODUCT TYPES
            // =================================================

            setProductTypes(
                getArray(
                    productTypesResponse.data
                )
            );

        }
        catch (err) {

            console.error(
                "Product filter loading error:",
                err
            );

            console.error(
                "Response:",
                err.response?.data
            );

            setError(
                "Unable to load filter data."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // CLEAR ALL FILTERS
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

            boxSizing: "border-box",

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

                justifyContent: "center",

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

                    boxSizing: "border-box",
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <Box
                    sx={{
                        textAlign: "center",
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
                        Filter products by seller, brand,
                        category, product type and status
                    </Typography>

                </Box>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
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
                            textAlign: "center",
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

                        display: "grid",

                        gridTemplateColumns: {

                            xs: "1fr",

                            sm: "1fr 1fr",

                            md: "repeat(3, 1fr)",

                            lg: "repeat(5, 1fr)",

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
                            onChange={(e) =>
                                setSellerFilter(
                                    e.target.value
                                )
                            }
                            sx={selectStyle}
                        >

                            <MenuItem value="">
                                All Sellers
                            </MenuItem>

                            {sellers.map(
                                (seller) => {

                                    const id =
                                        seller.sellerId ??
                                        seller.SellerId;

                                    const name =
                                        seller.sellerName ??
                                        seller.SellerName ??
                                        "Unnamed Seller";

                                    return (

                                        <MenuItem
                                            key={id}
                                            value={String(id)}
                                        >

                                            {id} - {name}

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
                            onChange={(e) =>
                                setBrandFilter(
                                    e.target.value
                                )
                            }
                            sx={selectStyle}
                        >

                            <MenuItem value="">
                                All Brands
                            </MenuItem>

                            {brands.map(
                                (brand) => {

                                    const id =
                                        brand.brandId ??
                                        brand.BrandId;

                                    const name =
                                        brand.brandName ??
                                        brand.BrandName ??
                                        "Unnamed Brand";

                                    return (

                                        <MenuItem
                                            key={id}
                                            value={String(id)}
                                        >

                                            {name}

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
                            onChange={(e) =>
                                setCategoryFilter(
                                    e.target.value
                                )
                            }
                            sx={selectStyle}
                        >

                            <MenuItem value="">
                                All Categories
                            </MenuItem>

                            {categories.map(
                                (category) => {

                                    const id =
                                        category.categoryId ??
                                        category.CategoryId;

                                    const name =
                                        category.categoryName ??
                                        category.CategoryName ??
                                        "Unnamed Category";

                                    return (

                                        <MenuItem
                                            key={id}
                                            value={String(id)}
                                        >

                                            {name}

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
                            onChange={(e) =>
                                setProductTypeFilter(
                                    e.target.value
                                )
                            }
                            sx={selectStyle}
                        >

                            <MenuItem value="">
                                All Product Types
                            </MenuItem>

                            {productTypes.map(
                                (type) => {

                                    const id =
                                        type.productTypeId ??
                                        type.ProductTypeId;

                                    const name =
                                        type.productTypeName ??
                                        type.ProductTypeName ??
                                        "Unnamed Product Type";

                                    return (

                                        <MenuItem
                                            key={id}
                                            value={String(id)}
                                        >

                                            {name}

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
                                statusFilter ?? "All"
                            }
                            label="Status"
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
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
                    CLEAR BUTTON
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",

                        justifyContent: "center",

                        mt: 4,
                    }}
                >

                    <Button
                        variant="outlined"
                        onClick={handleClearFilters}
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

export default ProductFilters;
