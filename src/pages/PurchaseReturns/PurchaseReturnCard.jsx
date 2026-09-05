import React from "react";

import {
    Card,
    CardContent,
    Typography,
    Box,
    Stack,
    Chip,
    Button,
    Divider
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    AssignmentReturn
} from "@mui/icons-material";


/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "₹ 0.00";
    }

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

    const normalizedStatus =
        String(status || "")
            .trim()
            .toLowerCase();

    switch (normalizedStatus) {

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
   PURCHASE RETURN CARD
========================================================= */

const PurchaseReturnCard = ({
    purchaseReturn,
    onView,
    onEdit,
    onDelete
}) => {

    /* =====================================================
       NULL CHECK
    ===================================================== */

    if (!purchaseReturn) {
        return null;
    }


    /* =====================================================
       SUPPORT API CAMELCASE + PASCALCASE
    ===================================================== */

    const purchaseReturnId =
        purchaseReturn.purchaseReturnId ??
        purchaseReturn.PurchaseReturnId ??
        0;

    const purchaseReturnNumber =
        purchaseReturn.purchaseReturnNumber ??
        purchaseReturn.PurchaseReturnNumber ??
        "-";

    const purchaseOrderId =
        purchaseReturn.purchaseOrderId ??
        purchaseReturn.PurchaseOrderId ??
        "-";

    const goodsReceiptNoteId =
        purchaseReturn.goodsReceiptNoteId ??
        purchaseReturn.GoodsReceiptNoteId ??
        "-";

    const supplierId =
        purchaseReturn.supplierId ??
        purchaseReturn.SupplierId ??
        "-";

    const sellerId =
        purchaseReturn.sellerId ??
        purchaseReturn.SellerId ??
        "-";

    const customerId =
        purchaseReturn.customerId ??
        purchaseReturn.CustomerId ??
        "-";

    const returnDate =
        purchaseReturn.returnDate ??
        purchaseReturn.ReturnDate;

    const totalAmount =
        purchaseReturn.totalAmount ??
        purchaseReturn.TotalAmount ??
        0;

    const status =
        purchaseReturn.status ??
        purchaseReturn.Status ??
        "N/A";

    const reason =
        purchaseReturn.reason ??
        purchaseReturn.Reason ??
        "-";

    const createdDate =
        purchaseReturn.createdDate ??
        purchaseReturn.CreatedDate;

    const updatedDate =
        purchaseReturn.updatedDate ??
        purchaseReturn.UpdatedDate;


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Card
            className="purchase-return-card"
            elevation={3}
            sx={{
                width: "100%",
                height: "100%"
            }}
        >

            <CardContent>

                {/* =================================================
                    HEADER
                ================================================= */}

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={2}
                    mb={2}
                >

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        minWidth={0}
                    >

                        <AssignmentReturn
                            color="primary"
                        />

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            noWrap
                        >
                            {purchaseReturnNumber}
                        </Typography>

                    </Box>


                    <Chip
                        label={status}
                        color={getStatusColor(status)}
                        size="small"
                    />

                </Box>


                <Divider sx={{ mb: 2 }} />


                {/* =================================================
                    PURCHASE RETURN ID
                ================================================= */}

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Purchase Return ID:</strong>{" "}

                    {purchaseReturnId}

                </Typography>


                {/* =================================================
                    PURCHASE ORDER
                ================================================= */}

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Purchase Order:</strong>{" "}

                    {purchaseOrderId}

                </Typography>


                {/* =================================================
                    GOODS RECEIPT NOTE
                ================================================= */}

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Goods Receipt Note:</strong>{" "}

                    {goodsReceiptNoteId}

                </Typography>


                {/* =================================================
                    SUPPLIER
                ================================================= */}

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Supplier:</strong>{" "}

                    {supplierId}

                </Typography>


                {/* =================================================
                    SELLER
                ================================================= */}

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Seller:</strong>{" "}

                    {sellerId}

                </Typography>


                {/* =================================================
                    CUSTOMER
                ================================================= */}

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Customer:</strong>{" "}

                    {customerId}

                </Typography>


                {/* =================================================
                    RETURN DATE
                ================================================= */}

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Return Date:</strong>{" "}

                    {formatDate(returnDate)}

                </Typography>


                {/* =================================================
                    TOTAL AMOUNT
                ================================================= */}

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Total Amount:</strong>{" "}

                     {formatCurrency(
        purchaseReturn?.totalAmount ??
        purchaseReturn?.TotalAmount ??
        0
    )}


                </Typography>


                {/* =================================================
                    REASON
                ================================================= */}

                <Typography
                    variant="body2"
                    gutterBottom
                    sx={{
                        wordBreak: "break-word"
                    }}
                >

                    <strong>Reason:</strong>{" "}

                    {reason}

                </Typography>


                {/* =================================================
                    CREATED DATE
                ================================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                >

                    <strong>Created Date:</strong>{" "}

                    {formatDate(createdDate)}

                </Typography>


                {/* =================================================
                    UPDATED DATE
                ================================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                >

                    <strong>Updated Date:</strong>{" "}

                    {formatDate(updatedDate)}

                </Typography>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <Stack
                    direction="row"
                    spacing={1}
                    mt={3}
                    flexWrap="wrap"
                    useFlexGap
                >

                    {/* =================================================
                        VIEW
                    ================================================= */}

                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => {

                            if (
                                typeof onView === "function"
                            ) {
                                onView(purchaseReturn);
                            }

                        }}
                    >
                        View
                    </Button>


                    {/* =================================================
                        EDIT
                    ================================================= */}

                    <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        startIcon={<Edit />}
                        onClick={() => {

                            if (
                                typeof onEdit === "function"
                            ) {
                                onEdit(purchaseReturn);
                            }

                        }}
                    >
                        Edit
                    </Button>


                    {/* =================================================
                        DELETE
                    ================================================= */}

                    <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => {

                            if (
                                typeof onDelete === "function"
                            ) {
                                onDelete(purchaseReturn);
                            }

                        }}
                    >
                        Delete
                    </Button>

                </Stack>

            </CardContent>

        </Card>
    );
};


export default PurchaseReturnCard;