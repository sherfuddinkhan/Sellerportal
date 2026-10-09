import React from "react";

import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    CircularProgress,
    Avatar,
    Stack
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    Person,
    Email,
    Phone,
    Business,
    Star
} from "@mui/icons-material";

/* =========================================================
   SAFE VALUE
========================================================= */

const getValue = (obj, ...keys) => {
    for (const key of keys) {
        const value = obj?.[key];

        if (value !== undefined && value !== null && value !== "") {
            return value;
        }
    }

    return null;
};

/* =========================================================
   STATUS HELPER
========================================================= */

const isTrue = (value) =>
    value === true ||
    value === 1 ||
    String(value).toLowerCase() === "true" ||
    String(value).toLowerCase() === "active";

/* =========================================================
   SUPPLIER CONTACT TABLE
========================================================= */

const SupplierContactTable = ({
    supplierContacts = [],
    contacts,
    loading = false,
    page = 0,
    rowsPerPage = 10,
    totalCount,
    onPageChange,
    onRowsPerPageChange,
    onView,
    onEdit,
    onDelete,
    emptyMessage = "No supplier contacts found."
}) => {
    const data = Array.isArray(contacts)
        ? contacts
        : Array.isArray(supplierContacts)
            ? supplierContacts
            : [];

    const count = Number.isFinite(Number(totalCount))
        ? Number(totalCount)
        : data.length;

    /* =====================================================
       PAGINATION
    ===================================================== */

    const handlePageChange = (event, newPage) => {
        if (typeof onPageChange === "function") {
            onPageChange(newPage);
        }
    };

    const handleRowsPerPageChange = (event) => {
        if (typeof onRowsPerPageChange === "function") {
            onRowsPerPageChange(Number(event.target.value));
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Paper
            elevation={2}
            sx={{
                width: "100%",
                overflow: "hidden",
                borderRadius: 3
            }}
        >
            {/* TABLE HEADER */}

            <Box
                sx={{
                    px: 2.5,
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    flexWrap: "wrap"
                }}
            >
                <Box>
                    <Typography variant="h6" fontWeight={700}>
                        Supplier Contact List
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        View and manage supplier contacts
                    </Typography>
                </Box>

                <Chip
                    label={`${count} contact${count === 1 ? "" : "s"}`}
                    color="primary"
                    variant="outlined"
                />
            </Box>

            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader size="medium">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Contact
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Supplier
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Designation
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Contact Details
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Primary
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Status
                            </TableCell>

                            <TableCell
                                align="center"
                                sx={{ fontWeight: 700 }}
                            >
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {/* LOADING */}

                        {loading && (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    align="center"
                                    sx={{ py: 6 }}
                                >
                                    <CircularProgress size={32} />

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mt: 1.5 }}
                                    >
                                        Loading supplier contacts...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}

                        {/* EMPTY STATE */}

                        {!loading && data.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    align="center"
                                    sx={{ py: 7 }}
                                >
                                    <Person
                                        sx={{
                                            fontSize: 46,
                                            color: "text.disabled",
                                            mb: 1
                                        }}
                                    />

                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={600}
                                    >
                                        {emptyMessage}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Add a supplier contact or adjust your search.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}

                        {/* CONTACT ROWS */}

                        {!loading &&
                            data.map((contact, index) => {
                                const id = getValue(
                                    contact,
                                    "supplierContactId",
                                    "SupplierContactId",
                                    "id",
                                    "Id"
                                );

                                const name = getValue(
                                    contact,
                                    "contactName",
                                    "ContactName",
                                    "name",
                                    "Name"
                                ) || "Unnamed Contact";

                                const supplierName = getValue(
                                    contact,
                                    "supplierName",
                                    "SupplierName"
                                ) || "N/A";

                                const designation = getValue(
                                    contact,
                                    "designation",
                                    "Designation",
                                    "jobTitle",
                                    "JobTitle",
                                    "position",
                                    "Position"
                                ) || "N/A";

                                const department = getValue(
                                    contact,
                                    "department",
                                    "Department"
                                );

                                const email = getValue(
                                    contact,
                                    "email",
                                    "Email",
                                    "emailAddress",
                                    "EmailAddress"
                                );

                                const phone = getValue(
                                    contact,
                                    "phoneNumber",
                                    "PhoneNumber",
                                    "phone",
                                    "Phone",
                                    "mobileNumber",
                                    "MobileNumber"
                                );

                                const isPrimary = isTrue(
                                    getValue(
                                        contact,
                                        "isPrimary",
                                        "IsPrimary"
                                    )
                                );

                                const rawStatus = getValue(
                                    contact,
                                    "isActive",
                                    "IsActive",
                                    "status",
                                    "Status"
                                );

                                const active = rawStatus === null
                                    ? null
                                    : isTrue(rawStatus);

                                return (
                                    <TableRow
                                        key={id ?? `contact-${index}`}
                                        hover
                                        sx={{
                                            "&:last-child td": {
                                                borderBottom: 0
                                            }
                                        }}
                                    >
                                        {/* CONTACT */}

                                        <TableCell sx={{ minWidth: 200 }}>
                                            <Stack
                                                direction="row"
                                                spacing={1.5}
                                                alignItems="center"
                                            >
                                                <Avatar
                                                    sx={{
                                                        bgcolor: "primary.light",
                                                        color: "primary.dark",
                                                        width: 40,
                                                        height: 40
                                                    }}
                                                >
                                                    <Person />
                                                </Avatar>

                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={700}
                                                    >
                                                        {name}
                                                    </Typography>

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        ID: {id ?? "N/A"}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>

                                        {/* SUPPLIER */}

                                        <TableCell sx={{ minWidth: 160 }}>
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                            >
                                                <Business
                                                    fontSize="small"
                                                    color="action"
                                                />

                                                <Typography variant="body2">
                                                    {supplierName}
                                                </Typography>
                                            </Stack>
                                        </TableCell>

                                        {/* DESIGNATION */}

                                        <TableCell sx={{ minWidth: 150 }}>
                                            <Typography variant="body2">
                                                {designation}
                                            </Typography>

                                            {department && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {department}
                                                </Typography>
                                            )}
                                        </TableCell>

                                        {/* CONTACT DETAILS */}

                                        <TableCell sx={{ minWidth: 220 }}>
                                            <Stack spacing={0.75}>
                                                {email ? (
                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        alignItems="center"
                                                    >
                                                        <Email
                                                            sx={{
                                                                fontSize: 16,
                                                                color: "text.secondary"
                                                            }}
                                                        />

                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                overflowWrap: "anywhere"
                                                            }}
                                                        >
                                                            {email}
                                                        </Typography>
                                                    </Stack>
                                                ) : (
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        No email
                                                    </Typography>
                                                )}

                                                {phone ? (
                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        alignItems="center"
                                                    >
                                                        <Phone
                                                            sx={{
                                                                fontSize: 16,
                                                                color: "text.secondary"
                                                            }}
                                                        />

                                                        <Typography variant="body2">
                                                            {phone}
                                                        </Typography>
                                                    </Stack>
                                                ) : (
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        No phone number
                                                    </Typography>
                                                )}
                                            </Stack>
                                        </TableCell>

                                        {/* PRIMARY CONTACT */}

                                        <TableCell>
                                            <Chip
                                                size="small"
                                                icon={
                                                    isPrimary
                                                        ? <Star />
                                                        : undefined
                                                }
                                                label={
                                                    isPrimary
                                                        ? "Primary"
                                                        : "Standard"
                                                }
                                                color={
                                                    isPrimary
                                                        ? "warning"
                                                        : "default"
                                                }
                                                variant={
                                                    isPrimary
                                                        ? "filled"
                                                        : "outlined"
                                                }
                                            />
                                        </TableCell>

                                        {/* STATUS */}

                                        <TableCell>
                                            {active === null ? (
                                                <Chip
                                                    size="small"
                                                    label="Unknown"
                                                    variant="outlined"
                                                />
                                            ) : (
                                                <Chip
                                                    size="small"
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
                                                />
                                            )}
                                        </TableCell>

                                        {/* ACTIONS */}

                                        <TableCell align="center">
                                            <Stack
                                                direction="row"
                                                spacing={0.25}
                                                justifyContent="center"
                                            >
                                                <Tooltip title="View contact">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() =>
                                                            onView?.(contact)
                                                        }
                                                        disabled={
                                                            typeof onView !== "function"
                                                        }
                                                        aria-label={`View ${name}`}
                                                    >
                                                        <Visibility fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Edit contact">
                                                    <IconButton
                                                        size="small"
                                                        color="info"
                                                        onClick={() =>
                                                            onEdit?.(contact)
                                                        }
                                                        disabled={
                                                            typeof onEdit !== "function"
                                                        }
                                                        aria-label={`Edit ${name}`}
                                                    >
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Delete contact">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() =>
                                                            onDelete?.(contact)
                                                        }
                                                        disabled={
                                                            typeof onDelete !== "function"
                                                        }
                                                        aria-label={`Delete ${name}`}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* PAGINATION */}

            <TablePagination
                component="div"
                count={count}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25, 50]}
                disabled={loading}
            />
        </Paper>
    );
};

export default SupplierContactTable;

