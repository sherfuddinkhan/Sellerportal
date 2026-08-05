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
    Tooltip
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

const MarketplaceOrderItemTable = ({
    marketplaceOrderItems,
    onView,
    onEdit,
    onDelete
}) => {

    return (

        <TableContainer
            component={Paper}
            className="marketplace-order-item-table"
        >

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Order ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Order Item No.</strong>
                        </TableCell>

                        <TableCell>
                            <strong>External Item ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Product</strong>
                        </TableCell>

                        <TableCell>
                            <strong>SKU</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Qty</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Unit Price</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Tax</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Shipping</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Discount</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Total</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Created</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Actions</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {

                        marketplaceOrderItems.length === 0 ?

                        (

                            <TableRow>

                                <TableCell
                                    colSpan={14}
                                    align="center"
                                >

                                    No Marketplace Order Items Found

                                </TableCell>

                            </TableRow>

                        )

                        :

                        (

                            marketplaceOrderItems.map((item) => (

                                <TableRow
                                    key={item.MarketplaceOrderItemId}
                                    hover
                                >

                                    <TableCell>

                                        {item.MarketplaceOrderItemId}

                                    </TableCell>

                                    <TableCell>

                                        {item.MarketplaceOrderId}

                                    </TableCell>

                                    <TableCell>

                                        {item.MarketplaceOrderItemNumber || "-"}

                                    </TableCell>

                                    <TableCell>

                                        {item.ExternalOrderItemId || "-"}

                                    </TableCell>

                                    <TableCell>

                                        {item.ProductTitle || "-"}

                                    </TableCell>

                                    <TableCell>

                                        {item.SKU || "-"}

                                    </TableCell>

                                    <TableCell align="center">

                                        {item.Quantity ?? 0}

                                    </TableCell>

                                    <TableCell align="right">

                                        ₹ {Number(
                                            item.UnitPrice || 0
                                        ).toLocaleString()}

                                    </TableCell>

                                    <TableCell align="right">

                                        ₹ {Number(
                                            item.TaxAmount || 0
                                        ).toLocaleString()}

                                    </TableCell>

                                    <TableCell align="right">

                                        ₹ {Number(
                                            item.ShippingAmount || 0
                                        ).toLocaleString()}

                                    </TableCell>

                                    <TableCell align="right">

                                        ₹ {Number(
                                            item.DiscountAmount || 0
                                        ).toLocaleString()}

                                    </TableCell>

                                    <TableCell align="right">

                                        <strong>

                                            ₹ {Number(
                                                item.TotalAmount || 0
                                            ).toLocaleString()}

                                        </strong>

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
                                                onClick={() => onView(item)}
                                            >

                                                <Visibility />

                                            </IconButton>

                                        </Tooltip>

                                        <Tooltip title="Edit">

                                            <IconButton
                                                color="warning"
                                                onClick={() => onEdit(item)}
                                            >

                                                <Edit />

                                            </IconButton>

                                        </Tooltip>

                                        <Tooltip title="Delete">

                                            <IconButton
                                                color="error"
                                                onClick={() => onDelete(item)}
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

export default MarketplaceOrderItemTable;