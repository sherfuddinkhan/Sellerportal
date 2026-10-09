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
    PlaylistAddCheck
} from "@mui/icons-material";

/* =========================================================
   FIELD HELPERS
========================================================= */

const getFieldValue = (item, fields, fallback = "") => {
    for (const field of fields) {
        const value = item?.[field];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return fallback;
};

/* =========================================================
   PICKLIST FIELD HELPERS
========================================================= */

const getPicklistId = (picklist) =>
    getFieldValue(picklist, [
        "picklistId",
        "PicklistId",
        "pickListId",
        "PickListId",
        "id",
        "Id"
    ]);

const getPicklistNumber = (picklist) =>
    getFieldValue(picklist, [
        "picklistNumber",
        "PicklistNumber",
        "pickListNumber",
        "PickListNumber",
        "picklistNo",
        "PicklistNo",
        "number",
        "Number"
    ], "—");

const getOrderNumber = (picklist) =>
    getFieldValue(picklist, [
        "orderNumber",
        "OrderNumber",
        "salesOrderNumber",
        "SalesOrderNumber",
        "orderNo",
        "OrderNo"
    ], "—");

const getWarehouseName = (picklist) =>
    getFieldValue(picklist, [
        "warehouseName",
        "WarehouseName",
        "warehouse",
        "Warehouse",
        "locationName",
        "LocationName"
    ], "—");

const getStatus = (picklist) =>
    getFieldValue(picklist, [
        "status",
        "Status",
        "picklistStatus",
        "PicklistStatus"
    ], "Pending");

const getDateValue = (picklist) =>
    getFieldValue(picklist, [
        "picklistDate",
        "PicklistDate",
        "createdDate",
        "CreatedDate",
        "createdAt",
        "CreatedAt",
        "date",
        "Date"
    ]);

const getItemCount = (picklist) => {
    const count = getFieldValue(picklist, [
        "totalItems",
        "TotalItems",
        "itemCount",
        "ItemCount",
        "totalQuantity",
        "TotalQuantity"
    ]);

    if (count !== "") {
        const number = Number(count);

        if (Number.isFinite(number)) {
            return number;
        }
    }

    const items = getFieldValue(picklist, [
        "items",
        "Items",
        "picklistItems",
        "PicklistItems",
        "details",
        "Details"
    ]);

    return Array.isArray(items) ? items.length : 0;
};

/* =========================================================
   STATUS NORMALIZATION
========================================================= */

const normalizeStatus = (status) =>
    String(status ?? "")
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, "");

/* =========================================================
   STATUS CHIP
========================================================= */

const getStatusColor = (status) => {
    const normalized = normalizeStatus(status);

    switch (normalized) {
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
        label={status || "Unknown"}
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
    onEdit,
    onDelete
}) => {
    const rows = Array.isArray(picklists)
        ? picklists
        : Array.isArray(data)
            ? data
            : [];

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
                    minWidth: 950,
                    "& .MuiTableCell-root": {
                        px: 2,
                        py: 1.75
                    }
                }}
                aria-label="Picklists table"
            >
                {/* =============================================
                    TABLE HEADER
                ============================================= */}

                <TableHead>
                    <TableRow
                        sx={{
                            backgroundColor: "action.hover"
                        }}
                    >
                        <TableCell>
                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                            >
                                Picklist No.
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                            >
                                Order No.
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                            >
                                Warehouse
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                            >
                                Picklist Date
                            </Typography>
                        </TableCell>

                        <TableCell align="center">
                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                            >
                                Items
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                            >
                                Status
                            </Typography>
                        </TableCell>

                        <TableCell align="center">
                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                            >
                                Actions
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>

                {/* =============================================
                    TABLE BODY
                ============================================= */}

                <TableBody>
                    {rows.length > 0 ? (
                        rows.map((picklist, index) => {
                            const id = getPicklistId(picklist);
                            const picklistNumber =
                                getPicklistNumber(picklist);

                            const status = getStatus(picklist);

                            return (
                                <TableRow
                                    key={
                                        id !== ""
                                            ? id
                                            : `picklist-${index}`
                                    }
                                    hover
                                    sx={{
                                        "&:last-child td": {
                                            borderBottom: 0
                                        }
                                    }}
                                >
                                    {/* PICKLIST NUMBER */}

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
                                                    backgroundColor:
                                                        "action.hover",
                                                    color: "primary.main"
                                                }}
                                            >
                                                <PlaylistAddCheck
                                                    fontSize="small"
                                                />
                                            </Box>

                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                            >
                                                {picklistNumber}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    {/* ORDER NUMBER */}

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {getOrderNumber(picklist)}
                                        </Typography>
                                    </TableCell>

                                    {/* WAREHOUSE */}

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                        >
                                            {getWarehouseName(picklist)}
                                        </Typography>
                                    </TableCell>

                                    {/* PICKLIST DATE */}

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {formatDate(
                                                getDateValue(picklist)
                                            )}
                                        </Typography>
                                    </TableCell>

                                    {/* ITEM COUNT */}

                                    <TableCell align="center">
                                        <Chip
                                            label={getItemCount(picklist)}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>

                                    {/* STATUS */}

                                    <TableCell>
                                        <PicklistStatusChip
                                            status={status}
                                        />
                                    </TableCell>

                                    {/* ACTIONS */}

                                    <TableCell align="center">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: 0.5
                                            }}
                                        >
                                            <Tooltip title="View picklist">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    aria-label={`View picklist ${picklistNumber}`}
                                                    onClick={() =>
                                                        onView?.(picklist)
                                                    }
                                                >
                                                    <Visibility fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Edit picklist">
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        color="info"
                                                        aria-label={`Edit picklist ${picklistNumber}`}
                                                        onClick={() =>
                                                            onEdit?.(picklist)
                                                        }
                                                        disabled={
                                                            normalizeStatus(status) ===
                                                            "completed" ||
                                                            normalizeStatus(status) ===
                                                            "cancelled" ||
                                                            normalizeStatus(status) ===
                                                            "canceled"
                                                        }
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
                                                    onClick={() =>
                                                        onDelete?.(picklist)
                                                    }
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
                            <TableCell
                                colSpan={7}
                                align="center"
                                sx={{ py: 6 }}
                            >
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
                                        Picklists will appear here when
                                        records are available.
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

