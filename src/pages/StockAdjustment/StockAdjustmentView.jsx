// =========================================================
// StockAdjustmentView.jsx
// View Stock Adjustment
// =========================================================

import React, { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Inventory,
    Warehouse,
    Person,
    Business,
    CalendarMonth,
    Numbers,
    Notes
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";

// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const StockAdjustmentView = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [adjustment, setAdjustment] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // =========================================================
    // LOAD STOCK ADJUSTMENT
    // =========================================================

    const loadAdjustment = async () => {

        if (!id) {

            setError(
                "Stock adjustment ID is missing."
            );

            setLoading(false);

            return;
        }

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/stock-adjustments/${id}`
            );

            if (!response.ok) {

                let message =
                    "Failed to load stock adjustment.";

                try {

                    const errorData =
                        await response.json();

                    if (errorData.message) {

                        message =
                            errorData.message;

                    } else if (errorData.title) {

                        message =
                            errorData.title;

                    } else if (errorData.errors) {

                        message =
                            JSON.stringify(
                                errorData.errors
                            );
                    }

                } catch {
                    // Ignore JSON parsing errors
                }

                if (response.status === 404) {
                    message =
                        "Stock adjustment not found.";
                }

                throw new Error(message);
            }

            const data = await response.json();

            console.log(
                "Stock Adjustment:",
                data
            );

            setAdjustment(data);

        } catch (err) {

            console.error(
                "Stock Adjustment View Error:",
                err
            );

            setError(
                err.message ||
                "Unable to load stock adjustment."
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================================================
    // LOAD ON MOUNT
    // =========================================================

    useEffect(() => {

        loadAdjustment();

    }, [id]);

    // =========================================================
    // GET VALUE
    // =========================================================

    const getValue = (
        camelCase,
        pascalCase,
        defaultValue = "-"
    ) => {

        if (!adjustment) {
            return defaultValue;
        }

        return (
            adjustment[camelCase] ??
            adjustment[pascalCase] ??
            defaultValue
        );
    };

    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (value) => {

        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );
    };

    // =========================================================
    // ADJUSTMENT TYPE
    // =========================================================

    const getAdjustmentType = () => {

        return getValue(
            "adjustmentType",
            "AdjustmentType"
        );
    };

    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit = () => {

        navigate(
            `/stock-adjustments/edit/${id}`
        );
    };

    // =========================================================
    // BACK
    // =========================================================

    const handleBack = () => {

        navigate("/stock-adjustments");
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 400
                }}
            >

                <CircularProgress />

            </Box>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (error) {

        return (
            <Box sx={{ p: 2 }}>

                <Button
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    sx={{ mb: 2 }}
                >
                    Back to Stock Adjustments
                </Button>

                <Alert severity="error">
                    {error}
                </Alert>

            </Box>
        );
    }

    // =========================================================
    // NO DATA
    // =========================================================

    if (!adjustment) {

        return (
            <Box sx={{ p: 2 }}>

                <Button
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    sx={{ mb: 2 }}
                >
                    Back to Stock Adjustments
                </Button>

                <Alert severity="info">
                    Stock adjustment not found.
                </Alert>

            </Box>
        );
    }

    // =========================================================
    // VALUES
    // =========================================================

    const stockAdjustmentId = getValue(
        "stockAdjustmentId",
        "StockAdjustmentId"
    );

    const sellerId = getValue(
        "sellerId",
        "SellerId"
    );

    const customerId = getValue(
        "customerId",
        "CustomerId"
    );

    const productId = getValue(
        "productId",
        "ProductId"
    );

    const warehouseId = getValue(
        "warehouseId",
        "WarehouseId"
    );

    const adjustmentType =
        getAdjustmentType();

    const quantity = getValue(
        "quantity",
        "Quantity",
        0
    );

    const adjustmentDate =
        getValue(
            "adjustmentDate",
            "AdjustmentDate"
        );

    const remarks = getValue(
        "remarks",
        "Remarks"
    );

    // =========================================================
    // INFO ITEM
    // =========================================================

    const InfoItem = ({
        icon,
        label,
        value
    }) => {

        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    p: 1.5,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    height: "100%"
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 0.25
                    }}
                >
                    {icon}
                </Box>

                <Box>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        {label}
                    </Typography>

                    <Typography
                        variant="body1"
                        fontWeight={600}
                    >
                        {value}
                    </Typography>

                </Box>

            </Box>
        );
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box sx={{ p: 2 }}>

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    mb: 3,
                    flexWrap: "wrap"
                }}
            >

                <Box>

                    <Button
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                        sx={{
                            mb: 1
                        }}
                    >
                        Back
                    </Button>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Stock Adjustment Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        View stock adjustment information
                    </Typography>

                </Box>


                {/* =================================================
                    EDIT BUTTON
                ================================================= */}

                <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                >
                    Edit Adjustment
                </Button>

            </Box>


            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <Card
                elevation={2}
                sx={{ mb: 3 }}
            >

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ mb: 2 }}
                    >
                        Adjustment Information
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Grid
                        container
                        spacing={2}
                    >

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >
                            <InfoItem
                                icon={<Numbers color="primary" />}
                                label="Adjustment ID"
                                value={
                                    stockAdjustmentId
                                }
                            />
                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >
                            <InfoItem
                                icon={<Business color="primary" />}
                                label="Seller ID"
                                value={sellerId}
                            />
                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >
                            <InfoItem
                                icon={<Person color="primary" />}
                                label="Customer ID"
                                value={customerId}
                            />
                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >
                            <InfoItem
                                icon={<Inventory color="primary" />}
                                label="Product ID"
                                value={productId}
                            />
                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >
                            <InfoItem
                                icon={<Warehouse color="primary" />}
                                label="Warehouse ID"
                                value={warehouseId}
                            />
                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >
                            <InfoItem
                                icon={<AssessmentIcon />}
                                label="Adjustment Type"
                                value={
                                    adjustmentType
                                }
                            />
                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >
                            <InfoItem
                                icon={<Numbers color="primary" />}
                                label="Quantity"
                                value={quantity}
                            />
                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >
                            <InfoItem
                                icon={<CalendarMonth color="primary" />}
                                label="Adjustment Date"
                                value={
                                    formatDate(
                                        adjustmentDate
                                    )
                                }
                            />
                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* =================================================
                REMARKS
            ================================================= */}

            <Card elevation={2}>

                <CardContent>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2
                        }}
                    >

                        <Notes color="primary" />

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            Remarks
                        </Typography>

                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Typography
                        variant="body1"
                        sx={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word"
                        }}
                    >
                        {remarks || "No remarks available."}
                    </Typography>

                </CardContent>

            </Card>

        </Box>
    );
};

// =========================================================
// ASSESSMENT ICON
// =========================================================

const AssessmentIcon = () => (
    <Assessment />
);

export default StockAdjustmentView;