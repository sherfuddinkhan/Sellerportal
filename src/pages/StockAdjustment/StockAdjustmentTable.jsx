// =========================================================
// StockAdjustmentTable.jsx
// Stock Adjustment Table
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
    Tooltip,
    Chip,
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

const StockAdjustmentTable = ({
    adjustments = [],
    loading = false,
    onView,
    onEdit,
    onDelete
}) => {

    // =========================================================
    // GET VALUE
    // =========================================================

    const getValue = (item, camelCase, pascalCase) => {

        return (
            item?.[camelCase] ??
            item?.[pascalCase] ??
            ""
        );
    };

    // =========================================================
    // DATE FORMAT
    // =========================================================

    const formatDate = (value) => {

        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    // =========================================================
    // ADJUSTMENT TYPE COLOR
    // =========================================================

    const getAdjustmentColor = (type) => {

        const normalizedType =
            String(type || "").toLowerCase();

        switch (normalizedType) {

            case "damage":
            case "loss":
            case "expired":
                return "error";

            case "found":
            case "return":
                return "success";

            case "correction":
                return "warning";

            default:
                return "default";
        }
    };

    // =========================================================
    // EMPTY STATE
    // =========================================================

    if (!loading && adjustments.length === 0) {

        return (
            <Paper
                elevation={1}
                sx={{
                    width: "100%",
                    overflow: "hidden"
                }}
            >
                <Box
                    sx={{
                        py: 6,
                        px: 2,
                        textAlign: "center"
                    }}
                >

                    <Typography
                        variant="h6"
                        color="text.secondary"
                    >
                        No Stock Adjustments Found
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 1
                        }}
                    >
                        There are no stock adjustment records
                        available.
                    </Typography>

                </Box>
            </Paper>
        );
    }

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <TableContainer
            component={Paper}
            elevation={1}
            sx={{
                width: "100%",
                overflowX: "auto"
            }}
        >

            <Table
                stickyHeader
                size="small"
            >

                {/* =================================================
                    TABLE HEAD
                ================================================= */}

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Seller</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Customer</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Product</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Warehouse</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Adjustment Type</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Quantity</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Adjustment Date</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Remarks</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Actions</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>


                {/* =================================================
                    TABLE BODY
                ================================================= */}

                <TableBody>

                    {adjustments.map((item, index) => {

                        const id = getValue(
                            item,
                            "stockAdjustmentId",
                            "StockAdjustmentId"
                        );

                        const sellerId = getValue(
                            item,
                            "sellerId",
                            "SellerId"
                        );

                        const customerId = getValue(
                            item,
                            "customerId",
                            "CustomerId"
                        );

                        const productId = getValue(
                            item,
                            "productId",
                            "ProductId"
                        );

                        const warehouseId = getValue(
                            item,
                            "warehouseId",
                            "WarehouseId"
                        );

                        const adjustmentType = getValue(
                            item,
                            "adjustmentType",
                            "AdjustmentType"
                        );

                        const quantity = getValue(
                            item,
                            "quantity",
                            "Quantity"
                        );

                        const adjustmentDate =
                            item?.adjustmentDate ??
                            item?.AdjustmentDate ??
                            item?.date ??
                            item?.Date ??
                            item?.createdDate ??
                            item?.CreatedDate;

                        const remarks = getValue(
                            item,
                            "remarks",
                            "Remarks"
                        );

                        return (
                            <TableRow
                                key={
                                    id ||
                                    `stock-adjustment-${index}`
                                }
                                hover
                            >

                                {/* =================================================
                                    ID
                                ================================================= */}

                                <TableCell>
                                    {id || "-"}
                                </TableCell>


                                {/* =================================================
                                    SELLER
                                ================================================= */}

                                <TableCell>
                                    {sellerId || "-"}
                                </TableCell>


                                {/* =================================================
                                    CUSTOMER
                                ================================================= */}

                                <TableCell>
                                    {customerId || "-"}
                                </TableCell>


                                {/* =================================================
                                    PRODUCT
                                ================================================= */}

                                <TableCell>
                                    {productId || "-"}
                                </TableCell>


                                {/* =================================================
                                    WAREHOUSE
                                ================================================= */}

                                <TableCell>
                                    {warehouseId || "-"}
                                </TableCell>


                                {/* =================================================
                                    ADJUSTMENT TYPE
                                ================================================= */}

                                <TableCell>

                                    <Chip
                                        label={
                                            adjustmentType ||
                                            "Other"
                                        }
                                        color={getAdjustmentColor(
                                            adjustmentType
                                        )}
                                        size="small"
                                        variant="outlined"
                                    />

                                </TableCell>


                                {/* =================================================
                                    QUANTITY
                                ================================================= */}

                                <TableCell align="right">

                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                    >
                                        {quantity ?? 0}
                                    </Typography>

                                </TableCell>


                                {/* =================================================
                                    DATE
                                ================================================= */}

                                <TableCell>
                                    {formatDate(
                                        adjustmentDate
                                    )}
                                </TableCell>


                                {/* =================================================
                                    REMARKS
                                ================================================= */}

                                <TableCell
                                    sx={{
                                        maxWidth: 220
                                    }}
                                >

                                    <Typography
                                        variant="body2"
                                        noWrap
                                        title={
                                            remarks || ""
                                        }
                                    >
                                        {remarks || "-"}
                                    </Typography>

                                </TableCell>


                                {/* =================================================
                                    ACTIONS
                                ================================================= */}

                                <TableCell align="center">

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 0.5
                                        }}
                                    >

                                        {/* VIEW */}

                                        <Tooltip title="View">

                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => {

                                                    if (onView) {
                                                        onView(item);
                                                    }

                                                }}
                                            >
                                                <Visibility fontSize="small" />
                                            </IconButton>

                                        </Tooltip>


                                        {/* EDIT */}

                                        <Tooltip title="Edit">

                                            <IconButton
                                                size="small"
                                                color="warning"
                                                onClick={() => {

                                                    if (onEdit) {
                                                        onEdit(item);
                                                    }

                                                }}
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>

                                        </Tooltip>


                                        {/* DELETE */}

                                        <Tooltip title="Delete">

                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {

                                                    if (onDelete) {
                                                        onDelete(item);
                                                    }

                                                }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>

                                        </Tooltip>

                                    </Box>

                                </TableCell>

                            </TableRow>
                        );

                    })}

                </TableBody>

            </Table>

        </TableContainer>
    );
};

export default StockAdjustmentTable;