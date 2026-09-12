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
} from "@mui/material";

import {
    Visibility,
    Delete,
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
    // STATUS COLOR
    // =========================================================

    const getStatusColor = (status) => {
        switch (String(status || "").toLowerCase()) {
            case "active":
                return "success";

            case "inactive":
                return "default";

            case "completed":
                return "info";

            case "cancelled":
                return "error";

            default:
                return "warning";
        }
    };

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
                    No Wishlists Found
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    There are currently no wishlist records.
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
                    Wishlists
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
                                Wishlist ID
                            </TableCell>

                            <TableCell>
                                Seller ID
                            </TableCell>

                            <TableCell>
                                Customer ID
                            </TableCell>

                            <TableCell>
                                Status
                            </TableCell>

                            <TableCell>
                                Created Date
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
                                    colSpan={6}
                                    align="center"
                                    sx={{ py: 6 }}
                                >
                                    <Typography
                                        color="text.secondary"
                                    >
                                        Loading wishlists...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedWishlists.map((wishlist) => {

                                const wishlistId =
                                    wishlist.wishlistId ??
                                    wishlist.id;

                                return (
                                    <TableRow
                                        key={wishlistId}
                                        hover
                                    >

                                        {/* =================================
                                            WISHLIST ID
                                           ================================= */}

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                fontWeight="bold"
                                            >
                                                #{wishlistId ?? "N/A"}
                                            </Typography>
                                        </TableCell>

                                        {/* =================================
                                            SELLER ID
                                           ================================= */}

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                            >
                                                {wishlist.sellerId ??
                                                    "N/A"}
                                            </Typography>
                                        </TableCell>

                                        {/* =================================
                                            CUSTOMER ID
                                           ================================= */}

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                            >
                                                {wishlist.customerId ??
                                                    "N/A"}
                                            </Typography>
                                        </TableCell>

                                        {/* =================================
                                            STATUS
                                           ================================= */}

                                        <TableCell>
                                            <Chip
                                                label={
                                                    wishlist.status ||
                                                    "N/A"
                                                }
                                                color={getStatusColor(
                                                    wishlist.status
                                                )}
                                                size="small"
                                            />
                                        </TableCell>

                                        {/* =================================
                                            CREATED DATE
                                           ================================= */}

                                        <TableCell>
                                            {wishlist.createdDate
                                                ? new Date(
                                                      wishlist.createdDate
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
                                );
                            })
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
