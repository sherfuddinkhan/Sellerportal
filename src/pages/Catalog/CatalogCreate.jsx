// ============================================================
// CatalogCreate.jsx
// ============================================================
// Create Product Catalog
//
// React
//   ↓
// Node server.js
//   ↓
// ASP.NET Core API
//
// Create API:
// POST http://localhost:5000/api/catalog/products
//
// Required URL:
// /catalog/create?sellerId=6&customerId=3
// ============================================================

import React, {
    useEffect,
    useState,
} from "react";

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    CircularProgress,
    Alert,
    Divider,
    Stack,
} from "@mui/material";

import {
    Save,
    ArrowBack,
} from "@mui/icons-material";

import axios from "axios";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";


// ============================================================
// SERVER
// ============================================================

const SERVER_URL = "http://localhost:5000";


// ============================================================
// COMPONENT
// ============================================================

const CatalogCreate = () => {

    const navigate = useNavigate();

    const [
        searchParams,
    ] = useSearchParams();


    // ========================================================
    // SELLER / CUSTOMER CONTEXT
    // ========================================================

    const sellerId =
        searchParams.get("sellerId");

    const customerId =
        searchParams.get("customerId");


    // ========================================================
    // STATE
    // ========================================================

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        loadingMasterData,
        setLoadingMasterData,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        success,
        setSuccess,
    ] = useState("");


    // ========================================================
    // MASTER DATA
    // ========================================================

    const [
        brands,
        setBrands,
    ] = useState([]);

    const [
        categories,
        setCategories,
    ] = useState([]);

    const [
        productTypes,
        setProductTypes,
    ] = useState([]);


    // ========================================================
    // FORM DATA
    // ========================================================

    const [
        formData,
        setFormData,
    ] = useState({

        productName: "",

        sku: "",

        brandId: "",

        categoryId: "",

        productTypeId: "",

        description: "",

        price: "",

        offerPrice: "",

        stockQuantity: "",

        rating: "",

        reviewCount: "",

        isAvailable: true,

        isActive: true,

    });


    // ========================================================
    // VALIDATE SELLER / CUSTOMER
    // ========================================================

    useEffect(() => {

        if (
            !sellerId ||
            !customerId
        ) {

            setError(
                "Seller ID and Customer ID are missing. Please return to Catalog List and select a valid Seller / Customer context."
            );

        }

    }, [
        sellerId,
        customerId,
    ]);


    // ========================================================
    // LOAD MASTER DATA
    // ========================================================

    useEffect(() => {

        const loadMasterData = async () => {

            // ------------------------------------------------
            // Do not call APIs if context is missing
            // ------------------------------------------------

            if (
                !sellerId ||
                !customerId
            ) {

                setLoadingMasterData(false);

                return;
            }


            try {

                setLoadingMasterData(true);

                setError("");


                // =================================================
                // GET BRANDS
                // =================================================

                const brandsResponse =
                    await axios.get(
                        `${SERVER_URL}/api/catalog/brands`,
                        {
                            params: {
                                sellerId,
                                customerId,
                            },
                        }
                    );


                // -------------------------------------------------
                // Normalize brand response
                // -------------------------------------------------

                const brandData =
                    brandsResponse.data;

                if (
                    Array.isArray(
                        brandData
                    )
                ) {

                    setBrands(
                        brandData
                    );

                } else if (
                    Array.isArray(
                        brandData?.data
                    )
                ) {

                    setBrands(
                        brandData.data
                    );

                } else if (
                    Array.isArray(
                        brandData?.brands
                    )
                ) {

                    setBrands(
                        brandData.brands
                    );

                } else {

                    setBrands([]);

                }


                // =================================================
                // GET CATEGORIES
                // =================================================

                const categoriesResponse =
                    await axios.get(
                        `${SERVER_URL}/api/catalog/categories`,
                        {
                            params: {
                                sellerId,
                                customerId,
                            },
                        }
                    );


                // -------------------------------------------------
                // Normalize category response
                // -------------------------------------------------

                const categoryData =
                    categoriesResponse.data;

                if (
                    Array.isArray(
                        categoryData
                    )
                ) {

                    setCategories(
                        categoryData
                    );

                } else if (
                    Array.isArray(
                        categoryData?.data
                    )
                ) {

                    setCategories(
                        categoryData.data
                    );

                } else if (
                    Array.isArray(
                        categoryData?.categories
                    )
                ) {

                    setCategories(
                        categoryData.categories
                    );

                } else {

                    setCategories([]);

                }


                // =================================================
                // GET PRODUCT TYPES
                // =================================================
                //
                // Node route:
                // GET /api/product-types
                //
                // This route should proxy:
                // GET /api/product-types
                // =================================================

                try {

                    const productTypesResponse =
                        await axios.get(
                            `${SERVER_URL}/api/product-types`
                        );


                    const productTypeData =
                        productTypesResponse.data;


                    if (
                        Array.isArray(
                            productTypeData
                        )
                    ) {

                        setProductTypes(
                            productTypeData
                        );

                    } else if (
                        Array.isArray(
                            productTypeData?.data
                        )
                    ) {

                        setProductTypes(
                            productTypeData.data
                        );

                    } else if (
                        Array.isArray(
                            productTypeData?.productTypes
                        )
                    ) {

                        setProductTypes(
                            productTypeData.productTypes
                        );

                    } else {

                        setProductTypes([]);

                    }

                } catch (productTypeError) {

                    console.error(
                        "GET /api/product-types error:",
                        productTypeError.response?.data ||
                        productTypeError.message
                    );

                    // ---------------------------------------------
                    // Product type failure should not prevent
                    // the rest of the catalog form from loading.
                    // ---------------------------------------------

                    setProductTypes([]);

                }

            } catch (err) {

                console.error(
                    "Catalog master data error:",
                    err.response?.data ||
                    err.message
                );


                setError(
                    err.response?.data?.message ||
                    err.response?.data?.title ||
                    err.response?.data?.error ||
                    err.message ||
                    "Failed to load catalog master data."
                );

            } finally {

                setLoadingMasterData(false);

            }

        };


        loadMasterData();

    }, [
        sellerId,
        customerId,
    ]);


    // ============================================================
    // HANDLE FORM CHANGE
    // ============================================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;


        setFormData(
            previous => ({
                ...previous,
                [name]: value,
            })
        );


        // Clear errors while editing

        if (error) {

            setError("");

        }

        if (success) {

            setSuccess("");

        }

    };


    // ============================================================
    // HANDLE CREATE
    // ============================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        // ========================================================
        // VALIDATE SELLER
        // ========================================================

        const numericSellerId =
            Number(sellerId);

        const numericCustomerId =
            Number(customerId);


        if (
            !Number.isInteger(
                numericSellerId
            ) ||
            numericSellerId <= 0
        ) {

            setError(
                "Invalid Seller ID."
            );

            return;

        }


        // ========================================================
        // VALIDATE CUSTOMER
        // ========================================================

        if (
            !Number.isInteger(
                numericCustomerId
            ) ||
            numericCustomerId <= 0
        ) {

            setError(
                "Invalid Customer ID."
            );

            return;

        }


        // ========================================================
        // REQUIRED PRODUCT NAME
        // ========================================================

        if (
            !formData.productName.trim()
        ) {

            setError(
                "Product Name is required."
            );

            return;

        }


        // ========================================================
        // REQUIRED SKU
        // ========================================================

        if (
            !formData.sku.trim()
        ) {

            setError(
                "SKU is required."
            );

            return;

        }


        try {

            setLoading(true);

            setError("");

            setSuccess("");


            // ====================================================
            // CREATE PAYLOAD
            // ====================================================

            const payload = {

                SellerId:
                    numericSellerId,

                CustomerId:
                    numericCustomerId,

                ProductName:
                    formData.productName.trim(),

                SKU:
                    formData.sku.trim(),

                BrandId:
                    formData.brandId
                        ? Number(
                            formData.brandId
                        )
                        : null,

                CategoryId:
                    formData.categoryId
                        ? Number(
                            formData.categoryId
                        )
                        : null,

                ProductTypeId:
                    formData.productTypeId
                        ? Number(
                            formData.productTypeId
                        )
                        : null,

                Description:
                    formData.description.trim(),

                Price:
                    formData.price !== ""
                        ? Number(
                            formData.price
                        )
                        : 0,

                OfferPrice:
                    formData.offerPrice !== ""
                        ? Number(
                            formData.offerPrice
                        )
                        : null,

                StockQuantity:
                    formData.stockQuantity !== ""
                        ? Number(
                            formData.stockQuantity
                        )
                        : 0,

                Rating:
                    formData.rating !== ""
                        ? Number(
                            formData.rating
                        )
                        : 0,

                ReviewCount:
                    formData.reviewCount !== ""
                        ? Number(
                            formData.reviewCount
                        )
                        : 0,

                IsAvailable:
                    Boolean(
                        formData.isAvailable
                    ),

                IsActive:
                    Boolean(
                        formData.isActive
                    ),

            };


            // ====================================================
            // POST CREATE PRODUCT
            // ====================================================
            //
            // React
            //   ↓
            // Node
            //   ↓
            // ASP.NET
            //
            // POST /api/catalog/products
            // ====================================================

            const response =
                await axios.post(
                    `${SERVER_URL}/api/catalog/products`,
                    payload
                );


            console.log(
                "Catalog created:",
                response.data
            );


            // ====================================================
            // SUCCESS
            // ====================================================

            setSuccess(
                "Product catalog created successfully."
            );


            // ====================================================
            // RETURN TO LIST
            // ====================================================

            setTimeout(
                () => {

                    navigate(
                        `/catalog?sellerId=${numericSellerId}&customerId=${numericCustomerId}`
                    );

                },
                800
            );


        } catch (err) {

            console.error(
                "Create catalog error:",
                err.response?.data ||
                err.message
            );


            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.response?.data?.error ||
                err.message ||
                "Failed to create product catalog."
            );

        } finally {

            setLoading(false);

        }

    };


    // ============================================================
    // BACK TO CATALOG
    // ============================================================

    const handleBack = () => {

        if (
            sellerId &&
            customerId
        ) {

            navigate(
                `/catalog?sellerId=${sellerId}&customerId=${customerId}`
            );

        } else {

            navigate(
                "/catalog"
            );

        }

    };


    // ============================================================
    // HELPER FUNCTIONS
    // ============================================================

    const getBrandId = (
        brand
    ) => {

        return (
            brand.brandId ??
            brand.BrandId ??
            brand.id ??
            ""
        );

    };


    const getBrandName = (
        brand
    ) => {

        return (
            brand.brandName ??
            brand.BrandName ??
            brand.name ??
            brand.Name ??
            ""
        );

    };


    const getCategoryId = (
        category
    ) => {

        return (
            category.categoryId ??
            category.CategoryId ??
            category.id ??
            ""
        );

    };


    const getCategoryName = (
        category
    ) => {

        return (
            category.categoryName ??
            category.CategoryName ??
            category.name ??
            category.Name ??
            ""
        );

    };


    const getProductTypeId = (
        productType
    ) => {

        return (
            productType.productTypeId ??
            productType.ProductTypeId ??
            productType.id ??
            ""
        );

    };


    const getProductTypeName = (
        productType
    ) => {

        return (
            productType.productTypeName ??
            productType.ProductTypeName ??
            productType.name ??
            productType.Name ??
            ""
        );

    };


    // ============================================================
    // MISSING CONTEXT
    // ============================================================

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
                    sx={{
                        mb: 2,
                    }}
                >
                    Seller ID and Customer ID are missing.
                    Please return to Catalog List and select
                    a valid Seller / Customer context.
                </Alert>


                <Button
                    variant="contained"
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={
                        handleBack
                    }
                >
                    Back to Catalog
                </Button>

            </Box>
        );

    }


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <Box
            sx={{
                p: 3,
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                }}
            >

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    justifyContent="space-between"
                    alignItems={{
                        xs: "flex-start",
                        sm: "center",
                    }}
                    spacing={2}
                >

                    <Box>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >
                            Create Product Catalog
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Add a new product to the catalog.
                        </Typography>

                    </Box>


                    {/* =================================================
                        CONTEXT
                    ================================================= */}

                    <Stack
                        direction="row"
                        spacing={1}
                    >

                        <Typography
                            variant="body2"
                        >
                            Seller:
                            <strong>
                                {" "}
                                {sellerId}
                            </strong>
                        </Typography>

                        <Typography
                            variant="body2"
                        >
                            Customer:
                            <strong>
                                {" "}
                                {customerId}
                            </strong>
                        </Typography>

                    </Stack>

                </Stack>

            </Paper>


            {/* =================================================
                ALERTS
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


            {success && (

                <Alert
                    severity="success"
                    sx={{
                        mb: 2,
                    }}
                >
                    {success}
                </Alert>

            )}


            {/* =================================================
                FORM
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    borderRadius: 2,
                }}
            >

                {loadingMasterData ? (

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            p: 5,
                        }}
                    >

                        <CircularProgress />

                    </Box>

                ) : (

                    <Box
                        component="form"
                        onSubmit={
                            handleSubmit
                        }
                    >

                        {/* =========================================
                            BASIC INFORMATION
                        ========================================== */}

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                mb: 2,
                            }}
                        >
                            Basic Information
                        </Typography>


                        <Grid
                            container
                            spacing={2}
                        >

                            {/* Product Name */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    label="Product Name"
                                    name="productName"
                                    value={
                                        formData.productName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>


                            {/* SKU */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    label="SKU"
                                    name="sku"
                                    value={
                                        formData.sku
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>


                            {/* Brand */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    label="Brand"
                                    name="brandId"
                                    value={
                                        formData.brandId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <MenuItem value="">
                                        Select Brand
                                    </MenuItem>

                                    {brands.map(
                                        (
                                            brand,
                                            index
                                        ) => (

                                            <MenuItem
                                                key={
                                                    getBrandId(
                                                        brand
                                                    ) ||
                                                    index
                                                }
                                                value={
                                                    getBrandId(
                                                        brand
                                                    )
                                                }
                                            >
                                                {
                                                    getBrandName(
                                                        brand
                                                    )
                                                }
                                            </MenuItem>

                                        )
                                    )}

                                </TextField>

                            </Grid>


                            {/* Category */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    label="Category"
                                    name="categoryId"
                                    value={
                                        formData.categoryId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <MenuItem value="">
                                        Select Category
                                    </MenuItem>

                                    {categories.map(
                                        (
                                            category,
                                            index
                                        ) => (

                                            <MenuItem
                                                key={
                                                    getCategoryId(
                                                        category
                                                    ) ||
                                                    index
                                                }
                                                value={
                                                    getCategoryId(
                                                        category
                                                    )
                                                }
                                            >
                                                {
                                                    getCategoryName(
                                                        category
                                                    )
                                                }
                                            </MenuItem>

                                        )
                                    )}

                                </TextField>

                            </Grid>


                            {/* Product Type */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    label="Product Type"
                                    name="productTypeId"
                                    value={
                                        formData.productTypeId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <MenuItem value="">
                                        Select Product Type
                                    </MenuItem>

                                    {productTypes.map(
                                        (
                                            productType,
                                            index
                                        ) => (

                                            <MenuItem
                                                key={
                                                    getProductTypeId(
                                                        productType
                                                    ) ||
                                                    index
                                                }
                                                value={
                                                    getProductTypeId(
                                                        productType
                                                    )
                                                }
                                            >
                                                {
                                                    getProductTypeName(
                                                        productType
                                                    )
                                                }
                                            </MenuItem>

                                        )
                                    )}

                                </TextField>

                            </Grid>


                            {/* Description */}

                            <Grid
                                item
                                xs={12}
                            >

                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={4}
                                    label="Description"
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                        </Grid>


                        <Divider
                            sx={{
                                my: 3,
                            }}
                        />


                        {/* =========================================
                            PRICE & INVENTORY
                        ========================================== */}

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                mb: 2,
                            }}
                        >
                            Price & Inventory
                        </Typography>


                        <Grid
                            container
                            spacing={2}
                        >

                            {/* Price */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Price"
                                    name="price"
                                    value={
                                        formData.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    inputProps={{
                                        min: 0,
                                    }}
                                />

                            </Grid>


                            {/* Offer Price */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Offer Price"
                                    name="offerPrice"
                                    value={
                                        formData.offerPrice
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    inputProps={{
                                        min: 0,
                                    }}
                                />

                            </Grid>


                            {/* Stock */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Stock Quantity"
                                    name="stockQuantity"
                                    value={
                                        formData.stockQuantity
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    inputProps={{
                                        min: 0,
                                    }}
                                />

                            </Grid>


                            {/* Rating */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Rating"
                                    name="rating"
                                    value={
                                        formData.rating
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    inputProps={{
                                        min: 0,
                                        max: 5,
                                        step: 0.1,
                                    }}
                                />

                            </Grid>


                            {/* Review Count */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Review Count"
                                    name="reviewCount"
                                    value={
                                        formData.reviewCount
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    inputProps={{
                                        min: 0,
                                    }}
                                />

                            </Grid>

                        </Grid>


                        <Divider
                            sx={{
                                my: 3,
                            }}
                        />


                        {/* =========================================
                            ACTIONS
                        ========================================== */}

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            justifyContent="flex-end"
                            spacing={2}
                        >

                            <Button
                                variant="outlined"
                                startIcon={
                                    <ArrowBack />
                                }
                                onClick={
                                    handleBack
                                }
                                disabled={
                                    loading
                                }
                            >
                                Cancel
                            </Button>


                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    loading
                                        ? (
                                            <CircularProgress
                                                size={20}
                                                color="inherit"
                                            />
                                        )
                                        : (
                                            <Save />
                                        )
                                }
                                disabled={
                                    loading
                                }
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Catalog"}
                            </Button>

                        </Stack>

                    </Box>

                )}

            </Paper>

        </Box>

    );

};


// ============================================================
// EXPORT
// ============================================================

export default CatalogCreate;
