import React, { useState } from "react";

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
    Add,
    Save
} from "@mui/icons-material";

import ShelfwiseInventoryForm from "./ShelfwiseInventoryForm";

/* =========================================================
   SHELFWISE INVENTORY CREATE
========================================================= */

const ShelfwiseInventoryCreate = ({
    open = false,

    onClose,
    onSubmit,
    onCreate,

    loading = false,
    submitting = false,

    maxWidth = "md"
}) => {

    /* =====================================================
       STATE
    ===================================================== */

    const [error, setError] = useState("");

    const isBusy = loading || submitting;

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
       HANDLE CREATE
    ===================================================== */

    const handleCreate = async (formData) => {
        if (isBusy) {
            return;
        }

        const submitHandler = onCreate || onSubmit;

        if (typeof submitHandler !== "function") {
            setError(
                "Create handler is not configured. Please provide onCreate or onSubmit."
            );
            return;
        }

        setError("");

        try {
            await submitHandler(formData);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to create inventory. Please try again."
            );
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
            fullWidth
            aria-labelledby="shelfwise-inventory-create-title"
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    overflow: "hidden"
                }
            }}
        >
            {/* HEADER */}

            <DialogTitle
                id="shelfwise-inventory-create-title"
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
                        <Add />
                    </Box>

                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Create Shelfwise Inventory
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Enter item, warehouse, shelf, and stock details.
                        </Typography>
                    </Box>
                </Box>

                <IconButton
                    onClick={handleClose}
                    disabled={isBusy}
                    aria-label="Close create inventory dialog"
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <Divider />

            {/* FORM CONTENT */}

            <DialogContent
                dividers
                sx={{ p: { xs: 2, sm: 3 } }}
            >
                {error && (
                    <Alert
                        severity="error"
                        onClose={() => setError("")}
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>
                )}

                {loading ? (
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
                ) : (
                    <ShelfwiseInventoryForm
                        mode="create"
                        onSubmit={handleCreate}
                        onCancel={handleClose}
                        loading={loading}
                        submitting={submitting}
                        showActions={false}
                    />
                )}
            </DialogContent>

            {/* FOOTER ACTIONS */}

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
                        const title = document.getElementById(
                            "shelfwise-inventory-create-title"
                        );

                        const form = title
                            ?.closest(".MuiDialog-paper")
                            ?.querySelector("form");

                        if (form) {
                            form.requestSubmit();
                        }
                    }}
                    disabled={isBusy}
                >
                    {isBusy ? "Creating..." : "Create Inventory"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShelfwiseInventoryCreate;

