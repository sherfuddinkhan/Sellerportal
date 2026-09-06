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


/* =========================================================
   ORDER STATUS HISTORY TABLE
========================================================= */

const OrderStatusHistoryTable = ({
    items = [],
    loading = false,
    onView,
    onEdit,
    onDelete
}) => {


    /* =====================================================
       STATUS COLOR
    ===================================================== */

    const getStatusColor = (status) => {

        switch (
            String(status || "")
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


    /* =====================================================
       FORMAT DATE TIME
    ===================================================== */

    const formatDateTime = (value) => {

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

        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };


    /* =====================================================
       NORMALIZE HISTORY ID
    ===================================================== */

    const getHistoryId = (row) => {

        return (
            row.orderStatusHistoryId ??
            row.OrderStatusHistoryId ??
            row.historyId ??
            row.HistoryId ??
            "-"
        );
    };


    /* =====================================================
       NORMALIZE ORDER ID
    ===================================================== */

    const getOrderId = (row) => {

        return (
            row.orderId ??
            row.OrderId ??
            "-"
        );
    };


    /* =====================================================
       NORMALIZE STATUS
    ===================================================== */

    const getStatus = (row) => {

        return (
            row.status ??
            row.Status ??
            ""
        );
    };


    /* =====================================================
       NORMALIZE REMARKS
    ===================================================== */

    const getRemarks = (row) => {

        return (
            row.remarks ??
            row.Remarks ??
            ""
        );
    };


    /* =====================================================
       NORMALIZE CHANGED ON
    ===================================================== */

    const getChangedOn = (row) => {

        return (
            row.changedOn ??
            row.ChangedOn ??
            null
        );
    };


    /* =====================================================
       LOADING STATE
    ===================================================== */

    if (loading) {

        return (
            <Paper
                elevation={2}
                sx={{
                    minHeight: 250,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >

                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={2}
                >

                    <CircularProgress />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Loading Order Status History...
                    </Typography>

                </Box>

            </Paper>
        );
    }


    /* =====================================================
       EMPTY STATE
    ===================================================== */

    if (!Array.isArray(items) || items.length === 0) {

        return (
            <Paper
                elevation={2}
                sx={{
                    p: 5
                }}
            >

                <Typography
                    align="center"
                    color="text.secondary"
                    variant="body1"
                >
                    No Order Status History Found
                </Typography>

            </Paper>
        );
    }


    /* =====================================================
       RENDER TABLE
    ===================================================== */

    return (

        <TableContainer
            component={Paper}
            elevation={2}
            sx={{
                width: "100%",
                overflowX: "auto"
            }}
        >

            <Table
                size="small"
                stickyHeader
            >

                {/* =================================================
                    TABLE HEADER
                ================================================= */}

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>History ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Order ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Status</strong>
                        </TableCell>

                        <TableCell
                            sx={{
                                minWidth: 250
                            }}
                        >
                            <strong>Remarks</strong>
                        </TableCell>

                        <TableCell
                            sx={{
                                minWidth: 180
                            }}
                        >
                            <strong>Changed On</strong>
                        </TableCell>

                        <TableCell
                            align="center"
                            sx={{
                                minWidth: 150
                            }}
                        >
                            <strong>Actions</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>


                {/* =================================================
                    TABLE BODY
                ================================================= */}

                <TableBody>

                    {items.map((row, index) => {

                        const historyId =
                            getHistoryId(row);

                        const orderId =
                            getOrderId(row);

                        const status =
                            getStatus(row);

                        const remarks =
                            getRemarks(row);

                        const changedOn =
                            getChangedOn(row);


                        return (

                            <TableRow
                                key={
                                    historyId !== "-"
                                        ? historyId
                                        : `history-${index}`
                                }
                                hover
                            >

                                {/* =====================================
                                    HISTORY ID
                                ===================================== */}

                                <TableCell>
                                    {historyId}
                                </TableCell>


                                {/* =====================================
                                    ORDER ID
                                ===================================== */}

                                <TableCell>
                                    {orderId}
                                </TableCell>


                                {/* =====================================
                                    STATUS
                                ===================================== */}

                                <TableCell>

                                    <Chip
                                        label={
                                            status ||
                                            "N/A"
                                        }
                                        color={
                                            getStatusColor(
                                                status
                                            )
                                        }
                                        size="small"
                                    />

                                </TableCell>


                                {/* =====================================
                                    REMARKS
                                ===================================== */}

                                <TableCell>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            maxWidth: 400,

                                            overflow:
                                                "hidden",

                                            textOverflow:
                                                "ellipsis",

                                            whiteSpace:
                                                "nowrap"
                                        }}
                                        title={
                                            remarks ||
                                            "-"
                                        }
                                    >
                                        {
                                            remarks ||
                                            "-"
                                        }
                                    </Typography>

                                </TableCell>


                                {/* =====================================
                                    CHANGED ON
                                ===================================== */}

                                <TableCell>

                                    {
                                        formatDateTime(
                                            changedOn
                                        )
                                    }

                                </TableCell>


                                {/* =====================================
                                    ACTIONS
                                ===================================== */}

                                <TableCell
                                    align="center"
                                >

                                    {/* =================================
                                        VIEW
                                    ================================= */}

                                    <Tooltip
                                        title="View"
                                    >

                                        <IconButton
                                            color="primary"
                                            size="small"
                                            onClick={() => {

                                                if (
                                                    typeof onView ===
                                                    "function"
                                                ) {
                                                    onView(row);
                                                }

                                            }}
                                            aria-label="View order status history"
                                        >
                                            <Visibility />
                                        </IconButton>

                                    </Tooltip>


                                    {/* =================================
                                        EDIT
                                    ================================= */}

                                    <Tooltip
                                        title="Edit"
                                    >

                                        <IconButton
                                            color="warning"
                                            size="small"
                                            onClick={() => {

                                                if (
                                                    typeof onEdit ===
                                                    "function"
                                                ) {
                                                    onEdit(row);
                                                }

                                            }}
                                            aria-label="Edit order status history"
                                        >
                                            <Edit />
                                        </IconButton>

                                    </Tooltip>


                                    {/* =================================
                                        DELETE
                                    ================================= */}

                                    <Tooltip
                                        title="Delete"
                                    >

                                        <IconButton
                                            color="error"
                                            size="small"
                                            onClick={() => {

                                                if (
                                                    typeof onDelete ===
                                                    "function"
                                                ) {
                                                    onDelete(row);
                                                }

                                            }}
                                            aria-label="Delete order status history"
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


export default OrderStatusHistoryTable;
