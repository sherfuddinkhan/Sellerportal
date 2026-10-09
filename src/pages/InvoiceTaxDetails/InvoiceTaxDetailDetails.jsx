import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Box,
    Paper,
    Typography,
    Grid,
    Chip,
    Button,
    Divider,
    CircularProgress,
    Alert,
    Snackbar
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    ReceiptLong,
    Refresh
} from "@mui/icons-material";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000";

const INVOICE_TAX_DETAIL_API =
    `${API_BASE_URL}/api/InvoiceTaxDetail`;

/* =========================================================
   FORMAT HELPERS
========================================================= */

const formatNumber = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0.00";
    }

    return number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const formatCurrency = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "₹ 0.00";
    }

    return `₹ ${number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

const getValue = (data, ...keys) => {
    for (const key of keys) {
        const value = data?.[key];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return null;
};

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

/* =========================================================
   DETAIL FIELD
========================================================= */

const DetailField = ({ label, value }) => (
    <Grid item xs={12} sm={6} md={4}>
        <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mb: 0.5 }}
        >
            {label}
        </Typography>

        <Typography
            variant="body1"
            fontWeight={600}
            sx={{ overflowWrap: "anywhere" }}
        >
            {value === undefined || value === null || value === ""
                ? "—"
                : value}
        </Typography>
    </Grid>
);

/* =========================================================
   INVOICE TAX DETAIL DETAILS
========================================================= */

const InvoiceTaxDetailDetails = ({
    invoiceTaxDetailId: propId,
    onEdit,
    onBack
}) => {
    const params = useParams();
    const navigate = useNavigate();

    const invoiceTaxDetailId =
        propId ||
        params.invoiceTaxDetailId ||
        params.id;

    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const [success, setSuccess] = useState(false);

    /* =====================================================
       FETCH INVOICE TAX DETAIL
    ===================================================== */

    const fetchDetail = async () => {
        if (!invoiceTaxDetailId) {
            setError("Invoice tax detail ID was not provided.");
            setDetail(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.get(
                `${INVOICE_TAX_DETAIL_API}/${encodeURIComponent(
                    invoiceTaxDetailId
                )}`
            );

            const result = response.data;

            if (
                result === null ||
                result === undefined ||
                result.success === false
            ) {
                throw new Error(
                    result?.message ||
                    "Invoice tax detail was not found."
                );
            }

            const record =
                result.data ??
                result.result ??
                result;

            if (
                record === null ||
                typeof record !== "object" ||
                Array.isArray(record)
            ) {
                throw new Error(
                    "The API returned an invalid invoice tax detail."
                );
            }

            setDetail(record);
        } catch (err) {
            console.error(
                "GET INVOICE TAX DETAIL BY ID ERROR:",
                err
            );

            setDetail(null);

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to load invoice tax detail."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
        // Fetch again when the ID or refresh key changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoiceTaxDetailId, refreshKey]);

    /* =====================================================
       NAVIGATION
    ===================================================== */

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(detail);
        } else {
            navigate(
                `/invoice-tax-details/${encodeURIComponent(
                    invoiceTaxDetailId
                )}/edit`
            );
        }
    };

    /* =====================================================
       DERIVED VALUES
    ===================================================== */

    const detailId = getValue(
        detail,
        "invoiceTaxDetailId",
        "InvoiceTaxDetailId",
        "id",
        "Id"
    );

    const invoiceId = getValue(
        detail,
        "invoiceId",
        "InvoiceId"
    );

    const taxName = getValue(
        detail,
        "taxName",
        "TaxName"
    );

    const taxCode = getValue(
        detail,
        "taxCode",
        "TaxCode"
    );

    const taxRate = getValue(
        detail,
        "taxRate",
        "TaxRate"
    );

    const taxableAmount = getValue(
        detail,
        "taxableAmount",
        "TaxableAmount"
    );

    const taxAmount = getValue(
        detail,
        "taxAmount",
        "TaxAmount"
    );

    const status = getValue(
        detail,
        "status",
        "Status"
    );

    const createdAt = getValue(
        detail,
        "createdAt",
        "CreatedAt",
        "createdDate",
        "CreatedDate"
    );

    const updatedAt = getValue(
        detail,
        "updatedAt",
        "UpdatedAt",
        "modifiedDate",
        "ModifiedDate"
    );

    /* =====================================================
       LOADING STATE
    ===================================================== */

    if (loading) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight={300}
                gap={2}
            >
                <CircularProgress />

                <Typography color="text.secondary">
                    Loading invoice tax detail...
                </Typography>
            </Box>
        );
    }

    /* =====================================================
       ERROR STATE
    ===================================================== */

    if (error && !detail) {
        return (
            <Box sx={{ p: { xs: 1.5, md: 3 } }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    sx={{ mb: 2 }}
                >
                    Back
                </Button>

                <Alert
                    severity="error"
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            startIcon={<Refresh />}
                            onClick={() =>
                                setRefreshKey((value) => value + 1)
                            }
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

    /* =====================================================
       MAIN VIEW
    ===================================================== */

    return (
        <Box sx={{ p: { xs: 1.5, md: 3 } }}>
            {/* HEADER */}

            <Paper
                elevation={1}
                sx={{
                    p: { xs: 2, md: 3 },
                    mb: 3,
                    borderRadius: 2
                }}
            >
                <Box
                    display="flex"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                    flexDirection={{ xs: "column", sm: "row" }}
                    gap={2}
                >
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <ReceiptLong
                            color="primary"
                            sx={{ fontSize: 40 }}
                        />

                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                Invoice Tax Detail
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                View invoice tax information and amounts.
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        display="flex"
                        gap={1}
                        flexWrap="wrap"
                    >
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={handleBack}
                        >
                            Back
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={handleEdit}
                        >
                            Edit
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {error && (
                <Alert
                    severity="warning"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            {/* RECORD SUMMARY */}

            <Paper
                elevation={1}
                sx={{
                    p: { xs: 2, md: 3 },
                    mb: 3,
                    borderRadius: 2
                }}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    gap={2}
                    mb={2}
                >
                    <Typography variant="h6" fontWeight={700}>
                        Record Summary
                    </Typography>

                    <Chip
                        label={
                            status === null
                                ? "Status unavailable"
                                : String(status)
                        }
                        color={
                            String(status ?? "").toLowerCase() === "active"
                                ? "success"
                                : String(status ?? "").toLowerCase() === "inactive"
                                ? "default"
                                : "primary"
                        }
                        variant="outlined"
                    />
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    <DetailField
                        label="Invoice Tax Detail ID"
                        value={detailId ?? invoiceTaxDetailId}
                    />

                    <DetailField
                        label="Invoice ID"
                        value={invoiceId}
                    />

                    <DetailField
                        label="Tax Name"
                        value={taxName}
                    />

                    <DetailField
                        label="Tax Code"
                        value={taxCode}
                    />

                    <DetailField
                        label="Tax Rate"
                        value={
                            taxRate === null
                                ? "—"
                                : `${formatNumber(taxRate)}%`
                        }
                    />

                    <DetailField
                        label="Status"
                        value={status}
                    />
                </Grid>
            </Paper>

            {/* TAX AMOUNTS */}

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
                    Tax Amounts
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    <DetailField
                        label="Taxable Amount"
                        value={
                            taxableAmount === null
                                ? "—"
                                : formatCurrency(taxableAmount)
                        }
                    />

                    <DetailField
                        label="Tax Amount"
                        value={
                            taxAmount === null
                                ? "—"
                                : formatCurrency(taxAmount)
                        }
                    />
                </Grid>
            </Paper>

            {/* AUDIT INFORMATION */}

            {(createdAt || updatedAt) && (
                <Paper
                    elevation={1}
                    sx={{
                        p: { xs: 2, md: 3 },
                        borderRadius: 2
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Audit Information
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                        {createdAt && (
                            <DetailField
                                label="Created At"
                                value={formatDate(createdAt)}
                            />
                        )}

                        {updatedAt && (
                            <DetailField
                                label="Updated At"
                                value={formatDate(updatedAt)}
                            />
                        )}
                    </Grid>
                </Paper>
            )}

            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={() => setSuccess(false)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => setSuccess(false)}
                >
                    Operation completed successfully.
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default InvoiceTaxDetailDetails;

