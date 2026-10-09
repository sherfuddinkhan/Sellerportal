import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Box,
    Divider,
    CircularProgress
} from "@mui/material";

import {
    Close,
    Inventory2,
    Add,
    Edit,
    Visibility
} from "@mui/icons-material";

/* =========================================================
   SHELFWISE INVENTORY MODAL
========================================================= */

const ShelfwiseInventoryModal = ({
    open = false,
    onClose,
    onSubmit,
    children,

    mode = "create",
    title,

    inventory = null,
    record = null,

    loading = false,
    submitting = false,

    submitLabel,
    cancelLabel = "Cancel",

    maxWidth = "md",
    fullWidth = true
}) => {

    /* =====================================================
       NORMALIZE MODE
    ===================================================== */

    const normalizedMode = String(mode).toLowerCase();

    const isViewMode = normalizedMode === "view";
    const isEditMode = normalizedMode === "edit";
    const isSubmitting = loading || submitting;

    /* =====================================================
       NORMALIZE INVENTORY RECORD
    ===================================================== */

    const currentInventory = inventory || record || null;

    /* =====================================================
       MODAL TITLE
    ===================================================== */

    const getTitle = () => {
        if (title) {
            return title;
        }

        if (isViewMode) {
            return "View Shelfwise Inventory";
        }

        if (isEditMode) {
            return "Edit Shelfwise Inventory";
        }

        return "Create Shelfwise Inventory";
    };

    /* =====================================================
       MODAL ICON
    ===================================================== */

    const getTitleIcon = () => {
        if (isViewMode) {
            return <Visibility />;
        }

        if (isEditMode) {
            return <Edit />;
        }

        return <Add />;
    };

    /* =====================================================
       SUBMIT LABEL
    ===================================================== */

    const getSubmitLabel = () => {
        if (submitLabel) {
            return submitLabel;
        }

        if (isEditMode) {
            return "Update Inventory";
        }

        return "Create Inventory";
    };

    /* =====================================================
       HANDLE CLOSE
    ===================================================== */

    const handleClose = () => {
        if (isSubmitting) {
            return;
        }

        if (onClose) {
            onClose();
        }
    };

    /* =====================================================
       HANDLE SUBMIT
    ===================================================== */

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isViewMode || isSubmitting) {
            return;
        }

        if (onSubmit) {
            onSubmit(event, currentInventory);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            fullScreen={false}
            aria-labelledby="shelfwise-inventory-modal-title"
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    overflow: "hidden"
                }
            }}
        >
            {/* =================================================
                DIALOG HEADER
            ================================================= */}

            <DialogTitle
                id="shelfwise-inventory-modal-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    py: 2,
                    px: 3
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        minWidth: 0
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 42,
                            height: 42,
                            borderRadius: 2,
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            flexShrink: 0
                        }}
                    >
                        {getTitleIcon()}
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            component="div"
                            fontWeight={700}
                        >
                            {getTitle()}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {isViewMode
                                ? "Review inventory details."
                                : isEditMode
                                    ? "Update the inventory information."
                                    : "Enter the details for the new inventory record."}
                        </Typography>
                    </Box>
                </Box>

                <IconButton
                    onClick={handleClose}
                    disabled={isSubmitting}
                    aria-label="Close inventory modal"
                    size="small"
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <Divider />

            {/* =================================================
                DIALOG CONTENT
            ================================================= */}

            <DialogContent
                dividers
                sx={{
                    p: { xs: 2, sm: 3 },
                    minHeight: 120
                }}
            >
                {loading && !children ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            py: 6
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : children ? (
                    children
                ) : (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        No inventory form content was provided.
                    </Typography>
                )}
            </DialogContent>

            {/* =================================================
                DIALOG ACTIONS
            ================================================= */}

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
                    disabled={isSubmitting}
                >
                    {cancelLabel}
                </Button>

                {!isViewMode && onSubmit && (
                    <Button
                        type="submit"
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        startIcon={
                            isSubmitting ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            ) : (
                                <Inventory2 />
                            )
                        }
                    >
                        {isSubmitting
                            ? "Saving..."
                            : getSubmitLabel()}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ShelfwiseInventoryModal;

