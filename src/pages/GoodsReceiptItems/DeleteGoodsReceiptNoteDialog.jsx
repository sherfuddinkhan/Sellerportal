
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
   DELETE GOODS RECEIPT NOTE DIALOG
========================================================= */

const DeleteGoodsReceiptNoteDialog = ({
    open,
    note,
    onClose,
    onDeleted
}) => {


    /* =====================================================
       HANDLE DELETE
    ===================================================== */

    const handleDelete = () => {

        if (!note?.GoodsReceiptNoteId) {
            return;
        }

        if (typeof onDeleted === "function") {
            onDeleted(note.GoodsReceiptNoteId);
        }
    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle>
                Delete Goods Receipt Note
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
                    Receipt Note? This action cannot be undone.
                </DialogContentText>


                {note && (

                    <>

                        <Divider sx={{ mb: 2 }} />


                        <Stack spacing={1.25}>

                            {/* =====================================
                                GRN ID
                            ===================================== */}

                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    GRN ID
                                </Typography>

                                <Typography fontWeight={600}>
                                    {note.GoodsReceiptNoteId ?? "-"}
                                </Typography>
                            </Box>


                            {/* =====================================
                                GRN NUMBER
                            ===================================== */}

                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    GRN Number
                                </Typography>

                                <Typography fontWeight={600}>
                                    {note.GRNNumber || "-"}
                                </Typography>
                            </Box>


                            {/* =====================================
                                PURCHASE ORDER
                            ===================================== */}

                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Purchase Order ID
                                </Typography>

                                <Typography fontWeight={600}>
                                    {note.PurchaseOrderId ?? "-"}
                                </Typography>
                            </Box>


                            {/* =====================================
                                SUPPLIER
                            ===================================== */}

                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Supplier ID
                                </Typography>

                                <Typography fontWeight={600}>
                                    {note.SupplierId ?? "-"}
                                </Typography>
                            </Box>


                            {/* =====================================
                                STATUS
                            ===================================== */}

                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Status
                                </Typography>

                                <Typography fontWeight={600}>
                                    {note.Status || "-"}
                                </Typography>
                            </Box>


                            {/* =====================================
                                TOTAL AMOUNT
                            ===================================== */}

                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Total Amount
                                </Typography>

                                <Typography
                                    fontWeight={700}
                                    color="error.main"
                                >
                                    {formatCurrency(note.TotalAmount)}
                                </Typography>
                            </Box>

                        </Stack>

                    </>
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
                    onClick={onClose}
                    color="inherit"
                >
                    Cancel
                </Button>


                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    disabled={!note?.GoodsReceiptNoteId}
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default DeleteGoodsReceiptNoteDialog;

