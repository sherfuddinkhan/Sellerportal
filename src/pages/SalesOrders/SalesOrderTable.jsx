import React from "react";

import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    IconButton,
    Chip,
    Tooltip,
    Typography,
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

    const amount = Number(value || 0);

    return `₹ ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

};


// =========================================================
// DATE FORMATTER
// =========================================================

const formatDate = (value) => {

    if (!value) {

        return "-";

    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {

        return "-";

    }

    return date.toLocaleDateString("en-IN");

};


// =========================================================
// STATUS COLOR
// =========================================================

const getStatusColor = (status) => {

    switch (
        String(status || "").toLowerCase()
    ) {

        case "completed":
            return "success";

        case "pending":
            return "warning";

        case "processing":
            return "info";

        case "cancelled":
            return "error";

        default:
            return "default";

    }

};


// =========================================================
// SALES ORDER TABLE
// =========================================================

const SalesOrderTable = ({
    items = [],
    loading = false,
    onView,
    onEdit,
    onDelete
}) => {


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return null;

    }


    return (

        <TableContainer
            component={Paper}
            className="sales-order-table"
            sx={{
                width: "100%",
                overflowX: "auto"
            }}
        >

            <Table
                stickyHeader
                size="medium"
                sx={{
                    minWidth: 1100
                }}
            >

                {/* =================================================
                    TABLE HEADER
                ================================================== */}

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Order Number</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Seller</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Customer</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Order Date</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Total Amount</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Status</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Remarks</strong>
                        </TableCell>

                        <TableCell
                            align="center"
                            sx={{
                                minWidth: 140
                            }}
                        >
                            <strong>Actions</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>


                {/* =================================================
                    TABLE BODY
                ================================================== */}

                <TableBody>

                    {/* =============================================
                        NO RECORDS
                    ============================================== */}

                    {items.length === 0 ? (

                        <TableRow>

                            <TableCell
                                colSpan={9}
                                align="center"
                            >

                                <Box
                                    sx={{
                                        py: 4
                                    }}
                                >

                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                    >
                                        No Sales Orders Found
                                    </Typography>

                                </Box>

                            </TableCell>

                        </TableRow>

                    ) : (

                        /* =========================================
                           SALES ORDERS
                        ========================================== */

                        items.map((item) => (

                            <TableRow
                                hover
                                key={
                                    item.SalesOrderId
                                }
                            >

                                {/* =================================
                                    ID
                                ================================== */}

                                <TableCell>

                                    {item.SalesOrderId ?? "-"}

                                </TableCell>


                                {/* =================================
                                    ORDER NUMBER
                                ================================== */}

                                <TableCell>

                                    <Typography
                                        variant="body2"
                                        fontWeight={500}
                                    >

                                        {
                                            item.SalesOrderNumber ||
                                            "-"
                                        }

                                    </Typography>

                                </TableCell>


                                {/* =================================
                                    SELLER
                                ================================== */}

                                <TableCell>

                                    {item.SellerId ?? "-"}

                                </TableCell>


                                {/* =================================
                                    CUSTOMER
                                ================================== */}

                                <TableCell>

                                    {item.CustomerId ?? "-"}

                                </TableCell>


                                {/* =================================
                                    ORDER DATE
                                ================================== */}

                                <TableCell>

                                    {formatDate(
                                        item.OrderDate
                                    )}

                                </TableCell>


                                {/* =================================
                                    TOTAL AMOUNT
                                ================================== */}

                                <TableCell align="right">

                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                    >

                                        {
                                            formatCurrency(
                                                item.TotalAmount
                                            )
                                        }

                                    </Typography>

                                </TableCell>


                                {/* =================================
                                    STATUS
                                ================================== */}

                                <TableCell>

                                    <Chip
                                        label={
                                            item.Status ||
                                            "Unknown"
                                        }
                                        color={
                                            getStatusColor(
                                                item.Status
                                            )
                                        }
                                        size="small"
                                    />

                                </TableCell>


                                {/* =================================
                                    REMARKS
                                ================================== */}

                                <TableCell
                                    sx={{
                                        maxWidth: 250
                                    }}
                                >

                                    <Tooltip
                                        title={
                                            item.Remarks ||
                                            ""
                                        }
                                        disableHoverListener={
                                            !item.Remarks
                                        }
                                    >

                                        <Typography
                                            variant="body2"
                                            noWrap
                                            sx={{
                                                maxWidth: 230,
                                                overflow:
                                                    "hidden",
                                                textOverflow:
                                                    "ellipsis"
                                            }}
                                        >

                                            {
                                                item.Remarks ||
                                                "-"
                                            }

                                        </Typography>

                                    </Tooltip>

                                </TableCell>


                                {/* =================================
                                    ACTIONS
                                ================================== */}

                                <TableCell align="center">

                                    {/* VIEW */}

                                    <Tooltip title="View Sales Order">

                                        <IconButton
                                            color="primary"
                                            size="small"
                                            onClick={() =>
                                                onView?.(item)
                                            }
                                            aria-label={
                                                "View Sales Order"
                                            }
                                        >

                                            <Visibility />

                                        </IconButton>

                                    </Tooltip>


                                    {/* EDIT */}

                                    <Tooltip title="Edit Sales Order">

                                        <IconButton
                                            color="warning"
                                            size="small"
                                            onClick={() =>
                                                onEdit?.(item)
                                            }
                                            aria-label={
                                                "Edit Sales Order"
                                            }
                                        >

                                            <Edit />

                                        </IconButton>

                                    </Tooltip>


                                    {/* DELETE */}

                                    <Tooltip title="Delete Sales Order">

                                        <IconButton
                                            color="error"
                                            size="small"
                                            onClick={() =>
                                                onDelete?.(item)
                                            }
                                            aria-label={
                                                "Delete Sales Order"
                                            }
                                        >

                                            <Delete />

                                        </IconButton>

                                    </Tooltip>

                                </TableCell>

                            </TableRow>

                        ))

                    )}

                </TableBody>

            </Table>

        </TableContainer>

    );

};


export default SalesOrderTable;
