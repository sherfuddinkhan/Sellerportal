// ReversePickupDetails.jsx

import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Grid,
    Paper,
    Typography,
    Divider,
    Chip,
    CircularProgress,
    Alert,
    IconButton,
    Stack
} from "@mui/material";

import {
    Close,
    ArrowBack,
    AssignmentReturn,
    Person,
    ShoppingBag,
    LocalShipping,
    LocationOn,
    CalendarMonth,
    ReceiptLong,
    Payments,
    Numbers,
    Email,
    Notes
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (record, ...keys) => {
    if (!record) return "";

    for (const key of keys) {
        if (
            record[key] !== undefined &&
            record[key] !== null &&
            record[key] !== ""
        ) {
            return record[key];
        }
    }

    return "";
};

/* =========================================================
   FORMAT TEXT
========================================================= */

const formatText = (value, fallback = "—") => {
    if (value === undefined || value === null || value === "") {
        return fallback;
    }

    return String(value);
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
   FORMAT DATE
========================================================= */

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
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
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
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
        case "delivered":
            return "success";

        case "scheduled":
        case "in progress":
        case "inprogress":
            return "info";

        case "pending":
            return "warning";

        case "cancelled":
        case "canceled":
        case "failed":
            return "error";

        default:
            return "default";
    }
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
        {icon}

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
    icon,
    fullWidth = false,
    multiline = false
}) => (
    <Grid
        item
        xs={12}
        sm={fullWidth ? 12 : 6}
    >
        <Box
            sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                minWidth: 0
            }}
        >
            {icon && (
                <Box
                    sx={{
                        color: "text.secondary",
                        display: "flex",
                        mt: 0.25
                    }}
                >
                    {icon}
                </Box>
            )}

            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                >
                    {label}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 500,
                        overflowWrap: "anywhere",
                        whiteSpace: multiline
                            ? "pre-wrap"
                            : "normal"
                    }}
                >
                    {formatText(value)}
                </Typography>
            </Box>
        </Box>
    </Grid>
);

/* =========================================================
   REVERSE PICKUP DETAILS
========================================================= */

const ReversePickupDetails = ({
    open = true,
    onClose,
    onEdit,

    reversePickup = null,
    pickup = null,
    record = null,
    data = null,

    loading = false,
    error = "",

    embedded = false,

    title = "Reverse Pickup Details",

    showEditButton = true,
    showCloseButton = true,
    showAuditDetails = true
}) => {
    const selectedRecord =
        reversePickup ||
        pickup ||
        record ||
        data ||
        null;

    /* =====================================================
       LOADING STATE
    ===================================================== */

    const content = (
        <Box>
            {loading && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        py: 6,
                        gap: 2
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
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}

            {!loading && !error && !selectedRecord && (
                <Alert severity="info">
                    No reverse pickup record is available.
                </Alert>
            )}

            {!loading && !error && selectedRecord && (
                <Stack spacing={2.5}>
                    {/* =====================================
                        SUMMARY
                    ===================================== */}

                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            borderRadius: 2
                        }}
                    >
                        <Grid
                            container
                            spacing={2}
                            alignItems="center"
                        >
                            <Grid item xs={12} sm={8}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5
                                    }}
                                >
                                    <AssignmentReturn
                                        color="primary"
                                        sx={{ fontSize: 38 }}
                                    />

                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            variant="h6"
                                            fontWeight={700}
                                            sx={{
                                                overflowWrap: "anywhere"
                                            }}
                                        >
                                            {formatText(
                                                getFieldValue(
                                                    selectedRecord,
                                                    "reversePickupNumber",
                                                    "ReversePickupNumber",
                                                    "pickupNumber",
                                                    "PickupNumber"
                                                ),
                                                "Reverse Pickup"
                                            )}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Order:{" "}
                                            {formatText(
                                                getFieldValue(
                                                    selectedRecord,
                                                    "orderNumber",
                                                    "OrderNumber"
                                                )
                                            )}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                sm={4}
                                sx={{
                                    display: "flex",
                                    justifyContent: {
                                        xs: "flex-start",
                                        sm: "flex-end"
                                    }
                                }}
                            >
                                <Chip
                                    label={formatText(
                                        getFieldValue(
                                            selectedRecord,
                                            "status",
                                            "Status"
                                        ),
                                        "Unknown"
                                    )}
                                    color={getStatusColor(
                                        getFieldValue(
                                            selectedRecord,
                                            "status",
                                            "Status"
                                        )
                                    )}
                                    size="medium"
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* =====================================
                        PICKUP INFORMATION
                    ===================================== */}

                    <Box>
                        <SectionHeader
                            icon={
                                <CalendarMonth color="primary" />
                            }
                            title="Pickup Information"
                        />

                        <Grid container spacing={2.5}>
                            <DetailField
                                label="Reverse Pickup Number"
                                value={getFieldValue(
                                    selectedRecord,
                                    "reversePickupNumber",
                                    "ReversePickupNumber",
                                    "pickupNumber",
                                    "PickupNumber"
                                )}
                                icon={<AssignmentReturn fontSize="small" />}
                            />

                            <DetailField
                                label="Pickup ID"
                                value={getFieldValue(
                                    selectedRecord,
                                    "reversePickupId",
                                    "ReversePickupId",
                                    "pickupId",
                                    "PickupId",
                                    "id",
                                    "Id"
                                )}
                                icon={<Numbers fontSize="small" />}
                            />

                            <DetailField
                                label="Order Number"
                                value={getFieldValue(
                                    selectedRecord,
                                    "orderNumber",
                                    "OrderNumber"
                                )}
                                icon={<ReceiptLong fontSize="small" />}
                            />

                            <DetailField
                                label="Pickup Date"
                                value={formatDate(
                                    getFieldValue(
                                        selectedRecord,
                                        "pickupDate",
                                        "PickupDate"
                                    )
                                )}
                                icon={<CalendarMonth fontSize="small" />}
                            />

                            <DetailField
                                label="Status"
                                value={getFieldValue(
                                    selectedRecord,
                                    "status",
                                    "Status"
                                )}
                            />

                            <DetailField
                                label="Created At"
                                value={formatDateTime(
                                    getFieldValue(
                                        selectedRecord,
                                        "createdAt",
                                        "CreatedAt",
                                        "createdDate",
                                        "CreatedDate"
                                    )
                                )}
                            />

                            <DetailField
                                label="Pickup Address"
                                value={getFieldValue(
                                    selectedRecord,
                                    "pickupAddress",
                                    "PickupAddress"
                                )}
                                icon={<LocationOn fontSize="small" />}
                                fullWidth
                                multiline
                            />
                        </Grid>
                    </Box>

                    <Divider />

                    {/* =====================================
                        CUSTOMER INFORMATION
                    ===================================== */}

                    <Box>
                        <SectionHeader
                            icon={<Person color="primary" />}
                            title="Customer Information"
                        />

                        <Grid container spacing={2.5}>
                            <DetailField
                                label="Customer Name"
                                value={getFieldValue(
                                    selectedRecord,
                                    "customerName",
                                    "CustomerName"
                                )}
                                icon={<Person fontSize="small" />}
                            />

                            <DetailField
                                label="Customer Email"
                                value={getFieldValue(
                                    selectedRecord,
                                    "customerEmail",
                                    "CustomerEmail"
                                )}
                                icon={<Email fontSize="small" />}
                            />
                        </Grid>
                    </Box>

                    <Divider />

                    {/* =====================================
                        RETURN ITEM INFORMATION
                    ===================================== */}

                    <Box>
                        <SectionHeader
                            icon={<ShoppingBag color="primary" />}
                            title="Return Item Information"
                        />

                        <Grid container spacing={2.5}>
                            <DetailField
                                label="Item Name"
                                value={getFieldValue(
                                    selectedRecord,
                                    "itemName",
                                    "ItemName",
                                    "returnItemName",
                                    "ReturnItemName"
                                )}
                                icon={<ShoppingBag fontSize="small" />}
                            />

                            <DetailField
                                label="SKU"
                                value={getFieldValue(
                                    selectedRecord,
                                    "sku",
                                    "SKU",
                                    "Sku"
                                )}
                            />

                            <DetailField
                                label="Quantity"
                                value={getFieldValue(
                                    selectedRecord,
                                    "quantity",
                                    "Quantity"
                                )}
                                icon={<Numbers fontSize="small" />}
                            />

                            <DetailField
                                label="Pickup Cost"
                                value={formatCurrency(
                                    getFieldValue(
                                        selectedRecord,
                                        "pickupCost",
                                        "PickupCost"
                                    )
                                )}
                                icon={<Payments fontSize="small" />}
                            />
                        </Grid>
                    </Box>

                    <Divider />

                    {/* =====================================
                        CARRIER INFORMATION
                    ===================================== */}

                    <Box>
                        <SectionHeader
                            icon={<LocalShipping color="primary" />}
                            title="Carrier Information"
                        />

                        <Grid container spacing={2.5}>
                            <DetailField
                                label="Carrier Name"
                                value={getFieldValue(
                                    selectedRecord,
                                    "carrierName",
                                    "CarrierName"
                                )}
                                icon={<LocalShipping fontSize="small" />}
                            />

                            <DetailField
                                label="Tracking Number"
                                value={getFieldValue(
                                    selectedRecord,
                                    "trackingNumber",
                                    "TrackingNumber"
                                )}
                                icon={<ReceiptLong fontSize="small" />}
                            />
                        </Grid>
                    </Box>

                    {/* =====================================
                        NOTES
                    ===================================== */}

                    <Divider />

                    <Box>
                        <SectionHeader
                            icon={<Notes color="primary" />}
                            title="Additional Notes"
                        />

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                minHeight: 56
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{ whiteSpace: "pre-wrap" }}
                            >
                                {formatText(
                                    getFieldValue(
                                        selectedRecord,
                                        "notes",
                                        "Notes"
                                    ),
                                    "No additional notes."
                                )}
                            </Typography>
                        </Paper>
                    </Box>

                    {/* =====================================
                        AUDIT DETAILS
                    ===================================== */}

                    {showAuditDetails && (
                        <>
                            <Divider />

                            <Box>
                                <SectionHeader
                                    icon={<ReceiptLong color="primary" />}
                                    title="Audit Information"
                                />

                                <Grid container spacing={2.5}>
                                    <DetailField
                                        label="Created At"
                                        value={formatDateTime(
                                            getFieldValue(
                                                selectedRecord,
                                                "createdAt",
                                                "CreatedAt",
                                                "createdDate",
                                                "CreatedDate"
                                            )
                                        )}
                                    />

                                    <DetailField
                                        label="Updated At"
                                        value={formatDateTime(
                                            getFieldValue(
                                                selectedRecord,
                                                "updatedAt",
                                                "UpdatedAt",
                                                "modifiedAt",
                                                "ModifiedAt",
                                                "updatedDate",
                                                "UpdatedDate"
                                            )
                                        )}
                                    />

                                    <DetailField
                                        label="Created By"
                                        value={getFieldValue(
                                            selectedRecord,
                                            "createdBy",
                                            "CreatedBy"
                                        )}
                                    />

                                    <DetailField
                                        label="Updated By"
                                        value={getFieldValue(
                                            selectedRecord,
                                            "updatedBy",
                                            "UpdatedBy",
                                            "modifiedBy",
                                            "ModifiedBy"
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
            <Paper
                elevation={1}
                sx={{
                    p: {
                        xs: 2,
                        sm: 3
                    },
                    borderRadius: 2
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        mb: 3
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        {title}
                    </Typography>

                    {showEditButton &&
                        selectedRecord &&
                        typeof onEdit === "function" && (
                            <Button
                                variant="contained"
                                onClick={() => onEdit(selectedRecord)}
                            >
                                Edit
                            </Button>
                        )}
                </Box>

                {content}

                {showCloseButton && onClose && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 3
                        }}
                    >
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={onClose}
                        >
                            Back
                        </Button>
                    </Box>
                )}
            </Paper>
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
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
                    }}
                >
                    <AssignmentReturn color="primary" />

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        {title}
                    </Typography>
                </Box>

                {showCloseButton && (
                    <IconButton
                        onClick={onClose}
                        aria-label="Close details"
                    >
                        <Close />
                    </IconButton>
                )}
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ py: 3 }}>
                {content}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2 }}>
                {showEditButton &&
                    selectedRecord &&
                    typeof onEdit === "function" && (
                        <Button
                            variant="contained"
                            onClick={() => onEdit(selectedRecord)}
                        >
                            Edit Pickup
                        </Button>
                    )}

                {showCloseButton && (
                    <Button
                        variant="outlined"
                        startIcon={<Close />}
                        onClick={onClose}
                    >
                        Close
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ReversePickupDetails;

