
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
    Button,
    CircularProgress,
    Paper,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";

import {
    Add as AddIcon,
    Refresh as RefreshIcon
} from "@mui/icons-material";

import PicklistTable from "./PicklistTable";

/* =========================================================
   API CONFIGURATION
   NODE PROXY ONLY
========================================================= */

const API_URL = "http://localhost:5000/api/Picklist";

/* =========================================================
   RESPONSE HELPER
========================================================= */

const extractPicklists = (response) => {
    const data = response?.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.result)) return data.result;

    return [];
};

/* =========================================================
   FIELD HELPERS
========================================================= */

const getField = (item, name, fallback = "") => {
    if (!item) return fallback;

    const pascalName =
        name.charAt(0).toUpperCase() + name.slice(1);

    return item[name] ?? item[pascalName] ?? fallback;
};

const getPicklistCode = (item) =>
    getField(item, "picklistCode", "");

const getPicklistId = (item) =>
    getField(item, "picklistId", "");

/* =========================================================
   COMPONENT
========================================================= */

const PicklistsList = () => {
    const navigate = useNavigate();

    const [picklists, setPicklists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
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
        if (reason === "clickaway") return;

        setNotification((previous) => ({
            ...previous,
            open: false
        }));
    }, []);

    /* =====================================================
       GET ALL PICKLISTS THROUGH NODE PROXY
       GET http://localhost:5000/api/Picklist
    ===================================================== */

    const fetchPicklists = useCallback(
        async (signal) => {
            setLoading(true);
            setError("");

            try {
                const response = await axios.get(API_URL, {
                    signal,
                    headers: {
                        Accept: "application/json"
                    },
                    timeout: 15000
                });

                setPicklists(extractPicklists(response));
            } catch (err) {
                if (
                    err?.code === "ERR_CANCELED" ||
                    err?.name === "CanceledError"
                ) {
                    return;
                }

                console.error("GET PICKLISTS ERROR:", err);

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

        return () => controller.abort();
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

    const handleSearchChange = useCallback((event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    }, []);

    const handleResetSearch = useCallback(() => {
        setSearchTerm("");
        setPage(0);
    }, []);

    /* =====================================================
       FILTER PICKLISTS
    ===================================================== */

    const filteredPicklists = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        if (!search) return picklists;

        return picklists.filter((item) => {
            const searchableFields = [
                getPicklistCode(item),
                getPicklistId(item),
                getField(item, "destination"),
                getField(item, "shippingPackageCodes"),
                getField(item, "sellerId"),
                getField(item, "customerId"),
                getField(item, "createdDate")
            ];

            return searchableFields.some((value) =>
                String(value ?? "")
                    .toLowerCase()
                    .includes(search)
            );
        });
    }, [picklists, searchTerm]);

    /* =====================================================
       PAGINATION
    ===================================================== */

    const paginatedPicklists = useMemo(() => {
        const start = page * rowsPerPage;

        return filteredPicklists.slice(
            start,
            start + rowsPerPage
        );
    }, [filteredPicklists, page, rowsPerPage]);

    useEffect(() => {
        const lastPage = Math.max(
            0,
            Math.ceil(filteredPicklists.length / rowsPerPage) - 1
        );

        if (page > lastPage) {
            setPage(lastPage);
        }
    }, [filteredPicklists.length, rowsPerPage, page]);

    const handlePageChange = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const handleRowsPerPageChange = useCallback((event) => {
        const value = Number(event.target.value);

        if (Number.isFinite(value) && value > 0) {
            setRowsPerPage(value);
            setPage(0);
        }
    }, []);

    /* =====================================================
       NAVIGATION
       Uses picklistCode as the record identifier
    ===================================================== */

    const navigateToPicklist = useCallback(
        (action, picklist) => {
            const code = getPicklistCode(picklist);

            if (!code) {
                showNotification(
                    "Picklist code is missing.",
                    "warning"
                );
                return;
            }

            navigate(
                `/picklists/${action}/${encodeURIComponent(code)}`,
                {
                    state: {
                        picklist
                    }
                }
            );
        },
        [navigate, showNotification]
    );

    const handleView = useCallback(
        (picklist) => navigateToPicklist("view", picklist),
        [navigateToPicklist]
    );

    const handleDetails = useCallback(
        (picklist) => navigateToPicklist("details", picklist),
        [navigateToPicklist]
    );

    const handleEdit = useCallback(
        (picklist) => navigateToPicklist("edit", picklist),
        [navigateToPicklist]
    );

    const handleDelete = useCallback(
        (picklist) => navigateToPicklist("delete", picklist),
        [navigateToPicklist]
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
            {/* PAGE HEADER */}

            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2
                }}
            >
                <Box>
                    <Typography variant="h5" fontWeight={700}>
                        Picklists
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Manage shipping picklists, destinations,
                        packages, sellers and customers.
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Total: {picklists.length}
                        {" | "}
                        Filtered: {filteredPicklists.length}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap"
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/picklists/create")}
                    >
                        Create Picklist
                    </Button>
                </Box>
            </Paper>

            {/* SEARCH */}

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        flexWrap: "wrap"
                    }}
                >
                    <TextField
                        fullWidth
                        label="Search Picklists"
                        placeholder="Search code, destination, package, seller or customer..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ flex: "1 1 300px" }}
                    />

                    <Button
                        variant="outlined"
                        onClick={handleResetSearch}
                    >
                        Reset
                    </Button>
                </Box>
            </Paper>

            {/* ERROR */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={handleRefresh}
                        >
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            )}

            {/* LOADING / TABLE */}

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

                    <Typography color="text.secondary">
                        Loading picklists...
                    </Typography>
                </Box>
            ) : (
                <PicklistTable
                    picklists={paginatedPicklists}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    totalCount={filteredPicklists.length}
                    onView={handleView}
                    onDetails={handleDetails}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
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
