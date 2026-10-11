// =========================================================
// InvoiceTaxDetailTable.jsx
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
    Typography,
    Box,
    Chip,
    IconButton,
    Tooltip,
    TablePagination
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

// =========================================================
// GET FIELD VALUE
// =========================================================

const getValue = (row, ...keys) => {
    if (!row) {
        return undefined;
    }

    for (const key of keys) {
        if (
            Object.prototype.hasOwnProperty.call(row, key) &&
            row[key] !== null &&
            row[key] !== undefined
        ) {
            return row[key];
        }
    }

    return undefined;
};

// =========================================================
// FORMAT NUMBER
// =========================================================

const formatNumber = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
};

// =========================================================
// INVOICE TAX DETAIL TABLE
// =========================================================

const InvoiceTaxDetailTable = ({
    data = [],
    taxDetails,
    loading = false,
    page = 0,
    rowsPerPage = 10,
    totalCount,
    onPageChange,
    onRowsPerPageChange,
    onView,
    onEdit,
    onDelete
}) => {

    // =====================================================
    // DATA
    // =====================================================

    const rows = Array.isArray(taxDetails)
        ? taxDetails
        : Array.isArray(data)
            ? data
            : [];

    const count =
        totalCount !== undefined &&
        totalCount !== null &&
        Number.isFinite(Number(totalCount))
            ? Number(totalCount)
            : rows.length;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                overflow: "hidden"
            }}
        >
            {/* ============================================= */}
            {/* TABLE HEADER */}
            {/* ============================================= */}

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={1}
                p={2}
            >
                <Typography variant="h6" fontWeight={700}>
                    Invoice Tax Details
                </Typography>

                <Chip
                    label={`${count} Records`}
                    color="primary"
                    variant="outlined"
                    size="small"
                />
            </Box>

            {/* ============================================= */}
            {/* TABLE */}
            {/* ============================================= */}

            <TableContainer>
                <Table
                    size="medium"
                    aria-label="Invoice tax details table"
                >
                    <TableHead>
                        <TableRow
                            sx={{
                                bgcolor: "action.hover"
                            }}
                        >
                            <TableCell>
                                <strong>Tax Detail ID</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Sales Invoice ID</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Channel Product ID</strong>
                            </TableCell>

                            <TableCell align="right">
                                <strong>Tax (%)</strong>
                            </TableCell>

                            <TableCell align="right">
                                <strong>CGST (%)</strong>
                            </TableCell>

                            <TableCell align="right">
                                <strong>SGST (%)</strong>
                            </TableCell>

                            <TableCell align="right">
                                <strong>IGST (%)</strong>
                            </TableCell>

                            <TableCell align="right">
                                <strong>Compensation Cess (%)</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Seller ID</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Customer ID</strong>
                            </TableCell>

                            <TableCell align="center">
                                <strong>Actions</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {/* LOADING */}

                        {loading && (
                            <TableRow>
                                <TableCell
                                    colSpan={11}
                                    align="center"
                                    sx={{ py: 5 }}
                                >
                                    <Typography color="text.secondary">
                                        Loading invoice tax details...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}

                        {/* EMPTY */}

                        {!loading && rows.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={11}
                                    align="center"
                                    sx={{ py: 5 }}
                                >
                                    <Typography
                                        color="text.secondary"
                                    >
                                        No invoice tax details found.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}

                        {/* DATA ROWS */}

                        {!loading &&
                            rows.map((row, index) => {
                                const id = getValue(
                                    row,
                                    "invoiceTaxDetailId",
                                    "InvoiceTaxDetailId",
                                    "invoiceTaxDetailsId",
                                    "InvoiceTaxDetailsId",
                                    "id",
                                    "Id"
                                );

                                const salesInvoiceId = getValue(
                                    row,
                                    "salesInvoiceId",
                                    "SalesInvoiceId"
                                );

                                const channelProductId = getValue(
                                    row,
                                    "channelProductId",
                                    "ChannelProductId"
                                );

                                const taxPercentage = getValue(
                                    row,
                                    "taxPercentage",
                                    "TaxPercentage"
                                );

                                const centralGst = getValue(
                                    row,
                                    "centralGst",
                                    "CentralGst"
                                );

                                const stateGst = getValue(
                                    row,
                                    "stateGst",
                                    "StateGst"
                                );

                                const integratedGst = getValue(
                                    row,
                                    "integratedGst",
                                    "IntegratedGst"
                                );

                                const compensationCess = getValue(
                                    row,
                                    "compensationCess",
                                    "CompensationCess"
                                );

                                const sellerId = getValue(
                                    row,
                                    "sellerId",
                                    "SellerId"
                                );

                                const customerId = getValue(
                                    row,
                                    "customerId",
                                    "CustomerId"
                                );

                                const validId =
                                    id !== undefined &&
                                    id !== null &&
                                    String(id).trim() !== "";

                                return (
                                    <TableRow
                                        hover
                                        key={
                                            validId
                                                ? id
                                                : `invoice-tax-detail-${index}`
                                        }
                                    >
                                        <TableCell>
                                            {validId ? id : "—"}
                                        </TableCell>

                                        <TableCell>
                                            {salesInvoiceId ?? "—"}
                                        </TableCell>

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                fontWeight={500}
                                                sx={{
                                                    overflowWrap: "anywhere"
                                                }}
                                            >
                                                {channelProductId ?? "—"}
                                            </Typography>
                                        </TableCell>

                                        <TableCell align="right">
                                            {taxPercentage === undefined
                                                ? "—"
                                                : formatNumber(taxPercentage)}
                                        </TableCell>

                                        <TableCell align="right">
                                            {centralGst === undefined
                                                ? "—"
                                                : formatNumber(centralGst)}
                                        </TableCell>

                                        <TableCell align="right">
                                            {stateGst === undefined
                                                ? "—"
                                                : formatNumber(stateGst)}
                                        </TableCell>

                                        <TableCell align="right">
                                            {integratedGst === undefined
                                                ? "—"
                                                : formatNumber(integratedGst)}
                                        </TableCell>

                                        <TableCell align="right">
                                            {compensationCess === undefined
                                                ? "—"
                                                : formatNumber(compensationCess)}
                                        </TableCell>

                                        <TableCell>
                                            {sellerId ?? "—"}
                                        </TableCell>

                                        <TableCell>
                                            {customerId ?? "—"}
                                        </TableCell>

                                        {/* ACTIONS */}

                                        <TableCell align="center">
                                            <Box
                                                display="flex"
                                                justifyContent="center"
                                                gap={0.5}
                                            >
                                                {/* VIEW */}

                                                {onView && (
                                                    <Tooltip title="View Details">
                                                        <span>
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                disabled={!validId}
                                                                onClick={() => {
                                                                    if (!validId) {
                                                                        console.error(
                                                                            "Invoice tax detail ID is missing:",
                                                                            row
                                                                        );
                                                                        return;
                                                                    }

                                                                    onView({
                                                                        ...row,
                                                                        invoiceTaxDetailId: id
                                                                    });
                                                                }}
                                                            >
                                                                <Visibility fontSize="small" />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                )}

                                                {/* EDIT */}

                                                {onEdit && (
                                                    <Tooltip title="Edit">
                                                        <span>
                                                            <IconButton
                                                                size="small"
                                                                color="secondary"
                                                                disabled={!validId}
                                                                onClick={() => {
                                                                    if (!validId) {
                                                                        console.error(
                                                                            "Invoice tax detail ID is missing:",
                                                                            row
                                                                        );
                                                                        return;
                                                                    }

                                                                    onEdit({
                                                                        ...row,
                                                                        invoiceTaxDetailId: id
                                                                    });
                                                                }}
                                                            >
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                )}

                                                {/* DELETE */}

                                                {onDelete && (
                                                    <Tooltip title="Delete">
                                                        <span>
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                disabled={!validId}
                                                                onClick={() => {
                                                                    if (!validId) {
                                                                        console.error(
                                                                            "Invoice tax detail ID is missing:",
                                                                            row
                                                                        );
                                                                        return;
                                                                    }

                                                                    onDelete({
                                                                        ...row,
                                                                        invoiceTaxDetailId: id
                                                                    });
                                                                }}
                                                            >
                                                                <Delete fontSize="small" />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ============================================= */}
            {/* PAGINATION */}
            {/* ============================================= */}

            <TablePagination
                component="div"
                count={count}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(event, newPage) => {
                    onPageChange?.(event, newPage);
                }}
                onRowsPerPageChange={(event) => {
                    onRowsPerPageChange?.(event);
                }}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
            />
        </Paper>
    );
};

export default InvoiceTaxDetailTable;
