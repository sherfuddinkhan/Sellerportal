// =========================================================
// WishlistTable.jsx
// =========================================================

import React from "react";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Typography,
    Box,
    IconButton,
    Tooltip,
    Chip,
    Avatar,
} from "@mui/material";

import {
    Visibility,
    Delete,
    ShoppingCart,
    Favorite,
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const WishlistTable = ({
    wishlists = [],
    page = 0,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,
    onView,
    onDelete,
    loading = false,
}) => {
    // =========================================================
    // PAGINATED DATA
    // =========================================================

    const paginatedWishlists = wishlists.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // =========================================================
    // EMPTY STATE
    // =========================================================

    if (!loading && wishlists.length === 0) {
        return (
            <Paper
                elevation={2}
                sx={{
                    borderRadius: 2,
                    p: 6,
                    textAlign: "center",
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
                    No Wishlist Items Found
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
                TABLE HEADER
               ===================================================== */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 2,
                }}
            >
                <Favorite color="error" />

                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    Wishlist Items
                </Typography>

                <Chip
                    label={wishlists.length}
                    size="small"
                />
            </Box>

            {/* =====================================================
                TABLE
               ===================================================== */}

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Product
                            </TableCell>

                            <TableCell>
                                Customer
                            </TableCell>

                            <TableCell>
                                Product Code
                            </TableCell>

                            <TableCell>
                                Category
                            </TableCell>

                            <TableCell align="right">
                                Price
                            </TableCell>

                            <TableCell align="center">
                                Stock
                            </TableCell>

                            <TableCell>
                                Added Date
                            </TableCell>

                            <TableCell align="center">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    align="center"
                                    sx={{ py: 6 }}
                                >
                                    <Typography
                                        color="text.secondary"
                                    >
                                        Loading wishlist...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedWishlists.map(
                                (wishlist) => (
                                    <TableRow
                                        key={
                                            wishlist.wishlistId ??
                                            wishlist.id
                                        }
                                        hover
                                    >
                                        {/* =================================
                                            PRODUCT
                                           ================================= */}

                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems:
                                                        "center",
                                                    gap: 1.5,
                                                }}
                                            >
                                                <Avatar
                                                    variant="rounded"
                                                    src={
                                                        wishlist.productImage ||
                                                        wishlist.image ||
                                                        ""
                                                    }
                                                >
                                                    <ShoppingCart />
                                                </Avatar>

                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight="bold"
                                                    >
                                                        {wishlist.productName ||
                                                            wishlist.product
                                                                ?.productName ||
                                                            "N/A"}
                                                    </Typography>

                                                    {wishlist.brand && (
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            {
                                                                wishlist.brand
                                                            }
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        {/* =================================
                                            CUSTOMER
                                           ================================= */}

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                fontWeight="medium"
                                            >
                                                {wishlist.customerName ||
                                                    wishlist.customer
                                                        ?.customerName ||
                                                    "N/A"}
                                            </Typography>

                                            {wishlist.customerCode && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {
                                                        wishlist.customerCode
                                                    }
                                                </Typography>
                                            )}
                                        </TableCell>

                                        {/* =================================
                                            PRODUCT CODE
                                           ================================= */}

                                        <TableCell>
                                            {wishlist.productCode ||
                                                wishlist.product
                                                    ?.productCode ||
                                                "N/A"}
                                        </TableCell>

                                        {/* =================================
                                            CATEGORY
                                           ================================= */}

                                        <TableCell>
                                            {wishlist.categoryName ||
                                                wishlist.category
                                                    ?.categoryName ||
                                                "N/A"}
                                        </TableCell>

                                        {/* =================================
                                            PRICE
                                           ================================= */}

                                        <TableCell align="right">
                                            <Typography
                                                fontWeight="bold"
                                            >
                                                ₹
                                                {Number(
                                                    wishlist.price ||
                                                        wishlist.product
                                                            ?.price ||
                                                        0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </Typography>
                                        </TableCell>

                                        {/* =================================
                                            STOCK
                                           ================================= */}

                                        <TableCell align="center">
                                            {Number(
                                                wishlist.stock ??
                                                    wishlist.product
                                                        ?.stock ??
                                                    0
                                            ) > 0 ? (
                                                <Chip
                                                    label={`${
                                                        wishlist.stock ??
                                                        wishlist
                                                            .product
                                                            ?.stock
                                                    } Available`}
                                                    color="success"
                                                    size="small"
                                                />
                                            ) : (
                                                <Chip
                                                    label="Out of Stock"
                                                    color="error"
                                                    size="small"
                                                />
                                            )}
                                        </TableCell>

                                        {/* =================================
                                            DATE
                                           ================================= */}

                                        <TableCell>
                                            {wishlist.createdDate ||
                                            wishlist.addedDate
                                                ? new Date(
                                                      wishlist.createdDate ||
                                                          wishlist.addedDate
                                                  ).toLocaleDateString(
                                                      "en-IN"
                                                  )
                                                : "N/A"}
                                        </TableCell>

                                        {/* =================================
                                            ACTIONS
                                           ================================= */}

                                        <TableCell align="center">
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

                                            <Tooltip title="Delete">
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
                                        </TableCell>
                                    </TableRow>
                                )
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* =====================================================
                PAGINATION
               ===================================================== */}

            <TablePagination
                component="div"
                count={wishlists.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    50,
                ]}
            />
        </Paper>
    );
};

export default WishlistTable;