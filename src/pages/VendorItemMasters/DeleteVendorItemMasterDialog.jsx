
// =========================================================
// DeleteVendorItemMasterDialog.jsx
// =========================================================

import React, { useEffect, useState } from "react";

import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress,
    Box,
    Typography
} from "@mui/material";

import {
    DeleteForever,
    WarningAmber
} from "@mui/icons-material";

// =========================================================
// GET FIELD VALUE
// =========================================================

const getField = (
    item,
    camelCase,
    pascalCase,
    fallback = ""
) => {
    return (
        item?.[camelCase] ??
        item?.[pascalCase] ??
        fallback
    );
};

// =========================================================
// DELETE VENDOR ITEM MASTER DIALOG
// =========================================================

const DeleteVendorItemMasterDialog = ({
    open = false,
    item = null,
    loading = false,
    error = "",
    onClose,
    onConfirm
}) => {

    // =====================================================
    // LOCAL ERROR STATE
    // =====================================================

    const [localError, setLocalError] = useState("");

    // =====================================================
    // RESET ERROR WHEN DIALOG OPENS
    // =====================================================

    useEffect(() => {
        if (open) {
            setLocalError("");
        }
    }, [open]);

    // =====================================================
    // ITEM DETAILS
    // =====================================================

    const itemCode = getField(
        item,
        "itemCode",
        "ItemCode",
        "—"
    );

    const itemName = getField(
        item,
        "itemName",
        "ItemName",
        "Unnamed Item"
    );

    const vendorName = getField(
        item,
        "vendorName",
        "VendorName",
        getField(item, "vendorId", "VendorId", "—")
    );

    // =====================================================
    // HANDLE CLOSE
    // =====================================================

    const handleClose = () => {
        if (loading) return;

        setLocalError("");

        if (typeof onClose === "function") {
            onClose();
        }
    };

    // =====================================================
    // HANDLE DELETE CONFIRMATION
    // =====================================================

    const handleConfirm = async () => {
        if (loading || !item) return;

        setLocalError("");

        if (typeof onConfirm !== "function") {
            setLocalError(
                "Delete action is not configured. Please try again."
            );
            return;
        }

        try {
            await onConfirm(item);
        } catch (err) {
            console.error(
                "DELETE VENDOR ITEM MASTER ERROR:",
                err
            );

            setLocalError(
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                err?.message ||
                "Failed to delete vendor item."
            );
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            aria-labelledby="delete-vendor-item-title"
            aria-describedby="delete-vendor-item-description"
        >
            {/* ============================================= */}
            {/* DIALOG TITLE */}
            {/* ============================================= */}

            <DialogTitle
                id="delete-vendor-item-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    pb: 1
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                        borderRadius: "50%",
                        color: "error.main",
                        backgroundColor: "error.light",
                        "& svg": {
                            color: "error.dark"
                        }
                    }}
                >
                    <WarningAmber />
                </Box>

                <Box>
                    <Typography
                        component="div"
                        variant="h6"
                        fontWeight={700}
                    >
                        Delete Vendor Item
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Confirm before proceeding
                    </Typography>
                </Box>
            </DialogTitle>

            {/* ============================================= */}
            {/* DIALOG CONTENT */}
            {/* ============================================= */}

            <DialogContent>
                <DialogContentText
                    id="delete-vendor-item-description"
                    sx={{ mb: 2 }}
                >
                    Are you sure you want to delete this vendor item?
                    This action may not be reversible.
                </DialogContentText>

                {/* ========================================= */}
                {/* ITEM DETAILS */}
                {/* ========================================= */}

                {item && (
                    <Box
                        sx={{
                            p: 2,
                            mb: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            backgroundColor: "action.hover"
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{ overflowWrap: "anywhere" }}
                        >
                            {itemName}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Item Code: {itemCode}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Vendor: {vendorName}
                        </Typography>
                    </Box>
                )}

                {/* ========================================= */}
                {/* ERROR MESSAGE */}
                {/* ========================================= */}

                {(error || localError) && (
                    <Alert
                        severity="error"
                        sx={{ mt: 1 }}
                    >
                        {localError || error}
                    </Alert>
                )}

                {/* ========================================= */}
                {/* LOADING MESSAGE */}
                {/* ========================================= */}

                {loading && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 2
                        }}
                    >
                        <CircularProgress size={18} />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Deleting vendor item...
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            {/* ============================================= */}
            {/* DIALOG ACTIONS */}
            {/* ============================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2.5,
                    gap: 1
                }}
            >
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    startIcon={
                        loading
                            ? <CircularProgress
                                size={16}
                                color="inherit"
                            />
                            : <DeleteForever />
                    }
                    onClick={handleConfirm}
                    disabled={loading || !item}
                >
                    {loading ? "Deleting..." : "Delete Item"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteVendorItemMasterDialog;

