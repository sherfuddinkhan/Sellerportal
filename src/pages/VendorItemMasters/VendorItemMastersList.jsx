// =========================================================
// VendorItemMastersList.jsx
// Page-based navigation: Create / Review / Edit / Delete
// =========================================================

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
    Snackbar,
    Typography
} from "@mui/material";

import {
    Add,
    Refresh
} from "@mui/icons-material";

import VendorItemMasterSearch from "./VendorItemMasterSearch";
import VendorItemMasterFilters from "./VendorItemMasterFilters";
import VendorItemMasterTable from "./VendorItemMasterTable";
import VendorItemMasterPagination from "./VendorItemMasterPagination";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_URL = "http://localhost:5000/api/VendorItemMaster";

// =========================================================
// INITIAL FILTERS
// =========================================================

const INITIAL_FILTERS = {
    search: "",
    vendorId: "",
    status: "All"
};

// =========================================================
// VENDOR ITEM MASTERS LIST
// =========================================================

const VendorItemMastersList = () => {
    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // =====================================================
    // NOTIFICATIONS
    // =====================================================

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

    const closeNotification = () => {
        setNotification((previous) => ({
            ...previous,
            open: false
        }));
    };

    // =====================================================
    // GET ITEM ID
    // =====================================================

    const getItemId = useCallback((item) => {
        return (
            item?.vendorItemMasterId ??
            item?.VendorItemMasterId ??
            item?.vendorItemId ??
            item?.VendorItemId ??
            item?.id ??
            item?.Id ??
            null
        );
    }, []);

    // =====================================================
    // FETCH ALL VENDOR ITEM MASTERS
    // =====================================================

    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/all`
            );

            const responseData = response.data;

            const records = Array.isArray(responseData)
                ? responseData
                : Array.isArray(responseData?.data)
                    ? responseData.data
                    : Array.isArray(responseData?.items)
                        ? responseData.items
                        : Array.isArray(responseData?.records)
                            ? responseData.records
                            : [];

            setItems(records);

            // Keep the current page within the available range.
            const totalPages = Math.max(
                1,
                Math.ceil(records.length / rowsPerPage)
            );

            setPage((currentPage) =>
                Math.min(currentPage, totalPages)
            );
        } catch (err) {
            console.error(
                "GET ALL VENDOR ITEM MASTERS ERROR:",
                err
            );

            const message =
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to load vendor item masters.";

            setError(message);

            showNotification(message, "error");
        } finally {
            setLoading(false);
        }
    }, [rowsPerPage, showNotification]);

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    // =====================================================
    // CREATE PAGE
    // =====================================================

    const handleCreate = () => {
        navigate("/vendor-item-masters/create");
    };

    // =====================================================
    // REVIEW / VIEW PAGE
    // =====================================================

    const handleView = (item) => {
        const itemId = getItemId(item);

        if (itemId == null) {
            showNotification(
                "Cannot review item: item ID was not found.",
                "error"
            );
            return;
        }

        navigate(
            `/vendor-item-masters/details/${itemId}`
        );
    };

    // =====================================================
    // EDIT PAGE
    // =====================================================

    const handleEdit = (item) => {
        const itemId = getItemId(item);

        if (itemId == null) {
            showNotification(
                "Cannot edit item: item ID was not found.",
                "error"
            );
            return;
        }

        navigate(
            `/vendor-item-masters/${itemId}/edit`
        );
    };

    // =====================================================
    // DELETE PAGE
    // =====================================================

    const handleDelete = (item) => {
        const itemId = getItemId(item);

        if (itemId == null) {
            showNotification(
                "Cannot delete item: item ID was not found.",
                "error"
            );
            return;
        }

        navigate(
            `/vendor-item-masters/${itemId}/delete`
        );
    };

    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearchChange = (value) => {
        setSearch(value);

        setFilters((previous) => ({
            ...previous,
            search: value
        }));

        setPage(1);
    };

    // =====================================================
    // FILTER CHANGES
    // =====================================================

    const handleFilterChange = (name, value) => {
        setFilters((previous) => ({
            ...previous,
            [name]: value
        }));

        if (name === "search") {
            setSearch(value);
        }

        setPage(1);
    };

    // =====================================================
    // RESET FILTERS
    // =====================================================

    const handleResetFilters = () => {
        setSearch("");
        setFilters({ ...INITIAL_FILTERS });
        setPage(1);
    };

    // =====================================================
    // FILTER RECORDS
    // =====================================================

    const filteredItems = useMemo(() => {
        const normalizedSearch = String(
            filters.search || search || ""
        )
            .trim()
            .toLowerCase();

        return items.filter((item) => {
            const itemCode = String(
                item.itemCode ??
                item.ItemCode ??
                item.itemSkuCode ??
                item.ItemSkuCode ??
                ""
            ).toLowerCase();

            const itemName = String(
                item.itemName ??
                item.ItemName ??
                item.itemSku ??
                item.ItemSku ??
                item.SKU ??
                item.sku ??
                ""
            ).toLowerCase();

            const description = String(
                item.description ??
                item.Description ??
                item.vendorItemCode ??
                item.VendorItemCode ??
                ""
            ).toLowerCase();

            const vendorName = String(
                item.vendorName ??
                item.VendorName ??
                item.vendorCode ??
                item.vendorCode ??
                item.VendorCode ??
                item.vendorSkuCode ??
                item.VendorSkuCode ??
                ""
            ).toLowerCase();

            const vendorId = String(
                item.vendorId ??
                item.VendorId ??
                ""
            );

            const status = String(
                item.status ??
                item.Status ??
                (
                    item.enabled === true ||
                    item.Enabled === true ||
                    item.isActive === true ||
                    item.IsActive === true
                        ? "Active"
                        : "Inactive"
                )
            ).toLowerCase();

            const matchesSearch =
                !normalizedSearch ||
                itemCode.includes(normalizedSearch) ||
                itemName.includes(normalizedSearch) ||
                description.includes(normalizedSearch) ||
                vendorName.includes(normalizedSearch);

            const selectedVendorId = String(
                filters.vendorId || ""
            );

            const matchesVendor =
                !selectedVendorId ||
                vendorId === selectedVendorId;

            const selectedStatus = String(
                filters.status || "All"
            ).toLowerCase();

            const matchesStatus =
                selectedStatus === "all" ||
                status === selectedStatus;

            return (
                matchesSearch &&
                matchesVendor &&
                matchesStatus
            );
        });
    }, [items, filters, search]);

    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages = Math.max(
        1,
        Math.ceil(filteredItems.length / rowsPerPage)
    );

    const safePage = Math.min(page, totalPages);

    const paginatedItems = useMemo(() => {
        const startIndex = (safePage - 1) * rowsPerPage;

        return filteredItems.slice(
            startIndex,
            startIndex + rowsPerPage
        );
    }, [filteredItems, safePage, rowsPerPage]);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>

            {/* PAGE HEADER */}

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 3
                }}
            >
                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Vendor Item Masters
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Manage vendor SKUs, item codes, prices,
                        inventory, lead times, and status.
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
                        startIcon={<Refresh />}
                        onClick={fetchItems}
                        disabled={loading}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreate}
                    >
                        Add Vendor Item
                    </Button>
                </Box>
            </Box>

            {/* SEARCH */}

            <Box sx={{ mb: 2 }}>
                <VendorItemMasterSearch
                    value={search}
                    onChange={handleSearchChange}
                    onSearch={handleSearchChange}
                    onClear={() => {
                        setSearch("");

                        setFilters((previous) => ({
                            ...previous,
                            search: ""
                        }));

                        setPage(1);
                    }}
                    loading={loading}
                />
            </Box>

            {/* FILTERS */}

            <Box sx={{ mb: 3 }}>
                <VendorItemMasterFilters
                    search={filters.search}
                    vendorId={filters.vendorId}
                    status={filters.status}
                    onFilterChange={handleFilterChange}
                    onReset={handleResetFilters}
                    loading={loading}
                />
            </Box>

            {/* ERROR MESSAGE */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={fetchItems}
                            disabled={loading}
                        >
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            )}

            {/* TABLE */}

            <Box
                sx={{
                    position: "relative",
                    minHeight: 160,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    overflow: "hidden"
                }}
            >
                {loading && (
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor:
                                "rgba(255,255,255,0.65)"
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}

                <VendorItemMasterTable
                    items={paginatedItems}
                    loading={loading}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </Box>

            {/* PAGINATION */}

            <VendorItemMasterPagination
                page={safePage}
                rowsPerPage={rowsPerPage}
                totalItems={filteredItems.length}
                onPageChange={setPage}
                onRowsPerPageChange={(value) => {
                    setRowsPerPage(Number(value));
                    setPage(1);
                }}
                loading={loading}
            />

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

export default VendorItemMastersList;
