// =========================================================
// StockTransferForm.jsx
// Create / Edit Stock Transfer
//
// React → Node server.js → .NET API
// NO apiService.js
// =========================================================

import React, {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
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

// =========================================================
// NODE SERVER
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// INITIAL FORM
// =========================================================

const initialForm = {
    sellerId: "",
    productId: "",
    fromWarehouseId: "",
    toWarehouseId: "",
    quantity: "",
    status: "Pending",
    transferDate: "",
    remarks: "",
};

// =========================================================
// COMPONENT
// =========================================================

const StockTransferForm = () => {

    const navigate = useNavigate();

    const {
        stockTransferId,
    } = useParams();

    const isEdit =
        Boolean(stockTransferId);

    // =====================================================
    // STATE
    // =====================================================

    const [form, setForm] =
        useState(initialForm);

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // =====================================================
    // LOAD STOCK TRANSFER FOR EDIT
    // =====================================================

    useEffect(() => {

        if (!isEdit) {
            return;
        }

        const loadStockTransfer =
            async () => {

                try {

                    setLoading(true);
                    setError("");

                    console.log(
                        "Loading stock transfer:",
                        stockTransferId
                    );

                    // =========================================
                    // React → Node server.js
                    // =========================================

                    const response =
                        await axios.get(
                            `${SERVER_URL}/api/stock-transfers/${stockTransferId}`
                        );

                    console.log(
                        "Stock transfer response:",
                        response.data
                    );

                    const data =
                        response.data;

                    setForm({
                        sellerId:
                            data.sellerId ?? "",

                        productId:
                            data.productId ?? "",

                        fromWarehouseId:
                            data.fromWarehouseId ?? "",

                        toWarehouseId:
                            data.toWarehouseId ?? "",

                        quantity:
                            data.quantity ?? "",

                        status:
                            data.status ??
                            "Pending",

                        transferDate:
                            data.transferDate
                                ? String(
                                    data.transferDate
                                ).substring(
                                    0,
                                    10
                                )
                                : "",

                        remarks:
                            data.remarks ??
                            "",
                    });

                } catch (err) {

                    console.error(
                        "Load stock transfer error:",
                        err
                    );

                    console.error(
                        "Server response:",
                        err?.response?.data
                    );

                    setError(
                        err?.response?.data?.message ||
                        err?.response?.data?.title ||
                        "Failed to load stock transfer."
                    );

                } finally {

                    setLoading(false);

                }
            };

        loadStockTransfer();

    }, [
        stockTransferId,
        isEdit,
    ]);

    // =====================================================
    // HANDLE CHANGE
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
    };

    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm = () => {

        if (!form.sellerId) {
            return "Seller ID is required.";
        }

        if (!form.productId) {
            return "Product ID is required.";
        }

        if (!form.fromWarehouseId) {
            return "From Warehouse ID is required.";
        }

        if (!form.toWarehouseId) {
            return "To Warehouse ID is required.";
        }

        if (!form.quantity) {
            return "Quantity is required.";
        }

        if (Number(form.quantity) <= 0) {
            return "Quantity must be greater than 0.";
        }

        if (
            Number(form.fromWarehouseId) ===
            Number(form.toWarehouseId)
        ) {
            return "From Warehouse and To Warehouse cannot be the same.";
        }

        return "";
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

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

            // =================================================
            // PAYLOAD
            // =================================================

            const payload = {

                sellerId:
                    Number(
                        form.sellerId
                    ),

                productId:
                    Number(
                        form.productId
                    ),

                fromWarehouseId:
                    Number(
                        form.fromWarehouseId
                    ),

                toWarehouseId:
                    Number(
                        form.toWarehouseId
                    ),

                quantity:
                    Number(
                        form.quantity
                    ),

                status:
                    form.status,

                transferDate:
                    form.transferDate
                        ? new Date(
                            form.transferDate
                        ).toISOString()
                        : null,

                remarks:
                    form.remarks?.trim() ||
                    null,
            };

            console.log(
                "Saving stock transfer:",
                payload
            );

            // =================================================
            // EDIT
            // PUT
            // React → Node → .NET
            // =================================================

            if (isEdit) {

                const response =
                    await axios.put(
                        `${SERVER_URL}/api/stock-transfers/${stockTransferId}`,
                        payload
                    );

                console.log(
                    "Update response:",
                    response.data
                );

                setSuccess(
                    "Stock transfer updated successfully."
                );

            }

            // =================================================
            // CREATE
            // POST
            // React → Node → .NET
            // =================================================

            else {

                const response =
                    await axios.post(
                        `${SERVER_URL}/api/stock-transfers`,
                        payload
                    );

                console.log(
                    "Create response:",
                    response.data
                );

                setSuccess(
                    "Stock transfer created successfully."
                );

                setForm({
                    ...initialForm,
                });
            }

            // =================================================
            // REDIRECT
            // =================================================

            setTimeout(() => {

                navigate(
                    "/stock-transfers"
                );

            }, 800);

        } catch (err) {

            console.error(
                "Save stock transfer error:",
                err
            );

            console.error(
                "Server response:",
                err?.response?.data
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                err?.response?.data?.error ||
                "Failed to save stock transfer."
            );

        } finally {

            setSaving(false);

        }
    };

    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {

        navigate(
            "/stock-transfers"
        );
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <Box
                sx={{
                    minHeight: 300,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box
            sx={{
                p: {
                    xs: 2,
                    md: 3,
                },
            }}
        >

            <Paper
                elevation={2}
                sx={{
                    p: {
                        xs: 2,
                        md: 3,
                    },
                }}
            >

                {/* =========================================
                    HEADER
                ========================================= */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 3,
                    }}
                >

                    <Box>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >
                            {isEdit
                                ? "Edit Stock Transfer"
                                : "Create Stock Transfer"}
                        </Typography>

                        {isEdit && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mt: 0.5,
                                }}
                            >
                                Stock Transfer ID:{" "}
                                {stockTransferId}
                            </Typography>
                        )}

                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={
                            handleCancel
                        }
                    >
                        Back
                    </Button>

                </Box>

                {/* =========================================
                    ERROR
                ========================================= */}

                {error && (

                    <Alert
                        severity="error"
                        sx={{
                            mb: 2,
                        }}
                    >
                        {error}
                    </Alert>

                )}

                {/* =========================================
                    SUCCESS
                ========================================= */}

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

                {/* =========================================
                    FORM
                ========================================= */}

                <Box
                    component="form"
                    onSubmit={
                        handleSubmit
                    }
                >

                    <Grid
                        container
                        spacing={2}
                    >

                        {/* SELLER */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Seller ID"
                                name="sellerId"
                                type="number"
                                value={
                                    form.sellerId
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1,
                                }}
                            />

                        </Grid>

                        {/* PRODUCT */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Product ID"
                                name="productId"
                                type="number"
                                value={
                                    form.productId
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1,
                                }}
                            />

                        </Grid>

                        {/* FROM WAREHOUSE */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <TextField
                                fullWidth
                                required
                                label="From Warehouse ID"
                                name="fromWarehouseId"
                                type="number"
                                value={
                                    form.fromWarehouseId
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1,
                                }}
                            />

                        </Grid>

                        {/* TO WAREHOUSE */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <TextField
                                fullWidth
                                required
                                label="To Warehouse ID"
                                name="toWarehouseId"
                                type="number"
                                value={
                                    form.toWarehouseId
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1,
                                }}
                            />

                        </Grid>

                        {/* QUANTITY */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Quantity"
                                name="quantity"
                                type="number"
                                value={
                                    form.quantity
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1,
                                }}
                            />

                        </Grid>

                        {/* STATUS */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <TextField
                                fullWidth
                                select
                                label="Status"
                                name="status"
                                value={
                                    form.status
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <MenuItem value="Pending">
                                    Pending
                                </MenuItem>

                                <MenuItem value="Approved">
                                    Approved
                                </MenuItem>

                                <MenuItem value="In Transit">
                                    In Transit
                                </MenuItem>

                                <MenuItem value="Completed">
                                    Completed
                                </MenuItem>

                                <MenuItem value="Cancelled">
                                    Cancelled
                                </MenuItem>

                            </TextField>

                        </Grid>

                        {/* TRANSFER DATE */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <TextField
                                fullWidth
                                label="Transfer Date"
                                name="transferDate"
                                type="date"
                                value={
                                    form.transferDate
                                }
                                onChange={
                                    handleChange
                                }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                        </Grid>

                        {/* REMARKS */}

                        <Grid
                            item
                            xs={12}
                        >

                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Remarks"
                                name="remarks"
                                value={
                                    form.remarks
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>

                        {/* BUTTONS */}

                        <Grid
                            item
                            xs={12}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    mt: 2,
                                }}
                            >

                                <Button
                                    variant="outlined"
                                    startIcon={
                                        <ArrowBack />
                                    }
                                    onClick={
                                        handleCancel
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
                                            ? null
                                            : <Save />
                                    }
                                    disabled={
                                        saving
                                    }
                                >

                                    {saving ? (

                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >

                                            <CircularProgress
                                                size={20}
                                                color="inherit"
                                            />

                                            Saving...

                                        </Box>

                                    ) : (

                                        isEdit
                                            ? "Update Transfer"
                                            : "Create Transfer"

                                    )}

                                </Button>

                            </Box>

                        </Grid>

                    </Grid>

                </Box>

            </Paper>

        </Box>
    );
};

export default StockTransferForm;
