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
    Chip
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

const DeliveryChallanItemTable = ({
    items,
    onView,
    onEdit,
    onDelete
}) => {

    return (

        <TableContainer
            component={Paper}
            className="delivery-challan-item-table"
        >

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>Item ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Delivery Challan</strong>
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

                        <TableCell>
                            <strong>Remarks</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Created Date</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Actions</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {

                        items.length === 0 ?

                            (

                                <TableRow>

                                    <TableCell
                                        colSpan={11}
                                        align="center"
                                    >

                                        No Delivery Challan Items Found

                                    </TableCell>

                                </TableRow>

                            )

                            :

                            (

                                items.map((item) => (

                                    <TableRow
                                        key={item.DeliveryChallanItemId}
                                        hover
                                    >

                                        <TableCell>

                                            {item.DeliveryChallanItemId}

                                        </TableCell>

                                        <TableCell>

                                            <Chip
                                                label={item.DeliveryChallanId}
                                                color="primary"
                                                size="small"
                                            />

                                        </TableCell>

                                        <TableCell>

                                            {item.ProductId}

                                        </TableCell>

                                        <TableCell align="right">

                                            {Number(
                                                item.Quantity || 0
                                            ).toFixed(2)}

                                        </TableCell>

                                        <TableCell align="right">

                                            ₹
                                            {Number(
                                                item.UnitPrice || 0
                                            ).toLocaleString()}

                                        </TableCell>

                                        <TableCell align="right">

                                            ₹
                                            {Number(
                                                item.Discount || 0
                                            ).toLocaleString()}

                                        </TableCell>

                                        <TableCell align="right">

                                            ₹
                                            {Number(
                                                item.TaxAmount || 0
                                            ).toLocaleString()}

                                        </TableCell>

                                        <TableCell align="right">

                                            <strong>

                                                ₹
                                                {Number(
                                                    item.TotalAmount || 0
                                                ).toLocaleString()}

                                            </strong>

                                        </TableCell>

                                        <TableCell>

                                            {item.Remarks || "-"}

                                        </TableCell>

                                        <TableCell>

                                            {

                                                item.CreatedDate

                                                    ?

                                                    new Date(
                                                        item.CreatedDate
                                                    ).toLocaleDateString()

                                                    :

                                                    "-"

                                            }

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

export default DeliveryChallanItemTable;