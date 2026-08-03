import React from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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

const SalesInvoiceTable = ({
    items,
    onView,
    onEdit,
    onDelete
}) => {

    const getStatusColor = (status) => {

        switch (status?.toLowerCase()) {

            case "paid":
            case "completed":
                return "success";

            case "pending":
                return "warning";

            case "partial":
            case "partially paid":
                return "info";

            case "cancelled":
            case "rejected":
                return "error";

            case "processing":
                return "primary";

            default:
                return "default";

        }

    };

    const formatAmount = (value) =>

        `₹ ${Number(value || 0).toFixed(2)}`;

    const formatDate = (value) =>

        value
            ? new Date(value).toLocaleDateString()
            : "-";

    if (!items?.length) {

        return (

            <Paper sx={{ p: 4 }}>

                <Typography
                    align="center"
                    color="text.secondary"
                >

                    No Sales Invoices found.

                </Typography>

            </Paper>

        );

    }

    return (

        <TableContainer component={Paper}>

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            Invoice ID
                        </TableCell>

                        <TableCell>
                            Invoice No
                        </TableCell>

                        <TableCell>
                            Order ID
                        </TableCell>

                        <TableCell>
                            Invoice Date
                        </TableCell>

                        <TableCell align="right">
                            Total
                        </TableCell>

                        <TableCell align="right">
                            Paid
                        </TableCell>

                        <TableCell align="right">
                            Balance
                        </TableCell>

                        <TableCell>
                            Payment Status
                        </TableCell>

                        <TableCell>
                            Status
                        </TableCell>

                        <TableCell align="center">
                            Actions
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {items.map((item) => (

                        <TableRow
                            key={item.SalesInvoiceId}
                            hover
                        >

                            <TableCell>

                                {item.SalesInvoiceId}

                            </TableCell>

                            <TableCell>

                                {item.InvoiceNumber}

                            </TableCell>

                            <TableCell>

                                {item.SalesOrderId}

                            </TableCell>

                            <TableCell>

                                {formatDate(
                                    item.InvoiceDate
                                )}

                            </TableCell>

                            <TableCell align="right">

                                {formatAmount(
                                    item.TotalAmount
                                )}

                            </TableCell>

                            <TableCell align="right">

                                {formatAmount(
                                    item.PaidAmount
                                )}

                            </TableCell>

                            <TableCell align="right">

                                {formatAmount(
                                    item.BalanceAmount
                                )}

                            </TableCell>

                            <TableCell>

                                <Chip
                                    size="small"
                                    label={
                                        item.PaymentStatus ||
                                        "-"
                                    }
                                    color={getStatusColor(
                                        item.PaymentStatus
                                    )}
                                />

                            </TableCell>

                            <TableCell>

                                <Chip
                                    size="small"
                                    label={
                                        item.Status ||
                                        "-"
                                    }
                                    color={getStatusColor(
                                        item.Status
                                    )}
                                />

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

                    ))}

                </TableBody>

            </Table>

        </TableContainer>

    );

};

export default SalesInvoiceTable;