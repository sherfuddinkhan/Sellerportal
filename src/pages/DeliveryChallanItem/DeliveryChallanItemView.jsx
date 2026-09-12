// ============================================================
// DeliveryChallanView.jsx
// Delivery Challan View Modal
//
// Architecture:
// List -> selected row -> View Modal
//
// IMPORTANT:
// This component DOES NOT fetch data.
// It receives deliveryChallan from the List.
// ============================================================

import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Typography,
    Button,
    Divider,
    Chip,
    Box,
    Stack
} from "@mui/material";

import {
    ReceiptLong,
    LocalShipping,
    Person,
    CalendarToday,
    Notes
} from "@mui/icons-material";

// ============================================================
// COMPONENT
// ============================================================

const DeliveryChallanView = ({
    open,
    onClose,
    deliveryChallan
}) => {

    // ========================================================
    // NO DATA
    // ========================================================

    if (!deliveryChallan) {
        return null;
    }

    // ========================================================
    // SUPPORT camelCase + PascalCase
    //
    // This makes View safe even if the List response contains
    // PascalCase while Details uses camelCase.
    // ========================================================

    const getValue = (
        camelCase,
        pascalCase,
        defaultValue = null
    ) => {

        return (
            deliveryChallan?.[camelCase] ??
            deliveryChallan?.[pascalCase] ??
            defaultValue
        );

    };

    // ========================================================
    // BASIC VALUES
    // ========================================================

    const deliveryChallanId = getValue(
        "deliveryChallanId",
        "DeliveryChallanId",
        0
    );

    const salesOrderId = getValue(
        "salesOrderId",
        "SalesOrderId",
        0
    );

    const sellerId = getValue(
        "sellerId",
        "SellerId",
        0
    );

    const customerId = getValue(
        "customerId",
        "CustomerId",
        null
    );

    const challanNumber = getValue(
        "challanNumber",
        "ChallanNumber",
        ""
    );

    const challanDate = getValue(
        "challanDate",
        "ChallanDate",
        null
    );

    const status = getValue(
        "status",
        "Status",
        ""
    );

    const createdDate = getValue(
        "createdDate",
        "CreatedDate",
        null
    );

    const vehicleNumber = getValue(
        "vehicleNumber",
        "VehicleNumber",
        ""
    );

    const driverName = getValue(
        "driverName",
        "DriverName",
        ""
    );

    const driverMobile = getValue(
        "driverMobile",
        "DriverMobile",
        ""
    );

    const transporterName = getValue(
        "transporterName",
        "TransporterName",
        ""
    );

    const remarks = getValue(
        "remarks",
        "Remarks",
        ""
    );

    // ========================================================
    // STATUS COLOR
    // ========================================================

    const getStatusColor = (value) => {

        switch (
            String(value || "")
                .trim()
                .toLowerCase()
        ) {

            case "delivered":
                return "success";

            case "pending":
                return "warning";

            case "in transit":
                return "info";

            case "dispatched":
                return "info";

            case "cancelled":
                return "error";

            default:
                return "default";
        }

    };

    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate = (
        value,
        includeTime = false
    ) => {

        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        if (includeTime) {

            return date.toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

    };

    // ========================================================
    // INFO FIELD
    // ========================================================

    const InfoField = ({
        icon,
        label,
        value,
        color
    }) => {

        return (

            <Box>

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 0.5 }}
                >

                    {icon}

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {label}
                    </Typography>

                </Stack>

                <Typography
                    variant="body1"
                    fontWeight={600}
                    color={color}
                    sx={{
                        wordBreak: "break-word"
                    }}
                >
                    {value ?? "-"}

                </Typography>

            </Box>

        );

    };

    // ========================================================
    // RENDER
    // ========================================================

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle>

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                >

                    <ReceiptLong color="primary" />

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Delivery Challan Details
                    </Typography>

                </Stack>

            </DialogTitle>

            <DialogContent dividers>

                {/* =================================================
                    GENERAL INFORMATION
                ================================================= */}

                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ mb: 2 }}
                >
                    General Information
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid
                    container
                    spacing={3}
                >

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <InfoField
                            icon={
                                <ReceiptLong
                                    fontSize="small"
                                    color="primary"
                                />
                            }
                            label="Delivery Challan ID"
                            value={deliveryChallanId}
                        />

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <InfoField
                            icon={
                                <ReceiptLong
                                    fontSize="small"
                                    color="primary"
                                />
                            }
                            label="Sales Order ID"
                            value={salesOrderId}
                        />

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <InfoField
                            icon={
                                <ReceiptLong
                                    fontSize="small"
                                    color="primary"
                                />
                            }
                            label="Seller ID"
                            value={sellerId}
                        />

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <InfoField
                            icon={
                                <Person
                                    fontSize="small"
                                    color="primary"
                                />
                            }
                            label="Customer ID"
                            value={customerId ?? "-"}
                        />

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <InfoField
                            icon={
                                <ReceiptLong
                                    fontSize="small"
                                    color="primary"
                                />
                            }
                            label="Challan Number"
                            value={
                                challanNumber || "-"
                            }
                        />

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <InfoField
                            icon={
                                <CalendarToday
                                    fontSize="small"
                                    color="primary"
                                />
                            }
                            label="Challan Date"
                            value={
                                formatDate(
                                    challanDate
                                )
                            }
                        />

                    </Grid>

                </Grid>

                {/* =================================================
                    TRANSPORT DETAILS
                ================================================= */}

                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                        mt: 4,
                        mb: 2
                    }}
                >
                    Transport Details
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid
                    container
                    spacing={3}
                >

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <InfoField
                            icon={
                                <LocalShipping
                                    fontSize="small"
                                    color="primary"
                                />
                            }
                            label="Vehicle Number"
                            value={
                                vehicleNumber || "-"
                            }
                        />

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <InfoField
                            icon={
                                <Person
                                    fontSize="small"
                                    color="primary"
                                />
                            }
                            label="Driver Name"
                            value={
                                driverName || "-"
                            }
                        />

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <InfoField
                            icon={
                                <Person
                                    fontSize="small"
                                    color="primary"
                                />
                            }
                            label="Driver Mobile"
                            value={
                                driverMobile || "-"
                            }
                        />

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <InfoField
                            icon={
                                <LocalShipping
                                    fontSize="small"
                                    color="primary"
                                />
                            }
                            label="Transporter Name"
                            value={
                                transporterName || "-"
                            }
                        />

                    </Grid>

                </Grid>

                {/* =================================================
                    STATUS
                ================================================= */}

                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                        mt: 4,
                        mb: 2
                    }}
                >
                    Status
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid
                    container
                    spacing={3}
                >

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                        >
                            Current Status
                        </Typography>

                        <Chip
                            label={
                                status || "N/A"
                            }
                            color={
                                getStatusColor(status)
                            }
                            size="small"
                        />

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <InfoField
                            icon={
                                <CalendarToday
                                    fontSize="small"
                                    color="primary"
                                />
                            }
                            label="Created Date"
                            value={
                                formatDate(
                                    createdDate,
                                    true
                                )
                            }
                        />

                    </Grid>

                </Grid>

                {/* =================================================
                    REMARKS
                ================================================= */}

                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                        mt: 4,
                        mb: 2
                    }}
                >
                    Remarks
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Box
                    sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        p: 2,
                        minHeight: 70
                    }}
                >

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                    >

                        <Notes
                            fontSize="small"
                            color="primary"
                        />

                        <Typography>
                            {
                                remarks ||
                                "No remarks available."
                            }
                        </Typography>

                    </Stack>

                </Box>

            </DialogContent>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions>

                <Button
                    variant="contained"
                    onClick={onClose}
                >
                    Close
                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default DeliveryChallanView;
