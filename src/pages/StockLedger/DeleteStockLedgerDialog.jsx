import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Alert,
    Box
} from "@mui/material";


// =========================================================
// DELETE STOCK LEDGER DIALOG
// =========================================================

const DeleteStockLedgerDialog = ({
    open,
    ledger,
    onClose,
    onDeleted
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

    const transactionType =
        ledger.transactionType ??
        ledger.TransactionType;

    const productId =
        ledger.productId ??
        ledger.ProductId;


    // ---------------------------------------------------------
    // HANDLE DELETE
    // ---------------------------------------------------------

    const handleDelete = () => {

        if (!stockLedgerId) {
            return;
        }

        onDeleted?.(stockLedgerId);
    };


    // ---------------------------------------------------------
    // RENDER
    // ---------------------------------------------------------

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            className="delete-stock-ledger-dialog"
        >

            {/* =================================================
                TITLE
            ================================================== */}

            <DialogTitle>
                Delete Stock Ledger Entry
            </DialogTitle>


            {/* =================================================
                CONTENT
            ================================================== */}

            <DialogContent dividers>

                <Alert
                    severity="warning"
                    sx={{
                        mb: 2
                    }}
                >
                    This action cannot be undone.
                </Alert>


                <Typography>
                    Are you sure you want to delete this Stock Ledger
                    record?
                </Typography>


                {/* =============================================
                    RECORD DETAILS
                ============================================== */}

                <Box
                    sx={{
                        mt: 2
                    }}
                >

                    <Typography
                        variant="subtitle2"
                        sx={{
                            mb: 0.5
                        }}
                    >
                        Stock Ledger ID:{" "}
                        {stockLedgerId ?? "-"}
                    </Typography>


                    <Typography
                        variant="subtitle2"
                        sx={{
                            mb: 0.5
                        }}
                    >
                        Transaction Type:{" "}
                        {transactionType || "-"}
                    </Typography>


                    <Typography
                        variant="subtitle2"
                    >
                        Product ID:{" "}
                        {productId ?? "-"}
                    </Typography>

                </Box>

            </DialogContent>


            {/* =================================================
                ACTIONS
            ================================================== */}

            <DialogActions>

                <Button
                    onClick={() => onClose?.()}
                    color="inherit"
                >
                    Cancel
                </Button>


                <Button
                    onClick={handleDelete}
                    variant="contained"
                    color="error"
                    disabled={!stockLedgerId}
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default DeleteStockLedgerDialog;

