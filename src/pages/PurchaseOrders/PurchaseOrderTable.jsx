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


const formatDate = (value) =>
    value
        ? new Date(value).toLocaleDateString()
        : "-";


const getStatusColor = (status) => {

    switch ((status || "").toLowerCase()) {

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


const PurchaseOrderTable = ({

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
            className="purchase-order-table"
        >

            <Table>


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

                            <strong>Expected Delivery</strong>

                        </TableCell>


                        <TableCell>

                            <strong>Status</strong>

                        </TableCell>


                        <TableCell align="right">

                            <strong>Total Amount</strong>

                        </TableCell>


                        <TableCell>

                            <strong>Remarks</strong>

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
                                    colSpan={10}
                                    align="center"
                                >

                                    <Typography
                                        color="text.secondary"
                                    >

                                        No Purchase Orders Found

                                    </Typography>


                                </TableCell>

                            </TableRow>


                        ) : (


                            items.map((item) => (


                                <TableRow

                                    hover

                                    key={
                                        item.PurchaseOrderId
                                    }

                                >


                                    <TableCell>

                                        {item.PurchaseOrderId}

                                    </TableCell>


                                    <TableCell>

                                        {item.PurchaseOrderNumber}

                                    </TableCell>


                                    <TableCell>

                                        {item.SellerId}

                                    </TableCell>


                                    <TableCell>

                                        {item.SupplierId}

                                    </TableCell>


                                    <TableCell>

                                        {formatDate(
                                            item.OrderDate
                                        )}

                                    </TableCell>


                                    <TableCell>

                                        {formatDate(
                                            item.ExpectedDeliveryDate
                                        )}

                                    </TableCell>


                                    <TableCell>

                                        <Chip

                                            label={
                                                item.Status || "-"
                                            }

                                            color={
                                                getStatusColor(
                                                    item.Status
                                                )
                                            }

                                            size="small"

                                        />

                                    </TableCell>


                                    <TableCell align="right">

                                        {formatCurrency(
                                            item.TotalAmount
                                        )}

                                    </TableCell>


                                    <TableCell>

                                        {item.Remarks || "-"}

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


export default PurchaseOrderTable;