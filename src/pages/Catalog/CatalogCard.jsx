import React from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    IconButton,
    Tooltip,
    Divider,
} from "@mui/material";

import {
    Edit,
    Delete,
    Visibility,
    Inventory2,
} from "@mui/icons-material";

const CatalogCard = ({
    catalog,
    onEdit,
    onDelete,
    onView,
}) => {
    if (!catalog) return null;

    const {
        catalogId,
        catalogName,
        description,
        productId,
        productName,
        categoryId,
        categoryName,
        brandId,
        brandName,
        price,
        stockQuantity,
        isActive,
    } = catalog;

    return (
        <Card
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                boxShadow: 2,
                transition: "0.2s",
                "&:hover": {
                    boxShadow: 5,
                    transform: "translateY(-2px)",
                },
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>

                {/* Header */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={1}
                >
                    <Box display="flex" alignItems="center" gap={1}>
                        <Inventory2 fontSize="small" />

                        <Typography
                            variant="h6"
                            fontWeight={600}
                            noWrap
                        >
                            {catalogName || "Unnamed Catalog"}
                        </Typography>
                    </Box>

                    <Chip
                        size="small"
                        label={isActive ? "Active" : "Inactive"}
                        color={isActive ? "success" : "default"}
                    />
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Product */}
                <Box mb={1.5}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Product
                    </Typography>

                    <Typography variant="body2">
                        {productName ||
                            (productId
                                ? `Product #${productId}`
                                : "N/A")}
                    </Typography>
                </Box>

                {/* Category */}
                <Box mb={1.5}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Category
                    </Typography>

                    <Typography variant="body2">
                        {categoryName ||
                            (categoryId
                                ? `Category #${categoryId}`
                                : "N/A")}
                    </Typography>
                </Box>

                {/* Brand */}
                <Box mb={1.5}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Brand
                    </Typography>

                    <Typography variant="body2">
                        {brandName ||
                            (brandId
                                ? `Brand #${brandId}`
                                : "N/A")}
                    </Typography>
                </Box>

                {/* Price & Stock */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    gap={2}
                    mb={1.5}
                >
                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Price
                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight={600}
                        >
                            ₹
                            {Number(price || 0).toLocaleString(
                                "en-IN",
                                {
                                    minimumFractionDigits: 2,
                                }
                            )}
                        </Typography>
                    </Box>

                    <Box textAlign="right">
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Stock
                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight={600}
                        >
                            {stockQuantity ?? 0}
                        </Typography>
                    </Box>
                </Box>

                {/* Description */}
                {description && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {description}
                    </Typography>
                )}
            </CardContent>

            <Divider />

            {/* Actions */}
            <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                px={1}
                py={0.5}
            >
                {onView && (
                    <Tooltip title="View Catalog">
                        <IconButton
                            size="small"
                            onClick={() => onView(catalog)}
                        >
                            <Visibility fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}

                {onEdit && (
                    <Tooltip title="Edit Catalog">
                        <IconButton
                            size="small"
                            onClick={() => onEdit(catalog)}
                        >
                            <Edit fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}

                {onDelete && (
                    <Tooltip title="Delete Catalog">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(catalog)}
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Card>
    );
};

export default CatalogCard;