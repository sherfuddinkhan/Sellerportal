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

const PurchaseReturnView = ({
    open,
    onClose,
    purchaseReturn
}) => {

    if (!purchaseReturn) return null;

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

                Purchase Return Details

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

                                Purchase Return Information

                            </Typography>

                        </Divider>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">
                            Purchase Return ID
                        </Typography>

                        <Typography>
                            {purchaseReturn.PurchaseReturnId}
                        </Typography>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">
                            Purchase Return Number
                        </Typography>

                        <Typography>
                            {purchaseReturn.PurchaseReturnNumber}
                        </Typography>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">
                            Purchase Order ID
                        </Typography>

                        <Typography>
                            {purchaseReturn.PurchaseOrderId}
                        </Typography>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">
                            Goods Receipt Note ID
                        </Typography>

                        <Typography>
                            {purchaseReturn.GoodsReceiptNoteId}
                        </Typography>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">
                            Supplier ID
                        </Typography>

                        <Typography>
                            {purchaseReturn.SupplierId}
                        </Typography>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">
                            Return Date
                        </Typography>

                        <Typography>
                            {formatDate(
                                purchaseReturn.ReturnDate
                            )}
                        </Typography>

                    </Grid>

                    <Grid item xs={12}>

                        <Divider sx={{ my: 2 }}>

                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                            >

                                Financial Details

                            </Typography>

                        </Divider>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">
                            Total Amount
                        </Typography>

                        <Typography
                            color="primary"
                            fontWeight="bold"
                        >
                            {formatAmount(
                                purchaseReturn.TotalAmount
                            )}
                        </Typography>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle2">
                            Status
                        </Typography>

                        <Typography>
                            {purchaseReturn.Status || "-"}
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
                            Reason
                        </Typography>

                        <Typography>
                            {purchaseReturn.Reason || "-"}
                        </Typography>

                    </Grid>

                    <Grid item xs={12}>

                        <Typography variant="subtitle2">
                            Created Date
                        </Typography>

                        <Typography>
                            {formatDate(
                                purchaseReturn.CreatedDate
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

export default PurchaseReturnView;