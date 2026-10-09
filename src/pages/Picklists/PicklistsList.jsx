// PicklistsList.jsx

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
    process.env.REACT_APP_API_URL || ""
).replace(/\/+$/, "");

const PICKLIST_API_URL = `${API_BASE_URL}/api/Picklist`;

/* =========================================================
   RESPONSE HELPER
========================================================= */

const extractPicklists = (response) => {
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

    if (Array.isArray(data?.results)) {
        return data.results;
    }

    if (Array.isArray(data?.result)) {
        return data.result;
    }

    return [];
};

/* =========================================================
   FIELD HELPERS
========================================================= */

const getFieldValue = (
    item,
    fields,
    fallback = ""
) => {
    for (const field of fields) {
        const value = item?.[field];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return fallback;
};

const getPicklistId = (item) =>
    getFieldValue(item, [
        "picklistId",
        "PicklistId",
        "pickListId",
        "PickListId",
        "id",
        "Id"
    ]);

const getPicklistNumber = (item) =>
    getFieldValue(item, [
        "picklistNumber",
        "PicklistNumber",
        "pickListNumber",
        "PickListNumber",
        "picklistNo",
        "PicklistNo",
        "number",
        "Number"
    ], "—");

const getOrderNumber = (item) =>
    getFieldValue(item, [
        "orderNumber",
        "OrderNumber",
        "salesOrderNumber",
        "SalesOrderNumber",
        "orderNo",
        "OrderNo"
    ], "—");

const getWarehouseName = (item) =>
    getFieldValue(item, [
        "warehouseName",
        "WarehouseName",
        "warehouse",
        "Warehouse",
        "locationName",
        "LocationName"
    ], "—");

const getStatus = (item) =>
    String(
        getFieldValue(item, [
            "status",
            "Status",
            "picklistStatus",
            "PicklistStatus"
        ], "Pending")
    );

const getPicklistDate = (item) =>
    getFieldValue(item, [
        "picklistDate",
        "PicklistDate",
        "createdDate",
        "CreatedDate",
        "createdAt",
        "CreatedAt",
        "date",
        "Date"
    ]);

const getItemCount = (item) => {
    const count = getFieldValue(item, [
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

    const items = getFieldValue(item, [
        "items",
        "Items",
        "picklistItems",
        "PicklistItems",
        "details",
        "Details"
    ]);

    return Array.isArray(items) ? items.length : 0;
};

const normalizeStatus = (value) =>
    String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, "");

/* =========================================================
   COMPONENT
========================================================= */

const PicklistsList = () => {
    const [picklists, setPicklists] = useState([]);

    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const [refreshKey, setRefreshKey] = useState(0);

    /* =====================================================
       NOTIFICATION
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

    const closeNotification = useCallback(
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
       GET ALL PICKLISTS
    ===================================================== */

    const fetchPicklists = useCallback(
        async (signal) => {
            setLoading(true);
            setError("");

            try {
                const response = await axios.get(
                    PICKLIST_API_URL,
                    {
                        signal,
                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

                setPicklists(extractPicklists(response));
            } catch (err) {
                if (
                    err?.code === "ERR_CANCELED" ||
                    err?.name === "CanceledError"
                ) {
                    return;
                }

                console.error(
                    "GET ALL PICKLISTS ERROR:",
                    err
                );

                const message =
                    err?.response?.data?.message ||
                    err?.response?.data?.title ||
                    err?.message ||
                    "Unable to load picklists.";

                setError(message);

                showNotification(message, "error");
            } finally {
                if (!signal?.aborted) {
                    setLoading(false);
                }
            }
        },
        [showNotification]
    );

    useEffect(() => {
        const controller = new AbortController();

        fetchPicklists(controller.signal);

        return () => {
            controller.abort();
        };
    }, [fetchPicklists, refreshKey]);

    /* =====================================================
       REFRESH
    ===================================================== */

    const handleRefresh = useCallback(() => {
        setRefreshKey((previous) => previous + 1);
    }, []);

    /* =====================================================
       SEARCH
    ===================================================== */

    const handleSearchChange = useCallback((value) => {
        const nextValue =
            typeof value === "string"
                ? value
                : value?.target?.value ?? "";

        setSearchTerm(nextValue);
        setPage(0);
    }, []);

    /* =====================================================
       STATUS FILTER
    ===================================================== */

    const handleStatusChange = useCallback((value) => {
        const nextValue =
            typeof value === "string"
                ? value
                : value?.target?.value ?? "All";

        setStatusFilter(nextValue);
        setPage(0);
    }, []);

    /* =====================================================
       RESET FILTERS
    ===================================================== */

    const handleResetFilters = useCallback(() => {
        setSearchTerm("");
        setStatusFilter("All");
        setPage(0);
    }, []);

    /* =====================================================
       FILTER PICKLISTS
    ===================================================== */

    const filteredPicklists = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        return picklists.filter((item) => {
            const searchableFields = [
                getPicklistId(item),
                getPicklistNumber(item),
                getOrderNumber(item),
                getWarehouseName(item),
                getStatus(item),
                getFieldValue(item, [
                    "customerName",
                    "CustomerName"
                ]),
                getFieldValue(item, [
                    "pickerName",
                    "PickerName",
                    "assignedTo",
                    "AssignedTo"
                ])
            ];

            const matchesSearch =
                !search ||
                searchableFields.some((value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(search)
                );

            const matchesStatus =
                statusFilter === "All" ||
                normalizeStatus(getStatus(item)) ===
                    normalizeStatus(statusFilter);

            return matchesSearch && matchesStatus;
        });
    }, [
        picklists,
        searchTerm,
        statusFilter
    ]);

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

        picklists.forEach((item) => {
            const status = normalizeStatus(getStatus(item));

            if (
                ["pending", "created", "new"].includes(status)
            ) {
                result.pending += 1;
            } else if (
                [
                    "inprogress",
                    "processing",
                    "assigned",
                    "started"
                ].includes(status)
            ) {
                result.inProgress += 1;
            } else if (
                [
                    "completed",
                    "complete",
                    "picked",
                    "closed"
                ].includes(status)
            ) {
                result.completed += 1;
            } else if (
                ["cancelled", "canceled"].includes(status)
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
    }, [
        filteredPicklists,
        page,
        rowsPerPage
    ]);

    useEffect(() => {
        const lastPage = Math.max(
            0,
            Math.ceil(filteredPicklists.length / rowsPerPage) - 1
        );

        if (page > lastPage) {
            setPage(lastPage);
        }
    }, [
        filteredPicklists.length,
        rowsPerPage,
        page
    ]);

    const handlePageChange = useCallback(
        (event, newPage) => {
            setPage(newPage);
        },
        []
    );

    const handleRowsPerPageChange = useCallback(
        (event) => {
            const value = Number(
                event?.target?.value ?? event
            );

            if (Number.isFinite(value) && value > 0) {
                setRowsPerPage(value);
                setPage(0);
            }
        },
        []
    );

    /* =====================================================
       VIEW PICKLIST
    ===================================================== */

    const handleView = useCallback(
        (item) => {
            const id = getPicklistId(item);

            if (id === "") {
                showNotification(
                    "Picklist ID is missing.",
                    "warning"
                );

                return;
            }

            showNotification(
                `Selected picklist ${getPicklistNumber(item)}.`,
                "info"
            );

            // Connect your details page or dialog here.
        },
        [showNotification]
    );

    /* =====================================================
       EDIT PICKLIST
    ===================================================== */

    const handleEdit = useCallback(
        (item) => {
            const id = getPicklistId(item);

            if (id === "") {
                showNotification(
                    "Picklist ID is missing.",
                    "warning"
                );

                return;
            }

            // Connect your edit page or dialog here.
            showNotification(
                `Edit selected for picklist ${getPicklistNumber(item)}.`,
                "info"
            );
        },
        [showNotification]
    );

    /* =====================================================
       DELETE PICKLIST
    ===================================================== */

    const handleDelete = useCallback(
        async (item) => {
            const id = getPicklistId(item);

            if (id === "" || id === null || id === undefined) {
                showNotification(
                    "Cannot delete picklist: ID is missing.",
                    "warning"
                );

                return;
            }

            const confirmed = window.confirm(
                `Are you sure you want to delete picklist ${getPicklistNumber(item)}?`
            );

            if (!confirmed) {
                return;
            }

            setDeletingId(id);

            try {
                await axios.delete(
                    `${PICKLIST_API_URL}/${encodeURIComponent(id)}`
                );

                setPicklists((previous) =>
                    previous.filter(
                        (picklist) =>
                            String(getPicklistId(picklist)) !==
                            String(id)
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
            } finally {
                setDeletingId(null);
            }
        },
        [showNotification]
    );

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            sx={{
                width: "100%",
                p: {
                    xs: 1.5,
                    sm: 2.5,
                    md: 3
                },
                boxSizing: "border-box"
            }}
        >
            {/* PAGE TOOLBAR */}

            <Box sx={{ mb: 3 }}>
                <PicklistToolbar
                    onRefresh={handleRefresh}
                    loading={loading}
                    refreshing={loading}
                    onAdd={() =>
                        showNotification(
                            "Connect the picklist creation form to enable this action.",
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

            {/* SEARCH AND FILTER */}

            <Box sx={{ mb: 2 }}>
                <PicklistSearch
                    searchTerm={searchTerm}
                    search={searchTerm}
                    onSearchChange={handleSearchChange}
                    onSearch={handleSearchChange}
                    statusFilter={statusFilter}
                    onStatusChange={handleStatusChange}
                    onFilterChange={handleStatusChange}
                    onReset={handleResetFilters}
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
                                font: "inherit",
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
                        minHeight: 220,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
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

                    <PicklistTable
                        picklists={paginatedPicklists}
                        data={paginatedPicklists}
                        loading={loading}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    {/* DELETE PROGRESS */}

                    {deletingId !== null && (
                        <Alert
                            severity="info"
                            sx={{ mt: 2 }}
                            icon={<CircularProgress size={18} />}
                        >
                            Deleting picklist...
                        </Alert>
                    )}

                    {/* EMPTY STATE */}

                    {filteredPicklists.length === 0 && (
                        <Box
                            sx={{
                                py: 4,
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
                                Try a different search term or status filter.
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
                                onRowsPerPageChange={
                                    handleRowsPerPageChange
                                }
                            />
                        </Box>
                    )}
                </>
            )}

            {/* NOTIFICATIONS */}

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={closeNotification}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    onClose={closeNotification}
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

export default PicklistsList;

