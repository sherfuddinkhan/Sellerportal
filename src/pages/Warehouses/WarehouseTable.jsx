// =========================================================
// WarehouseTable.jsx
// Warehouse Table Component
// =========================================================

import React from "react";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Tooltip,
    CircularProgress,
    Typography,
    Box
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

// =========================================================
// WAREHOUSE TABLE
// =========================================================

const WarehouseTable = ({
    warehouses = [],
    loading = false,
    onView,
    onEdit,
    onDelete
}) => {

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={5}
                mb={5}
            >
                <CircularProgress />
            </Box>
        );
    }

    // =========================================================
    // EMPTY STATE
    // =========================================================

    if (!warehouses || warehouses.length === 0) {
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
                    No Warehouses Found
                </Typography>
            </Paper>
        );
    }

    // =========================================================
    // TABLE
    // =========================================================

    return (
        <TableContainer
            component={Paper}
            sx={{
                borderRadius: 2,
                overflowX: "auto"
            }}
        >
            <Table
                stickyHeader
                sx={{
                    minWidth: 1000
                }}
            >

                {/* =================================================
                    TABLE HEADER
                ================================================= */}

                <TableHead>
                    <TableRow>

                        <TableCell>
                            ID
                        </TableCell>

                        <TableCell>
                            Code
                        </TableCell>

                        <TableCell>
                            Warehouse Name
                        </TableCell>

                        <TableCell>
                            City
                        </TableCell>

                        <TableCell>
                            State
                        </TableCell>

                        <TableCell>
                            Contact Person
                        </TableCell>

                        <TableCell>
                            Phone
                        </TableCell>

                        <TableCell>
                            Status
                        </TableCell>

                        <TableCell align="center">
                            Actions
                        </TableCell>

                    </TableRow>
                </TableHead>

                {/* =================================================
                    TABLE BODY
                ================================================= */}

                <TableBody>

                    {warehouses.map((row) => {

                        // -------------------------------------------------
                        // Support PascalCase + camelCase
                        // -------------------------------------------------

                        const warehouseId =
                            row.WarehouseId ??
                            row.warehouseId ??
                            0;

                        const warehouseCode =
                            row.WarehouseCode ??
                            row.warehouseCode ??
                            "-";

                        const warehouseName =
                            row.WarehouseName ??
                            row.warehouseName ??
                            "-";

                        const city =
                            row.City ??
                            row.city ??
                            "-";

                        const state =
                            row.State ??
                            row.state ??
                            "-";

                        const contactPerson =
                            row.ContactPerson ??
                            row.contactPerson ??
                            "-";

                        const phone =
                            row.Phone ??
                            row.phone ??
                            "-";

                        const isActive =
                            row.IsActive ??
                            row.isActive ??
                            false;

                        return (
                            <TableRow
                                key={warehouseId}
                                hover
                            >

                                {/* -----------------------------------------
                                    ID
                                ----------------------------------------- */}

                                <TableCell>
                                    {warehouseId}
                                </TableCell>

                                {/* -----------------------------------------
                                    CODE
                                ----------------------------------------- */}

                                <TableCell>
                                    {warehouseCode}
                                </TableCell>

                                {/* -----------------------------------------
                                    NAME
                                ----------------------------------------- */}

                                <TableCell>
                                    <Typography
                                        fontWeight={500}
                                    >
                                        {warehouseName}
                                    </Typography>
                                </TableCell>

                                {/* -----------------------------------------
                                    CITY
                                ----------------------------------------- */}

                                <TableCell>
                                    {city}
                                </TableCell>

                                {/* -----------------------------------------
                                    STATE
                                ----------------------------------------- */}

                                <TableCell>
                                    {state}
                                </TableCell>

                                {/* -----------------------------------------
                                    CONTACT PERSON
                                ----------------------------------------- */}

                                <TableCell>
                                    {contactPerson}
                                </TableCell>

                                {/* -----------------------------------------
                                    PHONE
                                ----------------------------------------- */}

                                <TableCell>
                                    {phone}
                                </TableCell>

                                {/* -----------------------------------------
                                    STATUS
                                ----------------------------------------- */}

                                <TableCell>
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
                                </TableCell>

                                {/* -----------------------------------------
                                    ACTIONS
                                ----------------------------------------- */}

                                <TableCell
                                    align="center"
                                >

                                    {/* VIEW */}

                                    <Tooltip title="View">
                                        <IconButton
                                            color="primary"
                                            onClick={() => {
                                                if (onView) {
                                                    onView(row);
                                                }
                                            }}
                                        >
                                            <Visibility />
                                        </IconButton>
                                    </Tooltip>

                                    {/* EDIT */}

                                    <Tooltip title="Edit">
                                        <IconButton
                                            color="warning"
                                            onClick={() => {
                                                if (onEdit) {
                                                    onEdit(row);
                                                }
                                            }}
                                        >
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>

                                    {/* DELETE */}

                                    <Tooltip title="Delete">
                                        <IconButton
                                            color="error"
                                            onClick={() => {
                                                if (onDelete) {
                                                    onDelete(row);
                                                }
                                            }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>

                                </TableCell>

                            </TableRow>
                        );
                    })}

                </TableBody>

            </Table>
        </TableContainer>
    );
};

export default WarehouseTable;