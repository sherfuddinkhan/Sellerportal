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
    Tooltip,
    Chip,
    Typography
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

const MarketplaceTable = ({
    marketplaces = [],
    onDelete
}) => {
    const getId = (item) =>
        item.marketplaceId ?? item.MarketplaceId;

    const getName = (item) =>
        item.marketplaceName ??
        item.MarketplaceName ??
        "-";

    const getCode = (item) =>
        item.marketplaceCode ??
        item.MarketplaceCode ??
        "-";

    const getActive = (item) =>
        item.isActive ??
        item.IsActive ??
        false;

    if (!marketplaces.length) {
        return (
            <Paper sx={{ p: 5, textAlign: "center" }}>
                <Typography color="text.secondary">
                    No marketplaces found.
                </Typography>
            </Paper>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Code</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {marketplaces.map((item) => {
                        const id = getId(item);
                        const active = getActive(item);

                        return (
                            <TableRow key={id}>
                                <TableCell>{id}</TableCell>

                                <TableCell>
                                    <Typography fontWeight="bold">
                                        {getName(item)}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    {getCode(item)}
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
                                            color="primary"
                                            onClick={() =>
                                                window.location.href =
                                                    `/marketplaces/details/${id}`
                                            }
                                        >
                                            <Visibility />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Edit">
                                        <IconButton
                                            color="warning"
                                            onClick={() =>
                                                window.location.href =
                                                    `/marketplaces/edit/${id}`
                                            }
                                        >
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Delete">
                                        <IconButton
                                            color="error"
                                            onClick={() =>
                                                onDelete?.(id)
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

export default MarketplaceTable;