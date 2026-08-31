// =========================================================
// StockTransferEdit.jsx
// Edit Stock Transfer
//
// React → Node server.js → .NET API
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
// NODE SERVER URL
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const StockTransferEdit = () => {

    const {
        stockTransferId,
    } = useParams();

    const navigate =
        useNavigate();

    // =====================================================
    // FORM STATE
    // =====================================================

    const [formData, setFormData] = useState({
        sellerId: "",
        productId: "",
        fromWarehouseId: "",
        toWarehouseId: "",
        quantity: "",
        status: "Pending",
        transferDate: "",
        remarks: "",
    });

    // =====================================================
    // UI STATE
    // =====================================================

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // =====================================================
    // LOAD STOCK TRANSFER
    // =====================================================

    useEffect(() => {

        const loadStockTransfer = async () => {

            if (!stockTransferId) {

                setError(
                    "Stock transfer ID is missing."
                );

                setLoading(false);

                return;
            }

            // =============================================
            // VALIDATE ID
            // =============================================

            const id =
                Number(stockTransferId);

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                setError(
                    "Invalid stock transfer ID."
                );

                setLoading(false);

                return;
            }

            try {

                setLoading(true);
                setError("");

                console.log(
                    "===================================="
                );

                console.log(
                    "LOAD STOCK TRANSFER"
                );

                console.log(
                    "ID:",
                    id
                );

                console.log(
                    "Node URL:",
                    `${SERVER_URL}/api/stock-transfers/${id}`
                );

                console.log(
                    "===================================="
                );

                // =========================================
                // REACT → NODE SERVER.JS
                // =========================================

                const response =
                    await axios.get(
                        `${SERVER_URL}/api/stock-transfers/${id}`,
                        {
                            headers: {
                                Accept:
                                    "application/json",
                            },
                        }
                    );

                console.log(
                    "Stock Transfer Response:",
                    response.data
                );

                const data =
                    response.data;

                // =========================================
                // POPULATE FORM
                // =========================================

                setFormData({

                    sellerId:
                        data?.sellerId ?? "",

                    productId:
                        data?.productId ?? "",

                    fromWarehouseId:
                        data?.fromWarehouseId ?? "",

                    toWarehouseId:
                        data?.toWarehouseId ?? "",

                    quantity:
                        data?.quantity ?? "",

                    status:
                        data?.status ||
                        "Pending",

                    transferDate:
                        formatDateForInput(
                            data?.transferDate
                        ),

                    remarks:
                        data?.remarks ?? "",
                });

            } catch (err) {

                console.error(
                    "Load Stock Transfer Error:",
                    err
                );

                console.error(
                    "Response:",
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

    }, [stockTransferId]);

    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {

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

        // Clear previous messages
        setError("");
        setSuccess("");
    };

    // =====================================================
    // SUBMIT UPDATE
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        // =================================================
        // VALIDATION
        // =================================================

        if (!formData.sellerId) {

            setError(
                "Seller ID is required."
            );

            return;
        }

        if (!formData.productId) {

            setError(
                "Product ID is required."
            );

            return;
        }

        if (!formData.fromWarehouseId) {

            setError(
                "From Warehouse ID is required."
            );

            return;
        }

        if (!formData.toWarehouseId) {

            setError(
                "To Warehouse ID is required."
            );

            return;
        }

        if (!formData.quantity) {

            setError(
                "Quantity is required."
            );

            return;
        }

        if (
            Number(formData.quantity) <= 0
        ) {

            setError(
                "Quantity must be greater than zero."
            );

            return;
        }

        if (
            Number(
                formData.fromWarehouseId
            ) ===
            Number(
                formData.toWarehouseId
            )
        ) {

            setError(
                "From Warehouse and To Warehouse cannot be the same."
            );

            return;
        }

        // =================================================
        // BUILD PAYLOAD
        // =================================================

        const payload = {

            sellerId:
                Number(
                    formData.sellerId
                ),

            productId:
                Number(
                    formData.productId
                ),

            fromWarehouseId:
                Number(
                    formData.fromWarehouseId
                ),

            toWarehouseId:
                Number(
                    formData.toWarehouseId
                ),

            quantity:
                Number(
                    formData.quantity
                ),

            status:
                formData.status,

            transferDate:
                formData.transferDate
                    ? new Date(
                        `${formData.transferDate}T00:00:00`
                    ).toISOString()
                    : null,

            remarks:
                formData.remarks ||
                "",
        };

        // =================================================
        // LOG
        // =================================================

        console.log(
            "===================================="
        );

        console.log(
            "UPDATE STOCK TRANSFER"
        );

        console.log(
            "ID:",
            stockTransferId
        );

        console.log(
            "Node URL:",
            `${SERVER_URL}/api/stock-transfers/${stockTransferId}`
        );

        console.log(
            "Payload:",
            payload
        );

        console.log(
            "===================================="
        );

        try {

            setSaving(true);

            // =============================================
            // REACT → NODE SERVER.JS
            // =============================================

            const response =
                await axios.put(
                    `${SERVER_URL}/api/stock-transfers/${stockTransferId}`,
                    payload,
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
                "Update Response:",
                response.data
            );

            setSuccess(
                "Stock transfer updated successfully."
            );

            // =============================================
            // REDIRECT
            // =============================================

            setTimeout(() => {

                navigate(
                    `/stock-transfers/${stockTransferId}`
                );

            }, 800);

        } catch (err) {

            console.error(
                "===================================="
            );

            console.error(
                "UPDATE STOCK TRANSFER ERROR"
            );

            console.error(
                "Message:",
                err?.message
            );

            console.error(
                "Status:",
                err?.response?.status
            );

            console.error(
                "Response:",
                err?.response?.data
            );

            console.error(
                "===================================="
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                "Failed to update stock transfer."
            );

        } finally {

            setSaving(false);

        }
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

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "space-between",
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
                        Edit Stock Transfer
                    </Typography>

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

                </Box>

                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBack />
                    }
                    disabled={saving}
                    onClick={() =>
                        navigate(
                            "/stock-transfers"
                        )
                    }
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
                        mb: 2,
                    }}
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
                FORM
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: {
                        xs: 2,
                        md: 3,
                    },
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

                        {/* =====================================
                            SELLER ID
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Seller ID"
                                name="sellerId"
                                type="number"
                                value={
                                    formData.sellerId
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1,
                                }}
                            />

                        </Grid>

                        {/* =====================================
                            PRODUCT ID
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Product ID"
                                name="productId"
                                type="number"
                                value={
                                    formData.productId
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1,
                                }}
                            />

                        </Grid>

                        {/* =====================================
                            FROM WAREHOUSE
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                required
                                label="From Warehouse ID"
                                name="fromWarehouseId"
                                type="number"
                                value={
                                    formData.fromWarehouseId
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1,
                                }}
                            />

                        </Grid>

                        {/* =====================================
                            TO WAREHOUSE
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                required
                                label="To Warehouse ID"
                                name="toWarehouseId"
                                type="number"
                                value={
                                    formData.toWarehouseId
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1,
                                }}
                            />

                        </Grid>

                        {/* =====================================
                            QUANTITY
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Quantity"
                                name="quantity"
                                type="number"
                                value={
                                    formData.quantity
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1,
                                }}
                            />

                        </Grid>

                        {/* =====================================
                            STATUS
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                select
                                label="Status"
                                name="status"
                                value={
                                    formData.status
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

                        {/* =====================================
                            TRANSFER DATE
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                label="Transfer Date"
                                name="transferDate"
                                type="date"
                                value={
                                    formData.transferDate
                                }
                                onChange={
                                    handleChange
                                }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                        </Grid>

                        {/* =====================================
                            REMARKS
                        ===================================== */}

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
                                    formData.remarks
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter remarks..."
                            />

                        </Grid>

                        {/* =====================================
                            BUTTONS
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        "flex-end",
                                    gap: 2,
                                    mt: 1,
                                }}
                            >

                                <Button
                                    variant="outlined"
                                    startIcon={
                                        <ArrowBack />
                                    }
                                    disabled={
                                        saving
                                    }
                                    onClick={() =>
                                        navigate(
                                            "/stock-transfers"
                                        )
                                    }
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={
                                        saving ? (
                                            <CircularProgress
                                                size={18}
                                                color="inherit"
                                            />
                                        ) : (
                                            <Save />
                                        )
                                    }
                                    disabled={
                                        saving
                                    }
                                >
                                    {saving
                                        ? "Updating..."
                                        : "Update Stock Transfer"}
                                </Button>

                            </Box>

                        </Grid>

                    </Grid>

                </Box>

            </Paper>

        </Box>
    );
};

// =========================================================
// FORMAT DATE FOR HTML DATE INPUT
// =========================================================

const formatDateForInput = (
    value
) => {

    if (!value) {
        return "";
    }

    try {

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "";
        }

        return date
            .toISOString()
            .split("T")[0];

    } catch {

        return "";
    }
};

// =========================================================
// EXPORT
// =========================================================

export default StockTransferEdit;