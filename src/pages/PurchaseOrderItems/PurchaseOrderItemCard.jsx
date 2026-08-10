import React from "react";
import {Card,CardContent,CardActions,Typography,Divider,Stack,Button} from "@mui/material";
import {Visibility,Edit,Delete} from "@mui/icons-material";


const formatCurrency = (value) =>
    `₹ ${Number(value || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

const PurchaseOrderItemCard = ({
    item,
    onView,
    onEdit,
    onDelete
}) => {

    return (
        <Card
            className="purchase-order-item-card"
            sx={{
                height: "100%",
                borderRadius: 3
            }}
        >
            <CardContent>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                >
                    Product ID :
                    {" "}
                    {
                        item.ProductId
                    }
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Item ID :
                    {" "}
                    {
                        item.PurchaseOrderItemId
                    }
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Purchase Order ID :
                    {" "}
                    {
                        item.PurchaseOrderId
                    }
                </Typography>
                <Divider
                    sx={{
                        my: 2
                    }}
                />
                <Stack
                    spacing={1}
                >
                    <Typography>
                        <strong>
                            Quantity:
                        </strong>
                        {" "}
                        {
                            Number(item.Quantity || 0).toFixed(2)
                        }
                    </Typography>
                    <Typography>
                        <strong>
                            Unit Price:
                        </strong>
                        {" "}
                        {
                            formatCurrency(item.UnitPrice)
                        }
                    </Typography>
                    <Typography>
                        <strong>
                            Discount:
                        </strong>
                        {" "}
                        {
                            formatCurrency(item.Discount)
                        }
                    </Typography>
                    <Typography>
                        <strong>
                            Tax Amount:
                        </strong>
                        {" "}
                        {
                            formatCurrency(item.TaxAmount)
                        }
                    </Typography>
                    <Typography
                        fontWeight="bold"
                    >
                        Total Amount:
                        {" "}
                        {
                            formatCurrency(item.TotalAmount)
                        }
                    </Typography>
                </Stack>
            </CardContent>
            <CardActions
                sx={{
                    justifyContent:"space-between",
                    px:2,
                    pb:2
                }}
            >
                <Button
                    size="small"
                    startIcon={
                        <Visibility />
                    }
                    onClick={() =>
                        onView(item)
                    }
                >
                    View
                </Button>
                <Button
                    size="small"
                    color="warning"
                    startIcon={
                        <Edit />
                    }
                    onClick={() =>
                        onEdit(item)
                    }
                >
                    Edit
                </Button>
                <Button
                    size="small"
                    color="error"
                    startIcon={
                        <Delete />
                    }
                    onClick={() =>
                        onDelete(item)
                    }
                >
                    Delete
                </Button>
            </CardActions>
        </Card>
    );
};

export default PurchaseOrderItemCard;