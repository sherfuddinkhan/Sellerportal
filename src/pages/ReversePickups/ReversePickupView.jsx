// ReversePickupView.jsx

import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Grid,
    Typography,
    Divider,
    Chip,
    Paper,
    Stack,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    Close,
    Edit,
    AssignmentReturn,
    Person,
    LocalShipping,
    CalendarMonth,
    LocationOn,
    Inventory2,
    ReceiptLong,
    CheckCircle,
    PendingActions,
    Cancel,
    Schedule,
    InfoOutlined,
    Numbers
} from "@mui/icons-material";

// =========================================================
// GET FIELD VALUE - CAMEL CASE / PASCAL CASE
// =========================================================

const getField = (object, ...keys) => {
    if (!object) return null;

    for (const key of keys) {
        const value = object[key];

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }
    }

    return null;
};

// =========================================================
// FORMAT TEXT
// =========================================================

const formatText = (value, fallback = "—") => {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return fallback;
    }

    return String(value);
};

// =========================================================
// FORMAT DATE
// =========================================================

const formatDate = (value, includeTime = false) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString(
        "en-IN",
        includeTime
            ? {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
            : {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
    );
};

// =========================================================
// FORMAT NUMBER
// =========================================================

const formatNumber = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) return "—";

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
};

// =========================================================
// FORMAT CURRENCY
// =========================================================

const formatCurrency = (value) => {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return "—";
    }

    const amount = Number(value);

    if (!Number.isFinite(amount)) return "—";

    return `₹ ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

// =========================================================
// STATUS CONFIGURATION
// =========================================================

const getStatusConfig = (status) => {
    const normalized = String(status ?? "Pending")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ");

    const statusMap = {
        pending: {
            label: "Pending",
            color: "warning",
            icon: <PendingActions fontSize="small" />
        },
        requested: {
            label: "Requested",
            color: "info",
            icon: <Schedule fontSize="small" />
        },
        approved: {
            label: "Approved",
            color: "info",
            icon: <CheckCircle fontSize="small" />
        },
        scheduled: {
            label: "Scheduled",
            color: "info",
            icon: <CalendarMonth fontSize="small" />
        },
        assigned: {
            label: "Assigned",
            color: "secondary",
            icon: <LocalShipping fontSize="small" />
        },
        "pickup scheduled": {
            label: "Pickup Scheduled",
            color: "info",
            icon: <CalendarMonth fontSize="small" />
        },
        "pickup in progress": {
            label: "Pickup In Progress",
            color: "primary",
            icon: <LocalShipping fontSize="small" />
        },
        "in progress": {
            label: "In Progress",
            color: "primary",
            icon: <LocalShipping fontSize="small" />
        },
        "in transit": {
            label: "In Transit",
            color: "primary",
            icon: <LocalShipping fontSize="small" />
        },
        "picked up": {
            label: "Picked Up",
            color: "primary",
            icon: <AssignmentReturn fontSize="small" />
        },
        completed: {
            label: "Completed",
            color: "success",
            icon: <CheckCircle fontSize="small" />
        },
        returned: {
            label: "Returned",
            color: "success",
            icon: <CheckCircle fontSize="small" />
        },
        cancelled: {
            label: "Cancelled",
            color: "error",
            icon: <Cancel fontSize="small" />
        },
        canceled: {
            label: "Cancelled",
            color: "error",
            icon: <Cancel fontSize="small" />
        },
        rejected: {
            label: "Rejected",
            color: "error",
            icon: <Cancel fontSize="small" />
        },
        failed: {
            label: "Failed",
            color: "error",
            icon: <Cancel fontSize="small" />
        }
    };

    return (
        statusMap[normalized] || {
            label: status || "Pending",
            color: "default",
            icon: <InfoOutlined fontSize="small" />
        }
    );
};

// =========================================================
// SECTION HEADER
// =========================================================

const SectionHeader = ({ icon, title }) => (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2
        }}
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

        <Typography
            variant="subtitle1"
            fontWeight={700}
        >
            {title}
        </Typography>
    </Box>
);

// =========================================================
// DETAIL FIELD
// =========================================================

const DetailField = ({
    label,
    value,
    fullWidth = false
}) => (
    <Grid item xs={12} sm={fullWidth ? 12 : 6}>
        <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mb: 0.5 }}
        >
            {label}
        </Typography>

        <Typography
            variant="body2"
            fontWeight={600}
            sx={{
                overflowWrap: "anywhere",
                whiteSpace: "pre-wrap"
            }}
        >
            {formatText(value)}
        </Typography>
    </Grid>
);

// =========================================================
// REVERSE PICKUP VIEW
// =========================================================

const ReversePickupView = ({
    open = true,
    onClose,
    onEdit,

    reversePickup = null,
    pickup = null,
    record = null,
    data = null,

    loading = false,
    error = null,

    embedded = false,
    title = "Reverse Pickup Details"
}) => {
    // =====================================================
    // SELECT RECORD
    // =====================================================

    const item =
        reversePickup ??
        pickup ??
        record ??
        data ??
        null;

    // =====================================================
    // IDENTIFICATION
    // =====================================================

    const pickupId = getField(
        item,
        "reversePickupId",
        "ReversePickupId",
        "pickupId",
        "PickupId",
        "id",
        "Id"
    );

    const pickupNumber =
        getField(
            item,
            "reversePickupNo",
            "ReversePickupNo",
            "reversePickupNumber",
            "ReversePickupNumber",
            "pickupNumber",
            "PickupNumber"
        ) ??
        (pickupId != null ? `RP-${pickupId}` : "—");

    const orderNumber = getField(
        item,
        "saleOrderCode",
        "SaleOrderCode",
        "orderNumber",
        "OrderNumber",
        "salesOrderNumber",
        "SalesOrderNumber"
    );

    const orderItemCode = getField(
        item,
        "saleOrderItemCode",
        "SaleOrderItemCode"
    );

    const sellerId = getField(
        item,
        "sellerId",
        "SellerId"
    );

    const customerId = getField(
        item,
        "customerId",
        "CustomerId"
    );

    // =====================================================
    // CUSTOMER INFORMATION
    // =====================================================

    const customerName = getField(
        item,
        "customerName",
        "CustomerName"
    );

    const customerEmail = getField(
        item,
        "customerEmail",
        "CustomerEmail",
        "email",
        "Email"
    );

    const customerPhone = getField(
        item,
        "customerPhone",
        "CustomerPhone",
        "phoneNumber",
        "PhoneNumber"
    );

    // =====================================================
    // RETURN ITEM INFORMATION
    // =====================================================

    const itemSkuCode = getField(
        item,
        "itemSkuCode",
        "ItemSkuCode",
        "sku",
        "SKU",
        "productCode",
        "ProductCode"
    );

    const itemName = getField(
        item,
        "itemName",
        "ItemName",
        "productName",
        "ProductName"
    );

    const quantity = getField(
        item,
        "quantity",
        "Quantity",
        "returnQuantity",
        "ReturnQuantity"
    );

    const returnReason = getField(
        item,
        "returnReason",
        "ReturnReason",
        "reason",
        "Reason"
    );

    const itemCondition = getField(
        item,
        "itemCondition",
        "ItemCondition",
        "condition",
        "Condition"
    );

    // =====================================================
    // PICKUP INFORMATION
    // =====================================================

    const pickupDate = getField(
        item,
        "pickupDate",
        "PickupDate",
        "scheduledPickupDate",
        "ScheduledPickupDate"
    );

    const actualPickupDate = getField(
        item,
        "actualPickupDate",
        "ActualPickupDate",
        "pickedUpDate",
        "PickedUpDate"
    );

    const pickupAddress = getField(
        item,
        "pickupAddress",
        "PickupAddress",
        "returnAddress",
        "ReturnAddress"
    );

    const pickupCity = getField(
        item,
        "pickupCity",
        "PickupCity",
        "city",
        "City"
    );

    const pickupState = getField(
        item,
        "pickupState",
        "PickupState",
        "state",
        "State"
    );

    const pickupPostalCode = getField(
        item,
        "pickupPostalCode",
        "PickupPostalCode",
        "postalCode",
        "PostalCode",
        "zipCode",
        "ZipCode"
    );

    const pickupLocation = [
        pickupCity,
        pickupState,
        pickupPostalCode
    ].filter(Boolean).join(", ");

    // =====================================================
    // CARRIER INFORMATION
    // =====================================================

    const carrierName = getField(
        item,
        "courierProviderName",
        "CourierProviderName",
        "carrierName",
        "CarrierName"
    );

    const trackingNumber = getField(
        item,
        "trackingNo",
        "TrackingNo",
        "trackingNumber",
        "TrackingNumber"
    );

    const driverName = getField(
        item,
        "driverName",
        "DriverName"
    );

    const vehicleNumber = getField(
        item,
        "vehicleNumber",
        "VehicleNumber"
    );

    // =====================================================
    // ADDITIONAL BACKEND FIELDS
    // =====================================================

    const facilityCode = getField(
        item,
        "facilityCode",
        "FacilityCode"
    );

    const channelName = getField(
        item,
        "channelName",
        "ChannelName"
    );

    const putawayCode = getField(
        item,
        "putawayCode",
        "PutawayCode"
    );

    // =====================================================
    // FINANCIAL INFORMATION
    // =====================================================

    const pickupCost = getField(
        item,
        "pickupCost",
        "PickupCost",
        "shippingCost",
        "ShippingCost"
    );

    const refundAmount = getField(
        item,
        "refundAmount",
        "RefundAmount"
    );

    // =====================================================
    // STATUS / NOTES / AUDIT
    // =====================================================

    const status =
        getField(
            item,
            "reversePickupStatus",
            "ReversePickupStatus",
            "status",
            "Status",
            "pickupStatus",
            "PickupStatus"
        ) ?? "Pending";

    const statusConfig = getStatusConfig(status);

    const notes = getField(
        item,
        "notes",
        "Notes",
        "remarks",
        "Remarks",
        "comments",
        "Comments",
        "qcComment",
        "QCComment"
    );

    const createdBy = getField(
        item,
        "createdBy",
        "CreatedBy"
    );

    const createdAt = getField(
        item,
        "createdAt",
        "CreatedAt",
        "createdDate",
        "CreatedDate"
    );

    const updatedBy = getField(
        item,
        "updatedBy",
        "UpdatedBy",
        "modifiedBy",
        "ModifiedBy"
    );

    const updatedAt = getField(
        item,
        "updatedAt",
        "UpdatedAt",
        "modifiedAt",
        "ModifiedAt",
        "updatedDate",
        "UpdatedDate"
    );

    // =====================================================
    // DETAIL CONTENT
    // =====================================================

    const content = (
        <Box>
            {loading && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: 2,
                        py: 6
                    }}
                >
                    <CircularProgress />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Loading reverse pickup details...
                    </Typography>
                </Box>
            )}

            {!loading && error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {typeof error === "string"
                        ? error
                        : "Unable to load reverse pickup details."}
                </Alert>
            )}

            {!loading && !error && !item && (
                <Alert severity="info">
                    No reverse pickup record is available.
                </Alert>
            )}

            {!loading && !error && item && (
                <Stack spacing={2.5}>
                    {/* SUMMARY */}

                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "action.hover"
                        }}
                    >
                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row"
                            }}
                            spacing={2}
                            alignItems={{
                                xs: "flex-start",
                                sm: "center"
                            }}
                            justifyContent="space-between"
                        >
                            <Stack
                                direction="row"
                                spacing={1.5}
                                alignItems="center"
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: 2,
                                        bgcolor: "primary.main",
                                        color: "primary.contrastText"
                                    }}
                                >
                                    <AssignmentReturn fontSize="large" />
                                </Box>

                                <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                        variant="h6"
                                        fontWeight={800}
                                        sx={{ overflowWrap: "anywhere" }}
                                    >
                                        {pickupNumber}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Order: {formatText(orderNumber)}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Chip
                                icon={statusConfig.icon}
                                label={statusConfig.label}
                                color={statusConfig.color}
                                sx={{ fontWeight: 700 }}
                            />
                        </Stack>
                    </Paper>

                    {/* PICKUP IDENTIFICATION */}

                    <Box>
                        <SectionHeader
                            icon={<AssignmentReturn />}
                            title="Reverse Pickup Information"
                        />

                        <Grid container spacing={2}>
                            <DetailField
                                label="Reverse Pickup ID"
                                value={pickupId}
                            />

                            <DetailField
                                label="Reverse Pickup Number"
                                value={pickupNumber}
                            />

                            <DetailField
                                label="Sales Order Code"
                                value={orderNumber}
                            />

                            <DetailField
                                label="Sales Order Item Code"
                                value={orderItemCode}
                            />

                            <DetailField
                                label="Status"
                                value={statusConfig.label}
                            />

                            <DetailField
                                label="Pickup Date"
                                value={formatDate(pickupDate)}
                            />

                            <DetailField
                                label="Actual Pickup Date"
                                value={formatDate(actualPickupDate)}
                            />

                            <DetailField
                                label="Return Reason"
                                value={returnReason}
                                fullWidth
                            />
                        </Grid>
                    </Box>

                    <Divider />

                    {/* CUSTOMER */}

                    <Box>
                        <SectionHeader
                            icon={<Person />}
                            title="Customer Information"
                        />

                        <Grid container spacing={2}>
                            <DetailField
                                label="Customer ID"
                                value={customerId}
                            />

                            <DetailField
                                label="Customer Name"
                                value={customerName}
                            />

                            <DetailField
                                label="Customer Email"
                                value={customerEmail}
                            />

                            <DetailField
                                label="Customer Phone"
                                value={customerPhone}
                            />

                            <DetailField
                                label="Seller ID"
                                value={sellerId}
                            />
                        </Grid>
                    </Box>

                    <Divider />

                    {/* RETURN ITEM */}

                    <Box>
                        <SectionHeader
                            icon={<Inventory2 />}
                            title="Return Item Information"
                        />

                        <Grid container spacing={2}>
                            <DetailField
                                label="Item Name"
                                value={itemName}
                            />

                            <DetailField
                                label="Item SKU Code"
                                value={itemSkuCode}
                            />

                            <DetailField
                                label="Quantity"
                                value={
                                    quantity != null
                                        ? formatNumber(quantity)
                                        : null
                                }
                            />

                            <DetailField
                                label="Item Condition"
                                value={itemCondition}
                            />
                        </Grid>
                    </Box>

                    <Divider />

                    {/* PICKUP ADDRESS */}

                    <Box>
                        <SectionHeader
                            icon={<LocationOn />}
                            title="Pickup Address"
                        />

                        <Grid container spacing={2}>
                            <DetailField
                                label="Address"
                                value={pickupAddress}
                                fullWidth
                            />

                            <DetailField
                                label="City / State / Postal Code"
                                value={pickupLocation || null}
                                fullWidth
                            />
                        </Grid>
                    </Box>

                    <Divider />

                    {/* CARRIER */}

                    <Box>
                        <SectionHeader
                            icon={<LocalShipping />}
                            title="Carrier Information"
                        />

                        <Grid container spacing={2}>
                            <DetailField
                                label="Courier Provider"
                                value={carrierName}
                            />

                            <DetailField
                                label="Tracking Number"
                                value={trackingNumber}
                            />

                            <DetailField
                                label="Driver Name"
                                value={driverName}
                            />

                            <DetailField
                                label="Vehicle Number"
                                value={vehicleNumber}
                            />
                        </Grid>
                    </Box>

                    <Divider />

                    {/* FACILITY / CHANNEL */}

                    <Box>
                        <SectionHeader
                            icon={<ReceiptLong />}
                            title="Facility and Channel Information"
                        />

                        <Grid container spacing={2}>
                            <DetailField
                                label="Facility Code"
                                value={facilityCode}
                            />

                            <DetailField
                                label="Channel Name"
                                value={channelName}
                            />

                            <DetailField
                                label="Putaway Code"
                                value={putawayCode}
                            />
                        </Grid>
                    </Box>

                    <Divider />

                    {/* FINANCIAL */}

                    <Box>
                        <SectionHeader
                            icon={<ReceiptLong />}
                            title="Financial Information"
                        />

                        <Grid container spacing={2}>
                            <DetailField
                                label="Pickup Cost"
                                value={formatCurrency(pickupCost)}
                            />

                            <DetailField
                                label="Refund Amount"
                                value={formatCurrency(refundAmount)}
                            />
                        </Grid>
                    </Box>

                    {/* NOTES */}

                    {notes && (
                        <>
                            <Divider />

                            <Box>
                                <SectionHeader
                                    icon={<InfoOutlined />}
                                    title="Notes / QC Comments"
                                />

                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: "action.hover"
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{ whiteSpace: "pre-wrap" }}
                                    >
                                        {notes}
                                    </Typography>
                                </Paper>
                            </Box>
                        </>
                    )}

                    {/* AUDIT */}

                    {(createdBy ||
                        createdAt ||
                        updatedBy ||
                        updatedAt) && (
                        <>
                            <Divider />

                            <Box>
                                <SectionHeader
                                    icon={<CalendarMonth />}
                                    title="Audit Information"
                                />

                                <Grid container spacing={2}>
                                    <DetailField
                                        label="Created By"
                                        value={createdBy}
                                    />

                                    <DetailField
                                        label="Created At"
                                        value={formatDate(createdAt, true)}
                                    />

                                    <DetailField
                                        label="Updated By"
                                        value={updatedBy}
                                    />

                                    <DetailField
                                        label="Updated At"
                                        value={formatDate(updatedAt, true)}
                                    />
                                </Grid>
                            </Box>
                        </>
                    )}
                </Stack>
            )}
        </Box>
    );

    // =====================================================
    // EMBEDDED MODE
    // =====================================================

    if (embedded) {
        return (
            <Box sx={{ width: "100%" }}>
                <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{ mb: 3 }}
                >
                    {title}
                </Typography>

                {content}

                {!loading && !error && item && onEdit && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 3
                        }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={() => onEdit(item)}
                        >
                            Edit Reverse Pickup
                        </Button>
                    </Box>
                )}

                {onClose && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 2
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<Close />}
                            onClick={onClose}
                        >
                            Back
                        </Button>
                    </Box>
                )}
            </Box>
        );
    }

    // =====================================================
    // DIALOG MODE
    // =====================================================

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2
                }}
            >
                <Box>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Reverse logistics record
                    </Typography>
                </Box>

                <Button
                    color="inherit"
                    startIcon={<Close />}
                    onClick={onClose}
                    disabled={loading}
                >
                    Close
                </Button>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
                {content}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<Close />}
                    onClick={onClose}
                    disabled={loading}
                >
                    Close
                </Button>

                {item && onEdit && !loading && !error && (
                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() => onEdit(item)}
                    >
                        Edit Reverse Pickup
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ReversePickupView;
