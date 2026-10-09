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
    InfoOutlined
} from "@mui/icons-material";

/* =========================================================
   FIELD HELPER
========================================================= */

const getField = (object, ...keys) => {
    for (const key of keys) {
        const value = object?.[key];

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

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value, includeTime = false) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
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

/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
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
   STATUS CONFIGURATION
========================================================= */

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
        statusMap[normalized] ?? {
            label: status || "Pending",
            color: "default",
            icon: <InfoOutlined fontSize="small" />
        }
    );
};

/* =========================================================
   SECTION HEADER
========================================================= */

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

/* =========================================================
   DETAIL FIELD
========================================================= */

const DetailField = ({
    label,
    value,
    fullWidth = false,
    valueColor = "text.primary"
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
            color={valueColor}
            sx={{
                overflowWrap: "anywhere",
                whiteSpace: "pre-wrap"
            }}
        >
            {value !== undefined &&
            value !== null &&
            value !== ""
                ? value
                : "—"}
        </Typography>
    </Grid>
);

/* =========================================================
   REVERSE PICKUP VIEW
========================================================= */

const ReversePickupView = ({
    open = true,
    onClose,
    onEdit,

    reversePickup,
    pickup,
    record,
    data,

    loading = false,
    error = null,

    embedded = false,
    title = "Reverse Pickup Details"
}) => {
    const item =
        reversePickup ??
        pickup ??
        record ??
        data ??
        {};

    /* =====================================================
       IDENTIFICATION
    ===================================================== */

    const pickupId = getField(
        item,
        "reversePickupId",
        "ReversePickupId",
        "pickupId",
        "PickupId",
        "id",
        "Id"
    );

    const pickupNumber = getField(
        item,
        "reversePickupNumber",
        "ReversePickupNumber",
        "pickupNumber",
        "PickupNumber",
        "returnNumber",
        "ReturnNumber"
    ) ?? (pickupId != null ? `RP-${pickupId}` : "—");

    const orderNumber = getField(
        item,
        "orderNumber",
        "OrderNumber",
        "salesOrderNumber",
        "SalesOrderNumber",
        "originalOrderNumber",
        "OriginalOrderNumber"
    );

    const returnOrderNumber = getField(
        item,
        "returnOrderNumber",
        "ReturnOrderNumber",
        "rmaNumber",
        "RMANumber"
    );

    /* =====================================================
       CUSTOMER DETAILS
    ===================================================== */

    const customerName = getField(
        item,
        "customerName",
        "CustomerName",
        "customer",
        "Customer",
        "recipientName",
        "RecipientName"
    );

    const customerId = getField(
        item,
        "customerId",
        "CustomerId"
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
        "PhoneNumber",
        "mobileNumber",
        "MobileNumber"
    );

    /* =====================================================
       PICKUP DETAILS
    ===================================================== */

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
        "ReturnAddress",
        "address",
        "Address"
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

    /* =====================================================
       RETURN DETAILS
    ===================================================== */

    const returnReason = getField(
        item,
        "returnReason",
        "ReturnReason",
        "reason",
        "Reason",
        "reasonForReturn",
        "ReasonForReturn"
    );

    const returnType = getField(
        item,
        "returnType",
        "ReturnType",
        "pickupType",
        "PickupType"
    );

    const returnMethod = getField(
        item,
        "returnMethod",
        "ReturnMethod",
        "pickupMethod",
        "PickupMethod"
    );

    const itemName = getField(
        item,
        "itemName",
        "ItemName",
        "productName",
        "ProductName"
    );

    const productCode = getField(
        item,
        "productCode",
        "ProductCode",
        "sku",
        "SKU"
    );

    const quantity = getField(
        item,
        "quantity",
        "Quantity",
        "returnQuantity",
        "ReturnQuantity"
    );

    const condition = getField(
        item,
        "itemCondition",
        "ItemCondition",
        "condition",
        "Condition"
    );

    /* =====================================================
       SHIPPING DETAILS
    ===================================================== */

    const carrierName = getField(
        item,
        "carrierName",
        "CarrierName",
        "shippingCarrier",
        "ShippingCarrier",
        "carrier",
        "Carrier"
    );

    const trackingNumber = getField(
        item,
        "trackingNumber",
        "TrackingNumber",
        "returnTrackingNumber",
        "ReturnTrackingNumber"
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

    /* =====================================================
       FINANCIAL DETAILS
    ===================================================== */

    const pickupCost = getField(
        item,
        "pickupCost",
        "PickupCost",
        "shippingCost",
        "ShippingCost",
        "returnShippingCost",
        "ReturnShippingCost"
    );

    const refundAmount = getField(
        item,
        "refundAmount",
        "RefundAmount",
        "totalRefundAmount",
        "TotalRefundAmount"
    );

    /* =====================================================
       STATUS AND AUDIT
    ===================================================== */

    const status = getField(
        item,
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
        "Comments"
    );

    const createdBy = getField(
        item,
        "createdBy",
        "CreatedBy",
        "createdByName",
        "CreatedByName"
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
        "modifiedDate",
        "ModifiedDate"
    );

    /* =====================================================
       CONTENT
    ===================================================== */

    const content = (
        <Box>
            {loading && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        py: 5
                    }}
                >
                    <CircularProgress />
                </Box>
            )}

            {!loading && error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {typeof error === "string"
                        ? error
                        : "Unable to load reverse pickup details."}
                </Alert>
            )}

            {!loading && !error && (
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
                                    <AssignmentReturn
                                        fontSize="large"
                                    />
                                </Box>

                                <Box>
                                    <Typography
                                        variant="h6"
                                        fontWeight={800}
                                        sx={{
                                            overflowWrap: "anywhere"
                                        }}
                                    >
                                        {pickupNumber}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Reverse Pickup ID:{" "}
                                        {pickupId ?? "—"}
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

                    {/* ORDER INFORMATION */}

                    <Box>
                        <SectionHeader
                            icon={<ReceiptLong />}
                            title="Order Information"
                        />

                        <Grid container spacing={2}>
                            <DetailField
                                label="Original Order Number"
                                value={orderNumber}
                            />

                            <DetailField
                                label="Return Order / RMA Number"
                                value={returnOrderNumber}
                            />

                            <DetailField
                                label="Return Type"
                                value={returnType}
                            />

                            <DetailField
                                label="Return Method"
                                value={returnMethod}
                            />
                        </Grid>
                    </Box>

                    <Divider />

                    {/* CUSTOMER INFORMATION */}

                    <Box>
                        <SectionHeader
                            icon={<Person />}
                            title="Customer Information"
                        />

                        <Grid container spacing={2}>
                            <DetailField
                                label="Customer Name"
                                value={customerName}
                            />

                            <DetailField
                                label="Customer ID"
                                value={customerId}
                            />

                            <DetailField
                                label="Email Address"
                                value={customerEmail}
                            />

                            <DetailField
                                label="Phone Number"
                                value={customerPhone}
                            />
                        </Grid>
                    </Box>

                    <Divider />

                    {/* PICKUP INFORMATION */}

                    <Box>
                        <SectionHeader
                            icon={<LocationOn />}
                            title="Pickup Information"
                        />

                        <Grid container spacing={2}>
                            <DetailField
                                label="Pickup Address"
                                value={pickupAddress}
                                fullWidth
                            />

                            <DetailField
                                label="City / State / Postal Code"
                                value={pickupLocation}
                                fullWidth
                            />

                            <DetailField
                                label="Scheduled Pickup Date"
                                value={formatDate(pickupDate)}
                            />

                            <DetailField
                                label="Actual Pickup Date"
                                value={formatDate(actualPickupDate)}
                            />
                        </Grid>
                    </Box>

                    <Divider />

                    {/* RETURN ITEM INFORMATION */}

                    <Box>
                        <SectionHeader
                            icon={<Inventory2 />}
                            title="Return Item Information"
                        />

                        <Grid container spacing={2}>
                            <DetailField
                                label="Product Name"
                                value={itemName}
                            />

                            <DetailField
                                label="Product Code / SKU"
                                value={productCode}
                            />

                            <DetailField
                                label="Return Quantity"
                                value={
                                    quantity != null
                                        ? formatNumber(quantity)
                                        : "—"
                                }
                            />

                            <DetailField
                                label="Item Condition"
                                value={condition}
                            />

                            <DetailField
                                label="Reason for Return"
                                value={returnReason}
                                fullWidth
                            />
                        </Grid>
                    </Box>

                    <Divider />

                    {/* CARRIER INFORMATION */}

                    <Box>
                        <SectionHeader
                            icon={<LocalShipping />}
                            title="Carrier and Transport Information"
                        />

                        <Grid container spacing={2}>
                            <DetailField
                                label="Carrier Name"
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

                    {/* FINANCIAL INFORMATION */}

                    <Box>
                        <SectionHeader
                            icon={<ReceiptLong />}
                            title="Financial Information"
                        />

                        <Grid container spacing={2}>
                            <DetailField
                                label="Pickup / Return Shipping Cost"
                                value={
                                    pickupCost != null
                                        ? formatCurrency(pickupCost)
                                        : "—"
                                }
                            />

                            <DetailField
                                label="Refund Amount"
                                value={
                                    refundAmount != null
                                        ? formatCurrency(refundAmount)
                                        : "—"
                                }
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
                                    title="Notes and Remarks"
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

                    {/* AUDIT INFORMATION */}

                    {(createdBy ||
                        createdAt ||
                        updatedBy ||
                        updatedAt) && (
                        <>
                            <Divider />

                            <Box>
                                <SectionHeader
                                    icon={<InfoOutlined />}
                                    title="Audit Information"
                                />

                                <Grid container spacing={2}>
                                    <DetailField
                                        label="Created By"
                                        value={createdBy}
                                    />

                                    <DetailField
                                        label="Created At"
                                        value={formatDate(
                                            createdAt,
                                            true
                                        )}
                                    />

                                    <DetailField
                                        label="Last Updated By"
                                        value={updatedBy}
                                    />

                                    <DetailField
                                        label="Last Updated At"
                                        value={formatDate(
                                            updatedAt,
                                            true
                                        )}
                                    />
                                </Grid>
                            </Box>
                        </>
                    )}
                </Stack>
            )}
        </Box>
    );

    /* =====================================================
       EMBEDDED MODE
    ===================================================== */

    if (embedded) {
        return (
            <Box sx={{ width: "100%" }}>
                {content}

                {!loading && !error && onEdit && (
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
            </Box>
        );
    }

    /* =====================================================
       DIALOG MODE
    ===================================================== */

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
                        View reverse pickup information
                    </Typography>
                </Box>

                <Button
                    color="inherit"
                    onClick={onClose}
                    disabled={loading}
                    startIcon={<Close />}
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
                    onClick={onClose}
                    disabled={loading}
                    startIcon={<Close />}
                >
                    Close
                </Button>

                {onEdit && !loading && !error && (
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

