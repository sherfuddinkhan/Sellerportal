import React, { useState, useEffect } from "react";
import axios from "axios";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Divider
} from "@mui/material";

import {
    WarningAmber
} from "@mui/icons-material";

/* =========================================================
   DELETE VENDOR ITEM CUSTOM FIELD DIALOG
========================================================= */

const DeleteVendorItemCustomFieldDialog = ({
    open,
    onClose,
    record,
    onSuccess,
    apiUrl = "http://localhost:5000/api/VendorItemCustomField"
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* =====================================================
       GET RECORD ID
    ===================================================== */

    const recordId =
        record?.vendorItemCustomFieldId ??
        record?.VendorItemCustomFieldId ??
        record?.id ??
        record?.Id ??
        record?.customFieldId ??
        record?.CustomFieldId ??
        null;

    const fieldName =
        record?.fieldName ??
        record?.FieldName ??
        record?.fieldLabel ??
        record?.FieldLabel ??
        "this custom field";

    /* =====================================================
       RESET ERROR WHEN DIALOG OPENS
    ===================================================== */

    useEffect(() => {
        if (open) {
            setError("");
        }
    }, [open, record]);

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
       DELETE CUSTOM FIELD
    ===================================================== */

    const handleDelete = async () => {
        if (recordId === null || recordId === undefined || recordId === "") {
            setError(
                "Unable to delete this record because its ID is missing."
            );
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await axios.delete(
                `${apiUrl.replace(/\/+$/, "")}/${encodeURIComponent(recordId)}`
            );

            if (
                response.status >= 200 &&
                response.status < 300
            ) {
                if (onSuccess) {
                    await onSuccess(record);
                }

                if (onClose) {
                    onClose();
                }
            }
        } catch (err) {
            console.error(
                "DELETE VENDOR ITEM CUSTOM FIELD ERROR:",
                err
            );

            const responseMessage =
                err.response?.data?.message ??
                err.response?.data?.Message ??
                err.response?.data?.title ??
                err.response?.data?.Title;

            if (err.response?.status === 404) {
                setError(
                    "The custom field was not found. It may have already been deleted."
                );
            } else if (err.response?.status === 400) {
                setError(
                    responseMessage ||
                    "The request was invalid. Please check the record and try again."
                );
            } else if (err.response?.status === 401) {
                setError(
                    "You are not authorized to delete this custom field."
                );
            } else if (err.response?.status === 403) {
                setError(
                    "You do not have permission to delete this custom field."
                );
            } else if (err.response?.status === 409) {
                setError(
                    responseMessage ||
                    "This custom field cannot be deleted because it is being used elsewhere."
                );
            } else if (!err.response) {
                setError(
                    "Unable to connect to the server. Check your API URL and network connection."
                );
            } else {
                setError(
                    responseMessage ||
                    "Failed to delete the custom field. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       RENDER DIALOG
    ===================================================== */

    return (
        <Dialog
            open={Boolean(open)}
            onClose={handleClose}
            fullWidth
            maxWidth="xs"
            aria-labelledby="delete-vendor-item-custom-field-title"
        >
            <DialogTitle
                id="delete-vendor-item-custom-field-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    pb: 2
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        bgcolor: "error.light",
                        color: "error.dark",
                        flexShrink: 0
                    }}
                >
                    <DeleteOutline />
                </Box>

                <Typography variant="h6" fontWeight={700}>
                    Delete Custom Field
                </Typography>
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

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        mb: 2
                    }}
                >
                    <WarningAmber
                        color="warning"
                        sx={{ mt: 0.25 }}
                    />

                    <Box>
                        <Typography
                            variant="body1"
                            fontWeight={600}
                            gutterBottom
                        >
                            Are you sure you want to delete this custom field?
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            You are about to delete{" "}
                            <strong>{fieldName}</strong>. This action
                            cannot be undone.
                        </Typography>
                    </Box>
                </Box>

                {record && (
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "action.hover",
                            overflowWrap: "anywhere"
                        }}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Field Key
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={600}
                        >
                            {record.fieldKey ??
                                record.FieldKey ??
                                "—"}
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 1 }}
                        >
                            Field Type
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={600}
                        >
                            {record.fieldType ??
                                record.FieldType ??
                                "—"}
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    color="inherit"
                    variant="outlined"
                >
                    Cancel
                </Button>

                <Button
                    onClick={handleDelete}
                    disabled={loading || !record}
                    color="error"
                    variant="contained"
                    startIcon={
                        loading
                            ? <CircularProgress
                                size={18}
                                color="inherit"
                              />
                            : <DeleteOutline />
                    }
                >
                    {loading ? "Deleting..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteVendorItemCustomFieldDialog;

