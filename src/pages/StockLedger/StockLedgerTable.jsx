
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

const getVal = (item, ...keys) => {
    for (const key of keys) {
        if (
            item?.[key] !== undefined &&
            item?.[key] !== null &&
            item?.[key] !== ""
        ) {
            return item[key];
        }
    }

    return "";
};

const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
        ? "-"
        : parsedDate.toLocaleDateString();
};

const formatNumber = (value) => {
    const number = Number(value ?? 0);

    return Number.isFinite(number)
        ? number.toFixed(2)
        : "0.00";
};

const getTransactionColor = (type) => {
    switch (String(type || "").toUpperCase()) {
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

const StockLedgerTable = ({
    items = [],
    onView,
    onEdit,
    onDelete
}) => {
    const handleAction = (callback, item, action) => {
        console.log(`${action} STOCK LEDGER BUTTON CLICKED`, item);

        if (typeof callback !== "function") {
            console.error(`${action} callback was not provided.`);
            return;
        }

        callback(item);
    };

    return (
        <TableContainer
            component={Paper}
            elevation={2}
            className="stock-ledger-table"
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Seller ID</TableCell>
                        <TableCell>Customer ID</TableCell>
                        <TableCell>Product ID</TableCell>
                        <TableCell>Warehouse ID</TableCell>
                        <TableCell>Transaction Type</TableCell>
                        <TableCell>Reference Number</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Balance Quantity</TableCell>
                        <TableCell>Transaction Date</TableCell>
                        <TableCell>Remarks</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={12} align="center">
                                No Stock Ledger Records Found
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item, index) => {
                            const id = getVal(
                                item,
                                "stockLedgerId",
                                "StockLedgerId"
                            );

                            const type = getVal(
                                item,
                                "transactionType",
                                "TransactionType"
                            );

                            return (
                                <TableRow
                                    key={id || index}
                                    hover
                                >
                                    <TableCell>{id || "-"}</TableCell>

                                    <TableCell>
                                        {getVal(item, "sellerId", "SellerId") || "-"}
                                    </TableCell>

                                    <TableCell>
                                        {getVal(item, "customerId", "CustomerId") || "-"}
                                    </TableCell>

                                    <TableCell>
                                        {getVal(item, "productId", "ProductId") || "-"}
                                    </TableCell>

                                    <TableCell>
                                        {getVal(item, "warehouseId", "WarehouseId") || "-"}
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={type || "-"}
                                            color={getTransactionColor(type)}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        {getVal(
                                            item,
                                            "referenceNumber",
                                            "ReferenceNumber"
                                        ) || "-"}
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatNumber(
                                            getVal(item, "quantity", "Quantity")
                                        )}
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatNumber(
                                            getVal(
                                                item,
                                                "balanceQuantity",
                                                "BalanceQuantity"
                                            )
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {formatDate(
                                            getVal(
                                                item,
                                                "transactionDate",
                                                "TransactionDate"
                                            )
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {getVal(item, "remarks", "Remarks") || "-"}
                                    </TableCell>

                                    <TableCell align="center">
                                        <Tooltip title="View">
                                            <span>
                                                <IconButton
                                                    color="primary"
                                                    disabled={id === ""}
                                                    onClick={() =>
                                                        handleAction(
                                                            onView,
                                                            item,
                                                            "VIEW"
                                                        )
                                                    }
                                                >
                                                    <Visibility />
                                                </IconButton>
                                            </span>
                                        </Tooltip>

                                        <Tooltip title="Edit">
                                            <span>
                                                <IconButton
                                                    color="warning"
                                                    disabled={id === ""}
                                                    onClick={() =>
                                                        handleAction(
                                                            onEdit,
                                                            item,
                                                            "EDIT"
                                                        )
                                                    }
                                                >
                                                    <Edit />
                                                </IconButton>
                                            </span>
                                        </Tooltip>

                                        <Tooltip title="Delete">
                                            <span>
                                                <IconButton
                                                    color="error"
                                                    disabled={id === ""}
                                                    onClick={() =>
                                                        handleAction(
                                                            onDelete,
                                                            item,
                                                            "DELETE"
                                                        )
                                                    }
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </span>
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
