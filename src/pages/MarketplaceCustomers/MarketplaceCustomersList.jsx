import React from "react";

import {
    Box,
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
    InfoOutlined,
    EditOutlined,
    Delete as DeleteIcon
} from "@mui/icons-material";

// =========================================================
// FIELD HELPER
// Supports both camelCase and PascalCase API responses
// =========================================================

const field = (row, name) => {
    if (!row) return "";

    const pascalName =
        name.charAt(0).toUpperCase() + name.slice(1);

    return row[name] ?? row[pascalName] ?? "";
};

// =========================================================
// MARKETPLACE CUSTOMERS LIST
// =========================================================

function MarketplaceCustomersList({
    customers = [],
    page = 0,
    rowsPerPage = 10,

    onPageChange,
    onRowsPerPageChange,

    onView,
    onDetails,
    onEdit,
    onDelete
}) {
    // =====================================================
    // PAGINATION
    // =====================================================

    const visibleCustomers = customers.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Paper
            variant="outlined"
            sx={{
                width: "100%",
                overflow: "hidden"
            }}
        >
            {/* =================================================
                HEADER
            ================================================= */}

            <Box sx={{ p: 2 }}>
                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    Marketplace Customers
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Total records: {customers.length}
                </Typography>
            </Box>

            {/* =================================================
                TABLE
            ================================================= */}

            <TableContainer
                sx={{
                    maxHeight: 600,
                    overflowX: "auto"
                }}
            >
                <Table
                    stickyHeader
                    size="small"
                >
                    {/* =================================================
                        TABLE HEADER
                    ================================================= */}

                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                ID
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Seller ID
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Customer ID
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Marketplace
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Marketplace Customer ID
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Company
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                GSTIN
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Email
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Phone
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Address
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                City
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                State
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                State Code
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Pincode
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Created At
                            </TableCell>

                            <TableCell
                                align="center"
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap",
                                    minWidth: 180
                                }}
                            >
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    {/* =================================================
                        TABLE BODY
                    ================================================= */}

                    <TableBody>
                        {visibleCustomers.map(
                            (row, index) => {

                                const id = field(
                                    row,
                                    "id"
                                );

                                return (
                                    <TableRow
                                        hover
                                        key={
                                            id ||
                                            `marketplace-customer-${index}`
                                        }
                                    >
                                        {/* ID */}

                                        <TableCell>
                                            {id}
                                        </TableCell>

                                        {/* SELLER ID */}

                                        <TableCell>
                                            {field(
                                                row,
                                                "sellerId"
                                            )}
                                        </TableCell>

                                        {/* CUSTOMER ID */}

                                        <TableCell>
                                            {field(
                                                row,
                                                "customerId"
                                            )}
                                        </TableCell>

                                        {/* MARKETPLACE */}

                                        <TableCell>
                                            {field(
                                                row,
                                                "marketplaceName"
                                            )}
                                        </TableCell>

                                        {/* MARKETPLACE CUSTOMER ID */}

                                        <TableCell>
                                            {field(
                                                row,
                                                "marketplaceCustomerId"
                                            )}
                                        </TableCell>

                                        {/* COMPANY */}

                                        <TableCell>
                                            {field(
                                                row,
                                                "companyName"
                                            )}
                                        </TableCell>

                                        {/* GSTIN */}

                                        <TableCell>
                                            {field(
                                                row,
                                                "gstin"
                                            )}
                                        </TableCell>

                                        {/* EMAIL */}

                                        <TableCell>
                                            {field(
                                                row,
                                                "email"
                                            )}
                                        </TableCell>

                                        {/* PHONE */}

                                        <TableCell>
                                            {field(
                                                row,
                                                "phone"
                                            )}
                                        </TableCell>

                                        {/* ADDRESS */}

                                        <TableCell>
                                            {field(
                                                row,
                                                "address"
                                            )}
                                        </TableCell>

                                        {/* CITY */}

                                        <TableCell>
                                            {field(
                                                row,
                                                "city"
                                            )}
                                        </TableCell>

                                        {/* STATE */}

                                        <TableCell>
                                            {field(
                                                row,
                                                "state"
                                            )}
                                        </TableCell>

                                        {/* STATE CODE */}

                                        <TableCell>
                                            {field(
                                                row,
                                                "stateCode"
                                            )}
                                        </TableCell>

                                        {/* PINCODE */}

                                        <TableCell>
                                            {field(
                                                row,
                                                "pincode"
                                            )}
                                        </TableCell>

                                        {/* CREATED AT */}

                                        <TableCell
                                            sx={{
                                                whiteSpace:
                                                    "nowrap"
                                            }}
                                        >
                                            {field(
                                                row,
                                                "createdAt"
                                            )
                                                ? new Date(
                                                      field(
                                                          row,
                                                          "createdAt"
                                                      )
                                                  ).toLocaleString()
                                                : ""}
                                        </TableCell>

                                        {/* =================================================
                                            ACTIONS
                                        ================================================= */}

                                        <TableCell
                                            align="center"
                                            sx={{
                                                whiteSpace:
                                                    "nowrap",
                                                minWidth: 180
                                            }}
                                        >
                                            {/* VIEW */}

                                            <Tooltip title="View">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() =>
                                                        onView &&
                                                        onView(row)
                                                    }
                                                >
                                                    <Visibility fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            {/* DETAILS */}

                                            <Tooltip title="Details">
                                                <IconButton
                                                    size="small"
                                                    color="info"
                                                    onClick={() =>
                                                        onDetails &&
                                                        onDetails(row)
                                                    }
                                                >
                                                    <InfoOutlined fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            {/* EDIT */}

                                            <Tooltip title="Edit">
                                                <IconButton
                                                    size="small"
                                                    color="success"
                                                    onClick={() =>
                                                        onEdit &&
                                                        onEdit(row)
                                                    }
                                                >
                                                    <EditOutlined fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            {/* DELETE */}

                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() =>
                                                        onDelete &&
                                                        onDelete(row)
                                                    }
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                        )}

                        {/* =================================================
                            NO RECORDS
                        ================================================= */}

                        {visibleCustomers.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={17}
                                    align="center"
                                    sx={{
                                        py: 5
                                    }}
                                >
                                    <Typography
                                        color="text.secondary"
                                    >
                                        No marketplace
                                        customers found.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* =================================================
                PAGINATION
            ================================================= */}

            <TablePagination
                component="div"
                count={customers.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={
                    onPageChange
                }
                onRowsPerPageChange={
                    onRowsPerPageChange
                }
                rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    50
                ]}
            />
        </Paper>
    );
}

export default MarketplaceCustomersList;
