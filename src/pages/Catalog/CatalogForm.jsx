// =========================================================
// CatalogForm.jsx
// =========================================================
// Create + Edit Catalog Product
//
// Flow:
//
// React
//   ↓
// Axios
//   ↓
// Node server.js - http://localhost:5000
//   ↓
// ASP.NET Core - https://localhost:7203/api
//
// IMPORTANT:
// Seller ID and Customer ID are entered directly in this form.
// They are NOT taken from URL query parameters.
//
// POST
// /api/catalog/products
//
// PUT
// /api/catalog/{id}
// ?sellerId=6&customerId=3
//
// =========================================================

import React, {
    useEffect,
    useState,
} from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    MenuItem,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Save,
} from "@mui/icons-material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import axios from "axios";


// =========================================================
// SERVER
// =========================================================

const SERVER_URL = "http://localhost:5000";


// =========================================================
// INITIAL FORM
// =========================================================
//
// These fields exactly match the Swagger POST request:
//
// sellerId
// customerId
// sku
// productTypeId
// productName
// description
// brandId
// categoryId
// barcode
// hsnCode
// unitOfMeasure
// weight
// length
// width
// height
// status
// isActive
//
// =========================================================

const initialForm = {

    sellerId: "",
    customerId: "",

    sku: "",

    productTypeId: "",

    productName: "",

    description: "",

    brandId: "",

    categoryId: "",

    barcode: "",

    hsnCode: "",

    unitOfMeasure: "",

    weight: "",
    length: "",
    width: "",
    height: "",

    status: "Active",

    isActive: true,
};


// =========================================================
// GET ARRAY FROM API RESPONSE
// =========================================================

const getArrayData = (data) => {

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    if (Array.isArray(data?.items)) {
        return data.items;
    }

    if (Array.isArray(data?.result)) {
        return data.result;
    }

    if (Array.isArray(data?.brands)) {
        return data.brands;
    }

    if (Array.isArray(data?.categories)) {
        return data.categories;
    }

    if (Array.isArray(data?.productTypes)) {
        return data.productTypes;
    }

    if (Array.isArray(data?.$values)) {
        return data.$values;
    }

    return [];
};


// =========================================================
// GET ERROR MESSAGE
// =========================================================

const getErrorMessage = (error, defaultMessage) => {

    const responseData =
        error?.response?.data;

    if (
        typeof responseData === "string" &&
        responseData.trim()
    ) {
        return responseData;
    }

    return (
        responseData?.message ||
        responseData?.title ||
        responseData?.error ||
        responseData?.detail ||
        error?.message ||
        defaultMessage
    );
};


// =========================================================
// COMPONENT
// =========================================================

const CatalogForm = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const isEditMode = Boolean(id);


    // =====================================================
    // FORM
    // =====================================================

    const [form, setForm] = useState({
        ...initialForm,
    });


    // =====================================================
    // MASTER DATA
    // =====================================================

    const [brands, setBrands] = useState([]);

    const [categories, setCategories] = useState([]);

    const [productTypes, setProductTypes] = useState([]);


    // =====================================================
    // LOADING
    // =====================================================

    const [loadingProduct, setLoadingProduct] =
        useState(false);

    const [loadingBrands, setLoadingBrands] =
        useState(false);

    const [loadingCategories, setLoadingCategories] =
        useState(false);

    const [loadingProductTypes, setLoadingProductTypes] =
        useState(false);

    const [saving, setSaving] =
        useState(false);


    // =====================================================
    // MESSAGES
    // =====================================================

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // SELLER / CUSTOMER VALIDATION
    // =====================================================

    const sellerId = Number(form.sellerId);

    const customerId = Number(form.customerId);

    const hasSellerCustomer =
        Number.isInteger(sellerId) &&
        sellerId > 0 &&
        Number.isInteger(customerId) &&
        customerId > 0;


    // =====================================================
    // LOAD BRANDS
    // =====================================================
    //
    // GET
    // http://localhost:5000/api/catalog/brands
    //
    // Node forwards to:
    //
    // /api/catalog/brands?sellerId=&customerId=
    //
    // =====================================================

    const loadBrands = async (
        currentSellerId,
        currentCustomerId
    ) => {

        if (
            !currentSellerId ||
            !currentCustomerId
        ) {
            setBrands([]);
            return;
        }


        try {

            setLoadingBrands(true);

            const response =
                await axios.get(
                    `${SERVER_URL}/api/catalog/brands`,
                    {
                        params: {
                            sellerId:
                                currentSellerId,

                            customerId:
                                currentCustomerId,
                        },

                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );


            setBrands(
                getArrayData(
                    response.data
                )
            );

        } catch (err) {

            console.error(
                "Brand loading error:",
                err?.response?.data ||
                err.message
            );

            setBrands([]);

        } finally {

            setLoadingBrands(false);
        }
    };


    // =====================================================
    // LOAD CATEGORIES
    // =====================================================
    //
    // GET
    // http://localhost:5000/api/catalog/categories
    //
    // =====================================================

    const loadCategories = async (
        currentSellerId,
        currentCustomerId
    ) => {

        if (
            !currentSellerId ||
            !currentCustomerId
        ) {
            setCategories([]);
            return;
        }


        try {

            setLoadingCategories(true);

            const response =
                await axios.get(
                    `${SERVER_URL}/api/catalog/categories`,
                    {
                        params: {
                            sellerId:
                                currentSellerId,

                            customerId:
                                currentCustomerId,
                        },

                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );


            setCategories(
                getArrayData(
                    response.data
                )
            );

        } catch (err) {

            console.error(
                "Category loading error:",
                err?.response?.data ||
                err.message
            );

            setCategories([]);

        } finally {

            setLoadingCategories(false);
        }
    };


    // =====================================================
    // LOAD PRODUCT TYPES
    // =====================================================
    //
    // GET
    // http://localhost:5000/api/product-types
    //
    // =====================================================

    const loadProductTypes = async () => {

        try {

            setLoadingProductTypes(true);

            const response =
                await axios.get(
                    `${SERVER_URL}/api/product-types`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );


            setProductTypes(
                getArrayData(
                    response.data
                )
            );

        } catch (err) {

            console.error(
                "Product type loading error:",
                err?.response?.data ||
                err.message
            );

            setProductTypes([]);

            setError(
                getErrorMessage(
                    err,
                    "Failed to load product types."
                )
            );

        } finally {

            setLoadingProductTypes(false);
        }
    };


    // =====================================================
    // LOAD PRODUCT FOR EDIT
    // =====================================================
    //
    // GET
    //
    // /api/catalog/products/{id}
    //
    // ?sellerId=6&customerId=3
    //
    // =====================================================

    const loadProduct = async (
        currentSellerId,
        currentCustomerId
    ) => {

        if (!isEditMode) {
            return;
        }


        if (
            !currentSellerId ||
            !currentCustomerId
        ) {

            setError(
                "Enter Seller ID and Customer ID before loading the product."
            );

            return;
        }


        try {

            setLoadingProduct(true);

            setError("");

            setSuccess("");


            const response =
                await axios.get(
                    `${SERVER_URL}/api/catalog/products/${id}`,
                    {
                        params: {
                            sellerId:
                                Number(
                                    currentSellerId
                                ),

                            customerId:
                                Number(
                                    currentCustomerId
                                ),
                        },

                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );


            const data =
                response.data;


            const product =
                data?.data ??
                data?.result ??
                data?.product ??
                data;


            if (!product) {

                throw new Error(
                    "Product not found."
                );
            }


            // =================================================
            // MAP API PRODUCT TO FORM
            // =================================================

            setForm((previous) => ({

                ...previous,


                sellerId:
                    product?.sellerId ??
                    product?.SellerId ??
                    currentSellerId,


                customerId:
                    product?.customerId ??
                    product?.CustomerId ??
                    currentCustomerId,


                sku:
                    product?.sku ??
                    product?.SKU ??
                    "",


                productTypeId:
                    product?.productTypeId ??
                    product?.ProductTypeId ??
                    "",


                productName:
                    product?.productName ??
                    product?.ProductName ??
                    "",


                description:
                    product?.description ??
                    product?.Description ??
                    "",


                brandId:
                    product?.brandId ??
                    product?.BrandId ??
                    "",


                categoryId:
                    product?.categoryId ??
                    product?.CategoryId ??
                    "",


                barcode:
                    product?.barcode ??
                    product?.Barcode ??
                    "",


                hsnCode:
                    product?.hsnCode ??
                    product?.HSNCode ??
                    "",


                unitOfMeasure:
                    product?.unitOfMeasure ??
                    product?.UnitOfMeasure ??
                    "",


                weight:
                    product?.weight ??
                    product?.Weight ??
                    "",


                length:
                    product?.length ??
                    product?.Length ??
                    "",


                width:
                    product?.width ??
                    product?.Width ??
                    "",


                height:
                    product?.height ??
                    product?.Height ??
                    "",


                status:
                    product?.status ??
                    product?.Status ??
                    "Active",


                isActive:
                    product?.isActive ??
                    product?.IsActive ??
                    true,

            }));


            // =================================================
            // LOAD MASTER DATA
            // =================================================

            await loadBrands(
                Number(currentSellerId),
                Number(currentCustomerId)
            );

            await loadCategories(
                Number(currentSellerId),
                Number(currentCustomerId)
            );


        } catch (err) {

            console.error(
                "Product loading error:",
                err?.response?.data ||
                err.message
            );


            setError(
                getErrorMessage(
                    err,
                    "Unable to load product."
                )
            );

        } finally {

            setLoadingProduct(false);
        }
    };


    // =====================================================
    // LOAD PRODUCT TYPES ON PAGE LOAD
    // =====================================================

    useEffect(() => {

        loadProductTypes();

    }, []);


    // =====================================================
    // HANDLE FORM CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setForm((previous) => ({

            ...previous,

            [name]: value,

        }));


        setError("");

        setSuccess("");
    };


    // =====================================================
    // LOAD SELLER/CUSTOMER MASTER DATA
    // =====================================================
    //
    // When Seller ID + Customer ID are entered,
    // load Brands and Categories.
    //
    // =====================================================

    useEffect(() => {

        const currentSellerId =
            Number(form.sellerId);

        const currentCustomerId =
            Number(form.customerId);


        if (
            !Number.isInteger(
                currentSellerId
            ) ||
            currentSellerId <= 0 ||
            !Number.isInteger(
                currentCustomerId
            ) ||
            currentCustomerId <= 0
        ) {

            setBrands([]);

            setCategories([]);

            return;
        }


        loadBrands(
            currentSellerId,
            currentCustomerId
        );

        loadCategories(
            currentSellerId,
            currentCustomerId
        );

    }, [
        form.sellerId,
        form.customerId,
    ]);


    // =====================================================
    // LOAD PRODUCT BUTTON
    // =====================================================

    const handleLoadProduct = async () => {

        setError("");

        setSuccess("");


        const currentSellerId =
            Number(form.sellerId);

        const currentCustomerId =
            Number(form.customerId);


        if (
            !Number.isInteger(
                currentSellerId
            ) ||
            currentSellerId <= 0
        ) {

            setError(
                "Please enter a valid Seller ID."
            );

            return;
        }


        if (
            !Number.isInteger(
                currentCustomerId
            ) ||
            currentCustomerId <= 0
        ) {

            setError(
                "Please enter a valid Customer ID."
            );

            return;
        }


        await loadProduct(
            currentSellerId,
            currentCustomerId
        );
    };


    // =====================================================
    // BUILD POST / PUT REQUEST BODY
    // =====================================================
    //
    // EXACTLY MATCHES THE SWAGGER MODEL
    //
    // =====================================================

    const buildRequestBody = () => {

        return {

            sellerId:
                Number(form.sellerId),

            customerId:
                Number(form.customerId),


            sku:
                form.sku.trim(),


            productTypeId:
                form.productTypeId !== ""
                    ? Number(
                        form.productTypeId
                    )
                    : 0,


            productName:
                form.productName.trim(),


            description:
                form.description.trim(),


            brandId:
                form.brandId !== ""
                    ? Number(
                        form.brandId
                    )
                    : 0,


            categoryId:
                form.categoryId !== ""
                    ? Number(
                        form.categoryId
                    )
                    : 0,


            barcode:
                form.barcode.trim(),


            hsnCode:
                form.hsnCode.trim(),


            unitOfMeasure:
                form.unitOfMeasure.trim(),


            weight:
                form.weight !== ""
                    ? Number(
                        form.weight
                    )
                    : 0,


            length:
                form.length !== ""
                    ? Number(
                        form.length
                    )
                    : 0,


            width:
                form.width !== ""
                    ? Number(
                        form.width
                    )
                    : 0,


            height:
                form.height !== ""
                    ? Number(
                        form.height
                    )
                    : 0,


            status:
                form.status.trim(),


            isActive:
                Boolean(
                    form.isActive
                ),

        };
    };


    // =====================================================
    // VALIDATE FORM
    // =====================================================

    const validateForm = () => {

        const numericSellerId =
            Number(form.sellerId);

        const numericCustomerId =
            Number(form.customerId);


        // =================================================
        // SELLER
        // =================================================

        if (
            !Number.isInteger(
                numericSellerId
            ) ||
            numericSellerId <= 0
        ) {

            return "Please enter a valid Seller ID.";
        }


        // =================================================
        // CUSTOMER
        // =================================================

        if (
            !Number.isInteger(
                numericCustomerId
            ) ||
            numericCustomerId <= 0
        ) {

            return "Please enter a valid Customer ID.";
        }


        // =================================================
        // PRODUCT NAME
        // =================================================

        if (
            !form.productName.trim()
        ) {

            return "Product Name is required.";
        }


        // =================================================
        // SKU
        // =================================================

        if (
            !form.sku.trim()
        ) {

            return "SKU is required.";
        }


        // =================================================
        // PRODUCT TYPE
        // =================================================

        if (
            !form.productTypeId
        ) {

            return "Product Type is required.";
        }


        // =================================================
        // BRAND
        // =================================================

        if (
            !form.brandId
        ) {

            return "Brand is required.";
        }


        // =================================================
        // CATEGORY
        // =================================================

        if (
            !form.categoryId
        ) {

            return "Category is required.";
        }


        // =================================================
        // STATUS
        // =================================================

        if (
            !form.status.trim()
        ) {

            return "Status is required.";
        }


        return "";
    };


    // =====================================================
    // SUBMIT
    // =====================================================
    //
    // CREATE:
    //
    // POST
    // http://localhost:5000/api/catalog/products
    //
    //
    // EDIT:
    //
    // PUT
    // http://localhost:5000/api/catalog/{id}
    //
    // Query:
    // sellerId
    // customerId
    //
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setSuccess("");


        // =================================================
        // VALIDATE
        // =================================================

        const validationError =
            validateForm();


        if (validationError) {

            setError(
                validationError
            );

            return;
        }


        try {

            setSaving(true);


            const requestBody =
                buildRequestBody();


            console.log(
                "Catalog Request Body:",
                requestBody
            );


            // =================================================
            // CREATE
            // =================================================

            if (!isEditMode) {

                const response =
                    await axios.post(
                        `${SERVER_URL}/api/catalog/products`,
                        requestBody,
                        {
                            headers: {
                                "Content-Type":
                                    "application/json",

                                Accept:
                                    "application/json",
                            },
                        }
                    );


                console.log(
                    "Create Catalog Response:",
                    response.data
                );


                setSuccess(
                    "Product created successfully."
                );


            }

            // =================================================
            // UPDATE
            // =================================================

            else {

                const response =
                    await axios.put(
                        `${SERVER_URL}/api/catalog/${id}`,
                        requestBody,
                        {
                            params: {

                                sellerId:
                                    Number(
                                        form.sellerId
                                    ),

                                customerId:
                                    Number(
                                        form.customerId
                                    ),

                            },

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Accept:
                                    "application/json",

                            },
                        }
                    );


                console.log(
                    "Update Catalog Response:",
                    response.data
                );


                setSuccess(
                    "Product updated successfully."
                );
            }


            // =================================================
            // GO BACK TO CATALOG
            // =================================================

            setTimeout(() => {

                navigate(
                    "/catalog"
                );

            }, 800);


        } catch (err) {

            console.error(
                "Catalog save error:",
                err?.response?.data ||
                err
            );


            setError(
                getErrorMessage(
                    err,
                    isEditMode
                        ? "Unable to update product."
                        : "Unable to create product."
                )
            );

        } finally {

            setSaving(false);
        }
    };


    // =====================================================
    // BACK
    // =====================================================

    const handleBack = () => {

        navigate(
            "/catalog"
        );
    };


    // =====================================================
    // EDIT LOADING
    // =====================================================

    if (
        isEditMode &&
        loadingProduct
    ) {

        return (

            <Box
                sx={{
                    minHeight: 400,

                    display: "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    flexDirection:
                        "column",

                    gap: 2,
                }}
            >

                <CircularProgress />

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Loading product...
                </Typography>

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

                boxSizing:
                    "border-box",
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display:
                        "flex",

                    alignItems:
                        "center",

                    gap: 2,

                    mb: 3,

                    flexWrap:
                        "wrap",
                }}
            >

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


                <Box>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        {isEditMode
                            ? "Edit Catalog"
                            : "Create Catalog"}
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {isEditMode
                            ? "Update catalog product information"
                            : "Create a new catalog product"}
                    </Typography>

                </Box>

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
                SUCCESS
            ================================================= */}

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
                MAIN FORM
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3,

                    width: "100%",

                    boxSizing:
                        "border-box",
                }}
            >

                <Box
                    component="form"
                    onSubmit={
                        handleSubmit
                    }
                >


                    {/* =================================================
                        SELLER / CUSTOMER
                    ================================================= */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            mb: 2,
                        }}
                    >
                        Seller / Customer
                    </Typography>


                    <Grid
                        container
                        spacing={2}
                    >

                        {/* =================================================
                            SELLER ID
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Seller ID"
                                name="sellerId"
                                value={
                                    form.sellerId
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1,
                                    step: 1,
                                }}
                                helperText={
                                    "Enter Seller ID"
                                }
                            />

                        </Grid>


                        {/* =================================================
                            CUSTOMER ID
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Customer ID"
                                name="customerId"
                                value={
                                    form.customerId
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1,
                                    step: 1,
                                }}
                                helperText={
                                    "Enter Customer ID"
                                }
                            />

                        </Grid>


                        {/* =================================================
                            LOAD PRODUCT - EDIT ONLY
                        ================================================= */}

                        {isEditMode && (

                            <Grid
                                item
                                xs={12}
                                md={4}
                                sx={{
                                    display:
                                        "flex",

                                    alignItems:
                                        "center",
                                }}
                            >

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={
                                        handleLoadProduct
                                    }
                                    disabled={
                                        loadingProduct ||
                                        !hasSellerCustomer
                                    }
                                >
                                    {loadingProduct
                                        ? "Loading..."
                                        : "Load Product"}
                                </Button>

                            </Grid>

                        )}

                    </Grid>


                    <Divider
                        sx={{
                            my: 3,
                        }}
                    />


                    {/* =================================================
                        PRODUCT INFORMATION
                    ================================================= */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            mb: 2,
                        }}
                    >
                        Product Information
                    </Typography>


                    <Grid
                        container
                        spacing={2}
                    >

                        {/* =================================================
                            SKU
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                required
                                label="SKU"
                                name="sku"
                                value={
                                    form.sku
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>


                        {/* =================================================
                            PRODUCT NAME
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={8}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Product Name"
                                name="productName"
                                value={
                                    form.productName
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>


                        {/* =================================================
                            DESCRIPTION
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                        >

                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                label="Description"
                                name="description"
                                value={
                                    form.description
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>


                        {/* =================================================
                            BARCODE
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="Barcode"
                                name="barcode"
                                value={
                                    form.barcode
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>


                        {/* =================================================
                            HSN CODE
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="HSN Code"
                                name="hsnCode"
                                value={
                                    form.hsnCode
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>


                        {/* =================================================
                            UNIT OF MEASURE
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="Unit of Measure"
                                name="unitOfMeasure"
                                value={
                                    form.unitOfMeasure
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="PCS"
                            />

                        </Grid>

                    </Grid>


                    <Divider
                        sx={{
                            my: 3,
                        }}
                    />


                    {/* =================================================
                        CLASSIFICATION
                    ================================================= */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            mb: 2,
                        }}
                    >
                        Classification
                    </Typography>


                    <Grid
                        container
                        spacing={2}
                    >

                        {/* =================================================
                            PRODUCT TYPE
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                select
                                fullWidth
                                required
                                label="Product Type"
                                name="productTypeId"
                                value={
                                    form.productTypeId
                                }
                                onChange={
                                    handleChange
                                }
                                helperText={
                                    loadingProductTypes
                                        ? "Loading product types..."
                                        : productTypes.length === 0
                                            ? "No product types available"
                                            : `${productTypes.length} product type(s) available`
                                }
                            >

                                <MenuItem
                                    value=""
                                >
                                    Select Product Type
                                </MenuItem>


                                {productTypes.map(
                                    (type) => {

                                        const typeId =
                                            type?.productTypeId ??
                                            type?.ProductTypeId ??
                                            type?.id ??
                                            type?.Id;


                                        const typeName =
                                            type?.productTypeName ??
                                            type?.ProductTypeName ??
                                            type?.name ??
                                            type?.Name;


                                        if (
                                            typeId ===
                                            undefined
                                        ) {
                                            return null;
                                        }


                                        return (

                                            <MenuItem
                                                key={
                                                    typeId
                                                }
                                                value={
                                                    typeId
                                                }
                                            >
                                                {typeName ||
                                                    `Product Type ${typeId}`}
                                            </MenuItem>

                                        );

                                    }
                                )}

                            </TextField>

                        </Grid>


                        {/* =================================================
                            BRAND
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                select
                                fullWidth
                                required
                                label="Brand"
                                name="brandId"
                                value={
                                    form.brandId
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    !hasSellerCustomer
                                }
                                helperText={
                                    loadingBrands
                                        ? "Loading brands..."
                                        : brands.length === 0
                                            ? "Enter valid Seller ID and Customer ID"
                                            : `${brands.length} brand(s) available`
                                }
                            >

                                <MenuItem
                                    value=""
                                >
                                    Select Brand
                                </MenuItem>


                                {brands.map(
                                    (brand) => {

                                        const brandId =
                                            brand?.brandId ??
                                            brand?.BrandId ??
                                            brand?.id ??
                                            brand?.Id;


                                        const brandName =
                                            brand?.brandName ??
                                            brand?.BrandName ??
                                            brand?.name ??
                                            brand?.Name;


                                        if (
                                            brandId ===
                                            undefined
                                        ) {
                                            return null;
                                        }


                                        return (

                                            <MenuItem
                                                key={
                                                    brandId
                                                }
                                                value={
                                                    brandId
                                                }
                                            >
                                                {brandName ||
                                                    `Brand ${brandId}`}
                                            </MenuItem>

                                        );

                                    }
                                )}

                            </TextField>

                        </Grid>


                        {/* =================================================
                            CATEGORY
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                select
                                fullWidth
                                required
                                label="Category"
                                name="categoryId"
                                value={
                                    form.categoryId
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    !hasSellerCustomer
                                }
                                helperText={
                                    loadingCategories
                                        ? "Loading categories..."
                                        : categories.length === 0
                                            ? "Enter valid Seller ID and Customer ID"
                                            : `${categories.length} categor${categories.length === 1 ? "y" : "ies"} available`
                                }
                            >

                                <MenuItem
                                    value=""
                                >
                                    Select Category
                                </MenuItem>


                                {categories.map(
                                    (category) => {

                                        const categoryId =
                                            category?.categoryId ??
                                            category?.CategoryId ??
                                            category?.id ??
                                            category?.Id;


                                        const categoryName =
                                            category?.categoryName ??
                                            category?.CategoryName ??
                                            category?.name ??
                                            category?.Name;


                                        if (
                                            categoryId ===
                                            undefined
                                        ) {
                                            return null;
                                        }


                                        return (

                                            <MenuItem
                                                key={
                                                    categoryId
                                                }
                                                value={
                                                    categoryId
                                                }
                                            >
                                                {categoryName ||
                                                    `Category ${categoryId}`}
                                            </MenuItem>

                                        );

                                    }
                                )}

                            </TextField>

                        </Grid>

                    </Grid>


                    <Divider
                        sx={{
                            my: 3,
                        }}
                    />


                    {/* =================================================
                        DIMENSIONS
                    ================================================= */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            mb: 2,
                        }}
                    >
                        Product Dimensions
                    </Typography>


                    <Grid
                        container
                        spacing={2}
                    >

                        {/* =================================================
                            WEIGHT
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={3}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Weight"
                                name="weight"
                                value={
                                    form.weight
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 0,
                                    step: "0.01",
                                }}
                            />

                        </Grid>


                        {/* =================================================
                            LENGTH
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={3}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Length"
                                name="length"
                                value={
                                    form.length
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 0,
                                    step: "0.01",
                                }}
                            />

                        </Grid>


                        {/* =================================================
                            WIDTH
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={3}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Width"
                                name="width"
                                value={
                                    form.width
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 0,
                                    step: "0.01",
                                }}
                            />

                        </Grid>


                        {/* =================================================
                            HEIGHT
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={3}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Height"
                                name="height"
                                value={
                                    form.height
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 0,
                                    step: "0.01",
                                }}
                            />

                        </Grid>

                    </Grid>


                    <Divider
                        sx={{
                            my: 3,
                        }}
                    />


                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            mb: 2,
                        }}
                    >
                        Status
                    </Typography>


                    <Grid
                        container
                        spacing={2}
                    >

                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                select
                                fullWidth
                                required
                                label="Status"
                                name="status"
                                value={
                                    form.status
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <MenuItem
                                    value="Active"
                                >
                                    Active
                                </MenuItem>

                                <MenuItem
                                    value="Inactive"
                                >
                                    Inactive
                                </MenuItem>

                                <MenuItem
                                    value="Draft"
                                >
                                    Draft
                                </MenuItem>

                            </TextField>

                        </Grid>


                        {/* =================================================
                            ACTIVE
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                select
                                fullWidth
                                label="Is Active"
                                name="isActive"
                                value={
                                    form.isActive
                                        ? "true"
                                        : "false"
                                }
                                onChange={(
                                    event
                                ) => {

                                    setForm(
                                        (
                                            previous
                                        ) => ({

                                            ...previous,

                                            isActive:
                                                event
                                                    .target
                                                    .value ===
                                                "true",

                                        })
                                    );

                                }}
                            >

                                <MenuItem
                                    value="true"
                                >
                                    Yes
                                </MenuItem>

                                <MenuItem
                                    value="false"
                                >
                                    No
                                </MenuItem>

                            </TextField>

                        </Grid>

                    </Grid>


                    {/* =================================================
                        FORM BUTTONS
                    ================================================= */}

                    <Box
                        sx={{
                            display:
                                "flex",

                            justifyContent:
                                "flex-end",

                            gap: 2,

                            mt: 4,

                            flexWrap:
                                "wrap",
                        }}
                    >

                        <Button
                            variant="outlined"
                            onClick={
                                handleBack
                            }
                            disabled={
                                saving
                            }
                        >
                            Cancel
                        </Button>


                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={
                                saving
                                    ? (
                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                    )
                                    : (
                                        <Save />
                                    )
                            }
                            disabled={
                                saving
                            }
                        >
                            {saving
                                ? "Saving..."
                                : isEditMode
                                    ? "Update Product"
                                    : "Create Product"}
                        </Button>

                    </Box>

                </Box>

            </Paper>

        </Box>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default CatalogForm;
