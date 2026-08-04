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

const DeliveryChallanItemView = ({
    open,
    onClose,
    deliveryChallanItem
}) => {

    if (!deliveryChallanItem) return null;

    const formatAmount = (value) =>
        `₹ ${Number(value || 0).toLocaleString()}`;

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleString();

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>

                Delivery Challan Item Details

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

                                Item Information

                            </Typography>

                        </Divider>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">

                            Delivery Challan Item ID

                        </Typography>

                        <Typography>

                            {deliveryChallanItem.DeliveryChallanItemId}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">

                            Delivery Challan ID

                        </Typography>

                        <Typography>

                            {deliveryChallanItem.DeliveryChallanId}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">

                            Product ID

                        </Typography>

                        <Typography>

                            {deliveryChallanItem.ProductId}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">

                            Quantity

                        </Typography>

                        <Typography>

                            {deliveryChallanItem.Quantity}

                        </Typography>

                    </Grid>

                    <Grid item xs={12}>

                        <Divider sx={{ my: 2 }}>

                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                            >

                                Pricing Details

                            </Typography>

                        </Divider>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">

                            Unit Price

                        </Typography>

                        <Typography>

                            {formatAmount(
                                deliveryChallanItem.UnitPrice
                            )}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">

                            Discount

                        </Typography>

                        <Typography>

                            {formatAmount(
                                deliveryChallanItem.Discount
                            )}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">

                            Tax Amount

                        </Typography>

                        <Typography>

                            {formatAmount(
                                deliveryChallanItem.TaxAmount
                            )}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">

                            Total Amount

                        </Typography>

                        <Typography
                            fontWeight="bold"
                            color="primary"
                        >

                            {formatAmount(
                                deliveryChallanItem.TotalAmount
                            )}

                        </Typography>

                    </Grid>

                    <Grid item xs={12}>

                        <Divider sx={{ my: 2 }}>

                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                            >

                                Additional Information

                            </Typography>

                        </Divider>

                    </Grid>

                    <Grid item xs={12}>

                        <Typography variant="subtitle2">

                            Remarks

                        </Typography>

                        <Typography>

                            {deliveryChallanItem.Remarks || "-"}

                        </Typography>

                    </Grid>

                    <Grid item xs={12}>

                        <Typography variant="subtitle2">

                            Created Date

                        </Typography>

                        <Typography>

                            {formatDate(
                                deliveryChallanItem.CreatedDate
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

export default DeliveryChallanItemView;