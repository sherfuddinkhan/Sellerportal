// =========================================================
// GatepassModal.jsx
// =========================================================

import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Box,
    Typography,
    Divider,
    Button
} from "@mui/material";

import {
    Close,
    LocalShipping
} from "@mui/icons-material";

import GatepassForm from "./GatepassForm";

// =========================================================
// GATEPASS MODAL
// =========================================================

const GatepassModal = ({
    open = false,
    onClose,
    mode = "create",
    gatepassId = null,
    sellerId,
    customerId,
    onSaved,
    title
}) => {

    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const handleClose = () => {
        if (typeof onClose === "function") {
            onClose();
        }
    };

    // =====================================================
    // SAVE SUCCESSFULLY
    // =====================================================

    const handleSaved = (savedGatepass) => {
        if (typeof onSaved === "function") {
            onSaved(savedGatepass);
        }

        handleClose();
    };

    // =====================================================
    // MODAL TITLE
    // =====================================================

    const getTitle = () => {
        if (title) {
            return title;
        }

        if (mode === "edit") {
            return "Edit Gatepass";
        }

        if (mode === "view") {
            return "Gatepass Details";
        }

        return "Create Gatepass";
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
            aria-labelledby="gatepass-modal-title"
        >
            {/* =================================================
                HEADER
            ================================================= */}

            <DialogTitle
                id="gatepass-modal-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
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
                    <LocalShipping />

                    <Typography
                        variant="h6"
                        component="span"
                        fontWeight={600}
                    >
                        {getTitle()}
                    </Typography>
                </Box>

                <IconButton
                    aria-label="Close gatepass modal"
                    onClick={handleClose}
                    sx={{
                        color: "inherit"
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <Divider />

            {/* =================================================
                FORM CONTENT
            ================================================= */}

            <DialogContent
                dividers
                sx={{
                    p: {
                        xs: 2,
                        sm: 3
                    },
                    bgcolor: "background.default"
                }}
            >
                {open && (
                    <GatepassForm
                        key={`${mode}-${gatepassId ?? "new"}`}
                        mode={mode === "view" ? "edit" : mode}
                        gatepassId={gatepassId}
                        sellerId={sellerId}
                        customerId={customerId}
                        onSaved={handleSaved}
                        onCancel={handleClose}
                    />
                )}
            </DialogContent>

            {/* =================================================
                FOOTER
            ================================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    py: 2
                }}
            >
                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<Close />}
                    onClick={handleClose}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GatepassModal;

