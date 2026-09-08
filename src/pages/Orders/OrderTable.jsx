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
    CircularProgress,
    Typography,
    Box,
    Chip
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";


const OrderTable = ({

    orders = [],

    loading,

    onView,

    onEdit,

    onDelete

}) => {


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <Box

                display="flex"

                justifyContent="center"

                alignItems="center"

                mt={5}

                mb={5}

            >

                <CircularProgress />

            </Box>

        );

    }


    // =========================================================
    // EMPTY
    // =========================================================

    if (orders.length === 0) {

        return (

            <Paper

                sx={{
                    p: 4
                }}

            >

                <Typography

                    align="center"

                    color="text.secondary"

                >

                    No Orders Found

                </Typography>

            </Paper>

        );

    }


    // =========================================================
    // STATUS COLOR
    // =========================================================

    const getStatusColor = (status) => {

        switch (

            status
                ?.toString()
                .toLowerCase()

        ) {

            case "pending":
                return "warning";

            case "confirmed":
                return "info";

            case "processing":
                return "primary";

            case "packed":
                return "secondary";

            case "shipped":
                return "success";

            case "delivered":
                return "success";

            case "cancelled":
                return "error";

            case "returned":
                return "error";

            default:
                return "default";

        }

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <TableContainer

            component={Paper}

            elevation={2}

        >

            <Table

                size="small"

            >

                {/* =================================================
                    TABLE HEADER
                ================================================= */}

                <TableHead>

                    <TableRow>

                        <TableCell>
                            Order ID
                        </TableCell>

                        <TableCell>
                            Seller ID
                        </TableCell>

                        <TableCell>
                            Customer ID
                        </TableCell>

                        <TableCell>
                            Order Number
                        </TableCell>

                        <TableCell>
                            Order Date
                        </TableCell>

                        <TableCell>
                            Status
                        </TableCell>

                        <TableCell>
                            Total Amount
                        </TableCell>

                        <TableCell
                            align="center"
                        >
                            Actions
                        </TableCell>

                    </TableRow>

                </TableHead>


                {/* =================================================
                    TABLE BODY
                ================================================= */}

                <TableBody>

                    {

                        orders.map((row) => {


                            // -----------------------------------------
                            // SUPPORT BOTH CASE STYLES
                            // -----------------------------------------

                            const orderId =
                                row.OrderId ??
                                row.orderId;


                            const sellerId =
                                row.SellerId ??
                                row.sellerId;


                            const customerId =
                                row.CustomerId ??
                                row.customerId;


                            const orderNumber =
                                row.OrderNumber ??
                                row.orderNumber;


                            const orderDate =
                                row.OrderDate ??
                                row.orderDate;


                            const orderStatus =
                                row.OrderStatus ??
                                row.orderStatus;


                            const totalAmount =
                                row.TotalAmount ??
                                row.totalAmount ??
                                0;


                            return (

                                <TableRow

                                    key={orderId}

                                    hover

                                >


                                    {/* =================================
                                        ORDER ID
                                    ================================= */}

                                    <TableCell>

                                        {orderId ?? "-"}

                                    </TableCell>


                                    {/* =================================
                                        SELLER ID
                                    ================================= */}

                                    <TableCell>

                                        {sellerId ?? "-"}

                                    </TableCell>


                                    {/* =================================
                                        CUSTOMER ID
                                    ================================= */}

                                    <TableCell>

                                        {customerId ?? "-"}

                                    </TableCell>


                                    {/* =================================
                                        ORDER NUMBER
                                    ================================= */}

                                    <TableCell>

                                        {orderNumber || "-"}

                                    </TableCell>


                                    {/* =================================
                                        ORDER DATE
                                    ================================= */}

                                    <TableCell>

                                        {

                                            orderDate

                                                ? new Date(
                                                    orderDate
                                                ).toLocaleDateString()

                                                : "-"

                                        }

                                    </TableCell>


                                    {/* =================================
                                        STATUS
                                    ================================= */}

                                    <TableCell>

                                        <Chip

                                            label={
                                                orderStatus ||
                                                "N/A"
                                            }

                                            color={

                                                getStatusColor(
                                                    orderStatus
                                                )

                                            }

                                            size="small"

                                        />

                                    </TableCell>


                                    {/* =================================
                                        TOTAL AMOUNT
                                    ================================= */}

                                    <TableCell>

                                        ₹{" "}

                                        {

                                            Number(
                                                totalAmount
                                            ).toLocaleString(
                                                "en-IN",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }
                                            )

                                        }

                                    </TableCell>


                                    {/* =================================
                                        ACTIONS
                                    ================================= */}

                                    <TableCell

                                        align="center"

                                    >


                                        {/* -----------------------------
                                            VIEW
                                        ----------------------------- */}

                                        <Tooltip

                                            title="View"

                                        >

                                            <IconButton

                                                color="primary"

                                                onClick={() =>
                                                    onView(row)
                                                }

                                            >

                                                <Visibility />

                                            </IconButton>

                                        </Tooltip>


                                        {/* -----------------------------
                                            EDIT
                                        ----------------------------- */}

                                        <Tooltip

                                            title="Edit"

                                        >

                                            <IconButton

                                                color="warning"

                                                onClick={() =>
                                                    onEdit(row)
                                                }

                                            >

                                                <Edit />

                                            </IconButton>

                                        </Tooltip>


                                        {/* -----------------------------
                                            DELETE
                                        ----------------------------- */}

                                        <Tooltip

                                            title="Delete"

                                        >

                                            <IconButton

                                                color="error"

                                                onClick={() =>
                                                    onDelete(row)
                                                }

                                            >

                                                <Delete />

                                            </IconButton>

                                        </Tooltip>


                                    </TableCell>

                                </TableRow>

                            );

                        })

                    }

                </TableBody>

            </Table>

        </TableContainer>

    );

};


export default OrderTable;
