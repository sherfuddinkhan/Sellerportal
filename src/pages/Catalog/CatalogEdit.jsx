// ============================================================
// CatalogEdit.jsx
// ============================================================
// EDIT FLOW:
//
// CatalogList
//      |
//      | Product ID = 6
//      | Seller ID  = 6
//      | Customer ID = 3
//      |
//      v
// /catalog/6/edit?sellerId=6&customerId=3
//      |
//      v
// CatalogEdit
//      |
//      | GET /api/catalog/products/6
//      | ?sellerId=6&customerId=3
//      |
//      v
// Node server.js
//      |
//      v
// ASP.NET Core
//      |
//      v
// Existing Product Data
//      |
//      v
// Populate Edit Form
// ============================================================

import React, {
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Alert,
    CircularProgress
} from "@mui/material";

import {
    Save,
    Clear,
    ArrowBack
} from "@mui/icons-material";

import {
    useNavigate,
    useParams,
    useSearchParams
} from "react-router-dom";


// ============================================================
// SERVER
// ============================================================

const SERVER_URL =
    "http://localhost:5000";


// ============================================================
// COMPONENT
// ============================================================

const CatalogEdit = () => {

    const navigate =
        useNavigate();


    // ========================================================
    // PRODUCT ID
    //
    // Comes from:
    //
    // /catalog/6/edit
    //
    // id = 6
    // ========================================================

    const {
        id
    } = useParams();


    // ========================================================
    // QUERY PARAMETERS
    //
    // ?sellerId=6&customerId=3
    // ========================================================

    const [
        searchParams
    ] = useSearchParams();


    const sellerId =
        searchParams.get(
            "sellerId"
        );


    const customerId =
        searchParams.get(
            "customerId"
        );


    // ========================================================
    // FORM
    // ========================================================

    const [
        form,
        setForm
    ] = useState({

        // Automatically populated
        productId:
            id || "",

        sellerId:
            sellerId || "",

        customerId:
            customerId || "",

        // Existing product data
        sku: "",

        productName: "",

        description: "",

        brandId: "",

        categoryId: "",

        productTypeId: "",

        isActive: true

    });


    // ========================================================
    // MASTER DATA
    // ========================================================

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


    // ========================================================
    // STATE
    // ========================================================

    const [
        loading,
        setLoading
    ] = useState(true);


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


    // ========================================================
    // HANDLE FORM CHANGE
    // ========================================================

    const handleChange =
        (event) => {

            const {
                name,
                value,
                checked,
                type
            } = event.target;


            setForm(
                (previous) => ({

                    ...previous,

                    [name]:
                        type === "checkbox"
                            ? checked
                            : value

                })
            );

        };


    // ========================================================
    // EXTRACT ARRAY DATA
    // ========================================================

    const extractArray =
        (data) => {

            if (
                Array.isArray(data)
            ) {

                return data;

            }


            if (
                Array.isArray(
                    data?.data
                )
            ) {

                return data.data;

            }


            if (
                Array.isArray(
                    data?.items
                )
            ) {

                return data.items;

            }


            if (
                Array.isArray(
                    data?.result
                )
            ) {

                return data.result;

            }


            if (
                Array.isArray(
                    data?.$values
                )
            ) {

                return data.$values;

            }


            return [];

        };


    // ========================================================
    // LOAD MASTER DATA
    // ========================================================

    const loadMasterData =
        async () => {

            try {

                const [
                    brandsResponse,
                    categoriesResponse,
                    productTypesResponse
                ] = await Promise.all([

                    // -----------------------------------------
                    // BRANDS
                    // -----------------------------------------

                    axios.get(
                        `${SERVER_URL}/api/catalog/brands`
                    ),

                    // -----------------------------------------
                    // CATEGORIES
                    // -----------------------------------------

                    axios.get(
                        `${SERVER_URL}/api/catalog/categories`
                    ),

                    // -----------------------------------------
                    // PRODUCT TYPES
                    // -----------------------------------------

                    axios.get(
                        `${SERVER_URL}/api/product-types`
                    )

                ]);


                setBrands(
                    extractArray(
                        brandsResponse.data
                    )
                );


                setCategories(
                    extractArray(
                        categoriesResponse.data
                    )
                );


                setProductTypes(
                    extractArray(
                        productTypesResponse.data
                    )
                );

            }
            catch (err) {

                console.error(
                    "MASTER DATA ERROR:",
                    err
                );

                setError(
                    "Failed to load brands, categories or product types."
                );

            }

        };


    // ========================================================
    // LOAD EXISTING PRODUCT
    // ========================================================
    //
    // Product ID comes from CatalogList.
    //
    // Example:
    //
    // id = 6
    // sellerId = 6
    // customerId = 3
    //
    // GET:
    //
    // http://localhost:5000/api/catalog/products/6
    //
    // Query:
    //
    // sellerId=6
    // customerId=3
    // ========================================================

    const loadProduct =
        async () => {

            // ------------------------------------------------
            // CLEAR OLD MESSAGES
            // ------------------------------------------------

            setError("");

            setSuccess("");


            // ------------------------------------------------
            // VALIDATE PRODUCT ID
            // ------------------------------------------------

            if (!id) {

                setError(
                    "Product ID is missing."
                );

                setLoading(false);

                return;

            }


            // ------------------------------------------------
            // VALIDATE SELLER ID
            // ------------------------------------------------

            if (!sellerId) {

                setError(
                    "Seller ID is missing from the edit URL."
                );

                setLoading(false);

                return;

            }


            // ------------------------------------------------
            // VALIDATE CUSTOMER ID
            // ------------------------------------------------

            if (!customerId) {

                setError(
                    "Customer ID is missing from the edit URL."
                );

                setLoading(false);

                return;

            }


            try {

                setLoading(true);


                // =================================================
                // GET PRODUCT FROM NODE
                // =================================================

                const response =
                    await axios.get(

                        `${SERVER_URL}/api/catalog/products/${id}`,

                        {

                            params: {

                                sellerId:
                                    Number(
                                        sellerId
                                    ),

                                customerId:
                                    Number(
                                        customerId
                                    )

                            },

                            headers: {

                                Accept:
                                    "application/json"

                            }

                        }

                    );


                // =================================================
                // DEBUG
                // =================================================

                console.log(
                    "========================================"
                );

                console.log(
                    "EDIT PRODUCT FETCH"
                );

                console.log(
                    "Product ID:",
                    id
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
                    "HTTP STATUS:",
                    response.status
                );

                console.log(
                    "RAW PRODUCT RESPONSE:",
                    response.data
                );

                console.log(
                    "========================================"
                );


                // =================================================
                // GET PRODUCT OBJECT
                // =================================================

                const product =
                    response.data?.data ??
                    response.data?.product ??
                    response.data;


                // =================================================
                // VALIDATE PRODUCT
                // =================================================

                if (
                    !product ||
                    typeof product !== "object"
                ) {

                    setError(
                        "Product data was not returned by the API."
                    );

                    return;

                }


                // =================================================
                // POPULATE FORM
                // =================================================

                setForm({

                    // ---------------------------------------------
                    // IDs
                    // ---------------------------------------------

                    productId:
                        product.productId ??
                        product.ProductId ??
                        id,

                    sellerId:
                        product.sellerId ??
                        product.SellerId ??
                        sellerId,

                    customerId:
                        product.customerId ??
                        product.CustomerId ??
                        customerId,


                    // ---------------------------------------------
                    // SKU
                    // ---------------------------------------------

                    sku:
                        product.sku ??
                        product.SKU ??
                        product.Sku ??
                        "",


                    // ---------------------------------------------
                    // PRODUCT NAME
                    // ---------------------------------------------

                    productName:
                        product.productName ??
                        product.ProductName ??
                        "",


                    // ---------------------------------------------
                    // DESCRIPTION
                    // ---------------------------------------------

                    description:
                        product.description ??
                        product.Description ??
                        "",


                    // ---------------------------------------------
                    // BRAND
                    // ---------------------------------------------

                    brandId:
                        product.brandId ??
                        product.BrandId ??
                        product.brand?.brandId ??
                        product.brand?.BrandId ??
                        "",


                    // ---------------------------------------------
                    // CATEGORY
                    // ---------------------------------------------

                    categoryId:
                        product.categoryId ??
                        product.CategoryId ??
                        product.category?.categoryId ??
                        product.category?.CategoryId ??
                        "",


                    // ---------------------------------------------
                    // PRODUCT TYPE
                    // ---------------------------------------------

                    productTypeId:
                        product.productTypeId ??
                        product.ProductTypeId ??
                        product.productType?.productTypeId ??
                        product.productType?.ProductTypeId ??
                        "",


                    // ---------------------------------------------
                    // ACTIVE
                    // ---------------------------------------------

                    isActive:
                        product.isActive ??
                        product.IsActive ??
                        true

                });


                // =================================================
                // SUCCESS
                // =================================================

                setSuccess(
                    "Product data loaded successfully."
                );

            }
            catch (err) {

                console.error(
                    "========================================"
                );

                console.error(
                    "LOAD PRODUCT ERROR"
                );

                console.error(
                    "STATUS:",
                    err?.response?.status
                );

                console.error(
                    "RESPONSE:",
                    err?.response?.data
                );

                console.error(
                    "========================================"
                );


                setError(

                    err?.response?.data?.message ||

                    err?.response?.data?.title ||

                    err?.response?.data?.error ||

                    err?.message ||

                    "Failed to load product."

                );

            }
            finally {

                setLoading(false);

            }

        };


    // ========================================================
    // INITIAL LOAD
    //
    // Automatically fetch:
    //
    // 1. Master data
    // 2. Existing product
    //
    // ========================================================

    useEffect(
        () => {

            loadMasterData();

            loadProduct();

        },
        [
            id,
            sellerId,
            customerId
        ]
    );


    // ========================================================
    // EXECUTE CLEAR
    // ========================================================

    const ExecuteClear =
        () => {

            setForm({

                // Keep automatically populated IDs
                productId:
                    id || "",

                sellerId:
                    sellerId || "",

                customerId:
                    customerId || "",


                // Clear editable data
                sku: "",

                productName: "",

                description: "",

                brandId: "",

                categoryId: "",

                productTypeId: "",

                isActive: true

            });


            setError("");

            setSuccess("");

        };


    // ========================================================
    // EXECUTE UPDATE
    // ========================================================

    const ExecuteUpdate =
        async () => {

            setError("");

            setSuccess("");


            // =================================================
            // VALIDATION
            // =================================================

            if (!id) {

                setError(
                    "Product ID is missing."
                );

                return;

            }


            if (!form.sellerId) {

                setError(
                    "Seller ID is missing."
                );

                return;

            }


            if (!form.customerId) {

                setError(
                    "Customer ID is missing."
                );

                return;

            }


            if (!form.sku.trim()) {

                setError(
                    "SKU is required."
                );

                return;

            }


            if (!form.productName.trim()) {

                setError(
                    "Product Name is required."
                );

                return;

            }


            if (!form.brandId) {

                setError(
                    "Brand is required."
                );

                return;

            }


            if (!form.categoryId) {

                setError(
                    "Category is required."
                );

                return;

            }


            if (!form.productTypeId) {

                setError(
                    "Product Type is required."
                );

                return;

            }


            try {

                setSaving(true);


                // =================================================
                // EXACT PUT BODY
                // =================================================

                const requestBody = {

                    sku:
                        form.sku.trim(),

                    productName:
                        form.productName.trim(),

                    description:
                        form.description.trim(),

                    brandId:
                        Number(
                            form.brandId
                        ),

                    categoryId:
                        Number(
                            form.categoryId
                        ),

                    productTypeId:
                        Number(
                            form.productTypeId
                        ),

                    isActive:
                        Boolean(
                            form.isActive
                        )

                };


                // =================================================
                // DEBUG
                // =================================================

                console.log(
                    "========================================"
                );

                console.log(
                    "UPDATE CATALOG PRODUCT"
                );

                console.log(
                    "Product ID:",
                    id
                );

                console.log(
                    "Seller ID:",
                    form.sellerId
                );

                console.log(
                    "Customer ID:",
                    form.customerId
                );

                console.log(
                    "PUT BODY:",
                    requestBody
                );

                console.log(
                    "========================================"
                );


                // =================================================
                // PUT
                // =================================================

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
                                    )

                            },

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Accept:
                                    "application/json"

                            }

                        }

                    );


                console.log(
                    "UPDATE RESPONSE:",
                    response.data
                );


                setSuccess(
                    "Product updated successfully."
                );

            }
            catch (err) {

                console.error(
                    "UPDATE PRODUCT ERROR:",
                    err
                );


                setError(

                    err?.response?.data?.message ||

                    err?.response?.data?.title ||

                    err?.response?.data?.error ||

                    err?.message ||

                    "Unable to update product."

                );

            }
            finally {

                setSaving(false);

            }

        };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2
                }}
            >

                <CircularProgress />

                <Typography>
                    Loading catalog product...
                </Typography>

            </Box>

        );

    }


    // ========================================================
    // UI
    // ========================================================

    return (

        <Paper
            elevation={3}
            sx={{
                p: 3,
                m: 2
            }}
        >

            {/* =================================================
                TITLE
            ================================================== */}

            <Typography
                variant="h5"
                sx={{
                    mb: 3,
                    fontWeight: "bold"
                }}
            >

                Edit Catalog Product

            </Typography>


            {/* =================================================
                ERROR
            ================================================== */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 2
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
            ================================================== */}

            {success && (

                <Alert
                    severity="success"
                    sx={{
                        mb: 2
                    }}
                >

                    {success}

                </Alert>

            )}


            <Grid
                container
                spacing={2}
            >

                {/* =================================================
                    PRODUCT ID
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <TextField

                        fullWidth

                        label="Product ID"

                        value={
                            form.productId
                        }

                        disabled

                    />

                </Grid>


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

                        label="Seller ID"

                        value={
                            form.sellerId
                        }

                        disabled

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

                        label="Customer ID"

                        value={
                            form.customerId
                        }

                        disabled

                    />

                </Grid>


                {/* =================================================
                    SKU
                ================================================= */}

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


                {/* =================================================
                    PRODUCT NAME
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <TextField

                        fullWidth

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

                        rows={4}

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
                    BRAND
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <FormControl
                        fullWidth
                    >

                        <InputLabel>
                            Brand
                        </InputLabel>

                        <Select

                            name="brandId"

                            label="Brand"

                            value={
                                form.brandId
                            }

                            onChange={
                                handleChange
                            }

                        >

                            {brands.map(
                                (brand) => (

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
                                            brand.BrandName ??
                                            brand.name ??
                                            brand.Name
                                        }

                                    </MenuItem>

                                )
                            )}

                        </Select>

                    </FormControl>

                </Grid>


                {/* =================================================
                    CATEGORY
                ================================================== */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <FormControl
                        fullWidth
                    >

                        <InputLabel>
                            Category
                        </InputLabel>

                        <Select

                            name="categoryId"

                            label="Category"

                            value={
                                form.categoryId
                            }

                            onChange={
                                handleChange
                            }

                        >

                            {categories.map(
                                (category) => (

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
                                            category.CategoryName ??
                                            category.name ??
                                            category.Name
                                        }

                                    </MenuItem>

                                )
                            )}

                        </Select>

                    </FormControl>

                </Grid>


                {/* =================================================
                    PRODUCT TYPE
                ================================================== */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <FormControl
                        fullWidth
                    >

                        <InputLabel>
                            Product Type
                        </InputLabel>

                        <Select

                            name="productTypeId"

                            label="Product Type"

                            value={
                                form.productTypeId
                            }

                            onChange={
                                handleChange
                            }

                        >

                            {productTypes.map(
                                (type) => (

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
                                            type.ProductTypeName ??
                                            type.name ??
                                            type.Name
                                        }

                                    </MenuItem>

                                )
                            )}

                        </Select>

                    </FormControl>

                </Grid>


                {/* =================================================
                    ACTIVE
                ================================================== */}

                <Grid
                    item
                    xs={12}
                >

                    <FormControlLabel

                        control={

                            <Switch

                                name="isActive"

                                checked={
                                    Boolean(
                                        form.isActive
                                    )
                                }

                                onChange={
                                    handleChange
                                }

                            />

                        }

                        label="Is Active"

                    />

                </Grid>


                {/* =================================================
                    BUTTONS
                ================================================== */}

                <Grid
                    item
                    xs={12}
                >

                    <Grid
                        container
                        spacing={2}
                    >

                        {/* CLEAR */}

                        <Grid
                            item
                        >

                            <Button

                                variant="outlined"

                                startIcon={
                                    <Clear />
                                }

                                onClick={
                                    ExecuteClear
                                }

                            >

                                Clear

                            </Button>

                        </Grid>


                        {/* CANCEL */}

                        <Grid
                            item
                        >

                            <Button

                                variant="outlined"

                                startIcon={
                                    <ArrowBack />
                                }

                                onClick={() =>
                                    navigate(
                                        "/catalog"
                                    )
                                }

                            >

                                Cancel

                            </Button>

                        </Grid>


                        {/* UPDATE */}

                        <Grid
                            item
                        >

                            <Button

                                variant="contained"

                                startIcon={
                                    saving
                                        ? (
                                            <CircularProgress
                                                size={18}
                                            />
                                        )
                                        : (
                                            <Save />
                                        )
                                }

                                onClick={
                                    ExecuteUpdate
                                }

                                disabled={
                                    saving
                                }

                            >

                                {
                                    saving
                                        ? "Updating..."
                                        : "Execute Update"
                                }

                            </Button>

                        </Grid>

                    </Grid>

                </Grid>

            </Grid>

        </Paper>

    );

};


// ============================================================
// EXPORT
// ============================================================

export default CatalogEdit;
