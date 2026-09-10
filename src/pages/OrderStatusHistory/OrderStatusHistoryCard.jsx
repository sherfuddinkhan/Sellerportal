import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Stack,
    Divider,
    IconButton,
    Tooltip,
    Chip,
    Box
} from "@mui/material";

import {
    History,
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";


/* =========================================================
   ORDER STATUS HISTORY CARD
========================================================= */

const OrderStatusHistoryCard = ({
    item,
    onView,
    onEdit,
    onDelete
}) => {

    /* =====================================================
       EMPTY ITEM
    ===================================================== */

    if (!item) {
        return null;
    }


    /* =====================================================
       NORMALIZE API FIELDS
       Supports camelCase + PascalCase
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
       FORMAT DATE + TIME
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
                minute: "2-digit"
            }
        );
    };


    /* =====================================================
       EVENT HANDLERS
    ===================================================== */

    const handleView = () => {

        if (
            typeof onView === "function"
        ) {
            onView(item);
        }

    };


    const handleEdit = () => {

        if (
            typeof onEdit === "function"
        ) {
            onEdit(item);
        }

    };


    const handleDelete = () => {

        if (
            typeof onDelete === "function"
        ) {
            onDelete(item);
        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Card
            elevation={3}
            sx={{
                height: "100%",
                borderRadius: 2,

                display: "flex",
                flexDirection: "column",

                transition: "0.3s",

                "&:hover": {
                    transform:
                        "translateY(-4px)",
                    boxShadow: 8
                }
            }}
        >

            {/* =================================================
                CARD CONTENT
            ================================================= */}

            <CardContent
                sx={{
                    flexGrow: 1
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >

                    <History
                        color="primary"
                        fontSize="large"
                    />


                    <Chip
                        label={
                            status || "N/A"
                        }
                        color={
                            getStatusColor(status)
                        }
                        size="small"
                    />

                </Stack>


                {/* =================================================
                    HISTORY ID
                ================================================= */}

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                >
                    History #{historyId}
                </Typography>


                {/* =================================================
                    ORDER ID
                ================================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 1
                    }}
                >

                    <Box
                        component="strong"
                        sx={{
                            color: "text.primary"
                        }}
                    >
                        Order ID:
                    </Box>{" "}

                    {orderId}

                </Typography>


                {/* =================================================
                    SELLER / CUSTOMER
                ================================================= */}

                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        mb: 1
                    }}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >

                        <Box
                            component="strong"
                            sx={{
                                color: "text.primary"
                            }}
                        >
                            Seller:
                        </Box>{" "}

                        {sellerId}

                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >

                        <Box
                            component="strong"
                            sx={{
                                color: "text.primary"
                            }}
                        >
                            Customer:
                        </Box>{" "}

                        {customerId}

                    </Typography>

                </Stack>


                {/* =================================================
                    REMARKS
                ================================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 1,

                        display:
                            "-webkit-box",

                        WebkitLineClamp: 2,

                        WebkitBoxOrient:
                            "vertical",

                        overflow: "hidden",

                        wordBreak:
                            "break-word"
                    }}
                >

                    <Box
                        component="strong"
                        sx={{
                            color: "text.primary"
                        }}
                    >
                        Remarks:
                    </Box>{" "}

                    {remarks || "-"}

                </Typography>


                {/* =================================================
                    CHANGED ON
                ================================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >

                    <Box
                        component="strong"
                        sx={{
                            color: "text.primary"
                        }}
                    >
                        Changed On:
                    </Box>{" "}

                    {formatDateTime(changedOn)}

                </Typography>

            </CardContent>


            <Divider />


            {/* =================================================
                CARD ACTIONS
            ================================================= */}

            <CardActions
                sx={{
                    justifyContent:
                        "flex-end",

                    px: 2,
                    py: 1
                }}
            >

                {/* =============================================
                    VIEW
                ============================================= */}

                <Tooltip title="View">

                    <IconButton
                        color="primary"
                        onClick={handleView}
                        aria-label={
                            "View order status history"
                        }
                    >
                        <Visibility />
                    </IconButton>

                </Tooltip>


                {/* =============================================
                    EDIT
                ============================================= */}

                <Tooltip title="Edit">

                    <IconButton
                        color="warning"
                        onClick={handleEdit}
                        aria-label={
                            "Edit order status history"
                        }
                    >
                        <Edit />
                    </IconButton>

                </Tooltip>


                {/* =============================================
                    DELETE
                ============================================= */}

                <Tooltip title="Delete">

                    <IconButton
                        color="error"
                        onClick={handleDelete}
                        aria-label={
                            "Delete order status history"
                        }
                    >
                        <Delete />
                    </IconButton>

                </Tooltip>

            </CardActions>

        </Card>
    );
};


export default OrderStatusHistoryCard;
