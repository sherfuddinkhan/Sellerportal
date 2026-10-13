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
    TablePagination,
    TableRow,
    Tooltip
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { getPutawayValue } from "./PutawayForm";

export default function PutawayTable({
    rows = [],
    page = 0,
    rowsPerPage = 10,
    totalCount = 0,
    onPageChange,
    onRowsPerPageChange,
    onView,
    onEdit,
    onDelete
}) {
    const statusColor = (status) => {
        switch (String(status || "").toLowerCase()) {
            case "completed":
                return "success";
            case "cancelled":
                return "error";
            case "inprogress":
            case "in progress":
                return "info";
            default:
                return "warning";
        }
    };

    return (
        <Paper variant="outlined">
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Putaway ID</TableCell>
                            <TableCell>Putaway Code</TableCell>
                            <TableCell>Facility</TableCell>
                            <TableCell>Shelf</TableCell>
                            <TableCell>SKU</TableCell>
                            <TableCell>Batch</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Inventory Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} align="center">
                                    No putaway records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row, index) => {
                                const id = getPutawayValue(
                                    row,
                                    "putawayId",
                                    index
                                );

                                const status = getPutawayValue(
                                    row,
                                    "statusCode",
                                    "Pending"
                                );

                                return (
                                    <TableRow hover key={id}>
                                        <TableCell>{id}</TableCell>
                                        <TableCell>
                                            {getPutawayValue(row, "putawayCode", "—")}
                                        </TableCell>
                                        <TableCell>
                                            {getPutawayValue(row, "facilityCode", "—")}
                                        </TableCell>
                                        <TableCell>
                                            {getPutawayValue(row, "shelfCode", "—")}
                                        </TableCell>
                                        <TableCell>
                                            {getPutawayValue(row, "itemTypeSkuCode", "—")}
                                        </TableCell>
                                        <TableCell>
                                            {getPutawayValue(row, "batchCode", "—")}
                                        </TableCell>
                                        <TableCell>
                                            {getPutawayValue(row, "putawayQuantity", 0)}
                                        </TableCell>
                                        <TableCell>
                                            {getPutawayValue(row, "inventoryType", "—")}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={status}
                                                color={statusColor(status)}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="View">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => onView(row)}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Edit">
                                                <IconButton
                                                    color="info"
                                                    onClick={() => onEdit(row)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Delete">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => onDelete(row)}
                                                >
                                                    <DeleteIcon />
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

            <TablePagination
                component="div"
                count={totalCount}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
            />
        </Paper>
    );
}

