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
   ORDER STATUS HISTORY VIEW
========================================================= */

const OrderStatusHistoryView = ({
    open,
    item,
    onClose
}) => {

    /* =====================================================
       EMPTY STATE
    ===================================================== */

    if (!item) {
        return null;
    }


    /* =====================================================
       NORMALIZE API FIELDS
       Supports both camelCase and PascalCase
    ===================================================== */

    const historyId =
        item.orderStatusHistoryId ??
        item.OrderStatusHistoryId ??
        item.historyId ??
        item.HistoryId ??
        "-";

    const sellerId =
        item.sellerId ??
        item.SellerId ??
        "-";

    const customerId =
        item.customerId ??
        item.CustomerId ??
        "-";

    const orderId =
        item.orderId ??
        item.OrderId ??
        "-";

    const status =
        item.status ??
        item.Status ??
        "";

    const remarks =
        item.remarks ??
        item.Remarks ??
        "";

    const changedOn =
        item.changedOn ??
        item.ChangedOn ??
        null;

    const timestamp =
        item.timestamp ??
        item.Timestamp ??
        null;


    /* =====================================================
       STATUS COLOR
    ===================================================== */

    const getStatusColor = (value) => {

        switch (
            String(value || "")
                .toLowerCase()
        ) {

            case "pending":
                return "warning";

            case "confirmed":
                return "info";

            case "processing":
                return "primary";

            case "packed":
                return "secondary";

            case "shipped":
                return "success";

            case "delivered":
                return "success";

            case "cancelled":
                return "error";

            case "returned":
                return "error";

            default:
                return "default";
        }
    };


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    const formatDateTime = (value) => {

        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "-";
        }

        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );
    };


    /* =====================================================
       FIELD COMPONENT
    ===================================================== */

    const Field = ({
        label,
        value
    }) => (

        <Grid
            item
            xs={12}
            md={6}
        >

            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    display: "block",
                    mb: 0.5
                }}
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={500}
                sx={{
                    wordBreak: "break-word"
                }}
            >
                {
                    value !== null &&
                    value !== undefined &&
                    value !== ""
                        ? value
                        : "-"
                }
            </Typography>

        </Grid>
    );


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

            <DialogTitle
                sx={{
                    fontWeight: 700
                }}
            >
                Order Status History Details
            </DialogTitle>


            <Divider />


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent
                sx={{
                    mt: 2
                }}
            >

                <Grid
                    container
                    spacing={3}
                >

                    {/* =============================================
                        HISTORY ID
                    ============================================= */}

                    <Field
                        label="History ID"
                        value={historyId}
                    />


                    {/* =============================================
                        SELLER ID
                    ============================================= */}

                    <Field
                        label="Seller ID"
                        value={sellerId}
                    />


                    {/* =============================================
                        CUSTOMER ID
                    ============================================= */}

                    <Field
                        label="Customer ID"
                        value={customerId}
                    />


                    {/* =============================================
                        ORDER ID
                    ============================================= */}

                    <Field
                        label="Order ID"
                        value={orderId}
                    />


                    {/* =============================================
                        STATUS
                    ============================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: "block",
                                mb: 0.5
                            }}
                        >
                            Status
                        </Typography>

                        <Chip
                            label={
                                status || "N/A"
                            }
                            color={
                                getStatusColor(
                                    status
                                )
                            }
                            size="small"
                        />

                    </Grid>


                    {/* =============================================
                        REMARKS
                    ============================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: "block",
                                mb: 0.5
                            }}
                        >
                            Remarks
                        </Typography>

                        <Box
                            sx={{
                                p: 1.5,
                                borderRadius: 1,
                                backgroundColor:
                                    "action.hover",
                                minHeight: 60
                            }}
                        >

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
                                    remarks ||
                                    "-"
                                }
                            </Typography>

                        </Box>

                    </Grid>


                    {/* =============================================
                        CHANGED ON
                    ============================================= */}

                    <Field
                        label="Changed On"
                        value={
                            formatDateTime(
                                changedOn
                            )
                        }
                    />


                    {/* =============================================
                        TIMESTAMP
                    ============================================= */}

                    <Field
                        label="Timestamp"
                        value={
                            formatDateTime(
                                timestamp
                            )
                        }
                    />

                </Grid>

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


export default OrderStatusHistoryView;
