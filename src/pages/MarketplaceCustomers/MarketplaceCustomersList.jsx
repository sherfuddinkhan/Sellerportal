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

import MarketplaceCustomersTable from "./MarketplaceCustomersTable";

// =====================================================
// API CONFIGURATION
// =====================================================

const API_BASE_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const MARKETPLACE_CUSTOMERS_API =
    `${API_BASE_URL}/marketplace/customers`;

// =====================================================
// RESPONSE HELPER
// =====================================================

const extractCustomers = (response) => {
    const data = response?.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.result)) return data.result;

    return [];
};

// =====================================================
// FIELD HELPERS
// =====================================================

const getField = (item, name, fallback = "") => {
    if (!item) return fallback;

    const pascalName =
        name.charAt(0).toUpperCase() + name.slice(1);

    return item[name] ?? item[pascalName] ?? fallback;
};

const getCustomerId = (item) => getField(item, "id", "");

// =====================================================
// COMPONENT
// =====================================================

const MarketplaceCustomersList = () => {
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
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

    // =================================================
    // NOTIFICATIONS
    // =================================================

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

    // =================================================
    // GET ALL MARKETPLACE CUSTOMERS
    // GET http://localhost:5000/api/marketplace/customers/all
    // =================================================

    const fetchCustomers = useCallback(
        async (signal) => {
            setLoading(true);
            setError("");

            const requestUrl =
                `${MARKETPLACE_CUSTOMERS_API}/all`;

            try {
                console.log(
                    "Fetching marketplace customers:",
                    requestUrl
                );

                const response = await axios.get(requestUrl, {
                    signal,
                    headers: {
                        Accept: "application/json"
                    }
                });

                const result = extractCustomers(response);

                setCustomers(result);

                console.log(
                    "Marketplace customers loaded:",
                    result.length
                );
            } catch (err) {
                if (
                    err?.code === "ERR_CANCELED" ||
                    err?.name === "CanceledError"
                ) {
                    return;
                }

                console.error(
                    "GET MARKETPLACE CUSTOMERS ERROR",
                    {
                        requestUrl,
                        status: err?.response?.status,
                        response: err?.response?.data,
                        message: err?.message
                    }
                );

                const backendDetails = err?.response?.data;

                const message =
                    backendDetails?.message ||
                    backendDetails?.title ||
                    (typeof backendDetails === "string"
                        ? backendDetails
                        : null) ||
                    `Request failed (${err?.response?.status || "network error"}). URL: ${requestUrl}`;

                setCustomers([]);
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

        fetchCustomers(controller.signal);

        return () => controller.abort();
    }, [fetchCustomers, refreshKey]);

    // =================================================
    // REFRESH
    // =================================================

    const handleRefresh = useCallback(() => {
        setRefreshKey((previous) => previous + 1);
    }, []);

    // =================================================
    // SEARCH
    // =================================================

    const handleSearchChange = useCallback((event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    }, []);

    const handleResetSearch = useCallback(() => {
        setSearchTerm("");
        setPage(0);
    }, []);

    // =================================================
    // FILTER CUSTOMERS
    // =================================================

    const filteredCustomers = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        if (!search) return customers;

        return customers.filter((item) => {
            const fields = [
                getCustomerId(item),
                getField(item, "sellerId"),
                getField(item, "customerId"),
                getField(item, "marketplaceName"),
                getField(item, "marketplaceCustomerId"),
                getField(item, "companyName"),
                getField(item, "gstin"),
                getField(item, "email"),
                getField(item, "phone"),
                getField(item, "city"),
                getField(item, "state"),
                getField(item, "pincode")
            ];

            return fields.some((value) =>
                String(value ?? "")
                    .toLowerCase()
                    .includes(search)
            );
        });
    }, [customers, searchTerm]);

    // =================================================
    // PAGINATION
    // =================================================

    const paginatedCustomers = useMemo(() => {
        const start = page * rowsPerPage;

        return filteredCustomers.slice(
            start,
            start + rowsPerPage
        );
    }, [filteredCustomers, page, rowsPerPage]);

    useEffect(() => {
        const lastPage = Math.max(
            0,
            Math.ceil(filteredCustomers.length / rowsPerPage) - 1
        );

        if (page > lastPage) {
            setPage(lastPage);
        }
    }, [filteredCustomers.length, rowsPerPage, page]);

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

    // =================================================
    // NAVIGATION ACTIONS
    // =================================================

    const navigateToCustomer = useCallback(
        (action, customer) => {
            const id = getCustomerId(customer);

            if (id === "" || id === null || id === undefined) {
                showNotification(
                    "Marketplace customer database ID is missing.",
                    "warning"
                );
                return;
            }

            navigate(
                `/marketplace-customers/${action}/${encodeURIComponent(id)}`,
                {
                    state: {
                        customer
                    }
                }
            );
        },
        [navigate, showNotification]
    );

    const handleView = useCallback(
        (customer) => navigateToCustomer("view", customer),
        [navigateToCustomer]
    );

    const handleDetails = useCallback(
        (customer) => navigateToCustomer("details", customer),
        [navigateToCustomer]
    );

    const handleEdit = useCallback(
        (customer) => navigateToCustomer("edit", customer),
        [navigateToCustomer]
    );

    const handleDelete = useCallback(
        (customer) => navigateToCustomer("delete", customer),
        [navigateToCustomer]
    );

    // =================================================
    // RENDER
    // =================================================

    return (
        <Box
            sx={{
                width: "100%",
                p: { xs: 1.5, sm: 2.5, md: 3 },
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
                        Marketplace Customers
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Manage your marketplace customer mappings.
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Total: {customers.length}
                        {" | "}
                        Filtered: {filteredCustomers.length}
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
                        onClick={() =>
                            navigate("/marketplace-customers/create")
                        }
                    >
                        Create Customer
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
                        label="Search Marketplace Customers"
                        placeholder="Search company, marketplace, GSTIN, email, phone..."
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
                    sx={{ mb: 2, whiteSpace: "pre-wrap" }}
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

            {/* LOADING AND TABLE */}

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
                        Loading marketplace customers...
                    </Typography>
                </Box>
            ) : (
                <MarketplaceCustomersTable
                    customers={paginatedCustomers}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    totalCount={filteredCustomers.length}
                    onView={handleView}
                    onDetails={handleDetails}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {/* NOTIFICATIONS */}

            <Snackbar
                open={notification.open}
                autoHideDuration={5000}
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

export default MarketplaceCustomersList;
