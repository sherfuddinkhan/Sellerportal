import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Stack,
    Divider,
    Button,
    Box
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

// =========================================================
// CURRENCY FORMATTER
// =========================================================

const formatCurrency = (value) => {

    return `₹ ${Number(value || 0).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    )}`;

};

// =========================================================
// NUMBER FORMATTER
// =========================================================

const formatNumber = (value) => {

    return Number(value || 0).toLocaleString(
        "en-IN"
    );

};

// =========================================================
// SALES ORDER ITEM CARD
// =========================================================

const SalesOrderItemCard = ({
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
            className="sales-order-item-card"
            sx={{
                height: "100%",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column"
            }}
        >

            {/* =============================================
                CARD CONTENT
            ============================================= */}

            <CardContent
                sx={{
                    flexGrow: 1
                }}
            >

                {/* =========================================
                    TITLE
                ========================================= */}

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                >

                    Sales Order Item #
                    {item.SalesOrderItemId}

                </Typography>

                {/* =========================================
                    SALES ORDER
                ========================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >

                    Sales Order ID :{" "}

                    <strong>
                        {item.SalesOrderId}
                    </strong>

                </Typography>

                {/* =========================================
                    PRODUCT
                ========================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >

                    Product ID :{" "}

                    <strong>
                        {item.ProductId}
                    </strong>

                </Typography>

                <Divider
                    sx={{
                        my: 2
                    }}
                />

                {/* =========================================
                    ITEM DETAILS
                ========================================= */}

                <Stack spacing={1.2}>

                    {/* LINE NUMBER */}

                    <Typography variant="body2">

                        <strong>Line Number:</strong>{" "}

                        {formatNumber(
                            item.LineNumber
                        )}

                    </Typography>

                    {/* QUANTITY */}

                    <Typography variant="body2">

                        <strong>Quantity:</strong>{" "}

                        {formatNumber(
                            item.Quantity
                        )}

                    </Typography>

                    {/* UNIT PRICE */}

                    <Typography variant="body2">

                        <strong>Unit Price:</strong>{" "}

                        {formatCurrency(
                            item.UnitPrice
                        )}

                    </Typography>

                    {/* DISCOUNT */}

                    <Typography variant="body2">

                        <strong>Discount:</strong>{" "}

                        {formatCurrency(
                            item.DiscountAmount
                        )}

                    </Typography>

                    {/* TAX */}

                    <Typography variant="body2">

                        <strong>Tax Amount:</strong>{" "}

                        {formatCurrency(
                            item.TaxAmount
                        )}

                    </Typography>

                    <Divider
                        sx={{
                            my: 0.5
                        }}
                    />

                    {/* TOTAL */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="success.main"
                    >

                        Total Amount:{" "}

                        {formatCurrency(
                            item.TotalAmount
                        )}

                    </Typography>

                    {/* REMARKS */}

                    {item.Remarks && (

                        <Box sx={{ pt: 0.5 }}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Remarks
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    mt: 0.25,
                                    wordBreak: "break-word"
                                }}
                            >
                                {item.Remarks}
                            </Typography>

                        </Box>

                    )}

                </Stack>

            </CardContent>

            {/* =============================================
                CARD ACTIONS
            ============================================= */}

            <CardActions
                sx={{
                    justifyContent: "space-between",
                    px: 2,
                    pb: 2,
                    gap: 1
                }}
            >

                {/* VIEW */}

                <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() =>
                        onView &&
                        onView(item)
                    }
                >

                    View

                </Button>

                {/* EDIT */}

                <Button
                    size="small"
                    color="warning"
                    startIcon={<Edit />}
                    onClick={() =>
                        onEdit &&
                        onEdit(item)
                    }
                >

                    Edit

                </Button>

                {/* DELETE */}

                <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() =>
                        onDelete &&
                        onDelete(item)
                    }
                >

                    Delete

                </Button>

            </CardActions>

        </Card>

    );

};

export default SalesOrderItemCard;
