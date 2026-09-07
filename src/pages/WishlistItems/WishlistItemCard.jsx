import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    Visibility,
    Edit,
    DeleteOutline,
    Favorite,
    Inventory2
} from "@mui/icons-material";


/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN");
};


/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "₹ 0.00";
    }

    return `₹ ${number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};


/* =========================================================
   GET VALUE
========================================================= */

const getValue = (item, ...keys) => {

    for (const key of keys) {

        if (
            item?.[key] !== undefined &&
            item?.[key] !== null
        ) {
            return item[key];
        }
    }

    return null;
};


/* =========================================================
   WISHLIST ITEM CARD
========================================================= */

const WishlistItemCard = ({
    item = null,
    wishlistItem = null,

    onView,
    onEdit,
    onDelete,

    showActions = true
}) => {

    const data = item || wishlistItem || {};


    /* =====================================================
       IDENTIFIERS
    ===================================================== */

    const wishlistItemId = getValue(
        data,
        "wishlistItemId",
        "WishlistItemId",
        "id",
        "Id"
    );

    const wishlistId = getValue(
        data,
        "wishlistId",
        "WishlistId"
    );

    const productId = getValue(
        data,
        "productId",
        "ProductId"
    );


    /* =====================================================
       PRODUCT INFORMATION
    ===================================================== */

    const productName =
        getValue(
            data,
            "productName",
            "ProductName",
            "name",
            "Name"
        ) || `Product #${productId || "-"}`;


    const productCode =
        getValue(
            data,
            "productCode",
            "ProductCode",
            "sku",
            "SKU"
        );


    const description =
        getValue(
            data,
            "description",
            "Description",
            "productDescription",
            "ProductDescription"
        );


    /* =====================================================
       PRICE
    ===================================================== */

    const price = getValue(
        data,
        "price",
        "Price",
        "unitPrice",
        "UnitPrice",
        "sellingPrice",
        "SellingPrice"
    );


    /* =====================================================
       QUANTITY
    ===================================================== */

    const quantity = getValue(
        data,
        "quantity",
        "Quantity"
    );


    /* =====================================================
       STATUS
    ===================================================== */

    const status =
        getValue(
            data,
            "status",
            "Status",
            "wishlistItemStatus",
            "WishlistItemStatus"
        ) || "Active";


    /* =====================================================
       IMAGE
    ===================================================== */

    const imageUrl = getValue(
        data,
        "imageUrl",
        "ImageUrl",
        "productImage",
        "ProductImage",
        "image",
        "Image"
    );


    /* =====================================================
       EVENT HANDLERS
    ===================================================== */

    const handleView = () => {

        if (typeof onView === "function") {
            onView(data);
        }
    };


    const handleEdit = () => {

        if (typeof onEdit === "function") {
            onEdit(data);
        }
    };


    const handleDelete = () => {

        if (typeof onDelete === "function") {
            onDelete(data);
        }
    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Card
            elevation={2}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                transition: "all 0.2s ease",

                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: 5
                }
            }}
        >

            {/* =================================================
               PRODUCT IMAGE / ICON
            ================================================= */}

            <Box
                sx={{
                    height: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "grey.100",
                    overflow: "hidden"
                }}
            >

                {imageUrl ? (

                    <Box
                        component="img"
                        src={imageUrl}
                        alt={productName}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            p: 2
                        }}
                    />

                ) : (

                    <Favorite
                        sx={{
                            fontSize: 70,
                            color: "error.light"
                        }}
                    />

                )}

            </Box>


            <CardContent
                sx={{
                    flexGrow: 1,
                    p: 2
                }}
            >

                {/* =================================================
                   STATUS
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1
                    }}
                >

                    <Chip
                        label={status}
                        size="small"
                        color={
                            String(status).toLowerCase() === "active"
                                ? "success"
                                : "default"
                        }
                    />

                    {wishlistItemId !== null && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            #{wishlistItemId}
                        </Typography>
                    )}

                </Box>


                {/* =================================================
                   PRODUCT NAME
                ================================================= */}

                <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                        mb: 0.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                    }}
                >
                    {productName}
                </Typography>


                {/* =================================================
                   PRODUCT CODE
                ================================================= */}

                {productCode && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                    >
                        SKU: {productCode}
                    </Typography>
                )}


                {/* =================================================
                   DESCRIPTION
                ================================================= */}

                {description && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
                        }}
                    >
                        {description}
                    </Typography>
                )}


                <Divider sx={{ my: 1.5 }} />


                {/* =================================================
                   DETAILS
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1
                    }}
                >

                    {wishlistId !== null && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between"
                            }}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Wishlist ID
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={600}
                            >
                                {wishlistId}
                            </Typography>
                        </Box>
                    )}


                    {productId !== null && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between"
                            }}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Product ID
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={600}
                            >
                                {productId}
                            </Typography>
                        </Box>
                    )}


                    {quantity !== null && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between"
                            }}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Quantity
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={600}
                            >
                                {formatNumber(quantity)}
                            </Typography>
                        </Box>
                    )}


                    {price !== null && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Price
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                                color="primary"
                            >
                                {formatCurrency(price)}
                            </Typography>
                        </Box>
                    )}

                </Box>

            </CardContent>


            {/* =================================================
               ACTIONS
            ================================================= */}

            {showActions && (
                <CardActions
                    sx={{
                        px: 2,
                        pb: 2,
                        pt: 0,
                        justifyContent: "space-between"
                    }}
                >

                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={handleView}
                    >
                        View
                    </Button>


                    <Box>

                        <Tooltip title="Edit">

                            <IconButton
                                color="primary"
                                onClick={handleEdit}
                                size="small"
                            >
                                <Edit />
                            </IconButton>

                        </Tooltip>


                        <Tooltip title="Delete">

                            <IconButton
                                color="error"
                                onClick={handleDelete}
                                size="small"
                            >
                                <DeleteOutline />
                            </IconButton>

                        </Tooltip>

                    </Box>

                </CardActions>
            )}

        </Card>
    );
};


export default WishlistItemCard;

