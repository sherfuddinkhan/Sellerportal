import React from "react";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    Chip,
    Typography,
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
   PURCHASE RETURN TABLE
========================================================= */

const PurchaseReturnTable = ({
    purchaseReturns = [],
    onView,
    onEdit,
    onDelete
}) => {

    const rows = Array.isArray(purchaseReturns)
        ? purchaseReturns
        : [];


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <TableContainer
            component={Paper}
            className="purchase-return-table"
            sx={{
                width: "100%",
                overflowX: "auto"
            }}
        >

            <Table
                stickyHeader
                sx={{
                    minWidth: 1200
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
                            <strong>Return No</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Purchase Order</strong>
                        </TableCell>

                        <TableCell>
                            <strong>GRN</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Supplier</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Return Date</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Total Amount</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Status</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Reason</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Created Date</strong>
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

                    {rows.length === 0 ? (

                        <TableRow>

                            <TableCell
                                colSpan={11}
                                align="center"
                                sx={{
                                    py: 5
                                }}
                            >

                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    No Purchase Returns Found
                                </Typography>

                            </TableCell>

                        </TableRow>

                    ) : (

                        rows.map((item) => {

                            const status =
                                item?.Status || "N/A";

                            return (

                                <TableRow
                                    key={
                                        item?.PurchaseReturnId
                                    }
                                    hover
                                >

                                    {/* =================================
                                        ID
                                    ================================== */}

                                    <TableCell>

                                        {item?.PurchaseReturnId ?? "-"}

                                    </TableCell>


                                    {/* =================================
                                        RETURN NUMBER
                                    ================================== */}

                                    <TableCell>

                                        <Typography
                                            variant="body2"
                                            fontWeight="bold"
                                            noWrap
                                        >
                                            {
                                                item?.PurchaseReturnNumber ||
                                                "-"
                                            }
                                        </Typography>

                                    </TableCell>


                                    {/* =================================
                                        PURCHASE ORDER
                                    ================================== */}

                                    <TableCell>

                                        {item?.PurchaseOrderId ?? "-"}

                                    </TableCell>


                                    {/* =================================
                                        GRN
                                    ================================== */}

                                    <TableCell>

                                        {
                                            item?.GoodsReceiptNoteId ??
                                            "-"
                                        }

                                    </TableCell>


                                    {/* =================================
                                        SUPPLIER
                                    ================================== */}

                                    <TableCell>

                                        {item?.SupplierId ?? "-"}

                                    </TableCell>


                                    {/* =================================
                                        RETURN DATE
                                    ================================== */}

                                    <TableCell>

                                        {formatDate(
                                            item?.ReturnDate
                                        )}

                                    </TableCell>


                                    {/* =================================
                                        TOTAL AMOUNT
                                    ================================== */}

                                    <TableCell
                                        align="right"
                                    >

                                        <Typography
                                            variant="body2"
                                            fontWeight="bold"
                                            noWrap
                                        >
                                            {formatCurrency(
                                                item?.TotalAmount
                                            )}
                                        </Typography>

                                    </TableCell>


                                    {/* =================================
                                        STATUS
                                    ================================== */}

                                    <TableCell>

                                        <Chip
                                            label={status}
                                            size="small"
                                            color={
                                                getStatusColor(
                                                    status
                                                )
                                            }
                                        />

                                    </TableCell>


                                    {/* =================================
                                        REASON
                                    ================================== */}

                                    <TableCell
                                        sx={{
                                            maxWidth: 250
                                        }}
                                    >

                                        <Tooltip
                                            title={
                                                item?.Reason || ""
                                            }
                                        >

                                            <Typography
                                                variant="body2"
                                                noWrap
                                                sx={{
                                                    maxWidth: 250
                                                }}
                                            >
                                                {
                                                    item?.Reason ||
                                                    "-"
                                                }
                                            </Typography>

                                        </Tooltip>

                                    </TableCell>


                                    {/* =================================
                                        CREATED DATE
                                    ================================== */}

                                    <TableCell>

                                        {formatDate(
                                            item?.CreatedDate
                                        )}

                                    </TableCell>


                                    {/* =================================
                                        ACTIONS
                                    ================================== */}

                                    <TableCell
                                        align="center"
                                    >

                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent:
                                                    "center",
                                                alignItems:
                                                    "center",
                                                gap: 0.5
                                            }}
                                        >

                                            {/* =========================
                                                VIEW
                                            ========================== */}

                                            <Tooltip title="View">

                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => {

                                                        if (
                                                            typeof onView ===
                                                            "function"
                                                        ) {
                                                            onView(item);
                                                        }

                                                    }}
                                                >

                                                    <Visibility
                                                        fontSize="small"
                                                    />

                                                </IconButton>

                                            </Tooltip>


                                            {/* =========================
                                                EDIT
                                            ========================== */}

                                            <Tooltip title="Edit">

                                                <IconButton
                                                    size="small"
                                                    color="warning"
                                                    onClick={() => {

                                                        if (
                                                            typeof onEdit ===
                                                            "function"
                                                        ) {
                                                            onEdit(item);
                                                        }

                                                    }}
                                                >

                                                    <Edit
                                                        fontSize="small"
                                                    />

                                                </IconButton>

                                            </Tooltip>


                                            {/* =========================
                                                DELETE
                                            ========================== */}

                                            <Tooltip title="Delete">

                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => {

                                                        if (
                                                            typeof onDelete ===
                                                            "function"
                                                        ) {
                                                            onDelete(item);
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


export default PurchaseReturnTable;