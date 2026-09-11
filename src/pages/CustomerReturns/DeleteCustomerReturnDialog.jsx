// =========================================================
// DeleteCustomerReturnDialog.jsx
// =========================================================

import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider,
    Stack,
} from "@mui/material";

// =========================================================
// COMPONENT
// =========================================================

const DeleteCustomerReturnDialog = ({
    open = false,
    item = null,
    onClose,
    onDeleted,
}) => {

    if (!item) {
        return null;
    }

    // =====================================================
    // GET ID
    // =====================================================

    const rawReturnId =
        item.CustomerReturnId ??
        item.customerReturnId ??
        item.Id ??
        item.id;

    const returnId =
        Number(rawReturnId);

    // =====================================================
    // OTHER VALUES
    // =====================================================

    const salesInvoiceId =
        item.SalesInvoiceId ??
        item.salesInvoiceId ??
        "-";

    const productId =
        item.ProductId ??
        item.productId ??
        "-";

    const returnNumber =
        item.ReturnNumber ??
        item.returnNumber ??
        "-";

    const quantity =
        item.Quantity ??
        item.quantity ??
        0;

    const returnAmount =
        item.ReturnAmount ??
        item.returnAmount ??
        0;

    const status =
        item.Status ??
        item.status ??
        "-";

    // =====================================================
    // VALID ID
    // =====================================================

    const validId =
        Number.isInteger(returnId) &&
        returnId > 0;

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = () => {

        console.log(
            "DELETE DIALOG"
        );

        console.log(
            "Raw Return ID:",
            rawReturnId
        );

        console.log(
            "Numeric Return ID:",
            returnId
        );

        // -------------------------------------------------
        // NEVER send NaN
        // -------------------------------------------------

        if (!validId) {

            console.error(
                "Invalid Customer Return ID:",
                item
            );

            return;
        }

        if (
            typeof onDeleted ===
            "function"
        ) {

            onDeleted(returnId);

        }

    };

    // =====================================================
    // FORMAT AMOUNT
    // =====================================================

    const formatAmount = (value) => {

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
    // RENDER
    // =====================================================

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>
                Delete Customer Return
            </DialogTitle>

            <Divider />

            <DialogContent
                sx={{
                    pt: 3,
                }}
            >

                <Typography
                    sx={{
                        mb: 3,
                    }}
                >
                    Are you sure you want to delete this
                    customer return?
                </Typography>

                <Stack spacing={1.25}>

                    <Typography
                        fontWeight={600}
                    >
                        Return ID:{" "}
                        {validId
                            ? returnId
                            : "-"
                        }
                    </Typography>

                    <Typography>
                        Invoice ID:{" "}
                        {salesInvoiceId}
                    </Typography>

                    <Typography>
                        Product ID:{" "}
                        {productId}
                    </Typography>

                    <Typography>
                        Return Number:{" "}
                        {returnNumber}
                    </Typography>

                    <Typography>
                        Quantity:{" "}
                        {quantity}
                    </Typography>

                    <Typography>
                        Return Amount:{" "}
                        {formatAmount(
                            returnAmount
                        )}
                    </Typography>

                    <Typography>
                        Status:{" "}
                        {status}
                    </Typography>

                </Stack>

            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2,
                    gap: 1,
                }}
            >

                <Button
                    variant="outlined"
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    disabled={!validId}
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>
    );
};

export default DeleteCustomerReturnDialog;