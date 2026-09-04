import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Divider,
    Box
} from "@mui/material";


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


const DeleteSalesInvoiceDialog = ({
    open,
    item,
    onClose,
    onDeleted,
    loading = false
}) => {

    const handleDelete = () => {

        if (!item) {
            return;
        }

        const invoiceId =
            item.SalesInvoiceId ??
            item.salesInvoiceId;

        if (!invoiceId) {
            return;
        }

        onDeleted(invoiceId);
    };


    if (!item) {

        return (
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>
                    Delete Sales Invoice
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        No Sales Invoice selected.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={onClose}
                        color="inherit"
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }


    const invoiceId =
        item.SalesInvoiceId ??
        item.salesInvoiceId;

    const invoiceNumber =
        item.InvoiceNumber ??
        item.invoiceNumber;

    const salesOrderId =
        item.SalesOrderId ??
        item.salesOrderId;

    const totalAmount =
        item.TotalAmount ??
        item.totalAmount;


    return (

        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="xs"
            fullWidth
        >

            {/* =========================
                TITLE
            ========================= */}

            <DialogTitle>
                Delete Sales Invoice
            </DialogTitle>


            {/* =========================
                CONTENT
            ========================= */}

            <DialogContent>

                <DialogContentText>
                    Are you sure you want to delete this
                    Sales Invoice?
                </DialogContentText>


                <Box
                    sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 1,
                        bgcolor: "background.default"
                    }}
                >

                    <Typography
                        variant="body2"
                        sx={{ mb: 1 }}
                    >
                        <strong>Invoice ID:</strong>{" "}
                        {invoiceId ?? "-"}
                    </Typography>


                    <Typography
                        variant="body2"
                        sx={{ mb: 1 }}
                    >
                        <strong>Invoice Number:</strong>{" "}
                        {invoiceNumber || "-"}
                    </Typography>


                    <Typography
                        variant="body2"
                        sx={{ mb: 1 }}
                    >
                        <strong>Sales Order ID:</strong>{" "}
                        {salesOrderId ?? "-"}
                    </Typography>


                    <Divider
                        sx={{
                            my: 1.5
                        }}
                    />


                    <Typography
                        variant="body2"
                        fontWeight="bold"
                    >
                        Total Amount:{" "}
                        {formatCurrency(totalAmount)}
                    </Typography>

                </Box>


                <Typography
                    variant="body2"
                    color="error"
                    sx={{
                        mt: 2
                    }}
                >
                    This action cannot be undone.
                </Typography>

            </DialogContent>


            {/* =========================
                ACTIONS
            ========================= */}

            <DialogActions>

                <Button
                    onClick={onClose}
                    color="inherit"
                    disabled={loading}
                >
                    Cancel
                </Button>


                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    disabled={loading || !invoiceId}
                >
                    {loading
                        ? "Deleting..."
                        : "Delete"
                    }
                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default DeleteSalesInvoiceDialog;