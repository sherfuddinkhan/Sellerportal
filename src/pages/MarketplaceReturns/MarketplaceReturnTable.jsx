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

const MarketplaceReturnTable = ({
    marketplaceReturns,
    onView,
    onEdit,
    onDelete
}) => {

    const getStatusColor = (status) => {

        switch ((status || "").toLowerCase()) {

            case "completed":
            case "approved":
                return "success";

            case "pending":
                return "warning";

            case "rejected":
            case "cancelled":
                return "error";

            case "processing":
                return "info";

            default:
                return "default";

        }

    };

    return (

        <TableContainer
            component={Paper}
            className="marketplace-return-table"
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
                            <strong>Marketplace Order Item</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Reason</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Status</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Qty Returned</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Refund Amount</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Return Date</strong>
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

                        marketplaceReturns.length === 0 ?

                            (

                                <TableRow>

                                    <TableCell
                                        colSpan={10}
                                        align="center"
                                    >

                                        No Marketplace Returns Found

                                    </TableCell>

                                </TableRow>

                            )

                            :

                            (

                                marketplaceReturns.map((item) => (

                                    <TableRow
                                        key={item.MarketplaceReturnId}
                                        hover
                                    >

                                        <TableCell>

                                            {item.MarketplaceReturnId}

                                        </TableCell>

                                        <TableCell>

                                            <strong>

                                                {item.ReturnNumber || "-"}

                                            </strong>

                                        </TableCell>

                                        <TableCell>

                                            {item.MarketplaceOrderItemId}

                                        </TableCell>

                                        <TableCell>

                                            {item.ReturnReason || "-"}

                                        </TableCell>

                                        <TableCell>

                                            <Chip
                                                label={
                                                    item.ReturnStatus || "N/A"
                                                }
                                                color={
                                                    getStatusColor(
                                                        item.ReturnStatus
                                                    )
                                                }
                                                size="small"
                                            />

                                        </TableCell>

                                        <TableCell align="center">

                                            {item.QuantityReturned ?? 0}

                                        </TableCell>

                                        <TableCell align="right">

                                            ₹
                                            {Number(
                                                item.RefundAmount || 0
                                            ).toLocaleString()}

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

export default MarketplaceReturnTable;