import React from "react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from "@mui/material";

const DeleteSalesInvoiceDialog = ({
    open,
    invoice,
    onClose,
    onConfirm,
    loading = false
}) => {

    const invoiceNumber =
        invoice?.InvoiceNumber ??
        invoice?.invoiceNumber ??
        invoice?.SalesInvoiceId ??
        invoice?.salesInvoiceId ??
        "";

    return (
        <Dialog
            open={open}
            onClose={
                loading
                    ? undefined
                    : onClose
            }
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle>
                Delete Sales Invoice
            </DialogTitle>

            <DialogContent>
                <Typography>
                    Are you sure you want to delete
                    invoice{" "}
                    <strong>
                        {invoiceNumber}
                    </strong>
                    ?
                </Typography>

                <Typography
                    variant="body2"
                    color="error"
                    sx={{ mt: 1 }}
                >
                    This will also remove its invoice
                    items, payments and additional
                    charges.
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    color="error"
                    variant="contained"
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading
                        ? "Deleting..."
                        : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteSalesInvoiceDialog;