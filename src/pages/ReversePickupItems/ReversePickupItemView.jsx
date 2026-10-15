
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

// =====================================================
// FORMAT TEXT
// =====================================================

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

// =====================================================
// FORMAT NUMBER
// =====================================================

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

// =====================================================
// FORMAT CURRENCY
// =====================================================

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

// =====================================================
// FORMAT DATE
// =====================================================

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

// =====================================================
// FORMAT DATE AND TIME
// =====================================================

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

// =====================================================
// STATUS COLOR
// =====================================================

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

// =====================================================
// GET FIELD - CAMELCASE AND PASCALCASE
// =====================================================

const getField = (object, ...keys) => {
    for (const key of keys) {
        if (
            object?.[key] !== undefined &&
            object?.[key] !== null
        ) {
            return object[key];
        }
    }

    return undefined;
};

// =====================================================
// DETAIL FIELD
// =====================================================

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

// =====================================================
// SECTION HEADER
// =====================================================

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

// =====================================================
// REVERSE PICKUP ITEM VIEW
// =====================================================

 function ReversePickupItemView({
    open = false,
    onClose,
    reversePickup,
    pickup,
    item,
    record,
    data,
    title = "Reverse Pickup Item Details"
}) {
    const details =
        reversePickup ||
        pickup ||
        item ||
        record ||
        data ||
        {};

    // =====================================================
    // ACTUAL REVERSE PICKUP ITEM API FIELDS
    // =====================================================

    const itemId = getField(
        details,
        "id",
        "Id",
        "reversePickupItemId",
        "ReversePickupItemId"
    );

    const sellerId = getField(
        details,
        "sellerId",
        "SellerId"
    );

    const customerId = getField(
        details,
        "customerId",
        "CustomerId"
    );

    const reversePickupId = getField(
        details,
        "reversePickupId",
        "ReversePickupId"
    );

    const saleOrderItemCode = getField(
        details,
        "saleOrderItemCode",
        "SaleOrderItemCode"
    );

    const reason = getField(
        details,
        "reason",
        "Reason"
    );

    const itemSku = getField(
        details,
        "itemSku",
        "ItemSku",
        "sku",
        "SKU"
    );

    const totalPrice = getField(
        details,
        "totalPrice",
        "TotalPrice"
    );

    const sellingPrice = getField(
        details,
        "sellingPrice",
        "SellingPrice"
    );

    const discount = getField(
        details,
        "discount",
        "Discount"
    );

    // These additional fields are displayed only if supplied.
    const status = getField(
        details,
        "status",
        "Status"
    );

    const notes = getField(
        details,
        "notes",
        "Notes"
    );

    const createdAt = getField(
        details,
        "createdAt",
        "CreatedAt"
    );

    const updatedAt = getField(
        details,
        "updatedAt",
        "UpdatedAt"
    );

    // Optional fields from an expanded parent pickup response.
    const pickupNumber = getField(
        details,
        "reversePickupNumber",
        "ReversePickupNumber"
    );

    const orderNumber = getField(
        details,
        "orderNumber",
        "OrderNumber"
    );

    const customerName = getField(
        details,
        "customerName",
        "CustomerName"
    );

    const customerEmail = getField(
        details,
        "customerEmail",
        "CustomerEmail"
    );

    const pickupDate = getField(
        details,
        "pickupDate",
        "PickupDate"
    );

    const pickupAddress = getField(
        details,
        "pickupAddress",
        "PickupAddress"
    );

    const itemName = getField(
        details,
        "itemName",
        "ItemName"
    );

    const quantity = getField(
        details,
        "quantity",
        "Quantity"
    );

    const carrierName = getField(
        details,
        "carrierName",
        "CarrierName"
    );

    const trackingNumber = getField(
        details,
        "trackingNumber",
        "TrackingNumber"
    );

    const pickupCost = getField(
        details,
        "pickupCost",
        "PickupCost"
    );

    // Use available pricing fields for the summary.
    const summaryAmount =
        pickupCost ?? totalPrice ?? sellingPrice;

    // =====================================================
    // RENDER
    // =====================================================

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
            {/* HEADER */}

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
                    <Typography variant="h6" fontWeight={700}>
                        {title}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ overflowWrap: "anywhere" }}
                    >
                        {formatText(
                            pickupNumber,
                            `Reverse Pickup Item ID: ${formatText(itemId)}`
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

            {/* CONTENT */}

            <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
                {/* SUMMARY CARDS */}

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid xs={12} sm={4}>
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
                                    Item ID
                                </Typography>
                            </Stack>

                            <Typography
                                variant="body1"
                                fontWeight={700}
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {formatText(itemId)}
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid xs={12} sm={4}>
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
                                    Reverse Pickup ID
                                </Typography>
                            </Stack>

                            <Typography variant="h6" fontWeight={700}>
                                {formatText(reversePickupId)}
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid xs={12} sm={4}>
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
                                    Item Total Price
                                </Typography>
                            </Stack>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                                color="primary.main"
                            >
                                {formatCurrency(summaryAmount)}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* ITEM INFORMATION */}

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
                        title="Reverse Pickup Item Information"
                    />

                    <Grid container spacing={2.5}>
                        <Grid xs={12} sm={6}>
                            <DetailField
                                label="Item ID"
                                value={itemId}
                                icon={<Numbers fontSize="small" />}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <DetailField
                                label="Reverse Pickup ID"
                                value={reversePickupId}
                                icon={<ReceiptLong fontSize="small" />}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <DetailField
                                label="Seller ID"
                                value={sellerId}
                                icon={<Person fontSize="small" />}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <DetailField
                                label="Customer ID"
                                value={customerId}
                                icon={<Person fontSize="small" />}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <DetailField
                                label="Sale Order Item Code"
                                value={saleOrderItemCode}
                                icon={<ReceiptLong fontSize="small" />}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <DetailField
                                label="Item SKU"
                                value={itemSku}
                                icon={<Inventory2 fontSize="small" />}
                            />
                        </Grid>

                        <Grid xs={12}>
                            <DetailField
                                label="Return Reason"
                                value={reason}
                                icon={<Description fontSize="small" />}
                                multiline
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* PRICING INFORMATION */}

                <Paper
                    variant="outlined"
                    sx={{
                        p: 2.5,
                        borderRadius: 2,
                        mb: 2.5
                    }}
                >
                    <SectionHeader
                        icon={<Payments />}
                        title="Pricing Information"
                    />

                    <Grid container spacing={2.5}>
                        <Grid xs={12} sm={4}>
                            <DetailField
                                label="Total Price"
                                value={formatCurrency(totalPrice)}
                            />
                        </Grid>

                        <Grid xs={12} sm={4}>
                            <DetailField
                                label="Selling Price"
                                value={formatCurrency(sellingPrice)}
                            />
                        </Grid>

                        <Grid xs={12} sm={4}>
                            <DetailField
                                label="Discount"
                                value={formatCurrency(discount)}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* OPTIONAL PICKUP DETAILS */}

                {(pickupNumber ||
                    orderNumber ||
                    customerName ||
                    customerEmail ||
                    pickupDate ||
                    pickupAddress ||
                    itemName ||
                    quantity !== undefined ||
                    carrierName ||
                    trackingNumber ||
                    pickupCost !== undefined) && (
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
                            title="Related Pickup Information"
                        />

                        <Grid container spacing={2.5}>
                            <Grid xs={12} sm={6}>
                                <DetailField
                                    label="Pickup Number"
                                    value={pickupNumber}
                                    icon={<ConfirmationNumber fontSize="small" />}
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <DetailField
                                    label="Order Number"
                                    value={orderNumber}
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <DetailField
                                    label="Customer Name"
                                    value={customerName}
                                    icon={<Person fontSize="small" />}
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <DetailField
                                    label="Customer Email"
                                    value={customerEmail}
                                    icon={<Email fontSize="small" />}
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <DetailField
                                    label="Pickup Date"
                                    value={formatDate(pickupDate)}
                                    icon={<CalendarMonth fontSize="small" />}
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <DetailField
                                    label="Item Name"
                                    value={itemName}
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <DetailField
                                    label="Quantity"
                                    value={
                                        quantity === undefined
                                            ? undefined
                                            : formatNumber(quantity)
                                    }
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <DetailField
                                    label="Pickup Cost"
                                    value={
                                        pickupCost === undefined
                                            ? undefined
                                            : formatCurrency(pickupCost)
                                    }
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <DetailField
                                    label="Carrier Name"
                                    value={carrierName}
                                    icon={<LocalShipping fontSize="small" />}
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <DetailField
                                    label="Tracking Number"
                                    value={trackingNumber}
                                />
                            </Grid>

                            <Grid xs={12}>
                                <DetailField
                                    label="Pickup Address"
                                    value={pickupAddress}
                                    icon={<LocationOn fontSize="small" />}
                                    multiline
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                )}

                {/* STATUS AND AUDIT INFORMATION */}

                <Paper
                    variant="outlined"
                    sx={{
                        p: 2.5,
                        borderRadius: 2,
                        mb: 2.5
                    }}
                >
                    <SectionHeader
                        icon={<CheckCircle />}
                        title="Status and Record Information"
                    />

                    <Grid container spacing={2.5}>
                        <Grid xs={12} sm={6}>
                            <DetailField
                                label="Status"
                                value={status}
                            />

                            <Box sx={{ mt: 1 }}>
                                <Chip
                                    size="small"
                                    label={formatText(status, "Unknown")}
                                    color={getStatusColor(status)}
                                />
                            </Box>
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <DetailField
                                label="Created At"
                                value={formatDateTime(createdAt)}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <DetailField
                                label="Last Updated"
                                value={formatDateTime(updatedAt)}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* NOTES */}

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
                            notes && String(notes).trim() !== ""
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

            {/* FOOTER */}

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
}
export default ReversePickupItemView;
