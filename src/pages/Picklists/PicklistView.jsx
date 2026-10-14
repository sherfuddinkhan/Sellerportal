// PicklistView.jsx

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

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
   React -> Node.js proxy -> ASP.NET Core API
========================================================= */

const PICKLIST_API_URL = "http://localhost:5000/api/Picklist";

/* =========================================================
   RESPONSE HELPERS
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

const getResponseData = (response) => {
    let data = response?.data;

    for (let i = 0; i < 4; i += 1) {
        if (Array.isArray(data)) {
            return data;
        }

        if (!data || typeof data !== "object") {
            return [];
        }

        const nextData = getFieldValue(
            data,
            ["data", "items", "result", "results", "value"],
            null
        );

        if (nextData === null || nextData === data) {
            return [];
        }

        data = nextData;
    }

    return Array.isArray(data) ? data : [];
};

/* =========================================================
   PICKLIST FIELDS
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
        "createdDate",
        "CreatedDate",
        "picklistDate",
        "PicklistDate",
        "createdAt",
        "CreatedAt"
    ]);

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

const getItemCount = (picklist) =>
    getPackageCodes(picklist).length;

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
   ERROR HELPER
========================================================= */

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;

    if (typeof data === "string") {
        return data;
    }

    return (
        getFieldValue(data, [
            "message",
            "Message",
            "title",
            "Title",
            "error",
            "Error"
        ], "") ||
        error?.message ||
        fallback
    );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const PicklistView = () => {
    const navigate = useNavigate();

    const [picklists, setPicklists] = useState([]);
    const [loading, setLoading] = useState(true);
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
       NOTIFICATIONS
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

    const closeNotification = useCallback((event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setNotification((previous) => ({
            ...previous,
            open: false
        }));
    }, []);

    /* =====================================================
       GET ALL PICKLISTS
       Node GET /api/Picklist
       -> .NET GET /api/picklists/all
    ===================================================== */

    const fetchPicklists = useCallback(async (signal) => {
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

            const data = getResponseData(response);

            setPicklists(data);
        } catch (err) {
            if (
                err?.name === "CanceledError" ||
                err?.code === "ERR_CANCELED"
            ) {
                return;
            }

            console.error("GET ALL PICKLISTS ERROR:", {
                url: PICKLIST_API_URL,
                status: err?.response?.status,
                data: err?.response?.data,
                message: err?.message
            });

            const message = getErrorMessage(
                err,
                "Failed to fetch picklists. Check that the Node proxy and .NET API are running."
            );

            setPicklists([]);
            setError(message);

            showNotification(message, "error");
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    }, [showNotification]);

    useEffect(() => {
        const controller = new AbortController();

        fetchPicklists(controller.signal);

        return () => controller.abort();
    }, [fetchPicklists, refreshKey]);

    /* =====================================================
       REFRESH
    ===================================================== */

    const handleRefresh = useCallback(() => {
        setRefreshKey((previous) => previous + 1);
    }, []);

    /* =====================================================
       ADD PICKLIST
    ===================================================== */

    const handleAdd = useCallback(() => {
        navigate("/picklists/create");
    }, [navigate]);

    /* =====================================================
       SEARCH AND FILTER
    ===================================================== */

    const filteredPicklists = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        return picklists.filter((picklist) => {
            const searchableValues = [
                getPicklistCode(picklist),
                getPicklistId(picklist),
                getDestination(picklist),
                getStatus(picklist),
                getSellerId(picklist),
                getCustomerId(picklist),
                ...getPackageCodes(picklist)
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
            const status = normalizeStatus(getStatus(picklist));

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
       STATUS HANDLER
    ===================================================== */

    const handleStatusChange = useCallback((value) => {
        setStatusFilter(
            typeof value === "string"
                ? value
                : value?.target?.value ?? "All"
        );
    }, []);

    /* =====================================================
       PAGINATION HANDLERS
    ===================================================== */

    const handlePageChange = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const handleRowsPerPageChange = useCallback((event) => {
        const value = Number(
            event?.target?.value ?? event
        );

        if (Number.isFinite(value) && value > 0) {
            setRowsPerPage(value);
            setPage(0);
        }
    }, []);

    /* =====================================================
       VIEW PICKLIST
    ===================================================== */

    const handleView = useCallback((picklist) => {
        const identifier = getPicklistIdentifier(picklist);

        if (
            identifier === "" ||
            identifier === null ||
            identifier === undefined
        ) {
            showNotification(
                "Picklist code is not available.",
                "warning"
            );
            return;
        }

        navigate(
            `/picklists/view/${encodeURIComponent(String(identifier))}`
        );
    }, [navigate, showNotification]);

    /* =====================================================
       PICKLIST DETAILS
    ===================================================== */

    const handleDetails = useCallback((picklist) => {
        const identifier = getPicklistIdentifier(picklist);

        if (
            identifier === "" ||
            identifier === null ||
            identifier === undefined
        ) {
            showNotification(
                "Picklist code is not available.",
                "warning"
            );
            return;
        }

        navigate(
            `/picklists/details/${encodeURIComponent(String(identifier))}`
        );
    }, [navigate, showNotification]);

    /* =====================================================
       EDIT PICKLIST
    ===================================================== */

    const handleEdit = useCallback((picklist) => {
        const identifier = getPicklistIdentifier(picklist);

        if (
            identifier === "" ||
            identifier === null ||
            identifier === undefined
        ) {
            showNotification(
                "Picklist code is not available.",
                "warning"
            );
            return;
        }

        navigate(
            `/picklists/edit/${encodeURIComponent(String(identifier))}`
        );
    }, [navigate, showNotification]);

    /* =====================================================
       DELETE PICKLIST
    ===================================================== */

    const handleDelete = useCallback(async (picklist) => {
        const identifier = getPicklistIdentifier(picklist);

        if (
            identifier === "" ||
            identifier === null ||
            identifier === undefined
        ) {
            showNotification(
                "Picklist code is not available.",
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
                `${PICKLIST_API_URL}/${encodeURIComponent(String(identifier))}`
            );

            setPicklists((previous) =>
                previous.filter(
                    (item) =>
                        String(getPicklistIdentifier(item)) !==
                        String(identifier)
                )
            );

            showNotification(
                "Picklist deleted successfully.",
                "success"
            );
        } catch (err) {
            console.error("DELETE PICKLIST ERROR:", {
                identifier,
                status: err?.response?.status,
                data: err?.response?.data,
                message: err?.message
            });

            showNotification(
                getErrorMessage(err, "Failed to delete picklist."),
                "error"
            );
        }
    }, [showNotification]);

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
                    onAdd={handleAdd}
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

            {/* ERROR */}

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

            {/* LOADING / TABLE */}

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
                    {filteredPicklists.length > 0 ? (
                        <>
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
                                    onDetails={handleDetails}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    getPicklistId={getPicklistId}
                                    getPicklistCode={getPicklistCode}
                                    getPicklistNumber={getPicklistNumber}
                                    getDestination={getDestination}
                                    getStatus={getStatus}
                                    getDateValue={getDateValue}
                                    getItemCount={getItemCount}
                                    formatDate={formatDate}
                                />
                            </Box>

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
                        </>
                    ) : (
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
                                {error
                                    ? "Picklists could not be loaded"
                                    : "No picklists found"}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 1 }}
                            >
                                {error
                                    ? "Check the Node.js proxy and .NET API, then retry."
                                    : "Try changing your search or status filter."}
                            </Typography>
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

export default PicklistView;
