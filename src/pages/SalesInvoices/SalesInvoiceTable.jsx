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
    Typography,
    Box
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";


const SalesInvoiceTable = ({
    items = [],
    onView,
    onEdit,
    onDelete
}) => {


    /* --------------------------------
       Status Color
    -------------------------------- */

    const getStatusColor = (status) => {

        switch (
            String(status || "").toLowerCase()
        ) {

            case "paid":
            case "completed":
                return "success";

            case "pending":
            case "draft":
            case "open":
                return "warning";

            case "partial":
            case "partially paid":
                return "info";

            case "processing":
                return "primary";

            case "cancelled":
            case "rejected":
                return "error";

            default:
                return "default";
        }
    };


    /* --------------------------------
       Format Currency
    -------------------------------- */

    const formatAmount = (value) => {

        const amount = Number(value);

        if (Number.isNaN(amount)) {
            return "₹ 0.00";
        }

        return `₹ ${amount.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;
    };


    /* --------------------------------
       Format Date
    -------------------------------- */

    const formatDate = (value) => {

        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "-";
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


    /* --------------------------------
       Empty State
    -------------------------------- */

    if (!items.length) {

        return (

            <Paper
                elevation={1}
                sx={{
                    p: 4,
                    borderRadius: 2
                }}
            >

                <Typography
                    align="center"
                    color="text.secondary"
                >
                    No Sales Invoices found.
                </Typography>

            </Paper>

        );
    }


    /* --------------------------------
       Table
    -------------------------------- */

    return (

        <TableContainer
            component={Paper}
            elevation={1}
            sx={{
                borderRadius: 2,
                overflowX: "auto"
            }}
        >

            <Table
                size="small"
                sx={{
                    minWidth: 1200
                }}
            >

                {/* =========================
                    TABLE HEADER
                ========================= */}

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>Invoice ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Invoice No</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Order ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Invoice Date</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Total</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Paid</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Balance</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Payment Status</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Status</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Actions</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>


                {/* =========================
                    TABLE BODY
                ========================= */}

                <TableBody>

                    {items.map((item) => {

                        const invoiceId =
                            item.SalesInvoiceId ??
                            item.salesInvoiceId ??
                            item.id;

                        const invoiceNumber =
                            item.InvoiceNumber ??
                            item.invoiceNumber;

                        const salesOrderId =
                            item.SalesOrderId ??
                            item.salesOrderId;

                        const invoiceDate =
                            item.InvoiceDate ??
                            item.invoiceDate;

                        const totalAmount =
                            item.TotalAmount ??
                            item.totalAmount;

                        const paidAmount =
                            item.PaidAmount ??
                            item.paidAmount;

                        const balanceAmount =
                            item.BalanceAmount ??
                            item.balanceAmount;

                        const paymentStatus =
                            item.PaymentStatus ??
                            item.paymentStatus;

                        const status =
                            item.Status ??
                            item.status;

                        return (

                            <TableRow
                                key={invoiceId}
                                hover
                            >

                                {/* Invoice ID */}

                                <TableCell>
                                    {invoiceId ?? "-"}
                                </TableCell>


                                {/* Invoice Number */}

                                <TableCell>

                                    <Typography
                                        variant="body2"
                                        fontWeight="medium"
                                    >
                                        {invoiceNumber || "-"}
                                    </Typography>

                                </TableCell>


                                {/* Sales Order ID */}

                                <TableCell>
                                    {salesOrderId ?? "-"}
                                </TableCell>


                                {/* Invoice Date */}

                                <TableCell>
                                    {formatDate(invoiceDate)}
                                </TableCell>


                                {/* Total */}

                                <TableCell align="right">

                                    {formatAmount(
                                        totalAmount
                                    )}

                                </TableCell>


                                {/* Paid */}

                                <TableCell align="right">

                                    {formatAmount(
                                        paidAmount
                                    )}

                                </TableCell>


                                {/* Balance */}

                                <TableCell align="right">

                                    <Typography
                                        fontWeight="medium"
                                    >
                                        {formatAmount(
                                            balanceAmount
                                        )}
                                    </Typography>

                                </TableCell>


                                {/* Payment Status */}

                                <TableCell>

                                    <Chip
                                        size="small"
                                        label={
                                            paymentStatus ||
                                            "-"
                                        }
                                        color={getStatusColor(
                                            paymentStatus
                                        )}
                                        variant="outlined"
                                    />

                                </TableCell>


                                {/* Invoice Status */}

                                <TableCell>

                                    <Chip
                                        size="small"
                                        label={
                                            status ||
                                            "-"
                                        }
                                        color={getStatusColor(
                                            status
                                        )}
                                        variant="outlined"
                                    />

                                </TableCell>


                                {/* Actions */}

                                <TableCell align="center">

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent:
                                                "center",
                                            alignItems:
                                                "center"
                                        }}
                                    >

                                        {/* View */}

                                        <Tooltip
                                            title="View Invoice"
                                        >

                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() =>
                                                    onView &&
                                                    onView(item)
                                                }
                                            >

                                                <Visibility />

                                            </IconButton>

                                        </Tooltip>


                                        {/* Edit */}

                                        <Tooltip
                                            title="Edit Invoice"
                                        >

                                            <IconButton
                                                size="small"
                                                color="warning"
                                                onClick={() =>
                                                    onEdit &&
                                                    onEdit(item)
                                                }
                                            >

                                                <Edit />

                                            </IconButton>

                                        </Tooltip>


                                        {/* Delete */}

                                        <Tooltip
                                            title="Delete Invoice"
                                        >

                                            <IconButton
                                                size="small"
                                                color="error"
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

                        );

                    })}

                </TableBody>

            </Table>

        </TableContainer>

    );

};


export default SalesInvoiceTable;