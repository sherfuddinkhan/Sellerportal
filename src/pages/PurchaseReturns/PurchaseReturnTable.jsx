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

const PurchaseReturnTable = ({
    purchaseReturns,
    onView,
    onEdit,
    onDelete
}) => {

    return (

        <TableContainer
            component={Paper}
            className="purchase-return-table"
        >

            <Table>

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

                <TableBody>

                    {

                        purchaseReturns.length === 0 ?

                            (

                                <TableRow>

                                    <TableCell
                                        colSpan={11}
                                        align="center"
                                    >

                                        No Purchase Returns Found

                                    </TableCell>

                                </TableRow>

                            )

                            :

                            (

                                purchaseReturns.map((item) => (

                                    <TableRow
                                        key={item.PurchaseReturnId}
                                        hover
                                    >

                                        <TableCell>

                                            {item.PurchaseReturnId}

                                        </TableCell>

                                        <TableCell>

                                            <strong>

                                                {item.PurchaseReturnNumber}

                                            </strong>

                                        </TableCell>

                                        <TableCell>

                                            {item.PurchaseOrderId}

                                        </TableCell>

                                        <TableCell>

                                            {item.GoodsReceiptNoteId}

                                        </TableCell>

                                        <TableCell>

                                            {item.SupplierId}

                                        </TableCell>

                                        <TableCell>

                                            {

                                                item.ReturnDate

                                                    ?

                                                    new Date(
                                                        item.ReturnDate
                                                    ).toLocaleDateString()

                                                    :

                                                    "-"

                                            }

                                        </TableCell>

                                        <TableCell align="right">

                                            ₹
                                            {Number(
                                                item.TotalAmount || 0
                                            ).toLocaleString()}

                                        </TableCell>

                                        <TableCell>

                                            <Chip
                                                label={
                                                    item.Status || "N/A"
                                                }
                                                size="small"
                                                color={
                                                    item.Status?.toLowerCase() === "completed"
                                                        ? "success"
                                                        : item.Status?.toLowerCase() === "pending"
                                                        ? "warning"
                                                        : "default"
                                                }
                                            />

                                        </TableCell>

                                        <TableCell>

                                            {item.Reason || "-"}

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

export default PurchaseReturnTable;