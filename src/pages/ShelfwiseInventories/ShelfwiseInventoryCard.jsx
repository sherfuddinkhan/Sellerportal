import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Box,
    Typography,
    Chip,
    Divider,
    Grid,
    Button,
    IconButton,
    Tooltip,
    LinearProgress,
    Stack
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    Inventory2,
    Warehouse,
    Shelves,
    Category,
    Numbers,
    Event
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getField = (record, ...keys) => {
    for (const key of keys) {
        if (record?.[key] !== undefined && record?.[key] !== null) {
            return record[key];
        }
    }

    return "";
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
   FORMAT DATE
========================================================= */

const formatDate = (value) => {
    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

/* =========================================================
   NORMALIZE STATUS
========================================================= */

const normalizeStatus = (value, availableQuantity, minimumStock) => {
    const status = String(value || "").trim();

    if (status) {
        return status;
    }

    const available = Number(availableQuantity) || 0;
    const minimum = Number(minimumStock) || 0;

    if (available <= 0) {
        return "Out of Stock";
    }

    if (minimum > 0 && available <= minimum) {
        return "Low Stock";
    }

    return "Available";
};

/* =========================================================
   STATUS COLOR
========================================================= */

const getStatusColor = (status) => {
    const normalized = String(status).toLowerCase();

    if (
        normalized.includes("out of stock") ||
        normalized.includes("inactive")
    ) {
        return "error";
    }

    if (
        normalized.includes("low stock") ||
        normalized.includes("pending")
    ) {
        return "warning";
    }

    if (
        normalized.includes("reserved") ||
        normalized.includes("hold")
    ) {
        return "info";
    }

    if (
        normalized.includes("available") ||
        normalized.includes("active")
    ) {
        return "success";
    }

    return "default";
};

/* =========================================================
   INVENTORY CARD
========================================================= */

const ShelfwiseInventoryCard = ({
    inventory,
    record,
    data,

    onView,
    onEdit,
    onDelete,

    loading = false,
    disabled = false
}) => {
    const item = inventory || record || data || {};

    const inventoryId = getField(
        item,
        "shelfwiseInventoryId",
        "ShelfwiseInventoryId",
        "inventoryId",
        "InventoryId",
        "id",
        "Id"
    );

    const itemName = getField(
        item,
        "itemName",
        "ItemName",
        "productName",
        "ProductName"
    ) || "Unnamed Item";

    const itemCode = getField(
        item,
        "itemCode",
        "ItemCode",
        "productCode",
        "ProductCode"
    ) || "N/A";

    const shelfName = getField(
        item,
        "shelfName",
        "ShelfName"
    ) || "N/A";

    const shelfCode = getField(
        item,
        "shelfCode",
        "ShelfCode"
    ) || "N/A";

    const warehouseName = getField(
        item,
        "warehouseName",
        "WarehouseName"
    ) || "N/A";

    const categoryName = getField(
        item,
        "categoryName",
        "CategoryName"
    ) || "N/A";

    const quantity = Number(
        getField(item, "quantity", "Quantity")
    ) || 0;

    const availableQuantity = Number(
        getField(
            item,
            "availableQuantity",
            "AvailableQuantity"
        )
    ) || 0;

    const reservedQuantity = Number(
        getField(
            item,
            "reservedQuantity",
            "ReservedQuantity"
        )
    ) || 0;

    const minimumStock = Number(
        getField(item, "minimumStock", "MinimumStock")
    ) || 0;

    const maximumStock = Number(
        getField(item, "maximumStock", "MaximumStock")
    ) || 0;

    const unit = getField(
        item,
        "unit",
        "Unit",
        "unitName",
        "UnitName"
    ) || "units";

    const description = getField(
        item,
        "description",
        "Description"
    );

    const lastUpdated = getField(
        item,
        "lastUpdated",
        "LastUpdated",
        "updatedAt",
        "UpdatedAt"
    );

    const status = normalizeStatus(
        getField(item, "status", "Status"),
        availableQuantity,
        minimumStock
    );

    const stockPercentage =
        quantity > 0
            ? Math.min(
                100,
                Math.max(0, (availableQuantity / quantity) * 100)
            )
            : 0;

    const actionsDisabled = loading || disabled;

    /* =====================================================
       ACTION HANDLERS
    ===================================================== */

    const handleView = () => {
        if (typeof onView === "function") {
            onView(item);
        }
    };

    const handleEdit = () => {
        if (typeof onEdit === "function") {
            onEdit(item);
        }
    };

    const handleDelete = () => {
        if (typeof onDelete === "function") {
            onDelete(item);
        }
    };

    return (
        <Card
            elevation={2}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                transition: "all 0.2s ease",
                overflow: "hidden",

                "&:hover": {
                    elevation: 6,
                    borderColor: "primary.main",
                    transform: "translateY(-3px)"
                }
            }}
        >
            {loading && <LinearProgress />}

            {/* =================================================
                CARD HEADER
            ================================================= */}

            <Box
                sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 1,
                    bgcolor: "action.hover"
                }}
            >
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ minWidth: 0, flex: 1 }}
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
                            color: "primary.contrastText",
                            flexShrink: 0
                        }}
                    >
                        <Inventory2 />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            noWrap
                            title={String(itemName)}
                        >
                            {itemName}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                        >
                            Code: {itemCode}
                        </Typography>
                    </Box>
                </Stack>

                <Chip
                    label={status}
                    color={getStatusColor(status)}
                    size="small"
                    variant="outlined"
                    sx={{
                        maxWidth: 130,
                        flexShrink: 0,
                        "& .MuiChip-label": {
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }
                    }}
                />
            </Box>

            <Divider />

            {/* =================================================
                CARD CONTENT
            ================================================= */}

            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Stack spacing={2}>
                    {/* Warehouse and shelf */}

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="flex-start"
                            >
                                <Warehouse
                                    color="action"
                                    fontSize="small"
                                    sx={{ mt: 0.25 }}
                                />

                                <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Warehouse
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        sx={{
                                            overflowWrap: "anywhere"
                                        }}
                                    >
                                        {warehouseName}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Grid>

                        <Grid item xs={6}>
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="flex-start"
                            >
                                <Shelves
                                    color="action"
                                    fontSize="small"
                                    sx={{ mt: 0.25 }}
                                />

                                <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Shelf
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        sx={{
                                            overflowWrap: "anywhere"
                                        }}
                                    >
                                        {shelfName}
                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {shelfCode}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* Category */}

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <Category
                            color="action"
                            fontSize="small"
                        />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Category:
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{
                                overflowWrap: "anywhere"
                            }}
                        >
                            {categoryName}
                        </Typography>
                    </Stack>

                    <Divider />

                    {/* Quantity summary */}

                    <Grid container spacing={1.5}>
                        <Grid item xs={4}>
                            <Box
                                sx={{
                                    p: 1.25,
                                    borderRadius: 2,
                                    bgcolor: "action.hover",
                                    textAlign: "center",
                                    height: "100%"
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Total
                                </Typography>

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    {formatNumber(quantity)}
                                </Typography>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {unit}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={4}>
                            <Box
                                sx={{
                                    p: 1.25,
                                    borderRadius: 2,
                                    bgcolor: "success.main",
                                    color: "success.contrastText",
                                    textAlign: "center",
                                    height: "100%"
                                }}
                            >
                                <Typography
                                    variant="caption"
                                >
                                    Available
                                </Typography>

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    {formatNumber(availableQuantity)}
                                </Typography>

                                <Typography
                                    variant="caption"
                                >
                                    {unit}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={4}>
                            <Box
                                sx={{
                                    p: 1.25,
                                    borderRadius: 2,
                                    bgcolor: "info.main",
                                    color: "info.contrastText",
                                    textAlign: "center",
                                    height: "100%"
                                }}
                            >
                                <Typography
                                    variant="caption"
                                >
                                    Reserved
                                </Typography>

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    {formatNumber(reservedQuantity)}
                                </Typography>

                                <Typography
                                    variant="caption"
                                >
                                    {unit}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Availability progress */}

                    <Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 0.75
                            }}
                        >
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Available stock
                            </Typography>

                            <Typography
                                variant="caption"
                                fontWeight={600}
                            >
                                {stockPercentage.toFixed(0)}%
                            </Typography>
                        </Box>

                        <LinearProgress
                            variant="determinate"
                            value={stockPercentage}
                            color={
                                availableQuantity <= 0
                                    ? "error"
                                    : minimumStock > 0 &&
                                      availableQuantity <= minimumStock
                                        ? "warning"
                                        : "success"
                            }
                            sx={{
                                height: 7,
                                borderRadius: 5
                            }}
                        />
                    </Box>

                    {/* Minimum and maximum stock */}

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Minimum Stock
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={600}
                            >
                                {formatNumber(minimumStock)} {unit}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Maximum Stock
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={600}
                            >
                                {formatNumber(maximumStock)} {unit}
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Description */}

                    {description && (
                        <Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Description
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    overflowWrap: "anywhere",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden"
                                }}
                            >
                                {description}
                            </Typography>
                        </Box>
                    )}

                    {/* Last updated */}

                    {lastUpdated && (
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                        >
                            <Event
                                fontSize="small"
                                color="action"
                            />

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Updated: {formatDate(lastUpdated)}
                            </Typography>
                        </Stack>
                    )}

                    {inventoryId !== "" && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Inventory ID: {String(inventoryId)}
                        </Typography>
                    )}
                </Stack>
            </CardContent>

            <Divider />

            {/* =================================================
                CARD ACTIONS
            ================================================= */}

            <CardActions
                sx={{
                    p: 1.5,
                    justifyContent: "space-between",
                    gap: 1
                }}
            >
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={handleView}
                    disabled={actionsDisabled || !onView}
                >
                    View
                </Button>

                <Box>
                    <Tooltip title="Edit inventory">
                        <span>
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={handleEdit}
                                disabled={actionsDisabled || !onEdit}
                                aria-label="Edit inventory"
                            >
                                <Edit fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Delete inventory">
                        <span>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={handleDelete}
                                disabled={actionsDisabled || !onDelete}
                                aria-label="Delete inventory"
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Box>
            </CardActions>
        </Card>
    );
};

export default ShelfwiseInventoryCard;

