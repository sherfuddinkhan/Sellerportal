import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";

import {
    Box,
    Grid,
    Typography,
    CircularProgress,
    Snackbar,
    Alert
} from "@mui/material";

import SupplierAddressToolbar from "./SupplierAddressToolbar";
import SupplierAddressStatistics from "./SupplierAddressStatistics";
import SupplierAddressSearch from "./SupplierAddressSearch";
import SupplierAddressFilters from "./SupplierAddressFilters";
import SupplierAddressTable from "./SupplierAddressTable";
import SupplierAddressPagination from "./SupplierAddressPagination";
import SupplierAddressModal from "./SupplierAddressModal";
import SupplierAddressView from "./SupplierAddressView";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "https://localhost:7000/api";

const SUPPLIER_ADDRESSES_API = `${API_BASE_URL}/SupplierAddress`;
const SUPPLIERS_API = `${API_BASE_URL}/Supplier`;

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (item, ...fields) => {
    for (const field of fields) {
        if (
            item?.[field] !== undefined &&
            item?.[field] !== null
        ) {
            return item[field];
        }
    }

    return "";
};

/* =========================================================
   NORMALIZE RESPONSE
========================================================= */

const normalizeList = (response) => {
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

    if (Array.isArray(data?.result)) {
        return data.result;
    }

    if (Array.isArray(data?.$values)) {
        return data.$values;
    }

    return [];
};

/* =========================================================
   COMPONENT
========================================================= */

const SupplierAddressesList = () => {

    /* =====================================================
       STATE
    ===================================================== */

    const [supplierAddresses, setSupplierAddresses] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);

    const [selectedSupplierAddress, setSelectedSupplierAddress] =
        useState(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [addressTypeFilter, setAddressTypeFilter] = useState("all");
    const [cityFilter, setCityFilter] = useState("");
    const [stateFilter, setStateFilter] = useState("");
    const [countryFilter, setCountryFilter] = useState("");
    const [supplierFilter, setSupplierFilter] = useState("all");

    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    /* =====================================================
       SHOW ALERT
    ===================================================== */

    const showAlert = (
        message,
        severity = "success"
    ) => {
        setAlert({
            open: true,
            message,
            severity
        });
    };

    /* =====================================================
       GET ALL SUPPLIER ADDRESSES
    ===================================================== */

    const fetchSupplierAddresses = async () => {
        setLoading(true);

        try {
            const response = await axios.get(
                SUPPLIER_ADDRESSES_API
            );

            setSupplierAddresses(normalizeList(response));
        } catch (error) {
            console.error(
                "GET ALL SUPPLIER ADDRESSES ERROR:",
                error
            );

            showAlert(
                error?.response?.data?.message ||
                error?.response?.data?.title ||
                "Failed to fetch supplier addresses.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       GET ALL SUPPLIERS
    ===================================================== */

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get(SUPPLIERS_API);

            setSuppliers(normalizeList(response));
        } catch (error) {
            console.error(
                "GET ALL SUPPLIERS ERROR:",
                error
            );

            // Supplier addresses can still be displayed if
            // the supplier endpoint is unavailable.
        }
    };

    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        fetchSupplierAddresses();
        fetchSuppliers();
    }, []);

    /* =====================================================
       FILTER SUPPLIER ADDRESSES
    ===================================================== */

    const filteredSupplierAddresses = useMemo(() => {
        return supplierAddresses.filter((item) => {

            const supplierName = getFieldValue(
                item,
                "supplierName",
                "SupplierName"
            ) || getFieldValue(
                item?.supplier || item?.Supplier,
                "supplierName",
                "SupplierName",
                "name",
                "Name"
            );

            const addressType = getFieldValue(
                item,
                "addressType",
                "AddressType"
            );

            const addressLine1 = getFieldValue(
                item,
                "addressLine1",
                "AddressLine1",
                "address",
                "Address"
            );

            const addressLine2 = getFieldValue(
                item,
                "addressLine2",
                "AddressLine2"
            );

            const city = getFieldValue(
                item,
                "city",
                "City"
            );

            const state = getFieldValue(
                item,
                "state",
                "State"
            );

            const postalCode = getFieldValue(
                item,
                "postalCode",
                "PostalCode",
                "zipCode",
                "ZipCode"
            );

            const country = getFieldValue(
                item,
                "country",
                "Country"
            );

            const supplierId = getFieldValue(
                item,
                "supplierId",
                "SupplierId"
            );

            const status = getFieldValue(
                item,
                "status",
                "Status",
                "isActive",
                "IsActive"
            );

            const searchValue = [
                supplierName,
                addressType,
                addressLine1,
                addressLine2,
                city,
                state,
                postalCode,
                country
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !searchTerm.trim() ||
                searchValue.includes(
                    searchTerm.trim().toLowerCase()
                );

            const normalizedStatus =
                String(status).toLowerCase();

            const isActive =
                status === true ||
                normalizedStatus === "active" ||
                normalizedStatus === "true" ||
                normalizedStatus === "1";

            const matchesStatus =
                statusFilter === "all" ||
                (
                    statusFilter === "active" &&
                    isActive
                ) ||
                (
                    statusFilter === "inactive" &&
                    !isActive
                );

            const matchesAddressType =
                addressTypeFilter === "all" ||
                String(addressType).toLowerCase() ===
                addressTypeFilter.toLowerCase();

            const matchesCity =
                !cityFilter ||
                String(city).toLowerCase() ===
                cityFilter.toLowerCase();

            const matchesState =
                !stateFilter ||
                String(state).toLowerCase() ===
                stateFilter.toLowerCase();

            const matchesCountry =
                !countryFilter ||
                String(country).toLowerCase() ===
                countryFilter.toLowerCase();

            const matchesSupplier =
                supplierFilter === "all" ||
                String(supplierId) === String(supplierFilter);

            return (
                matchesSearch &&
                matchesStatus &&
                matchesAddressType &&
                matchesCity &&
                matchesState &&
                matchesCountry &&
                matchesSupplier
            );
        });
    }, [
        supplierAddresses,
        searchTerm,
        statusFilter,
        addressTypeFilter,
        cityFilter,
        stateFilter,
        countryFilter,
        supplierFilter
    ]);

    /* =====================================================
       PAGINATION
    ===================================================== */

    const paginatedSupplierAddresses = useMemo(() => {
        const startIndex = page * rowsPerPage;

        return filteredSupplierAddresses.slice(
            startIndex,
            startIndex + rowsPerPage
        );
    }, [
        filteredSupplierAddresses,
        page,
        rowsPerPage
    ]);

    useEffect(() => {
        setPage(0);
    }, [
        searchTerm,
        statusFilter,
        addressTypeFilter,
        cityFilter,
        stateFilter,
        countryFilter,
        supplierFilter,
        rowsPerPage
    ]);

    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const handleClearFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setAddressTypeFilter("all");
        setCityFilter("");
        setStateFilter("");
        setCountryFilter("");
        setSupplierFilter("all");
        setPage(0);
    };

    /* =====================================================
       ADD SUPPLIER ADDRESS
    ===================================================== */

    const handleAdd = () => {
        setSelectedSupplierAddress(null);
        setModalOpen(true);
    };

    /* =====================================================
       VIEW SUPPLIER ADDRESS
    ===================================================== */

    const handleView = (item) => {
        setSelectedSupplierAddress(item);
        setViewOpen(true);
    };

    /* =====================================================
       EDIT SUPPLIER ADDRESS
    ===================================================== */

    const handleEdit = (item) => {
        setSelectedSupplierAddress(item);
        setModalOpen(true);
    };

    /* =====================================================
       CREATE / UPDATE SUPPLIER ADDRESS
    ===================================================== */

    const handleSubmit = async (formData) => {
        setSaving(true);

        try {
            const id = getFieldValue(
                selectedSupplierAddress,
                "supplierAddressId",
                "SupplierAddressId",
                "id",
                "Id"
            );

            if (selectedSupplierAddress && id !== "") {
                await axios.put(
                    `${SUPPLIER_ADDRESSES_API}/${id}`,
                    formData
                );

                showAlert(
                    "Supplier address updated successfully."
                );
            } else {
                await axios.post(
                    SUPPLIER_ADDRESSES_API,
                    formData
                );

                showAlert(
                    "Supplier address created successfully."
                );
            }

            setModalOpen(false);
            setSelectedSupplierAddress(null);

            await fetchSupplierAddresses();
        } catch (error) {
            console.error(
                "SAVE SUPPLIER ADDRESS ERROR:",
                error
            );

            showAlert(
                error?.response?.data?.message ||
                error?.response?.data?.title ||
                "Failed to save supplier address.",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       DELETE SUPPLIER ADDRESS
    ===================================================== */

    const handleDelete = async (item) => {
        const id = getFieldValue(
            item,
            "supplierAddressId",
            "SupplierAddressId",
            "id",
            "Id"
        );

        if (id === "") {
            showAlert(
                "Supplier address ID was not found.",
                "error"
            );
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this supplier address?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await axios.delete(
                `${SUPPLIER_ADDRESSES_API}/${id}`
            );

            showAlert(
                "Supplier address deleted successfully."
            );

            await fetchSupplierAddresses();
        } catch (error) {
            console.error(
                "DELETE SUPPLIER ADDRESS ERROR:",
                error
            );

            showAlert(
                error?.response?.data?.message ||
                error?.response?.data?.title ||
                "Failed to delete supplier address.",
                "error"
            );
        }
    };

    /* =====================================================
       PAGINATION HANDLERS
    ===================================================== */

    const handlePageChange = (_, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(
            Number(event.target.value)
        );
        setPage(0);
    };

    /* =====================================================
       CLOSE MODALS
    ===================================================== */

    const handleCloseModal = () => {
        if (saving) {
            return;
        }

        setModalOpen(false);
        setSelectedSupplierAddress(null);
    };

    const handleCloseView = () => {
        setViewOpen(false);
        setSelectedSupplierAddress(null);
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>

            {/* PAGE HEADER */}

            <SupplierAddressToolbar
                totalCount={filteredSupplierAddresses.length}
                onAdd={handleAdd}
                onRefresh={fetchSupplierAddresses}
                loading={loading}
            />

            {/* STATISTICS */}

            <Box sx={{ mt: 3 }}>
                <SupplierAddressStatistics
                    supplierAddresses={supplierAddresses}
                />
            </Box>

            {/* SEARCH */}

            <Box sx={{ mt: 3 }}>
                <SupplierAddressSearch
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    addressTypeFilter={addressTypeFilter}
                    onAddressTypeChange={setAddressTypeFilter}
                    onClear={handleClearFilters}
                />
            </Box>

            {/* ADVANCED FILTERS */}

            <Box sx={{ mt: 2 }}>
                <SupplierAddressFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    addressTypeFilter={addressTypeFilter}
                    onAddressTypeChange={setAddressTypeFilter}
                    cityFilter={cityFilter}
                    onCityChange={setCityFilter}
                    stateFilter={stateFilter}
                    onStateChange={setStateFilter}
                    countryFilter={countryFilter}
                    onCountryChange={setCountryFilter}
                    supplierFilter={supplierFilter}
                    onSupplierChange={setSupplierFilter}
                    suppliers={suppliers}
                    supplierAddresses={supplierAddresses}
                    onClear={handleClearFilters}
                    loading={loading}
                />
            </Box>

            {/* RESULT COUNT */}

            <Box
                sx={{
                    mt: 2,
                    mb: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1
                }}
            >
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Showing {paginatedSupplierAddresses.length} of{" "}
                    {filteredSupplierAddresses.length} supplier addresses
                </Typography>
            </Box>

            {/* TABLE */}

            <Box sx={{ mt: 1 }}>
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: 220
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <SupplierAddressTable
                        supplierAddresses={paginatedSupplierAddresses}
                        loading={loading}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </Box>

            {/* PAGINATION */}

            <SupplierAddressPagination
                count={filteredSupplierAddresses.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                loading={loading}
            />

            {/* CREATE / EDIT MODAL */}

            <SupplierAddressModal
                open={modalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                selectedSupplierAddress={selectedSupplierAddress}
                loading={saving}
                suppliers={suppliers}
            />

            {/* VIEW MODAL */}

            <SupplierAddressView
                open={viewOpen}
                onClose={handleCloseView}
                supplierAddress={selectedSupplierAddress}
            />

            {/* ALERT */}

            <Snackbar
                open={alert.open}
                autoHideDuration={5000}
                onClose={() =>
                    setAlert((previous) => ({
                        ...previous,
                        open: false
                    }))
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    onClose={() =>
                        setAlert((previous) => ({
                            ...previous,
                            open: false
                        }))
                    }
                    severity={alert.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default SupplierAddressesList;

