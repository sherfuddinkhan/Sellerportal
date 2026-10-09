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
    Typography,
    Box,
    Chip,
    CircularProgress,
    Stack
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    Inventory2,
    Warehouse,
    Layers
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (record, ...keys) => {
    for (const key of keys) {
        const value = record?.[key];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return "";
};

/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
    if (value === "" || value === null || value === undefined) {
        return "0";
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return String(value);
    }

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
};

/* =========================================================
   GET INVENTORY STATUS
========================================================= */

const getStockStatus = (record) => {
    const explicitStatus = getFieldValue(record, "status", "Status");

    if (explicitStatus !== "") {
        const normalized = String(explicitStatus).toLowerCase();

        if (
            normalized.includes("inactive") ||
            normalized.includes("disabled")
        ) {
            return {
                label: String(explicitStatus),
                color: "default"
            };
        }

        if (
            normalized.includes("out of stock") ||
            normalized.includes("out-of-stock")
        ) {
            return {
                label: String(explicitStatus),
                color: "error"
            };
        }

        if (
            normalized.includes("low") ||
            normalized.includes("below")
        ) {
            return {
                label: String(explicitStatus),
                color: "warning"
            };
        }

        if (
            normalized.includes("active") ||
            normalized.includes("available") ||
            normalized.includes("in stock")
        ) {
            return {
                label: String(explicitStatus),
                color: "success"
            };
        }

        return {
            label: String(explicitStatus),
            color: "info"
        };
    }

    const isActive = getFieldValue(record, "isActive", "IsActive");

    if (isActive === false) {
        return {
            label: "Inactive",
            color: "default"
        };
    }

    const quantity = Number(
        getFieldValue(
            record,
            "quantity",
            "Quantity",
            "stockQuantity",
            "StockQuantity"
        ) || 0
    );

    const minimumStock = Number(
        getFieldValue(
            record,
            "minimumStock",
            "MinimumStock",
            "minStock",
            "MinStock"
        ) || 0
    );

    if (quantity <= 0) {
        return {
            label: "Out of Stock",
            color: "error"
        };
    }

    if (minimumStock > 0 && quantity <= minimumStock) {
        return {
            label: "Low Stock",
            color: "warning"
        };
    }

    return {
        label: "In Stock",
        color: "success"
    };
};

/* =========================================================
   SHELFWISE INVENTORY TABLE
========================================================= */

const ShelfwiseInventoryTable = ({
    inventory = [],
    data,
    loading = false,
    onView,
    onEdit,
    onDelete
}) => {
    const rows = Array.isArray(data)
        ? data
        : Array.isArray(inventory)
            ? inventory
            : [];

    /* =====================================================
       RENDER LOADING STATE
    ===================================================== */

    if (loading) {
        return (
            <Paper
                variant="outlined"
                sx={{
                    p: 5,
                    borderRadius: 3,
                    textAlign: "center"
                }}
            >
                <CircularProgress size={36} />

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    Loading shelf-wise inventory...
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
            elevation={1}
            sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                overflowX: "auto"
            }}
        >
            <Table
                stickyHeader
                size="medium"
                aria-label="Shelf-wise inventory table"
            >
                {/* TABLE HEADER */}

                <TableHead>
                    <TableRow>
                        <TableCell
                            sx={{
                                fontWeight: 700,
                                minWidth: 90
                            }}
                        >
                            ID
                        </TableCell>

                        <TableCell
                            sx={{
                                fontWeight: 700,
                                minWidth: 170
                            }}
                        >
                            Item
                        </TableCell>

                        <TableCell
                            sx={{
                                fontWeight: 700,
                                minWidth: 130
                            }}
                        >
                            Item Code
                        </TableCell>

                        <TableCell
                            sx={{
                                fontWeight: 700,
                                minWidth: 150
                            }}
                        >
                            Warehouse
                        </TableCell>

                        <TableCell
                            sx={{
                                fontWeight: 700,
                                minWidth: 130
                            }}
                        >
                            Shelf
                        </TableCell>

                        <TableCell
                            align="right"
                            sx={{
                                fontWeight: 700,
                                minWidth: 110
                            }}
                        >
                            Quantity
                        </TableCell>

                        <TableCell
                            align="right"
                            sx={{
                                fontWeight: 700,
                                minWidth: 110
                            }}
                        >
                            Available
                        </TableCell>

                        <TableCell
                            align="right"
                            sx={{
                                fontWeight: 700,
                                minWidth: 100
                            }}
                        >
                            Reserved
                        </TableCell>

                        <TableCell
                            sx={{
                                fontWeight: 700,
                                minWidth: 120
                            }}
                        >
                            Status
                        </TableCell>

                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 700,
                                minWidth: 130
                            }}
                        >
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>

                {/* TABLE BODY */}

                <TableBody>
                    {rows.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={10}
                                align="center"
                                sx={{ py: 6 }}
                            >
                                <Inventory2
                                    sx={{
                                        fontSize: 44,
                                        color: "text.disabled",
                                        mb: 1
                                    }}
                                />

                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                >
                                    No inventory records found
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Shelf-wise inventory records will appear here.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((row, index) => {
                            const id = getFieldValue(
                                row,
                                "shelfwiseInventoryId",
                                "ShelfwiseInventoryId",
                                "id",
                                "Id"
                            );

                            const itemName = getFieldValue(
                                row,
                                "itemName",
                                "ItemName",
                                "productName",
                                "ProductName"
                            );

                            const itemCode = getFieldValue(
                                row,
                                "itemCode",
                                "ItemCode",
                                "productCode",
                                "ProductCode"
                            );

                            const warehouseName = getFieldValue(
                                row,
                                "warehouseName",
                                "WarehouseName"
                            );

                            const shelfName = getFieldValue(
                                row,
                                "shelfName",
                                "ShelfName"
                            );

                            const shelfCode = getFieldValue(
                                row,
                                "shelfCode",
                                "ShelfCode"
                            );

                            const quantity = getFieldValue(
                                row,
                                "quantity",
                                "Quantity",
                                "stockQuantity",
                                "StockQuantity"
                            );

                            const availableQuantity = getFieldValue(
                                row,
                                "availableQuantity",
                                "AvailableQuantity"
                            );

                            const reservedQuantity = getFieldValue(
                                row,
                                "reservedQuantity",
                                "ReservedQuantity"
                            );

                            const stockStatus = getStockStatus(row);

                            return (
                                <TableRow
                                    key={id !== "" ? id : index}
                                    hover
                                    sx={{
                                        "&:last-child td": {
                                            borderBottom: 0
                                        }
                                    }}
                                >
                                    {/* ID */}

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                        >
                                            {id !== "" ? id : "—"}
                                        </Typography>
                                    </TableCell>

                                    {/* ITEM */}

                                    <TableCell>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                        >
                                            <Box
                                                sx={{
                                                    width: 34,
                                                    height: 34,
                                                    borderRadius: 1.5,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    bgcolor: "action.hover",
                                                    color: "primary.main",
                                                    flexShrink: 0
                                                }}
                                            >
                                                <Inventory2 fontSize="small" />
                                            </Box>

                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={600}
                                                    sx={{
                                                        overflowWrap: "anywhere"
                                                    }}
                                                >
                                                    {itemName || "—"}
                                                </Typography>

                                                {getFieldValue(
                                                    row,
                                                    "categoryName",
                                                    "CategoryName"
                                                ) && (
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {getFieldValue(
                                                            row,
                                                            "categoryName",
                                                            "CategoryName"
                                                        )}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Stack>
                                    </TableCell>

                                    {/* ITEM CODE */}

                                    <TableCell>
                                        <Typography variant="body2">
                                            {itemCode || "—"}
                                        </Typography>
                                    </TableCell>

                                    {/* WAREHOUSE */}

                                    <TableCell>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                        >
                                            <Warehouse
                                                fontSize="small"
                                                color="action"
                                            />

                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        overflowWrap: "anywhere"
                                                    }}
                                                >
                                                    {warehouseName || "—"}
                                                </Typography>

                                                {getFieldValue(
                                                    row,
                                                    "warehouseCode",
                                                    "WarehouseCode"
                                                ) && (
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {getFieldValue(
                                                            row,
                                                            "warehouseCode",
                                                            "WarehouseCode"
                                                        )}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Stack>
                                    </TableCell>

                                    {/* SHELF */}

                                    <TableCell>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                        >
                                            <Layers
                                                fontSize="small"
                                                color="action"
                                            />

                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={600}
                                                    sx={{
                                                        overflowWrap: "anywhere"
                                                    }}
                                                >
                                                    {shelfName || "—"}
                                                </Typography>

                                                {shelfCode && (
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {shelfCode}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Stack>
                                    </TableCell>

                                    {/* QUANTITY */}

                                    <TableCell align="right">
                                        <Typography
                                            variant="body2"
                                            fontWeight={700}
                                        >
                                            {formatNumber(quantity)}
                                        </Typography>
                                    </TableCell>

                                    {/* AVAILABLE */}

                                    <TableCell align="right">
                                        <Typography
                                            variant="body2"
                                            color="success.main"
                                            fontWeight={600}
                                        >
                                            {formatNumber(
                                                availableQuantity !== ""
                                                    ? availableQuantity
                                                    : quantity
                                            )}
                                        </Typography>
                                    </TableCell>

                                    {/* RESERVED */}

                                    <TableCell align="right">
                                        <Typography
                                            variant="body2"
                                            color="warning.main"
                                        >
                                            {formatNumber(reservedQuantity)}
                                        </Typography>
                                    </TableCell>

                                    {/* STATUS */}

                                    <TableCell>
                                        <Chip
                                            label={stockStatus.label}
                                            color={stockStatus.color}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>

                                    {/* ACTIONS */}

                                    <TableCell align="center">
                                        <Stack
                                            direction="row"
                                            spacing={0.5}
                                            justifyContent="center"
                                        >
                                            <Tooltip title="View inventory">
                                                <IconButton
                                                    size="small"
                                                    color="info"
                                                    aria-label="View inventory"
                                                    onClick={() =>
                                                        onView?.(row)
                                                    }
                                                >
                                                    <Visibility fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Edit inventory">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    aria-label="Edit inventory"
                                                    onClick={() =>
                                                        onEdit?.(row)
                                                    }
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Delete inventory">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    aria-label="Delete inventory"
                                                    onClick={() =>
                                                        onDelete?.(id, row)
                                                    }
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
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

export default ShelfwiseInventoryTable;

