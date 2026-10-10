// PicklistView.jsx

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    CircularProgress,
    Grid,
    Snackbar,
    Typography
} from "@mui/material";

import PicklistToolbar from "./PicklistToolbar";
import PicklistStatistics from "./PicklistStatistics";
import PicklistSearch from "./PicklistSearch";
import PicklistTable from "./PicklistTable";
import PicklistPagination from "./PicklistPagination";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = (
    import.meta.env.VITE_API_URL || ""
).replace(/\/+$/, "");

const PICKLIST_API_URL = `${API_BASE_URL}/api/Picklist`;

/* =========================================================
   RESPONSE HELPERS
========================================================= */

const getResponseData = (response) => {
    const data = response?.data;

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    if (Array.isArray(data?.items)) {
        return data.items;
    }

    if (Array.isArray(data?.items?.data)) {
        return data.items.data;
    }

    if (Array.isArray(data?.result)) {
        return data.result;
    }

    if (Array.isArray(data?.results)) {
        return data.results;
    }

    return [];
};

const getFieldValue = (item, fields, fallback = "") => {
    for (const field of fields) {
        const value = item?.[field];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return fallback;
};

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

const getStatus = (picklist) =>
    String(
        getFieldValue(picklist, [
            "status",
            "Status",
            "picklistStatus",
            "PicklistStatus"
        ], "Pending")
    );

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

const getItemCount = (picklist) => {
    const directCount = getFieldValue(picklist, [
        "totalItems",
        "TotalItems",
        "itemCount",
        "ItemCount",
        "totalQuantity",
        "TotalQuantity"
    ]);

    if (directCount !== "") {
        const count = Number(directCount);

        if (Number.isFinite(count)) {
            return count;
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

const normalizeStatus = (status) =>
    String(status || "")
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, "");

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
   MAIN COMPONENT
========================================================= */

const PicklistView = () => {
    const [picklists, setPicklists] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [refreshKey, setRefreshKey] = useState(0);

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    /* =====================================================
       SHOW NOTIFICATION
    ===================================================== */

    const showNotification = useCallback(
        (message, severity = "success") => {
            setNotification({
                open: true,
                message,
                severity
            });
        },
        []
    );

    /* =====================================================
       GET ALL PICKLISTS
    ===================================================== */

    const fetchPicklists = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(
                PICKLIST_API_URL,
                {
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            const data = getResponseData(response);

            setPicklists(data);
        } catch (err) {
            console.error(
                "GET ALL PICKLISTS ERROR:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                err?.message ||
                "Failed to fetch picklists.";

            setError(message);

            showNotification(message, "error");
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    useEffect(() => {
        fetchPicklists();
    }, [fetchPicklists, refreshKey]);

    /* =====================================================
       REFRESH
    ===================================================== */

    const handleRefresh = useCallback(() => {
        setRefreshKey((previous) => previous + 1);
    }, []);

    /* =====================================================
       SEARCH AND STATUS FILTERING
    ===================================================== */

    const filteredPicklists = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        return picklists.filter((picklist) => {
            const searchableValues = [
                getPicklistId(picklist),
                getPicklistNumber(picklist),
                getOrderNumber(picklist),
                getWarehouseName(picklist),
                getStatus(picklist),
                getFieldValue(picklist, [
                    "customerName",
                    "CustomerName"
                ]),
                getFieldValue(picklist, [
                    "assignedTo",
                    "AssignedTo",
                    "pickerName",
                    "PickerName"
                ])
            ];

            const matchesSearch =
                !search ||
                searchableValues.some((value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(search)
                );

            const currentStatus = normalizeStatus(
                getStatus(picklist)
            );

            const selectedStatus = normalizeStatus(
                statusFilter
            );

            const matchesStatus =
                statusFilter === "All" ||
                currentStatus === selectedStatus;

            return matchesSearch && matchesStatus;
        });
    }, [picklists, searchTerm, statusFilter]);

    /* =====================================================
       STATISTICS
    ===================================================== */

    const statistics = useMemo(() => {
        const result = {
            total: picklists.length,
            pending: 0,
            inProgress: 0,
            completed: 0,
            cancelled: 0
        };

        picklists.forEach((picklist) => {
            const status = normalizeStatus(
                getStatus(picklist)
            );

            if (
                status === "pending" ||
                status === "created" ||
                status === "new"
            ) {
                result.pending += 1;
            } else if (
                status === "inprogress" ||
                status === "processing" ||
                status === "assigned" ||
                status === "started"
            ) {
                result.inProgress += 1;
            } else if (
                status === "completed" ||
                status === "complete" ||
                status === "picked" ||
                status === "closed"
            ) {
                result.completed += 1;
            } else if (
                status === "cancelled" ||
                status === "canceled"
            ) {
                result.cancelled += 1;
            }
        });

        return result;
    }, [picklists]);

    /* =====================================================
       PAGINATION
    ===================================================== */

    const paginatedPicklists = useMemo(() => {
        const startIndex = page * rowsPerPage;

        return filteredPicklists.slice(
            startIndex,
            startIndex + rowsPerPage
        );
    }, [filteredPicklists, page, rowsPerPage]);

    useEffect(() => {
        setPage(0);
    }, [searchTerm, statusFilter, rowsPerPage]);

    /* =====================================================
       SEARCH HANDLER
    ===================================================== */

    const handleSearchChange = useCallback((value) => {
        setSearchTerm(
            typeof value === "string"
                ? value
                : value?.target?.value ?? ""
        );
    }, []);

    /* =====================================================
       STATUS FILTER HANDLER
    ===================================================== */

    const handleStatusChange = useCallback((value) => {
        setStatusFilter(
            typeof value === "string"
                ? value
                : value?.target?.value ?? "All"
        );
    }, []);

    /* =====================================================
       PAGE HANDLER
    ===================================================== */

    const handlePageChange = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    /* =====================================================
       ROWS PER PAGE HANDLER
    ===================================================== */

    const handleRowsPerPageChange = useCallback((event) => {
        const value = Number(event?.target?.value ?? event);

        if (Number.isFinite(value) && value > 0) {
            setRowsPerPage(value);
            setPage(0);
        }
    }, []);

    /* =====================================================
       VIEW PICKLIST
    ===================================================== */

    const handleView = useCallback((picklist) => {
        const id = getPicklistId(picklist);

        if (id === "") {
            showNotification(
                "Picklist ID is not available.",
                "warning"
            );

            return;
        }

        showNotification(
            `Selected picklist ${getPicklistNumber(picklist)}.`,
            "info"
        );

        // Add navigation or a details dialog here if required.
    }, [showNotification]);

    /* =====================================================
       EDIT PICKLIST
    ===================================================== */

    const handleEdit = useCallback((picklist) => {
        const id = getPicklistId(picklist);

        if (id === "") {
            showNotification(
                "Picklist ID is not available.",
                "warning"
            );

            return;
        }

        // Add edit navigation or an edit dialog here if required.
        showNotification(
            `Edit action selected for picklist ${getPicklistNumber(picklist)}.`,
            "info"
        );
    }, [showNotification]);

    /* =====================================================
       DELETE PICKLIST
    ===================================================== */

    const handleDelete = useCallback(async (picklist) => {
        const id = getPicklistId(picklist);

        if (id === "" || id === null || id === undefined) {
            showNotification(
                "Picklist ID is not available.",
                "warning"
            );

            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete picklist ${getPicklistNumber(picklist)}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await axios.delete(
                `${PICKLIST_API_URL}/${encodeURIComponent(id)}`
            );

            setPicklists((previous) =>
                previous.filter(
                    (item) =>
                        String(getPicklistId(item)) !== String(id)
                )
            );

            showNotification(
                "Picklist deleted successfully.",
                "success"
            );
        } catch (err) {
            console.error(
                "DELETE PICKLIST ERROR:",
                err
            );

            showNotification(
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                err?.message ||
                "Failed to delete picklist.",
                "error"
            );
        }
    }, [showNotification]);

    /* =====================================================
       CLOSE NOTIFICATION
    ===================================================== */

    const handleCloseNotification = useCallback(
        (event, reason) => {
            if (reason === "clickaway") {
                return;
            }

            setNotification((previous) => ({
                ...previous,
                open: false
            }));
        },
        []
    );

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            sx={{
                p: { xs: 1.5, sm: 2.5, md: 3 },
                width: "100%",
                boxSizing: "border-box"
            }}
        >
            {/* PAGE HEADER */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center"
                    },
                    flexDirection: {
                        xs: "column",
                        sm: "row"
                    },
                    gap: 2,
                    mb: 3
                }}
            >
                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                    >
                        Picklists
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Manage, search, and monitor warehouse picklists.
                    </Typography>
                </Box>
            </Box>

            {/* TOOLBAR */}

            <Box sx={{ mb: 3 }}>
                <PicklistToolbar
                    onRefresh={handleRefresh}
                    loading={loading}
                    onAdd={() =>
                        showNotification(
                            "Connect your picklist creation form to enable this action.",
                            "info"
                        )
                    }
                />
            </Box>

            {/* STATISTICS */}

            <Box sx={{ mb: 3 }}>
                <PicklistStatistics
                    statistics={statistics}
                    totalPicklists={statistics.total}
                    pendingPicklists={statistics.pending}
                    inProgressPicklists={statistics.inProgress}
                    completedPicklists={statistics.completed}
                    cancelledPicklists={statistics.cancelled}
                />
            </Box>

            {/* SEARCH */}

            <Box sx={{ mb: 2 }}>
                <PicklistSearch
                    searchTerm={searchTerm}
                    search={searchTerm}
                    onSearchChange={handleSearchChange}
                    onSearch={handleSearchChange}
                    statusFilter={statusFilter}
                    onStatusChange={handleStatusChange}
                    onFilterChange={handleStatusChange}
                    onReset={() => {
                        setSearchTerm("");
                        setStatusFilter("All");
                        setPage(0);
                    }}
                />
            </Box>

            {/* ERROR MESSAGE */}

            {error && !loading && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                        <Typography
                            component="button"
                            onClick={handleRefresh}
                            sx={{
                                border: 0,
                                background: "transparent",
                                color: "inherit",
                                fontWeight: 700,
                                cursor: "pointer"
                            }}
                        >
                            Retry
                        </Typography>
                    }
                >
                    {error}
                </Alert>
            )}

            {/* LOADING */}

            {loading ? (
                <Box
                    sx={{
                        minHeight: 240,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 2
                    }}
                >
                    <CircularProgress />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Loading picklists...
                    </Typography>
                </Box>
            ) : (
                <>
                    {/* TABLE */}

                    <Box
                        sx={{
                            width: "100%",
                            overflowX: "auto"
                        }}
                    >
                        <PicklistTable
                            picklists={paginatedPicklists}
                            data={paginatedPicklists}
                            loading={loading}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            getPicklistId={getPicklistId}
                            getPicklistNumber={getPicklistNumber}
                            getOrderNumber={getOrderNumber}
                            getWarehouseName={getWarehouseName}
                            getStatus={getStatus}
                            getDateValue={getDateValue}
                            getItemCount={getItemCount}
                            formatDate={formatDate}
                        />
                    </Box>

                    {/* EMPTY STATE */}

                    {filteredPicklists.length === 0 && (
                        <Box
                            sx={{
                                py: 5,
                                px: 2,
                                textAlign: "center"
                            }}
                        >
                            <Typography
                                variant="h6"
                                color="text.secondary"
                            >
                                No picklists found
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 1 }}
                            >
                                Try changing your search or status filter.
                            </Typography>
                        </Box>
                    )}

                    {/* PAGINATION */}

                    {filteredPicklists.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <PicklistPagination
                                page={page}
                                count={filteredPicklists.length}
                                totalCount={filteredPicklists.length}
                                rowsPerPage={rowsPerPage}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                            />
                        </Box>
                    )}
                </>
            )}

            {/* NOTIFICATIONS */}

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={handleCloseNotification}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PicklistView;

