import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Typography,
    Divider,
    Button,
    Chip,
    Box
} from "@mui/material";


/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {

    const amount = Number(value);

    if (!Number.isFinite(amount)) {

        return "₹ 0.00";

    }

    return `₹ ${amount.toLocaleString("en-IN", {

        minimumFractionDigits: 2,

        maximumFractionDigits: 2

    })}`;

};


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
   GET STATUS COLOR
========================================================= */

const getStatusColor = (status) => {

    switch (
        String(status || "").toLowerCase()
    ) {

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

    valueColor,

    fontWeight = "normal"

}) => {

    return (

        <Box>

            <Typography

                variant="body2"

                color="text.secondary"

                sx={{
                    mb: 0.5
                }}

            >

                {label}

            </Typography>


            <Typography

                variant="body1"

                color={
                    valueColor || "text.primary"
                }

                fontWeight={fontWeight}

            >

                {

                    value !== null &&
                    value !== undefined &&
                    value !== ""

                        ? value

                        : "-"

                }

            </Typography>

        </Box>

    );

};


/* =========================================================
   PURCHASE ORDER VIEW
========================================================= */

const PurchaseOrderView = ({

    open,

    item,

    onClose

}) => {


    /* =====================================================
       NO ITEM
    ===================================================== */

    if (!item) {

        return null;

    }


    /* =====================================================
       NORMALIZE API DATA
    ===================================================== */

    const purchaseOrderId =

        item.PurchaseOrderId ??
        item.purchaseOrderId ??
        0;


    const purchaseOrderNumber =

        item.PurchaseOrderNumber ??
        item.purchaseOrderNumber ??
        "-";


    const sellerId =

        item.SellerId ??
        item.sellerId ??
        "-";


    const supplierId =

        item.SupplierId ??
        item.supplierId ??
        "-";


    const orderDate =

        item.OrderDate ??
        item.orderDate;


    const expectedDeliveryDate =

        item.ExpectedDeliveryDate ??
        item.expectedDeliveryDate;


    const status =

        item.Status ??
        item.status ??
        "";


    const totalAmount =

        item.TotalAmount ??
        item.totalAmount ??
        0;


    const remarks =

        item.Remarks ??
        item.remarks ??
        "";


    const createdDate =

        item.CreatedDate ??
        item.createdDate;


    const updatedDate =

        item.UpdatedDate ??
        item.updatedDate;


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Dialog

            open={open}

            onClose={onClose}

            fullWidth

            maxWidth="md"

        >


            {/* =================================================
               TITLE
            ================================================= */}

            <DialogTitle>

                <Typography

                    variant="h6"

                    fontWeight="bold"

                >

                    Purchase Order Details

                </Typography>

            </DialogTitle>


            {/* =================================================
               CONTENT
            ================================================= */}

            <DialogContent dividers>

                <Grid

                    container

                    spacing={3}

                >


                    {/* =========================================
                       PURCHASE ORDER ID
                    ========================================= */}

                    <Grid

                        item

                        xs={12}

                        md={6}

                    >

                        <DetailItem

                            label="Purchase Order ID"

                            value={
                                purchaseOrderId
                            }

                            fontWeight="bold"

                        />

                    </Grid>


                    {/* =========================================
                       PURCHASE ORDER NUMBER
                    ========================================= */}

                    <Grid

                        item

                        xs={12}

                        md={6}

                    >

                        <DetailItem

                            label="Purchase Order Number"

                            value={
                                purchaseOrderNumber
                            }

                            fontWeight="bold"

                        />

                    </Grid>


                    {/* =========================================
                       SELLER ID
                    ========================================= */}

                    <Grid

                        item

                        xs={12}

                        md={6}

                    >

                        <DetailItem

                            label="Seller ID"

                            value={
                                sellerId
                            }

                        />

                    </Grid>


                    {/* =========================================
                       SUPPLIER ID
                    ========================================= */}

                    <Grid

                        item

                        xs={12}

                        md={6}

                    >

                        <DetailItem

                            label="Supplier ID"

                            value={
                                supplierId
                            }

                        />

                    </Grid>


                    {/* =========================================
                       ORDER DATE
                    ========================================= */}

                    <Grid

                        item

                        xs={12}

                        md={6}

                    >

                        <DetailItem

                            label="Order Date"

                            value={
                                formatDate(
                                    orderDate
                                )
                            }

                        />

                    </Grid>


                    {/* =========================================
                       EXPECTED DELIVERY DATE
                    ========================================= */}

                    <Grid

                        item

                        xs={12}

                        md={6}

                    >

                        <DetailItem

                            label="Expected Delivery Date"

                            value={
                                formatDate(
                                    expectedDeliveryDate
                                )
                            }

                        />

                    </Grid>


                    {/* =========================================
                       STATUS
                    ========================================= */}

                    <Grid

                        item

                        xs={12}

                        md={6}

                    >

                        <Typography

                            variant="body2"

                            color="text.secondary"

                            sx={{
                                mb: 0.5
                            }}

                        >

                            Status

                        </Typography>


                        <Chip

                            label={
                                status || "Unknown"
                            }

                            color={
                                getStatusColor(
                                    status
                                )
                            }

                            size="small"

                        />

                    </Grid>


                    {/* =========================================
                       TOTAL AMOUNT
                    ========================================= */}

                    <Grid

                        item

                        xs={12}

                        md={6}

                    >

                        <DetailItem

                            label="Total Amount"

                            value={
                                formatCurrency(
                                    totalAmount
                                )
                            }

                            valueColor="success.main"

                            fontWeight="bold"

                        />

                    </Grid>


                    {/* =========================================
                       DIVIDER
                    ========================================= */}

                    <Grid

                        item

                        xs={12}

                    >

                        <Divider />

                    </Grid>


                    {/* =========================================
                       REMARKS
                    ========================================= */}

                    <Grid

                        item

                        xs={12}

                    >

                        <Typography

                            variant="body2"

                            color="text.secondary"

                            sx={{
                                mb: 0.5
                            }}

                        >

                            Remarks

                        </Typography>


                        <Typography

                            variant="body1"

                            sx={{

                                whiteSpace:
                                    "pre-wrap",

                                wordBreak:
                                    "break-word"

                            }}

                        >

                            {
                                remarks || "-"
                            }

                        </Typography>

                    </Grid>


                    {/* =========================================
                       CREATED DATE
                    ========================================= */}

                    <Grid

                        item

                        xs={12}

                        md={6}

                    >

                        <DetailItem

                            label="Created Date"

                            value={
                                formatDate(
                                    createdDate
                                )
                            }

                        />

                    </Grid>


                    {/* =========================================
                       UPDATED DATE
                    ========================================= */}

                    <Grid

                        item

                        xs={12}

                        md={6}

                    >

                        <DetailItem

                            label="Updated Date"

                            value={
                                formatDate(
                                    updatedDate
                                )
                            }

                        />

                    </Grid>


                </Grid>

            </DialogContent>


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

                    variant="contained"

                    onClick={onClose}

                >

                    Close

                </Button>

            </DialogActions>


        </Dialog>

    );

};


export default PurchaseOrderView;
