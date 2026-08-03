import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Stack,
    Divider,
    Button
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

const formatCurrency = (value) =>
    `₹ ${Number(value || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

const SalesOrderItemCard = ({

    item,

    onView,

    onEdit,

    onDelete

}) => {

    return (

        <Card
            className="sales-order-item-card"
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

                    Sales Order Item #{item.SalesOrderItemId}

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

                    Product ID : {item.ProductId}

                </Typography>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={1}>

                    <Typography variant="body2">

                        <strong>Quantity:</strong>{" "}

                        {Number(item.Quantity || 0).toLocaleString()}

                    </Typography>

                    <Typography variant="body2">

                        <strong>Unit Price:</strong>{" "}

                        {formatCurrency(item.UnitPrice)}

                    </Typography>

                    <Typography variant="body2">

                        <strong>Discount:</strong>{" "}

                        {formatCurrency(item.Discount)}

                    </Typography>

                    <Typography variant="body2">

                        <strong>Tax Amount:</strong>{" "}

                        {formatCurrency(item.TaxAmount)}

                    </Typography>

                    <Typography
                        variant="body1"
                        fontWeight="bold"
                    >

                        Total Amount:{" "}

                        {formatCurrency(item.TotalAmount)}

                    </Typography>

                </Stack>

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

export default SalesOrderItemCard;