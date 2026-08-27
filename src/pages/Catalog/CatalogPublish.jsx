// =========================================================
// CatalogPublish.jsx
// =========================================================

import React, { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";

import {
    Close,
    CloudUpload,
    CloudOff,
    Publish,
} from "@mui/icons-material";

// =========================================================
// DEFAULT STATUS
// =========================================================

const DEFAULT_STATUS = "Published";

// =========================================================
// COMPONENT
// =========================================================

const CatalogPublish = ({
    open = false,
    onClose,
    catalog = null,
    onPublish,
    loading = false,
}) => {
    const [status, setStatus] =
        useState(DEFAULT_STATUS);

    const [publishing, setPublishing] =
        useState(false);

    const [error, setError] =
        useState("");

    // =========================================================
    // CATALOG ID
    // =========================================================

    const catalogId =
        catalog?.catalogId ??
        catalog?.id ??
        catalog?.productId ??
        null;

    // =========================================================
    // CATALOG NAME
    // =========================================================

    const catalogName =
        catalog?.catalogName ??
        catalog?.productName ??
        catalog?.name ??
        "Catalog";

    // =========================================================
    // CURRENT STATUS
    // =========================================================

    const currentStatus =
        catalog?.status ??
        (catalog?.isPublished
            ? "Published"
            : "Unpublished");

    // =========================================================
    // INITIALIZE
    // =========================================================

    useEffect(() => {
        if (!open) {
            return;
        }

        setError("");

        const normalizedStatus =
            String(currentStatus).toLowerCase();

        if (
            normalizedStatus ===
                "published" ||
            normalizedStatus ===
                "active"
        ) {
            setStatus("Published");
        } else if (
            normalizedStatus ===
                "unpublished" ||
            normalizedStatus ===
                "inactive"
        ) {
            setStatus("Unpublished");
        } else if (
            normalizedStatus === "draft"
        ) {
            setStatus("Draft");
        } else {
            setStatus("Published");
        }
    }, [open, catalog, currentStatus]);

    // =========================================================
    // HANDLE CLOSE
    // =========================================================

    const handleClose = () => {
        if (publishing || loading) {
            return;
        }

        setError("");

        onClose?.();
    };

    // =========================================================
    // HANDLE PUBLISH
    // =========================================================

    const handlePublish = async () => {
        if (!catalogId) {
            setError(
                "Catalog ID is missing. Please select a valid catalog."
            );

            return;
        }

        try {
            setError("");
            setPublishing(true);

            const payload = {
                catalogId,
                status,
                isPublished:
                    status === "Published",
            };

            if (onPublish) {
                await onPublish(
                    catalogId,
                    payload,
                    catalog
                );
            }

            onClose?.();
        } catch (err) {
            console.error(
                "Catalog publish error:",
                err
            );

            setError(
                err?.response?.data?.message ??
                    err?.message ??
                    "Failed to update catalog publishing status."
            );
        } finally {
            setPublishing(false);
        }
    };

    // =========================================================
    // STATUS COLOR
    // =========================================================

    const getStatusColor = () => {
        switch (status) {
            case "Published":
                return "success";

            case "Unpublished":
                return "warning";

            case "Draft":
                return "default";

            default:
                return "default";
        }
    };

    // =========================================================
    // STATUS ICON
    // =========================================================

    const getStatusIcon = () => {
        if (status === "Published") {
            return <CloudUpload />;
        }

        if (status === "Unpublished") {
            return <CloudOff />;
        }

        return <Publish />;
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
            aria-labelledby="catalog-publish-dialog-title"
        >
            {/* =====================================================
                TITLE
               ===================================================== */}

            <DialogTitle
                id="catalog-publish-dialog-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >
                    <Publish color="primary" />

                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            Publish Catalog
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Manage catalog visibility
                        </Typography>
                    </Box>
                </Box>

                <Button
                    onClick={handleClose}
                    disabled={
                        publishing ||
                        loading
                    }
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
                {/* ERROR */}

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>
                )}

                {/* INFORMATION */}

                <Box
                    sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 2,
                        bgcolor:
                            "action.hover",
                        border: "1px solid",
                        borderColor:
                            "divider",
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
                            Catalog ID:{" "}
                            {catalogId}
                        </Typography>
                    )}

                    <Box sx={{ mt: 1 }}>
                        <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                        >
                            Current Status:{" "}
                        </Typography>

                        <Chip
                            size="small"
                            label={
                                currentStatus
                            }
                            color={
                                String(
                                    currentStatus
                                ).toLowerCase() ===
                                "published"
                                    ? "success"
                                    : "default"
                            }
                        />
                    </Box>
                </Box>

                {/* STATUS */}

                <FormControl
                    fullWidth
                    disabled={
                        publishing ||
                        loading
                    }
                >
                    <InputLabel>
                        Publishing Status
                    </InputLabel>

                    <Select
                        value={status}
                        label="Publishing Status"
                        onChange={(event) =>
                            setStatus(
                                event.target
                                    .value
                            )
                        }
                    >
                        <MenuItem value="Published">
                            Published
                        </MenuItem>

                        <MenuItem value="Unpublished">
                            Unpublished
                        </MenuItem>

                        <MenuItem value="Draft">
                            Draft
                        </MenuItem>
                    </Select>
                </FormControl>

                {/* SELECTED STATUS */}

                <Box
                    sx={{
                        mt: 3,
                        display: "flex",
                        alignItems:
                            "center",
                        gap: 1,
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        New Status:
                    </Typography>

                    <Chip
                        icon={
                            getStatusIcon()
                        }
                        label={status}
                        color={
                            getStatusColor()
                        }
                    />
                </Box>

                {/* WARNING */}

                {status ===
                    "Published" && (
                    <Alert
                        severity="success"
                        sx={{ mt: 3 }}
                    >
                        This catalog will be
                        available for customers
                        after publishing.
                    </Alert>
                )}

                {status ===
                    "Unpublished" && (
                    <Alert
                        severity="warning"
                        sx={{ mt: 3 }}
                    >
                        This catalog will no longer
                        be visible to customers.
                    </Alert>
                )}

                {status === "Draft" && (
                    <Alert
                        severity="info"
                        sx={{ mt: 3 }}
                    >
                        This catalog will remain
                        unpublished as a draft.
                    </Alert>
                )}
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
                        publishing ||
                        loading
                    }
                    startIcon={<Close />}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color={
                        status ===
                        "Unpublished"
                            ? "warning"
                            : "primary"
                    }
                    onClick={
                        handlePublish
                    }
                    disabled={
                        publishing ||
                        loading ||
                        !catalogId
                    }
                    startIcon={
                        publishing ||
                        loading ? (
                            <CircularProgress
                                size={18}
                                color="inherit"
                            />
                        ) : (
                            getStatusIcon()
                        )
                    }
                >
                    {publishing ||
                    loading
                        ? "Updating..."
                        : status ===
                          "Published"
                        ? "Publish Catalog"
                        : status ===
                          "Unpublished"
                        ? "Unpublish Catalog"
                        : "Save Status"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CatalogPublish;