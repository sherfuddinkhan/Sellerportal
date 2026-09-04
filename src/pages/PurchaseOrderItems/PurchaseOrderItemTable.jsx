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


/* =====================================================
   EMPTY STATE
===================================================== */

if (!Array.isArray(items) || items.length === 0) {

    return (

        <TableContainer
            component={Paper}
            sx={{ mt: 2 }}
        >

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            Item ID
                        </TableCell>

                        <TableCell>
                            Purchase Order ID
                        </TableCell>

                        <TableCell>
                            Product ID
                        </TableCell>

                        <TableCell>
                            Quantity
                        </TableCell>

                        <TableCell>
                            Unit Price
                        </TableCell>

                        <TableCell>
                            Discount
                        </TableCell>

                        <TableCell>
                            Tax Amount
                        </TableCell>

                        <TableCell>
                            Total Amount
                        </TableCell>

                        <TableCell>
                            Actions
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    <TableRow>

                        <TableCell
                            colSpan={9}
                            align="center"
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                No Purchase Order Items Found
                            </Typography>

                        </TableCell>

                    </TableRow>

                </TableBody>

            </Table>

        </TableContainer>

    );

}


/* =====================================================
   TABLE
===================================================== */

return (

    <TableContainer
        component={Paper}
        sx={{ mt: 2 }}
    >

        <Table>

            {/* =================================================
                HEADER
            ================================================= */}

            <TableHead>

                <TableRow>

                    <TableCell>
                        Item ID
                    </TableCell>

                    <TableCell>
                        Purchase Order ID
                    </TableCell>

                    <TableCell>
                        Product ID
                    </TableCell>

                    <TableCell>
                        Quantity
                    </TableCell>

                    <TableCell>
                        Unit Price
                    </TableCell>

                    <TableCell>
                        Discount
                    </TableCell>

                    <TableCell>
                        Tax Amount
                    </TableCell>

                    <TableCell>
                        Total Amount
                    </TableCell>

                    <TableCell>
                        Actions
                    </TableCell>

                </TableRow>

            </TableHead>


            {/* =================================================
                BODY
            ================================================= */}

            <TableBody>

                {items.map((item) => (

                    <TableRow
                        key={item.purchaseOrderItemId}
                        hover
                    >

                        {/* -----------------------------------------
                            ITEM ID
                        ----------------------------------------- */}

                        <TableCell>
                            {item.purchaseOrderItemId}
                        </TableCell>


                        {/* -----------------------------------------
                            PURCHASE ORDER ID
                        ----------------------------------------- */}

                        <TableCell>
                            {item.purchaseOrderId}
                        </TableCell>


                        {/* -----------------------------------------
                            PRODUCT ID
                        ----------------------------------------- */}

                        <TableCell>
                            {item.productId}
                        </TableCell>


                        {/* -----------------------------------------
                            QUANTITY
                        ----------------------------------------- */}

                        <TableCell>
                            {formatQuantity(
                                item.quantity
                            )}
                        </TableCell>


                        {/* -----------------------------------------
                            UNIT PRICE
                        ----------------------------------------- */}

                        <TableCell>
                            {formatCurrency(
                                item.unitPrice
                            )}
                        </TableCell>


                        {/* -----------------------------------------
                            DISCOUNT
                        ----------------------------------------- */}

                        <TableCell>
                            {formatCurrency(
                                item.discount
                            )}
                        </TableCell>


                        {/* -----------------------------------------
                            TAX AMOUNT
                        ----------------------------------------- */}

                        <TableCell>
                            {formatCurrency(
                                item.taxAmount
                            )}
                        </TableCell>


                        {/* -----------------------------------------
                            TOTAL AMOUNT
                        ----------------------------------------- */}

                        <TableCell>

                            <Typography
                                fontWeight="bold"
                            >
                                {formatCurrency(
                                    item.totalAmount
                                )}
                            </Typography>

                        </TableCell>


                        {/* -----------------------------------------
                            ACTIONS
                        ----------------------------------------- */}

                        <TableCell>

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


                            <Tooltip title="Edit">

                                <IconButton
                                    color="secondary"
                                    onClick={() =>
                                        onEdit?.(item)
                                    }
                                >

                                    <Edit />

                                </IconButton>

                            </Tooltip>


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

                ))}

            </TableBody>

        </Table>

    </TableContainer>

);


};

export default PurchaseOrderItemTable;
