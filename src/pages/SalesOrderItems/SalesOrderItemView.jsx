import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Typography,
    Divider,
    Button,
    Paper
} from "@mui/material";

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
// SALES ORDER ITEM VIEW
// =========================================================

const SalesOrderItemView = ({
    open,
    item,
    onClose
}) => {

    if (!item) {

        return null;

    }

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            {/* =============================================
                TITLE
            ============================================= */}

            <DialogTitle>

                Sales Order Item Details

            </DialogTitle>

            {/* =============================================
                CONTENT
            ============================================= */}

            <DialogContent dividers>

                <Grid
                    container
                    spacing={2}
                >

                    {/* =========================================
                        ITEM ID
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2
                            }}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Sales Order Item ID
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight="600"
                            >
                                {item.SalesOrderItemId}
                            </Typography>

                        </Paper>

                    </Grid>

                    {/* =========================================
                        SALES ORDER ID
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2
                            }}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Sales Order ID
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight="600"
                            >
                                {item.SalesOrderId}
                            </Typography>

                        </Paper>

                    </Grid>

                    {/* =========================================
                        PRODUCT ID
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2
                            }}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Product ID
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight="600"
                            >
                                {item.ProductId}
                            </Typography>

                        </Paper>

                    </Grid>

                    {/* =========================================
                        LINE NUMBER
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2
                            }}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Line Number
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight="600"
                            >
                                {formatNumber(
                                    item.LineNumber
                                )}
                            </Typography>

                        </Paper>

                    </Grid>

                    {/* =========================================
                        QUANTITY
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2
                            }}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Quantity
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight="600"
                            >
                                {formatNumber(
                                    item.Quantity
                                )}
                            </Typography>

                        </Paper>

                    </Grid>

                    {/* =========================================
                        UNIT PRICE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2
                            }}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Unit Price
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight="600"
                            >
                                {formatCurrency(
                                    item.UnitPrice
                                )}
                            </Typography>

                        </Paper>

                    </Grid>

                    {/* =========================================
                        DISCOUNT
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2
                            }}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Discount Amount
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight="600"
                            >
                                {formatCurrency(
                                    item.DiscountAmount
                                )}
                            </Typography>

                        </Paper>

                    </Grid>

                    {/* =========================================
                        TAX AMOUNT
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2
                            }}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Tax Amount
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight="600"
                            >
                                {formatCurrency(
                                    item.TaxAmount
                                )}
                            </Typography>

                        </Paper>

                    </Grid>

                    {/* =========================================
                        TOTAL AMOUNT
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2
                            }}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Total Amount
                            </Typography>

                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                color="success.main"
                            >
                                {formatCurrency(
                                    item.TotalAmount
                                )}
                            </Typography>

                        </Paper>

                    </Grid>

                    {/* =========================================
                        REMARKS
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Divider
                            sx={{
                                my: 1
                            }}
                        />

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Remarks
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                mt: 0.5,
                                whiteSpace: "pre-wrap"
                            }}
                        >
                            {item.Remarks || "-"}
                        </Typography>

                    </Grid>

                </Grid>

            </DialogContent>

            {/* =============================================
                ACTIONS
            ============================================= */}

            <DialogActions>

                <Button
                    variant="contained"
                    onClick={onClose}
                >
                    Close
                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default SalesOrderItemView;
