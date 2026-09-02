import React from "react";

import {
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

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";


const WarehouseLocationTable = ({
    locations = [],
    onView,
    onEdit,
    onDelete
}) => {

    if (!locations.length) {

        return (
            <Paper sx={{ p: 4 }}>

                <Typography
                    align="center"
                    color="text.secondary"
                >
                    No warehouse locations found.
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
                            Location Code
                        </TableCell>

                        <TableCell>
                            Location Name
                        </TableCell>

                        <TableCell>
                            Warehouse
                        </TableCell>

                        <TableCell>
                            Customer
                        </TableCell>

                        <TableCell>
                            Aisle
                        </TableCell>

                        <TableCell>
                            Rack
                        </TableCell>

                        <TableCell>
                            Shelf
                        </TableCell>

                        <TableCell>
                            Bin
                        </TableCell>

                        <TableCell>
                            Status
                        </TableCell>

                        <TableCell align="right">
                            Actions
                        </TableCell>

                    </TableRow>

                </TableHead>


                <TableBody>

                    {locations.map(location => {

                        const id =
                            location.LocationId ??
                            location.locationId;

                        const active =
                            Boolean(
                                location.IsActive ??
                                location.isActive
                            );

                        return (

                            <TableRow
                                key={id}
                                hover
                            >

                                <TableCell>
                                    {id}
                                </TableCell>

                                <TableCell>
                                    {location.LocationCode ??
                                        location.locationCode ??
                                        "-"}
                                </TableCell>

                                <TableCell>
                                    {location.LocationName ??
                                        location.locationName ??
                                        "-"}
                                </TableCell>

                                <TableCell>
                                    {location.WarehouseId ??
                                        location.warehouseId ??
                                        "-"}
                                </TableCell>

                                <TableCell>
                                    {location.CustomerId ??
                                        location.customerId ??
                                        "-"}
                                </TableCell>

                                <TableCell>
                                    {location.Aisle ??
                                        location.aisle ??
                                        "-"}
                                </TableCell>

                                <TableCell>
                                    {location.Rack ??
                                        location.rack ??
                                        "-"}
                                </TableCell>

                                <TableCell>
                                    {location.Shelf ??
                                        location.shelf ??
                                        "-"}
                                </TableCell>

                                <TableCell>
                                    {location.Bin ??
                                        location.bin ??
                                        "-"}
                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={
                                            active
                                                ? "Active"
                                                : "Inactive"
                                        }
                                        color={
                                            active
                                                ? "success"
                                                : "default"
                                        }
                                        size="small"
                                    />

                                </TableCell>

                                <TableCell align="right">

                                    <Tooltip title="View">

                                        <IconButton
                                            onClick={() =>
                                                onView(
                                                    location
                                                )
                                            }
                                        >
                                            <Visibility />
                                        </IconButton>

                                    </Tooltip>


                                    <Tooltip title="Edit">

                                        <IconButton
                                            onClick={() =>
                                                onEdit(
                                                    location
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
                                                    location
                                                )
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


export default WarehouseLocationTable;