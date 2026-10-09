import React, { useMemo, useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Typography,
    Box,
    Chip,
    CircularProgress,
    TablePagination
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    LocationOn,
    Person,
    Phone,
    Email,
    Home,
    Business
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getField = (object, ...keys) => {
    if (!object || typeof object !== "object") {
        return undefined;
    }

    for (const key of keys) {
        if (
            object[key] !== undefined &&
            object[key] !== null &&
            object[key] !== ""
        ) {
            return object[key];
        }
    }

    return undefined;
};

/* =========================================================
   FORMAT TEXT
========================================================= */

const formatText = (value, fallback = "—") => {
    if (value === undefined || value === null || value === "") {
        return fallback;
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    return String(value);
};

/* =========================================================
   GET STATUS CONFIGURATION
========================================================= */

const getStatusConfig = (status) => {
    const normalized = String(status || "")
        .trim()
        .toLowerCase()
        .replace(/[_-]/g, " ");

    if (
        normalized === "active" ||
        normalized === "approved" ||
        normalized === "verified"
    ) {
        return {
            label: status,
            color: "success"
        };
    }

    if (
        normalized === "inactive" ||
        normalized === "disabled" ||
        normalized === "rejected"
    ) {
        return {
            label: status,
            color: "error"
        };
    }

    if (
        normalized === "pending" ||
        normalized === "processing"
    ) {
        return {
            label: status,
            color: "warning"
        };
    }

    return {
        label: formatText(status, "Unknown"),
        color: "default"
    };
};

/* =========================================================
   GET ADDRESS ID
========================================================= */

const getAddressId = (address) =>
    getField(
        address,
        "reversePickupAddressId",
        "ReversePickupAddressId",
        "addressId",
        "AddressId",
        "id",
        "Id"
    );

/* =========================================================
   GET FULL ADDRESS
========================================================= */

const getFullAddress = (address) => {
    const parts = [
        getField(
            address,
            "addressLine1",
            "AddressLine1",
            "streetAddress",
            "StreetAddress",
            "address",
            "Address"
        ),
        getField(
            address,
            "addressLine2",
            "AddressLine2",
            "landmark",
            "Landmark"
        ),
        getField(address, "city", "City"),
        getField(
            address,
            "state",
            "State",
            "stateName",
            "StateName"
        ),
        getField(
            address,
            "postalCode",
            "PostalCode",
            "zipCode",
            "ZipCode",
            "pinCode",
            "PinCode"
        ),
        getField(
            address,
            "country",
            "Country",
            "countryName",
            "CountryName"
        )
    ];

    return parts
        .filter(
            (part) =>
                part !== undefined &&
                part !== null &&
                String(part).trim() !== ""
        )
        .join(", ");
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = ({ message }) => (
    <TableRow>
        <TableCell colSpan={9} align="center" sx={{ py: 7 }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1
                }}
            >
                <LocationOn
                    sx={{
                        fontSize: 48,
                        color: "text.disabled"
                    }}
                />

                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="text.secondary"
                >
                    {message}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.disabled"
                >
                    Address records will appear here when available.
                </Typography>
            </Box>
        </TableCell>
    </TableRow>
);

/* =========================================================
   MAIN TABLE COMPONENT
========================================================= */

const ReversePickupAddressTable = ({
    addresses = [],
    data,
    loading = false,
    onView,
    onEdit,
    onDelete,
    onViewAddress,
    onEditAddress,
    onDeleteAddress,
    emptyMessage = "No reverse pickup addresses found",
    rowsPerPageOptions = [5, 10, 25, 50],
    initialRowsPerPage = 10,
    showPagination = true,
    page: externalPage,
    rowsPerPage: externalRowsPerPage,
    totalCount,
    onPageChange,
    onRowsPerPageChange,
    paginationMode = "client"
}) => {
    const sourceData = Array.isArray(data)
        ? data
        : Array.isArray(addresses)
            ? addresses
            : [];

    const [internalPage, setInternalPage] = useState(0);
    const [internalRowsPerPage, setInternalRowsPerPage] =
        useState(initialRowsPerPage);

    const isControlledPage = externalPage !== undefined;
    const isControlledRowsPerPage =
        externalRowsPerPage !== undefined;

    const page = isControlledPage
        ? Math.max(0, Number(externalPage) || 0)
        : internalPage;

    const rowsPerPage = isControlledRowsPerPage
        ? Math.max(1, Number(externalRowsPerPage) || initialRowsPerPage)
        : internalRowsPerPage;

    const isServerPagination = paginationMode === "server";

    const resolvedTotalCount =
        isServerPagination && totalCount !== undefined
            ? Math.max(0, Number(totalCount) || 0)
            : sourceData.length;

    /* -----------------------------------------------------
       RESET PAGE WHEN DATA SIZE CHANGES
    ----------------------------------------------------- */

    React.useEffect(() => {
        if (!isControlledPage) {
            setInternalPage(0);
        }
    }, [sourceData.length, isControlledPage]);

    /* -----------------------------------------------------
       PAGINATE DATA
    ----------------------------------------------------- */

    const visibleAddresses = useMemo(() => {
        if (!showPagination || isServerPagination) {
            return sourceData;
        }

        const startIndex = page * rowsPerPage;

        return sourceData.slice(
            startIndex,
            startIndex + rowsPerPage
        );
    }, [
        sourceData,
        showPagination,
        isServerPagination,
        page,
        rowsPerPage
    ]);

    /* -----------------------------------------------------
       PAGE CHANGE
    ----------------------------------------------------- */

    const handlePageChange = (event, newPage) => {
        if (onPageChange) {
            onPageChange(newPage);
        }

        if (!isControlledPage) {
            setInternalPage(newPage);
        }
    };

    /* -----------------------------------------------------
       ROWS PER PAGE CHANGE
    ----------------------------------------------------- */

    const handleRowsPerPageChange = (event) => {
        const newRowsPerPage = Number(event.target.value);
        const newPage = 0;

        if (onRowsPerPageChange) {
            onRowsPerPageChange(newRowsPerPage);
        }

        if (!isControlledRowsPerPage) {
            setInternalRowsPerPage(newRowsPerPage);
        }

        if (onPageChange) {
            onPageChange(newPage);
        }

        if (!isControlledPage) {
            setInternalPage(newPage);
        }
    };

    /* -----------------------------------------------------
       ACTION HANDLERS
    ----------------------------------------------------- */

    const handleView = onViewAddress || onView;
    const handleEdit = onEditAddress || onEdit;
    const handleDelete = onDeleteAddress || onDelete;

    /* -----------------------------------------------------
       RENDER
    ----------------------------------------------------- */

    return (
        <Box sx={{ width: "100%", minWidth: 0 }}>
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    width: "100%",
                    overflowX: "auto",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2
                }}
            >
                <Table
                    stickyHeader
                    aria-label="Reverse pickup addresses table"
                    size="medium"
                >
                    {/* TABLE HEADER */}

                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Address ID
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Recipient
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Address
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                City / State
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Postal Code
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Contact
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Status
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Default
                            </TableCell>

                            <TableCell
                                align="center"
                                sx={{ fontWeight: 700 }}
                            >
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    {/* TABLE BODY */}

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={9}
                                    align="center"
                                    sx={{ py: 7 }}
                                >
                                    <CircularProgress size={32} />

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mt: 2 }}
                                    >
                                        Loading reverse pickup addresses...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : visibleAddresses.length === 0 ? (
                            <EmptyState message={emptyMessage} />
                        ) : (
                            visibleAddresses.map((address, index) => {
                                const addressId = getAddressId(address);

                                const rowKey =
                                    addressId ??
                                    `reverse-pickup-address-${page}-${index}`;

                                const recipient = getField(
                                    address,
                                    "customerName",
                                    "CustomerName",
                                    "contactName",
                                    "ContactName",
                                    "recipientName",
                                    "RecipientName",
                                    "name",
                                    "Name"
                                );

                                const company = getField(
                                    address,
                                    "companyName",
                                    "CompanyName",
                                    "businessName",
                                    "BusinessName"
                                );

                                const fullAddress =
                                    getFullAddress(address);

                                const city = getField(
                                    address,
                                    "city",
                                    "City"
                                );

                                const state = getField(
                                    address,
                                    "state",
                                    "State",
                                    "stateName",
                                    "StateName"
                                );

                                const postalCode = getField(
                                    address,
                                    "postalCode",
                                    "PostalCode",
                                    "zipCode",
                                    "ZipCode",
                                    "pinCode",
                                    "PinCode"
                                );

                                const phone = getField(
                                    address,
                                    "phone",
                                    "Phone",
                                    "phoneNumber",
                                    "PhoneNumber",
                                    "mobile",
                                    "Mobile"
                                );

                                const email = getField(
                                    address,
                                    "email",
                                    "Email",
                                    "emailAddress",
                                    "EmailAddress"
                                );

                                const status = getField(
                                    address,
                                    "status",
                                    "Status"
                                );

                                const isDefault = getField(
                                    address,
                                    "isDefault",
                                    "IsDefault",
                                    "defaultAddress",
                                    "DefaultAddress"
                                );

                                const statusConfig =
                                    getStatusConfig(status);

                                return (
                                    <TableRow
                                        hover
                                        key={rowKey}
                                    >
                                        {/* ADDRESS ID */}

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: "primary.main"
                                                }}
                                            >
                                                {formatText(addressId)}
                                            </Typography>
                                        </TableCell>

                                        {/* RECIPIENT */}

                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    gap: 1
                                                }}
                                            >
                                                <Person
                                                    fontSize="small"
                                                    color="action"
                                                    sx={{ mt: 0.2 }}
                                                />

                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontWeight: 600,
                                                            overflowWrap: "anywhere"
                                                        }}
                                                    >
                                                        {formatText(recipient)}
                                                    </Typography>

                                                    {company && (
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            sx={{
                                                                display: "block",
                                                                overflowWrap: "anywhere"
                                                            }}
                                                        >
                                                            {company}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        {/* ADDRESS */}

                                        <TableCell sx={{ minWidth: 220 }}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    gap: 1
                                                }}
                                            >
                                                <Home
                                                    fontSize="small"
                                                    color="action"
                                                    sx={{ mt: 0.2 }}
                                                />

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        maxWidth: 320,
                                                        whiteSpace: "normal",
                                                        overflowWrap: "anywhere"
                                                    }}
                                                >
                                                    {formatText(fullAddress)}
                                                </Typography>
                                            </Box>
                                        </TableCell>

                                        {/* CITY / STATE */}

                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 0.5
                                                }}
                                            >
                                                <Typography variant="body2">
                                                    {formatText(city)}
                                                </Typography>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {formatText(state)}
                                                </Typography>
                                            </Box>
                                        </TableCell>

                                        {/* POSTAL CODE */}

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{ fontWeight: 500 }}
                                            >
                                                {formatText(postalCode)}
                                            </Typography>
                                        </TableCell>

                                        {/* CONTACT */}

                                        <TableCell sx={{ minWidth: 170 }}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 0.75
                                                }}
                                            >
                                                {phone && (
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 0.75
                                                        }}
                                                    >
                                                        <Phone
                                                            sx={{
                                                                fontSize: 15,
                                                                color: "text.secondary"
                                                            }}
                                                        />

                                                        <Typography
                                                            variant="caption"
                                                            sx={{ overflowWrap: "anywhere" }}
                                                        >
                                                            {phone}
                                                        </Typography>
                                                    </Box>
                                                )}

                                                {email && (
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 0.75
                                                        }}
                                                    >
                                                        <Email
                                                            sx={{
                                                                fontSize: 15,
                                                                color: "text.secondary"
                                                            }}
                                                        />

                                                        <Typography
                                                            variant="caption"
                                                            sx={{ overflowWrap: "anywhere" }}
                                                        >
                                                            {email}
                                                        </Typography>
                                                    </Box>
                                                )}

                                                {!phone && !email && (
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        —
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>

                                        {/* STATUS */}

                                        <TableCell>
                                            {status !== undefined ? (
                                                <Chip
                                                    label={statusConfig.label}
                                                    color={statusConfig.color}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            ) : (
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    —
                                                </Typography>
                                            )}
                                        </TableCell>

                                        {/* DEFAULT ADDRESS */}

                                        <TableCell>
                                            <Chip
                                                label={
                                                    Boolean(isDefault)
                                                        ? "Default"
                                                        : "No"
                                                }
                                                color={
                                                    Boolean(isDefault)
                                                        ? "success"
                                                        : "default"
                                                }
                                                size="small"
                                                variant={
                                                    Boolean(isDefault)
                                                        ? "filled"
                                                        : "outlined"
                                                }
                                            />
                                        </TableCell>

                                        {/* ACTIONS */}

                                        <TableCell align="center">
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: 0.25
                                                }}
                                            >
                                                <Tooltip title="View address">
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            aria-label="View address"
                                                            disabled={!handleView}
                                                            onClick={() =>
                                                                handleView?.(address)
                                                            }
                                                        >
                                                            <Visibility fontSize="small" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>

                                                <Tooltip title="Edit address">
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            color="warning"
                                                            aria-label="Edit address"
                                                            disabled={!handleEdit}
                                                            onClick={() =>
                                                                handleEdit?.(address)
                                                            }
                                                        >
                                                            <Edit fontSize="small" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>

                                                <Tooltip title="Delete address">
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            aria-label="Delete address"
                                                            disabled={!handleDelete}
                                                            onClick={() =>
                                                                handleDelete?.(address)
                                                            }
                                                        >
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </span>
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

            {/* PAGINATION */}

            {showPagination && (
                <TablePagination
                    component="div"
                    count={resolvedTotalCount}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={rowsPerPageOptions}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    labelRowsPerPage="Rows per page:"
                    showFirstButton
                    showLastButton
                    sx={{
                        mt: 1,
                        borderTop: "none",
                        "& .MuiTablePagination-toolbar": {
                            flexWrap: "wrap",
                            minHeight: 56
                        }
                    }}
                />
            )}
        </Box>
    );
};

export default ReversePickupAddressTable;

