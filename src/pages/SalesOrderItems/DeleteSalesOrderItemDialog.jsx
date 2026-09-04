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


// =========================================================
// FORMAT CURRENCY
// =========================================================


const formatCurrency = (value) =>
    `₹ ${Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;




// =========================================================
// DELETE SALES ORDER ITEM DIALOG
// =========================================================

const DeleteSalesOrderItemDialog = ({
    open = false,
    item = null,
    onClose,
    onDeleted
}) => {

    // =====================================================
    // HANDLE DELETE
    // =====================================================

    const handleDelete = () => {

        if (!item) {
            return;
        }

        if (
            typeof onDeleted !== "function"
        ) {
            return;
        }

        const id =
            item.SalesOrderItemId ??
            item.salesOrderItemId;

        if (!id) {
            return;
        }

        onDeleted(id);
    };


    // =====================================================
    // CLOSE DIALOG
    // =====================================================

    const handleClose = () => {

        if (
            typeof onClose === "function"
        ) {
            onClose();
        }

    };


    return (

        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle>

                Delete Sales Order Item

            </DialogTitle>


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent>

                <DialogContentText
                    sx={{
                        mb: 2
                    }}
                >

                    Are you sure you want to delete this
                    Sales Order Item?

                    <br />

                    This action cannot be undone.

                </DialogContentText>


                {/* =================================================
                    ITEM DETAILS
                ================================================= */}

                {item && (

                    <Box>

                        <Typography
                            variant="body2"
                            sx={{ mb: 1 }}
                        >

                            <strong>
                                Sales Order Item ID:
                            </strong>{" "}

                            {item.SalesOrderItemId ??
                                item.salesOrderItemId ??
                                "-"}

                        </Typography>


                        <Typography
                            variant="body2"
                            sx={{ mb: 1 }}
                        >

                            <strong>
                                Sales Order ID:
                            </strong>{" "}

                            {item.SalesOrderId ??
                                item.salesOrderId ??
                                "-"}

                        </Typography>


                        <Typography
                            variant="body2"
                            sx={{ mb: 1 }}
                        >

                            <strong>
                                Product ID:
                            </strong>{" "}

                            {item.ProductId ??
                                item.productId ??
                                "-"}

                        </Typography>


                        <Typography
                            variant="body2"
                            sx={{ mb: 1 }}
                        >

                            <strong>
                                Line Number:
                            </strong>{" "}

                            {item.LineNumber ??
                                item.lineNumber ??
                                0}

                        </Typography>


                        <Typography
                            variant="body2"
                            sx={{ mb: 1 }}
                        >

                            <strong>
                                Quantity:
                            </strong>{" "}

                            {Number(
                                item.Quantity ??
                                item.quantity ??
                                0
                            ).toLocaleString("en-IN")}

                        </Typography>


                        <Typography
                            variant="body2"
                            sx={{ mb: 1 }}
                        >

                            <strong>
                                Unit Price:
                            </strong>{" "}

                            {formatCurrency(
                                item.UnitPrice ??
                                item.unitPrice
                            )}

                        </Typography>


                        <Typography
                            variant="body2"
                            sx={{ mb: 1 }}
                        >

                            <strong>
                                Discount:
                            </strong>{" "}

                            {formatCurrency(
                                item.DiscountAmount ??
                                item.discountAmount
                            )}

                        </Typography>


                        <Typography
                            variant="body2"
                            sx={{ mb: 1 }}
                        >

                            <strong>
                                Tax Amount:
                            </strong>{" "}

                            {formatCurrency(
                                item.TaxAmount ??
                                item.taxAmount
                            )}

                        </Typography>


                        <Typography
                            variant="body2"
                            sx={{ mb: 1 }}
                        >

                            <strong>
                                Total Amount:
                            </strong>{" "}

                            {formatCurrency(
                                item.TotalAmount ??
                                item.totalAmount
                            )}

                        </Typography>


                        {(
                            item.Remarks ??
                            item.remarks
                        ) && (

                            <Typography
                                variant="body2"
                                sx={{ mb: 1 }}
                            >

                                <strong>
                                    Remarks:
                                </strong>{" "}

                                {item.Remarks ??
                                    item.remarks}

                            </Typography>

                        )}

                    </Box>

                )}

            </DialogContent>


            <Divider />


            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    py: 2
                }}
            >

                <Button
                    onClick={handleClose}
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


export default DeleteSalesOrderItemDialog;
