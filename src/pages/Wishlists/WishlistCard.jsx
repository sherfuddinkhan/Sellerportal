// =========================================================
// WishlistCard.jsx
// =========================================================

import React from "react";

import {
    Card,
    CardContent,
    Box,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    Divider,
} from "@mui/material";

import {
    Favorite,
    FavoriteBorder,
    ShoppingCart,
    Delete,
    Visibility,
    Person,
    Inventory2,
    CalendarToday,
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const WishlistCard = ({
    wishlist = {},
    onView,
    onDelete,
    onAddToCart,
    loading = false,
}) => {
    // =========================================================
    // SAFE VALUES
    // =========================================================

    const wishlistId =
        wishlist.wishlistId ??
        wishlist.id ??
        "";

    const productName =
        wishlist.productName ||
        wishlist.product?.productName ||
        wishlist.product?.name ||
        "Unknown Product";

    const productSku =
        wishlist.productSku ||
        wishlist.product?.sku ||
        wishlist.sku ||
        "N/A";

    const customerName =
        wishlist.customerName ||
        wishlist.customer?.customerName ||
        wishlist.customer?.name ||
        "Unknown Customer";

    const customerId =
        wishlist.customerId ||
        wishlist.customer?.customerId ||
        "";

    const quantity =
        wishlist.quantity ??
        1;

    const price =
        wishlist.price ??
        wishlist.productPrice ??
        wishlist.product?.price ??
        0;

    const currency =
        wishlist.currency ||
        "₹";

    const isActive =
        wishlist.isActive ??
        true;

    const createdDate =
        wishlist.createdDate ||
        wishlist.createdAt ||
        wishlist.date ||
        null;

    const imageUrl =
        wishlist.imageUrl ||
        wishlist.productImage ||
        wishlist.product?.imageUrl ||
        "";

    // =========================================================
    // DATE FORMAT
    // =========================================================

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "N/A";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // =========================================================
    // PRICE FORMAT
    // =========================================================

    const formatPrice = (value) => {
        const numericValue =
            Number(value);

        if (
            Number.isNaN(
                numericValue
            )
        ) {
            return "0.00";
        }

        return numericValue.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );
    };

    // =========================================================
    // HANDLERS
    // =========================================================

    const handleView = () => {
        if (onView) {
            onView(wishlist);
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(wishlist);
        }
    };

    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart(wishlist);
        }
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Card
            elevation={2}
            sx={{
                width: "100%",
                height: "100%",
                borderRadius: 2,
                transition:
                    "all 0.2s ease",
                "&:hover": {
                    elevation: 5,
                    transform:
                        "translateY(-2px)",
                },
            }}
        >
            <CardContent
                sx={{
                    p: 2,
                    "&:last-child": {
                        pb: 2,
                    },
                }}
            >
                {/* =================================================
                    TOP SECTION
                   ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems:
                            "flex-start",
                        justifyContent:
                            "space-between",
                        gap: 1,
                    }}
                >
                    {/* PRODUCT IMAGE */}

                    <Box
                        sx={{
                            width: 72,
                            height: 72,
                            borderRadius: 2,
                            overflow: "hidden",
                            bgcolor:
                                "action.hover",
                            display: "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            flexShrink: 0,
                        }}
                    >
                        {imageUrl ? (
                            <Box
                                component="img"
                                src={imageUrl}
                                alt={
                                    productName
                                }
                                sx={{
                                    width:
                                        "100%",
                                    height:
                                        "100%",
                                    objectFit:
                                        "cover",
                                }}
                            />
                        ) : (
                            <Favorite
                                sx={{
                                    fontSize: 32,
                                    color:
                                        "error.main",
                                }}
                            />
                        )}
                    </Box>

                    {/* PRODUCT DETAILS */}

                    <Box
                        sx={{
                            flex: 1,
                            minWidth: 0,
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            noWrap
                            title={
                                productName
                            }
                        >
                            {productName}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 0.5,
                            }}
                        >
                            SKU: {productSku}
                        </Typography>

                        <Chip
                            size="small"
                            icon={
                                isActive ? (
                                    <Favorite />
                                ) : (
                                    <FavoriteBorder />
                                )
                            }
                            label={
                                isActive
                                    ? "Active"
                                    : "Inactive"
                            }
                            color={
                                isActive
                                    ? "success"
                                    : "default"
                            }
                            variant="outlined"
                            sx={{
                                mt: 1,
                            }}
                        />
                    </Box>

                    {/* VIEW BUTTON */}

                    <Tooltip title="View Wishlist">
                        <IconButton
                            size="small"
                            onClick={
                                handleView
                            }
                            disabled={
                                loading
                            }
                        >
                            <Visibility fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Divider
                    sx={{
                        my: 2,
                    }}
                />

                {/* =================================================
                    CUSTOMER
                   ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems:
                            "center",
                        gap: 1,
                        mb: 1,
                    }}
                >
                    <Person
                        fontSize="small"
                        color="action"
                    />

                    <Box
                        sx={{
                            minWidth: 0,
                        }}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Customer
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={500}
                            noWrap
                        >
                            {customerName}
                        </Typography>
                    </Box>
                </Box>

                {/* =================================================
                    CUSTOMER ID
                   ================================================= */}

                {customerId && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            display: "block",
                            mb: 1.5,
                        }}
                    >
                        Customer ID:{" "}
                        {customerId}
                    </Typography>
                )}

                {/* =================================================
                    PRICE + QUANTITY
                   ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        mb: 1.5,
                    }}
                >
                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Price
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            {currency}
                            {formatPrice(price)}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            textAlign:
                                "right",
                        }}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Quantity
                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight="bold"
                            sx={{
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                gap: 0.5,
                            }}
                        >
                            <Inventory2 fontSize="small" />
                            {quantity}
                        </Typography>
                    </Box>
                </Box>

                {/* =================================================
                    DATE
                   ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems:
                            "center",
                        gap: 1,
                        mb: 2,
                    }}
                >
                    <CalendarToday
                        fontSize="small"
                        color="action"
                    />

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Added:{" "}
                        {formatDate(
                            createdDate
                        )}
                    </Typography>
                </Box>

                <Divider
                    sx={{
                        mb: 1.5,
                    }}
                />

                {/* =================================================
                    ACTIONS
                   ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "space-between",
                        gap: 1,
                    }}
                >
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={
                            <ShoppingCart />
                        }
                        onClick={
                            handleAddToCart
                        }
                        disabled={
                            loading ||
                            !isActive
                        }
                        sx={{
                            flex: 1,
                        }}
                    >
                        Add to Cart
                    </Button>

                    <Tooltip title="Delete Wishlist">
                        <IconButton
                            color="error"
                            onClick={
                                handleDelete
                            }
                            disabled={
                                loading
                            }
                        >
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </Box>
            </CardContent>
        </Card>
    );
};

export default WishlistCard;