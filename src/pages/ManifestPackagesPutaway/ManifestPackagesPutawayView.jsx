import React, { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";

import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    MenuItem,
    CircularProgress,
    Snackbar,
    Alert,
    Chip,
    Divider,
    Tooltip,
    IconButton
} from "@mui/material";

import {
    Inventory2,
    Refresh,
    Search,
    CheckCircle,
    PendingActions,
    LocalShipping,
    Visibility,
    Clear
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000";

const MANIFEST_PACKAGES_PUTAWAY_API =
    `${API_BASE_URL}/api/ManifestPackagesPutaway`;

/* =========================================================
   HELPERS
========================================================= */

const getValue = (data, ...keys) => {
    for (const key of keys) {
        if (
            data?.[key] !== undefined &&
            data?.[key] !== null
        ) {
            return data[key];
        }
    }

    return null;
};

const formatNumber = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN");
};

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

const getStatusColor = (status) => {
    const normalized = String(status ?? "").toLowerCase();

    if (
        normalized.includes("complete") ||
        normalized.includes("putaway") ||
        normalized === "done"
    ) {
        return "success";
    }

    if (
        normalized.includes("pending") ||
        normalized.includes("waiting")
    ) {
        return "warning";
    }

    if (
        normalized.includes("progress") ||
        normalized.includes("process")
    ) {
        return "info";
    }

    if (
        normalized.includes("cancel") ||
        normalized.includes("fail")
    ) {
        return "error";
    }

    return "default";
};

const normalizeRecords = (responseData) => {
    if (Array.isArray(responseData)) {
        return responseData;
    }

    if (Array.isArray(responseData?.data)) {
        return responseData.data;
    }

    if (Array.isArray(responseData?.items)) {
        return responseData.items;
    }

    if (Array.isArray(responseData?.result)) {
        return responseData.result;
    }

    if (Array.isArray(responseData?.results)) {
        return responseData.results;
    }

    return [];
};

/* =========================================================
   STATISTIC CARD
========================================================= */

const StatisticCard = ({
    title,
    value,
    icon,
    color = "primary"
}) => (
    <Card
        elevation={1}
        sx={{
            height: "100%",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider"
        }}
    >
        <CardContent>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
            >
                <Box minWidth={0}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{ overflowWrap: "anywhere" }}
                    >
                        {formatNumber(value)}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        bgcolor: `${color}.light`,
                        color: `${color}.dark`
                    }}
                >
                    {icon}
                </Box>
            </Box>
        </CardContent>
    </Card>
);

/* =========================================================
   MANIFEST PACKAGES PUTAWAY VIEW
========================================================= */

const ManifestPackagesPutawayView = ({
    onView,
    onCreate,
    endpoint = MANIFEST_PACKAGES_PUTAWAY_API
}) => {
    const navigate = useNavigate();

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    /* =====================================================
       FETCH ALL RECORDS
    ===================================================== */

    const fetchRecords = useCallback(async (showRefresh = false) => {
        if (showRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        try {
            const response = await axios.get(endpoint);

            if (response.data?.success === false) {
                throw new Error(
                    response.data?.message ||
                    "Failed to retrieve manifest package putaway records."
                );
            }

            const data = normalizeRecords(response.data);

            setRecords(data);
        } catch (err) {
            console.error(
                "GET MANIFEST PACKAGES PUTAWAY ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Unable to load manifest package putaway records."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [endpoint]);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    /* =====================================================
       FIELD MAPPING
    ===================================================== */

    const getRecordId = (record) =>
        getValue(
            record,
            "manifestPackagesPutawayId",
            "ManifestPackagesPutawayId",
            "manifestPackagePutawayId",
            "ManifestPackagePutawayId",
            "id",
            "Id"
        );

    const getManifestId = (record) =>
        getValue(
            record,
            "manifestId",
            "ManifestId"
        );

    const getPackageId = (record) =>
        getValue(
            record,
            "packageId",
            "PackageId"
        );

    const getLocation = (record) =>
        getValue(
            record,
            "putawayLocation",
            "PutawayLocation",
            "location",
            "Location",
            "binLocation",
            "BinLocation"
        );

    const getQuantity = (record) =>
        getValue(
            record,
            "quantity",
            "Quantity",
            "packageQuantity",
            "PackageQuantity"
        );

    const getStatus = (record) =>
        getValue(
            record,
            "status",
            "Status",
            "putawayStatus",
            "PutawayStatus"
        );

    const getCreatedDate = (record) =>
        getValue(
            record,
            "createdAt",
            "CreatedAt",
            "createdDate",
            "CreatedDate"
        );

    /* =====================================================
       FILTER RECORDS
    ===================================================== */

    const filteredRecords = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        return records.filter((record) => {
            const status = String(getStatus(record) ?? "");
            const normalizedStatus = status.toLowerCase();

            const matchesStatus =
                statusFilter === "all" ||
                normalizedStatus === statusFilter;

            const searchableValues = [
                getRecordId(record),
                getManifestId(record),
                getPackageId(record),
                getLocation(record),
                getQuantity(record),
                status
            ];

            const matchesSearch =
                !search ||
                searchableValues.some((value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(search)
                );

            return matchesStatus && matchesSearch;
        });
    }, [records, searchTerm, statusFilter]);

    /* =====================================================
       PAGINATION
    ===================================================== */

    const totalPages = Math.max(
        1,
        Math.ceil(filteredRecords.length / rowsPerPage)
    );

    const paginatedRecords = useMemo(() => {
        const startIndex = page * rowsPerPage;

        return filteredRecords.slice(
            startIndex,
            startIndex + rowsPerPage
        );
    }, [filteredRecords, page, rowsPerPage]);

    useEffect(() => {
        setPage(0);
    }, [searchTerm, statusFilter, rowsPerPage]);

    /* =====================================================
       STATISTICS
    ===================================================== */

    const statistics = useMemo(() => {
        let completed = 0;
        let pending = 0;
        let totalQuantity = 0;

        records.forEach((record) => {
            const status = String(getStatus(record) ?? "").toLowerCase();

            if (
                status.includes("complete") ||
                status.includes("putaway") ||
                status === "done"
            ) {
                completed += 1;
            } else if (
                status.includes("pending") ||
                status.includes("waiting")
            ) {
                pending += 1;
            }

            const quantity = Number(getQuantity(record));

            if (Number.isFinite(quantity)) {
                totalQuantity += quantity;
            }
        });

        return {
            total: records.length,
            completed,
            pending,
            totalQuantity
        };
    }, [records]);

    /* =====================================================
       VIEW RECORD
    ===================================================== */

    const handleView = (record) => {
        if (onView) {
            onView(record);
            return;
        }

        const id = getRecordId(record);

        if (id !== null && id !== undefined) {
            navigate(
                `/manifest-packages-putaway/${encodeURIComponent(id)}`
            );
        } else {
            setSnackbar({
                open: true,
                message: "No record ID is available for this item.",
                severity: "warning"
            });
        }
    };

    /* =====================================================
       CREATE RECORD
    ===================================================== */

    const handleCreate = () => {
        if (onCreate) {
            onCreate();
        } else {
            navigate("/manifest-packages-putaway/create");
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ p: { xs: 1.5, md: 3 } }}>
            {/* PAGE HEADER */}

            <Paper
                elevation={1}
                sx={{
                    p: { xs: 2, md: 3 },
                    mb: 3,
                    borderRadius: 3
                }}
            >
                <Box
                    display="flex"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                    flexDirection={{ xs: "column", sm: "row" }}
                    gap={2}
                >
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Box
                            sx={{
                                width: 52,
                                height: 52,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 2,
                                bgcolor: "primary.light",
                                color: "primary.dark"
                            }}
                        >
                            <Inventory2 fontSize="large" />
                        </Box>

                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                Manifest Packages Putaway
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Monitor and manage package putaway records.
                            </Typography>
                        </Box>
                    </Box>

                    <Box display="flex" gap={1} flexWrap="wrap">
                        <Tooltip title="Refresh records">
                            <span>
                                <IconButton
                                    onClick={() => fetchRecords(true)}
                                    disabled={loading || refreshing}
                                    color="primary"
                                    aria-label="Refresh records"
                                >
                                    {refreshing ? (
                                        <CircularProgress size={22} />
                                    ) : (
                                        <Refresh />
                                    )}
                                </IconButton>
                            </span>
                        </Tooltip>

                        <Button
                            variant="contained"
                            startIcon={<Inventory2 />}
                            onClick={handleCreate}
                        >
                            Add Putaway
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* ERROR */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() => fetchRecords(true)}
                        >
                            Retry
                        </Button>
                    }
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            {/* STATISTICS */}

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatisticCard
                        title="Total Records"
                        value={statistics.total}
                        icon={<Inventory2 />}
                        color="primary"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatisticCard
                        title="Completed"
                        value={statistics.completed}
                        icon={<CheckCircle />}
                        color="success"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatisticCard
                        title="Pending"
                        value={statistics.pending}
                        icon={<PendingActions />}
                        color="warning"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatisticCard
                        title="Total Quantity"
                        value={statistics.totalQuantity}
                        icon={<LocalShipping />}
                        color="info"
                    />
                </Grid>
            </Grid>

            {/* SEARCH AND FILTER */}

            <Paper
                elevation={1}
                sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 3
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={7}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Search putaway records"
                            placeholder="Search ID, manifest, package, location..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                            InputProps={{
                                startAdornment: (
                                    <Search
                                        sx={{
                                            mr: 1,
                                            color: "text.secondary"
                                        }}
                                    />
                                ),
                                endAdornment: searchTerm ? (
                                    <IconButton
                                        size="small"
                                        aria-label="Clear search"
                                        onClick={() => setSearchTerm("")}
                                    >
                                        <Clear fontSize="small" />
                                    </IconButton>
                                ) : null
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Status"
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                        >
                            <MenuItem value="all">
                                All Statuses
                            </MenuItem>
                            <MenuItem value="pending">
                                Pending
                            </MenuItem>
                            <MenuItem value="completed">
                                Completed
                            </MenuItem>
                            <MenuItem value="putaway">
                                Putaway
                            </MenuItem>
                            <MenuItem value="cancelled">
                                Cancelled
                            </MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("all");
                                setPage(0);
                                fetchRecords(true);
                            }}
                        >
                            Reset
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* RECORD TABLE */}

            <Paper
                elevation={1}
                sx={{
                    borderRadius: 3,
                    overflow: "hidden"
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={1}
                    p={2}
                >
                    <Typography variant="h6" fontWeight={700}>
                        Putaway Records
                    </Typography>

                    <Chip
                        label={`${filteredRecords.length} records`}
                        color="primary"
                        variant="outlined"
                    />
                </Box>

                <Divider />

                {loading ? (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        gap={2}
                        sx={{ py: 8 }}
                    >
                        <CircularProgress />

                        <Typography color="text.secondary">
                            Loading putaway records...
                        </Typography>
                    </Box>
                ) : filteredRecords.length === 0 ? (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        gap={1.5}
                        sx={{ py: 8, px: 2 }}
                    >
                        <Inventory2
                            sx={{
                                fontSize: 48,
                                color: "text.disabled"
                            }}
                        />

                        <Typography variant="h6" fontWeight={600}>
                            No records found
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            textAlign="center"
                        >
                            Try changing the search or status filter.
                        </Typography>

                        <Button
                            variant="outlined"
                            onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("all");
                            }}
                        >
                            Clear Filters
                        </Button>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ overflowX: "auto" }}>
                            <Box
                                component="table"
                                sx={{
                                    width: "100%",
                                    minWidth: 900,
                                    borderCollapse: "collapse",
                                    "& th": {
                                        px: 2,
                                        py: 1.75,
                                        textAlign: "left",
                                        bgcolor: "action.hover",
                                        color: "text.secondary",
                                        fontSize: 12,
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        whiteSpace: "nowrap",
                                        borderBottom: "1px solid",
                                        borderColor: "divider"
                                    },
                                    "& td": {
                                        px: 2,
                                        py: 1.75,
                                        fontSize: 14,
                                        borderBottom: "1px solid",
                                        borderColor: "divider"
                                    },
                                    "& tbody tr:hover": {
                                        bgcolor: "action.hover"
                                    },
                                    "& tbody tr:last-child td": {
                                        borderBottom: 0
                                    }
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th>Record ID</th>
                                        <th>Manifest ID</th>
                                        <th>Package ID</th>
                                        <th>Location</th>
                                        <th>Quantity</th>
                                        <th>Status</th>
                                        <th>Created Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginatedRecords.map((record, index) => {
                                        const id = getRecordId(record);
                                        const status = getStatus(record);

                                        return (
                                            <tr
                                                key={
                                                    id ??
                                                    `${getManifestId(record)}-${getPackageId(record)}-${index}`
                                                }
                                            >
                                                <td>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={700}
                                                        color="primary.main"
                                                    >
                                                        {id ?? "—"}
                                                    </Typography>
                                                </td>

                                                <td>
                                                    {getManifestId(record) ?? "—"}
                                                </td>

                                                <td>
                                                    {getPackageId(record) ?? "—"}
                                                </td>

                                                <td>
                                                    {getLocation(record) ?? "—"}
                                                </td>

                                                <td>
                                                    {getQuantity(record) === null
                                                        ? "—"
                                                        : formatNumber(
                                                            getQuantity(record)
                                                        )}
                                                </td>

                                                <td>
                                                    <Chip
                                                        size="small"
                                                        label={status ?? "Unknown"}
                                                        color={getStatusColor(status)}
                                                        variant="outlined"
                                                    />
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        getCreatedDate(record)
                                                    )}
                                                </td>

                                                <td>
                                                    <Tooltip title="View record">
                                                        <span>
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() =>
                                                                    handleView(record)
                                                                }
                                                                aria-label="View putaway record"
                                                            >
                                                                <Visibility />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Box>
                        </Box>

                        {/* PAGINATION */}

                        <Divider />

                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            flexWrap="wrap"
                            gap={2}
                            sx={{ p: 2 }}
                        >
                            <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Rows per page
                                </Typography>

                                <TextField
                                    select
                                    size="small"
                                    value={rowsPerPage}
                                    onChange={(event) =>
                                        setRowsPerPage(
                                            Number(event.target.value)
                                        )
                                    }
                                    sx={{ width: 85 }}
                                >
                                    {[5, 10, 25, 50].map((size) => (
                                        <MenuItem
                                            key={size}
                                            value={size}
                                        >
                                            {size}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>

                            <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {filteredRecords.length === 0
                                        ? "0"
                                        : `${page * rowsPerPage + 1}-${Math.min(
                                            (page + 1) * rowsPerPage,
                                            filteredRecords.length
                                        )}`}{" "}
                                    of {filteredRecords.length}
                                </Typography>

                                <Button
                                    size="small"
                                    variant="outlined"
                                    disabled={page === 0}
                                    onClick={() =>
                                        setPage((current) =>
                                            Math.max(0, current - 1)
                                        )
                                    }
                                >
                                    Previous
                                </Button>

                                <Button
                                    size="small"
                                    variant="outlined"
                                    disabled={page >= totalPages - 1}
                                    onClick={() =>
                                        setPage((current) =>
                                            Math.min(
                                                totalPages - 1,
                                                current + 1
                                            )
                                        )
                                    }
                                >
                                    Next
                                </Button>
                            </Box>
                        </Box>
                    </>
                )}
            </Paper>

            {/* NOTIFICATION */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() =>
                    setSnackbar((current) => ({
                        ...current,
                        open: false
                    }))
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() =>
                        setSnackbar((current) => ({
                            ...current,
                            open: false
                        }))
                    }
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ManifestPackagesPutawayView;

