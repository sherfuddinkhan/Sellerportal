// =========================================================
// ProductImageTable.jsx
// Product Image Table
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
    IconButton,
    Chip,
    Tooltip,
    CircularProgress,
    Typography,
    Box
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

// =========================================================
// ProductImageTable
// =========================================================

const ProductImageTable = ({
    images = [],
    loading = false,
    onView,
    onEdit,
    onDelete
}) => {

    // =====================================================
    // Loading
    // =====================================================

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                    p: 5
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // =====================================================
    // Empty State
    // =====================================================

    if (!Array.isArray(images) || images.length === 0) {
        return (
            <Paper
                elevation={2}
                sx={{
                    p: 4
                }}
            >
                <Typography
                    align="center"
                    color="text.secondary"
                >
                    No Product Images Found
                </Typography>
            </Paper>
        );
    }

    // =====================================================
    // Helper
    // Supports both:
    //
    // ProductImageId
    // productImageId
    // =====================================================

    const getValue = (
        row,
        pascalCase,
        camelCase
    ) => {

        return (
            row?.[pascalCase] ??
            row?.[camelCase]
        );
    };

    // =====================================================
    // Boolean Helper
    //
    // Handles:
    // true
    // false
    // "true"
    // "false"
    // 1
    // 0
    // =====================================================

    const getBooleanValue = (
        value
    ) => {

        if (
            value === true ||
            value === 1 ||
            value === "true" ||
            value === "True" ||
            value === "TRUE"
        ) {
            return true;
        }

        return false;
    };

    // =====================================================
    // Format Image Size
    // =====================================================

    const formatImageSize = (
        size
    ) => {

        if (
            size === null ||
            size === undefined ||
            size === ""
        ) {
            return "-";
        }

        const numericSize = Number(size);

        if (Number.isNaN(numericSize)) {
            return size;
        }

        if (numericSize < 1024) {
            return `${numericSize} B`;
        }

        if (numericSize < 1024 * 1024) {
            return `${(
                numericSize / 1024
            ).toFixed(1)} KB`;
        }

        return `${(
            numericSize /
            (1024 * 1024)
        ).toFixed(2)} MB`;
    };

    // =====================================================
    // Render
    // =====================================================

    return (
        <TableContainer
            component={Paper}
            elevation={2}
            sx={{
                overflowX: "auto"
            }}
        >

            <Table
                stickyHeader
                sx={{
                    minWidth: 1300
                }}
            >

                {/* =================================================
                    TABLE HEADER
                ================================================= */}

                <TableHead>

                    <TableRow>

                        <TableCell>
                            Image ID
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
                            Image Name
                        </TableCell>

                        <TableCell>
                            Image Type
                        </TableCell>

                        <TableCell>
                            Image Size
                        </TableCell>

                        <TableCell>
                            URL
                        </TableCell>

                        <TableCell>
                            Display Order
                        </TableCell>

                        <TableCell>
                            Primary
                        </TableCell>

                        <TableCell>
                            Active
                        </TableCell>

                        <TableCell align="center">
                            Actions
                        </TableCell>

                    </TableRow>

                </TableHead>

                {/* =================================================
                    TABLE BODY
                ================================================= */}

                <TableBody>

                    {images.map(
                        (row, index) => {

                            // =====================================
                            // BASIC VALUES
                            // =====================================

                            const productImageId =
                                getValue(
                                    row,
                                    "ProductImageId",
                                    "productImageId"
                                );

                            const sellerId =
                                getValue(
                                    row,
                                    "SellerId",
                                    "sellerId"
                                );

                            const customerId =
                                getValue(
                                    row,
                                    "CustomerId",
                                    "customerId"
                                );

                            const productId =
                                getValue(
                                    row,
                                    "ProductId",
                                    "productId"
                                );

                            // =====================================
                            // IMAGE INFORMATION
                            // =====================================

                            const imageName =
                                getValue(
                                    row,
                                    "ImageName",
                                    "imageName"
                                );

                            const imageType =
                                getValue(
                                    row,
                                    "ImageType",
                                    "imageType"
                                );

                            const imageSize =
                                getValue(
                                    row,
                                    "ImageSize",
                                    "imageSize"
                                );

                            const imageUrl =
                                getValue(
                                    row,
                                    "ImageUrl",
                                    "imageUrl"
                                );

                            const displayOrder =
                                getValue(
                                    row,
                                    "DisplayOrder",
                                    "displayOrder"
                                );

                            // =====================================
                            // STATUS
                            // =====================================

                            const isPrimary =
                                getBooleanValue(
                                    getValue(
                                        row,
                                        "IsPrimary",
                                        "isPrimary"
                                    )
                                );

                            const isActive =
                                getBooleanValue(
                                    getValue(
                                        row,
                                        "IsActive",
                                        "isActive"
                                    )
                                );

                            // =====================================
                            // ROW
                            // =====================================

                            return (

                                <TableRow
                                    key={
                                        productImageId ??
                                        `product-image-${index}`
                                    }
                                    hover
                                >

                                    {/* =================================
                                        IMAGE ID
                                    ================================= */}

                                    <TableCell>
                                        {productImageId ?? "-"}
                                    </TableCell>

                                    {/* =================================
                                        SELLER ID
                                    ================================= */}

                                    <TableCell>
                                        {sellerId ?? "-"}
                                    </TableCell>

                                    {/* =================================
                                        CUSTOMER ID
                                    ================================= */}

                                    <TableCell>
                                        {customerId ?? "-"}
                                    </TableCell>

                                    {/* =================================
                                        PRODUCT ID
                                    ================================= */}

                                    <TableCell>
                                        {productId ?? "-"}
                                    </TableCell>

                                    {/* =================================
                                        IMAGE NAME
                                    ================================= */}

                                    <TableCell>

                                        {imageName ? (
                                            <Typography
                                                variant="body2"
                                                fontWeight={500}
                                            >
                                                {imageName}
                                            </Typography>
                                        ) : (
                                            "-"
                                        )}

                                    </TableCell>

                                    {/* =================================
                                        IMAGE TYPE
                                    ================================= */}

                                    <TableCell>

                                        {imageType ? (
                                            <Chip
                                                label={imageType}
                                                size="small"
                                                variant="outlined"
                                            />
                                        ) : (
                                            "-"
                                        )}

                                    </TableCell>

                                    {/* =================================
                                        IMAGE SIZE
                                    ================================= */}

                                    <TableCell>

                                        {formatImageSize(
                                            imageSize
                                        )}

                                    </TableCell>

                                    {/* =================================
                                        IMAGE URL
                                    ================================= */}

                                    <TableCell
                                        sx={{
                                            maxWidth: 250
                                        }}
                                    >

                                        {imageUrl ? (

                                            <Tooltip
                                                title={imageUrl}
                                            >

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        maxWidth: 250,
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace:
                                                            "nowrap"
                                                    }}
                                                >
                                                    {imageUrl}
                                                </Typography>

                                            </Tooltip>

                                        ) : (
                                            "-"
                                        )}

                                    </TableCell>

                                    {/* =================================
                                        DISPLAY ORDER
                                    ================================= */}

                                    <TableCell>
                                        {displayOrder ?? "-"}
                                    </TableCell>

                                    {/* =================================
                                        PRIMARY
                                    ================================= */}

                                    <TableCell>

                                        <Chip
                                            label={
                                                isPrimary
                                                    ? "Yes"
                                                    : "No"
                                            }
                                            color={
                                                isPrimary
                                                    ? "success"
                                                    : "default"
                                            }
                                            size="small"
                                        />

                                    </TableCell>

                                    {/* =================================
                                        ACTIVE
                                    ================================= */}

                                    <TableCell>

                                        <Chip
                                            label={
                                                isActive
                                                    ? "Active"
                                                    : "Inactive"
                                            }
                                            color={
                                                isActive
                                                    ? "success"
                                                    : "error"
                                            }
                                            size="small"
                                        />

                                    </TableCell>

                                    {/* =================================
                                        ACTIONS
                                    ================================= */}

                                    <TableCell
                                        align="center"
                                    >

                                        {/* =============================
                                            VIEW
                                        ============================== */}

                                        <Tooltip title="View">

                                            <IconButton
                                                color="primary"
                                                onClick={() =>
                                                    onView?.(row)
                                                }
                                            >

                                                <Visibility />

                                            </IconButton>

                                        </Tooltip>

                                        {/* =============================
                                            EDIT
                                        ============================== */}

                                        <Tooltip title="Edit">

                                            <IconButton
                                                color="warning"
                                                onClick={() =>
                                                    onEdit?.(row)
                                                }
                                            >

                                                <Edit />

                                            </IconButton>

                                        </Tooltip>

                                        {/* =============================
                                            DELETE
                                        ============================== */}

                                        <Tooltip title="Delete">

                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    onDelete?.(row)
                                                }
                                            >

                                                <Delete />

                                            </IconButton>

                                        </Tooltip>

                                    </TableCell>

                                </TableRow>
                            );
                        }
                    )}

                </TableBody>

            </Table>

        </TableContainer>
    );
};

export default ProductImageTable;