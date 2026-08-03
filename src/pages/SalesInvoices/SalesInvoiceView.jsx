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
    Chip
} from "@mui/material";

const formatCurrency = (value) =>
    `₹ ${Number(value || 0).toFixed(2)}`;

const formatDate = (value) =>
    value
        ? new Date(value).toLocaleDateString()
        : "-";

const SalesInvoiceView = ({

    open,

    item,

    onClose

}) => {

    if (!item) return null;

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >

            <DialogTitle>

                Sales Invoice Details

            </DialogTitle>

            <DialogContent dividers>

                <Grid
                    container
                    spacing={3}
                >

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >

                            Sales Invoice ID

                        </Typography>

                        <Typography>

                            {item.SalesInvoiceId}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >

                            Sales Order ID

                        </Typography>

                        <Typography>

                            {item.SalesOrderId}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >

                            Invoice Number

                        </Typography>

                        <Typography>

                            {item.InvoiceNumber}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >

                            Invoice Date

                        </Typography>

                        <Typography>

                            {formatDate(item.InvoiceDate)}

                        </Typography>

                    </Grid>

                    <Grid item xs={12}>

                        <Divider />

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >

                            Sub Total

                        </Typography>

                        <Typography>

                            {formatCurrency(item.SubTotal)}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >

                            Discount

                        </Typography>

                        <Typography>

                            {formatCurrency(item.DiscountAmount)}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >

                            Tax

                        </Typography>

                        <Typography>

                            {formatCurrency(item.TaxAmount)}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >

                            Total Amount

                        </Typography>

                        <Typography
                            fontWeight="bold"
                        >

                            {formatCurrency(item.TotalAmount)}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >

                            Paid Amount

                        </Typography>

                        <Typography>

                            {formatCurrency(item.PaidAmount)}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >

                            Balance Amount

                        </Typography>

                        <Typography>

                            {formatCurrency(item.BalanceAmount)}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >

                            Payment Status

                        </Typography>

                        <Chip
                            label={
                                item.PaymentStatus ||
                                "-"
                            }
                            color="primary"
                            size="small"
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >

                            Invoice Status

                        </Typography>

                        <Chip
                            label={
                                item.Status ||
                                "-"
                            }
                            color="success"
                            size="small"
                        />

                    </Grid>

                    <Grid item xs={12}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >

                            Remarks

                        </Typography>

                        <Typography>

                            {item.Remarks || "-"}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >

                            Created Date

                        </Typography>

                        <Typography>

                            {formatDate(item.CreatedDate)}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >

                            Updated Date

                        </Typography>

                        <Typography>

                            {formatDate(item.UpdatedDate)}

                        </Typography>

                    </Grid>

                </Grid>

            </DialogContent>

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