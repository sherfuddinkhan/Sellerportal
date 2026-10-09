
// DeleteReversePickupItemDialog.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Snackbar,
    Stack,
    Typography,
    Box
} from "@mui/material";

import {
    Delete,
    WarningAmber,
    Close
} from "@mui/icons-material";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const API_URL = `${API_BASE_URL}/api/ReversePickupItems`;

/* =========================================================
   ERROR HELPER
========================================================= */

const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (typeof data === "string") {
        return data;
    }

    if (data?.message) {
        return data.message;
    }

    if (data?.title) {
        return data.title;
    }

    if (data?.errors) {
        return Object.values(data.errors)
            .flat()
            .join(", ");
    }

    if (error?.response?.status === 404) {
        return "Reverse pickup item was not found.";
    }

    if (error?.response?.status === 409) {
        return "This item cannot be deleted because it is referenced by another record.";
    }

    return error?.message ||
        "Failed to delete reverse pickup item. Please try again.";
};

/* =========================================================
   DELETE REVERSE PICKUP ITEM DIALOG
========================================================= */

const DeleteReversePickupItemDialog = ({
    open = false,
    onClose,
    onDeleted,
    onSuccess,

    item,
    reversePickupItem,

    itemId,
    id,

    apiUrl = API_URL,

    title = "Delete Reverse Pickup Item",
    confirmText = "Delete Item",
    cancelText = "Cancel"
}) => {
    /* =====================================================
       STATE
    ===================================================== */

    const [deleting, setDeleting] = useState(false);

    const [error, setError] = useState("");

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    /* =====================================================
       RESOLVE ITEM
    ===================================================== */

    const selectedItem = item || reversePickupItem || {};

    const resolvedId =
        itemId ??
        id ??
        selectedItem.reversePickupItemId ??
        selectedItem.ReversePickupItemId ??
        selectedItem.id ??
        selectedItem.Id ??
        "";

    const itemName =
        selectedItem.itemName ??
        selectedItem.ItemName ??
        selectedItem.productName ??
        selectedItem.ProductName ??
        "";

    const sku =
        selectedItem.sku ??
        selectedItem.SKU ??
        "";

    const quantity =
        selectedItem.quantity ??
        selectedItem.Quantity;

    const reversePickupNumber =
        selectedItem.reversePickupNumber ??
        selectedItem.ReversePickupNumber ??
        "";

    /* =====================================================
       RESET ERROR WHEN OPENING
    ===================================================== */

    useEffect(() => {
        if (open) {
            setError("");
        }
    }, [open, resolvedId]);

    /* =====================================================
       NOTIFICATION
    ===================================================== */

    const showNotification = (
        message,
        severity = "success"
    ) => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    const closeNotification = (_, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setNotification((previous) => ({
            ...previous,
            open: false
        }));
    };

    /* =====================================================
       CLOSE DIALOG
    ===================================================== */

    const handleClose = () => {
        if (deleting) {
            return;
        }

        setError("");

        if (typeof onClose === "function") {
            onClose();
        }
    };

    /* =====================================================
       DELETE ITEM
    ===================================================== */

    const handleDelete = async () => {
        if (
            resolvedId === "" ||
            resolvedId === null ||
            resolvedId === undefined
        ) {
            setError(
                "A valid reverse pickup item ID is required."
            );
            return;
        }

        setDeleting(true);
        setError("");

        try {
            await axios.delete(
                `${apiUrl}/${encodeURIComponent(resolvedId)}`
            );

            showNotification(
                "Reverse pickup item deleted successfully.",
                "success"
            );

            if (typeof onDeleted === "function") {
                onDeleted(selectedItem);
            }

            if (
                typeof onSuccess === "function" &&
                onSuccess !== onDeleted
            ) {
                onSuccess(selectedItem);
            }

            if (typeof onClose === "function") {
                onClose();
            }
        } catch (deleteError) {
            console.error(
                "DELETE REVERSE PICKUP ITEM ERROR:",
                deleteError
            );

            const message = getErrorMessage(deleteError);

            setError(message);

            showNotification(message, "error");
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
                aria-labelledby="delete-reverse-pickup-item-title"
            >
                {/* DIALOG HEADER */}

                <DialogTitle
                    id="delete-reverse-pickup-item-title"
                    sx={{ pb: 1.5 }}
                >
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                    >
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "error.light",
                                color: "error.dark"
                            }}
                        >
                            <WarningAmber />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                {title}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                This action cannot be undone.
                            </Typography>
                        </Box>
                    </Stack>
                </DialogTitle>

                <Divider />

                {/* DIALOG CONTENT */}

                <DialogContent sx={{ pt: 3 }}>
                    <DialogContentText
                        sx={{
                            color: "text.primary",
                            mb: 2
                        }}
                    >
                        Are you sure you want to delete this
                        reverse pickup item? The item will be
                        removed if the server permits deletion.
                    </DialogContentText>

                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            bgcolor: "action.hover"
                        }}
                    >
                        <Stack spacing={1.25}>
                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Item ID
                                </Typography>

                                <Typography
                                    variant="body2"
                                    fontWeight={700}
                                >
                                    {resolvedId || "—"}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Item Name
                                </Typography>

                                <Typography
                                    variant="body2"
                                    fontWeight={700}
                                >
                                    {itemName || "—"}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    SKU
                                </Typography>

                                <Typography variant="body2">
                                    {sku || "—"}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Quantity
                                </Typography>

                                <Typography variant="body2">
                                    {quantity ?? "—"}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Reverse Pickup Number
                                </Typography>

                                <Typography variant="body2">
                                    {reversePickupNumber || "—"}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mt: 2 }}
                        >
                            {error}
                        </Alert>
                    )}
                </DialogContent>

                <Divider />

                {/* DIALOG ACTIONS */}

                <DialogActions
                    sx={{
                        p: 2.5,
                        gap: 1,
                        flexWrap: "wrap"
                    }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<Close />}
                        onClick={handleClose}
                        disabled={deleting}
                    >
                        {cancelText}
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        startIcon={
                            deleting
                                ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                )
                                : <Delete />
                        }
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting
                            ? "Deleting..."
                            : confirmText}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* NOTIFICATION */}

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={closeNotification}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    onClose={closeNotification}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DeleteReversePickupItemDialog;

