// =========================================================
// CatalogForm.jsx
// Create + Edit Catalog / Product
// SellerId and CustomerId come from CatalogList navigation
// =========================================================

import React, { useEffect, useState } from "react";

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
    useSearchParams,
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
    isActive: true,
};


// =========================================================
// RESPONSE ARRAY HELPER
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
// COMPONENT
// =========================================================

const CatalogForm = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [searchParams] = useSearchParams();


    // =====================================================
    // PRODUCT MODE
    // =====================================================

    const isEditMode = Boolean(id);


    // =====================================================
    // SELLER / CUSTOMER FROM URL
    // =====================================================

    const sellerId =
        searchParams.get("sellerId");

    const customerId =
        searchParams.get("customerId");


    // =====================================================
    // VALIDATE SELLER / CUSTOMER
    // =====================================================

    const hasSellerCustomer =
        sellerId &&
        customerId &&
        !Number.isNaN(Number(sellerId)) &&
        !Number.isNaN(Number(customerId));


    // =====================================================
    // STATE
    // =====================================================

    const [form, setForm] =
        useState(initialForm);

    const [brands, setBrands] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [productTypes, setProductTypes] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [loadingBrands, setLoadingBrands] =
        useState(false);

    const [loadingCategories, setLoadingCategories] =
        useState(false);

    const [loadingProductTypes, setLoadingProductTypes] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // COMMON QUERY
    // =====================================================

    const query =
        `sellerId=${encodeURIComponent(sellerId)}&customerId=${encodeURIComponent(customerId)}`;


    // =====================================================
    // LOAD BRANDS
    // =====================================================

    const loadBrands = async () => {

        try {

            setLoadingBrands(true);

            console.log(
                "========================================"
            );

            console.log(
                "Loading Brands..."
            );

            const url =
                `${SERVER_URL}/api/catalog/brands?${query}`;

            console.log(
                "GET",
                url
            );

            const response =
                await fetch(url);

            if (!response.ok) {

                throw new Error(
                    `Unable to load brands. HTTP ${response.status}`
                );

            }

            const data =
                await response.json();

            console.log(
                "Brands API response:",
                data
            );

            const result =
                getArrayData(data);

            setBrands(result);

        }
        catch (err) {

            console.error(
                "Brand loading error:",
                err
            );

            setBrands([]);

        }
        finally {

            setLoadingBrands(false);

        }

    };


    // =====================================================
    // LOAD CATEGORIES
    // =====================================================

    const loadCategories = async () => {

        try {

            setLoadingCategories(true);

            console.log(
                "========================================"
            );

            console.log(
                "Loading Categories..."
            );

            const url =
                `${SERVER_URL}/api/catalog/categories?${query}`;

            console.log(
                "GET",
                url
            );

            const response =
                await fetch(url);

            if (!response.ok) {

                throw new Error(
                    `Unable to load categories. HTTP ${response.status}`
                );

            }

            const data =
                await response.json();

            console.log(
                "Categories API response:",
                data
            );

            const result =
                getArrayData(data);

            setCategories(result);

        }
        catch (err) {

            console.error(
                "Category loading error:",
                err
            );

            setCategories([]);

        }
        finally {

            setLoadingCategories(false);

        }

    };


    // =====================================================
    // LOAD PRODUCT TYPES
    // =====================================================

    const loadProductTypes = async () => {

        try {

            setLoadingProductTypes(true);

            console.log(
                "========================================"
            );

            console.log(
                "Loading Product Types..."
            );

            const url =
                `${SERVER_URL}/api/catalog/producttype?${query}`;

            console.log(
                "GET",
                url
            );

            const response =
                await fetch(url);

            if (!response.ok) {

                throw new Error(
                    `Unable to load product types. HTTP ${response.status}`
                );

            }

            const data =
                await response.json();

            console.log(
                "Product Types API response:",
                data
            );

            const result =
                getArrayData(data);

            setProductTypes(result);

        }
        catch (err) {

            console.error(
                "Product type loading error:",
                err
            );

            setProductTypes([]);

        }
        finally {

            setLoadingProductTypes(false);

        }

    };


    // =====================================================
    // LOAD PRODUCT
    // =====================================================

    const loadProduct = async () => {

        if (!isEditMode) {
            return;
        }

        if (!hasSellerCustomer) {

            setError(
                "Seller ID and Customer ID are missing. Please return to Catalog List and select the product again."
            );

            return;
        }

        try {

            setLoading(true);

            setError("");

            const url =
                `${SERVER_URL}/api/catalog/products/${id}?${query}`;

            console.log(
                "========================================"
            );

            console.log(
                "Loading Product..."
            );

            console.log(
                "GET",
                url
            );

            const response =
                await fetch(url, {
                    method: "GET",
                    headers: {
                        Accept:
                            "application/json",
                    },
                });

            console.log(
                "Product response status:",
                response.status
            );

            if (!response.ok) {

                let message =
                    `Unable to load product. HTTP ${response.status}`;

                try {

                    const errorData =
                        await response.json();

                    message =
                        errorData?.message ||
                        errorData?.title ||
                        message;

                }
                catch {
                    // Ignore non-JSON response
                }

                throw new Error(message);

            }

            const data =
                await response.json();

            console.log(
                "Product API response:",
                data
            );


            // =================================================
            // EXTRACT PRODUCT
            // =================================================

            const product =
                data?.data ??
                data?.result ??
                data?.product ??
                data;


            console.log(
                "Product extracted:",
                product
            );


            if (!product) {

                throw new Error(
                    "Product not found."
                );

            }


            // =================================================
            // POPULATE FORM
            // =================================================

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
                    product?.Price ??
                    "",

                quantity:
                    product?.quantity ??
                    product?.Quantity ??
                    "",

                isActive:
                    product?.isActive ??
                    product?.IsActive ??
                    true,

            });

        }
        catch (err) {

            console.error(
                "Product loading error:",
                err
            );

            setError(
                err.message ||
                "Unable to load product."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        if (!hasSellerCustomer) {

            setError(
                "Seller ID and Customer ID are missing. Please return to Catalog List and select the product again."
            );

            return;

        }

        const loadFormData = async () => {

            await Promise.all([
                loadBrands(),
                loadCategories(),
                loadProductTypes(),
            ]);

            await loadProduct();

        };

        loadFormData();

    }, [
        id,
        sellerId,
        customerId,
    ]);


    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setForm(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setSaving(true);

            setError("");

            setSuccess("");


            // =================================================
            // SELLER / CUSTOMER VALIDATION
            // =================================================

            if (!hasSellerCustomer) {

                throw new Error(
                    "Seller ID and Customer ID are missing. Please return to Catalog List and select the product again."
                );

            }


            // =================================================
            // PRODUCT VALIDATION
            // =================================================

            if (!form.productName.trim()) {

                throw new Error(
                    "Product name is required."
                );

            }


            // =================================================
            // REQUEST BODY
            // =================================================

            const requestBody = {

                sellerId:
                    Number(sellerId),

                customerId:
                    Number(customerId),

                productName:
                    form.productName.trim(),

                description:
                    form.description.trim(),

                sku:
                    form.sku.trim(),

                brandId:
                    form.brandId !== ""
                        ? Number(form.brandId)
                        : null,

                categoryId:
                    form.categoryId !== ""
                        ? Number(form.categoryId)
                        : null,

                productTypeId:
                    form.productTypeId !== ""
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
                    Boolean(form.isActive),

            };


            console.log(
                "========================================"
            );

            console.log(
                "Catalog Request Body:",
                requestBody
            );


            // =================================================
            // URL
            // =================================================

            const url =
                isEditMode
                    ? `${SERVER_URL}/api/catalog/${id}?${query}`
                    : `${SERVER_URL}/api/catalog/products`;


            // =================================================
            // METHOD
            // =================================================

            const method =
                isEditMode
                    ? "PUT"
                    : "POST";


            console.log(
                `${method} ${url}`
            );


            // =================================================
            // API REQUEST
            // =================================================

            const response =
                await fetch(
                    url,
                    {
                        method,

                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json",
                        },

                        body:
                            JSON.stringify(
                                requestBody
                            ),
                    }
                );


            // =================================================
            // ERROR RESPONSE
            // =================================================

            if (!response.ok) {

                let message =
                    `Request failed. HTTP ${response.status}`;

                try {

                    const errorData =
                        await response.json();

                    console.error(
                        "API Error:",
                        errorData
                    );

                    message =
                        errorData?.message ||
                        errorData?.title ||
                        errorData?.error ||
                        message;

                }
                catch {
                    // Non JSON response
                }

                throw new Error(message);

            }


            // =================================================
            // RESPONSE
            // =================================================

            let result = null;

            try {

                result =
                    await response.json();

            }
            catch {
                // 204 No Content
            }


            console.log(
                "Catalog save response:",
                result
            );


            // =================================================
            // SUCCESS
            // =================================================

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
                    `/catalog?sellerId=${sellerId}&customerId=${customerId}`
                );

            }, 800);

        }
        catch (err) {

            console.error(
                "Catalog save error:",
                err
            );

            setError(
                err.message ||
                "Unable to save product."
            );

        }
        finally {

            setSaving(false);

        }

    };


    // =====================================================
    // MISSING SELLER / CUSTOMER
    // =====================================================

    if (!hasSellerCustomer) {

        return (

            <Box
                sx={{
                    p: 3,
                }}
            >

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    Seller ID and Customer ID are missing.
                    Please return to Catalog List and
                    select the product again.
                </Alert>


                <Button
                    variant="contained"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/catalog")
                    }
                >
                    Return to Catalog List
                </Button>

            </Box>

        );

    }


    // =====================================================
    // LOADING
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
                    justifyContent: "center",
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
                    alignItems: "center",
                    gap: 2,
                    mb: 3,
                }}
            >

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            `/catalog?sellerId=${sellerId}&customerId=${customerId}`
                        )
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


                    <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mt: 0.5 }}
                    >
                        Seller ID: {sellerId} |
                        Customer ID: {customerId}
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
                    p: 3,
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >

                <Box
                    component="form"
                    onSubmit={handleSubmit}
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


                    <Divider sx={{ my: 3 }} />


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
                                helperText={
                                    loadingBrands
                                        ? "Loading brands..."
                                        : brands.length === 0
                                            ? "No brands available"
                                            : `${brands.length} brand(s) available`
                                }
                            >

                                <MenuItem value="">
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
                                                key={brandId}
                                                value={brandId}
                                            >
                                                {brandName ||
                                                    `Brand ${brandId}`}
                                            </MenuItem>

                                        );

                                    }
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
                                helperText={
                                    loadingCategories
                                        ? "Loading categories..."
                                        : categories.length === 0
                                            ? "No categories available"
                                            : `${categories.length} categor${categories.length === 1 ? "y" : "ies"} available`
                                }
                            >

                                <MenuItem value="">
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
                                                key={categoryId}
                                                value={categoryId}
                                            >
                                                {categoryName ||
                                                    `Category ${categoryId}`}
                                            </MenuItem>

                                        );

                                    }
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
                                helperText={
                                    loadingProductTypes
                                        ? "Loading product types..."
                                        : productTypes.length === 0
                                            ? "No product types available"
                                            : `${productTypes.length} product type(s) available`
                                }
                            >

                                <MenuItem value="">
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
                                                key={typeId}
                                                value={typeId}
                                            >
                                                {typeName ||
                                                    `Product Type ${typeId}`}
                                            </MenuItem>

                                        );

                                    }
                                )}

                            </TextField>

                        </Grid>

                    </Grid>


                    <Divider sx={{ my: 3 }} />


                    {/* =================================================
                        PRICE & INVENTORY
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
                                    step: "0.01",
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
                                    min: 0,
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
                                        (previous) => ({
                                            ...previous,
                                            isActive:
                                                event.target.value ===
                                                "true",
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
                            mt: 4,
                        }}
                    >

                        <Button
                            variant="outlined"
                            onClick={() =>
                                navigate(
                                    `/catalog?sellerId=${sellerId}&customerId=${customerId}`
                                )
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
                            disabled={saving}
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
