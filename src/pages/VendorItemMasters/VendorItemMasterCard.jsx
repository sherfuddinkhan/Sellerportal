// =========================================================
// VendorItemMasterCard.jsx
// =========================================================

import React from "react";

import {
    Card,
    CardContent,
    Box,
    Typography,
    Chip,
    Divider,
    IconButton,
    Tooltip,
    Stack
} from "@mui/material";

import {
    Inventory2,
    Visibility,
    Edit,
    Delete,
    Store,
    CurrencyRupee
} from "@mui/icons-material";

// =========================================================
// GET FIELD VALUE
// =========================================================

const getField = (
    item,
    camelCase,
    pascalCase,
    fallback = "—"
) => {
    return (
        item?.[camelCase] ??
        item?.[pascalCase] ??
        fallback
    );
};

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
// GET STATUS
// =========================================================

const getStatus = (value) => {
    const status = String(value ?? "")
        .trim()
        .toLowerCase();

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
        label: value || "Unknown",
        color: "warning"
    };
};

// =========================================================
// VENDOR ITEM MASTER CARD
// =========================================================

const VendorItemMasterCard = ({
    item,
    onView,
    onEdit,
    onDelete,
    loading = false
}) => {

    // =====================================================
    // EMPTY ITEM GUARD
    // =====================================================

    if (!item) {
        return null;
    }

    // =====================================================
    // ITEM DETAILS
    // =====================================================

    const itemCode = getField(
        item,
        "itemCode",
        "ItemCode"
    );

    const itemName = getField(
        item,
        "itemName",
        "ItemName",
        "Unnamed Item"
    );

    const description = getField(
        item,
        "description",
        "Description",
        ""
    );

    const vendorName = getField(
        item,
        "vendorName",
        "VendorName",
        getField(item, "vendorId", "VendorId")
    );

    const unitOfMeasure = getField(
        item,
        "unitOfMeasure",
        "UnitOfMeasure"
    );

    const unitPrice = getField(
        item,
        "unitPrice",
        "UnitPrice",
        getField(item, "unitCost", "UnitCost", 0)
    );

    const taxRate = getField(
        item,
        "taxRate",
        "TaxRate",
        0
    );

    const rawStatus = getField(
        item,
        "status",
        "Status",
        "Unknown"
    );

    const status = getStatus(rawStatus);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                backgroundColor: "background.paper",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
                "&:hover": {
                    boxShadow: 4,
                    transform: "translateY(-3px)"
                }
            }}
        >
            <CardContent
                sx={{
                    p: 2.5,
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    "&:last-child": {
                        pb: 2.5
                    }
                }}
            >
                {/* ========================================= */}
                {/* CARD HEADER */}
                {/* ========================================= */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 1,
                        mb: 2
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            minWidth: 0
                        }}
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
                                backgroundColor: "primary.50",
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
                                {itemName}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Code: {itemCode}
                            </Typography>
                        </Box>
                    </Box>

                    <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                        variant="outlined"
                    />
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* ========================================= */}
                {/* VENDOR INFORMATION */}
                {/* ========================================= */}

                <Stack spacing={1.5} sx={{ flexGrow: 1 }}>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.5
                        }}
                    >
                        <Store
                            fontSize="small"
                            color="action"
                            sx={{ mt: 0.25 }}
                        />

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Vendor
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={500}
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {vendorName}
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.5
                        }}
                    >
                        <Inventory2
                            fontSize="small"
                            color="action"
                            sx={{ mt: 0.25 }}
                        />

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Unit of Measure
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={500}
                            >
                                {unitOfMeasure}
                            </Typography>
                        </Box>
                    </Box>

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
                                color="text.secondary"
                                sx={{
                                    mt: 0.5,
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

                </Stack>

                {/* ========================================= */}
                {/* PRICE INFORMATION */}
                {/* ========================================= */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        mt: 2,
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: "action.hover"
                    }}
                >
                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Unit Price
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            color="primary.main"
                        >
                            {formatCurrency(unitPrice)}
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: "right" }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Tax Rate
                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight={600}
                        >
                            {Number.isFinite(Number(taxRate))
                                ? `${Number(taxRate)}%`
                                : "0%"}
                        </Typography>
                    </Box>

                    <CurrencyRupee
                        color="action"
                        sx={{ display: "none" }}
                    />
                </Box>

                {/* ========================================= */}
                {/* CARD ACTIONS */}
                {/* ========================================= */}

                <Divider sx={{ mt: 2, mb: 1 }} />

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 0.5
                    }}
                >
                    <Tooltip title="View item">
                        <span>
                            <IconButton
                                size="small"
                                color="info"
                                disabled={loading}
                                aria-label="View vendor item"
                                onClick={() => onView?.(item)}
                            >
                                <Visibility fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Edit item">
                        <span>
                            <IconButton
                                size="small"
                                color="primary"
                                disabled={loading}
                                aria-label="Edit vendor item"
                                onClick={() => onEdit?.(item)}
                            >
                                <Edit fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Delete item">
                        <span>
                            <IconButton
                                size="small"
                                color="error"
                                disabled={loading}
                                aria-label="Delete vendor item"
                                onClick={() => onDelete?.(item)}
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Box>
            </CardContent>
        </Card>
    );
};

export default VendorItemMasterCard;

