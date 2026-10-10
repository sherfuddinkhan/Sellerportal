import React, { useEffect, useState } from "react";

import axios from "axios";

import {
Box,
Paper,
Typography,
CircularProgress,
Alert,
Snackbar
} from "@mui/material";

import {
ArrowBack,
Edit,
ReceiptLong
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";

import InvoiceTaxDetailForm from "./InvoiceTaxDetailForm";

/* =========================================================
API CONFIGURATION
========================================================= */

const API_BASE_URL = (
    import.meta.env.VITE_API_URL || ""
).replace(/\/+$/, "");

const INVOICE_TAX_DETAIL_API =
`${API_BASE_URL}/api/InvoiceTaxDetail`;

/* =========================================================
INVOICE TAX DETAIL EDIT
========================================================= */

const InvoiceTaxDetailEdit = ({
invoiceTaxDetailId: propId,
onCancel,
onUpdated
}) => {
const params = useParams();
const navigate = useNavigate();
const invoiceTaxDetailId =
    propId ??
    params.invoiceTaxDetailId ??
    params.id;

const [taxDetail, setTaxDetail] = useState(null);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState(false);

/* =====================================================
   GET INVOICE TAX DETAIL BY ID
===================================================== */

const fetchTaxDetail = async () => {
    if (
        invoiceTaxDetailId === undefined ||
        invoiceTaxDetailId === null ||
        invoiceTaxDetailId === ""
    ) {
        setError("Invoice tax detail ID is missing.");
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

        const responseData = response.data;

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
                "Invoice tax detail was not found."
            );
        }

        setTaxDetail(record);
    } catch (err) {
        console.error(
            "GET INVOICE TAX DETAIL ERROR:",
            err
        );

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

/* =====================================================
   INITIAL LOAD
===================================================== */

useEffect(() => {
    fetchTaxDetail();
}, [invoiceTaxDetailId]);

/* =====================================================
   UPDATE INVOICE TAX DETAIL
===================================================== */

const handleUpdate = async (payload) => {
    setSaving(true);
    setError("");

    try {
        const updatePayload = {
            ...payload,
            invoiceTaxDetailId:
                taxDetail?.invoiceTaxDetailId ??
                taxDetail?.InvoiceTaxDetailId ??
                invoiceTaxDetailId
        };

        const response = await axios.put(
            `${INVOICE_TAX_DETAIL_API}/${encodeURIComponent(
                invoiceTaxDetailId
            )}`,
            updatePayload
        );

        setSuccess(true);

        if (onUpdated) {
            await onUpdated(
                response.data ?? updatePayload
            );
        }
    } catch (err) {
        console.error(
            "UPDATE INVOICE TAX DETAIL ERROR:",
            err
        );

        const message =
            err.response?.data?.message ||
            err.response?.data?.title ||
            err.message ||
            "Failed to update invoice tax detail.";

        setError(message);
        throw err;
    } finally {
        setSaving(false);
    }
};

/* =====================================================
   CANCEL EDIT
===================================================== */

const handleCancel = () => {
    if (onCancel) {
        onCancel();
    } else {
        navigate(-1);
    }
};

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

/* =====================================================
   ERROR STATE
===================================================== */

if (error && !taxDetail) {
    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Alert
                severity="error"
                action={
                    <Box
                        component="span"
                        onClick={fetchTaxDetail}
                        sx={{
                            cursor: "pointer",
                            fontWeight: 600,
                            mr: 1
                        }}
                    >
                        Retry
                    </Box>
                }
            >
                {error}
            </Alert>
        </Box>
    );
}

/* =====================================================
   RENDER
===================================================== */

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
                alignItems="center"
                gap={1.5}
            >
                <Edit color="primary" fontSize="large" />

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
                        Update the invoice tax information.
                    </Typography>
                </Box>
            </Box>
        </Paper>

        {error && taxDetail && (
            <Alert
                severity="error"
                sx={{ mb: 2 }}
                onClose={() => setError("")}
            >
                {error}
            </Alert>
        )}

        {success && (
            <Alert
                severity="success"
                sx={{ mb: 2 }}
                onClose={() => setSuccess(false)}
            >
                Invoice tax detail updated successfully.
            </Alert>
        )}

        {taxDetail && (
            <InvoiceTaxDetailForm
                key={String(invoiceTaxDetailId)}
                initialData={taxDetail}
                mode="edit"
                loading={saving}
                onSubmit={handleUpdate}
                onCancel={handleCancel}
            />
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
                Invoice tax detail updated successfully.
            </Alert>
        </Snackbar>
    </Box>
);
};

export default InvoiceTaxDetailEdit;
