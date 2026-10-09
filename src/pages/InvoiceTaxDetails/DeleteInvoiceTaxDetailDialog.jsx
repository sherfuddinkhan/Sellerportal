import React, { useState, useEffect } from "react";
import axios from "axios";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Divider
} from "@mui/material";

import {
    DeleteOutline,
    WarningAmber,
    Close
} from "@mui/icons-material";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000";

const INVOICE_TAX_DETAIL_API =
    `${API_BASE_URL}/api/InvoiceTaxDetail`;

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getValue = (data, ...keys) => {
    for (const key of keys) {
        if (
            data?.[key] !== undefined &&
            data?.[key] !== null
        ) {
            return data[key];
        }
    }

    return null;
};

/* =========================================================
   DELETE INVOICE TAX DETAIL DIALOG
========================================================= */

const DeleteInvoiceTaxDetailDialog = ({
    open,
    onClose,
    invoiceTaxDetail,
    data,
    invoiceTaxDetailId,
    onDeleted
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const detail = invoiceTaxDetail || data || {};

    const id =
        invoiceTaxDetailId ??
        getValue(
            detail,
            "invoiceTaxDetailId",
            "InvoiceTaxDetailId",
            "id",
            "Id"
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

    const invoiceId = getValue(
        detail,
        "invoiceId",
        "InvoiceId"
    );

    /* =====================================================
       RESET ERROR WHEN DIALOG OPENS
    ===================================================== */

    useEffect(() => {
        if (open) {
            setError("");
        }
    }, [open]);

    /* =====================================================
       CLOSE DIALOG
    ===================================================== */

    const handleClose = () => {
        if (loading) return;

        setError("");

        if (onClose) {
            onClose();
        }
    };

    /* =====================================================
       DELETE RECORD
    ===================================================== */

    const handleDelete = async () => {
        if (id === null || id === undefined || id === "") {
            setError("Invoice tax detail ID is missing.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.delete(
                `${INVOICE_TAX_DETAIL_API}/${encodeURIComponent(id)}`
            );

            if (response.data?.success === false) {
                throw new Error(
                    response.data?.message ||
                    "Failed to delete invoice tax detail."
                );
            }

            if (onDeleted) {
                await onDeleted(detail);
            }

            setError("");

            if (onClose) {
                onClose();
            }
        } catch (err) {
            console.error(
                "DELETE INVOICE TAX DETAIL ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to delete invoice tax detail. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={Boolean(open)}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            aria-labelledby="delete-invoice-tax-detail-title"
        >
            <DialogTitle
                id="delete-invoice-tax-detail-title"
                sx={{ pb: 1.5 }}
            >
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "error.light",
                            color: "error.contrastText"
                        }}
                    >
                        <WarningAmber />
                    </Box>

                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            Delete Invoice Tax Detail
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Confirm before continuing.
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ pt: 3 }}>
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                        onClose={() => setError("")}
                    >
                        {error}
                    </Alert>
                )}

                <DialogContentText sx={{ mb: 2 }}>
                    Are you sure you want to delete this invoice tax
                    detail? This action may not be reversible.
                </DialogContentText>

                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "action.hover"
                    }}
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        gap={2}
                        mb={1}
                    >
                        <Typography color="text.secondary">
                            Record ID
                        </Typography>

                        <Typography fontWeight={600}>
                            {id ?? "—"}
                        </Typography>
                    </Box>

                    <Box
                        display="flex"
                        justifyContent="space-between"
                        gap={2}
                        mb={1}
                    >
                        <Typography color="text.secondary">
                            Invoice ID
                        </Typography>

                        <Typography fontWeight={600}>
                            {invoiceId ?? "—"}
                        </Typography>
                    </Box>

                    <Box
                        display="flex"
                        justifyContent="space-between"
                        gap={2}
                        mb={1}
                    >
                        <Typography color="text.secondary">
                            Tax Name
                        </Typography>

                        <Typography
                            fontWeight={600}
                            textAlign="right"
                            sx={{ overflowWrap: "anywhere" }}
                        >
                            {taxName ?? "—"}
                        </Typography>
                    </Box>

                    <Box
                        display="flex"
                        justifyContent="space-between"
                        gap={2}
                    >
                        <Typography color="text.secondary">
                            Tax Code
                        </Typography>

                        <Typography fontWeight={600}>
                            {taxCode ?? "—"}
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 2.5, gap: 1 }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<Close />}
                    onClick={handleClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    startIcon={
                        loading ? (
                            <CircularProgress
                                size={18}
                                color="inherit"
                            />
                        ) : (
                            <DeleteOutline />
                        )
                    }
                    onClick={handleDelete}
                    disabled={loading || id === null || id === undefined || id === ""}
                >
                    {loading ? "Deleting..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteInvoiceTaxDetailDialog;

