import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Stack,
    Chip,
    Divider,
    Button,
    Box
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";


/* --------------------------------
   Format Currency
-------------------------------- */

const formatCurrency = (value) => {

    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return "₹ 0.00";
    }

    return `₹ ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
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

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};


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

        case "partially paid":
        case "partial":
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
   Sales Invoice Card
-------------------------------- */

const SalesInvoiceCard = ({
    item,
    onView,
    onEdit,
    onDelete
}) => {

    if (!item) {
        return null;
    }


    /* --------------------------------
       Support PascalCase + camelCase
    -------------------------------- */

    const invoiceId =
        item.SalesInvoiceId ??
        item.salesInvoiceId;

    const invoiceNumber =
        item.InvoiceNumber ??
        item.invoiceNumber;

    const salesOrderId =
        item.SalesOrderId ??
        item.salesOrderId;

    const invoiceDate =
        item.InvoiceDate ??
        item.invoiceDate;

    const subTotal =
        item.SubTotal ??
        item.subTotal;

    const discountAmount =
        item.DiscountAmount ??
        item.discountAmount;

    const taxAmount =
        item.TaxAmount ??
        item.taxAmount;

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

    const remarks =
        item.Remarks ??
        item.remarks;


    return (

        <Card
            elevation={2}
            sx={{
                height: "100%",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column"
            }}
        >

            {/* =========================
                CONTENT
            ========================= */}

            <CardContent
                sx={{
                    flexGrow: 1
                }}
            >

                {/* Invoice Number */}

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                        wordBreak: "break-word"
                    }}
                >
                    {invoiceNumber || "Sales Invoice"}
                </Typography>


                {/* Invoice ID */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Invoice ID : {invoiceId ?? "-"}
                </Typography>


                {/* Sales Order */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Sales Order : {salesOrderId ?? "-"}
                </Typography>


                {/* Invoice Date */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Date : {formatDate(invoiceDate)}
                </Typography>


                <Divider
                    sx={{
                        my: 2
                    }}
                />


                {/* =========================
                    AMOUNTS
                ========================= */}

                <Stack spacing={1}>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2
                        }}
                    >

                        <Typography variant="body2">
                            <strong>Sub Total:</strong>
                        </Typography>

                        <Typography
                            variant="body2"
                            textAlign="right"
                        >
                            {formatCurrency(subTotal)}
                        </Typography>

                    </Box>


                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2
                        }}
                    >

                        <Typography variant="body2">
                            <strong>Discount:</strong>
                        </Typography>

                        <Typography
                            variant="body2"
                            textAlign="right"
                        >
                            {formatCurrency(discountAmount)}
                        </Typography>

                    </Box>


                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2
                        }}
                    >

                        <Typography variant="body2">
                            <strong>Tax:</strong>
                        </Typography>

                        <Typography
                            variant="body2"
                            textAlign="right"
                        >
                            {formatCurrency(taxAmount)}
                        </Typography>

                    </Box>


                    <Divider />


                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2
                        }}
                    >

                        <Typography
                            variant="body2"
                            fontWeight="bold"
                        >
                            Total:
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight="bold"
                            textAlign="right"
                        >
                            {formatCurrency(totalAmount)}
                        </Typography>

                    </Box>


                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2
                        }}
                    >

                        <Typography variant="body2">
                            <strong>Paid:</strong>
                        </Typography>

                        <Typography
                            variant="body2"
                            textAlign="right"
                        >
                            {formatCurrency(paidAmount)}
                        </Typography>

                    </Box>


                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2
                        }}
                    >

                        <Typography
                            variant="body2"
                            fontWeight="bold"
                        >
                            Balance:
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight="bold"
                            textAlign="right"
                        >
                            {formatCurrency(balanceAmount)}
                        </Typography>

                    </Box>

                </Stack>


                <Divider
                    sx={{
                        my: 2
                    }}
                />


                {/* =========================
                    STATUS
                ========================= */}

                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                >

                    <Chip
                        label={
                            paymentStatus || "-"
                        }
                        color={getStatusColor(
                            paymentStatus
                        )}
                        size="small"
                    />

                    <Chip
                        label={
                            status || "-"
                        }
                        color={getStatusColor(
                            status
                        )}
                        size="small"
                    />

                </Stack>


                {/* =========================
                    REMARKS
                ========================= */}

                {remarks && (

                    <Typography
                        variant="body2"
                        sx={{
                            mt: 2,
                            wordBreak: "break-word"
                        }}
                    >

                        <strong>Remarks:</strong>{" "}

                        {remarks}

                    </Typography>

                )}

            </CardContent>


            {/* =========================
                ACTIONS
            ========================= */}

            <CardActions
                sx={{
                    px: 2,
                    pb: 2,
                    pt: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 1
                }}
            >

                {/* View */}

                <Button
                    size="small"
                    color="primary"
                    startIcon={<Visibility />}
                    onClick={() =>
                        onView &&
                        onView(item)
                    }
                >
                    View
                </Button>


                {/* Edit */}

                <Button
                    size="small"
                    color="warning"
                    startIcon={<Edit />}
                    onClick={() =>
                        onEdit &&
                        onEdit(item)
                    }
                >
                    Edit
                </Button>


                {/* Delete */}

                <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() =>
                        onDelete &&
                        onDelete(item)
                    }
                >
                    Delete
                </Button>

            </CardActions>

        </Card>
    );
};


export default SalesInvoiceCard;