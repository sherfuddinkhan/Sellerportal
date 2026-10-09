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
    Stack
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    Inventory2,
    Inbox
} from "@mui/icons-material";

/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (record, ...fields) => {
    for (const field of fields) {
        const value = record?.[field];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return null;
};

/* =========================================================
   GET STATUS COLOR
========================================================= */

const getStatusColor = (status) => {
    const normalizedStatus = String(status || "")
        .trim()
        .toLowerCase();

    if (
        normalizedStatus.includes("complete") ||
        normalizedStatus.includes("done")
    ) {
        return "success";
    }

    if (
        normalizedStatus.includes("pending") ||
        normalizedStatus.includes("waiting")
    ) {
        return "warning";
    }

    if (
        normalizedStatus.includes("progress") ||
        normalizedStatus.includes("process")
    ) {
        return "info";
    }

    if (
        normalizedStatus.includes("cancel") ||
        normalizedStatus.includes("fail")
    ) {
        return "error";
    }

    if (normalizedStatus.includes("putaway")) {
        return "primary";
    }

    return "default";
};

/* =========================================================
   STATUS CHIP
========================================================= */

const StatusChip = ({ status }) => {
    const label = status || "Unknown";

    return (
        <Chip
            label={label}
            color={getStatusColor(label)}
            size="small"
            variant="outlined"
            sx={{
                fontWeight: 600,
                textTransform: "capitalize",
                minWidth: 85
            }}
        />
    );
};

/* =========================================================
   MANIFEST PACKAGES PUTAWAY TABLE
========================================================= */

const ManifestPackagesPutawayTable = ({
    records = [],
    loading = false,

    page = 0,
    rowsPerPage = 10,
    totalRecords,

    onPageChange,
    onRowsPerPageChange,

    onView,
    onEdit,
    onDelete,

    emptyMessage = "No manifest package putaway records found."
}) => {
    /* -----------------------------------------------------
       NORMALIZE RECORDS
    ----------------------------------------------------- */

    const safeRecords = Array.isArray(records)
        ? records
        : [];

    const displayedTotal =
        Number.isFinite(Number(totalRecords)) &&
        totalRecords !== undefined &&
        totalRecords !== null
            ? Math.max(0, Number(totalRecords))
            : safeRecords.length;

    /* -----------------------------------------------------
       HANDLE PAGE CHANGE
    ----------------------------------------------------- */

    const handlePageChange = (_, newPage) => {
        if (onPageChange) {
            onPageChange(newPage);
        }
    };

    /* -----------------------------------------------------
       HANDLE ROWS PER PAGE
    ----------------------------------------------------- */

    const handleRowsPerPageChange = (event) => {
        if (onRowsPerPageChange) {
            onRowsPerPageChange(
                Number(event.target.value)
            );
        }
    };

    /* -----------------------------------------------------
       RENDER
    ----------------------------------------------------- */

    return (
        <Paper
            elevation={2}
            sx={{
                width: "100%",
                overflow: "hidden",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider"
            }}
        >
            {/* TABLE HEADER */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    px: 2.5,
                    py: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    flexWrap: "wrap"
                }}
            >
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                >
                    <Inventory2
                        color="primary"
                        fontSize="medium"
                    />

                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Putaway Records
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Manifest package putaway details
                        </Typography>
                    </Box>
                </Stack>

                <Chip
                    label={`${displayedTotal.toLocaleString("en-IN")} records`}
                    size="small"
                    variant="outlined"
                    color="primary"
                />
            </Box>

            {/* TABLE CONTAINER */}

            <TableContainer
                sx={{
                    width: "100%",
                    overflowX: "auto",
                    minHeight: 220
                }}
            >
                <Table
                    stickyHeader
                    size="medium"
                    aria-label="Manifest packages putaway table"
                >
                    {/* TABLE HEAD */}

                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    minWidth: 90,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                S.No.
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    minWidth: 140,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Putaway ID
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    minWidth: 130,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Manifest ID
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    minWidth: 130,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Package ID
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    minWidth: 170
                                }}
                            >
                                Putaway Location
                            </TableCell>

                            <TableCell
                                align="right"
                                sx={{
                                    fontWeight: 700,
                                    minWidth: 120,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Quantity
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    minWidth: 140
                                }}
                            >
                                Status
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    minWidth: 140,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Created Date
                            </TableCell>

                            <TableCell
                                align="center"
                                sx={{
                                    fontWeight: 700,
                                    minWidth: 150
                                }}
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
                                    <CircularProgress
                                        size={32}
                                    />

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mt: 1.5 }}
                                    >
                                        Loading putaway records...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : safeRecords.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={9}
                                    align="center"
                                    sx={{ py: 7 }}
                                >
                                    <Inbox
                                        sx={{
                                            fontSize: 46,
                                            color: "text.disabled"
                                        }}
                                    />

                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={600}
                                        sx={{ mt: 1 }}
                                    >
                                        No Records Found
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {emptyMessage}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            safeRecords.map((record, index) => {
                                const id = getFieldValue(
                                    record,
                                    "manifestPackagesPutawayId",
                                    "ManifestPackagesPutawayId",
                                    "manifestPackagePutawayId",
                                    "ManifestPackagePutawayId",
                                    "id",
                                    "Id"
                                );

                                const manifestId = getFieldValue(
                                    record,
                                    "manifestId",
                                    "ManifestId"
                                );

                                const packageId = getFieldValue(
                                    record,
                                    "packageId",
                                    "PackageId"
                                );

                                const location = getFieldValue(
                                    record,
                                    "putawayLocation",
                                    "PutawayLocation",
                                    "location",
                                    "Location",
                                    "binLocation",
                                    "BinLocation"
                                );

                                const quantity = getFieldValue(
                                    record,
                                    "quantity",
                                    "Quantity",
                                    "packageQuantity",
                                    "PackageQuantity"
                                );

                                const status = getFieldValue(
                                    record,
                                    "status",
                                    "Status",
                                    "putawayStatus",
                                    "PutawayStatus"
                                );

                                const createdAt = getFieldValue(
                                    record,
                                    "createdAt",
                                    "CreatedAt",
                                    "createdDate",
                                    "CreatedDate"
                                );

                                const serialNumber =
                                    page * rowsPerPage + index + 1;

                                return (
                                    <TableRow
                                        key={
                                            id ??
                                            `${manifestId ?? "manifest"}-${packageId ?? "package"}-${index}`
                                        }
                                        hover
                                        sx={{
                                            "&:last-child td": {
                                                borderBottom: 0
                                            }
                                        }}
                                    >
                                        {/* SERIAL NUMBER */}

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                            >
                                                {serialNumber}
                                            </Typography>
                                        </TableCell>

                                        {/* PUTAWAY ID */}

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                                color="primary.main"
                                            >
                                                {id ?? "-"}
                                            </Typography>
                                        </TableCell>

                                        {/* MANIFEST ID */}

                                        <TableCell>
                                            {manifestId ?? "-"}
                                        </TableCell>

                                        {/* PACKAGE ID */}

                                        <TableCell>
                                            {packageId ?? "-"}
                                        </TableCell>

                                        {/* LOCATION */}

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    overflowWrap: "anywhere"
                                                }}
                                            >
                                                {location || "-"}
                                            </Typography>
                                        </TableCell>

                                        {/* QUANTITY */}

                                        <TableCell align="right">
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                            >
                                                {formatNumber(quantity)}
                                            </Typography>
                                        </TableCell>

                                        {/* STATUS */}

                                        <TableCell>
                                            <StatusChip
                                                status={status}
                                            />
                                        </TableCell>

                                        {/* CREATED DATE */}

                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(createdAt)}
                                            </Typography>
                                        </TableCell>

                                        {/* ACTIONS */}

                                        <TableCell align="center">
                                            <Stack
                                                direction="row"
                                                spacing={0.5}
                                                justifyContent="center"
                                            >
                                                <Tooltip title="View Details">
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            color="info"
                                                            disabled={!onView}
                                                            onClick={() =>
                                                                onView?.(record)
                                                            }
                                                            aria-label={`View putaway ${id ?? ""}`}
                                                        >
                                                            <Visibility fontSize="small" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>

                                                <Tooltip title="Edit Record">
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            disabled={!onEdit}
                                                            onClick={() =>
                                                                onEdit?.(record)
                                                            }
                                                            aria-label={`Edit putaway ${id ?? ""}`}
                                                        >
                                                            <Edit fontSize="small" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>

                                                <Tooltip title="Delete Record">
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            disabled={!onDelete}
                                                            onClick={() =>
                                                                onDelete?.(record)
                                                            }
                                                            aria-label={`Delete putaway ${id ?? ""}`}
                                                        >
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* PAGINATION */}

            <TablePagination
                component="div"
                count={displayedTotal}
                page={Math.max(
                    0,
                    Math.min(
                        page,
                        Math.max(
                            0,
                            Math.ceil(
                                displayedTotal /
                                Math.max(1, rowsPerPage)
                            ) - 1
                        )
                    )
                )}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                disabled={loading}
                sx={{
                    borderTop: "1px solid",
                    borderColor: "divider",
                    ".MuiTablePagination-toolbar": {
                        flexWrap: "wrap",
                        minHeight: 56
                    }
                }}
            />
        </Paper>
    );
};

export default ManifestPackagesPutawayTable;

