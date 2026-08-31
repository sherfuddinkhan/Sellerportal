// =========================================================
// CustomerReturnView.jsx
// Customer Return Details Dialog
// =========================================================

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
    Box,
} from "@mui/material";

// =========================================================
// COMPONENT
// =========================================================

const CustomerReturnView = ({
    open,
    item,
    onClose,
}) => {

    // =====================================================
    // NO DATA
    // =====================================================

    if (!item) {
        return null;
    }

    // =====================================================
    // SUPPORT PAScalCase + camelCase
    // =====================================================

    const returnId =
        item.CustomerReturnId ??
        item.customerReturnId;

    const salesInvoiceId =
        item.SalesInvoiceId ??
        item.salesInvoiceId;

    const productId =
        item.ProductId ??
        item.productId;

    const returnNumber =
        item.ReturnNumber ??
        item.returnNumber;

    const returnDate =
        item.ReturnDate ??
        item.returnDate;

    const quantity =
        item.Quantity ??
        item.quantity ??
        0;

    const returnAmount =
        item.ReturnAmount ??
        item.returnAmount ??
        0;

    const reason =
        item.Reason ??
        item.reason;

    const status =
        item.Status ??
        item.status ??
        "N/A";

    const sellerId =
        item.SellerId ??
        item.sellerId;

    const customerId =
        item.CustomerId ??
        item.customerId;

    const createdDate =
        item.CreatedDate ??
        item.createdDate;

    // =====================================================
    // STATUS COLOR
    // =====================================================

    const getStatusColor = (value) => {

        switch (
            value?.toString().toLowerCase()
        ) {

            case "pending":
                return "warning";

            case "approved":
                return "info";

            case "processing":
                return "primary";

            case "completed":
                return "success";

            case "rejected":
                return "error";

            case "cancelled":
                return "error";

            default:
                return "default";
        }
    };

    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (value) => {

        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleString(
            "en-IN"
        );
    };

    // =====================================================
    // CURRENCY FORMAT
    // =====================================================

    const formatCurrency = (value) => {

        const amount = Number(value || 0);

        return `₹ ${amount.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;
    };

    // =====================================================
    // FIELD COMPONENT
    // =====================================================

    const Field = ({
        label,
        value,
    }) => {

        return (

            <Grid
                item
                xs={12}
                md={6}
            >

                <Typography
                    variant="caption"
                    color="text.secondary"
                >
                    {label}
                </Typography>

                <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{
                        mt: 0.5,
                        wordBreak: "break-word",
                    }}
                >
                    {value !== null &&
                    value !== undefined &&
                    value !== ""
                        ? value
                        : "-"
                    }
                </Typography>

            </Grid>

        );
    };

    // =====================================================
    // RENDER
    // =====================================================

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

                <Typography
                    variant="h6"
                    fontWeight={600}
                >
                    Customer Return Details
                </Typography>

                {returnNumber && (

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {returnNumber}
                    </Typography>

                )}

            </DialogTitle>

            <Divider />

            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent
                sx={{
                    mt: 2,
                }}
            >

                {/* =================================================
                    RETURN INFORMATION
                ================================================= */}

                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                        mb: 2,
                    }}
                >
                    Return Information
                </Typography>

                <Grid
                    container
                    spacing={3}
                >

                    <Field
                        label="Return ID"
                        value={returnId}
                    />

                    <Field
                        label="Return Number"
                        value={returnNumber}
                    />

                    <Field
                        label="Return Date"
                        value={formatDate(returnDate)}
                    />

                    <Field
                        label="Status"
                        value={
                            <Chip
                                label={status}
                                color={getStatusColor(status)}
                                size="small"
                            />
                        }
                    />

                </Grid>


                {/* =================================================
                    TRANSACTION INFORMATION
                ================================================= */}

                <Divider
                    sx={{
                        my: 3,
                    }}
                />

                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                        mb: 2,
                    }}
                >
                    Transaction Information
                </Typography>

                <Grid
                    container
                    spacing={3}
                >

                    <Field
                        label="Sales Invoice ID"
                        value={salesInvoiceId}
                    />

                    <Field
                        label="Product ID"
                        value={productId}
                    />

                    <Field
                        label="Quantity"
                        value={quantity}
                    />

                    <Field
                        label="Return Amount"
                        value={formatCurrency(
                            returnAmount
                        )}
                    />

                    <Field
                        label="Reason"
                        value={reason}
                    />

                </Grid>


                {/* =================================================
                    CUSTOMER / SELLER INFORMATION
                ================================================= */}

                <Divider
                    sx={{
                        my: 3,
                    }}
                />

                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                        mb: 2,
                    }}
                >
                    Customer / Seller Information
                </Typography>

                <Grid
                    container
                    spacing={3}
                >

                    <Field
                        label="Seller ID"
                        value={sellerId}
                    />

                    <Field
                        label="Customer ID"
                        value={customerId}
                    />

                </Grid>


                {/* =================================================
                    SYSTEM INFORMATION
                ================================================= */}

                <Divider
                    sx={{
                        my: 3,
                    }}
                />

                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                        mb: 2,
                    }}
                >
                    System Information
                </Typography>

                <Grid
                    container
                    spacing={3}
                >

                    <Field
                        label="Created Date"
                        value={formatDate(
                            createdDate
                        )}
                    />

                </Grid>

            </DialogContent>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2,
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

// =========================================================
// EXPORT
// =========================================================

export default CustomerReturnView;
