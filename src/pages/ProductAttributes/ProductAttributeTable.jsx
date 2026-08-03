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

const ProductAttributeTable = ({

    attributes = [],

    loading,

    onView,

    onEdit,

    onDelete

}) => {

    if (loading) {

        return (

            <Box

                display="flex"

                justifyContent="center"

                mt={5}

            >

                <CircularProgress />

            </Box>

        );

    }

    if (attributes.length === 0) {

        return (

            <Paper

                sx={{ p: 4 }}

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

    return (

        <TableContainer

            component={Paper}

        >

            <Table>

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

                <TableBody>

                    {

                        attributes.map((row) => (

                            <TableRow

                                key={row.ProductAttributeId}

                                hover

                            >

                                <TableCell>

                                    {row.ProductAttributeId}

                                </TableCell>

                                <TableCell>

                                    {row.ProductId}

                                </TableCell>

                                <TableCell>

                                    {

                                        row.AttributeName ||

                                        "-"

                                    }

                                </TableCell>

                                <TableCell>

                                    {

                                        row.AttributeValue ||

                                        "-"

                                    }

                                </TableCell>

                                <TableCell>

                                    {

                                        row.AttributeType ||

                                        "-"

                                    }

                                </TableCell>

                                <TableCell>

                                    <Chip

                                        label={

                                            row.IsRequired

                                                ? "Yes"

                                                : "No"

                                        }

                                        color={

                                            row.IsRequired

                                                ? "primary"

                                                : "default"

                                        }

                                        size="small"

                                    />

                                </TableCell>

                                <TableCell>

                                    <Chip

                                        label={

                                            row.IsActive

                                                ? "Active"

                                                : "Inactive"

                                        }

                                        color={

                                            row.IsActive

                                                ? "success"

                                                : "error"

                                        }

                                        size="small"

                                    />

                                </TableCell>

                                <TableCell align="center">

                                    <Tooltip title="View">

                                        <IconButton

                                            color="primary"

                                            onClick={() =>

                                                onView(row)

                                            }

                                        >

                                            <Visibility />

                                        </IconButton>

                                    </Tooltip>

                                    <Tooltip title="Edit">

                                        <IconButton

                                            color="warning"

                                            onClick={() =>

                                                onEdit(row)

                                            }

                                        >

                                            <Edit />

                                        </IconButton>

                                    </Tooltip>

                                    <Tooltip title="Delete">

                                        <IconButton

                                            color="error"

                                            onClick={() =>

                                                onDelete(row)

                                            }

                                        >

                                            <Delete />

                                        </IconButton>

                                    </Tooltip>

                                </TableCell>

                            </TableRow>

                        ))

                    }

                </TableBody>

            </Table>

        </TableContainer>

    );

};

export default ProductAttributeTable;