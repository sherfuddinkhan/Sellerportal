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
    Print,
    Delete
} from "@mui/icons-material";


/* =========================================================
   SALES INVOICE TABLE
========================================================= */

const SalesInvoiceTable = ({
    items = [],
    onView,
    onEdit,
    onPrint,
    onDelete
}) => {


    /* =========================================================
       STATUS COLOR
    ========================================================= */

    const getStatusColor = (status) => {

        switch (
            String(status || "").toLowerCase().trim()
        ) {

            case "paid":
            case "completed":
            case "confirmed":
                return "success";

            case "pending":
            case "draft":
            case "open":
            case "due":
            case "due-pending":
                return "warning";

            case "partial":
            case "partially paid":
                return "info";

            case "processing":
                return "primary";

            case "cancelled":
            case "rejected":
            case "failed":
                return "error";

            default:
                return "default";
        }
    };


    /* =========================================================
       FORMAT CURRENCY
    ========================================================= */

    const formatAmount = (value) => {

        const amount = Number(value);

        if (!Number.isFinite(amount)) {
            return "₹ 0.00";
        }

        return `₹ ${amount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };


    /* =========================================================
       FORMAT DATE
    ========================================================= */

    const formatDate = (value) => {

        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };


    /* =========================================================
       EMPTY STATE
    ========================================================= */

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


    /* =========================================================
       TABLE
    ========================================================= */

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
                    minWidth: 1250
                }}
            >

                {/* =================================================
                   TABLE HEADER
                ================================================= */}

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


                {/* =================================================
                   TABLE BODY
                ================================================= */}

                <TableBody>

                    {items.map((item, index) => {

                        const invoiceId =
                            item.SalesInvoiceId ??
                            item.salesInvoiceId ??
                            item.id ??
                            index;

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

                                {/* =================================================
                                   INVOICE ID
                                ================================================= */}

                                <TableCell>
                                    {invoiceId ?? "-"}
                                </TableCell>


                                {/* =================================================
                                   INVOICE NUMBER
                                ================================================= */}

                                <TableCell>

                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                    >
                                        {invoiceNumber || "-"}
                                    </Typography>

                                </TableCell>


                                {/* =================================================
                                   SALES ORDER ID
                                ================================================= */}

                                <TableCell>
                                    {salesOrderId ?? "-"}
                                </TableCell>


                                {/* =================================================
                                   INVOICE DATE
                                ================================================= */}

                                <TableCell>
                                    {formatDate(invoiceDate)}
                                </TableCell>


                                {/* =================================================
                                   TOTAL
                                ================================================= */}

                                <TableCell align="right">

                                    {formatAmount(
                                        totalAmount
                                    )}

                                </TableCell>


                                {/* =================================================
                                   PAID
                                ================================================= */}

                                <TableCell align="right">

                                    {formatAmount(
                                        paidAmount
                                    )}

                                </TableCell>


                                {/* =================================================
                                   BALANCE
                                ================================================= */}

                                <TableCell align="right">

                                    <Typography
                                        fontWeight={600}
                                    >
                                        {formatAmount(
                                            balanceAmount
                                        )}
                                    </Typography>

                                </TableCell>


                                {/* =================================================
                                   PAYMENT STATUS
                                ================================================= */}

                                <TableCell>

                                    <Chip
                                        size="small"
                                        label={
                                            paymentStatus || "-"
                                        }
                                        color={getStatusColor(
                                            paymentStatus
                                        )}
                                        variant="outlined"
                                    />

                                </TableCell>


                                {/* =================================================
                                   INVOICE STATUS
                                ================================================= */}

                                <TableCell>

                                    <Chip
                                        size="small"
                                        label={
                                            status || "-"
                                        }
                                        color={getStatusColor(
                                            status
                                        )}
                                        variant="outlined"
                                    />

                                </TableCell>


                                {/* =================================================
                                   ACTIONS
                                ================================================= */}

                                <TableCell align="center">

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: 0.25
                                        }}
                                    >

                                        {/* =================================================
                                           VIEW
                                        ================================================= */}

                                        <Tooltip title="View Invoice">

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


                                        {/* =================================================
                                           EDIT
                                        ================================================= */}

                                        <Tooltip title="Edit Invoice">

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


                                        {/* =================================================
                                           PRINT
                                        ================================================= */}

                                        <Tooltip title="Print Invoice">

                                            <IconButton
                                                size="small"
                                                color="success"
                                                onClick={() => {
                                                    if (onPrint) {
                                                        onPrint(item);
                                                    }
                                                }}
                                            >

                                                <Print fontSize="small" />

                                            </IconButton>

                                        </Tooltip>


                                        {/* =================================================
                                           DELETE
                                        ================================================= */}

                                        <Tooltip title="Delete Invoice">

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


export default SalesInvoiceTable;