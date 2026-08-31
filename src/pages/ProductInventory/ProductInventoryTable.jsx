// =========================================================
// ProductInventoryTable.jsx
// Product Inventory Table
// Frontend Only
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
// COMPONENT
// =========================================================

const ProductInventoryTable = ({

    inventories = [],

    loading = false,

    onView,

    onEdit,

    onDelete

}) => {


    // =====================================================
    // LOADING
    // =====================================================

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


    // =====================================================
    // EMPTY
    // =====================================================

    if (!inventories.length) {

        return (

            <Paper
                sx={{
                    p: 4
                }}
            >

                <Typography
                    align="center"
                    color="text.secondary"
                >

                    No Inventory Records Found

                </Typography>

            </Paper>

        );

    }


    // =====================================================
    // HELPERS
    // =====================================================

    const getInventoryId = (row) => {

        return (
            row.productInventoryId ??
            row.ProductInventoryId ??
            "-"
        );

    };


    const getProductId = (row) => {

        return (
            row.productId ??
            row.ProductId ??
            "-"
        );

    };


    const getSellerId = (row) => {

        return (
            row.sellerId ??
            row.SellerId ??
            "-"
        );

    };


    const getWarehouseId = (row) => {

        return (
            row.warehouseId ??
            row.WarehouseId ??
            "-"
        );

    };


    const getQuantity = (row) => {

        return (
            row.quantity ??
            row.Quantity ??
            0
        );

    };


    const getAvailableQuantity = (row) => {

        return (
            row.availableQuantity ??
            row.AvailableQuantity ??
            0
        );

    };


    const getReservedQuantity = (row) => {

        return (
            row.reservedQuantity ??
            row.ReservedQuantity ??
            0
        );

    };


    const getStockStatus = (row) => {

        return (
            row.stockStatus ??
            row.StockStatus ??
            ""
        );

    };


    const getIsActive = (row) => {

        return (
            row.isActive ??
            row.IsActive ??
            false
        );

    };


    // =====================================================
    // STOCK STATUS COLOR
    // =====================================================

    const getStockStatusColor = (status) => {

        switch (
            String(status)
                .trim()
                .toLowerCase()
        ) {

            case "available":

                return "success";


            case "low stock":

                return "warning";


            case "out of stock":

                return "error";


            case "out":

                return "error";


            default:

                return "default";

        }

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <TableContainer
            component={Paper}
            sx={{
                overflowX: "auto"
            }}
        >

            <Table
                stickyHeader
                size="small"
            >

                {/* =========================================
                    HEADER
                ========================================= */}

                <TableHead>

                    <TableRow>

                        <TableCell>
                            Inventory ID
                        </TableCell>

                        <TableCell>
                            Product ID
                        </TableCell>

                        <TableCell>
                            Seller ID
                        </TableCell>

                        <TableCell>
                            Warehouse ID
                        </TableCell>

                        <TableCell align="right">
                            Quantity
                        </TableCell>

                        <TableCell align="right">
                            Available
                        </TableCell>

                        <TableCell align="right">
                            Reserved
                        </TableCell>

                        <TableCell>
                            Stock Status
                        </TableCell>

                        <TableCell>
                            Active
                        </TableCell>

                        <TableCell align="center">
                            Actions
                        </TableCell>

                    </TableRow>

                </TableHead>


                {/* =========================================
                    BODY
                ========================================= */}

                <TableBody>

                    {inventories.map((row) => {

                        const inventoryId =
                            getInventoryId(row);

                        const productId =
                            getProductId(row);

                        const sellerId =
                            getSellerId(row);

                        const warehouseId =
                            getWarehouseId(row);

                        const quantity =
                            getQuantity(row);

                        const availableQuantity =
                            getAvailableQuantity(row);

                        const reservedQuantity =
                            getReservedQuantity(row);

                        const stockStatus =
                            getStockStatus(row);

                        const isActive =
                            getIsActive(row);


                        return (

                            <TableRow
                                key={inventoryId}
                                hover
                            >

                                {/* =================================
                                    INVENTORY ID
                                ================================= */}

                                <TableCell>

                                    {inventoryId}

                                </TableCell>


                                {/* =================================
                                    PRODUCT ID
                                ================================= */}

                                <TableCell>

                                    {productId}

                                </TableCell>


                                {/* =================================
                                    SELLER ID
                                ================================= */}

                                <TableCell>

                                    {sellerId}

                                </TableCell>


                                {/* =================================
                                    WAREHOUSE ID
                                ================================= */}

                                <TableCell>

                                    {warehouseId}

                                </TableCell>


                                {/* =================================
                                    QUANTITY
                                ================================= */}

                                <TableCell align="right">

                                    {quantity}

                                </TableCell>


                                {/* =================================
                                    AVAILABLE
                                ================================= */}

                                <TableCell align="right">

                                    {availableQuantity}

                                </TableCell>


                                {/* =================================
                                    RESERVED
                                ================================= */}

                                <TableCell align="right">

                                    {reservedQuantity}

                                </TableCell>


                                {/* =================================
                                    STOCK STATUS
                                ================================= */}

                                <TableCell>

                                    <Chip

                                        label={
                                            stockStatus ||
                                            "-"
                                        }

                                        color={
                                            getStockStatusColor(
                                                stockStatus
                                            )
                                        }

                                        size="small"

                                    />

                                </TableCell>


                                {/* =================================
                                    ACTIVE
                                ================================= */}

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


                                {/* =================================
                                    ACTIONS
                                ================================= */}

                                <TableCell align="center">

                                    {/* VIEW */}

                                    <Tooltip
                                        title="View"
                                    >

                                        <IconButton

                                            color="primary"

                                            size="small"

                                            onClick={() =>
                                                onView?.(row)
                                            }

                                        >

                                            <Visibility />

                                        </IconButton>

                                    </Tooltip>


                                    {/* EDIT */}

                                    <Tooltip
                                        title="Edit"
                                    >

                                        <IconButton

                                            color="warning"

                                            size="small"

                                            onClick={() =>
                                                onEdit?.(row)
                                            }

                                        >

                                            <Edit />

                                        </IconButton>

                                    </Tooltip>


                                    {/* DELETE */}

                                    <Tooltip
                                        title="Delete"
                                    >

                                        <IconButton

                                            color="error"

                                            size="small"

                                            onClick={() =>
                                                onDelete?.(row)
                                            }

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


// =========================================================
// EXPORT
// =========================================================

export default ProductInventoryTable;
