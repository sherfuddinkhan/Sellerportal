// =========================================================
// VendorItemMastersList.jsx
// =========================================================

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
import VendorItemMasterModal from "./VendorItemMasterModal";

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

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedItem, setSelectedItem] = useState(null);

    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // =====================================================
    // SHOW NOTIFICATION
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
    // GET ALL VENDOR ITEMS
    // =====================================================

    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(API_URL);

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
        } catch (err) {
            console.error(
                "GET ALL VENDOR ITEMS ERROR:",
                err
            );

            const message =
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to load vendor item master records.";

            setError(message);

            showNotification(message, "error");
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    // =====================================================
    // HANDLE SEARCH
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
    // HANDLE FILTER CHANGE
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
        setFilters(INITIAL_FILTERS);
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
                ""
            ).toLowerCase();

            const itemName = String(
                item.itemName ??
                item.ItemName ??
                ""
            ).toLowerCase();

            const description = String(
                item.description ??
                item.Description ??
                ""
            ).toLowerCase();

            const vendorName = String(
                item.vendorName ??
                item.VendorName ??
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
                ""
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

    const paginatedItems = useMemo(() => {
        const startIndex = (page - 1) * rowsPerPage;

        return filteredItems.slice(
            startIndex,
            startIndex + rowsPerPage
        );
    }, [filteredItems, page, rowsPerPage]);

    // =====================================================
    // OPEN CREATE MODAL
    // =====================================================

    const handleCreate = () => {
        setSelectedItem(null);
        setModalMode("create");
        setFormError("");
        setModalOpen(true);
    };

    // =====================================================
    // OPEN VIEW MODAL
    // =====================================================

    const handleView = (item) => {
        setSelectedItem(item);
        setModalMode("view");
        setFormError("");
        setModalOpen(true);
    };

    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const handleEdit = (item) => {
        setSelectedItem(item);
        setModalMode("edit");
        setFormError("");
        setModalOpen(true);
    };

    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const handleCloseModal = () => {
        if (saving) return;

        setModalOpen(false);
        setSelectedItem(null);
        setFormError("");
    };

    // =====================================================
    // CREATE / UPDATE ITEM
    // =====================================================

    const handleSubmit = async (payload) => {
        try {
            setSaving(true);
            setFormError("");

            if (modalMode === "edit") {
                const itemId = getItemId(selectedItem);

                if (itemId == null) {
                    throw new Error(
                        "Cannot update item: item ID was not found."
                    );
                }

                await axios.put(
                    `${API_URL}/${itemId}`,
                    payload
                );

                showNotification(
                    "Vendor item updated successfully."
                );
            } else {
                await axios.post(
                    API_URL,
                    payload
                );

                showNotification(
                    "Vendor item created successfully."
                );
            }

            setModalOpen(false);
            setSelectedItem(null);

            await fetchItems();
        } catch (err) {
            console.error(
                "SAVE VENDOR ITEM ERROR:",
                err
            );

            const message =
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to save vendor item.";

            setFormError(message);
            showNotification(message, "error");
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // DELETE ITEM
    // =====================================================

    const handleDelete = async (item) => {
        const itemId = getItemId(item);

        if (itemId == null) {
            showNotification(
                "Cannot delete item: item ID was not found.",
                "error"
            );
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this vendor item?"
        );

        if (!confirmed) return;

        try {
            setLoading(true);

            await axios.delete(
                `${API_URL}/${itemId}`
            );

            showNotification(
                "Vendor item deleted successfully."
            );

            await fetchItems();
        } catch (err) {
            console.error(
                "DELETE VENDOR ITEM ERROR:",
                err
            );

            showNotification(
                err.response?.data?.message ||
                err.response?.data?.title ||
                "Failed to delete vendor item.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>

            {/* ============================================= */}
            {/* PAGE HEADER */}
            {/* ============================================= */}

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
                        Manage vendor items, prices, units, and status.
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

            {/* ============================================= */}
            {/* SEARCH */}
            {/* ============================================= */}

            <Box sx={{ mb: 2 }}>
                <VendorItemMasterSearch
                    value={search}
                    onChange={handleSearchChange}
                    onSearch={(value) => {
                        setSearch(value);
                        setFilters((previous) => ({
                            ...previous,
                            search: value
                        }));
                        setPage(1);
                    }}
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

            {/* ============================================= */}
            {/* FILTERS */}
            {/* ============================================= */}

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

            {/* ============================================= */}
            {/* ERROR MESSAGE */}
            {/* ============================================= */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={fetchItems}
                        >
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            )}

            {/* ============================================= */}
            {/* TABLE */}
            {/* ============================================= */}

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
                            backgroundColor: "rgba(255,255,255,0.65)"
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

            {/* ============================================= */}
            {/* PAGINATION */}
            {/* ============================================= */}

            <VendorItemMasterPagination
                page={Math.min(page, totalPages)}
                rowsPerPage={rowsPerPage}
                totalItems={filteredItems.length}
                onPageChange={setPage}
                onRowsPerPageChange={(value) => {
                    setRowsPerPage(value);
                    setPage(1);
                }}
                loading={loading}
            />

            {/* ============================================= */}
            {/* CREATE / VIEW / EDIT MODAL */}
            {/* ============================================= */}

            <VendorItemMasterModal
                open={modalOpen}
                mode={modalMode}
                item={selectedItem}
                itemId={getItemId(selectedItem)}
                loading={saving}
                error={formError}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                onEdit={handleEdit}
            />

            {/* ============================================= */}
            {/* NOTIFICATION */}
            {/* ============================================= */}

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() => {
                    setNotification((previous) => ({
                        ...previous,
                        open: false
                    }));
                }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    onClose={() => {
                        setNotification((previous) => ({
                            ...previous,
                            open: false
                        }));
                    }}
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

