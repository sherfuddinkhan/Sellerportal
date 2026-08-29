// =========================================================
// CatalogForm.jsx
// Create + Edit Catalog/Product
// =========================================================

import React, {
    useEffect,
    useState
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
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";


// =========================================================
// CONFIG
// =========================================================

const SERVER_URL = "http://localhost:5000";


// =========================================================
// DEFAULT FORM
// =========================================================

const initialForm = {

    productName: "",

    description: "",

    sku: "",

    brandId: "",

    categoryId: "",

    productTypeId: "",

    price: "",

    quantity: "",

    isActive: true

};


// =========================================================
// COMPONENT
// =========================================================

const CatalogForm = () => {

    const navigate = useNavigate();

    const {
        id
    } = useParams();


    // =====================================================
    // MODE
    // =====================================================

    const isEditMode =
        Boolean(id);


    // =====================================================
    // STATE
    // =====================================================

    const [
        form,
        setForm
    ] = useState(initialForm);


    const [
        brands,
        setBrands
    ] = useState([]);


    const [
        categories,
        setCategories
    ] = useState([]);


    const [
        productTypes,
        setProductTypes
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(false);


    const [
        saving,
        setSaving
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    const [
        success,
        setSuccess
    ] = useState("");


    // =====================================================
    // SELLER / CUSTOMER
    // =====================================================
    //
    // Change these to your actual logged-in values.
    //
    // =====================================================

    const sellerId = 6;

    const customerId = 3;


    // =====================================================
    // LOAD BRANDS
    // =====================================================

    const loadBrands = async () => {

        try {

            const response =
                await fetch(
                    `${SERVER_URL}/api/catalog/brands?sellerId=${sellerId}&customerId=${customerId}`
                );


            if (!response.ok) {

                throw new Error(
                    `Unable to load brands. HTTP ${response.status}`
                );

            }


            const data =
                await response.json();


            const result =
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                        ? data.data
                        : Array.isArray(data?.items)
                            ? data.items
                            : [];


            setBrands(result);


        } catch (err) {

            console.error(
                "Brand loading error:",
                err
            );

        }

    };


    // =====================================================
    // LOAD CATEGORIES
    // =====================================================

    const loadCategories = async () => {

        try {

            const response =
                await fetch(
                    `${SERVER_URL}/api/catalog/categories?sellerId=${sellerId}&customerId=${customerId}`
                );


            if (!response.ok) {

                throw new Error(
                    `Unable to load categories. HTTP ${response.status}`
                );

            }


            const data =
                await response.json();


            const result =
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                        ? data.data
                        : Array.isArray(data?.items)
                            ? data.items
                            : [];


            setCategories(result);


        } catch (err) {

            console.error(
                "Category loading error:",
                err
            );

        }

    };


    // =====================================================
    // LOAD PRODUCT TYPES
    // =====================================================

    const loadProductTypes = async () => {

        try {

            /*
             * Your current CatalogController does not expose
             * a GET /api/catalog/producttypes endpoint.
             *
             * Therefore this remains empty until that API
             * is added.
             */

            setProductTypes([]);

        } catch (err) {

            console.error(
                "Product type loading error:",
                err
            );

        }

    };


    // =====================================================
    // LOAD PRODUCT FOR EDIT
    // =====================================================

    const loadProduct = async () => {

        if (!isEditMode) {

            return;

        }


        try {

            setLoading(true);
            setError("");


            const response =
                await fetch(
                    `${SERVER_URL}/api/catalog/products/${id}?sellerId=${sellerId}&customerId=${customerId}`
                );


            if (!response.ok) {

                if (
                    response.status === 404
                ) {

                    throw new Error(
                        "Product not found."
                    );

                }


                throw new Error(
                    `Unable to load product. HTTP ${response.status}`
                );

            }


            const data =
                await response.json();


            console.log(
                "Product loaded:",
                data
            );


            const product =
                data?.data ??
                data;


            setForm({

                productName:
                    product?.productName ??
                    product?.ProductName ??
                    "",

                description:
                    product?.description ??
                    product?.Description ??
                    "",

                sku:
                    product?.sku ??
                    product?.SKU ??
                    "",

                brandId:
                    product?.brandId ??
                    product?.BrandId ??
                    "",

                categoryId:
                    product?.categoryId ??
                    product?.CategoryId ??
                    "",

                productTypeId:
                    product?.productTypeId ??
                    product?.ProductTypeId ??
                    "",

                price:
                    product?.price ??
                    "",

                quantity:
                    product?.quantity ??
                    "",

                isActive:
                    product?.isActive ??
                    product?.IsActive ??
                    true

            });


        } catch (err) {

            console.error(
                "Product loading error:",
                err
            );


            setError(
                err.message ||
                "Unable to load product."
            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadBrands();

        loadCategories();

        loadProductTypes();

        loadProduct();

    }, [id]);


    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value
        } = event.target;


        setForm(
            previous => ({
                ...previous,
                [name]: value
            })
        );

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        try {

            setSaving(true);
            setError("");
            setSuccess("");


            // =================================================
            // VALIDATION
            // =================================================

            if (
                !form.productName.trim()
            ) {

                throw new Error(
                    "Product name is required."
                );

            }


            // =================================================
            // REQUEST BODY
            // =================================================

            const requestBody = {

                sellerId,

                customerId,

                productName:
                    form.productName.trim(),

                description:
                    form.description.trim(),

                sku:
                    form.sku.trim(),

                brandId:
                    form.brandId
                        ? Number(form.brandId)
                        : null,

                categoryId:
                    form.categoryId
                        ? Number(form.categoryId)
                        : null,

                productTypeId:
                    form.productTypeId
                        ? Number(form.productTypeId)
                        : null,

                price:
                    form.price !== ""
                        ? Number(form.price)
                        : 0,

                quantity:
                    form.quantity !== ""
                        ? Number(form.quantity)
                        : 0,

                isActive:
                    Boolean(form.isActive)

            };


            console.log(
                "Catalog request:",
                requestBody
            );


            // =================================================
            // CREATE / UPDATE
            // =================================================

            const url =
                isEditMode

                    ? `${SERVER_URL}/api/catalog/${id}?sellerId=${sellerId}&customerId=${customerId}`

                    : `${SERVER_URL}/api/catalog/products`;


            const method =
                isEditMode
                    ? "PUT"
                    : "POST";


            const response =
                await fetch(
                    url,
                    {
                        method,

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                requestBody
                            )
                    }
                );


            if (!response.ok) {

                let message =
                    `Request failed. HTTP ${response.status}`;


                try {

                    const errorData =
                        await response.json();


                    message =
                        errorData?.message ||
                        errorData?.title ||
                        message;


                } catch {

                    // Non-JSON response

                }


                throw new Error(
                    message
                );

            }


            const result =
                await response.json();


            console.log(
                "Catalog save response:",
                result
            );


            setSuccess(
                isEditMode
                    ? "Product updated successfully."
                    : "Product created successfully."
            );


            // =================================================
            // REDIRECT
            // =================================================

            setTimeout(() => {

                navigate(
                    "/catalog"
                );

            }, 800);


        } catch (err) {

            console.error(
                "Catalog save error:",
                err
            );


            setError(
                err.message ||
                "Unable to save product."
            );


        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // LOADING EDIT PRODUCT
    // =====================================================

    if (
        isEditMode &&
        loading
    ) {

        return (

            <Box
                sx={{
                    minHeight: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
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
                width: "100%"
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 3
                }}
            >

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/catalog")
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
                            ? "Update product information"
                            : "Create a new catalog product"}
                    </Typography>

                </Box>

            </Box>


            {/* =================================================
                ALERTS
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
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
                    sx={{ mb: 2 }}
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
                    p: 3
                }}
            >

                <Box
                    component="form"
                    onSubmit={
                        handleSubmit
                    }
                >

                    {/* =================================================
                        BASIC INFORMATION
                    ================================================= */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        Product Information
                    </Typography>


                    <Grid
                        container
                        spacing={2}
                    >

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
                                    form.productName
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
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

                    </Grid>


                    <Divider
                        sx={{
                            my: 3
                        }}
                    />


                    {/* =================================================
                        CLASSIFICATION
                    ================================================= */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        Classification
                    </Typography>


                    <Grid
                        container
                        spacing={2}
                    >

                        {/* BRAND */}

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
                                    form.brandId
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <MenuItem value="">
                                    Select Brand
                                </MenuItem>


                                {brands.map(
                                    brand => (

                                        <MenuItem
                                            key={
                                                brand.brandId ??
                                                brand.BrandId
                                            }
                                            value={
                                                brand.brandId ??
                                                brand.BrandId
                                            }
                                        >

                                            {
                                                brand.brandName ??
                                                brand.BrandName
                                            }

                                        </MenuItem>

                                    )
                                )}

                            </TextField>

                        </Grid>


                        {/* CATEGORY */}

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
                                    form.categoryId
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <MenuItem value="">
                                    Select Category
                                </MenuItem>


                                {categories.map(
                                    category => (

                                        <MenuItem
                                            key={
                                                category.categoryId ??
                                                category.CategoryId
                                            }
                                            value={
                                                category.categoryId ??
                                                category.CategoryId
                                            }
                                        >

                                            {
                                                category.categoryName ??
                                                category.CategoryName
                                            }

                                        </MenuItem>

                                    )
                                )}

                            </TextField>

                        </Grid>


                        {/* PRODUCT TYPE */}

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
                                    form.productTypeId
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <MenuItem value="">
                                    Select Product Type
                                </MenuItem>


                                {productTypes.map(
                                    type => (

                                        <MenuItem
                                            key={
                                                type.productTypeId ??
                                                type.ProductTypeId
                                            }
                                            value={
                                                type.productTypeId ??
                                                type.ProductTypeId
                                            }
                                        >

                                            {
                                                type.productTypeName ??
                                                type.ProductTypeName
                                            }

                                        </MenuItem>

                                    )
                                )}

                            </TextField>

                        </Grid>

                    </Grid>


                    <Divider
                        sx={{
                            my: 3
                        }}
                    />


                    {/* =================================================
                        INVENTORY / PRICE
                    ================================================= */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        Price & Inventory
                    </Typography>


                    <Grid
                        container
                        spacing={2}
                    >

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
                                    form.price
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                            />

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Quantity"
                                name="quantity"
                                value={
                                    form.quantity
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 0
                                }}
                            />

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                select
                                fullWidth
                                label="Status"
                                name="isActive"
                                value={
                                    form.isActive
                                        ? "true"
                                        : "false"
                                }
                                onChange={(event) => {

                                    setForm(
                                        previous => ({
                                            ...previous,
                                            isActive:
                                                event.target.value ===
                                                "true"
                                        })
                                    );

                                }}
                            >

                                <MenuItem value="true">
                                    Active
                                </MenuItem>

                                <MenuItem value="false">
                                    Inactive
                                </MenuItem>

                            </TextField>

                        </Grid>

                    </Grid>


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                            mt: 4
                        }}
                    >

                        <Button
                            variant="outlined"
                            onClick={() =>
                                navigate("/catalog")
                            }
                            disabled={saving}
                        >
                            Cancel
                        </Button>


                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={
                                saving
                                    ? <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                    : <Save />
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


export default CatalogForm;

