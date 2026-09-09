// =========================================================
// ProductDetails.jsx
// Marketplace Seller Portal
// Product Details Page
//
// Frontend calls Node.js server.js directly
// No apiService
// =========================================================

import React, {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import {
    Paper,
    Grid,
    Typography,
    Chip,
    Divider,
    Button,
    CircularProgress,
    Box,
    Alert,
} from "@mui/material";

import {
    ArrowBack,
    Edit,
} from "@mui/icons-material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

// =========================================================
// NODE SERVER
// =========================================================

const SERVER_URL =
    "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const ProductDetails = () => {

    const navigate = useNavigate();

    // =====================================================
    // PRODUCT ID
    // =====================================================
    //
    // React route:
    //
    // /products/:id
    //
    // Example:
    //
    // /products/6
    //
    // =====================================================

    const { id } = useParams();

    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] =
        useState(true);

    const [product, setProduct] =
        useState(null);

    const [error, setError] =
        useState("");

    // =====================================================
    // LOAD PRODUCT WHEN ID CHANGES
    // =====================================================

    useEffect(() => {

        if (!id) {

            setError(
                "Product ID is missing."
            );

            setLoading(false);

            return;
        }

        loadProductById(id);

    }, [id]);

    // =====================================================
    // GET PRODUCT BY ID
    // =====================================================
    //
    // Frontend:
    //
    // GET
    // http://localhost:5000/api/products/6
    //
    // Node server.js:
    //
    // GET
    // https://localhost:7203/api/products/6
    //
    // =====================================================

    const loadProductById = async (
        productId
    ) => {

        try {

            setLoading(true);

            setError("");

            setProduct(null);

            console.log(
                "=========================================="
            );

            console.log(
                "PRODUCT DETAILS"
            );

            console.log(
                "Product ID:",
                productId
            );

            console.log(
                "Request:",
                `${SERVER_URL}/api/products/${productId}`
            );

            console.log(
                "=========================================="
            );

            // =================================================
            // GET PRODUCT
            // =================================================

            const response =
                await axios.get(

                    `${SERVER_URL}/api/products/${encodeURIComponent(productId)}`,

                    {
                        headers: {
                            Accept:
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );

            console.log(
                "PRODUCT DETAILS RESPONSE:",
                response.data
            );

            // =================================================
            // SET PRODUCT
            // =================================================

            if (!response.data) {

                throw new Error(
                    "Product not found."
                );
            }

            setProduct(
                response.data
            );

        }
        catch (err) {

            console.error(
                "PRODUCT DETAILS ERROR:",
                err
            );

            console.error(
                "STATUS:",
                err.response?.status
            );

            console.error(
                "RESPONSE:",
                err.response?.data
            );

            setError(

                err.response?.data?.message ||

                err.response?.data?.title ||

                (
                    typeof err.response?.data ===
                    "string"
                        ? err.response.data
                        : null
                ) ||

                err.message ||

                "Unable to load product."

            );

        }
        finally {

            setLoading(false);
        }
    };

    // =====================================================
    // BACK TO PRODUCTS
    // =====================================================

    const handleBack = () => {

        navigate(
            "/products"
        );
    };

    // =====================================================
    // EDIT PRODUCT
    // =====================================================

    const handleEdit = () => {

        navigate(
            `/products/edit/${encodeURIComponent(id)}`
        );
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: 400,

                    display: "flex",

                    flexDirection:
                        "column",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    gap: 2,
                }}
            >

                <CircularProgress />

                <Typography>
                    Loading Product...
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Product ID: {id || "Missing"}
                </Typography>

            </Box>
        );
    }

    // =====================================================
    // PRODUCT NOT FOUND / ERROR
    // =====================================================

    if (!product) {

        return (

            <Box sx={{ p: 3 }}>

                <Paper sx={{ p: 4 }}>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        mb={2}
                    >
                        Product Not Found
                    </Typography>

                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {error ||
                            `Unable to load Product ID ${id}.`}
                    </Alert>

                    <Button
                        variant="outlined"
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={
                            handleBack
                        }
                    >
                        Back to Products
                    </Button>

                </Paper>

            </Box>
        );
    }

    // =====================================================
    // SUPPORT CAMEL CASE + PASCAL CASE
    // =====================================================

    const productId =
        product.productId ??
        product.ProductId ??
        id;

    const sellerId =
        product.sellerId ??
        product.SellerId;

    const customerId =
        product.customerId ??
        product.CustomerId;

    const sku =
        product.sku ??
        product.SKU;

    const productName =
        product.productName ??
        product.ProductName;

    const description =
        product.description ??
        product.Description;

    const brandName =
        product.brandName ??
        product.BrandName;

    const brandId =
        product.brandId ??
        product.BrandId;

    const categoryName =
        product.categoryName ??
        product.CategoryName;

    const categoryId =
        product.categoryId ??
        product.CategoryId;

    const productTypeName =
        product.productTypeName ??
        product.ProductTypeName;

    const productTypeId =
        product.productTypeId ??
        product.ProductTypeId;

    const barcode =
        product.barcode ??
        product.Barcode;

    const hsnCode =
        product.hsnCode ??
        product.HSNCode;

    const unitOfMeasure =
        product.unitOfMeasure ??
        product.UnitOfMeasure;

    const weight =
        product.weight ??
        product.Weight;

    const length =
        product.length ??
        product.Length;

    const width =
        product.width ??
        product.Width;

    const height =
        product.height ??
        product.Height;

    const status =
        product.status ??
        product.Status;

    const isActive =
        product.isActive ??
        product.IsActive ??
        false;

    const createdDate =
        product.createdDate ??
        product.CreatedDate;

    const updatedDate =
        product.updatedDate ??
        product.UpdatedDate;

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <Box sx={{ p: 3 }}>

            <Paper
                sx={{
                    p: 4,
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >

                    <Grid item>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >
                            Product Details
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Product ID:{" "}
                            {productId}
                        </Typography>

                    </Grid>

                    <Grid item>

                        <Box
                            sx={{
                                display: "flex",

                                gap: 2,
                            }}
                        >

                            {/* BACK */}

                            <Button
                                variant="outlined"
                                startIcon={
                                    <ArrowBack />
                                }
                                onClick={
                                    handleBack
                                }
                            >
                                Back
                            </Button>

                            {/* EDIT */}

                            <Button
                                variant="contained"
                                startIcon={
                                    <Edit />
                                }
                                onClick={
                                    handleEdit
                                }
                            >
                                Edit
                            </Button>

                        </Box>

                    </Grid>

                </Grid>

                <Divider
                    sx={{
                        mb: 4,
                    }}
                />

                {/* =================================================
                    PRODUCT INFORMATION
                ================================================= */}

                <Grid
                    container
                    spacing={3}
                >

                    {/* PRODUCT ID */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            Product ID
                        </Typography>

                        <Typography
                            variant="h6"
                        >
                            {productId}
                        </Typography>

                    </Grid>

                    {/* SELLER ID */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            Seller ID
                        </Typography>

                        <Typography>
                            {sellerId ?? "-"}
                        </Typography>

                    </Grid>

                    {/* CUSTOMER ID */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            Customer ID
                        </Typography>

                        <Typography>
                            {customerId ?? "-"}
                        </Typography>

                    </Grid>

                    {/* SKU */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            SKU
                        </Typography>

                        <Typography>
                            {sku || "-"}
                        </Typography>

                    </Grid>

                    {/* PRODUCT NAME */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            Product Name
                        </Typography>

                        <Typography
                            variant="h6"
                        >
                            {productName || "-"}
                        </Typography>

                    </Grid>

                    {/* DESCRIPTION */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            Description
                        </Typography>

                        <Typography>
                            {description || "-"}
                        </Typography>

                    </Grid>

                    {/* BRAND */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            Brand
                        </Typography>

                        <Typography>
                            {brandName ||
                                brandId ||
                                "-"}
                        </Typography>

                    </Grid>

                    {/* CATEGORY */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            Category
                        </Typography>

                        <Typography>
                            {categoryName ||
                                categoryId ||
                                "-"}
                        </Typography>

                    </Grid>

                    {/* PRODUCT TYPE */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            Product Type
                        </Typography>

                        <Typography>
                            {productTypeName ||
                                productTypeId ||
                                "-"}
                        </Typography>

                    </Grid>

                    {/* BARCODE */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            Barcode
                        </Typography>

                        <Typography>
                            {barcode || "-"}
                        </Typography>

                    </Grid>

                    {/* HSN */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            HSN Code
                        </Typography>

                        <Typography>
                            {hsnCode || "-"}
                        </Typography>

                    </Grid>

                    {/* UNIT */}

                    <Grid
                        item
                        xs={12}
                        md={3}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            Unit
                        </Typography>

                        <Typography>
                            {unitOfMeasure || "-"}
                        </Typography>

                    </Grid>

                    {/* WEIGHT */}

                    <Grid
                        item
                        xs={12}
                        md={3}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            Weight
                        </Typography>

                        <Typography>
                            {weight ?? 0}
                        </Typography>

                    </Grid>

                    {/* LENGTH */}

                    <Grid
                        item
                        xs={12}
                        md={2}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            Length
                        </Typography>

                        <Typography>
                            {length ?? 0}
                        </Typography>

                    </Grid>

                    {/* WIDTH */}

                    <Grid
                        item
                        xs={12}
                        md={2}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            Width
                        </Typography>

                        <Typography>
                            {width ?? 0}
                        </Typography>

                    </Grid>

                    {/* HEIGHT */}

                    <Grid
                        item
                        xs={12}
                        md={2}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            Height
                        </Typography>

                        <Typography>
                            {height ?? 0}
                        </Typography>

                    </Grid>

                    {/* STATUS */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            Status
                        </Typography>

                        <Typography>
                            {status || "-"}
                        </Typography>

                    </Grid>

                    {/* ACTIVE */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            Active
                        </Typography>

                        <Chip
                            label={
                                isActive
                                    ? "Active"
                                    : "Inactive"
                            }
                            color={
                                isActive
                                    ? "success"
                                    : "error"
                            }
                        />

                    </Grid>

                    {/* CREATED DATE */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            Created Date
                        </Typography>

                        <Typography>
                            {createdDate
                                ? new Date(
                                    createdDate
                                ).toLocaleString()
                                : "-"}
                        </Typography>

                    </Grid>

                    {/* UPDATED DATE */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            Updated Date
                        </Typography>

                        <Typography>
                            {updatedDate
                                ? new Date(
                                    updatedDate
                                ).toLocaleString()
                                : "-"}
                        </Typography>

                    </Grid>

                </Grid>

            </Paper>

        </Box>
    );
};

export default ProductDetails;