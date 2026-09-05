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
    Box,
    Chip
} from "@mui/material";


/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
};


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
   DETAIL FIELD
========================================================= */

const DetailField = ({
    label,
    value,
    currency = false,
    bold = false
}) => {

    return (
        <Grid
            item
            xs={12}
            md={6}
        >

            <Box
                sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: "background.default"
                }}
            >

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 0.5
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    variant="body1"
                    fontWeight={bold ? 700 : 500}
                >
                    {currency
                        ? formatCurrency(value)
                        : value ?? "-"
                    }
                </Typography>

            </Box>

        </Grid>
    );
};


/* =========================================================
   GOODS RECEIPT NOTE ITEM VIEW
========================================================= */

const GoodsReceiptNoteItemView = ({
    open,
    item,
    onClose
}) => {

    /* =========================================================
       NO ITEM
    ========================================================= */

    if (!item) {
        return null;
    }


    /* =========================================================
       SAFE QUANTITIES
    ========================================================= */

    const receivedQuantity = Number(
        item.ReceivedQuantity ?? 0
    );

    const acceptedQuantity = Number(
        item.AcceptedQuantity ?? 0
    );

    const rejectedQuantity = Number(
        item.RejectedQuantity ?? 0
    );


    /* =========================================================
       STATUS
    ========================================================= */

    const status =
        rejectedQuantity > 0
            ? "Partially Rejected"
            : "Accepted";


    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap"
                    }}
                >

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Goods Receipt Note Item Details
                    </Typography>

                    <Chip
                        label={status}
                        color={
                            rejectedQuantity > 0
                                ? "warning"
                                : "success"
                        }
                        size="small"
                    />

                </Box>

            </DialogTitle>


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent dividers>

                {/* =================================================
                    BASIC INFORMATION
                ================================================= */}

                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{
                        mb: 2
                    }}
                >
                    Basic Information
                </Typography>

                <Grid
                    container
                    spacing={2}
                >

                    <DetailField
                        label="GRN Item ID"
                        value={
                            item.GoodsReceiptNoteItemId
                        }
                    />

                    <DetailField
                        label="Goods Receipt Note ID"
                        value={
                            item.GoodsReceiptNoteId
                        }
                    />

                    <DetailField
                        label="Product ID"
                        value={
                            item.ProductId
                        }
                    />

                </Grid>


                {/* =================================================
                    QUANTITY INFORMATION
                ================================================= */}

                <Divider
                    sx={{
                        my: 3
                    }}
                />

                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{
                        mb: 2
                    }}
                >
                    Quantity Information
                </Typography>

                <Grid
                    container
                    spacing={2}
                >

                    <DetailField
                        label="Received Quantity"
                        value={formatNumber(
                            receivedQuantity
                        )}
                    />

                    <DetailField
                        label="Accepted Quantity"
                        value={formatNumber(
                            acceptedQuantity
                        )}
                    />

                    <DetailField
                        label="Rejected Quantity"
                        value={formatNumber(
                            rejectedQuantity
                        )}
                    />

                </Grid>


                {/* =================================================
                    FINANCIAL INFORMATION
                ================================================= */}

                <Divider
                    sx={{
                        my: 3
                    }}
                />

                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{
                        mb: 2
                    }}
                >
                    Financial Information
                </Typography>

                <Grid
                    container
                    spacing={2}
                >

                    <DetailField
                        label="Unit Price"
                        value={item.UnitPrice}
                        currency
                    />

                    <DetailField
                        label="Tax Amount"
                        value={item.TaxAmount}
                        currency
                    />

                    <DetailField
                        label="Total Amount"
                        value={item.TotalAmount}
                        currency
                        bold
                    />

                </Grid>


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <Divider
                    sx={{
                        my: 3
                    }}
                />

                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider"
                    }}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1
                        }}
                    >
                        GRN Item Summary
                    </Typography>

                    <Typography
                        variant="body2"
                    >
                        Received{" "}
                        <strong>
                            {formatNumber(receivedQuantity)}
                        </strong>
                        {" "}units, of which{" "}
                        <strong>
                            {formatNumber(acceptedQuantity)}
                        </strong>
                        {" "}were accepted and{" "}
                        <strong>
                            {formatNumber(rejectedQuantity)}
                        </strong>
                        {" "}were rejected.
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            mt: 1
                        }}
                    >
                        Total Amount:{" "}
                        <strong>
                            {formatCurrency(
                                item.TotalAmount
                            )}
                        </strong>
                    </Typography>

                </Box>


                {/* =================================================
                    INFORMATION MESSAGE
                ================================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 3
                    }}
                >
                    This GRN item is linked with the Goods Receipt
                    Note and Product master.
                </Typography>

            </DialogContent>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    py: 2
                }}
            >

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


export default GoodsReceiptNoteItemView;

