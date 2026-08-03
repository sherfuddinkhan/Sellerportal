import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Typography,
    Button,
    Divider,
    Chip
} from "@mui/material";

const formatDate = (value) =>
    value
        ? new Date(value).toLocaleDateString()
        : "-";

const formatCurrency = (value) =>
    `₹ ${Number(value || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

const getStatusColor = (status) => {

    switch ((status || "").toLowerCase()) {

        case "completed":
            return "success";

        case "processing":
            return "info";

        case "pending":
            return "warning";

        case "cancelled":
            return "error";

        default:
            return "default";

    }

};

const SalesOrderView = ({

    open,

    item,

    onClose

}) => {

    if (!item) return null;

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>

                Sales Order Details

            </DialogTitle>

            <DialogContent dividers>

                <Grid
                    container
                    spacing={2}
                >

                    <Grid item xs={12} md={6}>

                        <Typography>

                            <strong>Sales Order ID:</strong>

                        </Typography>

                        <Typography>

                            {item.SalesOrderId}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography>

                            <strong>Sales Order Number:</strong>

                        </Typography>

                        <Typography>

                            {item.SalesOrderNumber}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography>

                            <strong>Seller ID:</strong>

                        </Typography>

                        <Typography>

                            {item.SellerId}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography>

                            <strong>Customer ID:</strong>

                        </Typography>

                        <Typography>

                            {item.CustomerId}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography>

                            <strong>Order Date:</strong>

                        </Typography>

                        <Typography>

                            {formatDate(item.OrderDate)}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography>

                            <strong>Status:</strong>

                        </Typography>

                        <Chip
                            label={item.Status || "-"}
                            color={getStatusColor(item.Status)}
                            size="small"
                            sx={{ mt: 1 }}
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography>

                            <strong>Total Amount:</strong>

                        </Typography>

                        <Typography>

                            {formatCurrency(item.TotalAmount)}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography>

                            <strong>Created Date:</strong>

                        </Typography>

                        <Typography>

                            {formatDate(item.CreatedDate)}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography>

                            <strong>Updated Date:</strong>

                        </Typography>

                        <Typography>

                            {formatDate(item.UpdatedDate)}

                        </Typography>

                    </Grid>

                    <Grid item xs={12}>

                        <Divider sx={{ my: 1 }} />

                    </Grid>

                    <Grid item xs={12}>

                        <Typography>

                            <strong>Remarks:</strong>

                        </Typography>

                        <Typography>

                            {item.Remarks || "-"}

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

export default SalesOrderView;