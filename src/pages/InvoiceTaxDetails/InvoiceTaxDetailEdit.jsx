// =========================================================
// InvoiceTaxDetailEdit.jsx
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
    CircularProgress,
    Alert,
    Snackbar,
    Button
} from "@mui/material";

import {
    Edit,
    ArrowBack
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import InvoiceTaxDetailForm from "./InvoiceTaxDetailForm";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_URL =
    "http://localhost:5000/api/invoice-tax-details";

// =========================================================
// GET FIELD VALUE - CAMELCASE / PASCALCASE
// =========================================================

const getField = (data, camelCase, pascalCase, fallback = "") => {
    return data?.[camelCase] ??
        data?.[pascalCase] ??
        fallback;
};

// =========================================================
// NORMALIZE API RECORD
// =========================================================

const normalizeTaxDetail = (data) => ({
    invoiceTaxDetailId: getField(
        data,
        "invoiceTaxDetailId",
        "InvoiceTaxDetailId"
    ),

    salesInvoiceId: getField(
        data,
        "salesInvoiceId",
        "SalesInvoiceId",
        0
    ),

    channelProductId: getField(
        data,
        "channelProductId",
        "ChannelProductId"
    ),

    taxPercentage: getField(
        data,
        "taxPercentage",
        "TaxPercentage",
        0
    ),

    centralGst: getField(
        data,
        "centralGst",
        "CentralGst",
        0
    ),

    stateGst: getField(
        data,
        "stateGst",
        "StateGst",
        0
    ),

    integratedGst: getField(
        data,
        "integratedGst",
        "IntegratedGst",
        0
    ),

    compensationCess: getField(
        data,
        "compensationCess",
        "CompensationCess",
        0
    ),

    sellerId: getField(
        data,
        "sellerId",
        "SellerId",
        0
    ),

    customerId: getField(
        data,
        "customerId",
        "CustomerId",
        0
    )
});

// =========================================================
// INVOICE TAX DETAIL EDIT
// =========================================================

const InvoiceTaxDetailEdit = ({
    invoiceTaxDetailId: propId,
    onCancel,
    onUpdated
}) => {
    const navigate = useNavigate();
    const params = useParams();

    const invoiceTaxDetailId =
        propId ??
        params.id ??
        params.invoiceTaxDetailId;

    const [taxDetail, setTaxDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // GET INVOICE TAX DETAIL BY ID
    // =====================================================

    const fetchTaxDetail = useCallback(async () => {
        if (
            invoiceTaxDetailId === undefined ||
            invoiceTaxDetailId === null ||
            String(invoiceTaxDetailId).trim() === ""
        ) {
            setTaxDetail(null);
            setError("Invoice tax detail ID is missing.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");
        setTaxDetail(null);

        try {
            const url =
                `${API_URL}/${encodeURIComponent(
                    invoiceTaxDetailId
                )}`;

            console.log("Fetching invoice tax detail:", url);

            const response = await axios.get(url, {
                headers: {
                    Accept: "application/json"
                },
                timeout: 15000
            });

            const responseData = response.data;

            const record =
                responseData?.data ??
                responseData?.result ??
                responseData;

            const recordId =
                record?.invoiceTaxDetailId ??
                record?.InvoiceTaxDetailId;

            if (
                !record ||
                typeof record !== "object" ||
                Array.isArray(record) ||
                recordId == null
            ) {
                throw new Error(
                    "The API response does not contain a valid invoice tax detail record."
                );
            }

            setTaxDetail(normalizeTaxDetail(record));
        } catch (err) {
            console.error("GET INVOICE TAX DETAIL ERROR:", {
                url: err.config?.url,
                status: err.response?.status,
                response: err.response?.data,
                message: err.message
            });

            setTaxDetail(null);

            if (err.response?.status === 404) {
                setError(
                    `Invoice tax detail ${invoiceTaxDetailId} was not found. Check the Node proxy URL and ASP.NET endpoint.`
                );
            } else {
                setError(
                    err.response?.data?.message ||
                    err.response?.data?.title ||
                    err.message ||
                    "Failed to load invoice tax detail."
                );
            }
        } finally {
            setLoading(false);
        }
    }, [invoiceTaxDetailId]);

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        fetchTaxDetail();
    }, [fetchTaxDetail]);

    // =====================================================
    // UPDATE INVOICE TAX DETAIL
    // =====================================================

    const handleUpdate = async (formData) => {
        if (
            invoiceTaxDetailId === undefined ||
            invoiceTaxDetailId === null ||
            String(invoiceTaxDetailId).trim() === ""
        ) {
            setError("Invoice tax detail ID is missing.");
            return;
        }

        if (!taxDetail) {
            setError("Load the invoice tax detail before updating.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const submittedData =
                formData?.data ??
                formData?.result ??
                formData ??
                {};

            // Only send fields that exist in the actual database.
            const updatePayload = {
                invoiceTaxDetailId: Number(invoiceTaxDetailId),

                salesInvoiceId: Number(
                    getField(
                        submittedData,
                        "salesInvoiceId",
                        "SalesInvoiceId",
                        taxDetail.salesInvoiceId
                    )
                ),

                channelProductId: String(
                    getField(
                        submittedData,
                        "channelProductId",
                        "ChannelProductId",
                        taxDetail.channelProductId
                    )
                ),

                taxPercentage: Number(
                    getField(
                        submittedData,
                        "taxPercentage",
                        "TaxPercentage",
                        taxDetail.taxPercentage
                    )
                ),

                centralGst: Number(
                    getField(
                        submittedData,
                        "centralGst",
                        "CentralGst",
                        taxDetail.centralGst
                    )
                ),

                stateGst: Number(
                    getField(
                        submittedData,
                        "stateGst",
                        "StateGst",
                        taxDetail.stateGst
                    )
                ),

                integratedGst: Number(
                    getField(
                        submittedData,
                        "integratedGst",
                        "IntegratedGst",
                        taxDetail.integratedGst
                    )
                ),

                compensationCess: Number(
                    getField(
                        submittedData,
                        "compensationCess",
                        "CompensationCess",
                        taxDetail.compensationCess
                    )
                ),

                sellerId: Number(
                    getField(
                        submittedData,
                        "sellerId",
                        "SellerId",
                        taxDetail.sellerId
                    )
                ),

                customerId: Number(
                    getField(
                        submittedData,
                        "customerId",
                        "CustomerId",
                        taxDetail.customerId
                    )
                )
            };

            // Prevent accidental NaN values.
            const numericFields = [
                "salesInvoiceId",
                "taxPercentage",
                "centralGst",
                "stateGst",
                "integratedGst",
                "compensationCess",
                "sellerId",
                "customerId"
            ];

            for (const field of numericFields) {
                if (!Number.isFinite(updatePayload[field])) {
                    throw new Error(
                        `Invalid numeric value for ${field}.`
                    );
                }
            }

            const url =
                `${API_URL}/${encodeURIComponent(
                    invoiceTaxDetailId
                )}`;

            console.log("Updating invoice tax detail:", {
                url,
                payload: updatePayload
            });

            const response = await axios.put(
                url,
                updatePayload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    timeout: 15000
                }
            );

            const responseRecord =
                response.data?.data ??
                response.data?.result ??
                response.data;

            const updatedRecord =
                responseRecord &&
                typeof responseRecord === "object" &&
                !Array.isArray(responseRecord) &&
                (
                    responseRecord.invoiceTaxDetailId != null ||
                    responseRecord.InvoiceTaxDetailId != null
                )
                    ? normalizeTaxDetail(responseRecord)
                    : updatePayload;

            setTaxDetail(updatedRecord);

            setSuccess(
                "Invoice tax detail updated successfully."
            );

            if (typeof onUpdated === "function") {
                await onUpdated(updatedRecord);
            }
        } catch (err) {
            console.error("UPDATE INVOICE TAX DETAIL ERROR:", {
                url: err.config?.url,
                status: err.response?.status,
                response: err.response?.data,
                message: err.message
            });

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to update invoice tax detail."
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {
        if (typeof onCancel === "function") {
            onCancel();
        } else {
            navigate("/invoice-tax-details");
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
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
    // ERROR - RECORD NOT LOADED
    // =====================================================

    if (!taxDetail) {
        return (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Alert
                    severity="error"
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
                    {error || "Invoice tax detail could not be loaded."}
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    startIcon={<ArrowBack />}
                    onClick={handleCancel}
                >
                    Back to Invoice Tax Details
                </Button>
            </Box>
        );
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box sx={{ p: { xs: 1.5, md: 3 } }}>
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
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1.5}
                    >
                        <Edit
                            color="primary"
                            fontSize="large"
                        />

                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                Edit Invoice Tax Detail
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Record ID: {invoiceTaxDetailId}
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleCancel}
                        disabled={saving}
                    >
                        Back
                    </Button>
                </Box>
            </Paper>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            <InvoiceTaxDetailForm
                key={String(invoiceTaxDetailId)}
                initialData={taxDetail}
                mode="edit"
                loading={saving}
                onSubmit={handleUpdate}
                onCancel={handleCancel}
            />

            <Snackbar
                open={Boolean(success)}
                autoHideDuration={3000}
                onClose={() => setSuccess("")}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => setSuccess("")}
                >
                    {success}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default InvoiceTaxDetailEdit;
