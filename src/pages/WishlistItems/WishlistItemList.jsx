import React from "react";

import {
    Grid,
    Box,
    Typography,
    CircularProgress,
    Alert,
    Button
} from "@mui/material";

import {
    FavoriteBorder,
    Refresh
} from "@mui/icons-material";

import WishlistItemCard from "./WishlistItemCard";


/* =========================================================
   WISHLIST ITEM LIST
========================================================= */

const WishlistItemList = ({
    items = [],
    wishlistItems = [],

    loading = false,
    error = "",

    onView,
    onEdit,
    onDelete,
    onRetry,

    emptyMessage = "No wishlist items found."
}) => {


    /* =====================================================
       NORMALIZE ITEMS
    ===================================================== */

    const data =
        Array.isArray(items)
            ? items
            : Array.isArray(wishlistItems)
                ? wishlistItems
                : [];


    /* =====================================================
       LOADING STATE
    ===================================================== */

    if (loading) {

        return (
            <Box
                sx={{
                    width: "100%",
                    minHeight: 250,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2
                }}
            >

                <CircularProgress />

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Loading wishlist items...
                </Typography>

            </Box>
        );
    }


    /* =====================================================
       ERROR STATE
    ===================================================== */

    if (error) {

        return (
            <Box
                sx={{
                    width: "100%",
                    p: 2
                }}
            >

                <Alert
                    severity="error"
                    action={
                        typeof onRetry === "function" ? (
                            <Button
                                color="inherit"
                                size="small"
                                startIcon={<Refresh />}
                                onClick={onRetry}
                            >
                                Retry
                            </Button>
                        ) : null
                    }
                >
                    {error}
                </Alert>

            </Box>
        );
    }


    /* =====================================================
       EMPTY STATE
    ===================================================== */

    if (data.length === 0) {

        return (
            <Box
                sx={{
                    width: "100%",
                    minHeight: 300,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    p: 4
                }}
            >

                <FavoriteBorder
                    sx={{
                        fontSize: 72,
                        color: "text.disabled",
                        mb: 2
                    }}
                />

                <Typography
                    variant="h6"
                    fontWeight={600}
                    color="text.secondary"
                >
                    {emptyMessage}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.disabled"
                    sx={{ mt: 1 }}
                >
                    Add products to your wishlist to see them here.
                </Typography>

            </Box>
        );
    }


    /* =====================================================
       RENDER LIST
    ===================================================== */

    return (
        <Box
            sx={{
                width: "100%"
            }}
        >

            <Grid
                container
                spacing={3}
            >

                {data.map((wishlistItem, index) => {

                    const key =
                        wishlistItem?.wishlistItemId ??
                        wishlistItem?.WishlistItemId ??
                        wishlistItem?.id ??
                        wishlistItem?.Id ??
                        index;

                    return (
                        <Grid
                            item
                            key={key}
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                        >

                            <WishlistItemCard
                                item={wishlistItem}
                                onView={onView}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />

                        </Grid>
                    );

                })}

            </Grid>

        </Box>
    );
};


export default WishlistItemList;

