
import React, { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Button,
    Divider,
    Alert,
    CircularProgress,
    Stack,
    Chip
} from "@mui/material";

import {
    DeleteForever,
    WarningAmber,
    Inventory2,
    Assignment,
    LocationOn,
    Numbers,
    Close
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (record, ...keys) => {
    for (const key of keys) {
        if (
            record &&
            record[key] !== undefined &&
            record[key] !== null
        ) {
            return record[key];
        }
    }

    return null;
};

/* =========================================================
   FORMAT TEXT
========================================================= */

const formatText = (value, fallback = "N/A") => {
    if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
    ) {
        return fallback;
    }

    return String(value);
};

/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return "0";
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: 3
    });
};

/* =========================================================
   STATUS COLOR
========================================================= */

const getStatusColor = (status) => {
    const normalizedStatus = String(status || "")
        .trim()
        .toLowerCase();

    switch (normalizedStatus) {
        case "completed":
        case "complete":
        case "putaway":
            return "success";

        case "pending":
        case "not started":
            return "warning";

        case "in progress":
        case "inprogress":
        case "processing":
            return "info";

        case "cancelled":
        case "canceled":
        case "failed":
            return "error";

        default:
            return "default";
    }
};

/* =========================================================
   DELETE MANIFEST PACKAGES PUTAWAY DIALOG
========================================================= */

const DeleteManifestPackagesPutawayDialog = ({
    open = false,
    record = null,
    onClose,
    onConfirm,
    loading = false,
    error = "",
    title = "Delete Putaway Record"
}) => {

    const [localError, setLocalError] = useState("");

    /* =====================================================
       RESET ERROR WHEN DIALOG OR RECORD CHANGES
    ===================================================== */

    useEffect(() => {
        if (open) {
            setLocalError("");
        }
    }, [open, record]);

    /* =====================================================
       RECORD FIELDS
    ===================================================== */

    const recordId = getFieldValue(
        record,
        "manifestPackagesPutawayId",
        "ManifestPackagesPutawayId",
        "manifestPackagePutawayId",
        "ManifestPackagePutawayId",
        "id",
        "Id"
    );

    const manifestId = getFieldValue(
        record,
        "manifestId",
        "ManifestId"
    );

    const packageId = getFieldValue(
        record,
        "packageId",
        "PackageId"
    );

    const location = getFieldValue(
        record,
        "putawayLocation",
        "PutawayLocation",
        "location",
        "Location",
        "binLocation",
        "BinLocation"
    );

    const quantity = getFieldValue(
        record,
        "quantity",
        "Quantity",
        "packageQuantity",
        "PackageQuantity"
    );

    const status = getFieldValue(
        record,
        "status",
        "Status",
        "putawayStatus",
        "PutawayStatus"
    );

    /* =====================================================
       HANDLE CLOSE
    ===================================================== */

    const handleClose = () => {
        if (loading) {
            return;
        }

        setLocalError("");

        if (typeof onClose === "function") {
            onClose();
        }
    };

    /* =====================================================
       HANDLE DELETE CONFIRMATION
    ===================================================== */

    const handleConfirm = async () => {
        setLocalError("");

        if (!record) {
            setLocalError(
                "No putaway record is selected for deletion."
            );
            return;
        }

        if (
            recordId === undefined ||
            recordId === null ||
            recordId === ""
        ) {
            setLocalError(
                "The selected record does not contain a valid ID."
            );
            return;
        }

        if (typeof onConfirm !== "function") {
            setLocalError(
                "The delete confirmation handler is not configured."
            );
            return;
        }

        try {
            await onConfirm(record);
        } catch (err) {
            setLocalError(
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                err?.message ||
                "Unable to delete the putaway record."
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
            fullWidth
            maxWidth="sm"
            disableEscapeKeyDown={loading}
            aria-labelledby="delete-putaway-dialog-title"
        >
            {/* DIALOG HEADER */}

            <DialogTitle
                id="delete-putaway-dialog-title"
                sx={{ pb: 2 }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "error.light",
                            color: "error.dark",
                            borderRadius: 2,
                            p: 1.25
                        }}
                    >
                        <DeleteForever />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Confirm the selected record before deletion.
                        </Typography>
                    </Box>
                </Stack>
            </DialogTitle>

            <Divider />

            {/* DIALOG CONTENT */}

            <DialogContent sx={{ pt: 3 }}>
                <Alert
                    severity="warning"
                    icon={<WarningAmber />}
                    sx={{ mb: 3 }}
                >
                    Are you sure you want to delete this putaway record?
                    This action may not be reversible.
                </Alert>

                {(error || localError) && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {localError || error}
                    </Alert>
                )}

                {!record ? (
                    <Alert severity="info">
                        No putaway record has been selected.
                    </Alert>
                ) : (
                    <Box
                        sx={{
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 2,
                            overflow: "hidden"
                        }}
                    >
                        {/* RECORD SUMMARY */}

                        <Box
                            sx={{
                                p: 2,
                                bgcolor: "action.hover"
                            }}
                        >
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1.5}
                            >
                                <Inventory2 color="primary" />

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={700}
                                    >
                                        Putaway Record #
                                        {formatText(recordId)}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Manifest Package Putaway
                                    </Typography>
                                </Box>

                                <Chip
                                    size="small"
                                    label={formatText(
                                        status,
                                        "Unknown"
                                    )}
                                    color={getStatusColor(status)}
                                />
                            </Stack>
                        </Box>

                        <Divider />

                        {/* RECORD DETAILS */}

                        <Box sx={{ p: 2 }}>
                            <Stack spacing={2}>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1.5}
                                >
                                    <Assignment
                                        color="action"
                                        fontSize="small"
                                    />

                                    <Box>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Manifest ID
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                        >
                                            {formatText(manifestId)}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1.5}
                                >
                                    <Inventory2
                                        color="action"
                                        fontSize="small"
                                    />

                                    <Box>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Package ID
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                        >
                                            {formatText(packageId)}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1.5}
                                >
                                    <LocationOn
                                        color="action"
                                        fontSize="small"
                                    />

                                    <Box>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Putaway Location
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                        >
                                            {formatText(location)}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1.5}
                                >
                                    <Numbers
                                        color="action"
                                        fontSize="small"
                                    />

                                    <Box>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Quantity
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                        >
                                            {formatNumber(quantity)}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Box>
                    </Box>
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
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    startIcon={
                        loading ? (
                            <CircularProgress
                                size={18}
                                color="inherit"
                            />
                        ) : (
                            <DeleteForever />
                        )
                    }
                    onClick={handleConfirm}
                    disabled={loading || !record}
                >
                    {loading ? "Deleting..." : "Confirm Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteManifestPackagesPutawayDialog;

