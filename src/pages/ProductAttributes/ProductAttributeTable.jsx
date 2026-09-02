// =========================================================
// ProductAttributeTable.jsx
// Product Attribute Table
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
// COMPONENT
// =========================================================

const ProductAttributeTable = ({
    attributes = [],
    loading = false,
    onView,
    onEdit,
    onDelete
}) => {


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                    py: 6
                }}
            >
                <CircularProgress />
            </Box>
        );
    }


    // =====================================================
    // EMPTY STATE
    // =====================================================

    if (attributes.length === 0) {

        return (
            <Paper
                elevation={2}
                sx={{
                    p: 4,
                    borderRadius: 2
                }}
            >

                <Typography
                    align="center"
                    color="text.secondary"
                >
                    No Product Attributes Found
                </Typography>

            </Paper>
        );
    }


    // =====================================================
    // RENDER TABLE
    // =====================================================

    return (

        <TableContainer
            component={Paper}
            elevation={2}
            sx={{
                borderRadius: 2
            }}
        >

            <Table
                stickyHeader
            >

                {/* =================================================
                    TABLE HEADER
                ================================================= */}

                <TableHead>

                    <TableRow>

                        <TableCell>
                            ID
                        </TableCell>

                        <TableCell>
                            Product ID
                        </TableCell>

                        <TableCell>
                            Attribute Name
                        </TableCell>

                        <TableCell>
                            Attribute Value
                        </TableCell>

                        <TableCell>
                            Attribute Type
                        </TableCell>

                        <TableCell>
                            Required
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

                    {attributes.map((row) => {

                        // ==========================================
                        // SUPPORT BOTH JSON NAMING STYLES
                        // ==========================================

                        const id =
                            row.productAttributeId ??
                            row.ProductAttributeId;

                        const productId =
                            row.productId ??
                            row.ProductId;

                        const attributeName =
                            row.attributeName ??
                            row.AttributeName;

                        const attributeValue =
                            row.attributeValue ??
                            row.AttributeValue;

                        const attributeType =
                            row.attributeType ??
                            row.AttributeType;

                        const isRequired =
                            row.isRequired ??
                            row.IsRequired ??
                            false;

                        const isActive =
                            row.isActive ??
                            row.IsActive ??
                            false;


                        return (

                            <TableRow
                                key={id}
                                hover
                            >

                                {/* =================================
                                    ID
                                ================================= */}

                                <TableCell>
                                    {id ?? "-"}
                                </TableCell>


                                {/* =================================
                                    PRODUCT ID
                                ================================= */}

                                <TableCell>
                                    {productId ?? "-"}
                                </TableCell>


                                {/* =================================
                                    ATTRIBUTE NAME
                                ================================= */}

                                <TableCell>
                                    {attributeName || "-"}
                                </TableCell>


                                {/* =================================
                                    ATTRIBUTE VALUE
                                ================================= */}

                                <TableCell>
                                    {attributeValue || "-"}
                                </TableCell>


                                {/* =================================
                                    ATTRIBUTE TYPE
                                ================================= */}

                                <TableCell>
                                    {attributeType || "-"}
                                </TableCell>


                                {/* =================================
                                    REQUIRED
                                ================================= */}

                                <TableCell>

                                    <Chip
                                        label={
                                            isRequired
                                                ? "Yes"
                                                : "No"
                                        }
                                        color={
                                            isRequired
                                                ? "primary"
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

                                <TableCell align="center">

                                    {/* VIEW */}

                                    <Tooltip title="View">

                                        <IconButton
                                            color="primary"
                                            size="small"
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
                                            size="small"
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
                                            size="small"
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


export default ProductAttributeTable;
