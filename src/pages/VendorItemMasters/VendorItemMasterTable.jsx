// =========================================================
// VendorItemMasterTable.jsx
// =========================================================

import React from "react";

import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    CircularProgress
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

// =========================================================
// FORMAT CURRENCY
// =========================================================

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

// =========================================================
// GET FIELD VALUE
// =========================================================

const getField = (item, camelCase, pascalCase, fallback = "") => {
    return item?.[camelCase] ??
        item?.[pascalCase] ??
        fallback;
};

// =========================================================
// VENDOR ITEM MASTER TABLE
// =========================================================

const VendorItemMasterTable = ({
    items = [],
    loading = false,
    onView,
    onEdit,
    onDelete
}) => {

    // =====================================================
    // GET STATUS
    // =====================================================

    const getStatus = (item) => {
        const status = String(
            getField(item, "status", "Status", "Inactive")
        ).trim().toLowerCase();

        if (
            status === "active" ||
            status === "true" ||
            status === "1"
        ) {
            return {
                label: "Active",
                color: "success"
            };
        }

        if (
            status === "inactive" ||
            status === "false" ||
            status === "0"
        ) {
            return {
                label: "Inactive",
                color: "default"
            };
        }

        return {
            label: status
                ? status.charAt(0).toUpperCase() + status.slice(1)
                : "Unknown",
            color: "warning"
        };
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                width: "100%",
                overflowX: "auto"
            }}
        >
            <Table
                size="medium"
                stickyHeader
                aria-label="Vendor item master table"
            >
                {/* ========================================= */}
                {/* TABLE HEADER */}
                {/* ========================================= */}

                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>
                            #
                        </TableCell>

                        <TableCell sx={{ fontWeight: 700 }}>
                            Item Code
                        </TableCell>

                        <TableCell sx={{ fontWeight: 700 }}>
                            Item Name
                        </TableCell>

                        <TableCell sx={{ fontWeight: 700 }}>
                            Vendor
                        </TableCell>

                        <TableCell sx={{ fontWeight: 700 }}>
                            Unit of Measure
                        </TableCell>

                        <TableCell
                            align="right"
                            sx={{ fontWeight: 700 }}
                        >
                            Unit Price
                        </TableCell>

                        <TableCell
                            align="right"
                            sx={{ fontWeight: 700 }}
                        >
                            Tax Rate (%)
                        </TableCell>

                        <TableCell sx={{ fontWeight: 700 }}>
                            Status
                        </TableCell>

                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 700,
                                minWidth: 140
                            }}
                        >
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>

                {/* ========================================= */}
                {/* TABLE BODY */}
                {/* ========================================= */}

                <TableBody>
                    {loading && (!items || items.length === 0) ? (
                        <TableRow>
                            <TableCell
                                colSpan={9}
                                align="center"
                                sx={{ py: 6 }}
                            >
                                <CircularProgress size={30} />

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                >
                                    Loading vendor items...
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : !items || items.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={9}
                                align="center"
                                sx={{ py: 6 }}
                            >
                                <Typography
                                    variant="body1"
                                    fontWeight={600}
                                >
                                    No vendor items found
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 0.5 }}
                                >
                                    Add a vendor item or change your search filters.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item, index) => {
                            const status = getStatus(item);

                            const itemCode = getField(
                                item,
                                "itemCode",
                                "ItemCode",
                                "—"
                            );

                            const itemName = getField(
                                item,
                                "itemName",
                                "ItemName",
                                "—"
                            );

                            const vendorName = getField(
                                item,
                                "vendorName",
                                "VendorName",
                                getField(
                                    item,
                                    "vendorId",
                                    "VendorId",
                                    "—"
                                )
                            );

                            const unitOfMeasure = getField(
                                item,
                                "unitOfMeasure",
                                "UnitOfMeasure",
                                "—"
                            );

                            const unitPrice = getField(
                                item,
                                "unitPrice",
                                "UnitPrice",
                                getField(
                                    item,
                                    "unitCost",
                                    "UnitCost",
                                    0
                                )
                            );

                            const taxRate = getField(
                                item,
                                "taxRate",
                                "TaxRate",
                                0
                            );

                            return (
                                <TableRow
                                    key={
                                        getField(
                                            item,
                                            "vendorItemMasterId",
                                            "VendorItemMasterId",
                                            getField(
                                                item,
                                                "vendorItemId",
                                                "VendorItemId",
                                                getField(
                                                    item,
                                                    "id",
                                                    "Id",
                                                    index
                                                )
                                            )
                                        )
                                    }
                                    hover
                                >
                                    {/* ROW NUMBER */}
                                    <TableCell>
                                        {index + 1}
                                    </TableCell>

                                    {/* ITEM CODE */}
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                        >
                                            {itemCode}
                                        </Typography>
                                    </TableCell>

                                    {/* ITEM NAME */}
                                    <TableCell>
                                        <Box sx={{ minWidth: 150 }}>
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                            >
                                                {itemName}
                                            </Typography>

                                            {getField(
                                                item,
                                                "description",
                                                "Description"
                                            ) && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{
                                                        display: "block",
                                                        maxWidth: 240,
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap"
                                                    }}
                                                >
                                                    {getField(
                                                        item,
                                                        "description",
                                                        "Description"
                                                    )}
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>

                                    {/* VENDOR */}
                                    <TableCell>
                                        {vendorName}
                                    </TableCell>

                                    {/* UNIT OF MEASURE */}
                                    <TableCell>
                                        {unitOfMeasure}
                                    </TableCell>

                                    {/* UNIT PRICE */}
                                    <TableCell align="right">
                                        {formatCurrency(unitPrice)}
                                    </TableCell>

                                    {/* TAX RATE */}
                                    <TableCell align="right">
                                        {Number.isFinite(Number(taxRate))
                                            ? `${Number(taxRate)}%`
                                            : "0%"}
                                    </TableCell>

                                    {/* STATUS */}
                                    <TableCell>
                                        <Chip
                                            label={status.label}
                                            color={status.color}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>

                                    {/* ACTIONS */}
                                    <TableCell align="center">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: 0.5
                                            }}
                                        >
                                            <Tooltip title="View item">
                                                <IconButton
                                                    size="small"
                                                    color="info"
                                                    aria-label="View vendor item"
                                                    onClick={() => {
                                                        if (onView) {
                                                            onView(item);
                                                        }
                                                    }}
                                                >
                                                    <Visibility fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Edit item">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    aria-label="Edit vendor item"
                                                    onClick={() => {
                                                        if (onEdit) {
                                                            onEdit(item);
                                                        }
                                                    }}
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Delete item">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    aria-label="Delete vendor item"
                                                    onClick={() => {
                                                        if (onDelete) {
                                                            onDelete(item);
                                                        }
                                                    }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
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

export default VendorItemMasterTable;

