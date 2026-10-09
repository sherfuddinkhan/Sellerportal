import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";

import {
    Box,
    Alert,
    Snackbar,
    CircularProgress,
    Typography,
    Button,
    Stack
} from "@mui/material";

import {
    Refresh,
    Add
} from "@mui/icons-material";

/* =========================================================
   REVERSE PICKUP ADDRESS COMPONENTS
========================================================= */

import ReversePickupAddressToolbar from "./ReversePickupAddressToolbar";
import ReversePickupAddressStatistics from "./ReversePickupAddressStatistics";
import ReversePickupAddressSearch from "./ReversePickupAddressSearch";
import ReversePickupAddressFilters, {
    initialReversePickupAddressFilters
} from "./ReversePickupAddressFilters";
import ReversePickupAddressTable from "./ReversePickupAddressTable";
import ReversePickupAddressPagination from "./ReversePickupAddressPagination";
import ReversePickupAddressModal from "./ReversePickupAddressModal";
import ReversePickupAddressForm from "./ReversePickupAddressForm";
import ReversePickupAddressView from "./ReversePickupAddressView";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = (
    process.env.REACT_APP_API_URL || ""
).replace(/\/+$/, "");

const DEFAULT_API_ENDPOINT = "/api/ReversePickupAddress";

const getEndpoint = (endpoint) => {
    const normalizedEndpoint = endpoint || DEFAULT_API_ENDPOINT;

    return `${API_BASE_URL}${normalizedEndpoint.startsWith("/")
        ? normalizedEndpoint
        : `/${normalizedEndpoint}`}`;
};

/* =========================================================
   RESPONSE HELPERS
========================================================= */

const extractRecords = (responseData) => {
    if (Array.isArray(responseData)) {
        return responseData;
    }

    if (Array.isArray(responseData?.data)) {
        return responseData.data;
    }

    if (Array.isArray(responseData?.items)) {
        return responseData.items;
    }

    if (Array.isArray(responseData?.records)) {
        return responseData.records;
    }

    if (Array.isArray(responseData?.result)) {
        return responseData.result;
    }

    if (Array.isArray(responseData?.$values)) {
        return responseData.$values;
    }

    if (Array.isArray(responseData?.data?.items)) {
        return responseData.data.items;
    }

    return [];
};

/* =========================================================
   FIELD VALUE HELPER
========================================================= */

const getFieldValue = (
    record,
    fields,
    fallback = ""
) => {
    for (const field of fields) {
        const value = record?.[field];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return fallback;
};

/* =========================================================
   ADDRESS ID HELPER
========================================================= */

const getAddressId = (address) =>
    getFieldValue(
        address,
        [
            "reversePickupAddressId",
            "ReversePickupAddressId",
            "addressId",
            "AddressId",
            "id",
            "Id"
        ],
        null
    );

/* =========================================================
   ERROR MESSAGE HELPER
========================================================= */

const getErrorMessage = (error, fallback) => {
    const responseData = error?.response?.data;

    if (typeof responseData === "string") {
        return responseData;
    }

    if (responseData?.message) {
        return responseData.message;
    }

    if (responseData?.title) {
        return responseData.title;
    }

    if (responseData?.errors) {
        return Object.values(responseData.errors)
            .flat()
            .join(" ");
    }

    if (error?.message) {
        return error.message;
    }

    return fallback;
};

/* =========================================================
   NORMALIZE TEXT
========================================================= */

const normalizeText = (value) =>
    String(value ?? "")
        .trim()
        .toLowerCase();

/* =========================================================
   BOOLEAN NORMALIZATION
========================================================= */

const toBoolean = (value) => {
    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "number") {
        return value === 1;
    }

    if (typeof value === "string") {
        return value.trim().toLowerCase() === "true" ||
            value.trim() === "1" ||
            value.trim().toLowerCase() === "active";
    }

    return false;
};

/* =========================================================
   REVERSE PICKUP ADDRESSES LIST
========================================================= */

const ReversePickupAddressesList = ({
    endpoint = DEFAULT_API_ENDPOINT,

    pageSize: initialPageSize = 10,

    rowsPerPageOptions = [5, 10, 25, 50, 100],

    title = "Reverse Pickup Addresses",

    subtitle = "Manage reverse pickup address information",

    autoLoad = true,

    enableCreate = true,
    enableEdit = true,
    enableDelete = true,
    enableView = true,

    showStatistics = true,
    showSearch = true,
    showFilters: initialShowFilters = true,

    onAddressCreated,
    onAddressUpdated,
    onAddressDeleted
}) => {

    /* =====================================================
       API URL
    ===================================================== */

    const apiUrl = useMemo(
        () => getEndpoint(endpoint),
        [endpoint]
    );

    /* =====================================================
       DATA STATE
    ===================================================== */

    const [addresses, setAddresses] = useState([]);

    const [loading, setLoading] = useState(false);

    const [submitting, setSubmitting] = useState(false);

    const [deletingId, setDeletingId] = useState(null);

    /* =====================================================
       SEARCH AND FILTER STATE
    ===================================================== */

    const [searchTerm, setSearchTerm] = useState("");

    const [filters, setFilters] = useState({
        ...initialReversePickupAddressFilters
    });

    const [showFilters, setShowFilters] = useState(
        initialShowFilters
    );

    /* =====================================================
       PAGINATION STATE
    ===================================================== */

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(
        initialPageSize
    );

    /* =====================================================
       MODAL STATE
    ===================================================== */

    const [modalOpen, setModalOpen] = useState(false);

    const [modalMode, setModalMode] = useState("create");

    const [selectedAddress, setSelectedAddress] = useState(null);

    const [viewOpen, setViewOpen] = useState(false);

    /* =====================================================
       NOTIFICATION STATE
    ===================================================== */

    const [notification, setNotification] = useState({
        open: false,
        severity: "success",
        message: ""
    });

    const [apiError, setApiError] = useState("");

    /* =====================================================
       NOTIFICATION HELPER
    ===================================================== */

    const showNotification = useCallback(
        (message, severity = "success") => {
            setNotification({
                open: true,
                severity,
                message
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

    /* =====================================================
       GET ALL ADDRESSES
    ===================================================== */

    const fetchAddresses = useCallback(async () => {
        setLoading(true);
        setApiError("");

        try {
            const response = await axios.get(apiUrl);

            const records = extractRecords(response.data);

            setAddresses(records);

            return records;
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Failed to load reverse pickup addresses."
            );

            setApiError(message);

            showNotification(message, "error");

            return null;
        } finally {
            setLoading(false);
        }
    }, [apiUrl, showNotification]);

    /* =====================================================
       INITIAL API LOAD
    ===================================================== */

    useEffect(() => {
        if (autoLoad) {
            fetchAddresses();
        }
    }, [autoLoad, fetchAddresses]);

    /* =====================================================
       UPDATE FILTER
    ===================================================== */

    const handleFilterChange = (field, value) => {
        if (field === "toggleFilters") {
            setShowFilters(Boolean(value));
            return;
        }

        setFilters((previous) => ({
            ...previous,
            [field]: value
        }));

        setPage(0);
    };

    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const handleClearFilters = () => {
        setSearchTerm("");

        setFilters({
            ...initialReversePickupAddressFilters
        });

        setPage(0);
    };

    /* =====================================================
       SEARCH AND FILTER RECORDS
    ===================================================== */

    const filteredAddresses = useMemo(() => {
        const term = normalizeText(searchTerm);

        return addresses.filter((address) => {
            const searchableValues = [
                getFieldValue(address, [
                    "contactName",
                    "ContactName",
                    "name",
                    "Name"
                ]),
                getFieldValue(address, [
                    "contactPerson",
                    "ContactPerson"
                ]),
                getFieldValue(address, [
                    "phoneNumber",
                    "PhoneNumber",
                    "phone",
                    "Phone",
                    "mobileNumber",
                    "MobileNumber"
                ]),
                getFieldValue(address, [
                    "email",
                    "Email",
                    "emailAddress",
                    "EmailAddress"
                ]),
                getFieldValue(address, [
                    "addressLine1",
                    "AddressLine1",
                    "address1",
                    "Address1"
                ]),
                getFieldValue(address, [
                    "addressLine2",
                    "AddressLine2",
                    "address2",
                    "Address2"
                ]),
                getFieldValue(address, [
                    "landmark",
                    "Landmark"
                ]),
                getFieldValue(address, [
                    "city",
                    "City"
                ]),
                getFieldValue(address, [
                    "state",
                    "State",
                    "stateName",
                    "StateName"
                ]),
                getFieldValue(address, [
                    "postalCode",
                    "PostalCode",
                    "zipCode",
                    "ZipCode",
                    "pinCode",
                    "PinCode"
                ]),
                getFieldValue(address, [
                    "country",
                    "Country"
                ]),
                getFieldValue(address, [
                    "addressType",
                    "AddressType"
                ])
            ];

            const matchesSearch =
                !term ||
                searchableValues.some((value) =>
                    normalizeText(value).includes(term)
                );

            if (!matchesSearch) {
                return false;
            }

            const city = normalizeText(
                getFieldValue(address, ["city", "City"])
            );

            const state = normalizeText(
                getFieldValue(address, [
                    "state",
                    "State",
                    "stateName",
                    "StateName"
                ])
            );

            const country = normalizeText(
                getFieldValue(address, ["country", "Country"])
            );

            const addressType = normalizeText(
                getFieldValue(address, [
                    "addressType",
                    "AddressType"
                ])
            );

            const statusValue = getFieldValue(
                address,
                [
                    "status",
                    "Status",
                    "addressStatus",
                    "AddressStatus"
                ],
                ""
            );

            const activeValue = getFieldValue(
                address,
                [
                    "isActive",
                    "IsActive",
                    "active",
                    "Active"
                ],
                undefined
            );

            const isActive = activeValue !== undefined
                ? toBoolean(activeValue)
                : normalizeText(statusValue) === "active";

            const defaultValue = toBoolean(
                getFieldValue(
                    address,
                    [
                        "isDefault",
                        "IsDefault",
                        "defaultAddress",
                        "DefaultAddress",
                        "isDefaultAddress",
                        "IsDefaultAddress"
                    ],
                    false
                )
            );

            const matchesCity =
                !filters.city ||
                city.includes(normalizeText(filters.city));

            const matchesState =
                !filters.state ||
                state.includes(normalizeText(filters.state));

            const matchesCountry =
                !filters.country ||
                country === normalizeText(filters.country);

            const matchesType =
                !filters.addressType ||
                addressType === normalizeText(filters.addressType);

            const matchesStatus =
                !filters.status ||
                (
                    normalizeText(filters.status) === "active"
                        ? isActive
                        : !isActive
                );

            const matchesDefault =
                filters.isDefault === "" ||
                filters.isDefault === null ||
                filters.isDefault === undefined ||
                defaultValue === (
                    filters.isDefault === true ||
                    filters.isDefault === "true"
                );

            return (
                matchesCity &&
                matchesState &&
                matchesCountry &&
                matchesType &&
                matchesStatus &&
                matchesDefault
            );
        });
    }, [addresses, searchTerm, filters]);

    /* =====================================================
       RESET PAGE WHEN FILTERED RESULTS CHANGE
    ===================================================== */

    useEffect(() => {
        setPage(0);
    }, [searchTerm, filters]);

    /* =====================================================
       PAGINATION
    ===================================================== */

    const paginatedAddresses = useMemo(() => {
        const startIndex = page * rowsPerPage;

        return filteredAddresses.slice(
            startIndex,
            startIndex + rowsPerPage
        );
    }, [filteredAddresses, page, rowsPerPage]);

    useEffect(() => {
        const maxPage = Math.max(
            0,
            Math.ceil(filteredAddresses.length / rowsPerPage) - 1
        );

        if (page > maxPage) {
            setPage(maxPage);
        }
    }, [filteredAddresses.length, rowsPerPage, page]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(Number(newRowsPerPage));
        setPage(0);
    };

    /* =====================================================
       CREATE ADDRESS
    ===================================================== */

    const handleCreate = () => {
        setSelectedAddress(null);
        setModalMode("create");
        setModalOpen(true);
    };

    /* =====================================================
       EDIT ADDRESS
    ===================================================== */

    const handleEdit = (address) => {
        setSelectedAddress(address);
        setModalMode("edit");
        setModalOpen(true);
    };

    /* =====================================================
       VIEW ADDRESS
    ===================================================== */

    const handleView = (address) => {
        setSelectedAddress(address);
        setViewOpen(true);
    };

    /* =====================================================
       CLOSE CREATE / EDIT MODAL
    ===================================================== */

    const handleCloseModal = () => {
        if (submitting) {
            return;
        }

        setModalOpen(false);
        setSelectedAddress(null);
    };

    /* =====================================================
       CLOSE VIEW
    ===================================================== */

    const handleCloseView = () => {
        setViewOpen(false);
        setSelectedAddress(null);
    };

    /* =====================================================
       CREATE ADDRESS API
    ===================================================== */

    const handleCreateAddress = async (formData) => {
        setSubmitting(true);

        try {
            await axios.post(apiUrl, formData);

            setModalOpen(false);
            setSelectedAddress(null);

            showNotification(
                "Reverse pickup address created successfully."
            );

            if (typeof onAddressCreated === "function") {
                onAddressCreated(formData);
            }

            await fetchAddresses();
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Failed to create reverse pickup address."
            );

            showNotification(message, "error");

            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    /* =====================================================
       UPDATE ADDRESS API
    ===================================================== */

    const handleUpdateAddress = async (formData) => {
        const addressId = getAddressId(selectedAddress);

        if (addressId === null || addressId === "") {
            showNotification(
                "Address ID is missing. Unable to update this address.",
                "error"
            );

            return;
        }

        setSubmitting(true);

        try {
            await axios.put(
                `${apiUrl}/${encodeURIComponent(addressId)}`,
                formData
            );

            setModalOpen(false);
            setSelectedAddress(null);

            showNotification(
                "Reverse pickup address updated successfully."
            );

            if (typeof onAddressUpdated === "function") {
                onAddressUpdated({
                    ...selectedAddress,
                    ...formData
                });
            }

            await fetchAddresses();
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Failed to update reverse pickup address."
            );

            showNotification(message, "error");

            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    /* =====================================================
       DELETE ADDRESS API
    ===================================================== */

    const handleDelete = async (address) => {
        const addressId = getAddressId(address);

        if (addressId === null || addressId === "") {
            showNotification(
                "Address ID is missing. Unable to delete this address.",
                "error"
            );

            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this reverse pickup address?"
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(addressId);

        try {
            await axios.delete(
                `${apiUrl}/${encodeURIComponent(addressId)}`
            );

            showNotification(
                "Reverse pickup address deleted successfully."
            );

            if (typeof onAddressDeleted === "function") {
                onAddressDeleted(address);
            }

            await fetchAddresses();
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Failed to delete reverse pickup address."
            );

            showNotification(message, "error");
        } finally {
            setDeletingId(null);
        }
    };

    /* =====================================================
       STATISTICS
    ===================================================== */

    const statistics = useMemo(() => {
        const activeCount = addresses.filter((address) => {
            const activeValue = getFieldValue(
                address,
                ["isActive", "IsActive", "active", "Active"],
                undefined
            );

            if (activeValue !== undefined) {
                return toBoolean(activeValue);
            }

            return normalizeText(
                getFieldValue(address, [
                    "status",
                    "Status",
                    "addressStatus",
                    "AddressStatus"
                ])
            ) === "active";
        }).length;

        const defaultCount = addresses.filter((address) =>
            toBoolean(
                getFieldValue(
                    address,
                    [
                        "isDefault",
                        "IsDefault",
                        "defaultAddress",
                        "DefaultAddress",
                        "isDefaultAddress",
                        "IsDefaultAddress"
                    ],
                    false
                )
            )
        ).length;

        return {
            total: addresses.length,
            active: activeCount,
            inactive: addresses.length - activeCount,
            default: defaultCount
        };
    }, [addresses]);

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ width: "100%", p: { xs: 1, sm: 2, md: 3 } }}>

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <ReversePickupAddressToolbar
                title={title}
                subtitle={subtitle}
                totalAddresses={addresses.length}
                filteredCount={filteredAddresses.length}
                loading={loading}
                showFilters={showFilters}
                onCreate={handleCreate}
                onRefresh={fetchAddresses}
                onToggleFilters={() =>
                    setShowFilters((previous) => !previous)
                }
                onClearFilters={handleClearFilters}
            />

            {/* =================================================
                API ERROR
            ================================================= */}

            {apiError && (
                <Alert
                    severity="error"
                    sx={{ mt: 2, mb: 2 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            startIcon={<Refresh />}
                            onClick={fetchAddresses}
                            disabled={loading}
                        >
                            Retry
                        </Button>
                    }
                >
                    {apiError}
                </Alert>
            )}

            {/* =================================================
                STATISTICS
            ================================================= */}

            {showStatistics && (
                <Box sx={{ mt: 2 }}>
                    <ReversePickupAddressStatistics
                        addresses={addresses}
                        loading={loading}
                        statistics={statistics}
                    />
                </Box>
            )}

            {/* =================================================
                SEARCH
            ================================================= */}

            {showSearch && (
                <Box sx={{ mt: 2 }}>
                    <ReversePickupAddressSearch
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                        showFilters={showFilters}
                        totalCount={addresses.length}
                        filteredCount={filteredAddresses.length}
                        loading={loading}
                    />
                </Box>
            )}

            {/* =================================================
                ADVANCED FILTERS
            ================================================= */}

            {showFilters && (
                <Box sx={{ mt: 2 }}>
                    <ReversePickupAddressFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                        loading={loading}
                        showTitle
                        showClearButton
                        showApplyButton={false}
                    />
                </Box>
            )}

            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <Box
                sx={{
                    mt: 3,
                    mb: 1.5,
                    display: "flex",
                    flexDirection: {
                        xs: "column",
                        sm: "row"
                    },
                    alignItems: {
                        xs: "flex-start",
                        sm: "center"
                    },
                    justifyContent: "space-between",
                    gap: 1
                }}
            >
                <Box>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Address Records
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {filteredAddresses.length} address
                        {filteredAddresses.length === 1 ? "" : "es"} found
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={fetchAddresses}
                        disabled={loading}
                    >
                        Refresh
                    </Button>

                    {enableCreate && (
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleCreate}
                            disabled={loading}
                        >
                            Add Address
                        </Button>
                    )}
                </Stack>
            </Box>

            {/* =================================================
                LOADING STATE
            ================================================= */}

            {loading && addresses.length === 0 ? (
                <Box
                    sx={{
                        py: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2
                    }}
                >
                    <CircularProgress />

                    <Typography color="text.secondary">
                        Loading reverse pickup addresses...
                    </Typography>
                </Box>
            ) : (
                <>
                    {/* =========================================
                        ADDRESS TABLE
                    ========================================= */}

                    <ReversePickupAddressTable
                        addresses={paginatedAddresses}
                        loading={loading}
                        onView={enableView ? handleView : undefined}
                        onEdit={enableEdit ? handleEdit : undefined}
                        onDelete={enableDelete ? handleDelete : undefined}
                        showPagination={false}
                        deletingId={deletingId}
                    />

                    {/* =========================================
                        PAGINATION
                    ========================================= */}

                    <ReversePickupAddressPagination
                        page={page}
                        rowsPerPage={rowsPerPage}
                        totalCount={filteredAddresses.length}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        rowsPerPageOptions={rowsPerPageOptions}
                        loading={loading}
                    />
                </>
            )}

            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            <ReversePickupAddressModal
                open={modalOpen}
                onClose={handleCloseModal}
                mode={modalMode}
                title={
                    modalMode === "edit"
                        ? "Edit Reverse Pickup Address"
                        : "Create Reverse Pickup Address"
                }
                loading={false}
                submitting={submitting}
                formId="reverse-pickup-address-form"
                showSubmitButton={false}
            >
                <ReversePickupAddressForm
                    key={`${modalMode}-${getAddressId(selectedAddress) ?? "new"}`}
                    formId="reverse-pickup-address-form"
                    mode={modalMode}
                    address={selectedAddress}
                    onSubmit={
                        modalMode === "edit"
                            ? handleUpdateAddress
                            : handleCreateAddress
                    }
                    onCancel={handleCloseModal}
                    submitting={submitting}
                    showActions
                    showCancelButton
                />
            </ReversePickupAddressModal>

            {/* =================================================
                ADDRESS DETAILS VIEW
            ================================================= */}

            <ReversePickupAddressView
                open={viewOpen}
                onClose={handleCloseView}
                address={selectedAddress}
                loading={false}
                title="Reverse Pickup Address Details"
            />

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

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

export default ReversePickupAddressesList;

