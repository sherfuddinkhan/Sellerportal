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
    Paper,
    Stack,
    Box
} from "@mui/material";

import {
    History,
    ShoppingCart,
    Person,
    Store,
    AccessTime,
    Notes,
    Update
} from "@mui/icons-material";


/* =========================================================
   DETAILED ORDER STATUS HISTORY
========================================================= */

const DetailedOrderStatusHistory = ({
    open,
    item,
    onClose
}) => {

    /* =====================================================
       EMPTY ITEM
    ===================================================== */

    if (!item) {
        return null;
    }


    /* =====================================================
       NORMALIZE FIELDS
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

        const date =
            new Date(value);

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
       DETAIL FIELD
    ===================================================== */

    const DetailField = ({
        icon,
        label,
        value
    }) => (

        <Grid
            item
            xs={12}
            md={6}
        >

            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    height: "100%"
                }}
            >

                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                >

                    <Box
                        sx={{
                            color:
                                "primary.main",
                            display: "flex"
                        }}
                    >
                        {icon}
                    </Box>

                    <Box
                        sx={{
                            minWidth: 0
                        }}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                        >
                            {label}
                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight={600}
                            sx={{
                                wordBreak:
                                    "break-word"
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

                    </Box>

                </Stack>

            </Paper>

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
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontWeight: 700
                }}
            >

                <History color="primary" />

                Detailed Order Status History

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

                {/* =============================================
                    STATUS HEADER
                ============================================= */}

                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 2,
                        backgroundColor:
                            "action.hover"
                    }}
                >

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row"
                        }}
                        justifyContent="space-between"
                        alignItems={{
                            xs: "flex-start",
                            sm: "center"
                        }}
                        spacing={2}
                    >

                        <Box>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                History Record
                            </Typography>

                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                #{historyId}
                            </Typography>

                        </Box>


                        <Chip
                            label={
                                status ||
                                "N/A"
                            }
                            color={
                                getStatusColor(
                                    status
                                )
                            }
                            sx={{
                                fontWeight: 600
                            }}
                        />

                    </Stack>

                </Paper>


                {/* =============================================
                    BASIC DETAILS
                ============================================= */}

                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                        mb: 2
                    }}
                >
                    Record Information
                </Typography>


                <Grid
                    container
                    spacing={2}
                >

                    <DetailField
                        icon={
                            <History />
                        }
                        label="History ID"
                        value={historyId}
                    />


                    <DetailField
                        icon={
                            <Store />
                        }
                        label="Seller ID"
                        value={sellerId}
                    />


                    <DetailField
                        icon={
                            <Person />
                        }
                        label="Customer ID"
                        value={customerId}
                    />


                    <DetailField
                        icon={
                            <ShoppingCart />
                        }
                        label="Order ID"
                        value={orderId}
                    />


                    <DetailField
                        icon={
                            <Update />
                        }
                        label="Status"
                        value={
                            status || "-"
                        }
                    />

                </Grid>


                {/* =============================================
                    REMARKS
                ============================================= */}

                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                        mt: 3,
                        mb: 2
                    }}
                >
                    Remarks
                </Typography>


                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        minHeight: 100
                    }}
                >

                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="flex-start"
                    >

                        <Notes
                            color="primary"
                        />

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

                    </Stack>

                </Paper>


                {/* =============================================
                    DATE INFORMATION
                ============================================= */}

                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                        mt: 3,
                        mb: 2
                    }}
                >
                    Date & Time Information
                </Typography>


                <Grid
                    container
                    spacing={2}
                >

                    <DetailField
                        icon={
                            <AccessTime />
                        }
                        label="Changed On"
                        value={
                            formatDateTime(
                                changedOn
                            )
                        }
                    />


                    <DetailField
                        icon={
                            <AccessTime />
                        }
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


export default DetailedOrderStatusHistory;