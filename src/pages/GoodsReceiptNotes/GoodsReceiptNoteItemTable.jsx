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
    Box
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
   GOODS RECEIPT NOTE ITEM TABLE
========================================================= */

const GoodsReceiptNoteItemTable = ({
    items = [],
    onView,
    onEdit,
    onDelete
}) => {


    /* =========================================================
       SAFE ITEMS
    ========================================================= */

    const safeItems = Array.isArray(items)
        ? items
        : [];


    /* =========================================================
       ACTION HANDLERS
    ========================================================= */

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


    /* =========================================================
       RENDER
    ========================================================= */

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
                    minWidth: 1200
                }}
            >

                {/* =================================================
                    TABLE HEADER
                ================================================= */}

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>
                                Item ID
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                GRN ID
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Product ID
                            </strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>
                                Received Qty
                            </strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>
                                Accepted Qty
                            </strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>
                                Rejected Qty
                            </strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>
                                Unit Price
                            </strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>
                                Tax Amount
                            </strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>
                                Total Amount
                            </strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>
                                Actions
                            </strong>
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
                                colSpan={10}
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
                                        No Goods Receipt Note Items Found
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.disabled"
                                    >
                                        There are no GRN items to display.
                                    </Typography>

                                </Box>

                            </TableCell>

                        </TableRow>

                    ) : (

                        safeItems.map((item, index) => {

                            const itemId =
                                item?.GoodsReceiptNoteItemId;

                            return (

                                <TableRow
                                    hover
                                    key={
                                        itemId ??
                                        `grn-item-${index}`
                                    }
                                >

                                    {/* =================================================
                                        ITEM ID
                                    ================================================= */}

                                    <TableCell>
                                        {itemId ?? "-"}
                                    </TableCell>


                                    {/* =================================================
                                        GRN ID
                                    ================================================= */}

                                    <TableCell>
                                        {item?.GoodsReceiptNoteId ?? "-"}
                                    </TableCell>


                                    {/* =================================================
                                        PRODUCT ID
                                    ================================================= */}

                                    <TableCell>
                                        {item?.ProductId ?? "-"}
                                    </TableCell>


                                    {/* =================================================
                                        RECEIVED QUANTITY
                                    ================================================= */}

                                    <TableCell align="right">
                                        {formatNumber(
                                            item?.ReceivedQuantity
                                        )}
                                    </TableCell>


                                    {/* =================================================
                                        ACCEPTED QUANTITY
                                    ================================================= */}

                                    <TableCell align="right">
                                        {formatNumber(
                                            item?.AcceptedQuantity
                                        )}
                                    </TableCell>


                                    {/* =================================================
                                        REJECTED QUANTITY
                                    ================================================= */}

                                    <TableCell align="right">
                                        {formatNumber(
                                            item?.RejectedQuantity
                                        )}
                                    </TableCell>


                                    {/* =================================================
                                        UNIT PRICE
                                    ================================================= */}

                                    <TableCell align="right">
                                        {formatCurrency(
                                            item?.UnitPrice
                                        )}
                                    </TableCell>


                                    {/* =================================================
                                        TAX AMOUNT
                                    ================================================= */}

                                    <TableCell align="right">
                                        {formatCurrency(
                                            item?.TaxAmount
                                        )}
                                    </TableCell>


                                    {/* =================================================
                                        TOTAL AMOUNT
                                    ================================================= */}

                                    <TableCell
                                        align="right"
                                        sx={{
                                            fontWeight: 600
                                        }}
                                    >
                                        {formatCurrency(
                                            item?.TotalAmount
                                        )}
                                    </TableCell>


                                    {/* =================================================
                                        ACTIONS
                                    ================================================= */}

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

                                            <Tooltip title="View">

                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() =>
                                                        handleView(item)
                                                    }
                                                >
                                                    <Visibility fontSize="small" />
                                                </IconButton>

                                            </Tooltip>


                                            {/* EDIT */}

                                            <Tooltip title="Edit">

                                                <IconButton
                                                    size="small"
                                                    color="warning"
                                                    onClick={() =>
                                                        handleEdit(item)
                                                    }
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>

                                            </Tooltip>


                                            {/* DELETE */}

                                            <Tooltip title="Delete">

                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() =>
                                                        handleDelete(item)
                                                    }
                                                >
                                                    <Delete fontSize="small" />
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
