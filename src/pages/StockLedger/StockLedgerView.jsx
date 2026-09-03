import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Divider,
    Chip,
    Box
} from "@mui/material";


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
// STOCK LEDGER VIEW
// =========================================================

const StockLedgerView = ({
    open,
    ledger,
    onClose
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

    const createdDate =
        ledger.createdDate ??
        ledger.CreatedDate;

    const remarks =
        ledger.remarks ??
        ledger.Remarks;


    // ---------------------------------------------------------
    // FIELDS
    // ---------------------------------------------------------

    const fields = [

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


    // ---------------------------------------------------------
    // RENDER
    // ---------------------------------------------------------

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            className="stock-ledger-view"
        >

            {/* =================================================
                TITLE
            ================================================== */}

            <DialogTitle>
                Stock Ledger Details
            </DialogTitle>


            {/* =================================================
                CONTENT
            ================================================== */}

            <DialogContent dividers>

                <Grid
                    container
                    spacing={2}
                >

                    {/* =============================================
                        TRANSACTION TYPE
                    ============================================== */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                        >
                            Transaction Type
                        </Typography>

                        <Chip
                            label={
                                transactionType || "-"
                            }
                            color={
                                getTransactionColor(
                                    transactionType
                                )
                            }
                        />

                    </Grid>


                    {/* =============================================
                        LEDGER FIELDS
                    ============================================== */}

                    {fields.map((field, index) => (

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            key={index}
                        >

                            <Box
                                sx={{
                                    minHeight: 50
                                }}
                            >

                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    {field.label}
                                </Typography>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        mt: 0.5,
                                        wordBreak: "break-word"
                                    }}
                                >
                                    {field.value}
                                </Typography>

                            </Box>

                        </Grid>

                    ))}


                    {/* =============================================
                        REMARKS
                    ============================================== */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Divider
                            sx={{
                                my: 2
                            }}
                        />

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Remarks
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                mt: 0.5,
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word"
                            }}
                        >
                            {remarks || "-"}
                        </Typography>

                    </Grid>

                </Grid>

            </DialogContent>


            {/* =================================================
                ACTIONS
            ================================================== */}

            <DialogActions>

                <Button
                    variant="contained"
                    onClick={() => onClose?.()}
                >
                    Close
                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default StockLedgerView;
