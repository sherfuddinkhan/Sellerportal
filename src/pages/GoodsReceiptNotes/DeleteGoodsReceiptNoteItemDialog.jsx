import React, { useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Divider,
    Box,
    CircularProgress
} from "@mui/material";


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
   DELETE GOODS RECEIPT NOTE ITEM DIALOG
========================================================= */

const DeleteGoodsReceiptNoteItemDialog = ({
    open,
    item,
    onClose,
    onDeleted
}) => {

    const [deleting, setDeleting] = useState(false);


    /* =====================================================
       HANDLE DELETE
    ===================================================== */

    const handleDelete = async () => {

        if (!item) {
            return;
        }

        const itemId =
            item.GoodsReceiptNoteItemId;

        if (!itemId) {
            return;
        }

        try {

            setDeleting(true);

            await onDeleted(itemId);

        } catch (error) {

            console.error(
                "DELETE GRN ITEM DIALOG ERROR:",
                error
            );

        } finally {

            setDeleting(false);

        }
    };


    /* =====================================================
       HANDLE CLOSE
    ===================================================== */

    const handleClose = () => {

        if (deleting) {
            return;
        }

        onClose();
    };


    return (

        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle
                sx={{
                    fontWeight: "bold"
                }}
            >
                Delete Goods Receipt Note Item
            </DialogTitle>


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent>

                <DialogContentText
                    sx={{
                        mb: 2
                    }}
                >
                    Are you sure you want to delete this Goods
                    Receipt Note Item?
                </DialogContentText>


                <DialogContentText
                    sx={{
                        mb: 3,
                        color: "error.main",
                        fontWeight: 500
                    }}
                >
                    This action cannot be undone.
                </DialogContentText>


                {item && (

                    <Box>

                        {/* =====================================
                            GRN ITEM ID
                        ===================================== */}

                        <Typography sx={{ mb: 1 }}>

                            <strong>
                                GRN Item ID:
                            </strong>{" "}

                            {item.GoodsReceiptNoteItemId ?? "-"}

                        </Typography>


                        {/* =====================================
                            GRN ID
                        ===================================== */}

                        <Typography sx={{ mb: 1 }}>

                            <strong>
                                GRN ID:
                            </strong>{" "}

                            {item.GoodsReceiptNoteId ?? "-"}

                        </Typography>


                        {/* =====================================
                            PRODUCT ID
                        ===================================== */}

                        <Typography sx={{ mb: 1 }}>

                            <strong>
                                Product ID:
                            </strong>{" "}

                            {item.ProductId ?? "-"}

                        </Typography>


                        <Divider sx={{ my: 2 }} />


                        {/* =====================================
                            RECEIVED QUANTITY
                        ===================================== */}

                        <Typography sx={{ mb: 1 }}>

                            <strong>
                                Received Quantity:
                            </strong>{" "}

                            {item.ReceivedQuantity ?? 0}

                        </Typography>


                        {/* =====================================
                            ACCEPTED QUANTITY
                        ===================================== */}

                        <Typography sx={{ mb: 1 }}>

                            <strong>
                                Accepted Quantity:
                            </strong>{" "}

                            {item.AcceptedQuantity ?? 0}

                        </Typography>


                        {/* =====================================
                            REJECTED QUANTITY
                        ===================================== */}

                        <Typography sx={{ mb: 1 }}>

                            <strong>
                                Rejected Quantity:
                            </strong>{" "}

                            {item.RejectedQuantity ?? 0}

                        </Typography>


                        {/* =====================================
                            UNIT PRICE
                        ===================================== */}

                        <Typography sx={{ mb: 1 }}>

                            <strong>
                                Unit Price:
                            </strong>{" "}

                            {formatCurrency(
                                item.UnitPrice
                            )}

                        </Typography>


                        {/* =====================================
                            TAX
                        ===================================== */}

                        <Typography sx={{ mb: 1 }}>

                            <strong>
                                Tax:
                            </strong>{" "}

                            {formatCurrency(
                                item.TaxAmount
                            )}

                        </Typography>


                        {/* =====================================
                            TOTAL
                        ===================================== */}

                        <Typography
                            fontWeight="bold"
                            sx={{
                                mt: 1
                            }}
                        >

                            <strong>
                                Total Amount:
                            </strong>{" "}

                            {formatCurrency(
                                item.TotalAmount
                            )}

                        </Typography>

                    </Box>
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

                {/* CANCEL */}

                <Button
                    onClick={handleClose}
                    color="inherit"
                    disabled={deleting}
                >
                    Cancel
                </Button>


                {/* DELETE */}

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    disabled={
                        deleting ||
                        !item ||
                        !item.GoodsReceiptNoteItemId
                    }
                    startIcon={
                        deleting
                            ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            )
                            : null
                    }
                >

                    {deleting
                        ? "Deleting..."
                        : "Delete"}

                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default DeleteGoodsReceiptNoteItemDialog;
