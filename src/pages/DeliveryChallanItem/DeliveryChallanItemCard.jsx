import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Chip,
    Divider,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    LocalShipping,
    Inventory2,
    ShoppingCart,
    Payments
} from "@mui/icons-material";

const DeliveryChallanItemCard = ({
    deliveryChallanItem,
    onView,
    onEdit,
    onDelete
}) => {

    return (

        <Card
            elevation={3}
            className="delivery-challan-item-card"
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >

            <CardContent sx={{ flexGrow: 1 }}>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Product #{deliveryChallanItem.ProductId}
                    </Typography>

                    <Chip
                        label={`Qty: ${deliveryChallanItem.Quantity}`}
                        color="primary"
                        size="small"
                    />

                </Box>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="body2" gutterBottom>

                    <strong>Item ID:</strong>{" "}
                    {deliveryChallanItem.DeliveryChallanItemId}

                </Typography>

                <Typography variant="body2" gutterBottom>

                    <strong>Delivery Challan:</strong>{" "}
                    {deliveryChallanItem.DeliveryChallanId}

                </Typography>

                <Box
                    display="flex"
                    alignItems="center"
                    mt={2}
                >

                    <Inventory2
                        fontSize="small"
                        color="action"
                    />

                    <Typography
                        variant="body2"
                        sx={{ ml: 1 }}
                    >
                        Product ID : {deliveryChallanItem.ProductId}
                    </Typography>

                </Box>

                <Box
                    display="flex"
                    alignItems="center"
                    mt={1}
                >

                    <ShoppingCart
                        fontSize="small"
                        color="action"
                    />

                    <Typography
                        variant="body2"
                        sx={{ ml: 1 }}
                    >
                        Quantity : {deliveryChallanItem.Quantity}
                    </Typography>

                </Box>

                <Box
                    display="flex"
                    alignItems="center"
                    mt={1}
                >

                    <Payments
                        fontSize="small"
                        color="action"
                    />

                    <Typography
                        variant="body2"
                        sx={{ ml: 1 }}
                    >
                        Unit Price : ₹
                        {Number(
                            deliveryChallanItem.UnitPrice || 0
                        ).toLocaleString()}
                    </Typography>

                </Box>

                <Box
                    display="flex"
                    alignItems="center"
                    mt={1}
                >

                    <LocalShipping
                        fontSize="small"
                        color="action"
                    />

                    <Typography
                        variant="body2"
                        sx={{ ml: 1 }}
                    >
                        Total : ₹
                        {Number(
                            deliveryChallanItem.TotalAmount || 0
                        ).toLocaleString()}
                    </Typography>

                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" gutterBottom>

                    <strong>Discount:</strong>{" "}
                    ₹{Number(
                        deliveryChallanItem.Discount || 0
                    ).toLocaleString()}

                </Typography>

                <Typography variant="body2" gutterBottom>

                    <strong>Tax:</strong>{" "}
                    ₹{Number(
                        deliveryChallanItem.TaxAmount || 0
                    ).toLocaleString()}

                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >

                    <strong>Remarks:</strong>{" "}

                    {deliveryChallanItem.Remarks || "-"}

                </Typography>

            </CardContent>

            <CardActions
                sx={{
                    justifyContent: "flex-end"
                }}
            >

                <Tooltip title="View">

                    <IconButton
                        color="primary"
                        onClick={() =>
                            onView(deliveryChallanItem)
                        }
                    >

                        <Visibility />

                    </IconButton>

                </Tooltip>

                <Tooltip title="Edit">

                    <IconButton
                        color="warning"
                        onClick={() =>
                            onEdit(deliveryChallanItem)
                        }
                    >

                        <Edit />

                    </IconButton>

                </Tooltip>

                <Tooltip title="Delete">

                    <IconButton
                        color="error"
                        onClick={() =>
                            onDelete(deliveryChallanItem)
                        }
                    >

                        <Delete />

                    </IconButton>

                </Tooltip>

            </CardActions>

        </Card>

    );

};

export default DeliveryChallanItemCard;