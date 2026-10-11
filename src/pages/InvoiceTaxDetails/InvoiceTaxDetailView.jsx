// =========================================================
// InvoiceTaxDetailView.jsx
// =========================================================

import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    Box,
    Paper,
    Typography,
    Grid,
    Divider,
    Button,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";

import {
    ArrowBack,
    ReceiptLong,
    Refresh
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_URL =
    "http://localhost:5000/api/InvoiceTaxDetail";

// =========================================================
// GET FIELD SUPPORTING CAMELCASE AND PASCALCASE
// =========================================================

const getValue = (obj, camelCase, pascalCase) =>
    obj?.[camelCase] ?? obj?.[pascalCase] ?? "";

// =========================================================
// FORMAT NUMBER
// =========================================================

const formatNumber = (value) => {
    if (value === "" || value === null || value === undefined) {
        return "—";
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return String(value);
    }

    return number.toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
};

// =========================================================
// DETAIL FIELD
// =========================================================

const DetailField = ({ label, value }) => (
    <Grid item xs={12} sm={6} md={4}>
        <Typography
            variant="caption"
            color="text.secondary"
            display="block"
        >
            {label}
        </Typography>

        <Typography
            variant="body1"
            fontWeight={500}
            sx={{
                overflowWrap: "anywhere",
                mt: 0.5
            }}
        >
            {value === "" ||
            value === null ||
            value === undefined
                ? "—"
                : String(value)}
        </Typography>
    </Grid>
);

// =========================================================
// INVOICE TAX DETAIL VIEW
// =========================================================

const InvoiceTaxDetailView = ({
    invoiceTaxDetailId: propId,
    apiUrl,
    onBack,
    onLoaded
}) => {
    const { id: routeId } = useParams();
    const navigate = useNavigate();

    const invoiceTaxDetailId =
        propId ?? routeId;

    const [taxDetail, setTaxDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // =====================================================
    // FETCH INVOICE TAX DETAIL
    // =====================================================

    const fetchTaxDetail = useCallback(async () => {
        if (
            invoiceTaxDetailId === undefined ||
            invoiceTaxDetailId === null ||
            invoiceTaxDetailId === ""
        ) {
            setTaxDetail(null);
            setError("Invoice tax detail ID is required.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const endpoint = (
                apiUrl || API_URL
            ).replace(/\/+$/, "");

            const response = await axios.get(
                `${endpoint}/${encodeURIComponent(
                    invoiceTaxDetailId
                )}`,
                {
                    headers: {
                        Accept: "application/json"
                    },
                    timeout: 15000
                }
            );

            const data = response.data;

            const record = Array.isArray(data)
                ? data[0]
                : data?.data ??
                  data?.result ??
                  data;

            if (
                !record ||
                typeof record !== "object" ||
                Array.isArray(record)
            ) {
                throw new Error(
                    "Invoice tax detail was not found."
                );
            }

            setTaxDetail(record);

            if (typeof onLoaded === "function") {
                onLoaded(record);
            }
        } catch (err) {
            console.error(
                "GET INVOICE TAX DETAIL ERROR:",
                err.response?.data || err.message
            );

            setTaxDetail(null);

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to load invoice tax detail."
            );
        } finally {
            setLoading(false);
        }
    }, [invoiceTaxDetailId, apiUrl, onLoaded]);

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        fetchTaxDetail();
    }, [fetchTaxDetail]);

    // =====================================================
    // EXTRACT ACTUAL DATABASE FIELDS
    // =====================================================

    const detailId = getValue(
        taxDetail,
        "invoiceTaxDetailId",
        "InvoiceTaxDetailId"
    );

    const salesInvoiceId = getValue(
        taxDetail,
        "salesInvoiceId",
        "SalesInvoiceId"
    );

    const channelProductId = getValue(
        taxDetail,
        "channelProductId",
        "ChannelProductId"
    );

    const taxPercentage = getValue(
        taxDetail,
        "taxPercentage",
        "TaxPercentage"
    );

    const centralGst = getValue(
        taxDetail,
        "centralGst",
        "CentralGst"
    );

    const stateGst = getValue(
        taxDetail,
        "stateGst",
        "StateGst"
    );

    const integratedGst = getValue(
        taxDetail,
        "integratedGst",
        "IntegratedGst"
    );

    const compensationCess = getValue(
        taxDetail,
        "compensationCess",
        "CompensationCess"
    );

    const sellerId = getValue(
        taxDetail,
        "sellerId",
        "SellerId"
    );

    const customerId = getValue(
        taxDetail,
        "customerId",
        "CustomerId"
    );

    // =====================================================
    // BACK NAVIGATION
    // =====================================================

    const handleBack = () => {
        if (typeof onBack === "function") {
            onBack();
        } else {
            navigate("/invoice-tax-details");
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading && !taxDetail) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                gap={2}
                sx={{ py: 8 }}
            >
                <CircularProgress />

                <Typography color="text.secondary">
                    Loading invoice tax detail...
                </Typography>
            </Box>
        );
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* HEADER */}

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
                mb={3}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                >
                    <ReceiptLong
                        color="primary"
                        fontSize="large"
                    />

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
                            Record ID: {invoiceTaxDetailId}
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" gap={1}>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={fetchTaxDetail}
                        disabled={loading}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                </Box>
            </Box>

            {/* ERROR */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={fetchTaxDetail}
                        >
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            )}

            {/* DETAILS */}

            {taxDetail && (
                <>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2, md: 3 },
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            mb: 3
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            mb={2}
                        >
                            Tax Detail Information
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
                                label="Tax Percentage"
                                value={
                                    taxPercentage === ""
                                        ? "—"
                                        : `${formatNumber(
                                              taxPercentage
                                          )}%`
                                }
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

                    {/* TAX BREAKDOWN */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2, md: 3 },
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            mb={2}
                        >
                            GST Breakdown
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Tax Component
                                        </TableCell>

                                        <TableCell align="right">
                                            Value
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            Central GST (CGST)
                                        </TableCell>

                                        <TableCell align="right">
                                            {formatNumber(centralGst)}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            State GST (SGST)
                                        </TableCell>

                                        <TableCell align="right">
                                            {formatNumber(stateGst)}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            Integrated GST (IGST)
                                        </TableCell>

                                        <TableCell align="right">
                                            {formatNumber(integratedGst)}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            Compensation Cess
                                        </TableCell>

                                        <TableCell align="right">
                                            {formatNumber(
                                                compensationCess
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </>
            )}
        </Box>
    );
};

export default InvoiceTaxDetailView;

