import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Stack,
    Divider,
    Button,
    Chip,
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
   GET STATUS COLOR
========================================================= */

const getStatusColor = (status) => {

    switch (
        String(status || "").toLowerCase()
    ) {

        case "completed":

            return "success";


        case "processing":

            return "info";


        case "pending":

            return "warning";


        case "cancelled":

            return "error";


        default:

            return "default";

    }

};


/* =========================================================
   PURCHASE ORDER CARD
========================================================= */

const PurchaseOrderCard = ({

    item,

    onView,

    onEdit,

    onDelete

}) => {


    /* =====================================================
       NO ITEM
    ===================================================== */

    if (!item) {

        return null;

    }


    /* =====================================================
       NORMALIZE API DATA
    ===================================================== */

    const purchaseOrderId =

        item.PurchaseOrderId ??
        item.purchaseOrderId ??
        0;


    const purchaseOrderNumber =

        item.PurchaseOrderNumber ??
        item.purchaseOrderNumber ??
        "-";


    const sellerId =

        item.SellerId ??
        item.sellerId ??
        "-";


    const supplierId =

        item.SupplierId ??
        item.supplierId ??
        "-";


    const orderDate =

        item.OrderDate ??
        item.orderDate;


    const expectedDeliveryDate =

        item.ExpectedDeliveryDate ??
        item.expectedDeliveryDate;


    const status =

        item.Status ??
        item.status ??
        "";


    const totalAmount =

        item.TotalAmount ??
        item.totalAmount ??
        0;


    const remarks =

        item.Remarks ??
        item.remarks ??
        "";


    /* =====================================================
       HANDLE VIEW
    ===================================================== */

    const handleView = () => {

        if (
            typeof onView === "function"
        ) {

            onView(item);

        }

    };


    /* =====================================================
       HANDLE EDIT
    ===================================================== */

    const handleEdit = () => {

        if (
            typeof onEdit === "function"
        ) {

            onEdit(item);

        }

    };


    /* =====================================================
       HANDLE DELETE
    ===================================================== */

    const handleDelete = () => {

        if (
            typeof onDelete === "function"
        ) {

            onDelete(item);

        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Card

            className="purchase-order-card"

            sx={{

                height: "100%",

                display: "flex",

                flexDirection: "column",

                borderRadius: 2,

                transition:
                    "transform 0.2s ease, box-shadow 0.2s ease",

                "&:hover": {

                    transform:
                        "translateY(-3px)",

                    boxShadow: 4

                }

            }}

        >


            {/* =================================================
               CARD CONTENT
            ================================================= */}

            <CardContent sx={{ flexGrow: 1 }}>


                {/* =============================================
                   PURCHASE ORDER NUMBER
                ============================================= */}

                <Typography

                    variant="h6"

                    fontWeight="bold"

                    gutterBottom

                >

                    {purchaseOrderNumber}

                </Typography>


                {/* =============================================
                   BASIC INFORMATION
                ============================================= */}

                <Stack spacing={0.5}>

                    <Typography

                        variant="body2"

                        color="text.secondary"

                    >

                        Purchase Order ID:{" "}

                        <strong>
                            {purchaseOrderId}
                        </strong>

                    </Typography>


                    <Typography

                        variant="body2"

                        color="text.secondary"

                    >

                        Seller ID:{" "}

                        <strong>
                            {sellerId}
                        </strong>

                    </Typography>


                    <Typography

                        variant="body2"

                        color="text.secondary"

                    >

                        Supplier ID:{" "}

                        <strong>
                            {supplierId}
                        </strong>

                    </Typography>

                </Stack>


                <Divider sx={{ my: 2 }} />


                {/* =============================================
                   ORDER DETAILS
                ============================================= */}

                <Stack spacing={1.5}>


                    {/* -----------------------------------------
                       ORDER DATE
                    ----------------------------------------- */}

                    <Typography variant="body2">

                        <strong>
                            Order Date:
                        </strong>{" "}

                        {
                            formatDate(
                                orderDate
                            )
                        }

                    </Typography>


                    {/* -----------------------------------------
                       EXPECTED DELIVERY
                    ----------------------------------------- */}

                    <Typography variant="body2">

                        <strong>
                            Expected Delivery:
                        </strong>{" "}

                        {
                            formatDate(
                                expectedDeliveryDate
                            )
                        }

                    </Typography>


                    {/* -----------------------------------------
                       STATUS
                    ----------------------------------------- */}

                    <Box>

                        <Typography

                            variant="body2"

                            sx={{ mb: 0.5 }}

                        >

                            <strong>
                                Status:
                            </strong>

                        </Typography>


                        <Chip

                            label={
                                status || "Unknown"
                            }

                            color={
                                getStatusColor(
                                    status
                                )
                            }

                            size="small"

                        />

                    </Box>


                    {/* -----------------------------------------
                       TOTAL AMOUNT
                    ----------------------------------------- */}

                    <Typography

                        variant="body1"

                        color="success.main"

                        fontWeight="bold"

                    >

                        Total Amount:{" "}

                        {
                            formatCurrency(
                                totalAmount
                            )
                        }

                    </Typography>


                    {/* -----------------------------------------
                       REMARKS
                    ----------------------------------------- */}

                    <Box>

                        <Typography

                            variant="body2"

                            fontWeight="bold"

                            sx={{ mb: 0.5 }}

                        >

                            Remarks:

                        </Typography>


                        <Typography

                            variant="body2"

                            color={
                                remarks
                                    ? "text.primary"
                                    : "text.secondary"
                            }

                            sx={{

                                whiteSpace:
                                    "pre-wrap",

                                wordBreak:
                                    "break-word",

                                display:
                                    "-webkit-box",

                                WebkitLineClamp: 3,

                                WebkitBoxOrient:
                                    "vertical",

                                overflow:
                                    "hidden"

                            }}

                        >

                            {
                                remarks || "-"
                            }

                        </Typography>

                    </Box>


                </Stack>

            </CardContent>


            {/* =================================================
               CARD ACTIONS
            ================================================= */}

            <CardActions

                sx={{

                    justifyContent:
                        "space-between",

                    px: 2,

                    pb: 2,

                    pt: 0

                }}

            >


                {/* =============================================
                   VIEW
                ============================================= */}

                <Button

                    size="small"

                    startIcon={
                        <Visibility />
                    }

                    onClick={
                        handleView
                    }

                    disabled={
                        typeof onView !==
                        "function"
                    }

                >

                    View

                </Button>


                {/* =============================================
                   EDIT
                ============================================= */}

                <Button

                    size="small"

                    color="warning"

                    startIcon={
                        <Edit />
                    }

                    onClick={
                        handleEdit
                    }

                    disabled={
                        typeof onEdit !==
                        "function"
                    }

                >

                    Edit

                </Button>


                {/* =============================================
                   DELETE
                ============================================= */}

                <Button

                    size="small"

                    color="error"

                    startIcon={
                        <Delete />
                    }

                    onClick={
                        handleDelete
                    }

                    disabled={
                        typeof onDelete !==
                        "function"
                    }

                >

                    Delete

                </Button>


            </CardActions>

        </Card>

    );

};


export default PurchaseOrderCard;
