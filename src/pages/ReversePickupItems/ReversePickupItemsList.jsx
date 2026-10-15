
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

import ReversePickupItemToolbar from "./ReversePickupItemToolbar";
import ReversePickupItemStatistics from "./ReversePickupItemStatistics";
import ReversePickupItemTable from "./ReversePickupItemTable";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_BASE_URL = "http://localhost:5000";

const REVERSE_PICKUP_ITEMS_URL =
    `${API_BASE_URL}/api/reverse-pickup-items/all`;

const REVERSE_PICKUP_ITEM_DELETE_URL =
    `${API_BASE_URL}/api/reverse-pickup-items`;

// =========================================================
// FIELD HELPERS
// =========================================================

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

// =========================================================
// RESPONSE NORMALIZATION
// =========================================================

const extractRecords = (data) => {
    if (Array.isArray(data)) {
        return data;
    }

    if (!data || typeof data !== "object") {
        return [];
    }

    const collections = [
        data.data,
        data.items,
        data.records,
        data.results,
        data.reversePickupItems,
        data.ReversePickupItems
    ];

    for (const collection of collections) {
        if (Array.isArray(collection)) {
            return collection;
        }

        if (
            collection &&
            typeof collection === "object"
        ) {
            const nested = extractRecords(collection);

            if (nested.length > 0) {
                return nested;
            }
        }
    }

    return [];
};

// =========================================================
// NORMALIZATION HELPERS
// =========================================================

const normalizeValue = (value) =>
    String(value ?? "").trim().toLowerCase();

const getItemId = (item) =>
    getField(item, "id", "reversePickupItemId");

const getStatus = (item) =>
    normalizeValue(
        getField(item, "status", "pickupStatus")
    );

const matchesSearch = (item, searchTerm) => {
    if (!searchTerm) {
        return true;
    }

    const searchableFields = [
        getField(item, "id"),
        getField(item, "sellerId"),
        getField(item, "customerId"),
        getField(item, "reversePickupId"),
        getField(item, "reversePickupNumber"),
        getField(item, "saleOrderItemCode"),
        getField(item, "orderNumber", "orderId"),
        getField(item, "itemName", "productName"),
        getField(item, "itemSku", "sku"),
        getField(item, "customerName"),
        getField(item, "trackingNumber"),
        getField(item, "status", "pickupStatus"),
        getField(item, "reason"),
        getField(item, "notes"),
        getField(item, "totalPrice"),
        getField(item, "sellingPrice"),
        getField(item, "discount")
    ];

    return searchableFields.some((value) =>
        normalizeValue(value).includes(searchTerm)
    );
};

const matchesStatus = (item, selectedStatus) => {
    if (
        !selectedStatus ||
        normalizeValue(selectedStatus) === "all"
    ) {
        return true;
    }

    return getStatus(item) === normalizeValue(selectedStatus);
};

// =========================================================
// MAIN COMPONENT
// =========================================================

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
    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [statusFilter, setStatusFilter] = useState(initialStatus);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deletingId, setDeletingId] = useState(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // =====================================================
    // NOTIFICATION
    // =====================================================

    const showMessage = useCallback(
        (message, severity = "success") => {
            setSnackbar({
                open: true,
                message,
                severity
            });
        },
        []
    );

    const closeSnackbar = useCallback((event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setSnackbar((current) => ({
            ...current,
            open: false
        }));
    }, []);

    // =====================================================
    // FETCH RECORDS
    // =====================================================

    const fetchItems = useCallback(
        async ({ silent = false } = {}) => {
            if (!apiUrl) {
                setError("The reverse pickup items API URL is missing.");
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
                const response = await axios.get(apiUrl, {
                    timeout: 30000,
                    headers: {
                        Accept: "application/json"
                    }
                });

                const records = extractRecords(response.data);

                setItems(records);

                console.log(
                    "Reverse pickup items loaded:",
                    records
                );
            } catch (requestError) {
                console.error(
                    "Failed to fetch reverse pickup items:",
                    requestError
                );

                const message =
                    requestError.response?.data?.message ||
                    requestError.response?.data?.title ||
                    requestError.message ||
                    "Failed to load reverse pickup items.";

                setError(message);
                showMessage(message, "error");
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [apiUrl, showMessage]
    );

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    // =====================================================
    // AUTOMATIC REFRESH
    // =====================================================

    useEffect(() => {
        const interval = Number(refreshInterval);

        if (!Number.isFinite(interval) || interval <= 0) {
            return undefined;
        }

        const timer = setInterval(() => {
            fetchItems({ silent: true });
        }, interval);

        return () => clearInterval(timer);
    }, [fetchItems, refreshInterval]);

    // =====================================================
    // SEARCH AND FILTER
    // =====================================================

    const filteredItems = useMemo(() => {
        const query = normalizeValue(searchTerm);

        return items.filter((item) =>
            matchesSearch(item, query) &&
            matchesStatus(item, statusFilter)
        );
    }, [items, searchTerm, statusFilter]);

    // =====================================================
    // PAGINATION
    // =====================================================

    const paginatedItems = useMemo(() => {
        const start = page * rowsPerPage;

        return filteredItems.slice(
            start,
            start + rowsPerPage
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

    const handleSearchChange = useCallback((value) => {
        const nextValue =
            typeof value === "string"
                ? value
                : value?.target?.value ?? "";

        setSearchTerm(nextValue);
        setPage(0);
    }, []);

    const handleStatusChange = useCallback((value) => {
        const nextValue =
            typeof value === "string"
                ? value
                : value?.target?.value ?? "all";

        setStatusFilter(nextValue);
        setPage(0);
    }, []);

    const handlePageChange = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const handleRowsPerPageChange = useCallback((event) => {
        const nextValue = Number(event.target.value);

        setRowsPerPage(
            Number.isFinite(nextValue) && nextValue > 0
                ? nextValue
                : 10
        );

        setPage(0);
    }, []);

    const handleRefresh = useCallback(() => {
        fetchItems({ silent: true });
    }, [fetchItems]);

    // =====================================================
    // VIEW ACTION
    // =====================================================

    const handleViewItem = useCallback(
        (record) => {
            if (typeof onView === "function") {
                onView(record);
                return;
            }

            const id = getItemId(record);

            if (id === undefined || id === null) {
                showMessage("Cannot open details: item ID is missing.", "error");
                return;
            }

            navigate(`/reverse-pickup-items/details/${id}`);
        },
        [navigate, onView, showMessage]
    );

    // =====================================================
    // EDIT ACTION
    // =====================================================

    const handleEditItem = useCallback(
        (record) => {
            if (typeof onEdit === "function") {
                onEdit(record);
                return;
            }

            const id = getItemId(record);

            if (id === undefined || id === null) {
                showMessage("Cannot edit item: item ID is missing.", "error");
                return;
            }

            navigate(`/reverse-pickup-items/${id}/edit`);
        },
        [navigate, onEdit, showMessage]
    );

    // =====================================================
    // DELETE ACTION
    // =====================================================

    const handleDeleteItem = useCallback(
        async (record) => {
            if (typeof onDelete === "function") {
                onDelete(record);
                return;
            }

            const id = getItemId(record);

            if (id === undefined || id === null) {
                showMessage("Cannot delete item: item ID is missing.", "error");
                return;
            }

            const confirmed = window.confirm(
                `Are you sure you want to delete reverse pickup item ${id}?`
            );

            if (!confirmed) {
                return;
            }

            setDeletingId(id);

            try {
                await axios.delete(
                    `${REVERSE_PICKUP_ITEM_DELETE_URL}/${encodeURIComponent(id)}`,
                    {
                        timeout: 30000
                    }
                );

                setItems((currentItems) =>
                    currentItems.filter(
                        (item) =>
                            String(getItemId(item)) !== String(id)
                    )
                );

                showMessage(
                    "Reverse pickup item deleted successfully.",
                    "success"
                );
            } catch (requestError) {
                console.error(
                    "Delete reverse pickup item failed:",
                    requestError
                );

                showMessage(
                    requestError.response?.data?.message ||
                    requestError.response?.data?.title ||
                    requestError.message ||
                    "Failed to delete reverse pickup item.",
                    "error"
                );
            } finally {
                setDeletingId(null);
            }
        },
        [onDelete, showMessage]
    );

    // =====================================================
    // CREATE ACTION
    // =====================================================

    const handleCreate = useCallback(() => {
        if (typeof onCreate === "function") {
            onCreate();
            return;
        }

        navigate("/reverse-pickup-items/create");
    }, [navigate, onCreate]);

    // =====================================================
    // CSV EXPORT
    // =====================================================

    const handleExport = useCallback(() => {
        if (typeof onExport === "function") {
            onExport(filteredItems);
            return;
        }

        if (filteredItems.length === 0) {
            showMessage("There are no items to export.", "warning");
            return;
        }

        const columns = [
            "id",
            "sellerId",
            "customerId",
            "reversePickupId",
            "saleOrderItemCode",
            "reason",
            "itemSku",
            "totalPrice",
            "sellingPrice",
            "discount"
        ];

        const escapeCsvValue = (value) =>
            `"${String(value ?? "").replace(/"/g, '""')}"`;

        const csvContent = [
            columns.join(","),
            ...filteredItems.map((item) =>
                columns
                    .map((column) =>
                        escapeCsvValue(getField(item, column))
                    )
                    .join(",")
            )
        ].join("\r\n");

        const blob = new Blob(
            ["\uFEFF", csvContent],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "reverse-pickup-items.csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);

        showMessage("CSV exported successfully.", "success");
    }, [filteredItems, onExport, showMessage]);

    // =====================================================
    // STATISTICS
    // =====================================================

    const statistics = useMemo(() => {
        const sumField = (...fields) =>
            items.reduce((total, item) => {
                const value = Number(getField(item, ...fields));

                return total + (
                    Number.isFinite(value) ? value : 0
                );
            }, 0);

        return {
            totalItems: items.length,
            totalCount: items.length,
            totalQuantity: sumField("quantity", "itemQuantity"),
            totalCost: sumField("totalPrice", "pickupCost", "returnCost", "totalCost"),
            totalSellingPrice: sumField("sellingPrice"),
            totalDiscount: sumField("discount"),

            pendingCount: items.filter((item) =>
                ["pending", "requested", "scheduled"].includes(getStatus(item))
            ).length,

            completedCount: items.filter((item) =>
                ["completed", "delivered", "picked up", "pickedup", "approved"]
                    .includes(getStatus(item))
            ).length,

            cancelledCount: items.filter((item) =>
                ["cancelled", "canceled", "failed", "rejected"]
                    .includes(getStatus(item))
            ).length
        };
    }, [items]);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box
            sx={{
                width: "100%",
                p: { xs: 1, sm: 2, md: 3 }
            }}
        >
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
                    totalSellingPrice={statistics.totalSellingPrice}
                    totalDiscount={statistics.totalDiscount}
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
                        totalSellingPrice={statistics.totalSellingPrice}
                        totalDiscount={statistics.totalDiscount}
                        pendingCount={statistics.pendingCount}
                        completedCount={statistics.completedCount}
                        cancelledCount={statistics.cancelledCount}
                        loading={loading}
                    />
                </Box>
            )}

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
                    <Typography variant="body2" color="text.secondary">
                        Refreshing reverse pickup items...
                    </Typography>
                </Box>
            )}

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
                onView={handleViewItem}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onRefresh={handleRefresh}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                deletingId={deletingId}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={closeSnackbar}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    onClose={closeSnackbar}
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
