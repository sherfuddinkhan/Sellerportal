// =========================================================
// StockTransferEdit.jsx
// Edit Stock Transfer
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

import {
    getStockTransferById,
    updateStockTransfer,
} from "../../services/apiService";

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
    // STATE
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

        const loadStockTransfer =
            async () => {

                try {

                    setLoading(true);
                    setError("");

                    const result =
                        await getStockTransferById(
                            stockTransferId
                        );

                    console.log(
                        "Stock Transfer:",
                        result
                    );

                    setFormData({
                        sellerId:
                            result?.sellerId ?? "",

                        productId:
                            result?.productId ?? "",

                        fromWarehouseId:
                            result?.fromWarehouseId ?? "",

                        toWarehouseId:
                            result?.toWarehouseId ?? "",

                        quantity:
                            result?.quantity ?? "",

                        status:
                            result?.status ??
                            "Pending",

                        transferDate:
                            formatDateForInput(
                                result?.transferDate
                            ),

                        remarks:
                            result?.remarks ?? "",
                    });

                } catch (err) {

                    console.error(
                        "Error loading stock transfer:",
                        err
                    );

                    setError(
                        err?.response?.data?.message ||
                        "Failed to load stock transfer."
                    );

                } finally {

                    setLoading(false);

                }
            };

        if (stockTransferId) {
            loadStockTransfer();
        }

    }, [stockTransferId]);

    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
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

        setError("");
        setSuccess("");

        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

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

        // -------------------------------------------------
        // PAYLOAD
        // -------------------------------------------------

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
                        formData.transferDate
                    ).toISOString()
                    : null,

            remarks:
                formData.remarks,
        };

        console.log(
            "Updating Stock Transfer:",
            payload
        );

        try {

            setSaving(true);

            await updateStockTransfer(
                stockTransferId,
                payload
            );

            setSuccess(
                "Stock transfer updated successfully."
            );

            // -------------------------------------------------
            // REDIRECT AFTER UPDATE
            // -------------------------------------------------

            setTimeout(() => {

                navigate(
                    `/stock-transfers/${stockTransferId}`
                );

            }, 800);

        } catch (err) {

            console.error(
                "Update stock transfer error:",
                err
            );

            // -------------------------------------------------
            // API ERROR
            // -------------------------------------------------

            if (
                err?.response?.data
            ) {

                console.error(
                    "API response:",
                    err.response.data
                );
            }

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
                    alignItems: "center",
                    justifyContent: "center",
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
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                    mb: 3,
                    flexWrap: "wrap",
                    gap: 2,
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
                        sx={{ mt: 0.5 }}
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
                            SELLER
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
                            />

                        </Grid>

                        {/* =====================================
                            PRODUCT
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
// FORMAT DATE
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

