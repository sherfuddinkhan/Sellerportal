import React from "react";

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
    Paper,
    Stack
} from "@mui/material";

import {
    Close,
    LocalShipping,
    Person,
    Inventory2,
    CalendarMonth,
    ReceiptLong,
    Payments,
    Numbers,
    Email,
    LocationOn,
    Description,
    ConfirmationNumber,
    CheckCircle
} from "@mui/icons-material";

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
    if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
    ) {
        return "0";
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
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
    if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
    ) {
        return "₹ 0.00";
    }

    const amount = Number(value);

    if (!Number.isFinite(amount)) {
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
   FORMAT DATE AND TIME
========================================================= */

const formatDateTime = (value) => {
    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
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
        case "approved":
            return "success";

        case "pending":
        case "scheduled":
        case "requested":
            return "warning";

        case "cancelled":
        case "canceled":
        case "failed":
        case "rejected":
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

const DetailField = ({
    label,
    value,
    icon,
    multiline = false
}) => (
    <Box
        sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.25,
            minWidth: 0
        }}
    >
        {icon && (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "primary.main",
                    mt: 0.25
                }}
            >
                {icon}
            </Box>
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mb: 0.25 }}
            >
                {label}
            </Typography>

            <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                    overflowWrap: "anywhere",
                    whiteSpace: multiline ? "pre-wrap" : "normal"
                }}
            >
                {formatText(value)}
            </Typography>
        </Box>
    </Box>
);

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({ icon, title }) => (
    <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ mb: 2 }}
    >
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                color: "primary.main"
            }}
        >
            {icon}
        </Box>

        <Typography variant="subtitle1" fontWeight={700}>
            {title}
        </Typography>
    </Stack>
);

/* =========================================================
   REVERSE PICKUP ITEM VIEW
========================================================= */

const ReversePickupItemView = ({
    open,
    onClose,
    reversePickup,
    pickup,
    item,
    record,
    data,
    title = "Reverse Pickup Details"
}) => {
    const details =
        reversePickup ||
        pickup ||
        item ||
        record ||
        data ||
        {};

    /* =====================================================
       SUPPORT CAMELCASE AND PASCALCASE FIELDS
    ===================================================== */

    const pickupId =
        details.id ??
        details.reversePickupId ??
        details.ReversePickupId ??
        details.ID;

    const pickupNumber =
        details.reversePickupNumber ??
        details.ReversePickupNumber;

    const orderNumber =
        details.orderNumber ??
        details.OrderNumber;

    const customerName =
        details.customerName ??
        details.CustomerName;

    const customerEmail =
        details.customerEmail ??
        details.CustomerEmail;

    const pickupDate =
        details.pickupDate ??
        details.PickupDate;

    const pickupAddress =
        details.pickupAddress ??
        details.PickupAddress;

    const itemName =
        details.itemName ??
        details.ItemName;

    const sku =
        details.sku ??
        details.SKU;

    const quantity =
        details.quantity ??
        details.Quantity;

    const carrierName =
        details.carrierName ??
        details.CarrierName;

    const trackingNumber =
        details.trackingNumber ??
        details.TrackingNumber;

    const pickupCost =
        details.pickupCost ??
        details.PickupCost;

    const status =
        details.status ??
        details.Status;

    const notes =
        details.notes ??
        details.Notes;

    const createdAt =
        details.createdAt ??
        details.CreatedAt;

    const updatedAt =
        details.updatedAt ??
        details.UpdatedAt;

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: "hidden"
                }
            }}
        >
            {/* =================================================
                DIALOG HEADER
            ================================================= */}

            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    py: 2,
                    px: 3
                }}
            >
                <Box
                    sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                    }}
                >
                    <LocalShipping />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ overflowWrap: "anywhere" }}
                    >
                        {formatText(
                            pickupNumber,
                            "Reverse Pickup Record"
                        )}
                    </Typography>
                </Box>

                <Chip
                    size="small"
                    label={formatText(status, "Unknown")}
                    color={getStatusColor(status)}
                    sx={{ fontWeight: 600 }}
                />

                <Button
                    onClick={onClose}
                    color="inherit"
                    sx={{ minWidth: 40, px: 1 }}
                    aria-label="Close details"
                >
                    <Close />
                </Button>
            </DialogTitle>

            <Divider />

            {/* =================================================
                DIALOG CONTENT
            ================================================= */}

            <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
                {/* =============================================
                    SUMMARY CARDS
                ============================================= */}

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={4}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                height: "100%"
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 1 }}
                            >
                                <ConfirmationNumber
                                    color="primary"
                                    fontSize="small"
                                />

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Pickup Number
                                </Typography>
                            </Stack>

                            <Typography
                                variant="body1"
                                fontWeight={700}
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {formatText(pickupNumber)}
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                height: "100%"
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 1 }}
                            >
                                <Numbers
                                    color="primary"
                                    fontSize="small"
                                />

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Quantity
                                </Typography>
                            </Stack>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                {formatNumber(quantity)}
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                height: "100%"
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 1 }}
                            >
                                <Payments
                                    color="primary"
                                    fontSize="small"
                                />

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Pickup Cost
                                </Typography>
                            </Stack>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                                color="primary.main"
                            >
                                {formatCurrency(pickupCost)}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* =============================================
                    PICKUP INFORMATION
                ============================================= */}

                <Paper
                    variant="outlined"
                    sx={{
                        p: 2.5,
                        borderRadius: 2,
                        mb: 2.5
                    }}
                >
                    <SectionHeader
                        icon={<ReceiptLong />}
                        title="Pickup Information"
                    />

                    <Grid container spacing={2.5}>
                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Reverse Pickup ID"
                                value={pickupId}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Reverse Pickup Number"
                                value={pickupNumber}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Order Number"
                                value={orderNumber}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Pickup Date"
                                value={formatDate(pickupDate)}
                                icon={<CalendarMonth fontSize="small" />}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Created At"
                                value={formatDateTime(createdAt)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Last Updated"
                                value={formatDateTime(updatedAt)}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* =============================================
                    CUSTOMER INFORMATION
                ============================================= */}

                <Paper
                    variant="outlined"
                    sx={{
                        p: 2.5,
                        borderRadius: 2,
                        mb: 2.5
                    }}
                >
                    <SectionHeader
                        icon={<Person />}
                        title="Customer Information"
                    />

                    <Grid container spacing={2.5}>
                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Customer Name"
                                value={customerName}
                                icon={<Person fontSize="small" />}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Customer Email"
                                value={customerEmail}
                                icon={<Email fontSize="small" />}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <DetailField
                                label="Pickup Address"
                                value={pickupAddress}
                                icon={<LocationOn fontSize="small" />}
                                multiline
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* =============================================
                    ITEM INFORMATION
                ============================================= */}

                <Paper
                    variant="outlined"
                    sx={{
                        p: 2.5,
                        borderRadius: 2,
                        mb: 2.5
                    }}
                >
                    <SectionHeader
                        icon={<Inventory2 />}
                        title="Item Information"
                    />

                    <Grid container spacing={2.5}>
                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Item Name"
                                value={itemName}
                                icon={<Inventory2 fontSize="small" />}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="SKU"
                                value={sku}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Quantity"
                                value={formatNumber(quantity)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Pickup Cost"
                                value={formatCurrency(pickupCost)}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* =============================================
                    SHIPPING INFORMATION
                ============================================= */}

                <Paper
                    variant="outlined"
                    sx={{
                        p: 2.5,
                        borderRadius: 2,
                        mb: 2.5
                    }}
                >
                    <SectionHeader
                        icon={<LocalShipping />}
                        title="Shipping Information"
                    />

                    <Grid container spacing={2.5}>
                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Carrier Name"
                                value={carrierName}
                                icon={<LocalShipping fontSize="small" />}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailField
                                label="Tracking Number"
                                value={trackingNumber}
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
                                <CheckCircle
                                    color="action"
                                    fontSize="small"
                                />

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Current Status
                                </Typography>

                                <Chip
                                    size="small"
                                    label={formatText(status, "Unknown")}
                                    color={getStatusColor(status)}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* =============================================
                    NOTES
                ============================================= */}

                <Paper
                    variant="outlined"
                    sx={{
                        p: 2.5,
                        borderRadius: 2
                    }}
                >
                    <SectionHeader
                        icon={<Description />}
                        title="Additional Notes"
                    />

                    <Typography
                        variant="body2"
                        color={
                            notes &&
                            String(notes).trim() !== ""
                                ? "text.primary"
                                : "text.secondary"
                        }
                        sx={{
                            whiteSpace: "pre-wrap",
                            overflowWrap: "anywhere"
                        }}
                    >
                        {formatText(notes, "No additional notes provided.")}
                    </Typography>
                </Paper>
            </DialogContent>

            <Divider />

            {/* =================================================
                DIALOG ACTIONS
            ================================================= */}

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                    variant="contained"
                    onClick={onClose}
                    startIcon={<Close />}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReversePickupItemView;

