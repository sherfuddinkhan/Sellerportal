// DeleteShippingManifestDialog.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Snackbar,
    Stack,
    Typography
} from "@mui/material";

import {
    Delete,
    WarningAmber,
    LocalShipping,
    Close,
    CheckCircle
} from "@mui/icons-material";

/* =========================================================
   DEFAULT API URL
========================================================= */

const DEFAULT_API_URL = "/api/ShippingManifest";

/* =========================================================
   FIELD HELPER
========================================================= */

const getField = (object, ...keys) => {
    for (const key of keys) {
        const value = object?.[key];

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }
    }

    return null;
};

/* =========================================================
   ERROR MESSAGE HELPER
========================================================= */

const getErrorMessage = (error) => {
    const responseData = error?.response?.data;

    if (typeof responseData === "string") {
        return responseData;
    }

    return (
        responseData?.message ??
        responseData?.Message ??
        responseData?.error ??
        responseData?.title ??
        error?.message ??
        "Failed to delete shipping manifest."
    );
};

/* =========================================================
   DELETE SHIPPING MANIFEST DIALOG
========================================================= */

const DeleteShippingManifestDialog = ({
    open = false,
    onClose,
    onDeleted,
    onSuccess,

    manifest,
    record,
    data,

    apiUrl = DEFAULT_API_URL,

    /*
     * If true, this dialog only confirms deletion.
     * The parent component is responsible for the API call.
     */
    confirmOnly = false,

    /*
     * Optional override for the record ID.
     */
    manifestId,
    loading: externalLoading
}) => {
    const item = manifest ?? record ?? data ?? {};

    const id =
        manifestId ??
        getField(
            item,
            "shippingManifestId",
            "ShippingManifestId",
            "manifestId",
            "ManifestId",
            "id",
            "Id"
        );

    const manifestNumber =
        getField(
            item,
            "manifestNumber",
            "ManifestNumber",
            "shippingManifestNumber",
            "ShippingManifestNumber"
        ) ?? (id != null ? `MAN-${id}` : "Unknown manifest");

    const orderNumber = getField(
        item,
        "orderNumber",
        "OrderNumber",
        "salesOrderNumber",
        "SalesOrderNumber",
        "purchaseOrderNumber",
        "PurchaseOrderNumber"
    );

    const customerName = getField(
        item,
        "customerName",
        "CustomerName",
        "recipientName",
        "RecipientName"
    );

    const status = getField(
        item,
        "status",
        "Status",
        "shipmentStatus",
        "ShipmentStatus"
    );

    const [deleting, setDeleting] = useState(false);

    const [notification, setNotification] = useState({
        open: false,
        severity: "success",
        message: ""
    });

    const isLoading =
        deleting || Boolean(externalLoading);

    /* =====================================================
       RESET STATE WHEN DIALOG OPENS
    ===================================================== */

    useEffect(() => {
        if (open) {
            setDeleting(false);
            setNotification((previous) => ({
                ...previous,
                open: false
            }));
        }
    }, [open]);

    /* =====================================================
       CLOSE DIALOG
    ===================================================== */

    const handleClose = () => {
        if (isLoading) {
            return;
        }

        if (typeof onClose === "function") {
            onClose();
        }
    };

    /* =====================================================
       NOTIFICATION
    ===================================================== */

    const showNotification = (
        message,
        severity = "success"
    ) => {
        setNotification({
            open: true,
            severity,
            message
        });
    };

    const handleNotificationClose = (_, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setNotification((previous) => ({
            ...previous,
            open: false
        }));
    };

    /* =====================================================
       DELETE HANDLER
    ===================================================== */

    const handleDelete = async () => {
        if (isLoading) {
            return;
        }

        if (id === null || id === undefined || id === "") {
            showNotification(
                "Cannot delete manifest: manifest ID is missing.",
                "error"
            );
            return;
        }

        if (confirmOnly) {
            if (typeof onDeleted === "function") {
                onDeleted(item);
            }

            return;
        }

        setDeleting(true);

        try {
            const response = await axios.delete(
                `${apiUrl.replace(/\/+$/, "")}/${encodeURIComponent(id)}`
            );

            showNotification(
                "Shipping manifest deleted successfully.",
                "success"
            );

            if (typeof onDeleted === "function") {
                onDeleted(item, response);
            }

            if (typeof onSuccess === "function") {
                onSuccess(item, response);
            }

            if (typeof onClose === "function") {
                onClose();
            }
        } catch (error) {
            console.error(
                "DELETE SHIPPING MANIFEST ERROR:",
                error
            );

            showNotification(
                getErrorMessage(error),
                "error"
            );
        } finally {
            setDeleting(false);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="xs"
                aria-labelledby="delete-shipping-manifest-title"
            >
                {/* DIALOG TITLE */}

                <DialogTitle
                    id="delete-shipping-manifest-title"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5
                        }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: "error.light",
                                color: "error.dark"
                            }}
                        >
                            <Delete />
                        </Avatar>

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Delete Shipping Manifest
                        </Typography>
                    </Box>

                    <Button
                        onClick={handleClose}
                        disabled={isLoading}
                        color="inherit"
                        size="small"
                        sx={{ minWidth: 36 }}
                        aria-label="Close dialog"
                    >
                        <Close />
                    </Button>
                </DialogTitle>

                <Divider />

                {/* DIALOG CONTENT */}

                <DialogContent sx={{ pt: 3 }}>
                    <Stack spacing={2}>
                        <Alert
                            severity="warning"
                            icon={<WarningAmber />}
                        >
                            Are you sure you want to delete this
                            shipping manifest? This action may not
                            be reversible.
                        </Alert>

                        {/* MANIFEST SUMMARY */}

                        <Box
                            sx={{
                                p: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1.5}
                                alignItems="center"
                                sx={{ mb: 1.5 }}
                            >
                                <LocalShipping color="primary" />

                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                    sx={{ overflowWrap: "anywhere" }}
                                >
                                    {manifestNumber}
                                </Typography>
                            </Stack>

                            <Divider sx={{ mb: 1.5 }} />

                            <Stack spacing={1}>
                                <Box>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Manifest ID
                                    </Typography>

                                    <Typography variant="body2">
                                        {id ?? "Not available"}
                                    </Typography>
                                </Box>

                                {orderNumber && (
                                    <Box>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Order Number
                                        </Typography>

                                        <Typography variant="body2">
                                            {orderNumber}
                                        </Typography>
                                    </Box>
                                )}

                                {customerName && (
                                    <Box>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Customer / Recipient
                                        </Typography>

                                        <Typography variant="body2">
                                            {customerName}
                                        </Typography>
                                    </Box>
                                )}

                                {status && (
                                    <Box>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Current Status
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                textTransform: "capitalize"
                                            }}
                                        >
                                            {String(status).replace(
                                                /[_-]+/g,
                                                " "
                                            )}
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </Box>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            The manifest will be removed using its
                            ID. Please verify the details before
                            continuing.
                        </Typography>
                    </Stack>
                </DialogContent>

                <Divider />

                {/* DIALOG ACTIONS */}

                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        gap: 1
                    }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        startIcon={
                            isLoading ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            ) : (
                                <Delete />
                            )
                        }
                        onClick={handleDelete}
                        disabled={isLoading || id == null || id === ""}
                    >
                        {isLoading
                            ? "Deleting..."
                            : confirmOnly
                                ? "Confirm Delete"
                                : "Delete Manifest"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* NOTIFICATION */}

            <Snackbar
                open={notification.open}
                autoHideDuration={5000}
                onClose={handleNotificationClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity={notification.severity}
                    variant="filled"
                    onClose={handleNotificationClose}
                    icon={
                        notification.severity === "success"
                            ? <CheckCircle />
                            : undefined
                    }
                    sx={{ width: "100%" }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DeleteShippingManifestDialog;

