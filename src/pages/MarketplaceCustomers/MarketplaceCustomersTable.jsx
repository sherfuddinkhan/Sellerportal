import React from "react";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Tooltip,
    Typography,
    Box
} from "@mui/material";

import {
    Visibility,
    InfoOutlined,
    EditOutlined,
    Delete as DeleteIcon
} from "@mui/icons-material";

// Read camelCase or PascalCase API properties
const getField = (row, name) => {
    const pascalName =
        name.charAt(0).toUpperCase() + name.slice(1);

    return row?.[name] ?? row?.[pascalName] ?? "—";
};

function MarketplaceCustomersTable({
    customers = [],
    page = 0,
    rowsPerPage = 10,
    totalCount,
    onPageChange,
    onRowsPerPageChange,
    onView,
    onDetails,
    onEdit,
    onDelete
}) {
    const columns = [
        { label: "ID", field: "id" },
        { label: "Seller ID", field: "sellerId" },
        { label: "Customer ID", field: "customerId" },
        { label: "Marketplace", field: "marketplaceName" },
        {
            label: "Marketplace Customer ID",
            field: "marketplaceCustomerId"
        },
        { label: "Company", field: "companyName" },
        { label: "GSTIN", field: "gstin" },
        { label: "Email", field: "email" },
        { label: "Phone", field: "phone" },
        { label: "Address", field: "address" },
        { label: "City", field: "city" },
        { label: "State", field: "state" },
        { label: "State Code", field: "stateCode" },
        { label: "Pincode", field: "pincode" },
        { label: "Created At", field: "createdAt" }
    ];

    return (
        <Paper elevation={2} sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 650 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.field}
                                    sx={{
                                        fontWeight: 700,
                                        whiteSpace: "nowrap",
                                        backgroundColor: "background.paper"
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}

                            <TableCell
                                align="center"
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap",
                                    backgroundColor: "background.paper"
                                }}
                            >
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {customers.length > 0 ? (
                            customers.map((customer, index) => (
                                <TableRow
                                    hover
                                    key={
                                        getField(customer, "id") !== "—"
                                            ? getField(customer, "id")
                                            : index
                                    }
                                >
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.field}
                                            sx={{
                                                whiteSpace: "nowrap",
                                                maxWidth: 260
                                            }}
                                        >
                                            {column.field === "createdAt" &&
                                            getField(customer, "createdAt") !== "—"
                                                ? new Date(
                                                      getField(customer, "createdAt")
                                                  ).toLocaleString()
                                                : getField(
                                                      customer,
                                                      column.field
                                                  )}
                                        </TableCell>
                                    ))}

                                    <TableCell align="center">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: 0.5
                                            }}
                                        >
                                            <Tooltip title="View">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() =>
                                                        onView?.(customer)
                                                    }
                                                >
                                                    <Visibility fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Details">
                                                <IconButton
                                                    size="small"
                                                    color="info"
                                                    onClick={() =>
                                                        onDetails?.(customer)
                                                    }
                                                >
                                                    <InfoOutlined fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Edit">
                                                <IconButton
                                                    size="small"
                                                    color="warning"
                                                    onClick={() =>
                                                        onEdit?.(customer)
                                                    }
                                                >
                                                    <EditOutlined fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() =>
                                                        onDelete?.(customer)
                                                    }
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + 1}
                                    align="center"
                                    sx={{ py: 5 }}
                                >
                                    <Typography color="text.secondary">
                                        No marketplace customers found.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={
                    totalCount !== undefined
                        ? totalCount
                        : customers.length
                }
                page={page}
                onPageChange={onPageChange ?? (() => {})}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={onRowsPerPageChange ?? (() => {})}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />
        </Paper>
    );
}

export default MarketplaceCustomersTable;

