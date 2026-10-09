import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";

import {
    Box,
    Grid,
    Paper,
    TextField,
    MenuItem,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Snackbar,
    Alert,
    CircularProgress,
    Tooltip,
    InputAdornment,
    TablePagination,
    Divider,
    Stack
} from "@mui/material";

import {
    Search,
    Clear,
    Refresh,
    Add,
    Close,
    Save,
    Delete,
    Warning
} from "@mui/icons-material";

import ReversePickupToolbar from "./ReversePickupToolbar";
import ReversePickupStatistics from "./ReversePickupStatistics";
import ReversePickupTable from "./ReversePickupTable";
import ReversePickupView from "./ReversePickupView";

/* =========================================================
   CONFIGURATION
========================================================= */

const API_URL = "/api/ReversePickup";

const INITIAL_FORM = {
    reversePickupNumber: "",
    orderNumber: "",
    customerName: "",
    customerEmail: "",
    pickupDate: "",
    pickupAddress: "",
    itemName: "",
    sku: "",
    quantity: "1",
    carrierName: "",
    trackingNumber: "",
    pickupCost: "0",
    status: "Pending",
    notes: ""
};

/* =========================================================
   FIELD HELPER
========================================================= */

const getField = (record, ...keys) => {
    if (!record) return undefined;

    for (const key of keys) {
        const value = record[key];

        if (value !== undefined && value !== null && value !== "") {
            return value;
        }
    }

    return undefined;
};

/* =========================================================
   EXTRACT API RESPONSE
========================================================= */

const extractRecords = (response) => {
    const body = response?.data ?? response;

    if (Array.isArray(body)) return body;

    const candidates = [
        body?.data,
        body?.Data,
        body?.items,
        body?.Items,
        body?.records,
        body?.Records,
        body?.reversePickups,
        body?.ReversePickups,
        body?.result,
        body?.Result
    ];

    for (const candidate of candidates) {
        if (Array.isArray(candidate)) return candidate;

        if (candidate && typeof candidate === "object") {
            const nested = [
                candidate.data,
                candidate.Data,
                candidate.items,
                candidate.Items,
                candidate.records,
                candidate.Records
            ];

            const found = nested.find(Array.isArray);

            if (found) return found;
        }
    }

    return [];
};

/* =========================================================
   EXTRACT SINGLE RECORD
========================================================= */

const extractRecord = (response) => {
    const body = response?.data ?? response;

    if (!body || typeof body !== "object") return {};

    const candidates = [
        body.data,
        body.Data,
        body.reversePickup,
        body.ReversePickup,
        body.result,
        body.Result
    ];

    for (const candidate of candidates) {
        if (
            candidate &&
            typeof candidate === "object" &&
            !Array.isArray(candidate)
        ) {
            return candidate;
        }
    }

    return body;
};

/* =========================================================
   GET PICKUP ID
========================================================= */

const getPickupId = (pickup) =>
    getField(
        pickup,
        "reversePickupId",
        "ReversePickupId",
        "reversePickupID",
        "ReversePickupID",
        "pickupId",
        "PickupId",
        "id",
        "Id"
    );

/* =========================================================
   GET PICKUP NUMBER
========================================================= */

const getPickupNumber = (pickup) =>
    getField(
        pickup,
        "reversePickupNumber",
        "ReversePickupNumber",
        "pickupNumber",
        "PickupNumber",
        "reversePickupNo",
        "ReversePickupNo"
    ) || getPickupId(pickup) || "—";

/* =========================================================
   GET STATUS
========================================================= */

const getPickupStatus = (pickup) =>
    String(
        getField(
            pickup,
            "status",
            "Status",
            "pickupStatus",
            "PickupStatus",
            "reversePickupStatus",
            "ReversePickupStatus",
            "returnStatus",
            "ReturnStatus"
        ) || "Pending"
    ).trim();

/* =========================================================
   GET ORDER NUMBER
========================================================= */

const getOrderNumber = (pickup) =>
    getField(
        pickup,
        "orderNumber",
        "OrderNumber",
        "salesOrderNumber",
        "SalesOrderNumber",
        "originalOrderNumber",
        "OriginalOrderNumber",
        "returnOrderNumber",
        "ReturnOrderNumber",
        "rmaNumber",
        "RMANumber"
    );

/* =========================================================
   MAP RECORD TO FORM
========================================================= */

const mapPickupToForm = (pickup = {}) => ({
    reversePickupNumber: getField(
        pickup,
        "reversePickupNumber",
        "ReversePickupNumber",
        "pickupNumber",
        "PickupNumber",
        "reversePickupNo",
        "ReversePickupNo"
    ) || "",

    orderNumber: getOrderNumber(pickup) || "",

    customerName: getField(
        pickup,
        "customerName",
        "CustomerName",
        "customerFullName",
        "CustomerFullName",
        "buyerName",
        "BuyerName"
    ) || "",

    customerEmail: getField(
        pickup,
        "customerEmail",
        "CustomerEmail",
        "email",
        "Email"
    ) || "",

    pickupDate: (() => {
        const value = getField(
            pickup,
            "pickupDate",
            "PickupDate",
            "scheduledPickupDate",
            "ScheduledPickupDate",
            "requestedPickupDate",
            "RequestedPickupDate"
        );

        if (!value) return "";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) return "";

        return date.toISOString().slice(0, 10);
    })(),

    pickupAddress: getField(
        pickup,
        "pickupAddress",
        "PickupAddress",
        "pickupLocation",
        "PickupLocation",
        "returnAddress",
        "ReturnAddress",
        "address",
        "Address"
    ) || "",

    itemName: getField(
        pickup,
        "itemName",
        "ItemName",
        "productName",
        "ProductName",
        "returnItemName",
        "ReturnItemName"
    ) || "",

    sku: getField(
        pickup,
        "sku",
        "SKU",
        "productSku",
        "ProductSku",
        "productCode",
        "ProductCode"
    ) || "",

    quantity: String(
        getField(
            pickup,
            "quantity",
            "Quantity",
            "returnQuantity",
            "ReturnQuantity",
            "itemQuantity",
            "ItemQuantity",
            "totalQuantity",
            "TotalQuantity"
        ) ?? 1
    ),

    carrierName: getField(
        pickup,
        "carrierName",
        "CarrierName",
        "carrier",
        "Carrier",
        "logisticsProvider",
        "LogisticsProvider",
        "shippingProvider",
        "ShippingProvider"
    ) || "",

    trackingNumber: getField(
        pickup,
        "trackingNumber",
        "TrackingNumber",
        "returnTrackingNumber",
        "ReturnTrackingNumber",
        "reverseTrackingNumber",
        "ReverseTrackingNumber"
    ) || "",

    pickupCost: String(
        getField(
            pickup,
            "pickupCost",
            "PickupCost",
            "returnShippingCost",
            "ReturnShippingCost",
            "shippingCost",
            "ShippingCost",
            "collectionCost",
            "CollectionCost"
        ) ?? 0
    ),

    status: getPickupStatus(pickup),

    notes: getField(
        pickup,
        "notes",
        "Notes",
        "remarks",
        "Remarks",
        "description",
        "Description"
    ) || ""
});

/* =========================================================
   PARENT COMPONENT
========================================================= */

const ReversePickupsList = ({
    apiUrl = API_URL,
    pageSize: initialPageSize = 10,
    showStatistics = true,
    showToolbar = true
}) => {
    /* =====================================================
       STATE
    ===================================================== */

    const [reversePickups, setReversePickups] = useState([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [exporting, setExporting] = useState(false);

    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(initialPageSize);

    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState("create");
    const [selectedReversePickup, setSelectedReversePickup] =
        useState(null);

    const [formData, setFormData] = useState(INITIAL_FORM);
    const [formErrors, setFormErrors] = useState({});

    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    /* =====================================================
       NOTIFICATION
    ===================================================== */

    const notify = useCallback((message, severity = "success") => {
        setNotification({
            open: true,
            message,
            severity
        });
    }, []);

    const closeNotification = (_, reason) => {
        if (reason === "clickaway") return;

        setNotification((previous) => ({
            ...previous,
            open: false
        }));
    };

    /* =====================================================
       FETCH REVERSE PICKUPS
    ===================================================== */

    const fetchReversePickups = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(apiUrl);

            const records = extractRecords(response);

            setReversePickups(records);
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

            setError(message);

            notify(message, "error");
        } finally {
            setLoading(false);
        }
    }, [apiUrl, notify]);

    useEffect(() => {
        fetchReversePickups();
    }, [fetchReversePickups]);

    /* =====================================================
       SEARCH FIELD VALUE
    ===================================================== */

    const getSearchValue = useCallback((pickup, field) => {
        if (field === "pickupNumber") {
            return getPickupNumber(pickup);
        }

        if (field === "orderNumber") {
            return getOrderNumber(pickup);
        }

        if (field === "customerName") {
            return getField(
                pickup,
                "customerName",
                "CustomerName",
                "customerFullName",
                "CustomerFullName",
                "buyerName",
                "BuyerName"
            );
        }

        if (field === "trackingNumber") {
            return getField(
                pickup,
                "trackingNumber",
                "TrackingNumber",
                "returnTrackingNumber",
                "ReturnTrackingNumber",
                "reverseTrackingNumber",
                "ReverseTrackingNumber"
            );
        }

        if (field === "carrierName") {
            return getField(
                pickup,
                "carrierName",
                "CarrierName",
                "carrier",
                "Carrier",
                "logisticsProvider",
                "LogisticsProvider"
            );
        }

        if (field === "itemName") {
            return getField(
                pickup,
                "itemName",
                "ItemName",
                "productName",
                "ProductName",
                "returnItemName",
                "ReturnItemName"
            );
        }

        return [
            getPickupNumber(pickup),
            getOrderNumber(pickup),
            getField(
                pickup,
                "customerName",
                "CustomerName",
                "customerFullName",
                "CustomerFullName"
            ),
            getField(
                pickup,
                "trackingNumber",
                "TrackingNumber",
                "returnTrackingNumber",
                "ReturnTrackingNumber"
            ),
            getField(
                pickup,
                "carrierName",
                "CarrierName",
                "carrier",
                "Carrier"
            ),
            getField(
                pickup,
                "itemName",
                "ItemName",
                "productName",
                "ProductName"
            ),
            getField(pickup, "sku", "SKU", "productSku", "ProductSku")
        ]
            .filter((value) => value !== undefined && value !== null)
            .join(" ");
    }, []);

    /* =====================================================
       FILTER RECORDS
    ===================================================== */

    const filteredReversePickups = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        return reversePickups.filter((pickup) => {
            const matchesSearch =
                !term ||
                String(getSearchValue(pickup, searchField) || "")
                    .toLowerCase()
                    .includes(term);

            const status = getPickupStatus(pickup)
                .toLowerCase()
                .replace(/[_-]+/g, " ");

            const normalizedFilter = statusFilter
                .toLowerCase()
                .replace(/[_-]+/g, " ");

            const matchesStatus =
                statusFilter === "all" ||
                status === normalizedFilter ||
                (normalizedFilter === "in progress" &&
                    [
                        "in transit",
                        "picked up",
                        "pickup in progress",
                        "processing",
                        "collected"
                    ].includes(status)) ||
                (normalizedFilter === "completed" &&
                    [
                        "complete",
                        "delivered",
                        "received",
                        "closed",
                        "success"
                    ].includes(status)) ||
                (normalizedFilter === "cancelled" &&
                    ["canceled", "rejected", "void"].includes(status));

            return matchesSearch && matchesStatus;
        });
    }, [
        reversePickups,
        searchTerm,
        searchField,
        statusFilter,
        getSearchValue
    ]);

    /* =====================================================
       PAGINATION
    ===================================================== */

    const paginatedReversePickups = useMemo(() => {
        const start = page * rowsPerPage;

        return filteredReversePickups.slice(
            start,
            start + rowsPerPage
        );
    }, [filteredReversePickups, page, rowsPerPage]);

    useEffect(() => {
        const maxPage = Math.max(
            0,
            Math.ceil(filteredReversePickups.length / rowsPerPage) - 1
        );

        if (page > maxPage) {
            setPage(maxPage);
        }
    }, [filteredReversePickups.length, rowsPerPage, page]);

    /* =====================================================
       STATISTICS
    ===================================================== */

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
                result.completed += 1;
            } else if (
                ["cancelled", "canceled", "rejected", "void"].includes(status)
            ) {
                result.cancelled += 1;
            } else if (
                [
                    "scheduled",
                    "pickup scheduled",
                    "assigned",
                    "confirmed",
                    "ready for pickup"
                ].includes(status)
            ) {
                result.scheduled += 1;
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
                result.inProgress += 1;
            } else {
                result.pending += 1;
            }
        });

        return result;
    }, [reversePickups]);

    /* =====================================================
       RESET FILTERS
    ===================================================== */

    const clearFilters = () => {
        setSearchTerm("");
        setSearchField("all");
        setStatusFilter("all");
        setPage(0);
    };

    /* =====================================================
       OPEN CREATE FORM
    ===================================================== */

    const handleCreate = () => {
        setSelectedReversePickup(null);
        setFormData({ ...INITIAL_FORM });
        setFormErrors({});
        setFormMode("create");
        setFormOpen(true);
    };

    /* =====================================================
       OPEN EDIT FORM
    ===================================================== */

    const handleEdit = (pickup) => {
        setSelectedReversePickup(pickup);
        setFormData(mapPickupToForm(pickup));
        setFormErrors({});
        setFormMode("edit");
        setFormOpen(true);
    };

    /* =====================================================
       FORM FIELD CHANGE
    ===================================================== */

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

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {
        const errors = {};

        if (!formData.orderNumber.trim()) {
            errors.orderNumber = "Order number is required.";
        }

        if (!formData.customerName.trim()) {
            errors.customerName = "Customer name is required.";
        }

        if (!formData.pickupDate) {
            errors.pickupDate = "Pickup date is required.";
        }

        if (!formData.pickupAddress.trim()) {
            errors.pickupAddress = "Pickup address is required.";
        }

        if (!formData.itemName.trim()) {
            errors.itemName = "Return item name is required.";
        }

        const quantity = Number(formData.quantity);

        if (
            formData.quantity === "" ||
            !Number.isFinite(quantity) ||
            quantity <= 0
        ) {
            errors.quantity = "Quantity must be greater than zero.";
        }

        const pickupCost = Number(formData.pickupCost);

        if (
            formData.pickupCost === "" ||
            !Number.isFinite(pickupCost) ||
            pickupCost < 0
        ) {
            errors.pickupCost = "Enter a valid non-negative pickup cost.";
        }

        if (!formData.status) {
            errors.status = "Status is required.";
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    /* =====================================================
       BUILD REQUEST PAYLOAD
    ===================================================== */

    const buildPayload = () => ({
        reversePickupNumber: formData.reversePickupNumber.trim(),
        orderNumber: formData.orderNumber.trim(),
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        pickupDate: formData.pickupDate,
        pickupAddress: formData.pickupAddress.trim(),
        itemName: formData.itemName.trim(),
        sku: formData.sku.trim(),
        quantity: Number(formData.quantity),
        carrierName: formData.carrierName.trim(),
        trackingNumber: formData.trackingNumber.trim(),
        pickupCost: Number(formData.pickupCost),
        status: formData.status,
        notes: formData.notes.trim()
    });

    /* =====================================================
       CREATE / UPDATE REVERSE PICKUP
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        setSaving(true);

        const payload = buildPayload();
        const id = getPickupId(selectedReversePickup);

        try {
            if (formMode === "edit") {
                if (id === undefined || id === null || id === "") {
                    throw new Error(
                        "Cannot update this pickup because its ID is missing."
                    );
                }

                await axios.put(
                    `${apiUrl}/${encodeURIComponent(id)}`,
                    payload
                );

                notify("Reverse pickup updated successfully.");
            } else {
                await axios.post(apiUrl, payload);

                notify("Reverse pickup created successfully.");
            }

            setFormOpen(false);
            setSelectedReversePickup(null);
            setFormData({ ...INITIAL_FORM });
            setFormErrors({});

            await fetchReversePickups();
        } catch (err) {
            console.error(
                `${formMode === "edit" ? "UPDATE" : "CREATE"} REVERSE PICKUP ERROR:`,
                err.response?.data || err.message
            );

            const message =
                err.response?.data?.message ||
                err.response?.data?.Message ||
                err.response?.data?.title ||
                err.message ||
                `Failed to ${formMode === "edit" ? "update" : "create"} reverse pickup.`;

            notify(message, "error");
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       OPEN DELETE CONFIRMATION
    ===================================================== */

    const handleDeleteRequest = (pickup) => {
        setSelectedReversePickup(pickup);
        setDeleteOpen(true);
    };

    /* =====================================================
       DELETE REVERSE PICKUP
    ===================================================== */

    const handleDelete = async () => {
        const id = getPickupId(selectedReversePickup);

        if (id === undefined || id === null || id === "") {
            notify("Cannot delete this pickup because its ID is missing.", "error");
            return;
        }

        setDeleting(true);

        try {
            await axios.delete(
                `${apiUrl}/${encodeURIComponent(id)}`
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

            const message =
                err.response?.data?.message ||
                err.response?.data?.Message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to delete reverse pickup.";

            notify(message, "error");
        } finally {
            setDeleting(false);
        }
    };

    /* =====================================================
       EXPORT CSV
    ===================================================== */

    const handleExport = async () => {
        setExporting(true);

        try {
            const escapeCsv = (value) => {
                const text = String(value ?? "");

                return `"${text.replace(/"/g, '""')}"`;
            };

            const headers = [
                "Pickup ID",
                "Pickup Number",
                "Order Number",
                "Customer Name",
                "Customer Email",
                "Pickup Date",
                "Pickup Address",
                "Return Item",
                "SKU",
                "Quantity",
                "Carrier",
                "Tracking Number",
                "Pickup Cost",
                "Status",
                "Notes"
            ];

            const rows = filteredReversePickups.map((pickup) => [
                getPickupId(pickup) ?? "",
                getPickupNumber(pickup),
                getOrderNumber(pickup) ?? "",
                getField(
                    pickup,
                    "customerName",
                    "CustomerName",
                    "customerFullName",
                    "CustomerFullName"
                ) ?? "",
                getField(
                    pickup,
                    "customerEmail",
                    "CustomerEmail",
                    "email",
                    "Email"
                ) ?? "",
                getField(
                    pickup,
                    "pickupDate",
                    "PickupDate",
                    "scheduledPickupDate",
                    "ScheduledPickupDate"
                ) ?? "",
                getField(
                    pickup,
                    "pickupAddress",
                    "PickupAddress",
                    "pickupLocation",
                    "PickupLocation",
                    "address",
                    "Address"
                ) ?? "",
                getField(
                    pickup,
                    "itemName",
                    "ItemName",
                    "productName",
                    "ProductName",
                    "returnItemName",
                    "ReturnItemName"
                ) ?? "",
                getField(
                    pickup,
                    "sku",
                    "SKU",
                    "productSku",
                    "ProductSku"
                ) ?? "",
                getField(
                    pickup,
                    "quantity",
                    "Quantity",
                    "returnQuantity",
                    "ReturnQuantity"
                ) ?? "",
                getField(
                    pickup,
                    "carrierName",
                    "CarrierName",
                    "carrier",
                    "Carrier"
                ) ?? "",
                getField(
                    pickup,
                    "trackingNumber",
                    "TrackingNumber",
                    "returnTrackingNumber",
                    "ReturnTrackingNumber"
                ) ?? "",
                getField(
                    pickup,
                    "pickupCost",
                    "PickupCost",
                    "returnShippingCost",
                    "ReturnShippingCost",
                    "shippingCost",
                    "ShippingCost"
                ) ?? "",
                getPickupStatus(pickup),
                getField(pickup, "notes", "Notes", "remarks", "Remarks") ?? ""
            ]);

            const csv = [
                headers.map(escapeCsv).join(","),
                ...rows.map((row) => row.map(escapeCsv).join(","))
            ].join("\r\n");

            const blob = new Blob(
                ["\uFEFF", csv],
                { type: "text/csv;charset=utf-8;" }
            );

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = `reverse-pickups-${new Date()
                .toISOString()
                .slice(0, 10)}.csv`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);

            notify("Reverse pickups exported successfully.");
        } catch (err) {
            console.error("EXPORT REVERSE PICKUPS ERROR:", err);

            notify("Failed to export reverse pickups.", "error");
        } finally {
            setExporting(false);
        }
    };

    /* =====================================================
       OPEN VIEW
    ===================================================== */

    const handleView = (pickup) => {
        setSelectedReversePickup(pickup);
        setViewOpen(true);
    };

    /* =====================================================
       CLOSE FORM
    ===================================================== */

    const handleCloseForm = () => {
        if (saving) return;

        setFormOpen(false);
        setFormErrors({});
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ width: "100%", p: { xs: 1, sm: 2, md: 3 } }}>
            {/* TOOLBAR */}

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

            {/* STATISTICS */}

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
                sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2
                }}
            >
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", md: "center" }}
                    spacing={2}
                    sx={{ mb: showFilters ? 2 : 0 }}
                >
                    <Typography variant="h6" fontWeight={700}>
                        Reverse Pickup Records
                    </Typography>

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
                            disabled={loading}
                        >
                            Create
                        </Button>
                    </Stack>
                </Stack>

                {showFilters && (
                    <>
                        <Divider sx={{ mb: 2 }} />

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
                                    <MenuItem value="pickupNumber">
                                        Pickup Number
                                    </MenuItem>
                                    <MenuItem value="orderNumber">
                                        Order Number
                                    </MenuItem>
                                    <MenuItem value="customerName">
                                        Customer Name
                                    </MenuItem>
                                    <MenuItem value="itemName">
                                        Return Item
                                    </MenuItem>
                                    <MenuItem value="carrierName">
                                        Carrier
                                    </MenuItem>
                                    <MenuItem value="trackingNumber">
                                        Tracking Number
                                    </MenuItem>
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
                                    <MenuItem value="in progress">
                                        In Progress
                                    </MenuItem>
                                    <MenuItem value="completed">
                                        Completed
                                    </MenuItem>
                                    <MenuItem value="cancelled">
                                        Cancelled
                                    </MenuItem>
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

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {filteredReversePickups.length} result(s)
                                    </Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Paper>

            {/* ERROR MESSAGE */}

            {error && reversePickups.length > 0 && (
                <Alert
                    severity="warning"
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

            {/* REVERSE PICKUP TABLE */}

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
                        onPageChange={(_, newPage) => setPage(newPage)}
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
                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{ mb: 2 }}
                        >
                            Pickup Information
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Pickup Number"
                                    name="reversePickupNumber"
                                    value={formData.reversePickupNumber}
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
                                    label="Order Number"
                                    name="orderNumber"
                                    value={formData.orderNumber}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                    error={Boolean(formErrors.orderNumber)}
                                    helperText={formErrors.orderNumber}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Customer Name"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                    error={Boolean(formErrors.customerName)}
                                    helperText={formErrors.customerName}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="email"
                                    label="Customer Email"
                                    name="customerEmail"
                                    value={formData.customerEmail}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="date"
                                    label="Pickup Date"
                                    name="pickupDate"
                                    value={formData.pickupDate}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                    error={Boolean(formErrors.pickupDate)}
                                    helperText={formErrors.pickupDate}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Pickup Address"
                                    name="pickupAddress"
                                    value={formData.pickupAddress}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                    error={Boolean(formErrors.pickupAddress)}
                                    helperText={formErrors.pickupAddress}
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{ mb: 2 }}
                        >
                            Return Item Details
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Return Item Name"
                                    name="itemName"
                                    value={formData.itemName}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                    error={Boolean(formErrors.itemName)}
                                    helperText={formErrors.itemName}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="SKU / Product Code"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Quantity"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                    error={Boolean(formErrors.quantity)}
                                    helperText={formErrors.quantity}
                                    inputProps={{ min: 1, step: 1 }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Pickup Cost (₹)"
                                    name="pickupCost"
                                    type="number"
                                    value={formData.pickupCost}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                    error={Boolean(formErrors.pickupCost)}
                                    helperText={formErrors.pickupCost}
                                    inputProps={{ min: 0, step: "0.01" }}
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{ mb: 2 }}
                        >
                            Carrier and Status
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Carrier Name"
                                    name="carrierName"
                                    value={formData.carrierName}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Tracking Number"
                                    name="trackingNumber"
                                    value={formData.trackingNumber}
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
                                    name="status"
                                    value={formData.status}
                                    onChange={handleFormChange}
                                    disabled={saving}
                                    error={Boolean(formErrors.status)}
                                    helperText={formErrors.status}
                                >
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="Scheduled">Scheduled</MenuItem>
                                    <MenuItem value="In Progress">
                                        In Progress
                                    </MenuItem>
                                    <MenuItem value="Completed">
                                        Completed
                                    </MenuItem>
                                    <MenuItem value="Cancelled">
                                        Cancelled
                                    </MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    label="Notes"
                                    name="notes"
                                    value={formData.notes}
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
                    if (!deleting) setDeleteOpen(false);
                }}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Warning color="error" />

                        <Typography variant="h6" fontWeight={700}>
                            Delete Reverse Pickup
                        </Typography>
                    </Stack>
                </DialogTitle>

                <DialogContent>
                    <Typography variant="body1">
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

