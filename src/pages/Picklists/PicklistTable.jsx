// PicklistTable.jsx

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
    Typography,
    Chip,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    PlaylistAddCheck,
    InfoOutlined
} from "@mui/icons-material";

/* =========================================================
   FIELD HELPERS
========================================================= */

const getFieldValue = (item, fields, fallback = "") => {
    if (!item || typeof item !== "object") {
        return fallback;
    }

    for (const field of fields) {
        if (item[field] !== undefined && item[field] !== null) {
            return item[field];
        }
    }

    return fallback;
};

/* =========================================================
   PICKLIST FIELD HELPERS
========================================================= */

const getPicklistCode = (picklist) =>
    getFieldValue(picklist, [
        "picklistCode",
        "PicklistCode",
        "pickListCode",
        "PickListCode"
    ]);

const getPicklistId = (picklist) =>
    getFieldValue(picklist, [
        "picklistId",
        "PicklistId",
        "pickListId",
        "PickListId",
        "id",
        "Id"
    ]);

const getPicklistIdentifier = (picklist) =>
    getPicklistCode(picklist) || getPicklistId(picklist);

const getPicklistNumber = (picklist) =>
    getPicklistCode(picklist) ||
    getFieldValue(picklist, [
        "picklistNumber",
        "PicklistNumber",
        "picklistNo",
        "PicklistNo"
    ], "—");

const getDestination = (picklist) =>
    getFieldValue(picklist, [
        "destination",
        "Destination"
    ], "—");

const getSellerId = (picklist) =>
    getFieldValue(picklist, [
        "sellerId",
        "SellerId"
    ], "—");

const getCustomerId = (picklist) =>
    getFieldValue(picklist, [
        "customerId",
        "CustomerId"
    ], "—");

const getDateValue = (picklist) =>
    getFieldValue(picklist, [
        "createdDate",
        "CreatedDate",
        "picklistDate",
        "PicklistDate",
        "createdAt",
        "CreatedAt"
    ]);

const getStatus = (picklist) =>
    getFieldValue(picklist, [
        "status",
        "Status",
        "picklistStatus",
        "PicklistStatus"
    ], "Pending");

/* =========================================================
   PACKAGE CODE HELPERS
========================================================= */

const getPackageCodes = (picklist) => {
    const value = getFieldValue(picklist, [
        "shippingPackageCodes",
        "ShippingPackageCodes"
    ], "");

    if (!value) {
        return [];
    }

    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value !== "string") {
        return [String(value)];
    }

    try {
        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) {
            return parsed;
        }

        if (parsed && typeof parsed === "object") {
            return Object.values(parsed);
        }

        return parsed ? [String(parsed)] : [];
    } catch {
        return value
            .split(/[,;\n]+/)
            .map((code) => code.trim())
            .filter(Boolean);
    }
};

const getItemCount = (picklist) => {
    const directCount = getFieldValue(picklist, [
        "totalItems",
        "TotalItems",
        "itemCount",
        "ItemCount"
    ], null);

    if (directCount !== null && directCount !== "") {
        const count = Number(directCount);

        if (Number.isFinite(count)) {
            return count;
        }
    }

    return getPackageCodes(picklist).length;
};

/* =========================================================
   STATUS HELPERS
========================================================= */

const normalizeStatus = (status) =>
    String(status ?? "")
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, "");

const getStatusColor = (status) => {
    switch (normalizeStatus(status)) {
        case "completed":
        case "complete":
        case "picked":
        case "closed":
            return "success";

        case "inprogress":
        case "processing":
        case "assigned":
        case "started":
            return "info";

        case "pending":
        case "created":
        case "new":
            return "warning";

        case "cancelled":
        case "canceled":
        case "failed":
            return "error";

        default:
            return "default";
    }
};

const PicklistStatusChip = ({ status }) => (
    <Chip
        label={status || "Pending"}
        color={getStatusColor(status)}
        size="small"
        variant="outlined"
        sx={{
            fontWeight: 600,
            textTransform: "capitalize",
            minWidth: 80
        }}
    />
);

/* =========================================================
   DATE FORMATTER
========================================================= */

const formatDate = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

/* =========================================================
   TABLE COMPONENT
========================================================= */

const PicklistTable = ({
    picklists,
    data,
    loading = false,
    onView,
    onDetails,
    onEdit,
    onDelete,
    getPicklistId: suppliedGetPicklistId,
    getPicklistCode: suppliedGetPicklistCode,
    getPicklistNumber: suppliedGetPicklistNumber,
    getDestination: suppliedGetDestination,
    getStatus: suppliedGetStatus,
    getDateValue: suppliedGetDateValue,
    getItemCount: suppliedGetItemCount,
    formatDate: suppliedFormatDate
}) => {
    const rows = Array.isArray(picklists)
        ? picklists
        : Array.isArray(data)
            ? data
            : [];

    const picklistCodeGetter =
        suppliedGetPicklistCode || getPicklistCode;

    const picklistIdGetter =
        suppliedGetPicklistId || getPicklistId;

    const picklistNumberGetter =
        suppliedGetPicklistNumber || getPicklistNumber;

    const destinationGetter =
        suppliedGetDestination || getDestination;

    const statusGetter =
        suppliedGetStatus || getStatus;

    const dateGetter =
        suppliedGetDateValue || getDateValue;

    const itemCountGetter =
        suppliedGetItemCount || getItemCount;

    const dateFormatter =
        suppliedFormatDate || formatDate;

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                width: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                overflowX: "auto"
            }}
        >
            <Table
                sx={{
                    minWidth: 1000,
                    "& .MuiTableCell-root": {
                        px: 2,
                        py: 1.75
                    }
                }}
                aria-label="Picklists table"
            >
                {/* TABLE HEADER */}

                <TableHead>
                    <TableRow
                        sx={{
                            backgroundColor: "action.hover"
                        }}
                    >
                        <TableCell>
                            <Typography variant="subtitle2" fontWeight={700}>
                                Picklist Code
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography variant="subtitle2" fontWeight={700}>
                                Destination
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography variant="subtitle2" fontWeight={700}>
                                Created Date
                            </Typography>
                        </TableCell>

                        <TableCell align="center">
                            <Typography variant="subtitle2" fontWeight={700}>
                                Packages
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography variant="subtitle2" fontWeight={700}>
                                Seller ID
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography variant="subtitle2" fontWeight={700}>
                                Customer ID
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography variant="subtitle2" fontWeight={700}>
                                Status
                            </Typography>
                        </TableCell>

                        <TableCell align="center">
                            <Typography variant="subtitle2" fontWeight={700}>
                                Actions
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>

                {/* TABLE BODY */}

                <TableBody>
                    {rows.length > 0 ? (
                        rows.map((picklist, index) => {
                            const code = picklistCodeGetter(picklist);
                            const id = picklistIdGetter(picklist);

                            const identifier =
                                code || id || `picklist-${index}`;

                            const picklistNumber =
                                picklistNumberGetter(picklist);

                            const status = statusGetter(picklist);
                            const normalizedStatus = normalizeStatus(status);

                            const isReadOnly =
                                normalizedStatus === "completed" ||
                                normalizedStatus === "complete" ||
                                normalizedStatus === "cancelled" ||
                                normalizedStatus === "canceled";

                            return (
                                <TableRow
                                    key={String(identifier)}
                                    hover
                                    sx={{
                                        "&:last-child td": {
                                            borderBottom: 0
                                        }
                                    }}
                                >
                                    {/* PICKLIST CODE */}

                                    <TableCell>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    width: 34,
                                                    height: 34,
                                                    flexShrink: 0,
                                                    borderRadius: 1.5,
                                                    backgroundColor: "action.hover",
                                                    color: "primary.main"
                                                }}
                                            >
                                                <PlaylistAddCheck fontSize="small" />
                                            </Box>

                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={600}
                                                >
                                                    {picklistNumber}
                                                </Typography>

                                                {id !== "" &&
                                                    id !== null &&
                                                    id !== undefined && (
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            ID: {id}
                                                        </Typography>
                                                    )}
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    {/* DESTINATION */}

                                    <TableCell>
                                        <Typography variant="body2">
                                            {destinationGetter(picklist)}
                                        </Typography>
                                    </TableCell>

                                    {/* CREATED DATE */}

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {dateFormatter(dateGetter(picklist))}
                                        </Typography>
                                    </TableCell>

                                    {/* PACKAGE COUNT */}

                                    <TableCell align="center">
                                        <Tooltip
                                            title={
                                                getPackageCodes(picklist).join(", ") ||
                                                "No package codes"
                                            }
                                        >
                                            <Chip
                                                label={itemCountGetter(picklist)}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Tooltip>
                                    </TableCell>

                                    {/* SELLER ID */}

                                    <TableCell>
                                        <Typography variant="body2">
                                            {getSellerId(picklist)}
                                        </Typography>
                                    </TableCell>

                                    {/* CUSTOMER ID */}

                                    <TableCell>
                                        <Typography variant="body2">
                                            {getCustomerId(picklist)}
                                        </Typography>
                                    </TableCell>

                                    {/* STATUS */}

                                    <TableCell>
                                        <PicklistStatusChip status={status} />
                                    </TableCell>

                                    {/* ACTIONS */}

                                    <TableCell align="center">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: 0.25
                                            }}
                                        >
                                            <Tooltip title="View picklist">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    aria-label={`View picklist ${picklistNumber}`}
                                                    onClick={() => onView?.(picklist)}
                                                >
                                                    <Visibility fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            {onDetails && (
                                                <Tooltip title="Picklist details">
                                                    <IconButton
                                                        size="small"
                                                        color="default"
                                                        aria-label={`Details for ${picklistNumber}`}
                                                        onClick={() => onDetails(picklist)}
                                                    >
                                                        <InfoOutlined fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                            <Tooltip title="Edit picklist">
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        color="info"
                                                        aria-label={`Edit picklist ${picklistNumber}`}
                                                        onClick={() => onEdit?.(picklist)}
                                                        disabled={isReadOnly}
                                                    >
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>

                                            <Tooltip title="Delete picklist">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    aria-label={`Delete picklist ${picklistNumber}`}
                                                    onClick={() => onDelete?.(picklist)}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                                <Typography
                                    variant="body1"
                                    fontWeight={600}
                                    color="text.secondary"
                                >
                                    {loading
                                        ? "Loading picklists..."
                                        : "No picklists available"}
                                </Typography>

                                {!loading && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mt: 1 }}
                                    >
                                        Picklists will appear here when records are available.
                                    </Typography>
                                )}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PicklistTable;
