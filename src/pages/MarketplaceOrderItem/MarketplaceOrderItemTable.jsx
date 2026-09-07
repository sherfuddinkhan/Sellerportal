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


/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};


/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {

    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("en-IN");
};


/* =========================================================
   MARKETPLACE ORDER ITEM TABLE
========================================================= */

const MarketplaceOrderItemTable = ({
    marketplaceOrderItems = [],
    onView,
    onEdit,
    onDelete
}) => {

    return (

        <TableContainer
            component={Paper}
            className="marketplace-order-item-table"
            sx={{
                overflowX: "auto"
            }}
        >

            <Table
                stickyHeader
                sx={{
                    minWidth: 1500
                }}
            >

                {/* =================================================
                    TABLE HEAD
                ================================================= */}

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


                {/* =================================================
                    TABLE BODY
                ================================================= */}

                <TableBody>

                    {marketplaceOrderItems.length === 0 ? (

                        <TableRow>

                            <TableCell
                                colSpan={14}
                                align="center"
                                sx={{
                                    py: 5
                                }}
                            >

                                No Marketplace Order Items Found

                            </TableCell>

                        </TableRow>

                    ) : (

                        marketplaceOrderItems.map((item) => (

                            <TableRow
                                key={item.MarketplaceOrderItemId}
                                hover
                            >

                                {/* ---------------------------------
                                    ID
                                --------------------------------- */}

                                <TableCell>

                                    {item.MarketplaceOrderItemId ?? "-"}

                                </TableCell>


                                {/* ---------------------------------
                                    ORDER ID
                                --------------------------------- */}

                                <TableCell>

                                    {item.MarketplaceOrderId ?? "-"}

                                </TableCell>


                                {/* ---------------------------------
                                    ORDER ITEM NUMBER
                                --------------------------------- */}

                                <TableCell>

                                    {item.MarketplaceOrderItemNumber || "-"}

                                </TableCell>


                                {/* ---------------------------------
                                    EXTERNAL ITEM ID
                                --------------------------------- */}

                                <TableCell>

                                    {item.ExternalOrderItemId || "-"}

                                </TableCell>


                                {/* ---------------------------------
                                    PRODUCT
                                --------------------------------- */}

                                <TableCell
                                    sx={{
                                        maxWidth: 250,
                                        whiteSpace: "normal",
                                        wordBreak: "break-word"
                                    }}
                                >

                                    {item.ProductTitle || "-"}

                                </TableCell>


                                {/* ---------------------------------
                                    SKU
                                --------------------------------- */}

                                <TableCell>

                                    {item.SKU || "-"}

                                </TableCell>


                                {/* ---------------------------------
                                    QUANTITY
                                --------------------------------- */}

                                <TableCell align="center">

                                    {item.Quantity ?? 0}

                                </TableCell>


                                {/* ---------------------------------
                                    UNIT PRICE
                                --------------------------------- */}

                                <TableCell align="right">

                                    ₹ {formatNumber(item.UnitPrice)}

                                </TableCell>


                                {/* ---------------------------------
                                    TAX
                                --------------------------------- */}

                                <TableCell align="right">

                                    ₹ {formatNumber(item.TaxAmount)}

                                </TableCell>


                                {/* ---------------------------------
                                    SHIPPING
                                --------------------------------- */}

                                <TableCell align="right">

                                    ₹ {formatNumber(item.ShippingAmount)}

                                </TableCell>


                                {/* ---------------------------------
                                    DISCOUNT
                                --------------------------------- */}

                                <TableCell align="right">

                                    ₹ {formatNumber(item.DiscountAmount)}

                                </TableCell>


                                {/* ---------------------------------
                                    TOTAL
                                --------------------------------- */}

                                <TableCell align="right">

                                    <strong>
                                        ₹ {formatNumber(item.TotalAmount)}
                                    </strong>

                                </TableCell>


                                {/* ---------------------------------
                                    CREATED DATE
                                --------------------------------- */}

                                <TableCell>

                                    {formatDate(item.CreatedDate)}

                                </TableCell>


                                {/* ---------------------------------
                                    ACTIONS
                                --------------------------------- */}

                                <TableCell align="center">

                                    <Tooltip title="View">

                                        <IconButton
                                            color="primary"
                                            size="small"
                                            onClick={() =>
                                                onView?.(item)
                                            }
                                            aria-label="View marketplace order item"
                                        >

                                            <Visibility />

                                        </IconButton>

                                    </Tooltip>


                                    <Tooltip title="Edit">

                                        <IconButton
                                            color="warning"
                                            size="small"
                                            onClick={() =>
                                                onEdit?.(item)
                                            }
                                            aria-label="Edit marketplace order item"
                                        >

                                            <Edit />

                                        </IconButton>

                                    </Tooltip>


                                    <Tooltip title="Delete">

                                        <IconButton
                                            color="error"
                                            size="small"
                                            onClick={() =>
                                                onDelete?.(item)
                                            }
                                            aria-label="Delete marketplace order item"
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


export default MarketplaceOrderItemTable;
