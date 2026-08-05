import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Box
} from "@mui/material";

import {
    WarningAmber
} from "@mui/icons-material";

const DeletePurchaseReturnDialog = ({
    open,
    onClose,
    purchaseReturn,
    onDeleted
}) => {

    const handleDelete = () => {

        if (purchaseReturn?.PurchaseReturnId) {

            onDeleted(
                purchaseReturn.PurchaseReturnId
            );

        }

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                }}
            >

                <WarningAmber color="error" />

                Delete Purchase Return

            </DialogTitle>

            <DialogContent>

                <DialogContentText>

                    Are you sure you want to delete this
                    Purchase Return? This action cannot be undone.

                </DialogContentText>

                {

                    purchaseReturn && (

                        <Box
                            sx={{
                                mt: 3,
                                p: 2,
                                border: "1px solid #e0e0e0",
                                borderRadius: 2,
                                backgroundColor: "#fafafa"
                            }}
                        >

                            <Typography>

                                <strong>Purchase Return ID :</strong>{" "}

                                {purchaseReturn.PurchaseReturnId}

                            </Typography>

                            <Typography>

                                <strong>Return Number :</strong>{" "}

                                {purchaseReturn.PurchaseReturnNumber}

                            </Typography>

                            <Typography>

                                <strong>Purchase Order ID :</strong>{" "}

                                {purchaseReturn.PurchaseOrderId}

                            </Typography>

                            <Typography>

                                <strong>Goods Receipt Note ID :</strong>{" "}

                                {purchaseReturn.GoodsReceiptNoteId}

                            </Typography>

                            <Typography>

                                <strong>Supplier ID :</strong>{" "}

                                {purchaseReturn.SupplierId}

                            </Typography>

                            <Typography>

                                <strong>Return Date :</strong>{" "}

                                {

                                    purchaseReturn.ReturnDate

                                        ?

                                        new Date(
                                            purchaseReturn.ReturnDate
                                        ).toLocaleDateString()

                                        :

                                        "-"

                                }

                            </Typography>

                            <Typography>

                                <strong>Total Amount :</strong>{" "}

                                ₹
                                {Number(
                                    purchaseReturn.TotalAmount || 0
                                ).toLocaleString()}

                            </Typography>

                            <Typography>

                                <strong>Status :</strong>{" "}

                                {purchaseReturn.Status || "-"}

                            </Typography>

                        </Box>

                    )

                }

            </DialogContent>

            <DialogActions>

                <Button
                    variant="outlined"
                    onClick={onClose}
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

export default DeletePurchaseReturnDialog;