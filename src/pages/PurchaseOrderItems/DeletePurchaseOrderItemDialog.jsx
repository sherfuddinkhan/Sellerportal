import React from "react";
import {Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions,Button,Typography} from "@mui/material";


const formatCurrency = (value) =>
    `₹ ${Number(value || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

const DeletePurchaseOrderItemDialog = ({
    open,
    item,
    onClose,
    onDeleted
}) => {

    const handleDelete = () => {
        if (!item)
            return;
        onDeleted(
            item.PurchaseOrderItemId
        );
    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Delete Purchase Order Item
            </DialogTitle>
            <DialogContent>
                <DialogContentText
                    sx={{
                        mb: 2
                    }}
                >
                    Are you sure you want to delete this Purchase Order Item?
                    This action cannot be undone.
                </DialogContentText>
                {
                    item && (
                        <>
                            <Typography>
                                <strong>
                                    Item ID:
                                </strong>
                                {" "}
                                {
                                    item.PurchaseOrderItemId
                                }
                            </Typography>
                            <Typography>
                                <strong>
                                    Purchase Order ID:
                                </strong>
                                {" "}
                                {
                                    item.PurchaseOrderId
                                }
                            </Typography>
                            <Typography>
                                <strong>
                                    Product ID:
                                </strong>
                                {" "}
                                {
                                    item.ProductId
                                }
                            </Typography>
                            <Typography>
                                <strong>
                                    Quantity:
                                </strong>
                                {" "}
                                {
                                    item.Quantity
                                }
                            </Typography>
                            <Typography>
                                <strong>
                                    Unit Price:
                                </strong>
                                {" "}
                                {
                                    formatCurrency(
                                        item.UnitPrice
                                    )
                                }
                            </Typography>
                            <Typography>
                                <strong>
                                    Total Amount:
                                </strong>
                                {" "}
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
export default DeletePurchaseOrderItemDialog;