import React from "react";
import { useNavigate } from "react-router-dom";

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
    TablePagination,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

const field = (row, name) =>
    row?.[name] ??
    row?.[name.charAt(0).toUpperCase() + name.slice(1)] ??
    "—";

function MarketplaceCustomersTable({
    customers = [],
    page = 0,
    rowsPerPage = 10,
    totalCount,
    onPageChange,
    onRowsPerPageChange,
    onEdit,
    onDelete
}) {
    const navigate = useNavigate();

    const columns = [
        ["id", "ID"],
        ["sellerId", "Seller ID"],
        ["customerId", "Customer ID"],
        ["marketplaceName", "Marketplace"],
        ["marketplaceCustomerId", "Marketplace Customer ID"],
        ["companyName", "Company"],
        ["gstin", "GSTIN"],
        ["email", "Email"],
        ["phone", "Phone"],
        ["city", "City"],
        ["state", "State"]
    ];

    const handleViewDetails = (customer) => {
        const id = field(customer, "id");

        if (id === "—" || id === null || id === undefined) {
            return;
        }

        navigate(`/marketplace-customers/details/${id}`);
    };

    return (
        <Paper elevation={2} sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 650 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map(([name, label]) => (
                                <TableCell key={name}>
                                    <Typography fontWeight={700} noWrap>
                                        {label}
                                    </Typography>
                                </TableCell>
                            ))}

                            <TableCell align="center">
                                <Typography fontWeight={700}>
                                    Actions
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {customers.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + 1}
                                    align="center"
                                    sx={{ py: 5 }}
                                >
                                    No marketplace customers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers.map((customer, index) => {
                                const id = field(customer, "id");

                                return (
                                    <TableRow
                                        hover
                                        key={id !== "—" ? id : index}
                                    >
                                        {columns.map(([name]) => (
                                            <TableCell key={name}>
                                                {name === "marketplaceName" ? (
                                                    <Chip
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                        label={field(
                                                            customer,
                                                            name
                                                        )}
                                                    />
                                                ) : (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            maxWidth: 220,
                                                            overflowWrap:
                                                                "anywhere"
                                                        }}
                                                    >
                                                        {field(customer, name)}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                        ))}

                                        <TableCell align="center">
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    gap: 0.5
                                                }}
                                            >
                                                <Tooltip title="View Customer Details">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() =>
                                                            handleViewDetails(
                                                                customer
                                                            )
                                                        }
                                                        aria-label="View customer details"
                                                    >
                                                        <Visibility />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Edit Customer">
                                                    <IconButton
                                                        color="warning"
                                                        onClick={() =>
                                                            onEdit?.(customer)
                                                        }
                                                        aria-label="Edit customer"
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Delete Customer">
                                                    <IconButton
                                                        color="error"
                                                        onClick={() =>
                                                            onDelete?.(customer)
                                                        }
                                                        aria-label="Delete customer"
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
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
                count={totalCount ?? customers.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />
        </Paper>
    );
}

export default MarketplaceCustomersTable;
