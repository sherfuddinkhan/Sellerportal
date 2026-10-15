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
    value,
    children
}) => {

    return (
        <Grid
            item
            xs={12}
            md={6}
        >
            <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
            >
                {label}
            </Typography>

            {children || (
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 500
                    }}
                >
                    {value || "-"}
                </Typography>
            )}
        </Grid>
    );
};


/* =========================================================
   SALES ORDER VIEW
========================================================= */

const SalesOrderView = ({
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

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle>
                Sales Order Details
            </DialogTitle>


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent dividers>

                <Grid
                    container
                    spacing={3}
                >

                    {/* Sales Order ID */}

                    <DetailItem
                        label="Sales Order ID"
                        value={item.SalesOrderId}
                    />


                    {/* Sales Order Number */}

                    <DetailItem
                        label="Sales Order Number"
                        value={item.SalesOrderNumber}
                    />


                    {/* Seller ID */}

                    <DetailItem
                        label="Seller ID"
                        value={item.SellerId}
                    />


                    {/* Customer ID */}

                    <DetailItem
                        label="Customer ID"
                        value={item.CustomerId}
                    />


                    {/* Order Date */}

                    <DetailItem
                        label="Order Date"
                        value={formatDate(item.OrderDate)}
                    />


                    {/* Status */}

                    <DetailItem label="Status">

                        <Chip
                            label={item.Status || "-"}
                            color={getStatusColor(item.Status)}
                            size="small"
                        />

                    </DetailItem>


                    {/* Total Amount */}

                    <DetailItem
                        label="Total Amount"
                        value={formatCurrency(item.TotalAmount)}
                    />


                    {/* Created Date */}

                    <DetailItem
                        label="Created Date"
                        value={formatDate(item.CreatedDate)}
                    />


                    {/* Updated Date */}

                    <DetailItem
                        label="Updated Date"
                        value={formatDate(item.UpdatedDate)}
                    />


                    {/* =================================================
                        DIVIDER
                    ================================================= */}

                    <Grid xs={12}>

                        <Divider />

                    </Grid>


                    {/* =================================================
                        REMARKS
                    ================================================= */}

                    <Grid xs={12}>

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
                                backgroundColor: "background.default",
                                minHeight: 60
                            }}
                        >

                            <Typography
                                variant="body1"
                            >
                                {item.Remarks || "-"}
                            </Typography>

                        </Box>

                    </Grid>

                </Grid>

            </DialogContent>


            {/* =================================================
                ACTIONS
            ================================================= */}

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
