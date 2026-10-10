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

import ReversePickupItemToolbar from "./ReversePickupItemToolbar";
import ReversePickupItemStatistics from "./ReversePickupItemStatistics";
import ReversePickupItemTable from "./ReversePickupItemTable";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = (
    import.meta.env.VITE_API_URL || ""
).replace(/\/+$/, "");

const REVERSE_PICKUP_ITEMS_URL =
    `${API_BASE_URL}/api/ReversePickupItems`;

/* =========================================================
   FIELD HELPERS
========================================================= */

const getField = (record, ...fieldNames) => {
    if (!record || typeof record !== "object") {
        return undefined;
    }

    for (const fieldName of fieldNames) {
        if (
            record[fieldName] !== undefined &&
            record[fieldName] !== null
        ) {
            return record[fieldName];
        }

        const pascalCaseName =
            fieldName.charAt(0).toUpperCase() +
            fieldName.slice(1);

        if (
            record[pascalCaseName] !== undefined &&
            record[pascalCaseName] !== null
        ) {
            return record[pascalCaseName];
        }
    }

    return undefined;
};

/* =========================================================
   RESPONSE NORMALIZATION
========================================================= */

const extractRecords = (responseData) => {
    if (Array.isArray(responseData)) {
        return responseData;
    }

    if (!responseData || typeof responseData !== "object") {
        return [];
    }

    const possibleCollections = [
        responseData.data,
        responseData.items,
        responseData.records,
        responseData.results,
        responseData.reversePickupItems,
        responseData.ReversePickupItems,
        responseData.reversePickups,
        responseData.ReversePickups
    ];

    for (const collection of possibleCollections) {
        if (Array.isArray(collection)) {
            return collection;
        }

        if (
            collection &&
            typeof collection === "object"
        ) {
            const nestedRecords = extractRecords(collection);

            if (nestedRecords.length > 0) {
                return nestedRecords;
            }
        }
    }

    return [];
};

/* =========================================================
   SEARCH NORMALIZATION
========================================================= */

const normalizeValue = (value) =>
    String(value ?? "")
        .trim()
        .toLowerCase();

const matchesSearch = (item, searchTerm) => {
    if (!searchTerm) {
        return true;
    }

    const searchableFields = [
        getField(item, "id", "reversePickupItemId"),
        getField(item, "reversePickupId"),
        getField(item, "reversePickupNumber"),
        getField(item, "orderId", "orderNumber"),
        getField(item, "itemId", "productId"),
        getField(item, "itemName", "productName"),
        getField(item, "productName"),
        getField(item, "sku", "SKU"),
        getField(item, "itemCode", "productCode"),
        getField(item, "customerName"),
        getField(item, "trackingNumber"),
        getField(item, "status"),
        getField(item, "reason"),
        getField(item, "notes")
    ];

    return searchableFields.some((value) =>
        normalizeValue(value).includes(searchTerm)
    );
};

/* =========================================================
   STATUS NORMALIZATION
========================================================= */

const getStatus = (item) =>
    normalizeValue(
        getField(item, "status", "pickupStatus")
    );

const matchesStatus = (item, selectedStatus) => {
    if (
        !selectedStatus ||
        selectedStatus === "all"
    ) {
        return true;
    }

    return getStatus(item) === normalizeValue(selectedStatus);
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const ReversePickupItemsList = ({
    apiUrl = REVERSE_PICKUP_ITEMS_URL,
    initialSearch = "",
    initialStatus = "all",
    onView,
    onEdit,
    onDelete,
    onCreate,
    onExport,
    refreshInterval = 0,
    showStatistics = true,
    showToolbar = true,
    title = "Reverse Pickup Items",
    subtitle = "Manage and monitor reverse pickup items"
}) => {
    /* =====================================================
       STATE
    ===================================================== */

    const [items, setItems] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] =
        useState(initialSearch);

    const [statusFilter, setStatusFilter] =
        useState(initialStatus);

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    /* =====================================================
       FETCH REVERSE PICKUP ITEMS
    ===================================================== */

    const fetchItems = useCallback(
        async ({ silent = false } = {}) => {
            if (!apiUrl) {
                setError(
                    "API URL is missing. Configure REACT_APP_API_URL."
                );
                setLoading(false);
                setRefreshing(false);
                return;
            }

            if (silent) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            try {
                console.log(
                    "\nGET ALL REVERSE PICKUP ITEMS"
                );

                const response = await axios.get(apiUrl, {
                    timeout: 30000,
                    headers: {
                        Accept: "application/json"
                    }
                });

                const records = extractRecords(response.data);

                setItems(records);

                console.log(
                    "REVERSE PICKUP ITEMS FETCHED:",
                    records.length
                );
            } catch (requestError) {
                console.error(
                    "GET REVERSE PICKUP ITEMS ERROR:",
                    requestError
                );

                const message =
                    requestError.response?.data?.message ||
                    requestError.response?.data?.title ||
                    requestError.message ||
                    "Failed to load reverse pickup items.";

                setError(message);

                setSnackbar({
                    open: true,
                    message,
                    severity: "error"
                });
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [apiUrl]
    );

    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    /* =====================================================
       OPTIONAL AUTO REFRESH
    ===================================================== */

    useEffect(() => {
        const interval = Number(refreshInterval);

        if (
            !Number.isFinite(interval) ||
            interval <= 0
        ) {
            return undefined;
        }

        const timer = setInterval(() => {
            fetchItems({ silent: true });
        }, interval);

        return () => clearInterval(timer);
    }, [fetchItems, refreshInterval]);

    /* =====================================================
       FILTERED ITEMS
    ===================================================== */

    const filteredItems = useMemo(() => {
        const normalizedSearch =
            normalizeValue(searchTerm);

        return items.filter((item) => {
            return (
                matchesSearch(item, normalizedSearch) &&
                matchesStatus(item, statusFilter)
            );
        });
    }, [items, searchTerm, statusFilter]);

    /* =====================================================
       PAGINATION
    ===================================================== */

    const paginatedItems = useMemo(() => {
        const startIndex = page * rowsPerPage;

        return filteredItems.slice(
            startIndex,
            startIndex + rowsPerPage
        );
    }, [filteredItems, page, rowsPerPage]);

    useEffect(() => {
        const lastPage = Math.max(
            0,
            Math.ceil(filteredItems.length / rowsPerPage) - 1
        );

        if (page > lastPage) {
            setPage(lastPage);
        }
    }, [filteredItems.length, page, rowsPerPage]);

    /* =====================================================
       SEARCH HANDLER
    ===================================================== */

    const handleSearchChange = useCallback((value) => {
        setSearchTerm(
            typeof value === "string"
                ? value
                : value?.target?.value || ""
        );

        setPage(0);
    }, []);

    /* =====================================================
       STATUS FILTER HANDLER
    ===================================================== */

    const handleStatusChange = useCallback((value) => {
        setStatusFilter(
            typeof value === "string"
                ? value
                : value?.target?.value || "all"
        );

        setPage(0);
    }, []);

    /* =====================================================
       PAGINATION HANDLERS
    ===================================================== */

    const handlePageChange = useCallback(
        (event, newPage) => {
            setPage(newPage);
        },
        []
    );

    const handleRowsPerPageChange = useCallback(
        (event) => {
            const nextValue = Number(event.target.value);

            setRowsPerPage(
                Number.isFinite(nextValue) && nextValue > 0
                    ? nextValue
                    : 10
            );

            setPage(0);
        },
        []
    );

    /* =====================================================
       REFRESH HANDLER
    ===================================================== */

    const handleRefresh = useCallback(() => {
        fetchItems({ silent: true });
    }, [fetchItems]);

    /* =====================================================
       CREATE HANDLER
    ===================================================== */

    const handleCreate = useCallback(() => {
        if (typeof onCreate === "function") {
            onCreate();
            return;
        }

        setSnackbar({
            open: true,
            message: "Connect the create form to enable this action.",
            severity: "info"
        });
    }, [onCreate]);

    /* =====================================================
       DELETE SUCCESS HANDLER
    ===================================================== */

    const handleDeleted = useCallback(
        async (deletedItem) => {
            const deletedId = getField(
                deletedItem,
                "id",
                "reversePickupItemId"
            );

            if (deletedId !== undefined) {
                setItems((currentItems) =>
                    currentItems.filter((item) => {
                        const itemId = getField(
                            item,
                            "id",
                            "reversePickupItemId"
                        );

                        return String(itemId) !== String(deletedId);
                    })
                );
            } else {
                await fetchItems({ silent: true });
            }

            setSnackbar({
                open: true,
                message: "Reverse pickup item deleted successfully.",
                severity: "success"
            });
        },
        [fetchItems]
    );

    /* =====================================================
       EXPORT HANDLER
    ===================================================== */

    const handleExport = useCallback(() => {
        if (typeof onExport === "function") {
            onExport(filteredItems);
            return;
        }

        if (filteredItems.length === 0) {
            setSnackbar({
                open: true,
                message: "There are no items to export.",
                severity: "warning"
            });

            return;
        }

        const columns = [
            "id",
            "reversePickupId",
            "reversePickupNumber",
            "orderNumber",
            "itemName",
            "sku",
            "quantity",
            "status",
            "pickupCost",
            "trackingNumber",
            "reason",
            "notes"
        ];

        const escapeCsvValue = (value) => {
            const text = String(value ?? "");

            return `"${text.replace(/"/g, '""')}"`;
        };

        const csvRows = [
            columns.join(","),
            ...filteredItems.map((item) =>
                columns
                    .map((column) =>
                        escapeCsvValue(
                            getField(item, column)
                        )
                    )
                    .join(",")
            )
        ];

        const blob = new Blob(
            ["\uFEFF", csvRows.join("\n")],
            {
                type: "text/csv;charset=utf-8;"
            }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "reverse-pickup-items.csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);

        setSnackbar({
            open: true,
            message: "Reverse pickup items exported successfully.",
            severity: "success"
        });
    }, [filteredItems, onExport]);

    /* =====================================================
       STATISTICS
    ===================================================== */

    const statistics = useMemo(() => {
        const totalItems = items.length;

        const totalQuantity = items.reduce(
            (total, item) => {
                const quantity = Number(
                    getField(item, "quantity", "itemQuantity")
                );

                return total + (
                    Number.isFinite(quantity) ? quantity : 0
                );
            },
            0
        );

        const totalCost = items.reduce(
            (total, item) => {
                const cost = Number(
                    getField(
                        item,
                        "pickupCost",
                        "returnCost",
                        "totalCost"
                    )
                );

                return total + (
                    Number.isFinite(cost) ? cost : 0
                );
            },
            0
        );

        const pendingCount = items.filter((item) =>
            [
                "pending",
                "requested",
                "scheduled"
            ].includes(getStatus(item))
        ).length;

        const completedCount = items.filter((item) =>
            [
                "completed",
                "delivered",
                "picked up",
                "pickedup",
                "approved"
            ].includes(getStatus(item))
        ).length;

        const cancelledCount = items.filter((item) =>
            [
                "cancelled",
                "canceled",
                "failed",
                "rejected"
            ].includes(getStatus(item))
        ).length;

        return {
            totalItems,
            totalCount: totalItems,
            totalQuantity,
            totalCost,
            pendingCount,
            completedCount,
            cancelledCount
        };
    }, [items]);

    /* =====================================================
       SNACKBAR HANDLER
    ===================================================== */

    const handleSnackbarClose = useCallback(
        (event, reason) => {
            if (reason === "clickaway") {
                return;
            }

            setSnackbar((current) => ({
                ...current,
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
                width: "100%",
                p: { xs: 1, sm: 2, md: 3 }
            }}
        >
            {/* PAGE HEADER AND TOOLBAR */}

            {showToolbar && (
                <ReversePickupItemToolbar
                    title={title}
                    subtitle={subtitle}
                    reversePickups={items}
                    pickups={items}
                    items={items}
                    totalCount={statistics.totalCount}
                    totalItems={statistics.totalItems}
                    totalQuantity={statistics.totalQuantity}
                    totalCost={statistics.totalCost}
                    pendingCount={statistics.pendingCount}
                    completedCount={statistics.completedCount}
                    cancelledCount={statistics.cancelledCount}
                    search={searchTerm}
                    searchTerm={searchTerm}
                    status={statusFilter}
                    statusFilter={statusFilter}
                    loading={loading || refreshing}
                    onSearchChange={handleSearchChange}
                    onSearch={handleSearchChange}
                    onStatusChange={handleStatusChange}
                    onRefresh={handleRefresh}
                    onExport={handleExport}
                    onCreate={handleCreate}
                />
            )}

            {/* STATISTICS */}

            {showStatistics && (
                <Box sx={{ mt: 2, mb: 3 }}>
                    <ReversePickupItemStatistics
                        reversePickups={items}
                        pickups={items}
                        items={items}
                        totalCount={statistics.totalCount}
                        totalItems={statistics.totalItems}
                        totalQuantity={statistics.totalQuantity}
                        totalCost={statistics.totalCost}
                        pendingCount={statistics.pendingCount}
                        completedCount={statistics.completedCount}
                        cancelledCount={statistics.cancelledCount}
                        loading={loading}
                    />
                </Box>
            )}

            {/* REFRESH INDICATOR */}

            {refreshing && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2
                    }}
                >
                    <CircularProgress size={16} />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Refreshing reverse pickup items...
                    </Typography>
                </Box>
            )}

            {/* ERROR MESSAGE */}

            {error && !loading && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                        <Typography
                            component="span"
                            onClick={handleRefresh}
                            sx={{
                                cursor: "pointer",
                                fontWeight: 600,
                                px: 1
                            }}
                        >
                            Retry
                        </Typography>
                    }
                >
                    {error}
                </Alert>
            )}

            {/* ITEMS TABLE */}

            <Box sx={{ width: "100%" }}>
                <ReversePickupItemTable
                    reversePickups={paginatedItems}
                    pickups={paginatedItems}
                    items={paginatedItems}
                    records={paginatedItems}
                    loading={loading}
                    error={error}
                    search={searchTerm}
                    searchTerm={searchTerm}
                    status={statusFilter}
                    statusFilter={statusFilter}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalCount={filteredItems.length}
                    count={filteredItems.length}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDeleted={handleDeleted}
                    onRefresh={handleRefresh}
                    onPageChange={handlePageChange}
                    onChangePage={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </Box>

            {/* SNACKBAR */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ReversePickupItemsList;

