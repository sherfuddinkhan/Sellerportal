// =========================================================
// WarehouseCard.jsx
// Warehouse Card Component
// =========================================================

import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    Stack,
    Divider,
    IconButton,
    Tooltip,
    Box
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    Warehouse
} from "@mui/icons-material";

// =========================================================
// WAREHOUSE CARD
// =========================================================

const WarehouseCard = ({
    warehouse,
    onView,
    onEdit,
    onDelete
}) => {

    // ---------------------------------------------------------
    // No warehouse
    // ---------------------------------------------------------

    if (!warehouse) {
        return null;
    }

    // ---------------------------------------------------------
    // Support PascalCase + camelCase
    // ---------------------------------------------------------

    const warehouseId =
        warehouse.WarehouseId ??
        warehouse.warehouseId ??
        0;

    const warehouseName =
        warehouse.WarehouseName ??
        warehouse.warehouseName ??
        "-";

    const warehouseCode =
        warehouse.WarehouseCode ??
        warehouse.warehouseCode ??
        "-";

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

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Card
            elevation={3}
            sx={{
                height: "100%",
                borderRadius: 2,
                transition: "0.3s",

                "&:hover": {
                    boxShadow: 8,
                    transform: "translateY(-4px)"
                }
            }}
        >

            {/* =================================================
                CARD CONTENT
            ================================================= */}

            <CardContent>

                {/* ------------------------------------------------
                    HEADER
                ------------------------------------------------ */}

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >

                    <Warehouse color="primary" />

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
                        size="small"
                    />

                </Stack>

                {/* ------------------------------------------------
                    WAREHOUSE NAME
                ------------------------------------------------ */}

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                >
                    {warehouseName}
                </Typography>

                {/* ------------------------------------------------
                    WAREHOUSE ID
                ------------------------------------------------ */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                >
                    <strong>ID:</strong>{" "}
                    {warehouseId || "-"}
                </Typography>

                {/* ------------------------------------------------
                    WAREHOUSE CODE
                ------------------------------------------------ */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                >
                    <strong>Code:</strong>{" "}
                    {warehouseCode}
                </Typography>

                {/* ------------------------------------------------
                    CITY
                ------------------------------------------------ */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                >
                    <strong>City:</strong>{" "}
                    {city}
                </Typography>

                {/* ------------------------------------------------
                    STATE
                ------------------------------------------------ */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                >
                    <strong>State:</strong>{" "}
                    {state}
                </Typography>

                {/* ------------------------------------------------
                    COUNTRY
                ------------------------------------------------ */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                >
                    <strong>Country:</strong>{" "}
                    {country}
                </Typography>

                {/* ------------------------------------------------
                    CONTACT PERSON
                ------------------------------------------------ */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                >
                    <strong>Contact:</strong>{" "}
                    {contactPerson}
                </Typography>

                {/* ------------------------------------------------
                    PHONE
                ------------------------------------------------ */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                >
                    <strong>Phone:</strong>{" "}
                    {phone}
                </Typography>

                {/* ------------------------------------------------
                    EMAIL
                ------------------------------------------------ */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    title={email}
                >
                    <strong>Email:</strong>{" "}
                    {email}
                </Typography>

            </CardContent>

            <Divider />

            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <CardActions
                sx={{
                    justifyContent: "flex-end"
                }}
            >

                {/* ------------------------------------------------
                    VIEW
                ------------------------------------------------ */}

                <Tooltip title="View">
                    <IconButton
                        color="primary"
                        onClick={() => {
                            if (onView) {
                                onView(warehouse);
                            }
                        }}
                    >
                        <Visibility />
                    </IconButton>
                </Tooltip>

                {/* ------------------------------------------------
                    EDIT
                ------------------------------------------------ */}

                <Tooltip title="Edit">
                    <IconButton
                        color="warning"
                        onClick={() => {
                            if (onEdit) {
                                onEdit(warehouse);
                            }
                        }}
                    >
                        <Edit />
                    </IconButton>
                </Tooltip>

                {/* ------------------------------------------------
                    DELETE
                ------------------------------------------------ */}

                <Tooltip title="Delete">
                    <IconButton
                        color="error"
                        onClick={() => {
                            if (onDelete) {
                                onDelete(warehouse);
                            }
                        }}
                    >
                        <Delete />
                    </IconButton>
                </Tooltip>

            </CardActions>

        </Card>
    );
};

export default WarehouseCard;