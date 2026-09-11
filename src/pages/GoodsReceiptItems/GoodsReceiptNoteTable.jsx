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
    Chip,
    Box
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";


// ============================================================
// GET FIELD
// Supports camelCase + PascalCase
// ============================================================

const getField = (item, ...fieldNames) => {

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
            return value;
        }
    }

    return null;
};


// ============================================================
// FORMAT CURRENCY
// ============================================================

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


// ============================================================
// FORMAT DATE
// ============================================================

const formatDate = (value) => {

    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};


// ============================================================
// STATUS CHIP
// ============================================================

const getStatusColor = (status) => {

    const value = String(status || "")
        .trim()
        .toLowerCase();

    switch (value) {

        case "completed":
        case "received":
        case "approved":
            return "success";

        case "pending":
        case "processing":
        case "partial":
            return "warning";

        case "cancelled":
        case "canceled":
        case "rejected":
            return "error";

        default:
            return "default";
    }
};


// ============================================================
// GOODS RECEIPT NOTE TABLE
// ============================================================

const GoodsReceiptNoteTable = ({
    notes = [],
    onView,
    onEdit,
    onDelete
}) => {

    // ========================================================
    // SAFE DATA
    // ========================================================

    const safeNotes = Array.isArray(notes)
        ? notes
        : [];


    // ========================================================
    // DEBUG API DATA
    // ========================================================

    console.log(
        "================================================"
    );

    console.log(
        "GOODS RECEIPT NOTE TABLE DATA:",
        safeNotes
    );

    console.log(
        "GRN COUNT:",
        safeNotes.length
    );

    console.log(
        "================================================"
    );


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <TableContainer
            component={Paper}
            className="goods-receipt-note-table"
            sx={{
                width: "100%",
                overflowX: "auto",
                borderRadius: 2
            }}
        >

            <Table
                stickyHeader
                size="small"
                sx={{
                    minWidth: 1000
                }}
            >

                {/* =================================================
                    TABLE HEADER
                ================================================= */}

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>GRN ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>GRN Number</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Purchase Order ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Supplier ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Receipt Date</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Status</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Total Amount</strong>
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

                    {safeNotes.length === 0 ? (

                        <TableRow>

                            <TableCell
                                colSpan={8}
                                align="center"
                                sx={{
                                    py: 5
                                }}
                            >

                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                >
                                    No Goods Receipt Notes Found
                                </Typography>

                            </TableCell>

                        </TableRow>

                    ) : (

                        safeNotes.map((note, index) => {

                            // ==================================================
                            // IDENTIFIERS
                            // ==================================================

                            const goodsReceiptNoteId =
                                getField(
                                    note,
                                    "goodsReceiptNoteId",
                                    "GoodsReceiptNoteId"
                                );


                            const grnNumber =
                                getField(
                                    note,
                                    "grnNumber",
                                    "GRNNumber",
                                    "goodsReceiptNumber",
                                    "GoodsReceiptNumber"
                                );


                            const purchaseOrderId =
                                getField(
                                    note,
                                    "purchaseOrderId",
                                    "PurchaseOrderId"
                                );


                            const supplierId =
                                getField(
                                    note,
                                    "supplierId",
                                    "SupplierId"
                                );


                            // ==================================================
                            // DATE
                            // ==================================================

                            const receiptDate =
                                getField(
                                    note,
                                    "receiptDate",
                                    "ReceiptDate",
                                    "receivedDate",
                                    "ReceivedDate"
                                );


                            // ==================================================
                            // STATUS
                            // ==================================================

                            const status =
                                getField(
                                    note,
                                    "status",
                                    "Status"
                                );


                            // ==================================================
                            // TOTAL
                            // ==================================================

                            const totalAmount =
                                getField(
                                    note,
                                    "totalAmount",
                                    "TotalAmount"
                                );


                            // ==================================================
                            // DEBUG ROW
                            // ==================================================

                            console.log(
                                "GRN TABLE ROW:",
                                {
                                    note,
                                    goodsReceiptNoteId,
                                    grnNumber,
                                    purchaseOrderId,
                                    supplierId,
                                    receiptDate,
                                    status,
                                    totalAmount
                                }
                            );


                            // ==================================================
                            // ROW KEY
                            // ==================================================

                            const rowKey =
                                goodsReceiptNoteId !== null
                                    ? `grn-${goodsReceiptNoteId}`
                                    : `grn-${grnNumber || index}`;


                            // ==================================================
                            // ROW
                            // ==================================================

                            return (

                                <TableRow
                                    hover
                                    key={rowKey}
                                >

                                    {/* =====================================
                                        GRN ID
                                    ===================================== */}

                                    <TableCell>

                                        {goodsReceiptNoteId !== null
                                            ? goodsReceiptNoteId
                                            : "-"}

                                    </TableCell>


                                    {/* =====================================
                                        GRN NUMBER
                                    ===================================== */}

                                    <TableCell>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {grnNumber || "-"}
                                        </Typography>

                                    </TableCell>


                                    {/* =====================================
                                        PURCHASE ORDER ID
                                    ===================================== */}

                                    <TableCell>

                                        {purchaseOrderId !== null
                                            ? purchaseOrderId
                                            : "-"}

                                    </TableCell>


                                    {/* =====================================
                                        SUPPLIER ID
                                    ===================================== */}

                                    <TableCell>

                                        {supplierId !== null
                                            ? supplierId
                                            : "-"}

                                    </TableCell>


                                    {/* =====================================
                                        RECEIPT DATE
                                    ===================================== */}

                                    <TableCell>

                                        {formatDate(
                                            receiptDate
                                        )}

                                    </TableCell>


                                    {/* =====================================
                                        STATUS
                                    ===================================== */}

                                    <TableCell>

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


                                    {/* =====================================
                                        TOTAL AMOUNT
                                    ===================================== */}

                                    <TableCell
                                        align="right"
                                    >

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {formatCurrency(
                                                totalAmount
                                            )}
                                        </Typography>

                                    </TableCell>


                                    {/* =====================================
                                        ACTIONS
                                    ===================================== */}

                                    <TableCell
                                        align="center"
                                    >

                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: 0.5
                                            }}
                                        >

                                            {/* =================================
                                                VIEW
                                            ================================= */}

                                            <Tooltip title="View GRN">

                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => {

                                                        if (
                                                            typeof onView ===
                                                            "function"
                                                        ) {
                                                            onView(note);
                                                        }

                                                    }}
                                                >

                                                    <Visibility
                                                        fontSize="small"
                                                    />

                                                </IconButton>

                                            </Tooltip>


                                            {/* =================================
                                                EDIT
                                            ================================= */}

                                            <Tooltip title="Edit GRN">

                                                <IconButton
                                                    size="small"
                                                    color="warning"
                                                    onClick={() => {

                                                        if (
                                                            typeof onEdit ===
                                                            "function"
                                                        ) {
                                                            onEdit(note);
                                                        }

                                                    }}
                                                >

                                                    <Edit
                                                        fontSize="small"
                                                    />

                                                </IconButton>

                                            </Tooltip>


                                            {/* =================================
                                                DELETE
                                            ================================= */}

                                            <Tooltip title="Delete GRN">

                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => {

                                                        if (
                                                            typeof onDelete ===
                                                            "function"
                                                        ) {
                                                            onDelete(note);
                                                        }

                                                    }}
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


export default GoodsReceiptNoteTable;
