import React from "react";

import {
    Box,
    Chip,
    CircularProgress,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";

import {
    Delete,
    Edit,
    Visibility
} from "@mui/icons-material";


// ============================================================
// COMPONENT
// ============================================================

const WishlistTable = ({
    wishlists = [],

    page = 0,

    rowsPerPage = 10,

    onPageChange,

    onRowsPerPageChange,

    onView,

    onEdit,

    onDelete,

    loading = false
}) => {


    // ========================================================
    // STATUS COLOR
    // ========================================================

    const getStatusColor = (status) => {

        switch (
            String(status || "")
                .toLowerCase()
        ) {

            case "active":
                return "success";

            case "inactive":
                return "default";

            case "pending":
                return "warning";

            case "completed":
                return "success";

            case "cancelled":
                return "error";

            default:
                return "default";
        }
    };


    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate = (value) => {

        if (!value) {
            return "-";
        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "-";
        }


        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };


    // ========================================================
    // GET WISHLIST ID
    // ========================================================

    const getWishlistId = (wishlist) => {

        return (
            wishlist?.wishlistId ??
            wishlist?.WishlistId ??
            wishlist?.id ??
            wishlist?.Id
        );
    };


    // ========================================================
    // PAGINATION
    // ========================================================

    const safePage =
        Number.isInteger(page) &&
        page >= 0
            ? page
            : 0;


    const safeRowsPerPage =
        Number.isInteger(rowsPerPage) &&
        rowsPerPage > 0
            ? rowsPerPage
            : 10;


    const startIndex =
        safePage *
        safeRowsPerPage;


    const paginatedWishlists =
        wishlists.slice(
            startIndex,
            startIndex +
                safeRowsPerPage
        );


    // ========================================================
    // PAGE CHANGE
    // ========================================================

    const handlePageChange = (
        event,
        newPage
    ) => {

        if (onPageChange) {
            onPageChange(
                event,
                newPage
            );
        }
    };


    // ========================================================
    // ROWS PER PAGE CHANGE
    // ========================================================

    const handleRowsPerPageChange = (
        event
    ) => {

        if (onRowsPerPageChange) {

            onRowsPerPageChange(
                event
            );

        }
    };


    // ========================================================
    // VIEW
    // ========================================================

    const handleView = (wishlist) => {

        if (onView) {
            onView(wishlist);
        }
    };


    // ========================================================
    // EDIT
    // ========================================================

    const handleEdit = (wishlist) => {

        if (onEdit) {
            onEdit(wishlist);
        }
    };


    // ========================================================
    // DELETE
    // ========================================================

    const handleDelete = (wishlist) => {

        if (onDelete) {
            onDelete(wishlist);
        }
    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (
            <Paper
                elevation={1}
                sx={{
                    width: "100%",
                    overflow: "hidden"
                }}
            >

                <Box
                    sx={{
                        minHeight: 300,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 2
                    }}
                >

                    <CircularProgress />

                    <Typography
                        color="text.secondary"
                    >
                        Loading wishlists...
                    </Typography>

                </Box>

            </Paper>
        );
    }


    // ========================================================
    // EMPTY
    // ========================================================

    if (!wishlists.length) {

        return (
            <Paper
                elevation={1}
                sx={{
                    width: "100%"
                }}
            >

                <Box
                    sx={{
                        minHeight: 220,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 1
                    }}
                >

                    <Typography
                        variant="h6"
                        fontWeight={600}
                    >
                        No Wishlists Found
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        There are no wishlist records
                        available.
                    </Typography>

                </Box>

            </Paper>
        );
    }


    // ========================================================
    // TABLE
    // ========================================================

    return (
        <Paper
            elevation={1}
            sx={{
                width: "100%",
                overflow: "hidden"
            }}
        >

            <TableContainer
                sx={{
                    maxHeight: 600
                }}
            >

                <Table
                    stickyHeader
                    size="small"
                >

                    {/* =========================================
                       HEADER
                    ========================================= */}

                    <TableHead>

                        <TableRow>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Wishlist ID
                            </TableCell>


                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Seller ID
                            </TableCell>


                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Customer ID
                            </TableCell>


                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Status
                            </TableCell>


                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Created Date
                            </TableCell>


                            <TableCell
                                align="center"
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Actions
                            </TableCell>

                        </TableRow>

                    </TableHead>


                    {/* =========================================
                       BODY
                    ========================================= */}

                    <TableBody>

                        {paginatedWishlists.map(
                            (wishlist, index) => {

                                const wishlistId =
                                    getWishlistId(
                                        wishlist
                                    );


                                const sellerId =
                                    wishlist?.sellerId ??
                                    wishlist?.SellerId ??
                                    "-";


                                const customerId =
                                    wishlist?.customerId ??
                                    wishlist?.CustomerId ??
                                    "-";


                                const status =
                                    wishlist?.status ??
                                    wishlist?.Status ??
                                    "Unknown";


                                const createdDate =
                                    wishlist?.createdDate ??
                                    wishlist?.CreatedDate;


                                return (

                                    <TableRow
                                        key={
                                            wishlistId ??
                                            `wishlist-${index}`
                                        }
                                        hover
                                    >

                                        {/* =====================
                                           WISHLIST ID
                                        ====================== */}

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                            >
                                                {wishlistId ?? "-"}
                                            </Typography>
                                        </TableCell>


                                        {/* =====================
                                           SELLER ID
                                        ====================== */}

                                        <TableCell>
                                            {sellerId}
                                        </TableCell>


                                        {/* =====================
                                           CUSTOMER ID
                                        ====================== */}

                                        <TableCell>
                                            {customerId}
                                        </TableCell>


                                        {/* =====================
                                           STATUS
                                        ====================== */}

                                        <TableCell>

                                            <Chip
                                                label={
                                                    status
                                                }
                                                color={
                                                    getStatusColor(
                                                        status
                                                    )
                                                }
                                                size="small"
                                                variant="outlined"
                                            />

                                        </TableCell>


                                        {/* =====================
                                           CREATED DATE
                                        ====================== */}

                                        <TableCell
                                            sx={{
                                                whiteSpace:
                                                    "nowrap"
                                            }}
                                        >
                                            {formatDate(
                                                createdDate
                                            )}
                                        </TableCell>


                                        {/* =====================
                                           ACTIONS
                                        ====================== */}

                                        <TableCell
                                            align="center"
                                        >

                                            <Box
                                                sx={{
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    gap: 0.5
                                                }}
                                            >

                                                {/* =================
                                                   VIEW
                                                ================== */}

                                                <Tooltip
                                                    title="View Wishlist"
                                                >

                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() =>
                                                            handleView(
                                                                wishlist
                                                            )
                                                        }
                                                        disabled={
                                                            !wishlistId
                                                        }
                                                    >

                                                        <Visibility
                                                            fontSize="small"
                                                        />

                                                    </IconButton>

                                                </Tooltip>


                                                {/* =================
                                                   EDIT
                                                   ONLY IN ACTIONS
                                                ================== */}

                                                <Tooltip
                                                    title="Edit Wishlist"
                                                >

                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() =>
                                                            handleEdit(
                                                                wishlist
                                                            )
                                                        }
                                                        disabled={
                                                            !wishlistId
                                                        }
                                                    >

                                                        <Edit
                                                            fontSize="small"
                                                        />

                                                    </IconButton>

                                                </Tooltip>


                                                {/* =================
                                                   DELETE
                                                ================== */}

                                                <Tooltip
                                                    title="Delete Wishlist"
                                                >

                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() =>
                                                            handleDelete(
                                                                wishlist
                                                            )
                                                        }
                                                        disabled={
                                                            !wishlistId
                                                        }
                                                    >

                                                        <Delete
                                                            fontSize="small"
                                                        />

                                                    </IconButton>

                                                </Tooltip>

                                            </Box>

                                        </TableCell>

                                    </TableRow>

                                );
                            }
                        )}

                    </TableBody>

                </Table>

            </TableContainer>


            {/* =================================================
               PAGINATION
            ================================================= */}

            <TablePagination
                component="div"
                count={
                    wishlists.length
                }
                page={
                    safePage
                }
                rowsPerPage={
                    safeRowsPerPage
                }
                onPageChange={
                    handlePageChange
                }
                onRowsPerPageChange={
                    handleRowsPerPageChange
                }
                rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    50
                ]}
            />

        </Paper>
    );
};


export default WishlistTable;
