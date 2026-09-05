import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Divider,
    Stack,
    Button,
    Box,
    Chip
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
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {

    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return "0";
    }

    return amount.toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
};


/* =========================================================
   GOODS RECEIPT NOTE ITEM CARD
========================================================= */

const GoodsReceiptNoteItemCard = ({
    item,
    onView,
    onEdit,
    onDelete
}) => {

    if (!item) {
        return null;
    }


    /* =====================================================
       VALUES
    ===================================================== */

    const itemId =
        item.GoodsReceiptNoteItemId ?? "-";

    const grnId =
        item.GoodsReceiptNoteId ?? "-";

    const productId =
        item.ProductId ?? "-";

    const receivedQuantity =
        item.ReceivedQuantity ?? 0;

    const acceptedQuantity =
        item.AcceptedQuantity ?? 0;

    const rejectedQuantity =
        item.RejectedQuantity ?? 0;

    const unitPrice =
        item.UnitPrice ?? 0;

    const taxAmount =
        item.TaxAmount ?? 0;

    const totalAmount =
        item.TotalAmount ?? 0;


    /* =====================================================
       STATUS
    ===================================================== */

    const rejected =
        Number(rejectedQuantity) > 0;


    return (

        <Card
            className="goods-receipt-note-item-card"
            sx={{
                height: "100%",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                transition: "0.2s",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 4
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

                {/* =============================================
                    HEADER
                ============================================= */}

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap={1}
                    mb={1}
                >

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        GRN Item #{itemId}
                    </Typography>


                    <Chip
                        size="small"
                        label={
                            rejected
                                ? "Partially Rejected"
                                : "Received"
                        }
                        color={
                            rejected
                                ? "warning"
                                : "success"
                        }
                    />

                </Box>


                {/* =============================================
                    REFERENCE INFORMATION
                ============================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>
                        Goods Receipt Note ID:
                    </strong>{" "}
                    {grnId}
                </Typography>


                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>
                        Product ID:
                    </strong>{" "}
                    {productId}
                </Typography>


                <Divider
                    sx={{
                        my: 2
                    }}
                />


                {/* =============================================
                    QUANTITY INFORMATION
                ============================================= */}

                <Stack spacing={1}>

                    <Typography>
                        <strong>
                            Received Qty:
                        </strong>{" "}
                        {formatNumber(
                            receivedQuantity
                        )}
                    </Typography>


                    <Typography>
                        <strong>
                            Accepted Qty:
                        </strong>{" "}
                        {formatNumber(
                            acceptedQuantity
                        )}
                    </Typography>


                    <Typography>
                        <strong>
                            Rejected Qty:
                        </strong>{" "}
                        {formatNumber(
                            rejectedQuantity
                        )}
                    </Typography>


                    <Divider
                        sx={{
                            my: 1
                        }}
                    />


                    {/* =========================================
                        PRICE
                    ========================================= */}

                    <Typography>
                        <strong>
                            Unit Price:
                        </strong>{" "}
                        {formatCurrency(
                            unitPrice
                        )}
                    </Typography>


                    <Typography>
                        <strong>
                            Tax:
                        </strong>{" "}
                        {formatCurrency(
                            taxAmount
                        )}
                    </Typography>


                    <Typography
                        fontWeight="bold"
                        variant="h6"
                    >
                        Total:{" "}
                        {formatCurrency(
                            totalAmount
                        )}
                    </Typography>

                </Stack>

            </CardContent>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <CardActions
                sx={{
                    px: 2,
                    pb: 2,
                    pt: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 1
                }}
            >

                {/* VIEW */}

                <Button
                    size="small"
                    variant="outlined"
                    startIcon={
                        <Visibility />
                    }
                    onClick={() =>
                        onView?.(item)
                    }
                >
                    View
                </Button>


                {/* EDIT */}

                <Button
                    size="small"
                    color="warning"
                    variant="outlined"
                    startIcon={
                        <Edit />
                    }
                    onClick={() =>
                        onEdit?.(item)
                    }
                >
                    Edit
                </Button>


                {/* DELETE */}

                <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    startIcon={
                        <Delete />
                    }
                    onClick={() =>
                        onDelete?.(item)
                    }
                >
                    Delete
                </Button>

            </CardActions>

        </Card>
    );
};


export default GoodsReceiptNoteItemCard;

