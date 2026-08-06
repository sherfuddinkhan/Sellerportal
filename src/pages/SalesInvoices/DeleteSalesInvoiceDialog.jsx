import React from "react";
import {Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions,Button,Typography} from "@mui/material";
const DeleteSalesInvoiceDialog = ({
    open,
    item,
    onClose,
    onDeleted
}) => {

    const handleDelete = () => {

        if (!item) return;

        onDeleted(item.SalesInvoiceId);

    };

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

                    Are you sure you want to delete this Sales Invoice?

                </DialogContentText>

                {item && (

                    <>

                        <Typography sx={{ mt: 2 }}>

                            <strong>Invoice ID:</strong>{" "}

                            {item.SalesInvoiceId}

                        </Typography>

                        <Typography>

                            <strong>Invoice Number:</strong>{" "}

                            {item.InvoiceNumber}

                        </Typography>

                        <Typography>

                            <strong>Sales Order ID:</strong>{" "}

                            {item.SalesOrderId}

                        </Typography>

                        <Typography>

                            <strong>Total Amount:</strong>{" "}

                            ₹ {Number(item.TotalAmount || 0).toFixed(2)}

                        </Typography>

                    </>

                )}

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

export default DeleteSalesInvoiceDialog;