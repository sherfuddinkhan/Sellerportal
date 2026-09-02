// =========================================================
// StockAdjustmentCreate.jsx
// Create Stock Adjustment
// =========================================================

import React, {
    useState
} from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    Paper,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

import {
    useNavigate
} from "react-router-dom";


// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";


// =========================================================
// COMPONENT
// =========================================================

const StockAdjustmentCreate = () => {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] = useState({

        sellerId: "",

        customerId: "",

        productId: "",

        warehouseId: "",

        adjustmentType: "",

        quantity: "",

        adjustmentDate:
            new Date()
                .toISOString()
                .slice(0, 10),

        remarks: ""

    });


    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData(
            previous => ({
                ...previous,
                [name]: value
            })
        );


        // Clear error while editing

        if (error) {

            setError("");

        }

    };


    // =====================================================
    // VALIDATE FORM
    // =====================================================

    const validateForm = () => {

        // -------------------------------------------------
        // SELLER
        // -------------------------------------------------

        if (!formData.sellerId) {

            setError(
                "Seller ID is required."
            );

            return false;

        }


        if (
            Number(formData.sellerId) <= 0
        ) {

            setError(
                "Seller ID must be greater than 0."
            );

            return false;

        }


        // -------------------------------------------------
        // PRODUCT
        // -------------------------------------------------

        if (!formData.productId) {

            setError(
                "Product ID is required."
            );

            return false;

        }


        if (
            Number(formData.productId) <= 0
        ) {

            setError(
                "Product ID must be greater than 0."
            );

            return false;

        }


        // -------------------------------------------------
        // WAREHOUSE
        // -------------------------------------------------

        if (!formData.warehouseId) {

            setError(
                "Warehouse ID is required."
            );

            return false;

        }


        if (
            Number(formData.warehouseId) <= 0
        ) {

            setError(
                "Warehouse ID must be greater than 0."
            );

            return false;

        }


        // -------------------------------------------------
        // ADJUSTMENT TYPE
        // -------------------------------------------------

        if (
            !formData.adjustmentType.trim()
        ) {

            setError(
                "Adjustment type is required."
            );

            return false;

        }


        // -------------------------------------------------
        // QUANTITY
        // -------------------------------------------------

        if (
            formData.quantity === ""
        ) {

            setError(
                "Quantity is required."
            );

            return false;

        }


        if (
            Number(formData.quantity) <= 0
        ) {

            setError(
                "Quantity must be greater than 0."
            );

            return false;

        }


        // -------------------------------------------------
        // DATE
        // -------------------------------------------------

        if (
            !formData.adjustmentDate
        ) {

            setError(
                "Adjustment date is required."
            );

            return false;

        }


        return true;

    };


    // =====================================================
    // CREATE
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
            // PAYLOAD
            // =================================================

            const payload = {

                sellerId:
                    Number(
                        formData.sellerId
                    ),

                customerId:
                    formData.customerId
                        ? Number(
                            formData.customerId
                        )
                        : null,

                productId:
                    Number(
                        formData.productId
                    ),

                warehouseId:
                    Number(
                        formData.warehouseId
                    ),

                adjustmentType:
                    formData.adjustmentType.trim(),

                quantity:
                    Number(
                        formData.quantity
                    ),

                adjustmentDate:
                    formData.adjustmentDate,

                remarks:
                    formData.remarks.trim() ||
                    null

            };


            console.log(
                "Creating Stock Adjustment:",
                payload
            );


            // =================================================
            // POST REQUEST
            // =================================================

            const response = await fetch(
                `${SERVER_URL}/api/stock-adjustments`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );


            // =================================================
            // HANDLE ERROR
            // =================================================

            if (!response.ok) {

                const text =
                    await response.text();


                let message =
                    `Create failed. Status: ${response.status}`;


                try {

                    const errorData =
                        JSON.parse(text);


                    message =
                        errorData.message ||
                        errorData.title ||
                        errorData.errors
                            ? JSON.stringify(
                                errorData.errors
                            )
                            : message;

                }

                catch {

                    if (text) {

                        message = text;

                    }

                }


                throw new Error(
                    message
                );

            }


            // =================================================
            // RESPONSE
            // =================================================

            let result = null;

            const responseText =
                await response.text();


            if (responseText) {

                try {

                    result =
                        JSON.parse(
                            responseText
                        );

                }

                catch {

                    result =
                        responseText;

                }

            }


            console.log(
                "Stock Adjustment Created:",
                result
            );


            // =================================================
            // SUCCESS
            // =================================================

            setSuccess(
                "Stock adjustment created successfully."
            );


            // =================================================
            // REDIRECT
            // =================================================

            setTimeout(() => {

                navigate(
                    "/stock-adjustments"
                );

            }, 1000);

        }

        catch (err) {

            console.error(
                "Create Stock Adjustment Error:",
                err
            );

            setError(
                err.message ||
                "Failed to create stock adjustment."
            );

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // BACK
    // =====================================================

    const handleBack = () => {

        if (loading) {

            return;

        }


        navigate(
            "/stock-adjustments"
        );

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Container
            maxWidth="lg"
            sx={{
                py: 3
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center"
                    },
                    flexDirection: {
                        xs: "column",
                        sm: "row"
                    },
                    gap: 2,
                    mb: 3
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Create Stock Adjustment
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Add a new inventory stock adjustment
                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={
                        handleBack
                    }
                    disabled={loading}
                >
                    Back
                </Button>

            </Box>


            {/* =================================================
                ERROR
            ================================================= */}

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
                FORM
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: {
                        xs: 2,
                        md: 4
                    }
                }}
            >

                <Box
                    component="form"
                    onSubmit={
                        handleSubmit
                    }
                >

                    <Grid
                        container
                        spacing={3}
                    >

                        {/* =====================================
                            SELLER ID
                        ===================================== */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >

                            <TextField
                                fullWidth
                                required
                                type="number"
                                name="sellerId"
                                label="Seller ID"
                                placeholder="Enter seller ID"
                                value={
                                    formData.sellerId
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1
                                }}
                            />

                        </Grid>


                        {/* =====================================
                            CUSTOMER ID
                        ===================================== */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                name="customerId"
                                label="Customer ID"
                                placeholder="Enter customer ID"
                                value={
                                    formData.customerId
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1
                                }}
                            />

                        </Grid>


                        {/* =====================================
                            PRODUCT ID
                        ===================================== */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >

                            <TextField
                                fullWidth
                                required
                                type="number"
                                name="productId"
                                label="Product ID"
                                placeholder="Enter product ID"
                                value={
                                    formData.productId
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1
                                }}
                            />

                        </Grid>


                        {/* =====================================
                            WAREHOUSE ID
                        ===================================== */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >

                            <TextField
                                fullWidth
                                required
                                type="number"
                                name="warehouseId"
                                label="Warehouse ID"
                                placeholder="Enter warehouse ID"
                                value={
                                    formData.warehouseId
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1
                                }}
                            />

                        </Grid>


                        {/* =====================================
                            ADJUSTMENT TYPE
                        ===================================== */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >

                            <TextField
                                fullWidth
                                required
                                name="adjustmentType"
                                label="Adjustment Type"
                                placeholder="Damage / Loss / Found / Correction"
                                value={
                                    formData.adjustmentType
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>


                        {/* =====================================
                            QUANTITY
                        ===================================== */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >

                            <TextField
                                fullWidth
                                required
                                type="number"
                                name="quantity"
                                label="Quantity"
                                placeholder="Enter quantity"
                                value={
                                    formData.quantity
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1,
                                    step: 1
                                }}
                            />

                        </Grid>


                        {/* =====================================
                            ADJUSTMENT DATE
                        ===================================== */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >

                            <TextField
                                fullWidth
                                required
                                type="date"
                                name="adjustmentDate"
                                label="Adjustment Date"
                                value={
                                    formData.adjustmentDate
                                }
                                onChange={
                                    handleChange
                                }
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />

                        </Grid>


                        {/* =====================================
                            REMARKS
                        ===================================== */}

                        <Grid
                            size={12}
                        >

                            <TextField
                                fullWidth
                                multiline
                                minRows={4}
                                name="remarks"
                                label="Remarks"
                                placeholder="Enter reason or remarks for this stock adjustment"
                                value={
                                    formData.remarks
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>


                        {/* =====================================
                            ACTIONS
                        ===================================== */}

                        <Grid
                            size={12}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: 2,
                                    pt: 1
                                }}
                            >

                                <Button
                                    type="button"
                                    variant="outlined"
                                    startIcon={
                                        <ArrowBack />
                                    }
                                    onClick={
                                        handleBack
                                    }
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
                                        ? "Creating..."
                                        : "Create Stock Adjustment"}
                                </Button>

                            </Box>

                        </Grid>

                    </Grid>

                </Box>

            </Paper>


            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            <Snackbar
                open={
                    Boolean(success)
                }
                autoHideDuration={3000}
                onClose={() =>
                    setSuccess("")
                }
                message={success}
            />

        </Container>

    );

};


// =========================================================
// EXPORT
// =========================================================

export default StockAdjustmentCreate;

