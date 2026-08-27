// =========================================================
// DeleteCatalogDialog.jsx
// =========================================================

import React, { useState } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Typography,
} from "@mui/material";

import {
    Close,
    DeleteForever,
    Warning,
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const DeleteCatalogDialog = ({
    open = false,
    onClose,
    catalog = null,
    onConfirm,
    loading = false,
}) => {
    const [deleting, setDeleting] = useState(false);

    // =========================================================
    // GET CATALOG ID
    // =========================================================

    const catalogId =
        catalog?.catalogId ??
        catalog?.id ??
        catalog?.productId ??
        null;

    // =========================================================
    // GET CATALOG NAME
    // =========================================================

    const catalogName =
        catalog?.catalogName ??
        catalog?.productName ??
        catalog?.name ??
        "this catalog item";

    // =========================================================
    // CONFIRM DELETE
    // =========================================================

    const handleConfirm = async () => {
        if (!catalogId) {
            console.error(
                "DeleteCatalogDialog: Catalog ID is missing."
            );

            return;
        }

        try {
            setDeleting(true);

            if (onConfirm) {
                await onConfirm(catalogId, catalog);
            }

            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.error(
                "Catalog delete error:",
                error
            );
        } finally {
            setDeleting(false);
        }
    };

    // =========================================================
    // CLOSE
    // =========================================================

    const handleClose = () => {
        if (deleting || loading) {
            return;
        }

        if (onClose) {
            onClose();
        }
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            aria-labelledby="delete-catalog-dialog-title"
        >
            {/* =====================================================
                TITLE
               ===================================================== */}

            <DialogTitle
                id="delete-catalog-dialog-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >
                    <DeleteForever
                        color="error"
                        sx={{
                            fontSize: 32,
                        }}
                    />

                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            Delete Catalog
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Confirm catalog deletion
                        </Typography>
                    </Box>
                </Box>

                <Button
                    onClick={handleClose}
                    disabled={deleting || loading}
                    sx={{
                        minWidth: 40,
                        p: 0.5,
                    }}
                >
                    <Close />
                </Button>
            </DialogTitle>

            <Divider />

            {/* =====================================================
                CONTENT
               ===================================================== */}

            <DialogContent sx={{ pt: 3 }}>
                <Alert
                    severity="warning"
                    icon={<Warning />}
                    sx={{ mb: 3 }}
                >
                    This action cannot be undone.
                </Alert>

                <Typography
                    variant="body1"
                    sx={{ mb: 2 }}
                >
                    Are you sure you want to delete the
                    following catalog item?
                </Typography>

                {/* =================================================
                    CATALOG INFORMATION
                   ================================================= */}

                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                    >
                        {catalogName}
                    </Typography>

                    {catalogId && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Catalog ID: {catalogId}
                        </Typography>
                    )}

                    {catalog?.productCode && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Product Code:{" "}
                            {catalog.productCode}
                        </Typography>
                    )}

                    {catalog?.sku && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            SKU: {catalog.sku}
                        </Typography>
                    )}
                </Box>

                {/* =================================================
                    WARNING
                   ================================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    Deleting this catalog item may also
                    remove or affect its associated images,
                    prices, inventory, and other related
                    information depending on your backend
                    configuration.
                </Typography>
            </DialogContent>

            <Divider />

            {/* =====================================================
                ACTIONS
               ===================================================== */}

            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    gap: 1,
                }}
            >
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    disabled={
                        deleting || loading
                    }
                    startIcon={<Close />}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleConfirm}
                    disabled={
                        deleting ||
                        loading ||
                        !catalogId
                    }
                    startIcon={
                        deleting || loading ? (
                            <CircularProgress
                                size={18}
                                color="inherit"
                            />
                        ) : (
                            <DeleteForever />
                        )
                    }
                >
                    {deleting || loading
                        ? "Deleting..."
                        : "Delete Catalog"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteCatalogDialog;