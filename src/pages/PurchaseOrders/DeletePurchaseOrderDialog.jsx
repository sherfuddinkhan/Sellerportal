import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Stack,
    Divider,
    Box,
    Chip
} from "@mui/material";

import {
    Delete,
    Warning
} from "@mui/icons-material";


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
   DETAIL ITEM
========================================================= */

const DetailItem = ({
    label,
    value
}) => {

    return (

        <Box>

            <Typography
                variant="caption"
                color="text.secondary"
                display="block"
            >

                {label}

            </Typography>


            <Typography
                variant="body2"
                fontWeight={500}
                sx={{
                    wordBreak: "break-word"
                }}
            >

                {value ?? "-"}

            </Typography>

        </Box>

    );

};


/* =========================================================
   STATUS COLOR
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
   DELETE PURCHASE ORDER DIALOG
========================================================= */

const DeletePurchaseOrderDialog = ({

    open,

    item,

    onClose,

    onDeleted

}) => {


    /* =====================================================
       NORMALIZE API DATA
    ===================================================== */

    const purchaseOrderId =

        item?.PurchaseOrderId ??
        item?.purchaseOrderId ??
        0;


    const purchaseOrderNumber =

        item?.PurchaseOrderNumber ??
        item?.purchaseOrderNumber ??
        "-";


    const sellerId =

        item?.SellerId ??
        item?.sellerId ??
        "-";


    const supplierId =

        item?.SupplierId ??
        item?.supplierId ??
        "-";


    const status =

        item?.Status ??
        item?.status ??
        "";


    const totalAmount =

        item?.TotalAmount ??
        item?.totalAmount ??
        0;


    const remarks =

        item?.Remarks ??
        item?.remarks ??
        "";


    /* =====================================================
       HANDLE DELETE
    ===================================================== */

    const handleDelete = () => {

        if (!item) {

            return;

        }


        if (
            typeof onDeleted !==
            "function"
        ) {

            return;

        }


        onDeleted(
            purchaseOrderId
        );

    };


    /* =====================================================
       HANDLE CLOSE
    ===================================================== */

    const handleClose = () => {

        if (
            typeof onClose ===
            "function"
        ) {

            onClose();

        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Dialog

            open={Boolean(open)}

            onClose={handleClose}

            fullWidth

            maxWidth="sm"

            aria-labelledby="delete-purchase-order-title"

        >


            {/* =================================================
               TITLE
            ================================================= */}

            <DialogTitle
                id="delete-purchase-order-title"
            >

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                >

                    <Warning
                        color="error"
                    />

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >

                        Delete Purchase Order

                    </Typography>

                </Stack>

            </DialogTitle>


            {/* =================================================
               CONTENT
            ================================================= */}

            <DialogContent>


                {/* =============================================
                   WARNING MESSAGE
                ============================================= */}

                <DialogContentText
                    sx={{
                        mb: 2
                    }}
                >

                    Are you sure you want to delete this
                    Purchase Order?

                    <br />

                    <strong>
                        This action cannot be undone.
                    </strong>

                </DialogContentText>


                {/* =============================================
                   PURCHASE ORDER DETAILS
                ============================================= */}

                {item ? (

                    <Box>

                        <Divider sx={{ mb: 2 }} />


                        <Stack spacing={2}>


                            {/* ---------------------------------
                               ORDER NUMBER
                            --------------------------------- */}

                            <DetailItem

                                label="Order Number"

                                value={
                                    purchaseOrderNumber
                                }

                            />


                            {/* ---------------------------------
                               PURCHASE ORDER ID
                            --------------------------------- */}

                            <DetailItem

                                label="Purchase Order ID"

                                value={
                                    purchaseOrderId
                                }

                            />


                            {/* ---------------------------------
                               SELLER ID
                            --------------------------------- */}

                            <DetailItem

                                label="Seller ID"

                                value={
                                    sellerId
                                }

                            />


                            {/* ---------------------------------
                               SUPPLIER ID
                            --------------------------------- */}

                            <DetailItem

                                label="Supplier ID"

                                value={
                                    supplierId
                                }

                            />


                            {/* ---------------------------------
                               STATUS
                            --------------------------------- */}

                            <Box>

                                <Typography

                                    variant="caption"

                                    color="text.secondary"

                                    display="block"

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

                            </Box>


                            {/* ---------------------------------
                               TOTAL AMOUNT
                            --------------------------------- */}

                            <DetailItem

                                label="Total Amount"

                                value={
                                    formatCurrency(
                                        totalAmount
                                    )
                                }

                            />


                            {/* ---------------------------------
                               REMARKS
                            --------------------------------- */}

                            <DetailItem

                                label="Remarks"

                                value={
                                    remarks || "-"
                                }

                            />


                        </Stack>

                    </Box>

                ) : (

                    <Typography
                        color="text.secondary"
                    >

                        No Purchase Order selected.

                    </Typography>

                )}

            </DialogContent>


            {/* =================================================
               ACTIONS
            ================================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2
                }}
            >


                {/* =============================================
                   CANCEL
                ============================================= */}

                <Button

                    onClick={handleClose}

                    color="inherit"

                    variant="outlined"

                >

                    Cancel

                </Button>


                {/* =============================================
                   DELETE
                ============================================= */}

                <Button

                    variant="contained"

                    color="error"

                    startIcon={
                        <Delete />
                    }

                    onClick={handleDelete}

                    disabled={
                        !item ||
                        !purchaseOrderId
                    }

                >

                    Delete

                </Button>


            </DialogActions>

        </Dialog>

    );

};


export default DeletePurchaseOrderDialog;
