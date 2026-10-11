// =========================================================
// InvoiceTaxDetailDetails.jsx
// =========================================================

import React, { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Breadcrumbs,
    Button,
    CircularProgress,
    Divider,
    Grid,
    Link,
    Paper,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    ReceiptLong,
    Refresh
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_URL = "http://localhost:5000/api/InvoiceTaxDetail";

// =========================================================
// GET VALUE - SUPPORT CAMELCASE AND PASCALCASE
// =========================================================

const getValue = (object, ...keys) => {
    if (!object) {
        return undefined;
    }

    for (const key of keys) {
        if (
            Object.prototype.hasOwnProperty.call(object, key) &&
            object[key] !== null &&
            object[key] !== undefined
        ) {
            return object[key];
        }
    }

    return undefined;
};

// =========================================================
// FORMAT NUMBER
// =========================================================

const formatNumber = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
};

// =========================================================
// DETAIL FIELD
// =========================================================

const DetailField = ({ label, value }) => {
    const displayValue =
        value === null || value === undefined || value === ""
            ? "—"
            : value;

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Box>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.75 }}
                >
                    {label}
                </Typography>

                <Typography
                    variant="body1"
                    fontWeight={600}
                    sx={{
                        overflowWrap: "anywhere",
                        wordBreak: "break-word"
                    }}
                >
                    {displayValue}
                </Typography>
            </Box>
        </Grid>
    );
};

// =========================================================
// INVOICE TAX DETAIL DETAILS
// =========================================================

const InvoiceTaxDetailDetails = ({ id: propId }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const params = useParams();

    // =====================================================
    // GET RECORD ID FROM PROPS OR ROUTE
    // =====================================================

    const invoiceTaxDetailId =
        propId ??
        params.invoiceTaxDetailId ??
        params.id ??
        params.invoiceTaxDetailsId;

    // =====================================================
    // STATE
    // =====================================================

    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // FETCH INVOICE TAX DETAIL
    // =====================================================

    const fetchInvoiceTaxDetail = async () => {
        if (
            invoiceTaxDetailId === undefined ||
            invoiceTaxDetailId === null ||
            String(invoiceTaxDetailId).trim() === ""
        ) {
            setError(
                "Invoice tax detail ID was not provided. Please open this page from a valid record."
            );
            setDetail(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");
            setDetail(null);

           const response = await axios.get(
    `http://localhost:5000/api/invoice-tax-details/${encodeURIComponent(id)}`
);

            const responseData = response.data;

            // Support either a single record or a wrapped API response.
            const record =
                responseData?.data ??
                responseData?.result ??
                responseData;

            if (
                !record ||
                typeof record !== "object" ||
                Array.isArray(record)
            ) {
                throw new Error(
                    "The API did not return a valid invoice tax detail record."
                );
            }

            setDetail(record);
        } catch (err) {
            console.error(
                "Error fetching invoice tax detail:",
                err
            );

            const status = err.response?.status;

            if (status === 404) {
                setError(
                    `Invoice tax detail ${invoiceTaxDetailId} was not found.`
                );
            } else if (err.response) {
                setError(
                    err.response.data?.message ||
                    err.response.data?.title ||
                    `Unable to load invoice tax detail. HTTP ${status}.`
                );
            } else if (err.request) {
                setError(
                    "Unable to connect to the Node API at localhost:5000. Check that the Node server is running and the GET-by-ID proxy is configured."
                );
            } else {
                setError(
                    err.message ||
                    "An unexpected error occurred while loading the record."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD RECORD WHEN ID CHANGES
    // =====================================================

    useEffect(() => {
        fetchInvoiceTaxDetail();

        // fetchInvoiceTaxDetail uses the current route ID.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoiceTaxDetailId]);

    // =====================================================
    // NORMALIZE API FIELDS
    // =====================================================

    const detailId = getValue(
        detail,
        "invoiceTaxDetailId",
        "InvoiceTaxDetailId",
        "id",
        "Id"
    ) ?? invoiceTaxDetailId;

    const salesInvoiceId = getValue(
        detail,
        "salesInvoiceId",
        "SalesInvoiceId"
    );

    const channelProductId = getValue(
        detail,
        "channelProductId",
        "ChannelProductId"
    );

    const taxPercentage = getValue(
        detail,
        "taxPercentage",
        "TaxPercentage"
    );

    const centralGst = getValue(
        detail,
        "centralGst",
        "CentralGst"
    );

    const stateGst = getValue(
        detail,
        "stateGst",
        "StateGst"
    );

    const integratedGst = getValue(
        detail,
        "integratedGst",
        "IntegratedGst"
    );

    const compensationCess = getValue(
        detail,
        "compensationCess",
        "CompensationCess"
    );

    const sellerId = getValue(
        detail,
        "sellerId",
        "SellerId"
    );

    const customerId = getValue(
        detail,
        "customerId",
        "CustomerId"
    );

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "50vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2
                }}
            >
                <CircularProgress />

                <Typography color="text.secondary">
                    Loading invoice tax details...
                </Typography>
            </Box>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/invoice-tax-details")
                    }
                    sx={{ mb: 3 }}
                >
                    Back to Invoice Tax Details
                </Button>

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            startIcon={<Refresh />}
                            onClick={fetchInvoiceTaxDetail}
                        >
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            </Box>
        );
    }

    // =====================================================
    // NO RECORD
    // =====================================================

    if (!detail) {
        return (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    No invoice tax detail record is available.
                </Alert>

                <Button
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/invoice-tax-details")
                    }
                >
                    Back to Invoice Tax Details
                </Button>
            </Box>
        );
    }

    // =====================================================
    // MAIN UI
    // =====================================================

    return (
        <Box
            sx={{
                p: { xs: 2, md: 3 },
                maxWidth: 1400,
                mx: "auto"
            }}
        >
            {/* ============================================= */}
            {/* BREADCRUMBS */}
            {/* ============================================= */}

            <Breadcrumbs sx={{ mb: 2 }}>
                <Link
                    component="button"
                    underline="hover"
                    color="inherit"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    Dashboard
                </Link>

                <Link
                    component="button"
                    underline="hover"
                    color="inherit"
                    onClick={() =>
                        navigate("/invoice-tax-details")
                    }
                >
                    Invoice Tax Details
                </Link>

                <Typography color="text.primary">
                    Details
                </Typography>
            </Breadcrumbs>

            {/* ============================================= */}
            {/* PAGE HEADER */}
            {/* ============================================= */}

            <Paper
                elevation={1}
                sx={{
                    p: { xs: 2, md: 3 },
                    mb: 3,
                    borderRadius: 2
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: {
                            xs: "flex-start",
                            sm: "center"
                        },
                        justifyContent: "space-between",
                        flexDirection: {
                            xs: "column",
                            sm: "row"
                        },
                        gap: 2
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2
                        }}
                    >
                        <Box
                            sx={{
                                width: 52,
                                height: 52,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "primary.light",
                                color: "primary.dark"
                            }}
                        >
                            <ReceiptLong fontSize="large" />
                        </Box>

                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                Invoice Tax Details
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Record ID: {detailId ?? "—"}
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap"
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={fetchInvoiceTaxDetail}
                        >
                            Refresh
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<ArrowBack />}
                            onClick={() =>
                                navigate("/invoice-tax-details")
                            }
                        >
                            Back to List
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* ============================================= */}
            {/* RECORD SUMMARY */}
            {/* ============================================= */}

            <Paper
                elevation={1}
                sx={{
                    p: { xs: 2, md: 3 },
                    mb: 3,
                    borderRadius: 2
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ mb: 2 }}
                >
                    Record Summary
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    <DetailField
                        label="Invoice Tax Detail ID"
                        value={detailId}
                    />

                    <DetailField
                        label="Sales Invoice ID"
                        value={salesInvoiceId}
                    />

                    <DetailField
                        label="Channel Product ID"
                        value={channelProductId}
                    />

                    <DetailField
                        label="Seller ID"
                        value={sellerId}
                    />

                    <DetailField
                        label="Customer ID"
                        value={customerId}
                    />
                </Grid>
            </Paper>

            {/* ============================================= */}
            {/* GST INFORMATION */}
            {/* ============================================= */}

            <Paper
                elevation={1}
                sx={{
                    p: { xs: 2, md: 3 },
                    mb: 3,
                    borderRadius: 2
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ mb: 2 }}
                >
                    GST Information
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    <DetailField
                        label="Tax Percentage"
                        value={`${formatNumber(taxPercentage)}%`}
                    />

                    <DetailField
                        label="Central GST (CGST)"
                        value={`${formatNumber(centralGst)}%`}
                    />

                    <DetailField
                        label="State GST (SGST)"
                        value={`${formatNumber(stateGst)}%`}
                    />

                    <DetailField
                        label="Integrated GST (IGST)"
                        value={`${formatNumber(integratedGst)}%`}
                    />

                    <DetailField
                        label="Compensation Cess"
                        value={`${formatNumber(compensationCess)}%`}
                    />
                </Grid>
            </Paper>

            {/* ============================================= */}
            {/* FOOTER ACTIONS */}
            {/* ============================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: 2,
                    flexWrap: "wrap"
                }}
            >
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/invoice-tax-details")
                    }
                >
                    Back to Invoice Tax Details
                </Button>
            </Box>
        </Box>
    );
};

export default InvoiceTaxDetailDetails;
