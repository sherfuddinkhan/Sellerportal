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
    Chip
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";


// =========================================================
// FORMAT DATE
// =========================================================

const formatDate = (date) => {

    if (!date) {
        return "-";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
        return "-";
    }

    return parsedDate.toLocaleDateString();
};


// =========================================================
// FORMAT NUMBER
// =========================================================

const formatNumber = (value) => {

    const number = Number(value ?? 0);

    if (isNaN(number)) {
        return "0.00";
    }

    return number.toFixed(2);
};


// =========================================================
// TRANSACTION TYPE COLOR
// =========================================================

const getTransactionColor = (transactionType) => {

    const type =
        transactionType
            ?.toString()
            .trim()
            .toUpperCase();

    switch (type) {

        case "PURCHASE":
            return "success";

        case "SALE":
            return "error";

        case "RETURN":
            return "info";

        case "ADJUSTMENT":
            return "warning";

        case "TRANSFER":
            return "secondary";

        default:
            return "default";
    }
};


// =========================================================
// STOCK LEDGER TABLE
// =========================================================

const StockLedgerTable = ({
    items = [],
    onView,
    onEdit,
    onDelete
}) => {

    return (

        <TableContainer
            component={Paper}
            className="stock-ledger-table"
            elevation={3}
        >

            <Table>

                {/* =====================================================
                    TABLE HEADER
                ===================================================== */}

                <TableHead>

                    <TableRow>

                        <TableCell>
                            ID
                        </TableCell>

                        <TableCell>
                            Seller ID
                        </TableCell>

                        <TableCell>
                            Product ID
                        </TableCell>

                        <TableCell>
                            Warehouse ID
                        </TableCell>

                        <TableCell>
                            Transaction Type
                        </TableCell>

                        <TableCell>
                            Reference Number
                        </TableCell>

                        <TableCell align="right">
                            Quantity
                        </TableCell>

                        <TableCell align="right">
                            Balance Quantity
                        </TableCell>

                        <TableCell>
                            Transaction Date
                        </TableCell>

                        <TableCell>
                            Remarks
                        </TableCell>

                        <TableCell align="center">
                            Actions
                        </TableCell>

                    </TableRow>

                </TableHead>


                {/* =====================================================
                    TABLE BODY
                ===================================================== */}

                <TableBody>

                    {items.length === 0 ? (

                        <TableRow>

                            <TableCell
                                colSpan={11}
                                align="center"
                            >
                                No Stock Ledger Records Found
                            </TableCell>

                        </TableRow>

                    ) : (

                        items.map((item) => {

                            const stockLedgerId =
                                item.stockLedgerId ??
                                item.StockLedgerId;

                            const sellerId =
                                item.sellerId ??
                                item.SellerId;

                            const productId =
                                item.productId ??
                                item.ProductId;

                            const warehouseId =
                                item.warehouseId ??
                                item.WarehouseId;

                            const transactionType =
                                item.transactionType ??
                                item.TransactionType;

                            const referenceNumber =
                                item.referenceNumber ??
                                item.ReferenceNumber;

                            const quantity =
                                item.quantity ??
                                item.Quantity;

                            const balanceQuantity =
                                item.balanceQuantity ??
                                item.BalanceQuantity;

                            const transactionDate =
                                item.transactionDate ??
                                item.TransactionDate;

                            const remarks =
                                item.remarks ??
                                item.Remarks;


                            return (

                                <TableRow
                                    key={stockLedgerId}
                                    hover
                                >

                                    {/* =================================================
                                        ID
                                    ================================================= */}

                                    <TableCell>
                                        {stockLedgerId}
                                    </TableCell>


                                    {/* =================================================
                                        SELLER ID
                                    ================================================= */}

                                    <TableCell>
                                        {sellerId ?? "-"}
                                    </TableCell>


                                    {/* =================================================
                                        PRODUCT ID
                                    ================================================= */}

                                    <TableCell>
                                        {productId ?? "-"}
                                    </TableCell>


                                    {/* =================================================
                                        WAREHOUSE ID
                                    ================================================= */}

                                    <TableCell>
                                        {warehouseId ?? "-"}
                                    </TableCell>


                                    {/* =================================================
                                        TRANSACTION TYPE
                                    ================================================= */}

                                    <TableCell>

                                        <Chip
                                            label={
                                                transactionType ||
                                                "-"
                                            }

                                            color={
                                                getTransactionColor(
                                                    transactionType
                                                )
                                            }

                                            size="small"
                                        />

                                    </TableCell>


                                    {/* =================================================
                                        REFERENCE NUMBER
                                    ================================================= */}

                                    <TableCell>
                                        {referenceNumber || "-"}
                                    </TableCell>


                                    {/* =================================================
                                        QUANTITY
                                    ================================================= */}

                                    <TableCell align="right">

                                        {formatNumber(
                                            quantity
                                        )}

                                    </TableCell>


                                    {/* =================================================
                                        BALANCE QUANTITY
                                    ================================================= */}

                                    <TableCell align="right">

                                        {formatNumber(
                                            balanceQuantity
                                        )}

                                    </TableCell>


                                    {/* =================================================
                                        TRANSACTION DATE
                                    ================================================= */}

                                    <TableCell>

                                        {formatDate(
                                            transactionDate
                                        )}

                                    </TableCell>


                                    {/* =================================================
                                        REMARKS
                                    ================================================= */}

                                    <TableCell>

                                        {remarks || "-"}

                                    </TableCell>


                                    {/* =================================================
                                        ACTIONS
                                    ================================================= */}

                                    <TableCell align="center">

                                        {/* VIEW */}

                                        <Tooltip title="View">

                                            <IconButton
                                                color="primary"
                                                onClick={() =>
                                                    onView?.(item)
                                                }
                                            >

                                                <Visibility />

                                            </IconButton>

                                        </Tooltip>


                                        {/* EDIT */}

                                        <Tooltip title="Edit">

                                            <IconButton
                                                color="warning"
                                                onClick={() =>
                                                    onEdit?.(item)
                                                }
                                            >

                                                <Edit />

                                            </IconButton>

                                        </Tooltip>


                                        {/* DELETE */}

                                        <Tooltip title="Delete">

                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    onDelete?.(item)
                                                }
                                            >

                                                <Delete />

                                            </IconButton>

                                        </Tooltip>

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


export default StockLedgerTable;
