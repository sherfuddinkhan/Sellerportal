import React from "react";

import {
    Box,
    Card,
    CardContent,
    CardActions,
    Chip,
    Divider,
    IconButton,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    Inventory2,
    Assignment,
    Warehouse,
    CalendarMonth,
    ShoppingCart,
    MoreHoriz
} from "@mui/icons-material";

/* =========================================================
   GET VALUE FROM MULTIPLE POSSIBLE FIELD NAMES
========================================================= */

const getValue = (object, fields, fallback = "") => {
    if (!object || typeof object !== "object") {
        return fallback;
    }

    for (const field of fields) {
        const value = object[field];

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }
    }

    return fallback;
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

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
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
    const value = String(status || "Pending")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ");

    if (
        ["completed", "complete", "picked", "closed"].includes(value)
    ) {
        return "Completed";
    }

    if (
        [
            "in progress",
            "processing",
            "assigned",
            "started"
        ].includes(value)
    ) {
        return "In Progress";
    }

    if (
        ["cancelled", "canceled"].includes(value)
    ) {
        return "Cancelled";
    }

    if (
        ["pending", "created", "new"].includes(value)
    ) {
        return "Pending";
    }

    return status || "Pending";
};

/* =========================================================
   STATUS CHIP CONFIGURATION
========================================================= */

const getStatusColor = (status) => {
    switch (normalizeStatus(status)) {
        case "Completed":
            return "success";

        case "In Progress":
            return "info";

        case "Cancelled":
            return "error";

        case "Pending":
        default:
            return "warning";
    }
};

/* =========================================================
   PICKLIST CARD
========================================================= */

const PicklistCard = ({
    picklist,
    onView,
    onEdit,
    onDelete,
    onClick,
    loading = false,
    showActions = true,
    showViewAction = true,
    showEditAction = true,
    showDeleteAction = true,
    compact = false
}) => {
    if (!picklist || typeof picklist !== "object") {
        return null;
    }

    /* =====================================================
       PICKLIST FIELDS
    ===================================================== */

    const picklistId = getValue(
        picklist,
        [
            "picklistId",
            "PicklistId",
            "pickListId",
            "PickListId",
            "id",
            "Id"
        ],
        ""
    );

    const picklistNumber = getValue(
        picklist,
        [
            "picklistNumber",
            "PicklistNumber",
            "pickListNumber",
            "PickListNumber",
            "picklistNo",
            "PicklistNo",
            "number",
            "Number"
        ],
        picklistId !== ""
            ? `Picklist #${picklistId}`
            : "Picklist"
    );

    const orderNumber = getValue(
        picklist,
        [
            "orderNumber",
            "OrderNumber",
            "salesOrderNumber",
            "SalesOrderNumber",
            "orderNo",
            "OrderNo"
        ],
        ""
    );

    const orderId = getValue(
        picklist,
        [
            "orderId",
            "OrderId",
            "salesOrderId",
            "SalesOrderId"
        ],
        ""
    );

    const warehouseName = getValue(
        picklist,
        [
            "warehouseName",
            "WarehouseName",
            "warehouse",
            "Warehouse",
            "locationName",
            "LocationName"
        ],
        ""
    );

    const warehouseId = getValue(
        picklist,
        [
            "warehouseId",
            "WarehouseId",
            "locationId",
            "LocationId"
        ],
        ""
    );

    const status = normalizeStatus(
        getValue(
            picklist,
            [
                "status",
                "Status",
                "picklistStatus",
                "PicklistStatus"
            ],
            "Pending"
        )
    );

    const picklistDate = getValue(
        picklist,
        [
            "picklistDate",
            "PicklistDate",
            "createdDate",
            "CreatedDate",
            "createdAt",
            "CreatedAt",
            "date",
            "Date"
        ],
        ""
    );

    const items = getValue(
        picklist,
        [
            "items",
            "Items",
            "picklistItems",
            "PicklistItems",
            "pickListItems",
            "PickListItems",
            "details",
            "Details"
        ],
        []
    );

    const itemCount = getValue(
        picklist,
        [
            "totalItems",
            "TotalItems",
            "itemCount",
            "ItemCount"
        ],
        Array.isArray(items) ? items.length : 0
    );

    const totalQuantity = getValue(
        picklist,
        [
            "totalQuantity",
            "TotalQuantity",
            "totalPickedQuantity",
            "TotalPickedQuantity"
        ],
        Array.isArray(items)
            ? items.reduce((total, item) => {
                const quantity = Number(
                    getValue(
                        item,
                        [
                            "quantity",
                            "Quantity",
                            "requestedQuantity",
                            "RequestedQuantity",
                            "pickQuantity",
                            "PickQuantity"
                        ],
                        0
                    )
                );

                return total + (
                    Number.isFinite(quantity) ? quantity : 0
                );
            }, 0)
            : 0
    );

    /* =====================================================
       ACTION HANDLERS
    ===================================================== */

    const handleView = (event) => {
        event.stopPropagation();

        if (typeof onView === "function") {
            onView(picklist);
        }
    };

    const handleEdit = (event) => {
        event.stopPropagation();

        if (typeof onEdit === "function") {
            onEdit(picklist);
        }
    };

    const handleDelete = (event) => {
        event.stopPropagation();

        if (typeof onDelete === "function") {
            onDelete(picklist);
        }
    };

    const handleCardClick = () => {
        if (typeof onClick === "function") {
            onClick(picklist);
        }
    };

    /* =====================================================
       RENDER CARD
    ===================================================== */

    return (
        <Card
            variant="outlined"
            onClick={handleCardClick}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
                cursor: onClick ? "pointer" : "default",
                "&:hover": {
                    boxShadow: onClick ? 3 : 1,
                    transform: onClick ? "translateY(-2px)" : "none"
                },
                opacity: loading ? 0.65 : 1,
                pointerEvents: loading ? "none" : "auto"
            }}
        >
            <CardContent
                sx={{
                    p: compact ? 2 : 2.5,
                    flexGrow: 1
                }}
            >
                {/* HEADER */}

                <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    spacing={1}
                    sx={{ mb: 2 }}
                >
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{ minWidth: 0 }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 44,
                                height: 44,
                                flexShrink: 0,
                                borderRadius: 2,
                                bgcolor: "action.hover",
                                color: "primary.main"
                            }}
                        >
                            <Inventory2 />
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                sx={{
                                    overflowWrap: "anywhere"
                                }}
                            >
                                {String(picklistNumber)}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                ID: {picklistId !== ""
                                    ? String(picklistId)
                                    : "—"}
                            </Typography>
                        </Box>
                    </Stack>

                    <Chip
                        size="small"
                        label={status}
                        color={getStatusColor(status)}
                        variant="outlined"
                        sx={{
                            flexShrink: 0,
                            fontWeight: 600
                        }}
                    />
                </Stack>

                <Divider sx={{ mb: 2 }} />

                {/* ORDER */}

                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                    sx={{ mb: 2 }}
                >
                    <Assignment
                        fontSize="small"
                        color="action"
                        sx={{ mt: 0.25 }}
                    />

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                        >
                            Sales Order
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ overflowWrap: "anywhere" }}
                        >
                            {orderNumber ||
                                (orderId !== ""
                                    ? `Order #${orderId}`
                                    : "—")}
                        </Typography>
                    </Box>
                </Stack>

                {/* WAREHOUSE */}

                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                    sx={{ mb: 2 }}
                >
                    <Warehouse
                        fontSize="small"
                        color="action"
                        sx={{ mt: 0.25 }}
                    />

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                        >
                            Warehouse
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ overflowWrap: "anywhere" }}
                        >
                            {warehouseName ||
                                (warehouseId !== ""
                                    ? `Warehouse #${warehouseId}`
                                    : "—")}
                        </Typography>
                    </Box>
                </Stack>

                {/* DATE */}

                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                    sx={{ mb: 2 }}
                >
                    <CalendarMonth
                        fontSize="small"
                        color="action"
                        sx={{ mt: 0.25 }}
                    />

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                        >
                            Picklist Date
                        </Typography>

                        <Typography variant="body2" fontWeight={600}>
                            {formatDate(picklistDate)}
                        </Typography>
                    </Box>
                </Stack>

                {/* ITEM SUMMARY */}

                <Paper
                    variant="outlined"
                    sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "action.hover"
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                        >
                            <ShoppingCart
                                fontSize="small"
                                color="action"
                            />

                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                >
                                    Items
                                </Typography>

                                <Typography
                                    variant="body2"
                                    fontWeight={700}
                                >
                                    {formatNumber(itemCount)}
                                </Typography>
                            </Box>
                        </Stack>

                        <Divider
                            orientation="vertical"
                            flexItem
                        />

                        <Box sx={{ textAlign: "right" }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                            >
                                Total Quantity
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={700}
                            >
                                {formatNumber(totalQuantity)}
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>
            </CardContent>

            {/* ACTIONS */}

            {showActions && (
                <>
                    <Divider />

                    <CardActions
                        sx={{
                            px: 2,
                            py: 1,
                            justifyContent: "space-between"
                        }}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Picklist
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                        >
                            {showViewAction && (
                                <Tooltip title="View Details">
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        aria-label="View picklist"
                                        onClick={handleView}
                                        disabled={loading}
                                    >
                                        <Visibility fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}

                            {showEditAction && (
                                <Tooltip title="Edit Picklist">
                                    <IconButton
                                        size="small"
                                        color="default"
                                        aria-label="Edit picklist"
                                        onClick={handleEdit}
                                        disabled={loading}
                                    >
                                        <Edit fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}

                            {showDeleteAction && (
                                <Tooltip title="Delete Picklist">
                                    <IconButton
                                        size="small"
                                        color="error"
                                        aria-label="Delete picklist"
                                        onClick={handleDelete}
                                        disabled={loading}
                                    >
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Stack>
                    </CardActions>
                </>
            )}
        </Card>
    );
};

export default PicklistCard;

