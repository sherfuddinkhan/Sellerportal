// =========================================================
// ProductInventoryCreate.jsx
// Create Product Inventory
// React -> Node server.js -> ASP.NET Core API
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
    Grid,
    MenuItem,
    Paper,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Save,
} from "@mui/icons-material";

import axios from "axios";

import {
    useNavigate,
} from "react-router-dom";


// =========================================================
// SERVER CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";

const INVENTORY_API =
    `${SERVER_URL}/api/product-inventory`;

const PRODUCT_API =
    `${SERVER_URL}/api/product`;

const WAREHOUSE_API =
    `${SERVER_URL}/api/warehouse`;


// =========================================================
// DEFAULT VALUES
// =========================================================

const INITIAL_FORM = {

    sellerId: 6,

    customerId: 3,

    productId: "",

    warehouseId: "",

    quantity: 0,

    reorderLevel: 0,

    reservedQuantity: 0,

    stockStatus: "Available",

    isActive: true,

};


// =========================================================
// COMPONENT
// =========================================================

const ProductInventoryCreate = () => {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [formData, setFormData] =
        useState(INITIAL_FORM);

    const [products, setProducts] =
        useState([]);

    const [warehouses, setWarehouses] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [loadingProducts, setLoadingProducts] =
        useState(false);

    const [loadingWarehouses, setLoadingWarehouses] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;


        setFormData((previous) => ({

            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,

        }));

    };


    // =====================================================
    // LOAD PRODUCTS
    // =====================================================

    const loadProducts = async () => {

        try {

            setLoadingProducts(true);

            const response = await axios.get(
                `${PRODUCT_API}`
            );

            const data = response.data;


            if (Array.isArray(data)) {

                setProducts(data);

            }

            else if (Array.isArray(data?.data)) {

                setProducts(data.data);

            }

            else if (Array.isArray(data?.products)) {

                setProducts(data.products);

            }

            else {

                setProducts([]);

            }

        }

        catch (err) {

            console.error(
                "Load Products Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load products."
            );

        }

        finally {

            setLoadingProducts(false);

        }

    };


    // =====================================================
    // LOAD WAREHOUSES
    // =====================================================

    const loadWarehouses = async () => {

        try {

            setLoadingWarehouses(true);

            const response = await axios.get(
                `${WAREHOUSE_API}`
            );

            const data = response.data;


            if (Array.isArray(data)) {

                setWarehouses(data);

            }

            else if (Array.isArray(data?.data)) {

                setWarehouses(data.data);

            }

            else if (Array.isArray(data?.warehouses)) {

                setWarehouses(data.warehouses);

            }

            else {

                setWarehouses([]);

            }

        }

        catch (err) {

            console.error(
                "Load Warehouses Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load warehouses."
            );

        }

        finally {

            setLoadingWarehouses(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadProducts();

        loadWarehouses();

    }, []);


    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm = () => {

        if (!formData.productId) {

            setError(
                "Please select a product."
            );

            return false;

        }


        if (!formData.warehouseId) {

            setError(
                "Please select a warehouse."
            );

            return false;

        }


        const quantity =
            Number(formData.quantity);

        if (quantity < 0) {

            setError(
                "Quantity cannot be negative."
            );

            return false;

        }


        const reorderLevel =
            Number(formData.reorderLevel);

        if (reorderLevel < 0) {

            setError(
                "Reorder level cannot be negative."
            );

            return false;

        }


        const reservedQuantity =
            Number(formData.reservedQuantity);

        if (reservedQuantity < 0) {

            setError(
                "Reserved quantity cannot be negative."
            );

            return false;

        }


        if (
            reservedQuantity >
            quantity
        ) {

            setError(
                "Reserved quantity cannot be greater than quantity."
            );

            return false;

        }


        return true;

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        if (!validateForm()) {

            return;

        }


        try {

            setLoading(true);

            setError("");


            // =================================================
            // PREPARE PAYLOAD
            // =================================================

            const payload = {

                sellerId:
                    Number(formData.sellerId),

                customerId:
                    Number(formData.customerId),

                productId:
                    Number(formData.productId),

                warehouseId:
                    Number(formData.warehouseId),

                quantity:
                    Number(formData.quantity),

                reorderLevel:
                    Number(formData.reorderLevel),

                reservedQuantity:
                    Number(formData.reservedQuantity),

                stockStatus:
                    formData.stockStatus,

                isActive:
                    Boolean(formData.isActive),

            };


            console.log(
                "Creating Product Inventory:",
                payload
            );


            // =================================================
            // POST
            // =================================================

            await axios.post(
                INVENTORY_API,
                payload
            );


            setSuccess(
                "Product inventory created successfully."
            );


            // =================================================
            // REDIRECT
            // =================================================

            setTimeout(() => {

                navigate(
                    "/product-inventory",
                    {
                        replace: true,
                    }
                );

            }, 1000);

        }

        catch (err) {

            console.error(
                "Create Product Inventory Error:",
                err
            );


            const responseData =
                err?.response?.data;


            if (
                typeof responseData ===
                "string"
            ) {

                setError(
                    responseData
                );

            }

            else if (
                responseData?.message
            ) {

                setError(
                    responseData.message
                );

            }

            else if (
                responseData?.title
            ) {

                setError(
                    responseData.title
                );

            }

            else {

                setError(
                    "Failed to create product inventory."
                );

            }

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // RESET
    // =====================================================

    const handleReset = () => {

        setFormData({
            ...INITIAL_FORM,
        });

        setError("");

    };


    // =====================================================
    // BACK
    // =====================================================

    const handleBack = () => {

        navigate(
            "/product-inventory"
        );

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                maxWidth: "1100px",
                margin: "0 auto",
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        Create Product Inventory
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Add inventory stock for a product
                        and warehouse.
                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    disabled={loading}
                >
                    Back
                </Button>

            </Box>


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

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    <Grid
                        container
                        spacing={2.5}
                    >

                        {/* =========================================
                            SELLER ID
                        ========================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                label="Seller ID"
                                name="sellerId"
                                type="number"
                                value={formData.sellerId}
                                onChange={handleChange}
                                required
                            />

                        </Grid>


                        {/* =========================================
                            CUSTOMER ID
                        ========================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                label="Customer ID"
                                name="customerId"
                                type="number"
                                value={formData.customerId}
                                onChange={handleChange}
                                required
                            />

                        </Grid>


                        {/* =========================================
                            PRODUCT
                        ========================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                select
                                fullWidth
                                label="Product"
                                name="productId"
                                value={formData.productId}
                                onChange={handleChange}
                                required
                            >

                                <MenuItem value="">
                                    Select Product
                                </MenuItem>

                                {loadingProducts ? (

                                    <MenuItem disabled>
                                        Loading products...
                                    </MenuItem>

                                ) : (

                                    products.map((product) => {

                                        const id =
                                            product.productId ??
                                            product.ProductId;

                                        const name =
                                            product.productName ??
                                            product.ProductName ??
                                            `Product ${id}`;

                                        return (

                                            <MenuItem
                                                key={id}
                                                value={id}
                                            >
                                                {name}
                                            </MenuItem>

                                        );

                                    })

                                )}

                            </TextField>

                        </Grid>


                        {/* =========================================
                            WAREHOUSE
                        ========================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                select
                                fullWidth
                                label="Warehouse"
                                name="warehouseId"
                                value={formData.warehouseId}
                                onChange={handleChange}
                                required
                            >

                                <MenuItem value="">
                                    Select Warehouse
                                </MenuItem>

                                {loadingWarehouses ? (

                                    <MenuItem disabled>
                                        Loading warehouses...
                                    </MenuItem>

                                ) : (

                                    warehouses.map((warehouse) => {

                                        const id =
                                            warehouse.warehouseId ??
                                            warehouse.WarehouseId;

                                        const name =
                                            warehouse.warehouseName ??
                                            warehouse.WarehouseName ??
                                            warehouse.warehouseCode ??
                                            warehouse.WarehouseCode ??
                                            `Warehouse ${id}`;

                                        return (

                                            <MenuItem
                                                key={id}
                                                value={id}
                                            >
                                                {name}
                                            </MenuItem>

                                        );

                                    })

                                )}

                            </TextField>

                        </Grid>


                        {/* =========================================
                            QUANTITY
                        ========================================== */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="Quantity"
                                name="quantity"
                                type="number"
                                value={formData.quantity}
                                onChange={handleChange}
                                inputProps={{
                                    min: 0,
                                }}
                                required
                            />

                        </Grid>


                        {/* =========================================
                            REORDER LEVEL
                        ========================================== */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="Reorder Level"
                                name="reorderLevel"
                                type="number"
                                value={formData.reorderLevel}
                                onChange={handleChange}
                                inputProps={{
                                    min: 0,
                                }}
                            />

                        </Grid>


                        {/* =========================================
                            RESERVED QUANTITY
                        ========================================== */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="Reserved Quantity"
                                name="reservedQuantity"
                                type="number"
                                value={formData.reservedQuantity}
                                onChange={handleChange}
                                inputProps={{
                                    min: 0,
                                }}
                            />

                        </Grid>


                        {/* =========================================
                            STOCK STATUS
                        ========================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                select
                                fullWidth
                                label="Stock Status"
                                name="stockStatus"
                                value={formData.stockStatus}
                                onChange={handleChange}
                            >

                                <MenuItem value="Available">
                                    Available
                                </MenuItem>

                                <MenuItem value="Low Stock">
                                    Low Stock
                                </MenuItem>

                                <MenuItem value="Out of Stock">
                                    Out of Stock
                                </MenuItem>

                            </TextField>

                        </Grid>


                        {/* =========================================
                            ACTIVE STATUS
                        ========================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                select
                                fullWidth
                                label="Status"
                                name="isActive"
                                value={
                                    formData.isActive
                                        ? "true"
                                        : "false"
                                }
                                onChange={(event) => {

                                    setFormData(
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


                        {/* =========================================
                            BUTTONS
                        ========================================== */}

                        <Grid
                            item
                            xs={12}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: 2,
                                    mt: 2,
                                }}
                            >

                                <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={handleReset}
                                    disabled={loading}
                                >
                                    Reset
                                </Button>


                                <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={handleBack}
                                    disabled={loading}
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
                                                    size={18}
                                                    color="inherit"
                                                />
                                            )
                                            : (
                                                <Save />
                                            )
                                    }
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Saving..."
                                        : "Create Inventory"}
                                </Button>

                            </Box>

                        </Grid>

                    </Grid>

                </Box>

            </Paper>


            {/* =================================================
                ERROR
            ================================================= */}

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={5000}
                onClose={() => setError("")}
            >

                <Alert
                    severity="error"
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>

            </Snackbar>


            {/* =================================================
                SUCCESS
            ================================================= */}

            <Snackbar
                open={Boolean(success)}
                autoHideDuration={3000}
                onClose={() => setSuccess("")}
            >

                <Alert
                    severity="success"
                    onClose={() => setSuccess("")}
                >
                    {success}
                </Alert>

            </Snackbar>

        </Box>

    );

};


// =========================================================
// EXPORT
// =========================================================

export default ProductInventoryCreate;

