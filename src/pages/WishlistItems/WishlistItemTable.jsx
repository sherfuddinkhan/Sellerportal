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
    Chip
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    FavoriteBorder
} from "@mui/icons-material";


// ============================================================
// GET FIELD
// Supports camelCase + PascalCase
// ============================================================

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


// ============================================================
// FORMAT DATE
// ============================================================

const formatDate = (value) => {

    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "N/A";
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


// ============================================================
// WISHLIST ITEM TABLE
// ============================================================

const WishlistItemTable = ({
    items = [],
    wishlistItems = [],
    onView,
    onEdit,
    onDelete
}) => {

    // ========================================================
    // SUPPORT BOTH PROPS
    //
    // Preferred:
    // items
    //
    // Backward compatible:
    // wishlistItems
    // ========================================================

    const data =
        Array.isArray(items)
            ? items
            : Array.isArray(wishlistItems)
                ? wishlistItems
                : [];


    console.log(
        "WishlistItemTable ITEMS:",
        data
    );


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <TableContainer
            component={Paper}
            elevation={2}
            sx={{
                width: "100%",
                borderRadius: 2,
                overflowX: "auto"
            }}
        >

            <Table
                stickyHeader
                size="small"
                sx={{
                    minWidth: 850
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

                        <TableCell
                            align="center"
                        >
                            Actions
                        </TableCell>

                    </TableRow>

                </TableHead>


                {/* =================================================
                    BODY
                ================================================= */}

                <TableBody>

                    {data.length === 0 ? (

                        <TableRow>

                            <TableCell
                                colSpan={7}
                                align="center"
                            >

                                <Box
                                    sx={{
                                        py: 6,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 1
                                    }}
                                >

                                    <FavoriteBorder
                                        sx={{
                                            fontSize: 50,
                                            color: "text.disabled"
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

                        data.map(
                            (item, index) => {

                                // =========================================
                                // FIELD VALUES
                                // =========================================

                                const wishlistItemId =
                                    getField(
                                        item,
                                        "wishlistItemId",
                                        "WishlistItemId",
                                        null
                                    );

                                const wishlistId =
                                    getField(
                                        item,
                                        "wishlistId",
                                        "WishlistId",
                                        "-"
                                    );

                                const sellerId =
                                    getField(
                                        item,
                                        "sellerId",
                                        "SellerId",
                                        "-"
                                    );

                                const customerId =
                                    getField(
                                        item,
                                        "customerId",
                                        "CustomerId",
                                        "-"
                                    );

                                const productId =
                                    getField(
                                        item,
                                        "productId",
                                        "ProductId",
                                        "-"
                                    );

                                const createdDate =
                                    getField(
                                        item,
                                        "createdDate",
                                        "CreatedDate",
                                        null
                                    );


                                // =========================================
                                // VALID ACTION ID
                                // =========================================

                                const actionId =
                                    Number(
                                        wishlistItemId
                                    );


                                const validActionId =
                                    Number.isInteger(
                                        actionId
                                    ) &&
                                    actionId > 0
                                        ? actionId
                                        : null;


                                // =========================================
                                // ROW
                                // =========================================

                                return (

                                    <TableRow
                                        hover
                                        key={
                                            validActionId ??
                                            `wishlist-item-${index}`
                                        }
                                    >

                                        {/* =================================
                                            WISHLIST ITEM ID
                                        ================================= */}

                                        <TableCell>

                                            <Typography
                                                fontWeight={600}
                                            >
                                                {validActionId
                                                    ? `#${validActionId}`
                                                    : "-"
                                                }
                                            </Typography>

                                        </TableCell>


                                        {/* =================================
                                            WISHLIST ID
                                        ================================= */}

                                        <TableCell>

                                            {wishlistId !== "-"
                                                ? (
                                                    <Chip
                                                        label={
                                                            `#${wishlistId}`
                                                        }
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                )
                                                : "-"
                                            }

                                        </TableCell>


                                        {/* =================================
                                            SELLER ID
                                        ================================= */}

                                        <TableCell>

                                            {sellerId}

                                        </TableCell>


                                        {/* =================================
                                            CUSTOMER ID
                                        ================================= */}

                                        <TableCell>

                                            {customerId}

                                        </TableCell>


                                        {/* =================================
                                            PRODUCT ID
                                        ================================= */}

                                        <TableCell>

                                            <Typography
                                                fontWeight={600}
                                            >

                                                {productId !== "-"
                                                    ? `#${productId}`
                                                    : "-"
                                                }

                                            </Typography>

                                        </TableCell>


                                        {/* =================================
                                            CREATED DATE
                                        ================================= */}

                                        <TableCell>

                                            <Typography
                                                variant="body2"
                                                whiteSpace="nowrap"
                                            >

                                                {formatDate(
                                                    createdDate
                                                )}

                                            </Typography>

                                        </TableCell>


                                        {/* =================================
                                            ACTIONS
                                        ================================= */}

                                        <TableCell
                                            align="center"
                                        >

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    gap: 0.5
                                                }}
                                            >

                                                {/* =========================
                                                    VIEW
                                                ========================= */}

                                                <Tooltip
                                                    title="View"
                                                >

                                                    <span>

                                                        <IconButton
                                                            size="small"
                                                            color="info"
                                                            disabled={
                                                                !validActionId
                                                            }
                                                            onClick={() =>
                                                                onView?.(
                                                                    validActionId
                                                                )
                                                            }
                                                        >

                                                            <Visibility
                                                                fontSize="small"
                                                            />

                                                        </IconButton>

                                                    </span>

                                                </Tooltip>


                                                {/* =========================
                                                    EDIT
                                                ========================= */}

                                                <Tooltip
                                                    title="Edit"
                                                >

                                                    <span>

                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            disabled={
                                                                !validActionId
                                                            }
                                                            onClick={() =>
                                                                onEdit?.(
                                                                    validActionId
                                                                )
                                                            }
                                                        >

                                                            <Edit
                                                                fontSize="small"
                                                            />

                                                        </IconButton>

                                                    </span>

                                                </Tooltip>


                                                {/* =========================
                                                    DELETE
                                                ========================= */}

                                                <Tooltip
                                                    title="Delete"
                                                >

                                                    <span>

                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            disabled={
                                                                !validActionId
                                                            }
                                                            onClick={() =>
                                                                onDelete?.(
                                                                    validActionId
                                                                )
                                                            }
                                                        >

                                                            <Delete
                                                                fontSize="small"
                                                            />

                                                        </IconButton>

                                                    </span>

                                                </Tooltip>

                                            </Box>

                                        </TableCell>

                                    </TableRow>

                                );

                            }
                        )

                    )}

                </TableBody>

            </Table>

        </TableContainer>

    );

};


export default WishlistItemTable;
