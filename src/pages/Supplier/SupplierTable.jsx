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
    Box
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

const SupplierTable = ({
    suppliers,
    onView,
    onEdit,
    onDelete
}) => {

    if (!suppliers || suppliers.length === 0) {

        return (
            <Paper
                sx={{
                    p: 5,
                    textAlign: "center"
                }}
            >
                <Typography
                    variant="h6"
                    color="text.secondary"
                >
                    No Suppliers Found
                </Typography>
            </Paper>
        );
    }

    return (

        <TableContainer component={Paper}>

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Seller ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Supplier Name</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Contact Person</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Phone</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Email</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Actions</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {suppliers.map((supplier) => (

                        <TableRow
                            key={supplier.supplierId}
                            hover
                        >

                            <TableCell>
                                {supplier.supplierId}
                            </TableCell>

                            <TableCell>
                                {supplier.sellerId}
                            </TableCell>

                            <TableCell>
                                {supplier.supplierName || "-"}
                            </TableCell>

                            <TableCell>
                                {supplier.contactPerson || "-"}
                            </TableCell>

                            <TableCell>
                                {supplier.phone || "-"}
                            </TableCell>

                            <TableCell>
                                {supplier.email || "-"}
                            </TableCell>

                            <TableCell>

                                <Box
                                    display="flex"
                                    gap={0.5}
                                >

                                    <Tooltip title="View">

                                        <IconButton
                                            color="primary"
                                            onClick={() =>
                                                onView(
                                                    supplier.supplierId
                                                )
                                            }
                                        >
                                            <Visibility />
                                        </IconButton>

                                    </Tooltip>

                                    <Tooltip title="Edit">

                                        <IconButton
                                            color="warning"
                                            onClick={() =>
                                                onEdit(
                                                    supplier.supplierId
                                                )
                                            }
                                        >
                                            <Edit />
                                        </IconButton>

                                    </Tooltip>

                                    <Tooltip title="Delete">

                                        <IconButton
                                            color="error"
                                            onClick={() =>
                                                onDelete(
                                                    supplier.supplierId
                                                )
                                            }
                                        >
                                            <Delete />
                                        </IconButton>

                                    </Tooltip>

                                </Box>

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>

        </TableContainer>
    );
};

export default SupplierTable;