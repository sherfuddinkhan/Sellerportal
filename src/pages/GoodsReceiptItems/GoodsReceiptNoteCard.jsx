import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Divider,
    Stack,
    Button,
    Box
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";


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
        value === "received" ||
        value === "completed" ||
        value === "approved"
    ) {
        return "success.main";
    }

    if (
        value === "pending" ||
        value === "processing"
    ) {
        return "warning.main";
    }

    if (
        value === "cancelled" ||
        value === "rejected"
    ) {
        return "error.main";
    }

    return "text.primary";
};


/* =========================================================
   GOODS RECEIPT NOTE CARD
========================================================= */

const GoodsReceiptNoteCard = ({
    note,
    onView,
    onEdit,
    onDelete
}) => {

    if (!note) {
        return null;
    }


    return (
        <Card
            className="goods-receipt-note-card"
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                overflow: "hidden"
            }}
        >

            {/* =================================================
                CARD CONTENT
            ================================================= */}

            <CardContent sx={{ flexGrow: 1 }}>

                {/* =================================================
                    GRN HEADER
                ================================================= */}

                <Typography
                    variant="h6"
                    fontWeight={700}
                    gutterBottom
                    noWrap
                >
                    {note.GRNNumber || "GRN"}
                </Typography>


                {/* =================================================
                    BASIC IDENTIFIERS
                ================================================= */}

                <Stack spacing={0.5}>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        <strong>GRN ID:</strong>{" "}
                        {note.GoodsReceiptNoteId ?? "-"}
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        <strong>Purchase Order ID:</strong>{" "}
                        {note.PurchaseOrderId ?? "-"}
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        <strong>Supplier ID:</strong>{" "}
                        {note.SupplierId ?? "-"}
                    </Typography>

                </Stack>


                <Divider sx={{ my: 2 }} />


                {/* =================================================
                    GRN DETAILS
                ================================================= */}

                <Stack spacing={1.25}>

                    <Typography variant="body2">
                        <strong>Receipt Date:</strong>{" "}
                        {formatDate(note.ReceiptDate)}
                    </Typography>


                    <Box>

                        <Typography
                            variant="body2"
                            component="span"
                        >
                            <strong>Status:</strong>{" "}
                        </Typography>

                        <Typography
                            variant="body2"
                            component="span"
                            fontWeight={700}
                            sx={{
                                color: getStatusColor(note.Status)
                            }}
                        >
                            {note.Status || "-"}
                        </Typography>

                    </Box>


                    <Typography
                        variant="body1"
                        fontWeight={700}
                    >
                        <strong>Total Amount:</strong>{" "}
                        {formatCurrency(note.TotalAmount)}
                    </Typography>

                </Stack>

            </CardContent>


            {/* =================================================
                CARD ACTIONS
            ================================================= */}

            <CardActions
                sx={{
                    px: 2,
                    pb: 2,
                    pt: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 1
                }}
            >

                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={() => onView?.(note)}
                >
                    View
                </Button>


                <Button
                    size="small"
                    color="warning"
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => onEdit?.(note)}
                >
                    Edit
                </Button>


                <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    startIcon={<Delete />}
                    onClick={() => onDelete?.(note)}
                >
                    Delete
                </Button>

            </CardActions>

        </Card>
    );
};


export default GoodsReceiptNoteCard;
