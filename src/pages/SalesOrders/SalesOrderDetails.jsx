
import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Divider,
    Chip,
    Box
} from "@mui/material";


/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {

    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};


/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {

    const amount = Number(value || 0);

    return `₹ ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};


/* =========================================================
   STATUS COLOR
========================================================= */

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


/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({
    label,
    value
}) => {

    return (
        <Grid
            item
            xs={12}
            sm={6}
        >

            <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={500}
            >
                {value || "-"}
            </Typography>

        </Grid>
    );
};


/* =========================================================
   SALES ORDER DETAILS
========================================================= */

const SalesOrderDetails = ({
    open,
    item,
    onClose
}) => {

    if (!item) {
        return null;
    }


    return (
        <Dialog
            open={Boolean(open)}
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
                    spacing={3}
                >

                    <DetailItem
                        label="Sales Order ID"
                        value={item.SalesOrderId}
                    />


                    <DetailItem
                        label="Sales Order Number"
                        value={
                            item.SalesOrderNumber
                        }
                    />


                    <DetailItem
                        label="Seller ID"
                        value={item.SellerId}
                    />


                    <DetailItem
                        label="Customer ID"
                        value={item.CustomerId}
                    />


                    <DetailItem
                        label="Order Date"
                        value={formatDate(item.OrderDate)}
                    />


                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                        >
                            Status
                        </Typography>

                        <Chip
                            label={
                                item.Status || "-"
                            }
                            color={
                                getStatusColor(
                                    item.Status
                                )
                            }
                            size="small"
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                        >
                            Total Amount
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            {formatCurrency(
                                item.TotalAmount
                            )}
                        </Typography>

                    </Grid>


                    <DetailItem
                        label="Created Date"
                        value={
                            formatDate(
                                item.CreatedDate
                            )
                        }
                    />


                    <DetailItem
                        label="Updated Date"
                        value={
                            formatDate(
                                item.UpdatedDate
                            )
                        }
                    />


                    <Grid item xs={12}>

                        <Divider />

                    </Grid>


                    <Grid item xs={12}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                        >
                            Remarks
                        </Typography>

                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 1,
                                bgcolor: "background.default",
                                minHeight: 60
                            }}
                        >

                            <Typography variant="body1">
                                {item.Remarks || "-"}
                            </Typography>

                        </Box>

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


export default SalesOrderDetails;

