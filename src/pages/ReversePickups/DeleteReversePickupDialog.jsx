import React, { useEffect, useState } from "react";

import axios from "axios";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    Divider,
    Chip,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    Delete,
    Close,
    LocalShipping,
    Person,
    Inventory2,
    CalendarMonth,
    ReceiptLong,
    Warning
} from "@mui/icons-material";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = (
    import.meta.env.VITE_API_URL || ""
).replace(/\/+$/, "");

const REVERSE_PICKUP_URL = `${API_BASE_URL}/api/ReversePickup`;

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

    return String(value).trim();
};

/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
    const number = Number(value);

    if (
        value === undefined ||
        value === null ||
        String(value).trim() === "" ||
        !Number.isFinite(number)
    ) {
        return "0";
    }

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
};

/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {
    const amount = Number(value);

    if (
        value === undefined ||
        value === null ||
        String(value).trim() === "" ||
        !Number.isFinite(amount)
    ) {
        return "₹ 0.00";
    }

    return `₹ ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {
    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

/* =========================================================
   FORMAT STATUS
========================================================= */

const getStatusColor = (status) => {
    const normalizedStatus = String(status || "")
        .trim()
        .toLowerCase();

    switch (normalizedStatus) {
        case "completed":
        case "delivered":
        case "picked up":
        case "pickedup":
            return "success";

        case "pending":
        case "scheduled":
        case "requested":
            return "warning";

        case "cancelled":
        case "canceled":
        case "failed":
            return "error";

        case "in transit":
        case "intransit":
        case "processing":
            return "info";

        default:
            return "default";
    }
};

/* =========================================================
   DETAIL FIELD
========================================================= */

const DetailField = ({ label, value }) => (
    <Box sx={{ mb: 1.5 }}>
        <Typography
            variant="caption"
            color="text.secondary"
            display="block"
        >
            {label}
        </Typography>

        <Typography
            variant="body2"
            fontWeight={600}
            sx={{
                overflowWrap: "anywhere",
                mt: 0.25
            }}
        >
            {formatText(value)}
        </Typography>
    </Box>
);

/* =========================================================
   DELETE REVERSE PICKUP DIALOG
========================================================= */

const DeleteReversePickupDialog = ({
    open,
    onClose,
    reversePickup,
    pickup,
    record,
    onDeleted,
    onSuccess,
    apiUrl = REVERSE_PICKUP_URL
}) => {
    const selectedPickup =
        reversePickup || pickup || record || {};

    const pickupId =
        selectedPickup.id ??
        selectedPickup.reversePickupId ??
        selectedPickup.ReversePickupId ??
        selectedPickup.ID;

    const pickupNumber =
        selectedPickup.reversePickupNumber ??
        selectedPickup.ReversePickupNumber;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    /* =====================================================
       RESET DIALOG STATE
    ===================================================== */

    useEffect(() => {
        if (open) {
            setError("");
            setSuccess(false);
            setLoading(false);
        }
    }, [open, pickupId]);

    /* =====================================================
       CLOSE DIALOG
    ===================================================== */

    const handleClose = () => {
        if (loading) {
            return;
        }

        setError("");
        onClose?.();
    };

    /* =====================================================
       DELETE REVERSE PICKUP
    ===================================================== */

    const handleDelete = async () => {
        if (
            pickupId === undefined ||
            pickupId === null ||
            String(pickupId).trim() === ""
        ) {
            setError(
                "Reverse Pickup ID is missing. Unable to delete this record."
            );
            return;
        }

        try {
            setLoading(true);
            setError("");

            console.log(
                "\nDELETE REVERSE PICKUP:",
                pickupId
            );

            const response = await axios.delete(
                `${apiUrl.replace(/\/+$/, "")}/${encodeURIComponent(
                    String(pickupId)
                )}`,
                {
                    timeout: 30000
                }
            );

            if (
                response.status === 204 ||
                response.data === undefined ||
                response.data === null ||
                response.data === ""
            ) {
                setSuccess(true);

                onDeleted?.(selectedPickup);
                onSuccess?.(selectedPickup);

                onClose?.();

                return;
            }

            setSuccess(true);

            onDeleted?.(selectedPickup);
            onSuccess?.(selectedPickup);

            onClose?.();
        } catch (err) {
            console.error(
                "\nDELETE REVERSE PICKUP ERROR:",
                err
            );

            const message =
                err.response?.data?.message ||
                err.response?.data?.title ||
                (typeof err.response?.data === "string"
                    ? err.response.data
                    : null) ||
                err.message ||
                "Failed to delete Reverse Pickup.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={Boolean(open)}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 3
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    pb: 1.5
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        bgcolor: "error.light",
                        color: "error.dark"
                    }}
                >
                    <Delete />
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={700}>
                        Delete Reverse Pickup
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Confirm the record before deleting.
                    </Typography>
                </Box>

                <Button
                    onClick={handleClose}
                    disabled={loading}
                    color="inherit"
                    sx={{ minWidth: 40 }}
                >
                    <Close />
                </Button>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ pt: 3 }}>
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                        onClose={() => setError("")}
                    >
                        {error}
                    </Alert>
                )}

                <Alert
                    severity="warning"
                    icon={<Warning />}
                    sx={{ mb: 2 }}
                >
                    Are you sure you want to delete this Reverse
                    Pickup record? This action may not be reversible.
                </Alert>

                <Box
                    sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        bgcolor: "background.default"
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2
                        }}
                    >
                        <LocalShipping color="primary" />

                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                        >
                            {formatText(
                                pickupNumber,
                                "Reverse Pickup Details"
                            )}
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Reverse Pickup ID"
                                value={pickupId}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Order Number"
                                value={
                                    selectedPickup.orderNumber ??
                                    selectedPickup.OrderNumber
                                }
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 1
                                }}
                            >
                                <Person
                                    fontSize="small"
                                    color="action"
                                    sx={{ mt: 0.5 }}
                                />

                                <Box sx={{ flex: 1 }}>
                                    <DetailField
                                        label="Customer Name"
                                        value={
                                            selectedPickup.customerName ??
                                            selectedPickup.CustomerName
                                        }
                                    />
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 1
                                }}
                            >
                                <Inventory2
                                    fontSize="small"
                                    color="action"
                                    sx={{ mt: 0.5 }}
                                />

                                <Box sx={{ flex: 1 }}>
                                    <DetailField
                                        label="Item Name"
                                        value={
                                            selectedPickup.itemName ??
                                            selectedPickup.ItemName
                                        }
                                    />
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="SKU"
                                value={
                                    selectedPickup.sku ??
                                    selectedPickup.SKU
                                }
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Quantity"
                                value={formatNumber(
                                    selectedPickup.quantity ??
                                    selectedPickup.Quantity
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 1
                                }}
                            >
                                <CalendarMonth
                                    fontSize="small"
                                    color="action"
                                    sx={{ mt: 0.5 }}
                                />

                                <Box sx={{ flex: 1 }}>
                                    <DetailField
                                        label="Pickup Date"
                                        value={formatDate(
                                            selectedPickup.pickupDate ??
                                            selectedPickup.PickupDate
                                        )}
                                    />
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Pickup Cost"
                                value={formatCurrency(
                                    selectedPickup.pickupCost ??
                                    selectedPickup.PickupCost
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Carrier"
                                value={
                                    selectedPickup.carrierName ??
                                    selectedPickup.CarrierName
                                }
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Tracking Number"
                                value={
                                    selectedPickup.trackingNumber ??
                                    selectedPickup.TrackingNumber
                                }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    flexWrap: "wrap"
                                }}
                            >
                                <ReceiptLong
                                    fontSize="small"
                                    color="action"
                                />

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Status:
                                </Typography>

                                <Chip
                                    size="small"
                                    label={formatText(
                                        selectedPickup.status ??
                                        selectedPickup.Status,
                                        "Unknown"
                                    )}
                                    color={getStatusColor(
                                        selectedPickup.status ??
                                        selectedPickup.Status
                                    )}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 2.5, gap: 1 }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleClose}
                    disabled={loading}
                    startIcon={<Close />}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    disabled={loading || pickupId == null}
                    startIcon={
                        loading ? (
                            <CircularProgress
                                size={18}
                                color="inherit"
                            />
                        ) : (
                            <Delete />
                        )
                    }
                >
                    {loading ? "Deleting..." : "Delete Reverse Pickup"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteReversePickupDialog;

