
import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Divider,
    Box,
    CircularProgress,
    Alert,
    Tooltip
} from "@mui/material";

import {
    Close,
    LocationOn,
    Save,
    Edit,
    Visibility
} from "@mui/icons-material";

/* =========================================================
   REVERSE PICKUP ADDRESS MODAL
========================================================= */

const ReversePickupAddressModal = ({
    open = false,
    onClose,

    title,
    subtitle,

    mode = "create",
    children,

    onSubmit,
    onSave,

    loading = false,
    submitting = false,

    error = "",
    success = "",

    submitLabel,
    cancelLabel = "Cancel",

    maxWidth = "md",
    fullWidth = true,
    fullScreen = false,

    showCloseButton = true,
    showActions = true,
    showSubmitButton = true,

    disableSubmit = false,
    disableClose = false,

    formId,

    actions,

    address
}) => {

    /* =====================================================
       DETERMINE MODAL MODE
    ===================================================== */

    const normalizedMode = String(mode || "create")
        .trim()
        .toLowerCase();

    const isViewMode = [
        "view",
        "details",
        "read"
    ].includes(normalizedMode);

    const isEditMode = [
        "edit",
        "update"
    ].includes(normalizedMode);

    const isBusy = Boolean(loading || submitting);

    /* =====================================================
       DEFAULT TITLE
    ===================================================== */

    const defaultTitle = isViewMode
        ? "Reverse Pickup Address Details"
        : isEditMode
            ? "Edit Reverse Pickup Address"
            : "Create Reverse Pickup Address";

    const resolvedTitle = title || defaultTitle;

    /* =====================================================
       DEFAULT SUBTITLE
    ===================================================== */

    const defaultSubtitle = isViewMode
        ? "View the selected pickup address information."
        : isEditMode
            ? "Update the pickup address information."
            : "Enter the details for a new pickup address.";

    const resolvedSubtitle = subtitle || defaultSubtitle;

    /* =====================================================
       SUBMIT HANDLER
    ===================================================== */

    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();
        }

        if (isBusy || disableSubmit || isViewMode) {
            return;
        }

        const submitHandler = onSubmit || onSave;

        if (typeof submitHandler === "function") {
            submitHandler(event);
        }
    };

    /* =====================================================
       CLOSE HANDLER
    ===================================================== */

    const handleClose = () => {
        if (disableClose || isBusy) {
            return;
        }

        if (typeof onClose === "function") {
            onClose();
        }
    };

    /* =====================================================
       TITLE ICON
    ===================================================== */

    const TitleIcon = isViewMode
        ? Visibility
        : isEditMode
            ? Edit
            : LocationOn;

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            fullScreen={fullScreen}
            disableEscapeKeyDown={disableClose || isBusy}
            aria-labelledby="reverse-pickup-address-modal-title"
            PaperProps={{
                sx: {
                    borderRadius: {
                        xs: 0,
                        sm: 2
                    },
                    overflow: "hidden"
                }
            }}
        >
            {/* =================================================
                DIALOG HEADER
            ================================================= */}

            <DialogTitle
                id="reverse-pickup-address-modal-title"
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 2,
                    py: 2,
                    px: 3
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
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
                        <TitleIcon />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            component="div"
                        >
                            {resolvedTitle}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            {resolvedSubtitle}
                        </Typography>
                    </Box>
                </Box>

                {showCloseButton && (
                    <Tooltip title="Close">
                        <span>
                            <IconButton
                                aria-label="Close reverse pickup address modal"
                                onClick={handleClose}
                                disabled={disableClose || isBusy}
                                size="small"
                                sx={{ mt: -0.5, mr: -1 }}
                            >
                                <Close />
                            </IconButton>
                        </span>
                    </Tooltip>
                )}
            </DialogTitle>

            <Divider />

            {/* =================================================
                DIALOG CONTENT
            ================================================= */}

            <DialogContent
                dividers
                sx={{
                    p: {
                        xs: 2,
                        sm: 3
                    },
                    minHeight: 120
                }}
            >
                {/* ERROR MESSAGE */}

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                        onClose={undefined}
                    >
                        {error}
                    </Alert>
                )}

                {/* SUCCESS MESSAGE */}

                {success && (
                    <Alert
                        severity="success"
                        sx={{ mb: 2 }}
                    >
                        {success}
                    </Alert>
                )}

                {/* LOADING STATE */}

                {loading ? (
                    <Box
                        sx={{
                            minHeight: 180,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 2
                        }}
                    >
                        <CircularProgress />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Loading address information...
                        </Typography>
                    </Box>
                ) : (
                    <Box
                        component={formId ? "div" : "div"}
                        sx={{ width: "100%" }}
                    >
                        {children}
                    </Box>
                )}
            </DialogContent>

            {/* =================================================
                DIALOG ACTIONS
            ================================================= */}

            {showActions && (
                <>
                    <Divider />

                    <DialogActions
                        sx={{
                            px: 3,
                            py: 2,
                            gap: 1,
                            flexWrap: "wrap"
                        }}
                    >
                        {/* CUSTOM ACTIONS */}

                        {actions}

                        <Box sx={{ flexGrow: 1 }} />

                        {/* CANCEL / CLOSE */}

                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={handleClose}
                            disabled={disableClose || isBusy}
                        >
                            {isViewMode ? "Close" : cancelLabel}
                        </Button>

                        {/* SAVE / UPDATE */}

                        {showSubmitButton && !isViewMode && (
                            <Button
                                variant="contained"
                                color="primary"
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
                                onClick={formId ? undefined : handleSubmit}
                                type={formId ? "submit" : "button"}
                                form={formId}
                                disabled={
                                    isBusy ||
                                    disableSubmit
                                }
                            >
                                {isBusy
                                    ? "Saving..."
                                    : submitLabel ||
                                      (isEditMode
                                          ? "Update Address"
                                          : "Create Address")}
                            </Button>
                        )}
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
};

export default ReversePickupAddressModal;

