import React from "react";

import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

const StockMovementTable = ({
    movements,
    onView,
    onEdit,
    onDelete
}) => {

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
                            Seller
                        </TableCell>

                        <TableCell>
                            Customer
                        </TableCell>

                        <TableCell>
                            Product
                        </TableCell>

                        <TableCell>
                            Warehouse
                        </TableCell>

                        <TableCell>
                            Movement Type
                        </TableCell>

                        <TableCell>
                            Quantity
                        </TableCell>

                        <TableCell>
                            Reference
                        </TableCell>

                        <TableCell>
                            Movement Date
                        </TableCell>

                        <TableCell align="center">
                            Actions
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {movements.length === 0 ? (

                        <TableRow>

                            <TableCell
                                colSpan={10}
                                align="center"
                            >

                                <Typography
                                    color="text.secondary"
                                    sx={{ py: 3 }}
                                >
                                    No stock movements found
                                </Typography>

                            </TableCell>

                        </TableRow>

                    ) : (

                        movements.map((movement) => {

                            const id =
                                movement.stockMovementId ??
                                movement.StockMovementId;

                            return (

                                <TableRow
                                    key={id}
                                    hover
                                >

                                    <TableCell>
                                        {id}
                                    </TableCell>

                                    <TableCell>
                                        {movement.sellerId ??
                                            movement.SellerId}
                                    </TableCell>

                                    <TableCell>
                                        {movement.customerId ??
                                            movement.CustomerId}
                                    </TableCell>

                                    <TableCell>
                                        {movement.productId ??
                                            movement.ProductId}
                                    </TableCell>

                                    <TableCell>
                                        {movement.warehouseId ??
                                            movement.WarehouseId}
                                    </TableCell>

                                    <TableCell>
                                        {movement.movementType ??
                                            movement.MovementType}
                                    </TableCell>

                                    <TableCell>
                                        {movement.quantity ??
                                            movement.Quantity}
                                    </TableCell>

                                    <TableCell>
                                        {movement.reference ??
                                            movement.Reference ??
                                            "-"}
                                    </TableCell>

                                    <TableCell>
                                        {
                                            movement.movementDate ??
                                            movement.MovementDate
                                                ? new Date(
                                                    movement.movementDate ??
                                                    movement.MovementDate
                                                ).toLocaleDateString()
                                                : "-"
                                        }
                                    </TableCell>

                                    <TableCell align="center">

                                        <Tooltip title="View">

                                            <IconButton
                                                color="primary"
                                                onClick={() =>
                                                    onView(id)
                                                }
                                            >
                                                <Visibility />
                                            </IconButton>

                                        </Tooltip>

                                        <Tooltip title="Edit">

                                            <IconButton
                                                color="warning"
                                                onClick={() =>
                                                    onEdit(id)
                                                }
                                            >
                                                <Edit />
                                            </IconButton>

                                        </Tooltip>

                                        <Tooltip title="Delete">

                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    onDelete(movement)
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
    );
};

export default StockMovementTable;