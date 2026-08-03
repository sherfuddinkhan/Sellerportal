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
    Tooltip
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

const formatCurrency = (value) =>
    `₹ ${Number(value || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

const SalesOrderItemTable = ({

    items = [],

    loading,

    onView,

    onEdit,

    onDelete

}) => {

    if (loading) {

        return null;

    }

    return (

        <TableContainer
            component={Paper}
            className="sales-order-item-table"
        >

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>

                            <strong>ID</strong>

                        </TableCell>

                        <TableCell>

                            <strong>Sales Order</strong>

                        </TableCell>

                        <TableCell>

                            <strong>Product</strong>

                        </TableCell>

                        <TableCell align="right">

                            <strong>Quantity</strong>

                        </TableCell>

                        <TableCell align="right">

                            <strong>Unit Price</strong>

                        </TableCell>

                        <TableCell align="right">

                            <strong>Discount</strong>

                        </TableCell>

                        <TableCell align="right">

                            <strong>Tax</strong>

                        </TableCell>

                        <TableCell align="right">

                            <strong>Total</strong>

                        </TableCell>

                        <TableCell align="center">

                            <strong>Actions</strong>

                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {

                        items.length === 0 ? (

                            <TableRow>

                                <TableCell
                                    colSpan={9}
                                    align="center"
                                >

                                    <Typography
                                        color="text.secondary"
                                    >

                                        No Sales Order Items Found

                                    </Typography>

                                </TableCell>

                            </TableRow>

                        ) : (

                            items.map((item) => (

                                <TableRow
                                    hover
                                    key={item.SalesOrderItemId}
                                >

                                    <TableCell>

                                        {item.SalesOrderItemId}

                                    </TableCell>

                                    <TableCell>

                                        <Chip
                                            size="small"
                                            label={item.SalesOrderId}
                                            color="primary"
                                            variant="outlined"
                                        />

                                    </TableCell>

                                    <TableCell>

                                        {item.ProductId}

                                    </TableCell>

                                    <TableCell align="right">

                                        {Number(
                                            item.Quantity || 0
                                        ).toLocaleString()}

                                    </TableCell>

                                    <TableCell align="right">

                                        {formatCurrency(
                                            item.UnitPrice
                                        )}

                                    </TableCell>

                                    <TableCell align="right">

                                        {formatCurrency(
                                            item.Discount
                                        )}

                                    </TableCell>

                                    <TableCell align="right">

                                        {formatCurrency(
                                            item.TaxAmount
                                        )}

                                    </TableCell>

                                    <TableCell
                                        align="right"
                                        sx={{
                                            fontWeight: 600
                                        }}
                                    >

                                        {formatCurrency(
                                            item.TotalAmount
                                        )}

                                    </TableCell>

                                    <TableCell align="center">

                                        <Tooltip title="View">

                                            <IconButton
                                                color="primary"
                                                onClick={() =>
                                                    onView(item)
                                                }
                                            >

                                                <Visibility />

                                            </IconButton>

                                        </Tooltip>

                                        <Tooltip title="Edit">

                                            <IconButton
                                                color="warning"
                                                onClick={() =>
                                                    onEdit(item)
                                                }
                                            >

                                                <Edit />

                                            </IconButton>

                                        </Tooltip>

                                        <Tooltip title="Delete">

                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    onDelete(item)
                                                }
                                            >

                                                <Delete />

                                            </IconButton>

                                        </Tooltip>

                                    </TableCell>

                                </TableRow>

                            ))

                        )

                    }

                </TableBody>

            </Table>

        </TableContainer>

    );

};

export default SalesOrderItemTable;