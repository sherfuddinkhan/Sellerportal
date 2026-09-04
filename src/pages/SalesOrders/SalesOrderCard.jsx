import React from "react";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Stack,
    Chip,
    Divider,
    Button
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";


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
   STATUS COLOR
========================================================= */

const getStatusColor = (status) => {

    switch ((status || "").toLowerCase()) {

        case "completed":
            return "success";

        case "pending":
            return "warning";

        case "processing":
            return "info";

        case "cancelled":
            return "error";

        default:
            return "default";
    }
};


/* =========================================================
   SALES ORDER CARD
========================================================= */

const SalesOrderCard = ({
    item,
    onView,
    onEdit,
    onDelete
}) => {

    if (!item) {
        return null;
    }


    return (
        <Card
            className="sales-order-card"
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2
            }}
        >

            {/* =================================================
                CARD CONTENT
            ================================================= */}

            <CardContent sx={{ flexGrow: 1 }}>

                {/* Sales Order Number */}

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                        wordBreak: "break-word"
                    }}
                >
                    {item.SalesOrderNumber || "-"}
                </Typography>


                {/* Sales Order ID */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Sales Order ID: {item.SalesOrderId || "-"}
                </Typography>


                {/* Seller ID */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Seller ID: {item.SellerId || "-"}
                </Typography>


                {/* Customer ID */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Customer ID: {item.CustomerId || "-"}
                </Typography>


                {/* Order Date */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Order Date: {formatDate(item.OrderDate)}
                </Typography>


                <Divider sx={{ my: 2 }} />


                {/* Total Amount */}

                <Stack spacing={1}>

                    <Typography variant="body2">
                        <strong>Total Amount:</strong>{" "}
                        {formatCurrency(item.TotalAmount)}
                    </Typography>

                </Stack>


                <Divider sx={{ my: 2 }} />


                {/* Status */}

                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                >

                    <Chip
                        label={item.Status || "-"}
                        color={getStatusColor(item.Status)}
                        size="small"
                    />

                </Stack>


                {/* Remarks */}

                {item.Remarks && (

                    <Typography
                        variant="body2"
                        sx={{
                            mt: 2,
                            wordBreak: "break-word"
                        }}
                    >
                        <strong>Remarks:</strong>{" "}
                        {item.Remarks}
                    </Typography>

                )}

            </CardContent>


            {/* =================================================
                CARD ACTIONS
            ================================================= */}

            <CardActions
                sx={{
                    justifyContent: "space-between",
                    px: 2,
                    pb: 2,
                    gap: 1,
                    flexWrap: "wrap"
                }}
            >

                {/* View */}

                <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => onView?.(item)}
                >
                    View
                </Button>


                {/* Edit */}

                <Button
                    size="small"
                    color="warning"
                    startIcon={<Edit />}
                    onClick={() => onEdit?.(item)}
                >
                    Edit
                </Button>


                {/* Delete */}

                <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => onDelete?.(item)}
                >
                    Delete
                </Button>

            </CardActions>

        </Card>
    );
};


export default SalesOrderCard;
