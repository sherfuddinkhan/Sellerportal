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
    `₹ ${Number(value || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

const DeleteSalesOrderItemDialog = ({

    open,

    item,

    onClose,

    onDeleted

}) => {

    const handleDelete = () => {

        if (!item) return;

        onDeleted(item.SalesOrderItemId);

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>

                Delete Sales Order Item

            </DialogTitle>

            <DialogContent>

                <DialogContentText sx={{ mb: 2 }}>

                    Are you sure you want to delete this Sales Order Item?

                    This action cannot be undone.

                </DialogContentText>

                {

                    item && (

                        <>

                            <Typography>

                                <strong>Sales Order Item ID:</strong>{" "}

                                {item.SalesOrderItemId}

                            </Typography>

                            <Typography>

                                <strong>Sales Order ID:</strong>{" "}

                                {item.SalesOrderId}

                            </Typography>

                            <Typography>

                                <strong>Product ID:</strong>{" "}

                                {item.ProductId}

                            </Typography>

                            <Typography>

                                <strong>Quantity:</strong>{" "}

                                {Number(item.Quantity || 0).toLocaleString()}

                            </Typography>

                            <Typography>

                                <strong>Unit Price:</strong>{" "}

                                {formatCurrency(item.UnitPrice)}

                            </Typography>

                            <Typography>

                                <strong>Discount:</strong>{" "}

                                {formatCurrency(item.Discount)}

                            </Typography>

                            <Typography>

                                <strong>Tax Amount:</strong>{" "}

                                {formatCurrency(item.TaxAmount)}

                            </Typography>

                            <Typography>

                                <strong>Total Amount:</strong>{" "}

                                {formatCurrency(item.TotalAmount)}

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

export default DeleteSalesOrderItemDialog;