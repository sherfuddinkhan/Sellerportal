import React from "react";

import {
    Paper,
    Typography,
    Grid,
    Box,
    Divider,
    Chip,
    Button,
    Stack
} from "@mui/material";

import {
    ArrowBack,
    Edit
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
// STOCK LEDGER DETAILS
// =========================================================

const StockLedgerDetails = ({
    ledger,
    onBack,
    onEdit
}) => {

    if (!ledger) {
        return (
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    textAlign: "center"
                }}
            >
                <Typography>
                    Stock Ledger record not found.
                </Typography>

                {onBack && (
                    <Button
                        sx={{ mt: 2 }}
                        variant="contained"
                        startIcon={<ArrowBack />}
                        onClick={onBack}
                    >
                        Back
                    </Button>
                )}
            </Paper>
        );
    }


    // =========================================================
    // SUPPORT CAMELCASE + PASCALCASE
    // =========================================================

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

    const createdDate =
        ledger.createdDate ??
        ledger.CreatedDate;

    const remarks =
        ledger.remarks ??
        ledger.Remarks;


    // =========================================================
    // DETAILS
    // =========================================================

    const details = [
        {
            label: "Stock Ledger ID",
            value: stockLedgerId ?? "-"
        },
        {
            label: "Seller ID",
            value: sellerId ?? "-"
        },
        {
            label: "Customer ID",
            value: customerId ?? "-"
        },
        {
            label: "Product ID",
            value: productId ?? "-"
        },
        {
            label: "Warehouse ID",
            value: warehouseId ?? "-"
        },
        {
            label: "Reference Number",
            value: referenceNumber || "-"
        },
        {
            label: "Quantity",
            value: formatNumber(quantity)
        },
        {
            label: "Balance Quantity",
            value: formatNumber(balanceQuantity)
        },
        {
            label: "Transaction Date",
            value: formatDate(transactionDate)
        },
        {
            label: "Created Date",
            value: formatDate(createdDate)
        }
    ];


    return (
        <Paper
            className="stock-ledger-details"
            elevation={3}
            sx={{
                p: 3,
                borderRadius: 3
            }}
        >

            {/* =================================================
                HEADER
            ================================================== */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row"
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "flex-start",
                    sm: "center"
                }}
                spacing={2}
                sx={{
                    mb: 3
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        Stock Ledger Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Ledger #{stockLedgerId ?? "-"}
                    </Typography>

                </Box>


                <Stack
                    direction="row"
                    spacing={1}
                >

                    {onEdit && (
                        <Button
                            variant="outlined"
                            color="warning"
                            startIcon={<Edit />}
                            onClick={() =>
                                onEdit(ledger)
                            }
                        >
                            Edit
                        </Button>
                    )}


                    {onBack && (
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={onBack}
                        >
                            Back
                        </Button>
                    )}

                </Stack>

            </Stack>


            <Divider sx={{ mb: 3 }} />


            {/* =================================================
                TRANSACTION TYPE
            ================================================== */}

            <Box sx={{ mb: 3 }}>

                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                >
                    Transaction Type
                </Typography>

                <Chip
                    label={transactionType || "-"}
                    color={getTransactionColor(
                        transactionType
                    )}
                />

            </Box>


            {/* =================================================
                DETAILS GRID
            ================================================== */}

            <Grid
                container
                spacing={3}
            >

                {details.map((detail, index) => (

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={index}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            {detail.label}
                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight={500}
                            sx={{
                                mt: 0.5,
                                wordBreak: "break-word"
                            }}
                        >
                            {detail.value}
                        </Typography>

                    </Grid>

                ))}

            </Grid>


            {/* =================================================
                REMARKS
            ================================================== */}

            <Divider sx={{ my: 3 }} />

            <Typography
                variant="subtitle2"
                color="text.secondary"
            >
                Remarks
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    mt: 1,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word"
                }}
            >
                {remarks || "-"}
            </Typography>

        </Paper>
    );
};


export default StockLedgerDetails;





