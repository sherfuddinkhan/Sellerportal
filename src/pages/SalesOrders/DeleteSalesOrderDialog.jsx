
import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Stack,
    Divider
} from "@mui/material";


/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {

    const amount = Number(value || 0);

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
   DELETE SALES ORDER DIALOG
========================================================= */

const DeleteSalesOrderDialog = ({
    open,
    item,
    onClose,
    onDeleted
}) => {

    /* =====================================================
       DELETE HANDLER
    ===================================================== */

    const handleDelete = () => {

        if (!item?.SalesOrderId) {
            return;
        }

        onDeleted?.(item.SalesOrderId);
    };


    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle>
                Delete Sales Order
            </DialogTitle>


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent>

                <DialogContentText
                    sx={{
                        mb: 3
                    }}
                >
                    Are you sure you want to delete this Sales
                    Order? This action cannot be undone.
                </DialogContentText>


                {/* =================================================
                    ORDER DETAILS
                ================================================= */}

                {item && (
                    <Stack spacing={1.2}>

                        <Typography variant="body2">
                            <strong>Sales Order ID:</strong>{" "}
                            {item.SalesOrderId || "-"}
                        </Typography>


                        <Typography variant="body2">
                            <strong>Order Number:</strong>{" "}
                            {item.SalesOrderNumber || "-"}
                        </Typography>


                        <Typography variant="body2">
                            <strong>Seller ID:</strong>{" "}
                            {item.SellerId || "-"}
                        </Typography>


                        <Typography variant="body2">
                            <strong>Customer ID:</strong>{" "}
                            {item.CustomerId || "-"}
                        </Typography>


                        <Typography variant="body2">
                            <strong>Order Date:</strong>{" "}
                            {formatDate(item.OrderDate)}
                        </Typography>


                        <Typography variant="body2">
                            <strong>Status:</strong>{" "}
                            {item.Status || "-"}
                        </Typography>


                        <Divider sx={{ my: 1 }} />


                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600
                            }}
                        >
                            <strong>Total Amount:</strong>{" "}
                            {formatCurrency(item.TotalAmount)}
                        </Typography>

                    </Stack>
                )}

            </DialogContent>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2
                }}
            >

                <Button
                    onClick={onClose}
                    color="inherit"
                >
                    Cancel
                </Button>


                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    disabled={!item}
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default DeleteSalesOrderDialog;
