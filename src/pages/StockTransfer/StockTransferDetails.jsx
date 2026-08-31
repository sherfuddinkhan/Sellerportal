// =========================================================
// StockTransferDetails.jsx
// View Stock Transfer Details
//
// React
//     ↓
// Node server.js
//     ↓
// .NET API
//
// React:
// GET /api/stock-transfers/:stockTransferId
//
// Node:
// GET /api/stock-transfers/:stockTransferId
//
// .NET:
// GET /api/StockTransfer/:stockTransferId
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
    Chip,
    CircularProgress,
    Divider,
    Paper,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Edit,
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

const StockTransferDetails = () => {

    const {
        stockTransferId,
    } = useParams();

    const navigate =
        useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [transfer, setTransfer] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD STOCK TRANSFER
    // =====================================================

    useEffect(() => {

        const loadStockTransfer = async () => {

            // =============================================
            // VALIDATE ID
            // =============================================

            if (!stockTransferId) {

                setError(
                    "Stock transfer ID is missing."
                );

                setLoading(false);

                return;
            }


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


            // =============================================
            // REQUEST
            // =============================================

            try {

                setLoading(true);
                setError("");

                console.log(
                    "========================================"
                );

                console.log(
                    "STOCK TRANSFER DETAILS"
                );

                console.log(
                    "Stock Transfer ID:",
                    id
                );

                console.log(
                    "Node URL:",
                    `${SERVER_URL}/api/stock-transfers/${id}`
                );

                console.log(
                    "========================================"
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


                // =========================================
                // SAVE DATA
                // =========================================

                setTransfer(
                    response.data
                );

            } catch (err) {

                console.error(
                    "Stock Transfer Details Error:",
                    err
                );

                console.error(
                    "Status:",
                    err?.response?.status
                );

                console.error(
                    "Response:",
                    err?.response?.data
                );


                if (
                    err?.response?.status === 404
                ) {

                    setError(
                        "Stock transfer not found."
                    );

                } else {

                    setError(
                        err?.response?.data?.message ||
                        err?.response?.data?.title ||
                        "Failed to load stock transfer."
                    );
                }

            } finally {

                setLoading(false);

            }
        };


        loadStockTransfer();

    }, [stockTransferId]);


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
    // ERROR
    // =====================================================

    if (error) {

        return (
            <Box
                sx={{
                    p: {
                        xs: 2,
                        md: 3,
                    },
                }}
            >

                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                    }}
                >
                    {error}
                </Alert>


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
                    Back to Stock Transfers
                </Button>

            </Box>
        );
    }


    // =====================================================
    // NO DATA
    // =====================================================

    if (!transfer) {

        return (
            <Box
                sx={{
                    p: {
                        xs: 2,
                        md: 3,
                    },
                }}
            >

                <Alert
                    severity="warning"
                    sx={{
                        mb: 2,
                    }}
                >
                    Stock transfer not found.
                </Alert>


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
                    Back to Stock Transfers
                </Button>

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
                    gap: 2,
                    flexWrap: "wrap",
                    mb: 3,
                }}
            >

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Stock Transfer Details
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.5,
                        }}
                    >
                        Transfer ID:{" "}
                        {formatValue(
                            transfer.stockTransferId
                        )}
                    </Typography>

                </Box>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                    }}
                >

                    {/* BACK */}

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


                    {/* EDIT */}

                    <Button
                        variant="contained"
                        startIcon={
                            <Edit />
                        }
                        onClick={() =>
                            navigate(
                                `/stock-transfers/${transfer.stockTransferId}/edit`
                            )
                        }
                    >
                        Edit
                    </Button>

                </Box>

            </Box>


            {/* =================================================
                TRANSFER INFORMATION
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

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                        mb: 2,
                    }}
                >
                    Transfer Information
                </Typography>


                <Divider
                    sx={{
                        mb: 3,
                    }}
                />


                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: 3,
                    }}
                >

                    {/* =================================================
                        STOCK TRANSFER ID
                    ================================================= */}

                    <DetailItem
                        label="Stock Transfer ID"
                        value={
                            transfer.stockTransferId
                        }
                    />


                    {/* =================================================
                        SELLER ID
                    ================================================= */}

                    <DetailItem
                        label="Seller ID"
                        value={
                            transfer.sellerId
                        }
                    />


                    {/* =================================================
                        PRODUCT ID
                    ================================================= */}

                    <DetailItem
                        label="Product ID"
                        value={
                            transfer.productId
                        }
                    />


                    {/* =================================================
                        FROM WAREHOUSE
                    ================================================= */}

                    <DetailItem
                        label="From Warehouse ID"
                        value={
                            transfer.fromWarehouseId
                        }
                    />


                    {/* =================================================
                        TO WAREHOUSE
                    ================================================= */}

                    <DetailItem
                        label="To Warehouse ID"
                        value={
                            transfer.toWarehouseId
                        }
                    />


                    {/* =================================================
                        QUANTITY
                    ================================================= */}

                    <DetailItem
                        label="Quantity"
                        value={
                            transfer.quantity
                        }
                    />


                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <Box>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Status
                        </Typography>


                        <Box
                            sx={{
                                mt: 0.5,
                            }}
                        >

                            <StatusChip
                                status={
                                    transfer.status
                                }
                            />

                        </Box>

                    </Box>


                    {/* =================================================
                        TRANSFER DATE
                    ================================================= */}

                    <DetailItem
                        label="Transfer Date"
                        value={
                            formatDate(
                                transfer.transferDate
                            )
                        }
                    />


                    {/* =================================================
                        CREATED DATE
                    ================================================= */}

                    <DetailItem
                        label="Created Date"
                        value={
                            formatDate(
                                transfer.createdDate
                            )
                        }
                    />


                    {/* =================================================
                        UPDATED DATE
                    ================================================= */}

                    <DetailItem
                        label="Updated Date"
                        value={
                            formatDate(
                                transfer.updatedDate
                            )
                        }
                    />

                </Box>


                {/* =================================================
                    REMARKS
                ================================================= */}

                <Box
                    sx={{
                        mt: 4,
                    }}
                >

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Remarks
                    </Typography>


                    <Paper
                        variant="outlined"
                        sx={{
                            mt: 1,
                            p: 2,
                            minHeight: 80,
                        }}
                    >

                        <Typography>
                            {transfer.remarks || "-"}
                        </Typography>

                    </Paper>

                </Box>

            </Paper>

        </Box>
    );
};


// =========================================================
// DETAIL ITEM
// =========================================================

const DetailItem = ({
    label,
    value,
}) => {

    return (
        <Box>

            <Typography
                variant="caption"
                color="text.secondary"
            >
                {label}
            </Typography>


            <Typography
                variant="body1"
                fontWeight="500"
                sx={{
                    mt: 0.5,
                }}
            >
                {formatValue(value)}
            </Typography>

        </Box>
    );
};


// =========================================================
// STATUS CHIP
// =========================================================

const StatusChip = ({
    status,
}) => {

    const normalized =
        String(status || "")
            .trim()
            .toLowerCase();


    let color = "default";


    switch (normalized) {

        case "completed":
            color = "success";
            break;

        case "approved":
            color = "info";
            break;

        case "in transit":
            color = "warning";
            break;

        case "cancelled":
            color = "error";
            break;

        case "pending":
            color = "default";
            break;

        default:
            color = "default";
            break;
    }


    return (
        <Chip
            label={
                status || "-"
            }
            color={color}
            size="small"
        />
    );
};


// =========================================================
// FORMAT VALUE
// =========================================================

const formatValue = (
    value
) => {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "-";
    }


    if (
        typeof value === "boolean"
    ) {
        return value
            ? "Yes"
            : "No";
    }


    return String(value);
};


// =========================================================
// FORMAT DATE
// =========================================================

const formatDate = (
    value
) => {

    if (!value) {
        return "-";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return String(value);
    }


    return date.toLocaleString();
};


// =========================================================
// EXPORT
// =========================================================

export default StockTransferDetails;

