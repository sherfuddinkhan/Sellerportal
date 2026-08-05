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

const DeleteDeliveryChallanItemDialog = ({
    open,
    onClose,
    deliveryChallanItem,
    onDeleted
}) => {

    const handleDelete = () => {

        if (deliveryChallanItem?.DeliveryChallanItemId) {

            onDeleted(
                deliveryChallanItem.DeliveryChallanItemId
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

                Delete Delivery Challan Item

            </DialogTitle>

            <DialogContent>

                <DialogContentText>

                    Are you sure you want to delete this
                    Delivery Challan Item?

                </DialogContentText>

                {

                    deliveryChallanItem && (

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

                                <strong>Item ID :</strong>{" "}

                                {deliveryChallanItem.DeliveryChallanItemId}

                            </Typography>

                            <Typography>

                                <strong>Delivery Challan :</strong>{" "}

                                {deliveryChallanItem.DeliveryChallanId}

                            </Typography>

                            <Typography>

                                <strong>Product :</strong>{" "}

                                {deliveryChallanItem.ProductId}

                            </Typography>

                            <Typography>

                                <strong>Quantity :</strong>{" "}

                                {deliveryChallanItem.Quantity}

                            </Typography>

                            <Typography>

                                <strong>Unit Price :</strong>{" "}

                                ₹
                                {Number(
                                    deliveryChallanItem.UnitPrice || 0
                                ).toLocaleString()}

                            </Typography>

                            <Typography>

                                <strong>Total Amount :</strong>{" "}

                                ₹
                                {Number(
                                    deliveryChallanItem.TotalAmount || 0
                                ).toLocaleString()}

                            </Typography>

                            <Typography>

                                <strong>Remarks :</strong>{" "}

                                {deliveryChallanItem.Remarks || "-"}

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

export default DeleteDeliveryChallanItemDialog;