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
    Typography
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

const formatCurrency = (value) =>
    `₹ ${Number(value || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

const formatDate = (value) =>
    value
        ? new Date(value).toLocaleDateString()
        : "-";

const getStatusColor = (status) => {

    switch ((status || "").toLowerCase()) {

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

const SalesOrderTable = ({

    items = [],

    loading,

    onView,

    onEdit,

    onDelete

}) => {

    if (loading) {

        return null;

    }

    return (

        <TableContainer
            component={Paper}
            className="sales-order-table"
        >

            <Table>

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

                        <TableCell align="center">

                            <strong>Actions</strong>

                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {

                        items.length === 0 ? (

                            <TableRow>

                                <TableCell
                                    colSpan={9}
                                    align="center"
                                >

                                    <Typography
                                        color="text.secondary"
                                    >

                                        No Sales Orders Found

                                    </Typography>

                                </TableCell>

                            </TableRow>

                        ) : (

                            items.map((item) => (

                                <TableRow
                                    hover
                                    key={item.SalesOrderId}
                                >

                                    <TableCell>

                                        {item.SalesOrderId}

                                    </TableCell>

                                    <TableCell>

                                        {item.SalesOrderNumber}

                                    </TableCell>

                                    <TableCell>

                                        {item.SellerId}

                                    </TableCell>

                                    <TableCell>

                                        {item.CustomerId}

                                    </TableCell>

                                    <TableCell>

                                        {formatDate(item.OrderDate)}

                                    </TableCell>

                                    <TableCell align="right">

                                        {formatCurrency(item.TotalAmount)}

                                    </TableCell>

                                    <TableCell>

                                        <Chip
                                            label={item.Status}
                                            color={getStatusColor(item.Status)}
                                            size="small"
                                        />

                                    </TableCell>

                                    <TableCell>

                                        {

                                            item.Remarks || "-"

                                        }

                                    </TableCell>

                                    <TableCell align="center">

                                        <Tooltip title="View">

                                            <IconButton
                                                color="primary"
                                                onClick={() =>
                                                    onView(item)
                                                }
                                            >

                                                <Visibility />

                                            </IconButton>

                                        </Tooltip>

                                        <Tooltip title="Edit">

                                            <IconButton
                                                color="warning"
                                                onClick={() =>
                                                    onEdit(item)
                                                }
                                            >

                                                <Edit />

                                            </IconButton>

                                        </Tooltip>

                                        <Tooltip title="Delete">

                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    onDelete(item)
                                                }
                                            >

                                                <Delete />

                                            </IconButton>

                                        </Tooltip>

                                    </TableCell>

                                </TableRow>

                            ))

                        )

                    }

                </TableBody>

            </Table>

        </TableContainer>

    );

};

export default SalesOrderTable;