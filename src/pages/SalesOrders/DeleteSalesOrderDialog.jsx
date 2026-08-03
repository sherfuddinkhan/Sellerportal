import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography
} from "@mui/material";

const formatCurrency = (value) =>
    `₹ ${Number(value || 0).toFixed(2)}`;

const DeleteSalesOrderDialog = ({

    open,

    item,

    onClose,

    onDeleted

}) => {

    const handleDelete = () => {

        if (!item) return;

        onDeleted(item.SalesOrderId);

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle>

                Delete Sales Order

            </DialogTitle>

            <DialogContent>

                <DialogContentText sx={{ mb: 2 }}>

                    Are you sure you want to delete this Sales Order?

                    This action cannot be undone.

                </DialogContentText>

                {

                    item && (

                        <>

                            <Typography>

                                <strong>Sales Order ID:</strong>{" "}

                                {item.SalesOrderId}

                            </Typography>

                            <Typography>

                                <strong>Order Number:</strong>{" "}

                                {item.SalesOrderNumber}

                            </Typography>

                            <Typography>

                                <strong>Seller ID:</strong>{" "}

                                {item.SellerId}

                            </Typography>

                            <Typography>

                                <strong>Customer ID:</strong>{" "}

                                {item.CustomerId}

                            </Typography>

                            <Typography>

                                <strong>Order Date:</strong>{" "}

                                {

                                    item.OrderDate

                                        ? new Date(
                                            item.OrderDate
                                        ).toLocaleDateString()

                                        : "-"

                                }

                            </Typography>

                            <Typography>

                                <strong>Status:</strong>{" "}

                                {item.Status}

                            </Typography>

                            <Typography>

                                <strong>Total Amount:</strong>{" "}

                                {

                                    formatCurrency(
                                        item.TotalAmount
                                    )

                                }

                            </Typography>

                        </>

                    )

                }

            </DialogContent>

            <DialogActions>

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
                >

                    Delete

                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default DeleteSalesOrderDialog;