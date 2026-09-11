// =========================================================
// CustomerReturnTable.jsx
// Customer Returns Table
//
// Displays:
// - Return ID
// - Sales Invoice ID
// - Product ID
// - Return Number
// - Return Date
// - Quantity
// - Return Amount
// - Status
// - Actions
//
// React -> server.js -> ASP.NET Core
// =========================================================

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
    Chip,
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const CustomerReturnTable = ({
    items = [],
    loading = false,
    onView,
    onEdit,
    onDelete,
}) => {

    // =====================================================
    // STATUS COLOR
    // =====================================================

    const getStatusColor = (status) => {

        switch (
            String(status || "")
                .trim()
                .toLowerCase()
        ) {

            case "pending":
                return "warning";

            case "approved":
                return "info";

            case "processing":
                return "primary";

            case "completed":
                return "success";

            case "rejected":
                return "error";

            case "cancelled":
                return "error";

            default:
                return "default";
        }

    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (value) => {

        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "-";
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }
        );

    };

    // =====================================================
    // FORMAT CURRENCY
    // =====================================================

    const formatAmount = (value) => {

        const amount =
            Number(value);

        if (
            Number.isNaN(amount)
        ) {
            return "₹ 0.00";
        }

        return (
            `₹ ${amount.toLocaleString(
                "en-IN",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }
            )}`
        );

    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Paper
                sx={{
                    p: 4,
                    width: "100%",
                }}
            >

                <Box
                    sx={{
                        minHeight: 250,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >

                    <CircularProgress />

                </Box>

            </Paper>

        );

    }

    // =====================================================
    // EMPTY
    // =====================================================

    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        return (

            <Paper
                sx={{
                    p: 4,
                    width: "100%",
                }}
            >

                <Typography
                    align="center"
                    color="text.secondary"
                >
                    No Customer Returns Found
                </Typography>

            </Paper>

        );

    }

    // =====================================================
    // TABLE
    // =====================================================

    return (

        <TableContainer
            component={Paper}
            sx={{
                width: "100%",
                overflowX: "auto",
            }}
        >

            <Table
                size="small"
                sx={{
                    minWidth: 1100,
                }}
            >

                {/* =================================================
                    TABLE HEADER
                ================================================= */}

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>
                                Return ID
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Invoice ID
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Product ID
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Return Number
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Return Date
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Quantity
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Return Amount
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Status
                            </strong>
                        </TableCell>

                        <TableCell
                            align="center"
                            sx={{
                                minWidth: 150,
                            }}
                        >
                            <strong>
                                Actions
                            </strong>
                        </TableCell>

                    </TableRow>

                </TableHead>


                {/* =================================================
                    TABLE BODY
                ================================================= */}

                <TableBody>

                    {items.map((row, index) => {

                        // =================================================
                        // SUPPORT PascalCase + camelCase
                        // =================================================

                        const returnId =
                            row?.CustomerReturnId ??
                            row?.customerReturnId ??
                            row?.Id ??
                            row?.id;

                        const invoiceId =
                            row?.SalesInvoiceId ??
                            row?.salesInvoiceId;

                        const productId =
                            row?.ProductId ??
                            row?.productId;

                        const returnNumber =
                            row?.ReturnNumber ??
                            row?.returnNumber;

                        const returnDate =
                            row?.ReturnDate ??
                            row?.returnDate;

                        const quantity =
                            row?.Quantity ??
                            row?.quantity ??
                            0;

                        const returnAmount =
                            row?.ReturnAmount ??
                            row?.returnAmount ??
                            0;

                        const status =
                            row?.Status ??
                            row?.status ??
                            "N/A";

                        // =================================================
                        // STABLE KEY
                        // =================================================

                        const rowKey =
                            returnId ??
                            `customer-return-${index}`;

                        // =================================================
                        // DISPLAY VALUES
                        // =================================================

                        const displayReturnId =
                            returnId ?? "-";

                        const displayInvoiceId =
                            invoiceId ?? "-";

                        const displayProductId =
                            productId ?? "-";

                        const displayReturnNumber =
                            returnNumber || "-";

                        const displayQuantity =
                            Number(quantity) || 0;

                        // =================================================
                        // ROW
                        // =================================================

                        return (

                            <TableRow
                                key={rowKey}
                                hover
                            >

                                {/* =========================================
                                    RETURN ID
                                ========================================= */}

                                <TableCell>
                                    {displayReturnId}
                                </TableCell>


                                {/* =========================================
                                    INVOICE ID
                                ========================================= */}

                                <TableCell>
                                    {displayInvoiceId}
                                </TableCell>


                                {/* =========================================
                                    PRODUCT ID
                                ========================================= */}

                                <TableCell>
                                    {displayProductId}
                                </TableCell>


                                {/* =========================================
                                    RETURN NUMBER
                                ========================================= */}

                                <TableCell>
                                    {displayReturnNumber}
                                </TableCell>


                                {/* =========================================
                                    RETURN DATE
                                ========================================= */}

                                <TableCell>
                                    {formatDate(
                                        returnDate
                                    )}
                                </TableCell>


                                {/* =========================================
                                    QUANTITY
                                ========================================= */}

                                <TableCell>
                                    {displayQuantity}
                                </TableCell>


                                {/* =========================================
                                    RETURN AMOUNT
                                ========================================= */}

                                <TableCell>
                                    {formatAmount(
                                        returnAmount
                                    )}
                                </TableCell>


                                {/* =========================================
                                    STATUS
                                ========================================= */}

                                <TableCell>

                                    <Chip
                                        label={
                                            status
                                        }
                                        color={
                                            getStatusColor(
                                                status
                                            )
                                        }
                                        size="small"
                                    />

                                </TableCell>


                                {/* =========================================
                                    ACTIONS
                                ========================================= */}

                                <TableCell
                                    align="center"
                                >

                                    {/* =================================
                                        VIEW
                                    ================================= */}

                                    <Tooltip
                                        title="View Return"
                                    >

                                        <IconButton
                                            color="primary"
                                            size="small"
                                            disabled={
                                                !returnId ||
                                                !onView
                                            }
                                            onClick={() =>
                                                onView?.(row)
                                            }
                                        >

                                            <Visibility />

                                        </IconButton>

                                    </Tooltip>


                                    {/* =================================
                                        EDIT
                                    ================================= */}

                                    <Tooltip
                                        title="Edit Return"
                                    >

                                        <IconButton
                                            color="warning"
                                            size="small"
                                            disabled={
                                                !returnId ||
                                                !onEdit
                                            }
                                            onClick={() =>
                                                onEdit?.(row)
                                            }
                                        >

                                            <Edit />

                                        </IconButton>

                                    </Tooltip>


                                    {/* =================================
                                        DELETE
                                    ================================= */}

                                    <Tooltip
                                        title="Delete Return"
                                    >

                                        <IconButton
                                            color="error"
                                            size="small"
                                            disabled={
                                                !returnId ||
                                                !onDelete
                                            }
                                            onClick={() =>
                                                onDelete?.(row)
                                            }
                                        >

                                            <Delete />

                                        </IconButton>

                                    </Tooltip>

                                </TableCell>

                            </TableRow>

                        );

                    })}

                </TableBody>

            </Table>

        </TableContainer>

    );

};

// =========================================================
// EXPORT
// =========================================================

export default CustomerReturnTable;