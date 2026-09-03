import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Divider,
    Stack,
    Button,
    Chip,
    Box
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";


// =========================================================
// FORMAT NUMBER
// =========================================================

const formatNumber = (value) => {

    const number = Number(value ?? 0);

    if (isNaN(number)) {
        return "0.00";
    }

    return number.toFixed(2);
};


// =========================================================
// FORMAT DATE
// =========================================================

const formatDate = (date) => {

    if (!date) {
        return "-";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
        return "-";
    }

    return parsedDate.toLocaleDateString();
};


// =========================================================
// TRANSACTION COLOR
// =========================================================

const getTransactionColor = (transactionType) => {

    const type =
        transactionType
            ?.toString()
            .trim()
            .toUpperCase();

    switch (type) {

        case "PURCHASE":
            return "success";

        case "SALE":
            return "error";

        case "RETURN":
            return "info";

        case "ADJUSTMENT":
            return "warning";

        case "TRANSFER":
            return "secondary";

        default:
            return "default";
    }
};


// =========================================================
// STOCK LEDGER CARD
// =========================================================

const StockLedgerCard = ({
    ledger,
    onView,
    onEdit,
    onDelete
}) => {

    // ---------------------------------------------------------
    // NO LEDGER
    // ---------------------------------------------------------

    if (!ledger) {
        return null;
    }


    // ---------------------------------------------------------
    // SUPPORT CAMELCASE + PASCALCASE
    // ---------------------------------------------------------

    const stockLedgerId =
        ledger.stockLedgerId ??
        ledger.StockLedgerId;

    const sellerId =
        ledger.sellerId ??
        ledger.SellerId;

    const customerId =
        ledger.customerId ??
        ledger.CustomerId;

    const productId =
        ledger.productId ??
        ledger.ProductId;

    const warehouseId =
        ledger.warehouseId ??
        ledger.WarehouseId;

    const transactionType =
        ledger.transactionType ??
        ledger.TransactionType;

    const referenceNumber =
        ledger.referenceNumber ??
        ledger.ReferenceNumber;

    const quantity =
        ledger.quantity ??
        ledger.Quantity;

    const balanceQuantity =
        ledger.balanceQuantity ??
        ledger.BalanceQuantity;

    const transactionDate =
        ledger.transactionDate ??
        ledger.TransactionDate;

    const remarks =
        ledger.remarks ??
        ledger.Remarks;


    // ---------------------------------------------------------
    // RENDER
    // ---------------------------------------------------------

    return (
        <Card
            className="stock-ledger-card"
            sx={{
                height: "100%",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column"
            }}
        >

            {/* =================================================
                CARD CONTENT
            ================================================== */}

            <CardContent
                sx={{
                    flexGrow: 1
                }}
            >

                <Stack
                    spacing={1.5}
                >

                    {/* =========================================
                        TITLE
                    ========================================== */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Stock Ledger #{stockLedgerId ?? "-"}
                    </Typography>


                    {/* =========================================
                        TRANSACTION TYPE
                    ========================================== */}

                    <Box>
                        <Chip
                            label={transactionType || "-"}
                            size="small"
                            color={getTransactionColor(
                                transactionType
                            )}
                        />
                    </Box>


                    <Divider />


                    {/* =========================================
                        SELLER
                    ========================================== */}

                    <Typography>
                        <strong>Seller ID:</strong>{" "}
                        {sellerId ?? "-"}
                    </Typography>


                    {/* =========================================
                        CUSTOMER
                    ========================================== */}

                    <Typography>
                        <strong>Customer ID:</strong>{" "}
                        {customerId ?? "-"}
                    </Typography>


                    {/* =========================================
                        PRODUCT
                    ========================================== */}

                    <Typography>
                        <strong>Product ID:</strong>{" "}
                        {productId ?? "-"}
                    </Typography>


                    {/* =========================================
                        WAREHOUSE
                    ========================================== */}

                    <Typography>
                        <strong>Warehouse ID:</strong>{" "}
                        {warehouseId ?? "-"}
                    </Typography>


                    {/* =========================================
                        REFERENCE
                    ========================================== */}

                    <Typography
                        sx={{
                            wordBreak: "break-word"
                        }}
                    >
                        <strong>Reference:</strong>{" "}
                        {referenceNumber || "-"}
                    </Typography>


                    {/* =========================================
                        QUANTITY
                    ========================================== */}

                    <Typography>
                        <strong>Quantity:</strong>{" "}
                        {formatNumber(quantity)}
                    </Typography>


                    {/* =========================================
                        BALANCE
                    ========================================== */}

                    <Typography>
                        <strong>Balance:</strong>{" "}
                        {formatNumber(balanceQuantity)}
                    </Typography>


                    {/* =========================================
                        TRANSACTION DATE
                    ========================================== */}

                    <Typography>
                        <strong>Date:</strong>{" "}
                        {formatDate(transactionDate)}
                    </Typography>


                    {/* =========================================
                        REMARKS
                    ========================================== */}

                    <Typography
                        sx={{
                            wordBreak: "break-word",
                            whiteSpace: "pre-wrap"
                        }}
                    >
                        <strong>Remarks:</strong>{" "}
                        {remarks || "-"}
                    </Typography>

                </Stack>

            </CardContent>


            {/* =================================================
                CARD ACTIONS
            ================================================== */}

            <CardActions
                sx={{
                    justifyContent: "space-between",
                    px: 2,
                    pb: 2,
                    flexWrap: "wrap",
                    gap: 1
                }}
            >

                {/* =============================================
                    VIEW
                ============================================== */}

                <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => onView?.(ledger)}
                >
                    View
                </Button>


                {/* =============================================
                    EDIT
                ============================================== */}

                <Button
                    size="small"
                    color="warning"
                    startIcon={<Edit />}
                    onClick={() => onEdit?.(ledger)}
                >
                    Edit
                </Button>


                {/* =============================================
                    DELETE
                ============================================== */}

                <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => onDelete?.(ledger)}
                >
                    Delete
                </Button>

            </CardActions>

        </Card>
    );
};


export default StockLedgerCard;

