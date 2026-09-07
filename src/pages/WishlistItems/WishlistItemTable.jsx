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
    DeleteOutline,
    FavoriteBorder
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
   WISHLIST ITEM TABLE
========================================================= */

const WishlistItemTable = ({
    items = [],
    wishlistItems = [],

    onView,
    onEdit,
    onDelete
}) => {

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
                borderRadius: 2,
                overflow: "auto"
            }}
        >

            <Table
                stickyHeader
                size="small"
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
                            Product
                        </TableCell>

                        <TableCell>
                            Product ID
                        </TableCell>

                        <TableCell align="right">
                            Quantity
                        </TableCell>

                        <TableCell align="right">
                            Price
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
                                    >
                                        No wishlist items found.
                                    </Typography>

                                </Box>

                            </TableCell>

                        </TableRow>

                    ) : (

                        data.map((item, index) => {

                            const wishlistItemId =
                                item?.wishlistItemId ??
                                item?.WishlistItemId ??
                                item?.id ??
                                index;

                            const wishlistId =
                                item?.wishlistId ??
                                item?.WishlistId ??
                                "-";

                            const productId =
                                item?.productId ??
                                item?.ProductId ??
                                "-";

                            const productName =
                                item?.productName ??
                                item?.ProductName ??
                                item?.name ??
                                item?.Name ??
                                `Product #${productId}`;

                            const productCode =
                                item?.productCode ??
                                item?.ProductCode ??
                                "";

                            const quantity =
                                item?.quantity ??
                                item?.Quantity ??
                                0;

                            const price =
                                item?.price ??
                                item?.Price ??
                                0;

                            const status =
                                item?.status ??
                                item?.Status ??
                                "Active";


                            return (

                                <TableRow
                                    hover
                                    key={wishlistItemId}
                                >

                                    <TableCell>
                                        <Typography
                                            fontWeight={600}
                                        >
                                            #{wishlistItemId}
                                        </Typography>
                                    </TableCell>


                                    <TableCell>
                                        {wishlistId}
                                    </TableCell>


                                    <TableCell>

                                        <Box>

                                            <Typography
                                                fontWeight={600}
                                            >
                                                {productName}
                                            </Typography>

                                            {productCode && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    SKU: {productCode}
                                                </Typography>
                                            )}

                                        </Box>

                                    </TableCell>


                                    <TableCell>
                                        {productId}
                                    </TableCell>


                                    <TableCell align="right">
                                        {formatNumber(quantity)}
                                    </TableCell>


                                    <TableCell align="right">
                                        <Typography
                                            fontWeight={600}
                                        >
                                            {formatCurrency(price)}
                                        </Typography>
                                    </TableCell>


                                    <TableCell>

                                        <Chip
                                            size="small"
                                            label={status}
                                            color={
                                                String(status).toLowerCase() === "active"
                                                    ? "success"
                                                    : "default"
                                            }
                                        />

                                    </TableCell>


                                    <TableCell align="center">

                                        <Tooltip title="View">

                                            <IconButton
                                                size="small"
                                                color="info"
                                                onClick={() =>
                                                    onView?.(item)
                                                }
                                            >
                                                <Visibility />
                                            </IconButton>

                                        </Tooltip>


                                        <Tooltip title="Edit">

                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() =>
                                                    onEdit?.(item)
                                                }
                                            >
                                                <Edit />
                                            </IconButton>

                                        </Tooltip>


                                        <Tooltip title="Delete">

                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() =>
                                                    onDelete?.(item)
                                                }
                                            >
                                                <DeleteOutline />
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
    );
};


export default WishlistItemTable;