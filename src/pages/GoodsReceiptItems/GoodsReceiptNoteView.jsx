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
   FORMAT DATE
========================================================= */

const formatDate = (value) => {

    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};


/* =========================================================
   STATUS COLOR
========================================================= */

const getStatusColor = (status) => {

    const value = String(status || "").toLowerCase();

    if (
        value === "completed" ||
        value === "received" ||
        value === "approved"
    ) {
        return "success";
    }

    if (
        value === "pending" ||
        value === "processing"
    ) {
        return "warning";
    }

    if (
        value === "cancelled" ||
        value === "rejected"
    ) {
        return "error";
    }

    return "default";
};


/* =========================================================
   DETAIL FIELD
========================================================= */

const DetailField = ({
    label,
    value,
    children
}) => {

    return (
        <Box>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    mb: 0.5
                }}
            >
                {label}
            </Typography>

            {children || (
                <Typography
                    variant="body1"
                    fontWeight={500}
                >
                    {value ?? "-"}
                </Typography>
            )}

        </Box>
    );
};


/* =========================================================
   GOODS RECEIPT NOTE VIEW
========================================================= */

const GoodsReceiptNoteView = ({
    open,
    note,
    onClose
}) => {

    if (!note) {
        return null;
    }


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
                Goods Receipt Note Details
            </DialogTitle>


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent dividers>

                <Grid
                    container
                    spacing={3}
                >

                    {/* =========================================
                        GRN ID
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <DetailField
                            label="GRN ID"
                            value={note.GoodsReceiptNoteId}
                        />

                    </Grid>


                    {/* =========================================
                        GRN NUMBER
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <DetailField
                            label="GRN Number"
                            value={note.GRNNumber}
                        />

                    </Grid>


                    {/* =========================================
                        PURCHASE ORDER
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <DetailField
                            label="Purchase Order ID"
                            value={note.PurchaseOrderId}
                        />

                    </Grid>


                    {/* =========================================
                        SELLER
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <DetailField
                            label="Seller ID"
                            value={note.SellerId}
                        />

                    </Grid>


                    {/* =========================================
                        SUPPLIER
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <DetailField
                            label="Supplier ID"
                            value={note.SupplierId}
                        />

                    </Grid>


                    {/* =========================================
                        RECEIPT DATE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <DetailField
                            label="Receipt Date"
                            value={formatDate(note.ReceiptDate)}
                        />

                    </Grid>


                    {/* =========================================
                        STATUS
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <DetailField label="Status">

                            <Chip
                                label={
                                    note.Status || "Unknown"
                                }
                                color={
                                    getStatusColor(note.Status)
                                }
                                size="small"
                                variant="outlined"
                            />

                        </DetailField>

                    </Grid>


                    {/* =========================================
                        TOTAL AMOUNT
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <DetailField label="Total Amount">

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                {formatCurrency(
                                    note.TotalAmount
                                )}
                            </Typography>

                        </DetailField>

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
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 0.5
                            }}
                        >
                            Remarks
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                whiteSpace: "pre-wrap"
                            }}
                        >
                            {note.Remarks || "No remarks"}
                        </Typography>

                    </Grid>

                </Grid>

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


export default GoodsReceiptNoteView;
