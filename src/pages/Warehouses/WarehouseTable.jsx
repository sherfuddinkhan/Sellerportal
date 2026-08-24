import React from "react";
import {Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,IconButton,Chip,Tooltip,CircularProgress,Typography,Box} from "@mui/material";
import {Visibility,Edit,Delete} from "@mui/icons-material";
const WarehouseTable = ({
    warehouses = [],
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
    if (warehouses.length === 0) {
        return (
            <Paper sx={{ p: 4 }}>
                <Typography
                    align="center"
                    color="text.secondary"
                >
                    No Warehouses Found
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
                            Code
                        </TableCell>
                        <TableCell>
                            Warehouse Name
                        </TableCell>
                        <TableCell>
                            City
                        </TableCell>
                        <TableCell>
                            State
                        </TableCell>
                        <TableCell>
                            Contact Person
                        </TableCell>
                        <TableCell>
                            Phone
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
                    {
                        warehouses.map((row) => (
                            <TableRow key={row.WarehouseId}
                                hover
                            >
                                <TableCell>
                                    {row.WarehouseId}
                                </TableCell>
                                <TableCell>
                                    {row.WarehouseCode}
                                </TableCell>
                                <TableCell>
                                    {row.WarehouseName}
                                </TableCell>
                                <TableCell>
                                    {row.City || "-"}
                                </TableCell>
                                <TableCell>
                                    {row.State || "-"}
                                </TableCell>
                                <TableCell>
                                    {
                                        row.ContactPerson ||"-"
                                    }
                                </TableCell>
                                <TableCell>
                                    {row.Phone || "-"}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={
                                            row.IsActive ? "Active" : "Inactive"
                                        }
                                        color={
                                            row.IsActive ? "success"  : "error"
                                        }
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell
                                    align="center"
                                >
                                    <Tooltip
                                        title="View"
                                    >
                                        <IconButton
                                            color="primary"
                                            onClick={() =>
                                                onView(row)
                                            }
                                        >
                                            <Visibility />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip
                                        title="Edit"
                                    >
                                        <IconButton
                                            color="warning"
                                            onClick={() =>
                                                onEdit(row)
                                            }
                                        >
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip
                                        title="Delete"
                                    >
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

export default WarehouseTable;