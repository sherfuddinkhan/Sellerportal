// =========================================================
// StockAdjustmentEdit.jsx
// Edit Stock Adjustment
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
    useNavigate,
    useParams
} from "react-router-dom";


// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";


// =========================================================
// COMPONENT
// =========================================================

const StockAdjustmentEdit = () => {

    const navigate = useNavigate();

    const { id } = useParams();


    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // FORM
    // =====================================================

    const [formData, setFormData] = useState({

        stockAdjustmentId: "",

        sellerId: "",

        customerId: "",

        productId: "",

        warehouseId: "",

        adjustmentType: "",

        quantity: "",

        adjustmentDate: "",

        remarks: ""

    });


    // =====================================================
    // GET VALUE
    // Supports camelCase + PascalCase
    // =====================================================

    const getValue = (
        data,
        camelCase,
        pascalCase
    ) => {

        return (
            data?.[camelCase] ??
            data?.[pascalCase] ??
            ""
        );

    };


    // =====================================================
    // FORMAT DATE FOR INPUT
    // =====================================================

    const formatDateForInput = (value) => {

        if (!value) {

            return "";

        }


        const date = new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "";

        }


        return date
            .toISOString()
            .slice(0, 10);

    };


    // =====================================================
    // LOAD STOCK ADJUSTMENT
    // =====================================================

    useEffect(() => {

        const loadAdjustment = async () => {

            try {

                setLoading(true);

                setError("");


                const response = await fetch(
                    `${SERVER_URL}/api/stock-adjustments/${id}`
                );


                if (!response.ok) {

                    if (response.status === 404) {

                        throw new Error(
                            "Stock adjustment not found."
                        );

                    }


                    throw new Error(
                        `Failed to load stock adjustment. Status: ${response.status}`
                    );

                }


                const data =
                    await response.json();


                // =================================================
                // POPULATE FORM
                // =================================================

                setFormData({

                    stockAdjustmentId:
                        getValue(
                            data,
                            "stockAdjustmentId",
                            "StockAdjustmentId"
                        ),

                    sellerId:
                        getValue(
                            data,
                            "sellerId",
                            "SellerId"
                        ),

                    customerId:
                        getValue(
                            data,
                            "customerId",
                            "CustomerId"
                        ),

                    productId:
                        getValue(
                            data,
                            "productId",
                            "ProductId"
                        ),

                    warehouseId:
                        getValue(
                            data,
                            "warehouseId",
                            "WarehouseId"
                        ),

                    adjustmentType:
                        getValue(
                            data,
                            "adjustmentType",
                            "AdjustmentType"
                        ),

                    quantity:
                        getValue(
                            data,
                            "quantity",
                            "Quantity"
                        ),

                    adjustmentDate:
                        formatDateForInput(
                            getValue(
                                data,
                                "adjustmentDate",
                                "AdjustmentDate"
                            )
                        ),

                    remarks:
                        getValue(
                            data,
                            "remarks",
                            "Remarks"
                        )

                });

            }

            catch (err) {

                console.error(
                    "Load Stock Adjustment Error:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to load stock adjustment."
                );

            }

            finally {

                setLoading(false);

            }

        };


        if (id) {

            loadAdjustment();

        }

    }, [id]);


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

    };


    // =====================================================
    // VALIDATE
    // =====================================================

    const validateForm = () => {

        if (
            !formData.sellerId ||
            !formData.productId ||
            !formData.warehouseId
        ) {

            setError(
                "Seller, Product and Warehouse are required."
            );

            return false;

        }


        if (!formData.adjustmentType) {

            setError(
                "Adjustment type is required."
            );

            return false;

        }


        if (
            formData.quantity === "" ||
            Number(formData.quantity) <= 0
        ) {

            setError(
                "Quantity must be greater than 0."
            );

            return false;

        }


        return true;

    };


    // =====================================================
    // UPDATE
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        if (!validateForm()) {

            return;

        }


        try {

            setSaving(true);

            setError("");


            // =================================================
            // PAYLOAD
            // =================================================

            const payload = {

                stockAdjustmentId:
                    Number(
                        formData.stockAdjustmentId
                    ),

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
                    formData.adjustmentType,

                quantity:
                    Number(
                        formData.quantity
                    ),

                adjustmentDate:
                    formData.adjustmentDate ||
                    null,

                remarks:
                    formData.remarks || null

            };


            console.log(
                "Updating Stock Adjustment:",
                payload
            );


            // =================================================
            // PUT REQUEST
            // =================================================

            const response = await fetch(
                `${SERVER_URL}/api/stock-adjustments/${id}`,
                {
                    method: "PUT",

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


            if (!response.ok) {

                const text =
                    await response.text();


                let message =
                    `Update failed. Status: ${response.status}`;


                try {

                    const errorData =
                        JSON.parse(text);


                    message =
                        errorData.message ||
                        errorData.title ||
                        message;

                }

                catch {

                    if (text) {

                        message = text;

                    }

                }


                throw new Error(message);

            }


            setSuccess(
                "Stock adjustment updated successfully."
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
                "Update Stock Adjustment Error:",
                err
            );

            setError(
                err.message ||
                "Failed to update stock adjustment."
            );

        }

        finally {

            setSaving(false);

        }

    };


    // =====================================================
    // BACK
    // =====================================================

    const handleBack = () => {

        navigate(
            "/stock-adjustments"
        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Container
                maxWidth="lg"
                sx={{
                    py: 5
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 300,
                        flexDirection: "column",
                        gap: 2
                    }}
                >

                    <CircularProgress />

                    <Typography>
                        Loading stock adjustment...
                    </Typography>

                </Box>

            </Container>

        );

    }


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
                        Edit Stock Adjustment
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Update stock adjustment details
                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
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
                    onSubmit={handleSubmit}
                >

                    <Grid
                        container
                        spacing={3}
                    >

                        {/* =====================================
                            STOCK ADJUSTMENT ID
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
                                label="Stock Adjustment ID"
                                value={
                                    formData.stockAdjustmentId
                                }
                                disabled
                            />

                        </Grid>


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
                                value={
                                    formData.sellerId
                                }
                                onChange={
                                    handleChange
                                }
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
                                value={
                                    formData.customerId
                                }
                                onChange={
                                    handleChange
                                }
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
                                value={
                                    formData.productId
                                }
                                onChange={
                                    handleChange
                                }
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
                                value={
                                    formData.warehouseId
                                }
                                onChange={
                                    handleChange
                                }
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
                                minRows={3}
                                name="remarks"
                                label="Remarks"
                                placeholder="Enter remarks"
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
                                    variant="outlined"
                                    startIcon={
                                        <ArrowBack />
                                    }
                                    onClick={
                                        handleBack
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
                                        ? "Updating..."
                                        : "Update Stock Adjustment"}
                                </Button>

                            </Box>

                        </Grid>

                    </Grid>

                </Box>

            </Paper>


            {/* =================================================
                SUCCESS SNACKBAR
            ================================================= */}

            <Snackbar
                open={Boolean(success)}
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

export default StockAdjustmentEdit;

