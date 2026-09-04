import React from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    Box
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

// =========================================================
// CURRENCY FORMATTER
// =========================================================

const formatCurrency = (value) => {

    return `₹ ${Number(value || 0).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    )}`;

};

// =========================================================
// NUMBER FORMATTER
// =========================================================

const formatNumber = (value) => {

    return Number(value || 0).toLocaleString(
        "en-IN"
    );

};

// =========================================================
// SALES ORDER ITEM TABLE
// =========================================================

const SalesOrderItemTable = ({
    items = [],
    loading = false,
    onView,
    onEdit,
    onDelete
}) => {

    // =====================================================
    // LOADING STATE
    // =====================================================

    if (loading) {

        return (

            <TableContainer
                component={Paper}
                className="sales-order-item-table"
            >

                <Table>

                    <TableBody>

                        <TableRow>

                            <TableCell
                                colSpan={11}
                                align="center"
                                sx={{
                                    py: 5
                                }}
                            >

                                <Typography
                                    color="text.secondary"
                                >
                                    Loading Sales Order Items...
                                </Typography>

                            </TableCell>

                        </TableRow>

                    </TableBody>

                </Table>

            </TableContainer>

        );

    }

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <TableContainer
            component={Paper}
            className="sales-order-item-table"
            sx={{
                width: "100%",
                overflowX: "auto"
            }}
        >

            <Table
                stickyHeader
                size="small"
            >

                {/* =========================================
                    TABLE HEADER
                ========================================= */}

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Sales Order</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Product</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Line</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Quantity</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Unit Price</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Discount</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Tax</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Total</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Remarks</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Actions</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                {/* =========================================
                    TABLE BODY
                ========================================= */}

                <TableBody>

                    {items.length === 0 ? (

                        <TableRow>

                            <TableCell
                                colSpan={11}
                                align="center"
                                sx={{
                                    py: 5
                                }}
                            >

                                <Typography
                                    color="text.secondary"
                                >

                                    No Sales Order Items Found

                                </Typography>

                            </TableCell>

                        </TableRow>

                    ) : (

                        items.map((item) => (

                            <TableRow
                                hover
                                key={
                                    item.SalesOrderItemId
                                }
                            >

                                {/* =================================
                                    ITEM ID
                                ================================= */}

                                <TableCell>

                                    {item.SalesOrderItemId}

                                </TableCell>

                                {/* =================================
                                    SALES ORDER
                                ================================= */}

                                <TableCell>

                                    <Chip
                                        size="small"
                                        label={
                                            item.SalesOrderId
                                        }
                                        color="primary"
                                        variant="outlined"
                                    />

                                </TableCell>

                                {/* =================================
                                    PRODUCT
                                ================================= */}

                                <TableCell>

                                    <Chip
                                        size="small"
                                        label={
                                            item.ProductId
                                        }
                                        variant="outlined"
                                    />

                                </TableCell>

                                {/* =================================
                                    LINE NUMBER
                                ================================= */}

                                <TableCell align="center">

                                    {formatNumber(
                                        item.LineNumber
                                    )}

                                </TableCell>

                                {/* =================================
                                    QUANTITY
                                ================================= */}

                                <TableCell align="right">

                                    {formatNumber(
                                        item.Quantity
                                    )}

                                </TableCell>

                                {/* =================================
                                    UNIT PRICE
                                ================================= */}

                                <TableCell align="right">

                                    {formatCurrency(
                                        item.UnitPrice
                                    )}

                                </TableCell>

                                {/* =================================
                                    DISCOUNT
                                ================================= */}

                                <TableCell align="right">

                                    {formatCurrency(
                                        item.DiscountAmount
                                    )}

                                </TableCell>

                                {/* =================================
                                    TAX
                                ================================= */}

                                <TableCell align="right">

                                    {formatCurrency(
                                        item.TaxAmount
                                    )}

                                </TableCell>

                                {/* =================================
                                    TOTAL
                                ================================= */}

                                <TableCell
                                    align="right"
                                    sx={{
                                        fontWeight: 600
                                    }}
                                >

                                    {formatCurrency(
                                        item.TotalAmount
                                    )}

                                </TableCell>

                                {/* =================================
                                    REMARKS
                                ================================= */}

                                <TableCell>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            maxWidth: 220,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        }}
                                        title={
                                            item.Remarks || ""
                                        }
                                    >

                                        {item.Remarks || "-"}

                                    </Typography>

                                </TableCell>

                                {/* =================================
                                    ACTIONS
                                ================================= */}

                                <TableCell align="center">

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent:
                                                "center",
                                            alignItems: "center"
                                        }}
                                    >

                                        {/* VIEW */}

                                        <Tooltip title="View">

                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={() =>
                                                    onView &&
                                                    onView(item)
                                                }
                                            >

                                                <Visibility />

                                            </IconButton>

                                        </Tooltip>

                                        {/* EDIT */}

                                        <Tooltip title="Edit">

                                            <IconButton
                                                color="warning"
                                                size="small"
                                                onClick={() =>
                                                    onEdit &&
                                                    onEdit(item)
                                                }
                                            >

                                                <Edit />

                                            </IconButton>

                                        </Tooltip>

                                        {/* DELETE */}

                                        <Tooltip title="Delete">

                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() =>
                                                    onDelete &&
                                                    onDelete(item)
                                                }
                                            >

                                                <Delete />

                                            </IconButton>

                                        </Tooltip>

                                    </Box>

                                </TableCell>

                            </TableRow>

                        ))

                    )}

                </TableBody>

            </Table>

        </TableContainer>

    );

};

export default SalesOrderItemTable;
