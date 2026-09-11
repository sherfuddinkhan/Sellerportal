// =========================================================
// CustomerReturnView.jsx
// Customer Return Details Dialog
//
// Displays:
// - Return information
// - Transaction information
// - Customer / Seller information
// - System information
//
// Supports:
// PascalCase + camelCase API responses
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
    open = false,
    item = null,
    onClose,
}) => {

    // =====================================================
    // NO DATA
    // =====================================================

    if (!item) {
        return null;
    }

    // =====================================================
    // SUPPORT PascalCase + camelCase
    // =====================================================

    const returnId =
        item.CustomerReturnId ??
        item.customerReturnId ??
        item.Id ??
        item.id;

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

    const updatedDate =
        item.UpdatedDate ??
        item.updatedDate;

    // =====================================================
    // STATUS COLOR
    // =====================================================

    const getStatusColor = (value) => {

        switch (
            String(value || "")
                .trim()
                .toLowerCase()
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

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "-";
        }

        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );

    };

    // =====================================================
    // CURRENCY FORMAT
    // =====================================================

    const formatCurrency = (value) => {

        const amount =
            Number(value);

        if (
            Number.isNaN(amount)
        ) {
            return "₹ 0.00";
        }

        return (
            `₹ ${amount.toLocaleString(
                "en-IN",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }
            )}`
        );

    };

    // =====================================================
    // VALUE DISPLAY
    // =====================================================

    const displayValue = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "-";
        }

        return value;

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
                sm={6}
                md={6}
            >

                <Box>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        {label}
                    </Typography>

                    <Box
                        sx={{
                            mt: 0.5,
                            minHeight: 24,
                            wordBreak: "break-word",
                        }}
                    >

                        {typeof value === "object"
                            ? value
                            : (
                                <Typography
                                    variant="body1"
                                    fontWeight={500}
                                >
                                    {displayValue(
                                        value
                                    )}
                                </Typography>
                            )
                        }

                    </Box>

                </Box>

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
            scroll="paper"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle
                sx={{
                    pb: 1,
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight={600}
                >
                    Customer Return Details
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 0.5,
                    }}
                >
                    {returnNumber
                        ? returnNumber
                        : `Return ID: ${displayValue(returnId)}`
                    }
                </Typography>

            </DialogTitle>

            <Divider />


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent
                sx={{
                    pt: 3,
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
                        value={formatDate(
                            returnDate
                        )}
                    />

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Status
                        </Typography>

                        <Box
                            sx={{
                                mt: 0.75,
                            }}
                        >

                            <Chip
                                label={
                                    status
                                }
                                color={
                                    getStatusColor(
                                        status
                                    )
                                }
                                size="small"
                            />

                        </Box>

                    </Grid>

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

                    <Field
                        label="Updated Date"
                        value={formatDate(
                            updatedDate
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
                    py: 2,
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