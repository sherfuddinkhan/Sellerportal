// =========================================================
// VendorItemMasterModal.jsx
// =========================================================

import React from "react";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Box,
    Typography,
    Divider
} from "@mui/material";

import {
    Close,
    Inventory2
} from "@mui/icons-material";

import VendorItemMasterForm from "./VendorItemMasterForm";
import VendorItemMasterDetails from "./VendorItemMasterDetails";

// =========================================================
// VENDOR ITEM MASTER MODAL
// =========================================================

const VendorItemMasterModal = ({
    open = false,
    mode = "view",
    item = null,
    itemId,
    loading = false,
    error = "",
    onClose,
    onSubmit,
    onUpdated,
    onCreated
}) => {

    // =====================================================
    // MODAL TITLE
    // =====================================================

    const getTitle = () => {
        switch (mode) {
            case "create":
                return "Create Vendor Item Master";

            case "edit":
                return "Edit Vendor Item Master";

            case "view":
            default:
                return "Vendor Item Master Details";
        }
    };

    // =====================================================
    // HANDLE CLOSE
    // =====================================================

    const handleClose = () => {
        if (typeof onClose === "function") {
            onClose();
        }
    };

    // =====================================================
    // HANDLE FORM SUBMISSION
    // =====================================================

    const handleSubmit = async (payload) => {
        if (typeof onSubmit === "function") {
            await onSubmit(payload);
        }
    };

    // =====================================================
    // HANDLE CREATE
    // =====================================================

    const handleCreated = (createdItem) => {
        if (typeof onCreated === "function") {
            onCreated(createdItem);
        }

        handleClose();
    };

    // =====================================================
    // HANDLE UPDATE
    // =====================================================

    const handleUpdated = (updatedItem) => {
        if (typeof onUpdated === "function") {
            onUpdated(updatedItem);
        }

        handleClose();
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="lg"
            scroll="paper"
            aria-labelledby="vendor-item-master-modal-title"
        >
            {/* ============================================= */}
            {/* MODAL HEADER */}
            {/* ============================================= */}

            <DialogTitle
                id="vendor-item-master-modal-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    pr: 2
                }}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                >
                    <Inventory2 color="primary" />

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        {getTitle()}
                    </Typography>
                </Box>

                <IconButton
                    aria-label="Close modal"
                    onClick={handleClose}
                    disabled={loading}
                    size="small"
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <Divider />

            {/* ============================================= */}
            {/* MODAL CONTENT */}
            {/* ============================================= */}

            <DialogContent
                sx={{
                    p: { xs: 1.5, sm: 3 },
                    bgcolor: "background.default"
                }}
            >
                {/* ========================================= */}
                {/* CREATE MODE */}
                {/* ========================================= */}

                {mode === "create" && (
                    <VendorItemMasterForm
                        mode="create"
                        loading={loading}
                        error={error}
                        onSubmit={handleSubmit}
                        onCancel={handleClose}
                    />
                )}

                {/* ========================================= */}
                {/* EDIT MODE */}
                {/* ========================================= */}

                {mode === "edit" && (
                    <VendorItemMasterForm
                        mode="edit"
                        initialData={item}
                        loading={loading}
                        error={error}
                        onSubmit={handleSubmit}
                        onCancel={handleClose}
                    />
                )}

                {/* ========================================= */}
                {/* VIEW MODE */}
                {/* ========================================= */}

                {mode === "view" && (
                    <VendorItemMasterDetails
                        itemId={itemId}
                        item={item}
                        onClose={handleClose}
                        onEdit={handleUpdated}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

// =========================================================
// DEFAULT EXPORT
// =========================================================

export default VendorItemMasterModal;

