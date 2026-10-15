import React from "react";

import {
    Box,
    Chip,
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

import VisibilityIcon
    from "@mui/icons-material/Visibility";

import EditIcon
    from "@mui/icons-material/Edit";

import DeleteIcon
    from "@mui/icons-material/Delete";

import InfoOutlinedIcon
    from "@mui/icons-material/InfoOutlined";


const InventoryAdjustmentsTable = ({
    items,
    onView,
    onDetails,
    onEdit,
    onDelete
}) => {

    const getValue = (
        item,
        camelCase,
        pascalCase
    ) => {

        return (
            item?.[camelCase] ??
            item?.[pascalCase] ??
            ""
        );

    };


    if (!items?.length) {

        return (

            <Paper
                sx={{
                    p: 4,
                    textAlign: "center"
                }}
            >

                <Typography
                    color="text.secondary"
                >
                    No inventory adjustments found.
                </Typography>

            </Paper>

        );

    }


    return (

        <TableContainer
            component={Paper}
            sx={{
                width: "100%",
                overflowX: "auto"
            }}
        >

            <Table
                size="small"
                stickyHeader
            >

                <TableHead>

                    <TableRow>

                        <TableCell>
                            ID
                        </TableCell>

                        <TableCell>
                            Seller
                        </TableCell>

                        <TableCell>
                            Product
                        </TableCell>

                        <TableCell>
                            Warehouse Location
                        </TableCell>

                        <TableCell>
                            Adjustment Type
                        </TableCell>

                        <TableCell align="right">
                            Quantity
                        </TableCell>

                        <TableCell align="right">
                            Previous
                        </TableCell>

                        <TableCell align="right">
                            New
                        </TableCell>

                        <TableCell>
                            Reason
                        </TableCell>

                        <TableCell>
                            Reference
                        </TableCell>

                        <TableCell>
                            Status
                        </TableCell>

                        <TableCell align="center">
                            Actions
                        </TableCell>

                    </TableRow>

                </TableHead>


                <TableBody>

                    {items.map((item, index) => {

                        const id =
                            getValue(
                                item,
                                "inventoryAdjustmentId",
                                "InventoryAdjustmentId"
                            );

                        const adjustmentType =
                            getValue(
                                item,
                                "adjustmentType",
                                "AdjustmentType"
                            );

                        const status =
                            getValue(
                                item,
                                "status",
                                "Status"
                            );

                        return (

                            <TableRow
                                key={
                                    id ||
                                    index
                                }
                                hover
                            >

                                <TableCell>
                                    {id}
                                </TableCell>

                                <TableCell>
                                    {getValue(
                                        item,
                                        "sellerId",
                                        "SellerId"
                                    )}
                                </TableCell>

                                <TableCell>
                                    {getValue(
                                        item,
                                        "productId",
                                        "ProductId"
                                    )}
                                </TableCell>

                                <TableCell>
                                    {getValue(
                                        item,
                                        "warehouseLocationId",
                                        "WarehouseLocationId"
                                    )}
                                </TableCell>

                                <TableCell>

                                    <Chip
                                        size="small"
                                        label={
                                            adjustmentType ||
                                            "-"
                                        }
                                        color={
                                            String(
                                                adjustmentType
                                            ).toUpperCase() ===
                                            "INCREASE"
                                                ? "success"
                                                : "warning"
                                        }
                                    />

                                </TableCell>

                                <TableCell align="right">
                                    {getValue(
                                        item,
                                        "quantity",
                                        "Quantity"
                                    )}
                                </TableCell>

                                <TableCell align="right">
                                    {getValue(
                                        item,
                                        "previousQuantity",
                                        "PreviousQuantity"
                                    )}
                                </TableCell>

                                <TableCell align="right">
                                    {getValue(
                                        item,
                                        "newQuantity",
                                        "NewQuantity"
                                    )}
                                </TableCell>

                                <TableCell>
                                    {getValue(
                                        item,
                                        "reason",
                                        "Reason"
                                    )}
                                </TableCell>

                                <TableCell>
                                    {getValue(
                                        item,
                                        "referenceNumber",
                                        "ReferenceNumber"
                                    )}
                                </TableCell>

                                <TableCell>

                                    <Chip
                                        size="small"
                                        label={
                                            status || "-"
                                        }
                                    />

                                </TableCell>

                                <TableCell align="center">

                                    <Tooltip title="View">

                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                onView(item)
                                            }
                                        >

                                            <VisibilityIcon
                                                fontSize="small"
                                            />

                                        </IconButton>

                                    </Tooltip>


                                    <Tooltip title="Details">

                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                onDetails(item)
                                            }
                                        >

                                            <InfoOutlinedIcon
                                                fontSize="small"
                                            />

                                        </IconButton>

                                    </Tooltip>


                                    <Tooltip title="Edit">

                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                onEdit(item)
                                            }
                                        >

                                            <EditIcon
                                                fontSize="small"
                                            />

                                        </IconButton>

                                    </Tooltip>


                                    <Tooltip title="Delete">

                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                onDelete(item)
                                            }
                                        >

                                            <DeleteIcon
                                                fontSize="small"
                                            />

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

export default InventoryAdjustmentsTable;
