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
    Typography
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
   FORMAT QUANTITY
========================================================= */

const formatQuantity = (value) => {

    const quantity = Number(value);

    if (!Number.isFinite(quantity)) {
        return "0.00";
    }

    return quantity.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};


/* =========================================================
   PURCHASE ORDER ITEM TABLE
========================================================= */

const PurchaseOrderItemTable = ({
    items = [],
    onView,
    onEdit,
    onDelete
}) => {

    return (
        <TableContainer
            component={Paper}
            className="purchase-order-item-table"
        >

            <Table stickyHeader>

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
                                Purchase Order ID
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Product ID
                            </strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>
                                Quantity
                            </strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>
                                Unit Price
                            </strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>
                                Discount
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

                    {items.length === 0 ? (

                        <TableRow>

                            <TableCell
                                colSpan={9}
                                align="center"
                            >

                                <Typography
                                    color="text.secondary"
                                    sx={{ py: 3 }}
                                >
                                    No Purchase Order Items Found
                                </Typography>

                            </TableCell>

                        </TableRow>

                    ) : (

                        items.map((item) => (

                            <TableRow
                                hover
                                key={item.PurchaseOrderItemId}
                            >

                                {/* Item ID */}

                                <TableCell>
                                    {item.PurchaseOrderItemId ?? "-"}
                                </TableCell>


                                {/* Purchase Order ID */}

                                <TableCell>
                                    {item.PurchaseOrderId ?? "-"}
                                </TableCell>


                                {/* Product ID */}

                                <TableCell>
                                    {item.ProductId ?? "-"}
                                </TableCell>


                                {/* Quantity */}

                                <TableCell align="right">
                                    {formatQuantity(item.Quantity)}
                                </TableCell>


                                {/* Unit Price */}

                                <TableCell align="right">
                                    {formatCurrency(item.UnitPrice)}
                                </TableCell>


                                {/* Discount */}

                                <TableCell align="right">
                                    {formatCurrency(item.Discount)}
                                </TableCell>


                                {/* Tax Amount */}

                                <TableCell align="right">
                                    {formatCurrency(item.TaxAmount)}
                                </TableCell>


                                {/* Total Amount */}

                                <TableCell align="right">
                                    <strong>
                                        {formatCurrency(item.TotalAmount)}
                                    </strong>
                                </TableCell>


                                {/* =================================================
                                    ACTIONS
                                ================================================= */}

                                <TableCell align="center">

                                    {/* View */}

                                    <Tooltip title="View">

                                        <IconButton
                                            color="primary"
                                            size="small"
                                            onClick={() => onView?.(item)}
                                        >
                                            <Visibility />
                                        </IconButton>

                                    </Tooltip>


                                    {/* Edit */}

                                    <Tooltip title="Edit">

                                        <IconButton
                                            color="warning"
                                            size="small"
                                            onClick={() => onEdit?.(item)}
                                        >
                                            <Edit />
                                        </IconButton>

                                    </Tooltip>


                                    {/* Delete */}

                                    <Tooltip title="Delete">

                                        <IconButton
                                            color="error"
                                            size="small"
                                            onClick={() => onDelete?.(item)}
                                        >
                                            <Delete />
                                        </IconButton>

                                    </Tooltip>

                                </TableCell>

                            </TableRow>

                        ))

                    )}

                </TableBody>

            </Table>

        </TableContainer>
    );
};


export default PurchaseOrderItemTable;
