// =========================================================
// ReversePickupsList.jsx
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
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Snackbar,
    Stack,
    TablePagination,
    TextField,
    Typography
} from "@mui/material";

import {
    Add,
    Clear,
    Close,
    Delete,
    Refresh,
    Save,
    Search,
    Warning
} from "@mui/icons-material";

import ReversePickupToolbar from "./ReversePickupToolbar";
import ReversePickupStatistics from "./ReversePickupStatistics";
import ReversePickupTable from "./ReversePickupTable";
import ReversePickupView from "./ReversePickupView";

// =========================================================
// API CONFIGURATION
// React requests go through the Node proxy.
// =========================================================

const API_URL = "http://localhost:5000/api/ReversePickup";

// =========================================================
// INITIAL FORM
// =========================================================

const INITIAL_FORM = {
    reversePickupNo: "",
    saleOrderCode: "",
    saleOrderItemCode: "",
    itemSkuCode: "",
    trackingNo: "",
    returnReason: "",
    qcComment: "",
    reversePickupStatus: "Pending",
    courierProviderName: "",
    facilityCode: "",
    channelName: "",
    putawayCode: ""
};

// =========================================================
// FIELD HELPER
// =========================================================

const getField = (record, ...keys) => {
    if (!record) return undefined;

    for (const key of keys) {
        const value = record[key];

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }
    }

    return undefined;
};

// =========================================================
// EXTRACT LIST FROM API RESPONSE
//
// Supports:
// { success: true, data: [...] }
// { Data: [...] }
// { items: [...] }
// [...]
// =========================================================

const extractRecords = (response) => {
    let body = response?.data ?? response;

    if (typeof body === "string") {
        try {
            body = JSON.parse(body);
        } catch {
            return [];
        }
    }

    if (Array.isArray(body)) {
        return body;
    }

    if (!body || typeof body !== "object") {
        return [];
    }

    const candidates = [
        body.data,
        body.Data,
        body.items,
        body.Items,
        body.records,
        body.Records,
        body.reversePickups,
        body.ReversePickups,
        body.result,
        body.Result
    ];

    for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
            return candidate;
        }

        if (candidate && typeof candidate === "object") {
            const nestedCandidates = [
                candidate.data,
                candidate.Data,
                candidate.items,
                candidate.Items,
                candidate.records,
                candidate.Records
            ];

            const nested = nestedCandidates.find(
                Array.isArray
            );

            if (nested) {
                return nested;
            }
        }
    }

    return [];
};

// =========================================================
// GET PICKUP ID
// =========================================================

const getPickupId = (pickup) =>
    getField(
        pickup,
        "reversePickupId",
        "ReversePickupId",
        "reversePickupID",
        "ReversePickupID",
        "id",
        "Id"
    );

// =========================================================
// GET PICKUP NUMBER
// =========================================================

const getPickupNumber = (pickup) =>
    getField(
        pickup,
        "reversePickupNo",
        "ReversePickupNo",
        "reversePickupNumber",
        "ReversePickupNumber"
    ) || getPickupId(pickup) || "—";

// =========================================================
// GET STATUS
// =========================================================

const getPickupStatus = (pickup) =>
    String(
        getField(
            pickup,
            "reversePickupStatus",
            "ReversePickupStatus",
            "status",
            "Status"
        ) || "Pending"
    ).trim();

// =========================================================
// GET SELLER AND CUSTOMER IDS
// =========================================================

const getSellerCustomerIds = (pickup = null) => {
    let storedUser = {};

    try {
        storedUser = JSON.parse(
            localStorage.getItem("user") || "{}"
        );
    } catch {
        storedUser = {};
    }

    const sellerId =
        getField(pickup, "sellerId", "SellerId") ??
        localStorage.getItem("sellerId") ??
        getField(storedUser, "sellerId", "SellerId");

    const customerId =
        getField(pickup, "customerId", "CustomerId") ??
        localStorage.getItem("customerId") ??
        getField(storedUser, "customerId", "CustomerId");

    return {
        sellerId,
        customerId
    };
};

// =========================================================
// MAP RECORD TO FORM
// =========================================================

const mapPickupToForm = (pickup = {}) => ({
    reversePickupNo: getField(
        pickup,
        "reversePickupNo",
        "ReversePickupNo"
    ) || "",

    saleOrderCode: getField(
        pickup,
        "saleOrderCode",
        "SaleOrderCode"
    ) || "",

    saleOrderItemCode: getField(
        pickup,
        "saleOrderItemCode",
        "SaleOrderItemCode"
    ) || "",

    itemSkuCode: getField(
        pickup,
        "itemSkuCode",
        "ItemSkuCode"
    ) || "",

    trackingNo: getField(
        pickup,
        "trackingNo",
        "TrackingNo"
    ) || "",

    returnReason: getField(
        pickup,
        "returnReason",
        "ReturnReason"
    ) || "",

    qcComment: getField(
        pickup,
        "qcComment",
        "QCComment"
    ) || "",

    reversePickupStatus: getPickupStatus(pickup),

    courierProviderName: getField(
        pickup,
        "courierProviderName",
        "CourierProviderName"
    ) || "",

    facilityCode: getField(
        pickup,
        "facilityCode",
        "FacilityCode"
    ) || "",

    channelName: getField(
        pickup,
        "channelName",
        "ChannelName"
    ) || "",

    putawayCode: getField(
        pickup,
        "putawayCode",
        "PutawayCode"
    ) || ""
});

// =========================================================
// COMPONENT
// =========================================================

const ReversePickupsList = ({
    apiUrl = API_URL,
    pageSize: initialPageSize = 10,
    showStatistics = true,
    showToolbar = true
}) => {
    // -----------------------------------------------------
    // STATE
    // -----------------------------------------------------

    const [reversePickups, setReversePickups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [exporting, setExporting] = useState(false);

    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(
        initialPageSize
    );

    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState("create");
    const [selectedReversePickup, setSelectedReversePickup] =
        useState(null);

    const [formData, setFormData] = useState({
        ...INITIAL_FORM
    });

    const [formErrors, setFormErrors] = useState({});
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // -----------------------------------------------------
    // NOTIFICATIONS
    // -----------------------------------------------------

    const notify = useCallback(
        (message, severity = "success") => {
            setNotification({
                open: true,
                message,
                severity
            });
        },
        []
    );

    const closeNotification = (_, reason) => {
        if (reason === "clickaway") return;

        setNotification((previous) => ({
            ...previous,
            open: false
        }));
    };

    // -----------------------------------------------------
    // FETCH ALL REVERSE PICKUPS
    //
    // API response:
    // {
    //   success: true,
    //   data: [...],
    //   totalCount: 3
    // }
    // -----------------------------------------------------

    const fetchReversePickups = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(
                `${apiUrl}/all`
            );

            console.log(
                "Reverse Pickup API Response:",
                response.data
            );

            const body = response.data;

            if (
                body &&
                typeof body === "object" &&
                body.success === false
            ) {
                throw new Error(
                    body.message ||
                    body.Message ||
                    "The API reported that fetching failed."
                );
            }

            const records = extractRecords(response);

            if (!Array.isArray(records)) {
                throw new Error(
                    "Invalid reverse pickup list response."
                );
            }

            setReversePickups(records);

            console.log(
                `Loaded ${records.length} reverse pickup records.`
            );
        } catch (err) {
            console.error(
                "GET ALL REVERSE PICKUPS ERROR:",
                err.response?.data || err.message
            );

            const message =
                err.response?.data?.message ||
                err.response?.data?.Message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to load reverse pickups.";

            setReversePickups([]);
            setError(message);
            notify(message, "error");
        } finally {
            setLoading(false);
        }
    }, [apiUrl, notify]);

    useEffect(() => {
        fetchReversePickups();
    }, [fetchReversePickups]);

    // -----------------------------------------------------
    // SEARCH
    // -----------------------------------------------------

    const getSearchValue = useCallback(
        (pickup, field) => {
            const fields = {
                pickupNumber: [
                    "reversePickupNo",
                    "ReversePickupNo"
                ],
                orderNumber: [
                    "saleOrderCode",
                    "SaleOrderCode"
                ],
                itemSkuCode: [
                    "itemSkuCode",
                    "ItemSkuCode"
                ],
                trackingNumber: [
                    "trackingNo",
                    "TrackingNo"
                ],
                carrierName: [
                    "courierProviderName",
                    "CourierProviderName"
                ],
                facilityCode: [
                    "facilityCode",
                    "FacilityCode"
                ],
                channelName: [
                    "channelName",
                    "ChannelName"
                ]
            };

            if (field !== "all" && fields[field]) {
                return getField(
                    pickup,
                    ...fields[field]
                );
            }

            return [
                getPickupNumber(pickup),
                getField(pickup, "saleOrderCode", "SaleOrderCode"),
                getField(
                    pickup,
                    "saleOrderItemCode",
                    "SaleOrderItemCode"
                ),
                getField(pickup, "itemSkuCode", "ItemSkuCode"),
                getField(pickup, "trackingNo", "TrackingNo"),
                getField(
                    pickup,
                    "returnReason",
                    "ReturnReason"
                ),
                getField(
                    pickup,
                    "courierProviderName",
                    "CourierProviderName"
                ),
                getField(pickup, "facilityCode", "FacilityCode"),
                getField(pickup, "channelName", "ChannelName"),
                getPickupStatus(pickup)
            ]
                .filter(
                    (value) =>
                        value !== undefined &&
                        value !== null
                )
                .join(" ");
        },
        []
    );

    // -----------------------------------------------------
    // FILTER RECORDS
    // -----------------------------------------------------

    const filteredReversePickups = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        return reversePickups.filter((pickup) => {
            const value = String(
                getSearchValue(pickup, searchField) || ""
            ).toLowerCase();

            const matchesSearch =
                !term || value.includes(term);

            const status = getPickupStatus(pickup)
                .toLowerCase()
                .replace(/[_-]+/g, " ");

            const filter = statusFilter
                .toLowerCase()
                .replace(/[_-]+/g, " ");

            let matchesStatus = statusFilter === "all";

            if (filter === status) {
                matchesStatus = true;
            }

            if (
                filter === "pending" &&
                ["pending", "initiated", "new"].includes(status)
            ) {
                matchesStatus = true;
            }

            if (
                filter === "scheduled" &&
                [
                    "scheduled",
                    "pickup scheduled",
                    "assigned",
                    "confirmed",
                    "ready for pickup"
                ].includes(status)
            ) {
                matchesStatus = true;
            }

            if (
                filter === "in progress" &&
                [
                    "in progress",
                    "in transit",
                    "picked up",
                    "pickup in progress",
                    "processing",
                    "collected"
                ].includes(status)
            ) {
                matchesStatus = true;
            }

            if (
                filter === "completed" &&
                [
                    "completed",
                    "complete",
                    "delivered",
                    "received",
                    "closed",
                    "success"
                ].includes(status)
            ) {
                matchesStatus = true;
            }

            if (
                filter === "cancelled" &&
                [
                    "cancelled",
                    "canceled",
                    "rejected",
                    "void"
                ].includes(status)
            ) {
                matchesStatus = true;
            }

            return matchesSearch && matchesStatus;
        });
    }, [
        reversePickups,
        searchTerm,
        searchField,
        statusFilter,
        getSearchValue
    ]);

    // -----------------------------------------------------
    // PAGINATION
    // -----------------------------------------------------

    const paginatedReversePickups = useMemo(() => {
        const start = page * rowsPerPage;

        return filteredReversePickups.slice(
            start,
            start + rowsPerPage
        );
    }, [
        filteredReversePickups,
        page,
        rowsPerPage
    ]);

    useEffect(() => {
        const maxPage = Math.max(
            0,
            Math.ceil(
                filteredReversePickups.length / rowsPerPage
            ) - 1
        );

        if (page > maxPage) {
            setPage(maxPage);
        }
    }, [
        filteredReversePickups.length,
        rowsPerPage,
        page
    ]);

    // -----------------------------------------------------
    // STATISTICS
    // -----------------------------------------------------

    const statistics = useMemo(() => {
        const result = {
            total: reversePickups.length,
            pending: 0,
            scheduled: 0,
            inProgress: 0,
            completed: 0,
            cancelled: 0
        };

        reversePickups.forEach((pickup) => {
            const status = getPickupStatus(pickup)
                .toLowerCase()
                .replace(/[_-]+/g, " ");

            if (
                [
                    "completed",
                    "complete",
                    "delivered",
                    "received",
                    "closed",
                    "success"
                ].includes(status)
            ) {
                result.completed++;
            } else if (
                [
                    "cancelled",
                    "canceled",
                    "rejected",
                    "void"
                ].includes(status)
            ) {
                result.cancelled++;
            } else if (
                [
                    "scheduled",
                    "pickup scheduled",
                    "assigned",
                    "confirmed",
                    "ready for pickup"
                ].includes(status)
            ) {
                result.scheduled++;
            } else if (
                [
                    "in progress",
                    "in transit",
                    "picked up",
                    "pickup in progress",
                    "processing",
                    "collected"
                ].includes(status)
            ) {
                result.inProgress++;
            } else {
                result.pending++;
            }
        });

        return result;
    }, [reversePickups]);

    // -----------------------------------------------------
    // CLEAR FILTERS
    // -----------------------------------------------------

    const clearFilters = () => {
        setSearchTerm("");
        setSearchField("all");
        setStatusFilter("all");
        setPage(0);
    };

    // -----------------------------------------------------
    // CREATE
    // -----------------------------------------------------

    const handleCreate = () => {
        setSelectedReversePickup(null);
        setFormData({ ...INITIAL_FORM });
        setFormErrors({});
        setFormMode("create");
        setFormOpen(true);
    };

    // -----------------------------------------------------
    // EDIT
    // -----------------------------------------------------

    const handleEdit = (pickup) => {
        if (!pickup) return;

        setSelectedReversePickup(pickup);
        setFormData(mapPickupToForm(pickup));
        setFormErrors({});
        setFormMode("edit");
        setFormOpen(true);
    };

    // -----------------------------------------------------
    // FORM CHANGE
    // -----------------------------------------------------

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setFormErrors((previous) => ({
            ...previous,
            [name]: ""
        }));
    };

    // -----------------------------------------------------
    // VALIDATION
    // -----------------------------------------------------

    const validateForm = () => {
        const errors = {};

        if (!formData.saleOrderCode.trim()) {
            errors.saleOrderCode =
                "Sales order code is required.";
        }

        if (!formData.itemSkuCode.trim()) {
            errors.itemSkuCode =
                "Item SKU code is required.";
        }

        if (!formData.reversePickupStatus.trim()) {
            errors.reversePickupStatus =
                "Status is required.";
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    // -----------------------------------------------------
    // BUILD BACKEND PAYLOAD
    // -----------------------------------------------------

    const buildPayload = (sellerId, customerId) => ({
        reversePickupNo:
            formData.reversePickupNo.trim() || null,

        saleOrderCode: formData.saleOrderCode.trim(),

        saleOrderItemCode:
            formData.saleOrderItemCode.trim(),

        itemSkuCode: formData.itemSkuCode.trim(),

        trackingNo: formData.trackingNo.trim(),

        returnReason: formData.returnReason.trim(),

        qcComment: formData.qcComment.trim(),

        reversePickupStatus:
            formData.reversePickupStatus.trim(),

        courierProviderName:
            formData.courierProviderName.trim(),

        facilityCode: formData.facilityCode.trim(),

        channelName: formData.channelName.trim(),

        putawayCode: formData.putawayCode.trim(),

        sellerId: Number(sellerId),
        customerId: Number(customerId)
    });

    // -----------------------------------------------------
    // CREATE / UPDATE
    // -----------------------------------------------------

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        const existingRecord =
            formMode === "edit"
                ? selectedReversePickup
                : null;

        const { sellerId, customerId } =
            getSellerCustomerIds(existingRecord);

        if (
            sellerId === undefined ||
            sellerId === null ||
            sellerId === "" ||
            customerId === undefined ||
            customerId === null ||
            customerId === ""
        ) {
            notify(
                "Seller ID and Customer ID are required. Check your login data or selected record.",
                "error"
            );
            return;
        }

        const id = getPickupId(existingRecord);

        if (
            formMode === "edit" &&
            (id === undefined || id === null || id === "")
        ) {
            notify(
                "Cannot update this pickup because its ID is missing.",
                "error"
            );
            return;
        }

        setSaving(true);

        try {
            const payload = buildPayload(
                sellerId,
                customerId
            );

            if (formMode === "edit") {
                await axios.put(
                    `${apiUrl}/${encodeURIComponent(id)}/seller/${encodeURIComponent(sellerId)}/customer/${encodeURIComponent(customerId)}`,
                    payload
                );

                notify("Reverse pickup updated successfully.");
            } else {
                await axios.post(
                    `${apiUrl}/seller/${encodeURIComponent(sellerId)}/customer/${encodeURIComponent(customerId)}`,
                    payload
                );

                notify("Reverse pickup created successfully.");
            }

            setFormOpen(false);
            setSelectedReversePickup(null);
            setFormData({ ...INITIAL_FORM });
            setFormErrors({});

            await fetchReversePickups();
        } catch (err) {
            console.error(
                "SAVE REVERSE PICKUP ERROR:",
                err.response?.data || err.message
            );

            notify(
                err.response?.data?.message ||
                err.response?.data?.Message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to save reverse pickup.",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    // -----------------------------------------------------
    // DELETE REQUEST
    // -----------------------------------------------------

    const handleDeleteRequest = (pickup) => {
        setSelectedReversePickup(pickup);
        setDeleteOpen(true);
    };

    // -----------------------------------------------------
    // DELETE
    // -----------------------------------------------------

    const handleDelete = async () => {
        const pickup = selectedReversePickup;
        const id = getPickupId(pickup);

        const { sellerId, customerId } =
            getSellerCustomerIds(pickup);

        if (
            id === undefined ||
            id === null ||
            id === ""
        ) {
            notify(
                "Cannot delete this pickup because its ID is missing.",
                "error"
            );
            return;
        }

        if (
            sellerId === undefined ||
            sellerId === null ||
            sellerId === "" ||
            customerId === undefined ||
            customerId === null ||
            customerId === ""
        ) {
            notify(
                "Seller ID and Customer ID are required to delete this pickup.",
                "error"
            );
            return;
        }

        setDeleting(true);

        try {
            await axios.delete(
                `${apiUrl}/${encodeURIComponent(id)}/seller/${encodeURIComponent(sellerId)}/customer/${encodeURIComponent(customerId)}`
            );

            setDeleteOpen(false);
            setSelectedReversePickup(null);

            notify("Reverse pickup deleted successfully.");

            await fetchReversePickups();
        } catch (err) {
            console.error(
                "DELETE REVERSE PICKUP ERROR:",
                err.response?.data || err.message
            );

            notify(
                err.response?.data?.message ||
                err.response?.data?.Message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to delete reverse pickup.",
                "error"
            );
        } finally {
            setDeleting(false);
        }
    };

    // -----------------------------------------------------
    // EXPORT CSV
    // -----------------------------------------------------

    const handleExport = () => {
        setExporting(true);

        try {
            const escapeCsv = (value) =>
                `"${String(value ?? "").replace(/"/g, '""')}"`;

            const headers = [
                "Pickup ID",
                "Pickup Number",
                "Sales Order Code",
                "Sales Order Item Code",
                "Item SKU",
                "Tracking Number",
                "Return Reason",
                "QC Comment",
                "Status",
                "Courier Provider",
                "Facility Code",
                "Channel Name",
                "Putaway Code",
                "Seller ID",
                "Customer ID"
            ];

            const rows = filteredReversePickups.map(
                (pickup) => [
                    getPickupId(pickup) ?? "",
                    getPickupNumber(pickup),
                    getField(pickup, "saleOrderCode", "SaleOrderCode") ?? "",
                    getField(pickup, "saleOrderItemCode", "SaleOrderItemCode") ?? "",
                    getField(pickup, "itemSkuCode", "ItemSkuCode") ?? "",
                    getField(pickup, "trackingNo", "TrackingNo") ?? "",
                    getField(pickup, "returnReason", "ReturnReason") ?? "",
                    getField(pickup, "qcComment", "QCComment") ?? "",
                    getPickupStatus(pickup),
                    getField(pickup, "courierProviderName", "CourierProviderName") ?? "",
                    getField(pickup, "facilityCode", "FacilityCode") ?? "",
                    getField(pickup, "channelName", "ChannelName") ?? "",
                    getField(pickup, "putawayCode", "PutawayCode") ?? "",
                    getField(pickup, "sellerId", "SellerId") ?? "",
                    getField(pickup, "customerId", "CustomerId") ?? ""
                ]
            );

            const csv = [
                headers.map(escapeCsv).join(","),
                ...rows.map((row) =>
                    row.map(escapeCsv).join(",")
                )
            ].join("\r\n");

            const blob = new Blob(
                ["\uFEFF", csv],
                { type: "text/csv;charset=utf-8;" }
            );

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download =
                `reverse-pickups-${new Date()
                    .toISOString()
                    .slice(0, 10)}.csv`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);

            notify("Reverse pickups exported successfully.");
        } catch (err) {
            console.error(
                "EXPORT REVERSE PICKUPS ERROR:",
                err
            );

            notify(
                "Failed to export reverse pickups.",
                "error"
            );
        } finally {
            setExporting(false);
        }
    };

    // -----------------------------------------------------
    // VIEW
    // -----------------------------------------------------

    const handleView = (pickup) => {
        setSelectedReversePickup(pickup);
        setViewOpen(true);
    };

    // -----------------------------------------------------
    // CLOSE FORM
    // -----------------------------------------------------

    const handleCloseForm = () => {
        if (saving) return;

        setFormOpen(false);
        setFormErrors({});
    };

    // -----------------------------------------------------
    // RENDER
    // -----------------------------------------------------

    return (
        <Box
            sx={{
                width: "100%",
                p: { xs: 1, sm: 2, md: 3 }
            }}
        >
            {showToolbar && (
                <ReversePickupToolbar
                    title="Reverse Pickups"
                    subtitle="Manage return pickup requests and reverse logistics."
                    totalRecords={statistics.total}
                    totalPickups={statistics.total}
                    pendingPickups={statistics.pending}
                    scheduledPickups={statistics.scheduled}
                    completedPickups={statistics.completed}
                    cancelledPickups={statistics.cancelled}
                    loading={loading}
                    exporting={exporting}
                    showFilters={showFilters}
                    onAdd={handleCreate}
                    onRefresh={fetchReversePickups}
                    onExport={handleExport}
                    onToggleFilters={() =>
                        setShowFilters((previous) => !previous)
                    }
                />
            )}

            {showStatistics && (
                <ReversePickupStatistics
                    reversePickups={reversePickups}
                    statistics={statistics}
                    loading={loading}
                    error={error}
                />
            )}

            {/* SEARCH AND FILTERS */}

            <Paper
                variant="outlined"
                sx={{ p: 2, mb: 2, borderRadius: 2 }}
            >
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", md: "center" }}
                    spacing={2}
                    sx={{ mb: showFilters ? 2 : 0 }}
                >
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            Reverse Pickup Records
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {loading
                                ? "Loading reverse pickups..."
                                : `${filteredReversePickups.length} record(s)`}
                        </Typography>
                    </Box>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                    >
                        <TextField
                            size="small"
                            placeholder="Search reverse pickups..."
                            value={searchTerm}
                            onChange={(event) => {
                                setSearchTerm(event.target.value);
                                setPage(0);
                            }}
                            sx={{
                                minWidth: { xs: "100%", sm: 260 }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search fontSize="small" />
                                    </InputAdornment>
                                ),
                                endAdornment: searchTerm ? (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            aria-label="Clear search"
                                            onClick={() => {
                                                setSearchTerm("");
                                                setPage(0);
                                            }}
                                        >
                                            <Close fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null
                            }}
                        />

                        <Button
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={fetchReversePickups}
                            disabled={loading}
                        >
                            Refresh
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleCreate}
                        >
                            Create
                        </Button>
                    </Stack>
                </Stack>

                {showFilters && (
                    <>
                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    fullWidth
                                    select
                                    size="small"
                                    label="Search Field"
                                    value={searchField}
                                    onChange={(event) => {
                                        setSearchField(event.target.value);
                                        setPage(0);
                                    }}
                                >
                                    <MenuItem value="all">All Fields</MenuItem>
                                    <MenuItem value="pickupNumber">Pickup Number</MenuItem>
                                    <MenuItem value="orderNumber">Sales Order Code</MenuItem>
                                    <MenuItem value="itemSkuCode">Item SKU</MenuItem>
                                    <MenuItem value="trackingNumber">Tracking Number</MenuItem>
                                    <MenuItem value="carrierName">Courier Provider</MenuItem>
                                    <MenuItem value="facilityCode">Facility Code</MenuItem>
                                    <MenuItem value="channelName">Channel Name</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    fullWidth
                                    select
                                    size="small"
                                    label="Pickup Status"
                                    value={statusFilter}
                                    onChange={(event) => {
                                        setStatusFilter(event.target.value);
                                        setPage(0);
                                    }}
                                >
                                    <MenuItem value="all">All Statuses</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="scheduled">Scheduled</MenuItem>
                                    <MenuItem value="in progress">In Progress</MenuItem>
                                    <MenuItem value="completed">Completed</MenuItem>
                                    <MenuItem value="cancelled">Cancelled</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <Button
                                        variant="outlined"
                                        startIcon={<Clear />}
                                        onClick={clearFilters}
                                    >
                                        Clear Filters
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </>
                )}
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
                            onClick={fetchReversePickups}
                        >
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            )}

            {/* LOADING */}

            {loading && reversePickups.length === 0 && (
                <Paper
                    variant="outlined"
                    sx={{
                        p: 5,
                        textAlign: "center",
                        mb: 2
                    }}
                >
                    <CircularProgress />

                    <Typography sx={{ mt: 2 }}>
                        Loading reverse pickup records...
                    </Typography>
                </Paper>
            )}

            {/* TABLE */}

            <ReversePickupTable
                reversePickups={paginatedReversePickups}
                loading={loading}
                error={error}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
                onRefresh={fetchReversePickups}
            />

            {/* PAGINATION */}

            {filteredReversePickups.length > 0 && (
                <Paper
                    variant="outlined"
                    sx={{
                        mt: 1,
                        borderRadius: 2,
                        overflow: "hidden"
                    }}
                >
                    <TablePagination
                        component="div"
                        count={filteredReversePickups.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        onPageChange={(_, newPage) =>
                            setPage(newPage)
                        }
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(
                                parseInt(event.target.value, 10)
                            );
                            setPage(0);
                        }}
                        labelRowsPerPage="Rows per page:"
                    />
                </Paper>
            )}

            {/* CREATE / EDIT DIALOG */}

            <Dialog
                open={formOpen}
                onClose={handleCloseForm}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography variant="h6" fontWeight={700}>
                            {formMode === "edit"
                                ? "Edit Reverse Pickup"
                                : "Create Reverse Pickup"}
                        </Typography>

                        <IconButton
                            onClick={handleCloseForm}
                            disabled={saving}
                            aria-label="Close form"
                        >
                            <Close />
                        </IconButton>
                    </Stack>
                </DialogTitle>

                <Divider />

                <Box component="form" onSubmit={handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Reverse Pickup Number"
                                    name="reversePickupNo"
                                    value={formData.reversePickupNo}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                    helperText={
                                        formMode === "create"
                                            ? "Leave blank if generated by the backend."
                                            : ""
                                    }
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Sales Order Code"
                                    name="saleOrderCode"
                                    value={formData.saleOrderCode}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                    error={Boolean(formErrors.saleOrderCode)}
                                    helperText={formErrors.saleOrderCode}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Sales Order Item Code"
                                    name="saleOrderItemCode"
                                    value={formData.saleOrderItemCode}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Item SKU Code"
                                    name="itemSkuCode"
                                    value={formData.itemSkuCode}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                    error={Boolean(formErrors.itemSkuCode)}
                                    helperText={formErrors.itemSkuCode}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Tracking Number"
                                    name="trackingNo"
                                    value={formData.trackingNo}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Courier Provider"
                                    name="courierProviderName"
                                    value={formData.courierProviderName}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Facility Code"
                                    name="facilityCode"
                                    value={formData.facilityCode}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Channel Name"
                                    name="channelName"
                                    value={formData.channelName}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Putaway Code"
                                    name="putawayCode"
                                    value={formData.putawayCode}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    required
                                    label="Status"
                                    name="reversePickupStatus"
                                    value={formData.reversePickupStatus}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                    error={Boolean(formErrors.reversePickupStatus)}
                                    helperText={formErrors.reversePickupStatus}
                                >
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="Initiated">Initiated</MenuItem>
                                    <MenuItem value="Scheduled">Scheduled</MenuItem>
                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    label="Return Reason"
                                    name="returnReason"
                                    value={formData.returnReason}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    label="QC Comment"
                                    name="qcComment"
                                    value={formData.qcComment}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <Divider />

                    <DialogActions sx={{ p: 2 }}>
                        <Button
                            onClick={handleCloseForm}
                            disabled={saving}
                            color="inherit"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={
                                saving
                                    ? <CircularProgress size={18} color="inherit" />
                                    : <Save />
                            }
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : formMode === "edit"
                                    ? "Update Pickup"
                                    : "Create Pickup"}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            {/* VIEW DETAILS */}

            <ReversePickupView
                open={viewOpen}
                reversePickup={selectedReversePickup}
                loading={false}
                onClose={() => setViewOpen(false)}
                onEdit={(pickup) => {
                    setViewOpen(false);
                    handleEdit(pickup || selectedReversePickup);
                }}
            />

            {/* DELETE CONFIRMATION */}

            <Dialog
                open={deleteOpen}
                onClose={() => {
                    if (!deleting) {
                        setDeleteOpen(false);
                    }
                }}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <Warning color="error" />

                        <Typography variant="h6" fontWeight={700}>
                            Delete Reverse Pickup
                        </Typography>
                    </Stack>
                </DialogTitle>

                <DialogContent>
                    <Typography>
                        Are you sure you want to delete reverse pickup{" "}
                        <strong>
                            {getPickupNumber(selectedReversePickup)}
                        </strong>
                        ?
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        This action cannot be undone.
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        color="inherit"
                        onClick={() => setDeleteOpen(false)}
                        disabled={deleting}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        startIcon={
                            deleting
                                ? <CircularProgress size={18} color="inherit" />
                                : <Delete />
                        }
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

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

export default ReversePickupsList;
