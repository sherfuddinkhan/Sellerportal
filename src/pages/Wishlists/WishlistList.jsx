// =========================================================
// WishlistList.jsx
// =========================================================

import React from "react";

import {
    Box,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    IconButton,
    Tooltip,
    Chip,
    Divider,
} from "@mui/material";

import {
    Favorite,
    Visibility,
    Delete,
    ShoppingCart,
    Inventory2,
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const WishlistList = ({
    wishlists = [],
    onView,
    onDelete,
    loading = false,
}) => {
    // =========================================================
    // EMPTY STATE
    // =========================================================

    if (!loading && wishlists.length === 0) {
        return (
            <Paper
                elevation={2}
                sx={{
                    p: 6,
                    textAlign: "center",
                    borderRadius: 2,
                }}
            >
                <Favorite
                    sx={{
                        fontSize: 70,
                        color: "text.secondary",
                        mb: 2,
                    }}
                />

                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    No Wishlist Items
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    There are currently no products in the wishlist.
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper
            elevation={2}
            sx={{
                borderRadius: 2,
                overflow: "hidden",
            }}
        >
            {/* =====================================================
                HEADER
               ===================================================== */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Favorite color="error" />

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Wishlist
                    </Typography>

                    <Chip
                        label={wishlists.length}
                        size="small"
                    />
                </Box>
            </Box>

            <Divider />

            {/* =====================================================
                LOADING
               ===================================================== */}

            {loading ? (
                <Box
                    sx={{
                        py: 6,
                        textAlign: "center",
                    }}
                >
                    <Typography color="text.secondary">
                        Loading wishlist...
                    </Typography>
                </Box>
            ) : (
                <List disablePadding>
                    {wishlists.map((wishlist, index) => {
                        const product =
                            wishlist.product || {};

                        const productName =
                            wishlist.productName ||
                            product.productName ||
                            "Unknown Product";

                        const productCode =
                            wishlist.productCode ||
                            product.productCode ||
                            "N/A";

                        const customerName =
                            wishlist.customerName ||
                            wishlist.customer
                                ?.customerName ||
                            "N/A";

                        const category =
                            wishlist.categoryName ||
                            wishlist.category
                                ?.categoryName ||
                            "N/A";

                        const price =
                            wishlist.price ??
                            product.price ??
                            0;

                        const stock =
                            wishlist.stock ??
                            product.stock ??
                            0;

                        const image =
                            wishlist.productImage ||
                            wishlist.image ||
                            product.image ||
                            "";

                        return (
                            <React.Fragment
                                key={
                                    wishlist.wishlistId ??
                                    wishlist.id ??
                                    index
                                }
                            >
                                <ListItem
                                    sx={{
                                        px: 3,
                                        py: 2,
                                    }}
                                    secondaryAction={
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems:
                                                    "center",
                                                gap: 0.5,
                                            }}
                                        >
                                            {/* VIEW */}

                                            <Tooltip title="View">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        onView &&
                                                        onView(
                                                            wishlist
                                                        )
                                                    }
                                                >
                                                    <Visibility />
                                                </IconButton>
                                            </Tooltip>

                                            {/* DELETE */}

                                            <Tooltip title="Remove">
                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        onDelete &&
                                                        onDelete(
                                                            wishlist
                                                        )
                                                    }
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    }
                                >
                                    {/* =================================================
                                        PRODUCT IMAGE
                                       ================================================= */}

                                    <ListItemAvatar>
                                        <Avatar
                                            variant="rounded"
                                            src={image}
                                            sx={{
                                                width: 56,
                                                height: 56,
                                            }}
                                        >
                                            <ShoppingCart />
                                        </Avatar>
                                    </ListItemAvatar>

                                    {/* =================================================
                                        PRODUCT INFORMATION
                                       ================================================= */}

                                    <ListItemText
                                        sx={{
                                            mr: 12,
                                        }}
                                        primary={
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight="bold"
                                            >
                                                {productName}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 0.5 }}>
                                                {/* Product Code */}

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Product Code:{" "}
                                                    {productCode}
                                                </Typography>

                                                {/* Customer */}

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Customer:{" "}
                                                    {customerName}
                                                </Typography>

                                                {/* Category */}

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Category:{" "}
                                                    {category}
                                                </Typography>

                                                {/* Price & Stock */}

                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: 1,
                                                        mt: 1,
                                                        flexWrap:
                                                            "wrap",
                                                    }}
                                                >
                                                    <Chip
                                                        label={`₹${Number(
                                                            price
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}`}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />

                                                    {Number(
                                                        stock
                                                    ) > 0 ? (
                                                        <Chip
                                                            icon={
                                                                <Inventory2 />
                                                            }
                                                            label={`${stock} Available`}
                                                            size="small"
                                                            color="success"
                                                        />
                                                    ) : (
                                                        <Chip
                                                            label="Out of Stock"
                                                            size="small"
                                                            color="error"
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </ListItem>

                                {index <
                                    wishlists.length - 1 && (
                                    <Divider
                                        component="li"
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </List>
            )}
        </Paper>
    );
};

export default WishlistList;