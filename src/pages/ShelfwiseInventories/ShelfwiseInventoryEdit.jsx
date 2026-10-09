import React, { useEffect, useState } from "react";

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
    CircularProgress,
    Alert
} from "@mui/material";

import {
    Close,
    Edit,
    Save
} from "@mui/icons-material";

import ShelfwiseInventoryForm from "./ShelfwiseInventoryForm";

/* =========================================================
   SHELFWISE INVENTORY EDIT
========================================================= */

const ShelfwiseInventoryEdit = ({
    open = false,

    inventory = null,
    record = null,

    onClose,
    onSubmit,
    onUpdate,

    loading = false,
    submitting = false,

    maxWidth = "md"
}) => {
    /* =====================================================
       NORMALIZE RECORD
    ===================================================== */

    const selectedInventory = inventory || record || null;

    const isBusy = loading || submitting;

    /* =====================================================
       LOCAL ERROR STATE
    ===================================================== */

    const [error, setError] = useState("");

    /* =====================================================
       RESET ERROR WHEN RECORD OR DIALOG CHANGES
    ===================================================== */

    useEffect(() => {
        setError("");
    }, [open, selectedInventory]);

    /* =====================================================
       HANDLE CLOSE
    ===================================================== */

    const handleClose = () => {
        if (isBusy) {
            return;
        }

        setError("");

        if (onClose) {
            onClose();
        }
    };

    /* =====================================================
       HANDLE UPDATE
    ===================================================== */

    const handleUpdate = async (formData) => {
        if (isBusy) {
            return;
        }

        const submitHandler = onUpdate || onSubmit;

        if (typeof submitHandler !== "function") {
            setError(
                "Update handler is not configured. Please provide onUpdate or onSubmit."
            );
            return;
        }

        setError("");

        try {
            await submitHandler(formData, selectedInventory);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to update inventory. Please try again."
            );
        }
    };

    /* =====================================================
       NO RECORD SELECTED
    ===================================================== */

    if (open && !selectedInventory) {
        return (
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Edit Shelfwise Inventory
                </DialogTitle>

                <DialogContent>
                    <Alert severity="warning">
                        No inventory record was selected.
                        Please select an inventory record to edit.
                    </Alert>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={handleClose}
                        variant="contained"
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={maxWidth}
            fullWidth
            aria-labelledby="shelfwise-inventory-edit-title"
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    overflow: "hidden"
                }
            }}
        >
            {/* HEADER */}

            <DialogTitle
                id="shelfwise-inventory-edit-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    px: 3,
                    py: 2
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
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
                            color: "primary.contrastText"
                        }}
                    >
                        <Edit />
                    </Box>

                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Edit Shelfwise Inventory
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Update inventory and stock information.
                        </Typography>
                    </Box>
                </Box>

                <IconButton
                    onClick={handleClose}
                    disabled={isBusy}
                    aria-label="Close edit inventory dialog"
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <Divider />

            {/* CONTENT */}

            <DialogContent
                dividers
                sx={{ p: { xs: 2, sm: 3 } }}
            >
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            py: 6
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {error && (
                            <Alert
                                severity="error"
                                onClose={() => setError("")}
                                sx={{ mb: 2 }}
                            >
                                {error}
                            </Alert>
                        )}

                        <ShelfwiseInventoryForm
                            inventory={selectedInventory}
                            mode="edit"
                            onSubmit={handleUpdate}
                            onCancel={handleClose}
                            loading={loading}
                            submitting={submitting}
                            showActions={false}
                        />
                    </>
                )}
            </DialogContent>

            {/* ACTIONS */}

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
                    disabled={isBusy}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    startIcon={
                        isBusy ? (
                            <CircularProgress
                                size={18}
                                color="inherit"
                            />
                        ) : (
                            <Save />
                        )
                    }
                    onClick={() => {
                        const form = document.querySelector(
                            "#shelfwise-inventory-edit-title"
                        );

                        if (form) {
                            const formElement =
                                form.closest(".MuiDialog-paper")
                                    ?.querySelector("form");

                            if (formElement) {
                                formElement.requestSubmit();
                            }
                        }
                    }}
                    disabled={isBusy || !selectedInventory}
                >
                    {isBusy ? "Updating..." : "Update Inventory"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShelfwiseInventoryEdit;

