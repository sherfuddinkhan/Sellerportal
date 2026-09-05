import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Typography,
    Button,
    Divider,
    Chip,
    Box
} from "@mui/material";


/* =========================================================
   FORMAT AMOUNT
========================================================= */

const formatAmount = (value) => {

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

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

};


/* =========================================================
   STATUS COLOR
========================================================= */

const getStatusColor = (status) => {

    switch (
        String(status || "")
            .trim()
            .toLowerCase()
    ) {

        case "completed":
            return "success";

        case "pending":
            return "warning";

        case "cancelled":
        case "canceled":
            return "error";

        case "approved":
            return "info";

        case "rejected":
            return "error";

        default:
            return "default";
    }

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
   SECTION TITLE
========================================================= */

const SectionTitle = ({
    children
}) => {

    return (

        <Grid item xs={12}>

            <Divider
                sx={{
                    my: 1
                }}
            >

                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                >
                    {children}
                </Typography>

            </Divider>

        </Grid>

    );

};


/* =========================================================
   PURCHASE RETURN VIEW
========================================================= */

const PurchaseReturnView = ({
    open,
    onClose,
    purchaseReturn
}) => {

    if (!purchaseReturn) {
        return null;
    }


    const status =
        purchaseReturn.Status || "N/A";


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
                    fontWeight="bold"
                >
                    Purchase Return Details
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 0.5
                    }}
                >
                    {
                        purchaseReturn.PurchaseReturnNumber ||
                        "Purchase Return"
                    }
                </Typography>

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
                        PURCHASE RETURN INFORMATION
                    ========================================== */}

                    <SectionTitle>
                        Purchase Return Information
                    </SectionTitle>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <DetailField
                            label="Purchase Return ID"
                            value={
                                purchaseReturn.PurchaseReturnId
                            }
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <DetailField
                            label="Purchase Return Number"
                            value={
                                purchaseReturn.PurchaseReturnNumber
                            }
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <DetailField
                            label="Purchase Order ID"
                            value={
                                purchaseReturn.PurchaseOrderId
                            }
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <DetailField
                            label="Goods Receipt Note ID"
                            value={
                                purchaseReturn.GoodsReceiptNoteId
                            }
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <DetailField
                            label="Supplier ID"
                            value={
                                purchaseReturn.SupplierId
                            }
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <DetailField
                            label="Return Date"
                            value={
                                formatDate(
                                    purchaseReturn.ReturnDate
                                )
                            }
                        />

                    </Grid>


                    {/* =========================================
                        FINANCIAL DETAILS
                    ========================================== */}

                    <SectionTitle>
                        Financial Details
                    </SectionTitle>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <DetailField
                            label="Total Amount"
                        >

                            <Typography
                                variant="h6"
                                color="primary"
                                fontWeight="bold"
                            >
                                {
                                    formatAmount(
                                        purchaseReturn.TotalAmount
                                    )
                                }
                            </Typography>

                        </DetailField>

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <DetailField
                            label="Status"
                        >

                            <Chip
                                label={status}
                                size="small"
                                color={
                                    getStatusColor(status)
                                }
                            />

                        </DetailField>

                    </Grid>


                    {/* =========================================
                        ADDITIONAL INFORMATION
                    ========================================== */}

                    <SectionTitle>
                        Additional Information
                    </SectionTitle>


                    <Grid
                        item
                        xs={12}
                    >

                        <DetailField
                            label="Reason"
                            value={
                                purchaseReturn.Reason ||
                                "-"
                            }
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <DetailField
                            label="Created Date"
                            value={
                                formatDate(
                                    purchaseReturn.CreatedDate
                                )
                            }
                        />

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


export default PurchaseReturnView;