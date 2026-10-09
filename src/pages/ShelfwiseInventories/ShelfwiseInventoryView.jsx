import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    Divider,
    Chip,
    Paper,
    Stack
} from "@mui/material";

import {
    Close,
    Inventory2,
    Store,
    Warehouse,
    Layers,
    Category,
    Numbers,
    CalendarMonth
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
    const number = Number(value);

    if (value === "" || value === null || value === undefined) {
        return "0";
    }

    if (!Number.isFinite(number)) {
        return String(value);
    }

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
};

/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({
    label,
    value,
    icon,
    fullWidth = false
}) => (
    <Grid
        item
        xs={12}
        sm={fullWidth ? 12 : 6}
    >
        <Box
            sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                p: 1.5,
                height: "100%",
                borderRadius: 2,
                bgcolor: "background.default",
                border: "1px solid",
                borderColor: "divider"
            }}
        >
            {icon && (
                <Box
                    sx={{
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        mt: 0.25
                    }}
                >
                    {icon}
                </Box>
            )}

            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                >
                    {label}
                </Typography>

                <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                        overflowWrap: "anywhere",
                        whiteSpace: "pre-wrap"
                    }}
                >
                    {value === "" ? "—" : String(value)}
                </Typography>
            </Box>
        </Box>
    </Grid>
);

/* =========================================================
   SHELFWISE INVENTORY VIEW
========================================================= */

const ShelfwiseInventoryView = ({
    open,
    onClose,
    inventory,
    record,
    data
}) => {
    const selectedRecord = inventory ?? record ?? data ?? {};

    /* =====================================================
       INVENTORY FIELDS
    ===================================================== */

    const inventoryId = getFieldValue(
        selectedRecord,
        "shelfwiseInventoryId",
        "ShelfwiseInventoryId",
        "id",
        "Id"
    );

    const shelfName = getFieldValue(
        selectedRecord,
        "shelfName",
        "ShelfName"
    );

    const shelfCode = getFieldValue(
        selectedRecord,
        "shelfCode",
        "ShelfCode"
    );

    const itemName = getFieldValue(
        selectedRecord,
        "itemName",
        "ItemName",
        "productName",
        "ProductName"
    );

    const itemCode = getFieldValue(
        selectedRecord,
        "itemCode",
        "ItemCode",
        "productCode",
        "ProductCode"
    );

    const warehouseName = getFieldValue(
        selectedRecord,
        "warehouseName",
        "WarehouseName"
    );

    const warehouseCode = getFieldValue(
        selectedRecord,
        "warehouseCode",
        "WarehouseCode"
    );

    const categoryName = getFieldValue(
        selectedRecord,
        "categoryName",
        "CategoryName"
    );

    const quantity = getFieldValue(
        selectedRecord,
        "quantity",
        "Quantity",
        "stockQuantity",
        "StockQuantity"
    );

    const availableQuantity = getFieldValue(
        selectedRecord,
        "availableQuantity",
        "AvailableQuantity"
    );

    const reservedQuantity = getFieldValue(
        selectedRecord,
        "reservedQuantity",
        "ReservedQuantity"
    );

    const minimumStock = getFieldValue(
        selectedRecord,
        "minimumStock",
        "MinimumStock",
        "minStock",
        "MinStock"
    );

    const maximumStock = getFieldValue(
        selectedRecord,
        "maximumStock",
        "MaximumStock",
        "maxStock",
        "MaxStock"
    );

    const unit = getFieldValue(
        selectedRecord,
        "unit",
        "Unit",
        "unitName",
        "UnitName"
    );

    const status = getFieldValue(
        selectedRecord,
        "status",
        "Status"
    );

    const lastUpdated = getFieldValue(
        selectedRecord,
        "lastUpdated",
        "LastUpdated",
        "updatedAt",
        "UpdatedAt"
    );

    const createdAt = getFieldValue(
        selectedRecord,
        "createdAt",
        "CreatedAt",
        "createdDate",
        "CreatedDate"
    );

    const description = getFieldValue(
        selectedRecord,
        "description",
        "Description",
        "remarks",
        "Remarks"
    );

    const isActive = getFieldValue(
        selectedRecord,
        "isActive",
        "IsActive"
    );

    const formattedDate = (value) => {
        if (!value) return "—";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        });
    };

    const statusLabel =
        status !== ""
            ? String(status)
            : isActive === true
                ? "Active"
                : isActive === false
                    ? "Inactive"
                    : "Not specified";

    const statusColor =
        /inactive|disabled|closed/i.test(statusLabel)
            ? "default"
            : /active|available|in stock/i.test(statusLabel)
                ? "success"
                : "info";

    /* =====================================================
       RENDER DIALOG
    ===================================================== */

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
            aria-labelledby="shelfwise-inventory-view-title"
        >
            <DialogTitle
                id="shelfwise-inventory-view-title"
                sx={{ pb: 2 }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                >
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "primary.main",
                            color: "primary.contrastText"
                        }}
                    >
                        <Inventory2 />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Shelf-wise Inventory Details
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            View shelf location and stock information
                        </Typography>
                    </Box>

                    <Chip
                        label={statusLabel}
                        color={statusColor}
                        size="small"
                    />
                </Stack>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
                {/* INVENTORY SUMMARY */}

                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 3
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        gutterBottom
                    >
                        Stock Summary
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ p: 1 }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Total Quantity
                                </Typography>

                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                >
                                    {formatNumber(quantity)}
                                </Typography>

                                {unit && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {unit}
                                    </Typography>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Box sx={{ p: 1 }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Available Quantity
                                </Typography>

                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    color="success.main"
                                >
                                    {formatNumber(
                                        availableQuantity !== ""
                                            ? availableQuantity
                                            : quantity
                                    )}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Box sx={{ p: 1 }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Reserved Quantity
                                </Typography>

                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    color="warning.main"
                                >
                                    {formatNumber(reservedQuantity)}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* SHELF INFORMATION */}

                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 1.5 }}
                >
                    Shelf Information
                </Typography>

                <Grid container spacing={1.5} sx={{ mb: 3 }}>
                    <DetailItem
                        label="Inventory ID"
                        value={inventoryId}
                        icon={<Numbers fontSize="small" />}
                    />

                    <DetailItem
                        label="Shelf Name"
                        value={shelfName}
                        icon={<Layers fontSize="small" />}
                    />

                    <DetailItem
                        label="Shelf Code"
                        value={shelfCode}
                        icon={<Inventory2 fontSize="small" />}
                    />

                    <DetailItem
                        label="Warehouse"
                        value={warehouseName}
                        icon={<Warehouse fontSize="small" />}
                    />

                    <DetailItem
                        label="Warehouse Code"
                        value={warehouseCode}
                    />
                </Grid>

                {/* ITEM INFORMATION */}

                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 1.5 }}
                >
                    Item Information
                </Typography>

                <Grid container spacing={1.5} sx={{ mb: 3 }}>
                    <DetailItem
                        label="Item Name"
                        value={itemName}
                        icon={<Category fontSize="small" />}
                    />

                    <DetailItem
                        label="Item Code"
                        value={itemCode}
                        icon={<Inventory2 fontSize="small" />}
                    />

                    <DetailItem
                        label="Category"
                        value={categoryName}
                    />

                    <DetailItem
                        label="Unit"
                        value={unit}
                    />
                </Grid>

                {/* STOCK LEVELS */}

                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 1.5 }}
                >
                    Stock Levels
                </Typography>

                <Grid container spacing={1.5} sx={{ mb: 3 }}>
                    <DetailItem
                        label="Minimum Stock"
                        value={formatNumber(minimumStock)}
                    />

                    <DetailItem
                        label="Maximum Stock"
                        value={formatNumber(maximumStock)}
                    />
                </Grid>

                {/* AUDIT INFORMATION */}

                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 1.5 }}
                >
                    Additional Information
                </Typography>

                <Grid container spacing={1.5}>
                    <DetailItem
                        label="Created At"
                        value={formattedDate(createdAt)}
                        icon={<CalendarMonth fontSize="small" />}
                    />

                    <DetailItem
                        label="Last Updated"
                        value={formattedDate(lastUpdated)}
                        icon={<CalendarMonth fontSize="small" />}
                    />

                    <DetailItem
                        label="Description / Remarks"
                        value={description}
                        fullWidth
                    />
                </Grid>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<Close />}
                    onClick={onClose}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShelfwiseInventoryView;
