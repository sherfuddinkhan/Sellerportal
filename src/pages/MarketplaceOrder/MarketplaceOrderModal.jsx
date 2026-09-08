
// =========================================================
// MarketplaceOrderModal.jsx
// =========================================================

import React from "react";

import {
    Box,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Typography,
    Button
} from "@mui/material";

import {
    Close
} from "@mui/icons-material";


const MarketplaceOrderModal = ({
    open,
    onClose,
    order
}) => {

    // =====================================================
    // NO ORDER
    // =====================================================

    if (!order) {
        return null;
    }


    // =====================================================
    // HELPERS
    // =====================================================

    const getValue = (
        camelCase,
        pascalCase,
        fallback = "-"
    ) => {

        const value =
            order?.[camelCase] ??
            order?.[pascalCase];


        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return fallback;
        }


        return value;
    };


    const formatDate = (
        camelCase,
        pascalCase
    ) => {

        const value =
            order?.[camelCase] ??
            order?.[pascalCase];


        if (!value) {
            return "-";
        }


        const date = new Date(value);


        if (Number.isNaN(date.getTime())) {
            return String(value);
        }


        return date.toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
    };


    const formatAmount = () => {

        const amount =
            order?.totalAmount ??
            order?.TotalAmount;


        if (
            amount === null ||
            amount === undefined ||
            amount === ""
        ) {
            return "-";
        }


        const currency =
            order?.currency ??
            order?.Currency ??
            "INR";


        try {

            return new Intl.NumberFormat(
                "en-IN",
                {
                    style: "currency",
                    currency: currency
                }
            ).format(Number(amount));

        } catch {

            return `${currency} ${amount}`;
        }
    };


    const getStatus = () => {

        return (
            order?.orderStatus ??
            order?.OrderStatus ??
            "-"
        );
    };


    const getStatusColor = () => {

        const currentStatus =
            String(getStatus()).toLowerCase();


        switch (currentStatus) {

            case "delivered":
                return "success";

            case "shipped":
                return "info";

            case "processing":
                return "warning";

            case "requested":
                return "warning";

            case "pending":
                return "default";

            case "cancelled":
                return "error";

            default:
                return "default";
        }
    };


    // =====================================================
    // UI
    // =====================================================

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

            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pr: 1
                }}
            >

                <Box>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Marketplace Order
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        #
                        {getValue(
                            "marketplaceOrderNumber",
                            "MarketplaceOrderNumber"
                        )}
                    </Typography>

                </Box>


                <IconButton
                    onClick={onClose}
                    aria-label="Close"
                >
                    <Close />
                </IconButton>

            </DialogTitle>


            <Divider />


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent>

                {/* =============================================
                    STATUS + TOTAL
                ============================================= */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: {
                            xs: "flex-start",
                            sm: "center"
                        },
                        flexDirection: {
                            xs: "column",
                            sm: "row"
                        },
                        gap: 2,
                        py: 2
                    }}
                >

                    <Box>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Order Status
                        </Typography>


                        <Box sx={{ mt: 0.5 }}>

                            <Chip
                                label={getStatus()}
                                color={getStatusColor()}
                                size="small"
                            />

                        </Box>

                    </Box>


                    <Box
                        sx={{
                            textAlign: {
                                xs: "left",
                                sm: "right"
                            }
                        }}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Total Amount
                        </Typography>


                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            {formatAmount()}
                        </Typography>

                    </Box>

                </Box>


                <Divider />


                {/* =============================================
                    ORDER INFORMATION
                ============================================= */}

                <Box sx={{ py: 2 }}>

                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        Order Information
                    </Typography>


                    <Grid
                        container
                        spacing={2}
                    >

                        <Grid item xs={12} sm={6}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Order ID
                            </Typography>


                            <Typography>
                                {getValue(
                                    "marketplaceOrderId",
                                    "MarketplaceOrderId"
                                )}
                            </Typography>

                        </Grid>


                        <Grid item xs={12} sm={6}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Marketplace Account ID
                            </Typography>


                            <Typography>
                                {getValue(
                                    "marketplaceAccountId",
                                    "MarketplaceAccountId"
                                )}
                            </Typography>

                        </Grid>


                        <Grid item xs={12} sm={6}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Marketplace Order Number
                            </Typography>


                            <Typography>
                                {getValue(
                                    "marketplaceOrderNumber",
                                    "MarketplaceOrderNumber"
                                )}
                            </Typography>

                        </Grid>


                        <Grid item xs={12} sm={6}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                External Order ID
                            </Typography>


                            <Typography>
                                {getValue(
                                    "externalOrderId",
                                    "ExternalOrderId"
                                )}
                            </Typography>

                        </Grid>


                        <Grid item xs={12} sm={6}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Seller Order Number
                            </Typography>


                            <Typography>
                                {getValue(
                                    "sellerOrderNumber",
                                    "SellerOrderNumber"
                                )}
                            </Typography>

                        </Grid>


                        <Grid item xs={12} sm={6}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Order Date
                            </Typography>


                            <Typography>
                                {formatDate(
                                    "orderDate",
                                    "OrderDate"
                                )}
                            </Typography>

                        </Grid>


                        <Grid item xs={12} sm={6}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Fulfillment Channel
                            </Typography>


                            <Typography>
                                {getValue(
                                    "fulfillmentChannel",
                                    "FulfillmentChannel"
                                )}
                            </Typography>

                        </Grid>


                        <Grid item xs={12} sm={6}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Currency
                            </Typography>


                            <Typography>
                                {getValue(
                                    "currency",
                                    "Currency"
                                )}
                            </Typography>

                        </Grid>


                        <Grid item xs={12} sm={6}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Purchase Order Number
                            </Typography>


                            <Typography>
                                {getValue(
                                    "purchaseOrderNumber",
                                    "PurchaseOrderNumber"
                                )}
                            </Typography>

                        </Grid>

                    </Grid>

                </Box>


                <Divider />


                {/* =============================================
                    BUYER INFORMATION
                ============================================= */}

                <Box sx={{ py: 2 }}>

                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        Buyer Information
                    </Typography>


                    <Grid
                        container
                        spacing={2}
                    >

                        <Grid item xs={12} sm={6}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Buyer Name
                            </Typography>


                            <Typography>
                                {getValue(
                                    "buyerName",
                                    "BuyerName"
                                )}
                            </Typography>

                        </Grid>


                        <Grid item xs={12} sm={6}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Buyer Email
                            </Typography>


                            <Typography>
                                {getValue(
                                    "buyerEmail",
                                    "BuyerEmail"
                                )}
                            </Typography>

                        </Grid>

                    </Grid>

                </Box>


                <Divider />


                {/* =============================================
                    AUDIT INFORMATION
                ============================================= */}

                <Box sx={{ py: 2 }}>

                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        Audit Information
                    </Typography>


                    <Grid
                        container
                        spacing={2}
                    >

                        <Grid item xs={12} sm={4}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Last Sync Date
                            </Typography>


                            <Typography>
                                {formatDate(
                                    "lastSyncDate",
                                    "LastSyncDate"
                                )}
                            </Typography>

                        </Grid>


                        <Grid item xs={12} sm={4}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Created Date
                            </Typography>


                            <Typography>
                                {formatDate(
                                    "createdDate",
                                    "CreatedDate"
                                )}
                            </Typography>

                        </Grid>


                        <Grid item xs={12} sm={4}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Updated Date
                            </Typography>


                            <Typography>
                                {formatDate(
                                    "updatedDate",
                                    "UpdatedDate"
                                )}
                            </Typography>

                        </Grid>

                    </Grid>

                </Box>

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
                    variant="outlined"
                    onClick={onClose}
                >
                    Close
                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default MarketplaceOrderModal;

