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

const formatCurrency = (value) =>
    `₹ ${Number(value || 0).toFixed(2)}`;

const formatDate = (value) =>
    value
        ? new Date(value).toLocaleDateString()
        : "-";

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

const SalesOrderCard = ({

    item,

    onView,

    onEdit,

    onDelete

}) => {

    return (

        <Card
            className="sales-order-card"
            sx={{
                height: "100%",
                borderRadius: 2
            }}
        >

            <CardContent>

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                >

                    {item.SalesOrderNumber}

                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >

                    Sales Order ID : {item.SalesOrderId}

                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >

                    Seller ID : {item.SellerId}

                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >

                    Customer ID : {item.CustomerId}

                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >

                    Order Date : {formatDate(item.OrderDate)}

                </Typography>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={1}>

                    <Typography variant="body2">

                        <strong>Total Amount:</strong>{" "}

                        {formatCurrency(item.TotalAmount)}

                    </Typography>

                </Stack>

                <Divider sx={{ my: 2 }} />

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

                {item.Remarks && (

                    <Typography
                        variant="body2"
                        sx={{ mt: 2 }}
                    >

                        <strong>Remarks:</strong>{" "}

                        {item.Remarks}

                    </Typography>

                )}

            </CardContent>

            <CardActions
                sx={{
                    justifyContent: "space-between",
                    px: 2,
                    pb: 2
                }}
            >

                <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => onView(item)}
                >

                    View

                </Button>

                <Button
                    size="small"
                    color="warning"
                    startIcon={<Edit />}
                    onClick={() => onEdit(item)}
                >

                    Edit

                </Button>

                <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => onDelete(item)}
                >

                    Delete

                </Button>

            </CardActions>

        </Card>

    );

};

export default SalesOrderCard;