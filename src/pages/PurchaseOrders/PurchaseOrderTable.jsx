import React from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Chip,
    IconButton,
    Tooltip,
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
   GET STATUS LABEL
========================================================= */

const getStatusLabel = (status) => {

    if (!status) {

        return "Unknown";

    }

    return String(status);

};


/* =========================================================
   PURCHASE ORDER TABLE
========================================================= */

const PurchaseOrderTable = ({

    items = [],

    loading = false,

    onView,

    onEdit,

    onDelete

}) => {


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <TableContainer
                component={Paper}
                className="purchase-order-table"
            >

                <Table>

                    <TableBody>

                        <TableRow>

                            <TableCell
                                colSpan={10}
                                align="center"
                            >

                                <Typography
                                    color="text.secondary"
                                    sx={{ py: 4 }}
                                >

                                    Loading Purchase Orders...

                                </Typography>

                            </TableCell>

                        </TableRow>

                    </TableBody>

                </Table>

            </TableContainer>

        );

    }


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <TableContainer

            component={Paper}

            className="purchase-order-table"

            sx={{

                width: "100%",

                overflowX: "auto"

            }}

        >

            <Table

                stickyHeader

                sx={{

                    minWidth: 1250

                }}

            >


                {/* =================================================
                   TABLE HEADER
                ================================================= */}

                <TableHead>

                    <TableRow>


                        <TableCell>

                            <strong>ID</strong>

                        </TableCell>


                        <TableCell>

                            <strong>Order Number</strong>

                        </TableCell>


                        <TableCell>

                            <strong>Seller ID</strong>

                        </TableCell>


                        <TableCell>

                            <strong>Supplier ID</strong>

                        </TableCell>


                        <TableCell>

                            <strong>Order Date</strong>

                        </TableCell>


                        <TableCell>

                            <strong>
                                Expected Delivery
                            </strong>

                        </TableCell>


                        <TableCell>

                            <strong>Status</strong>

                        </TableCell>


                        <TableCell align="right">

                            <strong>
                                Total Amount
                            </strong>

                        </TableCell>


                        <TableCell>

                            <strong>Remarks</strong>

                        </TableCell>


                        <TableCell align="center">

                            <strong>Actions</strong>

                        </TableCell>


                    </TableRow>

                </TableHead>


                {/* =================================================
                   TABLE BODY
                ================================================= */}

                <TableBody>


                    {/* =============================================
                       EMPTY STATE
                    ============================================= */}

                    {items.length === 0 ? (

                        <TableRow>

                            <TableCell

                                colSpan={10}

                                align="center"

                            >

                                <Box

                                    sx={{

                                        py: 5

                                    }}

                                >

                                    <Typography

                                        variant="body1"

                                        fontWeight="medium"

                                        color="text.secondary"

                                    >

                                        No Purchase Orders Found

                                    </Typography>


                                    <Typography

                                        variant="body2"

                                        color="text.disabled"

                                        sx={{ mt: 0.5 }}

                                    >

                                        Try changing your search
                                        or create a new purchase
                                        order.

                                    </Typography>

                                </Box>

                            </TableCell>

                        </TableRow>

                    ) : (


                        /* =========================================
                           PURCHASE ORDER ROWS
                        ========================================= */

                        items.map((item) => {


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


                            return (

                                <TableRow

                                    hover

                                    key={
                                        purchaseOrderId
                                    }

                                >


                                    {/* =================================
                                       ID
                                    ================================= */}

                                    <TableCell>

                                        {purchaseOrderId}

                                    </TableCell>


                                    {/* =================================
                                       ORDER NUMBER
                                    ================================= */}

                                    <TableCell>

                                        <Typography

                                            variant="body2"

                                            fontWeight="medium"

                                        >

                                            {
                                                purchaseOrderNumber
                                            }

                                        </Typography>

                                    </TableCell>


                                    {/* =================================
                                       SELLER ID
                                    ================================= */}

                                    <TableCell>

                                        {sellerId}

                                    </TableCell>


                                    {/* =================================
                                       SUPPLIER ID
                                    ================================= */}

                                    <TableCell>

                                        {supplierId}

                                    </TableCell>


                                    {/* =================================
                                       ORDER DATE
                                    ================================= */}

                                    <TableCell>

                                        {
                                            formatDate(
                                                orderDate
                                            )
                                        }

                                    </TableCell>


                                    {/* =================================
                                       EXPECTED DELIVERY
                                    ================================= */}

                                    <TableCell>

                                        {
                                            formatDate(
                                                expectedDeliveryDate
                                            )
                                        }

                                    </TableCell>


                                    {/* =================================
                                       STATUS
                                    ================================= */}

                                    <TableCell>

                                        <Chip

                                            label={
                                                getStatusLabel(
                                                    status
                                                )
                                            }

                                            color={
                                                getStatusColor(
                                                    status
                                                )
                                            }

                                            size="small"

                                            sx={{

                                                fontWeight: 500

                                            }}

                                        />

                                    </TableCell>


                                    {/* =================================
                                       TOTAL AMOUNT
                                    ================================= */}

                                    <TableCell align="right">

                                        <Typography

                                            variant="body2"

                                            fontWeight="bold"

                                        >

                                            {
                                                formatCurrency(
                                                    totalAmount
                                                )
                                            }

                                        </Typography>

                                    </TableCell>


                                    {/* =================================
                                       REMARKS
                                    ================================= */}

                                    <TableCell

                                        sx={{

                                            maxWidth: 250

                                        }}

                                    >

                                        <Tooltip

                                            title={
                                                remarks || ""
                                            }

                                            placement="top"

                                        >

                                            <Typography

                                                variant="body2"

                                                color={
                                                    remarks
                                                        ? "text.primary"
                                                        : "text.secondary"
                                                }

                                                sx={{

                                                    overflow:
                                                        "hidden",

                                                    textOverflow:
                                                        "ellipsis",

                                                    whiteSpace:
                                                        "nowrap"

                                                }}

                                            >

                                                {
                                                    remarks || "-"
                                                }

                                            </Typography>

                                        </Tooltip>

                                    </TableCell>


                                    {/* =================================
                                       ACTIONS
                                    ================================= */}

                                    <TableCell align="center">

                                        <Box

                                            sx={{

                                                display: "flex",

                                                alignItems:
                                                    "center",

                                                justifyContent:
                                                    "center",

                                                gap: 0.5

                                            }}

                                        >


                                            {/* =============================
                                               VIEW
                                            ============================= */}

                                            <Tooltip title="View">

                                                <IconButton

                                                    size="small"

                                                    color="primary"

                                                    aria-label={
                                                        `View purchase order ${purchaseOrderId}`
                                                    }

                                                    onClick={() => {

                                                        if (
                                                            typeof onView ===
                                                            "function"
                                                        ) {

                                                            onView(item);

                                                        }

                                                    }}

                                                    disabled={
                                                        typeof onView !==
                                                        "function"
                                                    }

                                                >

                                                    <Visibility />

                                                </IconButton>

                                            </Tooltip>


                                            {/* =============================
                                               EDIT
                                            ============================= */}

                                            <Tooltip title="Edit">

                                                <IconButton

                                                    size="small"

                                                    color="warning"

                                                    aria-label={
                                                        `Edit purchase order ${purchaseOrderId}`
                                                    }

                                                    onClick={() => {

                                                        if (
                                                            typeof onEdit ===
                                                            "function"
                                                        ) {

                                                            onEdit(item);

                                                        }

                                                    }}

                                                    disabled={
                                                        typeof onEdit !==
                                                        "function"
                                                    }

                                                >

                                                    <Edit />

                                                </IconButton>

                                            </Tooltip>


                                            {/* =============================
                                               DELETE
                                            ============================= */}

                                            <Tooltip title="Delete">

                                                <IconButton

                                                    size="small"

                                                    color="error"

                                                    aria-label={
                                                        `Delete purchase order ${purchaseOrderId}`
                                                    }

                                                    onClick={() => {

                                                        if (
                                                            typeof onDelete ===
                                                            "function"
                                                        ) {

                                                            onDelete(item);

                                                        }

                                                    }}

                                                    disabled={
                                                        typeof onDelete !==
                                                        "function"
                                                    }

                                                >

                                                    <Delete />

                                                </IconButton>

                                            </Tooltip>


                                        </Box>

                                    </TableCell>


                                </TableRow>

                            );

                        })

                    )}

                </TableBody>

            </Table>

        </TableContainer>

    );

};


export default PurchaseOrderTable;
