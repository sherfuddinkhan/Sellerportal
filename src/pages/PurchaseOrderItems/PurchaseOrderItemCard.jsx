import React from "react";

import {
Card,
CardContent,
CardActions,
Typography,
Divider,
Stack,
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
FORMAT QUANTITY
========================================================= */

const formatQuantity = (value) => {
const quantity = Number(value);

if (!Number.isFinite(quantity)) {
    return "0.00";
}

return quantity.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});
};

/* =========================================================
PURCHASE ORDER ITEM CARD
========================================================= */

const PurchaseOrderItemCard = ({
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
        className="purchase-order-item-card"
        sx={{
            height: "100%",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column"
        }}
    >

        {/* =================================================
            CARD CONTENT
        ================================================= */}

        <CardContent sx={{ flexGrow: 1 }}>

            {/* Product */}

            <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
            >
                Product ID : {item.ProductId ?? "-"}
            </Typography>


            {/* Item ID */}

            <Typography
                variant="body2"
                color="text.secondary"
            >
                Item ID : {item.PurchaseOrderItemId ?? "-"}
            </Typography>


            {/* Purchase Order ID */}

            <Typography
                variant="body2"
                color="text.secondary"
            >
                Purchase Order ID : {item.PurchaseOrderId ?? "-"}
            </Typography>


            <Divider
                sx={{
                    my: 2
                }}
            />


            {/* =================================================
                ITEM FINANCIAL DETAILS
            ================================================= */}

            <Stack spacing={1}>

                {/* Quantity */}

                <Typography>
                    <strong>
                        Quantity:
                    </strong>{" "}
                    {formatQuantity(item.Quantity)}
                </Typography>


                {/* Unit Price */}

                <Typography>
                    <strong>
                        Unit Price:
                    </strong>{" "}
                    {formatCurrency(item.UnitPrice)}
                </Typography>


                {/* Discount */}

                <Typography>
                    <strong>
                        Discount:
                    </strong>{" "}
                    {formatCurrency(item.Discount)}
                </Typography>


                {/* Tax */}

                <Typography>
                    <strong>
                        Tax Amount:
                    </strong>{" "}
                    {formatCurrency(item.TaxAmount)}
                </Typography>


                {/* Total */}

                <Typography
                    fontWeight="bold"
                >
                    Total Amount:{" "}
                    {formatCurrency(item.TotalAmount)}
                </Typography>

            </Stack>

        </CardContent>


        {/* =================================================
            CARD ACTIONS
        ================================================= */}

        <CardActions
            sx={{
                justifyContent: "space-between",
                px: 2,
                pb: 2
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

export default PurchaseOrderItemCard;
