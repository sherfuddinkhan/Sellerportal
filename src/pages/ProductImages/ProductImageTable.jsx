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
    // Helpers
    // =====================================================

    const getValue = (row, pascalCase, camelCase) => {
        return row?.[pascalCase] ?? row?.[camelCase];
    };

    // =====================================================
    // Render
    // =====================================================

    return (
        <TableContainer
            component={Paper}
            elevation={2}
        >
            <Table>
                
                {/* =================================================
                    TABLE HEADER
                ================================================= */}

                <TableHead>
                    <TableRow>

                        <TableCell>
                            Image ID
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
                            URL
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

                    {images.map((row, index) => {

                        const productImageId =
                            getValue(
                                row,
                                "ProductImageId",
                                "productImageId"
                            );

                        const productId =
                            getValue(
                                row,
                                "ProductId",
                                "productId"
                            );

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

                        const imageUrl =
                            getValue(
                                row,
                                "ImageUrl",
                                "imageUrl"
                            );

                        const isPrimary =
                            getValue(
                                row,
                                "IsPrimary",
                                "isPrimary"
                            );

                        const isActive =
                            getValue(
                                row,
                                "IsActive",
                                "isActive"
                            );

                        return (
                            <TableRow
                                key={
                                    productImageId ??
                                    `product-image-${index}`
                                }
                                hover
                            >

                                {/* =====================================
                                    IMAGE ID
                                ===================================== */}

                                <TableCell>
                                    {productImageId ?? "-"}
                                </TableCell>

                                {/* =====================================
                                    PRODUCT ID
                                ===================================== */}

                                <TableCell>
                                    {productId ?? "-"}
                                </TableCell>

                                {/* =====================================
                                    IMAGE NAME
                                ===================================== */}

                                <TableCell>
                                    {imageName || "-"}
                                </TableCell>

                                {/* =====================================
                                    IMAGE TYPE
                                ===================================== */}

                                <TableCell>
                                    {imageType || "-"}
                                </TableCell>

                                {/* =====================================
                                    IMAGE URL
                                ===================================== */}

                                <TableCell
                                    sx={{
                                        maxWidth: 250,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    {imageUrl || "-"}
                                </TableCell>

                                {/* =====================================
                                    PRIMARY
                                ===================================== */}

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

                                {/* =====================================
                                    ACTIVE
                                ===================================== */}

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

                                {/* =====================================
                                    ACTIONS
                                ===================================== */}

                                <TableCell align="center">

                                    {/* VIEW */}

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

                                    {/* EDIT */}

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

                                    {/* DELETE */}

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
                    })}

                </TableBody>

            </Table>
        </TableContainer>
    );
};

export default ProductImageTable;
