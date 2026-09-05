import React from "react";

import {
Table,
TableBody,
TableCell,
TableContainer,
TableHead,
TableRow,
Paper,
IconButton,
Tooltip,
Typography,
Box,
Chip
} from "@mui/material";

import {
Visibility,
Edit,
Delete
} from "@mui/icons-material";

/* =========================================================
FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
const number = Number(value);

if (!Number.isFinite(number)) {
    return "0";
}

return number.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
});
};

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
NUMBER FIELD
========================================================= */

const getNumberField = (
item,
...fieldNames
) => {
if (!item) {
    return null;
}

for (const fieldName of fieldNames) {

    const value = item[fieldName];

    if (
        value !== undefined &&
        value !== null &&
        value !== ""
    ) {

        const number = Number(value);

        if (Number.isFinite(number)) {
            return number;
        }
    }
}

return null;

};

/* =========================================================
TEXT FIELD
========================================================= */

const getTextField = (
item,
...fieldNames
) => {

if (!item) {
    return "";
}

for (const fieldName of fieldNames) {

    const value = item[fieldName];

    if (
        value !== undefined &&
        value !== null
    ) {
        return String(value);
    }
}

return "";
};

/* =========================================================
STATUS COLOR
========================================================= */

const getStatusColor = (status) => {
const value = String(status || "")
    .trim()
    .toLowerCase();

switch (value) {

    case "received":
        return "success";

    case "pending":
        return "warning";

    case "rejected":
        return "error";

    case "partial":
        return "info";

    case "cancelled":
    case "canceled":
        return "default";

    default:
        return "default";
}
};

/* =========================================================
GOODS RECEIPT NOTE ITEM TABLE
========================================================= */

const GoodsReceiptNoteItemTable = ({
items = [],
onView,
onEdit,
onDelete
}) => {
/* =====================================================
   SAFE ITEMS
===================================================== */

const safeItems = Array.isArray(items)
    ? items
    : [];


/* =====================================================
   ACTION HANDLERS
===================================================== */

const handleView = (item) => {

    if (typeof onView === "function") {
        onView(item);
    }
};


const handleEdit = (item) => {

    if (typeof onEdit === "function") {
        onEdit(item);
    }
};


const handleDelete = (item) => {

    if (typeof onDelete === "function") {
        onDelete(item);
    }
};


/* =====================================================
   RENDER
===================================================== */

return (

    <TableContainer
        component={Paper}
        className="goods-receipt-note-item-table"
        sx={{
            width: "100%",
            overflowX: "auto",
            borderRadius: 2
        }}
    >

        <Table
            stickyHeader
            sx={{
                minWidth: 1450
            }}
        >

            {/* =================================================
               TABLE HEADER
            ================================================= */}

            <TableHead>

                <TableRow>

                    <TableCell>
                        <strong>GNI ID</strong>
                    </TableCell>

                    <TableCell>
                        <strong>GRN ID</strong>
                    </TableCell>

                    <TableCell>
                        <strong>PO Item ID</strong>
                    </TableCell>

                    <TableCell>
                        <strong>Seller ID</strong>
                    </TableCell>

                    <TableCell>
                        <strong>Customer ID</strong>
                    </TableCell>

                    <TableCell>
                        <strong>Supplier ID</strong>
                    </TableCell>

                    <TableCell>
                        <strong>Product ID</strong>
                    </TableCell>

                    <TableCell align="right">
                        <strong>Line No.</strong>
                    </TableCell>

                    <TableCell align="right">
                        <strong>Received Qty</strong>
                    </TableCell>

                    <TableCell align="right">
                        <strong>Accepted Qty</strong>
                    </TableCell>

                    <TableCell align="right">
                        <strong>Rejected Qty</strong>
                    </TableCell>

                    <TableCell align="right">
                        <strong>Unit Price</strong>
                    </TableCell>

                    <TableCell align="right">
                        <strong>Total Amount</strong>
                    </TableCell>

                    <TableCell align="center">
                        <strong>Status</strong>
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

                {safeItems.length === 0 ? (

                    <TableRow>

                        <TableCell
                            colSpan={16}
                            align="center"
                            sx={{
                                py: 6
                            }}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 1
                                }}
                            >

                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    No GNI Items Found
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.disabled"
                                >
                                    There are no GNI items to display.
                                </Typography>

                            </Box>

                        </TableCell>

                    </TableRow>

                ) : (

                    safeItems.map((item, index) => {

                        /* =====================================
                           IDENTIFIERS
                        ===================================== */

                        const goodsReceiptNoteItemId =
                            getNumberField(
                                item,
                                "goodsReceiptNoteItemId",
                                "GoodsReceiptNoteItemId",
                                "goodsReceiptItemId",
                                "GoodsReceiptItemId"
                            );


                        const goodsReceiptNoteId =
                            getNumberField(
                                item,
                                "goodsReceiptNoteId",
                                "GoodsReceiptNoteId"
                            );


                        const purchaseOrderItemId =
                            getNumberField(
                                item,
                                "purchaseOrderItemId",
                                "PurchaseOrderItemId"
                            );


                        const sellerId =
                            getNumberField(
                                item,
                                "sellerId",
                                "SellerId"
                            );


                        const customerId =
                            getNumberField(
                                item,
                                "customerId",
                                "CustomerId"
                            );


                        const supplierId =
                            getNumberField(
                                item,
                                "supplierId",
                                "SupplierId"
                            );


                        const productId =
                            getNumberField(
                                item,
                                "productId",
                                "ProductId"
                            );


                        /* =====================================
                           QUANTITIES
                        ===================================== */

                        const lineNumber =
                            getNumberField(
                                item,
                                "lineNumber",
                                "LineNumber"
                            );


                        const receivedQuantity =
                            getNumberField(
                                item,
                                "receivedQuantity",
                                "ReceivedQuantity"
                            );


                        const acceptedQuantity =
                            getNumberField(
                                item,
                                "acceptedQuantity",
                                "AcceptedQuantity"
                            );


                        const rejectedQuantity =
                            getNumberField(
                                item,
                                "rejectedQuantity",
                                "RejectedQuantity"
                            );


                        /* =====================================
                           AMOUNTS
                        ===================================== */

                        const unitPrice =
                            getNumberField(
                                item,
                                "unitPrice",
                                "UnitPrice"
                            );


                        const totalAmount =
                            getNumberField(
                                item,
                                "totalAmount",
                                "TotalAmount"
                            );


                        /* =====================================
                           TEXT
                        ===================================== */

                        const status =
                            getTextField(
                                item,
                                "status",
                                "Status"
                            );


                        const remarks =
                            getTextField(
                                item,
                                "remarks",
                                "Remarks"
                            );


                        /* =====================================
                           DEBUG
                        ===================================== */

                        console.log(
                            "GNI TABLE ITEM:",
                            item
                        );

                        console.log(
                            "GNI ID:",
                            goodsReceiptNoteItemId
                        );

                        console.log(
                            "GRN ID:",
                            goodsReceiptNoteId
                        );

                        console.log(
                            "PRODUCT ID:",
                            productId
                        );


                        /* =====================================
                           ROW KEY
                        ===================================== */

                        const rowKey =
                            goodsReceiptNoteItemId !== null
                                ? `gni-${goodsReceiptNoteItemId}`
                                : `gni-${index}`;


                        /* =====================================
                           RENDER ROW
                        ===================================== */

                        return (

                            <TableRow
                                hover
                                key={rowKey}
                            >

                                {/* GNI ID */}

                                <TableCell>
                                    {
                                        goodsReceiptNoteItemId !== null
                                            ? goodsReceiptNoteItemId
                                            : "-"
                                    }
                                </TableCell>


                                {/* GRN ID */}

                                <TableCell>
                                    {
                                        goodsReceiptNoteId !== null
                                            ? goodsReceiptNoteId
                                            : "-"
                                    }
                                </TableCell>


                                {/* PO ITEM ID */}

                                <TableCell>
                                    {
                                        purchaseOrderItemId !== null
                                            ? purchaseOrderItemId
                                            : "-"
                                    }
                                </TableCell>


                                {/* SELLER ID */}

                                <TableCell>
                                    {
                                        sellerId !== null
                                            ? sellerId
                                            : "-"
                                    }
                                </TableCell>


                                {/* CUSTOMER ID */}

                                <TableCell>
                                    {
                                        customerId !== null
                                            ? customerId
                                            : "-"
                                    }
                                </TableCell>


                                {/* SUPPLIER ID */}

                                <TableCell>
                                    {
                                        supplierId !== null
                                            ? supplierId
                                            : "-"
                                    }
                                </TableCell>


                                {/* PRODUCT ID */}

                                <TableCell>
                                    {
                                        productId !== null
                                            ? productId
                                            : "-"
                                    }
                                </TableCell>


                                {/* LINE NUMBER */}

                                <TableCell align="right">
                                    {formatNumber(
                                        lineNumber
                                    )}
                                </TableCell>


                                {/* RECEIVED QUANTITY */}

                                <TableCell align="right">
                                    {formatNumber(
                                        receivedQuantity
                                    )}
                                </TableCell>


                                {/* ACCEPTED QUANTITY */}

                                <TableCell align="right">
                                    {formatNumber(
                                        acceptedQuantity
                                    )}
                                </TableCell>


                                {/* REJECTED QUANTITY */}

                                <TableCell align="right">
                                    {formatNumber(
                                        rejectedQuantity
                                    )}
                                </TableCell>


                                {/* UNIT PRICE */}

                                <TableCell align="right">
                                    {formatCurrency(
                                        unitPrice
                                    )}
                                </TableCell>


                                {/* TOTAL AMOUNT */}

                                <TableCell
                                    align="right"
                                    sx={{
                                        fontWeight: 600
                                    }}
                                >
                                    {formatCurrency(
                                        totalAmount
                                    )}
                                </TableCell>


                                {/* STATUS */}

                                <TableCell align="center">

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
                                        variant="outlined"
                                    />

                                </TableCell>


                                {/* REMARKS */}

                                <TableCell>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            maxWidth: 220,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        }}
                                        title={remarks}
                                    >
                                        {remarks || "-"}
                                    </Typography>

                                </TableCell>


                                {/* ACTIONS */}

                                <TableCell align="center">

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: 0.5
                                        }}
                                    >

                                        {/* VIEW */}

                                        <Tooltip
                                            title="View GNI Item"
                                        >

                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() =>
                                                    handleView(item)
                                                }
                                            >

                                                <Visibility
                                                    fontSize="small"
                                                />

                                            </IconButton>

                                        </Tooltip>


                                        {/* EDIT */}

                                        <Tooltip
                                            title="Edit GNI Item"
                                        >

                                            <IconButton
                                                size="small"
                                                color="warning"
                                                onClick={() =>
                                                    handleEdit(item)
                                                }
                                            >

                                                <Edit
                                                    fontSize="small"
                                                />

                                            </IconButton>

                                        </Tooltip>


                                        {/* DELETE */}

                                        <Tooltip
                                            title="Delete GNI Item"
                                        >

                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() =>
                                                    handleDelete(item)
                                                }
                                            >

                                                <Delete
                                                    fontSize="small"
                                                />

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

export default GoodsReceiptNoteItemTable;
