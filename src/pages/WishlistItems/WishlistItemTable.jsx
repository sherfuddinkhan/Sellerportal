import React from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Typography,
    Box,
    Chip,
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    FavoriteBorder,
} from "@mui/icons-material";


/* =========================================================
   GET FIELD
   Supports camelCase + PascalCase API responses
========================================================= */

const getField = (
    item,
    camelCase,
    pascalCase,
    fallback = null
) => {
    return (
        item?.[camelCase] ??
        item?.[pascalCase] ??
        fallback
    );
};


/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {

    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};


/* =========================================================
   WISHLIST ITEM TABLE
========================================================= */

const WishlistItemTable = ({
    items = [],
    wishlistItems = [],

    onView,
    onEdit,
    onDelete,
}) => {

    /* =====================================================
       NORMALIZE DATA
    ===================================================== */

    const data = Array.isArray(items)
        ? items
        : Array.isArray(wishlistItems)
            ? wishlistItems
            : [];


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <TableContainer
            component={Paper}
            elevation={2}
            sx={{
                width: "100%",
                borderRadius: 2,
                overflowX: "auto",
            }}
        >

            <Table
                stickyHeader
                size="small"
                sx={{
                    minWidth: 900,
                }}
            >

                {/* =================================================
                   HEADER
                ================================================= */}

                <TableHead>

                    <TableRow>

                        <TableCell>
                            Wishlist Item ID
                        </TableCell>

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
                            Product ID
                        </TableCell>

                        <TableCell>
                            Created Date
                        </TableCell>

                        <TableCell>
                            Status
                        </TableCell>

                        <TableCell align="center">
                            Actions
                        </TableCell>

                    </TableRow>

                </TableHead>


                {/* =================================================
                   BODY
                ================================================= */}

                <TableBody>

                    {/* =================================================
                       EMPTY STATE
                    ================================================= */}

                    {data.length === 0 ? (

                        <TableRow>

                            <TableCell
                                colSpan={8}
                                align="center"
                            >

                                <Box
                                    sx={{
                                        py: 6,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 1,
                                    }}
                                >

                                    <FavoriteBorder
                                        sx={{
                                            fontSize: 50,
                                            color: "text.disabled",
                                        }}
                                    />

                                    <Typography
                                        color="text.secondary"
                                        fontWeight={500}
                                    >
                                        No wishlist items found.
                                    </Typography>

                                </Box>

                            </TableCell>

                        </TableRow>

                    ) : (

                        /* =================================================
                           DATA
                        ================================================= */

                        data.map((item, index) => {

                            /* =============================================
                               IDENTIFIERS
                            ============================================= */

                            const wishlistItemId = getField(
                                item,
                                "wishlistItemId",
                                "WishlistItemId",
                                `wishlist-item-${index}`
                            );

                            const wishlistId = getField(
                                item,
                                "wishlistId",
                                "WishlistId",
                                "-"
                            );

                            const sellerId = getField(
                                item,
                                "sellerId",
                                "SellerId",
                                "-"
                            );

                            const customerId = getField(
                                item,
                                "customerId",
                                "CustomerId",
                                "-"
                            );

                            const productId = getField(
                                item,
                                "productId",
                                "ProductId",
                                "-"
                            );

                            const createdDate = getField(
                                item,
                                "createdDate",
                                "CreatedDate",
                                null
                            );


                            /* =============================================
                               STATUS

                               WishlistItem API currently does not return
                               status, so Active is only a display fallback.
                            ============================================= */

                            const status = getField(
                                item,
                                "status",
                                "Status",
                                "Active"
                            ) ?? "Active";

                            const normalizedStatus =
                                String(status).toLowerCase();


                            /* =============================================
                               ACTION ID

                               Use the real numeric WishlistItemId for
                               View/Edit/Delete callbacks.
                            ============================================= */

                            const actionId = getField(
                                item,
                                "wishlistItemId",
                                "WishlistItemId",
                                null
                            );


                            return (

                                <TableRow
                                    hover
                                    key={
                                        actionId ??
                                        `wishlist-item-${index}`
                                    }
                                >

                                    {/* =====================================
                                       WISHLIST ITEM ID
                                    ===================================== */}

                                    <TableCell>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            #{wishlistItemId}
                                        </Typography>

                                    </TableCell>


                                    {/* =====================================
                                       WISHLIST ID
                                    ===================================== */}

                                    <TableCell>

                                        <Chip
                                            label={`#${wishlistId}`}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />

                                    </TableCell>


                                    {/* =====================================
                                       SELLER ID
                                    ===================================== */}

                                    <TableCell>
                                        {sellerId}
                                    </TableCell>


                                    {/* =====================================
                                       CUSTOMER ID
                                    ===================================== */}

                                    <TableCell>
                                        {customerId}
                                    </TableCell>


                                    {/* =====================================
                                       PRODUCT ID
                                    ===================================== */}

                                    <TableCell>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            #{productId}
                                        </Typography>

                                    </TableCell>


                                    {/* =====================================
                                       CREATED DATE
                                    ===================================== */}

                                    <TableCell>

                                        <Typography
                                            variant="body2"
                                            whiteSpace="nowrap"
                                        >
                                            {formatDate(createdDate)}
                                        </Typography>

                                    </TableCell>


                                    {/* =====================================
                                       STATUS
                                    ===================================== */}

                                    <TableCell>

                                        <Chip
                                            size="small"
                                            label={status}
                                            color={
                                                normalizedStatus === "active"
                                                    ? "success"
                                                    : normalizedStatus === "inactive"
                                                        ? "default"
                                                        : "warning"
                                            }
                                        />

                                    </TableCell>


                                    {/* =====================================
                                       ACTIONS
                                    ===================================== */}

                                    <TableCell align="center">

                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: 0.5,
                                            }}
                                        >

                                            {/* =============================
                                               VIEW
                                            ============================= */}

                                            <Tooltip title="View">

                                                <IconButton
                                                    size="small"
                                                    color="info"
                                                    disabled={!actionId}
                                                    onClick={() =>
                                                        onView?.(actionId)
                                                    }
                                                >

                                                    <Visibility
                                                        fontSize="small"
                                                    />

                                                </IconButton>

                                            </Tooltip>


                                            {/* =============================
                                               EDIT
                                            ============================= */}

                                            <Tooltip title="Edit">

                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    disabled={!actionId}
                                                    onClick={() =>
                                                        onEdit?.(actionId)
                                                    }
                                                >

                                                    <Edit
                                                        fontSize="small"
                                                    />

                                                </IconButton>

                                            </Tooltip>


                                            {/* =============================
                                               DELETE
                                            ============================= */}

                                            <Tooltip title="Delete">

                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    disabled={!actionId}
                                                    onClick={() =>
                                                        onDelete?.(actionId)
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

                        })

                    )}

                </TableBody>

            </Table>

        </TableContainer>
    );
};


export default WishlistItemTable;
