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

const DeleteMarketplaceReturnDialog = ({
    open,
    onClose,
    marketplaceReturn,
    onDeleted
}) => {

    const handleDelete = () => {

        if (marketplaceReturn?.MarketplaceReturnId) {

            onDeleted(
                marketplaceReturn.MarketplaceReturnId
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

                Delete Marketplace Return

            </DialogTitle>

            <DialogContent>

                <DialogContentText>

                    Are you sure you want to delete this
                    Marketplace Return? This action cannot be undone.

                </DialogContentText>

                {

                    marketplaceReturn && (

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

                                <strong>Marketplace Return ID :</strong>{" "}

                                {marketplaceReturn.MarketplaceReturnId}

                            </Typography>

                            <Typography>

                                <strong>Marketplace Order Item ID :</strong>{" "}

                                {marketplaceReturn.MarketplaceOrderItemId}

                            </Typography>

                            <Typography>

                                <strong>Return Number :</strong>{" "}

                                {marketplaceReturn.ReturnNumber || "-"}

                            </Typography>

                            <Typography>

                                <strong>Return Status :</strong>{" "}

                                {marketplaceReturn.ReturnStatus || "-"}

                            </Typography>

                            <Typography>

                                <strong>Quantity Returned :</strong>{" "}

                                {marketplaceReturn.QuantityReturned ?? 0}

                            </Typography>

                            <Typography>

                                <strong>Refund Amount :</strong>{" "}

                                ₹
                                {Number(
                                    marketplaceReturn.RefundAmount || 0
                                ).toLocaleString()}

                            </Typography>

                            <Typography>

                                <strong>Return Date :</strong>{" "}

                                {

                                    marketplaceReturn.ReturnDate

                                        ?

                                        new Date(
                                            marketplaceReturn.ReturnDate
                                        ).toLocaleDateString()

                                        :

                                        "-"

                                }

                            </Typography>

                            <Typography>

                                <strong>Return Reason :</strong>{" "}

                                {marketplaceReturn.ReturnReason || "-"}

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

export default DeleteMarketplaceReturnDialog;