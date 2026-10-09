import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Box,
    Grid,
    Paper,
    Chip,
    Divider,
    Stack
} from "@mui/material";

import {
    Close,
    Inventory2,
    Warehouse,
    Shelves,
    Category,
    Numbers,
    Edit,
    Visibility
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (object, ...keys) => {
    for (const key of keys) {
        if (
            object &&
            object[key] !== undefined &&
            object[key] !== null
        ) {
            return object[key];
        }
    }

    return null;
};

/* =========================================================
   FORMAT VALUE
========================================================= */

const formatValue = (value, fallback = "—") => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return fallback;
    }

    return String(value);
};

/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
};

/* =========================================================
   NORMALIZE STATUS
========================================================= */

const normalizeStatus = (status) => {
    return String(status || "")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ");
};

/* =========================================================
   GET STATUS COLOR
========================================================= */

const getStatusColor = (status) => {
    const normalized = normalizeStatus(status);

    if (
        normalized === "available" ||
        normalized === "in stock" ||
        normalized === "active"
    ) {
        return "success";
    }

    if (
        normalized === "low stock" ||
        normalized === "reserved" ||
        normalized === "pending"
    ) {
        return "warning";
    }

    if (
        normalized === "out of stock" ||
        normalized === "inactive" ||
        normalized === "unavailable"
    ) {
        return "error";
    }

    return "default";
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({
    label,
    value
}) => (
    <Box sx={{ minWidth: 0 }}>
        <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mb: 0.5 }}
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
            {formatValue(value)}
        </Typography>
    </Box>
);

/* =========================================================
   QUANTITY CARD
========================================================= */

const QuantityCard = ({
    label,
    value,
    unit
}) => (
    <Paper
        variant="outlined"
        sx={{
            p: 2,
            height: "100%",
            borderRadius: 2
        }}
    >
        <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
        >
            {label}
        </Typography>

        <Typography
            variant="h5"
            fontWeight={700}
        >
            {formatNumber(value)}
        </Typography>

        {unit && (
            <Typography
                variant="caption"
                color="text.secondary"
            >
                {unit}
            </Typography>
        )}
    </Paper>
);

/* =========================================================
   SHELFWISE INVENTORY DETAILS
========================================================= */

const ShelfwiseInventoryDetails = ({
    open = false,
    onClose,
    onEdit,

    inventory = null,
    record = null,
    data = null,

    loading = false
}) => {

    /* =====================================================
       NORMALIZE RECORD
    ===================================================== */

    const item = inventory || record || data || null;

    if (!open) {
        return null;
    }

    /* =====================================================
       NORMALIZE INVENTORY FIELDS
    ===================================================== */

    const inventoryId = getFieldValue(
        item,
        "shelfwiseInventoryId",
        "ShelfwiseInventoryId",
        "id",
        "Id"
    );

    const itemName = getFieldValue(
        item,
        "itemName",
        "ItemName"
    );

    const itemCode = getFieldValue(
        item,
        "itemCode",
        "ItemCode"
    );

    const itemId = getFieldValue(
        item,
        "itemId",
        "ItemId"
    );

    const warehouseName = getFieldValue(
        item,
        "warehouseName",
        "WarehouseName"
    );

    const warehouseCode = getFieldValue(
        item,
        "warehouseCode",
        "WarehouseCode"
    );

    const warehouseId = getFieldValue(
        item,
        "warehouseId",
        "WarehouseId"
    );

    const shelfName = getFieldValue(
        item,
        "shelfName",
        "ShelfName"
    );

    const shelfCode = getFieldValue(
        item,
        "shelfCode",
        "ShelfCode"
    );

    const shelfId = getFieldValue(
        item,
        "shelfId",
        "ShelfId"
    );

    const categoryName = getFieldValue(
        item,
        "categoryName",
        "CategoryName"
    );

    const quantity = getFieldValue(
        item,
        "quantity",
        "Quantity"
    );

    const availableQuantity = getFieldValue(
        item,
        "availableQuantity",
        "AvailableQuantity"
    );

    const reservedQuantity = getFieldValue(
        item,
        "reservedQuantity",
        "ReservedQuantity"
    );

    const minimumStock = getFieldValue(
        item,
        "minimumStock",
        "MinimumStock"
    );

    const maximumStock = getFieldValue(
        item,
        "maximumStock",
        "MaximumStock"
    );

    const unit = getFieldValue(
        item,
        "unit",
        "Unit"
    );

    const status = getFieldValue(
        item,
        "status",
        "Status"
    );

    const description = getFieldValue(
        item,
        "description",
        "Description"
    );

    const lastUpdated = getFieldValue(
        item,
        "lastUpdated",
        "LastUpdated",
        "updatedAt",
        "UpdatedAt"
    );

    const createdAt = getFieldValue(
        item,
        "createdAt",
        "CreatedAt"
    );

    /* =====================================================
       HANDLE CLOSE
    ===================================================== */

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    /* =====================================================
       HANDLE EDIT
    ===================================================== */

    const handleEdit = () => {
        if (onEdit && item) {
            onEdit(item);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            aria-labelledby="shelfwise-inventory-details-title"
            PaperProps={{
                sx: {
                    borderRadius: 2
                }
            }}
        >
            {/* HEADER */}

            <DialogTitle
                id="shelfwise-inventory-details-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    px: 3,
                    py: 2
                }}
            >
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            bgcolor: "primary.main",
                            color: "primary.contrastText"
                        }}
                    >
                        <Inventory2 />
                    </Box>

                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Inventory Details
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {formatValue(itemName, "Inventory record")}
                            {itemCode ? ` • ${itemCode}` : ""}
                        </Typography>
                    </Box>
                </Stack>

                <IconButton
                    onClick={handleClose}
                    aria-label="Close inventory details"
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <Divider />

            {/* CONTENT */}

            <DialogContent
                dividers
                sx={{ p: { xs: 2, sm: 3 } }}
            >
                {loading ? (
                    <Typography
                        color="text.secondary"
                        textAlign="center"
                        sx={{ py: 5 }}
                    >
                        Loading inventory details...
                    </Typography>
                ) : !item ? (
                    <Typography
                        color="text.secondary"
                        textAlign="center"
                        sx={{ py: 5 }}
                    >
                        No inventory record selected.
                    </Typography>
                ) : (
                    <Stack spacing={3}>

                        {/* STATUS AND IDENTIFIER */}

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: 1
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="overline"
                                    color="text.secondary"
                                >
                                    Inventory ID
                                </Typography>

                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                >
                                    {formatValue(inventoryId)}
                                </Typography>
                            </Box>

                            <Chip
                                label={formatValue(status, "Unknown")}
                                color={getStatusColor(status)}
                                variant="outlined"
                            />
                        </Box>

                        <Divider />

                        {/* QUANTITY SUMMARY */}

                        <Box>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                sx={{ mb: 2 }}
                            >
                                Stock Summary
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <QuantityCard
                                        label="Total Quantity"
                                        value={quantity}
                                        unit={unit}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <QuantityCard
                                        label="Available Quantity"
                                        value={availableQuantity}
                                        unit={unit}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <QuantityCard
                                        label="Reserved Quantity"
                                        value={reservedQuantity}
                                        unit={unit}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        {/* ITEM INFORMATION */}

                        <Box>
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 2 }}
                            >
                                <Category color="primary" />

                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                >
                                    Item Information
                                </Typography>
                            </Stack>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <DetailItem
                                        label="Item Name"
                                        value={itemName}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <DetailItem
                                        label="Item Code"
                                        value={itemCode}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <DetailItem
                                        label="Item ID"
                                        value={itemId}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <DetailItem
                                        label="Category"
                                        value={categoryName}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider />

                        {/* WAREHOUSE INFORMATION */}

                        <Box>
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 2 }}
                            >
                                <Warehouse color="primary" />

                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                >
                                    Warehouse Information
                                </Typography>
                            </Stack>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <DetailItem
                                        label="Warehouse Name"
                                        value={warehouseName}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <DetailItem
                                        label="Warehouse Code"
                                        value={warehouseCode}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <DetailItem
                                        label="Warehouse ID"
                                        value={warehouseId}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider />

                        {/* SHELF INFORMATION */}

                        <Box>
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 2 }}
                            >
                                <Inventory2 color="primary" />

                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                >
                                    Shelf Information
                                </Typography>
                            </Stack>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <DetailItem
                                        label="Shelf Name"
                                        value={shelfName}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <DetailItem
                                        label="Shelf Code"
                                        value={shelfCode}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <DetailItem
                                        label="Shelf ID"
                                        value={shelfId}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider />

                        {/* STOCK LEVELS */}

                        <Box>
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 2 }}
                            >
                                <Numbers color="primary" />

                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                >
                                    Stock Levels
                                </Typography>
                            </Stack>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <DetailItem
                                        label="Minimum Stock"
                                        value={
                                            minimumStock === null
                                                ? null
                                                : formatNumber(minimumStock)
                                        }
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <DetailItem
                                        label="Maximum Stock"
                                        value={
                                            maximumStock === null
                                                ? null
                                                : formatNumber(maximumStock)
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        {/* DESCRIPTION */}

                        {description && (
                            <>
                                <Divider />

                                <Box>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={700}
                                        sx={{ mb: 1 }}
                                    >
                                        Description
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ whiteSpace: "pre-wrap" }}
                                    >
                                        {description}
                                    </Typography>
                                </Box>
                            </>
                        )}

                        <Divider />

                        {/* AUDIT INFORMATION */}

                        <Box>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                sx={{ mb: 2 }}
                            >
                                Record Information
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <DetailItem
                                        label="Created At"
                                        value={formatDate(createdAt)}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <DetailItem
                                        label="Last Updated"
                                        value={formatDate(lastUpdated)}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Stack>
                )}
            </DialogContent>

            {/* ACTIONS */}

            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    gap: 1
                }}
            >
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleClose}
                >
                    Close
                </Button>

                {onEdit && item && (
                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={handleEdit}
                        disabled={loading}
                    >
                        Edit Inventory
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ShelfwiseInventoryDetails;

