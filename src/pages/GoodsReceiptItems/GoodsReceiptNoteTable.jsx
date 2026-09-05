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
   STATUS CHIP
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
   GOODS RECEIPT NOTE TABLE
========================================================= */

const GoodsReceiptNoteTable = ({
    notes = [],
    onView,
    onEdit,
    onDelete
}) => {

    const safeNotes = Array.isArray(notes)
        ? notes
        : [];


    /* =====================================================
       ACTION HANDLERS
    ===================================================== */

    const handleView = (note) => {

        if (typeof onView === "function") {
            onView(note);
        }
    };


    const handleEdit = (note) => {

        if (typeof onEdit === "function") {
            onEdit(note);
        }
    };


    const handleDelete = (note) => {

        if (typeof onDelete === "function") {
            onDelete(note);
        }
    };


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

                        safeNotes.map((note) => (

                            <TableRow
                                hover
                                key={
                                    note.GoodsReceiptNoteId ??
                                    note.GRNNumber
                                }
                            >

                                {/* =====================================
                                    GRN ID
                                ===================================== */}

                                <TableCell>
                                    {note.GoodsReceiptNoteId ?? "-"}
                                </TableCell>


                                {/* =====================================
                                    GRN NUMBER
                                ===================================== */}

                                <TableCell>

                                    <Typography
                                        fontWeight={600}
                                    >
                                        {note.GRNNumber || "-"}
                                    </Typography>

                                </TableCell>


                                {/* =====================================
                                    PURCHASE ORDER ID
                                ===================================== */}

                                <TableCell>
                                    {note.PurchaseOrderId ?? "-"}
                                </TableCell>


                                {/* =====================================
                                    SUPPLIER ID
                                ===================================== */}

                                <TableCell>
                                    {note.SupplierId ?? "-"}
                                </TableCell>


                                {/* =====================================
                                    RECEIPT DATE
                                ===================================== */}

                                <TableCell>
                                    {formatDate(note.ReceiptDate)}
                                </TableCell>


                                {/* =====================================
                                    STATUS
                                ===================================== */}

                                <TableCell>

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
                                            note.TotalAmount
                                        )}
                                    </Typography>

                                </TableCell>


                                {/* =====================================
                                    ACTIONS
                                ===================================== */}

                                <TableCell align="center">

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

                                        <Tooltip title="View">

                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() =>
                                                    handleView(note)
                                                }
                                            >
                                                <Visibility fontSize="small" />
                                            </IconButton>

                                        </Tooltip>


                                        {/* =================================
                                            EDIT
                                        ================================= */}

                                        <Tooltip title="Edit">

                                            <IconButton
                                                size="small"
                                                color="warning"
                                                onClick={() =>
                                                    handleEdit(note)
                                                }
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>

                                        </Tooltip>


                                        {/* =================================
                                            DELETE
                                        ================================= */}

                                        <Tooltip title="Delete">

                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() =>
                                                    handleDelete(note)
                                                }
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>

                                        </Tooltip>

                                    </Box>

                                </TableCell>

                            </TableRow>

                        ))

                    )}

                </TableBody>

            </Table>

        </TableContainer>
    );
};


export default GoodsReceiptNoteTable;
