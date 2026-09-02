// =========================================================
// WarehouseDetails.jsx
// Warehouse Details Component
// =========================================================

import React from "react";

import {
    Paper,
    Box,
    Typography,
    Grid,
    Divider,
    Chip
} from "@mui/material";

import {
    Warehouse,
    Person,
    LocationOn,
    Phone,
    Email,
    Inventory
} from "@mui/icons-material";

// =========================================================
// WAREHOUSE DETAILS
// =========================================================

const WarehouseDetails = ({
    warehouse
}) => {

    // ---------------------------------------------------------
    // No warehouse selected
    // ---------------------------------------------------------

    if (!warehouse) {
        return (
            <Paper
                sx={{
                    p: 4,
                    borderRadius: 2
                }}
            >
                <Typography
                    align="center"
                    color="text.secondary"
                >
                    No Warehouse Details Available
                </Typography>
            </Paper>
        );
    }

    // ---------------------------------------------------------
    // Support PascalCase + camelCase
    // ---------------------------------------------------------

    const warehouseId =
        warehouse.WarehouseId ??
        warehouse.warehouseId ??
        "-";

    const sellerId =
        warehouse.SellerId ??
        warehouse.sellerId ??
        "-";

    const customerId =
        warehouse.CustomerId ??
        warehouse.customerId ??
        "-";

    const warehouseCode =
        warehouse.WarehouseCode ??
        warehouse.warehouseCode ??
        "-";

    const warehouseName =
        warehouse.WarehouseName ??
        warehouse.warehouseName ??
        "-";

    const addressLine1 =
        warehouse.AddressLine1 ??
        warehouse.addressLine1 ??
        "-";

    const addressLine2 =
        warehouse.AddressLine2 ??
        warehouse.addressLine2 ??
        "";

    const city =
        warehouse.City ??
        warehouse.city ??
        "-";

    const state =
        warehouse.State ??
        warehouse.state ??
        "-";

    const country =
        warehouse.Country ??
        warehouse.country ??
        "-";

    const postalCode =
        warehouse.PostalCode ??
        warehouse.postalCode ??
        "-";

    const contactPerson =
        warehouse.ContactPerson ??
        warehouse.contactPerson ??
        "-";

    const phone =
        warehouse.Phone ??
        warehouse.phone ??
        "-";

    const email =
        warehouse.Email ??
        warehouse.email ??
        "-";

    const isActive =
        warehouse.IsActive ??
        warehouse.isActive ??
        false;

    const createdDate =
        warehouse.CreatedDate ??
        warehouse.createdDate ??
        null;

    const updatedDate =
        warehouse.UpdatedDate ??
        warehouse.updatedDate ??
        null;

    // ---------------------------------------------------------
    // Date formatter
    // ---------------------------------------------------------

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleString();
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                borderRadius: 2
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >

                <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                >

                    <Warehouse color="primary" />

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        Warehouse Details
                    </Typography>

                </Box>

                <Chip
                    label={
                        isActive
                            ? "Active"
                            : "Inactive"
                    }
                    color={
                        isActive
                            ? "success"
                            : "error"
                    }
                />

            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 2 }}
            >
                Basic Information
            </Typography>

            <Grid
                container
                spacing={2}
            >

                <Grid item xs={12} md={4}>
                    <DetailItem
                        label="Warehouse ID"
                        value={warehouseId}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <DetailItem
                        label="Seller ID"
                        value={sellerId}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <DetailItem
                        label="Customer ID"
                        value={customerId}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <DetailItem
                        label="Warehouse Code"
                        value={warehouseCode}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <DetailItem
                        label="Warehouse Name"
                        value={warehouseName}
                    />
                </Grid>

            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* =================================================
                LOCATION
            ================================================= */}

            <Box
                display="flex"
                alignItems="center"
                gap={1}
                mb={2}
            >
                <LocationOn color="primary" />

                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    Location
                </Typography>
            </Box>

            <Grid
                container
                spacing={2}
            >

                <Grid item xs={12}>
                    <DetailItem
                        label="Address Line 1"
                        value={addressLine1}
                    />
                </Grid>

                {addressLine2 && (
                    <Grid item xs={12}>
                        <DetailItem
                            label="Address Line 2"
                            value={addressLine2}
                        />
                    </Grid>
                )}

                <Grid item xs={12} sm={6} md={3}>
                    <DetailItem
                        label="City"
                        value={city}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <DetailItem
                        label="State"
                        value={state}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <DetailItem
                        label="Country"
                        value={country}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <DetailItem
                        label="Postal Code"
                        value={postalCode}
                    />
                </Grid>

            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* =================================================
                CONTACT INFORMATION
            ================================================= */}

            <Box
                display="flex"
                alignItems="center"
                gap={1}
                mb={2}
            >
                <Person color="primary" />

                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    Contact Information
                </Typography>
            </Box>

            <Grid
                container
                spacing={2}
            >

                <Grid item xs={12} md={4}>
                    <DetailItem
                        label="Contact Person"
                        value={contactPerson}
                        icon={<Person fontSize="small" />}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <DetailItem
                        label="Phone"
                        value={phone}
                        icon={<Phone fontSize="small" />}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <DetailItem
                        label="Email"
                        value={email}
                        icon={<Email fontSize="small" />}
                    />
                </Grid>

            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* =================================================
                SYSTEM INFORMATION
            ================================================= */}

            <Box
                display="flex"
                alignItems="center"
                gap={1}
                mb={2}
            >
                <Inventory color="primary" />

                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    System Information
                </Typography>
            </Box>

            <Grid
                container
                spacing={2}
            >

                <Grid item xs={12} md={6}>
                    <DetailItem
                        label="Created Date"
                        value={formatDate(createdDate)}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <DetailItem
                        label="Updated Date"
                        value={formatDate(updatedDate)}
                    />
                </Grid>

            </Grid>

        </Paper>
    );
};

// =========================================================
// DETAIL ITEM
// =========================================================

const DetailItem = ({
    label,
    value,
    icon
}) => {

    return (
        <Box
            sx={{
                p: 1.5,
                borderRadius: 1,
                backgroundColor: "grey.50",
                border: "1px solid",
                borderColor: "grey.200"
            }}
        >

            <Box
                display="flex"
                alignItems="center"
                gap={0.5}
                sx={{ mb: 0.5 }}
            >

                {icon}

                <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="bold"
                >
                    {label}
                </Typography>

            </Box>

            <Typography
                variant="body1"
                sx={{
                    wordBreak: "break-word"
                }}
            >
                {value || "-"}
            </Typography>

        </Box>
    );
};

export default WarehouseDetails;