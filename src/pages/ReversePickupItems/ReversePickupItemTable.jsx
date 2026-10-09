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
    Stack,
    CircularProgress,
    Button
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    LocalShipping,
    Inventory2,
    Refresh,
    SearchOff
} from "@mui/icons-material";

/* =========================================================
   FORMAT TEXT
========================================================= */

const formatText = (value, fallback = "N/A") => {
    if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
    ) {
        return fallback;
    }

    return String(value).trim();
};

/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
    if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
    ) {
        return "0";
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
};

/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {
    if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
    ) {
        return "₹ 0.00";
    }

    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return "₹ 0.00";
    }

    return `₹ ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {
    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

/* =========================================================
   GET STATUS COLOR
========================================================= */

const getStatusColor = (status) => {
    const normalizedStatus = String(status || "")
        .trim()
        .toLowerCase();

    switch (normalizedStatus) {
        case "completed":
        case "delivered":
        case "picked up":
        case "pickedup":
        case "approved":
            return "success";

        case "pending":
        case "scheduled":
        case "requested":
            return "warning";

        case "cancelled":
        case "canceled":
        case "failed":
        case "rejected":
            return "error";

        case "in transit":
        case "intransit":
        case "processing":
            return "info";

        default:
            return "default";
    }
};

/* =========================================================
   GET RECORD FIELD
========================================================= */

const getField = (record, ...keys) => {
    for (const key of keys) {
        const value = record?.[key];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return undefined;
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = ({ message, onRefresh }) => (
    <TableRow>
        <TableCell colSpan={10} align="center">
            <Box
                sx={{
                    py: 6,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1.5
                }}
            >
                <SearchOff
                    sx={{
                        fontSize: 48,
                        color: "text.disabled"
                    }}
                />

                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                >
                    {message}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    No reverse pickup records are available to display.
                </Typography>

                {onRefresh && (
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={onRefresh}
                    >
                        Refresh
                    </Button>
                )}
            </Box>
        </TableCell>
    </TableRow>
);

/* =========================================================
   REVERSE PICKUP ITEM TABLE
========================================================= */

const ReversePickupItemTable = ({
    reversePickups,
    pickups,
    items,
    records,
    loading = false,
    error = "",
    search = "",
    searchTerm,
    status = "all",
    statusFilter,
    page = 0,
    rowsPerPage = 10,
    totalCount,
    serverPagination = false,
    onView,
    onEdit,
    onDelete,
    onRefresh,
    onPageChange,
    onRowsPerPageChange,
    emptyMessage = "No Reverse Pickup Items Found",
    showActions = true,
    showPagination = true,
    dense = false
}) => {
    /* =====================================================
       NORMALIZE DATA
    ===================================================== */

    const sourceRecords =
        reversePickups ??
        pickups ??
        items ??
        records ??
        [];

    const safeRecords = Array.isArray(sourceRecords)
        ? sourceRecords
        : [];

    const currentSearch = searchTerm ?? search;
    const currentStatus = statusFilter ?? status;

    /* =====================================================
       FILTER RECORDS
       Client-side filtering is skipped for server pagination.
    ===================================================== */

    const filteredRecords = React.useMemo(() => {
        if (serverPagination) {
            return safeRecords;
        }

        const searchValue = String(currentSearch || "")
            .trim()
            .toLowerCase();

        return safeRecords.filter((record) => {
            const pickupNumber = getField(
                record,
                "reversePickupNumber",
                "ReversePickupNumber"
            );

            const orderNumber = getField(
                record,
                "orderNumber",
                "OrderNumber"
            );

            const customerName = getField(
                record,
                "customerName",
                "CustomerName"
            );

            const customerEmail = getField(
                record,
                "customerEmail",
                "CustomerEmail"
            );

            const itemName = getField(
                record,
                "itemName",
                "ItemName"
            );

            const sku = getField(
                record,
                "sku",
                "SKU"
            );

            const trackingNumber = getField(
                record,
                "trackingNumber",
                "TrackingNumber"
            );

            const matchesSearch =
                !searchValue ||
                [
                    pickupNumber,
                    orderNumber,
                    customerName,
                    customerEmail,
                    itemName,
                    sku,
                    trackingNumber
                ].some((value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(searchValue)
                );

            const recordStatus = String(
                getField(record, "status", "Status") ?? ""
            )
                .trim()
                .toLowerCase();

            const normalizedFilter = String(
                currentStatus || "all"
            )
                .trim()
                .toLowerCase();

            const matchesStatus =
                normalizedFilter === "all" ||
                recordStatus === normalizedFilter;

            return matchesSearch && matchesStatus;
        });
    }, [
        safeRecords,
        currentSearch,
        currentStatus,
        serverPagination
    ]);

    /* =====================================================
       PAGINATION
    ===================================================== */

    const effectiveTotal = serverPagination
        ? (totalCount ?? safeRecords.length)
        : filteredRecords.length;

    const visibleRecords = serverPagination
        ? safeRecords
        : filteredRecords.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        );

    const handlePageChange = (_, newPage) => {
        onPageChange?.(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        onRowsPerPageChange?.(
            Number(event.target.value)
        );
    };

    /* =====================================================
       ACTION HANDLERS
    ===================================================== */

    const handleView = (record) => {
        onView?.(record);
    };

    const handleEdit = (record) => {
        onEdit?.(record);
    };

    const handleDelete = (record) => {
        onDelete?.(record);
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2
            }}
        >
            {/* =============================================
                TABLE HEADER
            ============================================= */}

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
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.25}
                >
                    <LocalShipping color="primary" />

                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Reverse Pickup Records
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {formatNumber(effectiveTotal)} records
                        </Typography>
                    </Box>
                </Stack>

                {onRefresh && (
                    <Tooltip title="Refresh records">
                        <span>
                            <IconButton
                                onClick={onRefresh}
                                disabled={loading}
                                color="primary"
                                size="small"
                            >
                                <Refresh />
                            </IconButton>
                        </span>
                    </Tooltip>
                )}
            </Box>

            {/* =============================================
                TABLE
            ============================================= */}

            <TableContainer
                sx={{
                    width: "100%",
                    overflowX: "auto"
                }}
            >
                <Table
                    size={dense ? "small" : "medium"}
                    stickyHeader
                    aria-label="Reverse pickup item table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>
                                #
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Pickup Number
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Order Number
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Customer
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Item Details
                            </TableCell>

                            <TableCell
                                align="right"
                                sx={{ fontWeight: 700 }}
                            >
                                Quantity
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Pickup Date
                            </TableCell>

                            <TableCell
                                align="right"
                                sx={{ fontWeight: 700 }}
                            >
                                Pickup Cost
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Status
                            </TableCell>

                            {showActions && (
                                <TableCell
                                    align="center"
                                    sx={{
                                        fontWeight: 700,
                                        minWidth: 130
                                    }}
                                >
                                    Actions
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {/* =================================
                            LOADING STATE
                        ================================= */}

                        {loading && (
                            <TableRow>
                                <TableCell
                                    colSpan={showActions ? 10 : 9}
                                    align="center"
                                >
                                    <Box
                                        sx={{
                                            py: 6,
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: 1.5
                                        }}
                                    >
                                        <CircularProgress size={32} />

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Loading reverse pickup records...
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}

                        {/* =================================
                            ERROR STATE
                        ================================= */}

                        {!loading && error && (
                            <TableRow>
                                <TableCell
                                    colSpan={showActions ? 10 : 9}
                                    align="center"
                                >
                                    <Box sx={{ py: 4 }}>
                                        <Typography
                                            color="error"
                                            fontWeight={600}
                                        >
                                            {error}
                                        </Typography>

                                        {onRefresh && (
                                            <Button
                                                sx={{ mt: 1.5 }}
                                                variant="outlined"
                                                startIcon={<Refresh />}
                                                onClick={onRefresh}
                                            >
                                                Try Again
                                            </Button>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}

                        {/* =================================
                            EMPTY STATE
                        ================================= */}

                        {!loading &&
                            !error &&
                            visibleRecords.length === 0 && (
                                <EmptyState
                                    message={
                                        currentSearch ||
                                        currentStatus !== "all"
                                            ? "No Matching Reverse Pickups Found"
                                            : emptyMessage
                                    }
                                    onRefresh={onRefresh}
                                />
                            )}

                        {/* =================================
                            DATA ROWS
                        ================================= */}

                        {!loading &&
                            !error &&
                            visibleRecords.map((record, index) => {
                                const id = getField(
                                    record,
                                    "id",
                                    "reversePickupId",
                                    "ReversePickupId",
                                    "ID"
                                );

                                const pickupNumber = getField(
                                    record,
                                    "reversePickupNumber",
                                    "ReversePickupNumber"
                                );

                                const orderNumber = getField(
                                    record,
                                    "orderNumber",
                                    "OrderNumber"
                                );

                                const customerName = getField(
                                    record,
                                    "customerName",
                                    "CustomerName"
                                );

                                const customerEmail = getField(
                                    record,
                                    "customerEmail",
                                    "CustomerEmail"
                                );

                                const itemName = getField(
                                    record,
                                    "itemName",
                                    "ItemName"
                                );

                                const sku = getField(
                                    record,
                                    "sku",
                                    "SKU"
                                );

                                const quantity = getField(
                                    record,
                                    "quantity",
                                    "Quantity"
                                );

                                const pickupDate = getField(
                                    record,
                                    "pickupDate",
                                    "PickupDate"
                                );

                                const pickupCost = getField(
                                    record,
                                    "pickupCost",
                                    "PickupCost"
                                );

                                const status = getField(
                                    record,
                                    "status",
                                    "Status"
                                );

                                return (
                                    <TableRow
                                        key={id ?? `${pickupNumber ?? "pickup"}-${index}`}
                                        hover
                                        sx={{
                                            "&:last-child td": {
                                                borderBottom: 0
                                            }
                                        }}
                                    >
                                        <TableCell>
                                            {formatNumber(
                                                serverPagination
                                                    ? page * rowsPerPage + index + 1
                                                    : page * rowsPerPage + index + 1
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                            >
                                                <LocalShipping
                                                    fontSize="small"
                                                    color="primary"
                                                />

                                                <Typography
                                                    variant="body2"
                                                    fontWeight={700}
                                                    sx={{
                                                        minWidth: 120,
                                                        overflowWrap: "anywhere"
                                                    }}
                                                >
                                                    {formatText(pickupNumber)}
                                                </Typography>
                                            </Stack>
                                        </TableCell>

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    minWidth: 100,
                                                    overflowWrap: "anywhere"
                                                }}
                                            >
                                                {formatText(orderNumber)}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Box sx={{ minWidth: 140 }}>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={600}
                                                >
                                                    {formatText(customerName)}
                                                </Typography>

                                                {customerEmail && (
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{
                                                            display: "block",
                                                            overflowWrap: "anywhere"
                                                        }}
                                                    >
                                                        {customerEmail}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="flex-start"
                                            >
                                                <Inventory2
                                                    fontSize="small"
                                                    color="action"
                                                    sx={{ mt: 0.25 }}
                                                />

                                                <Box sx={{ minWidth: 120 }}>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={600}
                                                    >
                                                        {formatText(itemName)}
                                                    </Typography>

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        SKU: {formatText(sku)}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>

                                        <TableCell align="right">
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                                sx={{ whiteSpace: "nowrap" }}
                                            >
                                                {formatNumber(quantity)}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{ whiteSpace: "nowrap" }}
                                            >
                                                {formatDate(pickupDate)}
                                            </Typography>
                                        </TableCell>

                                        <TableCell align="right">
                                            <Typography
                                                variant="body2"
                                                fontWeight={700}
                                                sx={{ whiteSpace: "nowrap" }}
                                            >
                                                {formatCurrency(pickupCost)}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={formatText(
                                                    status,
                                                    "Unknown"
                                                )}
                                                color={getStatusColor(status)}
                                                sx={{
                                                    fontWeight: 600,
                                                    maxWidth: 150
                                                }}
                                            />
                                        </TableCell>

                                        {showActions && (
                                            <TableCell align="center">
                                                <Stack
                                                    direction="row"
                                                    spacing={0.25}
                                                    justifyContent="center"
                                                >
                                                    <Tooltip title="View details">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() =>
                                                                handleView(record)
                                                            }
                                                            aria-label="View reverse pickup"
                                                        >
                                                            <Visibility fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Edit reverse pickup">
                                                        <IconButton
                                                            size="small"
                                                            color="warning"
                                                            onClick={() =>
                                                                handleEdit(record)
                                                            }
                                                            aria-label="Edit reverse pickup"
                                                        >
                                                            <Edit fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Delete reverse pickup">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() =>
                                                                handleDelete(record)
                                                            }
                                                            aria-label="Delete reverse pickup"
                                                        >
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* =============================================
                PAGINATION
            ============================================= */}

            {showPagination && (
                <TablePagination
                    component="div"
                    count={effectiveTotal}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    disabled={loading}
                    labelRowsPerPage="Rows per page:"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${formatNumber(from)}–${formatNumber(to)} of ${
                            count === -1
                                ? "more than " + formatNumber(to)
                                : formatNumber(count)
                        }`
                    }
                />
            )}
        </Paper>
    );
};

export default ReversePickupItemTable;

