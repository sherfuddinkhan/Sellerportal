import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Divider,
    Chip,
    Box
} from "@mui/material";


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
   Detail Item
-------------------------------- */

const DetailItem = ({
    label,
    value,
    bold = false
}) => {

    return (
        <Grid
            item
            xs={12}
            md={6}
        >

            <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{
                    mb: 0.5
                }}
            >
                {label}
            </Typography>

            <Typography
                fontWeight={bold ? "bold" : "normal"}
                sx={{
                    wordBreak: "break-word"
                }}
            >
                {value ?? "-"}
            </Typography>

        </Grid>
    );
};


/* --------------------------------
   Sales Invoice View
-------------------------------- */

const SalesInvoiceView = ({
    open,
    item,
    onClose
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

    const salesOrderId =
        item.SalesOrderId ??
        item.salesOrderId;

    const sellerId =
        item.SellerId ??
        item.sellerId;

    const customerId =
        item.CustomerId ??
        item.customerId;

    const invoiceNumber =
        item.InvoiceNumber ??
        item.invoiceNumber;

    const invoiceDate =
        item.InvoiceDate ??
        item.invoiceDate;

    const invoiceScenario =
        item.InvoiceScenario ??
        item.invoiceScenario;

    const category =
        item.Category ??
        item.category;

    const transactionType =
        item.TransactionType ??
        item.transactionType;

    const userGSTIN =
        item.UserGSTIN ??
        item.userGSTIN;

    const documentType =
        item.DocumentType ??
        item.documentType;

    const supplyType =
        item.SupplyType ??
        item.supplyType;

    const placeOfSupply =
        item.PlaceOfSupply ??
        item.placeOfSupply;

    const financialYear =
        item.FinancialYear ??
        item.financialYear;

    const reverseCharge =
        item.ReverseCharge ??
        item.reverseCharge;

    const referenceId =
        item.Id ??
        item.id;

    const refId =
        item.RefId ??
        item.refId;

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

    const createdDate =
        item.CreatedDate ??
        item.createdDate;

    const updatedDate =
        item.UpdatedDate ??
        item.updatedDate;


    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >

            {/* =========================
                TITLE
            ========================= */}

            <DialogTitle>

                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    Sales Invoice Details
                </Typography>

                {invoiceNumber && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Invoice No: {invoiceNumber}
                    </Typography>
                )}

            </DialogTitle>


            {/* =========================
                CONTENT
            ========================= */}

            <DialogContent dividers>

                <Grid
                    container
                    spacing={3}
                >

                    {/* Basic Information */}

                    <Grid item xs={12}>

                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                        >
                            Basic Information
                        </Typography>

                    </Grid>

                    <DetailItem
                        label="Sales Invoice ID"
                        value={invoiceId}
                    />

                    <DetailItem
                        label="Sales Order ID"
                        value={salesOrderId}
                    />

                    <DetailItem
                        label="Seller ID"
                        value={sellerId}
                    />

                    <DetailItem
                        label="Customer ID"
                        value={customerId}
                    />

                    <DetailItem
                        label="Invoice Number"
                        value={invoiceNumber}
                        bold
                    />

                    <DetailItem
                        label="Invoice Date"
                        value={formatDate(invoiceDate)}
                    />


                    <Grid item xs={12}>
                        <Divider />
                    </Grid>


                    {/* Invoice Classification */}

                    <Grid item xs={12}>

                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                        >
                            Invoice Classification
                        </Typography>

                    </Grid>

                    <DetailItem
                        label="Invoice Scenario"
                        value={invoiceScenario}
                    />

                    <DetailItem
                        label="Category"
                        value={category}
                    />

                    <DetailItem
                        label="Transaction Type"
                        value={transactionType}
                    />

                    <DetailItem
                        label="Document Type"
                        value={documentType}
                    />

                    <DetailItem
                        label="Supply Type"
                        value={supplyType}
                    />

                    <DetailItem
                        label="Place of Supply"
                        value={placeOfSupply}
                    />

                    <DetailItem
                        label="Financial Year"
                        value={financialYear}
                    />

                    <DetailItem
                        label="Reverse Charge"
                        value={
                            typeof reverseCharge === "boolean"
                                ? reverseCharge
                                    ? "Yes"
                                    : "No"
                                : reverseCharge || "-"
                        }
                    />

                    <DetailItem
                        label="User GSTIN"
                        value={userGSTIN}
                    />


                    <Grid item xs={12}>
                        <Divider />
                    </Grid>


                    {/* Reference Information */}

                    <Grid item xs={12}>

                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                        >
                            Reference Information
                        </Typography>

                    </Grid>

                    <DetailItem
                        label="Reference ID"
                        value={referenceId}
                    />

                    <DetailItem
                        label="Ref ID"
                        value={refId}
                    />


                    <Grid item xs={12}>
                        <Divider />
                    </Grid>


                    {/* Amount Details */}

                    <Grid item xs={12}>

                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                        >
                            Amount Details
                        </Typography>

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Sub Total
                        </Typography>

                        <Typography>
                            {formatCurrency(subTotal)}
                        </Typography>

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Discount
                        </Typography>

                        <Typography>
                            {formatCurrency(discountAmount)}
                        </Typography>

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Tax
                        </Typography>

                        <Typography>
                            {formatCurrency(taxAmount)}
                        </Typography>

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Total Amount
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            {formatCurrency(totalAmount)}
                        </Typography>

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Paid Amount
                        </Typography>

                        <Typography>
                            {formatCurrency(paidAmount)}
                        </Typography>

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Balance Amount
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            {formatCurrency(balanceAmount)}
                        </Typography>

                    </Grid>


                    <Grid item xs={12}>
                        <Divider />
                    </Grid>


                    {/* Status */}

                    <Grid item xs={12}>

                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{
                                mb: 1
                            }}
                        >
                            Status
                        </Typography>

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{
                                mb: 1
                            }}
                        >
                            Payment Status
                        </Typography>

                        <Chip
                            label={
                                paymentStatus || "-"
                            }
                            color={getStatusColor(
                                paymentStatus
                            )}
                            size="small"
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{
                                mb: 1
                            }}
                        >
                            Invoice Status
                        </Typography>

                        <Chip
                            label={
                                status || "-"
                            }
                            color={getStatusColor(
                                status
                            )}
                            size="small"
                        />

                    </Grid>


                    {/* Remarks */}

                    <Grid item xs={12}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{
                                mb: 0.5
                            }}
                        >
                            Remarks
                        </Typography>

                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 1,
                                bgcolor: "background.default"
                            }}
                        >

                            <Typography>
                                {remarks || "-"}
                            </Typography>

                        </Box>

                    </Grid>


                    <Grid item xs={12}>
                        <Divider />
                    </Grid>


                    {/* Audit Information */}

                    <Grid item xs={12}>

                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                        >
                            Audit Information
                        </Typography>

                    </Grid>


                    <DetailItem
                        label="Created Date"
                        value={formatDate(createdDate)}
                    />

                    <DetailItem
                        label="Updated Date"
                        value={formatDate(updatedDate)}
                    />

                </Grid>

            </DialogContent>


            {/* =========================
                ACTIONS
            ========================= */}

            <DialogActions>

                <Button
                    variant="contained"
                    onClick={onClose}
                >
                    Close
                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default SalesInvoiceView;