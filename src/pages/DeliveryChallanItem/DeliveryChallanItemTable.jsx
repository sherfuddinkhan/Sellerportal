// ============================================================
// DeliveryChallanItemTable.jsx
// ============================================================

import React from "react";
import { useNavigate } from "react-router-dom";

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
    items = [],
    onView,
    onEdit,
    onDelete
}) => {

    const navigate = useNavigate();


    // =========================================================
    // FORMAT CURRENCY
    // =========================================================

    const formatCurrency = (value) => {

        return Number(value ?? 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    // =========================================================
    // FORMAT QUANTITY
    // =========================================================

    const formatQuantity = (value) => {

        return Number(value ?? 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    // =========================================================
    // FORMAT DATE
    // =========================================================

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


    // =========================================================
    // HANDLE EDIT
    // =========================================================

    const handleEdit = (item) => {

        const itemId =
            item.deliveryChallanItemId ??
            item.DeliveryChallanItemId;

        if (!itemId || Number(itemId) <= 0) {

            console.error(
                "Invalid Delivery Challan Item ID:",
                item
            );

            return;
        }


        console.log(
            "EDIT DELIVERY CHALLAN ITEM ID:",
            itemId
        );


        // Navigate using the actual item ID

        navigate(
            `/delivery-challan-items/edit/${Number(itemId)}`
        );

    };


    // =========================================================
    // TABLE
    // =========================================================

    return (

        <TableContainer
            component={Paper}
            className="delivery-challan-item-table"
            sx={{
                overflowX: "auto"
            }}
        >

            <Table size="small">

                {/* =================================================
                    HEADER
                ================================================= */}

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


                {/* =================================================
                    BODY
                ================================================= */}

                <TableBody>

                    {items.length === 0 ? (

                        <TableRow>

                            <TableCell
                                colSpan={11}
                                align="center"
                            >

                                No Delivery Challan Items Found

                            </TableCell>

                        </TableRow>

                    ) : (

                        items.map((item) => {

                            // =================================================
                            // NORMALIZE API FIELDS
                            // =================================================

                            const itemId =
                                item.deliveryChallanItemId ??
                                item.DeliveryChallanItemId ??
                                0;

                            const deliveryChallanId =
                                item.deliveryChallanId ??
                                item.DeliveryChallanId ??
                                0;

                            const productId =
                                item.productId ??
                                item.ProductId ??
                                0;

                            const quantity =
                                item.quantity ??
                                item.Quantity ??
                                0;

                            const unitPrice =
                                item.unitPrice ??
                                item.UnitPrice ??
                                0;

                            const discount =
                                item.discount ??
                                item.Discount ??
                                0;

                            const taxAmount =
                                item.taxAmount ??
                                item.TaxAmount ??
                                0;

                            const totalAmount =
                                item.totalAmount ??
                                item.TotalAmount ??
                                0;

                            const remarks =
                                item.remarks ??
                                item.Remarks ??
                                "";

                            const createdDate =
                                item.createdDate ??
                                item.CreatedDate ??
                                null;


                            return (

                                <TableRow
                                    key={itemId}
                                    hover
                                >

                                    {/* =====================================
                                        ITEM ID
                                    ===================================== */}

                                    <TableCell>

                                        {itemId}

                                    </TableCell>


                                    {/* =====================================
                                        DELIVERY CHALLAN
                                    ===================================== */}

                                    <TableCell>

                                        <Chip
                                            label={
                                                deliveryChallanId
                                            }
                                            color="primary"
                                            size="small"
                                        />

                                    </TableCell>


                                    {/* =====================================
                                        PRODUCT
                                    ===================================== */}

                                    <TableCell>

                                        {productId}

                                    </TableCell>


                                    {/* =====================================
                                        QUANTITY
                                    ===================================== */}

                                    <TableCell align="right">

                                        {formatQuantity(
                                            quantity
                                        )}

                                    </TableCell>


                                    {/* =====================================
                                        UNIT PRICE
                                    ===================================== */}

                                    <TableCell align="right">

                                        ₹
                                        {formatCurrency(
                                            unitPrice
                                        )}

                                    </TableCell>


                                    {/* =====================================
                                        DISCOUNT
                                    ===================================== */}

                                    <TableCell align="right">

                                        ₹
                                        {formatCurrency(
                                            discount
                                        )}

                                    </TableCell>


                                    {/* =====================================
                                        TAX
                                    ===================================== */}

                                    <TableCell align="right">

                                        ₹
                                        {formatCurrency(
                                            taxAmount
                                        )}

                                    </TableCell>


                                    {/* =====================================
                                        TOTAL
                                    ===================================== */}

                                    <TableCell align="right">

                                        <strong>

                                            ₹
                                            {formatCurrency(
                                                totalAmount
                                            )}

                                        </strong>

                                    </TableCell>


                                    {/* =====================================
                                        REMARKS
                                    ===================================== */}

                                    <TableCell>

                                        {remarks || "-"}

                                    </TableCell>


                                    {/* =====================================
                                        CREATED DATE
                                    ===================================== */}

                                    <TableCell>

                                        {formatDate(
                                            createdDate
                                        )}

                                    </TableCell>


                                    {/* =====================================
                                        ACTIONS
                                    ===================================== */}

                                    <TableCell align="center">

                                        {/* ================================
                                            VIEW
                                        ================================= */}

                                        <Tooltip title="View">

                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={() =>
                                                    onView?.(item)
                                                }
                                            >

                                                <Visibility />

                                            </IconButton>

                                        </Tooltip>


                                        {/* ================================
                                            EDIT
                                        ================================= */}

                                        <Tooltip title="Edit">

                                            <IconButton

                                                color="warning"

                                                size="small"

                                                onClick={() =>
                                                    handleEdit(item)
                                                }

                                            >

                                                <Edit />

                                            </IconButton>

                                        </Tooltip>


                                        {/* ================================
                                            DELETE
                                        ================================= */}

                                        <Tooltip title="Delete">

                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() =>
                                                    onDelete?.(item)
                                                }
                                            >

                                                <Delete />

                                            </IconButton>

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


export default DeliveryChallanItemTable;
