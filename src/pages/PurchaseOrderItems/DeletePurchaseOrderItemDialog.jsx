// ============================================================
// DeletePurchaseOrderItemDialog.jsx
// ============================================================

import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Stack,
    Divider,
    Box
} from "@mui/material";

import {
    Delete,
    Warning
} from "@mui/icons-material";

// ============================================================
// FORMAT CURRENCY
// ============================================================

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

// ============================================================
// DELETE PURCHASE ORDER ITEM DIALOG
// ============================================================

const DeletePurchaseOrderItemDialog = ({
    open,
    item,
    onClose,
    onDeleted
}) => {

    // ========================================================
    // NORMALIZE ID
    // ========================================================

    const rawPurchaseOrderItemId =
        item?.purchaseOrderItemId ??
        item?.PurchaseOrderItemId ??
        item?.id ??
        null;

    const purchaseOrderItemId =
        rawPurchaseOrderItemId !== null &&
        rawPurchaseOrderItemId !== undefined &&
        rawPurchaseOrderItemId !== ""
            ? Number(rawPurchaseOrderItemId)
            : null;

    // ========================================================
    // NORMALIZE OTHER FIELDS
    // ========================================================

    const purchaseOrderId =
        item?.purchaseOrderId ??
        item?.PurchaseOrderId ??
        "-";

    const productId =
        item?.productId ??
        item?.ProductId ??
        "-";

    const quantity =
        item?.quantity ??
        item?.Quantity ??
        0;

    const unitPrice =
        item?.unitPrice ??
        item?.UnitPrice ??
        0;

    const discount =
        item?.discount ??
        item?.Discount ??
        0;

    const taxAmount =
        item?.taxAmount ??
        item?.TaxAmount ??
        0;

    const totalAmount =
        item?.totalAmount ??
        item?.TotalAmount ??
        0;

    const sellerId =
        item?.sellerId ??
        item?.SellerId ??
        "-";

    const customerId =
        item?.customerId ??
        item?.CustomerId ??
        "-";

    // ========================================================
    // VALID ID
    // ========================================================

    const hasValidId =
        Number.isInteger(purchaseOrderItemId) &&
        purchaseOrderItemId > 0;

    // ========================================================
    // HANDLE DELETE
    // ========================================================

    const handleDelete = () => {

        console.log(
            "================================================="
        );

        console.log(
            "DELETE PURCHASE ORDER ITEM DIALOG"
        );

        console.log(
            "SELECTED ITEM:",
            item
        );

        console.log(
            "RAW PURCHASE ORDER ITEM ID:",
            rawPurchaseOrderItemId
        );

        console.log(
            "NORMALIZED PURCHASE ORDER ITEM ID:",
            purchaseOrderItemId
        );

        console.log(
            "VALID ID:",
            hasValidId
        );

        console.log(
            "================================================="
        );

        if (!hasValidId) {

            console.error(
                "Invalid Purchase Order Item ID:",
                purchaseOrderItemId
            );

            return;
        }

        if (typeof onDeleted !== "function") {

            console.error(
                "DeletePurchaseOrderItemDialog: onDeleted is not a function"
            );

            return;
        }

        // IMPORTANT:
        // Pass the actual numeric PurchaseOrderItemId
        // to PurchaseOrderItemList.jsx

        onDeleted(purchaseOrderItemId);
    };

    // ========================================================
    // HANDLE CLOSE
    // ========================================================

    const handleClose = () => {

        if (typeof onClose === "function") {
            onClose();
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (

        <Dialog
            open={Boolean(open)}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            aria-labelledby="delete-purchase-order-item-title"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle
                id="delete-purchase-order-item-title"
            >

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                >

                    <Warning color="error" />

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Delete Purchase Order Item
                    </Typography>

                </Stack>

            </DialogTitle>

            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent>

                <DialogContentText
                    sx={{ mb: 2 }}
                >
                    Are you sure you want to delete this
                    Purchase Order Item?

                    <br />

                    <strong>
                        This action cannot be undone.
                    </strong>
                </DialogContentText>

                {item ? (

                    <Box>

                        <Divider sx={{ mb: 2 }} />

                        <Stack spacing={2}>

                            {/* ITEM ID */}

                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                >
                                    Purchase Order Item ID
                                </Typography>

                                <Typography
                                    variant="body2"
                                    fontWeight={700}
                                >
                                    {hasValidId
                                        ? purchaseOrderItemId
                                        : "-"
                                    }
                                </Typography>

                            </Box>

                            {/* PURCHASE ORDER ID */}

                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                >
                                    Purchase Order ID
                                </Typography>

                                <Typography
                                    variant="body2"
                                    fontWeight={500}
                                >
                                    {purchaseOrderId}
                                </Typography>

                            </Box>

                            {/* PRODUCT ID */}

                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                >
                                    Product ID
                                </Typography>

                                <Typography
                                    variant="body2"
                                    fontWeight={500}
                                >
                                    {productId}
                                </Typography>

                            </Box>

                            {/* QUANTITY */}

                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                >
                                    Quantity
                                </Typography>

                                <Typography
                                    variant="body2"
                                    fontWeight={500}
                                >
                                    {quantity}
                                </Typography>

                            </Box>

                            {/* UNIT PRICE */}

                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                >
                                    Unit Price
                                </Typography>

                                <Typography
                                    variant="body2"
                                    fontWeight={500}
                                >
                                    {formatCurrency(unitPrice)}
                                </Typography>

                            </Box>

                            {/* DISCOUNT */}

                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                >
                                    Discount
                                </Typography>

                                <Typography
                                    variant="body2"
                                    fontWeight={500}
                                >
                                    {formatCurrency(discount)}
                                </Typography>

                            </Box>

                            {/* TAX */}

                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                >
                                    Tax Amount
                                </Typography>

                                <Typography
                                    variant="body2"
                                    fontWeight={500}
                                >
                                    {formatCurrency(taxAmount)}
                                </Typography>

                            </Box>

                            {/* TOTAL */}

                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                >
                                    Total Amount
                                </Typography>

                                <Typography
                                    variant="body2"
                                    fontWeight={700}
                                >
                                    {formatCurrency(totalAmount)}
                                </Typography>

                            </Box>

                            {/* SELLER */}

                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                >
                                    Seller ID
                                </Typography>

                                <Typography variant="body2">
                                    {sellerId}
                                </Typography>

                            </Box>

                            {/* CUSTOMER */}

                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                >
                                    Customer ID
                                </Typography>

                                <Typography variant="body2">
                                    {customerId}
                                </Typography>

                            </Box>

                        </Stack>

                    </Box>

                ) : (

                    <Typography color="text.secondary">
                        No Purchase Order Item selected.
                    </Typography>

                )}

            </DialogContent>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2
                }}
            >

                <Button
                    onClick={handleClose}
                    color="inherit"
                    variant="outlined"
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    onClick={handleDelete}
                    disabled={!item || !hasValidId}
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>
    );
};

export default DeletePurchaseOrderItemDialog;
