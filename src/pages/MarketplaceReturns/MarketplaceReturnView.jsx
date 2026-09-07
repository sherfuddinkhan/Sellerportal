import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Typography,
    Button,
    Divider
} from "@mui/material";

const MarketplaceReturnView = ({
    open,
    onClose,
    marketplaceReturn
}) => {

    if (!marketplaceReturn) return null;

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleString();

    };

    const formatAmount = (amount) => {

        return `₹ ${Number(amount || 0).toLocaleString()}`;

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>

                Marketplace Return Details

            </DialogTitle>

            <DialogContent dividers>

                <Grid
                    container
                    spacing={3}
                >

                    <Grid item xs={12}>

                        <Divider sx={{ mb: 2 }}>

                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                            >

                                Return Information

                            </Typography>

                        </Divider>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">

                            Marketplace Return ID

                        </Typography>

                        <Typography>

                            {marketplaceReturn.MarketplaceReturnId}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">

                            Return Number

                        </Typography>

                        <Typography>

                            {marketplaceReturn.ReturnNumber || "-"}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">

                            Marketplace Order Item ID

                        </Typography>

                        <Typography>

                            {marketplaceReturn.MarketplaceOrderItemId}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">

                            Quantity Returned

                        </Typography>

                        <Typography>

                            {marketplaceReturn.QuantityReturned ?? 0}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">

                            Return Status

                        </Typography>

                        <Typography>

                            {marketplaceReturn.ReturnStatus || "-"}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">

                            Refund Amount

                        </Typography>

                        <Typography
                            color="primary"
                            fontWeight="bold"
                        >

                            {formatAmount(
                                marketplaceReturn.RefundAmount
                            )}

                        </Typography>

                    </Grid>

                    <Grid item xs={12}>

                        <Divider sx={{ my: 2 }}>

                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                            >

                                Return Details

                            </Typography>

                        </Divider>

                    </Grid>

                    <Grid item xs={12}>

                        <Typography variant="subtitle2">

                            Return Reason

                        </Typography>

                        <Typography>

                            {marketplaceReturn.ReturnReason || "-"}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">

                            Return Date

                        </Typography>

                        <Typography>

                            {formatDate(
                                marketplaceReturn.ReturnDate
                            )}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">

                            Created Date

                        </Typography>

                        <Typography>

                            {formatDate(
                                marketplaceReturn.CreatedDate
                            )}

                        </Typography>

                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions>

                <Button
                    variant="contained"
                    onClick={onClose}
                >

                    Close

                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default MarketplaceReturnView;